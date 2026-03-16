## Union by Rank + Path Compression

**Question:** Optimized Union-Find with nearly O(1) operations?

<!-- front -->

---

## Answer: Two Optimizations Combined

### Solution
```python
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    
    def find(self, x):
        # Path compression
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        
        if px == py:
            return False
        
        # Union by rank
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        
        self.parent[py] = px
        
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        
        return True
```

### Visual: Path Compression
```
Before find(4):
0 → 1 → 2 → 3 → 4

After find(4):
0 → 1 → 2 → 3 → 4
↑_________|

All nodes now point directly to root!
```

### ⚠️ Tricky Parts

#### 1. Why Two Optimizations?
```python
# Path compression: flattens tree during find
# Union by rank: keeps tree balanced during union

# Without rank: worst case O(n)
# With both: amortized O(α(n)) ≈ O(1)
```

#### 2. Why Swap on Rank Compare?
```python
# If rank[px] < rank[py]:
#   Make py's root child of px
# This ensures shallower tree becomes child
```

### Time & Space Complexity

| Operation | Time | Space |
|-----------|------|-------|
| Find | O(α(n)) | O(1) |
| Union | O(α(n)) | O(1) |
| Overall | O(m α(n)) | O(n) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Missing path compression | Recurse with assignment |
| No rank tracking | Use rank/size array |
| Wrong union logic | Swap when ranks differ |

<!-- back -->
