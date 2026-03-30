# Game Play Analysis III

## Problem

**Difficulty:** Medium

Report the number of games played so far by each player at each logged-in date.

### Requirements
- Calculate running total of games played per player up to each date
- Show games played on the previous day (if any)
- Return: `PlayerId`, `EventDate`, `GamesPlayedSoFar`, `GamesPlayedPreviousDay`

### Schema

**Table: `Activity`**
| Column       | Type    |
|--------------|---------|
| PlayerId     | int     |
| DeviceId     | int     |
| EventDate    | date    |
| GamesPlayed  | int     |

### Example Output
| PlayerId | EventDate  | GamesPlayedSoFar | GamesPlayedPreviousDay |
|----------|------------|------------------|------------------------|
| 1        | 2022-03-01 | 5                | null                   |
| 1        | 2022-03-02 | 11               | 5                      |
| 1        | 2022-03-03 | 16               | 6                      |

---

## Approaches

### Solution 1: Window Functions (Optimal)

```sql
SELECT 
    PlayerId,
    EventDate,
    SUM(GamesPlayed) OVER (
        PARTITION BY PlayerId 
        ORDER BY EventDate 
        ROWS UNBOUNDED PRECEDING
    ) AS GamesPlayedSoFar,
    LAG(GamesPlayed) OVER (
        PARTITION BY PlayerId 
        ORDER BY EventDate
    ) AS GamesPlayedPreviousDay
FROM Activity;
```

**Complexity:** O(n) time, O(1) space per row

---

### Solution 2: Self JOIN with Aggregation

```sql
SELECT 
    a1.PlayerId,
    a1.EventDate,
    SUM(a2.GamesPlayed) AS GamesPlayedSoFar,
    MAX(CASE 
        WHEN a2.EventDate = DATE_SUB(a1.EventDate, INTERVAL 1 DAY) 
        THEN a2.GamesPlayed 
        ELSE NULL 
    END) AS GamesPlayedPreviousDay
FROM Activity a1
JOIN Activity a2 
    ON a1.PlayerId = a2.PlayerId 
    AND a2.EventDate <= a1.EventDate
GROUP BY a1.PlayerId, a1.EventDate, a1.GamesPlayed;
```

**Complexity:** O(n²) time, O(1) additional space

---

### Solution 3: Correlated Subqueries

```sql
SELECT 
    PlayerId,
    EventDate,
    (SELECT SUM(GamesPlayed) 
     FROM Activity a2 
     WHERE a2.PlayerId = a1.PlayerId 
       AND a2.EventDate <= a1.EventDate) AS GamesPlayedSoFar,
    (SELECT GamesPlayed 
     FROM Activity a2 
     WHERE a2.PlayerId = a1.PlayerId 
       AND a2.EventDate = DATE_SUB(a1.EventDate, INTERVAL 1 DAY)) AS GamesPlayedPreviousDay
FROM Activity a1;
```

**Complexity:** O(n²) time

---

## Solution Analysis

| Approach        | Time    | Space  | Pros                  | Cons                     |
|-----------------|---------|--------|-----------------------|--------------------------|
| Window Function | O(n)    | O(1)   | Fast, readable        | Requires MySQL 8+        |
| Self JOIN       | O(n²)   | O(1)   | Works on older MySQL  | Quadratic complexity     |
| Correlated      | O(n²)   | O(1)   | Simple to understand  | Slowest, many scans      |

### Key Concepts
- **SUM() OVER**: Running total without self-join
- **LAG()**: Access previous row value
- **PARTITION BY**: Calculate separately per player
- **ROWS UNBOUNDED PRECEDING**: Sum from first row to current

---

## Final Solution (Recommended)

```sql
SELECT 
    PlayerId,
    EventDate,
    SUM(GamesPlayed) OVER (
        PARTITION BY PlayerId 
        ORDER BY EventDate 
        ROWS UNBOUNDED PRECEDING
    ) AS GamesPlayedSoFar,
    LAG(GamesPlayed) OVER (
        PARTITION BY PlayerId 
        ORDER BY EventDate
    ) AS GamesPlayedPreviousDay
FROM Activity;
```

**Why this?** Single pass, no joins, clean and efficient with window functions.
