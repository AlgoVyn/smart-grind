## Title: Union Find (Union by Rank) - Forms

What are the different manifestations of Union-Find?

<!-- front -->

---

### Form 1: Basic Connectivity

Simple union and find operations without additional data.

| Operation | Use Case | Complexity |
|-----------|----------|------------|
| union(x, y) | Connect two elements | O(α(n)) |
| find(x) | Get representative | O(α(n)) |
| connected(x, y) | Check if in same set | O(α(n)) |

---

### Form 2: Component Tracking

Track number of components and their sizes.

| Query | Information | Update Strategy |
|-------|-------------|-----------------|
| get_num_components() | Count of disjoint sets | Decrement on successful union |
| get_component_size(x) | Size of x's component | Track size at root |
| get_largest_component() | Maximum size | Compare during union |

---

### Form 3: Weighted Union-Find

Track additional weights or properties.

```
Union-Find with:
- parent[]: parent pointers
- rank[]: tree heights
- weight[]: edge weights to parent
- diff[]: difference from root
```

**Example:** Equation solving with union-find.

---

### Form 4: Dynamic Graph Connectivity

Handle dynamic additions of edges.

| Operation | Dynamic? | Notes |
|-----------|----------|-------|
| add_edge(u, v) | Yes | Union operation |
| remove_edge(u, v) | No | Requires rebuilding or advanced DS |
| query(u, v) | Yes | Connected check |

**Note:** Standard Union-Find doesn't support edge deletion efficiently.

---

### Form 5: 2D Grid Union-Find

For grid-based problems like Number of Islands II.

```python
class UnionFind2D:
    """Union-Find for 2D grid converted to 1D index."""
    
    def __init__(self, rows, cols):
        self.rows = rows
        self.cols = cols
        self.uf = UnionFind(rows * cols)
    
    def _index(self, r, c):
        return r * self.cols + c
    
    def union(self, r1, c1, r2, c2):
        self.uf.union(self._index(r1, c1), self._index(r2, c2))
    
    def connected(self, r1, c1, r2, c2):
        return self.uf.connected(self._index(r1, c1), self._index(r2, c2))
```

<!-- back -->
