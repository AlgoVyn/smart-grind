# Membership Testing (IN / EXISTS)

## Problem Description

The Membership Testing pattern checks whether a value exists in a set or whether rows exist that satisfy certain conditions. This pattern is fundamental for filtering data based on relationships with other tables or predefined value lists.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n × m) - naive nested loop, O(n log m) - with index on subquery |
| Space Complexity | O(m) - for materializing subquery results |
| Input | Value/table to check, set/subquery to check against |
| Output | Boolean result (exists or not) or filtered rows |
| Approach | Set comparison or correlated existence check |

### When to Use

- Checking if a value exists in a list of allowed values
- Filtering rows based on existence in another table
- Verifying non-existence (anti-join patterns)
- Complex existence checks that join multiple tables
- Semi-join patterns (checking existence without returning subquery columns)
- Exclusion filtering (find rows NOT in a set)

## Intuition

The key insight is **set theory operations**. Membership testing applies fundamental set operations (element of, subset, intersection) to SQL data.

The "aha!" moments:

1. **IN vs EXISTS difference**: IN checks value membership in a result set; EXISTS checks for row existence without caring about values
2. **NULL handling**: NOT IN with NULLs returns empty results (tricky pitfall!)
3. **Performance characteristics**: EXISTS often outperforms IN for correlated subqueries (short-circuits on first match)
4. **Correlated vs non-correlated**: IN subqueries can be non-correlated; EXISTS is typically correlated to outer query
5. **Semantically different**: IN is for "is my value in this set?"; EXISTS is for "are there any rows meeting these conditions?"

## Solution Approaches

### Approach 1: IN with Subquery ✅ Recommended for Static Sets

#### Algorithm

1. Identify the column/value to test
2. Write subquery that returns the set of valid values
3. Use IN operator to test membership
4. Returns rows where the value appears in the result set

#### Implementation

**Problem: Customers Who Never Order (SQL-183)**

```sql
-- Find customers who have never placed an order
SELECT 
    c.name AS Customers
FROM Customers c
WHERE c.id NOT IN (
    SELECT customerId 
    FROM Orders
);
```

**Problem: Department Top Three Salaries (SQL-185)**

```sql
-- Check if salary is in top 3 for department
SELECT 
    d.name AS Department,
    e.name AS Employee,
    e.salary AS Salary
FROM Employee e
JOIN Department d ON e.departmentId = d.id
WHERE e.salary IN (
    SELECT DISTINCT salary
    FROM Employee e2
    WHERE e2.departmentId = e.departmentId
    ORDER BY salary DESC
    LIMIT 3
);
```

**Problem: Sales Person (SQL-607)**

```sql
-- Find salespeople with no orders matching specific companies
SELECT s.name
FROM SalesPerson s
WHERE s.sales_id NOT IN (
    SELECT o.sales_id
    FROM Orders o
    JOIN Company c ON o.com_id = c.com_id
    WHERE c.name = 'RED'
);
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × m) - without index, O(n log m) - with index |
| Space | O(m) - materializes subquery result |

### Approach 2: NOT IN - Exclusion (with NULL Caution)

#### Algorithm

1. Use NOT IN to exclude values present in a set
2. **Critical**: Ensure subquery returns no NULLs, or use COALESCE
3. Returns rows where value does NOT appear in the set

#### Implementation

**Problem: Customers Who Never Order (SQL-183)**

```sql
-- Safe approach: handle NULLs in subquery
SELECT 
    name AS Customers
FROM Customers
WHERE id NOT IN (
    SELECT DISTINCT customerId 
    FROM Orders
    WHERE customerId IS NOT NULL  -- Critical to filter NULLs
);
```

**Problem: Find Users With Valid E-Mails (SQL-1517)**

```sql
-- Check if email prefix is NOT in list of invalid prefixes
SELECT user_id, email
FROM Users
WHERE email LIKE '%@%.com'
  AND SUBSTRING_INDEX(email, '@', 1) NOT IN ('', '.', '-');
```

**NULL Handling Demonstration:**

```sql
-- DANGEROUS: NULL in subquery causes empty result
SELECT * FROM table1 
WHERE id NOT IN (SELECT ref_id FROM table2);  -- Returns empty if any ref_id is NULL

-- SAFE: Explicit NULL handling
SELECT * FROM table1 
WHERE id NOT IN (SELECT ref_id FROM table2 WHERE ref_id IS NOT NULL);

-- SAFER: Use NOT EXISTS instead
SELECT * FROM table1 t1
WHERE NOT EXISTS (SELECT 1 FROM table2 t2 WHERE t2.ref_id = t1.id);
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × m) - must check entire set |
| Space | O(m) - materializes subquery |

### Approach 3: EXISTS - Correlated Existence Check ✅ Recommended for Correlated Queries

#### Algorithm

1. Use EXISTS with correlated subquery
2. Subquery references columns from outer query
3. Database stops at first match (short-circuit)
4. Returns rows where at least one matching row exists

#### Implementation

**Problem: Customers Who Never Order (SQL-183)**

```sql
-- EXISTS approach (preferred over NOT IN)
SELECT 
    c.name AS Customers
FROM Customers c
WHERE NOT EXISTS (
    SELECT 1 
    FROM Orders o
    WHERE o.customerId = c.id
);
```

**Problem: Managers with at Least 5 Direct Reports (SQL-570)**

