## Bridges & Articulation Points (Tarjan's) - Forms

What are the different manifestations and variations of this pattern?

<!-- front -->

---

### Form 1: Bridges Only (Critical Connections)

When you only need to find bridges, simplify by removing AP tracking.

```python
def find_bridges_only(graph):
    """
    Find only bridges (critical connections).
    Simpler than full algorithm when APs not needed.
    """
    n = len(graph)
    disc = [-1] * n
    low = [-1] * n
    bridges = []
    time = [0]
    
    def dfs(u, parent):
        disc[u] = low[u] = time[0]
        time[0] += 1
        
        for v in graph[u]:
            if v == parent:
                continue
            if disc[v] == -1:
                dfs(v, u)
                low[u] = min(low[u], low[v])
                if low[v] > disc[u]:
                    bridges.append([u, v])
            else:
                low[u] = min(low[u], disc[v])
    
    for i in range(n):
        if disc[i] == -1:
            dfs(i, -1)
    
    return bridges
```

| Aspect | Details |
|--------|---------|
| Time | O(V + E) |
| Space | O(V) |
| Use Case | LeetCode 1192 - Critical Connections |

---

### Form 2: Articulation Points Only

When you only need articulation points.

```python
def find_articulation_points_only(graph):
    """
    Find only articulation points.
    """
    n = len(graph)
    disc = [-1] * n
    low = [-1] * n
    ap = [False] * n
    children = [0] * n
    time = [0]
    
    def dfs(u, parent):
        disc[u] = low[u] = time[0]
        time[0] += 1
        
        for v in graph[u]:
            if v == parent:
                continue
            if disc[v] == -1:
                children[u] += 1
                dfs(v, u)
                low[u] = min(low[u], low[v])
                if parent != -1 and low[v] >= disc[u]:
                    ap[u] = True
            else:
                low[u] = min(low[u], disc[v])
        
        if parent == -1 and children[u] > 1:
            ap[u] = True
    
    for i in range(n):
        if disc[i] == -1:
            dfs(i, -1)
    
    return [i for i, is_ap in enumerate(ap) if is_ap]
```

---

### Form 3: Edge List Input

When graph is given as edge list instead of adjacency list.

```python
def find_bridges_from_edges(n, edges):
    """
    Convert edge list to adjacency list first.
    """
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)
    
    return find_bridges_only(graph)
```

---

### Form 4: With Edge IDs (Multiple edges)

Handle graphs with parallel edges (multiple edges between same nodes).

```python
def find_bridges_with_edge_ids(n, edges):
    """
    Track edges by ID to handle parallel edges correctly.
    """
    graph = [[] for _ in range(n)]  # (neighbor, edge_id)
    for i, (u, v) in enumerate(edges):
        graph[u].append((v, i))
        graph[v].append((u, i))
    
    disc = [-1] * n
    low = [-1] * n
    bridges = []
    time = [0]
    
    def dfs(u, parent_edge):
        disc[u] = low[u] = time[0]
        time[0] += 1
        
        for v, edge_id in graph[u]:
            if edge_id == parent_edge:
                continue
            if disc[v] == -1:
                dfs(v, edge_id)
                low[u] = min(low[u], low[v])
                if low[v] > disc[u]:
                    bridges.append(edge_id)
            else:
                low[u] = min(low[u], disc[v])
    
    for i in range(n):
        if disc[i] == -1:
            dfs(i, -1)
    
    return bridges
```

---

### Form 5: Weighted Graphs (Minimum Spanning Tree context)

Finding bridges when edge weights matter.

| Variation | Approach |
|-----------|----------|
| **Unweighted** | Standard Tarjan's |
| **Weighted (all bridges)** | Tarjan's ignores weights |
| **Minimum weight bridge** | Find all bridges, then min weight |
| **Critical in MST** | Bridge in original graph = always in some MST |

```python
def is_bridge_critical_in_mst(graph, u, v, weight):
    """
    A bridge is always included in any MST.
    Non-bridge edges may or may not be in MST.
    """
    bridges = set(tuple(sorted(b)) for b in find_bridges_only(graph))
    return tuple(sorted([u, v])) in bridges
```

---

### Forms Summary

| Form | Input | Output | Special Handling |
|------|-------|--------|------------------|
| Standard | Adjacency list | Both bridges & APs | Full algorithm |
| Bridges Only | Adjacency list | Just bridges | Simpler, no children count |
| APs Only | Adjacency list | Just APs | No bridge list needed |
| Edge List | List of edges | Bridges/APs | Convert to adjacency list |
| With Edge IDs | Edges with IDs | Edge IDs | Handle parallel edges |

<!-- back -->
