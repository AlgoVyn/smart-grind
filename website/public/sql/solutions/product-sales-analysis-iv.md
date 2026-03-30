# 1070. Product Sales Analysis IV

## Problem

**LeetCode 1070 - Medium**

Write a solution to report for each user, the product with the most quantity purchased. If a user purchased multiple products with the same maximum quantity, report the product with the smallest `product_id`.

Return the result table in **any order**.

**Schema:**
- `Sales(SaleId, ProductId, UserId, Quantity, Price)`
  - `SaleId`: Primary key
  - `ProductId`: Foreign key to Product table
  - `UserId`: ID of the user who made the sale
  - `Quantity`: Number of units purchased
  - `Price`: Price per unit

- `Product(ProductId, ProductName)`
  - `ProductId`: Primary key
  - `ProductName`: Name of the product

**Example Input:**
```
Sales table:
+---------+------------+------+----------+-------+
| sale_id | product_id | user_id| quantity | price |
+---------+------------+------+----------+-------+
| 1       | 1          | 101  | 10       | 10    |
| 2       | 2          | 101  | 15       | 20    |
| 3       | 3          | 102  | 20       | 30    |
| 4       | 4          | 102  | 5        | 10    |
| 5       | 5          | 103  | 25       | 50    |
| 6       | 1          | 101  | 20       | 10    |
| 7       | 6          | 102  | 20       | 40    |
+---------+------------+------+----------+-------+

Product table:
+------------+--------------+
| product_id | product_name |
+------------+--------------+
| 1          | S8           |
| 2          | G4           |
| 3          | iPhone       |
| 4          | TV           |
| 5          | Laptop       |
| 6          | Tablet       |
+------------+--------------+
```

**Example Output:**
```
+---------+------------+--------------+
| user_id | product_id | product_name |
+---------+------------+--------------+
| 101     | 1          | S8           |
| 102     | 3          | iPhone       |
| 103     | 5          | Laptop       |
+---------+------------+--------------+
```

**Explanation:**
- User 101 bought: product 1 (total 30 units = 10 + 20), product 2 (15 units)
  - Max quantity is 30 for product 1 → result: (101, 1, S8)
- User 102 bought: product 3 (20 units), product 4 (5 units), product 6 (20 units)
  - Max quantity is 20, tied between product 3 and 6
  - Choose smaller product_id: 3 → result: (102, 3, iPhone)
- User 103 bought: product 5 (25 units)
  - Max quantity is 25 → result: (103, 5, Laptop)

---

## Approaches

### Approach 1: CTE with MAX Quantity and Tie-Breaking (Recommended)

Aggregate quantities per user-product, find max per user, then apply tie-breaker.

```sql
WITH user_product_qty AS (
    -- Aggregate total quantity per user-product combination
    SELECT 
        user_id,
        product_id,
        SUM(quantity) AS total_qty
    FROM Sales
    GROUP BY user_id, product_id
),
max_qty_per_user AS (
    -- Find max quantity for each user
    SELECT 
        user_id,
        MAX(total_qty) AS max_qty
    FROM user_product_qty
    GROUP BY user_id
)
SELECT 
    upq.user_id,
    upq.product_id,
    p.product_name
FROM user_product_qty upq
JOIN max_qty_per_user mq ON upq.user_id = mq.user_id 
    AND upq.total_qty = mq.max_qty
JOIN Product p ON upq.product_id = p.product_id
-- Tie-breaker: pick smallest product_id if quantities are equal
WHERE upq.product_id = (
    SELECT MIN(product_id) 
    FROM user_product_qty upq2 
    WHERE upq2.user_id = upq.user_id AND upq2.total_qty = mq.max_qty
)
```

**How it works:**
1. `user_product_qty` CTE: Sums quantity for each user-product pair
2. `max_qty_per_user` CTE: Finds maximum quantity per user
3. Join to find products matching max quantity
4. Subquery handles tie-breaking by selecting smallest product_id

**Time Complexity:** O(n log n) for grouping operations  
**Space Complexity:** O(u × p) where u = users, p = products per user

---

### Approach 2: Window Function with RANK

Use window functions to rank products by quantity per user, then filter for top rank.

```sql
WITH user_product_totals AS (
    -- Calculate total quantity per user-product
    SELECT 
        user_id,
        product_id,
        SUM(quantity) AS total_qty
    FROM Sales
    GROUP BY user_id, product_id
),
ranked_products AS (
    -- Rank products within each user by quantity (desc), then by product_id (asc) for tie-break
    SELECT 
        user_id,
        product_id,
        total_qty,
        RANK() OVER (
            PARTITION BY user_id 
            ORDER BY total_qty DESC, product_id ASC
        ) AS rnk
    FROM user_product_totals
)
SELECT 
    rp.user_id,
    rp.product_id,
    p.product_name
FROM ranked_products rp
JOIN Product p ON rp.product_id = p.product_id
WHERE rp.rnk = 1;
```

**How it works:**
1. Aggregate quantities per user-product
2. `RANK()` assigns rank 1 to highest quantity per user
3. `ORDER BY total_qty DESC, product_id ASC` handles tie-breaking (smaller ID wins)
4. Filter for rank = 1 to get the result

