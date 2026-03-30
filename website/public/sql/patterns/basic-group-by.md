# Basic GROUP BY

## Problem Description

The GROUP BY pattern organizes rows into summary groups based on one or more columns, allowing aggregate functions (COUNT, SUM, AVG, MAX, MIN) to be applied to each group. This is fundamental for data summarization and reporting queries.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n log n) - due to sorting for grouping, O(n) with hash aggregation |
| Space Complexity | O(g) - g distinct groups |
| Input | Table, grouping columns, aggregate functions |
| Output | One row per group with aggregated values |
| Approach | Group → Aggregate → Filter (HAVING) |

### When to Use

- Summarizing data by categories (sales by region, orders by month)
- Counting records per group (customers per city, products per category)
- Finding duplicates (records with same email, phone, etc.)
- Calculating statistics per group (average salary by department)
- Reporting and dashboard data preparation
- Detecting anomalies or outliers within groups

## Intuition

The key insight is **collapse and aggregate**. GROUP BY collapses multiple rows with the same grouping column values into a single summary row.

The "aha!" moments:

1. **Collapse rows**: All rows with identical grouping values become one output row
2. **Aggregate functions required**: Non-grouped columns must use aggregate functions
3. **Grouping columns appear as-is**: Columns in GROUP BY appear directly in SELECT
4. **HAVING vs WHERE**: WHERE filters rows before grouping, HAVING filters groups after aggregation
5. **Multiple columns**: GROUP BY a, b creates unique combinations of (a, b)

## Solution Approaches

### Approach 1: Simple GROUP BY - Single Column Grouping ✅ Recommended

#### Algorithm

1. Identify the column to group by
2. Include the grouping column in SELECT
3. Add GROUP BY clause with the column
4. Apply aggregate functions to other columns as needed

#### Implementation

**Problem: Duplicate Emails (SQL-182)**

```sql
-- Find all duplicate emails in the database
SELECT email
FROM Person
GROUP BY email
HAVING COUNT(*) > 1;
```

**Problem: Game Play Analysis I (SQL-511)**

```sql
-- Find first login date for each player
SELECT 
    player_id,
    MIN(event_date) AS first_login
FROM Activity
GROUP BY player_id;
```

**Problem: User Activity for the Past 30 Days I (SQL-585)**

```sql
-- Count active users per day
SELECT 
    activity_date AS day,
    COUNT(DISTINCT user_id) AS active_users
FROM Activity
WHERE activity_date BETWEEN DATE_SUB('2019-07-27', INTERVAL 29 DAY) AND '2019-07-27'
GROUP BY activity_date;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - sorting for grouping, O(n) with hash |
| Space | O(g) - number of distinct groups |

### Approach 2: GROUP BY with COUNT - Counting Per Group

Use COUNT and other aggregates to compute statistics for each group.

#### Implementation

**Problem: Find Followers Count (SQL-534)**

```sql
-- Count followers for each user
SELECT 
    user_id,
    COUNT(follower_id) AS followers_count
FROM Followers
GROUP BY user_id
ORDER BY user_id;
```

**Count with Multiple Conditions:**

```sql
-- Count completed vs cancelled orders per customer
SELECT 
    customer_id,
    COUNT(*) AS total_orders,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed_orders,
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) AS cancelled_orders
FROM Orders
GROUP BY customer_id;
```

**Count Distinct Values:**

```sql
-- Count unique products ordered per customer
SELECT 
    customer_id,
    COUNT(DISTINCT product_id) AS unique_products
FROM Orders
GROUP BY customer_id;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - sorting, O(n) with hash aggregation |
| Space | O(g) - distinct groups |

### Approach 3: Multiple Column GROUP BY - Hierarchical Grouping

Group by multiple columns to create nested/hierarchical summaries.

#### Implementation

**Hierarchical Sales Summary:**

```sql
-- Sales by region and city
SELECT 
    region,
    city,
    COUNT(*) AS order_count,
    SUM(amount) AS total_sales,
    AVG(amount) AS avg_order_value
FROM Orders
GROUP BY region, city
ORDER BY region, total_sales DESC;
```

**Time-Based Grouping:**

