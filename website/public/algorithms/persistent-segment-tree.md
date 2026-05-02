# Persistent Segment Tree

## Category
Advanced Data Structures & Persistent Data Structures

## Description

A Persistent Segment Tree (also called Chairman Tree or Functional Segment Tree) maintains all previous versions of the tree after each update. Unlike regular segment trees where updates modify the structure in-place, each update in a persistent version creates O(log n) new nodes while sharing unchanged subtrees with previous versions. This enables efficient queries on any historical version of the data.

This data structure is particularly powerful for problems requiring access to historical states, such as K-th order statistics in subarrays, range queries on previous versions of data, and undo operations. The path copying technique ensures immutability of past versions while keeping space complexity at O(n log n) for all versions combined.

---

## Concepts

The persistent segment tree relies on several fundamental concepts from functional programming and segment tree mechanics.

### 1. Persistence Through Path Copying

How persistence is achieved:

| Operation | Regular Segment Tree | Persistent Segment Tree |
|-----------|---------------------|------------------------|
| **Update** | Modify nodes in-place | Create new nodes along path |
| **New Nodes** | 0 | O(log n) per update |
| **Old Version** | Destroyed | Preserved unchanged |
| **Root Tracking** | Single root | Array of version roots |

### 2. Node Sharing

Memory efficiency through sharing:

```
Version 1:        Version 2:
    [4]             [5]      ← New root
   /   \           /   \
  [2]  [2]   →   [2]  [3]   ← New node
  / \  / \        / \  / \
 1  1 1  1       1  1 1  2  ← New leaf

Only 3 new nodes created instead of 7!
```

### 3. Version Management

Tracking multiple versions:

| Aspect | Implementation | Complexity |
|--------|---------------|------------|
| **Root Storage** | Array/List of root pointers | O(versions) |
| **Version Access** | Index into root array | O(1) |
| **New Version** | Append new root | O(log n) time, O(log n) space |
| **Query** | Traverse from specific root | O(log n) |

### 4. Coordinate Compression

For order statistics:

| Step | Purpose | Example |
|------|---------|---------|
| **Collect Values** | Get all unique elements | [5, 2, 8, 2, 5] → [2, 5, 8] |
| **Sort & Rank** | Map to 0..k-1 | 2→0, 5→1, 8→2 |
| **Build Tree** | On compressed coordinates | Size = 3 instead of 8 |

---

## Frameworks

Structured approaches for implementing persistent segment trees.

### Framework 1: Build and Update

```
┌─────────────────────────────────────────────────────────────┐
│  PERSISTENT SEGMENT TREE: BUILD AND UPDATE                    │
├─────────────────────────────────────────────────────────────┤
│  Node Structure:                                              │
│    - left: pointer to left child                              │
│    - right: pointer to right child                            │
│    - sum/count: aggregate value                               │
│                                                               │
│  BUILD(start, end, arr):                                     │
│    1. Create new node                                         │
│    2. If start == end:                                       │
│         node.sum = arr[start]                                │
│    3. Else:                                                   │
│         mid = (start + end) // 2                             │
│         node.left = BUILD(start, mid)                        │
│         node.right = BUILD(mid+1, end)                       │
│         node.sum = node.left.sum + node.right.sum            │
│    4. Return node                                             │
│                                                               │
│  UPDATE(prev_root, start, end, pos, val):                    │
│    1. Create new node (copy of prev_root if exists)          │
│    2. If start == end:                                       │
│         node.sum += val  (or set to val)                     │
│    3. Else:                                                   │
│         mid = (start + end) // 2                             │
│         If pos <= mid:                                       │
│           node.left = UPDATE(prev_root.left, start, mid...)  │
│           node.right = prev_root.right  ← Share unchanged    │
│         Else:                                                 │
│           node.left = prev_root.left  ← Share unchanged      │
│           node.right = UPDATE(prev_root.right, mid+1...)     │
│         node.sum = node.left.sum + node.right.sum           │
│    4. Return new_node                                         │
│                                                               │
│  Time: O(log n) per update, O(n) for build                    │
│  Space: O(log n) new nodes per update                         │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Standard persistent segment tree operations.

### Framework 2: K-th Order Statistics

```
┌─────────────────────────────────────────────────────────────┐
│  K-TH SMALLEST IN RANGE                                       │
├─────────────────────────────────────────────────────────────┤
│  Input: Two version roots (left_version, right_version)       │
│         Range [l, r] represented by versions                 │
│         k: find k-th smallest                                │
│  Output: k-th smallest element in range                      │
│                                                               │
│  KTH(left_root, right_root, start, end, k):                │
│    1. If start == end: return start (or compressed value)    │
│                                                               │
│    2. Calculate count in left child:                       │
│       count = right_root.left.sum - left_root.left.sum       │
│                                                               │
│    3. If count >= k:                                         │
│       Return KTH(left_root.left, right_root.left,           │
│                   start, mid, k)                             │
│    Else:                                                      │
│       Return KTH(left_root.right, right_root.right,         │
│                   mid+1, end, k - count)                     │
│                                                               │
│  Key Insight: Each version represents prefix [0..i]          │
│  Query(l, r) = query(root[r], 0, n-1) - query(root[l-1]...)  │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Finding K-th smallest in subarray queries.

