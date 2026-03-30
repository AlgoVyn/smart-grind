# 1321. Restaurant Growth

## Problem

Write a solution to calculate the 7-day moving average of the daily amount for each visited_on date. Only include dates where there are at least 7 days of prior data available (including the current day).

### Schema

**Customer Table:**
| Column Name | Type    | Description |
|-------------|---------|-------------|
| customer_id | int     | Primary Key |
| name        | varchar | Customer name |
| visited_on  | date    | Date of visit |
| amount      | int     | Amount spent |

### Requirements

- Calculate daily total amount (sum of all customer amounts per day)
- Compute 7-day moving average for each date
- Only include dates that have at least 7 days of data (current day + 6 previous days)
- Return: visited_on, amount (7-day total), average_amount (rounded to 2 decimal places)
- Order by visited_on ascending

**Example:**
- 2019-01-01: $100
- 2019-01-02: $200
- ...
- 2019-01-07: $150 (first date with 7 days of data)
- 2019-01-08: $180 (days 2-8 average)

Result for 2019-01-07: total amount from 2019-01-01 to 2019-01-07, average = total/7

## Approaches

### Approach 1: Window Function with ROWS PRECEDING (Recommended)

Use AVG() window function with ROWS 6 PRECEDING to calculate the 7-day moving average in a single pass.

#### Algorithm

1. First, aggregate daily totals from Customer table
2. Use ROW_NUMBER() to assign sequential numbers to each date
3. Apply AVG() with ROWS 6 PRECEDING frame for 7-day average
4. Only include rows where row_number >= 7 (have 7 days of data)
5. Round the average to 2 decimal places

#### Implementation

```sql
WITH DailyTotals AS (
    SELECT 
        visited_on,
        SUM(amount) AS daily_amount
    FROM Customer
    GROUP BY visited_on
),
RankedDays AS (
    SELECT 
        visited_on,
        daily_amount,
        ROW_NUMBER() OVER (ORDER BY visited_on) AS rn
    FROM DailyTotals
)
SELECT 
    visited_on,
    SUM(daily_amount) OVER (
        ORDER BY visited_on 
        ROWS 6 PRECEDING
    ) AS amount,
    ROUND(
        AVG(daily_amount) OVER (
            ORDER BY visited_on 
            ROWS 6 PRECEDING
        ), 2
    ) AS average_amount
FROM RankedDays
WHERE rn >= 7;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - due to sorting and aggregation |
| Space | O(n) - CTEs store intermediate results |

### Approach 2: Self JOIN with Date Range

Use self JOIN to join each date with the 6 previous days, then aggregate.

#### Algorithm

1. Aggregate daily totals from Customer table
2. Self JOIN where date is within 6 days before current date
3. Group by current date and calculate sum/average
4. Only include groups with exactly 7 days (ensures consecutive data)

#### Implementation

```sql
WITH DailyTotals AS (
    SELECT 
        visited_on,
        SUM(amount) AS daily_amount
    FROM Customer
    GROUP BY visited_on
)
SELECT 
    c1.visited_on,
    SUM(c2.daily_amount) AS amount,
    ROUND(AVG(c2.daily_amount), 2) AS average_amount
FROM DailyTotals c1
JOIN DailyTotals c2 
    ON c2.visited_on BETWEEN DATE_SUB(c1.visited_on, INTERVAL 6 DAY) 
                         AND c1.visited_on
