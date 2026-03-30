# Employees Earning More Than Their Managers

## Problem

**LeetCode 181 - Easy**

The `Employee` table contains all employees including their managers. Every employee has an Id, and there is also a column for the manager Id.

```
+----+-------+--------+-----------+
| Id | Name  | Salary | ManagerId |
+----+-------+--------+-----------+
| 1  | Joe   | 70000  | 3         |
| 2  | Henry | 80000  | 4         |
| 3  | Sam   | 60000  | NULL      |
| 4  | Max   | 90000  | NULL      |
+----+-------+--------+-----------+
```

Given the `Employee` table, write a SQL query that finds out employees who earn more than their managers.

**Schema:**
- `Employee(Id, Name, Salary, ManagerId)`
  - `Id`: Primary key
  - `Name`: Employee name
  - `Salary`: Employee salary
  - `ManagerId`: Foreign key referencing `Employee.Id` (NULL for top-level managers)

**Example Output:**
```
+----------+
| Employee |
+----------+
| Joe      |
+----------+
```

Joe earns 70000 and his manager Sam earns 60000.

---

## Approaches

### Approach 1: Self JOIN (Recommended)

Join the Employee table with itself, matching employees with their managers through the `ManagerId` relationship.

```sql
SELECT e.Name AS Employee
FROM Employee e
INNER JOIN Employee m ON e.ManagerId = m.Id
WHERE e.Salary > m.Salary;
```

**How it works:**
- `e` alias represents the employee
- `m` alias represents the manager (joined via `e.ManagerId = m.Id`)
- `WHERE` clause filters for employees whose salary exceeds their manager's salary

**Time Complexity:** O(n) with index on ManagerId  
**Space Complexity:** O(k) where k is the number of matching employees

---

### Approach 2: Subquery with WHERE

Use a subquery in the WHERE clause to look up the manager's salary for each employee.

```sql
SELECT Name AS Employee
FROM Employee
WHERE Salary > (
    SELECT Salary
    FROM Employee AS Manager
    WHERE Manager.Id = Employee.ManagerId
);
```

**How it works:**
- The outer query iterates through each employee
- The subquery fetches the manager's salary by matching `Manager.Id = Employee.ManagerId`
- The WHERE condition compares employee salary against the subquery result

**Time Complexity:** O(n²) - subquery executes for each row  
**Space Complexity:** O(k) for the result set

---

### Approach 3: Correlated Subquery

Similar to Approach 2 but with explicit correlation between outer and inner queries.

```sql
SELECT e.Name AS Employee
FROM Employee e
WHERE e.Salary > (
    SELECT m.Salary
    FROM Employee m
    WHERE m.Id = e.ManagerId
);
```

**How it works:**
- For each employee `e`, the subquery finds their manager `m` where `m.Id = e.ManagerId`
- Compares `e.Salary` with the manager's salary returned by the subquery
- Returns the employee name if the condition is satisfied

**Time Complexity:** O(n²) in worst case, O(n log n) with indexing  
**Space Complexity:** O(k) for the result set

---

## Solution Analysis

| Approach | Time Complexity | Space Complexity | Pros | Cons |
|----------|-----------------|------------------|------|------|
| Self JOIN | O(n) | O(k) | Clean, readable, efficient with index | Requires understanding of self-joins |
| Subquery with WHERE | O(n²) | O(k) | Intuitive for simple cases | Slower on large datasets |
| Correlated Subquery | O(n²) | O(k) | Explicit correlation | Multiple subquery executions |

**Key Observations:**
- Self JOIN is the most efficient approach as it leverages the relationship between tables
- Subquery approaches may cause performance issues with large datasets due to repeated execution
- NULL ManagerId values (top-level managers) are naturally excluded as they have no manager to compare against

---

## Final Solution

### Recommended: Self JOIN Approach

```sql
SELECT e.Name AS Employee
FROM Employee e
INNER JOIN Employee m ON e.ManagerId = m.Id
WHERE e.Salary > m.Salary;
```

**Explanation:**
1. We alias the Employee table twice: `e` for employees and `m` for managers
2. The JOIN condition `e.ManagerId = m.Id` links each employee to their manager
3. The WHERE clause `e.Salary > m.Salary` filters for employees earning more than their managers
4. Only the employee's name is returned in the result

**Example Walkthrough:**
- Joe (Salary: 70000, ManagerId: 3) → Manager is Sam (Salary: 60000)
- 70000 > 60000 → Joe is included in results
- Henry (Salary: 80000, ManagerId: 4) → Manager is Max (Salary: 90000)
- 80000 < 90000 → Henry is excluded
- Sam and Max have NULL ManagerId → automatically excluded

**Result:**
```
+----------+
| Employee |
+----------+
| Joe      |
+----------+
```
