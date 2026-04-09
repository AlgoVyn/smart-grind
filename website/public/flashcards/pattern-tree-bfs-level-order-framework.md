## Tree - BFS Level Order: Framework

What is the complete code template for BFS level order traversal?

<!-- front -->

---

### Framework 1: Basic Level Order Template

```
┌─────────────────────────────────────────────────────┐
│  BFS LEVEL ORDER - TEMPLATE                          │
├─────────────────────────────────────────────────────┤
│  1. If root is None: return empty result            │
│  2. Initialize queue with root                        │
│  3. While queue not empty:                          │
│     a. Get level size (queue length)                │
│     b. Initialize level list                        │
│     c. For i from 0 to level_size - 1:              │
│        - node = dequeue()                           │
│        - Add node value to level                    │
│        - Enqueue left child if exists               │
│        - Enqueue right child if exists              │
│     d. Add level to result                          │
│  4. Return result                                     │
└─────────────────────────────────────────────────────┘
```

---

### Implementation

```python
from collections import deque

def level_order(root):
    """Level order traversal returning list of levels."""
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

---

### Framework 2: Zigzag (Spiral) Order

```python
def zigzag_level_order(root):
    """Level order in zigzag pattern."""
    if not root:
        return []
    
    result = []
    queue = deque([root])
    left_to_right = True
    
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
        
        if not left_to_right:
            level.reverse()
        
        result.append(level)
        left_to_right = not left_to_right
    
    return result
```

---

### Framework 3: Right Side View

```python
def right_side_view(root):
    """Return rightmost node of each level."""
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        
        for i in range(level_size):
            node = queue.popleft()
            
            # Last node in level is the rightmost
            if i == level_size - 1:
                result.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    
    return result
```

---

### Key Pattern Elements

| Element | Purpose | Notes |
|---------|---------|-------|
| `level_size` | Process current level only | Capture before adding children |
| `deque` | O(1) popleft | More efficient than list |
| For loop | Fixed iterations | Don't use while queue (grows during loop) |

<!-- back -->
