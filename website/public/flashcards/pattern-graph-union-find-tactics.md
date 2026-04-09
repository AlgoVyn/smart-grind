## Graph - Union Find (DSU): Tactics

What are the advanced techniques for Union-Find optimization?

<!-- front -->

---

### Tactic 1: Offline Queries with Union-Find

```python
def process_offline_queries(n, edges, queries):
    """Process queries in reverse order for deletion problems."""
    # Example: Number of Islands II (adding land cells)
    
    # Start with all land connected, process removals in reverse
    # Or start with nothing, add edges and count components
    
    uf = UnionFind(n)
    components = 0
    result = []
    
    # Process in reverse
    for query in reversed(queries):
        node = query
        components += 1  # Adding new node
        
        # Connect with existing neighbors
        for neighbor in get_neighbors(node):
            if is_valid(neighbor) and uf.union(node, neighbor):
                components -= 1
        
        result.append(components)
    
    return list(reversed(result))
```

---

### Tactic 2: Union-Find with Extra Information

```python
class UnionFindWithInfo:
    """Track additional information per component."""
    
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.min_val = list(range(n))  # Track min in each component
        self.max_val = list(range(n))  # Track max in each component
        self.sum_val = [0] * n  # Track sum in each component
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        root_x = self.find(x)
        root_y = self.find(y)
        
        if root_x == root_y:
            return False
        
        if self.rank[root_x] < self.rank[root_y]:
            root_x, root_y = root_y, root_x
        
        self.parent[root_y] = root_x
        
        # Merge information
        self.min_val[root_x] = min(self.min_val[root_x], self.min_val[root_y])
        self.max_val[root_x] = max(self.max_val[root_x], self.max_val[root_y])
        self.sum_val[root_x] += self.sum_val[root_y]
        
        if self.rank[root_x] == self.rank[root_y]:
            self.rank[root_x] += 1
        
        return True
```

---

### Tactic 3: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|-----|
| **Using union before find** | Wrong root | Always `find()` first |
| **Not using path compression** | O(n) find | Compress in find method |
| **Union without rank** | Tree becomes linear | Use union by rank/size |
| **Modifying parent array directly** | Breaks invariants | Always use `union()` |
| **Counting components incorrectly** | Off by one | Decrement only when union succeeds |

---

### Tactic 4: Weighted Union-Find (for Equations)

```python
class WeightedUnionFind:
    """Track ratios/weights between nodes."""
    
    def __init__(self, n):
        self.parent = list(range(n))
        self.weight = [1.0] * n  # weight[x] = x / parent[x]
    
    def find(self, x):
        if self.parent[x] != x:
            orig_parent = self.parent[x]
            self.parent[x] = self.find(self.parent[x])
            # Update weight: x / new_parent = (x / orig_parent) * (orig_parent / new_parent)
            self.weight[x] *= self.weight[orig_parent]
        return self.parent[x]
    
    def union(self, x, y, ratio):
        """Union with x / y = ratio."""
        root_x, root_y = self.find(x), self.find(y)
        
        if root_x == root_y:
            return
        
        # x / y = ratio, root_x / root_y = ?
        # weight[x] = x / root_x, weight[y] = y / root_y
        # x / y = (x / root_x) * (root_x / root_y) * (root_y / y) = ratio
        # weight[x] / weight[y] * (root_x / root_y) = ratio
        # root_x / root_y = ratio * weight[y] / weight[x]
        
        self.parent[root_x] = root_y
        self.weight[root_x] = ratio * self.weight[y] / self.weight[x]
    
    def query(self, x, y):
        """Return x / y or -1 if not connected."""
        if self.find(x) != self.find(y):
            return -1.0
        return self.weight[x] / self.weight[y]
```

---

### Tactic 5: Time Complexity Analysis

| Operation | Without optimization | With path compression | With both optimizations |
|-----------|---------------------|----------------------|------------------------|
| Find | O(n) | O(log n) | O(α(n)) |
| Union | O(n) | O(log n) | O(α(n)) |
| m operations | O(mn) | O(m log n) | O(m α(n)) |

**α(n) < 5 for all practical purposes (n < 10^600)**

<!-- back -->
