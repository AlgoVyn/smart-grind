# Access Adjacent Rows (LEAD and LAG)

## Problem Description

The Access Adjacent Rows pattern uses window functions to retrieve values from previous or next rows in a result set without using self-joins. This pattern is essential for comparing current values with neighboring records, detecting trends, and identifying consecutive sequences.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n) - single pass with window functions |
| Space Complexity | O(n) - for window frame buffer |
| Input | Ordered dataset, offset value |
| Output | Current row values + adjacent row values |
| Approach | Window function with offset lookup |

### When to Use

- **Period-over-period analysis**: Compare current month vs previous month sales
- **Consecutive detection**: Find gaps or continuous sequences in data
- **Trend analysis**: Calculate day-over-day changes or moving differences
- **Previous/next value retrieval**: Get prior or subsequent record values
- **Change detection**: Identify when values increase, decrease, or remain stable
- **Gap analysis**: Find missing values in sequences

## Intuition

The key insight is **relative positioning**. Instead of joining a table to itself with complex ON conditions, window functions maintain a "window" of rows relative to the current row.

The "aha!" moments:

1. **Offset direction matters**: LAG looks backward (previous rows), LEAD looks forward (next rows)
2. **NULL at edges**: Rows without neighbors return NULL (configurable default)
3. **Ordering critical**: Always use ORDER BY in the OVER clause - results are undefined without it
4. **Frame boundaries**: Default is ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
5. **Partition flexibility**: Can restart window calculation per group using PARTITION BY

## Solution Approaches

### Approach 1: LAG - Access Previous Rows

LAG retrieves values from a specified number of rows before the current row.

#### Algorithm

1. Define the column to retrieve from previous rows
2. Specify the offset (how many rows back - default 1)
3. Set default value for when no previous row exists (optional)
4. Define ORDER BY for the window
5. Optionally partition by groups

#### Implementation

**Problem: Rising Temperature (SQL-197)**

```sql
-- Find dates with temperature higher than previous day
SELECT id
FROM (
    SELECT 
        id,
        recordDate,
        temperature,
        LAG(temperature) OVER (ORDER BY recordDate) AS prev_temp,
        LAG(recordDate) OVER (ORDER BY recordDate) AS prev_date
    FROM Weather
) w
WHERE temperature > prev_temp
    AND DATEDIFF(recordDate, prev_date) = 1;
```

**LAG with Multiple Offsets:**

```sql
-- Compare current with 1-day and 7-day previous values
SELECT 
    recordDate,
    temperature,
    LAG(temperature, 1) OVER (ORDER BY recordDate) AS prev_day,
    LAG(temperature, 7) OVER (ORDER BY recordDate) AS prev_week,
    LAG(temperature, 1, 0) OVER (ORDER BY recordDate) AS prev_with_default
FROM Weather;
```

**LAG with PARTITION BY:**

```sql
-- Compare with previous row per category
SELECT 
    category,
    date,
    sales,
    LAG(sales) OVER (PARTITION BY category ORDER BY date) AS prev_sales
FROM SalesData;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - single table scan |
| Space | O(n) - window buffer for offset storage |

### Approach 2: LEAD - Access Next Rows

LEAD retrieves values from a specified number of rows after the current row.

#### Algorithm

1. Define the column to retrieve from subsequent rows
2. Specify the offset (how many rows forward - default 1)
3. Set default value for when no next row exists (optional)
4. Define ORDER BY for the window
5. Optionally partition by groups

#### Implementation

**Problem: Report Contiguous Dates (SQL-1225)**

```sql
-- Detect consecutive date sequences using LEAD
WITH StateGroups AS (
    SELECT 
        fail_date AS date,
        'failed' AS state,
        DATE_SUB(fail_date, INTERVAL 
            ROW_NUMBER() OVER (ORDER BY fail_date) DAY
        ) AS grp
    FROM Failed
    WHERE YEAR(fail_date) = 2019
    
    UNION ALL
    
    SELECT 
        success_date AS date,
        'succeeded' AS state,
        DATE_SUB(success_date, INTERVAL 
            ROW_NUMBER() OVER (ORDER BY success_date) DAY
        ) AS grp
    FROM Succeeded
    WHERE YEAR(success_date) = 2019
)
SELECT 
    state AS period_state,
    MIN(date) AS start_date,
    MAX(date) AS end_date
FROM StateGroups
GROUP BY state, grp
ORDER BY start_date;
```

**LEAD for Next Value Comparison:**

```sql
-- Compare current with next day's temperature
SELECT 
    recordDate,
    temperature,
    LEAD(temperature) OVER (ORDER BY recordDate) AS next_temp,
    LEAD(temperature) OVER (ORDER BY recordDate) - temperature AS temp_change
FROM Weather;
```

**LEAD for Gap Detection:**

```sql
-- Find gaps between consecutive IDs
SELECT 
    id,
    LEAD(id) OVER (ORDER BY id) AS next_id,
    LEAD(id) OVER (ORDER BY id) - id - 1 AS gap_size
FROM Sequences
HAVING gap_size > 0;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - single table scan |
| Space | O(n) - window buffer for offset storage |

### Approach 3: Calculating Differences

Calculate differences between current and adjacent values for trend analysis.

#### Implementation

**Problem: User Activity for the Past 30 Days (SQL-1454)**

