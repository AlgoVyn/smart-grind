# Segment Tree

## Category
Advanced Data Structures

## Description

A Segment Tree is a binary tree data structure that enables efficient range queries and point updates on an array. It is particularly powerful for solving problems that require querying aggregates (sum, min, max, product, etc.) over subarrays while also supporting dynamic updates to individual elements.

This data structure transforms range queries from O(n) linear scans to O(log n) tree traversals, making it essential for competitive programming and applications requiring real-time analytics on dynamic datasets. It serves as the foundation for more advanced structures like persistent segment trees and lazy propagation trees.

---

## Concepts

The Segment Tree is built on several fundamental concepts that make it powerful for range query problems.

### 1. Tree Structure

A segment tree represents array segments hierarchically:

| Node Type | Represents | Children |
|-----------|------------|----------|
| **Root** | Entire array [0, n-1] | Left: [0, mid], Right: [mid+1, n-1] |
| **Internal** | Subarray [l, r] | Left: [l, mid], Right: [mid+1, r] |
| **Leaf** | Single element [i, i] | None |

### 2. Array Representation

The tree is stored as an array with specific index calculations:

```
For node at index i:
    Left child index: 2*i + 1
    Right child index: 2*i + 2
    Parent index: (i - 1) // 2

Tree array size: 4*n (safe upper bound for n elements)
```

### 3. Associative Operations

Segment trees work with any associative operation:

| Operation | Identity | Combine Function |
|-----------|----------|------------------|
| **Sum** | 0 | a + b |
| **Product** | 1 | a * b |
| **Min** | ∞ | min(a, b) |
| **Max** | -∞ | max(a, b) |
| **GCD** | 0 | gcd(a, b) |
| **XOR** | 0 | a ^ b |

### 4. Lazy Propagation

Optimization for range updates:

| Aspect | Without Lazy | With Lazy |
|--------|--------------|-----------|
| Point Update | O(log n) | O(log n) |
| Range Update | O(n) | O(log n) |
| Space | O(n) | O(2n) |

---

## Frameworks

Structured approaches for implementing and using segment trees.

### Framework 1: Build Template

```
┌─────────────────────────────────────────────────────┐
│  SEGMENT TREE BUILD FRAMEWORK                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  function build(node, start, end, arr):             │
│      If start == end:                                │
│          // Leaf node                                │
│          tree[node] = arr[start]                     │
│          return                                      │
│                                                     │
│      mid = (start + end) // 2                        │
│      left = 2*node + 1                               │
│      right = 2*node + 2                              │
│                                                     │
│      build(left, start, mid, arr)                    │
│      build(right, mid+1, end, arr)                   │
│                                                     │
│      tree[node] = combine(tree[left], tree[right])   │
│                                                     │
│  Complexity: O(n) time, O(n) space                  │
└─────────────────────────────────────────────────────┘
```

### Framework 2: Query Template

```
┌─────────────────────────────────────────────────────┐
│  SEGMENT TREE QUERY FRAMEWORK                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  function query(node, start, end, left, right):      │
│      // Case 1: No overlap                           │
│      If right < start OR left > end:               │
│          return identity_value                       │
│                                                     │
│      // Case 2: Complete overlap                   │
│      If left <= start AND end <= right:            │
│          return tree[node]                           │
│                                                     │
│      // Case 3: Partial overlap                    │
│      mid = (start + end) // 2                        │
│      left_val = query(2*node+1, start, mid,         │
│                       left, right)                 │
│      right_val = query(2*node+2, mid+1, end,         │
│                        left, right)                  │
│                                                     │
│      return combine(left_val, right_val)             │
│                                                     │
│  Complexity: O(log n) time                           │
└─────────────────────────────────────────────────────┘
```

### Framework 3: Update Template

