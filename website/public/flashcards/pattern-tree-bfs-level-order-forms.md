## Tree - BFS Level Order: Forms

What are the different variations of BFS level order traversal?

<!-- front -->

---

### Form 1: Simple Level Order

```python
def level_order_simple(root):
    """Return flat list of all values in level order."""
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        node = queue.popleft()
        result.append(node.val)
        
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)
    
    return result
```

---

### Form 2: Level Order with Level Separation

```python
def level_order_by_levels(root):
    """Return list of lists, each inner list is one level."""
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level = []
        for _ in range(len(queue)):
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

### Form 3: Level Averages

```python
def average_of_levels(root):
    """Return average value of each level."""
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_sum = 0
        level_count = len(queue)
        
        for _ in range(level_count):
            node = queue.popleft()
            level_sum += node.val
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(level_sum / level_count)
    
    return result
```

---

### Form 4: Find Bottom-Left Value

```python
def find_bottom_left_value(root):
    """Find leftmost value in the last level."""
    if not root:
        return None
    
    queue = deque([root])
    
    while queue:
        node = queue.popleft()
        
        # Add right first, then left (so left is processed last)
        if node.right:
            queue.append(node.right)
        if node.left:
            queue.append(node.left)
    
    return node.val  # Last processed is bottom-left
```

---

### Form Comparison

| Form | Output | Special Feature |
|------|--------|-----------------|
| Simple | Flat list | Just values |
| By Levels | List of lists | Level separation |
| Averages | List of floats | Per-level statistics |
| Bottom-Left | Single value | Last level first element |

<!-- back -->
