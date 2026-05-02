# Sqrt Decomposition (Mo's Algorithm)

## Category
Data Structures - Range Queries

## Description

Sqrt Decomposition is a technique that divides an array into blocks of size approximately √n, allowing efficient range queries and updates. Mo's Algorithm extends this to offline queries by reordering them to minimize transitions between query ranges, achieving O((n + q) × √n) complexity.

This technique bridges the gap between simple prefix sums (O(1) query, O(n) update) and segment trees (O(log n) query and update). For problems where updates are point-based and queries are range-based, sqrt decomposition often provides the simplest and most cache-efficient solution.

---

## Concepts

Sqrt Decomposition relies on fundamental divide-and-conquer and query optimization concepts.

### 1. Block Structure

| Aspect | Description |
|--------|-------------|
| **Block size** | Typically √n or n/√q for Mo's |
| **Number of blocks** | √n or √q |
| **Full block query** | O(1) using precomputed aggregate |
| **Partial block query** | O(√n) iterating elements |

### 2. Query Processing

| Operation | Approach | Complexity |
|-----------|----------|------------|
| **Build** | Precompute block aggregates | O(n) |
| **Point update** | Update element and block | O(1) |
| **Range query** | Full blocks + partial edges | O(√n) |

### 3. Mo's Algorithm Ordering

| Strategy | Sort Key | Benefit |
|----------|----------|---------|
| **Block sort** | (block(l), r) | Group queries by left block |
| **Hilbert curve** | Hilbert order | Better locality |
| **Alternating** | (block(l), ±r) | Reduce movement |

### 4. Complexity Analysis

| Algorithm | Query | Update | Build | Space |
|-----------|-------|--------|-------|-------|
| **Array** | O(n) | O(1) | - | O(1) |
| **Sqrt Decomposition** | O(√n) | O(1) | O(n) | O(n) |
| **Segment Tree** | O(log n) | O(log n) | O(n) | O(n) |
| **Fenwick Tree** | O(log n) | O(log n) | O(n) | O(n) |
| **Mo's Algorithm** | O((n+q)√n) | Offline | O(n) | O(n) |

---

## Frameworks

Structured approaches for sqrt decomposition problems.

### Framework 1: Basic Sqrt Decomposition

```
┌─────────────────────────────────────────────────────────────┐
│  BASIC SQRT DECOMPOSITION                                    │
├─────────────────────────────────────────────────────────────┤
│  1. Compute block_size = √n (or int(√n) + 1)              │
│  2. num_blocks = ceil(n / block_size)                       │
│  3. Initialize blocks[num_blocks]                           │
│                                                              │
│  4. Build: For each i in [0..n-1]:                         │
│     a. block_idx = i // block_size                         │
│     b. blocks[block_idx] += arr[i] (or min/max/etc)        │
│                                                              │
│  5. Update(i, val):                                         │
│     a. diff = val - arr[i]                                 │
│     b. arr[i] = val                                          │
│     c. blocks[i//block_size] += diff                        │
│                                                              │
│  6. Query(l, r):                                            │
│     a. If l and r in same block: iterate l..r             │
│     b. Else:                                                │
│        - Iterate from l to end of its block               │
│        - Add precomputed value for full blocks between    │
│        - Iterate from start of r's block to r              │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Range queries with point updates.

### Framework 2: Mo's Algorithm

```
┌─────────────────────────────────────────────────────────────┐
│  MO'S ALGORITHM (OFFLINE RANGE QUERIES)                      │
├─────────────────────────────────────────────────────────────┤
│  1. block_size = √n or n/√q                                 │
│  2. Add original index to each query for output ordering    │
│                                                              │
│  3. Sort queries by:                                         │
│     - Primary: block of left endpoint                       │
│     - Secondary: right endpoint (alternating direction)    │
│                                                              │
│  4. Initialize: curr_l = 0, curr_r = -1 (empty range)        │
│     current_answer = neutral value                          │
│                                                              │
│  5. For each query (l, r) in sorted order:                  │
│     a. While curr_r < r: add(arr[++curr_r])                  │
│     b. While curr_r > r: remove(arr[curr_r--])              │
│     c. While curr_l < l: remove(arr[curr_l++])               │
│     d. While curr_l > l: add(arr[--curr_l])                │
│     e. Store answer for this query                          │
│                                                              │
│  6. Output answers in original query order                   │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Offline range queries, especially frequency/counting problems.

