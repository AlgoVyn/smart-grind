# Fenwick Tree (Binary Indexed Tree)

## Category
Advanced

## Description

A Fenwick Tree (also known as Binary Indexed Tree or BIT) is a data structure that efficiently maintains prefix sums and supports point updates. It provides **O(log n)** time complexity for both point updates and prefix sum queries, using **O(n)** space. Unlike Segment Trees, Fenwick Trees are simpler to implement and use less memory while achieving the same asymptotic complexity for these operations.

The data structure is particularly valuable in competitive programming and technical interviews where you need to handle dynamic arrays with frequent sum queries. Its elegance lies in using bitwise operations to navigate the tree structure, making it both efficient and beautiful in its simplicity.

---

## Concepts

The Fenwick Tree is built on several fundamental concepts that enable its efficiency.

### 1. Lowest Set Bit (LSB)

The key operation is `i & (-i)`, which returns the lowest set bit of index `i`. This determines the range of elements each tree node is responsible for.

| Index (i) | Binary | i & (-i) | Range Covered |
|-----------|--------|----------|-----------------|
| 1 | 001 | 1 | [1, 1] |
| 2 | 010 | 2 | [1, 2] |
| 3 | 011 | 1 | [3, 3] |
| 4 | 100 | 4 | [1, 4] |
| 5 | 101 | 1 | [5, 5] |
| 6 | 110 | 2 | [5, 6] |

### 2. Partial Sum Storage

Each index in the Fenwick Tree stores a partial sum of a specific range:
- Index `i` stores sum of range `[i - lsb(i) + 1, i]`
- This allows O(log n) prefix sum queries by decomposing the range

### 3. Tree Navigation

Two fundamental operations navigate the tree:

**Update Navigation** (propagate up):
```
i += lsb(i)  // Move to parent (next responsible index)
```

**Query Navigation** (decompose range):
```
i -= lsb(i)  // Remove lowest set bit, move to previous segment
```

### 4. Invertible Operations

Fenwick Tree requires operations with inverses:

| Operation | Identity | Inverse | Supported |
|-----------|----------|---------|-----------|
| Sum | 0 | -a | Yes |
| XOR | 0 | a | Yes |
| Product | 1 | 1/a | Yes |
| Min/Max | N/A | N/A | No |
| GCD | N/A | N/A | No |

---

## Frameworks

Structured approaches for solving Fenwick Tree problems.

### Framework 1: Standard Point Update + Range Query

```
┌─────────────────────────────────────────────────────────────┐
│  STANDARD FENWICK TREE FRAMEWORK                             │
├─────────────────────────────────────────────────────────────┤
│  1. Initialize tree array with zeros (size n+1)              │
│  2. Build tree from initial array (O(n) or O(n log n))       │
│  3. For point update at index i with delta:                  │
│     a. Start at index i                                      │
│     b. While i <= n:                                         │
│        - tree[i] += delta                                    │
│        - i += lsb(i)                                         │
│  4. For prefix sum query up to index i:                    │
│     a. Initialize result = 0                                 │
│     b. While i > 0:                                          │
│        - result += tree[i]                                   │
│        - i -= lsb(i)                                         │
│     c. Return result                                         │
│  5. For range sum [l, r]: prefix(r) - prefix(l-1)           │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Standard prefix sum queries with point updates.

### Framework 2: Range Update + Point Query

```
┌─────────────────────────────────────────────────────────────┐
│  RANGE UPDATE + POINT QUERY FRAMEWORK                        │
├─────────────────────────────────────────────────────────────┤
│  1. Use difference array approach with Fenwick Tree          │
│  2. To add delta to range [l, r]:                           │
│     a. update(l, delta)      // Add delta at start         │
│     b. update(r+1, -delta)   // Subtract delta after end    │
│  3. To query point i:                                        │
│     a. Return prefix_sum(i)  // Accumulated delta            │
│  4. This works because:                                      │
│     - Each point stores cumulative difference                │
│     - Prefix sum gives effective value at that point         │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Need to add values to ranges and query individual points.

### Framework 3: Range Update + Range Query

