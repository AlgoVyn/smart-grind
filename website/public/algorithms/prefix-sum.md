# Prefix Sum

## Category
Arrays & Strings

## Description

Prefix Sum is a fundamental technique that enables **O(1) range query time** after **O(n)** preprocessing for sum operations on static arrays. Instead of summing elements for each query (which costs O(n) per query), we precompute cumulative sums once and answer any range sum query in constant time.

This makes it ideal for scenarios where the array never changes but many range sum queries need to be answered quickly. The technique is widely used in competitive programming, data analysis, and database systems for efficient aggregation queries.

---

## Concepts

### 1. Cumulative Sum Array

The foundation of prefix sums:

| Index | Array | Prefix Sum | Meaning |
|-------|-------|------------|---------|
| 0 | 2 | 0 | Empty prefix (dummy) |
| 0 | 2 | 2 | Sum of first 1 element |
| 1 | 4 | 6 | Sum of first 2 elements |
| 2 | 1 | 7 | Sum of first 3 elements |
| 3 | 5 | 12 | Sum of first 4 elements |
| 4 | 3 | 15 | Sum of first 5 elements |

### 2. Range Query Formula

The key insight that enables O(1) queries:

```
sum(left, right) = prefix[right + 1] - prefix[left]
```

Mathematical proof:
- `prefix[right + 1]` = arr[0] + arr[1] + ... + arr[right]
- `prefix[left]` = arr[0] + arr[1] + ... + arr[left-1]
- Difference = arr[left] + ... + arr[right]

### 3. 2D Extension (Inclusion-Exclusion)

For matrix range queries:

```
sum(r1, c1, r2, c2) = prefix[r2+1][c2+1] 
                     - prefix[r1][c2+1] 
                     - prefix[r2+1][c1] 
                     + prefix[r1][c1]
```

### 4. Associative Operations

Prefix sum works with any associative operation:

| Operation | Works | Notes |
|-----------|-------|-------|
| Addition | ✅ Yes | Standard prefix sum |
| XOR | ✅ Yes | a ^ a = 0 |
| Product | ✅ Yes | Watch for overflow |
| Minimum | ❌ No | Not invertible |

---

## Frameworks

### Framework 1: 1D Prefix Sum

```
┌─────────────────────────────────────────────────────┐
│  1D PREFIX SUM FRAMEWORK                            │
├─────────────────────────────────────────────────────┤
│  1. Initialize prefix array of size n+1            │
│  2. Set prefix[0] = 0 (dummy for easier math)        │
│  3. For i from 0 to n-1:                           │
│     prefix[i+1] = prefix[i] + arr[i]               │
│  4. To query [L, R]:                               │
│     return prefix[R+1] - prefix[L]                 │
└─────────────────────────────────────────────────────┘
```

**When to use**: Static arrays with many range sum queries

### Framework 2: 2D Prefix Sum

```
┌─────────────────────────────────────────────────────┐
│  2D PREFIX SUM FRAMEWORK                            │
├─────────────────────────────────────────────────────┤
│  1. Create (m+1) × (n+1) prefix matrix             │
│  2. Initialize first row and column to 0             │
│  3. For each cell (i, j):                           │
│     prefix[i+1][j+1] = arr[i][j]                  │
│              + prefix[i][j+1]                      │
│              + prefix[i+1][j]                      │
│              - prefix[i][j]                       │
│  4. Query using inclusion-exclusion               │
└─────────────────────────────────────────────────────┘
```

**When to use**: Matrix range sum queries

### Framework 3: Difference Array (Inverse)

```
┌─────────────────────────────────────────────────────┐
│  DIFFERENCE ARRAY FRAMEWORK                         │
├─────────────────────────────────────────────────────┤
│  1. Create diff array where diff[i] = arr[i] -    │
│     arr[i-1]                                       │
│  2. Range update [L, R] by val:                   │
│     diff[L] += val                                 │
│     diff[R+1] -= val (if R+1 < n)                 │
│  3. Convert back to array via prefix sum          │
└─────────────────────────────────────────────────────┘
```

