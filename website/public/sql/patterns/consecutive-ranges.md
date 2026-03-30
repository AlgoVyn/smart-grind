# Consecutive Ranges (Gaps and Islands)

## Problem Description

The Consecutive Ranges pattern solves the classic "gaps and islands" problem in SQL - identifying continuous sequences (islands) and breaks between them (gaps) in ordered data. This pattern is essential for grouping consecutive values, finding streaks, and detecting missing values in sequences.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n log n) - sorting plus grouping operations |
| Space Complexity | O(n) - for intermediate group calculations |
| Input | Ordered dataset with sequence values (dates, IDs, numbers) |
| Output | Grouped consecutive ranges with start/end boundaries |
| Approach | Calculate group identifier → Aggregate by group |

### When to Use

- **Session analysis**: Group consecutive user activity periods
- **Consecutive detection**: Find continuous date ranges or ID sequences
- **Streak finding**: Identify winning/losing streaks in games or metrics
- **Gap identification**: Detect missing values in expected sequences
- **Range consolidation**: Compress consecutive records into start/end pairs
- **Log analysis**: Group continuous system uptime/downtime periods

## Intuition

The key insight is **constant difference = same group**. When values are consecutive, the difference between the value and its position in the sequence remains constant. This creates a "group identifier" that can be used to aggregate consecutive rows.

The "aha!" moments:

1. **Island = consecutive**: Rows with consecutive values form an "island"
2. **Gap = break**: Non-consecutive values indicate a gap between islands
3. **Row number technique**: `value - ROW_NUMBER()` stays constant within an island
4. **LAG/LEAD detection**: Compare current value with previous/next to detect breaks
5. **Group aggregation**: Once grouped, standard aggregation finds island boundaries

## Solution Approaches

### Approach 1: Row Number Method - Classic Gaps/Islands ✅ Recommended

The classic technique subtracts the row number from the sequence value. Within consecutive sequences, this difference remains constant, creating a natural group identifier.

#### Algorithm

1. Calculate row number ordered by the sequence column
2. Subtract row number from sequence value to create group_id
3. Group by the group_id to aggregate consecutive rows
4. Use MIN/MAX to find start and end of each island

#### Implementation

**Problem: Human Traffic of Stadium (SQL-601)**

```sql
-- Find consecutive periods with high traffic
WITH TrafficWithRowNum AS (
    SELECT 
        id,
        visit_date,
        people,
        ROW_NUMBER() OVER (ORDER BY visit_date) AS rn
    FROM Stadium
    WHERE people >= 100
),
IslandGroups AS (
    SELECT 
        id,
        visit_date,
        people,
        DATE_SUB(visit_date, INTERVAL rn DAY) AS grp
    FROM TrafficWithRowNum
)
SELECT 
    MIN(visit_date) AS start_date,
    MAX(visit_date) AS end_date,
    SUM(people) AS total_people,
    COUNT(*) AS consecutive_days
FROM IslandGroups
GROUP BY grp
HAVING COUNT(*) >= 3;
```

**Basic Consecutive Date Grouping:**

```sql
-- Group consecutive login dates per user
WITH UserLogins AS (
    SELECT 
        user_id,
        login_date,
        DATE_SUB(login_date, INTERVAL 
            ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) DAY
        ) AS grp
    FROM Logins
)
SELECT 
    user_id,
    MIN(login_date) AS streak_start,
    MAX(login_date) AS streak_end,
    COUNT(*) AS streak_length
FROM UserLogins
GROUP BY user_id, grp
ORDER BY user_id, streak_start;
```

**Numeric Sequence Grouping:**

