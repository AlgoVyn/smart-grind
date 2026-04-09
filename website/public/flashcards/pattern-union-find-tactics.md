## Graph - Union-Find (DSU): Tactics

What are the advanced techniques for Union-Find?

<!-- front -->

---

### Tactic 1: Kruskal's MST Implementation

```python
def kruskal_mst(n, edges):
    """
    Find MST using Kruskal's algorithm.
    edges: [(weight, u, v), ...]
    """
    # Sort edges by weight
    edges.sort()  # Sorts by first element (weight)
    
    uf = UnionFind(n)
    mst_weight = 0
    mst_edges = []
    
    for weight, u, v in edges:
        if not uf.connected(u, v):
            uf.union(u, v)
            mst_weight += weight
            mst_edges.append((u, v))
            
            if len(mst_edges) == n - 1:  # MST complete
                break
    
    return mst_weight, mst_edges
```

---

### Tactic 2: Cycle Detection

```python
def has_cycle_undirected(n, edges):
    """Detect cycle in undirected graph using Union-Find."""
    uf = UnionFind(n)
    
    for u, v in edges:
        if uf.connected(u, v):
            return True  # Cycle found!
        uf.union(u, v)
    
    return False
```

**Note**: This doesn't work for directed graphs!

---

### Tactic 3: Count Connected Components

```python
def count_components(n, edges):
    """Count number of connected components."""
    uf = UnionFind(n)
    
    for u, v in edges:
        uf.union(u, v)
    
    return uf.get_count()

# Alternative: Count unique roots
# return len(set(uf.find(i) for i in range(n)))
```

---

### Tactic 4: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|----- |
| No path compression | O(n) find | Always implement compression |
| Wrong union direction | Unbalanced trees | Union by rank/size |
| Using for directed graphs | Wrong results | Use graph DFS for directed cycles |
| Forgetting to initialize | Wrong parent | `self.parent = list(range(n))` |
| Counting self as cycle | False positive | Skip before union, not after |

---

### Tactic 5: Offline Queries

```python
def offline_queries(n, edges, queries):
    """Process edge additions and connectivity queries offline."""
    # Sort queries by time
    # Process in reverse (delete = add in reverse)
    
    # Or use DSU with rollback (advanced)
    pass
```

---

### Tactic 6: 2D Grid Union-Find

```python
class GridUnionFind:
    """Union-Find for 2D grid using coordinate mapping."""
    def __init__(self, m, n):
        self.m = m
        self.n = n
        self.uf = UnionFind(m * n)
    
    def index(self, r, c):
        """Convert 2D coordinate to 1D index."""
        return r * self.n + c
    
    def union_cells(self, r1, c1, r2, c2):
        """Union two grid cells."""
        self.uf.union(self.index(r1, c1), self.index(r2, c2))
    
    def connected_cells(self, r1, c1, r2, c2):
        """Check if two cells are connected."""
        return self.uf.connected(self.index(r1, c1), self.index(r2, c2))
```

---

### Tactic 7: Union-Find with Component Size

```python
class UnionFindWithSize:
    """Track size of each component."""
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        root_x, root_y = self.find(x), self.find(y)
        if root_x == root_y:
            return False
        
        if self.size[root_x] < self.size[root_y]:
            root_x, root_y = root_y, root_x
        
        self.parent[root_y] = root_x
        self.size[root_x] += self.size[root_y]
        return True
    
    def get_size(self, x):
        """Get size of component containing x."""
        return self.size[self.find(x)]
```

<!-- back -->
