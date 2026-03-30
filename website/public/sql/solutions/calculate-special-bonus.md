## Problem

Calculate the bonus of each employee. The bonus of an employee is 100% of their salary if the ID of the employee is an odd number and the employee's name does not start with the character 'M'. Otherwise, the bonus is 0.

Return the result table ordered by `employee_id`.

### Schema

```sql
Employees(
    EmployeeId INT,
    Name VARCHAR,
    Salary INT
)
```

### Output

| Column      | Type |
|-------------|------|
| EmployeeID  | int  |
| Bonus       | int  |

---

## Approaches

### Approach 1: CASE Statement (Recommended)

Use a CASE statement to check both conditions: employee_id is odd (employee_id % 2 != 0) and name doesn't start with 'M'.

```sql
SELECT 
    employee_id AS EmployeeID,
    CASE 
        WHEN employee_id % 2 = 1 AND LEFT(name, 1) != 'M' 
        THEN salary 
        ELSE 0 
    END AS Bonus
FROM Employees
ORDER BY employee_id;
```

**MySQL:** Uses `MOD()` or `%` for modulo.  
**PostgreSQL/SQL Server:** Uses `%` for modulo.  
**Oracle:** Uses `MOD()` function.

### Approach 2: IF Function (MySQL Only)

MySQL's IF function provides a concise syntax.

```sql
SELECT 
    employee_id AS EmployeeID,
    IF(
        employee_id % 2 = 1 AND LEFT(name, 1) != 'M',
        salary,
        0
    ) AS Bonus
FROM Employees
ORDER BY employee_id;
```

### Approach 3: IIF (SQL Server)

SQL Server 2012+ provides the IIF function for simple conditional logic.

```sql
SELECT 
    employee_id AS EmployeeID,
    IIF(
        employee_id % 2 = 1 AND LEFT(name, 1) != 'M',
        salary,
        0
    ) AS Bonus
FROM Employees
ORDER BY employee_id;
```

---

## Solution Analysis

| Approach      | Time Complexity | Space Complexity | Pros                              | Cons                      |
|---------------|-----------------|------------------|-----------------------------------|---------------------------|
| CASE          | O(n)            | O(1)             | Portable across all SQL dialects  | Slightly verbose          |
| IF (MySQL)    | O(n)            | O(1)             | Concise for MySQL                 | MySQL-specific            |
| IIF (MSSQL)   | O(n)            | O(1)             | Concise for SQL Server            | SQL Server-specific       |

**Key Points:**
- Condition checks: `employee_id % 2 = 1` (odd) AND `LEFT(name, 1) != 'M'` (not M)
- Always include `ORDER BY employee_id` as required
- `LEFT(name, 1)` extracts the first character; alternatives include `SUBSTRING(name, 1, 1)` or `name LIKE 'M%'` with negation

---

## Final Solution

```sql
-- PostgreSQL / MySQL / Standard SQL
SELECT 
    employee_id,
    CASE 
        WHEN employee_id % 2 = 1 AND LEFT(name, 1) != 'M' 
        THEN salary 
        ELSE 0 
    END AS bonus
FROM Employees
ORDER BY employee_id;
```

```sql
-- Alternative using NOT LIKE for first character check
SELECT 
    employee_id,
    CASE 
        WHEN MOD(employee_id, 2) = 1 AND name NOT LIKE 'M%' 
        THEN salary 
        ELSE 0 
    END AS bonus
FROM Employees
ORDER BY employee_id;
```
