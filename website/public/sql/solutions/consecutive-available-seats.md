# 603. Consecutive Available Seats

## Problem

Write a solution to find all available seats (Free = 1) that are consecutive. Two seats are consecutive if their seat IDs differ by exactly 1.

### Schema

**Cinema Table:**
| Column Name | Type    | Description |
|-------------|---------|-------------|
| seat_id     | int     | Primary Key, auto-increment |
| free        | bool    | 1 = available, 0 = occupied |

### Requirements

- Find all consecutive pairs of available seats
- Return: seat_id of the first seat in each consecutive pair
- Order by seat_id ascending
- Each consecutive pair should be reported (seat_id, seat_id+1 where both are free)

**Example:**
| seat_id | free |
|---------|------|
| 1       | 1    | (available)
| 2       | 0    | (occupied)
| 3       | 1    | (available)
| 4       | 1    | (available)  ← consecutive with 3
| 5       | 1    | (available)  ← consecutive with 4

Result: seats 3, 4 (as they start consecutive pairs)

## Approaches

### Approach 1: Self JOIN (Recommended)

Join the table with itself where seat_id differs by exactly 1 and both seats are available.

#### Algorithm

1. Self JOIN Cinema table where c2.seat_id = c1.seat_id + 1
2. Filter where both c1.free = 1 AND c2.free = 1
3. Return c1.seat_id (the first seat of each consecutive pair)

#### Implementation

```sql
SELECT 
    c1.seat_id
FROM Cinema c1
JOIN Cinema c2 ON c2.seat_id = c1.seat_id + 1
WHERE c1.free = 1 AND c2.free = 1
ORDER BY c1.seat_id;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - efficient index-based join |
| Space | O(n) - result set size |

### Approach 2: LEAD Window Function

Use LEAD() to look at the next row and check if both current and next are available.

#### Algorithm

1. Use LEAD() to get the next seat's free status
2. Filter where current seat is free AND next seat is free
3. Return seat_id where this condition is true

#### Implementation

```sql
WITH NextSeat AS (
    SELECT 
        seat_id,
        free,
        LEAD(free) OVER (ORDER BY seat_id) AS next_free,
        LEAD(seat_id) OVER (ORDER BY seat_id) AS next_seat_id
    FROM Cinema
)
SELECT seat_id
FROM NextSeat
WHERE free = 1 AND next_free = 1
ORDER BY seat_id;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - window function requires sort |
| Space | O(n) - CTE stores window results |

### Approach 3: EXISTS Subquery

Use EXISTS to check if the next seat exists and is available.

#### Algorithm

1. Select from Cinema where free = 1
2. Use EXISTS subquery to check if seat_id + 1 is also free
3. Return seat_ids where this condition holds

#### Implementation

```sql
SELECT 
    c1.seat_id
FROM Cinema c1
WHERE c1.free = 1 
    AND EXISTS (
        SELECT 1 
        FROM Cinema c2 
        WHERE c2.seat_id = c1.seat_id + 1 
            AND c2.free = 1
    )
ORDER BY c1.seat_id;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - EXISTS with index is efficient |
| Space | O(n) - result set |

## Solution Analysis

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| Self JOIN | O(n log n) | O(n) | Clean, efficient, standard | Returns each pair only once |
| LEAD | O(n log n) | O(n) | Modern SQL, extensible | Requires window function support |
| EXISTS | O(n log n) | O(n) | Semantically clear | May be slightly slower than JOIN |

**Recommended:** Self JOIN (Approach 1) - most straightforward and widely supported across all SQL databases.

## Final Solution

```sql
SELECT 
    c1.seat_id
FROM Cinema c1
JOIN Cinema c2 ON c2.seat_id = c1.seat_id + 1
WHERE c1.free = 1 AND c2.free = 1
ORDER BY c1.seat_id;
```

### Key Concepts

- **Self JOIN**: Joining a table to itself is powerful for finding relationships between rows
- **Arithmetic JOIN condition**: `c2.seat_id = c1.seat_id + 1` identifies consecutive seats
- **Double filter**: Both seats must be available (`free = 1`)
- **Order preservation**: Results naturally ordered by the smaller seat_id

### Variation: Finding All Consecutive Groups of 3+

If you need to find seats that are part of consecutive groups of 3 or more:

```sql
WITH ConsecutiveGroups AS (
    SELECT 
        seat_id,
        free,
        seat_id - ROW_NUMBER() OVER (ORDER BY seat_id) AS grp
    FROM Cinema
    WHERE free = 1
)
SELECT seat_id
FROM ConsecutiveGroups
WHERE grp IN (
    SELECT grp 
    FROM ConsecutiveGroups 
    GROUP BY grp 
    HAVING COUNT(*) >= 3
)
ORDER BY seat_id;
```
