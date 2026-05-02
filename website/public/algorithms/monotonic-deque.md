# Monotonic Deque (Queue)

## Category
Data Structures

## Description

The Monotonic Deque pattern solves sliding window problems that need to track the maximum or minimum element efficiently. By maintaining a deque in monotonically decreasing (or increasing) order, we achieve O(1) access to the current window's maximum and O(n) overall time for processing the entire array.

This pattern is particularly powerful for problems like sliding window maximum, jump game with constraints, and constrained subsequence sum problems. The key insight is that when a new element arrives, we can remove elements from the back of the deque that will never be needed again—if a new element is larger than previous elements, those previous elements will never be the maximum while the new element is in the window.

---

## Concepts

The monotonic deque pattern is built on several fundamental concepts.

### 1. Monotonic Property

Maintaining order in the deque:

| Type | Order | Use Case |
|------|-------|----------|
| **Decreasing** | Front = max, decreasing to back | Sliding window maximum |
| **Increasing** | Front = min, increasing to back | Sliding window minimum |
| **Strict vs Non-Strict** | Equality handling | Depends on problem |

### 2. Deque Operations

Key operations for the pattern:

| Operation | Purpose | Time |
|-----------|---------|------|
| **Push Back** | Add new element | O(1) amortized |
| **Pop Back** | Remove smaller/larger elements | O(1) amortized |
| **Pop Front** | Remove elements out of window | O(1) |
| **Front Access** | Get current max/min | O(1) |

### 3. The Core Insight

Why it works:

```
When adding new element x:
- While back element < x: pop back
  (These elements will never be max while x exists)
- Push x to back

When window slides:
- If front element index < window start: pop front
- New front is current window max
```

### 4. Amortized Complexity

| Operation | Worst Case | Amortized |
|-----------|------------|-----------|
| **Push** | O(n) | O(1) |
| **Pop Back** | O(1) | O(1) |
| **Pop Front** | O(1) | O(1) |
| **Total for n elements** | - | O(n) |

Each element is pushed and popped at most once.

---

## Frameworks

Structured approaches for implementing monotonic deque solutions.

### Framework 1: Sliding Window Maximum

```
┌─────────────────────────────────────────────────────────────┐
│  SLIDING WINDOW MAXIMUM FRAMEWORK                             │
├─────────────────────────────────────────────────────────────┤
│  Input: Array nums, window size k                             │
│  Output: Maximum of each window                              │
│                                                                │
│  1. Initialize empty deque (stores indices)                    │
│                                                                │
│  2. For i from 0 to n-1:                                      │
│     a. Remove from front:                                    │
│        While deque[0] <= i - k:                            │
│          Pop front (out of window)                           │
│                                                                │
│     b. Maintain monotonic decreasing:                      │
│        While deque not empty AND nums[deque[-1]] < nums[i]: │
│          Pop back (smaller than new, won't be needed)      │
│        Push i to back                                        │
│                                                                │
│     c. Record result:                                        │
│        If i >= k - 1:                                        │
│          result.append(nums[deque[0]])                       │
│                                                                │
│  3. Return result                                              │
│                                                                │
│  Time: O(n), Space: O(k)                                      │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Classic sliding window maximum problems.

### Framework 2: DP with Monotonic Deque

```
┌─────────────────────────────────────────────────────────────┐
│  DP WITH MONOTONIC DEQUE FRAMEWORK                            │
├─────────────────────────────────────────────────────────────┤
│  Input: Array nums, constraint on jump distance k             │
│  Output: Optimal score/cost                                    │
│                                                                │
│  Example: Jump Game VI                                         │
│                                                                │
│  1. Initialize:                                              │
│     dp[0] = nums[0]                                           │
│     deque = [0]  // Stores indices with decreasing dp values │
│                                                                │
│  2. For i from 1 to n-1:                                     │
│     a. Remove out of range:                                  │
│        If deque[0] < i - k: pop front                        │
│                                                                │
│     b. Compute dp[i]:                                        │
│        dp[i] = nums[i] + dp[deque[0]]                        │
│                                                                │
│     c. Maintain monotonic decreasing:                      │
│        While deque not empty AND dp[deque[-1]] <= dp[i]:    │
│          Pop back                                            │
│        Push i to back                                        │
│                                                                │
│  3. Return dp[n-1]                                           │
│                                                                │
│  Time: O(n), Space: O(k)                                      │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: DP optimization with sliding window constraint.