```sql
-- Monthly sales statistics
SELECT 
    YEAR(order_date) AS year,
    MONTH(order_date) AS month,
    COUNT(*) AS orders,
    SUM(amount) AS revenue
FROM Orders
GROUP BY YEAR(order_date), MONTH(order_date)
ORDER BY year, month;
```

**Problem: Department Highest Salary (implied pattern):**

```sql
-- Find highest salary in each department
SELECT 
    d.name AS Department,
    e.name AS Employee,
    e.salary AS Salary
FROM Employee e
INNER JOIN Department d ON e.departmentId = d.id
WHERE (e.departmentId, e.salary) IN (
    SELECT departmentId, MAX(salary)
    FROM Employee
    GROUP BY departmentId
);
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - sorting for multiple columns |
| Space | O(g1 × g2) - product of distinct values |

### Approach 4: GROUP BY with Conditions - Finding Duplicates

Use HAVING clause to filter groups based on aggregate conditions.

#### Implementation

**Problem: Duplicate Emails (SQL-182) - Extended**

```sql
-- Find emails appearing more than once with count
SELECT 
    email,
    COUNT(*) AS occurrence_count
FROM Person
GROUP BY email
HAVING COUNT(*) > 1;
```

**Find Users with Multiple Logins:**

```sql
-- Users who logged in more than 5 times
SELECT 
    user_id,
    COUNT(*) AS login_count
FROM Logins
GROUP BY user_id
HAVING COUNT(*) > 5;
```

**Find Products with Low Inventory:**

```sql
-- Products needing restock (total quantity < 10 across all warehouses)
SELECT 
    product_id,
    product_name,
    SUM(quantity) AS total_stock
FROM Inventory
GROUP BY product_id, product_name
HAVING SUM(quantity) < 10;
```

**Find Categories with High Value Orders:**

```sql
-- Categories with average order value > $1000
SELECT 
    category,
    AVG(order_value) AS avg_value,
    COUNT(*) AS order_count
FROM Orders
GROUP BY category
HAVING AVG(order_value) > 1000;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - same as basic GROUP BY |
| Space | O(g) - groups before HAVING filter |

## Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| Simple GROUP BY | O(n log n) | O(g) | **Recommended** - single column grouping |
| GROUP BY with COUNT | O(n log n) | O(g) | Counting and statistics per group |
| Multiple Column GROUP BY | O(n log n) | O(g1 × g2) | Hierarchical summaries |
| GROUP BY with HAVING | O(n log n) | O(g) | Filtering groups by conditions |

*Note: n = total rows, g = number of distinct groups. Hash-based aggregation can achieve O(n) time.*

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| Duplicate Emails | 182 | Easy | Find duplicate emails using GROUP BY + HAVING |
| Game Play Analysis I | 511 | Easy | First login date per player with MIN |
| Find Followers Count | 534 | Easy | Count followers per user |
| User Activity Past 30 Days | 585 | Medium | Daily active users with date filtering |
| Department Highest Salary | 184 | Medium | Max salary per department |
| Reformat Department Table | 179 | Easy | Pivot data with GROUP BY |

## Key Takeaways

- **Grouping collapses rows**: Each unique combination of grouping values produces one output row
- **Aggregate functions required**: Any non-grouped column in SELECT must use an aggregate function
- **HAVING vs WHERE**: WHERE filters before grouping, HAVING filters after aggregation
- **ORDER BY placement**: Sorting happens after grouping and aggregation
- **NULL handling**: NULL values group together as a single group
- **Performance**: Indexes on grouping columns can improve performance

## Common Pitfalls

1. **Selecting non-aggregated columns**: Including a column in SELECT that's not in GROUP BY or an aggregate function (error in strict mode, arbitrary value in lenient mode)
2. **WHERE vs HAVING confusion**: Using WHERE with aggregate conditions (e.g., `WHERE COUNT(*) > 1` - invalid)
3. **Forgetting DISTINCT**: COUNT(*) counts all rows, COUNT(DISTINCT col) counts unique values
4. **Ambiguous column references**: Column names that exist in multiple tables need table prefixes
5. **Ordering before grouping**: ORDER BY must come after GROUP BY, not before

## Pattern Source

[Basic GROUP BY](sql/basic-group-by.md)
