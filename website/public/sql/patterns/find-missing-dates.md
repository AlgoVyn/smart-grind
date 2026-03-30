# Find Missing Dates

## Problem Description

Finding missing dates involves identifying gaps in a sequence of dates or detecting when expected consecutive dates are absent from a dataset. This pattern is essential for time-series analysis, data completeness checks, and identifying periods without activity.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n log n) - sorting required, O(n) for window functions |
| Space Complexity | O(n) - generating missing dates or storing gaps |
| Input | Table with date column, possibly partitioned by another column |
| Output | Missing date ranges or individual missing dates |
| Approach | Self-join, window functions, or sequence generation |

### When to Use

- **Data completeness auditing**: Find days with no recorded data
- **Consecutive activity detection**: Identify users/entities with continuous activity
- **Range analysis**: Determine coverage of date ranges in your data
- **Missing data interpolation**: Identify where data needs to be filled
- **Attendance/activity tracking**: Find missing days in logs

## Intuition

The key insight is that **dates have a natural order and arithmetic**, allowing you to compare dates and identify gaps by checking if the difference between consecutive dates exceeds 1 day.

The "aha!" moments:

1. **Self-join on dates**: Join each date with the next expected date to see if it exists
2. **LEAD/LAG for gaps**: Window functions make it easy to compare each date with its neighbor
3. **Date math is your friend**: `DATEDIFF`, `DATE_ADD`, and subtraction reveal gaps naturally
4. **Row number trick**: The difference between a date's position and its actual value reveals groups
5. **Generate the missing**: Sometimes it's easier to generate all dates and find what's NOT in your data

## Solution Approaches

### Approach 1: Self-Join Date Comparison - Finding Consecutive Dates ✅ Recommended

Compare each date with potential consecutive dates to find where gaps exist.

#### Algorithm

1. Self-join the table with a date offset condition
2. Find dates where the expected next date is missing
3. Generate the missing date range

#### Implementation

**Problem: Report Contiguous Dates (SQL-1225)**

```sql
-- Find all missing dates between min and max date
SELECT DISTINCT missing_date
FROM (
    SELECT DATE_ADD(t1.period_start, INTERVAL n.n DAY) AS missing_date
    FROM (
        SELECT MIN(period_start) AS period_start, MAX(period_end) AS period_end
        FROM Tasks
    ) t1
    JOIN (
        SELECT a.N + b.N * 10 + c.N * 100 AS n
        FROM (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4
              UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a
        JOIN (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4
              UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) b
        JOIN (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4
              UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) c
    ) n ON DATE_ADD(t1.period_start, INTERVAL n.n DAY) <= t1.period_end
) all_dates
WHERE missing_date NOT IN (SELECT period_start FROM Tasks)
  AND missing_date NOT IN (SELECT period_end FROM Tasks);
```

**Problem: Find Missing IDs (similar pattern for IDs)**

```sql
-- Find gaps in ID sequence (same logic applies to dates)
SELECT (t1.id + 1) AS gap_start, (MIN(t2.id) - 1) AS gap_end
FROM Tasks t1
INNER JOIN Tasks t2 ON t1.id < t2.id
GROUP BY t1.id
HAVING (t1.id + 1) < MIN(t2.id);
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n²) worst case, O(n log n) with proper indexing |
| Space | O(k) - k missing dates found |

### Approach 2: LEAD/LAG Gap Detection - Window Functions

Use window functions to compare each date with its immediate predecessor or successor.

#### Implementation

**Problem: User Activity for the Past 30 Days (SQL-1459)**

```sql
-- Find users with continuous activity using LAG
SELECT user_id
FROM (
    SELECT 
        user_id,
        activity_date,
        LAG(activity_date) OVER (PARTITION BY user_id ORDER BY activity_date) AS prev_date
    FROM Activity
    WHERE activity_date BETWEEN DATE_SUB('2019-07-27', INTERVAL 29 DAY) AND '2019-07-27'
) t
WHERE DATEDIFF(activity_date, prev_date) = 1
GROUP BY user_id
HAVING COUNT(*) >= 2;
```

**Problem: Finding Gaps with LEAD**

```sql
-- Find start of each gap
SELECT 
    date,
    DATE_ADD(date, INTERVAL 1 DAY) AS gap_start,
    DATE_SUB(next_date, INTERVAL 1 DAY) AS gap_end,
    DATEDIFF(next_date, date) - 1 AS days_missing
FROM (
    SELECT 
        date,
        LEAD(date) OVER (ORDER BY date) AS next_date
    FROM activity_log
) t
WHERE DATEDIFF(next_date, date) > 1;
```

**Problem: Report Contiguous Dates (SQL-1225) - Grouping consecutive dates**

```sql
-- Group contiguous date ranges using ROW_NUMBER
SELECT 
    MIN(date) AS start_date,
    MAX(date) AS end_date
FROM (
    SELECT 
        date,
        DATE_SUB(date, INTERVAL ROW_NUMBER() OVER (ORDER BY date) DAY) AS grp
    FROM activity_log
) t
GROUP BY grp;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - sorting for window functions |
| Space | O(n) - window function buffering |

### Approach 3: Date Difference Method - DATEDIFF Approaches

Calculate date differences to identify gaps and consecutive periods.

