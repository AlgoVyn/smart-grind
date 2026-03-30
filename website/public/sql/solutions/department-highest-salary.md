## Problem

**Department Highest Salary**

Find employees who earn the highest salary in each department.

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
| 1 | Joe | 70000 | 1 |
| 2 | Henry | 80000 | 2 |
| 3 | Sam | 60000 | 2 |
| 4 | Max | 90000 | 1 |

**Department:**
| Id | Name |
|----|------|
| 1 | IT |
| 2 | Sales |

### Output

| Department | Employee | Salary |
|------------|----------|--------|
| IT | Max | 90000 |
| Sales | Henry | 80000 |

---

## Approaches

### Solution 1: Correlated Subquery with MAX

```sql
SELECT 
    d.Name AS Department,
    e.Name AS Employee,
    e.Salary
FROM Employee e
JOIN Department d ON e.DepartmentId = d.Id
WHERE e.Salary = (
    SELECT MAX(Salary)
    FROM Employee
    WHERE DepartmentId = e.DepartmentId
);
```

**Explanation:**
- For each employee, use a correlated subquery to find the maximum salary in their department
- Keep only employees whose salary equals that department's max
- Join with Department table to get department names

**Time Complexity:** O(n²) - subquery runs for each row
**Space Complexity:** O(1)

### Solution 2: JOIN with Grouped Subquery

```sql
SELECT 
    d.Name AS Department,
    e.Name AS Employee,
    e.Salary
FROM Employee e
JOIN Department d ON e.DepartmentId = d.Id
JOIN (
    SELECT DepartmentId, MAX(Salary) AS MaxSalary
    FROM Employee
    GROUP BY DepartmentId
) max_salaries ON e.DepartmentId = max_salaries.DepartmentId
    AND e.Salary = max_salaries.MaxSalary;
```

**Explanation:**
- First, find max salary per department using a grouped subquery
- Join this result back to Employee table on DepartmentId and Salary match
- Join with Department table for names

**Time Complexity:** O(n log n) - single aggregation pass
**Space Complexity:** O(d) where d = number of departments

### Solution 3: Window Function (MAX OVER)

```sql
SELECT 
    d.Name AS Department,
    e.Name AS Employee,
    e.Salary
FROM (
    SELECT 
        *,
        MAX(Salary) OVER (PARTITION BY DepartmentId) AS MaxDeptSalary
    FROM Employee
) e
JOIN Department d ON e.DepartmentId = d.Id
WHERE e.Salary = e.MaxDeptSalary;
```

**Explanation:**
- Use window function to calculate max salary per department across all rows
- Filter to keep only rows where employee salary equals the department max
- Join with Department table for names

**Time Complexity:** O(n) - single table scan with window computation
**Space Complexity:** O(n) - window requires materializing results

---

## Solution Analysis

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| Correlated Subquery | O(n²) | O(1) | Simple, portable | Slow for large datasets |
| JOIN with Subquery | O(n log n) | O(d) | Good balance of performance | Requires temp table |
| Window Function | O(n) | O(n) | Clean syntax, optimal performance | MySQL 8.0+ only |

---

## Final Solution

**Recommended:** Solution 2 (JOIN with Grouped Subquery) for broad compatibility, Solution 3 (Window Function) for MySQL 8.0+.

```sql
-- Solution 2: JOIN with Grouped Subquery (Portable)
SELECT 
    d.Name AS Department,
    e.Name AS Employee,
    e.Salary
FROM Employee e
JOIN Department d ON e.DepartmentId = d.Id
JOIN (
    SELECT DepartmentId, MAX(Salary) AS MaxSalary
    FROM Employee
    GROUP BY DepartmentId
) max_salaries ON e.DepartmentId = max_salaries.DepartmentId
    AND e.Salary = max_salaries.MaxSalary;
```

```sql
-- Solution 3: Window Function (MySQL 8.0+, PostgreSQL, SQL Server)
SELECT 
    d.Name AS Department,
    e.Name AS Employee,
    e.Salary
FROM (
    SELECT 
        Name,
        Salary,
        DepartmentId,
        MAX(Salary) OVER (PARTITION BY DepartmentId) AS MaxDeptSalary
    FROM Employee
) e
JOIN Department d ON e.DepartmentId = d.Id
WHERE e.Salary = e.MaxDeptSalary;
```

**Key Takeaways:**
1. When multiple employees tie for highest salary, all are returned
2. Window functions provide the most readable solution in modern SQL
3. Correlated subqueries work everywhere but scale poorly
