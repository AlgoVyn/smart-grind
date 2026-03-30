## Problem

**Game Play Analysis II (LeetCode 512)**

For each player and date, report the **total number of games played so far** by that player (running total).

### Schema
```
Activity(PlayerId, DeviceId, EventDate, GamesPlayed)
- PlayerId: int (PK)
- DeviceId: int
- EventDate: date
- GamesPlayed: int
```

### Requirements
- Return: `PlayerId`, `EventDate`, `games_played_so_far`
- Order by: `PlayerId`, `EventDate`

---

## Approaches

### Approach 1: SUM Window Function with ROWS UNBOUNDED

```sql
SELECT 
    PlayerId,
    EventDate,
    SUM(GamesPlayed) OVER (
        PARTITION BY PlayerId 
        ORDER BY EventDate 
        ROWS UNBOUNDED PRECEDING
    ) AS games_played_so_far
FROM Activity;
```

**Explanation:** Uses running total window function. `ROWS UNBOUNDED PRECEDING` sums all rows from the start of the partition up to current row.

---

### Approach 2: Self JOIN with Aggregation

```sql
SELECT 
    a1.PlayerId,
    a1.EventDate,
    SUM(a2.GamesPlayed) AS games_played_so_far
FROM Activity a1
JOIN Activity a2 
    ON a1.PlayerId = a2.PlayerId 
    AND a2.EventDate <= a1.EventDate
GROUP BY a1.PlayerId, a1.EventDate
ORDER BY a1.PlayerId, a1.EventDate;
```

**Explanation:** Joins each row with all previous rows for the same player (including current), then sums the games played.

---

### Approach 3: Correlated Subquery with SUM

```sql
SELECT 
    a1.PlayerId,
    a1.EventDate,
    (
        SELECT SUM(a2.GamesPlayed)
        FROM Activity a2
        WHERE a2.PlayerId = a1.PlayerId 
          AND a2.EventDate <= a1.EventDate
    ) AS games_played_so_far
FROM Activity a1
ORDER BY a1.PlayerId, a1.EventDate;
```

**Explanation:** For each row, calculates the sum of all games played on or before that date using a correlated subquery.

---

## Solution Analysis

| Approach | Time Complexity | Space Complexity | Pros | Cons |
|----------|----------------|------------------|------|------|
| SUM Window | O(n log n) | O(n) | Most efficient, clean syntax | Requires window function support |
| Self JOIN | O(n²) | O(n²) | Works in all SQL versions | Performance degrades with large data |
| Correlated Subquery | O(n²) | O(1) | Easy to understand | Slowest, multiple subquery executions |

**Recommendation:** Use Approach 1 (SUM Window Function) - it's the standard modern SQL solution for running totals.

---

## Final Solution

```sql
SELECT 
    PlayerId,
    EventDate,
    SUM(GamesPlayed) OVER (
        PARTITION BY PlayerId 
        ORDER BY EventDate 
        ROWS UNBOUNDED PRECEDING
    ) AS games_played_so_far
FROM Activity;
```

**Output:**
| PlayerId | EventDate  | games_played_so_far |
|----------|------------|---------------------|
| 1        | 2016-03-01 | 5                   |
| 1        | 2016-03-02 | 11                  |
| 1        | 2016-05-02 | 21                  |
| 2        | 2017-06-25 | 2                   |
| 3        | 2016-03-02 | 3                   |

---

**Tags:** `#SQL` `#WindowFunctions` `#RunningTotal` `#SUM` `#LeetCode512`
