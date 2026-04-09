## Tree - BFS Level Order Traversal: Tactics

What are the advanced techniques and edge cases for BFS level order traversal?

<!-- front -->

---

### Tactic 1: Reverse Level Order (Bottom-Up)

Return levels from bottom to top.

```python
from collections import deque

def reverse_level_order(root):
    """Return level order from leaf to root."""
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
        
        result.insert(0, current_level)  # Prepend instead of append
        # Or: result.append(current_level) then reverse at end
    
    return result
    # Alternative: return result[::-1] if you appended
```

---

### Tactic 2: Zigzag (Spiral) Level Order

Alternate direction each level.

```python
def zigzag_level_order(root):
    """Process levels: left→right, right→left, alternating."""
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
```

---

### Tactic 3: Right Side View

Get the rightmost node of each level.

```python
def right_side_view(root):
    """Return nodes visible from right side."""
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        
        for i in range(level_size):
            node = queue.popleft()
            
            # Last node in level = rightmost
            if i == level_size - 1:
                result.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    
    return result
```

---

### Tactic 4: Connect Nodes at Same Level

Populate next right pointers.

```python
class Node:
    def __init__(self, val=0, left=None, right=None, next=None):
        self.val = val
        self.left = left
        self.right = right
        self.next = next  # Pointer to next node at same level

def connect(root):
    """Connect each node to its next right neighbor."""
    if not root:
        return None
    
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        prev = None
        
        for i in range(level_size):
            node = queue.popleft()
            
            # Connect to previous node at same level
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

### Tactic 5: Average of Levels

Calculate average value per level.

```python
def average_of_levels(root):
    """Return average value of nodes at each level."""
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
```

---

### Tactic 6: Find Largest Value in Each Row

Track max per level.

```python
def largest_values(root):
    """Find largest value in each tree row."""
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
```

---

### Tactic 7: Minimum Depth

Find shortest root-to-leaf path.

```python
def min_depth(root):
    """Find minimum depth (shortest root-to-leaf path)."""
    if not root:
        return 0
    
    queue = deque([(root, 1)])  # (node, depth)
    
    while queue:
        node, depth = queue.popleft()
        
        # First leaf found = minimum depth (BFS property)
        if not node.left and not node.right:
            return depth
        
        if node.left:
            queue.append((node.left, depth + 1))
        if node.right:
            queue.append((node.right, depth + 1))
    
    return 0
```

---

### Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|-----|
| Wrong level grouping | Nodes mixed across levels | Use `level_size = len(queue)` BEFORE inner loop |
| Modifying queue during iteration | Process wrong nodes | Use `for _ in range(level_size)` not `for node in queue` |
| Empty tree check | Runtime error | Always check `if not root: return []` |
| Wrong child order | Right before left | Always enqueue left before right |
| Space issues with wide trees | Memory error | Consider iterative DFS for better space |

<!-- back -->
