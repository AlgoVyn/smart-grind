# Date Arithmetic and Extraction

## Problem Description

The Date Arithmetic and Extraction pattern manipulates date/time data through mathematical operations, component extraction, and format conversion. This pattern is essential for analyzing temporal data, calculating durations, grouping by time periods, and transforming date formats across different database systems.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n) - typically linear scan with function application |
| Space Complexity | O(m) - rows returned in result set |
| Input | Date/datetime columns, interval values, format strings |
| Output | Extracted components, calculated dates, or formatted strings |
| Approach | Apply date functions to transform or extract from temporal data |

### When to Use

- **Date math**: Adding or subtracting days, months, or years from dates
- **Extraction**: Pulling out year, month, day, or time components from datetime values
- **Formatting**: Converting dates to specific string representations
- **Intervals**: Calculating differences between two dates
- **Grouping by time**: Aggregating data by year, month, week, or quarter
- **Filtering by date range**: Selecting records within specific time windows
- **Age calculations**: Computing years or days between birthdate and today

## Intuition

The key insight is **database-specific function syntax**. Unlike standard SQL operations, date functions vary significantly between MySQL, PostgreSQL, and SQL Server, requiring different approaches for the same logical operation.

The "aha!" moments:

1. **Database dialects matter**: `DATE_ADD` in MySQL vs `date + interval` in PostgreSQL vs `DATEADD` in SQL Server
2. **Date vs Datetime**: Know your data type - DATE has no time component, DATETIME/TIMESTAMP includes time
3. **Timezone awareness**: Timestamps may be stored in UTC; convert for local calculations
4. **Interval arithmetic**: Adding 1 month to January 31 is tricky - databases handle it differently
5. **String formatting**: Format codes differ wildly between databases (MySQL `%Y` vs SQL Server `yyyy`)

## Solution Approaches

### Approach 1: Date Extraction ✅ Recommended

Extract year, month, day, or other components from date/datetime values using database-specific functions.

#### Algorithm

1. Identify the date column and component to extract
2. Choose the appropriate extraction function for your database
3. Apply the function in SELECT or WHERE clauses
4. Use extracted values for grouping, filtering, or calculations

#### Implementation

**MySQL - YEAR, MONTH, DAY Functions:**

```sql
-- Extract date components
SELECT 
    YEAR(order_date) AS order_year,
    MONTH(order_date) AS order_month,
    DAY(order_date) AS order_day,
    DAYNAME(order_date) AS day_name
FROM Orders;

-- Group by year and month
SELECT 
    YEAR(order_date) AS yr,
    MONTH(order_date) AS mo,
    COUNT(*) AS order_count
FROM Orders
GROUP BY YEAR(order_date), MONTH(order_date);
```

**PostgreSQL - EXTRACT Function:**

```sql
-- Extract using EXTRACT
SELECT 
    EXTRACT(YEAR FROM order_date) AS order_year,
    EXTRACT(MONTH FROM order_date) AS order_month,
    EXTRACT(DAY FROM order_date) AS order_day,
    EXTRACT(DOW FROM order_date) AS day_of_week
FROM Orders;

-- Group by extracted components
SELECT 
    EXTRACT(YEAR FROM order_date) AS yr,
    EXTRACT(MONTH FROM order_date) AS mo,
    COUNT(*) AS order_count
FROM Orders
GROUP BY 1, 2;
```

**SQL Server - DATEPART Function:**

```sql
-- Extract using DATEPART
SELECT 
    DATEPART(YEAR, order_date) AS order_year,
    DATEPART(MONTH, order_date) AS order_month,
    DATEPART(DAY, order_date) AS order_day,
    DATEPART(WEEKDAY, order_date) AS day_of_week
FROM Orders;

-- Alternative: YEAR(), MONTH(), DAY() functions
SELECT 
    YEAR(order_date) AS yr,
    MONTH(order_date) AS mo,
    DAY(order_date) AS d
FROM Orders;
```

**Problem: Game Play Analysis I (SQL-511)**

```sql
-- MySQL: First login date per player
SELECT 
    player_id,
    MIN(event_date) AS first_login
FROM Activity
GROUP BY player_id;

-- Extract just the date component (remove time)
SELECT DISTINCT
    player_id,
    DATE(event_date) AS login_date
FROM Activity;
```

