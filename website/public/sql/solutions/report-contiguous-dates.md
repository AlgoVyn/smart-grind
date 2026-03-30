# 1225. Report Contiguous Dates

## Problem

Generate a report of all dates with their period state (failed or succeeded), grouped into contiguous date ranges.

### Schema

**Failed Table:**
| Column Name | Type |
|-------------|------|
| fail_date   | date |

**Succeeded Table:**
| Column Name | Type |
|-------------|------|
| success_date| date |

### Requirements

- Combine all dates from both tables with their period state
- Group consecutive dates into contiguous ranges
- Return: period_state, start_date, end_date
- Order by start_date ascending
- Only include dates between 2019-01-01 and 2019-12-31

**Example:**
Failed: 2019-01-03, 2019-01-04, 2019-01-05, 2019-01-07
Succeeded: 2019-01-01, 2019-01-02, 2019-01-06

Result:
| period_state | start_date | end_date   |
|--------------|------------|------------|
| succeeded    | 2019-01-01 | 2019-01-02 |
| failed       | 2019-01-03 | 2019-01-05 |
| succeeded    | 2019-01-06 | 2019-01-06 |
| failed       | 2019-01-07 | 2019-01-07 |

## Approaches

### Approach 1: UNION ALL with Row Number Difference (Recommended)

Use UNION ALL to combine both tables, then apply the gaps/islands pattern with ROW_NUMBER() to identify consecutive date ranges.

#### Algorithm

1. UNION ALL both tables with a period_state label
2. Filter to dates in 2019
3. Assign ROW_NUMBER() ordered by date
4. Calculate group: DATE - INTERVAL row_number DAY
5. Group by period_state and grp to get start/end dates
6. Order by start_date

#### Implementation

```sql
WITH AllDates AS (
    SELECT 'failed' AS period_state, fail_date AS date_val
    FROM Failed
    WHERE fail_date BETWEEN '2019-01-01' AND '2019-12-31'
    UNION ALL
    SELECT 'succeeded' AS period_state, success_date AS date_val
    FROM Succeeded
    WHERE success_date BETWEEN '2019-01-01' AND '2019-12-31'
),
RankedDates AS (
    SELECT 
        period_state,
        date_val,
        ROW_NUMBER() OVER (ORDER BY date_val) AS rn,
        DATE_SUB(date_val, INTERVAL ROW_NUMBER() OVER (ORDER BY date_val) DAY) AS grp
    FROM AllDates
)
SELECT 
    period_state,
    MIN(date_val) AS start_date,
    MAX(date_val) AS end_date
FROM RankedDates
GROUP BY period_state, grp
ORDER BY start_date;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - sorting for UNION and window function |
| Space | O(n) - CTEs store combined results |

### Approach 2: Recursive CTE for Date Generation

Generate all dates in 2019 recursively, then LEFT JOIN to determine state and group consecutive dates.

#### Algorithm

1. Generate all dates in 2019 using recursive CTE
2. LEFT JOIN to determine if each date is failed, succeeded, or neither
3. Use window functions to identify state changes
4. Group consecutive dates with same state

#### Implementation

```sql
WITH RECURSIVE DateRange AS (
    SELECT '2019-01-01' AS dt
    UNION ALL
    SELECT DATE_ADD(dt, INTERVAL 1 DAY)
    FROM DateRange
    WHERE dt < '2019-12-31'
),
DateStates AS (
    SELECT 
        d.dt,
        CASE 
            WHEN f.fail_date IS NOT NULL THEN 'failed'
            WHEN s.success_date IS NOT NULL THEN 'succeeded'
            ELSE NULL
        END AS period_state
    FROM DateRange d
    LEFT JOIN Failed f ON d.dt = f.fail_date
    LEFT JOIN Succeeded s ON d.dt = s.success_date
),
FilteredStates AS (
    SELECT 
        dt,
        period_state,
        ROW_NUMBER() OVER (ORDER BY dt) AS rn,
        DATE_SUB(dt, INTERVAL ROW_NUMBER() OVER (ORDER BY dt) DAY) AS grp
    FROM DateStates
    WHERE period_state IS NOT NULL
)
SELECT 
    period_state,
    MIN(dt) AS start_date,
    MAX(dt) AS end_date
