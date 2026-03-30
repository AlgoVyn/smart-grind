# 601. Human Traffic of Stadium

## Problem

Write a solution to find the dates with 3 or more consecutive rows with 100+ people. Return the result ordered by visit date.

### Schema

**Stadium Table:**
| Column Name | Type    | Description |
|-------------|---------|-------------|
| Id          | int     | Primary Key |
| VisitDate   | date    | Date of visit |
| People      | int     | Number of people |

### Requirements

- Find dates where there are 3+ consecutive records with People >= 100
- Consecutive means consecutive dates (not just consecutive IDs)
- Return: Id, VisitDate, People
- Order by VisitDate ascending

**Example:**
- 2017-01-01 (10 people) - NO
- 2017-01-02 (100 people) - YES
- 2017-01-03 (150 people) - YES
- 2017-01-04 (99 people) - NO
- 2017-01-05 (200 people) - YES
- 2017-01-06 (250 people) - YES
- 2017-01-07 (300 people) - YES

Result: 2017-01-05 to 2017-01-07 (3+ consecutive dates with 100+ people)

## Approaches

### Approach 1: Row Number Difference Method (Recommended)

Use the classic row_number() trick to identify consecutive sequences. When you subtract row_number from a sequential value, consecutive dates get the same group identifier.

#### Algorithm

1. Filter to rows with People >= 100
2. Assign ROW_NUMBER ordered by VisitDate
3. Calculate a group identifier: DATE_SUB(VisitDate, INTERVAL row_num DAY)
4. Group by this identifier and count occurrences
5. Select groups with 3+ consecutive dates
6. Return all rows from those groups

#### Implementation

```sql
WITH HighTraffic AS (
    SELECT 
        Id,
        VisitDate,
        People,
        ROW_NUMBER() OVER (ORDER BY VisitDate) AS rn,
        DATE_SUB(VisitDate, INTERVAL ROW_NUMBER() OVER (ORDER BY VisitDate) DAY) AS grp
    FROM Stadium
    WHERE People >= 100
),
ConsecutiveGroups AS (
    SELECT grp
    FROM HighTraffic
    GROUP BY grp
    HAVING COUNT(*) >= 3
)
SELECT 
    h.Id,
    h.VisitDate,
    h.People
FROM HighTraffic h
JOIN ConsecutiveGroups c ON h.grp = c.grp
ORDER BY h.VisitDate;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - due to sorting and window function |
| Space | O(n) - CTEs store intermediate results |

### Approach 2: Self JOIN with Date Arithmetic

Use self-joins to check for consecutive dates by joining on date differences.

#### Algorithm

1. Filter to rows with People >= 100
2. Self JOIN to find all possible consecutive sequences of length 3
3. A date is part of a 3-day sequence if it has consecutive neighbors

#### Implementation

```sql
SELECT DISTINCT
    s1.Id,
    s1.VisitDate,
    s1.People
FROM Stadium s1
JOIN Stadium s2 ON s2.People >= 100 
    AND DATEDIFF(s2.VisitDate, s1.VisitDate) BETWEEN -2 AND 2
JOIN Stadium s3 ON s3.People >= 100
    AND DATEDIFF(s3.VisitDate, s1.VisitDate) BETWEEN -2 AND 2
WHERE s1.People >= 100
    AND ABS(DATEDIFF(s2.VisitDate, s1.VisitDate)) = 1
    AND ABS(DATEDIFF(s3.VisitDate, s2.VisitDate)) = 1
    AND DATEDIFF(s3.VisitDate, s1.VisitDate) IN (-2, 0, 2)
ORDER BY s1.VisitDate;
```

**Alternative cleaner version:**

```sql
SELECT DISTINCT
    s1.Id,
    s1.VisitDate,
    s1.People
FROM Stadium s1, Stadium s2, Stadium s3
WHERE s1.People >= 100 AND s2.People >= 100 AND s3.People >= 100
    AND (
        (DATEDIFF(s1.VisitDate, s2.VisitDate) = -1 AND DATEDIFF(s2.VisitDate, s3.VisitDate) = -1)
        OR (DATEDIFF(s1.VisitDate, s2.VisitDate) = 1 AND DATEDIFF(s2.VisitDate, s3.VisitDate) = 1)
        OR (DATEDIFF(s1.VisitDate, s2.VisitDate) = -1 AND DATEDIFF(s1.VisitDate, s3.VisitDate) = -2)
        OR (DATEDIFF(s1.VisitDate, s2.VisitDate) = 1 AND DATEDIFF(s1.VisitDate, s3.VisitDate) = 2)
    )
