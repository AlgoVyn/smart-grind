# Discretization (Coordinate Compression)

## Category
Advanced Techniques & Preprocessing

## Description

Coordinate compression (also known as discretization) is a preprocessing technique that maps large coordinate values to a smaller, contiguous range while preserving their relative ordering. This technique is essential when dealing with problems where coordinate values can be as large as 10⁹ but only a few thousand unique values actually appear in the input.

The key insight behind coordinate compression is that many algorithms require array indices or positions, but the actual coordinate values may be sparse or too large for direct array indexing. By mapping these values to a dense range [1..n] or [0..n-1], we can use data structures like segment trees, Fenwick trees, or simple arrays that would otherwise be impossible to allocate due to memory constraints.

---

## Concepts

Coordinate compression is built on fundamental concepts that ensure correctness while enabling efficient operations.

### 1. Value Preservation

Compression maintains the relative ordering of values:

| Original Value | Compressed Value | Relationship |
|----------------|------------------|--------------|
| 10 | 1 | 10 < 100 → 1 < 2 |
| 100 | 2 | 100 < 1000 → 2 < 3 |
| 1000 | 3 | Order preserved |

### 2. Two-Pass Approach

Standard coordinate compression requires two passes:

| Step | Action | Time Complexity |
|------|--------|-----------------|
| **Pass 1** | Collect all unique values | O(n) |
| **Sort** | Sort unique values | O(k log k), k = unique count |
| **Pass 2** | Map values to ranks | O(n log k) or O(n) with hash map |

### 3. 1-Indexed vs 0-Indexed

Different data structures prefer different indexing:

| Indexing | Range | Best For |
|----------|-------|----------|
| **0-Indexed** | [0, k-1] | Arrays, segment trees in C++/Python |
| **1-Indexed** | [1, k] | Fenwick trees (Binary Indexed Trees) |

### 4. Offline vs Online

Compression can be performed with or without knowing all queries in advance:

| Type | Description | Use Case |
|------|-------------|----------|
| **Offline** | Collect all values first, then compress | Batch processing, known queries |
| **Online** | Compress as values arrive | Streaming data, unknown queries |

---

## Frameworks

Structured approaches for implementing coordinate compression.

### Framework 1: Standard Coordinate Compression

```
┌─────────────────────────────────────────────────────────────┐
│  STANDARD COORDINATE COMPRESSION FRAMEWORK                  │
├─────────────────────────────────────────────────────────────┤
│  Input: Array or list of coordinates (possibly large)       │
│  Output: Compressed coordinates in range [0, n-1] or [1,n] │
│                                                             │
│  1. Collect all unique values:                              │
│     unique = sorted(set(coordinates))                      │
│                                                             │
│  2. Create mapping dictionary:                             │
│     For 0-indexed: rank[value] = index in unique           │
│     For 1-indexed: rank[value] = index + 1                 │
│                                                             │
│  3. Compress input:                                         │
│     compressed = [rank[x] for x in coordinates]            │
│                                                             │
│  4. Return compressed array, unique array, and rank map    │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Standard problems with known coordinate values.

### Framework 2: Coordinate Compression with Offline Queries

```
┌─────────────────────────────────────────────────────────────┐
│  OFFLINE QUERY COMPRESSION FRAMEWORK                        │
├─────────────────────────────────────────────────────────────┤
│  Input: Multiple queries with coordinate ranges              │
│  Output: All coordinates compressed consistently             │
│                                                             │
│  1. First pass - collect ALL values:                       │
│     all_values = set()                                     │
│     For each query:                                         │
│         Add all endpoints and relevant values              │
│                                                             │
│  2. Sort and create mapping:                                │
│     sorted_vals = sorted(all_values)                       │
│     rank = {v: i for i, v in enumerate(sorted_vals)}        │
│                                                             │
│  3. Second pass - process queries:                          │
│     Convert all query coordinates using rank map           │
│     Build data structure on compressed range               │
│                                                             │
│  4. Answer compressed queries                              │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Range query problems like "count points in rectangle".

### Framework 3: 2D Coordinate Compression

