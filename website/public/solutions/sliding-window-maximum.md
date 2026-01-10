# Sliding Window Maximum

## Problem Description

You are given an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left of the array to the very right. You can only see the `k` numbers in the window. Each time the sliding window moves right by one position.

Return the max sliding window.

### Examples

**Example 1:**
```python
Input: nums = [1,3,-1,-3,5,3,6,7], k = 3
Output: [3,3,5,5,6,7]
```

**Example 2:**
```python
Input: nums = [1], k = 1
Output: [1]
```

### Constraints

- `1 <= nums.length <= 10^5`
- `-10^4 <= nums[i] <= 10^4`
- `1 <= k <= nums.length`

---

## Solution

```python
from typing import List
from collections import deque

class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        if not nums:
            return []
        
        dq = deque()
        result = []
        
        for i in range(len(nums)):
            # Remove elements out of window
            while dq and dq[0] < i - k + 1:
                dq.popleft()
            
            # Remove smaller elements
            while dq and nums[dq[-1]] < nums[i]:
                dq.pop()
            
            dq.append(i)
            
            # Add to result if window is full
            if i >= k - 1:
                result.append(nums[dq[0]])
        
        return result
```

---

## Explanation

### Approach

Use a deque to maintain indices of elements in decreasing order of their values. For each position `i`, remove indices that are out of the current window, remove indices with smaller values than the current element, and add the current index. The front of the deque always holds the index of the maximum element in the current window.

### Step-by-Step Explanation

1. Initialize a deque to store indices.
2. Iterate through each element in the array:
   - Remove indices from the front of the deque that are out of the current window (`i - k + 1`).
   - Remove indices from the back of the deque where the corresponding values are less than the current element.
   - Add the current index to the deque.
   - If the window is full (`i >= k - 1`), add the value at the front of the deque to the result.
3. Return the result list.

### Time Complexity

- **O(n)** — Each element is added and removed from the deque at most once.

### Space Complexity

- **O(k)** — For the deque storing up to `k` indices.
