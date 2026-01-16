# Sliding Window Maximum

## Problem Description

You are given an integer array `nums` and an integer `k`, where `k` is the size of the sliding window. The sliding window moves from the left end of the array to the right end, and you can only see the `k` numbers in the window. Return the list of maximum values in each sliding window.

Given an array `nums` and an integer `k`, return the max of each sliding window as it moves from left to right across the array.

---

## Examples

### Example 1

**Input:**
```python
nums = [1,3,-1,-3,5,3,6,7], k = 3
```

**Output:**
```python
[3,3,5,5,6,7]
```

**Explanation:**
```
Window position                Max
---------------               -----
[1  3  -1] -3  5  3  6  7       3
 1 [3  -1  -3] 5  3  6  7       3
 1  3 [-1  -3  5] 3  6  7       5
 1  3  -1 [-3  5  3] 6  7       5
 1  3  -1  -3 [5  3  6] 7       6
 1  3  -1  -3  5 [3  6  7]      7
```

### Example 2

**Input:**
```python
nums = [1], k = 1
```

**Output:**
```python
[1]
```

### Example 3

**Input:**
```python
nums = [9,8,7,6,5,4,3,2,1], k = 3
```

**Output:**
```python
[9,8,7,6,5,4,3]
```

**Explanation:** The array is in decreasing order, so each window's maximum is the leftmost element.

### Example 4

**Input:**
```python
nums = [4,-2], k = 1
```

**Output:**
```python
[4, -2]
```

---

## Constraints

- `1 <= nums.length <= 10^5`
- `-10^4 <= nums[i] <= 10^4`
- `1 <= k <= nums.length`

---

## Intuition

The problem requires finding the maximum element in each contiguous subarray of size `k`. A naive approach would be to iterate through each window and find the maximum by scanning all `k` elements, resulting in O(n*k) time complexity. However, we can do much better.

The key insight is that we need a data structure that:
1. Can quickly access the maximum element (O(1))
2. Can efficiently add new elements as the window slides (O(1) or O(log k))
3. Can efficiently remove elements that are no longer in the window (O(1) or O(log k))

A **monotonic deque** (double-ended queue) perfectly fits these requirements!

---

## Solution Approaches

### Approach 1: Brute Force (Naive)

Scan each window and find the maximum element by iterating through all `k` elements.

```python
from typing import List

class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        if not nums or k == 0:
            return []
        
        result = []
        n = len(nums)
        
        for i in range(n - k + 1):
            current_max = nums[i]
            for j in range(i + 1, i + k):
                current_max = max(current_max, nums[j])
            result.append(current_max)
        
        return result
```

**Time Complexity:** O(n * k)  
**Space Complexity:** O(1) extra space (excluding output)

---

### Approach 2: Monotonic Deque (Optimal)

Use a deque to maintain indices of elements in decreasing order. The front of the deque always contains the index of the maximum element for the current window.

```python
from typing import List
from collections import deque

class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        if not nums or k == 0:
            return []
        
        n = len(nums)
        result = []
        dq = deque()  # Stores indices
        
        for i in range(n):
            # Remove indices that are out of the current window
            while dq and dq[0] <= i - k:
                dq.popleft()
            
            # Remove indices of elements smaller than current element
            # These can never be maximum in any window
            while dq and nums[dq[-1]] < nums[i]:
                dq.pop()
            
            # Add current element's index
            dq.append(i)
            
            # Start adding results after we've processed k elements
            if i >= k - 1:
                result.append(nums[dq[0]])
        
        return result
```

**Time Complexity:** O(n), each element is pushed and popped from the deque at most once  
**Space Complexity:** O(k), the deque stores at most k elements

---

### Approach 3: Max-Heap (Priority Queue)

Use a max-heap to keep track of the maximum element. We need to handle stale elements that are no longer in the window.

