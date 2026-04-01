# Longest Increasing Subsequence

## Category
Dynamic Programming

## Description

The Longest Increasing Subsequence (LIS) problem finds the length of the longest subsequence where all elements are in strictly increasing order. A **subsequence** maintains relative order but elements don't need to be contiguous.

The key insight is using binary search to achieve O(n log n) time complexity instead of the naive O(n²) dynamic programming approach. The algorithm maintains a sorted list of the smallest possible tail values for increasing subsequences of different lengths, allowing efficient lookups through binary search.

This technique is fundamental in competitive programming and appears frequently in problems involving sequences, envelope nesting, patience sorting, and optimization with increasing order constraints.

---

## Concepts

### 1. Subsequence vs Substring

Understanding the distinction is critical for solving LIS problems:

| Concept | Definition | Example (in [10, 9, 2, 5, 3]) |
|---------|------------|------------------------------|
| **Subsequence** | Elements in relative order, not necessarily contiguous | [10, 2, 3] or [9, 5] |
| **Substring** | Contiguous elements | [9, 2, 5] only |

### 2. Tails Array

The core data structure for the efficient O(n log n) solution:

- `tails[i]` = smallest possible tail value for an increasing subsequence of length `i+1`
- The tails array is always sorted (enabling binary search)
- Each position represents the minimum tail for that subsequence length

### 3. Binary Search Positioning

For each element, determine its position in the tails array:

| Operation | Binary Search Type | When to Use |
|-----------|-------------------|-------------|
| **Strictly Increasing** | `bisect_left` (first ≥) | Elements must be strictly greater |
| **Non-decreasing** | `bisect_right` (first >) | Equal elements allowed |

### 4. Optimal Substructure

The LIS problem exhibits optimal substructure:
- If we know the LIS ending at position `i`, we can extend it for position `i+1`
- The optimal solution can be built from optimal solutions to subproblems

---

## Frameworks

### Framework 1: Binary Search + Tails (O(n log n))

```
┌─────────────────────────────────────────────────────┐
│  LIS BINARY SEARCH FRAMEWORK                        │
├─────────────────────────────────────────────────────┤
│  1. Initialize empty tails array                     │
│  2. For each element in input array:               │
│     a. Binary search for position in tails        │
│     b. If position == len(tails):                 │
│        - Append element (found longer LIS)         │
│     c. Else:                                       │
│        - Replace at position (smaller tail)        │
│  3. Return length of tails array                   │
└─────────────────────────────────────────────────────┘
```

**When to use**: Need only the length, array size is large (n > 10⁴)

### Framework 2: Naive DP (O(n²))

```
┌─────────────────────────────────────────────────────┐
│  LIS NAIVE DP FRAMEWORK                             │
├─────────────────────────────────────────────────────┤
│  1. Initialize dp array with 1s (each element      │
│     is a subsequence of length 1)                  │
│  2. For each i from 1 to n-1:                     │
│     a. For each j from 0 to i-1:                  │
│        - If nums[j] < nums[i]:                    │
│          dp[i] = max(dp[i], dp[j] + 1)            │
│  3. Return max value in dp array                   │
└─────────────────────────────────────────────────────┘
```

**When to use**: Need to reconstruct the actual sequence, small arrays

### Framework 3: Reconstruction with Binary Search

```
┌─────────────────────────────────────────────────────┐
│  LIS RECONSTRUCTION FRAMEWORK                       │
├─────────────────────────────────────────────────────┤
│  1. Initialize tails array and tracking arrays:  │
│     - prev[i] = predecessor index for nums[i]      │
│     - indices[i] = position of nums[i] in tails   │
│  2. For each element, perform binary search        │
│  3. Track predecessor relationships                │
│  4. After processing, backtrack from end:          │
│     - Find last element (largest index value)     │
│     - Follow prev pointers to reconstruct         │
└─────────────────────────────────────────────────────┘
```

**When to use**: Need both length and the actual LIS sequence

---

## Forms

### Form 1: Standard LIS (Strictly Increasing)

Find the longest subsequence where each element is strictly greater than the previous.

| Example | Array | LIS | Length |
|---------|-------|-----|--------|
| Basic | [10, 9, 2, 5, 3, 7, 101, 18] | [2, 3, 7, 18] | 4 |
| Duplicates | [0, 1, 0, 3, 2, 3] | [0, 1, 2, 3] | 4 |
| All Same | [7, 7, 7, 7, 7] | [7] | 1 |