**Problem: Game Play Analysis II (SQL-512)**

```sql
-- MySQL: Find first login then join for next day activity
WITH FirstLogin AS (
    SELECT 
        player_id,
        MIN(event_date) AS first_login
    FROM Activity
    GROUP BY player_id
)
SELECT 
    f.player_id,
    f.first_login,
    a.event_date AS next_day_login
FROM FirstLogin f
LEFT JOIN Activity a 
    ON f.player_id = a.player_id 
    AND DATE(a.event_date) = DATE(f.first_login) + INTERVAL 1 DAY;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - linear scan with function application |
| Space | O(m) - rows in result set |

### Approach 2: Date Arithmetic

Add or subtract intervals (days, months, years) from dates using database-specific syntax.

#### Algorithm

1. Identify the base date and the interval to add/subtract
2. Choose the appropriate date arithmetic syntax for your database
3. Apply the operation in SELECT or WHERE clauses
4. Handle edge cases (month-end, leap years)

#### Implementation

**MySQL - DATE_ADD, DATE_SUB, INTERVAL:**

```sql
-- Add intervals
SELECT 
    order_date,
    DATE_ADD(order_date, INTERVAL 1 DAY) AS next_day,
    DATE_ADD(order_date, INTERVAL 1 MONTH) AS next_month,
    DATE_ADD(order_date, INTERVAL 1 YEAR) AS next_year,
    order_date + INTERVAL 7 DAY AS week_later
FROM Orders;

-- Subtract intervals
SELECT 
    DATE_SUB(order_date, INTERVAL 3 DAY) AS three_days_ago,
    order_date - INTERVAL 1 WEEK AS last_week
FROM Orders;

-- Add/subtract days with + and - operators
SELECT 
    order_date + 1 AS tomorrow,
    order_date - 7 AS week_ago
FROM Orders;
```

**PostgreSQL - INTERVAL Arithmetic:**

```sql
-- Add intervals with + operator
SELECT 
    order_date,
    order_date + INTERVAL '1 day' AS next_day,
    order_date + INTERVAL '1 month' AS next_month,
    order_date + INTERVAL '1 year' AS next_year,
    order_date + INTERVAL '7 days' AS week_later
FROM Orders;

-- Subtract intervals
SELECT 
    order_date - INTERVAL '3 days' AS three_days_ago,
    order_date - INTERVAL '1 week' AS last_week
FROM Orders;

-- Integer days arithmetic (works with date type)
SELECT 
    order_date + 1 AS tomorrow,
    order_date - 7 AS week_ago
FROM Orders;
```

**SQL Server - DATEADD Function:**

```sql
-- Add intervals with DATEADD
SELECT 
    order_date,
    DATEADD(day, 1, order_date) AS next_day,
    DATEADD(month, 1, order_date) AS next_month,
    DATEADD(year, 1, order_date) AS next_year,
    DATEADD(week, 1, order_date) AS week_later
FROM Orders;

-- Subtract intervals (negative numbers)
SELECT 
    DATEADD(day, -3, order_date) AS three_days_ago,
    DATEADD(week, -1, order_date) AS last_week
FROM Orders;
```

**Problem: Game Play Analysis IV (SQL-550)**

```sql
-- PostgreSQL: Fraction of players who logged in next day
WITH FirstLogin AS (
    SELECT 
        player_id,
        MIN(event_date) AS first_login
    FROM Activity
    GROUP BY player_id
),
NextDay AS (
    SELECT 
        f.player_id,
        CASE 
            WHEN MIN(a.event_date) = f.first_login + INTERVAL '1 day' 
            THEN 1 ELSE 0 
        END AS next_day_flag
    FROM FirstLogin f
    JOIN Activity a ON f.player_id = a.player_id
    WHERE a.event_date > f.first_login
    GROUP BY f.player_id, f.first_login
)
SELECT 
    ROUND(
        SUM(next_day_flag) * 1.0 / 
        (SELECT COUNT(DISTINCT player_id) FROM Activity),
        2
    ) AS fraction;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - linear scan |
| Space | O(m) - rows in result set |

### Approach 3: Date Differences