```
┌─────────────────────────────────────────────────────┐
│  SEGMENT TREE UPDATE FRAMEWORK                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  function update(node, start, end, idx, value):    │
│      If start == end:                                │
│          // Leaf node - update directly              │
│          tree[node] = value                          │
│          return                                      │
│                                                     │
│      mid = (start + end) // 2                        │
│                                                     │
│      If idx <= mid:                                  │
│          update(2*node+1, start, mid, idx, value)    │
│      Else:                                           │
│          update(2*node+2, mid+1, end, idx, value)    │
│                                                     │
│      // Recombine from children                      │
│      tree[node] = combine(tree[2*node+1],            │
│                          tree[2*node+2])             │
│                                                     │
│  Complexity: O(log n) time                           │
└─────────────────────────────────────────────────────┘
```

### Framework 4: Lazy Propagation Template

```
┌─────────────────────────────────────────────────────┐
│  LAZY PROPAGATION FRAMEWORK                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  function range_update(node, start, end, l, r, val): │
│      // Apply pending lazy value                     │
│      propagate(node, start, end)                     │
│                                                     │
│      // No overlap                                   │
│      If r < start OR l > end:                       │
│          return                                      │
│                                                     │
│      // Complete overlap                             │
│      If l <= start AND end <= r:                    │
│          tree[node] += (end-start+1) * val          │
│          If start != end:                           │
│              lazy[2*node+1] += val                   │
│              lazy[2*node+2] += val                   │
│          return                                      │
│                                                     │
│      // Partial overlap - recurse to children        │
│      mid = (start + end) // 2                        │
│      range_update(2*node+1, start, mid, l, r, val)  │
│      range_update(2*node+2, mid+1, end, l, r, val)   │
│                                                     │
│      tree[node] = combine(tree[2*node+1],            │
│                          tree[2*node+2])             │
└─────────────────────────────────────────────────────┘
```

---

## Forms

Different manifestations of the segment tree pattern.

### Form 1: Range Sum Query (RSQ)

Most common form - query sum of any subarray.

| Operation | Time | Formula |
|-----------|------|---------|
| **Build** | O(n) | tree[node] = left + right |
| **Query** | O(log n) | Return sum of relevant nodes |
| **Update** | O(log n) | Update leaf, propagate up |

### Form 2: Range Minimum/Maximum Query (RMQ)

Find min/max in any range.

| Operation | Time | Formula |
|-----------|------|---------|
| **Build** | O(n) | tree[node] = min/max(left, right) |
| **Query** | O(log n) | Return min/max of relevant nodes |
| **Identity** | - | ∞ for min, -∞ for max |

### Form 3: Range Update with Lazy Propagation

Efficient range modifications.

```
Standard:     Range Update = O(n) per element
Lazy:         Range Update = O(log n) total

Trade-off: Extra O(n) space for lazy array
Use when: Range updates are frequent
```

### Form 4: Persistent Segment Tree

Versioned segment trees for historical queries.

| Feature | Regular | Persistent |
|---------|---------|------------|
| Updates | Modify in-place | Create new version |
| Space | O(n) | O(n log n) |
| Use Case | Current state | Historical states |

### Form 5: 2D Segment Tree

For matrix range queries.

```
Structure: Segment tree of segment trees
Query: Range [x1,y1] to [x2,y2]
Time: O(log² n) for query and update
Use: Matrix operations, image processing
```

---

## Tactics

Specific techniques and optimizations for segment trees.

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
```

**Benefits**: No recursion, simpler indexing, faster in practice.

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

**Use when**: Original coordinate range is huge (e.g., 10^9).

### Tactic 3: Lazy Propagation Optimization

Efficient range addition:

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
    
    # No overlap
    if r < start or l > end:
        return
    
    # Complete overlap
    if l <= start and end <= r:
        self.tree[node] += (end - start + 1) * val
        if start != end:
            self.lazy[2*node+1] += val
            self.lazy[2*node+2] += val
        return
    
    # Partial overlap
    mid = (start + end) // 2
    self.range_add(2*node+1, start, mid, l, r, val)
    self.range_add(2*node+2, mid+1, end, l, r, val)
    self.tree[node] = self.tree[2*node+1] + self.tree[2*node+2]
```

