# Simple and Searched CASE

## Problem Description

The CASE expression provides conditional value selection in SQL, allowing you to return different values based on specified conditions. Unlike control-flow statements in programming languages, CASE is an expression that returns a single value, making it usable anywhere a value is expected (SELECT, WHERE, ORDER BY, HAVING, and aggregate functions).

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n × m) - n rows, m conditions evaluated per row |
| Space Complexity | O(1) - single value returned per row |
| Input | Column values or expressions, conditions to evaluate |
| Output | Single value based on first matching condition |
| Approach | Sequential evaluation → First match → Return result |

### When to Use

- **Conditional values**: Transforming values based on conditions (e.g., `CASE WHEN score >= 90 THEN 'A' ELSE 'F' END`)
- **Categorization**: Grouping data into buckets or categories dynamically
- **Pivoting**: Converting rows to columns using conditional aggregation
- **Conditional aggregation**: Counting or summing only rows that meet specific criteria
- **Sorting with custom logic**: Ordering by computed values rather than raw data
- **Handling NULLs selectively**: Different defaults based on conditions
- **Flagging records**: Creating indicator columns (0/1 or Yes/No) based on business rules

## Intuition

The key insight is **expression-based conditional logic**. Unlike IF statements in procedural code, CASE is a functional expression that returns a value, making it composable within any SQL clause.

The "aha!" moments:

1. **Expression, not statement**: CASE returns a value usable in SELECT, WHERE, ORDER BY, even inside aggregate functions
2. **Evaluated in order**: Conditions are checked sequentially; the first match wins, subsequent conditions are skipped
3. **ELSE default**: If no conditions match and no ELSE is specified, NULL is returned (not an error)
4. **Anywhere a value goes**: Since it's an expression, CASE works in SELECT lists, WHERE clauses, JOIN conditions, and aggregate functions
5. **Short-circuit evaluation**: Once a condition matches, remaining conditions are not evaluated for that row

## Solution Approaches

### Approach 1: Simple CASE - Equality Comparisons ✅ Recommended

The simple CASE expression compares an input expression to a set of values for equality matching.

#### Algorithm

1. Specify the expression to evaluate (input value)
2. List WHEN clauses with values to compare against
3. Provide THEN results for each match
4. Add optional ELSE for default value
5. Terminate with END keyword

#### Implementation

**Problem: Tree Node (SQL-608)**

```sql
-- Classify tree nodes based on their position in the hierarchy
SELECT 
    id,
    CASE p_id
        WHEN NULL THEN 'Root'
        WHEN 0 THEN 'Root'
        ELSE 'Inner'
    END AS node_type
FROM tree;
```

**Basic Simple CASE:**

```sql
-- Categorize products by status code
SELECT 
    product_name,
    CASE status_code
        WHEN 'A' THEN 'Active'
        WHEN 'I' THEN 'Inactive'
        WHEN 'D' THEN 'Discontinued'
        ELSE 'Unknown'
    END AS status_description
FROM Products;
```

**Problem: Swap Salary (SQL-626)**

```sql
-- Swap gender values using simple CASE
UPDATE Salary
SET sex = CASE sex
    WHEN 'm' THEN 'f'
    WHEN 'f' THEN 'm'
    ELSE sex
END;
```

**Grade Classification:**

```sql
-- Classify grades based on score ranges using simple CASE pattern
SELECT 
    student_name,
    score,
    CASE 
        WHEN score >= 90 THEN 'A'
        WHEN score >= 80 THEN 'B'
        WHEN score >= 70 THEN 'C'
        WHEN score >= 60 THEN 'D'
        ELSE 'F'
    END AS grade
FROM Students;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × m) - n rows, m equality comparisons |
| Space | O(1) - single value per row |

### Approach 2: Searched CASE - Boolean Expressions

The searched CASE expression evaluates boolean conditions for maximum flexibility, supporting ranges, multiple columns, and complex logic.

#### Algorithm

1. Omit the input expression (searched form)
2. List WHEN clauses with boolean expressions
3. Provide THEN results for each matching condition
4. Add ELSE for default (or accept NULL)
5. Terminate with END keyword

#### Implementation

**Problem: Tree Node (SQL-608) - Correct Implementation**

```sql
-- Classify tree nodes as Root, Inner, or Leaf based on p_id
SELECT 
    id,
    CASE 
        WHEN p_id IS NULL THEN 'Root'
        WHEN id IN (SELECT p_id FROM tree WHERE p_id IS NOT NULL) THEN 'Inner'
        ELSE 'Leaf'
    END AS node_type
FROM tree;
```

**Problem: Market Analysis I (SQL-1398)**

```sql
-- Determine if each user is a seller with items in specific brands
SELECT 
    u.user_id AS seller_id,
    CASE 
        WHEN item_id IS NULL THEN 'no'
        WHEN favorite_brand = item_brand THEN 'yes'
        ELSE 'no'
    END AS item_favorite
