# Non-Recursive CTEs

## Problem Description

The Non-Recursive CTEs (Common Table Expressions) pattern creates named temporary result sets using the `WITH` clause. CTEs improve query readability by breaking complex logic into named, reusable subqueries that can be referenced multiple times in the main query.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n) per CTE, linear with data size |
| Space Complexity | O(n) - materialized temporarily for query execution |
| Input | One or more SELECT queries, main query referencing them |
| Output | Combined result set from the main query |
| Approach | Named subqueries executed before main query |

### When to Use

- **Improving readability**: Breaking complex queries into logical, named steps
- **Multiple references**: When the same subquery is needed in multiple places
- **Breaking complexity**: Simplifying multi-step calculations or aggregations
- **Self-documenting code**: Named CTEs act as inline documentation
- **Preparing data**: Filtering, aggregating, or transforming data before final operations
- **Avoiding repetition**: Eliminating copy-pasted subqueries throughout a query

## Intuition

The key insight is **named subqueries executed once**. A CTE defines a temporary named result set that exists only for the duration of the query execution. Think of it as creating a temporary view that you can reference by name.

The "aha!" moments:

1. **Named subqueries**: Instead of anonymous subqueries, give them descriptive names (e.g., `HighEarners`, `RecentSales`)
2. **Execution order**: CTEs execute before the main query, making their results available for use
3. **Recursion not required**: Non-recursive CTEs run once and do not reference themselves
4. **Chaining CTEs**: Multiple CTEs can be defined and can reference earlier CTEs in the chain
5. **Scope limitation**: CTEs only exist for the current query—no persistent storage needed

## Solution Approaches

### Approach 1: Basic CTE - Single Named Result Set ✅ Recommended

Define a single CTE to isolate a logical step of the query, improving clarity and maintainability.

#### Algorithm

1. Identify the subquery that would benefit from a name
2. Write `WITH CteName AS (...)` before the main query
3. Reference the CTE by name in the main query
4. Execute the main query using the CTE's results

#### Implementation

**Basic Single CTE:**

```sql
-- Calculate average salary first, then find employees above it
WITH AvgSalary AS (
    SELECT AVG(salary) AS avg_sal
    FROM Employee
)
SELECT e.name, e.salary
FROM Employee e, AvgSalary a
WHERE e.salary > a.avg_sal;
```

**Problem: Department Highest Salary (SQL-184)**

```sql
-- Use CTE to find max salary per department first
WITH DeptMax AS (
    SELECT 
        departmentId,
        MAX(salary) AS max_salary
    FROM Employee
    GROUP BY departmentId
)
SELECT 
    d.name AS Department,
    e.name AS Employee,
    e.salary AS Salary
FROM Employee e
INNER JOIN DeptMax dm 
    ON e.departmentId = dm.departmentId 
    AND e.salary = dm.max_salary
INNER JOIN Department d ON e.departmentId = d.id;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - linear scan for CTE + main query execution |
| Space | O(k) - temporary storage for CTE results |

### Approach 2: Multiple CTEs - Chained WITH Clauses

Chain multiple CTEs together, where later CTEs can reference earlier ones, building up complex logic step by step.

#### Algorithm

1. Define the first CTE with the base calculation
2. Add additional CTEs separated by commas
3. Reference earlier CTEs in subsequent CTE definitions
4. Use final results in the main query

#### Implementation

**Chained CTEs:**

```sql
-- Multiple CTEs building on each other
WITH SalesByProduct AS (
    SELECT 
        product_id,
        SUM(quantity) AS total_sold
    FROM Sales
    GROUP BY product_id
),
TopProducts AS (
    SELECT product_id
    FROM SalesByProduct
    WHERE total_sold > 1000
)
SELECT p.product_name, s.total_sold
FROM Products p
INNER JOIN SalesByProduct s ON p.product_id = s.product_id
INNER JOIN TopProducts t ON p.product_id = t.product_id;
```

**Problem: Game Play Analysis II (SQL-512)**

```sql
-- Find first login, then get device used
WITH FirstLogin AS (
    SELECT 
        player_id,
        MIN(event_date) AS first_login
    FROM Activity
    GROUP BY player_id
)
SELECT 
    a.player_id,
    a.device_id
FROM Activity a
INNER JOIN FirstLogin f 
    ON a.player_id = f.player_id 
    AND a.event_date = f.first_login;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n + m) - sum of all CTE executions |
| Space | O(k + p) - storage for multiple CTE results |

### Approach 3: CTE with Aggregation - Named Aggregation Step

Use CTEs to isolate aggregation operations, making complex multi-level aggregations clearer and more maintainable.

#### Algorithm

1. Define CTE with aggregation (GROUP BY, HAVING)
2. Name the aggregated results descriptively
3. Join or filter against aggregated values in main query
4. Reference aggregated columns by their aliases

#### Implementation

**CTE with Aggregation:**