### Tactic 4: Non-Recursive Query

Iterative query for better performance:

```python
def query_iterative(self, l, r):
    """Non-recursive range query."""
    l += self.size
    r += self.size
    res = 0
    
    while l <= r:
        if l % 2 == 1:  # l is right child
            res += self.tree[l]
            l += 1
        if r % 2 == 0:  # r is left child
            res += self.tree[r]
            r -= 1
        l //= 2
        r //= 2
    
    return res
```

### Tactic 5: Multi-Dimensional Aggregation

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

## Python Templates

### Template 1: Basic Segment Tree (Range Sum)

```python
class SegmentTree:
    """
    Segment Tree for range sum queries with point updates.
    
    Time Complexities:
        - Build: O(n)
        - Query: O(log n)
        - Update: O(log n)
    
    Space Complexity: O(n)
    """
    
    def __init__(self, arr: list):
        """Initialize the segment tree."""
        self.n = len(arr)
        # Tree size is 4*n to handle all edge cases
        self.tree = [0] * (4 * self.n)
        if self.n > 0:
            self._build(arr, 0, 0, self.n - 1)
    
    def _build(self, arr: list, node: int, start: int, end: int):
        """Build the segment tree recursively."""
        if start == end:
            # Leaf node - store the element
            self.tree[node] = arr[start]
        else:
            mid = (start + end) // 2
            left_child = 2 * node + 1
            right_child = 2 * node + 2
            
            # Recursively build left and right subtrees
            self._build(arr, left_child, start, mid)
            self._build(arr, right_child, mid + 1, end)
            
            # Combine children results (sum operation)
            self.tree[node] = self.tree[left_child] + self.tree[right_child]
    
    def update(self, idx: int, value: int):
        """Update element at index idx to value."""
        self._update(0, 0, self.n - 1, idx, value)
    
    def _update(self, node: int, start: int, end: int, idx: int, value: int):
        """Update value at index recursively."""
        if start == end:
            # Leaf node found - update value
            self.tree[node] = value
        else:
            mid = (start + end) // 2
            left_child = 2 * node + 1
            right_child = 2 * node + 2
            
            # Determine which child contains the index
            if idx <= mid:
                self._update(left_child, start, mid, idx, value)
            else:
                self._update(right_child, mid + 1, end, idx, value)
            
            # Recompute current node value
            self.tree[node] = self.tree[left_child] + self.tree[right_child]
    
    def query(self, left: int, right: int) -> int:
        """Query sum in range [left, right] (inclusive)."""
        return self._query(0, 0, self.n - 1, left, right)
    
    def _query(self, node: int, start: int, end: int, left: int, right: int) -> int:
        """Query range sum recursively."""
        # Case 1: No overlap
        if right < start or left > end:
            return 0  # Identity for sum
        
        # Case 2: Complete overlap
        if left <= start and end <= right:
            return self.tree[node]
        
        # Case 3: Partial overlap
        mid = (start + end) // 2
        left_child = 2 * node + 1
        right_child = 2 * node + 2
        
        left_sum = self._query(left_child, start, mid, left, right)
        right_sum = self._query(right_child, mid + 1, end, left, right)
        
        return left_sum + right_sum
```

### Template 2: Segment Tree with Lazy Propagation

