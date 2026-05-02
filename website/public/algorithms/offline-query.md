# Offline Query

## Category
Advanced Data Structures & Query Processing

## Description

Offline query processing is a powerful technique that involves answering multiple queries after seeing all of them, allowing for strategic reordering and preprocessing to optimize total answering time. Unlike online processing where queries must be answered immediately, offline algorithms can sort queries, batch similar ones together, and use data structures like segment trees or Mo's algorithm to achieve better overall complexity.

This approach is particularly valuable for competitive programming and large-scale data processing where query order doesn't matter. By processing queries in a specially chosen order—such as sorting by block in Mo's algorithm—we can minimize the cost of updating our data structure between queries, often achieving O((n + q) × √n) or better complexity where online approaches would be slower.

---

## Concepts

The offline query pattern relies on several fundamental concepts that enable efficient batch processing.

### 1. Mo's Algorithm

The most common offline query technique for array range queries:

| Aspect | Description | Complexity |
|--------|-------------|------------|
| **Block Size** | √n for n elements | Determines query grouping |
| **Query Order** | Sort by block of left, then by right | Hilbert curve for cache optimization |
| **Movement Cost** | Add/remove elements one at a time | O(1) per add/remove |
| **Total** | O((n + q) × √n) | For typical add/remove operations |

### 2. Parallel Binary Search

For multiple binary search queries:

| Aspect | Description | Use Case |
|--------|-------------|----------|
| **Batch Processing** | Group queries by mid value | Multiple "first position" queries |
| **Efficiency** | O(log n × cost of check) | When check can be batched |
| **Examples** | Dynamic connectivity, counting problems | Verifying properties at positions |

### 3. Sqrt Decomposition

Preprocessing for range queries:

| Structure | Preprocessing | Query | Update |
|-----------|--------------|-------|--------|
| **Static Blocks** | O(n) | O(√n) | O(√n) |
| **Lazy Propagation** | O(n) | O(√n) | O(1) amortized |
| **Mo's on Tree** | O(n) | O((n + q) × √n) | Offline only |

### 4. Query Ordering Strategies

Different ways to sort queries for efficiency:

| Strategy | Sort Key | Benefit |
|----------|----------|---------|
| **Block + Right** | Standard Mo's | Balanced movement |
| **Hilbert Order** | Space-filling curve | Better cache locality |
| **Right Only** | For add-only structures | Monotonic pointer |
| **Custom** | Problem-specific | Exploit special structure |

---

## Frameworks

Structured approaches for implementing offline query solutions.

### Framework 1: Mo's Algorithm (Standard)

```
┌─────────────────────────────────────────────────────────────┐
│  MO'S ALGORITHM FRAMEWORK                                     │
├─────────────────────────────────────────────────────────────┤
│  Input: Array arr of length n, q queries [l, r]               │
│  Output: Answer for each query                                │
│                                                               │
│  1. Set block_size = √n (or n/√q for different optimization)  │
│                                                               │
│  2. Sort queries by:                                          │
│     - block = l // block_size                                 │
│     - right (ascending for even blocks, descending for odd)   │
│                                                               │
│  3. Initialize current window [cur_l, cur_r] = [0, -1] (empty)  │
│     and data structure for current state                       │
│                                                               │
│  4. For each query (l, r) in sorted order:                   │
│     a. While cur_l > l: add(--cur_l)                          │
│     b. While cur_r < r: add(++cur_r)                          │
│     c. While cur_l < l: remove(cur_l++)                       │
│     d. While cur_r > r: remove(cur_r--)                       │
│     e. Record answer for this query                           │
│                                                               │
│  5. Return answers in original query order                      │
│                                                               │
│  Time: O((n + q) × √n × cost_of_add_remove)                   │
│  Space: O(n) for data structure + O(q) for answers            │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Range queries where elements can be added/removed in O(1).

### Framework 2: Parallel Binary Search

```
┌─────────────────────────────────────────────────────────────┐
│  PARALLEL BINARY SEARCH FRAMEWORK                             │
├─────────────────────────────────────────────────────────────┤
│  Input: n elements, q queries (find first position where...)  │
│  Output: Answer index for each query                          │
│                                                               │
│  1. Initialize for each query i:                              │
│     lo[i] = 0, hi[i] = n                                      │
│                                                               │
│  2. While any query has lo[i] < hi[i]:                        │
│     a. Group queries by mid = (lo[i] + hi[i]) // 2            │
│     b. Process mids in increasing order:                      │
│        - Compute condition at mid (can be batched)          │
│        - For each query at this mid:                          │
│          If condition true: hi[i] = mid                       │
│          Else: lo[i] = mid + 1                               │
│                                                               │
│  3. Return lo (contains final answers)                        │
│                                                               │
│  Time: O(log n × cost_of_check)                             │
│  Space: O(n + q)                                              │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Multiple "find first position" queries with batchable checks.

