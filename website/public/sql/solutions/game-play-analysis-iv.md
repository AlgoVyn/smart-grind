# Game Play Analysis IV

## Problem

**Difficulty:** Medium

Report the fraction of players who logged in again on the day immediately after their first login.

### Requirements
- Find each player's first login date
- Check if player logged in on `first_login + 1 day`
- Calculate: `players_logged_in_next_day / total_players`
- Round to 2 decimal places

### Schema

**Table: `Activity`**
| Column       | Type    |
|--------------|---------|
| PlayerId     | int     |
| DeviceId     | int     |
| EventDate    | date    |
| GamesPlayed  | int     |

### Example Output
| fraction |
|----------|
| 0.33     |

---

## Approaches

### Solution 1: CTE with Window Functions (Optimal)

```sql
WITH FirstLogin AS (
    SELECT 
        PlayerId,
        MIN(EventDate) AS first_date
    FROM Activity
    GROUP BY PlayerId
),
NextDayLogin AS (
    SELECT 
        f.PlayerId,
        f.first_date,
        CASE 
            WHEN EXISTS (
                SELECT 1 FROM Activity a 
                WHERE a.PlayerId = f.PlayerId 
                AND a.EventDate = DATE_ADD(f.first_date, INTERVAL 1 DAY)
            ) THEN 1 
            ELSE 0 
        END AS logged_next_day
    FROM FirstLogin f
)
SELECT 
    ROUND(AVG(logged_next_day), 2) AS fraction
FROM NextDayLogin;
```

**Complexity:** O(n) time, O(n) space for CTEs

---

### Solution 2: LEFT JOIN with Date Math

```sql
WITH FirstLogin AS (
    SELECT 
        PlayerId,
        MIN(EventDate) AS first_date
    FROM Activity
    GROUP BY PlayerId
)
SELECT 
    ROUND(
        COUNT(DISTINCT CASE 
            WHEN a.EventDate = DATE_ADD(f.first_date, INTERVAL 1 DAY) 
            THEN f.PlayerId 
        END) * 1.0 / COUNT(DISTINCT f.PlayerId), 
        2
    ) AS fraction
FROM FirstLogin f
LEFT JOIN Activity a 
    ON f.PlayerId = a.PlayerId 
    AND a.EventDate = DATE_ADD(f.first_date, INTERVAL 1 DAY);
```

**Complexity:** O(n) time, O(n) space

---

### Solution 3: Subquery with IN Clause

```sql
SELECT 
    ROUND(
        SUM(next_day_logged_in) * 1.0 / COUNT(*), 
        2
    ) AS fraction
FROM (
    SELECT 
        PlayerId,
        CASE 
            WHEN DATE_ADD(MIN(EventDate), INTERVAL 1 DAY) IN (
                SELECT EventDate 
                FROM Activity a2 
                WHERE a2.PlayerId = a1.PlayerId
            ) THEN 1 
            ELSE 0 
        END AS next_day_logged_in
    FROM Activity a1
    GROUP BY PlayerId
) t;
```

**Complexity:** O(n²) time

---

### Solution 4: LEAD Window Function

```sql
WITH RankedActivity AS (
    SELECT 
        PlayerId,
        EventDate,
        MIN(EventDate) OVER (PARTITION BY PlayerId) AS first_date,
        LEAD(EventDate) OVER (PARTITION BY PlayerId ORDER BY EventDate) AS next_date
    FROM Activity
)
SELECT 
    ROUND(
        AVG(CASE 
            WHEN next_date = DATE_ADD(first_date, INTERVAL 1 DAY) 
            THEN 1.0 
            ELSE 0 
        END), 
        2
    ) AS fraction
FROM RankedActivity
WHERE EventDate = first_date;
```

**Complexity:** O(n log n) time for sorting, O(n) space

---

## Solution Analysis

| Approach         | Time      | Space  | Pros                     | Cons                  |
|------------------|-----------|--------|--------------------------|-----------------------|
| CTE + EXISTS     | O(n)      | O(n)   | Clean, efficient         | Two CTEs              |
| LEFT JOIN        | O(n)      | O(n)   | Single aggregation       | Requires careful join |
| Subquery + IN    | O(n²)     | O(1)   | Simple logic             | Slow, correlated      |
| LEAD             | O(n log n)| O(n)   | Elegant window function  | Sorting overhead      |

### Key Concepts
- **MIN() GROUP BY**: Find first login per player
- **DATE_ADD/DATE_SUB**: Date arithmetic
- **EXISTS**: Check if next day exists efficiently
- **1.0 multiplication**: Force float division in integer systems

---

## Final Solution (Recommended)

```sql
WITH FirstLogin AS (
    SELECT 
        PlayerId,
        MIN(EventDate) AS first_date
    FROM Activity
    GROUP BY PlayerId
)
SELECT 
    ROUND(
        AVG(
            CASE 
                WHEN a.EventDate IS NOT NULL THEN 1.0 
                ELSE 0 
            END
        ), 
        2
    ) AS fraction
FROM FirstLogin f
LEFT JOIN Activity a 
    ON f.PlayerId = a.PlayerId 
    AND a.EventDate = DATE_ADD(f.first_date, INTERVAL 1 DAY);
```

**Why this?** LEFT JOIN cleanly identifies next-day logins, AVG handles the fraction calculation, and it's readable and efficient.
