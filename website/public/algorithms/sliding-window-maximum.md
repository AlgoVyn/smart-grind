# Sliding Window Maximum

## Category
Arrays & Strings

## Description

The **Sliding Window Maximum** problem asks for the maximum value in each sliding window of size `k` as it moves across an array. This is a fundamental pattern that appears frequently in data stream processing, traffic monitoring, and various algorithmic challenges.

The optimal solution uses a **monotonic deque** (double-ended queue) to achieve O(n) time complexity, making it one of the most efficient sliding window techniques. Each element is processed at most twice—once when entering the window and once when leaving—resulting in linear time performance.

This pattern extends beyond simple maximum queries to minimum tracking, median finding, and various statistical computations over sliding windows.

---

## Concepts

The Sliding Window Maximum technique is built on several fundamental concepts that make it powerful for efficient range queries.

### 1. Monotonic Deque

A deque that maintains elements in sorted order, allowing O(1) access to the maximum (or minimum) element.

| Property | Description |
|----------|-------------|
| **Front** | Always contains the maximum element of the current window |
| **Order** | Elements stored in decreasing order of their values |
| **Indices** | Stores indices (not values) to track window boundaries |

### 2. Window Invariant

The deque maintains a critical invariant:

```
For decreasing deque: nums[deque[0]] >= nums[deque[1]] >= ... >= nums[deque[-1]]
```

This ensures the front always holds the maximum for the current window.

### 3. Incremental Update

Instead of scanning the entire window for each position, we:

1. **Remove outgoing**: Elements that left the window (from front)
2. **Remove smaller**: Elements that can never be maximum (from back)
3. **Add incoming**: New element enters the window (at back)

### 4. Amortized Analysis

Each element is:
- Pushed exactly once
- Popped at most once (from front when leaving window)
- Popped at most once (from back when smaller than new element)

Total operations: O(2n) = O(n)

---

## Frameworks

Structured approaches for solving sliding window maximum problems.

### Framework 1: Maximum with Monotonic Deque

```
┌─────────────────────────────────────────────────────┐
│  SLIDING WINDOW MAXIMUM FRAMEWORK                   │
├─────────────────────────────────────────────────────┤
│  1. Initialize empty deque and result array         │
│  2. For each index i from 0 to n-1:                │
│     a. Remove indices from front that are          │
│        outside the window (i - k + 1)              │
│     b. Remove indices from back with values        │
│        smaller than nums[i]                        │
│     c. Push current index i to back                │
│     d. If window is full (i >= k-1):               │
│        - result.append(nums[deque[0]])            │
│  3. Return result array                             │
└─────────────────────────────────────────────────────┘
```

**When to use**: Finding maximum in each window of size k efficiently.

### Framework 2: Minimum with Monotonic Deque

```
┌─────────────────────────────────────────────────────┐
│  SLIDING WINDOW MINIMUM FRAMEWORK                   │
├─────────────────────────────────────────────────────┤
│  1. Initialize empty deque (maintains increasing)    │
│  2. For each index i from 0 to n-1:                │
│     a. Remove indices from front outside window    │
│     b. Remove indices from back with values        │
│        LARGER than nums[i] (flip comparison)       │
│     c. Push current index i to back                │
│     d. If window is full:                          │
│        - result.append(nums[deque[0]])              │
│  3. Return result array                             │
└─────────────────────────────────────────────────────┘
```

**When to use**: Finding minimum in each window of size k efficiently.

### Framework 3: Sliding Window with Two Heaps (Median)

```
┌─────────────────────────────────────────────────────┐
│  SLIDING WINDOW MEDIAN FRAMEWORK                    │
├─────────────────────────────────────────────────────┤
│  1. Maintain two heaps: max-heap (lower half)      │
│     and min-heap (upper half)                      │
│  2. Balance heaps so sizes differ by at most 1     │
│  3. For each new element:                          │
│     a. Add to appropriate heap                     │
│     b. Rebalance heaps                             │
│     c. Remove outgoing element (lazy deletion)     │
│  4. Median is top of larger heap or average        │
└─────────────────────────────────────────────────────┘
```

