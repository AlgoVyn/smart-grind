# Set Comparison (INTERSECT and EXCEPT)

## Problem Description

The Set Comparison pattern uses INTERSECT and EXCEPT operators to compare result sets and find common or different records between two queries. These operators provide clean, declarative ways to perform set operations without explicit joins or subqueries, making queries more readable and maintainable.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n log n + m log m) - due to sorting for duplicate elimination |
| Space Complexity | O(n + m) - storing intermediate results |
| Input | Two SELECT queries with compatible columns |
| Output | Rows that exist in both (INTERSECT) or only in first (EXCEPT) |
| Approach | Set algebra operations on query results |

### When to Use

- Finding records that appear in multiple result sets (overlaps)
- Identifying records present in one set but missing from another (differences)
- Data validation and reconciliation between tables
- Auditing changes between data snapshots
- Finding common attributes across different filters
- Subtracting one dataset from another
- Clean set operations without explicit join syntax

## Intuition

The key insight is **set algebra from mathematics**. INTERSECT and EXECT apply fundamental set operations to SQL result sets.

The "aha!" moments:

1. **INTERSECT as AND**: Records that satisfy BOTH query conditions simultaneously
2. **EXCEPT as subtraction**: Records in set A MINUS records also in set B
3. **Column matching**: Both queries must return same number of columns with compatible types
4. **Duplicate elimination**: These operators automatically remove duplicates (use ALL to keep them)
5. **Order matters for EXCEPT**: A EXCEPT B ≠ B EXCEPT A (unlike INTERSECT which is commutative)

## Solution Approaches

### Approach 1: INTERSECT - Common Records ✅ Recommended for Overlaps

#### Algorithm

1. Write first SELECT query to define set A
2. Write second SELECT query to define set B
3. Connect with INTERSECT operator
4. Returns only rows appearing in both result sets

#### Implementation

**Problem: Report Contiguous Dates (SQL-1050)**

```sql
-- Find dates that are both start and end of some period
SELECT fail_date AS date
FROM Failed
WHERE YEAR(fail_date) = 2019
INTERSECT
SELECT success_date AS date
FROM Succeeded
WHERE YEAR(success_date) = 2019;
```

**Finding Common Customers Across Regions:**

```sql
-- Customers who made purchases in both East and West regions
SELECT customer_id
FROM Orders
WHERE region = 'East'
INTERSECT
SELECT customer_id
FROM Orders
WHERE region = 'West';
```

**Common Products in Categories:**

```sql
-- Products that belong to both Electronics and Featured categories
SELECT product_id
FROM ProductCategories
WHERE category = 'Electronics'
INTERSECT
SELECT product_id
FROM ProductCategories
WHERE category = 'Featured';
```

**Keeping Duplicates with INTERSECT ALL:**

```sql
-- PostgreSQL/Oracle: Keep duplicate counts
SELECT customer_id
FROM Orders WHERE amount > 100
INTERSECT ALL
SELECT customer_id
FROM Orders WHERE status = 'completed';
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n + m log m) - sorting for deduplication |
| Space | O(n + m) - intermediate result storage |

### Approach 2: EXCEPT - Records in First Not in Second ✅ Recommended for Differences

#### Algorithm

1. Write first SELECT query to define the source set
2. Write second SELECT query to define the exclusion set
3. Connect with EXCEPT (or MINUS in Oracle) operator
4. Returns rows from first query not present in second

#### Implementation

**Problem: Report Contiguous Dates (SQL-1050)**

```sql
-- Find periods with only failures (no successes)
SELECT fail_date
FROM Failed
WHERE YEAR(fail_date) = 2019
EXCEPT
SELECT success_date
FROM Succeeded
WHERE YEAR(success_date) = 2019;
```

**Problem: Students and Sandwiches (SQL-1132)**

```sql
-- Students who want sandwiches that are still available
SELECT student_id
FROM Students
WHERE preference IN (
    SELECT sandwich_id FROM Sandwiches
    EXCEPT
    SELECT taken_sandwich_id FROM TakenSandwiches
);
```

**Finding Missing Records:**

```sql
-- Active customers who haven't ordered recently
SELECT customer_id
FROM Customers
WHERE status = 'Active'
EXCEPT
SELECT customer_id
FROM Orders
WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL 90 DAY);
```

**New Items Since Last Snapshot:**

```sql
-- Products added since yesterday
SELECT product_id
FROM Products
WHERE DATE(created_at) = CURDATE()
EXCEPT
SELECT product_id
FROM Products
WHERE DATE(created_at) < CURDATE();
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n + m log m) - sorting and comparison |
| Space | O(n + m) - both result sets needed |

