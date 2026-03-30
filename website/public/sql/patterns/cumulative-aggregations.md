# Cumulative Aggregations (Window Functions)

## Problem Description

Cumulative aggregations calculate running totals, moving averages, and progressive statistics across ordered datasets using the SQL `OVER` clause with frame specifications. Unlike regular aggregations that collapse rows into a single value, window functions preserve all rows while computing values that accumulate over a specified window of data.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n) - single pass with window calculations |
| Space Complexity | O(n) - for window buffer storage |
| Input | Ordered dataset, aggregation function, frame specification |
| Output | All rows with cumulative value in each row |
| Approach | Window frame → Aggregate → Assign to rows |

### When to Use

- **Running totals**: Calculating progressive sums (e.g., cumulative sales, running balance)
- **Cumulative averages**: Computing moving averages over expanding windows
- **Moving calculations**: Rolling statistics over fixed-size windows
- **Year-to-date metrics**: Accumulating values from period start to current row
- **Ranking with ties**: Assigning ranks while handling equal values
- **Comparing to previous rows**: Computing differences from prior periods

## Intuition

The key insight is **sliding window aggregation**. Instead of collapsing all rows into one result, the window function defines a "frame" of rows relative to the current row and performs the aggregation over that frame.

The "aha!" moments:

1. **Frame specification**: `ROWS UNBOUNDED PRECEDING` means "all rows from the start to current"
2. **Expanding window**: Without an explicit frame, the default is `RANGE UNBOUNDED PRECEDING`
3. **Partition boundaries**: `PARTITION BY` resets the accumulation for each group
4. **ORDER BY matters**: Cumulative functions require explicit ordering to define accumulation sequence
5. **Current row inclusion**: The frame always includes the current row in calculations

## Solution Approaches

### Approach 1: Basic Running Sum - Cumulative SUM ✅ Recommended

#### Algorithm

1. Select the base columns to display
2. Add window function with `SUM()` and `OVER()` clause
3. Specify `ORDER BY` to define accumulation order
4. Use default frame (rows from start to current) for running total

#### Implementation

**Problem: Game Play Analysis IV (SQL-534)**

```sql
-- Calculate cumulative player sessions or running totals
SELECT 
    player_id,
    event_date,
    games_played,
    SUM(games_played) OVER (
        ORDER BY event_date
        ROWS UNBOUNDED PRECEDING
    ) AS cumulative_games
FROM Activity;
```

**Basic Running Sum:**

```sql
-- Running total of sales by date
SELECT 
    order_date,
    order_amount,
    SUM(order_amount) OVER (
        ORDER BY order_date
    ) AS running_total
FROM Orders;
```

**With Frame Specification:**

```sql
-- Explicit frame for running total
SELECT 
    order_date,
    order_amount,
    SUM(order_amount) OVER (
        ORDER BY order_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS running_total
FROM Orders;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - single pass with cumulative calculation |
| Space | O(n) - window buffer for accumulation |

### Approach 2: Running Sum by Group - PARTITION BY

When you need separate running totals for different categories, use `PARTITION BY` to reset the accumulation at group boundaries.

#### Algorithm

1. Identify the grouping column(s) for separate accumulations
2. Add `PARTITION BY` clause to reset window per group
3. Keep `ORDER BY` for sequence within each partition
4. Apply aggregation function over the partitioned window

#### Implementation

**Problem: Restaurant Growth (SQL-1321)**

```sql
-- Calculate running average of customer visits by restaurant
SELECT 
    customer_id,
    visit_date,
    amount,
    AVG(amount) OVER (
        PARTITION BY customer_id
        ORDER BY visit_date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) AS moving_7day_avg
FROM CustomerVisits;
```

**Running Total by Category:**

```sql
-- Running total per department
SELECT 
    department_id,
    employee_id,
    salary,
    SUM(salary) OVER (
        PARTITION BY department_id
        ORDER BY hire_date
    ) AS dept_running_total
FROM Employees;
```

**Multiple Partitions:**

```sql
-- Running total by region and year
SELECT 
    region,
    year,
    month,
    sales,
    SUM(sales) OVER (
        PARTITION BY region, year
        ORDER BY month
    ) AS ytd_sales
FROM MonthlySales;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - sorting within each partition |
| Space | O(n) - partition buffers |

### Approach 3: Frame Specification - ROWS vs RANGE

Understanding frame specification is crucial for precise control over which rows are included in each window calculation.

#### Algorithm

1. Choose `ROWS` for precise row counting or `RANGE` for value-based inclusion
2. Specify frame bounds: `UNBOUNDED PRECEDING`, `n PRECEDING`, `CURRENT ROW`, `n FOLLOWING`
3. Combine with `ORDER BY` to define window positioning
4. Select appropriate for use case (fixed window vs. expanding)

#### Implementation

**ROWS vs RANGE Example:**

```sql
-- ROWS: physical row count
SELECT 
    date,
    value,
    SUM(value) OVER (
        ORDER BY date
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) AS rolling_3day_sum
FROM DailyMetrics;

-- RANGE: value-based (includes ties)
SELECT 
    date,
    value,
    SUM(value) OVER (
        ORDER BY date
        RANGE BETWEEN INTERVAL '2' DAY PRECEDING AND CURRENT ROW
    ) AS range_sum
FROM DailyMetrics;
```

**Fixed Window (Moving Average):**

```sql
-- 7-day moving average
SELECT 
    date,
    temperature,
    AVG(temperature) OVER (
        ORDER BY date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) AS temp_7day_ma
FROM WeatherData;
```

