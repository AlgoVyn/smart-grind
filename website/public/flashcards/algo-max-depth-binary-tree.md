## Maximum Depth of Binary Tree

**Question:** Find maximum depth of binary tree?

<!-- front -->

---

## Answer: Recursive DFS

### Solution
```python
def maxDepth(root):
    if not root:
        return 0
    
    left_depth = maxDepth(root.left)
    right_depth = maxDepth(root.right)
    
    return max(left_depth, right_depth) + 1
```

### Alternative: BFS
```python
from collections import deque

def maxDepthBFS(root):
    if not root:
        return 0
    
    depth = 0
    queue = deque([root])
    
    while queue:
        depth += 1
        level_size = len(queue)
        
        for _ in range(level_size):
            node = queue.popleft()
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    
    return depth
```

### Visual: Tree Depth
```
        3
       / \
      9   20
         /  \
        15   7

Depth = 3 (path: 3→20→7 or 3→20→15)
```

### ⚠️ Tricky Parts

#### 1. Why +1?
```python
# Each node adds 1 to depth of its children
# Leaf node returns 1 (just itself)
# Parent returns max(child depths) + 1
```

#### 2. Base Case
```python
# Empty tree (null) → depth = 0
# Single node → depth = 1

# Not returning -1 for null
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| DFS (recursive) | O(n) | O(h) |
| BFS | O(n) | O(w) |

h = height, w = max width

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Not adding 1 | Return max + 1 |
| Wrong base case | Return 0 for null |
| Using wrong traversal | DFS or BFS both work |

<!-- back -->
