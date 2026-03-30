# 1398. Customers Who Bought Products A and B but Not C

## Problem

Write a solution to report the customer_id and customer_name of customers who bought products "A", "B" but did not buy the product "C".

### Schema

**Customers Table:**
| Column Name | Type    | Description |
|-------------|---------|-------------|
| customer_id | int     | Primary Key |
| customer_name | varchar | Customer's name |

**Orders Table:**
| Column Name | Type    | Description |
|-------------|---------|-------------|
| order_id    | int     | Primary Key |
| customer_id | int     | Foreign Key to Customers |
| product_name | varchar | Product purchased |

### Requirements

- Return: customer_id, customer_name
- Must have bought both product A AND product B
- Must NOT have bought product C
- Return results in any order

## Approaches

### Approach 1: GROUP BY with Conditional Counting (Recommended)

Use conditional aggregation to count purchases of each product per customer.

#### Algorithm

1. Join Orders with Customers to get customer names
2. Group by customer_id and customer_name
3. Use SUM with CASE to count purchases of A, B, and C
4. Filter: count of A > 0, count of B > 0, count of C = 0

#### Implementation

```sql
SELECT 
    c.customer_id,
    c.customer_name
FROM Customers c
JOIN Orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.customer_name
HAVING SUM(CASE WHEN o.product_name = 'A' THEN 1 ELSE 0 END) > 0
   AND SUM(CASE WHEN o.product_name = 'B' THEN 1 ELSE 0 END) > 0
   AND SUM(CASE WHEN o.product_name = 'C' THEN 0 ELSE 1 END) = SUM(1);
```

Alternative HAVING clause for "not C":

```sql
HAVING SUM(CASE WHEN o.product_name = 'A' THEN 1 ELSE 0 END) > 0
   AND SUM(CASE WHEN o.product_name = 'B' THEN 1 ELSE 0 END) > 0
   AND SUM(CASE WHEN o.product_name = 'C' THEN 1 ELSE 0 END) = 0;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) with index, O(n) scan |
| Space | O(n) for grouping |

### Approach 2: IN/NOT IN Combination

Use IN clauses to check for product purchases.

#### Algorithm

1. Find customers who bought A
2. Find customers who bought B
3. Find customers who bought C
4. Return customers in (A buyers) AND (B buyers) AND NOT IN (C buyers)

#### Implementation

```sql
SELECT 
    c.customer_id,
    c.customer_name
FROM Customers c
WHERE c.customer_id IN (SELECT customer_id FROM Orders WHERE product_name = 'A')
  AND c.customer_id IN (SELECT customer_id FROM Orders WHERE product_name = 'B')
  AND c.customer_id NOT IN (SELECT customer_id FROM Orders WHERE product_name = 'C');
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × m) - multiple subquery scans |
| Space | O(n) for subquery results |

### Approach 3: Self JOIN for Multi-Product Check

Use self joins to find customers with both products A and B.

#### Algorithm

1. Self join Orders table: one instance for A, another for B
2. Join with Customers for names
3. Exclude customers who bought C using NOT IN or NOT EXISTS

#### Implementation

```sql
SELECT DISTINCT
    c.customer_id,
    c.customer_name
FROM Customers c
JOIN Orders oa ON c.customer_id = oa.customer_id AND oa.product_name = 'A'
JOIN Orders ob ON c.customer_id = ob.customer_id AND ob.product_name = 'B'
WHERE c.customer_id NOT IN (
    SELECT customer_id FROM Orders WHERE product_name = 'C'
);
```

Alternative using NOT EXISTS:

```sql
SELECT DISTINCT
    c.customer_id,
    c.customer_name
FROM Customers c
JOIN Orders oa ON c.customer_id = oa.customer_id AND oa.product_name = 'A'
JOIN Orders ob ON c.customer_id = ob.customer_id AND ob.product_name = 'B'
WHERE NOT EXISTS (
    SELECT 1 FROM Orders oc 
    WHERE oc.customer_id = c.customer_id AND oc.product_name = 'C'
);
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n²) worst case, O(n log n) with index |
| Space | O(n) - result set size |

## Solution Analysis

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| GROUP BY with COUNT | O(n log n) | O(n) | Single pass, scalable | More complex HAVING clause |
| IN/NOT IN | O(n × m) | O(n) | Readable logic | Multiple table scans |
| Self JOIN | O(n log n) | O(n) | Explicit product matching | DISTINCT needed, more joins |

**Recommended:** GROUP BY with Conditional Counting (Approach 1) - most efficient with single table scan, handles all conditions in one pass.

## Final Solution

```sql
SELECT 
    c.customer_id,
    c.customer_name
FROM Customers c
JOIN Orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.customer_name
HAVING SUM(CASE WHEN o.product_name = 'A' THEN 1 ELSE 0 END) > 0
   AND SUM(CASE WHEN o.product_name = 'B' THEN 1 ELSE 0 END) > 0
   AND SUM(CASE WHEN o.product_name = 'C' THEN 1 ELSE 0 END) = 0;
```

### Key Concepts

- **Conditional Aggregation**: SUM(CASE WHEN ...) counts specific products
- **HAVING clause**: Filters groups based on aggregate conditions
- **Multiple conditions**: Must satisfy all three: bought A, bought B, did NOT buy C
- **JOIN then GROUP**: Ensures we only consider customers who have orders
