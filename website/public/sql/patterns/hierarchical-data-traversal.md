# Hierarchical Data Traversal (Recursive CTEs)

## Problem Description

Hierarchical Data Traversal uses Recursive Common Table Expressions (CTEs) to navigate tree and graph structures in SQL. This pattern enables querying self-referencing tables where rows contain foreign keys to other rows in the same table, such as organizational hierarchies, category trees, bill of materials, or file systems.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n) - visits each node once per level |
| Space Complexity | O(n) - stores intermediate results per recursion level |
| Input | Self-referencing table, starting node(s), recursion direction |
| Output | All reachable nodes with depth/level information |
| Approach | Anchor query → Recursive member → Union all results |

### When to Use

- **Organizational hierarchies**: Employee-manager relationships, reporting structures
- **Category trees**: Product categories with nested subcategories
- **Bill of materials**: Component-subcomponent relationships
- **File systems**: Directory and file structures
- **Network paths**: Finding all connected nodes in a graph
- **Ancestor/descendant queries**: Finding all parents or all children of a node
- **Level-based analysis**: Aggregating data by hierarchy depth
- **Path reconstruction**: Building breadcrumb trails or full paths

## Intuition

The key insight is **iterative expansion**. A recursive CTE works like a breadth-first search, starting from an anchor set of rows and repeatedly applying a recursive query to find related rows until no new rows are found.

The "aha!" moments:

1. **Anchor member**: The starting point - defines the initial set of rows (usually root nodes or specific starting points)
2. **Recursive member**: Joins the CTE to itself, expanding the result set one level at a time
3. **Termination**: Recursion stops automatically when the recursive member returns no new rows
4. **Level tracking**: Each iteration represents a level in the hierarchy - track this with a counter column
5. **UNION ALL**: Combines anchor and recursive results without deduplication (use UNION for dedup)

## Solution Approaches

### Approach 1: Basic Recursive CTE - Tree Traversal ✅ Recommended

#### Algorithm

1. Define the anchor member: SELECT starting nodes (usually WHERE parent_id IS NULL)
2. Define the recursive member: JOIN the CTE to the source table on parent-child relationship
3. Add level tracking: Increment a counter column in each recursion
4. Use UNION ALL to combine results
5. Query the CTE to get all nodes with their levels

#### Implementation

**Problem: Binary Tree Nodes (SQL-608)**

```sql
-- Classify nodes as Root, Inner, or Leaf in a binary tree
WITH RECURSIVE TreeTraversal AS (
    -- Anchor: start with the root node
    SELECT 
        id,
        p_id AS parent_id,
        1 AS level
    FROM Tree
    WHERE p_id IS NULL
    
    UNION ALL
    
    -- Recursive: find children of current nodes
    SELECT 
        t.id,
        t.p_id,
        tt.level + 1
    FROM Tree t
    INNER JOIN TreeTraversal tt ON t.p_id = tt.id
)
SELECT 
    id,
    CASE 
        WHEN parent_id IS NULL THEN 'Root'
        WHEN id NOT IN (SELECT DISTINCT p_id FROM Tree WHERE p_id IS NOT NULL) THEN 'Leaf'
        ELSE 'Inner'
    END AS type
FROM TreeTraversal
ORDER BY id;
```

**Basic Tree Traversal:**

```sql
-- Get all employees with their hierarchy level
WITH RECURSIVE EmployeeHierarchy AS (
    -- Anchor: top-level managers (no manager)
    SELECT 
        id,
        name,
        manager_id,
        0 AS level
    FROM Employees
    WHERE manager_id IS NULL
    
    UNION ALL
    
    -- Recursive: employees whose manager is in the hierarchy
    SELECT 
        e.id,
        e.name,
        e.manager_id,
        eh.level + 1
    FROM Employees e
    INNER JOIN EmployeeHierarchy eh ON e.manager_id = eh.id
)
SELECT * FROM EmployeeHierarchy
ORDER BY level, name;
```

**Basic Recursive CTE Structure:**

