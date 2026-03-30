## Problem

**Delete Duplicate Emails**

Table: `Person`

```
+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| id          | int     |
| email       | varchar |
+-------------+---------+
```

- `id` is the primary key (column with unique values) for this table.
- Each row contains an email. Duplicates will contain the same email.

Write a solution to **delete** all duplicate emails, keeping only one with the smallest `id`.

**Example:**

Input:
```
+----+------------------+
| id | email            |
+----+------------------+
| 1  | john@example.com |
| 2  | bob@example.com  |
| 3  | john@example.com |
+----+------------------+
```

Output:
```
+----+------------------+
| id | email            |
+----+------------------+
| 1  | john@example.com |
| 2  | bob@example.com  |
+----+------------------+
```

---

## Approaches

### Approach 1: DELETE with Self JOIN (MySQL)

```sql
DELETE p1 FROM Person p1
INNER JOIN Person p2
WHERE p1.email = p2.email 
  AND p1.id > p2.id;
```

**Explanation:**
- Join the table with itself on matching emails
- Delete rows where `id` is larger (keeping the smallest `id` for each email)
- Works specifically in MySQL

---

### Approach 2: DELETE with Subquery

```sql
DELETE FROM Person
WHERE id NOT IN (
    SELECT MIN(id)
    FROM Person
    GROUP BY email
);
```

**Explanation:**
- Find the minimum `id` for each email group
- Delete all rows whose `id` is not in that minimum set
- Note: MySQL doesn't allow modifying the same table being selected from, requires workaround with temp table

**MySQL Workaround:**
```sql
DELETE FROM Person
WHERE id NOT IN (
    SELECT * FROM (
        SELECT MIN(id)
        FROM Person
        GROUP BY email
    ) AS tmp
);
```

---

### Approach 3: DELETE with ROW_NUMBER (CTE) - Standard SQL

```sql
WITH RankedEmails AS (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) as rn
    FROM Person
)
DELETE FROM Person
WHERE id IN (
    SELECT id 
    FROM RankedEmails 
    WHERE rn > 1
);
```

**Explanation:**
- Use `ROW_NUMBER()` to assign ranks partitioned by email, ordered by `id`
- Delete all rows with rank > 1 (keeping only the first/smallest `id`)
- Works in PostgreSQL, SQL Server, and modern MySQL 8.0+

---

## Solution Analysis

| Approach | Time Complexity | Space Complexity | Notes |
|----------|----------------|------------------|-------|
| Self JOIN | O(n²) | O(1) | MySQL specific, simple but slow for large tables |
| Subquery | O(n log n) | O(k) | k = unique emails, needs workaround in MySQL |
| ROW_NUMBER | O(n log n) | O(n) | Cleanest, standard SQL, requires CTE support |

- **Self JOIN** is straightforward but has quadratic complexity due to the join
- **Subquery** approach is cleaner conceptually but requires temp table in MySQL
- **ROW_NUMBER** is the modern standard approach, most maintainable and efficient

---

## Final Solution

```sql
-- PostgreSQL / SQL Server / MySQL 8.0+
WITH RankedEmails AS (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) as rn
    FROM Person
)
DELETE FROM Person
WHERE id IN (
    SELECT id 
    FROM RankedEmails 
    WHERE rn > 1
);
```

```sql
-- MySQL 5.7 (without CTE support)
DELETE p1 FROM Person p1
INNER JOIN Person p2
WHERE p1.email = p2.email 
  AND p1.id > p2.id;
```