```
┌─────────────────────────────────────────────────────────────┐
│  RANGE UPDATE + RANGE QUERY FRAMEWORK                        │
├─────────────────────────────────────────────────────────────┤
│  1. Maintain TWO Fenwick Trees: B1 and B2                    │
│  2. To add delta to range [l, r]:                           │
│     a. B1: update(l, delta), update(r+1, -delta)           │
│     b. B2: update(l, delta*(l-1)), update(r+1, -delta*r)   │
│  3. Prefix sum formula:                                      │
│     sum(i) = query(B1, i)*i - query(B2, i)                  │
│  4. Range sum [l, r] = prefix(r) - prefix(l-1)             │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Need both range updates and range sum queries.

---

## Forms

Different manifestations of the Fenwick Tree pattern.

### Form 1: Standard 1D Fenwick Tree

Basic implementation for prefix sums and point updates.

| Aspect | Details |
|--------|---------|
| **Operations** | Point update, prefix sum, range sum |
| **Time Complexity** | O(log n) per operation |
| **Space Complexity** | O(n) |
| **Use Cases** | Dynamic prefix sums, frequency counting |

### Form 2: 2D Fenwick Tree

Extension to 2D matrices for 2D range queries.

| Aspect | Details |
|--------|---------|
| **Operations** | Point update in 2D, rectangle sum query |
| **Time Complexity** | O(log² n) per operation |
| **Space Complexity** | O(n²) |
| **Use Cases** | 2D grid queries, image processing |

### Form 3: Fenwick Tree for Inversion Counting

Used to count inversions in an array.

```
Process array from right to left:
1. For each element, query count of smaller elements to the right
2. Update frequency of current element
3. Sum up all counts to get total inversions
```

**Example**: Array [5, 2, 6, 1, 3] has 5 inversions.

### Form 4: Coordinate Compressed Fenwick Tree

When values are large but distinct values are few.

| Step | Action |
|------|--------|
| 1 | Compress values to [1..k] range |
| 2 | Use compressed indices in Fenwick Tree |
| 3 | Enables O(log k) operations instead of O(log max_value) |

### Form 5: Fenwick Tree with Multi-dimensional Extensions

Extensions beyond 2D for higher dimensional data.

```
3D Fenwick Tree for 3D range queries:
- Update: O(log³ n)
- Query: O(log³ n)
- Used in 3D spatial queries
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Linear Time Construction

Instead of O(n log n) individual updates, build in O(n):

```python
def build_fenwick_linear(arr):
    """Build Fenwick Tree in O(n) time."""
    n = len(arr)
    tree = [0] * (n + 1)
    
    # Copy array values
    for i in range(1, n + 1):
        tree[i] = arr[i - 1]
    
    # Build tree by propagating to parents
    for i in range(1, n + 1):
        j = i + (i & -i)  # Parent index
        if j <= n:
            tree[j] += tree[i]
    
    return tree
```

**When to use**: When initializing from a known array (faster than n updates).

### Tactic 2: Coordinate Compression

For large value ranges, compress to dense indices:

```python
def coordinate_compression(arr):
    """Compress array values to 1..k range."""
    sorted_unique = sorted(set(arr))
    compress = {v: i + 1 for i, v in enumerate(sorted_unique)}
    return [compress[x] for x in arr], len(sorted_unique)
```

**When to use**: When values are large (up to 10^9) but n is small.

### Tactic 3: Finding k-th Order Statistic

Find the k-th smallest element using Fenwick Tree:

```python
def find_kth(tree, k):
    """Find smallest index such that prefix sum >= k."""
    idx = 0
    bitmask = 1 << (tree.n.bit_length() - 1)  # Highest power of 2 <= n
    
    while bitmask != 0:
        t = idx + bitmask
        if t <= tree.n and tree.tree[t] < k:
            k -= tree.tree[t]
            idx = t
        bitmask >>= 1
    
    return idx + 1
```

**When to use**: Order statistics, finding median, k-th smallest.

### Tactic 4: Inversion Count Optimization

Efficiently count array inversions:

```python
def count_inversions(arr):
    """Count inversions using Fenwick Tree."""
    # Coordinate compression
    sorted_unique = sorted(set(arr))
    compress = {v: i + 1 for i, v in enumerate(sorted_unique)}
    
    n = len(sorted_unique)
    ft = FenwickTree(n)
    inversions = 0
    
    # Process from right to left
    for i in range(len(arr) - 1, -1, -1):
        idx = compress[arr[i]]
        inversions += ft.query(idx - 1)  # Count smaller elements
        ft.update(idx, 1)
    
    return inversions
```

