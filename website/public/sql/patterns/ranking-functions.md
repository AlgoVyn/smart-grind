# Ranking Functions (ROW_NUMBER, RANK, DENSE_RANK)

## Problem Description

The Ranking Functions pattern assigns a rank to each row within a result set based on specified ordering criteria. These window functions enable sophisticated ranking, deduplication, and top-N analysis that would be difficult or impossible with standard GROUP BY aggregation.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n log n) - due to sorting for ranking |
| Space Complexity | O(n) - window function buffer |
| Input | Table, ordering columns, optional partition columns |
| Output | Original rows with assigned rank numbers |
| Approach | Window function with ORDER BY |

### When to Use

- **Ranking data**: Assign position numbers to ordered results (top 10, bottom 5)
- **Removing duplicates**: Keep only the first row per group using ROW_NUMBER
- **Top N per group**: Find highest/lowest N items within each category
- **Finding nth highest**: Locate the 2nd, 3rd, or Nth highest value in a set
- **Pagination with ordering**: Page through sorted results with deterministic ordering
- **Comparing ranks**: Calculate differences between current and previous ranks

## Intuition

The key insight is **ordered partitioning**. Ranking functions create a window over the data, sort it, and assign numbers based on that order—all without collapsing rows like GROUP BY does.

The "aha!" moments:

1. **Window vs Group**: GROUP BY collapses rows; window functions preserve all rows while adding ranking info
2. **Ordering determines rank**: The ORDER BY inside OVER() completely controls the ranking
3. **Tie handling differs**: ROW_NUMBER always gives unique numbers; RANK gives ties with gaps; DENSE_RANK gives ties without gaps
4. **Partition for per-group**: PARTITION BY resets ranking for each group (e.g., rank per department)
5. **Subquery required**: Must wrap in subquery/CTE to filter by rank (WHERE rank <= N)

## Solution Approaches

### Approach 1: ROW_NUMBER - Unique Sequential Numbers

ROW_NUMBER() assigns a unique, sequential number to each row starting from 1. Even with ties, each row gets a distinct number.

#### Algorithm

1. Determine ordering columns (what defines "first", "second", etc.)
2. Add secondary sort column to break ties deterministically
3. Apply ROW_NUMBER() OVER (ORDER BY ...)
4. Optionally add PARTITION BY for per-group ranking
5. Wrap in subquery and filter by row number

#### Implementation

**Basic ROW_NUMBER:**

```sql
-- Assign unique row numbers by salary (descending)
SELECT 
    employee_id,
    name,
    salary,
    ROW_NUMBER() OVER (ORDER BY salary DESC) AS rn
FROM Employee;
```

**ROW_NUMBER with Tie-Breaker:**

```sql
-- Break ties by employee_id for deterministic ordering
SELECT 
    employee_id,
    name,
    salary,
    ROW_NUMBER() OVER (
        ORDER BY salary DESC, employee_id ASC
    ) AS rn
FROM Employee;
```

**Problem: Delete Duplicate Emails (SQL-196)**

```sql
-- Keep only the first occurrence of each email
DELETE FROM Person
WHERE id NOT IN (
    SELECT id FROM (
        SELECT 
            id,
            ROW_NUMBER() OVER (
                PARTITION BY email 
                ORDER BY id ASC
            ) AS rn
        FROM Person
    ) ranked
    WHERE rn = 1
);
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - sorting for ranking |
| Space | O(n) - window function buffer |

### Approach 2: RANK - Ties Get Same Rank with Gaps

RANK() assigns the same rank to tied values, but the next rank skips numbers (leaves gaps). Like Olympic medal standings.

#### Algorithm

1. Identify ordering columns
2. Apply RANK() OVER (ORDER BY ...)
3. Tied values receive same rank number
4. Next rank = current rank + number of tied rows
5. Wrap in subquery to filter by rank

#### Implementation

**Basic RANK:**

```sql
-- RANK with gaps after ties
SELECT 
    employee_id,
    name,
    salary,
    RANK() OVER (ORDER BY salary DESC) AS rnk
FROM Employee;

-- Result: 100k(1), 100k(1), 90k(3), 80k(4) - gap at 2
```

**Problem: Rank Scores (SQL-178)**

```sql
-- Rank scores with gaps after ties
SELECT 
    score,
    RANK() OVER (ORDER BY score DESC) AS `rank`
FROM Scores;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) |
| Space | O(n) |

### Approach 3: DENSE_RANK - Ties Get Same Rank No Gaps

DENSE_RANK() assigns the same rank to tied values, and the next rank continues sequentially without gaps.

#### Algorithm

1. Identify ordering columns
2. Apply DENSE_RANK() OVER (ORDER BY ...)
3. Tied values receive same rank number
4. Next rank = current rank + 1 (never gaps)
5. Best for "Nth highest unique value" queries

#### Implementation

**Basic DENSE_RANK:**

```sql
-- DENSE_RANK without gaps
SELECT 
    employee_id,
    name,
    salary,
    DENSE_RANK() OVER (ORDER BY salary DESC) AS drnk
FROM Employee;

-- Result: 100k(1), 100k(1), 90k(2), 80k(3) - no gaps
```