**When to use**: Finding median in each window (requires O(n log k) time).

---

## Forms

Different manifestations of the sliding window maximum pattern.

### Form 1: Fixed-Size Window (Maximum)

Window size is constant; find maximum for each window.

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Monotonic Deque | O(n) | O(k) | Optimal, single pass |
| Max Heap | O(n log k) | O(k) | Need k-largest, not just max |
| Brute Force | O(n × k) | O(1) | Very small k |

### Form 2: Fixed-Size Window (Minimum)

Same as maximum but with flipped comparisons.

```python
# Key difference: use > instead of <
while dq and nums[dq[-1]] > nums[i]:  # Note: > for minimum
    dq.pop()
```

### Form 3: Sliding Window with Constraints

Apply additional constraints to valid windows.

```
Example: Shortest Subarray with Sum at Least K
- Use prefix sums + monotonic deque
- Maintain increasing prefix sums in deque
- For each ending point, find valid starting points
```

### Form 4: Circular/Wrapping Window

Window wraps around array end to beginning.

```
Technique: Duplicate array or use modulo
Array: [1, 2, 3, 4, 5] with window size 3
Windows: [1,2,3], [2,3,4], [3,4,5], [4,5,1], [5,1,2]
```

### Form 5: Multi-Source Window (K-way)

Merge k sorted sources and track running statistics.

```
Example: Smallest Range Covering Elements from K Lists
- Use min-heap to track current window across k lists
- Track current maximum separately
- Slide window using heap operations
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Storing Indices vs Values

Always store indices, not values, to track window boundaries:

```python
# Good: Store indices
dq.append(i)  # Index
max_val = nums[dq[0]]  # Access value via index

# Not recommended for most cases: Store values
dq.append(nums[i])  # Loses position information
```

### Tactic 2: Handling Edge Cases

```python
def max_sliding_window(nums, k):
    if not nums or k == 0:
        return []
    if k == 1:
        return nums[:]  # Each element is its own max
    if k >= len(nums):
        return [max(nums)]  # Single window
    # ... main logic
```

### Tactic 3: Lazy Deletion with Two Heaps

For median and complex window statistics:

```python
from collections import defaultdict

def remove_outdated(heap, to_remove, valid_count):
    """Remove outdated elements from heap top."""
    while heap and to_remove.get(-heap[0] if heap is max_heap else heap[0], 0) > 0:
        val = -heapq.heappop(heap) if heap is max_heap else heapq.heappop(heap)
        to_remove[val] -= 1
        valid_count -= 1
```

### Tactic 4: Early Termination for Circular Arrays

```python
# When processing circular arrays
for i in range(2 * n):
    actual_idx = i % n
    
    # Optimization: stop early if stack empty after first pass
    if i >= n and not stack:
        break
```

### Tactic 5: Prefix Sum + Monotonic Deque

For problems with negative numbers and sum constraints:

```python
def shortest_subarray_with_sum_at_least_k(arr, k):
    """Use prefix sums + monotonic deque."""
    n = len(arr)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + arr[i]
    
    min_len = float('inf')
    dq = deque()  # Stores indices with increasing prefix sums
    
    for i in range(n + 1):
        # Check if we can form valid subarray
        while dq and prefix[i] - prefix[dq[0]] >= k:
            min_len = min(min_len, i - dq.popleft())
        
        # Maintain monotonicity
        while dq and prefix[i] <= prefix[dq[-1]]:
            dq.pop()
        
        dq.append(i)
    
    return min_len if min_len != float('inf') else -1
```

### Tactic 6: Comparing Approaches

```python
# Monotonic Deque: O(n) time, O(k) space
# Best for: single max/min per window

