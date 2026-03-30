# 1132. Reported Posts II

## Problem

Write a solution to report the number of distinct reports per report and the report date for each report. Note that the report date for each report is the day the first report was made.

### Schema

**Actions Table:**
| Column Name | Type    | Description |
|-------------|---------|-------------|
| user_id     | int     | ID of the user who performed action |
| post_id     | int     | ID of the post |
| action_date | date    | Date of the action |
| action      | varchar | Type of action: 'view', 'like', 'repost', 'report' |
| extra       | varchar | Extra information (reason for report) |

### Requirements

- Return: report_date, post_id, distinct_report_count
- Only include posts with action = 'report'
- Count distinct users who reported each post on the removal date
- The report_date is the action_date when the post was removed
- Remove duplicates: same user reporting same post multiple times counts once

**Example:**
- User 1 reports Post 10 on 2019-07-04
- User 2 reports Post 10 on 2019-07-04
- User 1 reports Post 10 again on 2019-07-05 (duplicate, ignore)
- Result: report_date=2019-07-04, post_id=10, distinct_report_count=2

## Approaches

### Approach 1: DISTINCT COUNT with GROUP BY (Recommended)

Use DISTINCT within COUNT to count unique reporters per post, grouped by action date.

#### Algorithm

1. Filter rows where action = 'report'
2. Group by post_id and action_date
3. Use COUNT(DISTINCT user_id) to count unique reporters
4. Return the grouped columns with the distinct count

#### Implementation

```sql
SELECT 
    action_date AS report_date,
    post_id,
    COUNT(DISTINCT user_id) AS distinct_report_count
FROM Actions
WHERE action = 'report'
GROUP BY post_id, action_date;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - due to grouping and distinct count |
| Space | O(k) - where k is number of unique post_id/date combinations |

### Approach 2: Subquery for Deduplication

Use a subquery to first deduplicate reports, then count.

#### Algorithm

1. First, create a deduplicated set of reports (unique user_id, post_id, action_date combinations)
2. Then group and count from the deduplicated set
3. This ensures each user counts only once per post per day

#### Implementation

```sql
SELECT 
    action_date AS report_date,
    post_id,
    COUNT(user_id) AS distinct_report_count
FROM (
    SELECT DISTINCT 
        user_id, 
        post_id, 
        action_date
    FROM Actions
    WHERE action = 'report'
) AS deduplicated
GROUP BY post_id, action_date;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - subquery removes duplicates, then grouping |
| Space | O(k) - deduplicated intermediate result set |

### Approach 3: Window Function with DENSE_RANK

Use window functions to identify and count distinct reporters.

#### Algorithm

1. Use window function to assign row numbers to each user's report
2. Only count the first occurrence of each user per post
3. Sum up the distinct counts

#### Implementation

```sql
WITH RankedReports AS (
    SELECT 
        action_date,
        post_id,
        user_id,
        ROW_NUMBER() OVER (
            PARTITION BY post_id, user_id 
            ORDER BY action_date
        ) AS rn
    FROM Actions
    WHERE action = 'report'
)
SELECT 
    action_date AS report_date,
    post_id,
    COUNT(CASE WHEN rn = 1 THEN user_id END) AS distinct_report_count
FROM RankedReports
GROUP BY post_id, action_date;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - window function partitioning and sorting |
| Space | O(n) - CTE stores intermediate results |

## Solution Analysis

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| DISTINCT COUNT | O(n log n) | O(k) | Simple, efficient, standard SQL | None major |
| Subquery Deduplication | O(n log n) | O(k) | Explicit deduplication step | More verbose |
| Window Function | O(n log n) | O(n) | Flexible for complex logic | Overkill for this problem |

**Recommended:** Approach 1 (DISTINCT COUNT with GROUP BY) - most concise and efficient for this specific requirement.

## Final Solution

```sql
SELECT 
    action_date AS report_date,
    post_id,
    COUNT(DISTINCT user_id) AS distinct_report_count
FROM Actions
WHERE action = 'report'
GROUP BY post_id, action_date;
```

### Key Concepts

- **COUNT(DISTINCT column)**: Counts unique non-NULL values in a column within each group
- **GROUP BY multiple columns**: Groups by unique combinations of post_id and action_date
- **WHERE filtering**: Applied before grouping to only consider 'report' actions
- **Column aliasing**: Renames action_date to report_date for clarity in output

### Notes

- Some databases handle NULL values differently in DISTINCT counts; this solution assumes user_id is NOT NULL
- If a post is reported on different dates, each date gets its own row with the count for that day
- For total distinct reporters across all days, would need to remove action_date from GROUP BY and use a different query structure
