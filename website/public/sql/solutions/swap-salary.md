# 627. Swap Salary

## Problem

Write a solution to swap all 'f' and 'm' values in the sex column. 'f' becomes 'm' and 'm' becomes 'f'.

### Schema

**Salary Table:**
| Column Name | Type    | Description |
|-------------|---------|-------------|
| id          | int     | Primary Key |
| name        | varchar | Employee name |
| sex         | ENUM('m','f') | Employee sex |
| salary      | int     | Employee salary |

### Requirements

- Update the sex column in place (no SELECT query needed)
- All 'f' values become 'm' and all 'm' values become 'f'
- Use single UPDATE statement for efficiency

## Approaches

### Approach 1: CASE Statement (Recommended - Universal)

Use a CASE expression to conditionally swap the sex values. This works across all SQL databases.

#### Algorithm

1. Update the Salary table
2. Set sex to 'f' when current sex is 'm', otherwise set to 'm'
3. CASE handles the conditional logic

#### Implementation

```sql
UPDATE Salary
SET sex = CASE 
    WHEN sex = 'm' THEN 'f'
    ELSE 'm'
END;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - single pass through all rows |
| Space | O(1) - in-place update, no extra storage |

### Approach 2: IF Function (MySQL Specific)

MySQL's IF() function provides a more concise syntax for simple conditional swaps.

#### Algorithm

1. Update the Salary table
2. Use IF() to return 'f' if sex is 'm', otherwise return 'm'
3. Single expression handles both directions

#### Implementation

```sql
UPDATE Salary
SET sex = IF(sex = 'm', 'f', 'm');
```

**Note:** This syntax is MySQL-specific and won't work in PostgreSQL, SQL Server, or Oracle.

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - single pass through all rows |
| Space | O(1) - in-place update |

### Approach 3: ASCII Manipulation (Clever Trick)

Exploit ASCII values where 'f' = 102 and 'm' = 109. The difference is 7, so we can toggle between them.

#### Algorithm

1. Convert sex to ASCII value using ASCII()
2. XOR-like operation: add 7 if 'f', subtract 7 if 'm'
3. Convert back to character using CHAR()

#### Implementation

```sql
-- MySQL syntax
UPDATE Salary
SET sex = CHAR(ASCII(sex) ^ 11);

-- Alternative using ASCII math
UPDATE Salary
SET sex = CHAR(ASCII('f') + ASCII('m') - ASCII(sex));
```

**Explanation:**
- XOR with 11 (binary 1011) flips bits to transform 102 ('f') to 109 ('m') and vice versa
- OR: ASCII('f') + ASCII('m') - ASCII(sex) = 211 - ASCII(sex), which gives 109 when sex='f' and 102 when sex='m'

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - single pass through all rows |
| Space | O(1) - in-place update |

### Approach 4: REPLACE Twice (Safe but Inefficient)

Use a temporary placeholder to avoid intermediate states affecting the swap.

#### Algorithm

1. First pass: Replace 'f' with a temporary value (e.g., 'x')
2. Second pass: Replace 'm' with 'f'
3. Third pass: Replace 'x' with 'm'

#### Implementation

```sql
-- Not recommended but demonstrates placeholder technique
UPDATE Salary SET sex = 'x' WHERE sex = 'f';
UPDATE Salary SET sex = 'f' WHERE sex = 'm';
UPDATE Salary SET sex = 'm' WHERE sex = 'x';
```

**Note:** Requires three separate UPDATE statements. Useful when you need to avoid using CASE or IF.

## Solution Analysis

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| CASE | O(n) | O(1) | Universal, readable, standard SQL | Slightly verbose |
| IF | O(n) | O(1) | Concise, very readable | MySQL only |
| ASCII | O(n) | O(1) | Clever, single expression | Obscure, hard to maintain |
| REPLACE | O(3n) | O(1) | Simple logic | Multiple statements, slower |

**Recommended:** CASE statement (Approach 1) - most portable and clear. Use IF (Approach 2) for MySQL if you prefer brevity.

## Final Solution

```sql
UPDATE Salary
SET sex = CASE 
    WHEN sex = 'm' THEN 'f'
    ELSE 'm'
END;
```

### Key Concepts

- **UPDATE statement**: Modifies existing rows in place
- **CASE expression**: Conditional logic for SQL values
- **Single-pass swap**: CASE handles both directions simultaneously
- **No temporary storage**: Direct in-place value transformation