def max_sliding_window_deque(nums, k):
    # O(n) optimal solution
    pass

# Heap: O(n log k) time, O(k) space
# Best for: need k-largest elements

def max_sliding_window_heap(nums, k):
    # O(n log k) but more flexible
    pass
```

---

## Python Templates

### Template 1: Sliding Window Maximum (Monotonic Deque)

```python
from collections import deque

def max_sliding_window(nums: list[int], k: int) -> list[int]:
    """
    Find maximum in each sliding window using monotonic deque.
    Time: O(n), Space: O(k)
    """
    if not nums or k == 0:
        return []
    
    result = []
    dq = deque()  # Stores indices, maintains decreasing order
    
    for i, num in enumerate(nums):
        # Remove indices outside the current window from front
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        
        # Remove indices with smaller values from back
        # (they can never be the maximum)
        while dq and nums[dq[-1]] < num:
            dq.pop()
        
        # Add current index
        dq.append(i)
        
        # Start adding to result once window is full
        if i >= k - 1:
            result.append(nums[dq[0]])
    
    return result
```

### Template 2: Sliding Window Minimum (Monotonic Deque)

```python
from collections import deque

def min_sliding_window(nums: list[int], k: int) -> list[int]:
    """
    Find minimum in each sliding window using monotonic deque.
    Time: O(n), Space: O(k)
    """
    if not nums or k == 0:
        return []
    
    result = []
    dq = deque()  # Stores indices, maintains increasing order
    
    for i, num in enumerate(nums):
        # Remove indices outside window
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        
        # Remove indices with LARGER values (maintain increasing order)
        while dq and nums[dq[-1]] > num:
            dq.pop()
        
        dq.append(i)
        
        if i >= k - 1:
            result.append(nums[dq[0]])
    
    return result
```

### Template 3: Sliding Window Maximum (Heap Approach)

```python
import heapq

def max_sliding_window_heap(nums: list[int], k: int) -> list[int]:
    """
    Find maximum using max heap (simulated with min heap).
    Time: O(n log k), Space: O(k)
    
    Useful when you need k-largest, not just maximum.
    """
    if not nums or k == 0:
        return []
    
    result = []
    max_heap = []  # Stores (-value, index) for max heap simulation
    
    for i, num in enumerate(nums):
        # Add current element
        heapq.heappush(max_heap, (-num, i))
        
        # Remove elements outside the window (lazy deletion)
        while max_heap and max_heap[0][1] < i - k + 1:
            heapq.heappop(max_heap)
        
        # Record maximum once window is full
        if i >= k - 1:
            result.append(-max_heap[0][0])
    
    return result
```

### Template 4: Sliding Window Median (Two Heaps)

```python
import heapq
from collections import defaultdict

def sliding_window_median(nums: list[int], k: int) -> list[float]:
    """
    Find median in each sliding window.
    Time: O(n log k), Space: O(k)
    """
    if not nums or k == 0:
        return []
    
    # Max heap for lower half (negated values)
    lower = []  # max heap
    # Min heap for upper half
    upper = []  # min heap
    
    # Lazy deletion tracking
    to_remove_lower = defaultdict(int)
    to_remove_upper = defaultdict(int)
    lower_size = upper_size = 0
    
    def balance():
        # Ensure lower has equal or one more element than upper
        if lower_size > upper_size + 1:
            val = -heapq.heappop(lower)
            upper_size += 1
            lower_size -= 1
            heapq.heappush(upper, val)
        elif upper_size > lower_size:
            val = heapq.heappop(upper)
            lower_size += 1
            upper_size -= 1
            heapq.heappush(lower, -val)
    
    def get_median():
        if k % 2 == 1:
            return float(-lower[0])
        return (-lower[0] + upper[0]) / 2.0
    
    def prune(heap, to_remove, size):
        while heap and to_remove.get(-heap[0] if heap is lower else heap[0], 0) > 0:
            val = -heapq.heappop(heap) if heap is lower else heapq.heappop(heap)
            to_remove[val] -= 1
            size -= 1
        return size
    
    result = []
    
    for i, num in enumerate(nums):
        # Add to appropriate heap
        if not lower or num <= -lower[0]:
            heapq.heappush(lower, -num)
            lower_size += 1
        else:
            heapq.heappush(upper, num)
            upper_size += 1
        
        balance()
        
        # Remove outgoing element
        if i >= k:
            out_num = nums[i - k]
            if out_num <= -lower[0]:
                to_remove_lower[out_num] += 1
                lower_size -= 1
            else:
                to_remove_upper[out_num] += 1
                upper_size -= 1
        
        # Clean up tops if needed
        lower_size = prune(lower, to_remove_lower, lower_size)
        upper_size = prune(upper, to_remove_upper, upper_size)
        
        # Record median
        if i >= k - 1:
            result.append(get_median())
    
    return result
