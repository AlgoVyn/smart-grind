# INNER JOIN

## Problem Description

The INNER JOIN pattern matches and combines rows from two tables based on a related column, returning only rows where there is a match in both tables. This is the most common type of join used to correlate data across related tables.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n × m) - nested loop worst case, O(n log n) - with index |
| Space Complexity | O(k) - k matching rows returned |
| Input | Two tables, join condition |
| Output | Rows where join condition matches in both tables |
| Approach | Match → Filter → Combine columns |

### When to Use

- **Combining related tables**: Linking tables with foreign key relationships (e.g., orders and customers)
- **Filtering unmatched records**: When you only want rows that exist in both tables
- **Matching on keys**: Joining on primary key / foreign key relationships
- **Correlating records**: Connecting data across tables (e.g., employees and departments)
- **Multi-table queries**: When all related records must exist for the result to be valid

## Intuition

The key insight is **filtered Cartesian product**. Without a join condition, combining two tables would produce every possible combination (Cartesian product). The INNER JOIN adds a filter - only combinations where the join condition is satisfied are kept.

The "aha!" moments:

1. **Cartesian product filtered**: JOIN starts with all combinations, keeps only matches
2. **Join conditions**: The ON clause acts as a filter on the Cartesian product
3. **Table aliases**: Essential for distinguishing columns and self-joins (use `e` for employee, `m` for manager)
4. **Column qualification**: Always prefix ambiguous columns with table names/aliases
5. **Set intersection**: INNER JOIN produces the intersection of two tables based on matching keys

## Solution Approaches

### Approach 1: Basic INNER JOIN - Two Table Join ✅ Recommended

#### Algorithm

1. Identify the primary table (left table)
2. Identify the related table (right table)
3. Determine the join key(s) connecting the tables
4. Write JOIN with ON clause specifying the join condition
5. Select columns from either or both tables

#### Implementation

**Problem: Combine Two Tables (SQL-175)**

```sql
-- Retrieve person name with their city and state
SELECT 
    p.firstName,
    p.lastName,
    a.city,
    a.state
FROM Person p
INNER JOIN Address a ON p.personId = a.personId;
```

**Simple Two-Table Join:**

```sql
-- Join orders with customers
SELECT 
    o.order_id,
    c.customer_name,
    o.order_date
FROM Orders o
INNER JOIN Customers c ON o.customer_id = c.customer_id;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × m) worst case, O(n log n) with proper indexing |
| Space | O(k) - only matching rows |

### Approach 2: Join with Multiple Conditions - AND in ON Clause

When a single join condition isn't sufficient, use multiple conditions combined with AND.

#### Algorithm

1. Identify all required matching criteria
2. Add multiple conditions to the ON clause using AND
3. Use additional filters in WHERE clause for result filtering

#### Implementation

**Multiple Conditions in ON Clause:**

```sql
-- Join with multiple matching criteria
SELECT 
    e.name,
    d.department_name,
    p.project_name
FROM Employees e
INNER JOIN Departments d 
    ON e.department_id = d.department_id 
    AND e.location_id = d.location_id
WHERE e.status = 'Active';
```

**Problem: Trips and Users (SQL-262) - Multi-condition join concept**

```sql
-- Join with date range condition in ON clause
SELECT 
    t.request_at AS Day,
    ROUND(
        SUM(CASE WHEN t.status != 'completed' THEN 1 ELSE 0 END) / COUNT(*),
        2
    ) AS CancellationRate
FROM Trips t
INNER JOIN Users u 
    ON t.client_id = u.users_id 
    AND u.banned = 'No'
WHERE t.request_at BETWEEN '2013-10-01' AND '2013-10-03'
GROUP BY t.request_at;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × m) - more restrictive conditions may reduce matches |
| Space | O(k) - fewer rows when conditions are more selective |

### Approach 3: Joining with Derived Tables - Subquery as Table

Join with subqueries or CTEs for complex filtering before the join operation.

#### Algorithm

1. Create a derived table (subquery or CTE) with filtered/aggregated data
2. Join the main table with this derived table
3. Select columns from both sources

#### Implementation

**Join with Subquery:**

```sql
-- Join with aggregated subquery
SELECT 
    e.name,
    d.department_name,
    high_earners.avg_salary
FROM Employees e
INNER JOIN Departments d ON e.department_id = d.department_id
INNER JOIN (
    SELECT department_id, AVG(salary) AS avg_salary
    FROM Employees
    GROUP BY department_id
    HAVING AVG(salary) > 50000
) high_earners ON d.department_id = high_earners.department_id;
```

**Join with CTE:**

