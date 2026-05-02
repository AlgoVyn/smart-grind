# Lazy Propagation (Segment Tree)

## Category
Advanced Data Structures

## Description

Lazy Propagation is an optimization technique for segment trees that enables efficient range updates in O(log n) time instead of O(n log n). Instead of immediately updating all elements in a range, the algorithm postpones updates by storing "lazy" values at nodes and only propagates changes when necessary.

This technique is essential for problems requiring both range queries and range updates, such as range addition, range assignment, or range multiplication. Without lazy propagation, updating a range would require visiting each element individually, resulting in O(n log n) time per update. With lazy propagation, both queries and updates are handled in O(log n) amortized time, making it a powerful tool for competitive programming and real-time data processing applications.

---

## Concepts

Lazy propagation is built on several fundamental concepts that make it efficient.

### 1. The Lazy Tag

Deferred update storage mechanism:

| Concept | Description |
|---------|-------------|
| **Lazy Array** | Parallel array storing pending updates |
| **Tag Storage** | Each node can store a pending operation |
| **Propagation** | Pushing lazy values to children when needed |
| **Application** | Applying pending updates to current node |

### 2. When to Propagate

Three scenarios during tree traversal:

| Scenario | Action | Lazy Handling |
|----------|--------|---------------|
| **No Overlap** | Return identity | No change |
| **Total Overlap** | Apply to node, mark children lazy | Store pending update |
| **Partial Overlap** | Propagate first, then recurse | Push before recursing |

### 3. Propagation Chain

How lazy values flow down the tree:

```
Range Update [2, 5] with value +3:

       [0-7] lazy=0
          ↓
    [0-3] lazy=0    [4-7] lazy=0
       ↓                ↓
  [0-1]  [2-3]+3    [4-5]+3  [6-7]
  lazy=0  lazy=3    lazy=3   lazy=0

Query [2, 3]:
  - Propagate [2-3]'s lazy=3 to children
  - Then answer query
```

### 4. Time Complexity

| Operation | Without Lazy | With Lazy |
|-----------|--------------|-----------|
| Build | O(n) | O(n) |
| Point Query | O(log n) | O(log n) |
| Point Update | O(log n) | O(log n) |
| Range Query | O(log n) | O(log n) |
| Range Update | O(n log n) | O(log n) |

---

## Frameworks

Structured approaches for implementing lazy propagation.

### Framework 1: Range Add with Range Sum Query

```
┌─────────────────────────────────────────────────────────────┐
│  LAZY PROPAGATION - RANGE ADD FRAMEWORK                       │
├─────────────────────────────────────────────────────────────┤
│  DATA STRUCTURE:                                              │
│    tree[] - segment tree values                               │
│    lazy[] - pending additions to be propagated                │
│                                                                │
│  PROPAGATE(node, start, end):                                 │
│    If lazy[node] != 0:                                        │
│      tree[node] += lazy[node] * (end - start + 1)            │
│      If not leaf:                                             │
│        lazy[left_child] += lazy[node]                         │
│        lazy[right_child] += lazy[node]                        │
│      lazy[node] = 0                                          │
│                                                                │
│  RANGE_UPDATE(node, start, end, l, r, val):                  │
│    PROPAGATE(node, start, end)                               │
│    If r < start OR l > end: return                           │
│    If l <= start AND end <= r:                                │
│      tree[node] += val * (end - start + 1)                   │
│      If not leaf: lazy[left] += val, lazy[right] += val      │
│      return                                                    │
│    mid = (start + end) // 2                                  │
│    RANGE_UPDATE(left, start, mid, l, r, val)               │
│    RANGE_UPDATE(right, mid+1, end, l, r, val)               │
│    tree[node] = tree[left] + tree[right]                      │
│                                                                │
│  RANGE_QUERY(node, start, end, l, r):                          │
│    PROPAGATE(node, start, end)                               │
│    If r < start OR l > end: return 0                         │
│    If l <= start AND end <= r: return tree[node]            │
│    mid = (start + end) // 2                                  │
│    return QUERY(left, start, mid, l, r) +                    │
│           QUERY(right, mid+1, end, l, r)                      │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Range addition operations with sum queries.

### Framework 2: Range Assignment (Set Operations)

```
┌─────────────────────────────────────────────────────────────┐
│  LAZY ASSIGNMENT FRAMEWORK                                    │
├─────────────────────────────────────────────────────────────┤
│  For range assignment (set all values to X):               │
│                                                                │
│  Changes from addition framework:                             │
│    - lazy[] stores assigned value or "no assignment" flag    │
│    - Assignment overwrites previous assignments              │
│    - Use special value (e.g., None) for "no pending"       │
│                                                                │
│  PROPAGATE:                                                   │
│    If lazy[node] is not None:                                │
│      tree[node] = lazy[node] * (end - start + 1)            │
│      If not leaf:                                            │
│        lazy[left] = lazy[node]  (overwrite, not add!)        │
│        lazy[right] = lazy[node]                              │
│      lazy[node] = None                                       │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Range set/assignment operations.

