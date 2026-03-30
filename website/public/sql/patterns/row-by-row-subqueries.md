# Row-by-Row Subqueries

## Problem Description

The Row-by-Row Subqueries pattern involves correlated subqueries that execute once for each row of the outer query. Unlike independent subqueries that run once total, correlated subqueries reference columns from the outer query and are re-executed for every row processed.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n × m) - outer rows × inner execution |
| Space Complexity | O(1) - per-row calculation, no materialization |
| Input | Outer table, correlated inner query |
| Output | Filtered or calculated results per row |
| Approach | Iterate outer rows → Execute correlated subquery → Filter/Calculate |

### When to Use

- **Per-row validation**: Check conditions that depend on outer row values
- **Row-dependent filtering**: Filter based on values from the current outer row
- **Exists checks**: Verify existence of related records using outer row context
- **Comparison with aggregates**: Compare each row against a subset defined by outer values
- **Hierarchical queries**: Find related records in self-referencing tables
- **Finding top N per group**: Identify top records within categories

## Intuition

The key insight is **row-by-row execution**. A correlated subquery cannot run independently - it needs values from the outer query to execute, creating a nested loop behavior.

The "aha!" moments:

1. **Executed per outer row**: The subquery runs once for EVERY row in the outer query
2. **Reference outer table**: Uses outer table aliases in the subquery's WHERE clause
3. **Performance implications**: O(n × m) complexity can be slow on large datasets
4. **Alternative with joins**: Often replaceable with JOINs for better performance
5. **EXISTS vs IN**: EXISTS is more efficient than IN for correlated subqueries

## Solution Approaches

### Approach 1: Correlated Subquery in WHERE - Per-row Filtering

#### Algorithm

1. Write the outer query selecting from the main table
2. Add WHERE clause with a condition
3. Use subquery that references outer table columns
4. The subquery executes for each outer row, filtering based on the result

#### Implementation

**Problem: Department Top Three Salaries (SQL-185)**

```sql
-- Find top 3 salaries in each department using correlated subquery
SELECT 
    d.name AS Department,
    e.name AS Employee,
    e.salary AS Salary
FROM 
    Employee e
INNER JOIN 
    Department d ON e.departmentId = d.id
WHERE 
    -- Correlated subquery: counts how many people in same dept have higher salary
    (SELECT COUNT(DISTINCT salary) 
     FROM Employee e2 
     WHERE e2.departmentId = e.departmentId 
       AND e2.salary > e.salary) < 3
ORDER BY 
    d.name, e.salary DESC;
```

**Problem: Managers with at Least 5 Direct Reports (SQL-570)**

```sql
-- Find managers with 5+ reports using correlated subquery
SELECT e1.name
FROM Employee e1
WHERE 
    -- Correlated: count reports for each manager
    (SELECT COUNT(*) 
     FROM Employee e2 
     WHERE e2.managerId = e1.id) >= 5;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × m) - n outer rows, m inner rows per execution |
| Space | O(1) - no intermediate storage |

### Approach 2: Correlated Subquery in SELECT - Row-dependent Calculation

#### Algorithm

1. Write the outer query with main table columns
2. Add a calculated column using a subquery in SELECT
3. The subquery references outer table to compute per-row values
4. Returns derived values that depend on each row's context

#### Implementation

**Problem: Game Play Analysis (SQL-511)**

```sql
-- Calculate days since first login for each player session
SELECT 
    player_id,
    event_date,
    games_played,
    -- Correlated subquery: find first login date for this player
    (SELECT MIN(event_date) 
     FROM Activity a2 
     WHERE a2.player_id = a1.player_id) AS first_login
FROM 
    Activity a1;
```

**Problem: Immediate Food Delivery (SQL-1173)**

```sql
-- Calculate percentage of immediate orders
SELECT 
    ROUND(
        100.0 * SUM(CASE WHEN order_date = customer_pref_delivery_date THEN 1 ELSE 0 END) / 
        COUNT(*), 
        2
    ) AS immediate_percentage
FROM Delivery d
WHERE 
    -- Correlated subquery: find first order for this customer
    order_date = (
        SELECT MIN(order_date) 
        FROM Delivery d2 
        WHERE d2.customer_id = d.customer_id
    );
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × m) - per-row calculation |
| Space | O(k) - k rows with calculated values |

### Approach 3: Finding Top N Per Group - Correlation with Limit

#### Algorithm

1. Identify the groups (e.g., departments, categories)
2. For each row, count how many rows in its group have better values
3. Filter rows where the count is less than N
4. This effectively gives top N per group without window functions

#### Implementation

**Problem: Department Top Three Salaries (SQL-185) - Alternative**