### Form 2: Longest Non-Decreasing Subsequence (LNDS)

Elements can be equal or greater. Use `bisect_right` instead of `bisect_left`.

| Array | LNDS | Length |
|-------|------|--------|
| [1, 1, 1, 1] | [1, 1, 1, 1] | 4 |
| [1, 2, 2, 3] | [1, 2, 2, 3] | 4 |

### Form 3: Longest Decreasing Subsequence (LDS)

Reverse the array or negate values, then apply LIS.

```
Approach 1: Reverse array → Find LIS
Approach 2: Negate values → Find LIS
```

### Form 4: 2D LIS (Russian Doll Envelopes)

Sort by one dimension, find LIS on the other dimension with special handling.

```
Sort: By width ascending, height descending
Then: Find LIS on heights
```

### Form 5: Count of LIS

Track both length and count of longest subsequences.

| State | Meaning |
|-------|---------|
| `length[i]` | Length of LIS ending at i |
| `count[i]` | Number of LIS of that length ending at i |

---

## Tactics

### Tactic 1: Binary Search Optimization

Replace the O(n) scan with O(log n) binary search:

```python
import bisect

def length_of_lis_optimized(nums: list[int]) -> int:
    """O(n log n) solution using binary search."""
    tails = []
    for num in nums:
        pos = bisect.bisect_left(tails, num)
        if pos == len(tails):
            tails.append(num)
        else:
            tails[pos] = num
    return len(tails)
```

### Tactic 2: Patience Sorting Visualization

The LIS algorithm is equivalent to the card game patience sorting:

```
Processing [10, 9, 2, 5, 3, 7, 101, 18]:

Pile 1:  [10] → [9] → [2]
Pile 2:             [5] → [3]
Pile 3:                   [7]
Pile 4:                         [101] → [18]

Number of piles = LIS length = 4
```

### Tactic 3: Coordinate Compression for Large Values

When values are large but n is small:

```python
def length_of_lis_compressed(nums: list[int]) -> int:
    """For when values are very large."""
    # Compress coordinates
    sorted_unique = sorted(set(nums))
    rank = {v: i for i, v in enumerate(sorted_unique)}
    
    # Now work with ranks instead of values
    compressed = [rank[x] for x in nums]
    return length_of_lis(compressed)
```

### Tactic 4: Segment Tree Alternative

For problems requiring range queries on LIS:

```python
class SegmentTreeLIS:
    """O(n log n) with ability to query any range."""
    def __init__(self, size):
        self.n = size
        self.tree = [0] * (4 * size)
    
    def query(self, left, right):
        """Query max LIS length in range."""
        pass  # Implementation depends on specific problem
    
    def update(self, index, value):
        """Update LIS length at index."""
        pass
```

### Tactic 5: Fenwick Tree with Coordinate Compression

Combines compression with efficient queries:

```python
class FenwickTree:
    def __init__(self, size):
        self.n = size
        self.tree = [0] * (size + 1)
    
    def update(self, index, value):
        while index <= self.n:
            self.tree[index] = max(self.tree[index], value)
            index += index & -index
    
    def query(self, index):
        """Max in range [1, index]."""
        result = 0
        while index > 0:
            result = max(result, self.tree[index])
            index -= index & -index
        return result
```

---

## Python Templates

### Template 1: Basic LIS Length (Binary Search)

```python
import bisect
from typing import List

def length_of_lis(nums: List[int]) -> int:
    """
    Find LIS length using binary search - O(n log n).
    Returns length only, not the actual sequence.
    """
    if not nums:
        return 0
    
    tails = []  # tails[i] = smallest tail for LIS of length i+1
    
    for num in nums:
        pos = bisect.bisect_left(tails, num)
        
        if pos == len(tails):
            tails.append(num)
        else:
            tails[pos] = num
    
    return len(tails)
```

### Template 2: LIS with Reconstruction

```python
import bisect
from typing import List, Tuple

def length_of_lis_with_sequence(nums: List[int]) -> Tuple[int, List[int]]:
    """
    Find LIS length and one actual LIS sequence.
    Time: O(n log n), Space: O(n)
    """
    if not nums:
        return 0, []
    
    n = len(nums)
    tails = []  # Smallest tail for each length
    prev = [-1] * n  # Predecessor index
    indices = [-1] * n  # Position in tails for each element
    tail_indices = []  # Index of tail element
    
    for i, num in enumerate(nums):
        pos = bisect.bisect_left(tails, num)
        
        if pos == len(tails):
            tails.append(num)
            tail_indices.append(i)
        else:
            tails[pos] = num
            tail_indices[pos] = i
        
        indices[i] = pos
        
        if pos > 0:
            prev[i] = tail_indices[pos - 1]
    
    # Reconstruct sequence
    lis = []
    curr = tail_indices[-1]
    while curr != -1:
        lis.append(nums[curr])
        curr = prev[curr]
    
    return len(tails), lis[::-1]
```

