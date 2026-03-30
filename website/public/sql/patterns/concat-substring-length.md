# CONCAT, SUBSTRING, LENGTH

## Problem Description

String manipulation functions transform, extract, and measure text data in SQL. These functions enable formatting, parsing, validation, and extraction of substrings from character data, forming the foundation for text processing in database queries.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n) - linear scan of string length |
| Space Complexity | O(m) - output string of length m |
| Input | Character data, positions, lengths, delimiters |
| Output | Modified strings, extracted substrings, numeric lengths |
| Approach | Parse → Transform → Return result |

### When to Use

- **Formatting data**: Combining columns with delimiters (CONCAT)
- **Extracting portions**: Pulling substrings from fixed or variable positions (SUBSTRING)
- **Measuring strings**: Validating length constraints (LENGTH)
- **Data transformation**: Cleaning, normalizing, or restructuring text
- **Parsing codes**: Extracting components from structured strings
- **Validation**: Checking minimum/maximum length requirements

## Intuition

The key insight is **positional text processing**. String functions treat text as sequences of characters that can be measured, sliced, and combined using position-based operations.

The "aha!" moments:

1. **1-based indexing**: SUBSTRING uses 1-based indexing (first character is position 1, not 0)
2. **NULL propagation**: CONCAT with NULL returns NULL unless using CONCAT_WS or NULL handling
3. **Chaining functions**: Output of one string function can feed into another
4. **LENGTH vs CHAR_LENGTH**: BYTE length vs CHARACTER count (critical for multi-byte characters)
5. **Negative positions**: Some DBs support negative indices for end-relative extraction

## Solution Approaches

### Approach 1: CONCAT - String Concatenation ✅ Recommended

Combine multiple strings or columns into a single result.

#### Algorithm

1. Identify the strings/columns to combine
2. Choose CONCAT (NULL → NULL) or CONCAT_WS (with separator, skips NULLs)
3. Apply formatting or delimiters as needed
4. Handle NULL values appropriately

#### Implementation

**Basic CONCAT:**

```sql
-- Problem: Fix Names in a Table (SQL-1484)
SELECT 
    user_id,
    CONCAT(UPPER(LEFT(name, 1)), LOWER(SUBSTRING(name, 2))) AS name
FROM Users
ORDER BY user_id;

-- Combine first and last name
SELECT 
    employee_id,
    CONCAT(first_name, ' ', last_name) AS full_name
FROM Employees;
```

**CONCAT_WS (With Separator):**

```sql
-- Join with separator, skipping NULLs
SELECT 
    CONCAT_WS(' - ', 
        product_name, 
        category, 
        CAST(price AS CHAR)
    ) AS product_info
FROM Products;

-- Problem: Fix Names in a Table - alternative
SELECT 
    user_id,
    CONCAT(
        UPPER(SUBSTRING(name, 1, 1)),
        LOWER(SUBSTRING(name, 2, LENGTH(name)))
    ) AS name
FROM Users;
```

**Concatenating Multiple Columns:**

```sql
-- Build formatted address
SELECT 
    customer_id,
    CONCAT(
        street_address, ', ',
        city, ', ',
        state, ' ',
        postal_code
    ) AS full_address
FROM Customers;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - where n is total input length |
| Space | O(m) - where m is output string length |

### Approach 2: SUBSTRING - Extracting Portions

Extract a portion of a string starting at a specified position.

#### Algorithm

1. Identify the source string
2. Specify starting position (1-based)
3. Specify length to extract (optional, defaults to end)
4. Apply to extract desired substring

#### Implementation

**Problem: Fix Product Name Format (SQL-1667)**

```sql
-- Extract prefix and format
SELECT 
    user_id,
    SUBSTRING(name, 1, 1) AS first_initial,
    SUBSTRING(name, 2) AS remaining_chars
FROM Users;
```

**Basic SUBSTRING:**

```sql
-- Extract first 3 characters
SELECT SUBSTRING(product_code, 1, 3) AS category_code FROM Products;

-- Extract from position 5 to end
SELECT SUBSTRING(phone_number, 5) AS extension FROM Contacts;

