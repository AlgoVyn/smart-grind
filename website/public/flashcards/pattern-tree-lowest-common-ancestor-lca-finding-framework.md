## LCA Finding: Framework

What is the standard recursive DFS framework for LCA finding?

<!-- front -->

---

### Recursive DFS LCA Framework

```python
def lowest_common_ancestor(root, p, q):
    """
    Standard recursive DFS for LCA in binary tree.
    
    Key insight: LCA is the node where p and q are in different subtrees,
    or the node is one of p or q itself.
    """
    # Base case: null node OR found p OR found q
    if not root or root == p or root == q:
        return root
    
    # Recursively search left and right subtrees
    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)
    
    # If both sides found a target, current node is LCA
    if left and right:
        return root
    
    # Otherwise, return the non-null side
    return left if left else right
```

---

### Algorithm Flow

```
            A
          /   \
         B     C
        / \     \
       D   E     F

For p=D, q=E:
  - At node B: left=D, right=E → both non-null → B is LCA
  - At node A: left=B, right=None → return B

For p=D, q=F:
  - At node B: left=D, right=None → return D
  - At node C: left=None, right=F → return F  
  - At node A: left=D, right=F → both non-null → A is LCA
```

---

### Framework Components

| Component | Purpose |
|-----------|---------|
| Base case | Handle null, found p, or found q |
| Left recursion | Search for targets in left subtree |
| Right recursion | Search for targets in right subtree |
| Combine results | Return LCA based on subtree results |

### Decision Table

| left | right | Result |
|------|-------|--------|
| null | null | null (neither found) |
| value | null | left (only left has target) |
| null | value | right (only right has target) |
| value | value | root (current node is LCA) |

### Complexity

| Complexity | Value |
|------------|-------|
| Time | O(n) - visit each node once |
| Space | O(h) - recursion stack depth |

<!-- back -->
