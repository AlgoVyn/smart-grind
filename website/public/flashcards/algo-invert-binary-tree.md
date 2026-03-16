## Invert Binary Tree

**Question:** Mirror/invert a binary tree?

<!-- front -->

---

## Answer: DFS or BFS

### Solution: DFS (Recursive)
```python
def invertTree(root):
    if not root:
        return None
    
    # Swap children
    root.left, root.right = root.right, root.left
    
    # Recurse on both
    invertTree(root.left)
    invertTree(root.right)
    
    return root
```

### Solution: BFS (Iterative)
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
        
        # Add children to queue
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)
    
    return root
```

### Visual: Tree Inversion
```
Before:           After:
    1                 1
   / \               / \
  2   3     →       3   2
 / \               / \
4   5             5   4

Level order swap:
- Swap 2 and 3
- Swap 4 and 5
```

### ⚠️ Tricky Parts

#### 1. Order Doesn't Matter
```python
# Can do:
# - Swap then recurse
# - Recurse then swap

# Both work because we visit all nodes
# Key is: swap at each node
```

#### 2. Why This Works
```python
# Each node's children get swapped
# Recursively, entire tree mirrors
# This is equivalent to horizontal flip
```

#### 3. With Different Traversals
```python
# In-order traversal also works:
def invertInorder(root):
    if not root:
        return None
    
    invertInorder(root.left)
    root.left, root.right = root.right, root.left
    invertInorder(root.left)  # Note: left is now original right!
    
    return root

# Correct in-order: visit original right, swap, visit original left
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| DFS | O(n) | O(h) |
| BFS | O(n) | O(w) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Not swapping | Do root.left, root.right = root.right, root.left |
| Forgetting return | Return root at end |
| Wrong recursion | Recurse on both children |

<!-- back -->
