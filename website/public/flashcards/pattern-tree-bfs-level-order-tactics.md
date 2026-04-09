## Tree - BFS Level Order: Tactics

What are the advanced techniques for BFS level order traversal?

<!-- front -->

---

### Tactic 1: Connect Nodes at Same Level

```python
class Node:
    def __init__(self, val=0, left=None, right=None, next=None):
        self.val = val
        self.left = left
        self.right = right
        self.next = next

def connect(root):
    """Connect each node to its right neighbor at same level."""
    if not root:
        return None
    
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        prev = None
        
        for _ in range(level_size):
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

### Tactic 2: Binary Tree Vertical Order

```python
def vertical_order(root):
    """Return nodes grouped by vertical column."""
    if not root:
        return []
    
    columns = defaultdict(list)
    queue = deque([(root, 0)])  # (node, column)
    
    while queue:
        node, col = queue.popleft()
        columns[col].append(node.val)
        
        if node.left:
            queue.append((node.left, col - 1))
        if node.right:
            queue.append((node.right, col + 1))
    
    # Return sorted by column index
    return [columns[x] for x in sorted(columns.keys())]
```

---

### Tactic 3: Maximum Width of Binary Tree

```python
def width_of_binary_tree(root):
    """Find maximum width among all levels."""
    if not root:
        return 0
    
    max_width = 0
    # (node, index) where index is position if tree was complete
    queue = deque([(root, 0)])
    
    while queue:
        level_size = len(queue)
        leftmost = queue[0][1]
        rightmost = queue[-1][1]
        max_width = max(max_width, rightmost - leftmost + 1)
        
        for _ in range(level_size):
            node, idx = queue.popleft()
            # Use 2*idx and 2*idx+1 for positions
            if node.left:
                queue.append((node.left, 2 * idx))
            if node.right:
                queue.append((node.right, 2 * idx + 1))
    
    return max_width
```

---

### Tactic 4: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|-----|
| **Using while queue directly** | Processes new nodes too | Capture `len(queue)` first |
| **Not checking None** | Attribute error | Check `if root:` at start |
| **List as queue** | O(n) pop(0) | Use `deque` for O(1) popleft |
| **Wrong order in zigzag** | Not reversing correctly | Track direction with boolean |

---

### Tactic 5: DFS vs BFS for Minimum Depth

**BFS is better for minimum depth** (finds it immediately):

```python
def min_depth_bfs(root):
    """BFS finds minimum depth efficiently."""
    if not root:
        return 0
    
    queue = deque([(root, 1)])
    
    while queue:
        node, depth = queue.popleft()
        
        # First leaf found is at minimum depth
        if not node.left and not node.right:
            return depth
        
        if node.left:
            queue.append((node.left, depth + 1))
        if node.right:
            queue.append((node.right, depth + 1))
```

**DFS would explore all paths unnecessarily**

<!-- back -->