### Framework 3: Persistence Decision Framework

```
┌─────────────────────────────────────────────────────────────┐
│  CHOOSING PERSISTENCE APPROACH                                │
├─────────────────────────────────────────────────────────────┤
│  Use Persistent Segment Tree when:                            │
│    ✓ Need to query historical versions                       │
│    ✓ K-th order statistics in subarray                       │
│    ✓ Undo functionality needed                                │
│    ✓ Immutable data structure preferred                       │
│    ✓ Offline queries with time dimension                     │
│                                                               │
│  Use Regular Segment Tree when:                              │
│    ✓ Only current state needed                                │
│    ✓ Online queries (answer immediately)                      │
│    ✓ Memory is constrained                                    │
│    ✓ Updates are infrequent                                   │
│                                                               │
│  Use Mo's Algorithm when:                                    │
│    ✓ Offline, no version tracking needed                    │
│    ✓ Can tolerate O((n+q)√n)                                 │
│    ✓ Add/remove is O(1)                                       │
│                                                               │
│  Use Wavelet Tree when:                                      │
│    ✓ Only need quantile queries                               │
│    ✓ No updates, static array                                 │
│    ✓ O(log n) query sufficient                                │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Deciding which data structure fits your problem.

---

## Forms

Different manifestations of persistent segment trees.

### Form 1: Sum/Count Persistence

Track frequencies or sums across versions.

| Aspect | Details |
|--------|---------|
| **Node Value** | Sum of range |
| **Update** | Add 1 for frequency, or set value |
| **Query** | Sum in range for specific version |
| **Use Case** | Count of smaller after self, prefix sums |

### Form 2: Order Statistics Tree

K-th smallest queries.

| Aspect | Details |
|--------|---------|
| **Build** | On coordinate-compressed values |
| **Update** | Add element at its compressed position |
| **Query** | K-th smallest in range [l, r] |
| **Versions** | Each prefix [0..i] is a version |

### Form 3: Range Version Query

Query any historical state.

| Aspect | Details |
|--------|---------|
| **Versions** | Explicit time-based versions |
| **Query** | "What was the sum at version t?" |
| **Use Case** | Undo operations, time travel queries |

### Form 4: Dynamic Persistence

With modifications.

| Aspect | Details |
|--------|---------|
| **Update Type** | Point updates, range updates (with lazy) |
| **Complexity** | O(log n) for point, O(log² n) for range |
| **Space** | O(q log n) for q updates |

### Form 5: Persistent with Lazy Propagation

For range updates.

| Aspect | Details |
|--------|---------|
| **Complexity** | More complex, O(log² n) per update |
| **Use** | Range add/set operations |
| **Note** | Significantly more complex implementation |

---

## Tactics

Specific techniques and implementations.

### Tactic 1: Basic Persistent Segment Tree

Complete implementation for range sum:

```python
class PSTNode:
    """Node for Persistent Segment Tree."""
    def __init__(self, left=None, right=None, sum_val=0):
        self.left = left
        self.right = right
        self.sum_val = sum_val