### Framework 3: Sqrt Decomposition for Queries

```
┌─────────────────────────────────────────────────────────────┐
│  SQRT DECOMPOSITION QUERY FRAMEWORK                           │
├─────────────────────────────────────────────────────────────┤
│  Input: Array arr, block_size = √n                            │
│  Output: Fast range queries                                   │
│                                                               │
│  1. Preprocess:                                               │
│     - Divide array into blocks of size √n                     │
│     - Precompute aggregate for each block (sum, min, etc.)    │
│                                                               │
│  2. For query [l, r]:                                         │
│     - Left partial block: process elements one by one         │
│     - Middle full blocks: use precomputed aggregates          │
│     - Right partial block: process elements one by one        │
│                                                               │
│  3. For updates:                                              │
│     - Point update: update element and its block aggregate    │
│     - Range update: lazy propagation or rebuild block         │
│                                                               │
│  Time: O(√n) per query, O(1) or O(√n) per update              │
│  Space: O(n)                                                  │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Static or infrequently updated arrays with many range queries.

---

## Forms

Different manifestations of offline query processing.

### Form 1: Mo's Algorithm on Array

Standard application for range queries on static arrays.

| Aspect | Details |
|--------|---------|
| **Time** | O((n + q) × √n) |
| **Space** | O(n) |
| **Works For** | Sum, XOR, distinct count, frequency queries |
| **Requirement** | O(1) add/remove operations |

### Form 2: Mo's Algorithm on Tree

Using Euler tour to handle tree path queries.

| Aspect | Details |
|--------|---------|
| **Preprocessing** | Euler tour to flatten tree |
| **Query Conversion** | Path queries become range queries on Euler tour |
| **LCA Handling** | Special handling for LCA in path queries |
| **Complexity** | Same as array version with O(log n) LCA |

### Form 3: Parallel Binary Search

Batch processing of binary search queries.

| Aspect | Details |
|--------|---------|
| **Use Case** | Multiple "find first/last position" queries |
| **Key Insight** | Batch queries by their current mid value |
| **Efficiency** | O(log n) iterations, each processing all queries |
| **Examples** | Dynamic connectivity, prefix sum conditions |

### Form 4: Sqrt Decomposition

Block-based preprocessing.

| Aspect | Details |
|--------|---------|
| **Time** | O(√n) query, O(1) or O(√n) update |
| **Space** | O(n) |
| **Flexibility** | Can support various aggregate functions |
| **Extensions** | Lazy propagation for range updates |

### Form 5: Hilbert Order

Cache-optimized query ordering.

| Aspect | Details |
|--------|---------|
| **Ordering** | Space-filling curve order |
| **Benefit** | Better cache locality than block sorting |
| **Complexity** | Same as Mo's, faster in practice |
| **Use** | When q is large and cache matters |

---

## Tactics

Specific techniques and implementations.

### Tactic 1: Standard Mo's Algorithm

Complete implementation for distinct count:

```python
import math
from collections import defaultdict

