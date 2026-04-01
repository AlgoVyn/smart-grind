## Title: Union-Find - Comparison Guide

How does Union-Find compare to other connectivity and graph algorithms?

<!-- front -->

---

### Connectivity Algorithm Comparison

| Algorithm | Connect | Connected? | Components | Space | Use Case |
|-----------|---------|------------|------------|-------|----------|
| **DFS/BFS** | O(1)* | O(V+E) | O(V+E) | O(V) | One-time query |
| **Adjacency Matrix** | O(1) | O(1) | O(V²) | O(V²) | Dense graphs |
| **Union-Find** | O(α(n)) | O(α(n)) | O(1) | O(V) | Dynamic connectivity |
| **Link-Cut Tree** | O(log n) | O(log n) | O(log n) | O(V) | Dynamic trees |

**α(n) = inverse Ackermann, effectively constant**

*Adjacency list modifications are O(1) but query is O(V+E)

---

### Union-Find vs Graph Traversal

| Aspect | Union-Find | DFS/BFS |
|--------|------------|---------|
| **Build time** | O(n) init | O(V+E) per traversal |
| **Query time** | O(α(n)) | O(V+E) |
| **Dynamic** | Yes (online) | No (offline) |
| **Path info** | No | Yes |
| **Cycle detection** | Yes (union check) | Yes (visited check) |

```python
# Dynamic connectivity: Union-Find wins
uf = UnionFind(n)
for edge in stream:
    uf.union(edge.u, edge.v)  # O(α(n)) each
    if uf.connected(a, b):    # O(α(n))
        print("Connected!")

# vs DFS (must rebuild each time)
for edge in stream:
    graph.add_edge(edge)
    visited = dfs(graph, a)   # O(V+E)
    if b in visited:
        print("Connected!")
```

---

### Union-Find Optimizations Comparison

| Optimization | Without | With | Amortized |
|--------------|---------|------|-----------|
| **None** | O(n) find/union | — | O(n) |
| **Path compression** | O(n) | O(log n) | O(α(n)) |
| **Union by rank/size** | O(n) | O(log n) | O(α(n)) |
| **Both** | O(n) | O(α(n)) | O(α(n)) |

```python
# Naive: tree can become chain
# find: O(n), union: O(n)

# Path compression only
# find: O(log n) amortized

def find(self, x):
    if self.parent[x] != x:
        self.parent[x] = self.find(self.parent[x])  # Compress
    return self.parent[x]

# Union by rank + path compression
# Both: O(α(n)) - effectively constant
```

---

### MST Algorithm Comparison

| Algorithm | Time | Space | Negative Edges | Best For |
|-----------|------|-------|----------------|----------|
| **Kruskal's** | O(E log E) | O(V) | No* | Sparse graphs |
| **Prim's (binary heap)** | O(E log V) | O(V) | No | Dense graphs |
| **Prim's (Fibonacci)** | O(E + V log V) | O(V) | No | Very large V |
| **Borůvka's** | O(E log V) | O(V) | No | Parallel/distributed |

*Union-Find in Kruskal's handles negative edges but MST undefined with negative cycles

```python
# Kruskal's with Union-Find
def kruskal(n, edges):
    edges.sort()  # O(E log E)
    uf = UnionFind(n)
    mst = []
    
    for w, u, v in edges:
        if uf.union(u, v):  # O(α(n))
            mst.append((u, v, w))
    
    return mst

# Prim's with heap
def prim(n, graph):
    import heapq
    visited = [False] * n
    min_heap = [(0, 0)]  # (weight, node)
    mst_weight = 0
    
    while min_heap:
        w, u = heapq.heappop(min_heap)
        if visited[u]:
            continue
        visited[u] = True
        mst_weight += w
        
        for v, weight in graph[u]:
            if not visited[v]:
                heapq.heappush(min_heap, (weight, v))
```

---

### When to Use Union-Find

| Scenario | Use Union-Find? | Alternative |
|----------|-----------------|-------------|
| **Dynamic connectivity** | ✓ Yes | — |
| **Offline queries** | Maybe | DFS/BFS if few queries |
| **Need actual path** | ✗ No | DFS/BFS with parent tracking |
| **Cycle detection while building** | ✓ Yes | DFS with state tracking |
| **MST construction** | ✓ Yes (Kruskal) | Prim's for dense |
| **2D grid connectivity** | ✓ Yes | BFS for single query |
| **Component size queries** | ✓ Yes | — |

---

### Union-Find vs BFS for Grid Problems

| Problem | Union-Find | BFS |
|---------|------------|-----|
| **Number of islands (single)** | Build all, count | Single BFS |
| **Number of islands (multiple adds)** | ✓ Perfect | Recompute each time |
| **Largest island** | Track with UF | BFS each component |
| **Connected regions after cuts** | Reverse UF | Hard |

```python
# Dynamic islands: Union-Find shines
class DynamicIslands:
    def __init__(self, m, n):
        self.uf = UnionFind(m * n + 1)  # +1 for dummy boundary
        self.grid = [[0] * n for _ in range(m)]
    
    def add_land(self, r, c):
        if self.grid[r][c]:
            return self.uf.count - 1
        
        self.grid[r][c] = 1
        self.uf.count += 1  # New island
        
        for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n and self.grid[nr][nc]:
                if self.uf.union(r*n+c, nr*n+nc):
                    self.uf.count -= 1
        
        return self.uf.count - 1
```

<!-- back -->
