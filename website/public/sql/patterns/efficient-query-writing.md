# Efficient Query Writing

## Problem Description

The Efficient Query Writing pattern focuses on optimizing SQL query performance through strategic query construction, proper use of indexes, and minimizing unnecessary operations. This pattern is essential when working with large datasets, production databases, or queries that run frequently.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(log n) with indexes vs O(n) full scans |
| Space Complexity | O(k) - depends on intermediate result sizes |
| Input | Tables with indexes, large datasets, slow queries |
| Output | Optimized query execution with minimal resource usage |
| Approach | Write sargable queries, minimize data transfer, use indexes |

### When to Use

- **Slow query performance**: Queries taking longer than acceptable thresholds
- **Large datasets**: Tables with millions of rows requiring efficient access
- **Production optimization**: High-frequency queries needing minimal resource usage
- **High concurrency**: Systems with many simultaneous users
- **Resource constraints**: Limited CPU, memory, or I/O capacity
- **Report generation**: Complex analytical queries on large data warehouses

## Intuition

The key insight is **work reduction through smart query design**. The database optimizer can only do so much—writing queries that align with how indexes and execution engines work dramatically improves performance.

The "aha!" moments:

1. **Indexes matter**: Sargable queries (Search ARGument ABLE) allow the database to use indexes effectively
2. **Filter early**: Reducing row counts before joins prevents explosive intermediate results
3. **Subqueries can hurt**: Correlated subqueries run once per row; JOINs often perform better
4. **Execution plans reveal truth**: EXPLAIN shows what the database actually does
5. **Data transfer costs**: SELECT * wastes bandwidth; fetch only needed columns

## Solution Approaches

### Approach 1: Index Utilization - Writing Sargable Queries ✅ Recommended

Sargable queries allow the database engine to use indexes efficiently. Avoid operations that prevent index usage.

#### Algorithm

1. Identify columns with indexes (especially in WHERE, JOIN, ORDER BY)
2. Avoid wrapping indexed columns in functions
3. Avoid leading wildcards in LIKE patterns
4. Use explicit type matching to prevent implicit conversions
5. Write range queries that can leverage index range scans

#### Implementation

**Non-Sargable vs Sargable Examples:**

```sql
-- ❌ Non-Sargable: Function on column prevents index usage
SELECT * FROM Orders
WHERE YEAR(order_date) = 2024;

-- ✅ Sargable: Range comparison uses index on order_date
SELECT * FROM Orders
WHERE order_date >= '2024-01-01' 
  AND order_date < '2025-01-01';
```

```sql
-- ❌ Non-Sargable: Leading wildcard prevents index usage
SELECT * FROM Customers
WHERE email LIKE '%@gmail.com';

-- ✅ Sargable: Trailing wildcard can use index
SELECT * FROM Customers
WHERE email LIKE 'john.%';
```

**Problem: Students and Their Departments (SQL-602)**

```sql
-- Optimized version with sargable conditions
SELECT 
    s.student_id,
    s.student_name,
    d.department_name
FROM Students s
INNER JOIN Departments d 
    ON s.department_id = d.department_id
WHERE s.enrollment_date >= '2023-01-01'  -- Uses index on enrollment_date
  AND s.status = 'Active';                -- Uses index on status
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(log n) - index seek vs O(n) full table scan |
| Space | O(k) - result set size |

### Approach 2: Reducing Subqueries - JOIN Alternatives

Replace correlated subqueries and IN/EXISTS subqueries with JOINs when possible for better performance.

#### Algorithm

1. Identify correlated subqueries (run once per outer row)
2. Identify IN/EXISTS subqueries that could be JOINs
3. Rewrite as JOINs for set-based operations
4. Use appropriate join type (INNER, LEFT) based on required results
5. Add DISTINCT if subquery was de-duplicating

#### Implementation

**Correlated Subquery vs JOIN:**

```sql
-- ❌ Slow: Correlated subquery runs once per customer
SELECT c.customer_name,
       (SELECT COUNT(*) 
        FROM Orders o 
        WHERE o.customer_id = c.customer_id) AS order_count
FROM Customers c;

-- ✅ Fast: JOIN with GROUP BY
SELECT 
    c.customer_name,
    COUNT(o.order_id) AS order_count