**When to use**: Counting inversions, measuring array "sortedness".

### Tactic 5: Prefix Sum with Fenwick vs Array

| Scenario | Use Prefix Sum Array | Use Fenwick Tree |
|----------|---------------------|------------------|
| Static array | O(1) query | Unnecessary |
| Frequent updates | O(n) update | O(log n) update |
| Mixed operations | Slow | Fast |
| Memory constrained | O(n) | O(n) |

### Tactic 6: Range Frequency Queries

Count occurrences in subarrays:

```python
from collections import defaultdict

def range_frequency_queries(arr, queries):
    """Answer queries of form: count of x in [l, r]."""
    # Group indices by value
    indices = defaultdict(list)
    for i, x in enumerate(arr):
        indices[x].append(i)
    
    # For each query, binary search in the list
    results = []
    for l, r, x in queries:
        lst = indices[x]
        # Count indices in [l, r] using bisect
        left = bisect.bisect_left(lst, l)
        right = bisect.bisect_right(lst, r)
        results.append(right - left)
    
    return results
```

**When to use**: When you need to query frequency of specific values in ranges.

---

## Python Templates

### Template 1: Standard Fenwick Tree (Range Sum)

```python
class FenwickTree:
    """
    Fenwick Tree (Binary Indexed Tree) for range sum queries and point updates.
    
    Time Complexities:
        - Update: O(log n)
        - Query: O(log n)
        - Build: O(n log n) or O(n)
    
    Space Complexity: O(n)
    """
    
    def __init__(self, size):
        """
        Initialize Fenwick Tree.
        
        Args:
            size: Number of elements (1-indexed internally)
        """
        self.n = size
        self.tree = [0] * (size + 1)
    
    @staticmethod
    def _lsb(i):
        """Return lowest set bit of i using two's complement."""
        return i & (-i)
    
    def update(self, index, delta):
        """
        Add delta to element at index.
        
        Args:
            index: 1-indexed position to update
            delta: Value to add
            
        Time: O(log n)
        """
        while index <= self.n:
            self.tree[index] += delta
            index += self._lsb(index)
    
    def query(self, index):
        """
        Get prefix sum from 1 to index (inclusive).
        
        Args:
            index: 1-indexed position
            
        Returns:
            Sum of elements[1..index]
            
        Time: O(log n)
        """
        result = 0
        while index > 0:
            result += self.tree[index]
            index -= self._lsb(index)
        return result
    
    def range_sum(self, left, right):
        """
        Get sum of elements in range [left, right].
        
        Args:
            left: 1-indexed start position
            right: 1-indexed end position
            
        Returns:
            Sum of elements[left..right]
            
        Time: O(log n)
        """
        return self.query(right) - self.query(left - 1)


# Build from array - O(n log n)
def build_fenwick_from_updates(arr):
    """Build Fenwick Tree using individual updates."""
    n = len(arr)
    ft = FenwickTree(n)
    for i, val in enumerate(arr, 1):
        ft.update(i, val)
    return ft


# Build from array - O(n)
def build_fenwick_linear(arr):
    """Build Fenwick Tree in linear time."""
    n = len(arr)
    tree = [0] * (n + 1)
    
    # Copy array values
    for i in range(1, n + 1):
        tree[i] = arr[i - 1]
    
    # Build tree by propagating to parents
    for i in range(1, n + 1):
        j = i + (i & -i)  # Parent index
        if j <= n:
            tree[j] += tree[i]
    
    ft = FenwickTree(n)
    ft.tree = tree
    return ft
```

### Template 2: Fenwick Tree for Range Updates and Point Queries

```python
class FenwickTreeRangeUpdate:
    """
    Fenwick Tree supporting range updates and point queries.
    
    To add 'val' to range [l, r]:
        update(l, val)
        update(r + 1, -val)
    
    To query point i:
        return prefix_sum(i)
    """
    
    def __init__(self, size):
        self.n = size
        self.tree = [0] * (size + 2)
    
    def _lsb(self, i):
        return i & (-i)
    
    def _update(self, index, delta):
        while index <= self.n + 1:
            self.tree[index] += delta
            index += self._lsb(index)
    
    def range_add(self, left, right, delta):
        """Add delta to all elements in range [left, right]."""
        self._update(left, delta)
        self._update(right + 1, -delta)
    
    def point_query(self, index):
        """Get value at specific index."""
        result = 0
        while index > 0:
            result += self.tree[index]
            index -= self._lsb(index)
        return result
```