```sql
-- Calculate department statistics, then filter employees
WITH DeptStats AS (
    SELECT 
        department_id,
        AVG(salary) AS avg_salary,
        MAX(salary) AS max_salary,
        COUNT(*) AS employee_count
    FROM Employees
    GROUP BY department_id
    HAVING COUNT(*) >= 5
)
SELECT 
    e.name,
    e.salary,
    d.department_name,
    s.avg_salary,
    e.salary - s.avg_salary AS diff_from_avg
FROM Employees e
INNER JOIN DeptStats s ON e.department_id = s.department_id
INNER JOIN Departments d ON e.department_id = d.department_id
WHERE e.salary > s.avg_salary;
```

**Problem: Department Top Three Salaries (SQL-185)**

```sql
-- Rank employees within departments using CTE
WITH RankedEmployees AS (
    SELECT 
        name,
        salary,
        departmentId,
        DENSE_RANK() OVER (
            PARTITION BY departmentId 
            ORDER BY salary DESC
        ) AS salary_rank
    FROM Employee
)
SELECT 
    d.name AS Department,
    re.name AS Employee,
    re.salary AS Salary
FROM RankedEmployees re
INNER JOIN Department d ON re.departmentId = d.id
WHERE re.salary_rank <= 3;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - includes sorting for window functions |
| Space | O(n) - storage for window function results |

### Approach 4: CTE with Joins - Simplifying Complex Joins

Use CTEs to pre-filter or pre-join tables, simplifying the main query's logic and improving readability.

#### Algorithm

1. Identify complex joins that can be isolated
2. Create CTE for pre-filtered or pre-joined data
3. Reference the simplified CTE in main query
4. Reduces repetition when same filter is needed multiple times

#### Implementation

**CTE Simplifying Multiple Joins:**

```sql
-- Pre-filter active employees before joining
WITH ActiveEmployees AS (
    SELECT e.*, d.department_name
    FROM Employees e
    INNER JOIN Departments d ON e.department_id = d.department_id
    WHERE e.status = 'Active'
      AND e.hire_date >= '2023-01-01'
)
SELECT 
    ae.name,
    ae.department_name,
    p.project_name
FROM ActiveEmployees ae
LEFT JOIN EmployeeProjects ep ON ae.employee_id = ep.employee_id
LEFT JOIN Projects p ON ep.project_id = p.project_id
WHERE p.end_date IS NULL OR p.end_date > CURDATE();
```

**CTE with Multiple References:**

```sql
-- Reference the same CTE twice without duplication
WITH RecentOrders AS (
    SELECT *
    FROM Orders
    WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
)
SELECT 
    c.customer_name,
    ro1.order_count AS orders_this_month,
    ro2.total_amount AS amount_this_month
FROM Customers c
LEFT JOIN (
    SELECT customer_id, COUNT(*) AS order_count
    FROM RecentOrders
    GROUP BY customer_id
) ro1 ON c.customer_id = ro1.customer_id
LEFT JOIN (
    SELECT customer_id, SUM(amount) AS total_amount
    FROM RecentOrders
    GROUP BY customer_id
) ro2 ON c.customer_id = ro2.customer_id;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × m) - depends on join complexity in CTE |
| Space | O(k) - storage for pre-filtered results |

## Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| Basic CTE | O(n) | O(k) | **Recommended** - Single named subquery |
| Multiple CTEs | O(n + m) | O(k + p) | **Recommended** - Multi-step logic |
| CTE with Aggregation | O(n log n) | O(n) | Pre-aggregated values |
| CTE with Joins | O(n × m) | O(k) | Pre-filtered complex joins |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| Department Highest Salary | 184 | Medium | Max salary per department using CTE |
| Department Top Three Salaries | 185 | Hard | Top N per group with CTE + DENSE_RANK |
| Game Play Analysis II | 512 | Easy | First login with CTE for min date |
| Game Play Analysis IV | 534 | Medium | Multiple CTEs for multi-step analysis |

## Key Takeaways

- **Naming matters**: Use descriptive names that explain what the CTE represents
- **Single execution**: Each CTE runs once, even if referenced multiple times
- **Chaining order**: Earlier CTEs can be referenced by later ones in the same WITH clause
- **No persistence**: CTEs exist only for the current query execution
- **Readability first**: CTEs don't always improve performance—they improve clarity
- **Alternative to subqueries**: CTEs are often more readable than nested subqueries
- **Recursive vs Non-recursive**: Non-recursive CTEs do not reference themselves

## Common Pitfalls

1. **Forgetting comma between CTEs** - Multiple CTEs must be separated by commas, not AND
2. **Referencing CTEs out of order** - A CTE can only reference earlier CTEs in the chain
3. **Attempting recursion** - Non-recursive CTEs cannot reference themselves
4. **Expecting persistence** - CTEs are temporary and gone after query execution
5. **Over-engineering** - Simple queries may not need CTEs; use when complexity demands
6. **Name collisions** - CTE names must be unique within the query scope
7. **Column count mismatch** - When using CTE in joins, ensure column compatibility

## Pattern Source

[Non-Recursive CTEs](sql/non-recursive-ctes.md)