**Time Complexity:** O(n log n)  
**Space Complexity:** O(u × p)

**Pros:** Clean, modern SQL; tie-breaking built into ORDER BY  
**Cons:** Window functions not available in all database versions

---

### Approach 3: Self JOIN with Filtering

Use self-join to find products with maximum quantity for each user.

```sql
WITH user_product_qty AS (
    SELECT 
        user_id,
        product_id,
        SUM(quantity) AS total_qty
    FROM Sales
    GROUP BY user_id, product_id
)
SELECT 
    upq1.user_id,
    upq1.product_id,
    p.product_name
FROM user_product_qty upq1
JOIN Product p ON upq1.product_id = p.product_id
-- Ensure this product has max quantity for the user
WHERE upq1.total_qty = (
    SELECT MAX(total_qty) 
    FROM user_product_qty upq2 
    WHERE upq2.user_id = upq1.user_id
)
-- Tie-breaker: no other product with same quantity has smaller ID
AND NOT EXISTS (
    SELECT 1 
    FROM user_product_qty upq3 
    WHERE upq3.user_id = upq1.user_id 
    AND upq3.total_qty = upq1.total_qty 
    AND upq3.product_id < upq1.product_id
);
```

**How it works:**
1. CTE aggregates quantities per user-product
2. Main query filters for products with max quantity using subquery
3. `NOT EXISTS` clause handles tie-breaking (no smaller product_id with same qty)

**Time Complexity:** O((u × p)²) in worst case  
**Space Complexity:** O(u × p)

**Pros:** Works in older SQL versions without window functions  
**Cons:** Correlated subqueries can be slow for large datasets

---

## Solution Analysis

| Approach | Method | Time Complexity | Space Complexity | Pros | Cons |
|----------|--------|-----------------|------------------|------|------|
| CTE with MAX | Aggregation + subquery | O(n log n) | O(u × p) | Standard SQL, clear logic | Tie-breaker subquery adds complexity |
| Window Function | RANK() | O(n log n) | O(u × p) | Cleanest solution, built-in tie-breaking | Requires window function support |
| Self JOIN | Correlated subqueries | O((u × p)²) | O(u × p) | No window functions needed | Slowest for large datasets |

**Key Observations:**
- Must aggregate quantities per user-product (SUM) as users may buy same product multiple times
- Need two-level aggregation: first per user-product, then find max per user
- Tie-breaking rule: smallest product_id when quantities are equal
- Window function approach is most elegant for this type of "top N per group" problem

**Performance Considerations:**
- Index on Sales(user_id, product_id) helps with grouping
- Index on Product(product_id) for join performance
- Window functions typically optimized well in modern databases

---

## Final Solution

### Recommended: Window Function with RANK

```sql
WITH user_product_totals AS (
    SELECT 
        user_id,
        product_id,
        SUM(quantity) AS total_qty
    FROM Sales
    GROUP BY user_id, product_id
),
ranked_products AS (
    SELECT 
        user_id,
        product_id,
        total_qty,
        RANK() OVER (
            PARTITION BY user_id 
            ORDER BY total_qty DESC, product_id ASC
        ) AS rnk
    FROM user_product_totals
)
SELECT 
    rp.user_id,
    rp.product_id,
    p.product_name
FROM ranked_products rp
JOIN Product p ON rp.product_id = p.product_id
WHERE rp.rnk = 1;
```

**Explanation:**
1. **user_product_totals CTE**: Groups by user_id and product_id, sums total quantity purchased
2. **ranked_products CTE**: 
   - `PARTITION BY user_id` creates separate ranking for each user
   - `ORDER BY total_qty DESC, product_id ASC` ranks by quantity (highest first), breaking ties by smaller product_id
   - `RANK()` assigns rank 1 to the winning product(s) per user
3. **Final SELECT**: Joins with Product table and filters for rank = 1

**Example Walkthrough:**

Sales aggregation:
```
user_id | product_id | total_qty
101     | 1          | 30        (10+20)
101     | 2          | 15
102     | 3          | 20
102     | 4          | 5
102     | 6          | 20
103     | 5          | 25
```

Ranking for user 102:
```
product_id | total_qty | rnk
3          | 20        | 1    (tie-break: smaller ID)
6          | 20        | 2    
4          | 5         | 3
```

Final result after filtering rnk=1 and joining Product:
```
user_id | product_id | product_name
101     | 1          | S8
102     | 3          | iPhone
103     | 5          | Laptop
```

**Alternative for databases without window functions:**
```sql
WITH user_product_qty AS (
    SELECT 
        user_id,
        product_id,
        SUM(quantity) AS total_qty
    FROM Sales
    GROUP BY user_id, product_id
)
SELECT 
    upq.user_id,
    MIN(upq.product_id) AS product_id,  -- Tie-breaker
    p.product_name
FROM user_product_qty upq
JOIN Product p ON upq.product_id = p.product_id
WHERE upq.total_qty = (
    SELECT MAX(total_qty) 
    FROM user_product_qty upq2 
    WHERE upq2.user_id = upq.user_id
)
GROUP BY upq.user_id, p.product_name;
```