**Problem: Nth Highest Salary (SQL-177, SQL-585)**

```sql
-- Find Nth highest unique salary using DENSE_RANK
SELECT DISTINCT salary
FROM (
    SELECT 
        salary,
        DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
    FROM Employee
) ranked
WHERE rnk = N;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) |
| Space | O(n) |

### Approach 4: Finding Nth Highest - Ranking with Filter

Combine ranking functions with subqueries to find specific positions in ordered data.

#### Algorithm

1. Choose ranking function based on tie handling needs
2. Apply ranking OVER (ORDER BY column DESC)
3. Wrap in subquery/CTE
4. Filter WHERE rank = N
5. Handle NULL if N exceeds available ranks

#### Implementation

**Problem: Second Highest Salary (SQL-176)**

```sql
-- Using ROW_NUMBER for 2nd highest (no tie consideration)
SELECT MAX(salary) AS SecondHighestSalary
FROM (
    SELECT 
        salary,
        ROW_NUMBER() OVER (ORDER BY salary DESC) AS rn
    FROM Employee
) ranked
WHERE rn = 2;

-- Using DENSE_RANK (handles ties, unique values only)
SELECT MAX(salary) AS SecondHighestSalary
FROM (
    SELECT 
        salary,
        DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
    FROM Employee
) ranked
WHERE rnk = 2;
```

**Problem: Department Top Three Salaries (SQL-185)**

```sql
-- Top 3 per department using DENSE_RANK
SELECT 
    d.name AS Department,
    e.name AS Employee,
    e.salary AS Salary
FROM (
    SELECT 
        name,
        salary,
        departmentId,
        DENSE_RANK() OVER (
            PARTITION BY departmentId 
            ORDER BY salary DESC
        ) AS rnk
    FROM Employee
) e
INNER JOIN Department d ON e.departmentId = d.id
WHERE e.rnk <= 3;
```

**Problem: Game Play Analysis IV (SQL-534)**

```sql
-- Calculate fraction of players who logged in again on day after first login
WITH FirstLogin AS (
    SELECT 
        player_id,
        MIN(event_date) AS first_login
    FROM Activity
    GROUP BY player_id
),
NextDayLogin AS (
    SELECT 
        a.player_id,
        CASE 
            WHEN MIN(a.event_date) = f.first_login + INTERVAL '1 day' 
            THEN 1 ELSE 0 
        END AS next_day
    FROM Activity a
    INNER JOIN FirstLogin f ON a.player_id = f.player_id
    WHERE a.event_date > f.first_login
    GROUP BY a.player_id, f.first_login
)
SELECT 
    ROUND(
        COALESCE(SUM(next_day), 0) * 1.0 / 
        (SELECT COUNT(DISTINCT player_id) FROM Activity),
        2
    ) AS fraction;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - ranking + filtering |
| Space | O(n) - intermediate result set |

## Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| ROW_NUMBER | O(n log n) | O(n) | **Recommended** - Unique positions, removing duplicates |
| RANK | O(n log n) | O(n) | Olympic-style rankings with gaps |
| DENSE_RANK | O(n log n) | O(n) | **Recommended** - Nth highest without gaps |
| With PARTITION BY | O(n log n) | O(n) | Per-group rankings |

## Ranking Functions Comparison

| Function | Ties Handling | Example (100,100,90,80) | Use Case |
|----------|---------------|-------------------------|----------|
| ROW_NUMBER | Unique numbers | 1,2,3,4 | **Recommended** - Pagination, deduplication |
| RANK | Same rank, gaps | 1,1,3,4 | Olympic rankings, leaderboard positions |
| DENSE_RANK | Same rank, no gaps | 1,1,2,3 | Nth highest, consecutive rankings |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| Second Highest Salary | 176 | Easy | Nth highest with ranking functions |
| Nth Highest Salary | 177 | Medium | Function returning Nth highest |
| Rank Scores | 178 | Medium | Basic RANK() function usage |
| Department Top Three Salaries | 185 | Hard | Top N per group with PARTITION BY |
| Game Play Analysis IV | 534 | Medium | CTEs with date ranking and aggregation |

## Key Takeaways

- **ROW_NUMBER**: Always unique; use for pagination and deduplication
- **RANK**: Ties get same number, gaps follow; use for competition rankings
- **DENSE_RANK**: Ties get same number, no gaps; use for Nth highest queries
- **PARTITION BY**: Resets ranking per group; essential for "top N per category"
- **Subquery required**: Must wrap and filter—cannot use window functions in WHERE clause
- **NULLS handling**: NULLS FIRST or NULLS LAST in ORDER BY controls null placement

## Common Pitfalls

1. **Using window functions in WHERE clause** - Must use subquery/CTE instead
2. **Wrong ranking function for ties** - ROW_NUMBER skips tied values; RANK/DENSE_RANK include them
3. **Forgetting PARTITION BY** - Without it, ranking is global not per-group
4. **Not handling NULL results** - Nth highest may return NULL if N > distinct values
5. **Assuming 1-based indexing** - Always starts at 1, but verify N matches your expectation
6. **Ordering direction** - DESC for highest first, ASC for lowest first

## Pattern Source

[Ranking Functions](sql/ranking-functions.md)