**When to use**: Many range updates, few point queries

---

## Forms

### Form 1: Standard 1D Prefix Sum

For single-dimensional range queries.

| Array | Prefix | Query [1,3] |
|-------|--------|-------------|
| [2,4,1,5,3] | [0,2,6,7,12,15] | 12-2 = 10 |

### Form 2: 2D Matrix Prefix Sum

For rectangular region queries.

```
Matrix:          Prefix (conceptual):
[1, 2, 3]        [0, 0,  0,  0]
[4, 5, 6]   →    [0, 1,  3,  6]
[7, 8, 9]        [0, 5, 12, 21]
                 [0,12, 27, 45]

Query [0,0] to [1,1]: 1+2+4+5 = 12
```

### Form 3: Prefix XOR

For range XOR queries.

| Array | Prefix XOR | Query [1,3] |
|-------|------------|-------------|
| [1,2,3,4,5] | [0,1,3,0,4,1] | 0^3 = 3 |

### Form 4: Rolling Hash (String)

For O(1) substring hash comparisons.

```python
# Hash of substring [l, r]:
hash = prefix[r+1] - prefix[l] * base^(r-l+1)
```

### Form 5: Weighted/Multiplicative Prefix

For product or other operations.

| Type | Formula |
|------|---------|
| Product | `prod[l,r] = prefix[r+1] / prefix[l]` |
| GCD | Requires Sparse Table (not invertible) |

---

## Tactics

### Tactic 1: Subarray Sum Equals K

Use prefix sum with hashmap:

```python
from collections import defaultdict

def subarray_sum_equals_k(arr: list[int], k: int) -> int:
    """Count subarrays with sum exactly k."""
    prefix_count = defaultdict(int)
    prefix_count[0] = 1  # Empty prefix
    
    prefix_sum = 0
    count = 0
    
    for num in arr:
        prefix_sum += num
        # If prefix_sum - k exists, those subarrays have sum k
        count += prefix_count[prefix_sum - k]
        prefix_count[prefix_sum] += 1
    
    return count
```

### Tactic 2: Maximum Size Subarray Sum Equals K

Track earliest occurrence of each prefix sum:

```python
def max_subarray_sum_equals_k(arr: list[int], k: int) -> int:
    """Maximum length subarray with sum k."""
    prefix_index = {0: -1}  # prefix_sum -> earliest index
    prefix_sum = 0
    max_len = 0
    
    for i, num in enumerate(arr):
        prefix_sum += num
        
        if prefix_sum - k in prefix_index:
            max_len = max(max_len, i - prefix_index[prefix_sum - k])
        
        # Only store first occurrence for maximum length
        if prefix_sum not in prefix_index:
            prefix_index[prefix_sum] = i
    
    return max_len
```

### Tactic 3: Product of Array Except Self

Use prefix and suffix products:

```python
def product_except_self(nums: list[int]) -> list[int]:
    """Product of all elements except self without division."""
    n = len(nums)
    result = [1] * n
    
    # Prefix products
    prefix = 1
    for i in range(n):
        result[i] = prefix
        prefix *= nums[i]
    
    # Suffix products
    suffix = 1
    for i in range(n-1, -1, -1):
        result[i] *= suffix
        suffix *= nums[i]
    
    return result
```

### Tactic 4: Range Frequency Queries

Use prefix frequency maps:

```python
from collections import defaultdict

def range_frequency_queries(arr: list[int], queries: list[tuple]) -> list[int]:
    """Answer queries about frequency of values in ranges."""
    n = len(arr)
    # prefix_freq[i] = frequency map of arr[0:i]
    prefix_freq = [defaultdict(int) for _ in range(n + 1)]
    
    for i in range(n):
        prefix_freq[i+1] = prefix_freq[i].copy()
        prefix_freq[i+1][arr[i]] += 1
    
    results = []
    for left, right, value in queries:
        freq = prefix_freq[right+1][value] - prefix_freq[left][value]
        results.append(freq)
    
    return results
```

