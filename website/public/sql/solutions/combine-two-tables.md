# 175. Combine Two Tables

## Problem

Write a solution to report the first name, last name, city, and state of each person in the Person table. If the address of a person is not present in the Address table, report null instead.

### Schema

**Person Table:**
| Column Name | Type    | Description |
|-------------|---------|-------------|
| personId    | int     | Primary Key |
| lastName    | varchar | Person's last name |
| firstName   | varchar | Person's first name |

**Address Table:**
| Column Name | Type    | Description |
|-------------|---------|-------------|
| addressId   | int     | Primary Key |
| personId    | int     | Foreign Key to Person |
| city        | varchar | City name |
| state       | varchar | State name |

### Requirements

- Return: firstName, lastName, city, state
- All persons must appear in the result (even those without addresses)
- city and state should be NULL for persons without addresses
- Table order: Person table first, Address table optional

## Approaches

### Approach 1: LEFT JOIN (Recommended)

Use LEFT JOIN to preserve all rows from the Person table while optionally including matching addresses.

#### Algorithm

1. Select from Person as the primary (left) table
2. LEFT JOIN with Address on personId
3. All Person rows are preserved; Address columns are NULL when no match exists

#### Implementation

```sql
SELECT 
    p.firstName,
    p.lastName,
    a.city,
    a.state
FROM Person p
LEFT JOIN Address a ON p.personId = a.personId;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × m) worst case, O(n log n) with index |
| Space | O(n) - all rows from Person table |

### Approach 2: Subquery with COALESCE

Use correlated subqueries with COALESCE to handle missing addresses.

#### Algorithm

1. Select from Person table
2. Use subqueries to get city and state from Address
3. COALESCE returns NULL if subquery returns no match

#### Implementation

```sql
SELECT 
    firstName,
    lastName,
    (SELECT city FROM Address a WHERE a.personId = p.personId) AS city,
    (SELECT state FROM Address a WHERE a.personId = p.personId) AS state
FROM Person p;
```

**Note:** This approach returns NULL when subquery finds no match, but if a person has multiple addresses, this will return an arbitrary one (or error in strict SQL modes).

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × m) - subquery executed for each row |
| Space | O(n) - result set size |

### Approach 3: RIGHT JOIN (Alternative Syntax)

Functionally equivalent to LEFT JOIN with tables swapped.

#### Implementation

```sql
SELECT 
    p.firstName,
    p.lastName,
    a.city,
    a.state
FROM Address a
RIGHT JOIN Person p ON a.personId = p.personId;
```

## Solution Analysis

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| LEFT JOIN | O(n log n) | O(n) | Clean, efficient, standard | None |
| Subquery | O(n × m) | O(n) | Easy to understand | Slower, multiple table scans |
| RIGHT JOIN | O(n log n) | O(n) | Equivalent to LEFT JOIN | Less intuitive reading order |

**Recommended:** LEFT JOIN (Approach 1) - most readable and efficient, preserves all persons as required.

## Final Solution

```sql
SELECT 
    p.firstName,
    p.lastName,
    a.city,
    a.state
FROM Person p
LEFT JOIN Address a ON p.personId = a.personId;
```

### Key Concepts

- **LEFT JOIN**: Preserves all rows from the left table (Person)
- **NULL handling**: Non-matching addresses produce NULL for city and state
- **Join key**: personId connects the two tables
