## Invert Binary Tree

**Question:** Mirror/invert binary tree?

<!-- front -->

---

## Answer: Recursive Swap

### Solution
```python
def invertTree(root):
    if not root:
        return None
    
    # Swap children
    root.left, root.right = root.right, root.left
    
    # Recurse
    invertTree(root.left)
    invertTree(root.right)
    
    return root
```

### Iterative (BFS)
```python
from collections import deque

def invertTreeBFS(root):
    if not root:
        return root
    
    queue = deque([root])
    
    while queue:
        node = queue.popleft()
        
        # Swap children
        node.left, node.right = node.right, node.left
        
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)
    
    return root
```

### Visual: Inversion
```
Before:          After:
    4               4
   / \             / \
  2   7     →     7   2
 / \               / \
1   3             3   1
```

### ⚠️ Tricky Parts

#### 1. Order Doesn't Matter
```python
# Can swap before or after recursion
# Both work because we process all nodes

# Pre-order swap works fine
```

#### 2. Why Works In-Place?
```python
# We modify tree structure directly
# No need to create new tree
# Just swap pointers
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Recursive | O(n) | O(h) |
| Iterative | O(n) | O(w) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Not swapping | Swap before recursing |
| Returning too early | Return after full inversion |
| Missing base case | Handle null node |

<!-- back -->