ORDER BY s1.VisitDate;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n³) in worst case - triple cartesian product |
| Space | O(n) - result set |

### Approach 3: LAG/LEAD with Gap Detection

Use window functions to look ahead and behind to find consecutive sequences.

#### Algorithm

1. Use LAG and LEAD to get previous and next dates
2. Check if current date is part of a 3-consecutive sequence
3. A date qualifies if it has at least 2 consecutive neighbors (before, after, or both)

#### Implementation

```sql
WITH TrafficWithContext AS (
    SELECT 
        Id,
        VisitDate,
        People,
        LAG(VisitDate, 1) OVER (ORDER BY VisitDate) AS prev_date,
        LAG(VisitDate, 2) OVER (ORDER BY VisitDate) AS prev2_date,
        LEAD(VisitDate, 1) OVER (ORDER BY VisitDate) AS next_date,
        LEAD(VisitDate, 2) OVER (ORDER BY VisitDate) AS next2_date,
        LAG(People, 1) OVER (ORDER BY VisitDate) AS prev_people,
        LAG(People, 2) OVER (ORDER BY VisitDate) AS prev2_people,
        LEAD(People, 1) OVER (ORDER BY VisitDate) AS next_people,
        LEAD(People, 2) OVER (ORDER BY VisitDate) AS next2_people
    FROM Stadium
)
SELECT 
    Id,
    VisitDate,
    People
FROM TrafficWithContext
WHERE People >= 100
    AND (
        -- Current + next two
        (DATEDIFF(next_date, VisitDate) = 1 
         AND DATEDIFF(next2_date, next_date) = 1
         AND next_people >= 100 AND next2_people >= 100)
        -- Previous + current + next
        OR (DATEDIFF(VisitDate, prev_date) = 1 
            AND DATEDIFF(next_date, VisitDate) = 1
            AND prev_people >= 100 AND next_people >= 100)
        -- Previous two + current
        OR (DATEDIFF(VisitDate, prev_date) = 1 
            AND DATEDIFF(prev_date, prev2_date) = 1
            AND prev_people >= 100 AND prev2_people >= 100)
    )
ORDER BY VisitDate;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - single pass with window functions |
| Space | O(n) - CTE with window function results |

## Solution Analysis

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| Row Number Diff | O(n log n) | O(n) | Clean, scalable, handles any sequence length | Requires CTE support |
| Self JOIN | O(n³) | O(n) | Works in older SQL versions | Very slow for large tables |
| LAG/LEAD | O(n log n) | O(n) | Explicit logic, easy to understand | Verbose for complex conditions |

**Recommended:** Row Number Difference Method (Approach 1) - elegant solution that scales well and clearly identifies consecutive sequences.

## Final Solution

```sql
WITH HighTraffic AS (
    SELECT 
        Id,
        VisitDate,
        People,
        DATE_SUB(VisitDate, INTERVAL ROW_NUMBER() OVER (ORDER BY VisitDate) DAY) AS grp
    FROM Stadium
    WHERE People >= 100
),
ConsecutiveGroups AS (
    SELECT grp
    FROM HighTraffic
    GROUP BY grp
    HAVING COUNT(*) >= 3
)
SELECT 
    h.Id,
    h.VisitDate,
    h.People
FROM HighTraffic h
JOIN ConsecutiveGroups c ON h.grp = c.grp
ORDER BY h.VisitDate;
```

### Key Concepts

- **ROW_NUMBER()**: Assigns sequential integers to rows in order
- **DATE_SUB with row number**: Creates a constant value for consecutive dates
  - If dates are consecutive: 2023-01-05 - row1, 2023-01-06 - row2 = same "grp" value
  - If there's a gap: 2023-01-06 - row1, 2023-01-08 - row2 = different "grp" values
- **CTE chaining**: First CTE filters, second CTE identifies valid groups, final SELECT returns results
- **Consecutive date detection**: Same grp = consecutive, different grp = has gap