```python
class SegmentTreeLazy:
    """Segment Tree with Lazy Propagation for range updates."""
    
    def __init__(self, arr):
        self.n = len(arr)
        self.tree = [0] * (4 * self.n)
        self.lazy = [0] * (4 * self.n)
        if self.n > 0:
            self._build(arr, 0, 0, self.n - 1)
    
    def _build(self, arr, node, start, end):
        if start == end:
            self.tree[node] = arr[start]
        else:
            mid = (start + end) // 2
            self._build(arr, 2*node+1, start, mid)
            self._build(arr, 2*node+2, mid+1, end)
            self.tree[node] = self.tree[2*node+1] + self.tree[2*node+2]
    
    def _propagate(self, node, start, end):
        """Propagate lazy value to children."""
        if self.lazy[node] != 0:
            self.tree[node] += (end - start + 1) * self.lazy[node]
            if start != end:
                self.lazy[2*node+1] += self.lazy[node]
                self.lazy[2*node+2] += self.lazy[node]
            self.lazy[node] = 0
    
    def range_update(self, left, right, value):
        """Add value to all elements in range [left, right]."""
        self._range_update(0, 0, self.n-1, left, right, value)
    
    def _range_update(self, node, start, end, left, right, value):
        self._propagate(node, start, end)
        
        if right < start or left > end:
            return
        
        if left <= start and end <= right:
            self.tree[node] += (end - start + 1) * value
            if start != end:
                self.lazy[2*node+1] += value
                self.lazy[2*node+2] += value
            return
        
        mid = (start + end) // 2
        self._range_update(2*node+1, start, mid, left, right, value)
        self._range_update(2*node+2, mid+1, end, left, right, value)
        self.tree[node] = self.tree[2*node+1] + self.tree[2*node+2]
    
    def range_query(self, left, right):
        """Query sum in range [left, right]."""
        return self._range_query(0, 0, self.n-1, left, right)
    
    def _range_query(self, node, start, end, left, right):
        self._propagate(node, start, end)
        
        if right < start or left > end:
            return 0
        
        if left <= start and end <= right:
            return self.tree[node]
        
        mid = (start + end) // 2
        return (self._range_query(2*node+1, start, mid, left, right) +
                self._range_query(2*node+2, mid+1, end, left, right))
```

### Template 3: Iterative Segment Tree

```python
class IterativeSegmentTree:
    """Iterative Segment Tree for better performance."""
    
    def __init__(self, arr):
        n = len(arr)
        self.size = 1
        while self.size < n:
            self.size <<= 1
        
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

### Template 4: Range Minimum Query (RMQ)

```python
class SegmentTreeRMQ:
    """Segment Tree for Range Minimum Query."""
    
    def __init__(self, arr):
        self.n = len(arr)
        self.INF = float('inf')
        self.tree = [self.INF] * (4 * self.n)
        if self.n > 0:
            self._build(arr, 0, 0, self.n - 1)
    
    def _build(self, arr, node, start, end):
        if start == end:
            self.tree[node] = arr[start]
        else:
            mid = (start + end) // 2
            self._build(arr, 2*node+1, start, mid)
            self._build(arr, 2*node+2, mid+1, end)
            self.tree[node] = min(self.tree[2*node+1], self.tree[2*node+2])
    
    def update(self, idx, value):
        """Update element at index."""
        self._update(0, 0, self.n-1, idx, value)
    
    def _update(self, node, start, end, idx, value):
        if start == end:
            self.tree[node] = value
        else:
            mid = (start + end) // 2
            if idx <= mid:
                self._update(2*node+1, start, mid, idx, value)
            else:
                self._update(2*node+2, mid+1, end, idx, value)
            self.tree[node] = min(self.tree[2*node+1], self.tree[2*node+2])
    
    def query(self, left, right):
        """Query minimum in range [left, right]."""
        return self._query(0, 0, self.n-1, left, right)
    
    def _query(self, node, start, end, left, right):
        if right < start or left > end:
            return self.INF
        
        if left <= start and end <= right:
            return self.tree[node]
        
        mid = (start + end) // 2
        left_min = self._query(2*node+1, start, mid, left, right)
        right_min = self._query(2*node+2, mid+1, end, left, right)
        return min(left_min, right_min)
