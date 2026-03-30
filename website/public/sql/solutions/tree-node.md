# 608. Tree Node

## Problem

Classify each node in the Tree table as one of the following types:
- **Root**: Node with no parent (PId is NULL)
- **Inner**: Node that is neither Root nor Leaf (has parent and has children)
- **Leaf**: Node with no children (not a parent to any other node)

### Schema

**Tree Table:**
| Column Name | Type    | Description |
|-------------|---------|-------------|
| Id          | int     | Primary Key, unique identifier for each node |
| PId         | int     | Parent Id, foreign key to Id (NULL for root nodes) |

### Requirements

- Return: Id, Type (Root/Inner/Leaf)
- Each node must be classified exactly once
- Root has PId IS NULL
- Leaf has no children (Id not present in PId column)
- Inner has PId NOT NULL AND Id exists in PId column

## Approaches

### Approach 1: CASE with IN Subquery (Recommended)

Use CASE with subqueries to check the conditions for each node type.

#### Algorithm

1. Check if PId IS NULL → Root
2. Check if Id is NOT IN (SELECT PId FROM Tree) → Leaf
3. Otherwise → Inner

#### Implementation

```sql
SELECT 
    Id,
    CASE 
        WHEN PId IS NULL THEN 'Root'
        WHEN Id NOT IN (SELECT PId FROM Tree WHERE PId IS NOT NULL) THEN 'Leaf'
        ELSE 'Inner'
    END AS Type
FROM Tree;
```

**Note:** The subquery filters out NULL PId values to avoid IN/NULL comparison issues.

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n²) worst case - subquery scanned for each row |
| Space | O(n) - result set size |

### Approach 2: LEFT JOIN with IS NULL Check

Use self LEFT JOIN to identify leaf nodes (nodes with no children have no match).

#### Algorithm

1. LEFT JOIN Tree with itself on Id = PId to find children
2. If PId IS NULL → Root
3. If JOIN returns no match (child.Id IS NULL) → Leaf
4. Otherwise → Inner

#### Implementation

```sql
SELECT 
    t.Id,
    CASE 
        WHEN t.PId IS NULL THEN 'Root'
        WHEN c.Id IS NULL THEN 'Leaf'
        ELSE 'Inner'
    END AS Type
FROM Tree t
LEFT JOIN Tree c ON t.Id = c.PId;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) with index - efficient join |
| Space | O(n) - result set size |

### Approach 3: Correlated Subquery with CASE

Use EXISTS correlated subquery to check for children.

#### Algorithm

1. Check if PId IS NULL → Root
2. Check if NOT EXISTS child with this PId → Leaf
3. Otherwise → Inner

#### Implementation

```sql
SELECT 
    t.Id,
    CASE 
        WHEN t.PId IS NULL THEN 'Root'
        WHEN NOT EXISTS (
            SELECT 1 FROM Tree c WHERE c.PId = t.Id
        ) THEN 'Leaf'
        ELSE 'Inner'
    END AS Type
FROM Tree t;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n²) worst case - correlated subquery |
| Space | O(n) - result set size |

## Solution Analysis

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| CASE with IN | O(n²) | O(n) | Simple, readable | Subquery performance on large data |
| LEFT JOIN | O(n log n) | O(n) | Efficient with index | Slightly more complex |
| EXISTS subquery | O(n²) | O(n) | Clear logic | Correlated subquery overhead |

**Recommended:** LEFT JOIN (Approach 2) - most efficient for large datasets with proper indexing.

## Final Solution

```sql
SELECT 
    t.Id,
    CASE 
        WHEN t.PId IS NULL THEN 'Root'
        WHEN c.Id IS NULL THEN 'Leaf'
        ELSE 'Inner'
    END AS Type
FROM Tree t
LEFT JOIN Tree c ON t.Id = c.PId;
```

### Key Concepts

- **Self JOIN**: Joining a table with itself to establish parent-child relationships
- **LEFT JOIN with NULL check**: Identifying leaf nodes by absence of children
- **CASE statement**: Conditional logic for node type classification
