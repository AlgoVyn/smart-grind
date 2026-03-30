# Basic SELECT with WHERE

## Problem Description

The Basic SELECT with WHERE pattern retrieves specific columns from a database table based on filtering conditions. This is the foundation of SQL querying, allowing you to extract exactly the data you need from large datasets by declaring conditions that rows must satisfy.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n) - scans all rows without index, O(log n) with B-tree index |
| Space Complexity | O(m) - m rows returned in result set |
| Input | Table name, column list, WHERE conditions |
| Output | Filtered rows matching specified conditions |
| Approach | Scan → Filter → Project columns |

### When to Use

- Filtering rows based on equality conditions (e.g., `status = 'active'`)
- Range-based filtering with dates, numbers, or ranges (e.g., `age BETWEEN 18 AND 65`)
- Pattern matching for string searches (e.g., `email LIKE '%@gmail.com'`)
- Filtering NULL or non-NULL values (e.g., `deleted_at IS NULL`)
- Combining multiple conditions with AND/OR logic
- Simple row-level data retrieval before aggregation or joining

## Intuition

The key insight is **declarative filtering**. Instead of procedurally scanning data, you declare what conditions rows must satisfy, and the database engine optimizes the retrieval path.

The "aha!" moments:

1. **Declarative nature**: Specify *what* you want, not *how* to get it - the query optimizer decides the execution plan
2. **NULL handling**: NULL represents unknown, so `= NULL` always returns UNKNOWN - use `IS NULL` instead
3. **String matching**: `LIKE` with `%` (any sequence) and `_` (single character) enables flexible pattern searches
4. **Index leverage**: Equality filters on indexed columns can achieve O(log n) performance instead of O(n)
5. **Sargability**: Avoid wrapping indexed columns in functions (e.g., `WHERE UPPER(name) = 'JOHN'`) to preserve index usage

## Solution Approaches

### Approach 1: Equality Filter ✅ Recommended

Basic WHERE clause with equality conditions for exact matching.

#### Algorithm

1. Specify the columns to retrieve in the SELECT clause
2. Identify the target table in the FROM clause
3. Add WHERE clause with equality condition (`column = value`)
4. Optional: Add ORDER BY for sorted results
5. Optional: Combine multiple equality conditions with AND/OR

#### Implementation

**Problem: Combine Two Tables (SQL-175)**

```sql
-- Retrieve person information with their address details
SELECT 
    p.firstName,
    p.lastName,
    a.city,
    a.state
FROM Person p
LEFT JOIN Address a ON p.personId = a.personId
WHERE p.personId = 1;
```

**Problem: Find Customers With Positive Revenue (SQL-182)**

```sql
-- Find customers who had at least one positive transaction
SELECT DISTINCT customer_id, customer_name
FROM Customers
WHERE revenue > 0;
```

**Problem: Employees Earning More Than Their Managers (SQL-181)**

```sql
-- Find employees earning more than their managers
SELECT e.name AS Employee
FROM Employee e
INNER JOIN Employee m ON e.managerId = m.id
WHERE e.salary > m.salary;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) without index, O(log n) with B-tree index |
| Space | O(m) - rows matching the condition |

### Approach 2: Range Filtering

Use BETWEEN, comparison operators, and range conditions for flexible filtering.

#### Algorithm

1. Select columns to retrieve
2. Specify the target table
3. Add WHERE clause with comparison operators (`>`, `<`, `>=`, `<=`)
4. Use BETWEEN for inclusive range filtering
5. Combine ranges with AND for bounded ranges

#### Implementation

**Range with Comparison Operators:**

```sql
-- Find employees with salary above a threshold
SELECT name, salary
FROM Employee
WHERE salary > 50000;

-- Find records within a date range (exclusive)
SELECT order_id, order_date
FROM Orders
WHERE order_date >= '2024-01-01'
  AND order_date < '2024-02-01';
```

**Range with BETWEEN:**

```sql
-- Find employees with salary in specific range (inclusive)
SELECT name, salary
FROM Employee
WHERE salary BETWEEN 50000 AND 100000;

-- Find orders placed in a specific year
SELECT order_id, order_date, total_amount
FROM Orders
WHERE order_date BETWEEN '2024-01-01' AND '2024-12-31';
```

**Problem: Count of Matches (SQL-183)**

```sql
-- Find customers who never order anything (anti-join pattern)
SELECT c.name AS Customers
FROM Customers c
LEFT JOIN Orders o ON c.id = o.customerId
WHERE o.customerId IS NULL;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - may require full scan for ranges |
| Space | O(m) - rows within the specified range |

### Approach 3: Pattern Matching

Use LIKE with wildcards for flexible string matching and searches.

#### Algorithm

1. Identify the string column to search
2. Construct pattern with wildcards (`%` for any sequence, `_` for single char)
3. Add WHERE clause with LIKE operator
4. Use NOT LIKE for exclusion patterns
5. Consider case sensitivity based on collation

#### Implementation

**Prefix Matching:**

```sql
-- Find customers whose names start with 'A'
SELECT name
FROM Customers
WHERE name LIKE 'A%';

-- Find employees in Engineering department
SELECT name, department
FROM Employees
WHERE department LIKE 'Engineering%';
```

**Suffix Matching:**