```sql
-- Using Common Table Expression for readability
WITH RecentOrders AS (
    SELECT *
    FROM Orders
    WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
)
SELECT 
    c.customer_name,
    ro.order_id,
    ro.order_date
FROM Customers c
INNER JOIN RecentOrders ro ON c.customer_id = ro.customer_id;
```

**Problem: Trips and Users (SQL-262) - Derived table approach**

```sql
-- Using derived table for banned users filter
SELECT 
    t.request_at AS Day,
    ROUND(
        SUM(CASE WHEN t.status != 'completed' THEN 1 ELSE 0 END) * 1.0 / COUNT(*),
        2
    ) AS CancellationRate
FROM Trips t
INNER JOIN (
    SELECT users_id
    FROM Users
    WHERE banned = 'No'
) valid_users ON t.client_id = valid_users.users_id
WHERE t.request_at BETWEEN '2013-10-01' AND '2013-10-03'
GROUP BY t.request_at
ORDER BY t.request_at;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × m + p) - includes subquery execution time |
| Space | O(k + p) - space for subquery results |

### Approach 4: Self-Join Pattern - Joining Table to Itself

Join a table to itself using different aliases to compare rows within the same table.

#### Algorithm

1. Assign different aliases to the same table in FROM and JOIN clauses
2. Define the relationship between the two instances (e.g., employee → manager)
3. Compare columns from both instances

#### Implementation

**Problem: Employees Earning More Than Their Managers (SQL-181)**

```sql
-- Self-join to compare employee with their manager
SELECT e.name AS Employee
FROM Employee e
INNER JOIN Employee m ON e.managerId = m.id
WHERE e.salary > m.salary;
```

**Self-Join with Multiple Levels:**

```sql
-- Find employees, their managers, and their directors
SELECT 
    e.name AS Employee,
    m.name AS Manager,
    d.name AS Director
FROM Employee e
INNER JOIN Employee m ON e.managerId = m.id
INNER JOIN Employee d ON m.managerId = d.id;
```

**Self-Join for Hierarchical Data:**

```sql
-- Find all subordinates of a specific manager
SELECT e.name AS Subordinate
FROM Employee e
INNER JOIN Employee m ON e.managerId = m.id
WHERE m.name = 'John Smith';
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n²) - joining table with itself |
| Space | O(k) - matching hierarchical relationships |

## Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| Basic INNER JOIN | O(n × m) | O(k) | **Recommended** - standard two-table relationships |
| Multiple Conditions | O(n × m) | O(k) | Complex join criteria with multiple criteria |
| Join with Derived Tables | O(n × m + p) | O(k + p) | Pre-filtered or aggregated data joins |
| Self-Join | O(n²) | O(k) | Hierarchical or intra-table comparisons |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| Combine Two Tables | 175 | Easy | Basic INNER JOIN |
| Employees Earning More Than Managers | 181 | Easy | Self-join with comparison |
| Trips and Users | 262 | Hard | Multi-table join with aggregation |
| Department Highest Salary | 184 | Medium | Join with GROUP BY |
| Rank Scores | 178 | Medium | Self-join for ranking |
| Delete Duplicate Emails | 196 | Easy | Self-join to find duplicates |
| Rising Temperature | 197 | Easy | Self-join with date comparison |

## Key Takeaways

- **Match requirement**: Only returns rows with matches in both tables (set intersection)
- **Column qualification**: Always use table aliases to resolve ambiguous column names
- **Index importance**: Indexes on join columns dramatically improve performance
- **ON vs WHERE**: Use ON for join conditions, WHERE for filtering results after join
- **Self-join aliases**: Essential for hierarchical data - use meaningful aliases (e, m for employee/manager)
- **Cartesian product**: Remember JOIN filters the Cartesian product to matching rows only

## Common Pitfalls

1. **Unqualified column names**: Error when both tables have columns with the same name
2. **Expecting unmatched rows**: Use LEFT JOIN when you need all rows from one table
3. **Missing join conditions**: Creates Cartesian product (every row × every row)
4. **Joining on non-indexed columns**: Severe performance impact on large tables
5. **Confusing INNER with OUTER**: INNER excludes non-matching rows; LEFT/RIGHT include them
6. **Self-join without aliases**: Must use different aliases for the same table

## Join Type Comparison

| Join Type | Behavior | Use Case |
|-----------|----------|----------|
| INNER JOIN | Only matching rows | **Recommended** - when relationship must exist |
| LEFT JOIN | All left rows + matching right | When left table data is required regardless |
| RIGHT JOIN | Matching left + all right rows | Rarely used (use LEFT JOIN instead) |
| FULL OUTER JOIN | All rows from both tables | When you need all data from both sides |
| CROSS JOIN | All combinations | Cartesian product, rarely needed |

## Pattern Source

[INNER JOIN](sql/inner-join.md)