### Template 3: Fenwick Tree for Range Updates and Range Queries

```python
class FenwickTreeRangeQuery:
    """
    Fenwick Tree supporting range updates and range sum queries.
    Uses two trees: B1 for linear coefficient, B2 for constant.
    """
    
    def __init__(self, size):
        self.n = size
        self.B1 = [0] * (size + 2)  # Linear coefficient tree
        self.B2 = [0] * (size + 2)  # Constant tree
    
    def _lsb(self, i):
        return i & (-i)
    
    def _add(self, tree, index, delta):
        while index <= self.n + 1:
            tree[index] += delta
            index += self._lsb(index)
    
    def _sum(self, tree, index):
        result = 0
        while index > 0:
            result += tree[index]
            index -= self._lsb(index)
        return result
    
    def range_add(self, left, right, delta):
        """Add delta to all elements in range [left, right]."""
        self._add(self.B1, left, delta)
        self._add(self.B1, right + 1, -delta)
        self._add(self.B2, left, delta * (left - 1))
        self._add(self.B2, right + 1, -delta * right)
    
    def _prefix_sum(self, index):
        """Get prefix sum [1..index]."""
        return self._sum(self.B1, index) * index - self._sum(self.B2, index)
    
    def range_sum(self, left, right):
        """Get sum of range [left, right]."""
        return self._prefix_sum(right) - self._prefix_sum(left - 1)
```

### Template 4: Fenwick Tree for Inversion Count

```python
def count_inversions(arr):
    """
    Count inversions in array using Fenwick Tree.
    Inversion: pair (i, j) where i < j and arr[i] > arr[j]
    
    Time: O(n log n)
    Space: O(n)
    """
    # Coordinate compression
    sorted_unique = sorted(set(arr))
    compress = {v: i + 1 for i, v in enumerate(sorted_unique)}
    
    n = len(sorted_unique)
    ft = FenwickTree(n)
    inversions = 0
    
    # Process from right to left
    for i in range(len(arr) - 1, -1, -1):
        idx = compress[arr[i]]
        # Count elements smaller than current (already seen)
        inversions += ft.query(idx - 1)
        ft.update(idx, 1)
    
    return inversions
```

### Template 5: 2D Fenwick Tree

```python
class FenwickTree2D:
    """
    2D Fenwick Tree for range sum queries on a matrix.
    
    Time: O(log² n) for update and query
    Space: O(n²)
    """
    
    def __init__(self, rows, cols):
        self.rows = rows
        self.cols = cols
        self.tree = [[0] * (cols + 1) for _ in range(rows + 1)]
    
    def _lsb(self, i):
        return i & (-i)
    
    def update(self, row, col, delta):
        """Add delta to element at (row, col)."""
        i = row
        while i <= self.rows:
            j = col
            while j <= self.cols:
                self.tree[i][j] += delta
                j += self._lsb(j)
            i += self._lsb(i)
    
    def query(self, row, col):
        """Get sum of rectangle [1..row][1..col]."""
        result = 0
        i = row
        while i > 0:
            j = col
            while j > 0:
                result += self.tree[i][j]
                j -= self._lsb(j)
            i -= self._lsb(i)
        return result
    
    def range_sum(self, r1, c1, r2, c2):
        """Get sum of rectangle [r1..r2][c1..c2]."""
        return (self.query(r2, c2) 
                - self.query(r1 - 1, c2) 
                - self.query(r2, c1 - 1) 
                + self.query(r1 - 1, c1 - 1))
```

### Template 6: Find k-th Order Statistic

```python
class FenwickTreeWithSelect(FenwickTree):
    """Fenwick Tree with ability to find k-th smallest element."""
    
    def find_kth(self, k):
        """
        Find smallest index such that prefix sum >= k.
        Assumes all values are non-negative.
        
        Time: O(log n)
        """
        idx = 0
        bitmask = 1 << (self.n.bit_length() - 1)  # Highest power of 2 <= n
        
        while bitmask != 0:
            t = idx + bitmask
            if t <= self.n and self.tree[t] < k:
                k -= self.tree[t]
                idx = t
            bitmask >>= 1
        
        return idx + 1
```

