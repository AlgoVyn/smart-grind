# 1683. Invalid Tweets

## Problem

Write a solution to find the IDs of invalid tweets. The tweet is invalid if the number of characters used in the content of the tweet is strictly greater than 15.

### Schema

**Tweets Table:**
| Column Name | Type    | Description |
|-------------|---------|-------------|
| tweet_id    | int     | Primary Key |
| content     | varchar | Tweet content |

### Requirements

- Return: tweet_id of tweets with content length > 15 characters
- Content length is strictly greater than 15 (not equal)

## Approaches

### Approach 1: CHAR_LENGTH Function (Recommended)

Use CHAR_LENGTH() function to count the number of characters in the content string.

#### Algorithm

1. Select tweet_id from Tweets table
2. Filter where CHAR_LENGTH(content) > 15
3. Returns only tweets exceeding 15 characters

#### Implementation

```sql
SELECT tweet_id
FROM Tweets
WHERE CHAR_LENGTH(content) > 15;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) where n is number of rows |
| Space | O(k) where k is number of invalid tweets |

**Note:** CHAR_LENGTH() counts characters (multi-byte safe). In SQL Server, use LEN() instead.

### Approach 2: LENGTH Function

Use LENGTH() function which returns the number of bytes. For ASCII characters, this is equivalent to character count.

#### Algorithm

1. Select tweet_id from Tweets table
2. Filter where LENGTH(content) > 15
3. Returns tweets with byte length > 15

#### Implementation

```sql
SELECT tweet_id
FROM Tweets
WHERE LENGTH(content) > 15;
```

#### Considerations

- For single-byte character sets (ASCII, Latin1), LENGTH = CHAR_LENGTH
- For multi-byte characters (UTF-8), LENGTH may be greater than CHAR_LENGTH
- Use CHAR_LENGTH for accurate character counting with unicode

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) |
| Space | O(k) |

### Approach 3: DATALENGTH (SQL Server)

For SQL Server, DATALENGTH returns the number of bytes used to represent the expression.

#### Implementation

```sql
SELECT tweet_id
FROM Tweets
WHERE DATALENGTH(content) > 15;
```

**Note:** DATALENGTH includes trailing spaces and returns number of bytes, not characters. For NVARCHAR (Unicode), divide by 2 to get character count.

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) |
| Space | O(k) |

## Solution Analysis

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| CHAR_LENGTH | O(n) | O(k) | Accurate character count, multi-byte safe | Not available in all databases |
| LENGTH | O(n) | O(k) | Widely supported | Byte count, not character count |
| DATALENGTH | O(n) | O(k) | SQL Server compatible | Byte-based, needs adjustment for Unicode |

**Recommended:** CHAR_LENGTH() for accurate character counting across all character sets. Use LENGTH() for simple ASCII-only data.

## Final Solution

```sql
SELECT tweet_id
FROM Tweets
WHERE CHAR_LENGTH(content) > 15;
```

### Key Concepts

- **CHAR_LENGTH()**: Returns the number of characters in a string
- **LENGTH()**: Returns the number of bytes in a string
- **String length filtering**: Using length functions in WHERE clauses
- **Character encoding awareness**: Multi-byte vs single-byte character sets

### Database-Specific Functions

| Database | Character Count | Byte Count |
|----------|-----------------|------------|
| MySQL | CHAR_LENGTH() | LENGTH() |
| PostgreSQL | CHAR_LENGTH() / CHARACTER_LENGTH() | LENGTH() / OCTET_LENGTH() |
| SQL Server | LEN() | DATALENGTH() |
| Oracle | LENGTH() | LENGTHB() |
| SQLite | LENGTH() | LENGTH() |