### Approach 3: Simulating with JOINs - For Databases Without Support

#### Algorithm

1. Use INNER JOIN to simulate INTERSECT (matching rows only)
2. Use LEFT JOIN with NULL check to simulate EXCEPT (non-matching rows)
3. Ensure proper handling of NULL values
4. May need DISTINCT for duplicate elimination

#### Implementation

**INTERSECT Simulation with INNER JOIN:**

```sql
-- Simulating: A INTERSECT B
SELECT DISTINCT a.id, a.name
FROM TableA a
INNER JOIN TableB b 
    ON a.id = b.id AND a.name = b.name;

-- Alternative with EXISTS
SELECT DISTINCT id, name
FROM TableA a
WHERE EXISTS (
    SELECT 1 FROM TableB b 
    WHERE b.id = a.id AND b.name = a.name
);
```

**EXCEPT Simulation with LEFT JOIN:**

```sql
-- Simulating: A EXCEPT B
SELECT DISTINCT a.id, a.name
FROM TableA a
LEFT JOIN TableB b 
    ON a.id = b.id AND a.name = b.name
WHERE b.id IS NULL;

-- Alternative with NOT EXISTS (safer with NULLs)
SELECT id, name
FROM TableA a
WHERE NOT EXISTS (
    SELECT 1 FROM TableB b 
    WHERE b.id = a.id AND b.name = a.name
);
```

**MySQL/Older Database Compatibility:**

```sql
-- MySQL doesn't support INTERSECT/EXCEPT natively
-- Use this pattern instead

-- INTERSECT alternative
SELECT a.customer_id, a.name
FROM (
    SELECT DISTINCT customer_id, name
    FROM Orders WHERE region = 'East'
) a
JOIN (
    SELECT DISTINCT customer_id, name
    FROM Orders WHERE region = 'West'
) b ON a.customer_id = b.customer_id AND a.name = b.name;

-- EXCEPT alternative
SELECT DISTINCT customer_id, name
FROM Orders WHERE region = 'East'
WHERE (customer_id, name) NOT IN (
    SELECT customer_id, name
    FROM Orders WHERE region = 'West'
);
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × m) - nested loop without index, O(n log m) with index |
| Space | O(1) - streaming with proper indexing |

### Approach 4: Combined Operations - Multiple Set Operations

#### Algorithm

1. Chain multiple INTERSECT/EXCEPT operations
2. Use parentheses to control precedence
3. Combine with UNION for complete set algebra
4. Build complex data comparisons

#### Implementation

**Three-Way Comparison:**

```sql
-- Customers in East AND West but NOT North
(SELECT customer_id FROM Orders WHERE region = 'East'
 INTERSECT
 SELECT customer_id FROM Orders WHERE region = 'West')
EXCEPT
SELECT customer_id FROM Orders WHERE region = 'North';
```

**Symmetric Difference (Exclusive OR):**

```sql
-- Records in A or B but not both (symmetric difference)
(SELECT id FROM TableA EXCEPT SELECT id FROM TableB)
UNION
(SELECT id FROM TableB EXCEPT SELECT id FROM TableA);
```

**Complex Validation Pattern:**

```sql
-- Products that are: (in stock AND featured) but NOT discontinued
(SELECT product_id FROM Inventory WHERE quantity > 0
 INTERSECT
 SELECT product_id FROM FeaturedProducts)