### Framework 3: Algorithm Decision

```
┌─────────────────────────────────────────────────────────────┐
│  CHOOSING SEGMENT TREE TYPE                                   │
├─────────────────────────────────────────────────────────────┤
│  Use Standard Segment Tree when:                            │
│    ✓ Only point updates needed                              │
│    ✓ No range updates required                              │
│    ✓ Space efficiency is priority                           │
│                                                                │
│  Use Lazy Segment Tree when:                                  │
│    ✓ Range updates are frequent                             │
│    ✓ Range add/assign/multiply needed                       │
│    ✓ O(log n) update time is required                       │
│                                                                │
│  Use Fenwick Tree when:                                     │
│    ✓ Only prefix sums needed                                │
│    ✓ Point updates and prefix queries                       │
│    ✓ Space is constrained                                   │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Deciding which data structure to use.

---

## Forms

Different manifestations of lazy propagation.

### Form 1: Range Addition

Add a value to all elements in a range.

| Operation | Lazy Storage | Application |
|-----------|--------------|-------------|
| **Add val** | `lazy[node] += val` | `tree[node] += val * count` |
| **Propagation** | `lazy[child] += lazy[node]` | Accumulates |

### Form 2: Range Assignment

Set all elements in a range to a value.

| Operation | Lazy Storage | Application |
|-----------|--------------|-------------|
| **Assign val** | `lazy[node] = val` | `tree[node] = val * count` |
| **Propagation** | `lazy[child] = lazy[node]` | Overwrites |

### Form 3: Range Multiplication

Multiply all elements in a range.

| Operation | Lazy Storage | Application |
|-----------|--------------|-------------|
| **Multiply val** | `mul_lazy[node] *= val` | `tree[node] *= val` |
| **Note** | Often combined with add_lazy | Maintains two lazies |

### Form 4: Range Min/Max with Lazy

Lazy propagation for min/max queries.

| Aspect | Details |
|--------|---------|
| **Lazy Type** | Same as value type (not additive count) |
| **Propagation** | Push min/max constraints down |
| **Complexity** | Similar to sum, but different semantics |

### Form 5: Persistent Lazy Segment Tree

Combining persistence with lazy propagation.

| Aspect | Details |
|--------|---------|
| **Challenge** | Lazy tags complicate path copying |
| **Solution** | Propagate before copying, or store lazy per version |
| **Use Case** | Historical range queries with range updates |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Standard Lazy Segment Tree (Range Add)

Complete implementation for range addition:

```python
class LazySegmentTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.tree = [0] * (4 * self.n)
        self.lazy = [0] * (4 * self.n)
        self._build(arr, 0, 0, self.n - 1)
    
    def _build(self, arr, node, start, end):
        if start == end:
            self.tree[node] = arr[start]
        else:
            mid = (start + end) // 2
            self._build(arr, 2 * node + 1, start, mid)
            self._build(arr, 2 * node + 2, mid + 1, end)
            self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]
    
    def _propagate(self, node, start, end):
        if self.lazy[node] != 0:
            self.tree[node] += self.lazy[node] * (end - start + 1)
            if start != end:
                self.lazy[2 * node + 1] += self.lazy[node]
                self.lazy[2 * node + 2] += self.lazy[node]
            self.lazy[node] = 0
    
    def range_update(self, l, r, val):
        self._range_update(0, 0, self.n - 1, l, r, val)
    
    def _range_update(self, node, start, end, l, r, val):
        self._propagate(node, start, end)
        if start > r or end < l:
            return
        if l <= start and end <= r:
            self.tree[node] += val * (end - start + 1)
            if start != end:
                self.lazy[2 * node + 1] += val
                self.lazy[2 * node + 2] += val
            return
        mid = (start + end) // 2
        self._range_update(2 * node + 1, start, mid, l, r, val)
        self._range_update(2 * node + 2, mid + 1, end, l, r, val)
        self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]
    
    def range_query(self, l, r):
        return self._range_query(0, 0, self.n - 1, l, r)
    
    def _range_query(self, node, start, end, l, r):
        self._propagate(node, start, end)
        if start > r or end < l:
            return 0
        if l <= start and end <= r:
            return self.tree[node]
        mid = (start + end) // 2
        left_sum = self._range_query(2 * node + 1, start, mid, l, r)
        right_sum = self._range_query(2 * node + 2, mid + 1, end, l, r)
        return left_sum + right_sum