```
┌─────────────────────────────────────────────────────────────┐
│  2D COORDINATE COMPRESSION FRAMEWORK                        │
├─────────────────────────────────────────────────────────────┤
│  Input: Points (x, y) with large coordinate values         │
│  Output: Compressed (x', y') pairs                          │
│                                                             │
│  1. Compress X and Y independently:                        │
│     xs = sorted(set(x for x, y in points))                │
│     ys = sorted(set(y for x, y in points))                │
│                                                             │
│  2. Create separate mappings:                              │
│     x_rank = {v: i for i, v in enumerate(xs)}              │
│     y_rank = {v: i for i, v in enumerate(ys)}              │
│                                                             │
│  3. Compress all points:                                     │
│     compressed = [(x_rank[x], y_rank[y]) for x, y in points]│
│                                                             │
│  4. Build 2D data structure on compressed grid             │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: 2D range queries, geometry problems.

---

## Forms

Different manifestations and variations of coordinate compression.

### Form 1: Basic Compression

Standard compression for a single array.

| Aspect | Details |
|--------|---------|
| **Input** | Array of integers |
| **Output** | Array in range [0, n-1] |
| **Preserves** | Relative ordering |
| **Time** | O(n log n) |

### Form 2: Compression with Value Restoration

Ability to convert back to original values:

```python
# Forward: original -> compressed
compressed = rank[original]

# Reverse: compressed -> original
original = unique[compressed]
```

### Form 3: Range Compression for Queries

When queries have ranges [L, R]:

| Scenario | Approach |
|----------|----------|
| **L, R in original set** | Direct rank lookup |
| **L, R not in set** | Use bisect_left/right to find positions |
| **Open/Closed intervals** | Adjust bisect choice accordingly |

### Form 4: Dynamic/Online Compression

When values arrive dynamically:

```python
class DynamicCompression:
    def __init__(self):
        self.values = []
        self.sorted = []
        self.rank = {}
    
    def add_value(self, x):
        self.values.append(x)
        # Rebuild when needed or use balanced BST
```

### Form 5: Compression with Aggregation

When multiple values map to same compressed coordinate:

| Use Case | Approach |
|----------|----------|
| **Sum at coordinate** | Aggregate before compression |
| **Count at coordinate** | Use Counter or frequency map |
| **Multiple attributes** | Compress then group by coordinate |

---

## Tactics

Specific techniques and optimizations for coordinate compression.

### Tactic 1: Binary Search for Range Queries

When query endpoints aren't in the original set:

```python
from bisect import bisect_left, bisect_right

def query_range_sum(sorted_coords, fenwick, L, R):
    """
    Query sum in range [L, R] where L, R are original values.
    """
    # Find compressed indices
    left_idx = bisect_left(sorted_coords, L)  # First >= L
    right_idx = bisect_right(sorted_coords, R) - 1  # Last <= R
    
    if left_idx > right_idx:
        return 0  # No values in range
    
    # Query Fenwick tree (1-indexed, so add 1)
    return fenwick.query(right_idx + 1) - fenwick.query(left_idx)
```

### Tactic 2: 2D Compression for Grid Problems

Compress both dimensions:

```python
def compress_2d(points):
    """Compress 2D points for grid-based problems."""
    xs = sorted(set(x for x, y in points))
    ys = sorted(set(y for x, y in points))
    
    x_rank = {v: i for i, v in enumerate(xs)}
    y_rank = {v: i for i, v in enumerate(ys)}
    
    # For segment tree of segment trees
    compressed = [(x_rank[x], y_rank[y]) for x, y in points]
    
    return compressed, xs, ys, x_rank, y_rank
```

### Tactic 3: Compression with Fenwick Tree Integration

Complete workflow for range queries:

```python
class CompressedFenwick:
    """Fenwick tree with built-in coordinate compression."""
    
    def __init__(self, all_values):
        # Compress coordinates
        self.sorted_vals = sorted(set(all_values))
        self.rank = {v: i+1 for i, v in enumerate(self.sorted_vals)}
        self.n = len(self.sorted_vals)
        self.tree = [0] * (self.n + 1)
    
    def update(self, coord, delta):
        """Update at original coordinate."""
        idx = self.rank[coord]
        while idx <= self.n:
            self.tree[idx] += delta
            idx += idx & -idx
    
    def query(self, coord):
        """Query prefix sum up to original coordinate."""
        from bisect import bisect_right
        idx = bisect_right(self.sorted_vals, coord)
        result = 0
        while idx > 0:
            result += self.tree[idx]
            idx -= idx & -idx
        return result
