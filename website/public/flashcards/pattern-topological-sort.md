## Topological Sort: Kahn's Algorithm

**Question:** How do you order tasks with prerequisites?

<!-- front -->

---

## Answer: BFS with In-Degree Tracking

### Solution
```python
from collections import deque, defaultdict

def topologicalSort(n, edges):
    graph = defaultdict(list)
    in_degree = [0] * n
    
    # Build graph
    for u, v in edges:  # u -> v (u before v)
        graph[u].append(v)
        in_degree[v] += 1
    
    # Start with nodes having no prerequisites
    queue = deque([i for i in range(n) if in_degree[i] == 0])
    result = []
    
    while queue:
        node = queue.popleft()
        result.append(node)
        
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    if len(result) == n:
        return result
    return []  # Cycle detected!
```

### Visual: Process
```
Courses: [0,1,2,3,4]
Prereqs: [[0,1],[0,2],[1,3],[2,3]]

Graph:        0 → 1
              ↓     ↓
              2 → 3
              
In-degrees:  [0,1,1,2,0]

Step 1: Start with 0,4 (in-degree 0)
Step 2: Process 0 → reduces 1,2 in-degrees
Step 3: Add 1,2 when in-degree becomes 0
Step 4: Process 1 → reduces 3 in-degree
Step 5: Process 2 → reduces 3 in-degree  
Step 6: Process 3 when in-degree becomes 0

Order: [0,4,1,2,3]
```

### ⚠️ Tricky Parts

#### 1. Edge Direction
```python
# u -> v means u must come before v
# in_degree[v] += 1

# Example: course 0 has prereq 1
# Edge: 1 -> 0
# in_degree[0] += 1
```

#### 2. Cycle Detection
```python
# If result doesn't contain all nodes → cycle exists
if len(result) != n:
    return []  # Can't complete - cycle!
```

#### 3. Multiple Valid Orders
```python
# Any order with valid prerequisites is acceptable
# Queue can have multiple nodes at once
# Different orderings are all valid
```

### DFS-Based Topological Sort
```python
def topologicalSortDFS(n, edges):
    graph = defaultdict(list)
    
    for u, v in edges:
        graph[u].append(v)
    
    visited = [0] * n  # 0=unvisited,1=visiting,2=done
    result = []
    
    def dfs(node):
        if visited[node] == 1:
            return False  # Cycle!
        if visited[node] == 2:
            return True
        
        visited[node] = 1
        for neighbor in graph[node]:
            if not dfs(neighbor):
                return False
        visited[node] = 2
        result.append(node)
        return True
    
    for i in range(n):
        if not visited[i]:
            if not dfs(i):
                return []
    
    return result[::-1]  # Reverse for correct order
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Kahn's (BFS) | O(V+E) | O(V) |
| DFS | O(V+E) | O(V) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Wrong edge direction | u->v means u before v |
| Not checking cycle | Verify len(result) == n |
| Not processing all | Handle disconnected components |

<!-- back -->