```

### Template 5: Shortest Subarray with Sum at Least K

```python
from collections import deque

def shortest_subarray_with_sum_at_least_k(arr: list[int], k: int) -> int:
    """
    Find shortest subarray with sum >= k.
    Handles negative numbers using prefix sums + monotonic deque.
    Time: O(n), Space: O(n)
    """
    n = len(arr)
    # Build prefix sum array
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + arr[i]
    
    min_len = float('inf')
    dq = deque()  # Monotonic deque storing indices
    
    for i in range(n + 1):
        # Check if we can form valid subarray
        while dq and prefix[i] - prefix[dq[0]] >= k:
            min_len = min(min_len, i - dq.popleft())
        
        # Maintain monotonicity (increasing prefix sums)
        while dq and prefix[i] <= prefix[dq[-1]]:
            dq.pop()
        
        dq.append(i)
    
    return min_len if min_len != float('inf') else -1
```

### Template 6: Constrained Subset Sum (DP + Sliding Window)

```python
from collections import deque

def constrained_subset_sum(nums: list[int], k: int) -> int:
    """
    Maximum sum of non-empty subset with constraint j - i <= k.
    Uses DP with monotonic deque optimization.
    Time: O(n), Space: O(n)
    """
    n = len(nums)
    # dp[i] = maximum sum ending at index i
    dp = [0] * n
    dp[0] = nums[0]
    
    # Deque stores indices with decreasing dp values
    dq = deque([0])
    
    for i in range(1, n):
        # Remove indices outside the k-window
        while dq and dq[0] < i - k:
            dq.popleft()
        
        # dp[i] = nums[i] + max(dp[j]) for valid j
        dp[i] = nums[i] + max(0, dp[dq[0]])
        
        # Maintain decreasing order in deque
        while dq and dp[dq[-1]] < dp[i]:
            dq.pop()
        
        dq.append(i)
    
    return max(dp)
