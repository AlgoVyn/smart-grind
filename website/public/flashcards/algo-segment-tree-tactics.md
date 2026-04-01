## Title: Segment Tree - Tactics

What are specific techniques and optimizations for segment trees?

<!-- front -->

---

### Tactic 1: Size as Power of 2 (Iterative)

Simplify indexing with iterative segment tree:

```python
class IterativeSegmentTree:
    def __init__(self, arr):
        n = len(arr)
        self.size = 1
        while self.size < n:
            self.size <<= 1
        
        # Tree size is 2*size for iterative approach
        self.tree = [0] * (2 * self.size)
        
        # Build leaves
        for i in range(n):
            self.tree[self.size + i] = arr[i]
        
        # Build internal nodes
        for i in range(self.size - 1, 0, -1):
            self.tree[i] = self.tree[2*i] + self.tree[2*i+1]
    
    def update(self, idx, value):
        """Update element at index."""
        idx += self.size
        self.tree[idx] = value
        idx //= 2
        
        while idx >= 1:
            self.tree[idx] = self.tree[2*idx] + self.tree[2*idx+1]
            idx //= 2
    
    def query(self, left, right):
        """Query range [left, right] (inclusive)."""
        left += self.size
        right += self.size
        result = 0
        
        while left <= right:
            if left % 2 == 1:
                result += self.tree[left]
                left += 1
            if right % 2 == 0:
                result += self.tree[right]
                right -= 1
            left //= 2
            right //= 2
        
        return result
```

**Benefits:** No recursion, simpler indexing, faster in practice.

---

### Tactic 2: Coordinate Compression

When values are sparse but range is large:

```python
def build_compressed_segment_tree(values, queries):
    """Build segment tree on compressed coordinates."""
    # Collect all relevant coordinates
    coords = set()
    for val in values:
        coords.add(val)
    for q in queries:
        coords.add(q.left)
        coords.add(q.right)
    
    # Compress: map original -> compressed index
    sorted_coords = sorted(coords)
    compress = {v: i for i, v in enumerate(sorted_coords)}
    
    # Build tree on compressed indices
    tree = SegmentTree(len(sorted_coords))
    # ... use compress[value] for operations
```

**Use when:** Original coordinate range is huge (e.g., 10^9).

---

### Tactic 3: Multi-Dimensional Aggregation

Store multiple values per node:

```python
class SegmentTreeMulti:
    """Segment tree storing multiple aggregates."""
    
    def __init__(self, arr):
        n = len(arr)
        # Store (sum, min, max) for each segment
        self.tree = [[0, float('inf'), float('-inf')] 
                     for _ in range(4*n)]
        self.build(arr, 0, 0, n-1)
    
    def combine(self, left, right):
        """Combine two nodes."""
        return [
            left[0] + right[0],           # sum
            min(left[1], right[1]),       # min
            max(left[2], right[2])        # max
        ]
```

---

### Tactic 4: Finding k-th Element

Use segment tree for order statistics:

```python
class OrderStatisticTree:
    """Find k-th smallest element."""
    
    def find_kth(self, k):
        """Find k-th smallest (1-indexed)."""
        node = 0  # Start at root
        
        while not self.is_leaf(node):
            left_child = 2*node + 1
            left_count = self.tree[left_child]
            
            if left_count >= k:
                node = left_child
            else:
                k -= left_count
                node = left_child + 1  # Right child
        
        return self.get_value(node)
```

---

### Tactic 5: Comparison with Alternatives

| Data Structure | Build | Query | Update | Best For |
|----------------|-------|-------|--------|----------|
| **Prefix Sum** | O(n) | O(1) | O(n) | Static sum queries |
| **Sparse Table** | O(n log n) | O(1) | O(n) | Static min/max |
| **Segment Tree** | O(n) | O(log n) | O(log n) | Dynamic data |
| **Fenwick Tree** | O(n) | O(log n) | O(log n) | Prefix sums |
| **Sqrt Decomposition** | O(n) | O(√n) | O(√n) | Simple impl |

**Choose Segment Tree when:**
- Need both queries and updates
- Operations are associative
- Range updates needed (with lazy)

<!-- back -->
