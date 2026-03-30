# NULL Value Management (COALESCE and NULL Handling)

## Problem Description

The NULL Value Management pattern provides techniques to handle missing or undefined data gracefully in SQL queries. NULL represents the absence of a value, and proper handling is essential for accurate calculations, meaningful output, and preventing query failures.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n) - linear scan with NULL checks |
| Space Complexity | O(1) - in-place evaluation |
| Input | Columns potentially containing NULL values |
| Output | Non-NULL values, default replacements, or filtered results |
| Approach | Replacement, conditional logic, or filtering |

### When to Use

- **Default values**: Provide fallback values when data is missing (e.g., display "N/A" for missing names)
- **NULL checks**: Filter or identify rows with missing critical data
- **Data cleanup**: Transform NULL values to meaningful defaults during reporting
- **Calculation safety**: Prevent NULL from propagating through arithmetic operations
- **Join handling**: Manage unmatched rows from outer joins that produce NULLs
- **Aggregation preparation**: Ensure NULLs don't silently skew aggregate results

## Intuition

The key insight is **NULL propagation prevention**. NULL values propagate through expressions—any operation involving NULL typically returns NULL. The pattern provides tools to intercept and replace NULLs before they contaminate results.

The "aha!" moments:

1. **COALESCE shortcut**: `COALESCE(a, b, c)` is a compact form of `CASE WHEN a IS NOT NULL THEN a WHEN b IS NOT NULL THEN b ELSE c END`
2. **ISNULL/IFNULL variants**: Different databases use different function names (SQL Server: ISNULL, MySQL/PostgreSQL: IFNULL, All: COALESCE)
3. **NULL in aggregates**: `AVG()` ignores NULLs but `COUNT(*)` doesn't—understanding this prevents calculation errors
4. **Three-valued logic**: `NULL = NULL` is UNKNOWN, not TRUE—explains why `WHERE x = NULL` fails
5. **Outer join NULLs**: LEFT JOIN produces NULLs for unmatched right-table columns—handle with COALESCE

## Solution Approaches

### Approach 1: COALESCE - First non-NULL Value ✅ Recommended

COALESCE evaluates arguments left-to-right and returns the first non-NULL value. It's the most versatile NULL-handling function.

#### Algorithm

1. Identify columns that may contain NULL values
2. Determine appropriate fallback values
3. Apply COALESCE(col1, col2, ..., default)
4. Chain multiple fallbacks for hierarchical defaults

#### Implementation

**Basic COALESCE:**

```sql
-- Provide default for NULL commission
SELECT 
    employee_id,
    name,
    COALESCE(commission_pct, 0) AS commission_pct
FROM Employees;
```

**Multiple Fallbacks:**

```sql
-- Hierarchical default: cell > home > work > email
SELECT 
    contact_id,
    COALESCE(cell_phone, home_phone, work_phone, email, 'No contact') AS primary_contact
FROM Contacts;
```

**Problem: Calculate Special Bonus (SQL-175)**

```sql
-- Combine two bonus columns, using 0 if either is NULL
SELECT 
    employee_id,
    COALESCE(salary, 0) + COALESCE(bonus, 0) AS total_compensation
FROM Employees;
```

**Problem: Second Highest Salary (SQL-585)**

```sql
-- Handle case where no second highest salary exists
SELECT 
    COALESCE(
        (SELECT DISTINCT salary 
         FROM Employee 
         ORDER BY salary DESC 
         LIMIT 1 OFFSET 1),
        NULL
    ) AS SecondHighestSalary;
```

**Problem: Employees With Missing Information (SQL-1098)**

```sql
-- Identify employees with missing data using NULL check
SELECT 
    employee_id,
    COALESCE(name, 'Unknown') AS name,
    COALESCE(salary, 0) AS salary
FROM Employees
WHERE name IS NULL OR salary IS NULL;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × m) - n rows, m arguments in COALESCE |
| Space | O(1) - in-place replacement |

### Approach 2: NULLIF - Conditional NULL

NULLIF returns NULL if two expressions are equal; otherwise returns the first expression. Useful for preventing division by zero or filtering specific values.

#### Algorithm

1. Identify values to convert to NULL
2. Use NULLIF(expression, value_to_nullify)
3. Combine with COALESCE for complete control
4. Common use: avoid division by zero

#### Implementation

**Prevent Division by Zero:**

```sql
-- Avoid division by zero by converting 0 to NULL
SELECT 
    department,
    total_sales / NULLIF(total_orders, 0) AS avg_order_value
