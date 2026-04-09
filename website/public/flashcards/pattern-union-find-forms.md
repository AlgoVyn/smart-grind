## Graph - Union-Find (DSU): Forms

What are the different variations of Union-Find?

<!-- front -->

---

### Form 1: Basic Union-Find

```python
class UnionFind:
    """Basic with path compression."""
    def __init__(self, n):
        self.parent = list(range(n))
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        self.parent[self.find(x)] = self.find(y)
    
    def connected(self, x, y):
        return self.find(x) == self.find(y)
```

---

### Form 2: With Union by Rank

```python
class UnionFindByRank:
    """With path compression and union by rank."""
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.count = n
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        root_x, root_y = self.find(x), self.find(y)
        if root_x == root_y:
            return
        
        if self.rank[root_x] < self.rank[root_y]:
            root_x, root_y = root_y, root_x
        
        self.parent[root_y] = root_x
        if self.rank[root_x] == self.rank[root_y]:
            self.rank[root_x] += 1
        self.count -= 1
    
    def get_count(self):
        return self.count
```

---

### Form 3: With Union by Size

```python
class UnionFindBySize:
    """With path compression and union by size."""
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n
        self.count = n
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        root_x, root_y = self.find(x), self.find(y)
        if root_x == root_y:
            return
        
        if self.size[root_x] < self.size[root_y]:
            root_x, root_y = root_y, root_x
        
        self.parent[root_y] = root_x
        self.size[root_x] += self.size[root_y]
        self.count -= 1
    
    def get_size(self, x):
        return self.size[self.find(x)]
```

---

### Form 4: 2D Grid Version

```python
class GridUnionFind:
    """Union-Find for 2D grid."""
    def __init__(self, m, n):
        self.m, self.n = m, n
        self.uf = UnionFindByRank(m * n)
    
    def index(self, r, c):
        return r * self.n + c
    
    def union(self, r1, c1, r2, c2):
        self.uf.union(self.index(r1, c1), self.index(r2, c2))
    
    def connected(self, r1, c1, r2, c2):
        return self.uf.connected(self.index(r1, c1), self.index(r2, c2))
```

---

### Form Comparison

| Form | Optimization | Use When |
|------|--------------|----------|
| Basic | Path compression | Simple cases |
| By Rank | Rank balancing | Standard use |
| By Size | Size tracking | Need component sizes |
| 2D Grid | Coordinate mapping | Grid problems |

<!-- back -->
