# Rows to Columns (Pivot and Unpivot)

## Problem Description

The Rows to Columns pattern transforms data orientation by converting row-based data into column-based format (pivot) or vice versa (unpivot). This is essential for reporting, cross-tabulation, and reshaping data to match analytical or presentation requirements.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n) - single pass with conditional aggregation |
| Space Complexity | O(1) - fixed output schema, O(c) for c dynamic columns |
| Input | Table with categorical column(s) to pivot, values to aggregate |
| Output | Reshaped data with categories as columns (pivot) or rows (unpivot) |
| Approach | Conditional aggregation → Column transformation |

### When to Use

- **Reporting and dashboards**: Converting normalized data to matrix format for visualization
- **Cross-tabulation**: Creating summary tables with categories as column headers
- **Data transformation**: Reshaping data for export to spreadsheets or BI tools
- **Comparing categories side-by-side**: Viewing metrics across different dimensions horizontally
- **Aggregated summaries**: Converting transactional data to summary matrices
- **Dynamic column generation**: Creating columns based on distinct values in the dataset

## Intuition

The key insight is **conditional aggregation**. Instead of grouping and collapsing rows vertically, we create horizontal columns using conditional logic that filters values into specific output columns.

The "aha!" moments:

1. **Aggregation-based pivot**: Use `SUM(CASE WHEN category = 'X' THEN value END)` to create columns
2. **One CASE per output column**: Each desired output column needs its own conditional expression
3. **Known columns requirement**: Standard SQL pivot requires knowing the distinct values beforehand
4. **GROUP BY anchors the rows**: The non-pivoted columns determine what each output row represents
5. **NULL handling**: Non-matching conditions produce NULL, which aggregate functions ignore

## Solution Approaches

### Approach 1: Conditional Aggregation Pivot - CASE + GROUP BY ✅ Recommended

The most portable and widely-supported approach uses `CASE` expressions within aggregate functions to pivot data. Each distinct value that will become a column gets its own conditional aggregation.

#### Algorithm

1. Identify the column containing values that will become column headers (pivot column)
2. Identify the column containing values to aggregate (value column)
3. Identify columns to keep as row identifiers (group by columns)
4. Create one `SUM/CASE` or `MAX/CASE` expression per distinct pivot value
5. Group by the row identifier columns

#### Implementation

**Problem: Reformat Department Table (SQL-1179)**

```sql
-- Pivot months from rows to columns
SELECT 
    id,
    SUM(CASE WHEN month = 'Jan' THEN revenue END) AS Jan_Revenue,
    SUM(CASE WHEN month = 'Feb' THEN revenue END) AS Feb_Revenue,
    SUM(CASE WHEN month = 'Mar' THEN revenue END) AS Mar_Revenue,
    SUM(CASE WHEN month = 'Apr' THEN revenue END) AS Apr_Revenue,
    SUM(CASE WHEN month = 'May' THEN revenue END) AS May_Revenue,
    SUM(CASE WHEN month = 'Jun' THEN revenue END) AS Jun_Revenue,
    SUM(CASE WHEN month = 'Jul' THEN revenue END) AS Jul_Revenue,
    SUM(CASE WHEN month = 'Aug' THEN revenue END) AS Aug_Revenue,
    SUM(CASE WHEN month = 'Sep' THEN revenue END) AS Sep_Revenue,
    SUM(CASE WHEN month = 'Oct' THEN revenue END) AS Oct_Revenue,
    SUM(CASE WHEN month = 'Nov' THEN revenue END) AS Nov_Revenue,
    SUM(CASE WHEN month = 'Dec' THEN revenue END) AS Dec_Revenue
FROM Department
GROUP BY id;
```

**Basic Pivot Example:**

```sql
-- Pivot sales by region
SELECT 
    product_id,
    SUM(CASE WHEN region = 'North' THEN sales ELSE 0 END) AS North_Sales,
    SUM(CASE WHEN region = 'South' THEN sales ELSE 0 END) AS South_Sales,
    SUM(CASE WHEN region = 'East' THEN sales ELSE 0 END) AS East_Sales,
    SUM(CASE WHEN region = 'West' THEN sales ELSE 0 END) AS West_Sales
FROM Sales
GROUP BY product_id;
```

**Pivot with COUNT:**

```sql
-- Count orders by status per customer
SELECT 
    customer_id,
    COUNT(CASE WHEN status = 'Pending' THEN 1 END) AS Pending_Count,
    COUNT(CASE WHEN status = 'Shipped' THEN 1 END) AS Shipped_Count,
    COUNT(CASE WHEN status = 'Delivered' THEN 1 END) AS Delivered_Count,
    COUNT(CASE WHEN status = 'Cancelled' THEN 1 END) AS Cancelled_Count
FROM Orders
GROUP BY customer_id;
```

**Pivot with Multiple Aggregates:**