def mo_algorithm(arr, queries):
    """
    Answer range queries efficiently using Mo's algorithm.
    Example: Count distinct elements in range.
    Time: O((n + q) * sqrt(n))
    Space: O(n)
    """
    n = len(arr)
    q = len(queries)
    block_size = int(math.sqrt(n)) + 1
    
    # Sort queries by block of left, then by right (alternating)
    sorted_queries = []
    for i, (l, r) in enumerate(queries):
        block = l // block_size
        # Sort by block, then by right (asc for even, desc for odd blocks)
        sorted_queries.append((block, r if block % 2 == 0 else -r, l, r, i))
    
    sorted_queries.sort()
    results = [0] * q
    
    # Current window
    cur_l, cur_r = 0, -1  # Empty window
    
    # Data structure for current window
    freq = defaultdict(int)
    current_answer = 0
    
    def add(pos):
        """Add element at position to window."""
        nonlocal current_answer
        val = arr[pos]
        freq[val] += 1
        if freq[val] == 1:
            current_answer += 1
    
    def remove(pos):
        """Remove element at position from window."""
        nonlocal current_answer
        val = arr[pos]
        freq[val] -= 1
        if freq[val] == 0:
            current_answer -= 1
    
    # Process queries in sorted order
    for _, _, l, r, idx in sorted_queries:
        # Extend/shrink window to [l, r]
        while cur_l > l:
            cur_l -= 1
            add(cur_l)
        while cur_r < r:
            cur_r += 1
            add(cur_r)
        while cur_l < l:
            remove(cur_l)
            cur_l += 1
        while cur_r > r:
            remove(cur_r)
            cur_r -= 1
        
        results[idx] = current_answer
    
    return results
```

### Tactic 2: Parallel Binary Search

For multiple "first position" queries:

```python
from collections import defaultdict

def parallel_binary_search(n, queries, check):
    """
    Answer multiple "find first position where condition holds" queries.
    
    Args:
        n: Array length
        queries: List of query parameters
        check(mid, query_params): Returns True/False
    
    Time: O(log n * cost of check)
    """
    q = len(queries)
    
    # For each query, maintain search range [lo, hi]
    lo = [0] * q
    hi = [n] * q
    
    while True:
        # Group queries by their current mid
        mids = defaultdict(list)
        active = False
        
        for i in range(q):
            if lo[i] < hi[i]:
                active = True
                mid = (lo[i] + hi[i]) // 2
                mids[mid].append(i)
        
        if not active:
            break
        
        # Process mids in order
        for mid in sorted(mids.keys()):
            # Check condition at mid
            for qi in mids[mid]:
                if check(mid, queries[qi]):
                    hi[qi] = mid
                else:
                    lo[qi] = mid + 1
    
    return lo  # lo[i] is answer for query i
