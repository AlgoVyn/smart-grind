# Combine Result Sets

## Problem Description

The Combine Result Sets pattern merges rows from multiple SELECT queries into a single result set using UNION and UNION ALL operators. This pattern is essential when you need to stack similar data from different sources, combine results from multiple queries, or aggregate data that exists in separate tables or filtered views.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n log n) for UNION (deduplication sort), O(n) for UNION ALL |
| Space Complexity | O(n + m) - combined rows from all queries |
| Input | Multiple SELECT queries with compatible columns |
| Output | Combined rows from all queries |
| Approach | Stack → (Deduplicate if UNION) → Return combined set |

### When to Use

- **Combining similar data**: Merging results from tables with identical structure (e.g., regional sales tables)
- **Deduplication**: Removing duplicate rows when combining overlapping datasets (use UNION)
- **Stacking results**: Appending rows from multiple queries without deduplication (use UNION ALL)
- **Multiple filter conditions**: Combining results from different WHERE clauses on the same table
- **Aggregating partitioned data**: Combining monthly/quarterly tables into yearly reports
- **Combining derived results**: Merging outputs from complex subqueries or CTEs

## Intuition

The key insight is **vertical stacking of compatible rows**. Unlike JOIN which combines columns horizontally, UNION stacks rows vertically. The "aha!" moments:

1. **Vertical not horizontal**: UNION stacks rows (adds height), JOIN combines columns (adds width)
2. **Column count must match**: All SELECT queries must return the same number of columns
3. **Data type compatibility**: Corresponding columns must have compatible data types
4. **UNION vs UNION ALL**: UNION removes duplicates (slower), UNION ALL keeps all rows (faster)
5. **Single result set**: The output is one unified table, not separate results

## Solution Approaches

### Approach 1: UNION ALL - Combine with Duplicates ✅ Recommended

UNION ALL simply concatenates all rows from each query without removing duplicates. It is faster than UNION because it skips the deduplication step.

#### Algorithm

1. Write the first SELECT query
2. Add UNION ALL operator
3. Write the second SELECT query with same column count and compatible types
4. Repeat for additional queries as needed
5. Add ORDER BY at the end (optional) to sort the combined result

#### Implementation

**Basic UNION ALL:**

```sql
-- Combine all sales records from two regions (keep duplicates)
SELECT 
    order_id,
    customer_name,
    amount,
    'North' AS region
FROM North_Sales
UNION ALL
SELECT 
    order_id,
    customer_name,
    amount,
    'South' AS region
FROM South_Sales;
```

**Problem: Students and Sandwiches (SQL-1757) - Simulating stack operations**

```sql
-- Simulate students in queue and sandwich availability
-- This pattern combines different filtered views of the same table
WITH Students AS (
    SELECT 1 AS id, 0 AS type UNION ALL
    SELECT 2, 0 UNION ALL
    SELECT 3, 1 UNION ALL
    SELECT 4, 1 UNION ALL
    SELECT 5, 1
),
Sandwiches AS (
    SELECT 0 AS type, 2 AS count UNION ALL
    SELECT 1, 3
)
SELECT * FROM Students
UNION ALL
SELECT id, type FROM Sandwiches;
```

**Multiple UNION ALL Chains:**