FROM Users u
LEFT JOIN (
    SELECT seller_id, item_id, i.item_brand
    FROM Orders o
    JOIN Items i ON o.item_id = i.item_id
    WHERE o.order_date = (
        SELECT MIN(order_date) 
        FROM Orders 
        WHERE seller_id = o.seller_id
    )
) first_order ON u.user_id = first_order.seller_id
LEFT JOIN Items i ON first_order.item_id = i.item_id;
```

**Range-Based Classification:**

```sql
-- Categorize customers by spending tier
SELECT 
    customer_name,
    total_spent,
    CASE 
        WHEN total_spent >= 10000 THEN 'Platinum'
        WHEN total_spent >= 5000 THEN 'Gold'
        WHEN total_spent >= 1000 THEN 'Silver'
        ELSE 'Bronze'
    END AS tier
FROM Customers;
```

**Multi-Column Logic:**

```sql
-- Classify orders by priority and region
SELECT 
    order_id,
    priority,
    region,
    CASE 
        WHEN priority = 'High' AND region = 'North America' THEN 'Critical'
        WHEN priority = 'High' THEN 'High Priority'
        WHEN priority = 'Medium' AND region IN ('EU', 'APAC') THEN 'Medium+'
        WHEN priority = 'Low' THEN 'Standard'
        ELSE 'Normal'
    END AS processing_class
FROM Orders;
```

**Conditional Filtering:**

```sql
-- Filter with CASE in WHERE clause
SELECT * FROM Products
WHERE CASE 
    WHEN category = 'Electronics' THEN price < 500
    WHEN category = 'Clothing' THEN price < 100
    ELSE price < 50
END;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × m) - n rows, m boolean evaluations |
| Space | O(1) - single value per row |

### Approach 3: CASE in Aggregation - Conditional Counting/Summing

Using CASE inside aggregate functions enables conditional aggregation - counting or summing only rows that meet specific criteria.

#### Algorithm

1. Choose aggregation function (SUM, COUNT, AVG, etc.)
2. Inside the function, use CASE to filter or transform values
3. Return 1 for counting matches, value for summing, or NULL to exclude
4. Group results as needed

#### Implementation

**Problem: Trips and Users (SQL-262) - Cancellation Rate Calculation**

```sql
-- Calculate cancellation rate using conditional aggregation
SELECT 
    t.request_at AS Day,
    ROUND(
        SUM(CASE WHEN t.status != 'completed' THEN 1 ELSE 0 END) * 1.0 / COUNT(*),
        2
    ) AS CancellationRate
FROM Trips t
INNER JOIN Users u ON t.client_id = u.users_id
WHERE u.banned = 'No'
GROUP BY t.request_at;
```

**Conditional Counting:**

```sql
-- Count orders by status in a single query
SELECT 
    customer_id,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed_orders,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending_orders,
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) AS cancelled_orders
FROM Orders
GROUP BY customer_id;
```

**Problem: Calculate Special Bonus (SQL-1873)**

```sql
-- Calculate bonus conditionally based on employee_id and name
SELECT 
    employee_id,
    CASE 
        WHEN employee_id % 2 = 1 AND name NOT LIKE 'M%' THEN salary
        ELSE 0
    END AS bonus
FROM Employees
ORDER BY employee_id;
```

**Conditional Summing:**

```sql
-- Sum revenue by category in a single row per customer
SELECT 
    customer_id,
    SUM(CASE WHEN product_category = 'Electronics' THEN amount ELSE 0 END) AS electronics_revenue,
    SUM(CASE WHEN product_category = 'Clothing' THEN amount ELSE 0 END) AS clothing_revenue,
    SUM(CASE WHEN product_category = 'Food' THEN amount ELSE 0 END) AS food_revenue
FROM Orders
GROUP BY customer_id;
```

**Conditional Average:**

```sql
-- Average excluding zeros or NULLs conditionally
SELECT 
    department,
    AVG(CASE WHEN sales > 0 THEN sales END) AS avg_positive_sales,
    AVG(CASE WHEN rating IS NOT NULL THEN rating END) AS avg_rating
FROM Performance
GROUP BY department;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × m) - aggregation overhead included |
| Space | O(g) - where g is number of groups |

### Approach 4: CASE for Pivoting - Rows to Columns

CASE expressions enable pivoting data from row-based to column-based format, a common reporting requirement.

#### Algorithm

1. Identify the column to pivot (categories)
2. Create separate CASE expressions for each target column
3. Filter each CASE to match one category value
4. Aggregate to collapse multiple rows into single values
5. Group by the non-pivoted dimensions

#### Implementation

**Problem: Market Analysis I (SQL-1398) - Pivot Concept**

```sql
-- Create pivot-like analysis of seller behavior
SELECT 
    seller_id,
    MAX(CASE WHEN is_favorite = 'yes' THEN 1 ELSE 0 END) AS has_favorite_item,
    MAX(CASE WHEN order_count > 0 THEN 1 ELSE 0 END) AS is_active_seller