### Framework 3: Monotonic Deque Decision

```
┌─────────────────────────────────────────────────────────────┐
│  CHOOSING APPROACH FOR SLIDING WINDOW PROBLEMS              │
├─────────────────────────────────────────────────────────────┤
│  Use Monotonic Deque when:                                    │
│    ✓ Need max/min in every window                            │
│    ✓ Window slides one element at a time                     │
│    ✓ O(1) access to max/min needed                         │
│                                                                │
│  Use Heap when:                                              │
│    ✓ Need both min and max simultaneously                  │
│    ✓ Can tolerate O(log n) per operation                     │
│    ✓ Other priority operations needed                        │
│                                                                │
│  Use Segment Tree when:                                     │
│    ✓ Need range queries beyond sliding window               │
│    ✓ Windows don't slide sequentially                      │
│    ✓ More general range operations needed                    │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Deciding which data structure to use.

---

## Forms

Different manifestations of the monotonic deque pattern.

### Form 1: Sliding Window Maximum

Track maximum in each window.

| Aspect | Details |
|--------|---------|
| **Deque Order** | Decreasing (max at front) |
| **Operations** | Pop smaller from back, pop old from front |
| **Time** | O(n) total |
| **Space** | O(k) for window size k |

### Form 2: Sliding Window Minimum

Track minimum in each window.

| Aspect | Details |
|--------|---------|
| **Deque Order** | Increasing (min at front) |
| **Operations** | Pop larger from back, pop old from front |
| **Use Case** | Minimum window values, constraint satisfaction |

### Form 3: DP Optimization

Optimize DP with range queries.

| Aspect | Details |
|--------|---------|
| **DP State** | dp[i] depends on max/min of previous k states |
| **Deque Stores** | Indices with monotonic dp values |
| **Examples** | Jump Game VI, Constrained Subsequence Sum |

### Form 4: Shortest Subarray with Sum Constraint

Prefix sum optimization.

| Aspect | Details |
|--------|---------|
| **Problem** | Find shortest subarray with sum ≥ K |
| **Technique** | Monotonic deque on prefix sums |
| **Extension** | Of sliding window for positive numbers |

### Form 5: First Smaller Element

Related monotonic stack/queue problems.

| Aspect | Details |
|--------|---------|
| **Problem** | Previous/next smaller/greater element |
| **Structure** | Monotonic stack (one-ended) |
| **Relation** | Similar concept, different structure |

---

## Tactics

Specific techniques and implementations.

### Tactic 1: Sliding Window Maximum

Classic monotonic deque:

```python
from collections import deque

def max_sliding_window(nums, k):
    """
    LeetCode 239: Sliding Window Maximum.
    Time: O(n), Space: O(k)
    """
    result = []
    dq = deque()  # Store indices, values decreasing
    
    for i, num in enumerate(nums):
        # Remove elements smaller than current from back
        while dq and nums[dq[-1]] < num:
            dq.pop()
        
        # Add current index
        dq.append(i)
        
        # Remove front if out of window
        if dq[0] <= i - k:
            dq.popleft()
        
        # Start adding to result after first window
        if i >= k - 1:
            result.append(nums[dq[0]])
    
    return result