### Framework 3: Min/Max Query Variant

```
┌─────────────────────────────────────────────────────────────┐
│  SQRT DECOMPOSITION FOR MIN/MAX                              │
├─────────────────────────────────────────────────────────────┤
│  Build:                                                      │
│    blocks[i] = min/max of elements in that block             │
│                                                              │
│  Update:                                                     │
│    1. Update element in array                                │
│    2. Recompute entire block's min/max by scanning block     │
│       (O(block_size) = O(√n))                               │
│                                                              │
│  Query:                                                      │
│    1. Scan partial left block                                │
│    2. Take min/max of full blocks                           │
│    3. Scan partial right block                                │
│                                                              │
│  Note: Updates are O(√n), not O(1) for min/max             │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Range minimum/maximum with point updates.

---

## Forms

Different manifestations of sqrt decomposition.

### Form 1: Standard Sqrt Decomposition

Basic block-based structure for sum queries.

| Aspect | Details |
|--------|---------|
| **Block size** | √n |
| **Query** | O(√n) |
| **Update** | O(1) |
| **Space** | O(n) |
| **Best for** | Range sum, frequent point updates |

### Form 2: Mo's Algorithm

Offline query reordering for efficiency.

| Aspect | Details |
|--------|---------|
| **Preprocessing** | Sort queries by block |
| **Query** | O((n+q) × √n) total |
| **Requirement** | Must know all queries in advance |
| **Best for** | Frequency counting, distinct elements |

### Form 3: Weighted Sqrt Decomposition

Variable block sizes based on query patterns.

| Aspect | Details |
|--------|---------|
| **Block size** | n/√q for Mo's (where q = query count) |
| **Optimization** | Balance work per query vs total |
| **Best for** | When q << n or q >> n |

### Form 4: 2D Sqrt Decomposition

Extension to matrix range queries.

| Aspect | Details |
|--------|---------|
| **Blocks** | √n × √n submatrices |
| **Query** | O(√n + √m) for n×m matrix |
| **Best for** | 2D range queries |

---

## Tactics

Specific techniques for sqrt decomposition.

### Tactic 1: Range Sum with Point Updates

Standard sqrt decomposition for sum:

```python
import math

