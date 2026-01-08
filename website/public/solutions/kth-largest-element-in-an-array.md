# Kth Largest Element In An Array

## Problem Description
[Link to problem](https://leetcode.com/problems/kth-largest-element-in-an-array/)

Given an integer array nums and an integer k, return the kth largest element in the array.
Note that it is the kth largest element in the sorted order, not the kth distinct element.
Can you solve it without sorting?
 
Example 1:
Input: nums = [3,2,1,5,6,4], k = 2
Output: 5
Example 2:
Input: nums = [3,2,3,1,2,4,5,5,6], k = 4
Output: 4

 
Constraints:

1 <= k <= nums.length <= 105
-104 <= nums[i] <= 104


## Solution

```python
import heapq
from typing import List

class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        heap = []
        for num in nums:
            heapq.heappush(heap, num)
            if len(heap) > k:
                heapq.heappop(heap)
        return heap[0]
```

## Explanation
We use a min-heap to keep track of the k largest elements. As we iterate through the array, we push each number onto the heap. If the heap size exceeds k, we pop the smallest element.

After processing all elements, the heap contains the k largest elements, and the smallest one in the heap (the root) is the kth largest.

Time complexity: O(n log k), where n is the number of elements, due to heap operations.
Space complexity: O(k), for storing the heap.
