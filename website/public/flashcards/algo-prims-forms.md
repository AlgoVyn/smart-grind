## Prim's Algorithm: Forms & Variations

What are the different forms and variations of Prim's algorithm?

<!-- front -->

---

### Form 1: Dense Graph (Array Implementation)

```python
def prim_dense(graph):
    """
    For dense graphs (E ≈ V²).
    Time: O(V²), Space: O(V).
    """
    n = len(graph)
    in_mst = [False] * n
    min_edge = [float('inf')] * n
    parent = [-1] * n
    
    min_edge[0] = 0  # Start from vertex 0
    
    for _ in range(n):
        # Find minimum edge vertex not in MST
        v = -1
        for i in range(n):
            if not in_mst[i] and (v == -1 or min_edge[i] < min_edge[v]):
                v = i
        
        in_mst[v] = True
        
        # Update edges from v
        for to in range(n):
            if not in_mst[to] and graph[v][to] < min_edge[to]:
                min_edge[to] = graph[v][to]
                parent[to] = v
    
    return parent, min_edge
```

---

### Form 2: Sparse Graph (Heap Implementation)

```python
import heapq

def prim_sparse(graph, n):
    """
    For sparse graphs (E << V²).
    graph: adjacency list {v: [(to, weight), ...]}
    Time: O(E log V)
    """
    in_mst = [False] * n
    min_heap = [(0, 0, -1)]  # (weight, vertex, parent)
    mst_edges = []
    total_weight = 0
    edges_used = 0
    
    while min_heap and edges_used < n:
        weight, v, parent = heapq.heappop(min_heap)
        
        if in_mst[v]:
            continue
        
        in_mst[v] = True
        if parent != -1:
            mst_edges.append((parent, v, weight))
            total_weight += weight
            edges_used += 1
        
        for to, w in graph[v]:
            if not in_mst[to]:
                heapq.heappush(min_heap, (w, to, v))
    
    return mst_edges, total_weight
```

---

### Form 3: Maximum Spanning Tree

```python
def prim_maximum(graph, n):
    """
    Find maximum spanning tree (negate weights or reverse comparison).
    """
    in_mst = [False] * n
    max_heap = [(0, 0, -1)]  # Use max heap or negate
    
    # In Python: use min heap with negated weights
    max_heap = [(0, 0, -1)]
    total = 0
    
    while max_heap:
        neg_weight, v, parent = heapq.heappop(max_heap)
        weight = -neg_weight
        
        if in_mst[v]:
            continue
        
        in_mst[v] = True
        total += weight
        
        for to, w in graph[v]:
            if not in_mst[to]:
                heapq.heappush(max_heap, (-w, to, v))
    
    return total
```

---

### Form 4: Second Best MST

```python
def second_best_mst(graph, n):
    """
    Find second minimum spanning tree.
    Replace each MST edge and find best alternative.
    """
    # First find MST
    mst_edges, _ = prim_sparse(graph, n)
    mst_set = set((min(u, v), max(u, v)) for u, v, _ in mst_edges)
    
    # Build MST adjacency list
    mst_adj = [[] for _ in range(n)]
    for u, v, w in mst_edges:
        mst_adj[u].append((v, w))
        mst_adj[v].append((u, w))
    
    # For each non-MST edge, try to add it (creates cycle)
    # Remove maximum edge on cycle path in MST
    second_best = float('inf')
    
    for u in range(n):
        for v, w in graph[u]:
            if u < v and (u, v) not in mst_set:
                # Find max edge on path u->v in MST
                max_on_path = find_max_edge_on_path(mst_adj, u, v)
                new_weight = w - max_on_path
                second_best = min(second_best, total_mst + new_weight)
    
    return second_best
```

---

### Form 5: MST with Specific Start/End

```python
def constrained_mst(graph, n, must_include):
    """
    MST that must include specific edges.
    Add those edges first, then run Prim on components.
    """
    # Union-Find to track components
    parent = list(range(n))
    
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    
    def union(x, y):
        parent[find(x)] = find(y)
    
    mst_edges = []
    total = 0
    
    # First add mandatory edges
    for u, v, w in must_include:
        if find(u) != find(v):
            union(u, v)
            mst_edges.append((u, v, w))
            total += w
    
    # Run Kruskal/Prim on remaining edges
    # considering only edges between different components
    
    return mst_edges, total
```

<!-- back -->
