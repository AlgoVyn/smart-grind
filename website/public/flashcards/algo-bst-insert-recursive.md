## BST Insert - Recursive vs Iterative

**Question:** Compare recursive and iterative approaches for BST insertion.

<!-- front -->

---

## BST Insert: Two Approaches

### Recursive Approach
```python
def insert(root, val):
    # Base case: found insertion point
    if not root:
        return TreeNode(val)
    
    # Recursively find position
    if val < root.val:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)
    
    return root
```

### Iterative Approach
```python
def insert_iter(root, val):
    if not root:
        return TreeNode(val)
    
    current = root
    while True:
        if val < current.val:
            if not current.left:
                current.left = TreeNode(val)
                break
            current = current.left
        else:
            if not current.right:
                current.right = TreeNode(val)
                break
            current = current.right
    
    return root
```

### Comparison
| Aspect | Recursive | Iterative |
|--------|-----------|-----------|
| Space | O(h) | O(1) |
| Code | Cleaner | More explicit |
| Stack | Risk overflow | Safe |

### ⚠️ Important
Both assume **no duplicates** (or handle them consistently).

<!-- back -->