```python
import heapq
from typing import List

class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        if not nums or k == 0:
            return []
        
        n = len(nums)
        result = []
        # Max-heap: store (-value, index) to simulate max-heap
        heap = [(-nums[i], i) for i in range(k)]
        heapq.heapify(heap)
        
        for i in range(k, n):
            # The max element is at the top
            result.append(-heap[0][0])
            
            # Add new element
            heapq.heappush(heap, (-nums[i], i))
            
            # Remove elements that are out of window
            while heap and heap[0][1] <= i - k:
                heapq.heappop(heap)
        
        # Add the last window's max
        result.append(-heap[0][0])
        
        return result
```

**Time Complexity:** O(n log k)  
**Space Complexity:** O(k)

---

### Approach 4: Divide and Conquer with Segment Tree

Build a segment tree that can answer range maximum queries in O(log n) time. Each window query is O(log n), resulting in O(n log n) total time.

```python
from typing import List

class SegmentTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.size = 1
        while self.size < self.n:
            self.size *= 2
        self.tree = [float('-inf')] * (2 * self.size)
        
        # Build the segment tree
        for i in range(self.n):
            self.tree[self.size + i] = arr[i]
        for i in range(self.size - 1, 0, -1):
            self.tree[i] = max(self.tree[2 * i], self.tree[2 * i + 1])
    
    def query(self, left, right):
        """Query maximum in range [left, right)"""
        left += self.size
        right += self.size
        result = float('-inf')
        while left < right:
            if left % 2 == 1:
                result = max(result, self.tree[left])
                left += 1
            if right % 2 == 1:
                right -= 1
                result = max(result, self.tree[right])
            left //= 2
            right //= 2
        return result

class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        if not nums or k == 0:
            return []
        
        seg_tree = SegmentTree(nums)
        result = []
        
        for i in range(len(nums) - k + 1):
            max_val = seg_tree.query(i, i + k)
            result.append(max_val)
        
        return result
```

**Time Complexity:** O(n log n) for building + O(n log k) for queries  
**Space Complexity:** O(n)

---

## Comparison of Approaches

| Approach | Time Complexity | Space Complexity | Notes |
|----------|-----------------|------------------|-------|
| Brute Force | O(n * k) | O(1) | Simple but inefficient for large k |
| Monotonic Deque | O(n) | O(k) | **Optimal solution** |
| Max-Heap | O(n log k) | O(k) | Good but not as efficient as deque |
| Segment Tree | O(n log n) | O(n) | Overkill for this problem |

---

## Step-by-Step Walkthrough (Monotonic Deque)

Let's trace through Example 1: `nums = [1,3,-1,-3,5,3,6,7], k = 3`

```
Initial: dq = [], result = []

i=0, num=1:
  dq = [0] (store index 0)
  i < k-1, no result yet

i=1, num=3:
  Pop smaller: pop index 0 (1 < 3)
  dq = []
  dq = [1] (store index 1)
  i < k-1, no result yet

i=2, num=-1:
  No pop (dq[-1]=1, nums[1]=3 > -1)
  dq = [1, 2]
  i >= k-1, result.append(nums[dq[0]]) = nums[1] = 3
  result = [3]

i=3, num=-3:
  No pop (dq[-1]=2, nums[2]=-1 > -3)
  dq = [1, 2, 3]
  Remove out-of-window: dq[0]=1 <= 3-3=0? No
  result.append(nums[dq[0]]) = nums[1] = 3
  result = [3, 3]

i=4, num=5:
  Pop smaller: pop index 3 (-3 < 5), pop index 2 (-1 < 5)
  dq = [1]
  Pop smaller: pop index 1 (3 < 5)
  dq = []
  dq = [4]
  Remove out-of-window: dq[0]=4 <= 4-3=1? No
  result.append(nums[dq[0]]) = nums[4] = 5
  result = [3, 3, 5]

i=5, num=3:
  No pop (dq[-1]=4, nums[4]=5 > 3)
  dq = [4, 5]
  Remove out-of-window: dq[0]=4 <= 5-3=2? No
  result.append(nums[dq[0]]) = nums[4] = 5
  result = [3, 3, 5, 5]

i=6, num=6:
  Pop smaller: pop index 5 (3 < 6)
  dq = [4]
  Pop smaller: pop index 4 (5 < 6)
  dq = []
  dq = [6]
  Remove out-of-window: dq[0]=6 <= 6-3=3? No
  result.append(nums[dq[0]]) = nums[6] = 6
  result = [3, 3, 5, 5, 6]

i=7, num=7:
  Pop smaller: pop index 6 (6 < 7)
  dq = []
  dq = [7]
  Remove out-of-window: dq[0]=7 <= 7-3=4? No
  result.append(nums[dq[0]]) = nums[7] = 7
  result = [3, 3, 5, 5, 6, 7]

Final result: [3, 3, 5, 5, 6, 7] ✓
```

