## Topological Sort (DFS Approach)

**Question:** How do you perform topological sorting using DFS?

<!-- front -->

---

## Answer: Finish Time Ordering

### Key Concept
Process vertices in reverse order of their DFS finish time.

### Algorithm
```python
def topological_sort_dfs(graph):
    visited = set()
    result = []
    
    def dfs(u):
        visited.add(u)
        
        for v in graph.get(u, []):
            if v not in visited:
                dfs(v)
        
        # Add to result after exploring all neighbors
        result.append(u)
    
    for v in graph:
        if v not in visited:
            dfs(v)
    
    return result[::-1]  # Reverse for correct order
```

### Visual Example
```
Graph:          DFS Order:        Topo Order:
A → B → C       C → B → A         A → B → C
A → D           D → A            A → D → B → C
```

### When It Works
- **Directed Acyclic Graphs (DAGs)** only!
- If cycle exists, DFS will get stuck

### Complexity
- **Time:** O(V + E)
- **Space:** O(V)

### Why It Works
In a DAG, an edge u→v means u must come **before** v.
When we finish exploring v (post-order), u is still on call stack.
Reversing gives correct order.

### ⚠️ Detection of Cycles
Can detect cycles during DFS:
```python
def has_cycle(graph):
    visited = set()
    rec_stack = set()
    
    def dfs(u):
        visited.add(u)
        rec_stack.add(u)
        
        for v in graph.get(u, []):
            if v not in visited:
                if dfs(v):
                    return True
            elif v in rec_stack:
                return True
        
        rec_stack.remove(u)
        return False
    
    return any(dfs(v) for v in graph if v not in visited)
```

<!-- back -->