```sql
WITH RECURSIVE Hierarchy AS (
    -- Anchor member (starting point)
    SELECT 
        id,
        parent_id,
        name,
        0 AS level
    FROM Categories
    WHERE parent_id IS NULL
    
    UNION ALL
    
    -- Recursive member (finds next level)
    SELECT 
        c.id,
        c.parent_id,
        c.name,
        h.level + 1
    FROM Categories c
    INNER JOIN Hierarchy h ON c.parent_id = h.id
)
SELECT * FROM Hierarchy;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - visits each node once |
| Space | O(n) - stores result set |

### Approach 2: Finding All Descendants - Downward Traversal

Traverse from a specific node downward to find all children, grandchildren, and descendants.

#### Algorithm

1. Anchor: SELECT the specific starting node by ID
2. Recursive: JOIN to find all rows where parent_id matches current level
3. Track depth from starting node
4. Add filters to stop at specific depth if needed

#### Implementation

**Problem: All People Report to the Given Manager (SQL-1270)**

```sql
-- Find all employees who report to a specific manager (directly or indirectly)
WITH RECURSIVE ReportingChain AS (
    -- Anchor: start with the given manager
    SELECT 
        employee_id,
        employee_name,
        manager_id,
        0 AS depth
    FROM Employees
    WHERE employee_id = 1  -- Starting manager
    
    UNION ALL
    
    -- Recursive: find all direct reports
    SELECT 
        e.employee_id,
        e.employee_name,
        e.manager_id,
        rc.depth + 1
    FROM Employees e
    INNER JOIN ReportingChain rc ON e.manager_id = rc.employee_id
)
SELECT 
    employee_id,
    employee_name,
    depth
FROM ReportingChain
WHERE employee_id != 1  -- Exclude the starting manager
ORDER BY depth, employee_name;
```

**All Descendants with Subtree Info:**

```sql
-- Get all descendants and count of direct children for each
WITH RECURSIVE Descendants AS (
    SELECT 
        id,
        name,
        parent_id,
        0 AS depth,
        CAST(name AS VARCHAR(1000)) AS root_path
    FROM Categories
    WHERE id = 5  -- Starting category
    
    UNION ALL
    
    SELECT 
        c.id,
        c.name,
        c.parent_id,
        d.depth + 1,
        CAST(d.root_path || ' > ' || c.name AS VARCHAR(1000))
    FROM Categories c
    INNER JOIN Descendants d ON c.parent_id = d.id
)
SELECT 
    id,
    name,
    depth,
    root_path AS hierarchy_path
FROM Descendants
ORDER BY depth, name;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - visits each descendant once |
| Space | O(d) - where d is depth of subtree |

### Approach 3: Finding All Ancestors - Upward Traversal

Traverse from a specific node upward to find all parents, grandparents, and ancestors up to the root.

#### Algorithm

1. Anchor: SELECT the specific starting node
2. Recursive: JOIN to find the parent of current node (reverse of descendant traversal)
3. Continue until parent_id IS NULL (reached root)
4. Track distance from starting node

#### Implementation

**Problem: Find Root of N-Ary Tree (SQL-1557)**

```sql
-- Find the root by traversing up from any node
WITH RECURSIVE Ancestors AS (
    -- Anchor: start with a specific node
    SELECT 
        id,
        parent_id,
        0 AS distance
    FROM Tree
    WHERE id = @some_node_id
    
    UNION ALL
    
    -- Recursive: find parent
    SELECT 
        t.id,
        t.parent_id,
        a.distance + 1
    FROM Tree t
    INNER JOIN Ancestors a ON t.id = a.parent_id
)
SELECT id AS root_id
FROM Ancestors
WHERE parent_id IS NULL;
```

**Full Ancestor Chain:**

```sql
-- Get complete chain from node to root
WITH RECURSIVE AncestorChain AS (
    SELECT 
        e.id,
        e.name,
        e.manager_id,
        0 AS steps_from_start,
        CAST(e.name AS VARCHAR(1000)) AS path
    FROM Employees e
    WHERE e.id = 42  -- Starting employee
    
    UNION ALL
    
    SELECT 
        e.id,
        e.name,
        e.manager_id,
        ac.steps_from_start + 1,
        CAST(e.name || ' > ' || ac.path AS VARCHAR(1000))
    FROM Employees e
    INNER JOIN AncestorChain ac ON e.id = ac.manager_id
)
SELECT 
    id,
    name,
    steps_from_start,
    path AS reporting_chain
FROM AncestorChain
ORDER BY steps_from_start DESC;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(h) - where h is height from node to root |
| Space | O(h) - stores ancestor chain |

### Approach 4: Path Construction - Building Paths Through Hierarchy

Construct full paths or breadcrumbs by accumulating names/IDs through the recursion.

#### Algorithm

1. Anchor: Start with root, initialize path with root name
2. Recursive: Append current node name to parent's path
3. Use string concatenation to build breadcrumb
4. Handle path length limits based on database

#### Implementation

**Problem: Department Top Three Salaries (SQL-185)**

```sql
-- Build organization paths for ranking
WITH RECURSIVE OrgPaths AS (
    SELECT 
        id,
        name,
        parent_id,
        name AS full_path,
        1 AS depth
    FROM Departments
    WHERE parent_id IS NULL
    
    UNION ALL
    
    SELECT 
        d.id,
        d.name,
        d.parent_id,
        op.full_path || ' > ' || d.name,
        op.depth + 1
    FROM Departments d
    INNER JOIN OrgPaths op ON d.parent_id = op.id
)
SELECT 
    full_path,
    name AS department,
    depth
