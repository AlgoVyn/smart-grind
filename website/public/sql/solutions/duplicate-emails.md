# Duplicate Emails

## Problem

**LeetCode 182 - Easy**

Write a SQL query to find all duplicate emails in a table named `Person`.

```
+----+---------+
| Id | Email   |
+----+---------+
| 1  | a@b.com |
| 2  | c@d.com |
| 3  | a@b.com |
+----+---------+
```

**Schema:**
- `Person(Id, Email)`
  - `Id`: Primary key
  - `Email`: Email address (may contain duplicates)

For example, your query should return the following for the above table:

```
+---------+
| Email   |
+---------+
| a@b.com |
+---------+
```

**Note:** All emails are in lowercase.

---

## Approaches

### Approach 1: GROUP BY + HAVING (Recommended)

Group emails and use HAVING to filter groups with more than one occurrence.

```sql
SELECT Email
FROM Person
GROUP BY Email
HAVING COUNT(*) > 1;
```

**How it works:**
- `GROUP BY Email` groups all rows with the same email together
- `COUNT(*)` counts the number of rows in each group
- `HAVING COUNT(*) > 1` filters only groups with multiple rows (duplicates)

**Time Complexity:** O(n log n) due to grouping  
**Space Complexity:** O(u) where u is the number of unique emails

---

### Approach 2: Self JOIN

Join the Person table with itself to find rows with the same email but different Ids.

```sql
SELECT DISTINCT p1.Email
FROM Person p1
INNER JOIN Person p2 ON p1.Email = p2.Email AND p1.Id != p2.Id;
```

**How it works:**
- Joins the table to itself on matching emails
- `p1.Id != p2.Id` ensures we don't match a row with itself
- `DISTINCT` removes duplicate results from the join

**Time Complexity:** O(n²) - Cartesian product nature  
**Space Complexity:** O(d) where d is the number of duplicates

---

### Approach 3: Subquery with IN

Use a subquery to find emails that appear more than once, then filter the main query.

```sql
SELECT DISTINCT Email
FROM Person
WHERE Email IN (
    SELECT Email
    FROM Person
    GROUP BY Email
    HAVING COUNT(*) > 1
);
```

**How it works:**
- The subquery identifies all emails with duplicates
- The outer query selects distinct emails that exist in the subquery result
- `DISTINCT` ensures each duplicate email appears only once

**Time Complexity:** O(n log n)  
**Space Complexity:** O(d) for the result set

---

## Solution Analysis

| Approach | Time Complexity | Space Complexity | Pros | Cons |
|----------|-----------------|------------------|------|------|
| GROUP BY + HAVING | O(n log n) | O(u) | Simple, efficient, standard SQL | None significant |
| Self JOIN | O(n²) | O(d) | Conceptually clear about finding pairs | Inefficient for large datasets |
| Subquery with IN | O(n log n) | O(d) | Separation of concerns | Extra subquery overhead |

**Key Observations:**
- GROUP BY + HAVING is the most idiomatic SQL solution for finding duplicates
- Self JOIN creates a Cartesian product which can be expensive for large tables
- Subquery approach separates the duplicate detection from the result selection

---

## Final Solution

### Recommended: GROUP BY + HAVING

```sql
SELECT Email
FROM Person
GROUP BY Email
HAVING COUNT(*) > 1;
```

**Explanation:**
1. `GROUP BY Email` groups all rows with the same email address together
2. `COUNT(*)` calculates how many rows exist in each group
3. `HAVING COUNT(*) > 1` filters out groups with only one row, keeping only duplicates
4. The email address is returned for each group that meets the condition

**Example Walkthrough:**
- Group 1: a@b.com → Count = 2 (Ids 1 and 3) → 2 > 1 → included
- Group 2: c@d.com → Count = 1 (Id 2) → 1 > 1 is false → excluded

**Result:**
```
+---------+
| Email   |
+---------+
| a@b.com |
+---------+
```

**Key Points:**
- Use `HAVING` instead of `WHERE` to filter on aggregate functions like `COUNT()`
- This solution works across all major SQL databases (MySQL, PostgreSQL, SQL Server, Oracle)
- Efficient for large datasets as grouping is typically optimized by query planners