```

### Tactic 2: Jump Game VI

DP with monotonic deque:

```python
def max_result(nums, k):
    """
    LeetCode 1696: Jump Game VI.
    Time: O(n), Space: O(k)
    """
    n = len(nums)
    dp = [0] * n
    dp[0] = nums[0]
    
    # Deque stores indices with decreasing dp values
    dq = deque([0])
    
    for i in range(1, n):
        # Remove out of range
        if dq[0] < i - k:
            dq.popleft()
        
        # dp[i] = nums[i] + max(dp[i-k..i-1])
        dp[i] = nums[i] + dp[dq[0]]
        
        # Maintain decreasing order
        while dq and dp[dq[-1]] <= dp[i]:
            dq.pop()
        dq.append(i)
    
    return dp[-1]
```

### Tactic 3: Sliding Window Minimum

For minimum tracking:

```python
def min_sliding_window(nums, k):
    """
    Sliding Window Minimum.
    Time: O(n), Space: O(k)
    """
    result = []
    dq = deque()  # Store indices, values increasing
    
    for i, num in enumerate(nums):
        # Remove elements larger than current from back
        while dq and nums[dq[-1]] > num:
            dq.pop()
        
        dq.append(i)
        
        # Remove front if out of window
        if dq[0] <= i - k:
            dq.popleft()
        
        if i >= k - 1:
            result.append(nums[dq[0]])
    
    return result
```

### Tactic 4: Shortest Subarray with Sum at Least K

Prefix sum with monotonic deque:

```python
def shortest_subarray(nums, k):
    """
    LeetCode 862: Shortest Subarray with Sum at Least K.
    Time: O(n), Space: O(n)
    """
    n = len(nums)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]
    
    result = float('inf')
    dq = deque()  # Store indices with increasing prefix sums
    
    for i in range(n + 1):
        # Check if we can form valid subarray
        while dq and prefix[i] - prefix[dq[0]] >= k:
            result = min(result, i - dq.popleft())
        
        # Maintain increasing order
        while dq and prefix[i] <= prefix[dq[-1]]:
            dq.pop()
        
        dq.append(i)
    
    return result if result != float('inf') else -1
```

### Tactic 5: Constrained Subsequence Sum

Another DP optimization:

```python
def constrained_subset_sum(nums, k):
    """
    LeetCode 1425: Constrained Subsequence Sum.
    Time: O(n), Space: O(k)
    """
    from collections import deque
    
    n = len(nums)
    dp = [0] * n
    dp[0] = nums[0]
    
    dq = deque([0])  # Indices with decreasing dp values
    
    for i in range(1, n):
        # Remove out of window
        if dq[0] < i - k:
            dq.popleft()
        
        # Best we can extend
        dp[i] = max(nums[i], nums[i] + dp[dq[0]])
        
        # Maintain decreasing
        while dq and dp[dq[-1]] <= dp[i]:
            dq.pop()
        dq.append(i)
    
    return max(dp)
```

---

## Python Templates

### Template 1: Sliding Window Maximum

```python
from collections import deque
from typing import List

def max_sliding_window(nums: List[int], k: int) -> List[int]:
    """
    LeetCode 239: Sliding Window Maximum.
    Returns maximum of each window of size k.
    
    Args:
        nums: Input array
        k: Window size
    
    Returns:
        List of maximum values for each window
        
    Time: O(n)
    Space: O(k)
    """
    if not nums or k == 0:
        return []
    
    result = []
    dq = deque()  # Stores indices, values decreasing
    
    for i, num in enumerate(nums):
        # Remove elements smaller than current from back
        while dq and nums[dq[-1]] < num:
            dq.pop()
        
        # Add current index
        dq.append(i)
        
        # Remove front if out of window
        if dq[0] <= i - k:
            dq.popleft()
        
        # Add to result once window is formed
        if i >= k - 1:
            result.append(nums[dq[0]])
    
    return result