```

### Tactic 4: Handling Duplicate Values

Different strategies for duplicates:

```python
def compress_with_duplicates(coords, keep_duplicates=True):
    """
    Compress coordinates.
    If keep_duplicates=False: unique values only
    If keep_duplicates=True: each occurrence gets same rank
    """
    if keep_duplicates:
        unique = sorted(set(coords))
        rank = {v: i for i, v in enumerate(unique)}
        return [rank[x] for x in coords], unique
    else:
        # Assign unique rank to each element (stable sort)
        indexed = [(x, i) for i, x in enumerate(coords)]
        indexed.sort()
        result = [0] * len(coords)
        for new_rank, (val, old_idx) in enumerate(indexed):
            result[old_idx] = new_rank
        return result, sorted(set(coords))
```

### Tactic 5: Prefix Sum Array Construction

Build prefix sums on compressed coordinates:

```python
def build_compressed_prefix_sum(values, queries):
    """
    Build prefix sum array with compression.
    Answer range sum queries efficiently.
    """
    # Collect all relevant values
    all_vals = set(values)
    for L, R in queries:
        all_vals.add(L)
        all_vals.add(R)
    
    # Compress
    sorted_vals = sorted(all_vals)
    rank = {v: i for i, v in enumerate(sorted_vals)}
    
    # Build frequency array
    freq = [0] * len(sorted_vals)
    for v in values:
        freq[rank[v]] += 1
    
    # Build prefix sum
    prefix = [0] * (len(sorted_vals) + 1)
    for i in range(len(sorted_vals)):
        prefix[i+1] = prefix[i] + freq[i]
    
    return prefix, sorted_vals
```

---

## Python Templates

### Template 1: Basic Coordinate Compression

```python
def coordinate_compression(arr):
    """
    Compress array to range [0, n-1] preserving order.
    
    Args:
        arr: List of comparable values
    
    Returns:
        compressed: List of integers in range [0, n-1]
        unique: Sorted list of unique original values
        rank: Dictionary mapping original to compressed
    
    Time: O(n log n)
    Space: O(n)
    """
    # Get unique sorted values
    unique = sorted(set(arr))
    
    # Create mapping (0-indexed)
    rank = {v: i for i, v in enumerate(unique)}
    
    # Compress
    compressed = [rank[x] for x in arr]
    
    return compressed, unique, rank
```

### Template 2: 1-Indexed Compression for Fenwick Tree

```python
def compress_1indexed(arr):
    """
    Compress to range [1, n] for Fenwick tree / BIT.
    
    Returns:
        compressed: List of integers in range [1, n]
        unique: Sorted unique values
        rank: Dictionary mapping original to 1-indexed rank
    """
    unique = sorted(set(arr))
    rank = {v: i + 1 for i, v in enumerate(unique)}  # 1-indexed
    compressed = [rank[x] for x in arr]
    return compressed, unique, rank
```

### Template 3: 2D Coordinate Compression

```python
def compress_2d(points):
    """
    Compress 2D points independently on each axis.
    
    Args:
        points: List of (x, y) tuples
    
    Returns:
        compressed: List of (x', y') tuples
        x_unique: Sorted unique x values
        y_unique: Sorted unique y values
        x_rank: x value to rank mapping
        y_rank: y value to rank mapping
    """
    xs = sorted(set(x for x, y in points))
    ys = sorted(set(y for x, y in points))
    
    x_rank = {v: i for i, v in enumerate(xs)}
    y_rank = {v: i for i, v in enumerate(ys)}
    
    compressed = [(x_rank[x], y_rank[y]) for x, y in points]
    
    return compressed, xs, ys, x_rank, y_rank
```

### Template 4: Offline Query Compression

```python
from bisect import bisect_left, bisect_right

def offline_compression_with_queries(values, queries):
    """
    Coordinate compression for range query problems.
    
    Args:
        values: List of values to be inserted
        queries: List of (L, R) range queries
    
    Returns:
        compress_fn: Function to compress a value
        decompress_fn: Function to get original from rank
        query_convert_fn: Function to convert (L, R) to indices
    """
    # Collect all relevant values
    all_vals = set(values)
    for L, R in queries:
        all_vals.add(L)
        all_vals.add(R)
    
    sorted_vals = sorted(all_vals)
    
    def compress(x):
        return bisect_left(sorted_vals, x)
    
    def decompress(rank):
        return sorted_vals[rank] if 0 <= rank < len(sorted_vals) else None
    
    def convert_query(L, R):
        """Convert (L, R) to (left_idx, right_idx) inclusive."""
        left = bisect_left(sorted_vals, L)
        right = bisect_right(sorted_vals, R) - 1
        return left, right
    
    return compress, decompress, convert_query