EXCEPT
SELECT product_id FROM DiscontinuedProducts;
```

**Multi-Stage Filtering:**

```sql
-- Users who: completed onboarding AND made purchase BUT didn't leave review
(SELECT user_id FROM Onboarding WHERE status = 'completed'
 INTERSECT
 SELECT user_id FROM Orders)
EXCEPT
SELECT user_id FROM Reviews;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(k × (n log n)) - k operations on n rows |
| Space | O(n × k) - intermediate results |

## Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| INTERSECT | O(n log n + m log m) | O(n + m) | **Recommended** - finding common records |
| EXCEPT | O(n log n + m log m) | O(n + m) | **Recommended** - finding differences |
| JOIN Simulation | O(n × m) or O(n log m) | O(1)-O(n) | Database compatibility |
| Combined Operations | O(k × n log n) | O(n × k) | Complex set logic |

## Set Operations Quick Reference

| Operation | SQL Syntax | Mathematical Equivalent | Result |
|-----------|------------|------------------------|--------|
| Union | A UNION B | A ∪ B | All records from both |
| Intersection | A INTERSECT B | A ∩ B | Records in both A AND B |
| Difference | A EXCEPT B | A − B | Records in A but NOT in B |
| Symmetric Diff | (A EXCEPT B) UNION (B EXCEPT A) | A Δ B | Records in exactly one set |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| Report Contiguous Dates | 1225 | Hard | Find consecutive date periods using set operations |
| Students and Sandwiches | 1700 | Easy | Queue simulation with set differences |
| Game Play Analysis IV | 550 | Medium | Find players who meet consecutive criteria |
| Find Users With Valid E-Mails | 1517 | Easy | Pattern matching for set validation |
| The Number of Seniors and Juniors | 2008 | Medium | Compare groups using set operations |
| Customer Placing Largest Number of Orders | 586 | Easy | Aggregate and compare sets |

## Key Takeaways

- **Column compatibility**: Both queries must have same column count and compatible types
- **Duplicate handling**: Standard operators remove duplicates; use ALL variants to keep them
- **NULL behavior**: Two NULLs are considered equal for set operations
- **Performance**: Sorting-based operations; consider indexes on compared columns
- **Readability**: Much cleaner than equivalent JOIN/NOT EXISTS patterns
- **Order sensitivity**: EXCEPT is order-dependent; INTERSECT is commutative

## Common Pitfalls

1. **Column count mismatch**: Both SELECTs must return same number of columns
   ```sql
   -- WRONG: Different column counts
   SELECT id, name FROM TableA
   INTERSECT
   SELECT id FROM TableB;  -- Error!
   ```

2. **Data type incompatibility**: Corresponding columns must have compatible types
   ```sql
   -- WRONG: Incompatible types may cause errors
   SELECT id, date_col FROM TableA
   INTERSECT
   SELECT id, string_col FROM TableB;  -- Type mismatch!
   ```

3. **Assuming row order**: Set operations don't guarantee output order; use ORDER BY
   ```sql
   -- CORRECT: Add explicit ordering
   SELECT * FROM A INTERSECT SELECT * FROM B
   ORDER BY id;
   ```

4. **Forgetting EXCEPT is one-way**: Use symmetric difference pattern for mutual exclusion
   ```sql
   -- WRONG: Only gets A-B, misses B-A
   SELECT * FROM A EXCEPT SELECT * FROM B;
   
   -- CORRECT: Symmetric difference
   (SELECT * FROM A EXCEPT SELECT * FROM B)
   UNION
   (SELECT * FROM B EXCEPT SELECT * FROM A);
   ```

5. **MySQL compatibility**: MySQL doesn't support INTERSECT/EXCEPT - use JOIN alternatives

6. **NULL comparisons**: Set operations treat NULLs as equal, which differs from standard SQL NULL behavior

## Pattern Source

[Set Comparison](sql/set-comparison.md)