### Tactic 5: Dynamic Range Updates (Difference Array)

For O(1) range updates:

```python
class DifferenceArray:
    """O(1) range updates, O(n) final array construction."""
    
    def __init__(self, n: int):
        self.n = n
        self.diff = [0] * (n + 1)
    
    def range_add(self, left: int, right: int, val: int):
        """Add val to all elements in [left, right]."""
        self.diff[left] += val
        if right + 1 < self.n:
            self.diff[right + 1] -= val
    
    def build(self) -> list[int]:
        """Convert back to array."""
        arr = [0] * self.n
        arr[0] = self.diff[0]
        for i in range(1, self.n):
            arr[i] = arr[i-1] + self.diff[i]
        return arr
```

---

## Python Templates

### Template 1: 1D Prefix Sum Class

```python
from typing import List

class PrefixSum:
    """
    1D Prefix Sum for Range Sum Queries on static arrays.
    
    Time: Build O(n), Query O(1)
    Space: O(n)
    """
    
    def __init__(self, nums: List[int]):
        """Initialize the Prefix Sum array."""
        if not nums:
            self.n = 0
            self.prefix = [0]
            return
        
        self.n = len(nums)
        # prefix[i] = sum of nums[0:i] (first i elements)
        self.prefix = [0] * (self.n + 1)
        
        for i in range(self.n):
            self.prefix[i + 1] = self.prefix[i] + nums[i]
    
    def query(self, left: int, right: int) -> int:
        """Query sum of elements in range [left, right] (inclusive)."""
        if left < 0 or right >= self.n or left > right:
            raise ValueError(f"Invalid range: [{left}, {right}]")
        
        return self.prefix[right + 1] - self.prefix[left]
    
    def total_sum(self) -> int:
        """Get sum of all elements."""
        return self.prefix[self.n]
```

### Template 2: 2D Prefix Sum Class

```python
from typing import List

class PrefixSum2D:
    """
    2D Prefix Sum for Matrix Range Sum Queries.
    
    Time: Build O(m*n), Query O(1)
    Space: O(m*n)
    """
    
    def __init__(self, matrix: List[List[int]]):
        if not matrix or not matrix[0]:
            self.m = self.n = 0
            self.prefix = [[0]]
            return
        
        self.m = len(matrix)
        self.n = len(matrix[0])
        
        # prefix[i][j] = sum of rectangle (0,0) to (i-1, j-1)
        self.prefix = [[0] * (self.n + 1) for _ in range(self.m + 1)]
        
        for i in range(self.m):
            for j in range(self.n):
                # Inclusion-exclusion principle
                self.prefix[i + 1][j + 1] = (
                    matrix[i][j]
                    + self.prefix[i][j + 1]
                    + self.prefix[i + 1][j]
                    - self.prefix[i][j]
                )
    
    def query(self, row1: int, col1: int, row2: int, col2: int) -> int:
        """Query sum of rectangle from (row1, col1) to (row2, col2)."""
        return (
            self.prefix[row2 + 1][col2 + 1]
            - self.prefix[row1][col2 + 1]
            - self.prefix[row2 + 1][col1]
            + self.prefix[row1][col1]
        )
```

### Template 3: Subarray Sum Equals K

```python
from collections import defaultdict
from typing import List

def subarray_sum_equals_k(arr: List[int], k: int) -> int:
    """
    Count subarrays with sum exactly k.
    Time: O(n), Space: O(n)
    """
    prefix_count = defaultdict(int)
    prefix_count[0] = 1  # Empty prefix
    
    prefix_sum = 0
    count = 0
    
    for num in arr:
        prefix_sum += num
        # If prefix_sum - k exists, those subarrays have sum k
        count += prefix_count[prefix_sum - k]
        prefix_count[prefix_sum] += 1
    
    return count
```