```

### Template 2: Jump Game VI

```python
def max_result(nums: List[int], k: int) -> int:
    """
    LeetCode 1696: Jump Game VI.
    Max score with jumps up to k positions.
    
    Args:
        nums: Array of scores
        k: Max jump distance
    
    Returns:
        Maximum score to reach end
        
    Time: O(n)
    Space: O(k)
    """
    n = len(nums)
    if n == 0:
        return 0
    
    dp = [0] * n
    dp[0] = nums[0]
    
    # Deque stores indices with decreasing dp values
    dq = deque([0])
    
    for i in range(1, n):
        # Remove indices out of jump range
        if dq[0] < i - k:
            dq.popleft()
        
        # dp[i] = nums[i] + max(dp in range)
        dp[i] = nums[i] + dp[dq[0]]
        
        # Maintain decreasing order
        while dq and dp[dq[-1]] <= dp[i]:
            dq.pop()
        dq.append(i)
    
    return dp[-1]
```

### Template 3: Sliding Window Minimum

```python
def min_sliding_window(nums: List[int], k: int) -> List[int]:
    """
    Sliding Window Minimum.
    
    Args:
        nums: Input array
        k: Window size
    
    Returns:
        List of minimum values for each window
        
    Time: O(n)
    Space: O(k)
    """
    if not nums or k == 0:
        return []
    
    result = []
    dq = deque()  # Stores indices, values increasing
    
    for i, num in enumerate(nums):
        # Remove elements larger than current from back
        while dq and nums[dq[-1]] > num:
            dq.pop()
        
        dq.append(i)
        
        # Remove front if out of window
        if dq[0] <= i - k:
            dq.popleft()
        
        if i >= k - 1:
            result.append(nums[dq[0]])
    
    return result
```

### Template 4: Shortest Subarray with Sum at Least K

```python
def shortest_subarray(nums: List[int], k: int) -> int:
    """
    LeetCode 862: Shortest Subarray with Sum at Least K.
    
    Args:
        nums: Array (may contain negative numbers)
        k: Target sum
    
    Returns:
        Length of shortest subarray with sum >= k, or -1
        
    Time: O(n)
    Space: O(n)
    """
    n = len(nums)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]
    
    result = float('inf')
    dq = deque()  # Stores indices with increasing prefix sums
    
    for i in range(n + 1):
        # Check if we can form valid subarray ending at i
        while dq and prefix[i] - prefix[dq[0]] >= k:
            result = min(result, i - dq.popleft())
        
        # Maintain increasing order of prefix sums
        while dq and prefix[i] <= prefix[dq[-1]]:
            dq.pop()
        
        dq.append(i)
    
    return result if result != float('inf') else -1
```

### Template 5: Constrained Subsequence Sum

```python
def constrained_subset_sum(nums: List[int], k: int) -> int:
    """
    LeetCode 1425: Constrained Subsequence Sum.
    Find max sum of non-empty subsequence with distance constraint.
    
    Args:
        nums: Array of integers
        k: Max distance between consecutive elements
    
    Returns:
        Maximum constrained subsequence sum
        
    Time: O(n)
    Space: O(k)
    """
    n = len(nums)
    if n == 0:
        return 0
    
    dp = [0] * n
    dp[0] = nums[0]
    
    dq = deque([0])  # Indices with decreasing dp values
    
    for i in range(1, n):
        # Remove out of range
        if dq[0] < i - k:
            dq.popleft()
        
        # Extend best subsequence or start new
        dp[i] = max(nums[i], nums[i] + dp[dq[0]])
        
        # Maintain decreasing
        while dq and dp[dq[-1]] <= dp[i]:
            dq.pop()
        dq.append(i)
    
    return max(dp)
```

### Template 6: Generic Monotonic Deque Template

```python
from collections import deque
from typing import List, Callable, TypeVar

T = TypeVar('T')

def sliding_window_optimized(
    arr: List[T], 
    k: int,
    comparator: Callable[[T, T], bool],
    get_value: Callable[[int], T]
) -> List[T]:
    """
    Generic sliding window with monotonic deque.
    
    Args:
        arr: Input array
        k: Window size
        comparator: Returns True if first should be removed
        get_value: Function to get value at index
    
    Returns:
        Optimal value for each window
    """
    result = []
    dq = deque()
    
    for i in range(len(arr)):
        # Remove from back based on comparator
        while dq and comparator(get_value(dq[-1]), get_value(i)):
            dq.pop()
        
        dq.append(i)
        
        # Remove front if out of window
        if dq[0] <= i - k:
            dq.popleft()
        
        # Add to result
        if i >= k - 1:
            result.append(get_value(dq[0]))
    
    return result
