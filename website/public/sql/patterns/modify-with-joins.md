# Modify with JOINs

## Problem Description

The Modify with JOINs pattern involves using JOIN operations within UPDATE or DELETE statements to modify data based on complex conditions that span multiple tables. This pattern is essential when you need to update or delete rows using criteria from related tables.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n × m) - depends on join and filter selectivity |
| Space Complexity | O(k) - k rows being modified |
| Input | Target table, join tables, modification criteria |
| Output | Updated or deleted rows based on join conditions |
| Approach | Join tables → Apply filters → Execute modification |

### When to Use

- **Bulk updates with conditions**: Update many rows based on related table data (e.g., raise salaries for employees in high-performing departments)
- **Conditional deletes**: Remove rows using criteria from other tables (e.g., delete orders from inactive customers)
- **Multi-table criteria**: Modification logic depends on relationships across tables
- **Data synchronization**: Update values based on source data in joined tables
- **Referential maintenance**: Clean up orphaned or invalid records using join validation
- **Complex business rules**: Modifications requiring aggregation or calculations across tables

## Intuition

The key insight is **join-then-modify**. While SELECT joins combine data for reading, UPDATE/DELETE joins combine data for writing - using related table values as the "decision engine" for what gets changed.

The "aha!" moments:

1. **Joins in UPDATE**: You can join tables to UPDATE to bring in related data as both filter criteria AND new values
2. **Subquery alternatives**: When database syntax limits join updates, correlated subqueries achieve the same result
3. **Which table gets modified**: Only the target table (after UPDATE/DELETE keyword) changes - joined tables are read-only
4. **Transaction safety**: Multi-row modifications should be wrapped in transactions for atomicity
5. **Syntax variations**: MySQL/MSSQL support direct JOIN syntax; standard SQL uses subquery correlation

## Solution Approaches

### Approach 1: UPDATE with JOIN - MySQL/MSSQL Syntax

#### Algorithm

1. Identify the target table to modify
2. Join related tables that provide criteria or new values
3. Set columns using values from either the target or joined tables
4. Add WHERE conditions to filter which rows update

#### Implementation

**Problem: Delete Duplicate Emails (SQL-196)**

```sql
-- MySQL: Keep the row with smallest id for each email
DELETE p1 FROM Person p1
INNER JOIN Person p2 
    ON p1.email = p2.email 
    AND p1.id > p2.id;

-- Alternative: Use LEFT JOIN to mark duplicates
DELETE p1 FROM Person p1
LEFT JOIN (
    SELECT email, MIN(id) AS min_id
    FROM Person
    GROUP BY email
) p2 ON p1.id = p2.min_id
WHERE p2.min_id IS NULL;
```

**Problem: Swap Salary (SQL-627)**

```sql
-- Update gender codes using join-based mapping
UPDATE Salary s
INNER JOIN (
    SELECT 'm' AS from_gender, 'f' AS to_gender
    UNION ALL
    SELECT 'f', 'm'
) mapping ON s.sex = mapping.from_gender
SET s.sex = mapping.to_gender;

-- MySQL alternative: Direct CASE update (no join needed)
UPDATE Salary
SET sex = CASE sex
    WHEN 'm' THEN 'f'
    WHEN 'f' THEN 'm'
END;
```

**Problem: Exchange Seats (SQL-626)**

```sql
-- MySQL: Swap adjacent student seats using self-join
UPDATE Seats s1
INNER JOIN Seats s2 
    ON (s1.id = s2.id + 1 AND s1.id % 2 = 0)
    OR (s1.id = s2.id - 1 AND s1.id % 2 = 1)
SET s1.student = s2.student;

-- Alternative: Modulo-based swap
UPDATE Seats
SET student = CASE 
    WHEN id % 2 = 1 THEN (SELECT student FROM Seats s2 WHERE s2.id = id + 1)
    WHEN id % 2 = 0 THEN (SELECT student FROM Seats s2 WHERE s2.id = id - 1)
END
WHERE id < (SELECT MAX(id) FROM Seats);
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × m) - join cost plus update cost |
| Space | O(k) - rows being updated |

### Approach 2: UPDATE with Subquery - Standard SQL Approach

#### Algorithm

1. Write the UPDATE with target table only
2. Use WHERE clause with a correlated or uncorrelated subquery
3. The subquery references related tables for filter criteria
4. Optionally use subqueries in SET clause for new values

#### Implementation

**Problem: Delete Duplicate Emails (SQL-196)**

```sql
-- Standard SQL: Delete using subquery with rowid/min id
DELETE FROM Person
WHERE id NOT IN (
    SELECT min_id FROM (
        SELECT MIN(id) AS min_id
        FROM Person
        GROUP BY email
    ) AS temp
);

