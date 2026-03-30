# COUNT, SUM, AVG, MIN, MAX

## Problem Description

The statistical aggregation pattern uses aggregate functions to compute summary statistics across rows. These functions collapse multiple rows into a single value, enabling data summarization and statistical analysis.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n) - single pass through data |
| Space Complexity | O(1) - single result value per aggregate |
| Input | Column(s) or expressions, optional GROUP BY |
| Output | Single scalar value or values per group |
| Approach | Scan → Accumulate → Return result |

### When to Use

- Computing totals (SUM) - revenue, quantities, scores
- Calculating averages (AVG) - mean values, rates
- Finding extremes (MIN/MAX) - boundaries, best/worst
- Counting records (COUNT) - totals, existence checks
- Statistical summaries - combining multiple aggregates
- Data validation - checking ranges and distributions

## Intuition

The key insight is **data reduction**. Aggregate functions compress many rows into meaningful summary values, revealing patterns invisible at the row level.

The "aha!" moments:

1. **NULL handling differs by function**: `COUNT(*)` counts all rows; `COUNT(column)` excludes NULLs
2. **Combining aggregates**: Multiple aggregates work together in one query
3. **Aggregate vs row-level**: Aggregates collapse rows; can't mix with non-aggregated columns without GROUP BY
4. **DISTINCT modifier**: `COUNT(DISTINCT x)` counts unique values only
5. **Empty set behavior**: COUNT returns 0, others return NULL when no rows match

## Solution Approaches

### Approach 1: Basic Aggregates

Use individual aggregate functions for simple statistics.

#### Algorithm

1. Identify the column/expression to aggregate
2. Choose appropriate aggregate function
3. Apply function in SELECT clause
4. Handle NULLs appropriately

#### Implementation

**Basic COUNT:**

```sql
-- Count all rows
SELECT COUNT(*) AS total_records FROM Employees;

-- Count non-NULL values in a column
SELECT COUNT(salary) AS employees_with_salary FROM Employees;

-- Count distinct values
SELECT COUNT(DISTINCT department_id) AS unique_departments FROM Employees;
```

**SUM and AVG:**

```sql
-- Problem: Find Total Time Spent by Each Employee (SQL-511)
SELECT 
    event_day AS day,
    emp_id,
    SUM(out_time - in_time) AS total_time
FROM Employees
GROUP BY event_day, emp_id;

-- Calculate average with precision control
SELECT 
    department_id,
    ROUND(AVG(salary), 2) AS avg_salary,
    SUM(salary) AS total_payroll
FROM Employees
GROUP BY department_id;
```

**MIN and MAX:**

```sql
-- Problem: Game Play Analysis I (SQL-511 variant)
SELECT 
    player_id,
    MIN(event_date) AS first_login
FROM Activity
GROUP BY player_id;

-- Find salary range per department
SELECT 
    department_id,
    MIN(salary) AS lowest_salary,
    MAX(salary) AS highest_salary,
    MAX(salary) - MIN(salary) AS salary_range
FROM Employees
GROUP BY department_id;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - single pass through table |
| Space | O(1) - constant space per aggregate |

### Approach 2: Combined Aggregates

Multiple aggregates in one query for comprehensive statistics.

#### Implementation

**Complete Statistical Summary:**

```sql
-- Problem: Capital Gain/Loss (SQL-550)
SELECT 
    stock_name,
    SUM(CASE WHEN operation = 'Buy' THEN -price ELSE price END) AS capital_gain_loss
FROM Stocks
GROUP BY stock_name;

-- Full statistics dashboard
SELECT 
    COUNT(*) AS total_employees,
    COUNT(DISTINCT department_id) AS departments,
    SUM(salary) AS total_payroll,
    ROUND(AVG(salary), 2) AS avg_salary,
    MIN(salary) AS min_salary,
    MAX(salary) AS max_salary,
    MAX(salary) - MIN(salary) AS salary_spread
FROM Employees;
```

**Problem: Students and Sandwiches (SQL-1070)**

```sql
-- Count preferences and compare
SELECT 
    s.student_id,
    s.student_name,
    COUNT(CASE WHEN p.preference = s.sandwich THEN 1 END) AS preferred_count
FROM Students s
LEFT JOIN Preferences p ON s.student_id = p.student_id
GROUP BY s.student_id, s.student_name;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - single pass computes all aggregates |
| Space | O(1) - constant per aggregate function |

### Approach 3: Aggregates with GROUP BY

Per-group statistics using GROUP BY clause.

#### Implementation

**Problem: Sales Analysis III (SQL-1077)**

```sql
-- Find products sold only in Q1 2019
SELECT 
    s.product_id,
    p.product_name
FROM Sales s
JOIN Product p ON s.product_id = p.product_id
GROUP BY s.product_id, p.product_name
HAVING MIN(s.sale_date) >= '2019-01-01' 
   AND MAX(s.sale_date) <= '2019-03-31';
```

**Department-Level Statistics:**

```sql
SELECT 
    d.department_name,
    COUNT(e.employee_id) AS employee_count,
    SUM(e.salary) AS total_salary,
    ROUND(AVG(e.salary), 2) AS avg_salary,
    MIN(e.salary) AS min_salary,
    MAX(e.salary) AS max_salary
FROM Departments d
LEFT JOIN Employees e ON d.department_id = e.department_id
GROUP BY d.department_id, d.department_name
ORDER BY total_salary DESC;
```