```sql
-- Find managers with 5+ reports using EXISTS
SELECT e.name
FROM Employee e
WHERE EXISTS (
    SELECT 1
    FROM Employee e2
    WHERE e2.managerId = e.id
    HAVING COUNT(*) >= 5
);
```

**Problem: Biggest Single Number (SQL-619)**

```sql
-- Check if number is unique (not duplicated)
SELECT MAX(num) AS num
FROM MyNumbers mn
WHERE NOT EXISTS (
    SELECT 1
    FROM MyNumbers mn2
    WHERE mn2.num = mn.num AND mn2.id != mn.id
);
```

**Problem: Game Play Analysis I (SQL-511)**

```sql
-- Check for existence of first login
SELECT 
    player_id,
    MIN(event_date) AS first_login
FROM Activity
GROUP BY player_id
HAVING EXISTS (
    SELECT 1 FROM Activity a2 
    WHERE a2.player_id = Activity.player_id
);
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × m) worst case, often O(n) with short-circuit |
| Space | O(1) - no materialization |

### Approach 4: NOT EXISTS - Verification of Non-Existence ✅ Safest Anti-Join

#### Algorithm

1. Use NOT EXISTS with correlated subquery
2. Checks that no matching rows exist
3. Safely handles NULLs (unlike NOT IN)
4. Preferred for anti-join patterns

#### Implementation

**Problem: Customers Who Never Order (SQL-183)**

```sql
-- Safest approach for anti-join
SELECT 
    c.name AS Customers
FROM Customers c
WHERE NOT EXISTS (
    SELECT 1 
    FROM Orders o
    WHERE o.customerId = c.id
);
```

**Problem: Employees Earning More Than Their Managers (SQL-181)**

```sql
-- Can use NOT EXISTS to verify no higher-paid manager
SELECT e.name AS Employee
FROM Employee e
WHERE EXISTS (
    SELECT 1
    FROM Employee m
    WHERE m.id = e.managerId
      AND e.salary > m.salary
);
```

**Problem: Find Followers Count (SQL-1729)**

```sql
-- Check existence of followers
SELECT 
    user_id,
    COUNT(*) AS followers_count
FROM Followers
WHERE EXISTS (
    SELECT 1 FROM Users u 
    WHERE u.user_id = Followers.follower_id
)
GROUP BY user_id;
```

**Advanced Pattern - Finding Missing Data:**

```sql
-- Find dates with no sales (anti-join pattern)
SELECT d.date
FROM Calendar d
WHERE NOT EXISTS (
    SELECT 1 FROM Sales s WHERE s.date = d.date
);
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × m) worst case, O(n) average with early termination |
| Space | O(1) - no materialization needed |

## Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| IN | O(n × m) | O(m) | **Recommended** - static value lists, small subquery results |
| NOT IN | O(n × m) | O(m) | Exclusion (with NULL caution) |
| EXISTS | O(n) avg | O(1) | **Recommended** - correlated checks, large subqueries |
| NOT EXISTS | O(n) avg | O(1) | **Recommended** - anti-join, NULL-safe exclusion |

## IN vs EXISTS Performance Comparison

| Scenario | Better Choice | Reason |
|----------|---------------|--------|
| Small subquery result | IN | Materialization overhead acceptable |
| Large subquery result | EXISTS | Short-circuit on first match |
| Correlated subquery | EXISTS | Can use indexes per outer row |
| NULL possible in subquery | EXISTS | IN may produce unexpected results |
| Anti-join pattern | NOT EXISTS | NULL-safe, reliable |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| Customers Who Never Order | 183 | Easy | NOT IN / NOT EXISTS anti-join |
| Department Top Three Salaries | 185 | Hard | IN with LIMIT subquery |
| Managers with at Least 5 Direct Reports | 570 | Medium | EXISTS with HAVING |
| Biggest Single Number | 619 | Easy | NOT EXISTS for uniqueness check |
| Sales Person | 607 | Easy | NOT IN with multi-table subquery |
| Find Users With Valid E-Mails | 1517 | Easy | NOT IN with pattern checking |
| Game Play Analysis I | 511 | Easy | EXISTS for verification |
| Find Followers Count | 1729 | Easy | EXISTS for relationship check |

## Key Takeaways

- **IN semantics**: "Is my value in this set?" - returns rows matching any value in the list
- **EXISTS semantics**: "Are there any rows meeting these conditions?" - returns boolean existence
- **Performance**: EXISTS often faster for correlated queries due to short-circuit evaluation
- **NULL safety**: NOT EXISTS is NULL-safe; NOT IN with NULLs returns empty results
- **Subquery correlation**: IN can be non-correlated; EXISTS is usually correlated

## Common Pitfalls

1. **NOT IN with NULLs**: Returns empty result set if subquery contains any NULL
   ```sql
   -- WRONG: May return nothing
   WHERE id NOT IN (SELECT ref_id FROM table2)
   
   -- RIGHT: Filter NULLs or use NOT EXISTS
   WHERE id NOT IN (SELECT ref_id FROM table2 WHERE ref_id IS NOT NULL)
   ```

2. **Assuming IN is always faster**: For large subqueries, EXISTS with proper indexing wins

3. **Forgetting correlation in EXISTS**: EXISTS needs to reference outer query to be meaningful

4. **Using IN for NULL checks**: `x IN (NULL)` returns UNKNOWN, not TRUE/FALSE

5. **Column count mismatch**: IN requires single column; `(a,b) IN (SELECT x,y)` has limited support

## Pattern Source

[Membership Testing](sql/membership-testing.md)