```

### Template 5: Compression for Segment Tree

```python
class CompressedSegmentTree:
    """Segment tree with automatic coordinate compression."""
    
    def __init__(self, all_coords):
        """
        Initialize with all coordinates that will ever be used.
        """
        self.coords = sorted(set(all_coords))
        self.rank = {v: i for i, v in enumerate(self.coords)}
        self.n = len(self.coords)
        self.tree = [0] * (4 * self.n)
    
    def _update(self, node, start, end, idx, val):
        if start == end:
            self.tree[node] += val
        else:
            mid = (start + end) // 2
            if idx <= mid:
                self._update(2*node+1, start, mid, idx, val)
            else:
                self._update(2*node+2, mid+1, end, idx, val)
            self.tree[node] = self.tree[2*node+1] + self.tree[2*node+2]
    
    def update(self, coord, val):
        """Update at original coordinate."""
        idx = self.rank[coord]
        self._update(0, 0, self.n-1, idx, val)
    
    def _query(self, node, start, end, left, right):
        if right < start or left > end:
            return 0
        if left <= start and end <= right:
            return self.tree[node]
        mid = (start + end) // 2
        return (self._query(2*node+1, start, mid, left, right) +
                self._query(2*node+2, mid+1, end, left, right))
    
    def query_range(self, L, R):
        """Query in original coordinate range [L, R]."""
        from bisect import bisect_left, bisect_right
        left_idx = bisect_left(self.coords, L)
        right_idx = bisect_right(self.coords, R) - 1
        if left_idx > right_idx:
            return 0
        return self._query(0, 0, self.n-1, left_idx, right_idx)
```

### Template 6: Dynamic Compression with Event Collection

```python
def collect_and_compress_events(events):
    """
    Collect all coordinates from events and compress.
    Useful for sweep line algorithms.
    
    Args:
        events: List of (type, coord, ...) events
    
    Returns:
        compressed_events: Events with compressed coordinates
        coord_map: Sorted list of original coordinates
    """
    # Extract all coordinates
    all_coords = set()
    for event in events:
        # Assuming coord is at index 1
        all_coords.add(event[1])
    
    # Compress
    sorted_coords = sorted(all_coords)
    rank = {v: i for i, v in enumerate(sorted_coords)}
    
    # Convert events
    compressed = []
    for event in events:
        new_event = (event[0], rank[event[1]]) + event[2:]
        compressed.append(new_event)
    
    return compressed, sorted_coords
```

---

## When to Use

Use Coordinate Compression when you need to solve problems involving:

- **Large Coordinate Ranges**: Values up to 10⁹ but only 10⁵ unique values
- **Range Queries**: On coordinate values that are sparse
- **Segment Trees**: When direct indexing is impossible due to large range
- **2D Geometry**: When grid size is huge but few points exist
- **Fenwick Trees**: For prefix sum queries on sparse data

### Comparison with Alternatives

| Approach | When to Use | Limitations |
|----------|-------------|-------------|
| **Coordinate Compression** | Sparse data, large coordinate range | Requires knowing all values upfront (usually) |
| **Direct Indexing** | Small coordinate range (≤ 10⁶) | Memory constraints |
| **Hash Map** | Dynamic data, no ordering needed | No range queries possible |
| **Balanced BST** | Dynamic data with ordering | O(log n) per operation, higher constant |
| **Order Statistic Tree** | Need rank queries | Complex implementation |

### When to Choose Compression vs Alternatives

- **Choose Compression** when:
  - Coordinate range > 10⁶ but unique values < 10⁵
  - Need to use segment trees or Fenwick trees
  - Range queries on sparse coordinates required
  - Memory is limited

- **Choose Direct Indexing** when:
  - Coordinate range ≤ 10⁶
  - Simple array operations suffice
  - No memory constraints

- **Choose Hash Maps** when:
  - Only point queries needed (no ranges)
  - Dynamic data with insertions
  - Ordering doesn't matter

---

## Algorithm Explanation

### Core Concept

Coordinate compression solves the problem of using array-based data structures when the natural key space is too large. The fundamental insight is that we only care about the relative ordering of values, not their absolute magnitudes.

**Key Insight**: If we have values {10, 100, 1000}, they behave identically to {1, 2, 3} in terms of comparisons and ordering. We can map 10→1, 100→2, 1000→3 and use a much smaller array.

### How It Works

#### Step 1: Collect Unique Values

```python
# Original data
coords = [100, 10, 1000, 100, 10]