```

### Tactic 3: Sqrt Decomposition

Preprocessing for fast range queries:

```python
def sqrt_decomposition_queries(arr, queries):
    """
    Preprocess array into sqrt blocks, answer queries.
    Example: Range sum queries.
    """
    n = len(arr)
    block_size = int(math.sqrt(n)) + 1
    num_blocks = (n + block_size - 1) // block_size
    
    # Precompute block aggregates
    block_sum = [0] * num_blocks
    for i in range(n):
        block_sum[i // block_size] += arr[i]
    
    results = []
    for l, r in queries:
        sum_val = 0
        
        # Left partial block
        while l <= r and l % block_size != 0:
            sum_val += arr[l]
            l += 1
        
        # Middle full blocks
        while l + block_size <= r:
            sum_val += block_sum[l // block_size]
            l += block_size
        
        # Right partial block
        while l <= r:
            sum_val += arr[l]
            l += 1
        
        results.append(sum_val)
    
    return results
```

### Tactic 4: Mo's on Tree (Euler Tour)

For tree path queries:

```python
def euler_tour_tree_mo(tree, root, queries):
    """
    Process tree path queries using Euler tour + Mo's.
    Converts tree paths to range queries on Euler tour.
    """
    n = len(tree)
    
    # Euler tour to flatten tree
    euler = []
    first_occurrence = {}
    last_occurrence = {}
    
    def dfs(u, parent):
        first_occurrence[u] = len(euler)
        euler.append(u)
        for v in tree[u]:
            if v != parent:
                dfs(v, u)
                euler.append(u)
        last_occurrence[u] = len(euler) - 1
    
    dfs(root, -1)
    
    # Convert path queries to range queries
    # Path u-v corresponds to range if we track entry/exit times
    # and use LCA for special handling
    return euler, first_occurrence, last_occurrence
```

### Tactic 5: Hilbert Order Optimization

Cache-friendly query ordering:

```python
def hilbert_order(x, y, pow_=21, rotate=0):
    """
    Compute Hilbert order for cache-friendly query sorting.
    Alternative to block-based sorting in Mo's algorithm.
    """
    d = 0
    s = 1 << (pow_ - 1)
    
    for s in reversed(range(pow_)):
        rx = (x >> s) & 1
        ry = (y >> s) & 1
        d <<= 2
        d |= (rx * 3) ^ ry ^ rotate
        
        # Rotate
        if ry == 0:
            if rx == 1:
                rotate ^= 3
            # Swap rx, ry
            rx, ry = ry, rx
    
    return d

def mo_hilbert(arr, queries):
    """Mo's algorithm with Hilbert order sorting."""
    # Sort queries by Hilbert order of (l, r)
    sorted_queries = sorted(
        enumerate(queries),
        key=lambda x: hilbert_order(x[1][0], x[1][1])
    )
    # ... rest same as standard Mo's
```

---

## Python Templates

### Template 1: Mo's Algorithm (Distinct Count)

```python
import math
from collections import defaultdict
from typing import List, Tuple

def mo_distinct_count(arr: List[int], queries: List[Tuple[int, int]]) -> List[int]:
    """
    Count distinct elements in range using Mo's algorithm.
    
    Args:
        arr: Input array
        queries: List of (left, right) inclusive ranges
    
    Returns:
        List of distinct counts for each query
        
    Time: O((n + q) * sqrt(n))
    Space: O(n)
    """
    n = len(arr)
    q = len(queries)
    block_size = int(math.sqrt(n)) + 1
    
    # Sort queries: by block, then alternating right direction
    sorted_queries = []
    for i, (l, r) in enumerate(queries):
        block = l // block_size
        # Even blocks: sort by r ascending; odd blocks: descending
        sort_key = r if block % 2 == 0 else -r
        sorted_queries.append((block, sort_key, l, r, i))
    
    sorted_queries.sort()
    results = [0] * q
    
    # Current window state
    cur_l, cur_r = 0, -1
    freq = defaultdict(int)
    distinct_count = 0
    
    def add(pos: int):
        """Add arr[pos] to current window."""
        nonlocal distinct_count
        val = arr[pos]
        freq[val] += 1
        if freq[val] == 1:
            distinct_count += 1
    
    def remove(pos: int):
        """Remove arr[pos] from current window."""
        nonlocal distinct_count
        val = arr[pos]
        freq[val] -= 1
        if freq[val] == 0:
            distinct_count -= 1
    
    # Process all queries
    for _, _, l, r, idx in sorted_queries:
        # Expand/shrink window to match query range
        while cur_l > l:
            cur_l -= 1
            add(cur_l)
        while cur_r < r:
            cur_r += 1
            add(cur_r)
        while cur_l < l:
            remove(cur_l)
            cur_l += 1
        while cur_r > r:
            remove(cur_r)
            cur_r -= 1
        
        results[idx] = distinct_count
    
    return results
```

### Template 2: Mo's with Modification

```python
def mo_with_updates(arr: List[int], queries: List[Tuple[int, int, int]]) -> List[int]:
    """
    Mo's algorithm handling range queries with point updates.
    queries: (left, right, time) where time = number of updates before this query
    
    Time: O((n + q) * n^(2/3)) with block size n^(2/3)
    """
    n = len(arr)
    q = len(queries)
    block_size = int(pow(n, 2/3)) + 1
    
    # Sort by (left_block, right_block, time)
    sorted_queries = []
    for i, (l, r, t) in enumerate(queries):
        lb, rb = l // block_size, r // block_size
        sorted_queries.append((lb, rb, t, l, r, i))
    
    sorted_queries.sort()
    results = [0] * q
    
    cur_l, cur_r, cur_time = 0, -1, 0
    # ... implement add, remove, apply_update, revert_update
    
    return results
```

### Template 3: Parallel Binary Search

```python
from typing import List, Callable, Any

def parallel_binary_search(
    n: int,
    queries: List[Any],
    check: Callable[[int, Any], bool]
) -> List[int]:
    """
    Batch binary search for multiple queries.
    
    Args:
        n: Search space size [0, n)
        queries: List of query parameters
        check: Function(mid, query) -> bool
    
    Returns:
        List of answers (first position where condition holds)
        
    Time: O(log n * cost of check)
    Space: O(n + q)
    """
    q = len(queries)
    lo = [0] * q
    hi = [n] * q
    
    while True:
        # Group queries by mid
        mids = defaultdict(list)
        active = False
        
        for i in range(q):
            if lo[i] < hi[i]:
                active = True
                mid = (lo[i] + hi[i]) // 2
                mids[mid].append(i)
        
        if not active:
            break
        
        # Process in order of mid
        for mid in sorted(mids.keys()):
            for qi in mids[mid]:
                if check(mid, queries[qi]):
                    hi[qi] = mid
                else:
                    lo[qi] = mid + 1
    
    return lo
```

### Template 4: Sqrt Decomposition

```python
class SqrtDecomposition:
    """Generic sqrt decomposition for range queries and updates."""
    
    def __init__(self, arr: List[int]):
        self.n = len(arr)
        self.arr = arr[:]
        self.block_size = int(self.n ** 0.5) + 1
        self.num_blocks = (self.n + self.block_size - 1) // self.block_size
        self.blocks = [0] * self.num_blocks
        
        # Initialize block sums
        for i in range(self.n):
            self.blocks[i // self.block_size] += arr[i]
    
    def point_update(self, idx: int, val: int):
        """Update arr[idx] to val."""
        diff = val - self.arr[idx]
        self.arr[idx] = val
        self.blocks[idx // self.block_size] += diff
    
    def range_query(self, l: int, r: int) -> int:
        """Query sum in [l, r]."""
        result = 0
        
        # Left partial
        while l <= r and l % self.block_size != 0:
            result += self.arr[l]
            l += 1
        
        # Full blocks
        while l + self.block_size <= r:
            result += self.blocks[l // self.block_size]
            l += self.block_size
        
        # Right partial
        while l <= r:
            result += self.arr[l]
            l += 1
        
        return result
```

### Template 5: Mo's on Tree

```python
from typing import List, Tuple, Set

def mos_on_tree(
    n: int,
    edges: List[Tuple[int, int]],
    node_values: List[int],
    path_queries: List[Tuple[int, int]]
) -> List[int]:
    """
    Mo's algorithm for tree path queries.
    Uses Euler tour to convert paths to ranges.
    
    Args:
        n: Number of nodes
        edges: Tree edges
        node_values: Value at each node
        path_queries: List of (u, v) path queries
    
    Returns:
        Answers for each path query
    """
    # Build adjacency list
    tree = [[] for _ in range(n)]
    for u, v in edges:
        tree[u].append(v)
        tree[v].append(u)
    
    # Euler tour
    euler = []
    first = [-1] * n
    last = [-1] * n
    depth = [0] * n
    
    def dfs(u: int, p: int):
        first[u] = len(euler)
        euler.append(u)
        for v in tree[u]:
            if v != p:
                depth[v] = depth[u] + 1
                dfs(v, u)
                euler.append(u)
        last[u] = len(euler) - 1
    
    dfs(0, -1)
    
    # Convert path queries to range queries
    # (requires LCA handling for proper implementation)
    # This is a simplified version
    
    return []
```

### Template 6: Offline Query for Dynamic Connectivity

```python
def offline_dynamic_connectivity(edges, queries):
    """
    Process connectivity queries offline using divide-and-conquer.
    Each edge has (add_time, remove_time).
    Queries ask if u and v are connected at time t.
    """
    # Segment tree over time
    # Each edge is added to segments where it's active
    # DFS through segment tree, maintaining DSU with rollback
    pass
```

---

## When to Use

Use Offline Query processing when you need to solve problems involving:

- **Multiple Range Queries**: Many queries on a static or slowly changing array
- **Query Order Flexibility**: When queries can be answered in any order
- **Tree Path Queries**: Queries on paths in trees
- **Dynamic Connectivity**: Connectivity queries with edge additions/removals
- **Order Statistics**: K-th smallest in subarray queries

### Comparison: Online vs Offline

| Approach | When to Use | Complexity | Flexibility |
|----------|-------------|------------|-------------|
| **Online (Segment Tree)** | Data changes, need immediate answers | O(log n) per query | High |
| **Offline (Mo's)** | Static array, many queries | O((n+q)√n) total | Query order |
| **Offline (Parallel BS)** | Multiple binary searches | O(log n × check) | Batch processing |
| **Sqrt Decomposition** | Mix of queries and updates | O(√n) per operation | Moderate |

### When to Choose Each Approach

- **Choose Mo's Algorithm** when:
  - Array is static (or few updates)
  - Many range queries (q is large)
  - O(1) add/remove operations possible
  - Query order doesn't matter

- **Choose Parallel Binary Search** when:
  - Multiple "first position where..." queries
  - Check function can be batched efficiently
  - Online binary search would be too slow

- **Choose Sqrt Decomposition** when:
  - Need both queries and updates
  - Segment tree is overkill or not applicable
  - O(√n) per operation is acceptable

- **Choose Segment Tree (Online)** when:
  - Real-time answers required
  - Data changes frequently
  - O(log n) per operation needed

---

## Algorithm Explanation

### Core Concept

Offline query processing leverages the fact that when we know all queries in advance, we can reorder them to minimize the total work. Instead of answering each query independently (which might require O(n) or O(log n) per query), we process them in an order that allows us to reuse computation from one query to the next.

### How It Works

#### Mo's Algorithm: Minimizing Pointer Movement

1. **Block Decomposition**: Divide array into √n blocks
2. **Query Sorting**: Sort by (block of left, right) with alternating direction
3. **Incremental Updates**: Add/remove elements one at a time as window moves
4. **Amortized Cost**: Each element is added/removed O(√n) times on average

**Why It Works**:
- Left pointer moves: O(q × block_size) = O(q × √n)
- Right pointer moves: O(n × √n) due to sorting pattern
- Total: O((n + q) × √n)

#### Parallel Binary Search: Batching Binary Searches

1. **Simultaneous Search**: All queries search together
2. **Mid Grouping**: Group queries by their current mid value
3. **Batch Check**: Process all queries at the same mid together
4. **Convergence**: After O(log n) iterations, all searches complete

### Visual Representation

**Mo's Query Ordering**:
```
Array blocks: [0,1,2] [3,4,5] [6,7,8] ...

Queries (l, r):
  (1, 4) → block 0, r=4
  (2, 7) → block 0, r=7
  (5, 9) → block 1, r=9
  (4, 6) → block 1, r=6 (descending in block 1)

Sorted order minimizes movement between queries.
```

**Window Movement**:
```
Query 1: [2, 5] → distinct = {a, b, c}
Query 2: [4, 8] → reuse window [2,5], add 6,7,8, remove 2,3
           Much faster than rebuilding from scratch
```

### Limitations

- **Static Data**: Mo's requires array to be static (or special handling for updates)
- **Add/Remove Required**: Must be able to maintain state with O(1) add/remove
- **No Real-Time**: Cannot answer queries as they arrive
- **Memory**: May need to store all queries and results

---

## Practice Problems

### Problem 1: Range Frequency Queries

**Problem:** [LeetCode 2080 - Range Frequency Queries](https://leetcode.com/problems/range-frequency-queries/)

**Description:** Answer queries about the frequency of a value in a subarray.

**How to Apply:**
- Sort queries by value, then use Mo's or segment tree
- Or use offline processing with frequency maps

---

### Problem 2: Number of Good Triplets in Array

**Problem:** [LeetCode 2179 - Count Good Triplets in an Array](https://leetcode.com/problems/count-good-triplets-in-an-array/)

**Description:** Count triplets satisfying certain conditions.

**How to Apply:**
- Offline processing with coordinate compression
- Use Fenwick tree or segment tree for counting

---

### Problem 3: Count of Range Sum

**Problem:** [LeetCode 327 - Count of Range Sum](https://leetcode.com/problems/count-of-range-sum/)

**Description:** Count subarrays with sum in range [lower, upper].

**How to Apply:**
- Prefix sums + offline coordinate compression
- Use Fenwick tree or merge sort counting

---

### Problem 4: K-th Smallest Pair Distance

**Problem:** [LeetCode 719 - Find K-th Smallest Pair Distance](https://leetcode.com/problems/find-k-th-smallest-pair-distance/)

**Description:** Find k-th smallest absolute difference among all pairs.

**How to Apply:**
- Binary search on distance + offline counting
- Or use selection algorithm with preprocessing

---

## Video Tutorial Links

### Fundamentals

- [Mo's Algorithm - Algorithms Live](https://www.youtube.com/watch?v=6pVvTEBO1Zw) - Comprehensive explanation
- [Sqrt Decomposition - William Fiset](https://www.youtube.com/watch?v=4Y0crUjKjRQ) - Block-based techniques
- [Offline Queries - Codeforces](https://www.youtube.com/watch?v=6pVvTEBO1Zw) - Competitive programming

### Advanced Topics

- [Parallel Binary Search - Competitive Programming](https://www.youtube.com/watch?v=4Y0crUjKjRQ) - Batch processing
- [Hilbert Order Mo's - CP Algorithms](https://cp-algorithms.com/data_structures/sqrt-tree.html) - Optimization
- [Dynamic Connectivity Offline - MIT](https://www.youtube.com/watch?v=6pVvTEBO1Zw) - Advanced applications

---

## Follow-up Questions

### Q1: When is Mo's algorithm better than a segment tree?

**Answer:** Mo's is better when:
- The query operation is complex and doesn't fit segment tree easily
- You need O(1) add/remove but O(log n) would be too slow for many queries
- Array is static and you can process queries offline
- Query involves counting distinct, frequencies, or other non-aggregatable properties

---

### Q2: How do you handle updates in Mo's algorithm?

**Answer:** Use "Mo's algorithm with modification":
- Add a third dimension "time" (number of updates before query)
- Sort by (left_block, right_block, time)
- When processing, apply/revert updates as needed
- Complexity becomes O((n + q) × n^(2/3)) with appropriate block sizes

---

### Q3: What is Hilbert order and why use it?

**Answer:** Hilbert order is a space-filling curve that maps 2D coordinates (l, r) to 1D while preserving locality better than block sorting. It improves cache performance because consecutive queries in Hilbert order are likely to have similar windows, reducing pointer movement and cache misses.

---

### Q4: Can Mo's algorithm work on trees?

**Answer:** Yes, using Euler tour to flatten the tree:
- Perform DFS, record entry/exit times
- Path queries become range queries on the Euler tour
- Need special handling for LCA since it appears twice
- Common technique: include node if visited odd number of times in range

---

### Q5: What are the alternatives to Mo's algorithm for offline queries?

**Answer:**
- **Segment Tree**: For online queries with O(log n) per operation
- **Sqrt Decomposition**: For mix of queries and updates
- **Fenwick Tree + Coordinate Compression**: For counting problems
- **Wavelet Tree**: For range quantile queries
- **Persistent Segment Tree**: For range mode, k-th order statistics

---

## Summary

Offline query processing is a powerful technique for batch processing range queries efficiently. The key takeaways are:

1. **Mo's Algorithm**: O((n + q) × √n) for range queries with O(1) add/remove
2. **Parallel Binary Search**: Batch multiple binary searches for efficiency
3. **Query Reordering**: Strategic sorting minimizes data structure updates
4. **Tree Applications**: Euler tour converts tree paths to array ranges
5. **Cache Optimization**: Hilbert order improves memory access patterns

**When to Use:**
- Static arrays with many range queries
- Problems where query order doesn't matter
- When O(1) incremental updates are possible
- Tree path queries via Euler tour

**Key Formula:**
```
Mo's complexity: O((n + q) × √n)
Parallel binary search: O(log n × check_cost)
```

This pattern is essential for competitive programming and large-scale data processing where batch optimization can dramatically improve performance.