```

### Tactic 2: Lazy Propagation with Assignment

For range set operations:

```python
class LazyAssignSegmentTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.tree = [0] * (4 * self.n)
        self.lazy = [None] * (4 * self.n)
        self._build(arr, 0, 0, self.n - 1)
    
    def _build(self, arr, node, start, end):
        if start == end:
            self.tree[node] = arr[start]
        else:
            mid = (start + end) // 2
            self._build(arr, 2 * node + 1, start, mid)
            self._build(arr, 2 * node + 2, mid + 1, end)
            self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]
    
    def _propagate(self, node, start, end):
        if self.lazy[node] is not None:
            self.tree[node] = self.lazy[node] * (end - start + 1)
            if start != end:
                self.lazy[2 * node + 1] = self.lazy[node]
                self.lazy[2 * node + 2] = self.lazy[node]
            self.lazy[node] = None
    
    def range_assign(self, l, r, val):
        self._range_assign(0, 0, self.n - 1, l, r, val)
    
    def _range_assign(self, node, start, end, l, r, val):
        self._propagate(node, start, end)
        if start > r or end < l:
            return
        if l <= start and end <= r:
            self.tree[node] = val * (end - start + 1)
            if start != end:
                self.lazy[2 * node + 1] = val
                self.lazy[2 * node + 2] = val
            return
        mid = (start + end) // 2
        self._range_assign(2 * node + 1, start, mid, l, r, val)
        self._range_assign(2 * node + 2, mid + 1, end, l, r, val)
        self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]
```

### Tactic 3: Point Query in Lazy Tree

Querying single elements:

```python
def point_query(self, idx):
    """Get value at specific index."""
    return self._range_query(0, 0, self.n - 1, idx, idx)
```

### Tactic 4: Range Minimum with Lazy

Lazy propagation for range minimum:

```python
class LazySegmentTreeMin:
    def __init__(self, arr):
        self.n = len(arr)
        self.tree = [float('inf')] * (4 * self.n)
        self.lazy = [0] * (4 * self.n)
        self._build(arr, 0, 0, self.n - 1)
    
    def _build(self, arr, node, start, end):
        if start == end:
            self.tree[node] = arr[start]
        else:
            mid = (start + end) // 2
            self._build(arr, 2 * node + 1, start, mid)
            self._build(arr, 2 * node + 2, mid + 1, end)
            self.tree[node] = min(self.tree[2 * node + 1], self.tree[2 * node + 2])
    
    def _propagate(self, node, start, end):
        if self.lazy[node] != 0:
            self.tree[node] += self.lazy[node]
            if start != end:
                self.lazy[2 * node + 1] += self.lazy[node]
                self.lazy[2 * node + 2] += self.lazy[node]
            self.lazy[node] = 0
    
    def range_add(self, l, r, val):
        self._range_add(0, 0, self.n - 1, l, r, val)
    
    def _range_add(self, node, start, end, l, r, val):
        self._propagate(node, start, end)
        if start > r or end < l:
            return
        if l <= start and end <= r:
            self.tree[node] += val
            if start != end:
                self.lazy[2 * node + 1] += val
                self.lazy[2 * node + 2] += val
            return
        mid = (start + end) // 2
        self._range_add(2 * node + 1, start, mid, l, r, val)
        self._range_add(2 * node + 2, mid + 1, end, l, r, val)
        self.tree[node] = min(self.tree[2 * node + 1], self.tree[2 * node + 2])
    
    def range_min(self, l, r):
        return self._range_min(0, 0, self.n - 1, l, r)
    
    def _range_min(self, node, start, end, l, r):
        self._propagate(node, start, end)
        if start > r or end < l:
            return float('inf')
        if l <= start and end <= r:
            return self.tree[node]
        mid = (start + end) // 2
        return min(self._range_min(2 * node + 1, start, mid, l, r),
                   self._range_min(2 * node + 2, mid + 1, end, l, r))
