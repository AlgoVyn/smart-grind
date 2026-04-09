## Graph - BFS/DFS Traversal: Framework

What is the complete code template for graph BFS and DFS traversal?

<!-- front -->

---

### Framework 1: BFS Template

```
┌─────────────────────────────────────────────────────┐
│  BFS GRAPH TRAVERSAL - TEMPLATE                      │
├─────────────────────────────────────────────────────┤
│  1. Initialize queue with starting node              │
│  2. Initialize visited set with starting node        │
│  3. While queue not empty:                          │
│     a. node = dequeue()                             │
│     b. Process node (e.g., add to result)           │
│     c. For each neighbor of node:                   │
│        - If neighbor not in visited:               │
│           * Add to visited                          │
│           * Enqueue neighbor                        │
│  4. Return result                                     │
└─────────────────────────────────────────────────────┘
```

---

### Implementation - BFS

```python
from collections import deque

def bfs(graph, start):
    """BFS traversal from start node."""
    if start not in graph:
        return []
    
    visited = set([start])
    queue = deque([start])
    result = []
    
    while queue:
        node = queue.popleft()
        result.append(node)
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    
    return result
```

---

### Framework 2: DFS Recursive Template

```python
def dfs_recursive(graph, start):
    """DFS traversal using recursion."""
    visited = set()
    result = []
    
    def dfs(node):
        if node in visited:
            return
        
        visited.add(node)
        result.append(node)
        
        for neighbor in graph[node]:
            dfs(neighbor)
    
    dfs(start)
    return result
```

---

### Framework 3: DFS Iterative Template

```python
def dfs_iterative(graph, start):
    """DFS traversal using explicit stack."""
    if start not in graph:
        return []
    
    visited = set()
    stack = [start]
    result = []
    
    while stack:
        node = stack.pop()
        
        if node not in visited:
            visited.add(node)
            result.append(node)
            
            # Add neighbors to stack (reverse order for consistent traversal)
            for neighbor in reversed(graph[node]):
                if neighbor not in visited:
                    stack.append(neighbor)
    
    return result
```

---

### Key Pattern Elements

| Element | BFS | DFS |
|---------|-----|-----|
| Data structure | Queue (deque) | Stack (list) or recursion |
| Pop operation | `popleft()` | `pop()` |
| Add neighbors | `append()` | `append()` |
| Visited check | Before enqueue | Before process (DFS iter) |

<!-- back -->