### Template 3: Longest Non-Decreasing Subsequence

```python
import bisect
from typing import List

def length_of_lnds(nums: List[int]) -> int:
    """
    Longest Non-Decreasing Subsequence.
    Allows equal elements (use bisect_right instead of left).
    """
    if not nums:
        return 0
    
    tails = []
    
    for num in nums:
        pos = bisect.bisect_right(tails, num)  # Note: bisect_right
        
        if pos == len(tails):
            tails.append(num)
        else:
            tails[pos] = num
    
    return len(tails)
```

### Template 4: Number of Longest Increasing Subsequences

```python
from typing import List

def number_of_lis(nums: List[int]) -> int:
    """
    Count the number of longest increasing subsequences.
    Time: O(n²), Space: O(n)
    """
    if not nums:
        return 0
    
    n = len(nums)
    length = [1] * n  # length[i] = LIS ending at i
    count = [1] * n   # count[i] = number of LIS ending at i
    
    for i in range(n):
        for j in range(i):
            if nums[j] < nums[i]:
                if length[j] + 1 > length[i]:
                    length[i] = length[j] + 1
                    count[i] = count[j]
                elif length[j] + 1 == length[i]:
                    count[i] += count[j]
    
    max_length = max(length)
    return sum(c for l, c in zip(length, count) if l == max_length)
```

### Template 5: Russian Doll Envelopes (2D LIS)

```python
from typing import List
import bisect

def max_envelopes(envelopes: List[List[int]]) -> int:
    """
    Russian Doll Envelopes - 2D LIS problem.
    Sort by width ascending, height descending, then find LIS on heights.
    """
    if not envelopes:
        return 0
    
    # Sort: width ascending, height descending for same width
    envelopes.sort(key=lambda x: (x[0], -x[1]))
    
    # Find LIS on heights
    tails = []
    for _, height in envelopes:
        pos = bisect.bisect_left(tails, height)
        
        if pos == len(tails):
            tails.append(height)
        else:
            tails[pos] = height
    
    return len(tails)
```

### Template 6: Longest Bitonic Subsequence

```python
from typing import List

def longest_bitonic_subsequence(nums: List[int]) -> int:
    """
    Longest subsequence that increases then decreases.
    Time: O(n²), Space: O(n)
    """
    if not nums:
        return 0
    
    n = len(nums)
    
    # LIS from left
    lis = [1] * n
    for i in range(n):
        for j in range(i):
            if nums[j] < nums[i]:
                lis[i] = max(lis[i], lis[j] + 1)
    
    # LIS from right (for decreasing part)
    lds = [1] * n
    for i in range(n - 1, -1, -1):
        for j in range(i + 1, n):
            if nums[j] < nums[i]:
                lds[i] = max(lds[i], lds[j] + 1)
    
    # Combine: peak element counted twice, subtract 1
    return max(lis[i] + lds[i] - 1 for i in range(n))
```

### Template 7: Minimum Deletions to Make Array Increasing

```python
from typing import List
import bisect

def min_deletions_to_make_increasing(nums: List[int]) -> int:
    """
    Minimum deletions to make array strictly increasing.
    Answer = n - LIS_length
    """
    if not nums:
        return 0
    
    # Find LIS length
    tails = []
    for num in nums:
        pos = bisect.bisect_left(tails, num)
        if pos == len(tails):
            tails.append(num)
        else:
            tails[pos] = num
    
    return len(nums) - len(tails)
```

---

## When to Use

Use the LIS algorithm when you need to solve problems involving:

- **Finding Longest Increasing Subsequence**: The classic problem
- **Envelope Nesting Problems**: Russian Doll Envelopes
- **Patience Sorting**: Card game and sorting applications
- **Building Towers**: Problems with height constraints
- **Optimization with Increasing Order**: Any problem requiring longest increasing sequence

### Comparison with Alternatives