```

### Tactic 5: Push-Only Optimization

Defer propagation to query time:

```python
def _query(self, node, start, end, l, r):
    # Only propagate when necessary
    if self.lazy[node] != 0:
        self.tree[node] += self.lazy[node] * (end - start + 1)
        if start != end:
            self.lazy[2 * node + 1] += self.lazy[node]
            self.lazy[2 * node + 2] += self.lazy[node]
        self.lazy[node] = 0
    
    if start > r or end < l:
        return 0
    if l <= start and end <= r:
        return self.tree[node]
    mid = (start + end) // 2
    return self._query(2 * node + 1, start, mid, l, r) + \
           self._query(2 * node + 2, mid + 1, end, l, r)
```

---

## Python Templates

### Template 1: Lazy Segment Tree (Range Add, Range Sum)

```python
class LazySegmentTree:
    """
    Segment Tree with Lazy Propagation for range add and range sum.
    
    Time Complexities:
        - Build: O(n)
        - Range Update: O(log n)
        - Range Query: O(log n)
    
    Space Complexity: O(n)
    """
    
    def __init__(self, arr: list[int]):
        self.n = len(arr)
        self.tree = [0] * (4 * self.n)
        self.lazy = [0] * (4 * self.n)
        if self.n > 0:
            self._build(arr, 0, 0, self.n - 1)
    
    def _build(self, arr: list[int], node: int, start: int, end: int):
        if start == end:
            self.tree[node] = arr[start]
        else:
            mid = (start + end) // 2
            self._build(arr, 2 * node + 1, start, mid)
            self._build(arr, 2 * node + 2, mid + 1, end)
            self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]
    
    def _propagate(self, node: int, start: int, end: int):
        if self.lazy[node] != 0:
            self.tree[node] += self.lazy[node] * (end - start + 1)
            if start != end:
                self.lazy[2 * node + 1] += self.lazy[node]
                self.lazy[2 * node + 2] += self.lazy[node]
            self.lazy[node] = 0
    
    def range_update(self, left: int, right: int, value: int):
        """Add value to all elements in [left, right]."""
        self._range_update(0, 0, self.n - 1, left, right, value)
    
    def _range_update(self, node: int, start: int, end: int, 
                      left: int, right: int, value: int):
        self._propagate(node, start, end)
        if start > right or end < left:
            return
        if left <= start and end <= right:
            self.tree[node] += value * (end - start + 1)
            if start != end:
                self.lazy[2 * node + 1] += value
                self.lazy[2 * node + 2] += value
            return
        mid = (start + end) // 2
        self._range_update(2 * node + 1, start, mid, left, right, value)
        self._range_update(2 * node + 2, mid + 1, end, left, right, value)
        self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]
    
    def range_query(self, left: int, right: int) -> int:
        """Query sum in range [left, right]."""
        return self._range_query(0, 0, self.n - 1, left, right)
    
    def _range_query(self, node: int, start: int, end: int, 
                     left: int, right: int) -> int:
        self._propagate(node, start, end)
        if start > right or end < left:
            return 0
        if left <= start and end <= right:
            return self.tree[node]
        mid = (start + end) // 2
        left_sum = self._range_query(2 * node + 1, start, mid, left, right)
        right_sum = self._range_query(2 * node + 2, mid + 1, end, left, right)
        return left_sum + right_sum