```sql
-- Find email addresses from a specific domain
SELECT email
FROM Users
WHERE email LIKE '%@company.com';

-- Find products with specific file extension
SELECT filename
FROM Documents
WHERE filename LIKE '%.pdf';
```

**Contains Matching:**

```sql
-- Find products with specific keyword anywhere in name
SELECT product_name
FROM Products
WHERE product_name LIKE '%phone%';

-- Find descriptions containing specific phrase
SELECT title, description
FROM Articles
WHERE description LIKE '%machine learning%';
```

**Single Character Wildcard:**

```sql
-- Find names with specific pattern (e.g., J_n for Jon, Jan, Jen)
SELECT name
FROM Users
WHERE name LIKE 'J_n';

-- Find phone numbers with specific format
SELECT phone_number
FROM Contacts
WHERE phone_number LIKE '___-___-____';
```

**NOT LIKE for Exclusion:**

```sql
-- Find customers without Gmail addresses
SELECT name, email
FROM Customers
WHERE email NOT LIKE '%@gmail.com';
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × k) - k is pattern length, full scan usually required |
| Space | O(m) - rows matching the pattern |

### Approach 4: NULL Handling

Properly filter for NULL and non-NULL values using IS NULL and IS NOT NULL.

#### Algorithm

1. Identify columns that may contain NULL values
2. Use IS NULL to find rows with missing values
3. Use IS NOT NULL to find rows with present values
4. Combine with other conditions using AND/OR
5. Remember: NULL comparisons with `=` always return UNKNOWN

#### Implementation

**Finding NULL Values:**

```sql
-- Find customers without email addresses
SELECT customer_id, name
FROM Customers
WHERE email IS NULL;

-- Find incomplete orders (missing ship date)
SELECT order_id, order_date
FROM Orders
WHERE shipped_date IS NULL;
```

**Finding Non-NULL Values:**

```sql
-- Find customers with verified email addresses
SELECT customer_id, name, email
FROM Customers
WHERE email IS NOT NULL;

-- Find completed orders
SELECT order_id, order_date, shipped_date
FROM Orders
WHERE shipped_date IS NOT NULL;
```

**Problem: Count of Matches (SQL-183) - Anti-join Pattern**

```sql
-- Find customers who never placed an order
-- (LEFT JOIN produces NULL for non-matching rows)
SELECT c.name AS Customers
FROM Customers c
LEFT JOIN Orders o ON c.id = o.customerId
WHERE o.customerId IS NULL;
```

**Combining NULL Checks with Other Conditions:**

```sql
-- Find active customers with missing phone numbers
SELECT customer_id, name
FROM Customers
WHERE status = 'active'
  AND phone_number IS NULL;

-- Find completed orders with tracking info
SELECT order_id, tracking_number
FROM Orders
WHERE status = 'completed'
  AND tracking_number IS NOT NULL;
```

**COALESCE for NULL Replacement:**

```sql
-- Replace NULL with default value in results
SELECT name, COALESCE(phone, 'No phone') AS contact
FROM Customers;

-- Use alternative column if first is NULL
SELECT name, COALESCE(mobile_phone, home_phone, work_phone) AS primary_phone
FROM Contacts;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - NULL checks can use indexes if available |
| Space | O(m) - rows with NULL or non-NULL values |

## Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| Equality Filter | O(n) / O(log n) | O(m) | **Recommended** - exact matching, indexed columns |
| Range Filtering | O(n) | O(m) | Date ranges, numeric intervals |
| Pattern Matching | O(n × k) | O(m) | String searches, wildcards |
| NULL Handling | O(n) | O(m) | Missing data detection, data quality |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Combine Two Tables](/problems/sql-175) | 175 | Easy | LEFT JOIN with equality filtering |
| [Employees Earning More Than Managers](/problems/sql-181) | 181 | Easy | Self-join with comparison operators |
| [Find Customers With Positive Revenue](/problems/sql-182) | 182 | Easy | WHERE with comparison condition |
| [Count of Matches](/problems/sql-183) | 183 | Easy | Anti-join with IS NULL pattern |

## Key Takeaways

- **Equality filters** on indexed columns achieve O(log n) performance
- **Always use IS NULL / IS NOT NULL** - never use `= NULL` or `!= NULL`
- **LIKE patterns**: `%` matches any sequence, `_` matches single character
- **BETWEEN is inclusive** - includes both boundary values
- **Sargable queries** - avoid functions on indexed columns in WHERE clauses
- **Query planning** - use `EXPLAIN` to verify index usage and execution plan

## Common Pitfalls

1. **Using `= NULL` instead of `IS NULL`** - always returns UNKNOWN, filtering out all rows
2. **Case sensitivity with LIKE** - depends on database collation; use `ILIKE` in PostgreSQL or `LOWER()` for case-insensitive matching
3. **Leading wildcards (`%text`)** - prevent index usage, requiring full table scans
4. **BETWEEN boundary confusion** - remember it's inclusive of both endpoints
5. **Implicit type conversion** - comparing different data types can cause unexpected results and prevent index usage
6. **NOT IN with NULL** - `WHERE x NOT IN (NULL, 1, 2)` returns no rows due to three-valued logic

## Pattern Source

[Basic SELECT with WHERE](sql/basic-select-with-where.md)