class PersistentSegmentTree:
    """Persistent segment tree for range sum queries."""
    
    def __init__(self, size):
        self.n = size
        self.roots = [None]
        self.roots[0] = self._build(0, self.n - 1)
    
    def _build(self, start, end):
        """Build empty tree."""
        node = PSTNode()
        if start != end:
            mid = (start + end) // 2
            node.left = self._build(start, mid)
            node.right = self._build(mid + 1, end)
        return node
    
    def update(self, version, pos, val):
        """Create new version with point update."""
        new_root = self._update(self.roots[version], 0, self.n - 1, pos, val)
        self.roots.append(new_root)
        return len(self.roots) - 1
    
    def _update(self, prev, start, end, pos, val):
        """Update helper - creates new nodes along path."""
        node = PSTNode()
        node.sum_val = prev.sum_val + val
        
        if start != end:
            mid = (start + end) // 2
            if pos <= mid:
                node.left = self._update(prev.left, start, mid, pos, val)
                node.right = prev.right  # Share unchanged subtree
            else:
                node.left = prev.left  # Share unchanged subtree
                node.right = self._update(prev.right, mid + 1, end, pos, val)
        
        return node
    
    def query(self, version, l, r):
        """Query sum in range [l, r] for specific version."""
        return self._query(self.roots[version], 0, self.n - 1, l, r)
    
    def _query(self, node, start, end, l, r):
        """Query helper."""
        if not node or start > r or end < l:
            return 0
        if l <= start and end <= r:
            return node.sum_val
        mid = (start + end) // 2
        return (self._query(node.left, start, mid, l, r) +
                self._query(node.right, mid + 1, end, l, r))
```

### Tactic 2: K-th Smallest in Range

Order statistics implementation:

```python
class OrderStatisticTree:
    """Persistent segment tree for K-th smallest queries."""
    
    def __init__(self, sorted_unique_values):
        """
        Args:
            sorted_unique_values: Sorted list of unique possible values
        """
        self.values = sorted_unique_values
        self.n = len(sorted_unique_values)
        self.roots = [None]
        self.roots[0] = self._build(0, self.n - 1)
    
    def _build(self, start, end):
        """Build empty tree."""
        node = PSTNode()
        if start != end:
            mid = (start + end) // 2
            node.left = self._build(start, mid)
            node.right = self._build(mid + 1, end)
        return node
    
    def add_element(self, version, value):
        """Add element and create new version."""
        pos = self._get_index(value)
        new_root = self._update(self.roots[version], 0, self.n - 1, pos, 1)
        self.roots.append(new_root)
        return len(self.roots) - 1
    
    def _update(self, prev, start, end, pos, val):
        """Standard persistent update."""
        node = PSTNode(sum_val=prev.sum_val + val)
        
        if start != end:
            mid = (start + end) // 2
            if pos <= mid:
                node.left = self._update(prev.left, start, mid, pos, val)
                node.right = prev.right
            else:
                node.left = prev.left
                node.right = self._update(prev.right, mid + 1, end, pos, val)
        
        return node
    
    def kth_smallest(self, left_version, right_version, k):
        """
        Find k-th smallest in range represented by versions.
        Range is (left_version, right_version] meaning elements added
        after left_version up to and including right_version.
        """
        return self._kth(self.roots[left_version], self.roots[right_version],
                        0, self.n - 1, k)
    
    def _kth(self, left_node, right_node, start, end, k):
        """K-th smallest helper."""
        if start == end:
            return self.values[start]
        
        mid = (start + end) // 2
        # Count in left subtree = right.left.sum - left.left.sum
        left_count = right_node.left.sum_val - left_node.left.sum_val
        
        if left_count >= k:
            return self._kth(left_node.left, right_node.left, start, mid, k)
        else:
            return self._kth(left_node.right, right_node.right, mid + 1, end,
                           k - left_count)
    
    def _get_index(self, value):
        """Binary search for compressed index."""
        from bisect import bisect_left
        return bisect_left(self.values, value)
```

### Tactic 3: Count of Smaller After Self

LeetCode 315 solution:

```python
def count_smaller(nums):
    """
    LeetCode 315: Count of Smaller Numbers After Self.
    For each element, count smaller elements to its right.
    """
    if not nums:
        return []
    
    # Coordinate compression
    sorted_unique = sorted(set(nums))
    rank = {v: i for i, v in enumerate(sorted_unique)}
    
    n = len(sorted_unique)
    pst = PersistentSegmentTree(n)
    
    # Build initial empty version
    current_version = 0
    result = []
    
    # Process from right to left
    for num in reversed(nums):
        r = rank[num]
        # Query [0, r-1] for count of smaller elements
        if r > 0:
            count = pst.query(current_version, 0, r - 1)
        else:
            count = 0
        result.append(count)
        # Update creates new version
        current_version = pst.update(current_version, r, 1)
    
    return result[::-1]