```sql
-- Multiple metrics per category
SELECT 
    employee_id,
    SUM(CASE WHEN type = 'Sales' THEN amount END) AS Sales_Total,
    AVG(CASE WHEN type = 'Sales' THEN amount END) AS Sales_Avg,
    SUM(CASE WHEN type = 'Support' THEN amount END) AS Support_Total,
    AVG(CASE WHEN type = 'Support' THEN amount END) AS Support_Avg
FROM Transactions
GROUP BY employee_id;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × c) - where c is number of pivot columns |
| Space | O(g) - grouped rows, fixed schema |

### Approach 2: Multiple CASE Expressions - One Per Output Column

When you need different aggregations or logic for each output column, use explicit CASE expressions with specific conditions.

#### Algorithm

1. Define the specific condition for each output column
2. Write a CASE expression that captures values matching that condition
3. Apply appropriate aggregate function (SUM, MAX, MIN, AVG, COUNT)
4. Handle NULL values with ELSE 0 or COALESCE as needed
5. Group by the common row identifiers

#### Implementation

**Problem: Daily Leads and Partners (SQL-1693)**

```sql
-- Pivot leads and partners by date with separate counts
SELECT 
    date_id,
    make_name,
    COUNT(DISTINCT CASE WHEN lead_id IS NOT NULL THEN lead_id END) AS unique_leads,
    COUNT(DISTINCT CASE WHEN partner_id IS NOT NULL THEN partner_id END) AS unique_partners
FROM DailySales
GROUP BY date_id, make_name;
```

**Conditional Logic Pivot:**

```sql
-- Different calculations per column
SELECT 
    department,
    SUM(CASE WHEN quarter = 'Q1' THEN revenue END) AS Q1_Revenue,
    SUM(CASE WHEN quarter = 'Q2' THEN revenue * 1.1 END) AS Q2_Projected,
    MAX(CASE WHEN quarter = 'Q3' THEN revenue END) AS Q3_Peak,
    AVG(CASE WHEN quarter = 'Q4' THEN revenue END) AS Q4_Average
FROM Financials
GROUP BY department;
```

**String Aggregation Pivot:**

```sql
-- Concatenate values per category (MySQL)
SELECT 
    group_id,
    GROUP_CONCAT(CASE WHEN category = 'A' THEN value END) AS A_Values,
    GROUP_CONCAT(CASE WHEN category = 'B' THEN value END) AS B_Values
FROM DataItems
GROUP BY group_id;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × c) - c conditional expressions to evaluate |
| Space | O(g) - grouped output rows |

### Approach 3: Pivot with JOINs - Dynamic Columns Alternative

When the number of pivot values is dynamic or unknown, use self-JOINs or CTEs to create columns dynamically. This approach scales better for many distinct values.

#### Algorithm

1. Create a CTE or subquery to identify distinct pivot values
2. Join the main table with the pivot values
3. Use conditional aggregation in the final SELECT
4. For truly dynamic SQL, use prepared statements or stored procedures
5. Alternatively, use multiple JOINs for fixed but many categories

#### Implementation

**Multi-Join Pivot:**

```sql
-- Pivot using multiple LEFT JOINs
SELECT 
    t.product_id,
    t_north.sales AS North_Sales,
    t_south.sales AS South_Sales,
    t_east.sales AS East_Sales,
    t_west.sales AS West_Sales
FROM (SELECT DISTINCT product_id FROM Sales) t
LEFT JOIN Sales t_north ON t.product_id = t_north.product_id AND t_north.region = 'North'
LEFT JOIN Sales t_south ON t.product_id = t_south.product_id AND t_south.region = 'South'
LEFT JOIN Sales t_east ON t.product_id = t_east.product_id AND t_east.region = 'East'
LEFT JOIN Sales t_west ON t.product_id = t_west.product_id AND t_west.region = 'West';
```

**Dynamic Column Generation (MySQL):**

```sql
-- Create dynamic pivot using prepared statement
SET @sql = NULL;
SELECT
  GROUP_CONCAT(DISTINCT
    CONCAT(
      'SUM(CASE WHEN month = ''',
      month,
      ''' THEN revenue END) AS `',
      month, '_Revenue`'
    )
  ) INTO @sql
FROM Department;

SET @sql = CONCAT('SELECT id, ', @sql, ' FROM Department GROUP BY id');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
```

**SQL Server PIVOT Syntax:**

```sql
-- Using native PIVOT operator
SELECT 
    product_id,
    [North], [South], [East], [West]
FROM (
    SELECT product_id, region, sales FROM Sales
) src
PIVOT (
    SUM(sales)
    FOR region IN ([North], [South], [East], [West])
) piv;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × j) - where j is number of joins |
| Space | O(n + j × n) - intermediate join results |

### Approach 4: Reverse Pivot (Unpivot) - Columns to Rows

