## Union-Find (Disjoint Set Union - DSU): Framework

What is the complete code template for Union-Find with path compression and union by rank?

<!-- front -->

---

### Framework: Union-Find Data Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│  UNION-FIND (DSU) - TEMPLATE                                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  1. Initialize:                                                         │
│     - parent[i] = i  (each node is its own parent)                  │
│     - rank[i] = 0    (or size[i] = 1)                               │
│     - count = n      (number of components)                         │
│                                                                       │
│  2. Find(x):                                                          │
│     - if parent[x] != x:                                              │
│         parent[x] = find(parent[x])  ← Path compression             │
│     - return parent[x]                                                │
│                                                                       │
│  3. Union(x, y):                                                      │
│     - rootX = find(x), rootY = find(y)                                │
│     - if rootX == rootY: return False  (already connected)          │
│     - Union by rank:                                                  │
│       - if rank[rootX] < rank[rootY]: parent[rootX] = rootY          │
│       - elif rank[rootX] > rank[rootY]: parent[rootY] = rootX       │
│       - else: parent[rootY] = rootX; rank[rootX]++                  │
│     - count--                                                         │
│     - return True                                                     │
│                                                                       │
│  4. Connected(x, y):                                                  │
│     - return find(x) == find(y)                                       │
│                                                                       │
│  5. Time: O(α(n)) per operation, Space: O(n)                        │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Implementation: Union-Find Class

```python
class UnionFind:
    """
    Union-Find with path compression and union by rank.
    Time: O(α(n)) per operation, Space: O(n)
    """
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.count = n  # Number of components
    
    def find(self, x):
        """Find with path compression."""
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        """Union by rank. Returns True if merged, False if already connected."""
        root_x = self.find(x)
        root_y = self.find(y)
        
        if root_x == root_y:
            return False  # Already connected
        
        # Attach smaller tree to larger tree
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
        
        self.count -= 1
        return True
    
    def connected(self, x, y):
        """Check if x and y are in the same set."""
        return self.find(x) == find(y)
    
    def get_count(self):
        """Return number of connected components."""
        return self.count
```

---

### Alternative: Union by Size

```python
class UnionFindBySize:
    """
    Union-Find with union by size (often more intuitive).
    Time: O(α(n)) per operation, Space: O(n)
    """
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n  # Track actual component size
        self.count = n
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        root_x = self.find(x)
        root_y = self.find(y)
        
        if root_x == root_y:
            return False
        
        # Attach smaller tree to larger tree
        if self.size[root_x] < self.size[root_y]:
            root_x, root_y = root_y, root_x
        
        self.parent[root_y] = root_x
        self.size[root_x] += self.size[root_y]
        self.count -= 1
        return True
    
    def get_size(self, x):
        """Return size of component containing x."""
        return self.size[self.find(x)]
```

---

### Common Problem Templates

**Count Connected Components:**
```python
def count_components(n, edges):
    """Count connected components after adding edges."""
    uf = UnionFind(n)
    for u, v in edges:
        uf.union(u, v)
    return uf.get_count()
```

**Detect Redundant Connection (Cycle):**
```python
def find_redundant_connection(edges):
    """Find edge that creates a cycle."""
    n = len(edges)
    uf = UnionFind(n + 1)  # 1-indexed nodes
    
    for u, v in edges:
        if uf.connected(u, v):
            return [u, v]
        uf.union(u, v)
    
    return []
```

**Check if Graph is Valid Tree:**
```python
def valid_tree(n, edges):
    """Graph is valid tree iff: n-1 edges and all connected."""
    if len(edges) != n - 1:
        return False
    
    uf = UnionFind(n)
    for u, v in edges:
        uf.union(u, v)
    
    return uf.get_count() == 1
```

---

### Key Framework Elements

| Element | Purpose | Pattern |
|---------|---------|---------|
| `parent[]` | Tree parent pointers | Points to set representative |
| `rank[]` / `size[]` | Tree balancing | Keeps trees flat for O(α(n)) |
| `count` | Component tracking | Decrement on successful union |
| Path compression | Flatten tree | Update parent[x] to root during find |
| Union by rank/size | Balance trees | Attach smaller to larger |

---

### Complexity Summary

| Operation | Time | Notes |
|-----------|------|-------|
| `find()` | O(α(n)) ≈ O(1) | Inverse Ackermann function |
| `union()` | O(α(n)) ≈ O(1) | Two finds + constant work |
| `connected()` | O(α(n)) ≈ O(1) | Two finds |
| Space | O(n) | Parent and rank arrays |

<!-- back -->