```

### Tactic 4: Static Range K-th Query

For known array:

```python
def range_kth_smallest(arr, queries):
    """
    Answer queries of form: k-th smallest in arr[l..r]
    """
    # Coordinate compression
    sorted_unique = sorted(set(arr))
    rank = {v: i for i, v in enumerate(sorted_unique)}
    
    n = len(sorted_unique)
    ost = OrderStatisticTree(sorted_unique)
    
    # Build versions: version i represents prefix arr[0..i-1]
    for num in arr:
        ost.add_element(len(ost.roots) - 1, num)
    
    # Answer queries
    results = []
    for l, r, k in queries:
        # Range [l, r] is represented by versions (l, r+1]
        results.append(ost.kth_smallest(l, r + 1, k))
    
    return results
```

### Tactic 5: Memory-Optimized Version

Using arrays instead of objects:

```python
class MemoryOptimizedPST:
    """Persistent segment tree using arrays for better performance."""
    
    def __init__(self, size):
        self.N = size
        self.max_nodes = size * 20  # Sufficient for most cases
        
        # Arrays for node storage
        self.left = [0] * self.max_nodes
        self.right = [0] * self.max_nodes
        self.sum_val = [0] * self.max_nodes
        
        self.node_count = 0
        self.roots = [0]
        
        # Build initial tree
        self.roots[0] = self._build(0, self.N - 1)
    
    def _new_node(self, copy_from=0):
        """Create new node, optionally copying from existing."""
        self.node_count += 1
        idx = self.node_count
        self.left[idx] = self.left[copy_from]
        self.right[idx] = self.right[copy_from]
        self.sum_val[idx] = self.sum_val[copy_from]
        return idx
    
    def _build(self, start, end):
        node = self._new_node()
        if start != end:
            mid = (start + end) // 2
            self.left[node] = self._build(start, mid)
            self.right[node] = self._build(mid + 1, end)
        return node
    
    def update(self, version, pos, val):
        new_root = self._update(self.roots[version], 0, self.N - 1, pos, val)
        self.roots.append(new_root)
        return len(self.roots) - 1
    
    def _update(self, prev, start, end, pos, val):
        node = self._new_node(prev)
        self.sum_val[node] += val
        
        if start != end:
            mid = (start + end) // 2
            if pos <= mid:
                self.left[node] = self._update(self.left[prev], start, mid, pos, val)
            else:
                self.right[node] = self._update(self.right[prev], mid + 1, end, pos, val)
        
        return node
```

---

## Python Templates

### Template 1: Persistent Segment Tree (Range Sum)

```python
class PSTNode:
    """Node for Persistent Segment Tree."""
    def __init__(self, left=None, right=None, sum_val=0):
        self.left = left
        self.right = right
        self.sum_val = sum_val

class PersistentSegmentTree:
    """
    Persistent segment tree for range sum queries.
    Each update creates a new version with O(log n) new nodes.
    """
    
    def __init__(self, size: int):
        """
        Initialize with given coordinate range size.
        
        Args:
            size: Number of positions (0 to size-1)
        """
        self.n = size
        self.roots = [None]  # roots[version] = root node
        self.roots[0] = self._build(0, self.n - 1)
    
    def _build(self, start: int, end: int):
        """Build initial empty tree."""
        node = PSTNode()
        if start != end:
            mid = (start + end) // 2
            node.left = self._build(start, mid)
            node.right = self._build(mid + 1, end)
        return node
    
    def update(self, version: int, pos: int, val: int) -> int:
        """
        Create new version with point update.
        
        Args:
            version: Base version to update from
            pos: Position to update
            val: Value to add (or set)
        
        Returns:
            New version number
        """
        new_root = self._update(self.roots[version], 0, self.n - 1, pos, val)
        self.roots.append(new_root)
        return len(self.roots) - 1
    
    def _update(self, prev, start: int, end: int, pos: int, val: int):
        """Internal update - creates new nodes along path."""
        node = PSTNode(sum_val=prev.sum_val + val)
        
        if start != end:
            mid = (start + end) // 2
            if pos <= mid:
                node.left = self._update(prev.left, start, mid, pos, val)
                node.right = prev.right  # Share unchanged
            else:
                node.left = prev.left  # Share unchanged
                node.right = self._update(prev.right, mid + 1, end, pos, val)
        
        return node
    
    def query(self, version: int, l: int, r: int) -> int:
        """
        Query sum in range [l, r] for specific version.
        
        Args:
            version: Version to query
            l, r: Range bounds (inclusive)
        
        Returns:
            Sum in range
        """
        return self._query(self.roots[version], 0, self.n - 1, l, r)
    
    def _query(self, node, start: int, end: int, l: int, r: int) -> int:
        """Internal query helper."""
        if not node or start > r or end < l:
            return 0
        if l <= start and end <= r:
            return node.sum_val
        mid = (start + end) // 2
        return (self._query(node.left, start, mid, l, r) +
                self._query(node.right, mid + 1, end, l, r))