---

## Time Complexity Analysis

- **Monotonic Deque Approach:** O(n) time, where n is the length of the array
  - Each element is pushed to the deque exactly once
  - Each element is popped from the deque at most once
  - All other operations are O(1)

---

## Space Complexity Analysis

- **Monotonic Deque Approach:** O(k) space
  - The deque stores at most k indices
  - The output array takes O(n) space

---

## Related Problems

1. **[Minimum of Sliding Window](https://leetcode.com/problems/sliding-window-maximum/)** (LeetCode 239) - Similar problem but find minimum instead of maximum
2. **[Daily Temperatures](https://leetcode.com/problems/daily-temperatures/)** (LeetCode 739) - Find days until warmer temperature using similar technique
3. **[Longest Continuous Subarray with Absolute Diff Less Than or Equal to Limit](https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit/)** (LeetCode 1438) - Uses sliding window with balanced BST
4. **[Subarray Maximum Minimum Query](https://leetcode.com/problems/sum-of-subarray-minimums/)** (LeetCode 1856) - Uses monotonic stack and prefix/suffix arrays
5. **[K Maximum Sum Combinations of Two Arrays](https://leetcode.com/problems/find-k-pairs-with-smallest-sums/)** - Related to finding top k elements

---

## Video Tutorial Links

1. **NeetCode - Sliding Window Maximum**: https://www.youtube.com/watch?v=Mqv-pKvyJbM
2. **Back To Back SWE - Monotonic Queue**: https://www.youtube.com/watch?v=McT1l-2bJ7E
3. **Abdul Bari - Sliding Window Maximum**: https://www.youtube.com/watch?v=K0jQvdKCCs8
4. **LeetCode Official Solution**: https://www.youtube.com/watch?v=FcP-2G8Y7KY

---

## Follow-up Questions

1. **How would you modify the solution to return the indices of maximum elements instead of the values?**

   ```python
   # Instead of appending nums[dq[0]], append dq[0]
   result.append(dq[0])
   ```

2. **How would you handle multiple maximum elements in a window?**

   The current solution naturally handles this - if there are multiple equal maximums, only the most recent one will be in the deque (since we use `<` not `<=` in the pop condition). If you need all indices, you'd need to modify the approach.

3. **How would you extend this to find the top k maximum elements in each window?**

   This would require a different data structure like a balanced BST or a heap that can store k largest elements.

4. **What if you need to find the minimum AND maximum in each window?**

   You could maintain two deques - one for max (decreasing) and one for min (increasing).

5. **How would you handle a very large k (close to n)?**

   The monotonic deque solution still works efficiently with O(n) time and O(k) space.

6. **Can you solve this with a sliding window and balanced BST?**

   Yes, use a balanced BST (like TreeMap in Java or SortedList in Python) to maintain the k elements, allowing O(log k) insertions and deletions.

---

## References

- LeetCode Problem 239: https://leetcode.com/problems/sliding-window-maximum/
- Monotonic Queue Technique: https://en.wikipedia.org/wiki/Monotonic_queue