```sql
-- Group consecutive ID sequences
WITH Numbered AS (
    SELECT 
        id,
        value,
        id - ROW_NUMBER() OVER (ORDER BY id) AS grp
    FROM Sequences
)
SELECT 
    MIN(id) AS range_start,
    MAX(id) AS range_end,
    COUNT(*) AS range_length,
    GROUP_CONCAT(value) AS values_in_range
FROM Numbered
GROUP BY grp
ORDER BY range_start;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - sorting for row number calculation |
| Space | O(n) - for intermediate CTE results |

### Approach 2: LAG/LEAD Method - Window Function Approach

Use LAG and LEAD to compare each value with its neighbors, detecting where consecutive sequences break.

#### Algorithm

1. Use LAG to get previous value in sequence
2. Calculate gap between current and previous value
3. Identify island starts (gap > 1 or NULL)
4. Use LEAD to find island ends or aggregate results

#### Implementation

**Problem: Report Contiguous Dates (SQL-1225)**

```sql
-- Report consecutive success/failure periods
WITH StatusDates AS (
    SELECT fail_date AS date, 'failed' AS status FROM Failed
    UNION ALL
    SELECT success_date AS date, 'succeeded' AS status FROM Succeeded
),
Marked AS (
    SELECT 
        date,
        status,
        LAG(date) OVER (PARTITION BY status ORDER BY date) AS prev_date,
        CASE 
            WHEN LAG(date) OVER (PARTITION BY status ORDER BY date) IS NULL 
                THEN 1
            WHEN DATEDIFF(date, LAG(date) OVER (PARTITION BY status ORDER BY date)) > 1 
                THEN 1
            ELSE 0
        END AS is_new_island
    FROM StatusDates
    WHERE YEAR(date) = 2019
),
Islands AS (
    SELECT 
        date,
        status,
        SUM(is_new_island) OVER (PARTITION BY status ORDER BY date) AS island_id
    FROM Marked
)
SELECT 
    status AS period_state,
    MIN(date) AS start_date,
    MAX(date) AS end_date
FROM Islands
GROUP BY status, island_id
ORDER BY start_date;
```

**Detect Island Boundaries:**

```sql
-- Find start and end of each consecutive sequence
WITH MarkedBoundaries AS (
    SELECT 
        id,
        value,
        LAG(value) OVER (ORDER BY id) AS prev_value,
        LEAD(value) OVER (ORDER BY id) AS next_value,
        CASE 
            WHEN value - LAG(value) OVER (ORDER BY id) > 1 THEN 'START'
            WHEN LEAD(value) OVER (ORDER BY id) - value > 1 THEN 'END'
            WHEN LAG(value) OVER (ORDER BY id) IS NULL THEN 'START'
            WHEN LEAD(value) OVER (ORDER BY id) IS NULL THEN 'END'
            ELSE 'MIDDLE'
        END AS position
    FROM Sequences
)
SELECT 
    id,
    value,
    position
FROM MarkedBoundaries
WHERE position IN ('START', 'END')
ORDER BY id;
```

**Gap Detection with LEAD:**

```sql
-- Identify all gaps in a sequence
WITH NextValues AS (
    SELECT 
        id,
        LEAD(id) OVER (ORDER BY id) AS next_id,
        LEAD(id) OVER (ORDER BY id) - id - 1 AS gap_size
    FROM Sequences
)
SELECT 
    id AS gap_after,
    next_id AS gap_before,
    gap_size
FROM NextValues
WHERE gap_size > 0
ORDER BY id;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - single pass with window functions |
| Space | O(n) - for window buffer storage |

### Approach 3: Group Identifier - Island Identification

Create explicit group identifiers using cumulative sums of island-start indicators.

#### Algorithm

1. Mark rows that start a new island (gap from previous > 1)
2. Calculate running sum of island-start flags to create group_id
3. Group by the calculated group_id
4. Aggregate to find island boundaries

#### Implementation

**Problem: User Activity for the Past 30 Days (SQL-1454)**

```sql
-- Group consecutive active days
WITH ActiveDays AS (
    SELECT 
        activity_date,
        COUNT(DISTINCT user_id) AS active_users,
        LAG(activity_date) OVER (ORDER BY activity_date) AS prev_date
    FROM Activity
    WHERE activity_date >= DATE_SUB('2019-07-27', INTERVAL 29 DAY)
    GROUP BY activity_date
),
MarkedGroups AS (
    SELECT 
        activity_date,
        active_users,
        CASE 
            WHEN DATEDIFF(activity_date, prev_date) = 1 THEN 0
            ELSE 1
        END AS new_group_flag
    FROM ActiveDays
),
WithGroupId AS (
    SELECT 
        activity_date,
        active_users,
        SUM(new_group_flag) OVER (ORDER BY activity_date) AS grp
    FROM MarkedGroups
)
SELECT 
    MIN(activity_date) AS period_start,
    MAX(activity_date) AS period_end,
    SUM(active_users) AS total_users,
    COUNT(*) AS consecutive_days
FROM WithGroupId
GROUP BY grp
HAVING COUNT(*) >= 2;
```

