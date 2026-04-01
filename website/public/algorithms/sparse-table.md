# Sparse Table

## Category
Advanced Data Structures

## Description

A Sparse Table is a data structure that enables **O(1) range query time** after **O(n log n)** preprocessing for idempotent operations like minimum (RMQ), maximum, GCD, and LCM on static arrays. It leverages the power of precomputation to answer range queries in constant time, making it ideal for scenarios where the array never changes but many queries need to be answered quickly.

The key insight is that any interval can be covered by at most **two precomputed intervals** of powers of two. By precomputing the answer for all intervals whose lengths are powers of two, we can answer any range query by combining just two of these precomputed values. This transforms O(n) range queries into O(1) operations with some upfront preprocessing cost.

---

## Concepts

### 1. Idempotent Operations

Sparse Table only works for operations where `f(f(x,y),z) = f(x,y,z)` and `f(x,x) = x`.

| Operation | Idempotent | Sparse Table Compatible |
|-----------|------------|------------------------|
| **Min** | Yes | ✅ |
| **Max** | Yes | ✅ |
| **GCD** | Yes | ✅ |
| **LCM** | Yes | ✅ |
| **Bitwise AND** | Yes | ✅ |
| **Bitwise OR** | Yes | ✅ |
| **Sum** | No | ❌ |
| **Product** | No | ❌ |

### 2. Power-of-Two Decomposition

Any range `[L, R]` of length `len = R - L + 1` can be covered by two overlapping power-of-two intervals:
- Let `k = floor(log2(len))`
- Interval 1: `[L, L + 2^k - 1]` (starts at L)
- Interval 2: `[R - 2^k + 1, R]` (ends at R)

These two intervals together cover `[L, R]` completely.

### 3. Precomputed Logarithms

Precompute `log2[i]` for all `i` from 1 to n for O(1) query time.

```
log[1] = 0
log[i] = log[i // 2] + 1  for i > 1
```

### 4. Table Structure

`table[j][i]` stores the result for range `[i, i + 2^j - 1]`.

```
j=0 (len=1):  table[0][i] = arr[i]
j=1 (len=2):  table[1][i] = func(table[0][i], table[0][i+1])
j=2 (len=4):  table[2][i] = func(table[1][i], table[1][i+2])
```

---

## Frameworks

### Framework 1: Standard Sparse Table for RMQ

```
┌─────────────────────────────────────────────────────────┐
│  SPARSE TABLE FRAMEWORK - Range Minimum Query           │
├─────────────────────────────────────────────────────────┤
│  1. Precompute log2 values for 1 to n                   │
│  2. Build table:                                        │
│     a. table[0][i] = arr[i] for all i                   │
│     b. For j from 1 to log(n):                          │
│        For i from 0 to n - 2^j:                         │
│          table[j][i] = min(table[j-1][i],               │
│                          table[j-1][i + 2^(j-1)])        │
│  3. Query [L, R]:                                       │
│     a. len = R - L + 1                                  │
│     b. k = log[len]                                     │
│     c. return min(table[k][L], table[k][R - 2^k + 1])     │
└─────────────────────────────────────────────────────────┘
```

### Framework 2: Multi-Operation Sparse Table

```
┌─────────────────────────────────────────────────────────┐
│  MULTI-OPERATION SPARSE TABLE                           │
├─────────────────────────────────────────────────────────┤
│  Build separate tables for each operation:              │
│  - min_table for range minimum                          │
│  - max_table for range maximum                          │
│  - gcd_table for range GCD                              │
│                                                          │
│  All tables built simultaneously during preprocessing   │
│  Query uses appropriate table based on operation        │
└─────────────────────────────────────────────────────────┘
```

---

## Forms

### Form 1: Range Minimum/Maximum Query (RMQ)

Most common application. Used for finding min/max in subarrays.

| Aspect | Details |
|--------|---------|
| **Build** | O(n log n) |
| **Query** | O(1) |
| **Use case** | Sliding window min/max, range queries |

