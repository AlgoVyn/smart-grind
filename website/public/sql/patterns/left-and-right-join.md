# LEFT and RIGHT JOIN

## Problem Description

The LEFT JOIN and RIGHT JOIN patterns (collectively OUTER JOINs) preserve all records from one table while optionally including matching records from another table. These are essential when you need to retain all rows from a primary table regardless of whether matches exist in a secondary table.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n × m) - nested loop worst case, O(n log n) - with index |
| Space Complexity | O(n) - all rows from preserved table |
| Input | Two tables, join condition, direction specification |
| Output | All rows from preserved table + matching rows from other table |
| Approach | Preserve → Match → Fill NULLs for non-matches |

### When to Use

- **Preserving all records**: When you need every row from the primary table regardless of matches
- **Finding orphans**: Identifying records in one table with no corresponding match in another
- **Conditional matching**: Including optional related data (e.g., addresses for users)
- **Master-detail reports**: Parent records with optional child data
- **Data completeness checks**: Finding missing relationships or incomplete data

## Intuition

The key insight is **preservation over intersection**. While INNER JOIN keeps only matches, OUTER JOINs preserve all records from one side and fill in NULL for non-matching columns.

The "aha!" moments:

1. **NULL for non-matches**: When no match exists, columns from the non-preserved table become NULL
2. **LEFT vs RIGHT preference**: LEFT JOIN is more intuitive (read left-to-right); RIGHT JOIN is rarely needed
3. **Full outer join**: Combining LEFT and RIGHT gives you all records from both tables
4. **Finding non-matches**: WHERE right_table.id IS NULL finds records with no match
5. **Direction matters**: The table order determines which rows are preserved

## Solution Approaches

### Approach 1: LEFT JOIN - Preserve Left Table Records ✅ Recommended

#### Algorithm

1. Identify the primary table (preserved table - left side)
2. Identify the related table (optional matches - right side)
3. Determine the join key connecting the tables
4. Write LEFT JOIN with ON clause
5. All left table rows appear; right table columns are NULL when no match

#### Implementation

**Problem: Combine Two Tables - Include All Persons (SQL-175)**

```sql
-- Retrieve all persons with their city and state (if address exists)
SELECT 
    p.firstName,
    p.lastName,
    a.city,
    a.state
FROM Person p
LEFT JOIN Address a ON p.personId = a.personId;
```

**Result**: All persons appear; city/state are NULL for persons without addresses.

**Problem: Department Highest Salary (SQL-184)**

```sql
-- Find highest salary in each department with employee details
SELECT 
    d.name AS Department,
    e.name AS Employee,
    e.salary AS Salary
FROM Department d
LEFT JOIN (
    SELECT *, 
           DENSE_RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC) AS rnk
    FROM Employee
) e ON d.id = e.departmentId AND e.rnk = 1;
```

**Problem: Department Top Three Salaries (SQL-185)**

```sql
-- Find top 3 salaries per department
SELECT 
    d.name AS Department,
    e.name AS Employee,
    e.salary AS Salary
FROM Department d
LEFT JOIN (
    SELECT *, 
           DENSE_RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC) AS rnk
    FROM Employee
) e ON d.id = e.departmentId AND e.rnk <= 3
WHERE e.name IS NOT NULL;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × m) worst case, O(n log n) with proper indexing |
| Space | O(n) - all rows from left table preserved |

### Approach 2: Finding Non-Matching Records - WHERE ... IS NULL

Use LEFT JOIN with a WHERE clause filtering for NULL values in the right table to find "orphan" records.

#### Algorithm

1. Perform LEFT JOIN from primary to related table
2. Add WHERE clause checking IS NULL on right table's key column
3. Result contains only records from left table with no match in right table

#### Implementation

**Find Persons Without Addresses:**

```sql
-- Identify all persons who have no address on file
SELECT 
    p.firstName,
    p.lastName,
    p.personId
FROM Person p
LEFT JOIN Address a ON p.personId = a.personId
WHERE a.personId IS NULL;
```

**Find Departments Without Employees:**

```sql
-- Identify empty departments
SELECT 
    d.id,
    d.name AS Department
FROM Department d
LEFT JOIN Employee e ON d.id = e.departmentId
WHERE e.id IS NULL;
```

**Find Products Never Ordered:**

```sql
-- Identify products with no sales
SELECT 
    p.product_id,
    p.product_name
FROM Products p
LEFT JOIN Orders o ON p.product_id = o.product_id
WHERE o.order_id IS NULL;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × m) - same as LEFT JOIN with additional filter |
| Space | O(k) - only non-matching rows returned |

### Approach 3: RIGHT JOIN - Preserve Right Table Records

RIGHT JOIN preserves all records from the right table. Functionally equivalent to swapping table positions in a LEFT JOIN.

#### Algorithm

1. Place the preserved table on the RIGHT side of the join
2. All right table rows appear; left table columns are NULL when no match
3. Can always be rewritten as LEFT JOIN by swapping table order

#### Implementation

**Alternative to LEFT JOIN (less common):**