```sql
-- Daily active users with day-over-day change
WITH DailyActivity AS (
    SELECT 
        activity_date,
        COUNT(DISTINCT user_id) AS active_users
    FROM Activity
    WHERE activity_date BETWEEN DATE_SUB('2019-07-27', INTERVAL 29 DAY) AND '2019-07-27'
    GROUP BY activity_date
)
SELECT 
    activity_date,
    active_users,
    active_users - LAG(active_users) OVER (ORDER BY activity_date) AS user_change,
    ROUND(
        (active_users - LAG(active_users) OVER (ORDER BY activity_date)) * 100.0 
        / LAG(active_users) OVER (ORDER BY activity_date), 
        2
    ) AS pct_change
FROM DailyActivity;
```

**Period-over-Period Comparison:**

```sql
-- Month-over-month sales comparison
SELECT 
    year,
    month,
    sales,
    LAG(sales) OVER (ORDER BY year, month) AS prev_month_sales,
    sales - LAG(sales) OVER (ORDER BY year, month) AS sales_change,
    CASE 
        WHEN sales > LAG(sales) OVER (ORDER BY year, month) THEN 'Increase'
        WHEN sales < LAG(sales) OVER (ORDER BY year, month) THEN 'Decrease'
        ELSE 'Same'
    END AS trend
FROM MonthlySales;
```

**Year-over-Year Comparison:**

```sql
-- Compare same month across years
SELECT 
    year,
    month,
    sales,
    LAG(sales, 12) OVER (ORDER BY year, month) AS same_month_last_year,
    ROUND(
        (sales - LAG(sales, 12) OVER (ORDER BY year, month)) * 100.0 
        / LAG(sales, 12) OVER (ORDER BY year, month), 
        2
    ) AS yoy_growth_pct
FROM MonthlySales;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - single pass with multiple window functions |
| Space | O(n) - buffer stores values for all offsets used |

### Approach 4: Consecutive Detection - Gap Analysis

Identify consecutive sequences or gaps in ordered data.

#### Implementation

**Consecutive Date Detection:**

```sql
-- Group consecutive dates using island pattern
WITH DateGaps AS (
    SELECT 
        date,
        DATE_SUB(date, INTERVAL 
            ROW_NUMBER() OVER (ORDER BY date) DAY
        ) AS island_group
    FROM Events
)
SELECT 
    MIN(date) AS start_date,
    MAX(date) AS end_date,
    COUNT(*) AS consecutive_days
FROM DateGaps
GROUP BY island_group
HAVING COUNT(*) >= 3;
```

**Gap Detection with LEAD/LAG:**

```sql
-- Find all gaps in a sequence
SELECT 
    id AS gap_start,
    next_id AS gap_end
FROM (
    SELECT 
        id,
        LEAD(id) OVER (ORDER BY id) AS next_id
    FROM Sequences
) gaps
WHERE next_id - id > 1;
```

**Consecutive Same-Value Detection:**

```sql
-- Find consecutive rows with same status
WITH StatusGroups AS (
    SELECT 
        id,
        status,
        id - ROW_NUMBER() OVER (PARTITION BY status ORDER BY id) AS grp
    FROM Records
)
SELECT 
    status,
    MIN(id) AS start_id,
    MAX(id) AS end_id,
    COUNT(*) AS consecutive_count
FROM StatusGroups
GROUP BY status, grp
HAVING COUNT(*) >= 2;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - with grouping; O(n) for gap detection |
| Space | O(n) - for intermediate results |

## Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| LAG | O(n) | O(n) | **Recommended** - previous value comparison |
| LEAD | O(n) | O(n) | **Recommended** - next value comparison |
| Differences | O(n) | O(n) | Trend analysis, period-over-period |
| Consecutive Detection | O(n log n) | O(n) | Gap finding, sequence grouping |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| Rising Temperature | 197 | Easy | Compare with previous day using LAG |
| Report Contiguous Dates | 1225 | Hard | Consecutive date detection with window functions |
| User Activity for the Past 30 Days | 1454 | Easy | Daily aggregation with trend analysis |
| Consecutive Numbers | 180 | Medium | Find consecutive increasing values |
| Nth Highest Salary | 177 | Medium | Offset-based ranking |

## Key Takeaways

- **Direction awareness**: LAG = look back, LEAD = look forward
- **ORDER BY required**: Window functions need explicit ordering
- **Default values**: Handle edge cases with default parameter
- **Offset flexibility**: Can access any number of rows away (not just adjacent)
- **Combine functions**: Multiple window functions in one query for complex analysis
- **Partition power**: Restart calculations per group with PARTITION BY

## Common Pitfalls

1. **Missing ORDER BY**: Window functions return undefined results without ORDER BY
2. **Wrong offset direction**: Using LAG when you meant LEAD (or vice versa)
3. **Not handling NULLs**: First/last rows return NULL - provide defaults if needed
4. **Partition confusion**: Forgetting PARTITION BY causes cross-group comparisons
5. **Performance with large offsets**: Very large offset values may impact performance
6. **Frame specification**: Default frames may differ between databases

## LAG/LEAD Syntax Reference

| Database | Syntax | Notes |
|----------|--------|-------|
| MySQL | `LAG(col, offset, default) OVER (...)` | Offset and default are optional |
| PostgreSQL | `LAG(col, offset, default) OVER (...)` | Same as MySQL |
| SQL Server | `LAG(col, offset, default) OVER (...)` | Same syntax |
| Oracle | `LAG(col, offset, default) OVER (...)` | Same syntax |
| SQLite | Not supported | Use subqueries or self-joins |

## Pattern Source

[Access Adjacent Rows](sql/access-adjacent-rows.md)