```

### Template 2: Lazy Segment Tree with Range Assignment

```python
class LazyAssignSegmentTree:
    """Segment Tree with range assignment (set to value)."""
    
    def __init__(self, arr: list[int]):
        self.n = len(arr)
        self.tree = [0] * (4 * self.n)
        self.lazy = [None] * (4 * self.n)
        if self.n > 0:
            self._build(arr, 0, 0, self.n - 1)
    
    def _build(self, arr: list[int], node: int, start: int, end: int):
        if start == end:
            self.tree[node] = arr[start]
        else:
            mid = (start + end) // 2
            self._build(arr, 2 * node + 1, start, mid)
            self._build(arr, 2 * node + 2, mid + 1, end)
            self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]
    
    def _propagate(self, node: int, start: int, end: int):
        if self.lazy[node] is not None:
            self.tree[node] = self.lazy[node] * (end - start + 1)
            if start != end:
                self.lazy[2 * node + 1] = self.lazy[node]
                self.lazy[2 * node + 2] = self.lazy[node]
            self.lazy[node] = None
    
    def range_assign(self, left: int, right: int, value: int):
        """Set all elements in [left, right] to value."""
        self._range_assign(0, 0, self.n - 1, left, right, value)
    
    def _range_assign(self, node: int, start: int, end: int, 
                      left: int, right: int, value: int):
        self._propagate(node, start, end)
        if start > right or end < left:
            return
        if left <= start and end <= right:
            self.tree[node] = value * (end - start + 1)
            if start != end:
                self.lazy[2 * node + 1] = value
                self.lazy[2 * node + 2] = value
            return
        mid = (start + end) // 2
        self._range_assign(2 * node + 1, start, mid, left, right, value)
        self._range_assign(2 * node + 2, mid + 1, end, left, right, value)
        self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]
    
    def range_query(self, left: int, right: int) -> int:
        return self._range_query(0, 0, self.n - 1, left, right)
    
    def _range_query(self, node: int, start: int, end: int, 
                     left: int, right: int) -> int:
        self._propagate(node, start, end)
        if start > right or end < left:
            return 0
        if left <= start and end <= right:
            return self.tree[node]
        mid = (start + end) // 2
        return (self._range_query(2 * node + 1, start, mid, left, right) +
                self._range_query(2 * node + 2, mid + 1, end, left, right))
```

### Template 3: Lazy Segment Tree (Range Min with Range Add)

```python
class LazyMinSegmentTree:
    """Segment Tree for range minimum with range add updates."""
    
    def __init__(self, arr: list[int]):
        self.n = len(arr)
        self.tree = [float('inf')] * (4 * self.n)
        self.lazy = [0] * (4 * self.n)
        if self.n > 0:
            self._build(arr, 0, 0, self.n - 1)
    
    def _build(self, arr: list[int], node: int, start: int, end: int):
        if start == end:
            self.tree[node] = arr[start]
        else:
            mid = (start + end) // 2
            self._build(arr, 2 * node + 1, start, mid)
            self._build(arr, 2 * node + 2, mid + 1, end)
            self.tree[node] = min(self.tree[2 * node + 1], self.tree[2 * node + 2])
    
    def _propagate(self, node: int, start: int, end: int):
        if self.lazy[node] != 0:
            self.tree[node] += self.lazy[node]
            if start != end:
                self.lazy[2 * node + 1] += self.lazy[node]
                self.lazy[2 * node + 2] += self.lazy[node]
            self.lazy[node] = 0
    
    def range_add(self, left: int, right: int, value: int):
        """Add value to all elements in [left, right]."""
        self._range_add(0, 0, self.n - 1, left, right, value)
    
    def _range_add(self, node: int, start: int, end: int, 
                   left: int, right: int, value: int):
        self._propagate(node, start, end)
        if start > right or end < left:
            return
        if left <= start and end <= right:
            self.tree[node] += value
            if start != end:
                self.lazy[2 * node + 1] += value
                self.lazy[2 * node + 2] += value
            return
        mid = (start + end) // 2
        self._range_add(2 * node + 1, start, mid, left, right, value)
        self._range_add(2 * node + 2, mid + 1, end, left, right, value)
        self.tree[node] = min(self.tree[2 * node + 1], self.tree[2 * node + 2])
    
    def range_min(self, left: int, right: int) -> int:
        """Query minimum in [left, right]."""
        return self._range_min(0, 0, self.n - 1, left, right)
    
    def _range_min(self, node: int, start: int, end: int, 
                   left: int, right: int) -> int:
        self._propagate(node, start, end)
        if start > right or end < left:
            return float('inf')
        if left <= start and end <= right:
            return self.tree[node]
        mid = (start + end) // 2
        return min(self._range_min(2 * node + 1, start, mid, left, right),
                   self._range_min(2 * node + 2, mid + 1, end, left, right))
