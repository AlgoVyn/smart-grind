## Tarjan's Algorithm (Strongly Connected Components)

**Question:** How does Tarjan's algorithm find all Strongly Connected Components (SCCs) in O(V+E) time?

<!-- front -->

---

## Answer: DFS with Lowlink

### Key Concept
Use DFS with two values:
- **disc[u]**: Discovery time of vertex u
- **low[u]**: Lowest discovery time reachable from u's subtree

### Algorithm
```python
def tarjan_scc(graph):
    disc = {}
    low = {}
    on_stack = set()
    stack = []
    sccs = []
    time = [0]
    
    def dfs(u):
        disc[u] = low[u] = time[0]
        time[0] += 1
        stack.append(u)
        on_stack.add(u)
        
        for v in graph.get(u, []):
            if v not in disc:
                dfs(v)
                low[u] = min(low[u], low[v])
            elif v in on_stack:
                low[u] = min(low[u], disc[v])
        
        # Root of SCC
        if low[u] == disc[u]:
            scc = []
            while True:
                w = stack.pop()
                on_stack.remove(w)
                scc.append(w)
                if w == u:
                    break
            sccs.append(scc)
    
    for v in graph:
        if v not in disc:
            dfs(v)
    
    return sccs
```

### Visual Example
```
Graph:          SCCs Found:
1 → 2 → 3       [0]
↓ ↗   ↓         [1, 2, 3]
4 → 5           [4, 5]
```

### Complexity
- **Time:** O(V + E)
- **Space:** O(V)

### SCC vs Connected Component
| Connected | Strongly Connected |
|-----------|-------------------|
| Undirected graph | Directed graph |
| Path exists both ways | Path exists both ways **in same direction** |

### ⚠️ Key Insight
SCCs form a DAG when contracted. Use Kosaraju's for simpler implementation.

<!-- back -->
