## Fenwick Tree (Binary Indexed Tree)

**Question:** How does bit manipulation help in prefix sum queries?

<!-- front -->

---

## Fenwick Tree

### Why BIT Works
Each index stores sum of a **contiguous range** determined by trailing zeros in binary.

### Implementation
```python
class FenwickTree:
    def __init__(self, size):
        self.n = size
        self.tree = [0] * (size + 1)
    
    def update(self, index, delta):
        # Add delta at position index (1-indexed)
        while index <= self.n:
            self.tree[index] += delta
            index += index & (-index)  # Add LSB
    
    def prefix_sum(self, index):
        # Sum from 1 to index (1-indexed)
        result = 0
        while index > 0:
            result += self.tree[index]
            index -= index & (-index)  # Subtract LSB
        
        return result
    
    def range_sum(self, left, right):
        return self.prefix_sum(right) - self.prefix_sum(left - 1)
```

### Why `index & -index`?
```
Binary representation reveals range:

index = 6 (110): stores range [5, 6]
index = 4 (100): stores range [1, 4]
index = 12 (1100): stores range [9, 12]

-index flips bits and adds 1:
-6 & 6 = 2
-4 & 4 = 4
-12 & 12 = 4
```

### Complexity
| Operation | Time |
|-----------|------|
| Update | O(log n) |
| Prefix Sum | O(log n) |
| Range Sum | O(log n) |
| Build | O(n log n) |

### 💡 Comparison with Segment Tree
- BIT: Simpler, less memory
- Segment Tree: More flexible, supports range updates

<!-- back -->