**Generic Island Identification:**

```sql
-- Generic consecutive grouping with group identifier
WITH IslandMarkers AS (
    SELECT 
        seq_value,
        CASE 
            WHEN seq_value - LAG(seq_value) OVER (ORDER BY seq_value) = 1 
            THEN 0 
            ELSE 1 
        END AS is_new_island
    FROM SequenceTable
),
WithGroupIds AS (
    SELECT 
        seq_value,
        SUM(is_new_island) OVER (ORDER BY seq_value) AS grp
    FROM IslandMarkers
)
SELECT 
    grp AS island_id,
    MIN(seq_value) AS island_start,
    MAX(seq_value) AS island_end,
    COUNT(*) AS island_size
FROM WithGroupIds
GROUP BY grp
ORDER BY island_id;
```

**Multi-Column Island Grouping:**

```sql
-- Group consecutive sequences per category
WITH CategoryIslands AS (
    SELECT 
        category,
        value,
        CASE 
            WHEN value - LAG(value) OVER (PARTITION BY category ORDER BY value) = 1 
            THEN 0 
            ELSE 1 
        END AS island_start
    FROM CategoryData
),
WithGroups AS (
    SELECT 
        category,
        value,
        SUM(island_start) OVER (PARTITION BY category ORDER BY value) AS grp
    FROM CategoryIslands
)
SELECT 
    category,
    MIN(value) AS range_start,
    MAX(value) AS range_end,
    COUNT(*) AS consecutive_count
FROM WithGroups
GROUP BY category, grp
ORDER BY category, range_start;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - sorting for cumulative sum |
| Space | O(n) - for intermediate results |

### Approach 4: Gap Detection - Finding Breaks

Focus on identifying gaps rather than islands - useful for finding missing values in expected sequences.

#### Algorithm

1. Generate or identify expected sequence values
2. Compare with actual values using LEFT JOIN or window functions
3. Identify where expected values are missing
4. Group consecutive gaps or report individual missing values

#### Implementation

**Find Missing IDs in Sequence:**

```sql
-- Find all gaps in an ID sequence
WITH RECURSIVE AllIds AS (
    SELECT MIN(id) AS id FROM Records
    UNION ALL
    SELECT id + 1 FROM AllIds WHERE id < (SELECT MAX(id) FROM Records)
),
Gaps AS (
    SELECT a.id AS missing_id
    FROM AllIds a
    LEFT JOIN Records r ON a.id = r.id
    WHERE r.id IS NULL
)
SELECT missing_id FROM Gaps ORDER BY missing_id;
```

**Gap Analysis with Window Functions:**

```sql
-- Analyze gap sizes between consecutive records
WITH Gaps AS (
    SELECT 
        id,
        value,
        id - LAG(id) OVER (ORDER BY id) - 1 AS records_missing,
        LAG(id) OVER (ORDER BY id) AS previous_id
    FROM Records
)
SELECT 
    previous_id AS gap_start,
    id AS gap_end,
    records_missing AS missing_count,
    CONCAT(previous_id + 1, ' to ', id - 1) AS missing_range
FROM Gaps
WHERE records_missing > 0
ORDER BY previous_id;
```

**Date Gap Detection:**

```sql
-- Find missing dates in a calendar
WITH DateGaps AS (
    SELECT 
        date,
        LEAD(date) OVER (ORDER BY date) AS next_date,
        DATEDIFF(LEAD(date) OVER (ORDER BY date), date) - 1 AS days_missing
    FROM Calendar
)
SELECT 
    date AS gap_after,
    next_date AS gap_before,
    days_missing,
    CASE 
        WHEN days_missing = 1 THEN DATE_ADD(date, INTERVAL 1 DAY)
        ELSE CONCAT(
            DATE_ADD(date, INTERVAL 1 DAY), 
            ' to ', 
            DATE_SUB(next_date, INTERVAL 1 DAY)
        )
    END AS missing_dates