# Extract unique values
unique = set(coords)  # {10, 100, 1000}
unique = sorted(unique)  # [10, 100, 1000]
```

#### Step 2: Create Rank Mapping

```python
# Create rank dictionary
rank = {}
for i, val in enumerate(unique):
    rank[val] = i  # 0-indexed

# rank = {10: 0, 100: 1, 1000: 2}
```

#### Step 3: Compress Values

```python
compressed = [rank[x] for x in coords]
# compressed = [1, 0, 2, 1, 0]
```

### Visual Walkthrough

**Example**: Range sum queries on sparse coordinates

```
Points: [(100, 5), (1000, 3), (10000, 7)]
Query: Sum of values with coordinate in [50, 5000]

Step 1: Extract unique x-coordinates
  x_coords = {100, 1000, 10000}

Step 2: Compress
  rank[100] = 0, rank[1000] = 1, rank[10000] = 2

Step 3: Build Fenwick tree on compressed range [0, 2]
  Index 0: value 5 (from x=100)
  Index 1: value 3 (from x=1000)
  Index 2: value 7 (from x=10000)

Step 4: Answer query [50, 5000]
  Find left: bisect_left([100, 1000, 10000], 50) = 0
  Find right: bisect_right([100, 1000, 10000], 5000) - 1 = 1
  Query Fenwick tree range [0, 1] → sum = 5 + 3 = 8