```

### Template 4: Corporate Flight Bookings (LeetCode 1109)

```python
def corpFlightBookings(bookings: list[list[int]], n: int) -> list[int]:
    """
    LeetCode 1109: Corporate Flight Bookings.
    Use lazy segment tree or difference array.
    """
    # Difference array approach (simpler for this problem)
    diff = [0] * (n + 2)
    
    for first, last, seats in bookings:
        diff[first] += seats
        diff[last + 1] -= seats
    
    result = []
    current = 0
    for i in range(1, n + 1):
        current += diff[i]
        result.append(current)
    
    return result
```

### Template 5: My Calendar III (Event Counting)

```python
class MyCalendarThree:
    """
    LeetCode 732: My Calendar III.
    Uses lazy segment tree for counting concurrent events.
    """
    
    def __init__(self):
        from collections import defaultdict
        self.tree = defaultdict(int)
        self.lazy = defaultdict(int)
    
    def _update(self, node: int, start: int, end: int, 
               left: int, right: int):
        if left > end or right < start:
            return
        if left <= start and end <= right:
            self.tree[node] += 1
            self.lazy[node] += 1
            return
        mid = (start + end) // 2
        self._update(2 * node, start, mid, left, right)
        self._update(2 * node + 1, mid + 1, end, left, right)
        self.tree[node] = self.lazy[node] + max(self.tree[2 * node], 
                                                self.tree[2 * node + 1])
    
    def book(self, start: int, end: int) -> int:
        self._update(1, 0, 10**9, start, end - 1)
        return self.tree[1]
```

### Template 6: Count of Smaller Numbers After Self

```python
def countSmaller(nums: list[int]) -> list[int]:
    """
    LeetCode 315: Count of Smaller Numbers After Self.
    Use coordinate compression + lazy segment tree.
    """
    if not nums:
        return []
    
    # Coordinate compression
    sorted_unique = sorted(set(nums))
    rank = {v: i for i, v in enumerate(sorted_unique)}
    
    n = len(sorted_unique)
    tree = [0] * (4 * n)
    
    def update(node: int, start: int, end: int, idx: int):
        if start == end:
            tree[node] += 1
            return
        mid = (start + end) // 2
        if idx <= mid:
            update(2 * node + 1, start, mid, idx)
        else:
            update(2 * node + 2, mid + 1, end, idx)
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2]
    
    def query(node: int, start: int, end: int, left: int, right: int) -> int:
        if left > end or right < start:
            return 0
        if left <= start and end <= right:
            return tree[node]
        mid = (start + end) // 2
        return query(2 * node + 1, start, mid, left, right) + \
               query(2 * node + 2, mid + 1, end, left, right)
    
    result = []
    for num in reversed(nums):
        r = rank[num]
        if r > 0:
            result.append(query(0, 0, n - 1, 0, r - 1))
        else:
            result.append(0)
        update(0, 0, n - 1, r)
    
    return result[::-1]