```

---

## When to Use

Use the Sliding Window Maximum algorithm when you need to solve problems involving:

- **Finding maximum/minimum in every window**: When you need to track the maximum (or minimum) element as a window slides across an array
- **Stream processing**: When processing data streams where you need the running maximum
- **Real-time systems**: When you need O(1) access to the current window's maximum
- **Optimization problems**: When the maximum of sliding windows is part of a larger problem solution

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Best Use Case |
|----------|----------------|------------------|---------------|
| **Monotonic Deque** | O(n) | O(k) | Optimal for single pass, best overall |
| **Brute Force** | O(n × k) | O(1) | Small k, simple implementation |
| **Max Heap** | O(n log k) | O(k) | When you need k-largest, not just maximum |
| **Sorted Container** | O(n log k) | O(k) | When you need order statistics |
| **Sparse Table** | O(n log n) preprocess, O(1) query | O(n log n) | Static array, many queries |

### When to Choose Each Approach

- **Choose Monotonic Deque** when:
  - You need the maximum in each window (not k-largest)
  - You want optimal O(n) time complexity
  - You can process elements in a single pass

- **Choose Max Heap** when:
  - You need k-largest elements, not just the maximum
  - Window size is very small relative to array size
  - You need to handle duplicate values specially

- **Choose Brute Force** when:
  - k is very small (k ≤ 3)
  - Simplicity is more important than efficiency
  - Code readability is the priority

- **Choose Sparse Table** when:
  - The array is static (no updates)
  - You need to answer many queries on the same array
  - You want O(1) query time after preprocessing

---

## Algorithm Explanation

### Core Concept

The key insight behind the monotonic deque solution is maintaining a **decreasing deque** where:
- The front always contains the maximum element of the current window
- Elements are stored in decreasing order of their values
- Indices (not values) are stored to track window boundaries

### How It Works

#### The Monotonic Deque Invariant:

```
Deque stores indices, and nums[deque[0]] >= nums[deque[1]] >= nums[deque[2]] >= ...
```

#### Processing Each Element:

1. **Remove outdated indices**: Remove indices from the front that are outside the current window [i - k + 1, i]
2. **Maintain monotonicity**: Remove indices from the back that have smaller values than the current element
3. **Add current index**: Push the current index to the back of the deque
4. **Record the maximum**: Once we've processed at least k elements, the front of the deque is the maximum

### Visual Representation

For array `[1, 3, -1, -3, 5, 3, 6, 7]` with k = 3:

```
Step 1: i=0, nums[0]=1    Deque: [0]           Window: [1]           Max: -
Step 2: i=1, nums[1]=3    Deque: [1]           Window: [1,3]         Max: -
         (removed 0, 3>1)
Step 3: i=2, nums[2]=-1   Deque: [1,2]         Window: [1,3,-1]      Max: 3 ✓
Step 4: i=3, nums[3]=-3   Deque: [1,2,3]       Window: [3,-1,-3]     Max: 3 ✓
Step 5: i=4, nums[4]=5    Deque: [4]           Window: [-1,-3,5]     Max: 5 ✓
         (removed 1,2,3, 5>-1,-3)
Step 6: i=5, nums[5]=3    Deque: [4,5]         Window: [-3,5,3]      Max: 5 ✓
Step 7: i=6, nums[6]=6    Deque: [6]           Window: [5,3,6]       Max: 6 ✓
         (removed 4,5, 6>5,3)