Calculate the difference between two dates in days, months, or years.

#### Algorithm

1. Identify the two date columns (or date and current date)
2. Choose the appropriate datediff function for your database
3. Specify the unit of difference (days, months, years)
4. Use absolute value if direction doesn't matter

#### Implementation

**MySQL - DATEDIFF, TIMESTAMPDIFF:**

```sql
-- Days between two dates
SELECT 
    DATEDIFF(end_date, start_date) AS days_diff,
    DATEDIFF(CURDATE(), birth_date) / 365 AS approx_age
FROM Employees;

-- Specific units with TIMESTAMPDIFF
SELECT 
    TIMESTAMPDIFF(DAY, start_date, end_date) AS days,
    TIMESTAMPDIFF(MONTH, start_date, end_date) AS months,
    TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) AS exact_age
FROM Employees;
```

**PostgreSQL - AGE, Date Subtraction:**

```sql
-- Days between (returns integer)
SELECT 
    (end_date - start_date) AS days_diff,
    AGE(CURRENT_DATE, birth_date) AS age_interval
FROM Employees;

-- Extract specific units from age
SELECT 
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, birth_date)) AS age_years
FROM Employees;
```

**SQL Server - DATEDIFF Function:**

```sql
-- Difference in various units
SELECT 
    DATEDIFF(day, start_date, end_date) AS days_diff,
    DATEDIFF(month, start_date, end_date) AS months_diff,
    DATEDIFF(year, birth_date, GETDATE()) AS age_years
FROM Employees;
```

**Problem: Number of Days Between Two Dates (SQL-1225)**

```sql
-- MySQL: Report all dates with their day difference from 2019-01-01
SELECT 
    date_id,
    make_date,
    DATEDIFF(make_date, '2019-01-01') AS diff
FROM Dates
ORDER BY date_id;

-- PostgreSQL alternative
SELECT 
    date_id,
    make_date,
    (make_date - '2019-01-01'::date) AS diff
FROM Dates
ORDER BY date_id;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - linear scan |
| Space | O(m) - rows in result set |

### Approach 4: Date Formatting

Convert dates to strings with specific formats for display or export.

#### Algorithm

1. Identify the date column and desired output format
2. Choose the formatting function for your database
3. Use format codes specific to your database dialect
4. Consider locale and timezone requirements

#### Implementation

**MySQL - DATE_FORMAT:**

```sql
-- Format dates with DATE_FORMAT
SELECT 
    DATE_FORMAT(order_date, '%Y-%m-%d') AS yyyy_mm_dd,
    DATE_FORMAT(order_date, '%m/%d/%Y') AS us_format,
    DATE_FORMAT(order_date, '%d-%b-%Y') AS day_mon_yyyy,
    DATE_FORMAT(order_date, '%W, %M %d, %Y') AS full_date
FROM Orders;

-- Common format codes:
-- %Y = 4-digit year, %y = 2-digit year
-- %m = month (01-12), %c = month (1-12)
-- %d = day (01-31), %e = day (1-31)
-- %H = hour (00-23), %i = minute, %s = second
```

**PostgreSQL - TO_CHAR:**

```sql
-- Format dates with TO_CHAR
SELECT 
    TO_CHAR(order_date, 'YYYY-MM-DD') AS yyyy_mm_dd,
    TO_CHAR(order_date, 'MM/DD/YYYY') AS us_format,
    TO_CHAR(order_date, 'DD-Mon-YYYY') AS day_mon_yyyy,
    TO_CHAR(order_date, 'Day, Month DD, YYYY') AS full_date
FROM Orders;

-- Common format codes:
-- YYYY = 4-digit year, YY = 2-digit year
-- MM = month (01-12), Mon = abbreviated month
-- DD = day (01-31), DDth = ordinal day
-- HH24 = hour (00-23), MI = minute, SS = second
```

**SQL Server - FORMAT or CONVERT:**

```sql
-- Format with FORMAT function (SQL Server 2012+)
SELECT 
    FORMAT(order_date, 'yyyy-MM-dd') AS yyyy_mm_dd,
    FORMAT(order_date, 'MM/dd/yyyy') AS us_format,
    FORMAT(order_date, 'dd-MMM-yyyy') AS day_mon_yyyy