```

---

## When to Use

Use Lazy Propagation when you need to solve problems involving:

- **Range Updates**: Adding, setting, or multiplying values over a range
- **Range Queries**: Querying sums, min, max, or other aggregates over ranges
- **Mixed Operations**: Both range updates and queries interleaved
- **Frequent Updates**: When range updates are common and O(n) per update is too slow
- **Scheduling**: Time-based range additions or tracking

### Comparison with Alternatives

| Data Structure | Build | Point Update | Range Update | Range Query | Best For |
|---------------|-------|--------------|--------------|-------------|----------|
| **Segment Tree** | O(n) | O(log n) | O(n log n) | O(log n) | Point updates |
| **Lazy Segment Tree** | O(n) | O(log n) | O(log n) | O(log n) | Range updates |
| **Fenwick Tree** | O(n) | O(log n) | O(n log n)* | O(log n) | Prefix queries |
| **Difference Array** | O(n) | O(1) | O(1) | O(n)** | Offline queries |
| **Sqrt Decomposition** | O(n) | O(1) | O(sqrt n) | O(sqrt n) | Balanced operations |

*Can do range update in O(log n) with two Fenwick trees
**Need prefix sum computation

### When to Choose Each Data Structure

- **Choose Lazy Segment Tree** when:
  - Range updates and range queries are both frequent
  - Need O(log n) for both operations
  - Working with sums, min, max, or other associative operations

- **Choose Fenwick Tree** when:
  - Only need prefix sums
  - Space efficiency is critical
  - Can work with point updates only

- **Choose Difference Array** when:
  - All updates are known in advance (offline)
  - Only need final array values
  - Queries are at the end only

- **Choose Sqrt Decomposition** when:
  - Operations are mixed and balance is needed
  - Prefer simpler implementation over optimal complexity
  - Array size is moderate

---

## Algorithm Explanation

### Core Concept

Lazy propagation defers work by storing pending updates at nodes instead of immediately applying them to all children. When a future operation needs to access a node's children, the pending updates are first "propagated" (pushed down), ensuring correct values are always available.

### How It Works

#### Step 1: Normal Segment Tree Operations

Standard segment tree handles point updates and range queries by traversing the tree and combining values from relevant nodes.

#### Step 2: Introducing Lazy Tags

When a range update affects a node completely:
```python
if l <= start and end <= r:
    # Instead of recursing to children:
    tree[node] += val * (end - start + 1)
    lazy[node] += val  # Mark children as needing update
    return
```

#### Step 3: Propagation

Before accessing children, push pending updates:
```python
def propagate(node, start, end):
    if lazy[node] != 0:
        tree[node] += lazy[node] * (end - start + 1)
        if not leaf:
            lazy[left] += lazy[node]
            lazy[right] += lazy[node]
        lazy[node] = 0
```

#### Step 4: Query with Propagation

Always propagate before recursing to children:
```python
def query(node, start, end, l, r):
    propagate(node, start, end)  # Ensure values are current
    # ... normal query logic ...
```

### Visual Representation

**Range Update [2, 5] with +3:**
```
Before (without lazy):
    [0-7]:0
   /       \
[0-3]:0   [4-7]:0
/    \     /    \

After (with lazy):
    [0-7]:0, lazy=0
   /           \
[0-3]:0      [4-7]:6, lazy=3
/    \         /      \
      [2-3]:6,lazy=3
