## Title: Segment Tree - Forms

What are the different manifestations of the segment tree pattern?

<!-- front -->

---

### Form 1: Range Sum Query (RSQ)

Most common form - query sum of any subarray.

| Operation | Time | Formula |
|-----------|------|---------|
| **Build** | O(n) | `tree[node] = left + right` |
| **Query** | O(log n) | Return sum of relevant nodes |
| **Update** | O(log n) | Update leaf, propagate up |

```python
class SegmentTreeSum:
    def __init__(self, arr):
        self.n = len(arr)
        self.tree = [0] * (4 * self.n)
        self._build(arr, 0, 0, self.n - 1)
    
    def _combine(self, a, b):
        return a + b  # Sum operation
```

---

### Form 2: Range Minimum/Maximum Query (RMQ)

Find min/max in any range.

| Operation | Time | Formula |
|-----------|------|---------|
| **Build** | O(n) | `tree[node] = min(left, right)` |
| **Query** | O(log n) | Return min/max of relevant nodes |
| **Identity** | - | ∞ for min, -∞ for max |

```python
class SegmentTreeRMQ:
    def __init__(self, arr, operation=min):
        self.n = len(arr)
        self.op = operation
        self.INF = float('inf') if operation == min else float('-inf')
        self.tree = [self.INF] * (4 * self.n)
        self._build(arr, 0, 0, self.n - 1)
```

---

### Form 3: Range Update with Lazy Propagation

Efficient range modifications.

```
Standard:     Range Update = O(n) per element
Lazy:         Range Update = O(log n) total

Trade-off: Extra O(n) space for lazy array
Use when: Range updates are frequent
```

```python
def range_add(self, node, start, end, l, r, val):
    """Add val to all elements in range [l, r]."""
    # Propagate pending updates
    if self.lazy[node] != 0:
        self.tree[node] += (end - start + 1) * self.lazy[node]
        if start != end:
            self.lazy[2*node+1] += self.lazy[node]
            self.lazy[2*node+2] += self.lazy[node]
        self.lazy[node] = 0
    
    if r < start or l > end:
        return
    
    if l <= start and end <= r:
        self.tree[node] += (end - start + 1) * val
        if start != end:
            self.lazy[2*node+1] += val
            self.lazy[2*node+2] += val
        return
    
    mid = (start + end) // 2
    self.range_add(2*node+1, start, mid, l, r, val)
    self.range_add(2*node+2, mid+1, end, l, r, val)
    self.tree[node] = self.tree[2*node+1] + self.tree[2*node+2]
```

---

### Form 4: Persistent Segment Tree

Versioned segment trees for historical queries.

| Feature | Regular | Persistent |
|---------|---------|------------|
| Updates | Modify in-place | Create new version |
| Space | O(n) | O(n log n) |
| Use Case | Current state | Historical states |

```
Structure: Create new path on update, share unchanged nodes
Query: Access any version by root pointer
```

---

### Form 5: 2D Segment Tree

For matrix range queries.

```
Structure: Segment tree of segment trees
Query: Range [x1,y1] to [x2,y2]
Time: O(log² n) for query and update
Use: Matrix operations, image processing
```

| Operation | 1D ST | 2D ST |
|-----------|-------|-------|
| Build | O(n) | O(n*m) |
| Query | O(log n) | O(log n * log m) |
| Update | O(log n) | O(log n * log m) |

<!-- back -->