#### Implementation

**Problem: Active Users (SQL-1454)**

```sql
-- Find users active for 5 consecutive days
WITH daily_activity AS (
    SELECT DISTINCT user_id, activity_date
    FROM Activity
),
gap_calc AS (
    SELECT 
        user_id,
        activity_date,
        DATE_SUB(activity_date, INTERVAL 
            DENSE_RANK() OVER (PARTITION BY user_id ORDER BY activity_date) DAY
        ) AS grp
    FROM daily_activity
)
SELECT DISTINCT user_id
FROM gap_calc
GROUP BY user_id, grp
HAVING COUNT(*) >= 5;
```

**Problem: Basic Gap Detection with DATEDIFF**

```sql
-- Find dates with gaps from previous date
SELECT 
    curr.date,
    DATEDIFF(curr.date, prev.date) AS days_since_last
FROM activity_log curr
LEFT JOIN activity_log prev ON prev.date = (
    SELECT MAX(date) 
    FROM activity_log 
    WHERE date < curr.date
)
WHERE DATEDIFF(curr.date, prev.date) > 1;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - subquery for each row |
| Space | O(k) - results set |

### Approach 4: Row Number Method - Sequence Gaps

Use ROW_NUMBER to create a group identifier that stays constant for consecutive dates.

#### Implementation

**Problem: Find Start and End of Continuous Ranges (SQL-1285 adapted for dates)**

```sql
-- Group consecutive dates into ranges
WITH numbered AS (
    SELECT 
        date,
        ROW_NUMBER() OVER (ORDER BY date) AS rn
    FROM activity_log
),
grouped AS (
    SELECT 
        date,
        DATE_SUB(date, INTERVAL rn DAY) AS grp
    FROM numbered
)
SELECT 
    MIN(date) AS range_start,
    MAX(date) AS range_end,
    COUNT(*) AS days_in_range
FROM grouped
GROUP BY grp
ORDER BY range_start;
```

**Problem: Finding Missing Dates via EXCEPT/NOT IN**

```sql
-- Generate all dates in range and find missing
WITH RECURSIVE all_dates AS (
    SELECT MIN(date) AS date FROM activity_log
    UNION ALL
    SELECT DATE_ADD(date, INTERVAL 1 DAY)
    FROM all_dates
    WHERE date < (SELECT MAX(date) FROM activity_log)
)
SELECT date AS missing_date
FROM all_dates
WHERE date NOT IN (SELECT date FROM activity_log);
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - single pass with window function |
| Space | O(n) - for CTE or generated sequence |

## Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| Self-Join | O(n²) | O(k) | Simple gap detection, small datasets |
| LEAD/LAG | O(n log n) | O(n) | **Recommended** - finding gaps, consecutive detection |
| DATEDIFF | O(n log n) | O(k) | Measuring gap sizes |
| Row Number | O(n) | O(n) | Grouping consecutive ranges, large datasets |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| Report Contiguous Dates | 1225 | Hard | Find and report all dates without data |
| Active Users | 1454 | Medium | Users with 5+ consecutive active days |
| User Activity for Past 30 Days | 1459 | Easy | Users active each of last 30 days |
| Find the Start and End Number of Continuous Ranges | 1285 | Medium | Group consecutive numbers/dates |
| Rising Temperature | 197 | Easy | Date comparison with self-join |
| Game Play Analysis IV | 534 | Medium | Consecutive day detection |
| Human Traffic of Stadium | 601 | Hard | Complex consecutive pattern matching |

## Key Takeaways

- **Window functions are powerful**: `LEAD`, `LAG`, and `ROW_NUMBER` simplify gap detection significantly
- **Date arithmetic varies by dialect**: Use `DATE_ADD`/`DATEDIFF` (MySQL), `+ INTERVAL` (PostgreSQL), or `DATEADD` (SQL Server)
- **The ROW_NUMBER trick**: `date - ROW_NUMBER()` creates a constant group ID for consecutive dates
- **Generate vs. detect**: Sometimes generating all dates and filtering is easier than finding gaps
- **Consider performance**: For large tables, indexes on date columns are essential

## Common Pitfalls

1. **Time components in dates**: Use `DATE()` function to strip time if comparing dates with timestamps
2. **Timezone issues**: Ensure all dates are in the same timezone before comparing
3. **Off-by-one errors**: Remember that a gap of 2 days means 1 missing date in between
4. **Partition carefully**: When using window functions, ensure proper `PARTITION BY` for multi-user/entity data
5. **Duplicate dates**: Use `DISTINCT` before gap detection to avoid false gaps from duplicates
6. **Date format assumptions**: Always use proper date types, not strings, for comparisons

## Pattern Comparison

| Pattern | Method | Use Case |
|---------|--------|----------|
| Basic Gap | `LEAD(date) - date > 1` | Simple missing date detection |
| Consecutive Groups | `date - ROW_NUMBER()` | Grouping continuous periods |
| Full Range | `GENERATE_SERIES` / numbers table | Finding ALL missing dates |
| Active Streaks | `DATEDIFF = 1` consecutive check | Streak/continuity detection |
| Range Coverage | Self-join with `NOT EXISTS` | Complete range validation |

## Pattern Source

[Find Missing Dates](sql/find-missing-dates.md)
