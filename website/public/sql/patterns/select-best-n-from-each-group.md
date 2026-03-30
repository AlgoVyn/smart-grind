# Select Best N from Each Group

## Problem Description

The Select Best N from Each Group pattern retrieves the top N records within each group or category defined by a grouping column. This pattern extends basic ranking by adding a partitioning dimension—ranking restarts for each distinct group value.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n log n) - sorting within each partition |
| Space Complexity | O(n) - window function buffer per partition |
| Input | Table, grouping columns, ordering columns, limit count |
| Output | Top N rows per group based on ordering criteria |
| Approach | Window function with PARTITION BY and ORDER BY |

### When to Use

- **Top performers per category**: Top 3 products per category, highest paid per department
- **Rankings within groups**: Employee rankings within each department
- **Filtering partitioned data**: Select rows meeting criteria within each partition
- **Per-group leaderboards**: Show top N players per game level
- **Category-based analysis**: Best customers per region, top stocks per sector
- **Hierarchical reporting**: Best results per team, per manager, per division

## Intuition

The key insight is **partitioned ranking**. Instead of ranking all rows together, we create separate ranking windows for each group—like having independent leaderboards for each category.

The "aha!" moments:

1. **PARTITION BY defines groups**: Each unique combination of partition columns creates a separate ranking window
2. **ORDER BY determines ranking**: Within each partition, rows are sorted and ranked independently
3. **Filter after numbering**: Cannot filter by window function directly; must use subquery/CTE
4. **Ranking function choice matters**: ROW_NUMBER for unique positions, RANK/DENSE_RANK for ties
5. **Cross-partition independence**: Rankings in one group don't affect other groups

## Solution Approaches

### Approach 1: ROW_NUMBER with PARTITION - Unique Ranking

ROW_NUMBER() with PARTITION BY assigns unique sequential numbers within each group. Even with ties, each row in a partition gets a distinct number.

#### Algorithm

1. Identify grouping columns (PARTITION BY)
2. Determine ordering criteria (ORDER BY)
3. Add secondary sort for deterministic tie-breaking
4. Apply ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...)
5. Wrap in subquery and filter WHERE row_num <= N

#### Implementation

**Problem: Department Top Three Salaries (SQL-185)**

```sql
-- Top 3 unique salaries per department
SELECT 
    d.name AS Department,
    e.name AS Employee,
    e.salary AS Salary
FROM (
    SELECT 
        name,
        salary,
        departmentId,
        ROW_NUMBER() OVER (
            PARTITION BY departmentId 
            ORDER BY salary DESC, name ASC
        ) AS rn
    FROM Employee
) e
INNER JOIN Department d ON e.departmentId = d.id
WHERE e.rn <= 3;
```

**Basic ROW_NUMBER Per Group:**

```sql
-- Top 2 products by price per category
SELECT category_id, product_name, price
FROM (
    SELECT 
        category_id,
        product_name,
        price,
        ROW_NUMBER() OVER (
            PARTITION BY category_id 
            ORDER BY price DESC
        ) AS rn
    FROM Products
) ranked
WHERE rn <= 2;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - sorting per partition |
| Space | O(n) - window function buffer |

### Approach 2: RANK with PARTITION - With Ties

RANK() with PARTITION BY assigns the same rank to tied values within each group, with gaps after ties. Use when tied values should all be included in the result.

#### Algorithm

1. Define partition columns for grouping
2. Specify ordering criteria for ranking
3. Apply RANK() OVER (PARTITION BY ... ORDER BY ...)
4. Tied values receive same rank within each partition
5. Filter WHERE rank <= N in outer query

#### Implementation

**Problem: Department Top Three Salaries (SQL-185 variant with ties)**

```sql
-- Top 3 salaries per department including ties
SELECT 
    d.name AS Department,
    e.name AS Employee,
    e.salary AS Salary
FROM (
    SELECT 
        name,
        salary,
        departmentId,
        RANK() OVER (
            PARTITION BY departmentId 
            ORDER BY salary DESC
        ) AS rnk
    FROM Employee
) e
INNER JOIN Department d ON e.departmentId = d.id
WHERE e.rnk <= 3;
```

**RANK with Ties Example:**

```sql
-- Top 2 scores per subject including ties
SELECT student_id, subject, score
FROM (
    SELECT 
        student_id,
        subject,
        score,
        RANK() OVER (
            PARTITION BY subject 
            ORDER BY score DESC
        ) AS rnk
    FROM Scores
) ranked
WHERE rnk <= 2;

-- Result: If 3 students tie for #1, all 3 are returned
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) |
| Space | O(n) |

### Approach 3: DENSE_RANK with PARTITION - No Gap Ranking

DENSE_RANK() with PARTITION BY assigns the same rank to ties but continues sequentially without gaps. Best for "Nth best per group" queries.

#### Algorithm

1. Define partition columns for grouping
2. Specify ordering criteria for ranking
3. Apply DENSE_RANK() OVER (PARTITION BY ... ORDER BY ...)
4. Tied values receive same rank, next rank is sequential
5. Filter WHERE dense_rank <= N in outer query

#### Implementation

**Problem: Friend Requests II (SQL-602) - Top requesters**