Step 8: i=7, nums[7]=7    Deque: [7]           Window: [3,6,7]       Max: 7 ✓
```

### Why O(n) Time Complexity?

Each element:
- Is pushed to the deque exactly once
- Is popped from the deque at most once

Total operations: 2n = O(n)

### Why O(k) Space Complexity?

The deque can contain at most k elements (the current window size), so space is O(k).

### Limitations

- **Only works with deque data structure**: Requires O(1) front and back operations
- **Specific to min/max queries**: Doesn't directly extend to other statistics
- **Window size must be known**: Requires fixed or bounded window size

---

## Practice Problems

### Problem 1: Sliding Window Maximum (Classic)

**Problem:** [LeetCode 239 - Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/)

**Description:** Given an integer array `nums`, there is a sliding window of size `k` which moves from the very left to the very right. Return the max sliding window.

**How to Apply:**
- Use monotonic decreasing deque
- Maintain indices in decreasing order of values
- Remove outdated indices from front
- Time: O(n), Space: O(k)

---

### Problem 2: Sliding Window Median

**Problem:** [LeetCode 480 - Sliding Window Median](https://leetcode.com/problems/sliding-window-median/)

**Description:** Given an integer array `nums` and integer `k`, return the median of each sliding window of size `k`.

**How to Apply:**
- Use two heaps: a max heap for the lower half and a min heap for the upper half
- Balance the heaps to maintain the invariant that their sizes differ by at most 1
- Remove elements outside the window using lazy deletion with hash maps
- Time: O(n log k), Space: O(k)

---

### Problem 3: Max of Minimum in Every Window Size

**Problem:** [GeeksforGeeks - Maximum of minimum for every window size](https://www.geeksforgeeks.org/find-the-maximum-of-minimums-for-every-window-size-in-a-given-array/)

**Description:** Given an array of integers, find the maximum of the minimum of every window size in the array. Window sizes vary from 1 to n.

**How to Apply:**
- Precompute the previous smaller and next smaller elements using a monotonic stack
- For each element, determine the maximum window size where it is the minimum
- Use the results to fill in the answer array
- Time: O(n), Space: O(n)

---

### Problem 4: Shortest Subarray with Sum at Least K

**Problem:** [LeetCode 862 - Shortest Subarray with Sum at Least K](https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/)

**Description:** Given an integer array `nums` and an integer `k`, return the length of the shortest non-empty subarray with a sum of at least `k`. If there is no such subarray, return -1.

**How to Apply:**
- Compute prefix sums to transform the problem into finding valid pairs
- Use a monotonic deque to maintain candidate starting points
- For each ending point, remove starting points that give sums ≥ k
- Time: O(n), Space: O(n)

---

### Problem 5: Constrained Subset Sum

**Problem:** [LeetCode 1425 - Constrained Subset Sum](https://leetcode.com/problems/constrained-subset-sum/)

**Description:** Given an integer array `nums` and an integer `k`, return the maximum sum of a non-empty subset such that for every two consecutive elements in the subset, if they are at indices `i` and `j` respectively, then `j - i <= k`.

**How to Apply:**
- Use dynamic programming: `dp[i] = nums[i] + max(dp[j])` for valid previous indices
- Maintain the max of previous dp values using a sliding window maximum (monotonic deque)
- This optimizes the DP from O(nk) to O(n)
- Time: O(n), Space: O(n)

---

### Problem 6: Smallest Range Covering Elements from K Lists

**Problem:** [LeetCode 632 - Smallest Range Covering Elements from K Lists](https://www.youtube.com/smallest-range-covering-elements-from-k-lists/)

**Description:** You have k lists of sorted integers. Find the smallest range that includes at least one number from each of the k lists.

**How to Apply:**
- Use min-heap to track current minimum across k lists
- Track current maximum separately
- Slide window by extracting min and adding next from same list
- Time: O(N log k), Space: O(k)

---

### Problem 7: Maximum of Absolute Value Expression

**Problem:** [LeetCode 1131 - Maximum of Absolute Value Expression](https://leetcode.com/problems/maximum-of-absolute-value-expression/)

**Description:** Given two arrays of integers with equal lengths, return the maximum value of |arr1[i] - arr1[j]| + |arr2[i] - arr2[j]| + |i - j|.

**How to Apply:**
- Transform into 4 linear expressions using properties of absolute values
- Use sliding window maximum to find maximum for each expression
- Time: O(n), Space: O(n)

---

## Video Tutorial Links

### Fundamentals

- [Sliding Window Maximum - Introduction (Take U Forward)](https://www.youtube.com/watch?v=DfljaUwZsOk) - Comprehensive introduction
- [Monotonic Queue Explained (WilliamFiset)](https://www.youtube.com/watch?v=2OynB1b3sWQ) - Detailed explanation with visualizations
- [Sliding Window Maximum - NeetCode](https://www.youtube.com/watch?v=2xGeO8j9a4) - Practical implementation guide

### Advanced Topics

- [Sliding Window Minimum/Maximum (Tushar Roy)](https://www.youtube.com/watch?v=0f1D6u1z0r8) - Multiple approaches
- [Dequeue Optimization (Algorithms Live)](https://www.youtube.com/watch?v=0FYkn4KN4Lw) - Why monotonic deque works
- [Sliding Window Variations](https://www.youtube.com/watch?v=MK0m1z7c9bE) - Common variations and extensions

### Problem-Specific

- [Sliding Window Median - LeetCode 480](https://www.youtube.com/watch?v=eyLE9PZyXo0) - Advanced sliding window with data structures
- [Shortest Subarray with Sum at Least K](https://www.youtube.com/watch?v=GzeqP1T7i6w) - Monotonic deque with prefix sums
- [Constrained Subset Sum](https://www.youtube.com/watch?v=thZ7vxnn9dE) - DP optimization with sliding window

---

## Follow-up Questions

### Q1: Why use a deque instead of a regular queue?

**Answer:** A deque (double-ended queue) allows O(1) insertions and deletions at both ends. In our algorithm, we need to:
- Remove from front: O(1) - elements outside the window
- Remove from back: O(1) - elements with smaller values
- Add to back: O(1) - new element

A regular queue can only remove from the front, making the monotonic cleanup impossible in O(1).

---

### Q2: Can this algorithm handle duplicate values correctly?

**Answer:** Yes! The algorithm handles duplicates correctly because:
- When nums[dq[-1]] < nums[i], we remove the smaller duplicate
- When values are equal, we keep the earlier index (stays longer in window)
- This maintains correctness because earlier index stays valid longer

---

### Q3: How would you modify for circular arrays?

**Answer:** For circular sliding windows (window can wrap around):
1. Concatenate the array to itself: nums + nums[:k-1]
2. Apply standard sliding window algorithm
3. Adjust indices to handle wrapping

Or use modulo arithmetic to track indices.

---

### Q4: What's the difference between this and a segment tree approach?

**Answer:**
- **Monotonic Deque**: O(n) time, O(k) space, single pass, online algorithm
- **Segment Tree**: O(n) build, O(log n) per query, O(n) space, supports updates
- **Sparse Table**: O(n log n) build, O(1) per query, O(n log n) space, static only
- **Choice**: Use deque for streaming/sliding windows; segment tree for dynamic range queries; sparse table for static array with many queries

---

### Q5: How do you handle very large window sizes (k ≈ n)?

**Answer:** The algorithm still works efficiently:
- Space becomes O(n) when k ≈ n
- Each element still pushed/popped at most once
- The monotonic property still maintained
- Consider edge case where k > n: return single maximum

---

### Q6: Can this be extended to find kth largest in each window?

**Answer:** Yes, but with different data structures:
- **Order Statistic Tree**: O(n log k) time
- **Two Heaps**: O(n log k) time with lazy deletion
- **Quickselect**: Too slow for sliding window

For simple max/min, monotonic deque is optimal O(n). For kth order statistics, O(n log k) is expected.

---

### Q7: How does sliding window maximum relate to monotonic stack?

**Answer:** Both use monotonic properties but for different purposes:
- **Monotonic Stack**: Find next greater/smaller element for each position
- **Monotonic Deque**: Find current maximum/minimum in a sliding window

Stack is for pairwise relationships, deque is for range queries. Both achieve O(n) by maintaining sorted order.

---

## Summary

The Sliding Window Maximum problem is elegantly solved using a **monotonic deque**, achieving optimal O(n) time complexity. Key takeaways:

- **Monotonic property**: Maintain decreasing order in deque (front = maximum)
- **O(n) time**: Each element pushed once, popped at most once
- **O(k) space**: Deque holds at most k indices
- **Versatile**: Can be adapted for minimum, k-largest, and many variations
- **Practical**: Single pass, no preprocessing needed

When to use:
- ✅ Finding maximum/minimum in sliding windows
- ✅ Stream processing with running statistics
- ✅ When you need O(n) single-pass solution
- ✅ Competitive programming and interviews

When not to use:
- ❌ When you need arbitrary order statistics (kth largest where k varies)
- ❌ When the window size is unknown or unbounded
- ❌ When you need to modify the underlying data frequently

This algorithm is fundamental and appears in many real-world applications including:
- Stock price monitoring
- Network traffic analysis
- Weather data processing
- Any sliding window statistical analysis