FROM Customers c
LEFT JOIN Orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.customer_name;
```

**IN Subquery vs JOIN:**

```sql
-- ❌ Subquery with IN
SELECT * FROM Products
WHERE category_id IN (
    SELECT category_id 
    FROM Categories 
    WHERE category_name = 'Electronics'
);

-- ✅ JOIN alternative
SELECT p.*
FROM Products p
INNER JOIN Categories c 
    ON p.category_id = c.category_id
WHERE c.category_name = 'Electronics';
```

**Problem: Customers Who Bought All Products (SQL-1045)**

```sql
-- Optimized approach using GROUP BY instead of subqueries
SELECT customer_id
FROM Orders o
INNER JOIN OrderItems oi ON o.order_id = oi.order_id
WHERE oi.product_id IN (SELECT product_id FROM Products)
GROUP BY customer_id
HAVING COUNT(DISTINCT oi.product_id) = (SELECT COUNT(*) FROM Products);
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n + m) - set-based JOIN vs O(n × m) correlated |
| Space | O(k) - intermediate join results |

### Approach 3: Limiting Early - Filtering Before Joining

Apply filters as early as possible to reduce the number of rows processed in subsequent operations.

#### Algorithm

1. Identify tables with filterable columns in WHERE clause
2. Move filters to derived tables or CTEs to reduce row counts early
3. Filter large tables before joining with other large tables
4. Use appropriate indexes on filter columns
5. Consider execution plan to verify filter pushdown

#### Implementation

**Filter in WHERE vs Derived Table:**

```sql
-- ❌ Filtering after join processes more rows
SELECT 
    c.customer_name,
    o.order_date,
    oi.product_id
FROM Customers c
INNER JOIN Orders o ON c.customer_id = o.customer_id
INNER JOIN OrderItems oi ON o.order_id = oi.order_id
WHERE o.order_date >= '2024-01-01';

-- ✅ Pre-filter orders in derived table
SELECT 
    c.customer_name,
    o.order_date,
    oi.product_id
FROM Customers c
INNER JOIN (
    SELECT * FROM Orders
    WHERE order_date >= '2024-01-01'
) o ON c.customer_id = o.customer_id
INNER JOIN OrderItems oi ON o.order_id = oi.order_id;
```

**Using CTE for Early Filtering:**

```sql
-- Pre-filter large table before expensive operations
WITH RecentOrders AS (
    SELECT customer_id, order_id, order_date
    FROM Orders
    WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      AND status = 'Completed'
)
SELECT 
    c.customer_name,
    COUNT(ro.order_id) AS recent_order_count,
    SUM(oi.amount) AS recent_revenue
FROM Customers c
INNER JOIN RecentOrders ro ON c.customer_id = ro.customer_id
INNER JOIN OrderItems oi ON ro.order_id = oi.order_id
GROUP BY c.customer_id, c.customer_name;
```

**Problem: Monthly Transactions I (SQL-1205)**

```sql
-- Optimized: Filter transactions early before joining with country info
SELECT 
    t.country,
    t.trans_count,
    t.approved_count,
    t.trans_total_amount,
    t.approved_total_amount
FROM (
    SELECT 
        LEFT(trans_date, 7) AS month,
        country,
        COUNT(*) AS trans_count,
        SUM(CASE WHEN state = 'approved' THEN 1 ELSE 0 END) AS approved_count,
        SUM(amount) AS trans_total_amount,
        SUM(CASE WHEN state = 'approved' THEN amount ELSE 0 END) AS approved_total_amount
    FROM Transactions
    WHERE trans_date >= '2024-01-01'  -- Early filter reduces aggregation work
    GROUP BY LEFT(trans_date, 7), country
) t
ORDER BY month, country;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(filtered_n × m) - reduced rows in join |
| Space | O(k) - smaller intermediate results |

### Approach 4: Appropriate Join Types - INNER vs LEFT Optimization

Choose the most restrictive join type that still returns required data. INNER JOINs allow more optimization opportunities than LEFT JOINs.

#### Algorithm

1. Determine if all rows from left table are required
2. Use INNER JOIN when only matching rows needed (enables more optimizations)
3. Use LEFT JOIN only when non-matching rows must be preserved
4. Avoid RIGHT JOINs (rewrite as LEFT JOIN for consistency)
5. Consider NULL handling requirements when choosing join type

#### Implementation

**INNER vs LEFT JOIN:**

```sql
-- ❌ LEFT JOIN when INNER would suffice prevents optimizations
SELECT 
    c.customer_name,
    o.order_date