```sql
-- Combine quarterly data into yearly report
SELECT 
    product_id,
    sales_amount,
    'Q1' AS quarter
FROM Q1_Sales
UNION ALL
SELECT 
    product_id,
    sales_amount,
    'Q2' AS quarter
FROM Q2_Sales
UNION ALL
SELECT 
    product_id,
    sales_amount,
    'Q3' AS quarter
FROM Q3_Sales
UNION ALL
SELECT 
    product_id,
    sales_amount,
    'Q4' AS quarter
FROM Q4_Sales
ORDER BY product_id, quarter;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n + m) - linear scan of both result sets |
| Space | O(n + m) - all rows preserved |

### Approach 2: UNION - Combine with Deduplication

UNION combines result sets and removes duplicate rows. It performs an implicit DISTINCT operation on the combined result.

#### Algorithm

1. Write the first SELECT query
2. Add UNION operator (implicitly removes duplicates)
3. Write the second SELECT query with same column count and compatible types
4. Corresponding columns are matched by position, not by name
5. Add ORDER BY at the end (optional)

#### Implementation

**Basic UNION:**

```sql
-- Find all unique customer cities from both tables
SELECT city FROM Customers_North
UNION
SELECT city FROM Customers_South;
```

**Problem: Game Play Analysis (SQL-534) - Finding unique player activities**

```sql
-- Get unique dates when any player was active
SELECT event_date AS login_date
FROM Activity
WHERE (player_id, event_date) IN (
    SELECT player_id, MIN(event_date)
    FROM Activity
    GROUP BY player_id
)
UNION
SELECT event_date
FROM Activity
WHERE player_id NOT IN (
    SELECT DISTINCT player_id FROM Activity
);
```

**UNION with Different Filters:**

```sql
-- Get all VIP customers (high value OR long tenure)
SELECT 
    customer_id,
    customer_name,
    'High Value' AS category
FROM Customers
WHERE total_purchases > 10000
UNION
SELECT 
    customer_id,
    customer_name,
    'Long Tenure' AS category
FROM Customers
WHERE years_active > 5;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O((n + m) log(n + m)) - requires sort for deduplication |
| Space | O(n + m) - combined rows, duplicates removed |

### Approach 3: UNION with Aggregates - Combining Grouped Results

Use UNION to combine results from multiple aggregation queries or group by different dimensions.

#### Algorithm

1. Create multiple SELECT queries with GROUP BY clauses
2. Ensure each query returns the same column structure
3. Use UNION or UNION ALL to combine the aggregated results
4. Add final ORDER BY or additional aggregation

#### Implementation

**Problem: Friendly Movies Streamed Last Month (SQL-1495) - Combining different filters**

```sql
-- Combine results from multiple aggregation queries
WITH FriendlyPrograms AS (
    SELECT content_id
    FROM TVProgram
    WHERE content_type = 'Movies'
)
SELECT 
    c.content_id,
    COUNT(*) AS stream_count,
    'Friendly' AS label
FROM TVProgram t
JOIN Content c ON t.content_id = c.content_id
WHERE c.content_type = 'Movies'
AND t.program_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
AND Kids_content = 'Y'
GROUP BY c.content_id

UNION ALL

SELECT 
    c.content_id,
    0 AS stream_count,
    'No Streams' AS label
FROM Content c
WHERE c.content_type = 'Movies'
AND Kids_content = 'Y'
AND c.content_id NOT IN (
    SELECT content_id FROM TVProgram 
    WHERE program_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
);
```

**Combining Different Aggregation Levels:**

```sql
-- Get monthly totals and grand total in one result
SELECT 
    DATE_FORMAT(order_date, '%Y-%m') AS period,
    SUM(amount) AS total,
    'Monthly' AS level
FROM Orders
WHERE order_date >= '2024-01-01'
GROUP BY DATE_FORMAT(order_date, '%Y-%m')

UNION ALL

SELECT 
    '2024 Total' AS period,
    SUM(amount) AS total,
    'Yearly' AS level
FROM Orders
WHERE order_date >= '2024-01-01'
ORDER BY level DESC, period;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n + m log m + (r1 + r2) log(r1 + r2)) - aggregation + combine |
| Space | O(r1 + r2) - rows from each grouped result |

### Approach 4: Multiple UNIONs - Chaining Several Queries

Chain three or more SELECT statements to combine data from multiple sources.

#### Algorithm

1. Write the base SELECT query
2. Add UNION ALL or UNION for each additional query
3. Ensure all queries have identical column count
4. Use column aliases in the first query (these define result column names)
5. Add final sorting and limiting

#### Implementation

**Problem: List the Products Ordered in a Period (SQL-1327) - Combining order sources**

```sql
-- Combine products from different order types
SELECT 
    p.product_name,
    SUM(o.quantity) AS total_quantity,
    'Standard' AS order_type