```

### Template 2: Order Statistic Tree (K-th Smallest)

```python
from bisect import bisect_left
from typing import List

class OrderStatisticTree:
    """
    Persistent segment tree for K-th smallest queries.
    Used for range order statistics.
    """
    
    def __init__(self, sorted_values: List[int]):
        """
        Initialize with sorted unique values.
        
        Args:
            sorted_values: Sorted list of all possible values
        """
        self.values = sorted_values
        self.n = len(sorted_values)
        self.roots = [None]
        self.roots[0] = self._build(0, self.n - 1)
    
    def _build(self, start: int, end: int):
        """Build empty tree."""
        node = PSTNode()
        if start != end:
            mid = (start + end) // 2
            node.left = self._build(start, mid)
            node.right = self._build(mid + 1, end)
        return node
    
    def add(self, version: int, value: int) -> int:
        """Add element and create new version."""
        pos = bisect_left(self.values, value)
        new_root = self._update(self.roots[version], 0, self.n - 1, pos, 1)
        self.roots.append(new_root)
        return len(self.roots) - 1
    
    def _update(self, prev, start: int, end: int, pos: int, val: int):
        """Standard persistent update."""
        node = PSTNode(sum_val=prev.sum_val + val)
        
        if start != end:
            mid = (start + end) // 2
            if pos <= mid:
                node.left = self._update(prev.left, start, mid, pos, val)
                node.right = prev.right
            else:
                node.left = prev.left
                node.right = self._update(prev.right, mid + 1, end, pos, val)
        
        return node
    
    def kth(self, left_version: int, right_version: int, k: int) -> int:
        """
        Find k-th smallest in range (left_version, right_version].
        
        Args:
            left_version: Left bound version (exclusive)
            right_version: Right bound version (inclusive)
            k: Find k-th smallest (1-indexed)
        
        Returns:
            k-th smallest value
        """
        return self._kth(self.roots[left_version], self.roots[right_version],
                         0, self.n - 1, k)
    
    def _kth(self, left_node, right_node, start: int, end: int, k: int) -> int:
        """K-th smallest helper."""
        if start == end:
            return self.values[start]
        
        mid = (start + end) // 2
        left_count = right_node.left.sum_val - left_node.left.sum_val
        
        if left_count >= k:
            return self._kth(left_node.left, right_node.left, start, mid, k)
        else:
            return self._kth(left_node.right, right_node.right, mid + 1, end,
                           k - left_count)
```

### Template 3: LeetCode 315 - Count of Smaller After Self

```python
def count_smaller(nums: List[int]) -> List[int]:
    """
    LeetCode 315: Count of Smaller Numbers After Self.
    For each element, count how many elements to its right are smaller.
    
    Args:
        nums: List of integers
    
    Returns:
        List of counts for each position
        
    Time: O(n log n)
    Space: O(n log n) for persistence
    """
    if not nums:
        return []
    
    # Coordinate compression
    sorted_unique = sorted(set(nums))
    rank = {v: i for i, v in enumerate(sorted_unique)}
    
    n = len(sorted_unique)
    pst = PersistentSegmentTree(n)
    
    current_version = 0
    result = []
    
    # Process from right to left
    for num in reversed(nums):
        r = rank[num]
        # Count elements in range [0, r-1] = smaller than current
        if r > 0:
            count = pst.query(current_version, 0, r - 1)
        else:
            count = 0
        result.append(count)
        # Add current element as new version
        current_version = pst.update(current_version, r, 1)
    
    return result[::-1]