-- Extract middle portion
SELECT 
    SUBSTRING(ssn, 1, 3) AS area,
    SUBSTRING(ssn, 5, 2) AS group_num,
    SUBSTRING(ssn, 8, 4) AS serial
FROM Employees;
```

**Problem: Invalid Tweets (SQL-1683)**

```sql
-- Check content length by substring validation
SELECT 
    tweet_id
FROM Tweets
WHERE LENGTH(content) > 15;
```

**SUBSTRING with Calculated Positions:**

```sql
-- Dynamic extraction based on delimiter
SELECT 
    email,
    SUBSTRING(email, 1, POSITION('@' IN email) - 1) AS username,
    SUBSTRING(email, POSITION('@' IN email) + 1) AS domain
FROM Users;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(k) - where k is length of substring |
| Space | O(k) - output substring storage |

### Approach 3: LENGTH / CHAR_LENGTH - String Length

Measure the length of strings for validation, formatting, or conditional logic.

#### Algorithm

1. Select the string to measure
2. Use LENGTH (bytes) or CHAR_LENGTH (characters)
3. Apply in WHERE clauses for filtering
4. Use in calculations or formatting logic

#### Implementation

**Problem: Invalid Tweets (SQL-1683) - Complete**

```sql
SELECT 
    tweet_id
FROM Tweets
WHERE CHAR_LENGTH(content) > 15;
```

**Length Validation:**

```sql
-- Check minimum and maximum lengths
SELECT 
    product_name,
    CASE 
        WHEN LENGTH(product_name) < 5 THEN 'Too Short'
        WHEN LENGTH(product_name) > 50 THEN 'Too Long'
        ELSE 'Valid'
    END AS name_status
FROM Products;

-- Find strings of exact length
SELECT * FROM Products WHERE LENGTH(sku) = 10;
```

**LENGTH vs CHAR_LENGTH:**

```sql
-- Multi-byte character handling
SELECT 
    description,
    LENGTH(description) AS byte_length,
    CHAR_LENGTH(description) AS char_length
FROM Products
WHERE CHAR_LENGTH(description) > 100;
```

**Problem: Calculate Special Bonus (SQL-1873)**

```sql
-- Use length for conditional logic
SELECT 
    employee_id,
    CASE 
        WHEN employee_id % 2 = 1 
             AND SUBSTRING(name, 1, 1) != 'M' 
        THEN salary 
        ELSE 0 
    END AS bonus
FROM Employees
ORDER BY employee_id;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - must scan entire string |
| Space | O(1) - returns integer |

### Approach 4: Combined Transformations - Chaining Functions

Layer multiple string functions for complex text processing.

#### Algorithm

1. Start with innermost function (source data)
2. Apply transformations sequentially
3. Handle NULL values at each step
4. Format final output

#### Implementation

**Problem: Fix Names in a Table (SQL-1484) - Complete**

```sql
SELECT 
    user_id,
    CONCAT(
        UPPER(SUBSTRING(name, 1, 1)),
        LOWER(SUBSTRING(name, 2))
    ) AS name
FROM Users
ORDER BY user_id;
```

**Complex Formatting Pipeline:**

```sql
-- Format and validate in one pass
SELECT 
    employee_id,
    CONCAT(
        UPPER(SUBSTRING(first_name, 1, 1)), 
        LOWER(SUBSTRING(first_name, 2, LENGTH(first_name))),
        ' ',
        UPPER(SUBSTRING(last_name, 1, 1)), 
        LOWER(SUBSTRING(last_name, 2))
    ) AS formatted_name,
    CASE 
        WHEN LENGTH(email) > 50 THEN 'Email too long'
        ELSE 'Valid'
    END AS email_status
FROM Employees;
```

**Parsing and Reconstructing:**

```sql
-- Reformat phone numbers
SELECT 
    phone,
    CONCAT(
        '(', SUBSTRING(phone, 1, 3), ') ',
        SUBSTRING(phone, 4, 3), '-',
        SUBSTRING(phone, 7, 4)
    ) AS formatted_phone
