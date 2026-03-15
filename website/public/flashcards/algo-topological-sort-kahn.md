## Topological Sort (Kahn's Algorithm)

**Question:** How does Kahn's algorithm perform topological sorting using indegrees?

<!-- front -->

---

## Answer: Zero-Indegree Queue

### Key Concept
Process vertices with zero indegree first, removing their edges.

### Algorithm
```python
from collections import deque, Counter

def topological_sort_kahn(graph):
    # Calculate indegrees
    indegree = Counter()
    for u in graph:
        for v in graph[u]:
            indegree[v] += 1
    
    # Start with nodes having zero indegree
    queue = deque([u for u in graph if indegree[u] == 0])
    result = []
    
    while queue:
        u = queue.popleft()
        result.append(u)
        
        for v in graph[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                queue.append(v)
    
    # Check for cycles
    if len(result) != len(graph):
        return []  # Cycle detected!
    
    return result
```

### Visual Example
```
Graph:          Indegrees:        Process:
A → B           A:0, B:1         1. Start: [A]
A → C           A:0, C:1         2. Pop A, reduce B,C
C → D           C:1, D:1         3. Queue: [B,C]
                               4. Pop C, reduce D
Result: A, B, C, D              5. Result: [A, B, C, D]
```

### Complexity
- **Time:** O(V + E)
- **Space:** O(V)

### DFS vs Kahn's
| DFS | Kahn's |
|-----|--------|
| Recursive | Iterative |
| Detect cycle by back edges | Detect cycle by remaining vertices |
| Post-order + reverse | Zero-indegree processing |

### ⚠️ Key Points
- Multiple valid orderings possible
- Queue can be replaced with heap for lexicographically smallest
- Empty result indicates cycle

<!-- back -->
