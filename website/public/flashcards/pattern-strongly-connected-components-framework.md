## Strongly Connected Components: Framework

What is the complete code template for finding SCCs?

<!-- front -->

---

### Framework 1: Kosaraju's Algorithm

```
┌─────────────────────────────────────────────────────┐
│  KOSARAJU'S ALGORITHM - TEMPLATE                       │
├─────────────────────────────────────────────────────┤
│  Step 1: DFS on original graph, record finish times   │
│  Step 2: Reverse graph                                │
│  Step 3: DFS in reverse finish time order            │
│           Each DFS tree = one SCC                     │
│                                                        │
│  1. visited = set()                                    │
│     finish_order = []                                  │
│                                                        │
│  2. DFS1(node):  # Get finish times                  │
│     Mark visited                                      │
│     For each neighbor: DFS1(neighbor)                 │
│     Append node to finish_order                       │
│                                                        │
│  3. Reverse graph                                     │
│                                                        │
│  4. DFS2(node, scc):  # Get SCCs                     │
│     Mark visited                                      │
│     Add node to current scc                           │
│     For each neighbor in reversed graph:            │
│        DFS2(neighbor, scc)                           │
│                                                        │
│  5. For node in reversed(finish_order):               │
│     If not visited: start new SCC                     │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: Kosaraju

```python
def kosaraju(n, edges):
    """
    Find strongly connected components.
    Time: O(V+E), Space: O(V+E)
    """
    # Build graph and reverse graph
    graph = [[] for _ in range(n)]
    rev_graph = [[] for _ in range(n)]
    
    for u, v in edges:
        graph[u].append(v)
        rev_graph[v].append(u)
    
    # Step 1: Get finish order
    visited = [False] * n
    finish_order = []
    
    def dfs1(node):
        visited[node] = True
        for neighbor in graph[node]:
            if not visited[neighbor]:
                dfs1(neighbor)
        finish_order.append(node)
    
    for i in range(n):
        if not visited[i]:
            dfs1(i)
    
    # Step 2: DFS on reversed graph in reverse finish order
    visited = [False] * n
    sccs = []
    
    def dfs2(node, scc):
        visited[node] = True
        scc.append(node)
        for neighbor in rev_graph[node]:
            if not visited[neighbor]:
                dfs2(neighbor, scc)
    
    for node in reversed(finish_order):
        if not visited[node]:
            scc = []
            dfs2(node, scc)
            sccs.append(scc)
    
    return sccs
```

---

### Key Pattern Elements

| Step | Purpose |
|------|---------|
| DFS1 | Get finish times |
| Reverse | Flip edge directions |
| DFS2 | Find SCCs in reverse order |

<!-- back -->