```sql
WITH RequestCounts AS (
    SELECT 
        requester_id AS id,
        COUNT(*) AS num
    FROM RequestAccepted
    GROUP BY requester_id
),
AcceptCounts AS (
    SELECT 
        accepter_id AS id,
        COUNT(*) AS num
    FROM RequestAccepted
    GROUP BY accepter_id
),
TotalCounts AS (
    SELECT 
        id,
        SUM(num) AS num
    FROM (
        SELECT * FROM RequestCounts
        UNION ALL
        SELECT * FROM AcceptCounts
    ) combined
    GROUP BY id
)
SELECT id, num
FROM (
    SELECT 
        id,
        num,
        DENSE_RANK() OVER (ORDER BY num DESC) AS rnk
    FROM TotalCounts
) ranked
WHERE rnk = 1;
```

**DENSE_RANK Per Group Example:**

```sql
-- Find 2nd highest salary per department (no gaps)
SELECT department_id, name, salary
FROM (
    SELECT 
        department_id,
        name,
        salary,
        DENSE_RANK() OVER (
            PARTITION BY department_id 
            ORDER BY salary DESC
        ) AS drnk
    FROM Employee
) ranked
WHERE drnk = 2;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) |
| Space | O(n) |

### Approach 4: Correlated Subquery Alternative - Pre-Window Function

For databases without window function support, use correlated subqueries to count rows within each group.

#### Algorithm

1. For each row, count how many rows in same group have higher/equal values
2. Filter to keep only rows where count < N
3. Use GROUP BY with HAVING for alternative approach
4. Less efficient but works on older MySQL (< 8.0)

#### Implementation

**Without Window Functions:**

```sql
-- Top N per group using correlated subquery (pre-MySQL 8.0)
SELECT e1.department_id, e1.name, e1.salary
FROM Employee e1
WHERE (
    SELECT COUNT(*)
    FROM Employee e2
    WHERE e2.department_id = e1.department_id
      AND e2.salary > e1.salary
) < 3;
```

**Using JOIN and GROUP BY:**

```sql
-- Alternative: Self-join approach
SELECT e1.department_id, e1.name, e1.salary
FROM Employee e1
LEFT JOIN Employee e2 
    ON e2.department_id = e1.department_id 
    AND e2.salary > e1.salary
GROUP BY e1.department_id, e1.name, e1.salary
HAVING COUNT(e2.employee_id) < 3;
```

**Problem: Market Analysis I (SQL-1077) - Buyer Ranking**

```sql
-- Orders by each user, with seller city info
SELECT 
    u.user_id AS buyer_id,
    u.join_date,
    COUNT(o.order_id) AS orders_in_2019
FROM Users u
LEFT JOIN Orders o 
    ON u.user_id = o.buyer_id 
    AND YEAR(o.order_date) = 2019
GROUP BY u.user_id, u.join_date;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n²) - correlated subquery scans per row |
| Space | O(1) - minimal extra space |

## Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| ROW_NUMBER + PARTITION | O(n log n) | O(n) | **Recommended** - Unique top N per group |
| RANK + PARTITION | O(n log n) | O(n) | Top N with ties included |
| DENSE_RANK + PARTITION | O(n log n) | O(n) | **Recommended** - Nth best per group |
| Correlated Subquery | O(n²) | O(1) | Legacy database support |

## Ranking Functions with PARTITION Comparison

| Function | Ties in Group | Example (salaries: 100,100,90,80) | Use Case |
|----------|---------------|-----------------------------------|----------|
| ROW_NUMBER | Unique per group | 1,2,3,4 | **Recommended** - Exactly N per group |
| RANK | Same rank, gaps | 1,1,3,4 | Include all ties, may exceed N |
| DENSE_RANK | Same rank, no gaps | 1,1,2,3 | Nth best unique value per group |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| Department Top Three Salaries | 185 | Hard | Top 3 salaries per department |
| Friend Requests II | 602 | Medium | Who has most friends (ranking) |
| Market Analysis I | 1077 | Medium | User orders with ranking analysis |
| Rank Scores | 178 | Medium | Basic ranking with DENSE_RANK |
| Second Highest Salary | 176 | Medium | Nth highest pattern |

## Key Takeaways

- **PARTITION BY creates independent groups**: Rankings restart for each partition
- **ROW_NUMBER for exact N**: Guarantees exactly N rows per group (or fewer if group has < N rows)
- **RANK/DENSE_RANK for ties**: May return more than N rows if ties exist
- **Subquery required**: Always wrap partitioned ranking in CTE or subquery before filtering
- **Multiple partition columns**: `PARTITION BY col1, col2` for nested groupings
- **Order direction matters**: DESC for highest first, ASC for lowest first
- **Handle empty groups**: Some groups may have fewer than N rows

## Common Pitfalls

1. **Forgetting PARTITION BY**: Without it, ranking is global instead of per-group
2. **Using window function in WHERE clause**: Must use subquery/CTE to filter by rank
3. **Wrong ranking function choice**: ROW_NUMBER arbitrarily breaks ties; use RANK/DENSE_RANK to include ties
4. **Assuming exactly N rows**: RANK/DENSE_RANK may return more than N rows with ties
5. **Not handling NULL in ordering**: NULLS FIRST/LAST affects which rows are "top"
6. **Multiple columns in PARTITION BY**: Order doesn't matter for partition columns
7. **Performance with many partitions**: Large number of small partitions is still O(n log n)

## Pattern Source

[Select Best N from Each Group](sql/select-best-n-from-each-group.md)
