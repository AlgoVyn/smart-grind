# LIKE and Wildcards

## Problem Description

The LIKE and Wildcards pattern enables flexible string pattern matching in SQL queries. It allows you to search for data within text columns using special placeholder characters (wildcards) that match variable portions of strings. This pattern is essential for partial matching scenarios where exact equality conditions are too restrictive.

### Key Characteristics

| Characteristic | Description |
|------------------|-------------|
| Time Complexity | O(n × k) - scans all rows, k is pattern length |
| Space Complexity | O(m) - m rows returned in result set |
| Input | String column, pattern with wildcards (% and _) |
| Output | Rows where column matches the specified pattern |
| Approach | Scan → Pattern Match → Filter → Project |

### When to Use

- **Partial matching**: Finding strings that start with, end with, or contain specific substrings
- **Pattern search**: Searching for data with known structure but variable content (e.g., email domains, file extensions)
- **Validation**: Checking if strings follow expected patterns or formats
- **Flexible filtering**: When users need to search with incomplete or approximate information
- **Data cleansing**: Identifying records matching specific formatting patterns
- **Prefix/suffix analysis**: Grouping data by common string prefixes or suffixes

## Intuition

The key insight is **pattern substitution**. The wildcards act as variables that can match any character sequence, allowing a single pattern to match many different actual values.

The "aha!" moments:

1. **% vs _ distinction**: `%` matches ANY sequence (including empty), while `_` matches EXACTLY ONE character - understanding this prevents over-matching or under-matching
2. **Case sensitivity**: `LIKE` case sensitivity depends on database collation; `ILIKE` (PostgreSQL) or `LOWER()` wrapper ensures consistent behavior
3. **Leading wildcard performance**: Patterns starting with `%` (e.g., `'%text'`) cannot use indexes and require full table scans
4. **Trailing wildcards can use indexes**: Patterns like `'text%'` may utilize indexes on the column, achieving O(log n) performance
5. **Escaping wildcards**: When searching for literal `%` or `_` characters, use the `ESCAPE` clause to treat them as regular characters

## Solution Approaches

### Approach 1: Prefix Matching ✅ Recommended

Match strings that START with a specific pattern. This is the most index-friendly pattern matching approach.

#### Algorithm

1. Identify the string column to search
2. Construct pattern with literal prefix followed by `%` wildcard
3. Add WHERE clause with `column LIKE 'prefix%'`
4. Combine with other conditions using AND/OR
5. Consider case sensitivity for consistent matching

#### Implementation

**Find Users by Name Prefix:**

```sql
-- Find all users whose names start with 'John'
SELECT user_id, name
FROM Users
WHERE name LIKE 'John%';
```

**Problem: Fix Product Table Format (SQL-1527)**

```sql
-- Find products with names starting with specific prefix
SELECT product_name
FROM Products
WHERE product_name LIKE 'Tech%';
```

**Case-Insensitive Prefix Search:**

```sql
-- Case-insensitive prefix matching (works across databases)
SELECT name
FROM Users
WHERE LOWER(name) LIKE 'john%';

-- PostgreSQL specific (more efficient)
SELECT name
FROM Users
WHERE name ILIKE 'john%';
```

**Prefix with Multiple Conditions:**

```sql
-- Find active customers with names starting with 'A' or 'B'
SELECT customer_id, name
FROM Customers
WHERE (name LIKE 'A%' OR name LIKE 'B%')
  AND status = 'active';
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(log n) with index, O(n) without index |
| Space | O(m) - rows matching the prefix |

### Approach 2: Suffix Matching

Match strings that END with a specific pattern. Useful for domain matching, file extensions, and suffix-based categorization.

#### Algorithm

1. Identify the target suffix or ending pattern
2. Construct pattern with `%` wildcard followed by literal suffix
3. Add WHERE clause with `column LIKE '%suffix'`
4. Use for email domains, file extensions, or code suffixes

#### Implementation

**Email Domain Matching:**

```sql
-- Find users with Gmail addresses
SELECT user_id, email
FROM Users
WHERE email LIKE '%@gmail.com';
```

**File Extension Matching:**

```sql
-- Find documents with PDF extension
SELECT document_id, filename
FROM Documents
WHERE filename LIKE '%.pdf';

-- Find image files (multiple extensions)
SELECT filename
FROM Files
WHERE filename LIKE '%.jpg'
   OR filename LIKE '%.png'
   OR filename LIKE '%.gif';
```

**Problem: Patients With a Condition (SQL-1527)**

```sql
-- Find patients with conditions ending in specific suffix
SELECT patient_id, conditions
FROM Patients
WHERE conditions LIKE '%diabetes';
```

**Suffix with NOT LIKE:**

```sql
-- Find all emails NOT from company domain
SELECT email
FROM Users
WHERE email NOT LIKE '%@company.com';
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × k) - requires full scan, no index benefit |
| Space | O(m) - rows matching the suffix |

### Approach 3: Contains Matching

Match strings that CONTAIN a specific substring anywhere. The most flexible but least performant pattern.

#### Algorithm

1. Identify the substring to search for
2. Construct pattern with `%` on both sides: `'%substring%'`
3. Add WHERE clause with `column LIKE '%substring%'`
4. Consider full-text search alternatives for better performance

#### Implementation

**Keyword Search:**

```sql
-- Find products containing 'phone' anywhere in name
SELECT product_id, product_name
FROM Products
WHERE product_name LIKE '%phone%';

-- Find articles with specific topic mention
SELECT title, content
FROM Articles
WHERE content LIKE '%machine learning%';
```

