## Strongly Connected Components: Forms

What are the different variations of SCC algorithms?

<!-- front -->

---

### Form 1: Kosaraju's Algorithm

```python
def kosaraju(n, edges):
    """Kosaraju's two-pass algorithm."""
    graph = [[] for _ in range(n)]
    rev_graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        rev_graph[v].append(u)
    
    # First pass: get finish order
    visited = [False] * n
    finish_order = []
    
    def dfs1(v):
        visited[v] = True
        for u in graph[v]:
            if not visited[u]:
                dfs1(u)
        finish_order.append(v)
    
    for v in range(n):
        if not visited[v]:
            dfs1(v)
    
    # Second pass: find SCCs on reversed graph
    visited = [False] * n
    sccs = []
    
    def dfs2(v, scc):
        visited[v] = True
        scc.append(v)
        for u in rev_graph[v]:
            if not visited[u]:
                dfs2(u, scc)
    
    for v in reversed(finish_order):
        if not visited[v]:
            scc = []
            dfs2(v, scc)
            sccs.append(scc)
    
    return sccs
```

---

### Form 2: Tarjan's Algorithm

```python
def tarjan(n, edges):
    """Tarjan's single-pass algorithm."""
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
    
    index = 0
    stack = []
    on_stack = [False] * n
    indices = [-1] * n
    low_link = [0] * n
    sccs = []
    
    def strongconnect(v):
        nonlocal index
        indices[v] = low_link[v] = index
        index += 1
        stack.append(v)
        on_stack[v] = True
        
        for w in graph[v]:
            if indices[w] == -1:
                strongconnect(w)
                low_link[v] = min(low_link[v], low_link[w])
            elif on_stack[w]:
                low_link[v] = min(low_link[v], indices[w])
        
        if low_link[v] == indices[v]:
            scc = []
            while True:
                w = stack.pop()
                on_stack[w] = False
                scc.append(w)
                if w == v:
                    break
            sccs.append(scc)
    
    for v in range(n):
        if indices[v] == -1:
            strongconnect(v)
    
    return sccs
```

---

### Form Comparison

| Form | Passes | Space | Code Complexity | Use Case |
|------|--------|-------|-----------------|----------|
| Kosaraju | 2 | O(V+E) | Simpler | Learning |
| Tarjan | 1 | O(V) | Complex | Production |

<!-- back -->
