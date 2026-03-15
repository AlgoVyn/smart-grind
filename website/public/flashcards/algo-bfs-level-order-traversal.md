## BFS Level Order Traversal

**Question:** How do you track levels in BFS traversal of a binary tree?

<!-- front -->

---

## Level Order Traversal

### Standard BFS with Level Tracking
```python
from collections import deque

def level_order(root):
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(level)
    
    return result
```

### Alternative: Track Level in Each Node
```python
def level_order_with_level(root):
    if not root:
        return []
    
    result = []
    queue = deque([(root, 0)])
    
    while queue:
        node, level = queue.popleft()
        
        if level == len(result):
            result.append([])
        result[level].append(node.val)
        
        if node.left:
            queue.append((node.left, level + 1))
        if node.right:
            queue.append((node.right, level + 1))
    
    return result
```

### 💡 Key Pattern
Process **all nodes at current level** before moving to next level using `len(queue)`.

### Complexity: O(n) time, O(w) space where w = max width

<!-- back -->
