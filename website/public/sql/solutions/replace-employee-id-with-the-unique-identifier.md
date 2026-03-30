# 1378. Replace Employee ID With The Unique Identifier

## Problem

Write a solution to show the unique_id of each user. If a user does not have a unique ID, show null instead.

### Schema

**Employees Table:**
| Column Name | Type    | Description |
|-------------|---------|-------------|
| id          | int     | Primary Key (employee ID) |
| name        | varchar | Employee's name |

**EmployeeUNI Table:**
| Column Name | Type    | Description |
|-------------|---------|-------------|
| id          | int     | Foreign Key to Employees |
| unique_id   | int     | Unique identifier for employee |

### Requirements

- Return: unique_id, name
- Each employee must appear once
- If no unique_id exists, return NULL for unique_id
- Return results in any order

## Approaches

### Approach 1: LEFT JOIN (Recommended)

Use LEFT JOIN to preserve all employees while optionally including their unique identifiers.

#### Algorithm

1. Select from EmployeeUNI as the left table to get unique_id
2. LEFT JOIN with Employees on id to get employee names
3. All unique_id rows are preserved; name comes from Employees

Wait - we need all employees from Employees table, not all from EmployeeUNI. Let's correct:

1. Select from Employees as the primary (left) table to get all employees
2. LEFT JOIN with EmployeeUNI on id to get unique_id
3. All employees are preserved; unique_id is NULL when no match exists

#### Implementation

```sql
SELECT 
    eu.unique_id,
    e.name
FROM Employees e
LEFT JOIN EmployeeUNI eu ON e.id = eu.id;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) with index, O(n × m) worst case |
| Space | O(n) - all rows from Employees table |

### Approach 2: LEFT JOIN with COALESCE

Use COALESCE to handle NULL values explicitly.

#### Algorithm

1. LEFT JOIN Employees with EmployeeUNI on id
2. Use COALESCE to return NULL if unique_id is missing (though LEFT JOIN already does this)
3. Return unique_id and name

#### Implementation

```sql
SELECT 
    COALESCE(eu.unique_id, NULL) AS unique_id,
    e.name
FROM Employees e
LEFT JOIN EmployeeUNI eu ON e.id = eu.id;
```

**Note:** COALESCE here is redundant since LEFT JOIN already returns NULL, but explicit for clarity.

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) with index |
| Space | O(n) - result set size |

### Approach 3: Subquery in SELECT

Use correlated subquery to fetch unique_id for each employee.

#### Algorithm

1. Select from Employees table
2. Use subquery to get unique_id from EmployeeUNI
3. Return NULL if no match found

#### Implementation

```sql
SELECT 
    (SELECT unique_id FROM EmployeeUNI eu WHERE eu.id = e.id) AS unique_id,
    e.name
FROM Employees e;
```

**Note:** This approach may be slower as it executes a subquery for each employee row.

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × m) - subquery executed for each row |
| Space | O(n) - result set size |

## Solution Analysis

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| LEFT JOIN | O(n log n) | O(n) | Clean, efficient, standard | None |
| LEFT JOIN with COALESCE | O(n log n) | O(n) | Explicit NULL handling | Slightly verbose |
| Subquery | O(n × m) | O(n) | Simple syntax | Slower, multiple table scans |

**Recommended:** LEFT JOIN (Approach 1) - most readable and efficient, handles all cases properly.

## Final Solution

```sql
SELECT 
    eu.unique_id,
    e.name
FROM Employees e
LEFT JOIN EmployeeUNI eu ON e.id = eu.id;
```

### Key Concepts

- **LEFT JOIN**: Preserves all rows from the left table (Employees)
- **NULL handling**: Non-matching unique_ids produce NULL
- **Join key**: id connects the two tables
- **Table order**: Employees must be left table to include all employees