**Expanding vs Fixed Window:**

```sql
-- Expanding window (running total)
SELECT 
    date,
    revenue,
    SUM(revenue) OVER (
        ORDER BY date
        ROWS UNBOUNDED PRECEDING
    ) AS expanding_total,
    -- Fixed 30-day window
    SUM(revenue) OVER (
        ORDER BY date
        ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
    ) AS trailing_30day
FROM DailyRevenue;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × w) - where w is window size |
| Space | O(w) - buffer for current window |

### Approach 4: Running Averages and Other Aggregates

Beyond SUM, any aggregate function can be used cumulatively: AVG, COUNT, MIN, MAX, and even statistical functions.

#### Algorithm

1. Select the appropriate aggregate function for the metric
2. Apply window specification with proper ordering
3. Consider frame bounds based on calculation needs
4. Handle NULL values appropriately

#### Implementation

**Problem: Percentage of Users Attended a Contest (SQL-1204)**

```sql
-- Calculate cumulative contest participation rates
SELECT 
    contest_id,
    user_id,
    registered_count,
    100.0 * registered_count / 
        SUM(registered_count) OVER (
            ORDER BY contest_id
        ) AS cumulative_percentage
FROM ContestRegistrations;
```

**Running Averages and Statistics:**

```sql
-- Running statistics
SELECT 
    date,
    daily_sales,
    AVG(daily_sales) OVER (
        ORDER BY date
        ROWS UNBOUNDED PRECEDING
    ) AS running_avg,
    COUNT(*) OVER (
        ORDER BY date
        ROWS UNBOUNDED PRECEDING
    ) AS days_counted,
    MIN(daily_sales) OVER (
        ORDER BY date
        ROWS UNBOUNDED PRECEDING
    ) AS min_to_date,
    MAX(daily_sales) OVER (
        ORDER BY date
        ROWS UNBOUNDED PRECEDING
    ) AS max_to_date
FROM Sales;
```

**Cumulative Percentage:**

```sql
-- Cumulative percentage of total
SELECT 
    product_category,
    sales_amount,
    100.0 * sales_amount / 
        SUM(sales_amount) OVER () AS pct_of_total,
    100.0 * SUM(sales_amount) OVER (
        ORDER BY sales_amount DESC
        ROWS UNBOUNDED PRECEDING
    ) / SUM(sales_amount) OVER () AS cumulative_pct
FROM CategorySales;
```

**Weighted Moving Average:**

```sql
-- Exponentially weighted or custom weighted average
SELECT 
    date,
    value,
    SUM(value * weight) OVER (
        ORDER BY date
        ROWS BETWEEN 9 PRECEDING AND CURRENT ROW
    ) / 
    SUM(weight) OVER (
        ORDER BY date
        ROWS BETWEEN 9 PRECEDING AND CURRENT ROW
    ) AS weighted_ma
FROM WeightedData;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - linear scan for each aggregate |
| Space | O(n) - for window buffers |

## Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| Basic Running Sum | O(n) | O(n) | **Recommended** - simple cumulative totals |
| PARTITION BY | O(n log n) | O(n) | Grouped accumulations per category |
| Frame Specification | O(n × w) | O(w) | Moving averages, fixed-size windows |
| Multiple Aggregates | O(n × k) | O(n) | Statistical summaries, dashboards |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| Game Play Analysis IV | 534 | Medium | Running totals for player activity |
| Percentage of Users Attended Contest | 1204 | Easy | Cumulative percentages |
| Restaurant Growth | 1321 | Medium | Moving averages and growth metrics |
| Department Highest Salary | 184 | Medium | Window functions with ranking |
| Department Top Three Salaries | 185 | Hard | Top N per category using windows |
| Nth Highest Salary | 177 | Medium | Offset-based ranking |
| Find Median Given Frequency | 571 | Hard | Statistical window functions |

## Key Takeaways

- **ORDER BY is mandatory**: Cumulative functions require explicit ordering
- **Frame defaults**: `ROWS UNBOUNDED PRECEDING` is common for running totals
- **PARTITION BY resets**: Each partition gets its own cumulative sequence
- **ROWS vs RANGE**: ROWS counts physical rows; RANGE includes value-based peers
- **Performance**: Window functions are optimized and usually faster than self-joins
- **Multiple windows**: Can use different OVER clauses for different calculations in same query

## Common Pitfalls

1. **Missing ORDER BY**: Cumulative functions without ORDER BY produce unpredictable results
2. **Confusing ROWS and RANGE**: RANGE handles ties differently than ROWS
3. **Forgetting PARTITION BY**: Running totals cross group boundaries unexpectedly
4. **Window size explosion**: Very large windows can impact memory usage
5. **NULL handling**: NULLs in ordering columns can cause unexpected frame behavior
6. **Frame syntax errors**: `BETWEEN` is required when specifying both bounds

## Frame Specification Reference

| Frame Type | Syntax | Description |
|------------|--------|-------------|
| Expanding | `ROWS UNBOUNDED PRECEDING` | From first row to current |
| Fixed trailing | `ROWS n PRECEDING` | Previous n rows + current |
| Fixed centered | `ROWS BETWEEN n PRECEDING AND n FOLLOWING` | Symmetric window |
| Value-based | `RANGE BETWEEN INTERVAL 'n' DAY PRECEDING AND CURRENT ROW` | Time-based window |
| Full partition | `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` | All partition rows |

## Pattern Source

[Cumulative Aggregations](sql/cumulative-aggregations.md)