FROM FilteredStates
GROUP BY period_state, grp
ORDER BY start_date;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - linear scan for 365 days |
| Space | O(n) - recursive CTE stack and CTEs |

### Approach 3: LAG/LEAD for Gap Detection

Use LAG/LEAD window functions to explicitly detect state changes and group consecutive dates.

#### Algorithm

1. Combine both tables with UNION ALL
2. Use LAG to get previous date and previous state
3. Detect state changes or date gaps to mark new groups
4. Use running sum to assign group numbers
5. Aggregate by group

#### Implementation

```sql
WITH AllDates AS (
    SELECT 'failed' AS period_state, fail_date AS date_val
    FROM Failed
    WHERE fail_date BETWEEN '2019-01-01' AND '2019-12-31'
    UNION ALL
    SELECT 'succeeded' AS period_state, success_date AS date_val
    FROM Succeeded
    WHERE success_date BETWEEN '2019-01-01' AND '2019-12-31'
),
WithContext AS (
    SELECT 
        period_state,
        date_val,
        LAG(date_val) OVER (ORDER BY date_val) AS prev_date,
        LAG(period_state) OVER (ORDER BY date_val) AS prev_state
    FROM AllDates
),
WithGroups AS (
    SELECT 
        period_state,
        date_val,
        SUM(CASE 
            WHEN prev_date IS NULL 
                 OR DATEDIFF(date_val, prev_date) > 1 
                 OR period_state != prev_state 
            THEN 1 ELSE 0 
        END) OVER (ORDER BY date_val) AS grp
    FROM WithContext
)
SELECT 
    period_state,
    MIN(date_val) AS start_date,
    MAX(date_val) AS end_date
FROM WithGroups
GROUP BY period_state, grp
ORDER BY start_date;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - sorting for window functions |
| Space | O(n) - CTEs with window function results |

## Solution Analysis

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| UNION + Row Number | O(n log n) | O(n) | Clean, standard gaps/islands pattern | Requires sorting |
| Recursive CTE | O(n) | O(n) | Explicit date enumeration | Higher overhead, limited recursion depth |
| LAG/LEAD | O(n log n) | O(n) | Very explicit logic | More verbose |

**Recommended:** Approach 1 (UNION ALL with Row Number Difference) - it's the standard, most portable solution for gaps/islands problems.

## Final Solution

```sql
WITH AllDates AS (
    SELECT 'failed' AS period_state, fail_date AS date_val
    FROM Failed
    WHERE fail_date BETWEEN '2019-01-01' AND '2019-12-31'
    UNION ALL
    SELECT 'succeeded' AS period_state, success_date AS date_val
    FROM Succeeded
    WHERE success_date BETWEEN '2019-01-01' AND '2019-12-31'
),
RankedDates AS (
    SELECT 
        period_state,
        date_val,
        ROW_NUMBER() OVER (ORDER BY date_val) AS rn,
        DATE_SUB(date_val, INTERVAL ROW_NUMBER() OVER (ORDER BY date_val) DAY) AS grp
    FROM AllDates
)
SELECT 
    period_state,
    MIN(date_val) AS start_date,
    MAX(date_val) AS end_date
FROM RankedDates
GROUP BY period_state, grp
ORDER BY start_date;
```

### Key Concepts

- **Gaps and Islands**: Classic SQL problem of finding consecutive sequences (islands) separated by gaps
- **ROW_NUMBER() Difference**: `DATE_SUB(date, INTERVAL ROW_NUMBER() DAY)` creates same value for consecutive dates
- **UNION ALL**: Combines both tables with labels to distinguish states
- **Date Filtering**: `BETWEEN '2019-01-01' AND '2019-12-31'` ensures only 2019 dates
- **Grouping**: Group by both period_state AND the calculated grp to separate different state sequences
