## Binary Tree Level Order Traversal

**Question:** Traverse binary tree level by level (BFS)?

<!-- front -->

---

## Answer: Queue-Based BFS

### Solution
```python
def levelOrder(root):
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

### Visual: Level Order
```
        1
       / \
      2   3
     / \   \
    4   5   6

Level 1: [1]
Level 2: [2, 3]
Level 3: [4, 5, 6]

Result: [[1], [2,3], [4,5,6]]
```

### ⚠️ Tricky Parts

#### 1. Why Track Level Size?
```python
# Need to know when one level ends
# Process exactly len(queue) nodes per level

# Without tracking:
# Can't separate levels in result
```

#### 2. When to Use Deque?
```python
# popleft() is O(1) for deque
# list.pop(0) is O(n)

# BFS processes from front
# Need efficient remove from front
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| BFS | O(n) | O(w) |

w = max width (worst case n/2 for complete tree)

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| No level separation | Track level size |
| Using list for queue | Use deque |
| Not checking children | Add left and right |

<!-- back -->
