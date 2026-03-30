# Joining 3+ Tables

## Problem Description

The Joining 3+ Tables pattern involves combining data from three or more tables to answer complex business questions that span multiple entities. This pattern is essential when working with normalized databases where data is distributed across many related tables.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n × m × p) - depends on table sizes and join order |
| Space Complexity | O(k) - k matching rows in result set |
| Input | Three+ tables, multiple join conditions |
| Output | Combined data from all related tables |
| Approach | Chain JOINs → Filter → Combine columns |

### When to Use

- **Complex relationships**: Data spans 3+ entities (e.g., users → orders → products → categories)
- **Aggregating across tables**: Need to group and aggregate data from multiple sources
- **Multi-entity queries**: Questions that involve several connected business objects
- **Lookup hierarchies**: Following chains of foreign keys through multiple levels
- **Cross-reference analysis**: Finding connections between indirectly related entities

## Intuition

The key insight is **relationship chaining**. Think of joining tables as connecting links in a chain - each join extends the reach to another related entity. The order of joins affects performance, but not the final result (assuming proper join conditions).

The "aha!" moments:

1. **Join order matters for performance**: Database optimizer tries to find efficient order, but large table joins should be planned carefully
2. **Chain of relationships**: Each table connects to the next through foreign keys (A → B → C → D)
3. **Intermediate result sets**: Each join produces a virtual table that the next join operates on
4. **Mixing join types**: Different join types per table give fine-grained control over which rows appear
5. **Aggregation timing**: WHERE filters before grouping, HAVING filters after

## Solution Approaches

### Approach 1: Chaining INNER JOINs ✅ Recommended

#### Algorithm

1. Identify the primary/fact table (usually the central entity)
2. Identify dimension tables (related lookup tables)
3. Determine join keys connecting each table pair
4. Chain JOINs in order that minimizes intermediate result size
5. Add filtering and aggregation as needed

#### Implementation

**Problem: Students and Their Departments (SQL-602)**

```sql
-- Find students with their department and university info
SELECT 
    s.student_id,
    s.student_name,
    d.department_name,
    u.university_name,
    u.location
FROM Students s
INNER JOIN Departments d ON s.department_id = d.department_id
INNER JOIN Universities u ON d.university_id = u.university_id
WHERE u.country = 'USA';
```

**Problem: Game Play Analysis (SQL-608)**

```sql
-- Players, their games, and game details
SELECT 
    p.player_id,
    p.player_name,
    g.game_name,
    gp.play_date,
    gp.score
FROM Players p
INNER JOIN GamePlays gp ON p.player_id = gp.player_id
INNER JOIN Games g ON gp.game_id = g.game_id
WHERE gp.play_date >= '2024-01-01';
```

**Problem: Three-Way Join with Filter (SQL-1098)**

```sql
-- Orders with customer and product information
SELECT 
    o.order_id,
    c.customer_name,
    p.product_name,
    o.quantity,
    o.order_date
FROM Orders o
INNER JOIN Customers c ON o.customer_id = c.customer_id
INNER JOIN Products p ON o.product_id = p.product_id
WHERE o.order_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
ORDER BY o.order_date DESC;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n1 × n2 × n3 × ...) - grows with each table |
| Space | O(k) - rows in final result |

### Approach 2: Mixing JOIN Types

Combine INNER and LEFT JOINs to control which rows appear based on relationships with different tables.

#### Implementation

**Required + Optional Relationships:**

```sql
-- All orders with customer (required) and optional product details
SELECT 
    o.order_id,
    c.customer_name,
    COALESCE(p.product_name, 'Unknown') AS product_name,
    o.amount
FROM Orders o
INNER JOIN Customers c ON o.customer_id = c.customer_id  -- Must have customer
LEFT JOIN Products p ON o.product_id = p.product_id;     -- Product optional
```

**Multiple LEFT JOINs:**

```sql
-- Employees with optional department and manager info
SELECT 
    e.employee_id,
    e.employee_name,
    COALESCE(d.department_name, 'Unassigned') AS department,
    COALESCE(m.employee_name, 'No Manager') AS manager
FROM Employees e
LEFT JOIN Departments d ON e.department_id = d.department_id
LEFT JOIN Employees m ON e.manager_id = m.employee_id;
```

**Asymmetric Joins:**

```sql
-- Users who have posts, with optional comment counts
SELECT 
    u.user_id,
    u.username,
    p.post_count,
    COALESCE(c.comment_count, 0) AS comment_count
FROM Users u
INNER JOIN (
    SELECT user_id, COUNT(*) AS post_count
    FROM Posts
    GROUP BY user_id
) p ON u.user_id = p.user_id
LEFT JOIN (
    SELECT user_id, COUNT(*) AS comment_count
    FROM Comments
    GROUP BY user_id
) c ON u.user_id = c.user_id;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × m × p) - varies by join selectivity |
| Space | O(k) - depends on join types used |

### Approach 3: Joining with Aggregation

GROUP BY with multiple joins to aggregate data across related tables.

#### Implementation

**Multi-Table Aggregation:**

