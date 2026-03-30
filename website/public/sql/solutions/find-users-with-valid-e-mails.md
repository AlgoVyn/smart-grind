# 1517. Find Users With Valid E-Mails

## Problem

**LeetCode 1517 - Easy**

Write a solution to find the users who have valid emails.

A valid e-mail address follows these rules:
- Starts with a letter (a-z, A-Z)
- Prefix may contain letters, digits, underscore `_`, period `.`, and/or dash `-`
- Must contain exactly one `@` symbol
- Domain must be `leetcode.com`

**Schema:**
- `Users(UserId, Name, Mail)`
  - `UserId`: Primary key
  - `Name`: User's name
  - `Mail`: User's email address

**Example Input:**
```
+---------+-----------+-------------------------+
| user_id | name      | mail                    |
+---------+-----------+-------------------------+
| 1       | Winston   | winston@leetcode.com    |
| 2       | Jonathan  | jonathanisgreat         |
| 3       | Annabelle | bella-@leetcode.com     |
| 4       | Sally     | sally.come@leetcode.com |
| 5       | Marwan    | quarz#2020@leetcode.com |
| 6       | David     | david69@gmail.com         |
| 7       | Shapiro   | .shapo@leetcode.com     |
+---------+-----------+-------------------------+
```

**Example Output:**
```
+---------+-----------+-------------------------+
| user_id | name      | mail                    |
+---------+-----------+-------------------------+
| 1       | Winston   | winston@leetcode.com    |
| 3       | Annabelle | bella-@leetcode.com     |
| 4       | Sally     | sally.come@leetcode.com |
+---------+-----------+-------------------------+
```

**Invalid emails explained:**
- Jonathan: missing `@leetcode.com` domain
- Marwan: `#` is not allowed in prefix
- David: domain is `gmail.com`, not `leetcode.com`
- Shapiro: starts with `.`, not a letter

---

## Approaches

### Approach 1: REGEXP/REGEXP_LIKE (Recommended)

Use regular expression pattern matching for precise email validation.

**MySQL:**
```sql
SELECT *
FROM Users
WHERE Mail REGEXP '^[a-zA-Z][a-zA-Z0-9_.-]*@leetcode\\.com$';
```

**PostgreSQL:**
```sql
SELECT *
FROM Users
WHERE Mail ~ '^[a-zA-Z][a-zA-Z0-9_.-]*@leetcode\.com$';
```

**SQL Server:**
```sql
SELECT *
FROM Users
WHERE Mail LIKE '[a-zA-Z]%@leetcode.com'
  AND Mail NOT LIKE '%[^a-zA-Z0-9._-]%@leetcode.com';
```

**How it works:**
- `^[a-zA-Z]` - starts with a letter
- `[a-zA-Z0-9_.-]*` - followed by zero or more allowed characters (alphanumeric, underscore, period, dash)
- `@leetcode` - followed by @ symbol and domain name
- `\.com$` - ends with .com (escaped dot for regex)

**Time Complexity:** O(n) - single table scan with regex evaluation  
**Space Complexity:** O(k) - where k is number of valid users

---

### Approach 2: LIKE with Multiple Conditions (Universal)

Use standard `LIKE` operators with wildcards for databases without regex support.

```sql
SELECT *
FROM Users
WHERE Mail LIKE '_%@leetcode.com'
  AND Mail NOT LIKE '%[^a-zA-Z0-9._-]%@leetcode.com'
  AND LEFT(Mail, 1) LIKE '[a-zA-Z]';
```

**How it works:**
- `_%@leetcode.com` - starts with at least one character (`_`) and ends with @leetcode.com
- `NOT LIKE '%[^a-zA-Z0-9._-]%@leetcode.com'` - excludes emails with invalid characters before @
- `LEFT(Mail, 1) LIKE '[a-zA-Z]'` - first character must be a letter

**Note:** This approach may vary by SQL dialect. Some databases have limited pattern matching.

**Time Complexity:** O(n)  
**Space Complexity:** O(k)

---

### Approach 3: Substring Parsing (Universal)

Break down the email into components using string functions.

```sql
SELECT *
FROM Users
WHERE 
    -- Check domain is @leetcode.com
    RIGHT(Mail, 13) = '@leetcode.com'
    -- First character is a letter
    AND LEFT(Mail, 1) REGEXP '^[a-zA-Z]'
    -- No invalid characters in prefix
    AND Mail NOT REGEXP '[^a-zA-Z0-9._-]@';
```

**How it works:**
- `RIGHT(Mail, 13)` extracts the last 13 characters to verify domain
- `LEFT(Mail, 1) REGEXP '^[a-zA-Z]'` ensures first character is a letter
- `NOT REGEXP '[^a-zA-Z0-9._-]@'` checks for invalid characters before @

**Time Complexity:** O(n)  
**Space Complexity:** O(k)

---

## Solution Analysis

| Approach | Method | Time Complexity | Space Complexity | Pros | Cons |
|----------|--------|-----------------|------------------|------|------|
| REGEXP | Pattern matching | O(n) | O(k) | Precise, readable, single condition | Database-specific syntax |
| LIKE | Wildcards | O(n) | O(k) | Universal, no special functions | Complex, less precise |
| Substring | String functions | O(n) | O(k) | Works across databases | Verbose, harder to maintain |

**Key Observations:**
- Regular expressions provide the cleanest and most accurate validation
- The pattern must enforce: letter prefix, valid characters, exact domain match
- Be careful with dot (`.`) in regex - it must be escaped as `\.`
- Some databases require double escaping: `\\.` instead of `\.`

---

## Final Solution

### Recommended: REGEXP Approach (MySQL)

```sql
SELECT *
FROM Users
WHERE Mail REGEXP '^[a-zA-Z][a-zA-Z0-9_.-]*@leetcode\\.com$';
```

### Alternative: REGEXP_LIKE (Oracle/Modern SQL)

```sql
SELECT *
FROM Users
WHERE REGEXP_LIKE(Mail, '^[a-zA-Z][a-zA-Z0-9_.-]*@leetcode\.com$');
```

**Explanation:**
1. `^[a-zA-Z]` - Email must start with a letter (uppercase or lowercase)
2. `[a-zA-Z0-9_.-]*` - After the first letter, the prefix can contain:
   - Letters (a-z, A-Z)
   - Digits (0-9)
   - Underscore (`_`)
   - Period (`.`)
   - Dash (`-`)
3. `@leetcode` - Followed by the @ symbol and domain name "leetcode"
4. `\.com$` - Ends with ".com" (dot is escaped in regex to match literal period, not any character)
5. `\\.` in MySQL requires double escaping for the backslash

**Pattern Breakdown:**
```
^[a-zA-Z]          - Start with a letter
[a-zA-Z0-9_.-]*     - Zero or more allowed characters
@leetcode           - @ symbol followed by domain
\.com               - literal .com
$                   - End of string
```

**Example Walkthrough:**
- `winston@leetcode.com` → Matches: starts with 'w', contains only valid chars, correct domain
- `jonathanisgreat` → No match: missing @ and domain
- `bella-@leetcode.com` → Matches: starts with 'b', valid chars including dash, correct domain
- `.shapo@leetcode.com` → No match: starts with '.', not a letter
- `david69@gmail.com` → No match: wrong domain

**Result:**
```
+---------+-----------+-------------------------+
| user_id | name      | mail                    |
+---------+-----------+-------------------------+
| 1       | Winston   | winston@leetcode.com    |
| 3       | Annabelle | bella-@leetcode.com     |
| 4       | Sally     | sally.come@leetcode.com |
+---------+-----------+-------------------------+
```
