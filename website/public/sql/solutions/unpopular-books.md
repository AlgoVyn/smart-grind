## Problem

Find books that have been ordered less than 10 times in the last year (from June 23, 2019). Return the book_id and name of unpopular books.

### Schema

**Books** table:
| Column Name | Type    |
|-------------|---------|
| book_id     | int     |
| name        | varchar |
| available_from| date  |

**Orders** table:
| Column Name | Type    |
|-------------|---------|
| order_id    | int     |
| book_id     | int     |
| quantity    | int     |
| dispatch_date| date   |

- `book_id` is the primary key of Books table.
- `order_id` is the primary key of Orders table.
- `book_id` is a foreign key referencing Books table.

---

## Approaches

### Approach 1: LEFT JOIN with GROUP BY

```sql
SELECT b.book_id, b.name
FROM Books b
LEFT JOIN Orders o ON b.book_id = o.book_id 
    AND o.dispatch_date >= '2018-06-23' 
    AND o.dispatch_date <= '2019-06-23'
GROUP BY b.book_id, b.name
HAVING COALESCE(SUM(o.quantity), 0) < 10;
```

**Explanation:** LEFT JOIN keeps all books even without orders. Filters orders to last year in ON clause, then groups and filters by total quantity < 10.

### Approach 2: NOT IN with Subquery

```sql
SELECT book_id, name
FROM Books
WHERE book_id NOT IN (
    SELECT book_id
    FROM Orders
    WHERE dispatch_date >= '2018-06-23' 
      AND dispatch_date <= '2019-06-23'
    GROUP BY book_id
    HAVING SUM(quantity) >= 10
);
```

**Explanation:** Finds books that are NOT IN the set of books with >= 10 orders in the date range. Note: watch out for NULL handling.

### Approach 3: NOT EXISTS

```sql
SELECT b.book_id, b.name
FROM Books b
WHERE NOT EXISTS (
    SELECT 1
    FROM Orders o
    WHERE o.book_id = b.book_id
      AND o.dispatch_date >= '2018-06-23' 
      AND o.dispatch_date <= '2019-06-23'
    GROUP BY o.book_id
    HAVING SUM(o.quantity) >= 10
);
```

**Explanation:** Checks for non-existence of books meeting the >= 10 orders threshold. Often performs better than NOT IN with proper indexing.

---

## Solution Analysis

| Approach | Time Complexity | Space Complexity | Pros | Cons |
|----------|----------------|------------------|------|------|
| LEFT JOIN with GROUP BY | O(n + m) | O(n) | Single query, handles NULLs | May be slower with large datasets |
| NOT IN with Subquery | O(n * m) | O(m) | Simple to read | NULL values can cause issues |
| NOT EXISTS | O(n log m) | O(1) | Best performance with indexes | Slightly more complex syntax |

---

## Final Solution

```sql
SELECT b.book_id, b.name
FROM Books b
LEFT JOIN Orders o ON b.book_id = o.book_id 
    AND o.dispatch_date >= '2018-06-23' 
    AND o.dispatch_date <= '2019-06-23'
GROUP BY b.book_id, b.name
HAVING COALESCE(SUM(o.quantity), 0) < 10;
```
