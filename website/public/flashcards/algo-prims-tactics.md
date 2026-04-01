## Prim's Algorithm: Tactics & Techniques

What are the tactical patterns for Prim's algorithm?

<!-- front -->

---

### Tactic 1: Choose Implementation by Density

| Graph Density | Implementation | Time |
|---------------|----------------|------|
| E ≈ V² (dense) | Array + linear scan | O(V²) |
| E << V² (sparse) | Binary heap | O(E log V) |
| E ≈ V log V | Binary heap | O(E log V) |

```python
def auto_prim(graph, n):
    """Auto-select implementation based on density"""
    if isinstance(graph, list) and isinstance(graph[0], list):
        # Adjacency matrix = dense
        return prim_dense(graph)
    else:
        # Adjacency list = sparse
        return prim_sparse(graph, n)
```

---

### Tactic 2: Handle Disconnected Graphs

```python
def prim_forest(graph, n):
    """
    Find MST for each connected component.
    """
    visited = [False] * n
    forests = []
    
    for start in range(n):
        if visited[start]:
            continue
        
        # Run Prim from unvisited node
        mst, weight = prim_from_node(graph, n, start, visited)
        forests.append((mst, weight))
    
    return forests
```

---

### Tactic 3: Early Termination

```python
def prim_to_target(graph, n, target_nodes):
    """
    Stop when all target nodes are connected.
    """
    in_mst = [False] * n
    heap = [(0, start, -1)]  # Start from some node in targets
    connected_targets = set()
    
    while heap and len(connected_targets) < len(target_nodes):
        w, v, p = heapq.heappop(heap)
        if in_mst[v]:
            continue
        
        in_mst[v] = True
        if v in target_nodes:
            connected_targets.add(v)
        
        for to, weight in graph[v]:
            if not in_mst[to]:
                heapq.heappush(heap, (weight, to, v))
```

---

### Tactic 4: Parallel Edges Handling

```python
def prim_with_parallel_edges(edge_list, n):
    """
    Handle multiple edges between same vertices.
    Keep only minimum weight edge.
    """
    from collections import defaultdict
    min_edge = defaultdict(lambda: float('inf'))
    
    for u, v, w in edge_list:
        key = (min(u, v), max(u, v))
        min_edge[key] = min(min_edge[key], w)
    
    # Build graph with only minimum edges
    graph = [[] for _ in range(n)]
    for (u, v), w in min_edge.items():
        graph[u].append((v, w))
        graph[v].append((u, w))
    
    return prim_sparse(graph, n)
```

---

### Tactic 5: MST with Vertex Weights

```python
def prim_vertex_weights(graph, vertex_cost, n):
    """
    MST where activating a vertex has cost.
    Add dummy node connected to all vertices.
    """
    # Create extended graph with dummy node n
    extended = [row[:] for row in graph]
    extended.append([])  # Dummy node
    
    for v in range(n):
        extended[v].append((n, vertex_cost[v]))
        extended[n].append((v, vertex_cost[v]))
    
    mst, total = prim_sparse(extended, n + 1)
    return mst, total
```

<!-- back -->
