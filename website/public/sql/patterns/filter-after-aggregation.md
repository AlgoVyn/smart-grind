# Filter After Aggregation (HAVING Clause)

## Problem Description

The HAVING clause filters grouped results after aggregation operations. While WHERE filters rows before grouping, HAVING filters groups after aggregate functions like COUNT, SUM, AVG, MAX, and MIN have been applied. This pattern is essential for analyzing aggregated data at the group level.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n log n) - due to grouping, O(n) with hash-based aggregation |
| Space Complexity | O(g) - g distinct groups |
| Input | Grouped data, aggregate conditions |
| Output | Groups meeting aggregate conditions |
| Approach | Group → Aggregate → Filter groups |

### When to Use

- Filtering based on aggregate results (COUNT, SUM, AVG, etc.)
- Finding groups with minimum or maximum counts
- Groups meeting specific aggregate thresholds
- Conditions that require data from multiple rows in a group
- Excluding groups based on their calculated values
- Post-aggregation ranking and filtering

## Intuition

The key insight is **two-phase filtering**: WHERE filters individual rows before grouping, while HAVING filters the resulting groups after aggregation.

The "aha!" moments:

1. **WHERE vs HAVING**: WHERE filters rows; HAVING filters groups
2. **Aggregate in HAVING**: Can reference aggregate functions directly
3. **Execution order**: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY
4. **Column visibility**: HAVING sees both raw and aggregated columns
5. **HAVING without GROUP BY**: Treats entire result as single group

## Solution Approaches

### Approach 1: Basic HAVING - Filter on Aggregate ✅ Recommended

#### Algorithm

1. GROUP BY the desired grouping column(s)
2. Apply aggregate functions (COUNT, SUM, etc.)
3. Add HAVING clause with condition on aggregate result
4. Select grouped columns and aggregates

#### Implementation

**Problem: Customer Placing the Largest Number of Orders (SQL-586)**

```sql
-- Find customer(s) with the most orders
SELECT customer_number
FROM Orders
GROUP BY customer_number
HAVING COUNT(*) = (
    SELECT MAX(order_count)
    FROM (
        SELECT COUNT(*) AS order_count
        FROM Orders
        GROUP BY customer_number
    ) t
);
```

**Problem: Find Followers Count (SQL-172)**

```sql
-- Users with specific follower counts
SELECT user_id, COUNT(follower_id) AS followers_count
FROM Followers
GROUP BY user_id
HAVING COUNT(follower_id) >= 2;
```

**Problem: Employees Earning More Than Their Managers** (with HAVING variant)

```sql
-- Departments with high average salary
SELECT departmentId, AVG(salary) AS avg_salary
FROM Employee
GROUP BY departmentId
HAVING AVG(salary) > 50000;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - grouping and aggregation |
| Space | O(g) - storing distinct groups |

### Approach 2: HAVING with Multiple Conditions

Combine multiple aggregate conditions for complex filtering logic.

#### Implementation

**Multiple Aggregate Conditions:**

```sql
-- Departments with many employees AND high average salary
SELECT 
    departmentId,
    COUNT(*) AS employee_count,
    AVG(salary) AS avg_salary
FROM Employee
GROUP BY departmentId
HAVING COUNT(*) >= 5 AND AVG(salary) > 50000;
```

**HAVING with OR:**

```sql
-- Groups meeting either condition
SELECT 
    departmentId,
    MAX(salary) AS max_salary,
    MIN(salary) AS min_salary
FROM Employee
GROUP BY departmentId
HAVING MAX(salary) > 100000 OR MIN(salary) < 30000;
```

**Complex Conditions with Subqueries:**

```sql
-- Products with sales above average
SELECT product_id
FROM Sales
GROUP BY product_id
HAVING SUM(quantity) > (
    SELECT AVG(total_sales)
    FROM (
        SELECT SUM(quantity) AS total_sales
        FROM Sales
        GROUP BY product_id
    ) t
);
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - grows with condition complexity |
| Space | O(g) - distinct groups |

### Approach 3: Finding Maximum Groups

Find groups with maximum or minimum aggregate values.

#### Implementation

**Problem: Customer Placing the Largest Number of Orders (SQL-586)**

