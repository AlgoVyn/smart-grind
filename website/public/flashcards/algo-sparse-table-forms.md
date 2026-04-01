## Title: Sparse Table - Forms

What are the different manifestations of the Sparse Table pattern?

<!-- front -->

---

### Form 1: Range Minimum/Maximum Query (RMQ)

Most common application. Used for finding min/max in subarrays.

| Aspect | Details |
|--------|---------|
| **Build** | O(n log n) |
| **Query** | O(1) |
| **Use case** | Sliding window min/max, range queries |

```python
class SparseTableRMQ:
    def __init__(self, arr):
        self.n = len(arr)
        self.INF = float('inf')
        self.log = [0] * (self.n + 1)
        for i in range(2, self.n + 1):
            self.log[i] = self.log[i // 2] + 1
        
        k = self.log[self.n] + 1
        self.table = [[self.INF] * self.n for _ in range(k)]
        
        for i in range(self.n):
            self.table[0][i] = arr[i]
        
        for j in range(1, k):
            for i in range(self.n - (1 << j) + 1):
                self.table[j][i] = min(
                    self.table[j-1][i],
                    self.table[j-1][i + (1 << (j-1))]
                )
```

---

### Form 2: Range GCD/LCM Query

GCD is idempotent: `gcd(a, a) = a` and `gcd(gcd(a,b),c) = gcd(a,b,c)`.

| Aspect | Details |
|--------|---------|
| **Build** | O(n log n) with gcd operations |
| **Query** | O(1) |
| **Use case** | Number theory problems, divisibility checks |

---

### Form 3: 2D Sparse Table

For matrix range queries.

| Aspect | Details |
|--------|---------|
| **Build** | O(n*m*log(n)*log(m)) |
| **Query** | O(1) |
| **Use case** | Image processing, 2D range queries |

```
Structure: table[i][j][x][y] for 2D ranges
Build: First along rows, then along columns
Query: Four corners for complete coverage
```

---

### Form 4: Comparison with Alternatives

| Data Structure | Build | Query | Update | Best For |
|----------------|-------|-------|--------|----------|
| **Prefix Sum** | O(n) | O(1) | O(n) | Static sum queries |
| **Sparse Table** | O(n log n) | O(1) | O(n log n) | Static min/max/gcd |
| **Segment Tree** | O(n) | O(log n) | O(log n) | Dynamic data |
| **Fenwick Tree** | O(n) | O(log n) | O(log n) | Dynamic prefix sums |

---

### Form 5: Query with Index

Return both value and its index:

```python
def query_min_with_index(self, left, right):
    """Return (min_value, min_index) in range."""
    length = right - left + 1
    k = self.log[length]
    
    # Store pairs of (value, index)
    left_val, left_idx = self.table[k][left]
    right_val, right_idx = self.table[k][right - (1 << k) + 1]
    
    if left_val <= right_val:
        return left_val, left_idx
    return right_val, right_idx
```

<!-- back -->