```

### Template 4: Range K-th Query

```python
def range_kth_query(arr: List[int], queries: List[tuple]) -> List[int]:
    """
    Answer queries: k-th smallest in arr[l..r] for each query (l, r, k).
    
    Args:
        arr: Input array
        queries: List of (left, right, k) queries
    
    Returns:
        List of answers
        
    Time: O((n + q) log n)
    Space: O(n log n)
    """
    if not arr or not queries:
        return []
    
    # Coordinate compression
    sorted_unique = sorted(set(arr))
    rank = {v: i for i, v in enumerate(sorted_unique)}
    
    # Build persistent segment tree with all array elements
    ost = OrderStatisticTree(sorted_unique)
    
    # Create versions: version i contains arr[0..i-1]
    for num in arr:
        ost.add(len(ost.roots) - 1, num)
    
    # Answer queries
    results = []
    for l, r, k in queries:
        # Range [l, r] corresponds to versions (l, r+1]
        results.append(ost.kth(l, r + 1, k))
    
    return results
```

### Template 5: Persistent Segment Tree with Arrays

```python
class FastPST:
    """
    Memory-optimized persistent segment tree using arrays.
    Better cache performance and lower overhead than object-based.
    """
    
    def __init__(self, size: int, max_updates: int = 100000):
        """
        Args:
            size: Coordinate range
            max_updates: Expected number of updates (for preallocation)
        """
        self.n = size
        max_nodes = size * 4 + max_updates * 20
        
        # Preallocate arrays
        self.left = [0] * max_nodes
        self.right = [0] * max_nodes
        self.sum_val = [0] * max_nodes
        
        self.node_cnt = 0
        self.roots = [0]
        self.roots[0] = self._build(0, self.n - 1)
    
    def _new_node(self, copy_from: int = 0) -> int:
        """Create new node index."""
        self.node_cnt += 1
        idx = self.node_cnt
        self.left[idx] = self.left[copy_from]
        self.right[idx] = self.right[copy_from]
        self.sum_val[idx] = self.sum_val[copy_from]
        return idx
    
    def _build(self, start: int, end: int) -> int:
        """Build initial tree."""
        node = self._new_node()
        if start != end:
            mid = (start + end) // 2
            self.left[node] = self._build(start, mid)
            self.right[node] = self._build(mid + 1, end)
        return node
    
    def update(self, version: int, pos: int, val: int) -> int:
        """Create new version."""
        new_root = self._update(self.roots[version], 0, self.n - 1, pos, val)
        self.roots.append(new_root)
        return len(self.roots) - 1
    
    def _update(self, prev: int, start: int, end: int, pos: int, val: int) -> int:
        """Internal update."""
        node = self._new_node(prev)
        self.sum_val[node] += val
        
        if start != end:
            mid = (start + end) // 2
            if pos <= mid:
                self.left[node] = self._update(self.left[prev], start, mid, pos, val)
            else:
                self.right[node] = self._update(self.right[prev], mid + 1, end, pos, val)
        
        return node
    
    def query(self, version: int, l: int, r: int) -> int:
        """Range sum query."""
        return self._query(self.roots[version], 0, self.n - 1, l, r)
    
    def _query(self, node: int, start: int, end: int, l: int, r: int) -> int:
        """Internal query."""
        if not node or start > r or end < l:
            return 0
        if l <= start and end <= r:
            return self.sum_val[node]
        mid = (start + end) // 2
        return (self._query(self.left[node], start, mid, l, r) +
                self._query(self.right[node], mid + 1, end, l, r))