FROM Contacts
WHERE LENGTH(phone) = 10;
```

**Conditional String Building:**

```sql
-- Build display name with fallbacks
SELECT 
    user_id,
    CASE 
        WHEN LENGTH(display_name) > 0 
        THEN CONCAT(display_name, ' (', user_id, ')')
        WHEN LENGTH(full_name) > 0 
        THEN CONCAT(full_name, ' [', user_id, ']')
        ELSE CONCAT('User ', user_id)
    END AS display_label
FROM Users;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × f) - n string length, f functions chained |
| Space | O(m) - intermediate and final output |

## Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| CONCAT | O(n) | O(m) | **Recommended** - combining strings |
| SUBSTRING | O(k) | O(k) | Extracting portions |
| LENGTH | O(n) | O(1) | Validation and measurement |
| Combined | O(n × f) | O(m) | Complex transformations |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| Fix Names in a Table | 1484 | Easy | CONCAT + SUBSTRING + UPPER/LOWER |
| Fix Product Name Format | 1667 | Easy | SUBSTRING with case conversion |
| Invalid Tweets | 1683 | Easy | LENGTH for validation |
| Calculate Special Bonus | 1873 | Easy | SUBSTRING in conditional logic |
| Find Users With Valid E-Mails | 1517 | Medium | Pattern matching with string functions |
| Reformat Department Table | 1179 | Hard | Pivoting with string concatenation |
| Replace Employee ID With Unique Identifier | 1378 | Easy | String-based joins |

## Key Takeaways

- **1-based indexing**: SUBSTRING starts at position 1, not 0
- **CONCAT vs CONCAT_WS**: CONCAT returns NULL if any arg is NULL; CONCAT_WS skips NULLs
- **LENGTH vs CHAR_LENGTH**: LENGTH counts bytes; CHAR_LENGTH counts characters (important for Unicode)
- **Chain from inside out**: Nested functions execute innermost first
- **Position functions**: LOCATE, POSITION, INSTR find substring positions for dynamic extraction
- **Case functions**: UPPER/LOWER work well with SUBSTRING for formatting

## Common Pitfalls

1. **0-based thinking**: SUBSTRING(name, 0, 1) returns empty or unexpected results
2. **NULL handling**: CONCAT(NULL, 'text') returns NULL; use COALESCE or CONCAT_WS
3. **Empty strings vs NULL**: LENGTH('') = 0, but LENGTH(NULL) = NULL
4. **Multi-byte characters**: LENGTH counts bytes, not visible characters
5. **Out of bounds**: SUBSTRING with position > string length returns empty string (not error)
6. **Missing length arg**: SUBSTRING(str, pos) extracts to end; SUBSTRING(str, pos, len) extracts exactly len chars

## String Function Reference

| Function | Purpose | NULL Handling | Example |
|----------|---------|---------------|---------|
| CONCAT(s1, s2, ...) | Join strings | Returns NULL if any NULL | CONCAT('A', 'B') = 'AB' |
| CONCAT_WS(sep, s1, ...) | Join with separator | Skips NULL values | CONCAT_WS('-', 'A', NULL, 'B') = 'A-B' |
| SUBSTRING(s, p, l) | Extract substring | Returns NULL if s is NULL | SUBSTRING('ABC', 2, 2) = 'BC' |
| LENGTH(s) | Byte length | Returns NULL | LENGTH('ABC') = 3 |
| CHAR_LENGTH(s) | Character count | Returns NULL | CHAR_LENGTH('A') = 1 |
| UPPER(s) | Convert to uppercase | Returns NULL | UPPER('abc') = 'ABC' |
| LOWER(s) | Convert to lowercase | Returns NULL | LOWER('ABC') = 'abc' |
| LEFT(s, n) | First n characters | Returns NULL | LEFT('ABC', 2) = 'AB' |
| RIGHT(s, n) | Last n characters | Returns NULL | RIGHT('ABC', 2) = 'BC' |

## Pattern Source

[CONCAT, SUBSTRING, LENGTH](sql/concat-substring-length.md)