FROM SalesSummary;
```

**Filter Specific Values:**

```sql
-- Treat 'N/A' strings as actual NULL
SELECT 
    product_id,
    COALESCE(NULLIF(description, 'N/A'), 'No description') AS description
FROM Products;
```

**Combine NULLIF with COALESCE:**

```sql
-- Safe division with default
SELECT 
    region,
    COALESCE(total_revenue / NULLIF(total_units, 0), 0) AS price_per_unit
FROM Sales;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - single comparison per row |
| Space | O(1) |

### Approach 3: IS NULL / IS NOT NULL - NULL Checking

Direct NULL testing is the foundation of NULL handling. Remember: `= NULL` never works due to three-valued logic.

#### Algorithm

1. Use `IS NULL` to find missing values
2. Use `IS NOT NULL` to find present values
3. Combine with AND/OR for complex conditions
4. Never use `= NULL` or `!= NULL`

#### Implementation

**Filter NULL Values:**

```sql
-- Find records with missing email
SELECT * FROM Customers
WHERE email IS NULL;
```

**Filter Non-NULL Values:**

```sql
-- Only process records with complete data
SELECT * FROM Orders
WHERE ship_date IS NOT NULL AND tracking_number IS NOT NULL;
```

**Problem: Employees With Missing Information (SQL-1098)**

```sql
-- Find employees missing either name or salary
SELECT employee_id
FROM Employees
WHERE name IS NULL OR salary IS NULL;
```

**CASE with NULL Checks:**

```sql
-- Categorize data completeness
SELECT 
    customer_id,
    CASE 
        WHEN phone IS NULL AND email IS NULL THEN 'No contact info'
        WHEN phone IS NULL THEN 'Email only'
        WHEN email IS NULL THEN 'Phone only'
        ELSE 'Complete'
    END AS contact_status
FROM Customers;
```

**COUNT Non-NULL Values:**

```sql
-- COUNT only non-NULL values (unlike COUNT(*))
SELECT 
    COUNT(*) AS total_orders,
    COUNT(ship_date) AS shipped_orders,
    COUNT(*) - COUNT(ship_date) AS pending_orders
FROM Orders;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) |
| Space | O(1) |

### Approach 4: NULL Handling in Joins - Outer Join NULLs

Outer joins (LEFT, RIGHT, FULL) produce NULLs for unmatched rows. COALESCE is essential for meaningful output.

#### Algorithm

1. Perform LEFT/RIGHT/FULL JOIN
2. Identify columns that may contain NULLs from unmatched rows
3. Apply COALESCE to replace join-induced NULLs
4. Use IS NULL to identify unmatched rows

#### Implementation

**LEFT JOIN with Defaults:**

```sql
-- Show all customers with order count (0 if no orders)
SELECT 
    c.customer_id,
    c.name,
    COALESCE(COUNT(o.order_id), 0) AS order_count
FROM Customers c
LEFT JOIN Orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.name;
```

**Identify Unmatched Rows:**

```sql
-- Find customers who never ordered (anti-join)
SELECT c.customer_id, c.name
FROM Customers c
LEFT JOIN Orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;
```

**FULL JOIN with Coalescing:**

```sql
-- Combine two tables with prioritized values
SELECT 
    COALESCE(a.id, b.id) AS id,
    COALESCE(a.name, b.name) AS name,
    COALESCE(a.value, b.value, 0) AS value
FROM TableA a
FULL JOIN TableB b ON a.id = b.id;
```

**Problem: Calculate Special Bonus (SQL-175)**

```sql
-- Handle NULL from LEFT JOIN with default
SELECT 
    e.employee_id,
    COALESCE(b.bonus_amount, 0) AS bonus