GROUP BY c1.visited_on
HAVING COUNT(DISTINCT c2.visited_on) = 7
ORDER BY c1.visited_on;
```

**Note:** The HAVING clause ensures we only get dates with exactly 7 days of data, filtering out dates near the beginning with insufficient history.

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n²) - self join creates up to 7x rows |
| Space | O(n) - intermediate join results |

### Approach 3: Correlated Subquery with Date Math

Use a correlated subquery to calculate the 7-day sum and average for each date.

#### Algorithm

1. Aggregate daily totals from Customer table
2. For each date, use correlated subquery to sum previous 7 days
3. Use row count check to ensure 7 days of data exist
4. Filter to only dates with complete 7-day history

#### Implementation

```sql
WITH DailyTotals AS (
    SELECT 
        visited_on,
        SUM(amount) AS daily_amount,
        ROW_NUMBER() OVER (ORDER BY visited_on) AS rn
    FROM Customer
    GROUP BY visited_on
)
SELECT 
    visited_on,
    (SELECT SUM(daily_amount) 
     FROM DailyTotals d2 
     WHERE d2.visited_on BETWEEN DATE_SUB(d1.visited_on, INTERVAL 6 DAY) 
                            AND d1.visited_on) AS amount,
    ROUND(
        (SELECT AVG(daily_amount) 
         FROM DailyTotals d2 
         WHERE d2.visited_on BETWEEN DATE_SUB(d1.visited_on, INTERVAL 6 DAY) 
                                AND d1.visited_on), 2
    ) AS average_amount
FROM DailyTotals d1
WHERE rn >= 7
ORDER BY visited_on;
```

**Alternative version with separate CTE for valid dates:**

```sql
WITH DailyTotals AS (
    SELECT 
        visited_on,
        SUM(amount) AS daily_amount
    FROM Customer
    GROUP BY visited_on
),
DateValidation AS (
    SELECT 
        d1.visited_on,
        (SELECT COUNT(*) 
         FROM DailyTotals d2 
         WHERE d2.visited_on <= d1.visited_on 
         AND d2.visited_on > DATE_SUB(d1.visited_on, INTERVAL 6 DAY)) AS day_count,
        (SELECT SUM(daily_amount) 
         FROM DailyTotals d2 
         WHERE d2.visited_on BETWEEN DATE_SUB(d1.visited_on, INTERVAL 6 DAY) 
                                AND d1.visited_on) AS amount,
        (SELECT AVG(daily_amount) 
         FROM DailyTotals d2 
         WHERE d2.visited_on BETWEEN DATE_SUB(d1.visited_on, INTERVAL 6 DAY) 
                                AND d1.visited_on) AS average_amount
    FROM DailyTotals d1
)
SELECT 
    visited_on,
    amount,
    ROUND(average_amount, 2) AS average_amount
FROM DateValidation
WHERE day_count = 7
ORDER BY visited_on;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n²) - subquery executes for each row |
| Space | O(n) - CTE results |

## Solution Analysis

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| Window Function | O(n log n) | O(n) | Single pass, clean syntax, most efficient | Requires window function support |
| Self JOIN | O(n²) | O(n) | Works in older SQL versions | Slower, more complex |
| Correlated Subquery | O(n²) | O(n) | Easy to understand | Slowest, multiple scans |

**Recommended:** Window Function with ROWS PRECEDING (Approach 1) - most efficient, readable, and handles the sliding window elegantly in a single pass.

## Final Solution

```sql
WITH DailyTotals AS (
    SELECT 
        visited_on,
        SUM(amount) AS daily_amount
    FROM Customer
    GROUP BY visited_on
),
RankedDays AS (
    SELECT 
        visited_on,
        daily_amount,
        ROW_NUMBER() OVER (ORDER BY visited_on) AS rn
    FROM DailyTotals
)
SELECT 
    visited_on,
    SUM(daily_amount) OVER (
        ORDER BY visited_on 
        ROWS 6 PRECEDING
    ) AS amount,
    ROUND(
        AVG(daily_amount) OVER (
            ORDER BY visited_on 
            ROWS 6 PRECEDING
        ), 2
    ) AS average_amount
FROM RankedDays
WHERE rn >= 7;
```

### Key Concepts

- **ROWS 6 PRECEDING**: Window frame that includes current row + 6 previous rows
- **ROW_NUMBER()**: Used to filter out dates that don't have 7 days of prior data
- **Daily aggregation**: Customer table may have multiple rows per day, so we SUM first
- **Moving average**: Average of the 7-day window, rounded to 2 decimal places
- **Frame specification**: The window moves with each row, creating a sliding 7-day view