### Template 7: Count of Smaller Elements After Self

```python
def count_smaller_after_self(arr):
    """
    For each element, count how many smaller elements are to its right.
    Returns list of counts.
    
    Time: O(n log n)
    Space: O(n)
    """
    n = len(arr)
    # Coordinate compression
    sorted_unique = sorted(set(arr))
    compress = {v: i + 1 for i, v in enumerate(sorted_unique)}
    
    ft = FenwickTree(len(sorted_unique))
    result = [0] * n
    
    # Process from right to left
    for i in range(n - 1, -1, -1):
        idx = compress[arr[i]]
        result[i] = ft.query(idx - 1)  # Count smaller elements
        ft.update(idx, 1)
    
    return result
```

---

## When to Use

Use the Fenwick Tree when you need to solve problems involving:

- **Dynamic Prefix Sums**: When you need to compute prefix sums with frequent updates
- **Point Updates**: When individual array elements change (not range updates)
- **Range Sum Queries**: When you need sum of any subarray [l, r]
- **Frequency Counting**: Counting elements, inversions, or frequencies in ranges
- **Coordinate Compression Scenarios**: When values are large but queries are on compressed indices

### Comparison with Alternatives

| Data Structure | Build Time | Point Update | Range Query | Space | Supports Dynamic Updates |
|----------------|------------|--------------|-------------|-------|--------------------------|
| **Prefix Sum** | O(n) | O(n) | O(1) | O(n) | No |
| **Fenwick Tree** | O(n log n) or O(n) | O(log n) | O(log n) | O(n) | Yes |
| **Segment Tree** | O(n) | O(log n) | O(log n) | O(4n) | Yes |
| **Sparse Table** | O(n log n) | O(n log n) | O(1) | O(n log n) | No |

### When to Choose Fenwick Tree vs Segment Tree

- **Choose Fenwick Tree** when:
  - You need prefix sums or point updates
  - Memory is constrained (uses ~4× less memory than segment tree)
  - You want simpler code
  - Operations are associative and have inverses (sum, XOR, etc.)

- **Choose Segment Tree** when:
  - You need range updates (lazy propagation)
  - You need operations without inverses (min, max, GCD)
  - You need more complex query types
  - Memory is not a constraint

---

## Algorithm Explanation

### Core Concept

The Fenwick Tree uses a clever binary representation to store partial sums. Each index `i` in the tree stores the sum of a specific range of elements from the original array. The key insight is using the **lowest set bit (LSB)** of an index to determine which range it represents.

**How It Works:**

For an index `i`, let `lsb(i) = i & (-i)` (the lowest set bit):
- Index `i` stores the sum of range `[i - lsb(i) + 1, i]`

For example with array `[1, 3, 5, 7, 9, 11]`:
```
Index:  1    2     3    4      5    6
Tree:   1    4     5   16      9   20
        │    │     │    │      │    │
Range: [1] [1-2]  [3] [1-4]   [5] [5-6]
        
Binary: 001  010   011  100   101  110
lsb:     1    2     1    4     1    2
```

### Operations

#### 1. Update Operation (Point Update)

To add `delta` to index `i`:
```
while i <= n:
    tree[i] += delta
    i += lsb(i)  # Move to parent (next responsible index)
```

**Why `i += lsb(i)`?**
- This moves to the next index that is responsible for index `i`
- All these indices contain ranges that include position `i`

#### 2. Query Operation (Prefix Sum)

To get sum of elements `[1..i]`:
```
result = 0
while i > 0:
    result += tree[i]
    i -= lsb(i)  # Move to previous segment
```

**Why `i -= lsb(i)`?**
- This removes the lowest set bit, effectively moving to the start of the current range
- Each step adds the precomputed sum for a segment

#### 3. Range Sum Query

To get sum of elements `[l..r]`:
```
sum(l, r) = prefix_sum(r) - prefix_sum(l - 1)
```

### Visual Representation

For array `[3, 2, -1, 6, 5, 4, -3, 3, 7, 2, 3]`:

```
Original Array (1-indexed):
Index:  1   2   3   4   5   6   7   8   9  10  11
Value:  3   2  -1   6   5   4  -3   3   7   2   3

Fenwick Tree Structure:
Index:  1   2    3    4     5   6    7    8      9   10   11
Tree:   3   5   -1   10     5   9   -3   19      7    9    3
        │   │    │    │     │   │    │    │      │    │    │
Range: [1] [1-2][3] [1-4] [5][5-6][7][1-8]  [9] [9-10][11]
```

**Query Example: prefix_sum(6)**
```
Start: i = 6 (binary: 110)
Step 1: Add tree[6] = 9, i = 6 - 2 = 4
Step 2: Add tree[4] = 10, i = 4 - 4 = 0
Result: 9 + 10 = 19 ✓ (3+2-1+6+5+4 = 19)
```

### Why It Works

The Fenwick Tree leverages the binary representation of indices:
- Each index `i` is responsible for exactly `lsb(i)` elements
- When updating, we propagate up to all ancestors that include this position
- When querying, we decompose the prefix into O(log n) non-overlapping ranges
- The number of set bits in binary representation determines the complexity

### Limitations

- **Only works for invertible operations**: sum, XOR (NOT min, max, GCD)
- **1-indexed internally**: Requires careful handling of 0-based arrays
- **Point updates only**: Range updates require lazy propagation or difference arrays
- **Not suitable for all operations**: Operations must satisfy: `query(l,r) = query(r) - query(l-1)`

---

## Practice Problems

### Problem 1: Range Sum Query - Mutable