-- PostgreSQL: Using CTE for clarity
WITH Keepers AS (
    SELECT MIN(id) AS min_id
    FROM Person
    GROUP BY email
)
DELETE FROM Person
WHERE id NOT IN (SELECT min_id FROM Keepers);
```

**Problem: Fix Names in a Table (SQL-1667)**

```sql
-- Update using correlated subquery for transformation
UPDATE Users
SET name = CONCAT(
    UPPER(SUBSTRING(name, 1, 1)),
    LOWER(SUBSTRING(name, 2))
);

-- Alternative with subquery validation
UPDATE Users u
SET name = (
    SELECT CONCAT(
        UPPER(SUBSTRING(u2.name, 1, 1)),
        LOWER(SUBSTRING(u2.name, 2))
    )
    FROM Users u2
    WHERE u2.user_id = u.user_id
)
WHERE EXISTS (SELECT 1 FROM Users u3 WHERE u3.user_id = u.user_id);
```

**Problem: Reformat Department Table (SQL-1179)**

```sql
-- Pivot-like update using conditional aggregation pattern
-- Often requires INSERT...SELECT instead of UPDATE for pivoting

-- For updating based on joined aggregation:
UPDATE Products p
SET price = (
    SELECT new_price
    FROM PriceHistory ph
    WHERE ph.product_id = p.product_id
    ORDER BY effective_date DESC
    LIMIT 1
)
WHERE EXISTS (
    SELECT 1 FROM PriceHistory ph2 
    WHERE ph2.product_id = p.product_id
);
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × m) - subquery execution per row |
| Space | O(k) - rows being modified |

### Approach 3: DELETE with JOIN - Removing with Conditions

#### Algorithm

1. Identify target table for deletion
2. Join tables that provide filter criteria
3. Use WHERE to specify which joined conditions trigger deletion
4. Only target table rows are removed

#### Implementation

**Problem: Delete Duplicate Emails (SQL-196)**

```sql
-- MySQL: Delete duplicates keeping smallest id
DELETE p1 FROM Person p1
INNER JOIN Person p2 
    ON p1.email = p2.email 
    AND p1.id > p2.id;

-- MSSQL: DELETE with JOIN syntax
DELETE p1
FROM Person p1
INNER JOIN Person p2 
    ON p1.email = p2.email 
    AND p1.id > p2.id;
```

**Problem: Remove Inactive Users' Data (SQL-1321)**

```sql
-- MySQL: Delete orders from inactive customers
DELETE o FROM Orders o
INNER JOIN Customers c ON o.customer_id = c.customer_id
WHERE c.status = 'inactive'
   OR c.last_login < DATE_SUB(CURDATE(), INTERVAL 1 YEAR);

-- MSSQL: Same pattern with different date function
DELETE o
FROM Orders o
INNER JOIN Customers c ON o.customer_id = c.customer_id
WHERE c.status = 'inactive'
   OR c.last_login < DATEADD(year, -1, GETDATE());
```

**Problem: Delete Unreferenced Records**

```sql
-- MySQL: Delete products with no orders
DELETE p FROM Products p
LEFT JOIN OrderItems oi ON p.product_id = oi.product_id
WHERE oi.product_id IS NULL;

-- Alternative using NOT EXISTS pattern
DELETE FROM Products
WHERE product_id NOT IN (
    SELECT DISTINCT product_id 
    FROM OrderItems 
    WHERE product_id IS NOT NULL
);
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × m) - join cost plus deletion cost |
| Space | O(k) - rows being deleted |

### Approach 4: DELETE with Subquery - Correlated Deletion

#### Algorithm

1. Write DELETE for target table
2. Use WHERE with IN/EXISTS and a subquery for filter criteria
3. Subquery can reference the target table (correlated) or be independent
4. Safest for standard SQL compatibility

#### Implementation

**Problem: Delete Duplicate Emails (SQL-196)**

```sql
-- Standard SQL: Delete duplicates keeping one per email
DELETE FROM Person
WHERE id NOT IN (
    SELECT MIN(id)
    FROM Person
    GROUP BY email
);