The reverse operation converts wide format (many columns) back to long format (rows). This is useful for normalizing data or preparing for certain analyses.

#### Algorithm

1. Identify columns to unpivot (they become row values)
2. Identify the column to remain fixed (becomes the grouping key)
3. Use UNION ALL to stack column values as rows
4. Or use UNPIVOT operator (SQL Server) or JSON functions (MySQL/PostgreSQL)
5. Each row represents one (key, attribute, value) tuple

#### Implementation

**Problem: Group Sold Products By The Date (SQL-1484) - Reverse Operation Context**

```sql
-- First aggregate then format (demonstrates unpivot concept)
-- Original: Wide format with products as columns
-- Target: Long format with products listed per date

-- Unpivot example using UNION ALL
SELECT id, 'Jan' AS month, Jan_Revenue AS revenue FROM Department WHERE Jan_Revenue IS NOT NULL
UNION ALL
SELECT id, 'Feb' AS month, Feb_Revenue FROM Department WHERE Feb_Revenue IS NOT NULL
UNION ALL
SELECT id, 'Mar' AS month, Mar_Revenue FROM Department WHERE Mar_Revenue IS NOT NULL;
```

**UNION ALL Unpivot:**

```sql
-- Convert wide sales data to long format
SELECT product_id, 'North' AS region, North_Sales AS sales FROM SalesWide WHERE North_Sales IS NOT NULL
UNION ALL
SELECT product_id, 'South' AS region, South_Sales FROM SalesWide WHERE South_Sales IS NOT NULL
UNION ALL
SELECT product_id, 'East' AS region, East_Sales FROM SalesWide WHERE East_Sales IS NOT NULL
UNION ALL
SELECT product_id, 'West' AS region, West_Sales FROM SalesWide WHERE West_Sales IS NOT NULL;
```

**SQL Server UNPIVOT:**

```sql
-- Using native UNPIVOT operator
SELECT product_id, region, sales
FROM SalesWide
UNPIVOT (
    sales FOR region IN (North_Sales, South_Sales, East_Sales, West_Sales)
) unpvt;
```

**PostgreSQL UNPIVOT with JSON:**

```sql
-- Using JSON functions for unpivot
SELECT 
    product_id,
    key AS region,
    value::numeric AS sales
FROM SalesWide,
JSONB_EACH_TEXT(TO_JSONB(SalesWide)) AS j(key, value)
WHERE key LIKE '%_Sales';
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × c) - c columns being unpivoted |
| Space | O(n × c) - output has c times more rows |

## Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| Conditional Aggregation | O(n × c) | O(g) | **Recommended** - fixed pivot values, portable SQL |
| Multiple CASE Expressions | O(n × c) | O(g) | Different logic per column, complex conditions |
| Pivot with JOINs | O(n × j) | O(n × j) | Many categories, dynamic column scenarios |
| Reverse Pivot (UNION) | O(n × c) | O(n × c) | Normalizing wide data, columns to rows |

*Note: n = total rows, c = number of pivot columns, g = number of groups, j = number of joins*

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| Reformat Department Table | 1179 | Easy | Pivot months to columns |
| Group Sold Products By The Date | 1484 | Easy | Aggregate and format as comma-separated |
| Daily Leads and Partners | 1693 | Easy | Conditional counting with DISTINCT |
| Get the Second Most Recent Activity | 1421 | Medium | Complex conditional logic |
| Capital Gain/Loss | 1393 | Medium | Conditional aggregation with math |
| Number of Calls Between Two Persons | 1699 | Medium | Symmetric aggregation with pivot concepts |

## Key Takeaways

- **CASE + SUM is universal**: Works across all SQL databases without vendor-specific syntax
- **Fixed schema**: Standard SQL requires knowing pivot values; dynamic columns need dynamic SQL
- **Aggregate function choice**: SUM for numeric totals, MAX/MIN for single values, COUNT for occurrences
- **NULL handling**: Non-matching CASE conditions produce NULL, which aggregates ignore
- **Performance**: Conditional aggregation is usually faster than multiple self-JOINs
- **Unpivot use cases**: Normalizing wide tables, preparing data for certain machine learning workflows

## Common Pitfalls

1. **Forgetting GROUP BY**: Pivot queries must group by the non-aggregated identifier columns
2. **CASE without ELSE**: Missing ELSE 0 can cause unexpected NULLs when aggregating
3. **Unknown pivot values**: Hardcoding column names fails when new categories appear
4. **Data type mismatches**: Ensure all CASE branches return compatible types
5. **NULL vs zero**: Distinguish between "no data" (NULL) and "zero value" (0)
6. **Column name limits**: Many pivot columns can exceed database identifier length limits
7. **Performance with many columns**: 100+ pivot columns may require dynamic SQL or different approaches

## Pattern Source

[Rows to Columns](sql/rows-to-columns.md)