```

---

## When to Use

Use Monotonic Deque when you need to solve problems involving:

- **Sliding Window Extremes**: Max or min in every window of size k
- **Jump/Range DP**: DP where state depends on max/min of previous k states
- **Constrained Optimization**: Problems with sliding range constraints
- **Queue-based Extremes**: When you need efficient access to front extremum
- **Linear Time Requirement**: O(n) solution needed, heap's O(n log k) too slow

### Comparison: Monotonic Deque vs Alternatives

| Data Structure | Query | Update | Space | Use Case |
|---------------|-------|--------|-------|----------|
| **Monotonic Deque** | O(1) | O(1) amortized | O(k) | Sliding window |
| **Heap/Priority Queue** | O(1) | O(log k) | O(k) | Both min and max |
| **Segment Tree** | O(log n) | O(log n) | O(n) | General range |
| **Ordered Set** | O(log k) | O(log k) | O(k) | Dynamic window |
| **Sparse Table** | O(1) | O(n log n) prep | O(n log n) | Static array |

### When to Choose Each Approach

- **Choose Monotonic Deque** when:
  - Need only max OR min (not both)
  - Window slides one element at a time
  - O(n) time requirement
  - Elements are processed in order

- **Choose Heap** when:
  - Need both min and max
  - Can tolerate O(log k) per operation
  - Elements arrive out of order

- **Choose Segment Tree** when:
  - Need general range queries
  - Window changes arbitrarily
  - Have preprocessing time

---

## Algorithm Explanation

### Core Concept

The monotonic deque maintains elements in decreasing (or increasing) order of value. When a new element arrives, we remove all elements from the back that are smaller (for max) or larger (for min) because they'll never be the extreme while the new element is present.

### How It Works

#### Step 1: Maintain Monotonic Property

When adding element x at index i:
```python
# For maximum (decreasing order)
while deque and nums[deque[-1]] < x:
    deque.pop()

# For minimum (increasing order)
while deque and nums[deque[-1]] > x:
    deque.pop()
```

#### Step 2: Remove Out-of-Window Elements

When window slides:
```python
if deque[0] <= i - k:
    deque.popleft()
```

#### Step 3: Access Maximum/Minimum

Front always has the extreme:
```python
max_in_window = nums[deque[0]]
```

### Visual Representation

**Adding elements:**
```
Window: [3, 1, 4, 2] with k=3

Processing 3: deque = [3]
Processing 1: deque = [3, 1]  (1 < 3, keep)
Processing 4: 
  4 > 1, pop 1
  4 > 3, pop 3
  deque = [4]
Processing 2: deque = [4, 2]  (2 < 4, keep)