FROM DateGaps
WHERE days_missing > 0;
```

**Consecutive Gap Grouping:**

```sql
-- Group consecutive gaps into ranges
WITH GapDetection AS (
    SELECT 
        expected_date,
        actual_date,
        expected_date - ROW_NUMBER() OVER (ORDER BY expected_date) AS grp
    FROM (
        SELECT 
            DATE_ADD((SELECT MIN(date) FROM Events), INTERVAL n DAY) AS expected_date,
            e.date AS actual_date
        FROM (
            SELECT a.N + b.N * 10 + c.N * 100 AS n
            FROM 
                (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4
                 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
                (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4
                 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) b,
                (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4
                 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) c
        ) numbers
        LEFT JOIN Events e ON DATE_ADD((SELECT MIN(date) FROM Events), INTERVAL n DAY) = e.date
        WHERE DATE_ADD((SELECT MIN(date) FROM Events), INTERVAL n DAY) <= (SELECT MAX(date) FROM Events)
    ) missing
    WHERE actual_date IS NULL
)
SELECT 
    MIN(expected_date) AS gap_start,
    MAX(expected_date) AS gap_end,
    COUNT(*) AS gap_length
FROM GapDetection
GROUP BY grp
ORDER BY gap_start;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) to O(n²) - depends on sequence generation method |
| Space | O(n) - for gap identification results |

## Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| Row Number Method | O(n log n) | O(n) | **Recommended** - classic gaps/islands |
| LAG/LEAD Method | O(n) | O(n) | Boundary detection, gap analysis |
| Group Identifier | O(n log n) | O(n) | Complex island conditions |
| Gap Detection | O(n) to O(n²) | O(n) | Finding missing values |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| Human Traffic of Stadium | 601 | Hard | Find consecutive high-traffic periods |
| Report Contiguous Dates | 1225 | Hard | Group consecutive success/failure periods |
| User Activity for the Past 30 Days | 1454 | Easy | Daily activity with consecutive analysis |
| Consecutive Numbers | 180 | Medium | Find consecutive increasing values |
| Rising Temperature | 197 | Easy | Compare consecutive dates |
| Game Play Analysis I | 511 | Easy | First login detection using gaps |

## Key Takeaways

- **Row number formula**: `value - ROW_NUMBER()` creates constant group identifiers within islands
- **LAG detection**: `current - LAG(current) > 1` indicates a new island start
- **Partition awareness**: Add `PARTITION BY` for per-category consecutive detection
- **Edge handling**: First/last rows often need NULL handling for proper boundary detection
- **Aggregation power**: Once grouped, standard aggregation finds boundaries and statistics
- **Date arithmetic**: Use `DATEDIFF` or date subtraction for temporal sequences

## Common Pitfalls

1. **Off-by-one errors**: Ensure gap detection uses correct comparison (`> 1` vs `!= 1`)
2. **NULL handling**: First rows in LAG/LEAD return NULL - handle with `IS NULL` checks
3. **Partition forgetting**: Omitting `PARTITION BY` merges islands across groups incorrectly
4. **Date vs numeric**: Date subtraction differs from numeric; use appropriate functions
5. **Duplicate values**: Duplicate sequence values break consecutive detection - deduplicate first
6. **Time zones**: Date comparisons may fail across timezone boundaries

## Formula Reference

| Sequence Type | Group Identifier Formula |
|---------------|-------------------------|
| Numeric IDs | `id - ROW_NUMBER() OVER (ORDER BY id)` |
| Dates | `DATE_SUB(date, INTERVAL ROW_NUMBER() OVER (ORDER BY date) DAY)` |
| Per-User Dates | `DATE_SUB(date, INTERVAL ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY date) DAY)` |
| Island Start | `CASE WHEN value - LAG(value) OVER (ORDER BY value) > 1 THEN 1 ELSE 0 END` |

## Pattern Source

[Consecutive Ranges](sql/consecutive-ranges.md)
