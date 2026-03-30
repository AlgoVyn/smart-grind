# DISTINCT and Ordering

## Problem Description

The DISTINCT and Ordering pattern combines two fundamental SQL operations: removing duplicate values from result sets and sorting rows based on specified criteria. This pattern is essential for producing clean, organized output from database queries.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n log n) - sorting with duplicate elimination |
| Space Complexity | O(n) - for storing unique values during processing |
| Input | Table columns, optional sort criteria |
| Output | Unique values or unique row combinations, optionally sorted |
| Approach | Hash-based deduplication → Optional sorting |

### When to Use

- Removing duplicate values from result sets
- Finding unique values in a column (e.g., list of unique countries)
- Sorting query results for readable output
- Combining deduplication with ordering for reports
- Getting unique combinations across multiple columns
- Preparing data for aggregation or grouping operations

## Intuition

The key insight is **set uniqueness with ordering**. DISTINCT creates a set of unique values, while ORDER BY imposes a sequence on the results.

The "aha!" moments:

1. **DISTINCT operates on selected columns**: Only the columns in the SELECT list are considered for uniqueness
2. **ORDER BY position**: Can reference columns by position number (1, 2, 3) or name
3. **Sorting costs**: ORDER BY requires full result evaluation before returning rows
4. **DISTINCT before ORDER BY**: Duplicates are removed before sorting occurs
5. **NULL handling**: NULL values are considered equal in DISTINCT, sorting depends on database (usually first or last)

## Solution Approaches

### Approach 1: Basic DISTINCT - Remove Duplicates ✅ Recommended

#### Algorithm

1. Identify the column(s) with potential duplicates
2. Add DISTINCT keyword after SELECT
3. Specify the column to deduplicate

#### Implementation

**Problem: Delete Duplicate Emails (SQL-196)**

```sql
-- Find unique email addresses
SELECT DISTINCT email
FROM Person;

-- Alternative: GROUP BY for aggregation context
SELECT email
FROM Person
GROUP BY email;
```

**Problem: Find Unique Email Domains:**

```sql
-- Extract and find unique domains
SELECT DISTINCT SUBSTRING(email, LOCATE('@', email) + 1) AS domain
FROM Users;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - hash-based deduplication |
| Space | O(u) - u unique values stored |

### Approach 2: DISTINCT with Multiple Columns - Unique Combinations

Use DISTINCT across multiple columns to find unique combinations of values.

#### Implementation

**Problem: Unique Customer-Product Combinations:**

```sql
-- Find unique combinations of city and state
SELECT DISTINCT city, state
FROM Customers;
```

**Problem: Unique User Actions:**

```sql
-- Find distinct user-action combinations
SELECT DISTINCT user_id, action_type
FROM ActivityLog;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - hash-based on combined values |
| Space | O(c) - c unique combinations |

### Approach 3: ORDER BY Fundamentals - Sorting Results

#### Algorithm

1. Select the columns to retrieve
2. Add ORDER BY clause with column name(s)
3. Specify sort direction (ASC ascending, DESC descending)
4. Add secondary sort columns as needed

#### Implementation

**Problem: Find Customer Referee (SQL-584)**

```sql
-- Sort results by name
SELECT name
FROM Customer
WHERE referee_id != 2 OR referee_id IS NULL
ORDER BY name ASC;
```

**Problem: Sort by Multiple Columns:**

```sql
-- Primary sort by salary DESC, secondary by name ASC
SELECT name, salary, department_id
FROM Employee
ORDER BY salary DESC, name ASC;
```

**Problem: Sort by Column Position:**

```sql
-- Sort by first then second column
SELECT name, hire_date, salary
FROM Employee
ORDER BY 3 DESC, 2 ASC;  -- salary DESC, hire_date ASC
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - comparison-based sorting |
| Space | O(n) - for sorting buffer |

### Approach 4: Combined DISTINCT with ORDER BY

Combine both operations for organized, duplicate-free results.

#### Implementation

**Problem: Find Unique Sorted Values:**

```sql
-- Get unique sorted values
SELECT DISTINCT salary
FROM Employee
ORDER BY salary DESC;
```

**Problem: Customer With Maximum Referee (sql-586 - variation)**

```sql
-- Find unique customer names with ordering
SELECT DISTINCT name
FROM Customer
WHERE referee_id = 2
ORDER BY name;
```

**Problem: Sorted Unique Combinations:**

```sql
-- Unique department-location combinations, sorted
SELECT DISTINCT department_id, location
FROM Employees
ORDER BY department_id ASC, location ASC;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - deduplication + sorting |
| Space | O(n) - storing unique values for sort |

## Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| Basic DISTINCT | O(n) | O(u) | **Recommended** - simple deduplication |
| DISTINCT Multi-column | O(n) | O(c) | Unique combinations |
| ORDER BY only | O(n log n) | O(n) | Sorting existing unique data |
| DISTINCT + ORDER BY | O(n log n) | O(n) | Clean, organized output |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| Delete Duplicate Emails | 196 | Easy | Find and remove duplicate email addresses |
| Find Customer Referee | 584 | Easy | Filter and sort customer results |
| Customer Placing the Largest Number of Orders | 586 | Easy | Aggregation with ordering |

## Key Takeaways

- **DISTINCT applies to all selected columns**: Creates unique combinations across all columns in SELECT
- **ORDER BY after DISTINCT**: Sorting occurs after duplicate removal
- **Column position reference**: ORDER BY 1 sorts by first selected column
- **NULL behavior**: DISTINCT treats NULLs as equal; ORDER BY places NULLs first or last (database-specific)
- **Performance**: DISTINCT uses hash tables; ORDER BY requires full sort

## Common Pitfalls

1. Forgetting DISTINCT applies to the entire row, not just one column
2. Using DISTINCT when GROUP BY with aggregation is more appropriate
3. Ordering by a column not in the SELECT list (not allowed in some databases with DISTINCT)
4. Assuming sort order without explicit ORDER BY (results are unordered by default)
5. Large datasets: DISTINCT + ORDER BY can be memory-intensive; consider indexing

## Syntax Comparison

| Operation | Syntax | Result |
|-----------|--------|--------|
| No DISTINCT | `SELECT col FROM table` | All values including duplicates |
| Single Column DISTINCT | `SELECT DISTINCT col FROM table` | Unique values from one column |
| Multi-column DISTINCT | `SELECT DISTINCT col1, col2 FROM table` | Unique combinations |
| With ORDER BY | `SELECT DISTINCT col FROM table ORDER BY col` | Sorted unique values |

## Pattern Source

[DISTINCT and Ordering](sql/distinct-and-ordering.md)