```

### Template 5: Segment Tree with Multiple Operations

```python
class SegmentTreeMulti:
    """Segment tree supporting sum, min, max in one structure."""
    
    def __init__(self, arr):
        self.n = len(arr)
        # Each node stores: [sum, min, max]
        self.tree = [[0, float('inf'), float('-inf')] 
                     for _ in range(4 * self.n)]
        if self.n > 0:
            self._build(arr, 0, 0, self.n - 1)
    
    def _build(self, arr, node, start, end):
        if start == end:
            val = arr[start]
            self.tree[node] = [val, val, val]
        else:
            mid = (start + end) // 2
            self._build(arr, 2*node+1, start, mid)
            self._build(arr, 2*node+2, mid+1, end)
            self.tree[node] = self._combine(self.tree[2*node+1], 
                                             self.tree[2*node+2])
    
    def _combine(self, left, right):
        """Combine two nodes."""
        return [
            left[0] + right[0],           # sum
            min(left[1], right[1]),       # min
            max(left[2], right[2])        # max
        ]
    
    def update(self, idx, value):
        """Update element at index."""
        self._update(0, 0, self.n-1, idx, value)
    
    def _update(self, node, start, end, idx, value):
        if start == end:
            self.tree[node] = [value, value, value]
        else:
            mid = (start + end) // 2
            if idx <= mid:
                self._update(2*node+1, start, mid, idx, value)
            else:
                self._update(2*node+2, mid+1, end, idx, value)
            self.tree[node] = self._combine(self.tree[2*node+1], 
                                             self.tree[2*node+2])
    
    def query(self, left, right):
        """Query range [left, right], returns [sum, min, max]."""
        return self._query(0, 0, self.n-1, left, right)
    
    def _query(self, node, start, end, left, right):
        if right < start or left > end:
            return [0, float('inf'), float('-inf')]
        
        if left <= start and end <= right:
            return self.tree[node]
        
        mid = (start + end) // 2
        left_res = self._query(2*node+1, start, mid, left, right)
        right_res = self._query(2*node+2, mid+1, end, left, right)
        return self._combine(left_res, right_res)
```

---

## When to Use

Use the Segment Tree algorithm when you need to solve problems involving:

- **Range Queries**: Finding sum, minimum, maximum, or any associative operation over a subarray
- **Point Updates**: Modifying individual array elements while maintaining query capability
- **Mixed Operations**: Both queries and updates interleaved in the problem
- **Dynamic Data**: Array values that change during the problem execution
- **Offline Queries**: When you need to answer multiple range queries efficiently

### Comparison with Alternatives

| Data Structure | Build Time | Query Time | Update Time | Supports Dynamic Updates |
|----------------|------------|------------|-------------|--------------------------|
| **Prefix Sum** | O(n) | O(1) | O(n) | ❌ No |
| **Sparse Table** | O(n log n) | O(1) | O(n) | ❌ No |
| **Segment Tree** | O(n) | O(log n) | O(log n) | ✅ Yes |
| **Fenwick Tree** | O(n) | O(log n) | O(log n) | ✅ Yes (limited) |
| **Sqrt Decomposition** | O(n) | O(√n) | O(√n) | ✅ Yes |

### When to Choose Each Data Structure

- **Choose Prefix Sum** when:
  - Array is static (no updates)
  - Need O(1) range sum queries
  - Only sum operation needed

- **Choose Sparse Table** when:
  - Array is static
  - Need O(1) range queries (min/max)
  - No updates ever needed

- **Choose Segment Tree** when:
  - Need both queries and updates
  - Operations are associative
  - Range updates needed (with lazy propagation)

- **Choose Fenwick Tree** when:
  - Space efficiency is critical
  - Only prefix sums needed
  - Point updates and prefix queries suffice

---

## Algorithm Explanation

### Core Concept

A Segment Tree represents the array as a binary tree where each node stores aggregate information about a segment (subarray) of the original array. The key insight is that **any range query can be answered by combining O(log n) precomputed segment values**.

### How It Works

#### Tree Construction:

1. **Leaf Nodes**: Each leaf represents a single array element
2. **Internal Nodes**: Each internal node represents the combination (sum/min/max/etc.) of its children
3. **Root Node**: Represents the aggregate of the entire array

#### Range Query:

1. **No Overlap**: If query range doesn't intersect node range, return identity value
2. **Complete Overlap**: If query range fully contains node range, return stored value
3. **Partial Overlap**: Recurse to children and combine results

#### Point Update:

1. Traverse from root to leaf following the index path
2. Update the leaf node with new value
3. Recompute all ancestor nodes by combining children

### Visual Representation

For array `[1, 3, 5, 7, 9, 11]`:

```
                        [36] (0-5)                    ← Root: sum of all elements
                       /      \
               [9] (0-2)       [27] (3-5)             ← Internal nodes: partial sums
               /    \            /    \
          [4](0-1)  [5](2)  [16](3-4)  [11](5)      ← Node values represent range
          /  \                                    ← Each node covers a segment
       [1]   [3]                                 ← Leaves are individual elements