### Template 4: Maximum Size Subarray Sum Equals K

```python
from typing import List

def max_subarray_sum_equals_k(arr: List[int], k: int) -> int:
    """
    Maximum length subarray with sum k.
    Time: O(n), Space: O(n)
    """
    prefix_index = {0: -1}  # prefix_sum -> earliest index
    prefix_sum = 0
    max_len = 0
    
    for i, num in enumerate(arr):
        prefix_sum += num
        
        if prefix_sum - k in prefix_index:
            max_len = max(max_len, i - prefix_index[prefix_sum - k])
        
        # Store only first occurrence for max length
        if prefix_sum not in prefix_index:
            prefix_index[prefix_sum] = i
    
    return max_len
```

### Template 5: Product of Array Except Self

```python
from typing import List

def product_except_self(nums: List[int]) -> List[int]:
    """
    Product of all elements except self.
    Uses prefix and suffix products.
    Time: O(n), Space: O(1) excluding output
    """
    n = len(nums)
    result = [1] * n
    
    # Prefix products
    prefix = 1
    for i in range(n):
        result[i] = prefix
        prefix *= nums[i]
    
    # Suffix products
    suffix = 1
    for i in range(n - 1, -1, -1):
        result[i] *= suffix
        suffix *= nums[i]
    
    return result
```

### Template 6: Prefix XOR Class

```python
from typing import List

class PrefixXOR:
    """Prefix XOR for Range XOR Queries."""
    
    def __init__(self, nums: List[int]):
        self.n = len(nums)
        self.prefix = [0] * (self.n + 1)
        
        for i in range(self.n):
            self.prefix[i + 1] = self.prefix[i] ^ nums[i]
    
    def query(self, left: int, right: int) -> int:
        """XOR of elements in range [left, right]."""
        return self.prefix[right + 1] ^ self.prefix[left]
```

---

## When to Use

Use the Prefix Sum algorithm when you need to solve problems involving:

- **Static Arrays**: When the array elements don't change after initialization
- **Many Range Queries**: When you need to answer a large number of range sum queries
- **Fast Query Time**: When O(1) query time is critical and preprocessing time is acceptable
- **Subarray Problems**: When the problem involves finding subarray sums, averages, or counts within ranges

### Comparison with Alternatives

| Data Structure | Build Time | Query Time | Update Time | Supports Dynamic Updates |
|----------------|------------|------------|-------------|--------------------------|
| **Prefix Sum** | O(n) | O(1) | O(n) | ❌ No |
| **Sparse Table** | O(n log n) | O(1) | O(n log n) | ❌ No (for idempotent ops only) |
| **Segment Tree** | O(n) | O(log n) | O(log n) | ✅ Yes |
| **Fenwick Tree** | O(n) | O(log n) | O(log n) | ✅ Yes (limited) |

### When to Choose Prefix Sum vs Segment Tree

- **Choose Prefix Sum** when:
  - The array is completely static (no updates)
  - You need O(1) query time
  - You're only doing sum operations (not min/max)

- **Choose Segment Tree** when:
  - The array may be updated
  - You need to query different operations (min, max, sum)
  - You're okay with O(log n) query time

---

## Algorithm Explanation

### Core Concept

The key insight behind Prefix Sum is that any subarray sum can be computed by comparing two cumulative sums. By precomputing the sum of all elements from the start to each index, we can answer any range sum query in O(1) by subtracting two prefix values.

### How It Works

#### Preprocessing Phase:
- `prefix[i]` = sum of all elements from index 0 to i-1 (inclusive)
- Build using: `prefix[i] = prefix[i-1] + arr[i-1]`
- Note: We typically use a dummy prefix[0] = 0 for easier calculations

#### Query Phase:
For a range `[L, R]` (inclusive):
1. The answer is `prefix[R + 1] - prefix[L]`
2. This works because:
   - `prefix[R + 1]` = arr[0] + arr[1] + ... + arr[R]
   - `prefix[L]` = arr[0] + arr[1] + ... + arr[L-1]
   - Difference = arr[L] + arr[L+1] + ... + arr[R]