**Problem:** [LeetCode 307 - Range Sum Query - Mutable](https://leetcode.com/problems/range-sum-query-mutable/)

**Description:** Given an integer array `nums`, handle multiple queries of the following types:
1. Update the value of an element in `nums`.
2. Calculate the sum of the elements of `nums` between indices `left` and `right` inclusive.

**How to Apply Fenwick Tree:**
- Use Fenwick Tree to store prefix sums
- Update operation: O(log n)
- Range sum query: O(log n) using prefix differences

---

### Problem 2: Count of Smaller Numbers After Self

**Problem:** [LeetCode 315 - Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self/)

**Description:** Given an integer array `nums`, return a new array `counts` where `counts[i]` is the number of smaller elements to the right of `nums[i]`.

**How to Apply Fenwick Tree:**
- Coordinate compress the values
- Process array from right to left
- Use Fenwick Tree to count frequencies of seen elements
- Query count of elements less than current before updating

---

### Problem 3: Reverse Pairs

**Problem:** [LeetCode 493 - Reverse Pairs](https://leetcode.com/problems/reverse-pairs/)

**Description:** Given an integer array `nums`, return the number of reverse pairs in the array. A reverse pair is a pair `(i, j)` where `0 <= i < j < nums.length` and `nums[i] > 2 * nums[j]`.

**How to Apply Fenwick Tree:**
- Coordinate compression on both `nums[i]` and `2 * nums[i]`
- Process from right to left
- Query count of elements satisfying `nums[i] > 2 * nums[j]`
- Update frequency of current element

---

### Problem 4: Count of Range Sum

**Problem:** [LeetCode 327 - Count of Range Sum](https://leetcode.com/problems/count-of-range-sum/)

**Description:** Given an integer array `nums` and two integers `lower` and `upper`, return the number of range sums that lie in `[lower, upper]` inclusive.

**How to Apply Fenwick Tree:**
- Transform to prefix sums problem
- For each prefix sum, count previous prefix sums in range `[current - upper, current - lower]`
- Use Fenwick Tree with coordinate-compressed prefix sums

---

### Problem 5: Create Sorted Array through Instructions

**Problem:** [LeetCode 1649 - Create Sorted Array through Instructions](https://leetcode.com/problems/create-sorted-array-through-instructions/)

**Description:** Given an integer array `instructions`, you are asked to create a sorted array from the elements in `instructions`. You start with an empty container `nums`. For each element from left to right in `instructions`, insert it into `nums`. The cost of each insertion is the minimum of the number of elements currently in `nums` that are strictly less than or strictly greater than the element being inserted. Return the total cost to insert all elements.

**How to Apply Fenwick Tree:**
- Use Fenwick Tree to maintain frequency count
- For each insertion, query:
  - Count of elements less than current (strictly less)
  - Count of elements greater than current (strictly greater)
- Add minimum of the two to total cost
- Update frequency of current element

---

## Video Tutorial Links

### Fundamentals

- [Fenwick Tree / Binary Indexed Tree (Take U Forward)](https://www.youtube.com/watch?v=CWDQJGaN1gY) - Comprehensive introduction with visualizations
- [Binary Indexed Tree (Fenwick Tree) - CP Algorithms](https://www.youtube.com/watch?v=uSFzHCZ4E-8) - Theory and implementation
- [Fenwick Tree Explained (NeetCode)](https://www.youtube.com/watch?v=qijYQx4b7zU) - Practical problem-solving approach

### Advanced Topics

- [Range Update with Fenwick Tree](https://www.youtube.com/watch?v=kPaJfAUwViY) - Handling range updates efficiently
- [Fenwick Tree vs Segment Tree](https://www.youtube.com/watch?v=RgITNht_f4Q) - When to use which data structure
- [2D Fenwick Tree Tutorial](https://www.youtube.com/watch?v=DPiY9wJYOzw) - 2D range queries

---

## Follow-up Questions

### Q1: Why does `i & (-i)` give the lowest set bit?

**Answer:** This works due to two's complement representation:
- In two's complement, `-i` is represented as `~i + 1` (bitwise NOT plus 1)
- This flips all bits up to and including the lowest set bit of `i`
- When ANDed with the original `i`, only that lowest set bit remains
- Example: `i = 12` (1100), `-i` in binary (two's complement) is ...11110100
- `1100 & 0100 = 0100` (which is 4)

### Q2: Can Fenwick Tree handle range updates efficiently?

**Answer:** Standard Fenwick Tree only supports point updates. For range updates:
- **Range update + Point query**: Use difference array technique with one Fenwick Tree
- **Range update + Range query**: Requires two Fenwick Trees to handle linear coefficients
- **Alternative**: Use Segment Tree with lazy propagation for simpler implementation

### Q3: What operations can Fenwick Tree support besides sum?

**Answer:** Fenwick Tree works for any operation that:
1. Is associative: `(a op b) op c = a op (b op c)`
2. Has an inverse: `a op inv(a) = identity`

Supported operations:
- **Sum**: `inv(a) = -a`
- **XOR**: `inv(a) = a` (self-inverse)
- **Multiplication**: `inv(a) = 1/a` (if a ≠ 0)

NOT supported:
- **Min/Max**: No inverse operation
- **GCD**: No inverse operation
- Use Segment Tree for these operations

### Q4: How does Fenwick Tree compare to Prefix Sum array?

**Answer:**
- **Prefix Sum**: O(1) query, O(n) update
- **Fenwick Tree**: O(log n) query, O(log n) update

Choose:
- **Prefix Sum**: When array is static (no updates)
- **Fenwick Tree**: When you need both queries and updates
- For purely static arrays, Prefix Sum is simpler and faster

### Q5: Why is Fenwick Tree 1-indexed internally?

**Answer:**
- The bit manipulation relies on `i & (-i)` returning meaningful values
- If `i = 0`, then `i & (-i) = 0`, causing infinite loops
- 1-indexing ensures the loop termination conditions work correctly:
  - Update: `i += lsb(i)` eventually exceeds n
  - Query: `i -= lsb(i)` eventually reaches 0
- When working with 0-based arrays, simply add 1 to all indices

---

## Summary

The Fenwick Tree (Binary Indexed Tree) is an elegant data structure for **dynamic prefix sum** queries with **point updates**. Key takeaways:

- **O(log n)** time for both update and query operations
- **O(n)** space - much more memory-efficient than Segment Tree
- **Simple implementation** - fewer lines of code than Segment Tree
- **Bit manipulation** - leverages binary representation for efficiency
- **Invertible operations only** - works for sum, XOR; not for min/max

When to use:
- Dynamic arrays with frequent updates and prefix sum queries
- Counting inversions or frequencies
- Range sum queries with point updates
- Memory-constrained environments
- Not for operations without inverses (min, max, GCD)
- Not for range updates without additional techniques

The Fenwick Tree is an essential data structure for competitive programming and technical interviews, offering an optimal balance of simplicity, efficiency, and low memory usage for prefix sum problems.
