# 176. Second Highest Salary

## Problem

Write a solution to find the second highest salary from the Employee table. If there is no second highest salary, return null.

### Schema

**Employee Table:**
| Column Name | Type | Description |
|-------------|------|-------------|
| id          | int  | Primary Key |
| salary      | int  | Employee salary |

### Requirements

- Return: SecondHighestSalary as a single value
- If less than 2 distinct salaries exist, return NULL
- Handle duplicate salaries correctly (e.g., [100, 100, 200] → second highest is 100)

## Approaches

### Approach 1: ORDER BY with LIMIT OFFSET (Recommended)

Sort salaries in descending order and skip the first (highest) to get the second.

#### Algorithm

1. SELECT DISTINCT salaries to handle duplicates
2. ORDER BY salary DESC
3. LIMIT 1 OFFSET 1 to get the second row
4. Handle NULL case with subquery or IFNULL

#### Implementation

```sql
SELECT (
    SELECT DISTINCT salary
    FROM Employee
    ORDER BY salary DESC
    LIMIT 1 OFFSET 1
) AS SecondHighestSalary;
```

**Alternative with IFNULL for explicit NULL handling:**

```sql
SELECT IFNULL(
    (SELECT DISTINCT salary
     FROM Employee
     ORDER BY salary DESC
     LIMIT 1 OFFSET 1),
    NULL
) AS SecondHighestSalary;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) for sorting |
| Space | O(n) for distinct values |

### Approach 2: MAX with Subquery

Use MAX to find the highest salary less than the overall maximum.

#### Algorithm

1. Find the maximum salary
2. Find the maximum salary that is less than the overall maximum
3. This gives the second highest distinct salary

#### Implementation

```sql
SELECT MAX(salary) AS SecondHighestSalary
FROM Employee
WHERE salary < (SELECT MAX(salary) FROM Employee);
```

**Handling NULL:** MAX returns NULL if no rows match, satisfying the requirement.

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - two table scans |
| Space | O(1) - single value result |

### Approach 3: DENSE_RANK Window Function

Use window functions to rank salaries and filter for rank = 2.

#### Algorithm

1. Assign DENSE_RANK() to salaries in descending order
2. Filter for rank = 2 in a subquery or CTE
3. Handle empty result with aggregation

#### Implementation

```sql
SELECT MAX(salary) AS SecondHighestSalary
FROM (
    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
    FROM Employee
) ranked
WHERE rnk = 2;
```

**Why DENSE_RANK not RANK:**
- DENSE_RANK: [100, 100, 200] → ranks are [2, 2, 1], second highest is 100
- RANK: [100, 100, 200] → ranks are [3, 3, 1], no rank 2 exists

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) for sorting in window function |
| Space | O(n) for window computation |

## Solution Analysis

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| LIMIT OFFSET | O(n log n) | O(n) | Simple, intuitive | Requires subquery for single row |
| MAX Subquery | O(n) | O(1) | Most efficient, no sorting | Less flexible for Nth queries |
| DENSE_RANK | O(n log n) | O(n) | Scalable to Nth salary | Overkill for N=2 |

**Recommended:** LIMIT OFFSET (Approach 1) for readability, or MAX Subquery (Approach 2) for efficiency.

## Final Solution

```sql
SELECT (
    SELECT DISTINCT salary
    FROM Employee
    ORDER BY salary DESC
    LIMIT 1 OFFSET 1
) AS SecondHighestSalary;
```

### Key Concepts

- **DISTINCT**: Ensures duplicates don't create false "second" highest
- **LIMIT OFFSET**: Skip N-1 rows to get the Nth value
- **Subquery in SELECT**: Ensures single value output with NULL if empty
- **DENSE_RANK vs RANK**: DENSE_RANK handles ties correctly for "Nth highest"
