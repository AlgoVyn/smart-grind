## Problem

Find the customer who placed the **largest number of orders**.

**Schema:**
```
Orders(OrderNumber, CustomerNumber)
```

---

## Approaches

### Approach 1: GROUP BY + ORDER BY + LIMIT (Recommended)

```sql
SELECT customer_number
FROM Orders
GROUP BY customer_number
ORDER BY COUNT(*) DESC
LIMIT 1;
```

**Time Complexity:** O(n log k) where k is number of unique customers
**Space Complexity:** O(k) for the grouping

**Pros:**
- Simple and intuitive
- Works well for single winner
- Easy to extend for top N (change LIMIT)

**Cons:**
- Returns only one customer if there's a tie
- Sorting overhead

---

### Approach 2: GROUP BY + HAVING with MAX

```sql
SELECT customer_number
FROM Orders
GROUP BY customer_number
HAVING COUNT(*) = (
    SELECT MAX(order_count)
    FROM (
        SELECT COUNT(*) as order_count
        FROM Orders
        GROUP BY customer_number
    ) AS counts
);
```

**Time Complexity:** O(n)
**Space Complexity:** O(k)

**Pros:**
- Returns ALL customers with the max count (handles ties)
- No sorting overhead

**Cons:**
- More complex nested query
- Harder to read

---

### Approach 3: Window Function (Modern SQL)

```sql
SELECT customer_number
FROM (
    SELECT 
        customer_number,
        RANK() OVER (ORDER BY COUNT(*) DESC) as rnk
    FROM Orders
    GROUP BY customer_number
) ranked
WHERE rnk = 1;
```

**Time Complexity:** O(n)
**Space Complexity:** O(k)

**Pros:**
- Handles ties gracefully with RANK()
- Modern, clean syntax
- Flexible ranking options (RANK, DENSE_RANK, ROW_NUMBER)

**Cons:**
- Not supported in older MySQL versions (< 8.0)
- Slightly more complex

---

## Solution Analysis

| Approach | Time | Space | Tie Handling | Readability |
|----------|------|-------|--------------|-------------|
| GROUP + ORDER + LIMIT | O(n log k) | O(k) | Single winner | High |
| HAVING with MAX | O(n) | O(k) | All ties | Medium |
| Window Function | O(n) | O(k) | Configurable | High |

**Key Insight:** Consider whether you need to handle ties. If multiple customers have the same max orders:
- Use LIMIT 1 if you only need one (any)
- Use HAVING or Window Functions if you need all tied winners

---

## Final Solution

```sql
-- Single winner (simplest)
SELECT customer_number
FROM Orders
GROUP BY customer_number
ORDER BY COUNT(*) DESC
LIMIT 1;

-- OR: All tied winners
SELECT customer_number
FROM Orders
GROUP BY customer_number
HAVING COUNT(*) = (
    SELECT MAX(cnt)
    FROM (SELECT COUNT(*) as cnt FROM Orders GROUP BY customer_number) t
);
```