### Form 2: Range GCD/LCM Query

GCD is idempotent: `gcd(a, a) = a` and `gcd(gcd(a,b),c) = gcd(a,b,c)`.

| Aspect | Details |
|--------|---------|
| **Build** | O(n log n) with gcd operations |
| **Query** | O(1) |
| **Use case** | Number theory problems, divisibility checks |

### Form 3: 2D Sparse Table

For matrix range queries.

| Aspect | Details |
|--------|---------|
| **Build** | O(n*m*log(n)*log(m)) |
| **Query** | O(1) |
| **Use case** | Image processing, 2D range queries |

### Form 4: Comparison with Alternatives

| Data Structure | Build | Query | Update | Best For |
|----------------|-------|-------|--------|----------|
| **Prefix Sum** | O(n) | O(1) | O(n) | Static sum queries |
| **Sparse Table** | O(n log n) | O(1) | O(n log n) | Static min/max/gcd |
| **Segment Tree** | O(n) | O(log n) | O(log n) | Dynamic data |
| **Fenwick Tree** | O(n) | O(log n) | O(log n) | Dynamic prefix sums |

---

## Tactics

### Tactic 1: Finding Range Minimum with Index

```python
def query_min_with_index(sparse_table, left, right):
    """Return (min_value, min_index) in range."""
    length = right - left + 1
    k = sparse_table.log[length]
    
    # Store pairs of (value, index)
    left_val, left_idx = sparse_table.table[k][left]
    right_val, right_idx = sparse_table.table[k][right - (1 << k) + 1]
    
    if left_val <= right_val:
        return left_val, left_idx
    return right_val, right_idx
```

### Tactic 2: Finding Second Minimum

```python
def query_second_min(arr, sparse_table, left, right):
    """Find second minimum in range [left, right]."""
    min_val = sparse_table.query(left, right)
    
    # Find all occurrences of min and exclude one
    # This requires additional preprocessing
    # Alternative: use two sparse tables tracking top 2 values
    pass
```

### Tactic 3: Count of Minimum in Range

```python
def query_count_min(sparse_table, left, right):
    """Count occurrences of minimum value in range."""
    # Requires storing count along with value in table
    min_val = sparse_table.query(left, right)
    # Scan range to count (if range is small)
    # Or use segment tree for this specific query
```

### Tactic 4: Range GCD for Coprimality Check

```python
def range_is_coprime(sparse_table, left, right):
    """Check if all numbers in range are pairwise coprime."""
    range_gcd = sparse_table.query(left, right)
    return range_gcd == 1
```

---

## Python Templates

### Template 1: Generic Sparse Table

```python
from typing import List, Callable

class SparseTable:
    """
    Sparse Table for range queries on static arrays.
    Supports any idempotent operation (min, max, gcd, etc.)
    
    Time: Build O(n log n), Query O(1)
    Space: O(n log n)
    """
    
    def __init__(self, arr: List[int], func: Callable = min):
        if not arr:
            self.n = 0
            return
            
        self.n = len(arr)
        self.func = func
        
        # Precompute logs
        self.log = [0] * (self.n + 1)
        for i in range(2, self.n + 1):
            self.log[i] = self.log[i // 2] + 1
        
        self.log_n = self.log[self.n] + 1
        
        # Build table: table[j][i] = result for [i, i + 2^j - 1]
        self.table = [[0] * self.n for _ in range(self.log_n)]
        
        # Base case: intervals of length 1
        for i in range(self.n):
            self.table[0][i] = arr[i]
        
        # Build for larger intervals
        for j in range(1, self.log_n):
            for i in range(self.n - (1 << j) + 1):
                self.table[j][i] = self.func(
                    self.table[j-1][i],
                    self.table[j-1][i + (1 << (j-1))]
                )
    
    def query(self, left: int, right: int):
        """Query func(arr[left..right])."""
        if left < 0 or right >= self.n or left > right:
            raise ValueError(f"Invalid range [{left}, {right}]")
        
        length = right - left + 1
        k = self.log[length]
        
        return self.func(
            self.table[k][left],
            self.table[k][right - (1 << k) + 1]
        )


# Specialized subclasses
class SparseTableMin(SparseTable):
    def __init__(self, arr: List[int]):
        super().__init__(arr, min)


class SparseTableMax(SparseTable):
    def __init__(self, arr: List[int]):
        super().__init__(arr, max)


class SparseTableGCD(SparseTable):
    def __init__(self, arr: List[int]):
        import math
        super().__init__(arr, math.gcd)
```

