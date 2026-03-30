# 626. Exchange Seats

## Problem

Swap the seat IDs of adjacent students. If the number of students is odd, the last student's ID should not be changed.

- Swap pairs: (1,2), (3,4), (5,6), etc.
- If odd count: last student keeps original seat

### Schema

**Seat Table:**
| Column Name | Type    | Description |
|-------------|---------|-------------|
| Id          | int     | Primary Key, seat identifier |
| Student     | varchar | Student name |

### Requirements

- Return: Id (new seat), Student
- Adjacent students swap seats (1↔2, 3↔4, etc.)
- If odd number of students, last one stays in place
- Result ordered by new seat ID

## Approaches

### Approach 1: CASE with MOD (Recommended)

Use MOD/IF to determine new seat ID based on whether current ID is odd or even.

#### Algorithm

1. If Id is odd and not last: new Id = Id + 1 (swap with next)
2. If Id is even: new Id = Id - 1 (swap with previous)
3. If Id is odd and last (odd count): keep same Id

#### Implementation

```sql
SELECT 
    CASE 
        WHEN MOD(Id, 2) = 1 AND Id = (SELECT MAX(Id) FROM Seat) THEN Id
        WHEN MOD(Id, 2) = 1 THEN Id + 1
        ELSE Id - 1
    END AS Id,
    Student
FROM Seat
ORDER BY Id;
```

**Alternative using IF (MySQL):**

```sql
SELECT 
    IF(
        MOD(Id, 2) = 1 AND Id = (SELECT COUNT(*) FROM Seat),
        Id,
        IF(MOD(Id, 2) = 1, Id + 1, Id - 1)
    ) AS Id,
    Student
FROM Seat
ORDER BY Id;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - due to ORDER BY and subquery |
| Space | O(n) - result set size |

### Approach 2: Self JOIN with COALESCE

Use LEFT JOIN to pair adjacent seats, then select from the joined row.

#### Algorithm

1. For odd Ids: join with Id+1 (next seat)
2. For even Ids: join with Id-1 (previous seat)
3. Use COALESCE to handle the last odd seat with no pair

#### Implementation

```sql
SELECT 
    CASE 
        WHEN MOD(s.Id, 2) = 1 THEN COALESCE(s2.Id, s.Id)
        ELSE s2.Id
    END AS Id,
    s.Student
FROM Seat s
LEFT JOIN Seat s2 ON 
    (MOD(s.Id, 2) = 1 AND s2.Id = s.Id + 1) OR
    (MOD(s.Id, 2) = 0 AND s2.Id = s.Id - 1)
ORDER BY Id;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - join and sort operations |
| Space | O(n) - result set size |

### Approach 3: ROW_NUMBER with CASE (Window Functions)

Use window functions to calculate new positions.

#### Algorithm

1. Create row numbers to identify pairs
2. Calculate new position based on even/odd grouping

#### Implementation

```sql
WITH CTE AS (
    SELECT 
        Id,
        Student,
        ROW_NUMBER() OVER (ORDER BY Id) AS rn
    FROM Seat
)
SELECT 
    CASE 
        WHEN rn % 2 = 1 AND rn = (SELECT MAX(rn) FROM CTE) THEN Id
        WHEN rn % 2 = 1 THEN LEAD(Id) OVER (ORDER BY rn)
        ELSE LAG(Id) OVER (ORDER BY rn)
    END AS Id,
    Student
FROM CTE
ORDER BY Id;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - window function overhead |
| Space | O(n) - CTE and window operations |

## Solution Analysis

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| CASE with MOD | O(n log n) | O(n) | Simple, readable, widely supported | Subquery for max id |
| Self JOIN | O(n log n) | O(n) | No subquery for max check | More complex join condition |
| ROW_NUMBER | O(n log n) | O(n) | Modern, flexible | Requires window function support |

**Recommended:** CASE with MOD (Approach 1) - simplest and most portable across SQL dialects.

## Final Solution

```sql
SELECT 
    CASE 
        WHEN MOD(Id, 2) = 1 AND Id = (SELECT MAX(Id) FROM Seat) THEN Id
        WHEN MOD(Id, 2) = 1 THEN Id + 1
        ELSE Id - 1
    END AS Id,
    Student
FROM Seat
ORDER BY Id;
```

### Key Concepts

- **MOD function**: Determines if seat ID is odd or even
- **Subquery for MAX**: Handles odd number of students edge case
- **CASE statement**: Conditional logic for seat swapping
- **ORDER BY**: Ensures result is sorted by new seat IDs