```

### Template 6: K-th Largest in Range

```python
def kth_largest_in_range(arr: List[int], queries: List[tuple]) -> List[int]:
    """
    Find k-th largest (instead of smallest) in range queries.
    
    Args:
        arr: Input array
        queries: List of (left, right, k) for k-th largest
    
    Returns:
        List of k-th largest values
    """
    if not arr or not queries:
        return []
    
    # Use same approach but query for (count - k + 1)-th smallest
    sorted_unique = sorted(set(arr))
    ost = OrderStatisticTree(sorted_unique)
    
    # Build versions
    for num in arr:
        ost.add(len(ost.roots) - 1, num)
    
    results = []
    for l, r, k in queries:
        # Total elements in range
        total = r - l + 1
        # k-th largest = (total - k + 1)-th smallest
        kth_smallest_pos = total - k + 1
        results.append(ost.kth(l, r + 1, kth_smallest_pos))
    
    return results
```

---

## When to Use

Use Persistent Segment Tree when you need to solve problems involving:

- **Historical Queries**: Query any previous version of the data
- **K-th Order Statistics**: Find K-th smallest/largest in subarray
- **Undo Operations**: Revert to previous states
- **Immutable Snapshots**: Functional programming style persistence
- **Offline Time-based Queries**: Queries with time dimension

### Comparison: PST vs Alternatives

| Data Structure | Persistence | K-th Query | Space | Build Time |
|---------------|-------------|------------|-------|------------|
| **Persistent ST** | Full | O(log n) | O(n log n) | O(n log n) |
| **Wavelet Tree** | None (static) | O(log n) | O(n log n) | O(n log n) |
| **Segment Tree** | None | O(log² n) | O(n) | O(n) |
| **Fenwick Tree** | None | No | O(n) | O(n log n) |
| **Sqrt Tree** | None | O(1) | O(n log n) | O(n log n) |

### When to Choose Each Approach

- **Choose Persistent ST** when:
  - Need K-th smallest in subarray queries
  - Historical version access required
  - Can afford O(n log n) space
  - Array is static or append-only

- **Choose Wavelet Tree** when:
  - Only static K-th queries needed
  - No updates or versioning required
  - Simpler alternative to PST

- **Choose Mo's Algorithm** when:
  - Offline queries acceptable
  - Can tolerate O((n+q)√n)
  - Memory is constrained

- **Choose Merge Sort Tree** when:
  - Need range mode or median
  - Can accept O(log² n) query
  - Space is limited

---

## Algorithm Explanation

### Core Concept

The persistent segment tree achieves persistence through path copying: instead of modifying nodes in-place, we create new nodes along the update path while sharing unchanged subtrees with previous versions. This creates a new root for each version while preserving all historical roots.

### How It Works

#### Step 1: Understanding Path Copying

When updating position 3 in a tree with 8 leaves:
```
Original Tree:          After Update:
      [7]                   [8]  ← New root
     /   \                 /   \
   [3]   [4]      →     [3]   [5]  ← New node
   / \   / \             / \   / \
  1  2  3  4            1  2  3  5  ← New leaf
```
Only 3 new nodes created (the path from root to updated leaf).

#### Step 2: Version Management

```
Version 0: root_0 → original tree
Version 1: root_1 → update from version 0
Version 2: root_2 → update from version 1

roots = [root_0, root_1, root_2]

Query version 1: Start traversal from root_1
```

### Visual Representation

**K-th Smallest Query**:
```
Array: [4, 1, 3, 2, 5]
Queries: k-th smallest in [1, 3] (0-indexed: elements 1,3,2)

Versions:
V0: empty
V1: [4]
V2: [4, 1]
V3: [4, 1, 3]  ← left bound
V4: [4, 1, 3, 2]
V5: [4, 1, 3, 2, 5]  ← right bound

Query(V3, V5, k=2):
  Count in left half of V5 minus V3
  → determines which half contains answer