```sql
-- Alternative: Self-join approach for top 3 per department
SELECT 
    d.name AS Department,
    e.name AS Employee,
    e.salary AS Salary
FROM 
    Employee e
INNER JOIN Department d ON e.departmentId = d.id
LEFT JOIN Employee e2 
    ON e.departmentId = e2.departmentId 
    AND e.salary < e2.salary
GROUP BY 
    e.id, d.name, e.name, e.salary
HAVING 
    COUNT(DISTINCT e2.salary) < 3
ORDER BY 
    d.name, e.salary DESC;
```

**Problem: Market Analysis (SQL-602) - Top Product Per User**

```sql
-- Find most recent order per user using correlated subquery
SELECT 
    u.user_id,
    u.user_name,
    o.order_id,
    o.order_date
FROM Users u
LEFT JOIN Orders o ON u.user_id = o.user_id
WHERE 
    o.order_date = (
        -- Correlated: find max date for this user
        SELECT MAX(order_date) 
        FROM Orders o2 
        WHERE o2.user_id = u.user_id
    )
    OR o.order_id IS NULL;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n²) - comparing each row with group members |
| Space | O(k) - k matching rows |

### Approach 4: Consecutive Sequences with Correlation

#### Algorithm

1. Use correlated subquery to find related sequential records
2. Compare dates/IDs with gaps
3. Group consecutive sequences
4. Identify sequences meeting length criteria

#### Implementation

**Problem: Human Traffic of Stadium (SQL-601)**

```sql
-- Find consecutive days with high traffic using correlation
SELECT DISTINCT 
    s1.id, 
    s1.visit_date, 
    s1.people
FROM 
    Stadium s1
WHERE 
    s1.people >= 100
    AND (
        -- Check if this row is part of a 3+ day streak
        -- Correlated subqueries check consecutive dates
        (SELECT people FROM Stadium s2 WHERE s2.id = s1.id + 1) >= 100
        AND (SELECT people FROM Stadium s3 WHERE s3.id = s1.id + 2) >= 100
    )
    OR (
        (SELECT people FROM Stadium s4 WHERE s4.id = s1.id - 1) >= 100
        AND (SELECT people FROM Stadium s5 WHERE s5.id = s1.id + 1) >= 100
    )
    OR (
        (SELECT people FROM Stadium s6 WHERE s6.id = s1.id - 2) >= 100
        AND (SELECT people FROM Stadium s7 WHERE s7.id = s1.id - 1) >= 100
    )
ORDER BY 
    s1.id;
```

**Problem: Find Users With Valid E-Mails (SQL-1517)**

```sql
-- Validation using correlated pattern for prefix/suffix check
SELECT user_id, name, mail
FROM Users u
WHERE 
    -- Check email format with correlated validation pattern
    mail REGEXP '^[a-zA-Z][a-zA-Z0-9_.-]*@leetcode[.]com$';
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × k) - k is sequence lookup cost |
| Space | O(k) - result rows |

## Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| WHERE Correlation | O(n × m) | O(1) | Per-row filtering with aggregates |
| SELECT Correlation | O(n × m) | O(k) | Row-dependent calculations |
| Top N Per Group | O(n²) | O(k) | Ranking without window functions |
| Consecutive Sequences | O(n × k) | O(k) | Gap analysis, streak detection |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| Department Top Three Salaries | 185 | Hard | Top 3 per department |
| Human Traffic of Stadium | 601 | Hard | Consecutive day sequences |
| Managers with 5+ Reports | 570 | Medium | Count with correlation |
| Game Play Analysis I | 511 | Easy | First login calculation |
| Immediate Food Delivery I | 1173 | Easy | First order comparison |
| Market Analysis I | 602 | Easy | Latest order per user |

## Key Takeaways

- **Per-row execution**: Correlated subqueries run once per outer row
- **Outer reference**: Use outer table alias in subquery WHERE clause
- **Performance warning**: O(n × m) complexity - consider JOIN alternatives for large tables
- **EXISTS efficiency**: Use EXISTS instead of IN for correlated existence checks
- **Top N trick**: Count rows with higher values to find top N per group

## Common Pitfalls

1. **Performance blind spots**: Correlated subqueries can be slow on large tables without proper indexing
2. **Missing correlation**: Forgetting to reference outer table makes it independent, not correlated
3. **Multiple executions**: Database may execute subquery multiple times per row
4. **NULL handling**: Correlated subqueries can return NULL - handle appropriately
5. **Alternative ignorance**: Many correlated subqueries can be rewritten as JOINs for better performance

## Pattern Source

[Row-by-Row Subqueries](sql/row-by-row-subqueries.md)