### Template 2: Range Minimum Query with Index

```python
class SparseTableMinWithIndex:
    """Sparse Table that returns both min value and its index."""
    
    def __init__(self, arr: List[int]):
        self.n = len(arr)
        
        # Precompute logs
        self.log = [0] * (self.n + 1)
        for i in range(2, self.n + 1):
            self.log[i] = self.log[i // 2] + 1
        
        self.log_n = self.log[self.n] + 1
        
        # Store (value, index) pairs
        self.table = [[(0, 0)] * self.n for _ in range(self.log_n)]
        
        for i in range(self.n):
            self.table[0][i] = (arr[i], i)
        
        for j in range(1, self.log_n):
            for i in range(self.n - (1 << j) + 1):
                left = self.table[j-1][i]
                right = self.table[j-1][i + (1 << (j-1))]
                self.table[j][i] = left if left[0] <= right[0] else right
    
    def query(self, left: int, right: int) -> tuple:
        """Return (min_value, min_index) in range [left, right]."""
        length = right - left + 1
        k = self.log[length]
        
        left_val = self.table[k][left]
        right_val = self.table[k][right - (1 << k) + 1]
        
        return left_val if left_val[0] <= right_val[0] else right_val
```

### Template 3: Multi-Operation Sparse Table

```python
import math
from typing import List

class MultiSparseTable:
    """Sparse Table supporting multiple operations simultaneously."""
    
    def __init__(self, arr: List[int]):
        self.n = len(arr)
        
        # Precompute logs
        self.log = [0] * (self.n + 1)
        for i in range(2, self.n + 1):
            self.log[i] = self.log[i // 2] + 1
        
        log_n = self.log[self.n] + 1
        
        # Separate tables
        self.min_table = [[0] * self.n for _ in range(log_n)]
        self.max_table = [[0] * self.n for _ in range(log_n)]
        self.gcd_table = [[0] * self.n for _ in range(log_n)]
        
        # Initialize
        for i in range(self.n):
            self.min_table[0][i] = arr[i]
            self.max_table[0][i] = arr[i]
            self.gcd_table[0][i] = arr[i]
        
        # Build tables
        for j in range(1, log_n):
            for i in range(self.n - (1 << j) + 1):
                half = i + (1 << (j-1))
                
                self.min_table[j][i] = min(self.min_table[j-1][i], 
                                            self.min_table[j-1][half])
                self.max_table[j][i] = max(self.max_table[j-1][i], 
                                            self.max_table[j-1][half])
                self.gcd_table[j][i] = math.gcd(self.gcd_table[j-1][i], 
                                                 self.gcd_table[j-1][half])
    
    def query_min(self, left: int, right: int) -> int:
        k = self.log[right - left + 1]
        return min(self.min_table[k][left], 
                   self.min_table[k][right - (1 << k) + 1])
    
    def query_max(self, left: int, right: int) -> int:
        k = self.log[right - left + 1]
        return max(self.max_table[k][left], 
                   self.max_table[k][right - (1 << k) + 1])
    
    def query_gcd(self, left: int, right: int) -> int:
        k = self.log[right - left + 1]
        return math.gcd(self.gcd_table[k][left], 
                        self.gcd_table[k][right - (1 << k) + 1])
```

### Template 4: 2D Sparse Table (Matrix)

