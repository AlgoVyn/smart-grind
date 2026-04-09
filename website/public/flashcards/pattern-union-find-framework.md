## Graph - Union-Find (DSU): Framework

What is the complete code template for Union-Find data structure?

<!-- front -->

---

### Framework 1: Union-Find with Optimizations

```
┌─────────────────────────────────────────────────────┐
│  UNION-FIND (DISJOINT SET UNION) - TEMPLATE            │
├─────────────────────────────────────────────────────┤
│  Key Optimizations:                                    │
│  1. Path compression - flatten tree during find       │
│  2. Union by rank/size - attach smaller to larger      │
│                                                        │
│  Initialize:                                           │
│   - parent[i] = i (each node is its own parent)      │
│   - rank[i] = 0 (all start with rank 0)              │
│   - count = n (number of components)                  │
│                                                        │
│  Find(x):                                              │
│   - If parent[x] != x:                                │
│       parent[x] = find(parent[x])  # Path compression │
│   - Return parent[x]                                  │
│                                                        │
│  Union(x, y):                                          │
│   - root_x = find(x), root_y = find(y)                │
│   - If same root: return                               │
│   - Attach smaller rank to larger rank                │
│   - If ranks equal: increment rank of new root        │
│   - count--                                           │
│                                                        │
│  Connected(x, y):                                       │
│   - Return find(x) == find(y)                         │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: Union-Find Class

```python
class UnionFind:
    """
    Union-Find with path compression and union by rank.
    Time: O(α(n)) ≈ O(1) per operation
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
        """Union by rank."""
        root_x = self.find(x)
        root_y = self.find(y)
        
        if root_x == root_y:
            return  # Already connected
        
        # Attach smaller rank tree to larger rank tree
        if self.rank[root_x] < self.rank[root_y]:
            root_x, root_y = root_y, root_x
        
        self.parent[root_y] = root_x
        
        if self.rank[root_x] == self.rank[root_y]:
            self.rank[root_x] += 1
        
        self.count -= 1
    
    def connected(self, x, y):
        """Check if x and y are in same set."""
        return self.find(x) == self.find(y)
    
    def get_count(self):
        """Return number of connected components."""
        return self.count
```

---

### Implementation: Union by Size

```python
class UnionFindBySize:
    """Union by size instead of rank."""
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n  # Size of each component
        self.count = n
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        root_x = self.find(x)
        root_y = self.find(y)
        
        if root_x == root_y:
            return
        
        # Attach smaller tree to larger tree
        if self.size[root_x] < self.size[root_y]:
            root_x, root_y = root_y, root_x
        
        self.parent[root_y] = root_x
        self.size[root_x] += self.size[root_y]
        self.count -= 1
```

---

### Key Pattern Elements

| Element | Purpose | Complexity |
|---------|---------|------------|
| `parent` | Tree structure | O(α(n)) find with compression |
| `rank/size` | Balance trees | Keeps tree flat |
| `find()` | Get root + compress | ~O(1) amortized |
| `union()` | Connect sets | ~O(1) amortized |
| `count` | Track components | Decrement on successful union |

<!-- back -->