```

### Why Lazy Propagation Works

1. **Amortized Efficiency**: Each lazy value is pushed at most once per path
2. **Correctness**: Propagation ensures children have correct values before use
3. **Flexibility**: Can handle any associative operation

### Limitations

- **Space**: Extra O(n) for lazy array
- **Complexity**: More complex than standard segment tree
- **Not for All Operations**: Requires careful handling of operation composition
- **Overhead**: Small constant factor from propagation checks

---

## Practice Problems

### Problem 1: Range Sum Query - Mutable with Range Updates

**Problem:** [LeetCode 307 - Range Sum Query - Mutable](https://leetcode.com/problems/range-sum-query-mutable/)

**Description:** Implement a data structure with point updates and range sum queries.

**How to Apply:**
- Standard segment tree (no lazy needed for point updates)
- Extension: Use lazy version for range updates

---

### Problem 2: Corporate Flight Bookings

**Problem:** [LeetCode 1109 - Corporate Flight Bookings](https://leetcode.com/problems/corporate-flight-bookings/)

**Description:** Process range additions and query final array.

**How to Apply:**
- Can use lazy segment tree
- Or use simpler difference array technique
- Both achieve O(n + bookings) time

---

### Problem 3: My Calendar III

**Problem:** [LeetCode 732 - My Calendar III](https://leetcode.com/problems/my-calendar-iii/)

**Description:** Track maximum concurrent events.

**How to Apply:**
- Lazy segment tree for range maximum
- Each booking is a range increment
- Tree root stores current maximum

---

### Problem 4: Count of Smaller Numbers After Self

**Problem:** [LeetCode 315 - Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self/)

**Description:** For each element, count smaller elements to its right.

**How to Apply:**
- Coordinate compression + segment tree
- Process from right to left
- Query count of smaller, then insert current

---

### Problem 5: Falling Squares

**Problem:** [LeetCode 699 - Falling Squares](https://leetcode.com/problems/falling-squares/)

**Description:** Track height of falling squares.

**How to Apply:**
- Lazy segment tree for range maximum
- Range updates for new square placement
- Query for maximum in square's range

---

## Video Tutorial Links

### Fundamentals

- [Lazy Propagation - Take U Forward](https://www.youtube.com/watch?v=xuoQq4f3-Js) - Comprehensive tutorial
- [Segment Tree with Lazy Propagation - William Fiset](https://www.youtube.com/watch?v=5H9mH6J5X5U) - Visual explanation
- [Range Updates with Lazy - Algorithms](https://www.youtube.com/watch?v=2F4r0N2u4vU) - Implementation guide

### Advanced Topics

- [Persistent Segment Trees - Codeforces](https://codeforces.com/blog/entry/15890) - Blog tutorial
- [Advanced Lazy Techniques - CP-Algorithms](https://cp-algorithms.com/data_structures/segment_tree.html) - Reference

---

## Follow-up Questions

### Q1: Why is it called "lazy" propagation?

**Answer:** The algorithm is "lazy" because it postpones work. Instead of immediately updating all elements in a range, it marks nodes as needing updates and only performs the actual work when necessary (when accessing children or answering queries).

---

### Q2: Can lazy propagation handle range assignment (set to value) instead of addition?

**Answer:** Yes, but with modifications. For assignment, the lazy value overwrites rather than adds. When propagating, the assignment replaces any previous lazy value (unlike addition which accumulates). The template shows both approaches.

---

### Q3: What's the difference between lazy propagation and difference arrays?

**Answer:** Difference arrays work offline (all updates known in advance) and give O(1) range updates with O(n) final computation. Lazy propagation works online (interleaved queries/updates) with O(log n) per operation. Use difference arrays for offline, lazy segment tree for online.

---

### Q4: Can we use lazy propagation with Fenwick trees?

**Answer:** Standard Fenwick trees support point update + prefix query in O(log n). For range updates + point queries, use two Fenwick trees. For range updates + range queries, also possible with two Fenwick trees. Lazy propagation is specific to segment trees.

---

### Q5: How do we handle multiple types of operations (add, multiply, set) together?

**Answer:** This requires careful handling of operation priority. Usually, assignment has priority over addition/multiplication. Store both types of lazy values and apply in correct order during propagation: first apply assignment, then multiplication, then addition.

---

## Summary

Lazy Propagation is a crucial optimization for segment trees that enables efficient range updates in O(log n) time. The key takeaways are:

1. **Lazy Tags**: Store pending updates at nodes instead of applying immediately
2. **Propagation**: Push updates to children only when necessary
3. **Amortized O(log n)**: Both updates and queries are logarithmic
4. **Flexibility**: Works for sum, min, max, and other associative operations
5. **Trade-offs**: Uses extra O(n) space, adds implementation complexity

**When to Use:**
- Range updates and range queries are both needed
- O(n) range updates would be too slow
- Working with online (interleaved) operations

**Key Formula:**
```
Total overlap: Update node, mark children lazy
Partial overlap: Propagate first, then recurse
No overlap: Return immediately
```

This technique transforms segment trees from O(n log n) range updates to O(log n), making them suitable for a much broader class of problems in competitive programming and data processing.
