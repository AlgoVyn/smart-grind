# 177. Nth Highest Salary

## Problem

Write a function to get the Nth highest salary from the Employee table. If there is no Nth highest salary, return null.

### Schema

**Employee Table:**
| Column Name | Type | Description |
|-------------|------|-------------|
| id          | int  | Primary Key |
| salary      | int  | Employee salary |

### Requirements

- Return: getNthHighestSalary(N) function returning a single salary value
- N=1 returns highest salary, N=2 returns second highest, etc.
- If fewer than N distinct salaries exist, return NULL
- Handle duplicate salaries correctly

## Approaches

### Approach 1: LIMIT OFFSET with Variable (Recommended)

Use LIMIT with dynamic OFFSET based on input parameter N.

#### Algorithm

1. Create a function that accepts N as parameter
2. Use LIMIT 1 OFFSET N-1 to get the Nth row
3. Wrap in subquery to handle NULL return

#### Implementation

```sql
CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT
BEGIN
  RETURN (
      SELECT DISTINCT salary
      FROM Employee
      ORDER BY salary DESC
      LIMIT 1 OFFSET N - 1
  );
END
```

**Note:** OFFSET is N-1 because OFFSET 0 gives the first row.

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) for sorting |
| Space | O(n) for distinct values |

### Approach 2: DENSE_RANK Window Function

Use DENSE_RANK() to assign ranks and filter for rank = N.

#### Algorithm

1. Use DENSE_RANK() OVER (ORDER BY salary DESC) to rank salaries
2. Filter for rows where rank equals N
3. Return the salary

#### Implementation

```sql
CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT
BEGIN
  RETURN (
      SELECT salary
      FROM (
          SELECT DISTINCT salary,
                 DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
          FROM Employee
      ) ranked
      WHERE rnk = N
      LIMIT 1
  );
END
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) for window function |
| Space | O(n) for ranking computation |

### Approach 3: Subquery with COUNT DISTINCT

Count how many distinct salaries are greater than each salary to determine rank.

#### Algorithm

1. For each distinct salary, count how many distinct salaries are higher
2. The count + 1 gives the rank of that salary
3. Filter for rank = N

#### Implementation

```sql
CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT
BEGIN
  RETURN (
      SELECT DISTINCT e1.salary
      FROM Employee e1
      WHERE (SELECT COUNT(DISTINCT e2.salary) 
             FROM Employee e2 
             WHERE e2.salary > e1.salary) = N - 1
      LIMIT 1
  );
END
```

**How it works:**
- For the highest salary: 0 salaries are greater → count = 0 → rank 1
- For second highest: 1 salary is greater → count = 1 → rank 2
- For Nth highest: N-1 salaries are greater

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n²) - subquery for each distinct salary |
| Space | O(1) - single value comparison |

## Solution Analysis

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| LIMIT OFFSET | O(n log n) | O(n) | Simple, efficient, readable | OFFSET can't use variable directly in some MySQL versions |
| DENSE_RANK | O(n log n) | O(n) | Clean, handles ties correctly | Slightly more complex syntax |
| COUNT Subquery | O(n²) | O(1) | No sorting required | Inefficient for large tables |

**Recommended:** LIMIT OFFSET (Approach 1) - most straightforward and widely supported.

## Final Solution

```sql
CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT
BEGIN
  RETURN (
      SELECT DISTINCT salary
      FROM Employee
      ORDER BY salary DESC
      LIMIT 1 OFFSET N - 1
  );
END
```

### Key Concepts

- **OFFSET N-1**: First row is at offset 0, so Nth row is at offset N-1
- **DISTINCT**: Critical for correct ranking with duplicate salaries
- **DENSE_RANK**: Assigns same rank to ties without gaps (1, 2, 2, 3...)
- **Subquery return**: Automatically returns NULL if no rows match

### Comparison: RANK vs DENSE_RANK vs ROW_NUMBER

| Function | [100, 200, 200, 300] Ranks | Use Case |
|----------|---------------------------|----------|
| ROW_NUMBER | 1, 2, 3, 4 | Unique ranking, arbitrary tie-break |
| RANK | 1, 2, 2, 4 | Skip ranks after ties |
| DENSE_RANK | 1, 2, 2, 3 | **Correct for Nth highest** |

For "Nth highest salary", DENSE_RANK is correct because:
- [100, 200, 200, 300] has distinct values: [100, 200, 300]
- 2nd highest distinct value is 200
- DENSE_RANK assigns 200 → rank 2 ✓
- RANK would assign 200 → rank 2, but 300 → rank 4 (skips 3)