class SqrtDecomposition:
    """Range sum query with point updates."""
    
    def __init__(self, nums):
        self.n = len(nums)
        self.block_size = int(math.sqrt(self.n)) + 1
        self.nums = nums[:]
        self.blocks = [0] * (self.n // self.block_size + 1)
        
        # Initialize blocks
        for i in range(self.n):
            self.blocks[i // self.block_size] += nums[i]
    
    def update(self, index, val):
        """Point update: O(1)."""
        diff = val - self.nums[index]
        self.nums[index] = val
        self.blocks[index // self.block_size] += diff
    
    def query(self, left, right):
        """Range sum query: O(√n)."""
        sum_val = 0
        
        # Left partial block
        while left <= right and left % self.block_size != 0:
            sum_val += self.nums[left]
            left += 1
        
        # Full blocks
        while left + self.block_size <= right:
            sum_val += self.blocks[left // self.block_size]
            left += self.block_size
        
        # Right partial block
        while left <= right:
            sum_val += self.nums[left]
            left += 1
        
        return sum_val
```

**Key**: Handle left partial, full blocks, right partial.

### Tactic 2: Mo's Algorithm Implementation

Classic offline query processing:

```python
from math import sqrt

def mos_algorithm(arr, queries):
    """
    Process range queries efficiently using Mo's algorithm.
    Returns answer for each query.
    """
    n = len(arr)
    q = len(queries)
    block_size = int(sqrt(n))
    
    # Add original index to each query for output ordering
    queries = [(l, r, i) for i, (l, r) in enumerate(queries)]
    
    # Sort queries: by block of left, then by right (alternating)
    def query_sort_key(query):
        l, r, idx = query
        block = l // block_size
        # Within block, sort by right (ascending for even blocks, descending for odd)
        if block % 2 == 0:
            return (block, r)
        else:
            return (block, -r)
    
    queries.sort(key=query_sort_key)
    
    # Answer each query by expanding/shrinking range
    answers = [0] * q
    curr_l, curr_r = 0, -1  # Empty range
    curr_sum = 0  # Current aggregate
    
    for l, r, idx in queries:
        # Expand/shrink to [l, r]
        while curr_r < r:
            curr_r += 1
            curr_sum += arr[curr_r]  # Add
        
        while curr_r > r:
            curr_sum -= arr[curr_r]  # Remove
            curr_r -= 1
        
        while curr_l < l:
            curr_sum -= arr[curr_l]  # Remove
            curr_l += 1
        
        while curr_l > l:
            curr_l -= 1
            curr_sum += arr[curr_l]  # Add
        
        answers[idx] = curr_sum
    
    return answers
```

**Optimization**: Alternating sort order reduces movement.

### Tactic 3: Range Mode Query with Mo's

Finding most frequent element:

```python
def mos_mode_query(arr, queries):
    """Mo's algorithm for range mode query."""
    from collections import defaultdict
    
    n = len(arr)
    block_size = int(sqrt(n))
    
    queries = [(l, r, i) for i, (l, r) in enumerate(queries)]
    queries.sort(key=lambda x: (x[0] // block_size, x[1] if (x[0] // block_size) % 2 == 0 else -x[1]))
    
    freq = defaultdict(int)
    max_freq = 0
    answers = [0] * len(queries)
    
    def add(pos):
        nonlocal max_freq
        freq[arr[pos]] += 1
        max_freq = max(max_freq, freq[arr[pos]])
    
    def remove(pos):
        freq[arr[pos]] -= 1
    
    curr_l, curr_r = 0, -1
    
    for l, r, idx in queries:
        while curr_r < r:
            curr_r += 1
            add(curr_r)
        while curr_r > r:
            remove(curr_r)
            curr_r -= 1
        while curr_l < l:
            remove(curr_l)
            curr_l += 1
        while curr_l > l:
            curr_l -= 1
            add(curr_l)
        
        answers[idx] = max_freq
    
    return answers
```

**Note**: Tracking mode with updates is complex; often track frequency.

### Tactic 4: Min Query with Update

Sqrt decomposition for range minimum:

```python
class SqrtDecompositionMin:
    """Range minimum query with point updates."""
    
    def __init__(self, nums):
        self.n = len(nums)
        self.block_size = int(sqrt(self.n)) + 1
        self.nums = nums[:]
        num_blocks = self.n // self.block_size + 1
        self.blocks = [float('inf')] * num_blocks
        
        for i in range(self.n):
            block_idx = i // self.block_size
            self.blocks[block_idx] = min(self.blocks[block_idx], nums[i])
    
    def update(self, index, val):
        """Point update: O(√n) - must recompute block."""
        self.nums[index] = val
        block_idx = index // self.block_size
        start = block_idx * self.block_size
        end = min(start + self.block_size, self.n)
        self.blocks[block_idx] = min(self.nums[start:end])
    
    def query(self, left, right):
        """Range min query: O(√n)."""
        min_val = float('inf')
        
        while left <= right and left % self.block_size != 0:
            min_val = min(min_val, self.nums[left])
            left += 1
        
        while left + self.block_size <= right:
            min_val = min(min_val, self.blocks[left // self.block_size])
            left += self.block_size
        
        while left <= right:
            min_val = min(min_val, self.nums[left])
            left += 1
        
        return min_val
```

**Difference**: Updates require O(√n) to recompute block min.

### Tactic 5: Hilbert Curve Ordering

Better than block sorting:

```python
def hilbert_order(x, y, pow=21, rotate=0):
    """Compute Hilbert order for Mo's algorithm."""
    d = 0
    s = 1 << (pow - 1)
    for s in reversed(range(pow)):
        rx = (x >> s) & 1
        ry = (y >> s) & 1
        d <<= 2
        d |= (rx * 3) ^ ry ^ rotate
        # Rotation calculation
        if ry == 0:
            if rx == 1:
                rotate ^= 3
            # Swap rx, ry
            rx, ry = ry, rx
    return d

def mos_hilbert(arr, queries):
    """Mo's with Hilbert curve ordering."""
    queries_hilbert = [(l, r, i, hilbert_order(l, r)) for i, (l, r) in enumerate(queries)]
    queries_hilbert.sort(key=lambda x: x[3])
    # Process as normal...
```

**Benefit**: Better locality, fewer transitions.

---

## Python Templates

### Template 1: Standard Sqrt Decomposition

```python
import math
from typing import List


class SqrtDecomposition:
    """
    Sqrt Decomposition for range sum queries with point updates.
    
    Time: O(√n) per query, O(1) per update
    Space: O(n)
    """
    
    def __init__(self, nums: List[int]):
        self.n = len(nums)
        self.block_size = int(math.sqrt(self.n)) + 1
        self.nums = nums[:]
        self.blocks = [0] * (self.n // self.block_size + 1)
        
        # Initialize block aggregates
        for i in range(self.n):
            self.blocks[i // self.block_size] += nums[i]
    
    def update(self, index: int, val: int) -> None:
        """
        Point update: O(1)
        
        Args:
            index: Position to update
            val: New value
        """
        diff = val - self.nums[index]
        self.nums[index] = val
        self.blocks[index // self.block_size] += diff
    
    def query(self, left: int, right: int) -> int:
        """
        Range sum query: O(√n)
        
        Args:
            left: Left index (inclusive)
            right: Right index (inclusive)
        
        Returns:
            Sum of elements in [left, right]
        """
        sum_val = 0
        
        # Left partial block
        while left <= right and left % self.block_size != 0:
            sum_val += self.nums[left]
            left += 1
        
        # Full blocks
        while left + self.block_size <= right:
            sum_val += self.blocks[left // self.block_size]
            left += self.block_size
        
        # Right partial block
        while left <= right:
            sum_val += self.nums[left]
            left += 1
        
        return sum_val
```

### Template 2: Mo's Algorithm

```python
from math import sqrt
from typing import List, Callable


def mos_algorithm(arr: List[int], 
                  queries: List[tuple], 
                  add: Callable, 
                  remove: Callable, 
                  get_answer: Callable) -> List:
    """
    Mo's Algorithm for offline range queries.
    
    Args:
        arr: Input array
        queries: List of (left, right) queries (inclusive)
        add: Function to add element at index to current state
        remove: Function to remove element at index from current state
        get_answer: Function to get current answer
    
    Returns:
        List of answers in original query order
    """
    n = len(arr)
    q = len(queries)
    block_size = int(sqrt(n))
    
    # Add original index to each query
    indexed_queries = [(l, r, i) for i, (l, r) in enumerate(queries)]
    
    # Sort queries: by block of left, then by right (alternating)
    indexed_queries.sort(key=lambda x: (
        x[0] // block_size,
        x[1] if (x[0] // block_size) % 2 == 0 else -x[1]
    ))
    
    answers = [None] * q
    curr_l, curr_r = 0, -1  # Empty range
    
    for l, r, idx in indexed_queries:
        # Expand/shrink to [l, r]
        while curr_r < r:
            curr_r += 1
            add(curr_r)
        
        while curr_r > r:
            remove(curr_r)
            curr_r -= 1
        
        while curr_l < l:
            remove(curr_l)
            curr_l += 1
        
        while curr_l > l:
            curr_l -= 1
            add(curr_l)
        
        answers[idx] = get_answer()
    
    return answers
```

### Template 3: Range Frequency with Mo's

```python
from collections import defaultdict


def range_frequency_queries(arr: List[int], queries: List[tuple]) -> List[int]:
    """
    Answer range frequency queries using Mo's algorithm.
    Returns maximum frequency in each range.
    """
    freq = defaultdict(int)
    current_max_freq = 0
    
    def add(pos: int):
        nonlocal current_max_freq
        freq[arr[pos]] += 1
        current_max_freq = max(current_max_freq, freq[arr[pos]])
    
    def remove(pos: int):
        freq[arr[pos]] -= 1
        # Note: current_max_freq might be stale, 
        # in practice recalculate when needed or track differently
    
    def get_answer():
        return current_max_freq
    
    return mos_algorithm(arr, queries, add, remove, get_answer)
```

---

## When to Use

Use Sqrt Decomposition when you need to solve problems involving:

- **Range queries with point updates**: When segment tree is too complex
- **Offline queries**: Mo's algorithm for multiple queries
- **Small constraint problems**: n ≤ 10^5, simpler than segment tree
- **When element addition/removal is easy**: Frequency counts, XOR, etc.
- **Competitive programming**: Quick to implement

### Comparison with Alternatives

| Data Structure | Query | Update | Build | Notes |
|----------------|-------|--------|-------|-------|
| **Array** | O(n) | O(1) | - | Simple |
| **Sqrt Decomposition** | O(√n) | O(1) | O(n) | Balanced |
| **Segment Tree** | O(log n) | O(log n) | O(n) | Tree-based |
| **Fenwick Tree** | O(log n) | O(log n) | O(n) | BIT |
| **Mo's Algorithm** | O((n+q)√n) | Offline | O(n) | Reorder queries |

### When to Choose Sqrt Decomposition vs Segment Tree

- **Choose Sqrt Decomposition** when:
  - Query/Update pattern is O(√n) acceptable
  - Implementation simplicity matters
  - Problem involves offline queries (Mo's)
  - Constant factors matter (cache efficiency)

- **Choose Segment Tree** when:
  - Need O(log n) guarantees
  - Online queries required
  - Range updates needed (lazy propagation)
  - Space is constrained

---

## Algorithm Explanation

### Core Concept

Sqrt Decomposition divides the array into √n blocks. For range queries:
- **Partial blocks** at edges are processed element-by-element
- **Full blocks** in the middle use precomputed aggregates

This gives O(√n) query time: at most 2 partial blocks (2√n elements) + √n full blocks.

### How Mo's Algorithm Works

#### Step 1: Sort Queries
```
Group by block of left endpoint
Within block, sort by right (alternating direction)
```

#### Step 2: Process Incrementally
```
Move current [L, R] to target [l, r]:
- Add/remove elements one at a time
- Each move changes L or R by 1
- Amortized O(√n) moves per query
```

#### Step 3: Amortized Analysis
```
L moves at most √n per block change
R moves at most n per block, but sorted order limits total
Overall: O((n + q) × √n)
```

### Visual Walkthrough

**Sqrt Decomposition Example**:
```
Array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
Block size = √10 ≈ 3

Blocks:
  Block 0: [1, 2, 3] sum=6
  Block 1: [4, 5, 6] sum=15
  Block 2: [7, 8, 9] sum=24
  Block 3: [10] sum=10

Query [2, 8]:
  - Left partial (index 2): 3
  - Full blocks: Block 1 (4,5,6) + Block 2 (7,8,9) = 15 + 24 = 39
  - Right partial: none (9 is end of block)
  
  Wait, need to be careful...
  
  Actually: indices 2,3,4,5,6,7,8
  - Left partial: index 2 (value 3)
  - Full blocks: Block 1 (indices 3,4,5) = 4+5+6 = 15
  - Right partial: indices 6,7,8 = 7+8+9 = 24
  
  Total: 3 + 15 + 24 = 42 ✓
```

---

## Practice Problems

### Problem 1: Range Sum Query - Mutable

**Problem:** [LeetCode 307 - Range Sum Query - Mutable](https://leetcode.com/problems/range-sum-query-mutable/)

**Description:** Given an integer array `nums`, handle multiple queries: sumRange and update.

**How to Apply:**
- Use sqrt decomposition or BIT/Segment Tree
- Point updates and range sum queries
- Sqrt decomposition is simpler to implement

---

### Problem 2: Range Frequency Queries

**Problem:** [LeetCode 2080 - Range Frequency Queries](https://leetcode.com/problems/range-frequency-queries/)

**Description:** Design a data structure to find the frequency of a value in a subarray.

**How to Apply:**
- Use Mo's algorithm for offline queries
- Or use hash map per block for online queries

---

### Problem 3: XOR Queries of a Subarray

**Problem:** [LeetCode 1310 - XOR Queries of a Subarray](https://leetcode.com/problems/xor-queries-of-a-subarray/)

**Description:** Handle multiple XOR range queries.

**How to Apply:**
- Sqrt decomposition works well for XOR
- Or use prefix XOR for O(1) queries

---

## Video Tutorial Links

### Fundamentals

- [Sqrt Decomposition](https://www.youtube.com/watch?v=gWnBB7Uw4Kc) - Data structure
- [Mo's Algorithm](https://www.youtube.com/watch?v=gWnBB7Uw4Kc) - Query optimization
- [CP-Algorithms - Mo's](https://cp-algorithms.com/data_structures/sqrt_decomposition.html) - Theory

### Advanced Topics

- [Hilbert Curve Ordering](https://www.youtube.com/watch?v=9Z1wUhlF4d8) - Optimization
- [2D Sqrt Decomposition](https://www.youtube.com/watch?v=wiDlG4Dbb68) - Matrix queries
- [Advanced Mo's](https://www.youtube.com/watch?v=Z0l3HbT1Q1g) - Modifications

---

## Follow-up Questions

### Q1: What is the optimal block size for Mo's algorithm?

**Answer**: The optimal is typically n/√q where q is the number of queries. If q ≈ n, use √n. If q << n, use larger blocks. If q >> n, use smaller blocks. In practice, √n works well for most cases.

### Q2: Can Mo's algorithm handle updates?

**Answer**: Yes, with modifications. One approach is "Mo's algorithm with modifications" which handles point updates by time dimension - adding a third dimension to sort by. Complexity becomes O(n^(5/3)).

### Q3: When is segment tree strictly better than sqrt decomposition?

**Answer**: Segment tree wins when:
- You need O(log n) worst-case guarantees
- Range updates are needed (lazy propagation)
- Online queries required (can't sort)
- Space is very constrained

### Q4: Can sqrt decomposition handle 2D range queries?

**Answer**: Yes! Use √n × √n blocks. Query becomes O(√n + √m) for an n×m matrix. However, this gets complex and segment trees/Fenwick trees are often preferred for 2D.

### Q5: What makes a problem suitable for Mo's algorithm?

**Answer**: Good candidates have:
- Offline queries (all known in advance)
- Easy add/remove operations
- No updates (or use modified Mo's)
- Counting/aggregation that can be maintained incrementally

---

## Summary

Sqrt Decomposition and Mo's Algorithm provide elegant solutions for range query problems, balancing simplicity and efficiency. They serve as excellent alternatives when segment trees are overkill or too complex.

**Key Takeaways:**

1. **Block Size**: √n typically, adjust based on query count
2. **Mo's Ordering**: Sort by block, alternate direction for optimization
3. **Add/Remove**: Must support efficient incremental updates
4. **Offline Only**: Must know all queries beforehand
5. **Cache Efficient**: Sequential access patterns

**When to Use:**
- Range queries with point updates
- Offline query batches
- When O(√n) is acceptable
- Competitive programming scenarios

These techniques are essential for competitive programmers and provide a middle ground between naive and sophisticated data structures.