```python
class SparseTable2D:
    """2D Sparse Table for range queries on matrices."""
    
    def __init__(self, matrix: List[List[int]]):
        if not matrix or not matrix[0]:
            return
            
        self.n = len(matrix)
        self.m = len(matrix[0])
        
        # Precompute logs
        self.log_n = [0] * (self.n + 1)
        self.log_m = [0] * (self.m + 1)
        
        for i in range(2, max(self.n, self.m) + 1):
            if i <= self.n:
                self.log_n[i] = self.log_n[i // 2] + 1
            if i <= self.m:
                self.log_m[i] = self.log_m[i // 2] + 1
        
        # Build 4D table: table[i][j][x][y]
        # For range [x, x+2^i-1] x [y, y+2^j-1]
        max_log_n = self.log_n[self.n] + 1
        max_log_m = self.log_m[self.m] + 1
        
        self.table = [[[[0] * self.m for _ in range(self.n)] 
                      for _ in range(max_log_m)] 
                     for _ in range(max_log_n)]
        
        # Base case
        for i in range(self.n):
            for j in range(self.m):
                self.table[0][0][i][j] = matrix[i][j]
        
        # Build along first dimension (rows)
        for i in range(1, max_log_n):
            for x in range(self.n - (1 << i) + 1):
                for y in range(self.m):
                    self.table[i][0][x][y] = min(
                        self.table[i-1][0][x][y],
                        self.table[i-1][0][x + (1 << (i-1))][y]
                    )
        
        # Build along second dimension (columns)
        for j in range(1, max_log_m):
            for i in range(max_log_n):
                for x in range(self.n):
                    for y in range(self.m - (1 << j) + 1):
                        self.table[i][j][x][y] = min(
                            self.table[i][j-1][x][y],
                            self.table[i][j-1][x][y + (1 << (j-1))]
                        )
    
    def query(self, r1: int, c1: int, r2: int, c2: int) -> int:
        """Query minimum in rectangle [r1, r2] x [c1, c2]."""
        kx = self.log_n[r2 - r1 + 1]
        ky = self.log_m[c2 - c1 + 1]
        
        # Four corners query
        a = self.table[kx][ky][r1][c1]
        b = self.table[kx][ky][r1][c2 - (1 << ky) + 1]
        c = self.table[kx][ky][r2 - (1 << kx) + 1][c1]
        d = self.table[kx][ky][r2 - (1 << kx) + 1][c2 - (1 << ky) + 1]
        
        return min(a, b, c, d)
```

---

## When to Use

Use the Sparse Table when you need to solve problems involving:

- **Static Arrays**: Array elements don't change after initialization
- **Many Range Queries**: Large number of min/max/GCD queries
- **Fast Query Time**: O(1) query time is critical
- **Idempotent Operations**: Min, max, GCD, but NOT sum

### Comparison with Alternatives

| Data Structure | Build | Query | Update | Static Data |
|----------------|-------|-------|--------|-------------|
| **Prefix Sum** | O(n) | O(1) | O(n) | ✅ Yes |
| **Sparse Table** | O(n log n) | O(1) | O(n log n) | ✅ Yes |
| **Segment Tree** | O(n) | O(log n) | O(log n) | ❌ Dynamic |
| **Fenwick Tree** | O(n) | O(log n) | O(log n) | ❌ Dynamic |

### When to Choose Sparse Table vs Segment Tree

- **Choose Sparse Table** when:
  - Array is completely static
  - You need O(1) query time
  - Building O(n log n) table is acceptable

- **Choose Segment Tree** when:
  - Array may be updated
  - You need more operation flexibility
  - O(log n) query time is acceptable

---

## Algorithm Explanation

### Core Concept

Any range `[L, R]` of length `len` can be covered by two overlapping power-of-two intervals:
- `k = floor(log2(len))`
- Two intervals of length `2^k` starting at `L` and ending at `R`
- Since the operation is idempotent, overlap doesn't matter

### How It Works