FROM Employees e
LEFT JOIN Bonuses b ON e.employee_id = b.employee_id;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × m) - depends on join algorithm |
| Space | O(n + m) - result set size |

## Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| COALESCE | O(n × m) | O(1) | **Recommended** - General NULL replacement |
| NULLIF | O(n) | O(1) | Conditional NULL creation |
| IS NULL/IS NOT NULL | O(n) | O(1) | **Recommended** - Filtering NULL/non-NULL |
| Join NULL Handling | O(n × m) | O(n + m) | Outer join result processing |

## NULL Handling Function Comparison

| Function | Syntax | Database | Behavior |
|----------|--------|----------|----------|
| COALESCE | `COALESCE(a, b, c)` | Universal | First non-NULL |
| ISNULL | `ISNULL(a, b)` | SQL Server | Two-arg COALESCE |
| IFNULL | `IFNULL(a, b)` | MySQL, PostgreSQL | Two-arg COALESCE |
| NVL | `NVL(a, b)` | Oracle | Two-arg COALESCE |
| NULLIF | `NULLIF(a, b)` | Universal | NULL if equal |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| Calculate Special Bonus | 175 | Easy | COALESCE for missing bonus values |
| Nth Highest Salary | 585 | Medium | Handle NULL when N exceeds distinct values |
| Employees With Missing Information | 1098 | Easy | IS NULL for identifying missing data |

## Key Takeaways

- **COALESCE is universal**: Works across all SQL databases with multiple arguments
- **Three-valued logic**: `NULL = NULL` evaluates to UNKNOWN, not TRUE—use IS NULL instead
- **Propagation prevention**: NULLs spread through expressions; intercept early with COALESCE
- **Aggregate behavior**: AVG/COUNT(column) ignore NULLs; COUNT(*) counts all rows
- **Join defaults**: LEFT JOIN produces NULLs for unmatched rows—handle with COALESCE
- **Function aliases**: ISNULL (SQL Server), IFNULL (MySQL), NVL (Oracle) are database-specific

## Common Pitfalls

1. **Using `= NULL` instead of `IS NULL`**
   ```sql
   -- WRONG: Never returns rows (UNKNOWN is not TRUE)
   WHERE name = NULL
   
   -- RIGHT: Proper NULL check
   WHERE name IS NULL
   ```

2. **Assuming aggregates handle NULLs intuitively**
   ```sql
   -- WARNING: COUNT(*) counts rows, COUNT(col) counts non-NULL
   SELECT COUNT(*), COUNT(salary) FROM Employees;  -- May differ!
   
   -- WARNING: AVG ignores NULLs (may be desired or not)
   SELECT AVG(salary) FROM Employees WHERE dept IS NULL;  -- Skips NULL salaries
   ```

3. **NOT IN with NULL subquery results**
   ```sql
   -- DANGEROUS: Returns empty set if subquery has NULL
   WHERE id NOT IN (SELECT manager_id FROM Employees)
   
   -- SAFE: Filter NULLs or use NOT EXISTS
   WHERE id NOT IN (SELECT manager_id FROM Employees WHERE manager_id IS NOT NULL)
   ```

4. **Forgetting COALESCE in calculations**
   ```sql
   -- WRONG: NULL + anything = NULL
   SELECT salary + bonus AS total FROM Employees;
   
   -- RIGHT: Provide defaults for NULL columns
   SELECT COALESCE(salary, 0) + COALESCE(bonus, 0) AS total FROM Employees;
   ```

5. **COALESCE type incompatibility**
   ```sql
   -- ERROR: Arguments must be compatible types
   COALESCE(123, 'text')  -- May fail or require explicit cast
   
   -- FIX: Explicit conversion
   COALESCE(CAST(123 AS VARCHAR), 'text')
   ```

6. **Empty string vs NULL confusion**
   ```sql
   -- Caution: Empty string '' is not NULL
   WHERE name = ''  -- Finds empty strings
   WHERE name IS NULL  -- Finds true NULLs
   ```

## Pattern Source

[NULL Value Management](sql/null-value-management.md)