```

Query `[1, 4]` (indices 1 to 4, values 3+5+7+9=24):
```
Range [1,4] = [4](0-1) partial + [27](3-5) partial
            = [4] overlaps [1,4] partially → check children
            = [3] (index 1) fully in range = 3
            + recurse on [16](3-4) and [11](5)
            = 3 + 16 + (11 is outside [1,4])
            = 3 + 16 = wait, that's wrong...

Actually: [1,4] decomposes to:
  - [3] (index 1) = 3
  - [5] (index 2) = 5  
  - [16] (indices 3-4) = 16 (7+9)
  Total: 3 + 5 + 16 = 24 ✓
```

### Why It Works

- **Complete Coverage**: The tree structure ensures every possible range can be decomposed into O(log n) nodes
- **No Redundancy**: Each node is visited at most once per query
- **Incremental Updates**: Only O(log n) nodes need updating when a value changes
- **Associative Property**: Works for any operation where (a op b) op c = a op (b op c)

### Limitations

- **Memory Overhead**: Requires ~4x the array size for storage
- **Not for All Operations**: Requires associative operations (no median, for example)
- **Construction Time**: O(n) build time may be significant for one-off queries
- **Range Updates**: Without lazy propagation, range updates are O(n)

---

## Practice Problems

### Problem 1: Range Sum Query - Mutable

**Problem:** [LeetCode 307](https://leetcode.com/problems/range-sum-query-mutable/)

**Description:** Given an integer array `nums`, find the sum of the elements between indices `left` and `right` inclusive, where `left <= right`. Additionally, implement `update(index, val)` to modify `nums[index]` to a new value.

**How to Apply Segment Tree:**
- Build a segment tree on the input array
- Use `query(left, right)` for range sum queries
- Use `update(index, value)` for point updates
- Both operations run in O(log n) time

---

### Problem 2: Count of Range Sum

**Problem:** [LeetCode 327](https://leetcode.com/problems/count-of-range-sum/)

**Description:** Given an array `nums` and integers `lower` and `upper`, return the number of range sums that lie in `[lower, upper]`.

**How to Apply Segment Tree:**
- Use prefix sums and coordinate compression
- Build a segment tree over the compressed coordinates
- For each prefix sum, query how many previous sums fall in the valid range
- This is a classic application of segment tree for counting problems

---

### Problem 3: My Calendar I

**Problem:** [LeetCode 729](https://leetcode.com/problems/my-calendar-i/)

**Description:** Implement a `MyCalendar` class to store events as `[start, end)` intervals and check if a new event can be added without conflicts.

**How to Apply Segment Tree:**
- Use a segment tree over the time range
- Each node stores whether its segment is fully booked
- Query and update operations detect overlaps in O(log N) time

---

### Problem 4: Falling Squares

**Problem:** [LeetCode 699](https://leetcode.com/problems/falling-squares/)

**Description:** On an infinite number line (x-axis), we drop given squares in the order they are given. Each square has positions and sizes. Return the heights of the stack after each drop.

**How to Apply Segment Tree:**
- Use coordinate compression for large x-coordinates
- Segment tree stores maximum height in each range
- Range updates (with lazy propagation) add new square heights
- Query for maximum height in square's range

---

### Problem 5: Longest Increasing Subsequence II

**Problem:** [LeetCode 2407](https://leetcode.com/problems/longest-increasing-subsequence-ii/)

**Description:** Given an integer array `nums` and an integer `k`, find the length of the longest subsequence where each element is at most k greater than the previous element.

**How to Apply Segment Tree:**
- Use segment tree to store maximum LIS length ending at each value
- For each element, query max in range [num-k, num-1]
- Update position num with new LIS length
- Coordinate compression for large value ranges

---

## Video Tutorial Links

### Fundamentals

- [Segment Tree - Introduction (Take U Forward)](https://www.youtube.com/watch?v=2F4r0N2u4vU) - Comprehensive introduction to segment trees
- [Segment Tree Build & Query (WilliamFiset)](https://www.youtube.com/watch?v=zb72gK9jGNY) - Detailed explanation with visualizations
- [Segment Tree Implementation (NeetCode)](https://www.youtube.com/watch?v=2W2y2X8X7Qw) - Practical implementation guide

### Advanced Topics

- [Lazy Propagation (Take U Forward)](https://www.youtube.com/watch?v=xuoQq4f3-Js) - Range updates with lazy propagation
- [Segment Tree Practice Problems (NeetCode)](https://www.youtube.com/watch?v=3aVPh70xT3M) - Problem-solving strategies
- [Advanced Segment Tree Techniques](https://www.youtube.com/watch?v=2p2WxxT6r6w) - Complex variations

### Comparison with Alternatives

- [Segment Tree vs Fenwick Tree](https://www.youtube.com/watch?v=v0dJ4x4Y4cM) - When to use which data structure

---

## Follow-up Questions

### Q1: What is the difference between Segment Tree and Fenwick Tree?

**Answer:** Both support point updates and range queries in O(log n) time. However:
- **Segment Tree**: More flexible, can handle any associative operation (min, max, sum, product), easier to extend for range updates with lazy propagation
- **Fenwick Tree**: More memory efficient (O(n) vs O(4n)), slightly simpler implementation, but limited to prefix sums and similar operations

### Q2: Can Segment Tree handle non-commutative operations?

**Answer:** Yes, but you need to maintain both directions. For non-commutative operations like matrix multiplication or string concatenation, store both left-to-right and right-to-left values at each node, or ensure proper ordering during combination.

### Q3: What is the maximum size of array that segment tree can handle?

**Answer:** With O(n) space and O(log n) operations, segment trees can handle arrays up to ~10^6 elements easily in most languages. For larger datasets, consider:
- Using Fenwick Tree (lower memory)
- External memory segment trees
- Block-based approaches

### Q4: How do you handle overflow in segment tree?

**Answer:** Use appropriate data types:
- C++: Use long long for sums
- Python: Arbitrary precision (no overflow issue)
- Java: Use long for large sums
- Consider modular arithmetic if values need to be bounded

### Q5: Can segment tree be used for 2D range queries?

**Answer:** Yes, you can create a 2D segment tree (segment tree of segment trees) or use a quad tree. This increases time complexity to O(log² n) for queries and updates, but enables efficient matrix range queries and 2D range updates.

---

## Summary

The Segment Tree is a powerful data structure for:
- **Efficient range queries** in O(log n) time
- **Dynamic updates** with O(log n) complexity
- **Flexible operations** - supports any associative operation
- **Advanced variations** - lazy propagation, 2D trees, persistent segment trees

Key takeaways:
- Build once in O(n), then query/update in O(log n)
- Use lazy propagation for range updates
- Choose between segment tree (flexible) and Fenwick tree (efficient) based on requirements
- Practice the template until it becomes second nature

When to use:
- ✅ Range queries on dynamic arrays
- ✅ Associative operations (sum, min, max, GCD)
- ✅ Range updates needed
- ❌ Static data (use prefix sums or sparse tables)
- ❌ Non-associative operations (median)

This data structure is essential for competitive programming and technical interviews at major tech companies.
