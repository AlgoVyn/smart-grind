## Problem

Fix the names so that only the first character is uppercase and the rest are lowercase.

**Table:** `Users`

| Column Name | Type    |
|-------------|---------|
| user_id     | int     |
| name        | varchar |

**Example:**

Input:
| user_id | name  |
|---------|-------|
| 1       | aLice |
| 2       | bOB   |

Output:
| user_id | name  |
|---------|-------|
| 1       | Alice |
| 2       | Bob   |

---

## Approaches

### Approach 1: CONCAT with UPPER/LOWER/SUBSTRING (Standard SQL)

```sql
SELECT user_id, 
       CONCAT(
           UPPER(SUBSTRING(name, 1, 1)), 
           LOWER(SUBSTRING(name, 2))
       ) AS name
FROM Users
ORDER BY user_id;
```

**Explanation:**
- `SUBSTRING(name, 1, 1)` extracts the first character
- `UPPER()` converts the first character to uppercase
- `SUBSTRING(name, 2)` extracts the rest of the string
- `LOWER()` converts the remaining characters to lowercase
- `CONCAT()` combines them back together

---

### Approach 2: INITCAP (PostgreSQL, Oracle)

```sql
SELECT user_id, INITCAP(name) AS name
FROM Users
ORDER BY user_id;
```

**Explanation:**
- `INITCAP()` converts the first letter of each word to uppercase and the rest to lowercase
- Works perfectly for this problem when names are single words
- **Note:** Available in PostgreSQL and Oracle only

---

### Approach 3: CONCAT with LEFT/RIGHT (Modern SQL)

```sql
-- MySQL
SELECT user_id, 
       CONCAT(UPPER(LEFT(name, 1)), LOWER(SUBSTRING(name, 2))) AS name
FROM Users
ORDER BY user_id;

-- PostgreSQL / SQL Server
SELECT user_id, 
       CONCAT(UPPER(LEFT(name, 1)), LOWER(RIGHT(name, LENGTH(name) - 1))) AS name
FROM Users
ORDER BY user_id;
```

**Explanation:**
- `LEFT(name, 1)` is a more readable alternative to `SUBSTRING(name, 1, 1)`
- `RIGHT(name, LENGTH(name) - 1)` gets all characters except the first
- Some databases support `SUBSTR()` instead of `SUBSTRING()`

---

## Solution Analysis

| Approach | Time Complexity | Space Complexity | Pros | Cons |
|----------|-----------------|------------------|------|------|
| CONCAT + SUBSTRING | O(n * m) | O(m) | Portable across all SQL dialects | Verbose syntax |
| INITCAP | O(n * m) | O(m) | Clean, simple | Limited DB support (PostgreSQL, Oracle only) |
| LEFT/RIGHT | O(n * m) | O(m) | More readable | Some functions differ across DBs |

**Where n = number of rows, m = average name length**

---

## Final Solution

```sql
-- Solution 1: Standard SQL (Most Portable)
SELECT user_id, 
       CONCAT(
           UPPER(SUBSTRING(name, 1, 1)), 
           LOWER(SUBSTRING(name, 2))
       ) AS name
FROM Users
ORDER BY user_id;

-- Solution 2: MySQL Specific (using LEFT)
SELECT user_id, 
       CONCAT(UPPER(LEFT(name, 1)), LOWER(SUBSTRING(name, 2))) AS name
FROM Users
ORDER BY user_id;

-- Solution 3: PostgreSQL / Oracle (using INITCAP - simplest)
SELECT user_id, INITCAP(name) AS name
FROM Users
ORDER BY user_id;

-- Solution 4: SQL Server (using RIGHT)
SELECT user_id, 
       UPPER(LEFT(name, 1)) + LOWER(RIGHT(name, LEN(name) - 1)) AS name
FROM Users
ORDER BY user_id;
```

**Key Considerations:**
- `INITCAP` is the cleanest but not universal
- String functions vary slightly by database (SUBSTRING vs SUBSTR, CONCAT vs `+` or `||`)
- Always consider null values - most functions handle them gracefully by returning NULL