```sql
-- Approach: Use ORDER BY with LIMIT
SELECT customer_number
FROM Orders
GROUP BY customer_number
ORDER BY COUNT(*) DESC
LIMIT 1;

-- Alternative: Using HAVING with subquery for ties
SELECT customer_number
FROM Orders
GROUP BY customer_number
HAVING COUNT(*) >= ALL (
    SELECT COUNT(*)
    FROM Orders
    GROUP BY customer_number
);
```

**Top N Groups by Aggregate:**

```sql
-- Top 3 departments by employee count
SELECT departmentId, COUNT(*) AS emp_count
FROM Employee
GROUP BY departmentId
ORDER BY COUNT(*) DESC
LIMIT 3;
```

**Groups with Minimum Values:**

```sql
-- Products with lowest total sales
SELECT product_id, SUM(quantity) AS total_sales
FROM Sales
GROUP BY product_id
HAVING SUM(quantity) = (
    SELECT MIN(product_sales)
    FROM (
        SELECT SUM(quantity) AS product_sales
        FROM Sales
        GROUP BY product_id
    ) t
);
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - grouping plus sorting |
| Space | O(g) - groups plus sort buffer |

### Approach 4: HAVING without GROUP BY

Filter on aggregates when no grouping is needed.

#### Implementation

**Single Group Filter:**

```sql
-- Only return result if total meets threshold
SELECT AVG(salary) AS company_avg
FROM Employee
HAVING COUNT(*) > 10;
```

**Validate Before Returning:**

```sql
-- Check if any sales exist before showing average
SELECT AVG(amount) AS avg_sale
FROM Sales
WHERE sale_date >= '2024-01-01'
HAVING COUNT(*) > 0;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - single aggregation pass |
| Space | O(1) - single aggregate result |

## Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| Basic HAVING | O(n log n) | O(g) | **Recommended** - standard aggregate filtering |
| Multiple Conditions | O(n log n) | O(g) | Complex filtering logic |
| Maximum Groups | O(n log n) | O(g) | Finding extremes |
| Without GROUP BY | O(n) | O(1) | Single group validation |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| Customer Placing the Largest Number of Orders | 586 | Easy | Find customer with maximum order count |
| Find Followers Count | 172 | Easy | Count followers per user |
| Department Highest Salary | 184 | Medium | Max salary per department |
| Consecutive Numbers | 180 | Medium | Find consecutive sequences |
| Department Top Three Salaries | 185 | Hard | Top N per group |
| Human Traffic of Stadium | 601 | Hard | Complex pattern with HAVING |
| Friend Requests II: Who Has the Most Friends | 602 | Medium | Counting with aggregation |
| Sales Analysis III | 1083 | Easy | Date range filtering with groups |
| The Number of Seniors and Juniors | 2004 | Medium | Complex grouping with conditions |

## Key Takeaways

- **WHERE before GROUP BY, HAVING after**: Understand the execution order
- **Aggregates in HAVING**: Reference aggregate functions directly (COUNT(*), SUM(), etc.)
- **Tie handling**: Use subqueries or window functions when ties matter
- **Column restrictions**: Can use SELECT aliases in some databases; prefer explicit aggregates
- **Performance**: Indexes on GROUP BY columns help; HAVING conditions can't use indexes

## Common Pitfalls

1. Using WHERE with aggregate functions (syntax error - use HAVING instead)
2. Forgetting that HAVING filters groups, not individual rows
3. Assuming HAVING executes before ORDER BY (it executes after)
4. Not handling ties when finding maximum/minimum groups
5. Confusing COUNT(*) with COUNT(column) in HAVING conditions
6. Using column aliases in HAVING (not supported in all SQL dialects)
7. Creating Cartesian products when joining before grouping

## WHERE vs HAVING Comparison

| Aspect | WHERE | HAVING |
|--------|-------|--------|
| Execution Phase | Before grouping | After grouping |
| Can Use Aggregates | ❌ No | ✅ Yes |
| Can Use Column Aliases | ❌ No | ⚠️ Sometimes |
| Filters | Individual rows | Groups |
| Performance | Can use indexes | Cannot use indexes |
| Use Case | Row-level conditions | Aggregate conditions |

## Pattern Source

[Filter After Aggregation](sql/filter-after-aggregation.md)
