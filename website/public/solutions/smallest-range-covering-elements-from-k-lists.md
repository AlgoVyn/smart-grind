# Smallest Range Covering Elements From K Lists

## Problem Description
You have k lists of sorted integers in non-decreasing order. Find the smallest range that includes at least one number from each of the k lists.
We define the range [a, b] is smaller than range [c, d] if b - a < d - c or a < c if b - a == d - c.
 
Example 1:

Input: nums = [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]
Output: [20,24]
Explanation: 
List 1: [4, 10, 15, 24,26], 24 is in range [20,24].
List 2: [0, 9, 12, 20], 20 is in range [20,24].
List 3: [5, 18, 22, 30], 22 is in range [20,24].

Example 2:

Input: nums = [[1,2,3],[1,2,3],[1,2,3]]
Output: [1,1]

 
Constraints:

nums.length == k
1 <= k <= 3500
1 <= nums[i].length <= 50
-105 <= nums[i][j] <= 105
nums[i] is sorted in non-decreasing order.

---

## Solution

```python
from typing import List
import heapq

class Solution:
    def smallestRange(self, nums: List[List[int]]) -> List[int]:
        k = len(nums)
        min_heap = []
        current_max = float('-inf')
        for i in range(k):
            heapq.heappush(min_heap, (nums[i][0], i, 0))
            current_max = max(current_max, nums[i][0])
        min_range = [float('-inf'), float('inf')]
        while min_heap:
            val, list_idx, idx = heapq.heappop(min_heap)
            if current_max - val < min_range[1] - min_range[0]:
                min_range = [val, current_max]
            if idx + 1 < len(nums[list_idx]):
                next_val = nums[list_idx][idx + 1]
                heapq.heappush(min_heap, (next_val, list_idx, idx + 1))
                current_max = max(current_max, next_val)
            else:
                break
        return min_range
```

---

## Explanation

This problem finds the smallest range that includes at least one number from each of k sorted lists.

### Step-by-Step Approach:

1. **Min-Heap Initialization**: Push the first element of each list into a min-heap, track current max.

2. **Expand Range**: While heap is not empty, pop the smallest, check if current_max - val is smaller than current min_range, update if so.

3. **Advance Pointer**: If the popped element's list has more elements, push the next one, update current_max.

4. **Stop**: When a list is exhausted, stop.

5. **Return**: The smallest range found.

### Time Complexity:
- O((k + n) log k), where n is total elements, due to heap operations.

### Space Complexity:
- O(k) for the heap.