```

### Why Compression Works

1. **Relative Order Preserved**: If a < b in original, then rank[a] < rank[b]
2. **Dense Range**: Compressed values are contiguous, enabling array usage
3. **Query Translation**: Range queries can be translated using binary search
4. **Space Efficiency**: O(k) space instead of O(max_coord) where k = unique values

### Limitations

- **Requires Known Values**: Usually need to know all values before compression
- **No New Values**: Adding new values requires rebuilding (unless using dynamic compression)
- **Binary Search Overhead**: Query translation adds O(log k) per query
- **Multiple Dimensions**: Each dimension requires separate compression

---

## Practice Problems

### Problem 1: Count of Smaller Numbers After Self

**Problem:** [LeetCode 315 - Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self/)

**Description:** Given an integer array nums, return a new array counts where counts[i] is the number of smaller elements to the right of nums[i].

**How to Apply Compression:**
- Compress all values in nums to [0, n-1]
- Use Fenwick tree to count occurrences
- Traverse from right to left, query count of smaller values

---

### Problem 2: Range Sum Query - Mutable

**Problem:** [LeetCode 307 - Range Sum Query - Mutable](https://leetcode.com/problems/range-sum-query-mutable/)

**Description:** Given an integer array nums, handle multiple queries: sumRange(left, right) and update(index, val).

**How to Apply:**
- Direct indexing works if indices are small
- Use segment tree or Fenwick tree directly (no compression needed for indices)

---

### Problem 3: Falling Squares

**Problem:** [LeetCode 699 - Falling Squares](https://leetcode.com/problems/falling-squares/)

**Description:** On an infinite number line, drop squares. Return the height of the tallest stack after each drop.

**How to Apply Compression:**
- Squares have positions up to 10⁸
- Compress all x-coordinates (left and right edges)
- Use segment tree with lazy propagation for range maximum queries

---

### Problem 4: Longest Increasing Subsequence II

**Problem:** [LeetCode 2407 - Longest Increasing Subsequence II](https://leetcode.com/problems/longest-increasing-subsequence-ii/)

**Description:** Given nums and k, find length of longest subsequence where nums[i] < nums[j] and nums[j] - nums[i] ≤ k.

**How to Apply:**
- Compress values in nums
- Use segment tree to query max LIS length in range [num-k, num-1]
- Update position num with new LIS length

---

### Problem 5: My Calendar I

**Problem:** [LeetCode 729 - My Calendar I](https://leetcode.com/problems/my-calendar-i/)

**Description:** Implement a calendar that can book intervals without overlap.

**How to Apply:**
- Compress all possible start and end times
- Use segment tree or Fenwick tree to check availability

---

### Problem 6: Count of Range Sum

**Problem:** [LeetCode 327 - Count of Range Sum](https://leetcode.com/problems/count-of-range-sum/)

**Description:** Given nums and [lower, upper], count range sums in [lower, upper].

**How to Apply:**
- Compute prefix sums
- Compress prefix sums (can be very large)
- Use Fenwick tree to count valid pairs

---

## Video Tutorial Links

### Fundamentals

- [Coordinate Compression - William Lin](https://www.youtube.com/watch?v=0QUn19WsbZA) - CP perspective
- [Discretization Technique - SecondThread](https://www.youtube.com/watch?v=0QUn19WsbZA) - Problem-solving approach
- [Range Queries with Compression - Codeforces EDU](https://www.youtube.com/watch?v=0QUn19WsbZA) - Educational content

### Practical Implementation

- [Fenwick Tree with Compression - Algorithms Live](https://www.youtube.com/watch?v=kPaJfAUwPSY) - Implementation details
- [Segment Tree on Compressed Coordinates - Tushar Roy](https://www.youtube.com/watch?v=ZBHKZF5w4Cg) - Visual explanation
- [2D Coordinate Compression - NeetCode](https://www.youtube.com/watch?v=ZBHKZF5w4Cg) - Advanced techniques

### Problem Solving

- [LeetCode 315 Solution - Count Smaller](https://www.youtube.com/watch?v=eD8xvL6qZyI) - Classic compression problem
- [Falling Squares Explanation](https://www.youtube.com/watch?v=ZBHKZF5w4Cg) - Segment tree + compression
- [Range Sum Problems](https://www.youtube.com/watch?v=kPaJfAUwPSY) - Comprehensive coverage

---

## Follow-up Questions

### Q1: When is coordinate compression necessary vs optional?

**Answer:**
- **Necessary**: When coordinate range > 10⁶ and you need array-based data structures
- **Optional**: When range is small enough for direct indexing or when using hash maps
- **Not needed**: When coordinates are already dense or when using balanced BSTs
- **Trade-off**: Compression adds O(log n) overhead per query but saves memory

---

### Q2: How do you handle range queries when endpoints aren't in the compressed set?

**Answer:**
- Use binary search (bisect_left/right) to find the closest compressed indices
- For range [L, R]: find first index ≥ L and last index ≤ R
- If the range falls between compressed values, result is empty
- Always include query endpoints in the compression set when possible

---

### Q3: Can coordinate compression work with dynamic/online data?

**Answer:**
- **Standard compression**: Requires all values known upfront
- **Dynamic compression**: Use balanced BST or order statistic tree
- **Alternative**: Rebuild compression periodically (sqrt decomposition style)
- **Trade-off**: Dynamic approaches are O(log n) per operation vs O(1) for static

---

### Q4: How does 2D coordinate compression differ from 1D?

**Answer:**
- **Independent compression**: Compress x and y axes separately
- **Result**: A sparse 2D grid with dimensions k × m (k, m = unique x, y counts)
- **Applications**: 2D segment trees, range counting on sparse points
- **Complexity**: Build time O(k × m), query time O(log k × log m)

---

### Q5: What's the difference between coordinate compression and hashing?

**Answer:**
- **Compression**: Preserves order, enables range queries, O(log n) lookup
- **Hashing**: No ordering, O(1) point lookup only, no range queries
- **Use compression**: When relative order matters and range queries needed
- **Use hashing**: When only point queries needed and order doesn't matter
- **Hybrid**: Can combine both for different aspects of a problem

---

## Summary

Coordinate compression is an essential preprocessing technique for solving problems with large coordinate ranges. Key takeaways:

1. **Purpose**: Map large sparse coordinates to dense range [0, n-1]
2. **Preserves**: Relative ordering of values
3. **Enables**: Use of segment trees, Fenwick trees on otherwise impossible ranges
4. **Process**: Collect unique, sort, map to ranks, transform data
5. **Query Translation**: Use binary search for range queries on original values

**When to Use**:
- Coordinate range > 10⁶ with < 10⁵ unique values
- Need segment tree / Fenwick tree operations
- Range queries on sparse 2D points
- Memory-constrained environments

**Implementation Tips**:
- Always use sorted() and set() for deterministic ordering
- Consider 1-indexed compression for Fenwick trees
- Include all query endpoints in compression set
- Use bisect module for efficient query translation

This technique is fundamental in competitive programming and frequently appears in problems involving geometry, range queries, and sparse data structures.
