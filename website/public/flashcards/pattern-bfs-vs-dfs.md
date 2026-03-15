## BFS vs DFS: When to Use Which?

**Question:** How do you choose between BFS and DFS for graph traversal problems?

<!-- front -->

---

## Answer: Know Your Use Case

### When to Use BFS
- **Shortest path** (unweighted graphs)
- **Level-order** traversal
- Finding **closest** neighbors
- When solution is **shallow** in tree

### When to Use DFS
- **Path finding** (any path, not shortest)
- **Cycle detection**
- **Topological sorting**
- When solution might be **deep** in tree
- **Memory** is concern (DFS uses less)

### Solution Templates

#### BFS Template
```python
from collections import deque

def bfs(graph, start):
    visited = set([start])
    queue = deque([start])
    
    while queue:
        node = queue.popleft()
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
```

#### DFS Template (Recursive)
```python
def dfs(graph, node, visited):
    visited.add(node)
    
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
```

### Visual Comparison
```
Tree:           BFS (Level by Level):    DFS (Depth First):
    1               1                       1
   / \             / \                     / \
  2   3           2   3                   2   3
 / \             / \                     /
4   5           4   5                   4   5

Queue: [1]     → [2,3] → [3,4,5]      Stack: [1] → [2] → [4] → backtrack
```

### Complexity
| Operation | BFS | DFS |
|-----------|-----|-----|
| Time | O(V+E) | O(V+E) |
| Space | O(V) | O(V) |

### ⚠️ Key Differences & Tricky Parts

| Aspect | BFS | DFS |
|--------|-----|-----|
| Data Structure | Queue | Stack (or recursion) |
| Finds Shortest | ✓ Yes | ✗ No |
| Memory for Wide Tree | ❌ High | ✓ Low |
| Path Reconstruction | Need parent map | Natural via recursion |
| Handling Cycles | Must track visited | Must track visited |

### ⚠️ Common Mistakes
1. **Not marking visited** when adding to queue/stack (causes infinite loop)
2. **Using recursion** for BFS (doesn't work naturally)
3. **Stack overflow** with deep recursion - use iterative DFS
4. **Wrong starting point** - BFS needs queue initialization
5. **Forgetting to check** if node exists in graph

### When BFS Fails
- Graph is too wide → Queue grows too large
- Need all paths, not shortest → Use DFS

### When DFS Fails
- Need shortest path → Use BFS
- Graph has cycles → Must track visited carefully

<!-- back -->