FROM Customers c
LEFT JOIN Orders o ON c.customer_id = o.customer_id
WHERE o.order_date IS NOT NULL;  -- Effectively an INNER JOIN

-- ✅ Explicit INNER JOIN enables better execution plan
SELECT 
    c.customer_name,
    o.order_date
FROM Customers c
INNER JOIN Orders o ON c.customer_id = o.customer_id;
```

**Join Order Optimization:**

```sql
-- Join smallest/most selective tables first
SELECT 
    p.product_name,
    c.category_name,
    s.supplier_name
FROM (
    -- Start with selective filter
    SELECT * FROM Products
    WHERE category_id = 5  -- Small subset
) p
INNER JOIN Categories c ON p.category_id = c.category_id
INNER JOIN Suppliers s ON p.supplier_id = s.supplier_id;
```

**Avoiding Unnecessary Joins:**

```sql
-- ❌ Unnecessary join if category_name not needed
SELECT 
    p.product_name,
    c.category_name
FROM Products p
INNER JOIN Categories c ON p.category_id = c.category_id
WHERE p.category_id = 5;

-- ✅ Skip join if category_id alone is sufficient
SELECT product_name
FROM Products
WHERE category_id = 5;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × m) - INNER can stop early; LEFT must process all |
| Space | O(k) - INNER typically produces fewer rows |

## Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| Index Utilization | O(log n) | O(k) | **Recommended** - Filtered lookups on large tables |
| Reducing Subqueries | O(n + m) | O(k) | **Recommended** - Replacing correlated subqueries |
| Limiting Early | O(filtered_n × m) | O(k) | Large tables with selective filters |
| Appropriate Join Types | O(n × m) | O(k) | Optimizing join execution paths |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| Students and Departments | 602 | Easy | Basic joins with filtering |
| Customers Who Bought All Products | 1045 | Medium | Multi-table optimization |
| Monthly Transactions I | 1205 | Medium | Aggregation with date filtering |
| Game Play Analysis IV | 534 | Medium | Multi-step query optimization |
| Department Top Three Salaries | 185 | Hard | Optimization with window functions |

## Key Takeaways

- **Write sargable queries**: Avoid functions on indexed columns; use range conditions
- **Filter early**: Reduce row counts before joins and aggregations
- **Prefer JOINs over subqueries**: Set-based operations are usually faster than row-by-row subqueries
- **Use INNER JOIN when possible**: More optimization opportunities than LEFT JOIN
- **Fetch only needed columns**: SELECT * wastes resources
- **Analyze execution plans**: EXPLAIN reveals actual query execution strategy
- **Index strategically**: Ensure frequently filtered columns have appropriate indexes
- **Batch operations**: Process data in chunks for very large datasets

## Common Pitfalls

1. **Functions on indexed columns**: `WHERE YEAR(date_col) = 2024` prevents index usage
2. **Leading wildcards**: `LIKE '%text'` cannot use indexes; use `LIKE 'text%'` instead
3. **SELECT ***: Retrieves unnecessary columns, wasting memory and bandwidth
4. **Correlated subqueries**: Run once per outer row—often slower than JOINs
5. **Implicit conversions**: Type mismatches can prevent index usage
6. **Overusing LEFT JOINs**: Use INNER when non-matching rows aren't needed
7. **Filtering after aggregation**: Using HAVING when WHERE would suffice
8. **Missing indexes on join columns**: Causes expensive full table scans

## Optimization Checklist

| Check | Impact | Action |
|-------|--------|--------|
| Sargable conditions | High | Remove functions on columns, avoid leading wildcards |
| Early filtering | High | Move WHERE conditions to derived tables/CTEs |
| Subquery review | Medium | Replace correlated with JOINs where possible |
| Join type selection | Medium | Use INNER over LEFT when semantics allow |
| Column selection | Low | Replace SELECT * with specific columns |
| Index verification | High | Ensure indexes on filtered/joined columns |

## Pattern Source

[Efficient Query Writing](sql/efficient-query-writing.md)
