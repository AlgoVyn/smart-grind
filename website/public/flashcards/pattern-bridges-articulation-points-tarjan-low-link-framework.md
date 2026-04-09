## Bridges & Articulation Points (Tarjan's) - Framework

What is the complete code template for finding bridges and articulation points?

<!-- front -->

---

### Framework Template

```
┌─────────────────────────────────────────────────────────────┐
│  TARJAN'S BRIDGES & ARTICULATION POINTS - TEMPLATE            │
├─────────────────────────────────────────────────────────────┤
│  Key Arrays:                                                  │
│  - disc[u]: Discovery time when u is first visited            │
│  - low[u]: Earliest discovery time reachable from u          │
│  - parent[u]: Parent of u in DFS tree                        │
│  - children_count[u]: Number of DFS tree children            │
│                                                               │
│  1. Initialize: disc = {}, low = {}, time = 0               │
│                                                               │
│  2. DFS(u):                                                   │
│     a. disc[u] = low[u] = time++                             │
│     b. For each neighbor v of u:                             │
│        - If v not visited (tree edge):                       │
│            parent[v] = u, children_count[u]++              │
│            DFS(v)                                            │
│            low[u] = min(low[u], low[v])                     │
│            // Bridge check: low[v] > disc[u]                 │
│            // AP check: low[v] >= disc[u] (non-root)         │
│        - Else if v != parent[u] (back edge):               │
│            low[u] = min(low[u], disc[v])                     │
│     c. If root and children_count[u] > 1: mark AP            │
│                                                               │
│  3. Call DFS from each unvisited node (handle disconnected) │
└─────────────────────────────────────────────────────────────┘
```

---

### Python Implementation

```python
def tarjan_bridges_ap(graph):
    """
    Find bridges and articulation points.
    Time: O(V + E), Space: O(V)
    """
    n = len(graph)
    disc = {}
    low = {}
    parent = {}
    bridges = []
    ap = set()
    children_count = {}
    time = [0]
    
    def dfs(u):
        disc[u] = low[u] = time[0]
        time[0] += 1
        is_articulation = False
        
        for v in graph[u]:
            if v not in disc:
                # Tree edge
                parent[v] = u
                children_count[u] = children_count.get(u, 0) + 1
                dfs(v)
                
                low[u] = min(low[u], low[v])
                
                # Bridge: no back edge from subtree
                if low[v] > disc[u]:
                    bridges.append((u, v))
                
                # Articulation point (non-root)
                if parent.get(u) is not None and low[v] >= disc[u]:
                    is_articulation = True
                    
            elif v != parent.get(u):
                # Back edge - update low
                low[u] = min(low[u], disc[v])
        
        # Root articulation point: needs 2+ children
        if parent.get(u) is None and children_count.get(u, 0) > 1:
            ap.add(u)
        elif parent.get(u) is not None and is_articulation:
            ap.add(u)
    
    # Handle disconnected graphs
    for node in graph:
        if node not in disc:
            parent[node] = None
            dfs(node)
    
    return bridges, ap
```

---

### Key Pattern Elements

| Element | Purpose | When Updated |
|---------|---------|--------------|
| `disc[u]` | Discovery order | On first visit |
| `low[u]` | Earliest reachable | After DFS child or on back edge |
| `low[v] > disc[u]` | Bridge condition | Child cannot reach back to u |
| `low[v] >= disc[u]` | AP condition | Child cannot reach above u |
| `children_count[u] > 1` | Root AP | Root needs 2+ DFS children |

<!-- back -->
