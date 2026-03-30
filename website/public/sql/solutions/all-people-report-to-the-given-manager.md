# 1270. All People Report to the Given Manager

## Problem

Write a solution to find all employees who report directly or indirectly to the given manager. Return the result ordered by employee id.

### Schema

**Employees Table:**
| Column Name   | Type    | Description |
|---------------|---------|-------------|
| EmployeeId    | int     | Primary Key |
| EmployeeName  | varchar | Employee's name |
| ManagerId     | int     | Foreign Key to EmployeeId (null for CEO) |

### Requirements

- Find all employees who report to a specific manager (directly or through any number of levels)
- The manager's own record should NOT be included
- Return: EmployeeId, EmployeeName
- Order by EmployeeId ascending
- The given manager id is provided as a parameter

**Example Hierarchy:**
```
CEO (1)
├── Manager A (2)
│   ├── Employee X (3)
│   └── Employee Y (4)
└── Manager B (5)
    └── Employee Z (6)
```
- If manager id = 2: return employees 3, 4
- If manager id = 1: return employees 2, 3, 4, 5, 6

## Approaches

### Approach 1: Recursive CTE (Recommended)

Use a recursive Common Table Expression to traverse the employee hierarchy from the manager down through all levels.

#### Algorithm

1. Start with direct reports (ManagerId = given manager id)
2. Recursively find reports of reports
3. Collect all employees found during traversal
4. Return the collected employees ordered by EmployeeId

#### Implementation

```sql
WITH RECURSIVE ReportChain AS (
    -- Base case: direct reports to the manager
    SELECT EmployeeId, EmployeeName
    FROM Employees
    WHERE ManagerId = 1  -- Replace with the given manager id
    
    UNION ALL
    
    -- Recursive case: reports of the current level
    SELECT e.EmployeeId, e.EmployeeName
    FROM Employees e
    JOIN ReportChain r ON e.ManagerId = r.EmployeeId
)
SELECT EmployeeId, EmployeeName
FROM ReportChain
ORDER BY EmployeeId;
```

**Note:** Different SQL dialects may use slightly different syntax:
- MySQL/MariaDB: `WITH RECURSIVE`
- PostgreSQL: `WITH RECURSIVE` or just `WITH`
- SQL Server: Just `WITH`
- Oracle: Just `WITH`

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - visits each employee once |
| Space | O(n) - stores all subordinates in CTE |

### Approach 2: Self JOIN Chain (Limited Depth)

For hierarchies with known maximum depth, use multiple self JOINs to find employees at each level.

#### Algorithm

1. Use LEFT JOINs to chain from manager through multiple levels
2. Collect employees found at each depth level
3. UNION results from all levels

#### Implementation

```sql
-- Level 1: Direct reports
SELECT e1.EmployeeId, e1.EmployeeName
FROM Employees e1
WHERE e1.ManagerId = 1

UNION

-- Level 2: Reports of reports
SELECT e2.EmployeeId, e2.EmployeeName
FROM Employees e1
JOIN Employees e2 ON e2.ManagerId = e1.EmployeeId
WHERE e1.ManagerId = 1

UNION

-- Level 3: Third level reports
SELECT e3.EmployeeId, e3.EmployeeName
FROM Employees e1
JOIN Employees e2 ON e2.ManagerId = e1.EmployeeId
JOIN Employees e3 ON e3.ManagerId = e2.EmployeeId
WHERE e1.ManagerId = 1

ORDER BY EmployeeId;
```

**Limitation:** Only works for hierarchies up to the depth specified (3 levels in this example). Deeper hierarchies require more JOINs.

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n^d) where d = depth of query |
| Space | O(n) - result set size |

### Approach 3: Path Enumeration Using String Concatenation

Use a pre-computed path column or construct paths to identify all descendants.

#### Algorithm

1. Build full paths from CEO to each employee
2. Filter paths that contain the given manager id
3. Return employees whose path goes through the manager

#### Implementation

```sql
-- For databases with STRING_AGG or GROUP_CONCAT for path building
WITH RECURSIVE EmployeePaths AS (
    -- Base: CEO has path as their own ID
    SELECT 
        EmployeeId, 
        EmployeeName,
        CAST(EmployeeId AS VARCHAR) AS Path
    FROM Employees
    WHERE ManagerId IS NULL
    
    UNION ALL
    
    -- Recursive: append current ID to parent's path
    SELECT 
        e.EmployeeId,
        e.EmployeeName,
        CONCAT(ep.Path, ',', e.EmployeeId) AS Path
    FROM Employees e
    JOIN EmployeePaths ep ON e.ManagerId = ep.EmployeeId
)
SELECT EmployeeId, EmployeeName
FROM EmployeePaths
WHERE Path LIKE '%,1,%' OR Path LIKE '1,%'
ORDER BY EmployeeId;
```

**Alternative with pre-computed path column:**
```sql
-- If Employees table has a pre-computed Path column
SELECT EmployeeId, EmployeeName
FROM Employees
WHERE Path LIKE '1,%'  -- Path starts with manager id
   OR Path LIKE '%,1,%' -- Path contains manager id
ORDER BY EmployeeId;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × L) where L = average path length |
| Space | O(n × L) - stores paths for all employees |

## Solution Analysis

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| Recursive CTE | O(n) | O(n) | Handles any depth, clean and readable | Requires CTE support |
| Self JOIN Chain | O(n^d) | O(n) | Works in older databases | Limited depth, verbose for deep hierarchies |
| Path Enumeration | O(n × L) | O(n × L) | Fast lookup with pre-computed paths | Requires extra storage or string operations |

**Recommended:** Recursive CTE (Approach 1) - elegant, scalable, and handles hierarchies of any depth. Most modern SQL databases support recursive CTEs.

## Final Solution

```sql
WITH RECURSIVE ReportChain AS (
    -- Base case: direct reports to the manager
    SELECT EmployeeId, EmployeeName
    FROM Employees
    WHERE ManagerId = 1  -- Replace with the given manager id
    
    UNION ALL
    
    -- Recursive case: find reports of current employees
    SELECT e.EmployeeId, e.EmployeeName
    FROM Employees e
    JOIN ReportChain r ON e.ManagerId = r.EmployeeId
)
SELECT EmployeeId, EmployeeName
FROM ReportChain
ORDER BY EmployeeId;
```

### Key Concepts

- **Recursive CTE**: Contains a base case (anchor member) and recursive case (recursive member)
- **UNION ALL**: Combines results while preserving duplicates (prevents infinite loops in well-formed hierarchies)
- **Termination**: Recursion stops when no new employees are found
- **Hierarchy Traversal**: Descends the tree from manager to all descendants
- **NULL ManagerId**: Indicates the CEO or top of the hierarchy
