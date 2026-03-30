## Problem

**Department Top Three Salaries**

Find the top 3 unique salaries in each department.

### Schema

**Employee Table:**
| Column Name | Type |
|-------------|------|
| Id | int |
| Name | varchar |
| Salary | int |
| DepartmentId | int |

**Department Table:**
| Column Name | Type |
|-------------|------|
| Id | int |
| Name | varchar |

### Input Example

**Employee:**
| Id | Name | Salary | DepartmentId |
|----|------|--------|--------------|
| 1 | Joe | 85000 | 1 |
| 2 | Henry | 80000 | 2 |
| 3 | Sam | 60000 | 2 |
| 4 | Max | 90000 | 1 |
| 5 | Janet | 69000 | 1 |
| 6 | Randy | 85000 | 1 |
| 7 | Will | 70000 | 1 |

**Department:**
| Id | Name |
|----|------|
| 1 | IT |
| 2 | Sales |

### Output

| Department | Employee | Salary |
|------------|----------|--------|
| IT | Max | 90000 |
| IT | Joe | 85000 |
| IT | Randy | 85000 |
| IT | Will | 70000 |
| Sales | Henry | 80000 |
| Sales | Sam | 60000 |

*Note: IT department shows 4 rows because 85000 appears twice (tied for 2nd place).*

---

## Approaches

### Solution 1: DENSE_RANK Window Function

```sql
SELECT 
    d.Name AS Department,
    e.Name AS Employee,
    e.Salary
FROM (
    SELECT 
        *,
        DENSE_RANK() OVER (
            PARTITION BY DepartmentId 
            ORDER BY Salary DESC
        ) AS SalaryRank
    FROM Employee
) e
JOIN Department d ON e.DepartmentId = d.Id
WHERE e.SalaryRank <= 3;
```

**Explanation:**
- Use `DENSE_RANK()` to assign ranks to salaries within each department
- `DENSE_RANK()` gives same rank to ties (1, 2, 2, 3 vs RANK's 1, 2, 2, 4)
- Filter for ranks 1-3 to get top 3 unique salary levels

**Time Complexity:** O(n log n) - sorting per partition
**Space Complexity:** O(n)

### Solution 2: Correlated Subquery with Counting

```sql
SELECT 
    d.Name AS Department,
    e.Name AS Employee,
    e.Salary
FROM Employee e
JOIN Department d ON e.DepartmentId = d.Id
WHERE (
    SELECT COUNT(DISTINCT Salary)
    FROM Employee e2
    WHERE e2.DepartmentId = e.DepartmentId
      AND e2.Salary > e.Salary
) < 3;
```

**Explanation:**
- For each employee, count distinct salaries higher than theirs in same department
- Keep employees where fewer than 3 higher salaries exist (top 3)
- This handles ties correctly

**Time Complexity:** O(n²)
**Space Complexity:** O(1)

### Solution 3: Pre-MySQL 8.0 Workaround (Variables)

```sql
SELECT 
    d.Name AS Department,
    ranked.Name AS Employee,
    ranked.Salary
FROM (
    SELECT 
        e.*,
        @rank := IF(@dept = e.DepartmentId, 
                    IF(@sal = e.Salary, @rank, @rank + 1), 
                    1) AS SalaryRank,
        @dept := e.DepartmentId,
        @sal := e.Salary
    FROM Employee e
    CROSS JOIN (SELECT @rank := 0, @dept := NULL, @sal := NULL) init
    ORDER BY e.DepartmentId, e.Salary DESC
) ranked
JOIN Department d ON ranked.DepartmentId = d.Id
WHERE ranked.SalaryRank <= 3;
```

**Explanation:**
- Simulate DENSE_RANK using session variables
- Reset rank when department changes
- Increment rank only when salary changes (not on ties)
- Requires careful ORDER BY to work correctly

**Time Complexity:** O(n log n)
**Space Complexity:** O(1)

---

## Solution Analysis

| Approach | Time | Space | MySQL Version | Pros | Cons |
|----------|------|-------|---------------|------|------|
| DENSE_RANK | O(n log n) | O(n) | 8.0+ | Clean, handles ties correctly | Not available in older versions |
| Correlated Subquery | O(n²) | O(1) | All | Universal compatibility | Slow for large tables |
| Variables | O(n log n) | O(1) | 5.7+ | Works without window functions | Brittle, depends on sort order |

---

## Final Solution

**Recommended:** Solution 1 (DENSE_RANK) for MySQL 8.0+, Solution 3 (Variables) for MySQL 5.7.

```sql
-- Solution 1: DENSE_RANK (MySQL 8.0+, PostgreSQL, SQL Server)
SELECT 
    d.Name AS Department,
    e.Name AS Employee,
    e.Salary
FROM (
    SELECT 
        Name,
        Salary,
        DepartmentId,
        DENSE_RANK() OVER (
            PARTITION BY DepartmentId 
            ORDER BY Salary DESC
        ) AS SalaryRank
    FROM Employee
) e
JOIN Department d ON e.DepartmentId = d.Id
WHERE e.SalaryRank <= 3;
```

```sql
-- Solution 3: Variable Simulation (MySQL 5.7)
SELECT 
    d.Name AS Department,
    ranked.Name AS Employee,
    ranked.Salary
FROM (
    SELECT 
        e.*,
        @rank := IF(@dept = DepartmentId, 
                    IF(@sal = Salary, @rank, @rank + 1), 
                    1) AS SalaryRank,
        @dept := DepartmentId,
        @sal := Salary
    FROM Employee e
    CROSS JOIN (SELECT @rank := 0, @dept := NULL, @sal := NULL) init
    ORDER BY DepartmentId, Salary DESC
) ranked
JOIN Department d ON ranked.DepartmentId = d.Id
WHERE ranked.SalaryRank <= 3;
```

**Key Takeaways:**
1. Use `DENSE_RANK` not `RANK` to include ties within top N
2. Correlated subqueries work but scale quadratically
3. MySQL 5.7 variable workaround requires careful ORDER BY handling
4. Always verify variable-based solutions with edge cases (ties across departments)
