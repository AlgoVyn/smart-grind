## Title: Tarjan's Algorithm - Frameworks

What are the structured approaches for Tarjan's Algorithm?

<!-- front -->

---

### Framework 1: Standard Tarjan's Algorithm

```
┌─────────────────────────────────────────────────────────┐
│  TARJAN'S SCC FRAMEWORK                                   │
├─────────────────────────────────────────────────────────┤
│  1. Initialize: disc[] = -1, low[] = 0, onStack[] = false│
│  2. For each unvisited vertex v:                           │
│     a. Call strongconnect(v)                               │
│  3. In strongconnect(v):                                   │
│     a. Set disc[v] = low[v] = current_index++              │
│     b. Push v to stack, mark onStack[v] = true           │
│     c. For each neighbor w:                                │
│        - If disc[w] == -1: recurse, update low[v]          │
│        - Else if onStack[w]: low[v] = min(low[v], disc[w])│
│     d. If disc[v] == low[v]:                               │
│        - Pop stack until v, forming one SCC                │
│  4. Return all SCCs                                         │
└─────────────────────────────────────────────────────────┘
```

**When to use:** Finding all SCCs in a directed graph with O(V + E) complexity.

---

### Framework 2: Condensation Graph Construction

```
┌─────────────────────────────────────────────────────────┐
│  CONDENSATION GRAPH FRAMEWORK                             │
├─────────────────────────────────────────────────────────┤
│  1. Find all SCCs using Tarjan's algorithm                │
│  2. Assign each vertex to its SCC index                   │
│  3. Build new graph where:                                │
│     - Each SCC becomes a single node                       │
│     - Edges between different SCCs become DAG edges       │
│  4. Result: Directed Acyclic Graph of SCCs                │
│                                                           │
│  Use case: Topological ordering of cyclic graphs         │
└─────────────────────────────────────────────────────────┘
```

---

### Framework 3: Cycle Detection Template

```python
def tarjan_scc(n, edges):
    """Find all strongly connected components."""
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
    
    disc = [-1] * n
    low = [0] * n
    on_stack = [False] * n
    stack = []
    index = [0]
    sccs = []
    
    def strongconnect(v):
        disc[v] = low[v] = index[0]
        index[0] += 1
        stack.append(v)
        on_stack[v] = True
        
        for w in graph[v]:
            if disc[w] == -1:
                strongconnect(w)
                low[v] = min(low[v], low[w])
            elif on_stack[w]:
                low[v] = min(low[v], disc[w])
        
        if low[v] == disc[v]:
            scc = []
            while True:
                w = stack.pop()
                on_stack[w] = False
                scc.append(w)
                if w == v:
                    break
            sccs.append(scc)
    
    for v in range(n):
        if disc[v] == -1:
            strongconnect(v)
    
    return sccs
```

<!-- back -->
