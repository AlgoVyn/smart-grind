## Problem

**Game Play Analysis I (LeetCode 511)**

Report the **first login date** for each player.

### Schema
```
Activity(PlayerId, DeviceId, EventDate, GamesPlayed)
- PlayerId: int (PK)
- DeviceId: int
- EventDate: date
- GamesPlayed: int
```

### Requirements
- Return: `PlayerId`, `first_login`
- Order by: `PlayerId`

---

## Approaches

### Approach 1: MIN with GROUP BY

```sql
SELECT 
    PlayerId,
    MIN(EventDate) AS first_login
FROM Activity
GROUP BY PlayerId;
```

**Explanation:** Uses aggregate function `MIN()` to find the earliest date per player. Simplest and most efficient approach.

---

### Approach 2: ROW_NUMBER Window Function

```sql
SELECT 
    PlayerId,
    EventDate AS first_login
FROM (
    SELECT 
        PlayerId,
        EventDate,
        ROW_NUMBER() OVER (
            PARTITION BY PlayerId 
            ORDER BY EventDate ASC
        ) AS rn
    FROM Activity
) ranked
WHERE rn = 1;
```

**Explanation:** Assigns row numbers partitioned by player, ordered by date. Filters for row 1 (earliest date).

---

### Approach 3: Correlated Subquery

```sql
SELECT DISTINCT
    a1.PlayerId,
    a1.EventDate AS first_login
FROM Activity a1
WHERE a1.EventDate = (
    SELECT MIN(a2.EventDate)
    FROM Activity a2
    WHERE a2.PlayerId = a1.PlayerId
);
```

**Explanation:** For each row, checks if its date equals the minimum date for that player using a correlated subquery.

---

## Solution Analysis

| Approach | Time Complexity | Space Complexity | Pros | Cons |
|----------|----------------|------------------|------|------|
| MIN + GROUP BY | O(n log n) | O(1) | Fastest, simplest | Can't get additional columns easily |
| ROW_NUMBER | O(n log n) | O(n) | Can get additional columns | Slightly more overhead |
| Correlated Subquery | O(n²) | O(1) | Easy to understand | Slowest, multiple scans |

**Recommendation:** Use Approach 1 (MIN + GROUP BY) for basic needs. Use Approach 2 (ROW_NUMBER) if you need additional columns from the same row (like `DeviceId`).

---

## Final Solution

```sql
SELECT 
    PlayerId,
    MIN(EventDate) AS first_login
FROM Activity
GROUP BY PlayerId;
```

**Output:**
| PlayerId | first_login |
|----------|-------------|
| 1        | 2016-03-01  |
| 2        | 2017-06-25  |
| 3        | 2016-03-02  |

---

**Tags:** `#SQL` `#Aggregation` `#MIN` `#GROUPBY` `#WindowFunctions` `#LeetCode511`
