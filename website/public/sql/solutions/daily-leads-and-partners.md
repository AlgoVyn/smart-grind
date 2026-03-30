# 1693. Daily Leads and Partners

## Problem

Write a solution to, for each date_id and make_name, find the number of distinct lead_id's and distinct partner_id's.

Return the result table in any order.

### Schema

**DailySales Table:**
| Column Name | Type    | Description |
|-------------|---------|-------------|
| date_id     | date    | Date of the sale |
| make_name   | varchar | Manufacturer name |
| lead_id     | int     | Lead identifier |
| partner_id  | int     | Partner identifier |

### Requirements

- Return: date_id, make_name, unique_leads (count of distinct lead_id), unique_partners (count of distinct partner_id)
- Group by: date_id and make_name
- Count distinct values for each group

## Approaches

### Approach 1: GROUP BY with COUNT DISTINCT (Recommended)

Use GROUP BY with COUNT(DISTINCT) to calculate distinct counts for each group.

#### Algorithm

1. Group rows by date_id and make_name
2. Use COUNT(DISTINCT lead_id) to count unique leads
3. Use COUNT(DISTINCT partner_id) to count unique partners
4. Return the aggregated results

#### Implementation

```sql
SELECT 
    date_id,
    make_name,
    COUNT(DISTINCT lead_id) AS unique_leads,
    COUNT(DISTINCT partner_id) AS unique_partners
FROM DailySales
GROUP BY date_id, make_name;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) due to sorting for GROUP BY |
| Space | O(g) where g is number of groups |

### Approach 2: Separate COUNT DISTINCT as Named Columns

Explicitly define each count as a separate column with descriptive names.

#### Algorithm

1. Group by date_id and make_name
2. Calculate COUNT(DISTINCT lead_id) as unique_leads
3. Calculate COUNT(DISTINCT partner_id) as unique_partners
4. Order results for consistency

#### Implementation

```sql
SELECT 
    date_id,
    make_name,
    COUNT(DISTINCT lead_id) AS unique_leads,
    COUNT(DISTINCT partner_id) AS unique_partners
FROM DailySales
GROUP BY 
    date_id,
    make_name
ORDER BY 
    date_id,
    make_name;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) |
| Space | O(g) |

### Approach 3: Window Functions Alternative

Use DISTINCT with window functions (less efficient but demonstrates alternative syntax).

#### Algorithm

1. Use DENSE_RANK or window functions to identify unique combinations
2. Requires subquery or CTE to achieve same result
3. More complex, generally not recommended for this use case

#### Implementation

```sql
WITH DistinctCounts AS (
    SELECT DISTINCT
        date_id,
        make_name,
        lead_id,
        partner_id
    FROM DailySales
)
SELECT 
    date_id,
    make_name,
    COUNT(lead_id) AS unique_leads,
    COUNT(partner_id) AS unique_partners
FROM DistinctCounts
GROUP BY date_id, make_name;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - with extra overhead for CTE |
| Space | O(n) - stores deduplicated intermediate results |

## Solution Analysis

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| GROUP BY + COUNT DISTINCT | O(n log n) | O(g) | Simple, efficient, standard | None significant |
| Separate named columns | O(n log n) | O(g) | Clear column naming | Same as approach 1 |
| Window Functions | O(n log n) | O(n) | Alternative syntax | Overly complex, less efficient |

**Recommended:** Approach 1 (GROUP BY with COUNT DISTINCT) - most straightforward and efficient for this aggregation pattern.

## Final Solution

```sql
SELECT 
    date_id,
    make_name,
    COUNT(DISTINCT lead_id) AS unique_leads,
    COUNT(DISTINCT partner_id) AS unique_partners
FROM DailySales
GROUP BY date_id, make_name;
```

### Key Concepts

- **COUNT(DISTINCT column)**: Counts unique non-null values in a column
- **GROUP BY multiple columns**: Creates groups based on unique combinations
- **Aggregation functions**: Applied to each group independently
- **Multi-column grouping**: date_id and make_name together define each group

### Performance Notes

- COUNT(DISTINCT) requires storing unique values in memory
- For large datasets, consider using approximations if exact counts aren't required
- Ensure indexes exist on frequently grouped columns for better performance
