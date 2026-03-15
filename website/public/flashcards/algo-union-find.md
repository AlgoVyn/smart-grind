## Union-Find with Path Compression

**Questions:**
1. What's the amortized time complexity?
2. Why is it effectively constant?

<!-- front -->

---

## Union-Find (Disjoint Set)

### Amortized Complexity
```
Time: O(α(n)) ≈ O(1)
Space: O(n)
```

Where **α(n)** is the **inverse Ackermann function**.

### Optimizations
1. **Path Compression** (`find`)
   ```python
   def find(x):
       if parent[x] != x:
           parent[x] = find(parent[x])  # Compress path
       return parent[x]
   ```

2. **Union by Rank/Size**
   ```python
   def union(x, y):
       px, py = find(x), find(y)
       if px == py: return
       
       # Attach smaller to larger
       if rank[px] < rank[py]:
           px, py = py, px
       parent[py] = px
       if rank[px] == rank[py]:
           rank[px] += 1
   ```

### 💡 Why So Fast?
Inverse Ackermann grows incredibly slowly:
```
α(n) < 5 for all practical n
(n < 2^2^2^2^2 ≈ 10^19728)
```

### ✅ Real-World Performance
Effectively **constant time** for any realistic input size.

<!-- back -->
