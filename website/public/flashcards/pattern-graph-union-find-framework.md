## Graph - Union Find (DSU): Framework

What is the complete code template for Union-Find (Disjoint Set Union)?

<!-- front -->

---

### Framework 1: Union-Find with Path Compression & Union by Rank

```
┌─────────────────────────────────────────────────────┐
│  UNION-FIND (DSU) - TEMPLATE                        │
├─────────────────────────────────────────────────────┤
│  class UnionFind:                                   │
│    1. __init__(n):                                  │
│       - parent = [0,1,2,...,n-1]                   │
│       - rank = [0] * n (or size = [1] * n)         │
│                                                      │
│    2. find(x):                                      │
│       - If parent[x] != x:                         │
│          parent[x] = find(parent[x])  # Path compression│
│       - Return parent[x]                            │
│                                                      │
│    3. union(x, y):                                  │
│       - root_x = find(x), root_y = find(y)         │
│       - If root_x == root_y: return (already connected)│
│       - If rank[root_x] < rank[root_y]:            │
│            swap root_x, root_y                      │
│       - parent[root_y] = root_x                     │
│       - If same rank: rank[root_x] += 1             │
│       - Return True (union performed)               │
│                                                      │
│    4. connected(x, y):                              │
│       - Return find(x) == find(y)                   │
│                                                      │
│    5. count():                                      │
│       - Return number of distinct roots             │
└─────────────────────────────────────────────────────┘
```

---

### Implementation

```python
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.components = n
    
    def find(self, x):
        """Find root with path compression."""
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        """Union by rank. Returns True if merged, False if already connected."""
        root_x = self.find(x)
        root_y = self.find(y)
        
        if root_x == root_y:
            return False
        
        # Attach smaller rank tree under larger rank tree
        if self.rank[root_x] < self.rank[root_y]:
            root_x, root_y = root_y, root_x
        
        self.parent[root_y] = root_x
        
        if self.rank[root_x] == self.rank[root_y]:
            self.rank[root_x] += 1
        
        self.components -= 1
        return True
    
    def connected(self, x, y):
        """Check if x and y are in the same set."""
        return self.find(x) == self.find(y)
    
    def count(self):
        """Return number of connected components."""
        return self.components
```

---

### Framework 2: Union by Size (Alternative)

```python
class UnionFindBySize:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n
        self.components = n
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        root_x = self.find(x)
        root_y = self.find(y)
        
        if root_x == root_y:
            return False
        
        # Attach smaller tree under larger tree
        if self.size[root_x] < self.size[root_y]:
            root_x, root_y = root_y, root_x
        
        self.parent[root_y] = root_x
        self.size[root_x] += self.size[root_y]
        self.components -= 1
        return True
    
    def get_size(self, x):
        """Return size of component containing x."""
        return self.size[self.find(x)]
```

---

### Key Pattern Elements

| Element | Purpose | Optimization |
|---------|---------|--------------|
| Path compression | Flatten tree during find | O(α(n)) time |
| Union by rank/size | Keep tree shallow | O(α(n)) time |
| Components counter | Track number of sets | O(1) maintenance |

<!-- back -->