**Problem: Find Users With Valid E-Mails (SQL-1517)**

```sql
-- Check for email patterns containing @ and domain
SELECT user_id, email
FROM Users
WHERE email LIKE '%@%.%'
  AND email NOT LIKE '%@%@%';  -- No multiple @ signs
```

**Contains with Multiple Keywords:**

```sql
-- Find products containing either 'laptop' or 'notebook'
SELECT product_name
FROM Products
WHERE product_name LIKE '%laptop%'
   OR product_name LIKE '%notebook%';
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × k) - requires full table scan |
| Space | O(m) - rows containing the substring |

### Approach 4: Single Character Matching

Use the `_` wildcard to match exactly ONE character. Useful for fixed-format patterns with variable single characters.

#### Algorithm

1. Identify positions where any single character is acceptable
2. Use `_` for each variable character position
3. Use literal characters for fixed positions
4. Combine with `%` for mixed patterns

#### Implementation

**Fixed Format Patterns:**

```sql
-- Match names like Jon, Jan, Jen (J + any char + n)
SELECT name
FROM Users
WHERE name LIKE 'J_n';

-- Match phone numbers with specific format (123-456-7890)
SELECT phone_number
FROM Contacts
WHERE phone_number LIKE '___-___-____';
```

**Mixed Pattern with % and _:**

```sql
-- Find order IDs with pattern ORD-2024-X####
-- (ORD-2024- followed by any char, then 4 digits)
SELECT order_id
FROM Orders
WHERE order_id LIKE 'ORD-2024-_%____';
```

**Problem: Fix Names in a Table (SQL-1667)**

```sql
-- Match names with specific pattern using wildcards
SELECT name
FROM Users
WHERE name LIKE '_a%';  -- Second letter is 'a'
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × k) - pattern matching overhead per row |
| Space | O(m) - rows matching the exact pattern |

### Approach 5: Escaping Wildcards

Search for literal `%` or `_` characters when they are part of the actual data, not wildcards.

#### Algorithm

1. Identify if search term contains `%` or `_`
2. Choose an escape character (commonly `\` or `!`)
3. Precede literal wildcards with escape character in pattern
4. Add `ESCAPE` clause to specify the escape character

#### Implementation

**Escaping with Defined Escape Character:**

```sql
-- Find products with literal '%' discount in description
SELECT product_name, description
FROM Products
WHERE description LIKE '%50\%%' ESCAPE '\';

-- Find filenames with literal underscore
SELECT filename
FROM Files
WHERE filename LIKE '%\_%' ESCAPE '\';
```

**Different Escape Characters:**

```sql
-- Using ! as escape character
SELECT name
FROM Products
WHERE name LIKE '%!_%' ESCAPE '!';

-- Using # as escape character
SELECT description
FROM Items
WHERE description LIKE '%#_percent%' ESCAPE '#';
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × k) - pattern matching with escape processing |
| Space | O(m) - rows matching the escaped pattern |

## Complexity Analysis

| Approach | Time | Space | Index Friendly |
|----------|------|-------|----------------|
| Prefix Matching (`'abc%'`)| O(log n) | O(m) | ✅ Yes - can use B-tree index |
| Suffix Matching (`'%abc'`)| O(n × k) | O(m) | ❌ No - full scan required |
| Contains Matching (`'%abc%'`)| O(n × k) | O(m) | ❌ No - full scan required |
| Single Character (`'a_b'`)| O(n × k) | O(m) | ❌ No - full scan required |
| Escaped Wildcards | O(n × k) | O(m) | ❌ No - full scan required |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Find Users With Valid E-Mails](/problems/sql-1517) | 1517 | Medium | Pattern validation with LIKE |
| [Patients With a Condition](/problems/sql-1527) | 1527 | Easy | Suffix matching for diagnosis codes |
| [Fix Names in a Table](/problems/sql-1667) | 1667 | Easy | Pattern matching with wildcards |

## Key Takeaways

- **Prefix matching** (`'text%'`) is the only pattern that can effectively use indexes
- **Leading wildcards** (`'%text'`) always require full table scans - avoid on large tables
- **`%` matches any sequence** (including empty string), **`_` matches exactly one character**
- **Case sensitivity** varies by database; use `LOWER()` or `ILIKE` for consistent results
- **LIKE vs =**: `LIKE` without wildcards behaves like `=` but is less efficient; use `=` for exact matches
- **Alternative to LIKE**: Consider `REGEXP`/`SIMILAR TO` for complex patterns, or full-text search for large text fields

## Common Pitfalls

1. **Confusing % and _**: Remember `%` = any sequence (even empty), `_` = exactly one character
2. **Leading wildcard performance**: `LIKE '%text'` cannot use indexes and scans entire table - consider alternative designs or full-text indexing
3. **Case sensitivity surprises**: `LIKE 'A%'` won't match 'apple' unless using case-insensitive collation or `LOWER()` wrapper
4. **NULL handling**: `LIKE NULL` returns UNKNOWN (no matches), not NULL values - use `IS NULL` separately
5. **Trailing spaces**: Some databases pad `CHAR` columns with spaces; use `RTRIM()` or `VARCHAR` types for consistent matching
6. **Forgetting ESCAPE**: When searching for literal `%` or `_`, queries may return unexpected results without proper escaping
7. **Pattern injection**: User-supplied patterns containing wildcards can match unintended data - sanitize inputs or escape wildcards

## Pattern Source

[LIKE and Wildcards](sql/like-and-wildcards.md)
