# Customers Who Never Order

## Problem

**LeetCode 183 - Easy**

Suppose that a website contains two tables, the `Customers` table and the `Orders` table. Write a SQL query to find all customers who never order anything.

**Customers table:**
```
+----+-------+
| Id | Name  |
+----+-------+
| 1  | Joe   |
| 2  | Henry |
| 3  | Sam   |
| 4  | Max   |
+----+-------+
```

**Orders table:**
```
+----+------------+
| Id | CustomerId |
+----+------------+
| 1  | 3          |
| 2  | 1          |
+----+------------+
```

**Schema:**
- `Customers(Id, Name)` - Customer information
  - `Id`: Primary key
  - `Name`: Customer name
- `Orders(Id, CustomerId)` - Order information
  - `Id`: Primary key
  - `CustomerId`: Foreign key referencing `Customers.Id`

Using the above tables as example, return the following:

```
+-----------+
| Customers |
+-----------+
| Henry     |
| Max       |
+-----------+
```

---

## Approaches

### Approach 1: LEFT JOIN + IS NULL (Recommended)

Use a LEFT JOIN to include all customers and filter for those without matching orders.

```sql
SELECT c.Name AS Customers
FROM Customers c
LEFT JOIN Orders o ON c.Id = o.CustomerId
WHERE o.CustomerId IS NULL;
```

**How it works:**
- `LEFT JOIN` keeps all customers even if they have no orders
- Customers without orders will have NULL values in the Orders columns
- `WHERE o.CustomerId IS NULL` filters to only those unmatched customers

**Time Complexity:** O(n + m) where n = customers, m = orders  
**Space Complexity:** O(n) for the result set

---

### Approach 2: NOT IN

Use a subquery with NOT IN to exclude customers who have placed orders.

```sql
SELECT Name AS Customers
FROM Customers
WHERE Id NOT IN (
    SELECT CustomerId
    FROM Orders
    WHERE CustomerId IS NOT NULL
);
```

**How it works:**
- The subquery collects all CustomerIds that have placed orders
- `NOT IN` excludes customers whose Id appears in the subquery result
- The `WHERE CustomerId IS NOT NULL` in subquery handles NULL safety

**Time Complexity:** O(n × m)  
**Space Complexity:** O(n) for the result set

**Caution:** Without `WHERE CustomerId IS NOT NULL` in the subquery, if Orders contains NULL CustomerIds, NOT IN will return no results (since NULL comparisons yield UNKNOWN).

---

### Approach 3: NOT EXISTS

Use a correlated subquery with NOT EXISTS to check for the absence of orders.

```sql
SELECT Name AS Customers
FROM Customers c
WHERE NOT EXISTS (
    SELECT 1
    FROM Orders o
    WHERE o.CustomerId = c.Id
);
```

**How it works:**
- For each customer, the subquery checks if any order exists for that customer
- `NOT EXISTS` returns true when the subquery returns no rows
- Correlated subquery links outer and inner queries via CustomerId

**Time Complexity:** O(n × m) worst case, O(n log m) with indexing  
**Space Complexity:** O(n) for the result set

---

### Approach 4: EXCEPT / MINUS

Use set difference to find customers not present in orders (PostgreSQL/SQL Server/Oracle syntax).

```sql
-- PostgreSQL/SQL Server
SELECT Name AS Customers
FROM Customers
EXCEPT
SELECT c.Name
FROM Customers c
INNER JOIN Orders o ON c.Id = o.CustomerId;
```

```sql
-- Oracle
SELECT Name AS Customers
FROM Customers
MINUS
SELECT c.Name
FROM Customers c
INNER JOIN Orders o ON c.Id = o.CustomerId;
```

**How it works:**
- `EXCEPT` (or `MINUS` in Oracle) returns rows from the first query not present in the second
- First query: all customer names
- Second query: names of customers who have placed orders

**Time Complexity:** O(n log n)  
**Space Complexity:** O(n) for the result set

---

## Solution Analysis

| Approach | Time Complexity | Space Complexity | Pros | Cons |
|----------|-----------------|------------------|------|------|
| LEFT JOIN + IS NULL | O(n + m) | O(n) | Readable, efficient, standard SQL | None significant |
| NOT IN | O(n × m) | O(n) | Simple syntax | NULL handling issues |
| NOT EXISTS | O(n log m) | O(n) | NULL-safe, semantically clear | Slightly complex syntax |
| EXCEPT/MINUS | O(n log n) | O(n) | Set-based thinking | Database-specific syntax |

**Key Observations:**
- LEFT JOIN is generally the most efficient and widely supported approach
- NOT IN has NULL handling pitfalls that can cause unexpected empty results
- NOT EXISTS is NULL-safe and often optimized well by query planners
- EXCEPT/MINUS provides clean syntax but varies by database vendor

---

## Final Solution

### Recommended: LEFT JOIN + IS NULL

```sql
SELECT c.Name AS Customers
FROM Customers c
LEFT JOIN Orders o ON c.Id = o.CustomerId
WHERE o.CustomerId IS NULL;
```

**Explanation:**
1. `LEFT JOIN Orders` keeps all customers from the Customers table
2. The join condition `c.Id = o.CustomerId` matches customers with their orders
3. For customers with no orders, all Orders columns (including CustomerId) will be NULL
4. `WHERE o.CustomerId IS NULL` filters to include only customers without matching orders
5. Returns the customer names who have never placed an order

**Example Walkthrough:**
- Joe (Id: 1): Has order with Id 2 → o.CustomerId = 3 → not NULL → excluded
- Henry (Id: 2): No matching orders → o.CustomerId IS NULL → included
- Sam (Id: 3): Has order with Id 1 → o.CustomerId = 3 → not NULL → excluded
- Max (Id: 4): No matching orders → o.CustomerId IS NULL → included

**Result:**
```
+-----------+
| Customers |
+-----------+
| Henry     |
| Max       |
+-----------+
```

**Key Points:**
- LEFT JOIN preserves all rows from the left table (Customers)
- IS NULL check is the standard way to find non-matching rows in an outer join
- This approach is portable across all major SQL databases
- Index on Orders.CustomerId improves performance significantly