FROM Orders;

-- Format with CONVERT (older SQL Server)
SELECT 
    CONVERT(varchar, order_date, 120) AS odbc_canonical,
    CONVERT(varchar, order_date, 101) AS us_format,
    CONVERT(varchar, order_date, 103) AS european_format
FROM Orders;

-- Common style codes:
-- 101 = MM/DD/YYYY, 103 = DD/MM/YYYY
-- 120 = YYYY-MM-DD HH:MM:SS, 121 = YYYY-MM-DD HH:MM:SS.mmm
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - linear scan |
| Space | O(m × k) - k is formatted string length |

## Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| Date Extraction | O(n) | O(m) | **Recommended** - Grouping, filtering by component |
| Date Arithmetic | O(n) | O(m) | Adding/subtracting time periods |
| Date Differences | O(n) | O(m) | Calculating ages, durations, intervals |
| Date Formatting | O(n × k) | O(m × k) | Display, export, string comparison |

## Database-Specific Quick Reference

| Operation | MySQL | PostgreSQL | SQL Server |
|-----------|-------|------------|------------|
| Get current date | `CURDATE()` | `CURRENT_DATE` | `GETDATE()` / `CAST(GETDATE() AS DATE)` |
| Get current datetime | `NOW()` | `CURRENT_TIMESTAMP` | `GETDATE()` / `SYSDATETIME()` |
| Extract year | `YEAR(date)` | `EXTRACT(YEAR FROM date)` | `YEAR(date)` / `DATEPART(year, date)` |
| Add 1 day | `DATE_ADD(date, INTERVAL 1 DAY)` | `date + INTERVAL '1 day'` | `DATEADD(day, 1, date)` |
| Add 1 month | `DATE_ADD(date, INTERVAL 1 MONTH)` | `date + INTERVAL '1 month'` | `DATEADD(month, 1, date)` |
| Days between | `DATEDIFF(end, start)` | `end - start` | `DATEDIFF(day, start, end)` |
| Format date | `DATE_FORMAT(date, '%Y-%m-%d')` | `TO_CHAR(date, 'YYYY-MM-DD')` | `FORMAT(date, 'yyyy-MM-dd')` |
| Remove time | `DATE(datetime)` | `datetime::date` | `CAST(datetime AS DATE)` |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Game Play Analysis I](/problems/sql-511) | 511 | Easy | First login date per player |
| [Game Play Analysis II](/problems/sql-512) | 512 | Easy | Device used on first and subsequent login |
| [Game Play Analysis IV](/problems/sql-550) | 550 | Medium | Fraction of players returning next day |
| [Report Contiguous Dates](/problems/sql-1225) | 1225 | Hard | Date ranges and day differences |

## Key Takeaways

- **MySQL**: Use `DATE_ADD`, `DATEDIFF`, `DATE_FORMAT` with `%` format codes
- **PostgreSQL**: Use `INTERVAL '1 day'` arithmetic, `EXTRACT`, `TO_CHAR` with format patterns
- **SQL Server**: Use `DATEADD`, `DATEDIFF`, `FORMAT` with style codes
- **Remove time component**: Use `DATE()` in MySQL, `::date` cast in PostgreSQL, `CAST AS DATE` in SQL Server
- **Current date**: `CURDATE()` MySQL, `CURRENT_DATE` PostgreSQL, `GETDATE()` SQL Server
- **Interval syntax**: Each database has unique interval representation

## Common Pitfalls

1. **Assuming standard syntax**: Date functions are NOT portable between databases
2. **Month-end arithmetic**: Adding 1 month to January 31 yields different results (Feb 28 vs Mar 31)
3. **Leap year edge cases**: February 29 handling varies by database
4. **Timezone unawareness**: Comparing UTC timestamps with local dates gives wrong results
5. **Implicit conversions**: Comparing dates with strings can cause unexpected results
6. **Format code confusion**: `%Y` in MySQL vs `YYYY` in PostgreSQL/SQL Server
7. **DATEDIFF direction**: Order matters - `DATEDIFF(end, start)` vs `DATEDIFF(start, end)`

## Pattern Source

[Date Arithmetic and Extraction](sql/date-arithmetic-and-extraction.md)
