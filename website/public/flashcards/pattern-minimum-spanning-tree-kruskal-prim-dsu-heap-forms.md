## Minimum Spanning Tree (Kruskal/Prim/DSU/Heap): Forms

What are the different variations of MST problems?

<!-- front -->

---

### Form 1: Standard MST (Edge List)

Classic MST with explicit edge list input.

```python
def min_cost_connect_points(points):
    """
    LeetCode 1584: Connect all points with minimum cost.
    Use Manhattan distance as edge weights.
    """
    n = len(points)
    edges = []
    
    # Build all edges with Manhattan distance
    for i in range(n):
        for j in range(i + 1, n):
            dist = abs(points[i][0] - points[j][0]) + \
                   abs(points[i][1] - points[j][1])
            edges.append((i, j, dist))
    
    # Kruskal's algorithm
    edges.sort(key=lambda x: x[2])
    uf = UnionFind(n)
    total = 0
    edges_used = 0
    
    for u, v, w in edges:
        if uf.union(u, v):
            total += w
            edges_used += 1
            if edges_used == n - 1:
                break
    
    return total
```

---

### Form 2: MST with Virtual Node

Add a virtual node to represent external connections (wells, power stations).

```python
def min_cost_to_supply_water(n, wells, pipes):
    """
    LeetCode 1168: Build wells OR connect with pipes.
    Virtual node 0: edge (0, i) represents building well at house i.
    """
    # edges: (u, v, cost)
    edges = pipes[:]  # Copy pipes
    
    # Add virtual edges for wells
    for i in range(1, n + 1):
        edges.append((0, i, wells[i - 1]))
    
    # Run Kruskal on n+1 nodes (0 to n)
    edges.sort(key=lambda x: x[2])
    uf = UnionFind(n + 1)  # n + 1 for virtual node
    total = 0
    edges_used = 0
    
    for u, v, w in edges:
        if uf.union(u, v):
            total += w
            edges_used += 1
            if edges_used == n:  # Need n edges for n houses
                break
    
    return total
```

---

### Form 3: Maximum Spanning Tree

Find spanning tree with MAXIMUM total weight.

```python
def max_st_product(n, edges):
    """
    Find spanning tree maximizing some property.
    Same as MST but sort descending.
    """
    # Sort in DESCENDING order for maximum
    edges.sort(key=lambda x: x[2], reverse=True)
    
    uf = UnionFind(n)
    mst = []
    total = 0
    
    for u, v, w in edges:
        if uf.union(u, v):
            mst.append((u, v, w))
            total += w
            if len(mst) == n - 1:
                break
    
    return total, mst


# Alternative: MST with transformed weights
def max_st_via_negation(n, edges):
    """
    Another approach: negate weights and find MST.
    """
    neg_edges = [(u, v, -w) for u, v, w in edges]
    neg_edges.sort(key=lambda x: x[2])  # Sort ascending (most negative first)
    
    uf = UnionFind(n)
    total = 0
    
    for u, v, w in neg_edges:
        if uf.union(u, v):
            total += w  # w is negative
    
    return -total  # Return positive
```

---

### Form 4: Critical and Pseudo-Critical Edges

Identify edges that appear in all, some, or no MSTs.

```python
def find_critical_and_pseudo_critical_edges(n, edges):
    """
    LeetCode 1489: Classify edges by their MST participation.
    """
    def kruskal(n, edges, skip_edge=None, force_edge=None):
        """Helper with skip/force options."""
        uf = UnionFind(n)
        total = 0
        edges_used = 0
        
        if force_edge is not None:
            u, v, w = edges[force_edge]
            if uf.union(u, v):
                total += w
                edges_used += 1
        
        for i, (u, v, w) in enumerate(edges):
            if i == skip_edge:
                continue
            if uf.union(u, v):
                total += w
                edges_used += 1
        
        return total if edges_used == n - 1 else float('inf')
    
    # Sort edges with original indices
    indexed_edges = [(w, u, v, i) for i, (u, v, w) in enumerate(edges)]
    indexed_edges.sort()
    sorted_edges = [(u, v, w) for w, u, v, i in indexed_edges]
    index_map = {new: old for new, (w, u, v, old) in enumerate(indexed_edges)}
    
    base_mst = kruskal(n, sorted_edges)
    
    critical = []
    pseudo = []
    
    for new_idx in range(len(sorted_edges)):
        old_idx = index_map[new_idx]
        
        # Test without this edge
        without = kruskal(n, sorted_edges, skip_edge=new_idx)
        if without > base_mst:
            critical.append(old_idx)
            continue
        
        # Test with forced inclusion
        with_forced = kruskal(n, sorted_edges, force_edge=new_idx)
        if with_forced == base_mst:
            pseudo.append(old_idx)
    
    return [critical, pseudo]
```