FROM OrgPaths
ORDER BY full_path;
```

**Breadcrumb Path Construction:**

```sql
-- Build category breadcrumbs for e-commerce
WITH RECURSIVE CategoryPath AS (
    SELECT 
        id,
        name,
        parent_id,
        CAST(name AS VARCHAR(500)) AS breadcrumb,
        1 AS level
    FROM ProductCategories
    WHERE parent_id IS NULL
    
    UNION ALL
    
    SELECT 
        c.id,
        c.name,
        c.parent_id,
        CAST(cp.breadcrumb || ' > ' || c.name AS VARCHAR(500)),
        cp.level + 1
    FROM ProductCategories c
    INNER JOIN CategoryPath cp ON c.parent_id = cp.id
)
SELECT 
    id,
    name,
    breadcrumb,
    level
FROM CategoryPath
ORDER BY breadcrumb;
```

**Path with Root-to-Node Direction:**

```sql
-- Alternative: build paths starting from nodes going up
WITH RECURSIVE UpwardPaths AS (
    SELECT 
        id,
        name,
        parent_id,
        CAST(name AS VARCHAR(500)) AS path,
        0 AS depth
    FROM Categories
    
    UNION ALL
    
    SELECT 
        up.id,
        up.name,
        c.parent_id,
        CAST(c.name || ' > ' || up.path AS VARCHAR(500)),
        up.depth + 1
    FROM Categories c
    INNER JOIN UpwardPaths up ON c.id = up.parent_id
    WHERE c.parent_id IS NOT NULL
)
SELECT 
    id,
    name,
    path AS full_path,
    depth
FROM UpwardPaths
WHERE parent_id IS NULL  -- Only complete paths
ORDER BY path;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × L) - where L is average path length |
| Space | O(n × L) - storing concatenated strings |

## Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| Basic Recursive CTE | O(n) | O(n) | **Recommended** - general tree traversal |
| Downward Traversal | O(n) | O(d) | Finding descendants, subtrees |
| Upward Traversal | O(h) | O(h) | Finding ancestors, root detection |
| Path Construction | O(n × L) | O(n × L) | Breadcrumbs, full paths |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| Binary Tree Nodes | 608 | Medium | Classify nodes as Root, Inner, or Leaf |
| Find Root of N-Ary Tree | 1557 | Medium | Identify root by following parent pointers |
| All People Report to Given Manager | 1270 | Medium | Find all direct and indirect reports |
| Employees With Missing Information | 1965 | Easy | Cross-check employee and salary tables |
| Department Top Three Salaries | 185 | Hard | Complex ranking with self-joins and windows |
| Nth Highest Salary | 177 | Medium | Recursive ranking patterns |
| Tree Node | 608 | Medium | Tree structure classification |

## Key Takeaways

- **Anchor sets the starting point**: Usually root nodes (parent IS NULL) or specific nodes
- **Recursive member joins to CTE**: The CTE references itself in the FROM clause
- **Always include a termination condition**: Usually parent_id IS NULL or no matching rows
- **Track levels with a counter**: Essential for filtering by depth and understanding hierarchy
- **UNION ALL vs UNION**: ALL preserves duplicates if multiple paths exist; UNION removes them
- **Mind the recursion limit**: Most databases have max_recursion_depth settings
- **Indexes matter**: Index the parent_id/child_id columns for performance

## Common Pitfalls

1. **Infinite recursion**: Missing termination condition or circular references cause endless loops
2. **Wrong join direction**: Confusing parent-to-child vs child-to-parent in the recursive join
3. **Not checking for cycles**: In graphs with cycles, recursive CTEs may loop infinitely
4. **Level tracking errors**: Forgetting to increment the level counter in recursive member
5. **String length limits**: Path concatenation can exceed column limits in deep hierarchies
6. **Performance on deep trees**: Very deep hierarchies (>100 levels) may hit recursion limits
7. **Missing RECURSIVE keyword**: Some databases (MySQL 8+, PostgreSQL) require it; SQL Server uses different syntax

## Recursive CTE Syntax Reference

| Database | Syntax | Notes |
|----------|--------|-------|
| MySQL 8+ | `WITH RECURSIVE cte AS (...)` | Requires RECURSIVE keyword |
| PostgreSQL | `WITH RECURSIVE cte AS (...)` | Excellent recursive support |
| SQL Server | `WITH cte AS (...)` | No RECURSIVE keyword needed |
| Oracle | `WITH cte AS (...)` | Use START WITH / CONNECT BY alternative |
| SQLite | `WITH RECURSIVE cte AS (...)` | Limited but functional |

## Pattern Source

[Hierarchical Data Traversal](sql/hierarchical-data-traversal.md)