| Algorithm | Time | Space | Use Case |
|-----------|------|-------|----------|
| **Naive DP** | O(n²) | O(n) | Small arrays, need actual sequence |
| **Binary Search + Tails** | O(n log n) | O(n) | Large arrays, length only |
| **Segment Tree** | O(n log n) | O(n) | When range queries needed |
| **Fenwick Tree** | O(n log n) | O(n) | With coordinate compression |

### When to Choose Which Approach

- **Choose Binary Search (O(n log n))** when:
  - You only need the length of LIS
  - Array size is large (n > 10⁴)
  - Time efficiency is critical

- **Choose Naive DP (O(n²))** when:
  - You need to reconstruct the actual subsequence
  - Array is very small (n < 10³)
  - Memory is extremely constrained

---

## Algorithm Explanation

### Core Concept

The key insight behind the efficient LIS algorithm is maintaining a **tails array** where `tails[i]` represents the smallest possible tail value for an increasing subsequence of length `i+1`. This array is always sorted, allowing us to use binary search for efficient lookups.

The invariant maintained is: **tails[i] is the smallest possible tail value for any increasing subsequence of length i+1.**

### How It Works

#### Processing Phase:
1. **Initialize**: Create an empty `tails` array
2. **Iterate**: For each element in the input array:
   - Use binary search (`bisect_left`) to find the position where the current element should go
   - If the position equals the current length of `tails`, append the element (we found a longer LIS)
   - Otherwise, replace the element at that position (we found a better tail for that length)
3. **Result**: The length of `tails` equals the length of LIS

#### Why This Works:

- **If we append**: The new element is larger than all elements in `tails`, meaning we found a subsequence of length `len(tails) + 1`
- **If we replace**: We're improving the minimum tail for that length, which can only help future elements (smaller tail = more flexibility for appending)

### Visual Representation

For array `[10, 9, 2, 5, 3, 7, 101, 18]`:

```
Processing 10: tails = [10]
Processing 9:  tails = [9]      (replace 10)
Processing 2:  tails = [2]      (replace 9)
Processing 5:  tails = [2, 5]   (append)
Processing 3:  tails = [2, 3]   (replace 5)
Processing 7:  tails = [2, 3, 7] (append)
Processing 101: tails = [2, 3, 7, 101] (append)
Processing 18: tails = [2, 3, 7, 18]  (replace 101)

Final LIS Length: 4
Possible LIS: [2, 3, 7, 18]
```

### Why It Works

1. **Greedy Choice**: By keeping the smallest possible tail for each length, we maximize the chance of appending future elements
2. **Optimal Substructure**: The LIS ending at any position can be extended by following elements
3. **Binary Search Efficiency**: The sorted nature of tails enables O(log n) operations

### Limitations

- **Reconstruction complexity**: Getting the actual sequence requires additional O(n) space for tracking
- **Doesn't count subsequences**: To count number of LIS, need O(n²) DP approach
- **Only for sequences**: Doesn't work for problems requiring non-sequential patterns

---

## Practice Problems

### Problem 1: Longest Increasing Subsequence

**Problem:** [LeetCode 300 - Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/)

**Description:** Given an integer array `nums`, return the length of the longest strictly increasing subsequence.

**How to Apply LIS:**
- Classic application of binary search + tails approach
- Time complexity: O(n log n)
- Can also solve with O(n²) DP for verification

---

### Problem 2: Number of Longest Increasing Subsequence