**Preprocessing:**
1. Precompute `log2[i]` for all `i` from 1 to n
2. Build `table[j][i]` = result for range `[i, i + 2^j - 1]`
3. Use DP: `table[j][i] = func(table[j-1][i], table[j-1][i + 2^(j-1)])`

**Query:**
1. Find largest power of 2 ≤ range length: `k = floor(log2(R-L+1))`
2. Return `func(table[L][k], table[R - 2^k + 1][k])`

### Visual Representation

```
Array: [2, 5, 1, 8, 3, 9, 4, 6, 7]

Building table for min:
j=0 (len=1): [2, 5, 1, 8, 3, 9, 4, 6, 7]
j=1 (len=2): [2, 1, 1, 3, 3, 4, 4, 6]
j=2 (len=4): [1, 1, 1, 3, 3, 4]
j=3 (len=8): [1, 1]

Query [2, 5] (indices 2,3,4,5 = [1, 8, 3, 9]):
Length = 4, k = 2
Interval 1: table[2][2] = 1 (covers [2, 5])
Interval 2: table[2][2] = 1 (covers [2, 5])
Result: min(1, 1) = 1 ✓

Query [1, 6] (indices 1,2,3,4,5,6 = [5, 1, 8, 3, 9, 4]):
Length = 6, k = 2 (largest power of 2 ≤ 6 is 4)
Interval 1: table[2][1] = 1 (covers [1, 4])
Interval 2: table[2][3] = 3 (covers [3, 6])
Result: min(1, 3) = 1 ✓
```

### Why It Works

- **Two intervals cover any range**: By choosing the largest power of 2, two intervals of that length always cover the entire query range
- **Idempotent property**: Overlapping regions don't affect the result
- **O(1) query**: Just two table lookups and one combine operation

### Limitations

- **No updates**: Cannot handle dynamic changes efficiently
- **Only idempotent operations**: Sum and product don't work
- **Higher space**: O(n log n) vs O(n) for segment tree
- **Static only**: Must rebuild for any array change

---

## Practice Problems

### Problem 1: Range Minimum Query