-- Safer version handling NULLs
DELETE FROM Person
WHERE id IN (
    SELECT id FROM (
        SELECT p1.id
        FROM Person p1
        LEFT JOIN Person p2 
            ON p1.email = p2.email 
            AND p1.id > p2.id
        WHERE p2.id IS NOT NULL
    ) AS duplicates
);
```

**Problem: The Restaurant That Meets User Needs (SQL-1321)**

```sql
-- Delete restaurants that don't match user preferences
DELETE FROM Restaurants
WHERE restaurant_id NOT IN (
    SELECT DISTINCT r.restaurant_id
    FROM Restaurants r
    INNER JOIN UserPreferences up 
        ON r.cuisine = up.preferred_cuisine
    WHERE up.user_id = @target_user_id
);

-- Alternative with EXISTS pattern
DELETE FROM Restaurants r
WHERE NOT EXISTS (
    SELECT 1 FROM UserPreferences up
    WHERE up.preferred_cuisine = r.cuisine
      AND up.user_id = @target_user_id
);
```

**Problem: Tree Node Classification (SQL-608)**

```sql
-- Delete leaf nodes (no children) using subquery
DELETE FROM Tree
WHERE id IN (
    SELECT t.id 
    FROM Tree t
    LEFT JOIN Tree children ON t.id = children.p_id
    WHERE children.id IS NULL
);
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × m) - subquery plus deletion |
| Space | O(k) - rows being deleted |

## Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| UPDATE with JOIN | O(n × m) | O(k) | MySQL/MSSQL direct modification |
| UPDATE with Subquery | O(n × m) | O(k) | Standard SQL, complex calculations |
| DELETE with JOIN | O(n × m) | O(k) | Bulk deletes with multi-table criteria |
| DELETE with Subquery | O(n × m) | O(k) | Maximum portability, correlated filters |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| Delete Duplicate Emails | 196 | Easy | Remove duplicates keeping smallest id |
| Swap Salary | 627 | Easy | Exchange gender codes |
| Exchange Seats | 626 | Medium | Swap adjacent rows |
| Fix Names in a Table | 1667 | Easy | String transformation update |
| The Restaurant That Meets User Needs | 1321 | Medium | Delete based on join criteria |
| Tree Node | 608 | Medium | Hierarchical deletion |

## Key Takeaways

- **Syntax matters**: MySQL/MSSQL support JOIN directly in UPDATE/DELETE; standard SQL uses subqueries
- **Target table only**: Only the table after UPDATE/DELETE keyword gets modified - joined tables provide criteria
- **Subquery safety**: When using subqueries in DELETE, wrap in additional subquery to avoid "You can't specify target table" errors
- **Test first**: Run the join as a SELECT query before executing modifications to verify which rows will be affected
- **Transaction wrap**: Wrap multi-row modifications in transactions for rollback capability
- **Index join columns**: Ensure joined columns are indexed for performance on large tables

## Common Pitfalls

1. **"You can't specify target table" error**: MySQL prevents updating a table while selecting from it in subquery - use a derived table wrapper
2. **Ambiguous column references**: Always use table aliases to clarify which table's column to use in SET or WHERE
3. **Cartesian products in updates**: Missing join conditions causes unintended mass updates
4. **NULL handling in NOT IN**: Subqueries with NULLs in NOT IN return unexpected results - use NOT EXISTS instead
5. **Syntax portability**: Direct UPDATE JOIN syntax varies by database - verify your target platform
6. **Forgot WHERE clause**: Without WHERE, UPDATE affects ALL rows - always test with SELECT first

## Pattern Comparison

| Pattern | Syntax | Portability | Use Case |
|---------|--------|-------------|----------|
| UPDATE JOIN | MySQL/MSSQL | Low | Direct, readable modifications |
| UPDATE Subquery | Standard SQL | High | Complex calculations, cross-references |
| DELETE JOIN | MySQL/MSSQL | Low | Multi-table deletion criteria |
| DELETE Subquery | Standard SQL | High | Safe, portable deletion |

## Pattern Source

[Modify with JOINs](sql/modify-with-joins.md)
