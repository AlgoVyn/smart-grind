# SELF JOIN

## Problem Description

A SELF JOIN is a regular join where a table is joined with itself, typically using table aliases to distinguish between the two instances. This pattern is essential for comparing rows within the same table, analyzing hierarchical relationships, and finding sequential patterns.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n²) - Cartesian product, O(n log n) with indexing |
| Space Complexity | O(k) - k matching rows returned |
| Input | Single table, self-referential join condition |
| Output | Combined rows from the same table |
| Approach | Alias → Join → Compare columns |

### When to Use

- **Hierarchical data**: Manager-employee relationships, parent-child categories
- **Sequential comparison**: Comparing consecutive records (dates, temperatures, prices)
- **Finding pairs**: Matching records that satisfy certain criteria within the same table
- **Row-to-row analysis**: Finding duplicates, consecutive values, or related records
- **Time-series analysis**: Finding next/previous values, calculating differences

## Intuition

The key insight is that **the same table can act as two different tables** by using different aliases. This creates a Cartesian product of the table with itself, allowing row-to-row comparisons.

The "aha!" moments:

1. **Table aliases are required**: You MUST use aliases to distinguish the two instances (e.g., `a` and `b`, or `e` and `m`)
2. **Cartesian product**: Without a proper join condition, you get every row paired with every other row (n² combinations)
3. **Row-to-row comparison**: You can compare any column from instance A with any column from instance B
4. **Same table, different perspective**: One alias represents "current row," another represents "related row"
5. **Excluding self-pairs**: Often need `a.id != b.id` to avoid comparing a row with itself

## Solution Approaches

### Approach 1: Basic Self-Join - Comparing Rows in Same Table ✅ Recommended

#### Algorithm

1. Identify the table to join with itself
2. Assign two different aliases (e.g., `t1`, `t2`)
3. Determine the join condition linking rows
4. Write JOIN with ON clause specifying the relationship
5. Compare columns between the two instances

#### Implementation

**Problem: Rising Temperature (SQL-197)**

```sql
-- Compare temperatures between consecutive days
SELECT w1.id
FROM Weather w1
INNER JOIN Weather w2 ON w1.recordDate = DATE_ADD(w2.recordDate, INTERVAL 1 DAY)
WHERE w1.temperature > w2.temperature;
```

**Problem: Consecutive Numbers (SQL-180)**

```sql
-- Find consecutive numbers by self-joining three times
SELECT DISTINCT l1.Num AS ConsecutiveNums
FROM Logs l1
INNER JOIN Logs l2 ON l1.Id = l2.Id - 1
INNER JOIN Logs l3 ON l1.Id = l3.Id - 2
WHERE l1.Num = l2.Num AND l2.Num = l3.Num;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n²) worst case, O(n) with indexing |
| Space | O(k) - only matching rows |

### Approach 2: Sequential Analysis - Comparing Consecutive Rows

Used for time-series data where you need to compare a row with its immediate predecessor or successor.

#### Implementation

**Problem: Game Play Analysis (SQL-534)**

```sql
-- Calculate days between consecutive game sessions
SELECT 
    player_id,
    event_date,
    DATEDIFF(event_date, LAG(event_date) OVER (PARTITION BY player_id ORDER BY event_date)) AS days_between
FROM Activity;
```

**Problem: Department Highest Salary (SQL-184)**

```sql
-- Find highest salary per department using self-join
SELECT 
    d.Name AS Department,
    e1.Name AS Employee,
    e1.Salary
FROM Employee e1
INNER JOIN Department d ON e1.DepartmentId = d.Id
WHERE e1.Salary = (
    SELECT MAX(Salary)
    FROM Employee e2
    WHERE e2.DepartmentId = e1.DepartmentId
);
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - with sorting/partitioning |
| Space | O(n) - window functions need buffering |

### Approach 3: Hierarchical Data - Manager-Employee Relationships

Perfect for organizational charts, parent-child relationships, and tree-structured data.

#### Implementation

**Problem: Employees Earning More Than Their Managers (SQL-181)**

```sql
-- Self-join to compare employee with their manager
SELECT e.name AS Employee
FROM Employee e
INNER JOIN Employee m ON e.managerId = m.id
WHERE e.salary > m.salary;
```

