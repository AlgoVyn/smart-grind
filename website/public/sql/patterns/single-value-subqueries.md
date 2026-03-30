# Single Value Subqueries

## Problem Description

The Single Value Subqueries pattern involves subqueries that return exactly one value (scalar subqueries) for use in comparisons, calculations, or as derived values. These subqueries are powerful for lookups, calculations, and conditional logic where a single scalar value is required.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n) - linear scan per subquery execution |
| Space Complexity | O(1) - single value returned |
| Input | Table, condition returning single row with single column |
| Output | Single scalar value |
| Approach | Execute subquery → Return single value → Use in outer query |

### When to Use

- Single value lookup from another table (e.g., maximum, minimum, average)
- Comparisons in WHERE clause requiring a calculated threshold
- Derived values in SELECT clause (computed columns)
- Row-dependent lookups using correlated subqueries
- Finding Nth values using offset-based subqueries
- Conditional logic based on aggregate values

## Intuition

The key insight is **scalar requirement**. A scalar subquery must return exactly one value (one row, one column). If it returns zero rows or multiple rows, the query will error.

The "aha!" moments:

1. **Executed per row**: Correlated subqueries execute once for each row in the outer query
2. **Single value requirement**: Must guarantee exactly one value (use MAX/MIN or LIMIT 1)
3. **Correlation possible**: Can reference outer query columns for row-dependent lookups
4. **Flexible placement**: Can appear in SELECT, WHERE, HAVING, or ORDER BY clauses
5. **Alternative to JOIN**: Sometimes cleaner than JOIN for single value retrieval

## Solution Approaches

### Approach 1: Scalar Subquery in SELECT ✅ Derived Column

#### Algorithm

1. Write the main SELECT statement
2. Add a column using a subquery that returns a single value
3. The subquery can be correlated (reference outer table) or non-correlated
4. Execute outer query with derived values computed

#### Implementation

**Problem: Department Highest Salary (SQL-184)**

```sql
-- Find the highest salary in each department
SELECT 
    d.name AS Department,
    d.id AS DepartmentId,
    (SELECT MAX(salary) 
     FROM Employee e 
     WHERE e.departmentId = d.id) AS HighestSalary
FROM Department d;
```

**Derived Value Calculation:**

```sql
-- Calculate difference from department average
SELECT 
    name,
    salary,
    departmentId,
    salary - (SELECT AVG(salary) 
              FROM Employee e2 
              WHERE e2.departmentId = e1.departmentId) AS diff_from_avg
FROM Employee e1;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × m) - subquery executes for each outer row |
| Space | O(1) - single value per subquery execution |

### Approach 2: Scalar Subquery in WHERE ✅ Comparison Value

#### Algorithm

1. Determine the comparison threshold needed
2. Write a subquery that returns the single comparison value
3. Use the subquery result in WHERE clause comparison
4. Filter outer query rows based on the comparison

#### Implementation

**Problem: Second Highest Salary (SQL-176)**

```sql
-- Find the second highest salary using subquery in WHERE
SELECT MAX(salary) AS SecondHighestSalary
FROM Employee
WHERE salary < (SELECT MAX(salary) FROM Employee);
```

**Problem: Employees Earning More Than Their Managers (SQL-181)**

```sql
-- Find employees with salary greater than average department salary
SELECT name
FROM Employee e1
WHERE salary > (
    SELECT AVG(salary) 
    FROM Employee e2 
    WHERE e2.departmentId = e1.departmentId
);
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n + m) - subquery executes once, then scan outer table |
| Space | O(1) - single comparison value |

### Approach 3: Finding Nth Value with Subquery ✅ Offset Technique

#### Algorithm

1. Determine the N value needed
2. Calculate offset as N - 1
3. Use ORDER BY with LIMIT 1 OFFSET to get Nth value
4. Handle NULL when fewer than N values exist

#### Implementation

**Problem: Nth Highest Salary (SQL-177)**

```sql
-- Create a function to find Nth highest salary
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

**Alternative with NULL Handling:**

```sql
-- Handle case when Nth salary doesn't exist
SELECT (
    SELECT DISTINCT salary
    FROM Employee
    ORDER BY salary DESC
    LIMIT 1 OFFSET N - 1
) AS getNthHighestSalary;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - due to sorting |
| Space | O(n) - for sorting intermediate results |

### Approach 4: Correlated Scalar Subquery ✅ Row-Dependent Lookup

#### Algorithm

1. Identify the outer table row data needed in the subquery
2. Write subquery referencing outer table columns
3. Ensure subquery returns exactly one value per outer row
4. Use result in SELECT, WHERE, or other clauses

#### Implementation

**Department-Specific Maximum Lookup:**

```sql
-- Find employees with the highest salary in their department
SELECT e1.name, e1.salary, e1.departmentId
FROM Employee e1
WHERE e1.salary = (
    SELECT MAX(e2.salary)
    FROM Employee e2
    WHERE e2.departmentId = e1.departmentId
);
```

**Correlated Subquery with Multiple Conditions:**

```sql
-- Find employees earning above their department's average
SELECT 
    e1.name,
    e1.salary,
    e1.departmentId,
    (SELECT AVG(salary) 
     FROM Employee e2 
     WHERE e2.departmentId = e1.departmentId) AS dept_avg
FROM Employee e1
WHERE e1.salary > (
    SELECT AVG(salary) 
    FROM Employee e3 
    WHERE e3.departmentId = e1.departmentId
);
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × m) - subquery executes for each outer row |
| Space | O(1) - single value per execution |

## Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| SELECT Scalar Subquery | O(n × m) | O(1) | Derived columns, correlated calculations |
| WHERE Scalar Subquery | O(n + m) | O(1) | **Recommended** - single comparison value |
| Nth Value Subquery | O(n log n) | O(n) | Ranking, Nth highest/lowest |
| Correlated Subquery | O(n × m) | O(1) | Row-dependent lookups |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| Second Highest Salary | 176 | Easy | Subquery in WHERE for comparison value |
| Nth Highest Salary | 177 | Medium | Function with OFFSET subquery |
| Department Highest Salary | 184 | Medium | Correlated subquery in SELECT |

## Key Takeaways

- **Single value guarantee**: Use aggregate functions (MAX, MIN, AVG) or LIMIT 1 to ensure single value
- **Correlation power**: Reference outer query columns for row-dependent calculations
- **Performance trade-off**: Correlated subqueries execute per row (O(n×m)) vs non-correlated execute once (O(n+m))
- **NULL handling**: Scalar subquery returning no rows results in NULL, not error
- **Alternative to JOIN**: Often cleaner syntax than JOIN when only one value needed

## Common Pitfalls

1. **Multiple rows error**: Subquery returning more than one row causes runtime error
2. **No rows handling**: Empty result returns NULL (may cause unexpected comparisons)
3. **N+1 problem**: Correlated subqueries in SELECT can cause performance issues on large datasets
4. **Missing correlation**: Forgetting to correlate when row-dependent lookup is intended
5. ** OFFSET 0-based**: Remember Nth value requires OFFSET N-1
6. **DISTINCT necessity**: May need DISTINCT when finding Nth unique values

## Pattern Source

[Single Value Subqueries](sql/single-value-subqueries.md)