```sql
-- RIGHT JOIN version (equivalent to LEFT JOIN above)
SELECT 
    a.city,
    a.state,
    p.firstName,
    p.lastName
FROM Address a
RIGHT JOIN Person p ON a.personId = p.personId;

-- Equivalent LEFT JOIN (preferred style)
SELECT 
    p.firstName,
    p.lastName,
    a.city,
    a.state
FROM Person p
LEFT JOIN Address a ON p.personId = a.personId;
```

**When RIGHT JOIN might appear:**

```sql
-- Preserving all reference data from lookup table
SELECT 
    d.name AS Department,
    e.name AS Employee
FROM Employee e
RIGHT JOIN Department d ON e.departmentId = d.id;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × m) - same as LEFT JOIN |
| Space | O(m) - all rows from right table preserved |

### Approach 4: Multiple LEFT JOINs - Joining Several Tables

Chain multiple LEFT JOINs when you need optional data from multiple related tables.

#### Algorithm

1. Start with primary table
2. Add LEFT JOINs for each optional related table
3. Each join preserves all rows from the previous result
4. Handle NULLs appropriately in SELECT and WHERE clauses

#### Implementation

**Three-Way LEFT JOIN:**

```sql
-- Customers with optional orders and optional shipping addresses
SELECT 
    c.customer_name,
    o.order_id,
    o.order_date,
    s.shipping_city,
    s.shipping_state
FROM Customers c
LEFT JOIN Orders o ON c.customer_id = o.customer_id
LEFT JOIN Shipping s ON o.order_id = s.order_id;
```

**Multiple LEFT JOINs with Aggregation:**

```sql
-- Department summary with optional employee and manager counts
SELECT 
    d.name AS Department,
    COUNT(DISTINCT e.id) AS EmployeeCount,
    COUNT(DISTINCT m.id) AS ManagerCount
FROM Department d
LEFT JOIN Employee e ON d.id = e.departmentId
LEFT JOIN Employee m ON d.id = m.departmentId AND m.is_manager = 1
GROUP BY d.id, d.name;
```

**Complex Multi-Table with Conditions:**

```sql
-- Get all employees with optional department, manager, and project info
SELECT 
    e.name AS Employee,
    d.name AS Department,
    mgr.name AS Manager,
    p.project_name AS CurrentProject
FROM Employee e
LEFT JOIN Department d ON e.departmentId = d.id
LEFT JOIN Employee mgr ON e.managerId = mgr.id
LEFT JOIN Projects p ON e.id = p.lead_employee_id AND p.status = 'Active';
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × m × p) - grows with each additional table |
| Space | O(n) - preserved from initial left table |

## Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| LEFT JOIN | O(n × m) | O(n) | **Recommended** - preserving primary table |
| Non-Matching (WHERE IS NULL) | O(n × m) | O(k) | Finding orphans/missing data |
| RIGHT JOIN | O(n × m) | O(m) | Rarely used - prefer LEFT JOIN |
| Multiple LEFT JOINs | O(n × m × p) | O(n) | Multiple optional relationships |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| Combine Two Tables | 175 | Easy | LEFT JOIN to include all persons |
| Department Highest Salary | 184 | Medium | LEFT JOIN with ranking subquery |
| Department Top Three Salaries | 185 | Hard | LEFT JOIN with conditional ranking |

## Key Takeaways

- **Preservation priority**: OUTER JOINs keep all rows from one table regardless of matches
- **LEFT vs RIGHT**: Prefer LEFT JOIN for readability; RIGHT JOIN is functionally equivalent but less intuitive
- **NULL indicators**: Non-matching rows produce NULL values in columns from the optional table
- **Orphan detection**: LEFT JOIN + WHERE ... IS NULL finds records with no matches
- **Chain freely**: Multiple LEFT JOINs preserve the original table throughout the chain

## Common Pitfalls

1. **Forgetting NULL handling**: Not accounting for NULL values from non-matching rows in calculations
2. **Filtering in wrong clause**: Putting filter conditions in ON clause vs WHERE clause changes results
   - `ON ... AND condition` - applies before preservation
   - `WHERE condition` - applies after preservation
3. **Assuming INNER JOIN behavior**: Expecting only matching rows when using LEFT JOIN
4. **Overusing RIGHT JOIN**: Using RIGHT JOIN when swapping table order with LEFT JOIN is clearer
5. **NULL in aggregations**: COUNT(column) excludes NULLs; COUNT(*) includes all rows

## Join Type Comparison

| Join Type | Matching Rows | Non-Matching (Left) | Non-Matching (Right) | Use Case |
|-----------|-------------|---------------------|----------------------|----------|
| INNER JOIN | Included | Excluded | Excluded | Only when match exists |
| LEFT JOIN | Included | Included (NULL) | Excluded | **Recommended** - keep all left rows |
| RIGHT JOIN | Included | Excluded | Included (NULL) | Rarely used |
| FULL OUTER JOIN | Included | Included (NULL) | Included (NULL) | All data from both tables |

## Pattern Source

[LEFT and RIGHT JOIN](sql/left-and-right-join.md)
