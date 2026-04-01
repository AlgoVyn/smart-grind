## Title: Kruskal's Tactics

What are the key implementation tactics for Kruskal's algorithm?

<!-- front -->

---

### Optimization Tactics

| Tactic | Benefit |
|--------|---------|
| Path compression | Find → O(α(n)) |
| Union by rank/size | Balanced trees, ~O(1) |
| Early termination | Stop at n-1 edges |
| Counting sort | O(E + W) if weights small |
| Radix sort | Faster for integer weights |

### DSU Template
```python
class DSU:
    __slots__ = ['parent', 'rank', 'size', 'components']
    
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.size = [1] * n
        self.components = n
    
    def find(self, x):
        # Iterative path compression
        root = x
        while self.parent[root] != root:
            root = self.parent[root]
        while self.parent[x] != x:
            self.parent[x], x = root, self.parent[x]
        return root
    
    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py: return False
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        self.size[px] += self.size[py]
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        self.components -= 1
        return True
```

---

### Common Pitfalls
| Mistake | Issue | Fix |
|---------|-------|-----|
| No path compression | O(n) find | Compress paths |
| Union without rank | Unbalanced trees | Union by rank/size |
| Sorting wrong direction | Wrong MST | Ascending for min |
| Not checking connected | Wrong answer | Verify n-1 edges |
| 1-indexed vs 0-indexed | Off by one | Be consistent |

<!-- back -->