FROM Products p
JOIN Orders o ON p.product_id = o.product_id
WHERE o.order_date BETWEEN '2020-02-01' AND '2020-02-29'
GROUP BY p.product_id, p.product_name

UNION ALL

SELECT 
    p.product_name,
    SUM(e.quantity) AS total_quantity,
    'Express' AS order_type
FROM Products p
JOIN Express_Orders e ON p.product_id = e.product_id
WHERE e.order_date BETWEEN '2020-02-01' AND '2020-02-29'
GROUP BY p.product_id, p.product_name

UNION ALL

SELECT 
    p.product_name,
    SUM(b.quantity) AS total_quantity,
    'Backorder' AS order_type
FROM Products p
JOIN Backorders b ON p.product_id = b.product_id
WHERE b.order_date BETWEEN '2020-02-01' AND '2020-02-29'
GROUP BY p.product_id, p.product_name
ORDER BY product_name, order_type;
```

**Multi-Source Data Integration:**

```sql
-- Combine user activities from different tables
SELECT 
    user_id,
    action_time AS activity_time,
    'Login' AS activity_type,
    NULL AS details
FROM User_Logins
WHERE action_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)

UNION ALL

SELECT 
    user_id,
    purchase_time AS activity_time,
    'Purchase' AS activity_type,
    CONCAT('$', amount) AS details
FROM Purchases
WHERE purchase_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)

UNION ALL

SELECT 
    user_id,
    comment_time AS activity_time,
    'Comment' AS activity_type,
    LEFT(comment_text, 50) AS details
FROM Comments
WHERE comment_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)

ORDER BY activity_time DESC
LIMIT 100;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n1 + n2 + ... + nk) for UNION ALL, O(N log N) for UNION where N is total rows |
| Space | O(n1 + n2 + ... + nk) - sum of all rows |

## Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| UNION ALL | O(n + m) | O(n + m) | **Recommended** - when duplicates are acceptable or expected |
| UNION | O((n + m) log(n + m)) | O(n + m) | When deduplication is required |
| UNION with Aggregates | O(n log n + aggregation) | O(result rows) | Combining grouped data from different sources |
| Multiple UNIONs | O(sum of all rows) | O(sum of all rows) | Integrating 3+ data sources |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| Friend Requests II: Who Has the Most Friends | 602 | Medium | UNION to combine requester and accepter |
| Product Sales Analysis IV | 1783 | Medium | Multiple query combination |
| Rank Scores | 178 | Medium | UNION for combining ranks |

## Key Takeaways

- **UNION ALL is faster**: No deduplication overhead; use when duplicates don't matter
- **UNION removes duplicates**: Implicit DISTINCT; slower but ensures uniqueness
- **Column count must match**: All SELECT queries must return the same number of columns
- **Column names from first query**: Result column names come from the first SELECT
- **Data type compatibility**: Corresponding columns must have compatible types
- **Single ORDER BY**: Only one ORDER BY at the end; applies to combined result
- **Position-based matching**: Columns matched by position, not by name

## Common Pitfalls

1. **Mismatched column counts**: Error when SELECT queries have different number of columns
2. **Incompatible data types**: Error or unexpected type conversion between corresponding columns
3. **Assuming UNION ALL behavior**: UNION removes duplicates; use UNION ALL if you want to keep all rows
4. **Forgetting ORDER BY scope**: ORDER BY applies to final combined result only
5. **Using UNION when UNION ALL suffices**: Unnecessary performance cost for deduplication
6. **Column name confusion**: Result uses column names from first query only
7. **Mixing different column orders**: UNION matches by position, not name; ensure logical column alignment

## UNION vs UNION ALL Comparison

| Operator | Duplicates | Performance | Use Case |
|----------|------------|-------------|----------|
| UNION ALL | Kept | O(n) faster | **Recommended** - when duplicates expected or don't matter |
| UNION | Removed | O(n log n) slower | When unique rows required |

## Pattern Source

[Combine Result Sets](sql/combine-result-sets.md)
