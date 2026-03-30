# Top N Records

## Problem Description

The Top N Records pattern retrieves a specific number of rows from a result set, typically ordered by some criteria. This pattern is essential for pagination, rankings, leaderboard displays, and finding extreme values in datasets.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n log n) - due to sorting, O(n) without ORDER BY |
| Space Complexity | O(n) - storing sorted intermediate results |
| Input | Table data, sort criteria, limit count, optional offset |
| Output | Top N or specific page of records |
| Approach | Sort → Skip (optional) → Limit |

### When to Use

- Displaying leaderboards or top performers (top 10 sales reps)
- Implementing pagination in web applications
- Finding rankings within categories (top 3 per department)
- Retrieving Nth highest/lowest values
- Sampling data for analysis
- Time-series data (most recent N records)

## Intuition

The key insight is **controlled result set reduction**. While WHERE filters rows based on values, LIMIT filters based on position after sorting.

The "aha!" moments:

1. **ORDER BY before LIMIT**: You must sort before limiting, otherwise results are arbitrary
2. **OFFSET calculation**: Page N starts at offset (N-1) × page_size
3. **Handling ties**: LIMIT cuts arbitrarily; use DENSE_RANK for fair tie handling
4. **Performance**: Large offsets are slow; use keyset pagination for better performance
5. **NULL ordering**: Be explicit with `NULLS FIRST` or `NULLS LAST`

## Solution Approaches

### Approach 1: ORDER BY with LIMIT ✅ Recommended

#### Algorithm

1. Determine the sort criteria (what defines "top")
2. Apply ORDER BY with DESC for highest values
3. Add LIMIT clause to restrict result count
4. Optional: Add OFFSET for pagination

#### Implementation

**Problem: Second Highest Salary (SQL-176)**

```sql
-- Basic LIMIT with OFFSET to skip top record
SELECT DISTINCT salary AS SecondHighestSalary
FROM Employee
ORDER BY salary DESC
LIMIT 1 OFFSET 1;
```

```sql
-- Alternative using subquery with LIMIT
SELECT MAX(salary) AS SecondHighestSalary
FROM Employee
WHERE salary < (
    SELECT MAX(salary)
    FROM Employee
);
```

**Problem: Investments in 2016 (SQL-585)**

```sql
-- Combine LIMIT results with UNION
SELECT ROUND(SUM(tiv_2016), 2) AS tiv_2016
FROM (
    SELECT *
    FROM Insurance
    WHERE tiv_2015 IN (
        SELECT tiv_2015
        FROM Insurance
        GROUP BY tiv_2015
        HAVING COUNT(*) > 1
    )
) t
WHERE (lat, lon) IN (
    SELECT lat, lon
    FROM Insurance
    GROUP BY lat, lon
    HAVING COUNT(*) = 1
);
```

**Basic Top N Example:**

```sql
-- Top 5 highest paid employees
SELECT name, salary
FROM Employee
ORDER BY salary DESC
LIMIT 5;
```

```sql
-- Top 10 most recent orders
SELECT order_id, customer_id, order_date
FROM Orders
ORDER BY order_date DESC
LIMIT 10;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - sorting dominates |
| Space | O(n) - sorting buffer |

### Approach 2: OFFSET for Pagination

Skip records before returning results - essential for paginated displays.

#### Implementation

```sql
-- Page 1: First 10 records
SELECT *
FROM Products
ORDER BY price DESC
LIMIT 10 OFFSET 0;

-- Page 2: Next 10 records (skip first 10)
SELECT *
FROM Products
ORDER BY price DESC
LIMIT 10 OFFSET 10;

-- Page 3: Records 21-30
SELECT *
FROM Products
ORDER BY price DESC
LIMIT 10 OFFSET 20;
```

**Dynamic Offset Calculation:**

```sql
-- Page number parameter: page_num
-- Page size: 20
-- Offset = (page_num - 1) * 20
SELECT employee_id, name, department
FROM Employees
ORDER BY hire_date DESC
LIMIT 20 OFFSET 40;  -- Page 3
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n + offset) - large offsets are slow |
| Space | O(n) |

### Approach 3: Handling Ties with Window Functions

When ties exist, LIMIT arbitrarily cuts results. Use window functions for proper ranking.

#### Implementation

