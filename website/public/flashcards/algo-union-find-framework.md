## Title: Union-Find - Framework

What is the standard framework for implementing Union-Find?

<!-- front -->

---

### Union-Find Framework

```python
class UnionFind:
    def __init__(self, n):
        # parent[i] = representative of set containing i
        self.parent = list(range(n))
        # rank/size for union optimization
        self.rank = [0] * n
        # Optional: track set properties
        self.count = n  # Number of disjoint sets
        self.size = [1] * n  # Size of each set
    
    def find(self, x):
        """Find with path compression"""
        if self.parent[x] != x:
            # Recursively compress path
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        """Union by rank/size"""
        px, py = self.find(x), self.find(y)
        if px == py:
            return False  # Already connected
        
        # Union by rank: attach smaller rank under larger
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        
        self.parent[py] = px
        self.size[px] += self.size[py]
        
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        
        self.count -= 1
        return True
    
    def connected(self, x, y):
        return self.find(x) == self.find(y)
    
    def get_size(self, x):
        return self.size[self.find(x)]
```

---

### Optimization Comparison

| Optimization | Without | With | Benefit |
|--------------|---------|------|---------|
| **Path Compression** | O(n) find | O(α(n)) find | Flattens tree structure |
| **Union by Rank** | O(n) union | O(α(n)) union | Keeps trees shallow |
| **Both** | O(n) | O(α(n)) ~ O(1) | Amortized optimal |

---

### State Tracking Extensions

```python
# Additional tracking for specific problems

class UnionFindWithMax(UnionFind):
    def __init__(self, n):
        super().__init__(n)
        self.max_val = list(range(n))  # Max in each set
    
    def union(self, x, y):
        if super().union(x, y):
            px = self.find(x)
            self.max_val[px] = max(
                self.max_val[self.find(x)],
                self.max_val[self.find(y)]
            )

class UnionFindWithEdges(UnionFind):
    def __init__(self, n):
        super().__init__(n)
        self.edges = [0] * n  # Edge count in component
    
    def union(self, x, y):
        if not super().union(x, y):
            # Same set - adds internal edge
            self.edges[self.find(x)] += 1
```

---

### Initialization Variations

| Scenario | Initialization |
|----------|---------------|
| **0..n-1 indices** | `parent = list(range(n))` |
| **Custom objects** | Use hash map: `parent = {obj: obj}` |
| **2D grid** | Flatten: `id = r * cols + c` |
| **Unknown size** | Start empty, add with `make_set(x)` |

```python
# 2D Grid Flattening
def get_id(r, c, cols):
    return r * cols + c

# Make UnionFind for grid
uf = UnionFind(rows * cols)
# Union neighbors
for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:
    nr, nc = r + dr, c + dc
    if in_bounds(nr, nc):
        uf.union(get_id(r,c), get_id(nr,nc))
```

<!-- back -->
