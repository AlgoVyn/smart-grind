## Tree - BFS Level Order Traversal: Forms

What are the different variations of BFS level order traversal?

<!-- front -->

---

### Form 1: Standard Level Order

Basic BFS returning all levels.

```python
from collections import deque

def level_order(root):
    """Standard level order traversal."""
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        current_level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(current_level)
    
    return result
# Output: [[1], [2, 3], [4, 5, 6]]
```

---

### Form 2: Level Order with Depth Tracking

Return depth along with level values.

```python
def level_order_with_depth(root):
    """Track depth for each level."""
    if not root:
        return []
    
    result = []
    queue = deque([(root, 0)])  # (node, depth)
    
    while queue:
        node, depth = queue.popleft()
        
        # Ensure result has enough levels
        while len(result) <= depth:
            result.append([])
        
        result[depth].append(node.val)
        
        if node.left:
            queue.append((node.left, depth + 1))
        if node.right:
            queue.append((node.right, depth + 1))
    
    return result
# Output: [[1], [2, 3], [4, 5, 6]] with depth known
```

---

### Form 3: Two Queue Method

Separate queues for current and next level.

```python
def level_order_two_queues(root):
    """Use two queues to separate levels."""
    if not root:
        return []
    
    result = []
    current_queue = deque([root])
    
    while current_queue:
        current_level = []
        next_queue = deque()
        
        while current_queue:
            node = current_queue.popleft()
            current_level.append(node.val)
            
            if node.left:
                next_queue.append(node.left)
            if node.right:
                next_queue.append(node.right)
        
        result.append(current_level)
        current_queue = next_queue
    
    return result
# More explicit level separation, uses more memory
```

---

### Form 4: Reverse Level Order

Bottom-up traversal (leaves to root).

```python
def reverse_level_order(root):
    """Return levels from bottom to top."""
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        current_level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.insert(0, current_level)  # Prepend
    
    return result
# Output: [[4, 5, 6], [2, 3], [1]]
```

---

### Form 5: Zigzag Level Order

Alternate left-to-right and right-to-left.

```python
def zigzag_level_order(root):
    """Alternate direction each level."""
    if not root:
        return []
    
    result = []
    queue = deque([root])
    left_to_right = True
    
    while queue:
        level_size = len(queue)
        current_level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        if not left_to_right:
            current_level.reverse()
        
        result.append(current_level)
        left_to_right = not left_to_right
    
    return result
# Output: [[1], [3, 2], [4, 5, 6]]
```

---

### Form 6: Right Side View

Only the rightmost node per level.

```python
def right_side_view(root):
    """View from right side."""
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        
        for i in range(level_size):
            node = queue.popleft()
            
            if i == level_size - 1:  # Last in level
                result.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    
    return result
# Output: [1, 3, 6] - rightmost of each level
```

---

### Form 7: Level Averages

Average value per level.

```python
def average_of_levels(root):
    """Average of each level's values."""
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        level_sum = 0
        
        for _ in range(level_size):
            node = queue.popleft()
            level_sum += node.val
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(level_sum / level_size)
    
    return result
# Output: [1.0, 2.5, 5.0]
```

---

### Form 8: Level Maximum

Maximum value per level.

```python
def largest_values(root):
    """Maximum of each level."""
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        level_max = float('-inf')
        
        for _ in range(level_size):
            node = queue.popleft()
            level_max = max(level_max, node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(level_max)
    
    return result
# Output: [1, 3, 6]
```

---

### Form Comparison

| Form | Output | Key Modification |
|------|--------|------------------|
| Standard | All levels | Basic BFS |
| With Depth | Levels + depth | Track depth in queue |
| Two Queue | All levels | Separate current/next queues |
| Reverse | Bottom-up | `insert(0, ...)` or reverse at end |
| Zigzag | Alternating | Reverse every other level |
| Right Side | Rightmost only | Take last node of each level |
| Averages | Float per level | Sum and divide |
| Maximum | Int per level | Track max per level |

---

### Form 9: Connect Nodes at Same Level

Populate next pointers (perfect binary tree).

```python
class Node:
    def __init__(self, val=0, left=None, right=None, next=None):
        self.val = val
        self.left = left
        self.right = right
        self.next = next

def connect(root):
    """Connect nodes to their next right neighbor."""
    if not root:
        return None
    
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        prev = None
        
        for i in range(level_size):
            node = queue.popleft()
            
            if prev:
                prev.next = node
            prev = node
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    
    return root
```

---

### Form 10: Minimum Depth

Find shortest root-to-leaf path using BFS.

```python
def min_depth(root):
    """Shortest path to leaf - BFS finds it first."""
    if not root:
        return 0
    
    queue = deque([(root, 1)])
    
    while queue:
        node, depth = queue.popleft()
        
        if not node.left and not node.right:
            return depth
        
        if node.left:
            queue.append((node.left, depth + 1))
        if node.right:
            queue.append((node.right, depth + 1))
    
    return 0
```

<!-- back -->
