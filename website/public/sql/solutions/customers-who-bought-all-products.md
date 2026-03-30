## Problem

**Table**: `Customer`
| Column Name | Type |
|-------------|------|
| customer_id | int  |
| product_key | int  |

This table may have duplicate rows. `customer_id` is not NULL. `product_key` is a foreign key to `Product` table.

**Table**: `Product`
| Column Name | Type |
|-------------|------|
| product_key | int  |

`product_key` is the primary key column for this table.

Write a solution to report the customer ids from the `Customer` table that bought all the products in the `Product` table.

## Approaches

### Approach 1: GROUP BY with HAVING COUNT

Count distinct products per customer and compare with total products.

```sql
SELECT customer_id
FROM Customer
GROUP BY customer_id
HAVING COUNT(DISTINCT product_key) = (SELECT COUNT(*) FROM Product);
```

### Approach 2: Relational Division Pattern

Using GROUP BY and HAVING with SUM of existence checks.

```sql
SELECT c.customer_id
FROM Customer c
GROUP BY c.customer_id
HAVING SUM(c.product_key IN (SELECT product_key FROM Product)) = 
       (SELECT COUNT(*) FROM Product);
```

### Approach 3: NOT EXISTS for Missing Products

Find customers where no product exists that they didn't buy.

```sql
SELECT DISTINCT c.customer_id
FROM Customer c
WHERE NOT EXISTS (
    SELECT 1 FROM Product p
    WHERE NOT EXISTS (
        SELECT 1 FROM Customer c2
        WHERE c2.customer_id = c.customer_id
        AND c2.product_key = p.product_key
    )
);
```

## Solution Analysis

| Approach | Time Complexity | Space Complexity | Pros | Cons |
|----------|----------------|------------------|------|------|
| GROUP BY with HAVING | O(n log n) | O(n) | Clean, standard approach | Requires DISTINCT count |
| Relational Division | O(n log n) | O(n) | Classic SQL pattern | Can be confusing to read |
| NOT EXISTS | O(n × m) | O(1) | Pure relational logic | Verbose, slower for large data |

## Final Solution

```sql
SELECT customer_id
FROM Customer
GROUP BY customer_id
HAVING COUNT(DISTINCT product_key) = (SELECT COUNT(*) FROM Product);
```

**Explanation**: 
- Group customers by their ID
- Count distinct products each customer bought
- Compare with total number of products in Product table
- Only return customers whose count matches the total