**Problem: Get Employee Department and Manager Info**

```sql
-- Employee with department and manager details
SELECT 
    e.name AS Employee,
    e.salary AS Employee_Salary,
    m.name AS Manager,
    m.salary AS Manager_Salary
FROM Employee e
LEFT JOIN Employee m ON e.managerId = m.id
WHERE e.managerId IS NOT NULL;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - with index on managerId |
| Space | O(k) - matching employee-manager pairs |

### Approach 4: Finding Adjacent/Consecutive Records

Used for finding gaps, consecutive sequences, or related records by position.

#### Implementation

**Problem: Biggest Single Number (SQL-619)**

```sql
-- Find biggest single number (appears only once)
SELECT MAX(num) AS num
FROM (
    SELECT num
    FROM MyNumbers
    GROUP BY num
    HAVING COUNT(*) = 1
) AS unique_numbers;
```

**Problem: Find the Start and End Number of Continuous Ranges (SQL-1285)**

```sql
-- Find continuous ranges using self-join with not exists
SELECT 
    MIN(log_id) AS start_id,
    MAX(log_id) AS end_id
FROM (
    SELECT 
        log_id,
        log_id - ROW_NUMBER() OVER (ORDER BY log_id) AS grp
    FROM Logs
) t
GROUP BY grp;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - due to sorting for grouping |
| Space | O(n) - for derived tables/window functions |

## Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| Basic Self-Join | O(n²) | O(k) | **Recommended** - simple row comparisons |
| Sequential Analysis | O(n log n) | O(n) | Time-series, consecutive data |
| Hierarchical Data | O(n) | O(k) | Manager-employee, tree structures |
| Adjacent Records | O(n log n) | O(n) | Finding gaps and sequences |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| Employees Earning More Than Managers | 181 | Easy | Basic self-join with comparison |
| Rising Temperature | 197 | Easy | Date-based consecutive comparison |
| Consecutive Numbers | 180 | Medium | Multiple self-join for sequence |
| Game Play Analysis I | 511 | Easy | Sequential analysis with aggregation |
| Game Play Analysis IV | 534 | Medium | Consecutive date comparison |
| Human Traffic of Stadium | 601 | Hard | Complex consecutive pattern matching |
| Department Highest Salary | 184 | Medium | Self-join with subquery |
| Biggest Single Number | 619 | Easy | Finding unique values |
| Find the Start and End Number of Continuous Ranges | 1285 | Medium | Finding consecutive sequences |

## Key Takeaways

- **Aliases are mandatory**: Without different aliases, you cannot self-join
- **Cartesian product danger**: Always include a proper join condition to avoid n² results
- **Same table, different rows**: Use one alias for "current" row, another for "related" row
- **Index benefits**: Indexing join columns dramatically improves self-join performance
- **Window functions**: Modern alternative (`LAG`, `LEAD`) for sequential analysis without explicit join

## Common Pitfalls

1. **Forgetting aliases**: Self-join without aliases causes "ambiguous column" errors
2. **Missing join condition**: Results in Cartesian product (every row × every row)
3. **Not excluding self-matches**: Row compared with itself; add `t1.id != t2.id` when needed
4. **Date arithmetic**: Inconsistent date handling across SQL dialects (use `DATE_ADD`, `DATEDIFF`, etc.)
5. **Performance issues**: Self-joins on large tables without indexes are very slow
6. **NULL handling**: LEFT JOIN often needed when not all rows have relationships

## Self-Join Patterns Comparison

| Pattern | Join Condition | Use Case |
|---------|---------------|----------|
| Same Day | `t1.date = t2.date` | Find pairs on same day |
| Consecutive | `t1.date = DATE_ADD(t2.date, INTERVAL 1 DAY)` | Next/previous day comparison |
| Hierarchical | `t1.managerId = t2.id` | Parent-child relationships |
| Positional | `t1.id = t2.id + 1` | Adjacent records by ID |
| Value Match | `t1.value = t2.value AND t1.id != t2.id` | Finding duplicates |

## Pattern Source

[SELF JOIN](sql/join-table-with-itself.md)