**Problem:** [LeetCode 303 - Range Sum Query - Immutable](https://leetcode.com/problems/range-sum-query-immutable/) (Use for RMQ practice)

**Description:** Given an integer array `nums`, handle multiple queries of the following type: Calculate the sum of the elements of `nums` between indices `left` and `right` inclusive where `left <= right`.

**How to Apply Sparse Table:**
- Build Sparse Table for range minimum (or use prefix sum for sum)
- Answer each query in O(1) time
- Demonstrates the power of preprocessing for range queries

---

### Problem 2: Sliding Window Maximum

**Problem:** [LeetCode 239 - Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/)

**Description:** You are given an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left of the array to the very right. You can only see the `k` numbers in the window. Each time the sliding window moves right by one position. Return the max sliding window.

**How to Apply Sparse Table:**
- Build Sparse Table for maximum queries
- For each window position, query max in O(1)
- Alternative to monotonic deque for static arrays

---

### Problem 3: Range GCD Queries

**Problem:** [LeetCode 1707 - Maximum XOR With an Element From Array](https://leetcode.com/problems/maximum-xor-with-an-element-from-array/) (Similar concept)

**Description:** You are given an array `nums` consisting of non-negative integers. You are also given a array `queries`, where `queries[i] = [xi, mi]`. The answer to the i-th query is the maximum bitwise XOR value of xi and any element of nums that does not exceed mi. If all elements in nums are larger than mi, then the answer is -1.

**How to Apply Sparse Table:**
- Adapt to range GCD queries
- Sort queries and use binary search with Sparse Table
- Efficiently answer multiple range queries

---

### Problem 4: Largest Rectangle in Histogram

**Problem:** [LeetCode 84 - Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/)

**Description:** Given an array of integers `heights` representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.

**How to Apply Sparse Table:**
- Use RMQ to find minimum in any range in O(1)
- Divide and conquer approach with O(n log n) using Sparse Table
- Alternative to stack-based O(n) solution

---

### Problem 5: Minimum Size Subarray Sum

**Problem:** [LeetCode 209 - Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/)

**Description:** Given an array of positive integers `nums` and a positive integer `target`, return the minimal length of a contiguous subarray whose sum is at least `target`. If there is no such subarray, return 0 instead.

**How to Apply Sparse Table:**
- Build prefix sum array
- Use Sparse Table on prefix sums for range queries
- Binary search on subarray length with RMQ

---

## Video Tutorial Links

### Fundamentals

- [Sparse Table - Introduction (Take U Forward)](https://www.youtube.com/watch?v=2F4r0N2u4vU)
- [Sparse Table Implementation (WilliamFiset)](https://www.youtube.com/watch?v=zb72gK9jGNY)
- [Range Minimum Query (NeetCode)](https://www.youtube.com/watch?v=2W2y2X8X7Qw)

### Advanced Topics

- [2D Sparse Table](https://www.youtube.com/watch?v=xuoQq4f3-Js)
- [Sparse Table vs Segment Tree](https://www.youtube.com/watch?v=v0dJ4x4Y4cM)
- [GCD Sparse Table](https://www.youtube.com/watch?v=3aVPh70xT3M)

### Competitive Programming

- [Range Queries in CP (Codeforces)](https://www.youtube.com/watch?v=9trI0mriUyI)
- [Static Range Queries](https://www.youtube.com/watch?v=Kkmv2e30HWs)

---

## Follow-up Questions

### Q1: What operations can Sparse Table support besides min and max?

**Answer:** Sparse Table can support any **idempotent and associative** operation:
- **Min/Max**: Always works
- **GCD/LCM**: Works because `gcd(a,a) = a` and gcd is associative
- **Bitwise AND/OR**: Works because `a&a=a` and `a|a=a`
- **NOT Sum/Product**: These are not idempotent (`a+a ≠ a`)

### Q2: Can Sparse Table handle range sum queries?

**Answer:** No. Sum is not idempotent because `sum(a, a) = 2a ≠ a`. The two-interval trick doesn't work for sum because overlapping regions would be counted twice. Use **Prefix Sum** for O(1) sum queries on static arrays.

### Q3: What is the maximum array size Sparse Table can handle?

**Answer:** With O(n log n) space:
- **Memory limited**: ~10^7 elements with 4GB RAM
- **Time**: Build takes O(n log n), practical up to ~10^6 elements
- For larger datasets, consider segment tree or external memory approaches

### Q4: How does Sparse Table compare to segment tree in practice?

**Answer:**
- **Query time**: Sparse Table wins (O(1) vs O(log n))
- **Update time**: Sparse Table loses (requires rebuild)
- **Space**: Sparse Table uses more (O(n log n) vs O(n))
- **Choice**: Use Sparse Table for static arrays with many queries; segment tree for dynamic data

### Q5: Can Sparse Table be used for finding the k-th smallest element in a range?

**Answer:** Not directly. Sparse Table is designed for idempotent operations where the result can be computed from two overlapping ranges. Finding the k-th smallest requires more complex data structures like:
- **Merge Sort Tree** (segment tree with sorted vectors)
- **Wavelet Tree**
- **Persistent Segment Tree**

---

## Summary

The Sparse Table is a powerful data structure for **static arrays** requiring **fast range queries** with **idempotent operations**.

**Key Takeaways:**
- **Build once**: O(n log n) preprocessing, then O(1) queries
- **O(1) query time**: Major advantage over segment tree
- **Limited operations**: Only works for idempotent operations (min, max, GCD)
- **No updates**: Array must be completely static
- **Space tradeoff**: Uses more memory but provides faster queries

**When to use:**
- ✅ Static arrays with many min/max/GCD queries
- ✅ When O(1) query time is critical
- ❌ When array elements change
- ❌ For sum/product queries

This data structure is essential for competitive programming and technical interviews, especially in problems involving range minimum/maximum queries on static data.