```

### Why It Works

1. **Immutability**: Old versions unchanged because we never modify existing nodes
2. **Sharing**: Common subtrees shared between versions save space
3. **Logarithmic Cost**: Each update only touches O(log n) nodes
4. **Version Isolation**: Each root represents a complete, independent snapshot

### Limitations

- **Space**: O(n log n) total space for n versions
- **Static Base**: Usually built on static compressed coordinates
- **Complexity**: More complex than regular segment tree
- **Cache Performance**: Pointer chasing can hurt cache efficiency

---

## Practice Problems

### Problem 1: Count of Smaller Numbers After Self

**Problem:** [LeetCode 315 - Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self/)

**Description:** For each element, count smaller elements to its right.

**How to Apply:**
- Build versions from right to left
- Query count in range [0, current_rank-1]
- Update with current element

---

### Problem 2: K-th Smallest Pair Distance

**Problem:** [LeetCode 719 - Find K-th Smallest Pair Distance](https://leetcode.com/problems/find-k-th-smallest-pair-distance/)

**Description:** Find k-th smallest absolute difference among all pairs.

**How to Apply:**
- Binary search on distance
- Use persistent segment tree for counting pairs
- Or use sorted array + selection

---

### Problem 3: Range Sum Query - Mutable (with persistence)

**Problem:** [LeetCode 307 - Range Sum Query - Mutable](https://leetcode.com/problems/range-sum-query-mutable/)

**Description:** Range sum queries with point updates.

**How to Apply:**
- Each update creates new version
- Query specific version for historical sum
- Or use for undo functionality

---

### Problem 4: K-th Largest Element in a Stream

**Problem:** [LeetCode 703 - Kth Largest Element in a Stream](https://leetcode.com/problems/kth-largest-element-in-a-stream/)

**Description:** Track k-th largest as elements added.

**How to Apply:**
- Use order statistic tree
- Add elements as they arrive
- Query k-th largest at any point

---

## Video Tutorial Links

### Fundamentals

- [Persistent Segment Tree - Algorithms Live](https://www.youtube.com/watch?v=6pVvTEBO1Zw) - Core concepts
- [Chairman Tree - William Fiset](https://www.youtube.com/watch?v=2F7P7H7nTzg) - K-th order statistics
- [Functional Data Structures - MIT](https://www.youtube.com/watch?v=0BWPz6CHTop) - Persistence theory

### Problem Solving

- [K-th Number - Codeforces](https://www.youtube.com/watch?v=2F7P7H7nTzg) - Range queries
- [Order Statistics - Competitive Programming](https://www.youtube.com/watch?v=6pVvTEBO1Zw) - Applications

---

## Follow-up Questions

### Q1: How much memory does a persistent segment tree use?

**Answer:** O(n log n) for n updates. Each update creates O(log n) new nodes. For an array of size n with n updates, expect approximately n × log₂(n) nodes. With coordinate compression on m unique values, each update creates O(log m) nodes.

---

### Q2: Can persistent segment trees handle range updates?

**Answer:** Yes, but it requires lazy propagation and becomes more complex. Each range update would create O(log² n) new nodes in the worst case. Point updates are preferred for persistence; for range updates, consider other structures or batch processing.

---

### Q3: What's the difference between a persistent segment tree and a wavelet tree?

**Answer:** Both support K-th smallest queries in O(log n). Wavelet tree is static (no updates) and often simpler to implement. Persistent ST supports updates and maintains all versions. Wavelet tree uses bitmaps; PST uses node sharing. Choose wavelet tree for static K-th queries, PST when you need persistence.

---

### Q4: How do you handle coordinate compression in PST?

**Answer:** 1) Collect all values that will ever be inserted, 2) Sort and deduplicate, 3) Map each value to its index (0..k-1), 4) Build PST on range [0, k-1]. For unknown values upfront, estimate range or rebuild when needed.

---

### Q5: When is Mo's algorithm better than persistent segment tree?

**Answer:** Mo's is better when: 1) Queries are offline (known in advance), 2) Memory is constrained (O(n) vs O(n log n)), 3) Operations are simpler (O(1) add/remove vs O(log n) update/query), 4) You don't need historical versions. PST wins for online queries, K-th order statistics, and when query order matters.

---

## Summary

The Persistent Segment Tree is a powerful data structure for problems requiring historical data access and order statistics. The key takeaways are:

1. **Path Copying**: Create O(log n) new nodes per update, share unchanged subtrees
2. **Version Management**: Array of roots provides access to any historical state
3. **Order Statistics**: Combine with coordinate compression for K-th smallest queries
4. **Space Trade-off**: O(n log n) space enables O(log n) historical queries
5. **Immutability**: Each version is preserved, enabling undo and time-travel queries

**When to Use:**
- K-th smallest/largest in subarray
- Historical version queries
- Immutable snapshots needed
- Problems with time dimension

**Key Formula:**
```
Update: O(log n) time, O(log n) new nodes
Query: O(log n) time
Space: O(n log n) for n versions
```

This advanced data structure is essential for competitive programming and interview problems requiring efficient order statistics and historical queries.
