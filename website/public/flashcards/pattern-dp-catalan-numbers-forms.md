## Catalan Numbers: Problem Forms & Variations

What are the common variations and special forms of Catalan number problems?

<!-- front -->

---

### Form 1: Valid Parentheses (LeetCode 22)

**Problem:** Generate all valid combinations of n pairs of parentheses.

**Structure:** `(` + left + `)` + right

```python
def generate_parentheses(n):
    if n == 0: return ['']
    result = []
    for i in range(n):
        left = generate_parentheses(i)
        right = generate_parentheses(n - 1 - i)
        for l in left:
            for r in right:
                result.append(f'({l}){r}')
    return result

# Count only: O(n²) DP
def count_parentheses(n):
    return catalan_dp(n)
```

---

### Form 2: Unique Binary Search Trees (LeetCode 96)

**Problem:** Count structurally unique BSTs with n nodes.

**Structure:** root + left_subtree + right_subtree

```python
def num_trees(n):
    dp = [0] * (n + 1)
    dp[0] = dp[1] = 1
    
    for nodes in range(2, n + 1):
        for root in range(1, nodes + 1):
            left = dp[root - 1]           # nodes < root
            right = dp[nodes - root]       # nodes > root
            dp[nodes] += left * right
    
    return dp[n]
```

**Note:** Indices shifted because we count nodes, not pairs.

---

### Form 3: Different Ways to Add Parentheses (LeetCode 241)

**Problem:** Given expression, compute all results from different evaluation orders.

**Structure:** Split at each operator, combine results

```python
def diff_ways_to_compute(expression):
    # For each operator position, combine left and right results
    # Like: "2-1-1" → (2-1)-1 = 0 or 2-(1-1) = 2
    # Catalan structure: each split creates independent subproblems
    pass  # Implementation combines Catalan structure with operators
```

---

### Form 4: Polygon Triangulation

**Problem:** Count ways to triangulate a convex polygon with n+2 sides.

**Structure:** Pick a triangle, splits polygon into two smaller polygons

| n (sides) | n-2 (triangles) | Triangulations |
|-----------|-----------------|----------------|
| 3 | 1 | 1 |
| 4 | 2 | 2 |
| 5 | 3 | 5 |
| 6 | 4 | 14 |

**Result:** C(n-2) where n is number of sides

---

### Form 5: Dyck Paths

**Problem:** Count lattice paths from (0,0) to (n,n) that never go above diagonal.

**Structure:** First return to diagonal splits path

```
Valid:        Invalid:
    _ _       _ _
   |     |    _|   |  (crosses diagonal)
  _|     |   |     |
_|       |___|     |___
```

**Result:** C(n) paths

---

### Form Variations Summary

| Problem | Input | Catalan Index | Modification |
|---------|-------|---------------|--------------|
| Parentheses | n pairs | C(n) | Direct |
| Unique BSTs | n nodes | C(n) | Direct |
| Triangulation | n-gon | C(n-2) | Shift by 2 |
| Dyck Paths | n×n grid | C(n) | Direct |
| Mountain Ranges | n upstrokes | C(n) | Direct |

---

### Extended: Unique BSTs II (LeetCode 95)

**Variation:** Actually generate all unique BST structures, not just count.

```python
# Returns list of TreeNode roots
def generate_trees(n):
    if n == 0: return [None]
    
    def generate(start, end):
        if start > end: return [None]
        
        trees = []
        for root_val in range(start, end + 1):
            left_trees = generate(start, root_val - 1)
            right_trees = generate(root_val + 1, end)
            
            for left in left_trees:
                for right in right_trees:
                    root = TreeNode(root_val)
                    root.left = left
                    root.right = right
                    trees.append(root)
        return trees
    
    return generate(1, n)
```

<!-- back -->
