## Graph - Union Find (DSU): Forms

What are the different variations of Union-Find applications?

<!-- front -->

---

### Form 1: Number of Connected Components

```python
def count_components(n, edges):
    """Count connected components in undirected graph."""
    uf = UnionFind(n)
    
    for u, v in edges:
        uf.union(u, v)
    
    return uf.count()
```

---

### Form 2: Detect Cycle in Undirected Graph

```python
def has_cycle(n, edges):
    """Return True if undirected graph has a cycle."""
    uf = UnionFind(n)
    
    for u, v in edges:
        if uf.connected(u, v):
            return True  # Edge connects already connected nodes → cycle
        uf.union(u, v)
    
    return False
```

---

### Form 3: Kruskal's MST

```python
def kruskal_mst(n, edges):
    """Find minimum spanning tree using Kruskal's algorithm."""
    # edges: list of (cost, u, v)
    edges.sort()  # Sort by cost
    
    uf = UnionFind(n)
    mst_cost = 0
    mst_edges = []
    
    for cost, u, v in edges:
        if uf.union(u, v):  # If union performed (not already connected)
            mst_cost += cost
            mst_edges.append((u, v))
        
        if len(mst_edges) == n - 1:  # MST complete
            break
    
    return mst_cost, mst_edges
```

---

### Form 4: Grid/2D Union-Find

```python
class GridUnionFind:
    """Union-Find for m x n grid (convert 2D to 1D index)."""
    
    def __init__(self, m, n):
        self.m = m
        self.n = n
        self.uf = UnionFind(m * n)
    
    def index(self, row, col):
        """Convert 2D coordinates to 1D index."""
        return row * self.n + col
    
    def union_cells(self, r1, c1, r2, c2):
        """Union two cells."""
        self.uf.union(self.index(r1, c1), self.index(r2, c2))
    
    def connected_cells(self, r1, c1, r2, c2):
        """Check if two cells are connected."""
        return self.uf.connected(self.index(r1, c1), self.index(r2, c2))
```

---

### Form Comparison

| Form | Application | Key Method |
|------|-------------|------------|
| Count Components | Network analysis | `count()` |
| Cycle Detection | Redundant connection | `connected()` check before union |
| Kruskal's MST | Minimum spanning tree | Sort edges + union check |
| Grid Union-Find | Image processing, islands | 2D to 1D index conversion |

<!-- back -->