### Visual Representation

For array `[2, 4, 1, 5, 3]`:

```
Index:        0    1    2    3    4
Array:       [2,   4,   1,   5,   3]

Prefix:    0  [2,   6,   7,  12,  15]
            ↑   ↑    ↑    ↑    ↑    ↑
           idx 0   1    2    3    4   5

Query: range_sum(1, 3)
prefix[4] - prefix[1] = 12 - 2 = 10 ✓
(elements: 4 + 1 + 5 = 10)
```

### Why It Works

The mathematical proof is straightforward:
- `prefix[r + 1]` = Σ(arr[0] to arr[r])
- `prefix[l]` = Σ(arr[0] to arr[l-1])
- `prefix[r + 1] - prefix[l]` = Σ(arr[l] to arr[r])

The key property is that subtraction "cancels out" the common prefix, leaving only the desired range.

### Limitations

- **Only works for static arrays**: Array must not change between queries
- **Only supports sum operations**: For min/max, use Sparse Table or Segment Tree
- **Higher space complexity**: O(n) additional space required
- **Not suitable for dynamic data**: Any change requires rebuilding the prefix array
- **Integer overflow**: Very large arrays may need 64-bit integers

---

## Practice Problems

### Problem 1: Range Sum Query - Immutable

**Problem:** [LeetCode 303 - Range Sum Query - Immutable](https://leetcode.com/problems/range-sum-query-immutable/)

**Description:** Given an integer array `nums`, find the sum of the elements between indices `left` and `right` inclusive.

**How to Apply Prefix Sum:**
- Precompute prefix sums in constructor
- Answer each query in O(1) using `prefix[right + 1] - prefix[left]`
- This is the classic use case for prefix sum

---

### Problem 2: Range Sum Query 2D - Immutable

**Problem:** [LeetCode 304 - Range Sum Query 2D - Immutable](https://leetcode.com/problems/range-sum-query-2d-immutable/)

**Description:** Given a 2D matrix, find the sum of the elements inside the rectangle defined by its upper left corner `(row1, col1)` and lower right corner `(row2, col2)`.

**How to Apply Prefix Sum:**
- Build 2D prefix sum using inclusion-exclusion
- Answer each query in O(1)
- Essential for multiple rectangle sum queries on static matrices

---

### Problem 3: Subarray Sum Equals K

**Problem:** [LeetCode 560 - Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/)

**Description:** Given an array of integers `nums` and an integer `k`, return the total number of continuous subarrays whose sum equals `k`.

**How to Apply Prefix Sum:**
- Use prefix sum with hashmap to count subarrays with sum k
- For each prefix sum, check if (prefix - k) exists in hashmap
- This transforms O(n²) brute force to O(n)

---

### Problem 4: Product of Array Except Self

**Problem:** [LeetCode 238 - Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/)

**Description:** Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.

**How to Apply Prefix Sum Concept:**
- Use prefix product concept (similar to prefix sum)
- Build prefix products from left and suffix products from right
- answer[i] = prefixProd[i-1] * suffixProd[i+1]

---

### Problem 5: Maximum Size Subarray Sum Equals K

**Problem:** [LeetCode 325 - Maximum Size Subarray Sum Equals K](https://leetcode.com/problems/maximum-size-subarray-sum-equals-k/)

**Description:** Given an integer array `nums` and an integer `k`, return the maximum length of a subarray that sums to `k`.

**How to Apply Prefix Sum:**
- Use prefix sum with hashmap storing earliest index
- When prefix[i] - k exists, subarray from that index + 1 to i sums to k
- Track maximum length found

---

## Video Tutorial Links

### Fundamentals

- [Prefix Sum Introduction (Take U Forward)](https://www.youtube.com/watch?v=4R1LfkA3jX4) - Comprehensive introduction
- [Prefix Sum Implementation (WilliamFiset)](https://www.youtube.com/watch?v=8jI4GcjBfM8) - Detailed explanation with visualizations
- [Range Sum Query (LeetCode)](https://www.youtube.com/watch?v=8M5h2eKHGgQ) - Practical implementation

### Advanced Topics

- [2D Prefix Sum](https://www.youtube.com/watch?v=J1w2NfYmQfM) - 2D range queries
- [Difference Array](https://www.youtube.com/watch?v=nQMYSyHGKDQ) - Range updates
- [Prefix Sum Variations](https://www.youtube.com/watch?v=6X7fM8G94zI) - XOR, min, max variations

### Problem-Specific

- [Subarray Sum Equals K](https://www.youtube.com/watch?v=fFVZtDKB8-8) - Hashmap + prefix sum
- [Product Except Self](https://www.youtube.com/watch?v=bNvIQI2wAjk) - Prefix/suffix technique

---

## Follow-up Questions

### Q1: What operations can Prefix Sum support besides sum?

**Answer:** Prefix Sum can support any **associative** operation:
- **Sum**: Always works (a + b = b + a, (a + b) + c = a + (b + c))
- **XOR**: Works because a ^ a = 0 and XOR is associative
- **Product**: Works (but watch for overflow)
- **NOT min/max**: Prefix min/max doesn't give range min/max (use Sparse Table)

---

### Q2: Can Prefix Sum handle range minimum queries?

**Answer:** No, Prefix Sum cannot efficiently handle range minimum queries because:
- Minimum is not invertible: knowing sum(l,r) doesn't help find min(l,r)
- Use **Sparse Table** for O(1) min queries on static arrays
- Use **Segment Tree** for dynamic min queries

---

### Q3: What is the maximum array size Prefix Sum can handle?

**Answer:** With O(n) space, typical limits are:
- **Memory**: ~800MB → ~10⁸ elements (using 8-byte longs)
- **Time**: Build takes O(n) → practical up to ~10⁸ elements
- For larger datasets, consider streaming or external memory approaches

---

### Q4: How do you handle updates in Prefix Sum?

**Answer:** Prefix Sum **does not support efficient updates**. Options:
1. **Rebuild entire prefix**: O(n) per update - not practical for frequent updates
2. **Use Fenwick Tree instead**: O(log n) per query and update
3. **Use Segment Tree**: O(log n) for both query and update

---

### Q5: How does Prefix Sum compare to 2D Sparse Table?

**Answer:**
- **Query time**: Both O(1) for sum operations
- **Space**: Both O(n) or O(m×n)
- **Operations**: Prefix Sum only for sums; Sparse Table for idempotent ops
- **Choice**: Use Prefix Sum for sums; Sparse Table for min/max/GCD

---

## Summary

The Prefix Sum is a fundamental and powerful data structure for **static arrays** requiring **fast range sum queries**. Key takeaways:

- **Build once**: O(n) preprocessing, then O(1) queries
- **O(1) query time**: Major advantage over segment tree for sums
- **Simple implementation**: Just cumulative sums in an array
- **Versatile variations**: 2D, XOR, difference array, rolling hash
- **Space efficient**: O(n) vs O(n log n) for sparse table

When to use:
- ✅ Static arrays with many range sum queries
- ✅ When O(1) query time is critical
- ✅ 2D matrix range queries
- ✅ Problems involving subarray sums
- ❌ When array elements change (use Fenwick/Segment Tree)
- ❌ For min/max queries (use Sparse Table or Segment Tree)

This technique is essential for competitive programming and technical interviews, especially in problems involving range queries, subarray problems, and cumulative calculations.

---

## Related Algorithms

- [Sparse Table](./sparse-table.md) - O(1) range min/max queries
- [Segment Tree](./segment-tree.md) - Dynamic range queries
- [Fenwick Tree](./fenwick-tree.md) - Dynamic prefix sums with updates
- [Difference Array](./difference-array.md) - Range updates, point queries
