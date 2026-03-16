## Clone Graph

**Question:** Clone an undirected graph with random pointers?

<!-- front -->

---

## Answer: BFS/DFS with Hash Map

### Solution (BFS)
```python
def cloneGraph(node):
    if not node:
        return None
    
    # Map: original -> copy
    visited = {node: Node(node.val, [])}
    queue = deque([node])
    
    while queue:
        curr = queue.popleft()
        
        for neighbor in curr.neighbors:
            if neighbor not in visited:
                visited[neighbor] = Node(neighbor.val, [])
                queue.append(neighbor)
            
            # Add edge to cloned graph
            visited[curr].neighbors.append(visited[neighbor])
    
    return visited[node]
```

### Visual: Clone Process
```
Original:          Clone:
    1                 1'
   / \               / \
  2   3             2'  3'

Map: {1:1', 2:2', 3:3'}
Edges: 1'→2', 1'→3', 2'→1', 3'→1
```

### ⚠️ Tricky Parts

#### 1. Why Hash Map?
```python
# Need to track already-cloned nodes
# Avoid infinite loops with cycles
# Reuse same clone for multiple references
```

#### 2. When to Create Node?
```python
# Create when first visited
# Add to queue to process neighbors
# Always add edge to visited copy
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| BFS/DFS | O(V + E) | O(V) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| No visited map | Track cloned nodes |
| Create duplicate nodes | Check if already visited |
| Missing edges | Add edges in loop |

<!-- back -->