FROM (
    SELECT u.user_id AS seller_id,
        CASE 
            WHEN favorite_brand = item_brand THEN 'yes'
            ELSE 'no'
        END AS is_favorite,
        COUNT(o.order_id) AS order_count
    FROM Users u
    LEFT JOIN Orders o ON u.user_id = o.seller_id
    LEFT JOIN Items i ON o.item_id = i.item_id
    GROUP BY u.user_id, favorite_brand, item_brand
) subquery
GROUP BY seller_id;
```

**Quarterly Sales Pivot:**

```sql
-- Pivot monthly sales into quarters
SELECT 
    product_id,
    SUM(CASE WHEN MONTH(sale_date) IN (1,2,3) THEN amount ELSE 0 END) AS Q1_sales,
    SUM(CASE WHEN MONTH(sale_date) IN (4,5,6) THEN amount ELSE 0 END) AS Q2_sales,
    SUM(CASE WHEN MONTH(sale_date) IN (7,8,9) THEN amount ELSE 0 END) AS Q3_sales,
    SUM(CASE WHEN MONTH(sale_date) IN (10,11,12) THEN amount ELSE 0 END) AS Q4_sales,
    SUM(amount) AS total_sales
FROM Sales
GROUP BY product_id;
```

**Status Pivot:**

```sql
-- Convert status rows into columns
SELECT 
    date,
    MAX(CASE WHEN status = 'active' THEN count END) AS active_count,
    MAX(CASE WHEN status = 'inactive' THEN count END) AS inactive_count,
    MAX(CASE WHEN status = 'pending' THEN count END) AS pending_count
FROM (
    SELECT date, status, COUNT(*) AS count
    FROM UserStatus
    GROUP BY date, status
) subquery
GROUP BY date;
```

**Dynamic Pivot Pattern:**

```sql
-- Pivot with conditional values
SELECT 
    region,
    SUM(CASE WHEN product_line = 'Premium' THEN revenue END) AS premium_revenue,
    SUM(CASE WHEN product_line = 'Standard' THEN revenue END) AS standard_revenue,
    SUM(CASE WHEN product_line = 'Economy' THEN revenue END) AS economy_revenue
FROM RegionalSales
GROUP BY region;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × k) - n rows, k pivot columns |
| Space | O(g × k) - g groups, k pivoted columns |

## Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| Simple CASE | O(n × m) | O(1) | **Recommended** - equality matching, code clarity |
| Searched CASE | O(n × m) | O(1) | Range conditions, complex logic, multi-column |
| CASE in Aggregation | O(n × m) | O(g) | Conditional counting, pivot tables, reporting |
| CASE for Pivoting | O(n × k) | O(g × k) | Row-to-column transformation, dashboards |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Tree Node](/problems/sql-608) | 608 | Medium | Classify tree nodes as Root/Inner/Leaf |
| [Swap Salary](/problems/sql-626) | 626 | Easy | Swap gender values using CASE |
| [Market Analysis I](/problems/sql-1398) | 1398 | Easy | Determine favorite brand matches |
| [Calculate Special Bonus](/problems/sql-1873) | 1873 | Easy | Conditional bonus calculation |
| Trips and Users | 262 | Hard | Cancellation rate with conditional counting |
| Department Highest Salary | 184 | Medium | Ranking with conditional logic |

## Key Takeaways

- **Simple CASE** compares one expression to multiple values (equality only)
- **Searched CASE** evaluates boolean expressions (more flexible, supports ranges)
- **Sequential evaluation** - first matching WHEN is used, rest are skipped
- **ELSE is optional** - returns NULL if no match and no ELSE specified
- **Works anywhere** - SELECT, WHERE, ORDER BY, JOIN, aggregate functions
- **Conditional aggregation** - use `SUM(CASE WHEN ... THEN 1 ELSE 0 END)` for counting
- **Pivot technique** - multiple CASE expressions with different conditions + GROUP BY

## Common Pitfalls

1. **Using `= NULL` in Simple CASE** - NULL comparisons need IS NULL in Searched CASE
2. **Forgetting END keyword** - CASE expressions must always terminate with END
3. **Assuming ELSE is required** - No ELSE means NULL default, which may cause unexpected results
4. **Data type mismatches** - All THEN/ELSE results must be compatible types
5. **Order of conditions matters** - More specific conditions should come before general ones
6. **Nesting too deeply** - Deeply nested CASE expressions become unreadable; consider alternatives
7. **Performance with many conditions** - Each row evaluates conditions until first match; put common cases first

## CASE Expression Syntax Reference

| Form | Syntax | Use Case |
|------|--------|----------|
| Simple CASE | `CASE expr WHEN val1 THEN res1 ... END` | Equality comparisons |
| Searched CASE | `CASE WHEN bool1 THEN res1 ... END` | Boolean expressions, ranges |
| With ELSE | `CASE ... ELSE default END` | Default value specification |
| In Aggregate | `SUM(CASE WHEN ... THEN val END)` | Conditional aggregation |
| Pivot Pattern | Multiple CASE columns + GROUP BY | Row-to-column transformation |

## Pattern Source

[Simple and Searched CASE](sql/simple-and-searched-case.md)