**Multiple Grouping Levels:**

```sql
-- Year and month breakdown
SELECT 
    YEAR(order_date) AS year,
    MONTH(order_date) AS month,
    COUNT(*) AS order_count,
    SUM(amount) AS revenue,
    AVG(amount) AS avg_order_value,
    MIN(amount) AS min_order,
    MAX(amount) AS max_order
FROM Orders
GROUP BY YEAR(order_date), MONTH(order_date)
ORDER BY year, month;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - due to grouping sort/hash |
| Space | O(g) - g groups in result |

### Approach 4: Conditional Aggregates

CASE expressions inside aggregates for filtered calculations.

#### Implementation

**Conditional COUNT:**

```sql
-- Count by category in single pass
SELECT 
    department_id,
    COUNT(*) AS total_employees,
    COUNT(CASE WHEN salary > 100000 THEN 1 END) AS high_earners,
    COUNT(CASE WHEN salary < 50000 THEN 1 END) AS low_earners,
    COUNT(CASE WHEN hire_date >= '2023-01-01' THEN 1 END) AS new_hires
FROM Employees
GROUP BY department_id;
```

**Conditional SUM:**

```sql
-- Problem: Capital Gain/Loss (SQL-550) - detailed
SELECT 
    stock_name,
    SUM(CASE 
        WHEN operation = 'Buy' THEN -price 
        ELSE price 
    END) AS capital_gain_loss
FROM Stocks
GROUP BY stock_name
ORDER BY stock_name;

-- Revenue breakdown by type
SELECT 
    DATE(order_date) AS day,
    SUM(CASE WHEN order_type = 'online' THEN amount ELSE 0 END) AS online_revenue,
    SUM(CASE WHEN order_type = 'in_store' THEN amount ELSE 0 END) AS store_revenue,
    SUM(amount) AS total_revenue
FROM Orders
GROUP BY DATE(order_date);
```

**Conditional AVG:**

```sql
-- Average salary by employment type
SELECT 
    department_id,
    AVG(CASE WHEN employment_type = 'full_time' THEN salary END) AS ft_avg_salary,
    AVG(CASE WHEN employment_type = 'part_time' THEN salary END) AS pt_avg_salary,
    AVG(salary) AS overall_avg
FROM Employees
GROUP BY department_id;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × c) - c conditions evaluated per row |
| Space | O(1) or O(g) with GROUP BY |

## Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| Basic Aggregates | O(n) | O(1) | **Recommended** - simple statistics |
| Combined Aggregates | O(n) | O(1) | Dashboard summaries |
| GROUP BY Aggregates | O(n log n) | O(g) | Per-group analysis |
| Conditional Aggregates | O(n × c) | O(1)/O(g) | Segmented calculations |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| Game Play Analysis I | 511 | Easy | MIN with GROUP BY |
| Capital Gain/Loss | 550 | Medium | Conditional SUM |
| Students and Sandwiches | 1070 | Medium | COUNT with conditions |
| Sales Analysis III | 1077 | Easy | MIN/MAX with HAVING |
| Department Highest Salary | 184 | Medium | MAX with GROUP BY |
| Rising Temperature | 197 | Easy | MIN for date comparison |
| Consecutive Numbers | 180 | Medium | COUNT with HAVING |
| Biggest Single Number | 619 | Easy | MAX with subquery |

## Key Takeaways

- **COUNT behavior**: `COUNT(*)` counts rows; `COUNT(column)` counts non-NULL values
- **NULL handling**: All aggregates except COUNT ignore NULL values
- **Empty result**: COUNT returns 0, others return NULL for no matching rows
- **Cannot mix levels**: Aggregates can't appear with non-aggregated columns without GROUP BY
- **DISTINCT modifier**: Use `COUNT(DISTINCT x)` for unique value counting
- **HAVING clause**: Filter groups based on aggregate results

## Common Pitfalls

1. **Mixing aggregate and non-aggregate columns** without GROUP BY causes errors
2. **WHERE vs HAVING**: WHERE filters rows before aggregation; HAVING filters after
3. **NULL surprises**: `AVG(NULL, 10, 20)` = 15, not 10 (NULLs excluded)
4. **Integer division**: Some DBs do integer division; cast to float for decimals
5. **COUNT(*) vs COUNT(1)**: Both count rows; no performance difference
6. **String MIN/MAX**: Compares lexicographically, not by length

## Aggregate Function Reference

| Function | Purpose | NULL Handling | Empty Set |
|----------|---------|---------------|-----------|
| COUNT(*) | Count all rows | N/A | 0 |
| COUNT(expr) | Count non-NULL | Ignores NULL | 0 |
| SUM(expr) | Total of values | Ignores NULL | NULL |
| AVG(expr) | Average of values | Ignores NULL | NULL |
| MIN(expr) | Smallest value | Ignores NULL | NULL |
| MAX(expr) | Largest value | Ignores NULL | NULL |

## Pattern Source

[COUNT, SUM, AVG, MIN, MAX](sql/count-sum-avg-min-max.md)