Max for [1,4,2]: nums[4] = 4
```

### Why It Works

1. **Monotonic Order**: Front is always max/min
2. **Window Maintenance**: Old elements removed from front
3. **Elimination**: Elements that can't be extreme are removed from back
4. **Amortized**: Each element pushed and popped at most once

### Limitations

- **One Extreme**: Only tracks max OR min, not both
- **Sequential Access**: Requires elements in order
- **Index Tracking**: Must store indices, not values
- **Fixed Window**: Optimized for sliding window, not arbitrary ranges

---

## Practice Problems

### Problem 1: Sliding Window Maximum

**Problem:** [LeetCode 239 - Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/)

**Description:** Find maximum in each window of size k.

**How to Apply:**
- Classic monotonic decreasing deque
- Store indices
- O(n) time

---

### Problem 2: Jump Game VI

**Problem:** [LeetCode 1696 - Jump Game VI](https://leetcode.com/problems/jump-game-vi/)

**Description:** Max score with jumps up to k, landing adds value.

**How to Apply:**
- DP with monotonic deque
- dp[i] = nums[i] + max(dp in window)

---

### Problem 3: Shortest Subarray with Sum at Least K

**Problem:** [LeetCode 862 - Shortest Subarray with Sum at Least K](https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/)

**Description:** Find shortest subarray with sum ≥ K (may have negatives).

**How to Apply:**
- Prefix sums
- Monotonic increasing deque
- O(n) solution

---

### Problem 4: Constrained Subsequence Sum

**Problem:** [LeetCode 1425 - Constrained Subsequence Sum](https://leetcode.com/problems/constrained-subsequence-sum/)

**Description:** Max sum subsequence with index constraint.

**How to Apply:**
- Similar to Jump Game VI
- Monotonic deque on dp values

---

### Problem 5: Sliding Window Median

**Problem:** [LeetCode 480 - Sliding Window Median](https://leetcode.com/problems/sliding-window-median/)

**Description:** Find median in each window.

**How to Apply:**
- Two heaps or ordered set
- More complex than simple monotonic deque

---

## Video Tutorial Links

### Fundamentals

- [Sliding Window Maximum - NeetCode](https://www.youtube.com/watch?v=DflJAUYhOZ0) - Core concept
- [Monotonic Queue - William Fiset](https://www.youtube.com/watch?v=57N1wB7oJ8Y) - Data structure
- [Jump Game VI - Algorithms](https://www.youtube.com/watch?v=3j9K7_1iP9s) - DP optimization

### Problem Solving

- [Constrained Subsequence Sum - LeetCode](https://www.youtube.com/watch?v=J1g3L5zQ2aU) - Advanced
- [Shortest Subarray - Back to Back SWE](https://www.youtube.com/watch?v=K1i-wO57gso) - Technique

---

## Follow-up Questions

### Q1: What's the difference between monotonic stack and monotonic deque?

**Answer:** Monotonic stack is one-ended (LIFO), used for problems like "next greater element." Monotonic deque is two-ended, allowing removal from both front and back, making it suitable for sliding window problems where elements expire from the front.

---

### Q2: Can monotonic deque track both min and max simultaneously?

**Answer:** Not efficiently with a single deque. You'd need two separate deques (one increasing, one decreasing) or use a different data structure like two heaps or an ordered balanced BST.

---

### Q3: Why is it called "monotonic"?

**Answer:** The deque maintains elements in strictly monotonic order (always increasing or always decreasing). This property ensures the front always contains the extremum (max or min).

---

### Q4: What if the window size is larger than the array?

**Answer:** The algorithm naturally handles this. The window only becomes "full" after k elements, and we start recording results from index k-1. Before that, we report the max/min of elements seen so far.

---

### Q5: How does this compare to sparse table for range maximum queries?

**Answer:** Sparse table gives O(1) query with O(n log n) preprocessing, but only works for static arrays. Monotonic deque is O(n) total for sliding windows on dynamic/streaming data. Choose sparse table for many queries on static data, monotonic deque for sliding window or streaming scenarios.

---

## Summary

The Monotonic Deque pattern provides O(n) solutions for sliding window extreme problems. The key takeaways are:

1. **Monotonic Order**: Decreasing for max, increasing for min
2. **Two-End Removal**: Pop back (smaller elements), pop front (out of window)
3. **Amortized O(1)**: Each element pushed and popped once
4. **DP Optimization**: Extends to dynamic programming problems
5. **Better than Heap**: O(n) vs O(n log k) for sliding windows

**When to Use:**
- Sliding window maximum/minimum
- DP with range max/min queries
- Constrained optimization problems
- O(n) requirement with ordered processing

**Key Pattern:**
```python
# Decreasing (max at front)
while dq and nums[dq[-1]] < new_val: dq.pop()

# Increasing (min at front)
while dq and nums[dq[-1]] > new_val: dq.pop()
```

This pattern is essential for competitive programming, providing elegant O(n) solutions to sliding window and DP optimization problems.
