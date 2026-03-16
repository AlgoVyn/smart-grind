## Sparse Table

**Question:** Range queries in O(1) after O(n log n) preprocessing?

<!-- front -->

---

## Answer: Precomputed Intervals

### Solution
```python
class SparseTable:
    def __init__(self, arr):
        self.n = len(arr)
        self.log = [0] * (self.n + 1)
        
        # Precompute log values
        for i in range(2, self.n + 1):
            self.log[i] = self.log[i // 2] + 1
        
        # Build table
        self.k = self.log[self.n] + 1
        self.table = [[0] * self.n for _ in range(self.k)]
        self.table[0] = arr[:]
        
        for k in range(1, self.k):
            for i in range(self.n - (1 << k) + 1):
                self.table[k][i] = min(
                    self.table[k-1][i],
                    self.table[k-1][i + (1 << (k-1))]
                )
    
    def query(self, l, r):
        # Range [l, r] inclusive
        k = self.log[r - l + 1]
        return min(
            self.table[k][l],
            self.table[k][r - (1 << k) + 1]
        )
```

### Visual: Sparse Table
```
arr = [3, 1, 4, 1, 5, 9, 2, 6]

Level 0 (2^0 = 1):
[3, 1, 4, 1, 5, 9, 2, 6]

Level 1 (2^1 = 2):
[1, 1, 1, 5, 2, 2, 2, -]

Level 2 (2^2 = 4):
[1, 1, 1, -, -, -, -, -]

Query [1,4]: k = log2(4) = 2
min(table[2][1], table[2][1]) = min(1, 1) = 1
```

### ⚠️ Tricky Parts

#### 1. Why Two Overlapping Ranges?
```python
# Query [l, r] of length L
# k = floor(log2(L))
# Use ranges [l, l+2^k-1] and [r-2^k+1, r]
# They overlap but that's fine - min is idempotent

# Works for idempotent operations: min, max, gcd
# Does NOT work for sum!
```

#### 2. Log Precomputation
```python
# log[n] = floor(log2(n))
# Can compute in O(n):
for i in range(2, n+1):
    log[i] = log[i//2] + 1
```

### Time & Space Complexity

| Operation | Time | Space |
|-----------|------|-------|
| Build | O(n log n) | O(n log n) |
| Query | O(1) | - |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Index overflow | Check bounds for table access |
| Non-idempotent ops | Only use for min/max/gcd |
| Wrong log | Use floor(log2) |

<!-- back -->