---

### Form 5: Prim's for Dense Graphs

Optimize for dense graphs where E ≈ V².

```python
def prim_dense_matrix(n, adj_matrix):
    """
    Prim's for dense graphs using array instead of heap.
    Time: O(V²), Space: O(V)
    Better than O(E log V) when E ≈ V².
    """
    visited = [False] * n
    # min_edge[i] = minimum edge weight to connect i to MST
    min_edge = [float('inf')] * n
    min_edge[0] = 0  # Start from node 0
    
    total = 0
    
    for _ in range(n):
        # Find unvisited node with minimum edge weight
        u = -1
        for i in range(n):
            if not visited[i] and (u == -1 or min_edge[i] < min_edge[u]):
                u = i
        
        if min_edge[u] == float('inf'):
            break  # Graph disconnected
        
        visited[u] = True
        total += min_edge[u]
        
        # Update min_edge for all neighbors
        for v in range(n):
            if not visited[v] and adj_matrix[u][v] > 0:
                min_edge[v] = min(min_edge[v], adj_matrix[u][v])
    
    return total


def prim_dense_points(points):
    """
    Prim's for points without building full edge list.
    Compute distances on-the-fly.
    """
    n = len(points)
    visited = [False] * n
    min_dist = [float('inf')] * n
    min_dist[0] = 0
    
    total = 0
    
    for _ in range(n):
        # Find closest unvisited point
        u = -1
        for i in range(n):
            if not visited[i] and (u == -1 or min_dist[i] < min_dist[u]):
                u = i
        
        visited[u] = True
        total += min_dist[u]
        
        # Update distances to all unvisited points
        for v in range(n):
            if not visited[v]:
                dist = abs(points[u][0] - points[v][0]) + \
                       abs(points[u][1] - points[v][1])
                min_dist[v] = min(min_dist[v], dist)
    
    return total
```

---

### Form 6: MST with Existing Connections

Some edges are already built (cost = 0 or pre-connected).

```python
def mst_with_existing(n, edges, already_connected):
    """
    Some nodes are already connected (e.g., from previous MST).
    already_connected: list of (u, v) pairs already connected.
    """
    uf = UnionFind(n)
    mst_edges = []
    total = 0
    
    # First, union all already-connected pairs
    for u, v in already_connected:
        uf.union(u, v)
    
    # Run Kruskal on remaining edges
    edges.sort(key=lambda x: x[2])
    
    for u, v, w in edges:
        if uf.union(u, v):
            mst_edges.append((u, v, w))
            total += w
    
    return total, mst_edges


def mst_additional_cost(n, edges, existing_mst):
    """
    Find cost to add a new node to existing MST.
    """
    # existing_mst is the current tree
    # New node n has edges to some existing nodes
    # Find minimum edge from new node to any node in MST
    
    new_edges = [(u, v, w) for u, v, w in edges if u == n or v == n]
    if not new_edges:
        return float('inf')  # Cannot connect
    
    return min(w for u, v, w in new_edges)
```

---

### Form Comparison

| Form | Key Feature | Algorithm | Time |
|------|-------------|-----------|------|
| Standard MST | Edge list input | Kruskal | O(E log E) |
| Virtual node | External connection option | Kruskal | O(E log E) |
| Maximum ST | Maximize instead of minimize | Kruskal (reverse sort) | O(E log E) |
| Critical edges | Edge classification | Multiple Kruskal runs | O(E² α(V)) |
| Dense graph | Adjacency matrix | Prim (Array) | O(V²) |
| Existing connections | Some edges pre-built | Modified Kruskal | O(E log E) |
| Points (no edges) | Build edges from coordinates | Kruskal or Prim | O(V² log V) or O(V²) |

---

### Form 7: Kruskal with Path Compression Optimization

Optimized Union-Find with both path compression and union by rank.

```python
class OptimizedUnionFind:
    """Fully optimized for competitive programming."""
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.components = n  # Track component count
    
    def find(self, x):
        # Iterative path compression (faster than recursive)
        root = x
        while self.parent[root] != root:
            root = self.parent[root]
        
        # Compress path
        while x != root:
            parent = self.parent[x]
            self.parent[x] = root
            x = parent
        
        return root
    
    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py:
            return False
        
        # Union by rank
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        
        self.components -= 1
        return True
    
    def connected(self, x, y):
        return self.find(x) == self.find(y)
```

<!-- back -->
