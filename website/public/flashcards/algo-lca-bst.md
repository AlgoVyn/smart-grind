## LCA in BST vs Binary Tree

**Question:** What's the time complexity difference and why?

<!-- front -->

---

## Lowest Common Ancestor (LCA)

### Complexity Comparison
| Tree Type | Time | Space | Reason |
|-----------|------|-------|--------|
| **BST** | O(h) | O(h) or O(1) | Use BST property |
| **Binary Tree** | O(n) | O(h) | Must traverse all |

### BST Property Advantage
```python
def lca_bst(root, p, q):
    if p.val < root.val > q.val:
        return lca_bst(root.left, p, q)
    if p.val > root.val < q.val:
        return lca_bst(root.right, p, q)
    return root  # p <= root <= q
```

### 💡 Key Insight
In BST: if `p <= root <= q`, then `root` is the LCA.

### Why BST is Faster?
- **BST:** Eliminate half the tree at each step (like binary search)
- **Binary Tree:** Must check all nodes to find both p and q

### Iterative BST (O(1) space)
```python
def lca_bst_iterative(root, p, q):
    while root:
        if p.val < root.val > q.val:
            root = root.left
        elif p.val > root.val < q.val:
            root = root.right
        else:
            return root
```

<!-- back -->
