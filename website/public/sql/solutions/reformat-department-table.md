# 1179. Reformat Department Table

## Problem

Reformat the table so that each row represents a department with its revenue for each month (January to December). Transform from long format to wide format (pivot).

### Schema

**Department Table:**
| Column Name | Type    | Description |
|-------------|---------|-------------|
| id          | int     | Primary Key |
| revenue     | int     | Monthly revenue |
| month       | varchar | Month name (Jan, Feb, etc.) |

### Requirements

- Output: id, Jan_Revenue, Feb_Revenue, ..., Dec_Revenue
- Only include months that have data
- Each department appears once with all 12 month columns
- Missing months should show NULL

## Approaches

### Approach 1: Conditional Aggregation (PIVOT) - Recommended

Use `CASE` expressions within aggregation functions to pivot the data from long to wide format.

#### Algorithm

1. Group by department `id`
2. For each month, use `SUM(CASE WHEN month = 'X' THEN revenue END)` to extract revenue
3. The CASE returns NULL when the month doesn't match
4. This creates one column per month in a single row per department

#### Implementation

```sql
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

**Time Complexity:** O(n) where n is number of rows  
**Space Complexity:** O(d) where d is number of departments

#### How It Works

- `GROUP BY id` collapses all rows for each department into one
- `CASE WHEN month = 'Jan'` filters to only Jan rows for that column
- `SUM()` aggregates (though usually one value per dept/month, handles duplicates)
- Missing months naturally result in NULL since CASE returns NULL

### Approach 2: Using MAX Instead of SUM

Same logic but using MAX for aggregation (semantically clearer since typically one revenue per dept/month).

```sql
SELECT 
    id,
    MAX(CASE WHEN month = 'Jan' THEN revenue END) AS Jan_Revenue,
    MAX(CASE WHEN month = 'Feb' THEN revenue END) AS Feb_Revenue,
    -- ... repeat for all months
    MAX(CASE WHEN month = 'Dec' THEN revenue END) AS Dec_Revenue
FROM Department
GROUP BY id;
```

### Approach 3: Dynamic Pivot Alternative (Database-Specific)

Some databases have native PIVOT support:

**SQL Server / Oracle:**
```sql
SELECT *
FROM Department
PIVOT (
    MAX(revenue) 
    FOR month IN ('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec')
);
```

**PostgreSQL with crosstab:**
```sql
SELECT * FROM crosstab(
    'SELECT id, month, revenue FROM Department ORDER BY 1,2',
    $$VALUES ('Jan'), ('Feb'), ('Mar'), ('Apr'), ('May'), ('Jun'),
             ('Jul'), ('Aug'), ('Sep'), ('Oct'), ('Nov'), ('Dec')$$
) AS ct(id int, Jan_Revenue int, Feb_Revenue int, -- ... all months);
```

## Solution Analysis

| Approach | Pros | Cons | Best For |
|----------|------|------|----------|
| Conditional Aggregation | Universal, portable across all SQL dialects | Verbose syntax (12 CASE expressions) | Production code, portability |
| MAX vs SUM | MAX is semantically clearer | Same verbosity | Single value per dept/month |
| Native PIVOT | Cleaner syntax | Database-specific, limited support | SQL Server/Oracle environments |

## Final Solution

**Recommended: Conditional Aggregation with SUM or MAX**

```sql
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

### Key Concepts

1. **Pivot/Transpose**: Converting rows to columns (long to wide format)
2. **Conditional Aggregation**: Using CASE within aggregate functions
3. **NULL Handling**: CASE naturally returns NULL for non-matching conditions
4. **GROUP BY**: Collapses rows to one per department

### Common Pitfalls

- **Using WHERE to filter months**: Would eliminate rows instead of creating NULL columns
- **Forgetting GROUP BY**: Required to aggregate all rows per department
- **Missing columns**: All 12 months must be explicitly listed
- **Wrong data types**: Ensure revenue column matches aggregation function expectations
