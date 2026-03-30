# 1454. Active Users

## Problem

Report all the active users. An active user is a user that has at least 5 consecutive login days.

### Schema

**Accounts Table:**
| Column Name | Type    | Description |
|-------------|---------|-------------|
| AccountId   | int     | Primary Key |

**Logins Table:**
| Column Name | Type    | Description |
|-------------|---------|-------------|
| AccountId   | int     | Foreign Key to Accounts |
| LoginDate   | date    | Date of login |

### Requirements

- Return: distinct AccountId of users with 5+ consecutive login days
- A user can have multiple login records on the same day
- Consecutive days mean day1, day2, day3, day4, day5 (each 1 day apart)

---

## Approaches

### Approach 1: Row Number with Gaps/Islands (Recommended)

Use ROW_NUMBER() to create groups of consecutive dates by subtracting the row number from the date.

#### Algorithm

1. Get distinct login dates per account using DENSE_RANK
2. Calculate a group identifier: DATE_SUB(LoginDate, INTERVAL rn DAY)
3. When dates are consecutive, this group identifier stays constant
4. GROUP BY AccountId and group_id, count dates in each group
5. Return accounts where any group has 5+ consecutive dates

#### Implementation

```sql
WITH DistinctLogins AS (
    SELECT DISTINCT AccountId, LoginDate
    FROM Logins
),
RankedLogins AS (
    SELECT 
        AccountId,
        LoginDate,
        DATE_SUB(LoginDate, INTERVAL 
            DENSE_RANK() OVER (PARTITION BY AccountId ORDER BY LoginDate) DAY
        ) AS grp
    FROM DistinctLogins
),
ConsecutiveGroups AS (
    SELECT AccountId, grp
    FROM RankedLogins
    GROUP BY AccountId, grp
    HAVING COUNT(*) >= 5
)
SELECT DISTINCT AccountId
FROM ConsecutiveGroups
ORDER BY AccountId;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) |
| Space | O(n) |

---

### Approach 2: LAG with Streak Counting

Use LAG() window function to compare each date with the previous one and count streaks.

#### Algorithm

1. Get distinct login dates per account
2. Use LAG() to get previous date
3. Calculate if current date continues a streak (diff = 1 day)
4. Create streak groups based on breaks in consecutive sequence
5. Count streak lengths and filter for 5+

#### Implementation

```sql
WITH DistinctLogins AS (
    SELECT DISTINCT AccountId, LoginDate
    FROM Logins
),
WithLag AS (
    SELECT 
        AccountId,
        LoginDate,
        LAG(LoginDate) OVER (PARTITION BY AccountId ORDER BY LoginDate) AS prev_date
    FROM DistinctLogins
),
StreakGroups AS (
    SELECT 
        AccountId,
        LoginDate,
        CASE 
            WHEN DATEDIFF(LoginDate, prev_date) = 1 THEN 0
            ELSE 1
        END AS is_new_streak
    FROM WithLag
),
StreakIds AS (
    SELECT 
        AccountId,
        LoginDate,
        SUM(is_new_streak) OVER (PARTITION BY AccountId ORDER BY LoginDate) AS streak_id
    FROM StreakGroups
)
SELECT DISTINCT AccountId
FROM StreakIds
GROUP BY AccountId, streak_id
HAVING COUNT(*) >= 5
ORDER BY AccountId;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) |
| Space | O(n) |

---

### Approach 3: Self JOIN for Consecutive Dates

Self join the Logins table to find 4 consecutive dates after each login date.

#### Algorithm

1. Get distinct login dates per account
2. Self JOIN to find dates that are exactly 1, 2, 3, and 4 days after
3. If all 4 joins succeed, we have 5 consecutive days

#### Implementation

```sql
WITH DistinctLogins AS (
    SELECT DISTINCT AccountId, LoginDate
    FROM Logins
)
SELECT DISTINCT l1.AccountId
FROM DistinctLogins l1
JOIN DistinctLogins l2 
    ON l1.AccountId = l2.AccountId 
    AND DATEDIFF(l2.LoginDate, l1.LoginDate) = 1
JOIN DistinctLogins l3 
    ON l1.AccountId = l3.AccountId 
    AND DATEDIFF(l3.LoginDate, l1.LoginDate) = 2
JOIN DistinctLogins l4 
    ON l1.AccountId = l4.AccountId 
    AND DATEDIFF(l4.LoginDate, l1.LoginDate) = 3
JOIN DistinctLogins l5 
    ON l1.AccountId = l5.AccountId 
    AND DATEDIFF(l5.LoginDate, l1.LoginDate) = 4
ORDER BY l1.AccountId;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n²) worst case |
| Space | O(1) |

---

## Solution Analysis

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| Row Number Gaps/Islands | O(n log n) | O(n) | Efficient, handles variable streak lengths | Requires CTEs |
| LAG with Streak Counting | O(n log n) | O(n) | Intuitive streak logic | More complex CTEs |
| Self JOIN | O(n²) | O(1) | Simple to understand | Very slow for large datasets |

**Recommended:** Approach 1 (Row Number with Gaps/Islands) - most efficient and scalable solution.

---

## Final Solution

```sql
WITH DistinctLogins AS (
    SELECT DISTINCT AccountId, LoginDate
    FROM Logins
),
RankedLogins AS (
    SELECT 
        AccountId,
        LoginDate,
        DATE_SUB(LoginDate, INTERVAL 
            DENSE_RANK() OVER (PARTITION BY AccountId ORDER BY LoginDate) DAY
        ) AS grp
    FROM DistinctLogins
),
ConsecutiveGroups AS (
    SELECT AccountId, grp
    FROM RankedLogins
    GROUP BY AccountId, grp
    HAVING COUNT(*) >= 5
)
SELECT DISTINCT AccountId
FROM ConsecutiveGroups
ORDER BY AccountId;
```

### Key Concepts

- **Gaps and Islands Pattern**: Identifying consecutive sequences using DATE_SUB with row number
- **DENSE_RANK()**: Handles duplicate dates correctly (unlike ROW_NUMBER)
- **CTE chaining**: Breaking complex logic into readable steps
- **GROUP BY with HAVING**: Filtering groups that meet the 5-day threshold

---

**Tags:** `#SQL` `#GapsAndIslands` `#ConsecutiveDates` `#WindowFunctions` `#LeetCode1454`