**Problem:** [LeetCode 673 - Number of Longest Increasing Subsequence](https://leetcode.com/problems/number-of-longest-increasing-subsequence/)

**Description:** Given an integer array `nums`, return the number of longest increasing subsequences.

**How to Apply LIS:**
- Track both length and count at each position
- When finding a longer subsequence, update count
- When finding equal length, add to count
- Use O(n²) DP approach

---

### Problem 3: Russian Doll Envelopes

**Problem:** [LeetCode 354 - Russian Doll Envelopes](https://leetcode.com/problems/russian-doll-envelopes/)

**Description:** Given a 2D array of envelope widths and heights, find the maximum number of envelopes that can be Russian-doll nested.

**How to Apply LIS:**
- Sort by width ascending, height descending
- Find LIS on heights
- The sorting trick ensures width constraint is satisfied

---

### Problem 4: Minimum Number of Arrows to Burst Balloons

**Problem:** [LeetCode 452 - Minimum Number of Arrows to Burst Balloons](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/)

**Description:** Given a 2D integer array `points` where each point represents a balloon, return the minimum number of arrows needed to burst all balloons.

**How to Apply LIS:**
- Sort by end coordinate
- Similar to activity selection / LIS variations
- Greedy approach related to patience sorting

---

### Problem 5: Maximum Length of Pair Chain

**Problem:** [LeetCode 646 - Maximum Length of Pair Chain](https://leetcode.com/problems/maximum-length-of-pair-chain/)

**Description:** Given an array of pairs where each pair [left, right] represents a chain link, find the longest chain that can be formed.

**How to Apply LIS:**
- Sort by second element
- Apply LIS logic on first elements
- Greedy approach similar to LIS optimization

---

## Video Tutorial Links

### Fundamentals

- [Longest Increasing Subsequence - Introduction (Take U Forward)](https://www.youtube.com/watch?v=CE2b_-XfVDk) - Comprehensive introduction
- [LIS Binary Search Explanation (NeetCode)](https://www.youtube.com/watch?v=YSqE-1Os8rk) - Detailed binary search approach
- [LIS with Reconstruction (WilliamFiset)](https://www.youtube.com/watch?v=S0T3nRVC-ug) - How to reconstruct the sequence

### Advanced Topics

- [Russian Doll Envelopes](https://www.youtube.com/watch?v=4en2R7r7f7A) - LIS in 2D
- [LIS vs LDS - Longest Bitonic Subsequence](https://www.youtube.com/watch?v=4s1hL0X2M5k) - Combined approach
- [Segment Tree for LIS](https://www.youtube.com/watch?v=fV0Rq8n6Y2g) - Alternative approach

### Problem-Specific

- [Patience Sorting](https://www.youtube.com/watch?v=7KPQd2AarT4) - Card game visualization
- [LIS Variations](https://www.youtube.com/watch?v=8NbYdVFCmD8) - Multiple LIS problem types

---

## Follow-up Questions

### Q1: What is the difference between LIS and LNDS?

**Answer:**
- **LIS (Longest Increasing Subsequence)**: Strictly increasing (each element must be greater than previous)
- **LNDS (Longest Non-Decreasing Subsequence)**: Each element can be equal to or greater than previous

Use `bisect_left` for LIS and `bisect_right` for LNDS.

---

### Q2: Can LIS be solved in O(n log n) without binary search?

**Answer:** Yes, using a **Segment Tree** or **Fenwick Tree** with coordinate compression:
1. Compress values to indices
2. Query maximum DP value in range [0, value-1]
3. Update DP value at current position
This gives O(n log n) with additional benefits like range queries.

---

### Q3: How do you reconstruct the actual LIS sequence?

**Answer:** Maintain additional arrays:
- `indices[i]`: Position where nums[i] is placed in tails
- `prev[i]`: Previous index in the subsequence

After processing, backtrack from the largest index to reconstruct the sequence.

---

### Q4: What is the space complexity if we only need the length?

**Answer:** Still O(n) in the worst case because tails can contain at most n elements. However, we can optimize by:
- Using a single array instead of storing multiple auxiliary structures
- For reconstruction, using a map instead of arrays (trades time for space)

---

### Q5: How does LIS relate to patience sorting?

**Answer:** The binary search approach is equivalent to **patience sorting**:
- Each pile represents a subsequence
- We place each card on the leftmost pile with top ≥ card value
- Number of piles = LIS length
- This is used in algorithms like merge sort for counting inversions

---

## Summary

The Longest Increasing Subsequence (LIS) is a fundamental algorithm with many applications in competitive programming and technical interviews. Key takeaways:

- **Binary search optimization**: Reduces O(n²) to O(n log n)
- **Tails array**: The key data structure maintaining smallest tails
- **Proof of correctness**: Invariant that tails[i] is the smallest possible tail for subsequence length i+1
- **Strictly vs Non-decreasing**: Use `bisect_left` vs `bisect_right`

When to use:
- ✅ Finding longest increasing subsequence
- ✅ Problems involving nested structures (envelopes, boxes)
- ✅ Sequence optimization problems
- ❌ When you need O(n²) for reconstruction with actual sequence

The O(n log n) binary search approach is the most commonly used in practice due to its simplicity and efficiency. Always consider whether you need the actual sequence or just the length when choosing your approach.

---

## Related Algorithms

- [Longest Common Subsequence](./lcs.md) - Similar DP approach for strings
- [Binary Search](./binary-search.md) - Search technique used
- [Segment Tree](./segment-tree.md) - Alternative LIS approach
- [Patience Sorting](./patience-sorting.md) - Related sorting technique