```sql
-- Sales by category and region
SELECT 
    c.category_name,
    r.region_name,
    COUNT(DISTINCT o.order_id) AS order_count,
    SUM(oi.quantity * oi.unit_price) AS total_revenue,
    AVG(oi.quantity * oi.unit_price) AS avg_order_value
FROM Categories c
INNER JOIN Products p ON c.category_id = p.category_id
INNER JOIN OrderItems oi ON p.product_id = oi.product_id
INNER JOIN Orders o ON oi.order_id = o.order_id
INNER JOIN Customers cu ON o.customer_id = cu.customer_id
INNER JOIN Regions r ON cu.region_id = r.region_id
WHERE o.order_date >= '2024-01-01'
GROUP BY c.category_id, c.category_name, r.region_id, r.region_name
HAVING SUM(oi.quantity * oi.unit_price) > 10000
ORDER BY total_revenue DESC;
```

**Aggregation with Derived Tables:**

```sql
-- Top selling products by vendor
SELECT 
    v.vendor_name,
    p.product_name,
    p.total_sold,
    p.total_revenue
FROM Vendors v
INNER JOIN (
    SELECT 
        p.vendor_id,
        p.product_id,
        p.product_name,
        SUM(oi.quantity) AS total_sold,
        SUM(oi.quantity * oi.unit_price) AS total_revenue
    FROM Products p
    INNER JOIN OrderItems oi ON p.product_id = oi.product_id
    GROUP BY p.vendor_id, p.product_id, p.product_name
    HAVING SUM(oi.quantity) > 100
) p ON v.vendor_id = p.vendor_id
ORDER BY p.total_revenue DESC;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × m × p + g) - join cost plus grouping cost |
| Space | O(k + g) - result plus group state |

### Approach 4: Finding Connections Across Tables

Use multiple joins to find indirect relationships between entities.

#### Implementation

**Indirect Relationships:**

```sql
-- Find friends of friends who like the same movies
SELECT DISTINCT
    p1.person_name AS person,
    p2.person_name AS friend_of_friend,
    m.movie_name
FROM Persons p1
INNER JOIN Friendships f1 ON p1.person_id = f1.person_id
INNER JOIN Friendships f2 ON f1.friend_id = f2.person_id
INNER JOIN MovieLikes ml1 ON p1.person_id = ml1.person_id
INNER JOIN MovieLikes ml2 ON f2.friend_id = ml2.person_id
                        AND ml1.movie_id = ml2.movie_id
INNER JOIN Persons p2 ON f2.friend_id = p2.person_id
WHERE p1.person_id != p2.person_id;
```

**Bridge Table Joins:**

```sql
-- Students enrolled in courses with instructors
SELECT DISTINCT
    s.student_name,
    c.course_name,
    i.instructor_name,
    e.enrollment_date
FROM Students s
INNER JOIN Enrollments e ON s.student_id = e.student_id
INNER JOIN CourseSections cs ON e.section_id = cs.section_id
INNER JOIN Courses c ON cs.course_id = c.course_id
INNER JOIN Instructors i ON cs.instructor_id = i.instructor_id
WHERE e.status = 'Active';
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n^m) - can grow quickly with many-to-many |
| Space | O(k) - distinct results |

## Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| Chaining INNER JOINs | O(n1 × n2 × n3) | O(k) | **Recommended** - when all relationships exist |
| Mixing JOIN Types | O(n × m × p) | O(k) | Mixed required/optional relationships |
| Join with Aggregation | O(n × m × p + g) | O(k + g) | Reporting and analytics |
| Cross-Table Connections | O(n^m) | O(k) | Finding indirect relationships |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| Department Top Three Salaries | 185 | Hard | Multi-table join with ranking |
| Trips and Users | 262 | Hard | Three-way join with aggregation |
| Customers Who Bought All Products | 1045 | Medium | Multi-join with HAVING clause |
| Game Play Analysis IV | 550 | Medium | Self-join with multiple tables |
| Consecutive Numbers | 180 | Medium | Multi-table correlation |

## Key Takeaways

- **Start with the central table**: Usually the fact table (orders, transactions) is the core
- **Plan join order**: Join smaller/more selective tables first to reduce intermediate results
- **Use appropriate join types**: INNER for required relationships, LEFT for optional
- **Alias everything**: With 3+ tables, aliases prevent column name confusion
- **Filter early**: Apply WHERE conditions as early as possible (usually on the first table)
- **Test incrementally**: Add one join at a time and verify results

## Common Pitfalls

1. **Cartesian products**: Missing a join condition between tables creates explosive row growth
2. **Wrong join order**: Joining large tables early produces huge intermediate results
3. **Ambiguous columns**: Always use table aliases (e.g., `c.customer_id` not just `customer_id`)
4. **Filter placement**: Putting filter conditions in wrong clause affects which rows appear
5. **NULL handling**: LEFT JOINs produce NULLs - use COALESCE or handle in application
6. **Performance blind spots**: Not indexing join columns causes full table scans

## Join Strategy Comparison

| Strategy | Pattern | Example Use Case |
|----------|---------|-------------------|
| INNER Chain | A → B → C → D | Standard multi-entity query |
| INNER + LEFT | A ⟕ B ⟖ C | Required + optional relationships |
| Multiple LEFT | A ⟖ B ⟖ C | All optional lookups |
| Self + Others | A ⟕ A + B | Hierarchies with extra data |
| Derived Tables | (A) → B → C | Pre-aggregated joins |

## Pattern Source

[Joining 3+ Tables](sql/joining-3-plus-tables.md)