**Problem: Second Highest Salary with Ties (SQL-176 variant)**

```sql
-- DENSE_RANK assigns same rank to ties, no gaps
SELECT DISTINCT salary AS SecondHighestSalary
FROM (
    SELECT salary,
           DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
    FROM Employee
) ranked
WHERE rnk = 2;
```

**ROW_NUMBER vs RANK vs DENSE_RANK:**

```sql
-- Different ranking behaviors with ties
SELECT 
    name,
    salary,
    ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num,    -- Unique, arbitrary on ties
    RANK() OVER (ORDER BY salary DESC) AS rank_num,         -- Same rank, gaps after ties
    DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rank  -- Same rank, no gaps
FROM Employee;
```

**Top N Per Group:**

```sql
-- Top 2 salaries per department
SELECT department_id, name, salary
FROM (
    SELECT 
        department_id,
        name,
        salary,
        DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rnk
    FROM Employee
) ranked
WHERE rnk <= 2;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - window functions scan once |
| Space | O(n) - window buffer |

### Approach 4: Nth Highest Value

Finding the Nth highest value requires special handling when N doesn't exist.

#### Implementation

**Problem: Nth Highest Salary (SQL-177)**

```sql
-- Using LIMIT OFFSET with NULL handling
CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT
BEGIN
    DECLARE offset_val INT;
    SET offset_val = N - 1;
    
    RETURN (
        SELECT DISTINCT salary
        FROM Employee
        ORDER BY salary DESC
        LIMIT 1 OFFSET offset_val
    );
END;
```

**Alternative with Window Function:**

```sql
-- More robust for ties
CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT
BEGIN
    RETURN (
        SELECT salary
        FROM (
            SELECT DISTINCT salary,
                   DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
            FROM Employee
        ) ranked
        WHERE rnk = N
        LIMIT 1
    );
END;
```

**Nth Value with Subquery:**

```sql
-- Without window functions (MySQL < 8.0 compatible)
SELECT DISTINCT e1.salary
FROM Employee e1
WHERE (SELECT COUNT(DISTINCT e2.salary) 
       FROM Employee e2 
       WHERE e2.salary > e1.salary) = N - 1;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n²) - subquery approach, O(n log n) - with window functions |
| Space | O(n) |

## Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| ORDER BY + LIMIT | O(n log n) | O(n) | **Recommended** - simple top N |
| OFFSET Pagination | O(n log n + offset) | O(n) | Small offset values |
| Window Functions | O(n log n) | O(n) | Handling ties, rankings |
| Nth with Subquery | O(n²) | O(n) | Legacy database support |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| Second Highest Salary | 176 | Medium | Basic LIMIT OFFSET pattern |
| Nth Highest Salary | 177 | Medium | Function with LIMIT OFFSET |
| Investments in 2016 | 585 | Medium | Combined conditions with subqueries |
| Department Top Three Salaries | 185 | Hard | Top N per group with DENSE_RANK |
| Rank Scores | 178 | Medium | DENSE_RANK for ranking |

## Key Takeaways

- **Always ORDER BY**: Without sorting, LIMIT returns arbitrary rows
- **OFFSET starts at 0**: First page uses OFFSET 0, not 1
- **Handle ties explicitly**: Use DENSE_RANK when ties matter
- **Large offsets are slow**: Consider keyset pagination for deep pages
- **NULL awareness**: Specify NULL ordering behavior explicitly

## Common Pitfalls

1. Forgetting ORDER BY before LIMIT (arbitrary results)
2. Using OFFSET 1 instead of 0 for first page
3. Not handling NULL values in sorting
4. Using LIMIT for tied rankings (arbitrary tie-breaking)
5. Assuming Nth highest exists without NULL check
6. Large OFFSET values causing performance degradation
7. Off-by-one errors in Nth value calculations

## Pagination Strategy Comparison

| Strategy | Query Pattern | Best For |
|----------|---------------|----------|
| LIMIT OFFSET | `LIMIT n OFFSET m` | Small datasets, simple pages |
| Keyset Pagination | `WHERE id > last_seen LIMIT n` | Large datasets, deep pages |
| Cursor Pagination | `WHERE (col1, col2) > (val1, val2)` | Real-time data, consistency |

## Pattern Source

[Top N Records](sql/top-n-records.md)
