# Find K Th Smallest Pair Distance

## Problem Description
The distance of a pair of integers a and b is defined as the absolute difference between a and b.
Given an integer array nums and an integer k, return the kth smallest distance among all the pairs nums[i] and nums[j] where 0 <= i < j < nums.length.
 
Example 1:

Input: nums = [1,3,1], k = 1
Output: 0
Explanation: Here are all the pairs:
(1,3) -> 2
(1,1) -> 0
(3,1) -> 2
Then the 1st smallest distance pair is (1,1), and its distance is 0.

Example 2:

Input: nums = [1,1,1], k = 2
Output: 0

Example 3:

Input: nums = [1,6,1], k = 3
Output: 5

 
Constraints:

n == nums.length
2 <= n <= 104
0 <= nums[i] <= 106
1 <= k <= n * (n - 1) / 2
## Solution

```python
from typing import List

class Solution:
    def smallestDistancePair(self, nums: List[int], k: int) -> int:
        nums.sort()
        n = len(nums)
        
        def count_pairs(mid):
            count = 0
            j = 0
            for i in range(n):
                while j < n and nums[j] - nums[i] <= mid:
                    j += 1
                count += j - i - 1
            return count
        
        low, high = 0, nums[-1] - nums[0]
        while low < high:
            mid = (low + high) // 2
            if count_pairs(mid) >= k:
                high = mid
            else:
                low = mid + 1
        return low
```

## Explanation
This problem requires finding the k-th smallest absolute difference between any two elements in the array.

1. **Sort the array:**
   - Sorting allows efficient pair difference calculation.

2. **Binary search on distance:**
   - Search for the smallest distance where the number of pairs with difference <= distance is at least k.
   - Low = 0, high = max - min.

3. **Count pairs with difference <= mid:**
   - Use two pointers: for each i, find the farthest j where nums[j] - nums[i] <= mid.
   - Count the pairs for each i.

4. **Adjust binary search:**
   - If count >= k, the k-th smallest is <= mid, so high = mid.
   - Else, low = mid + 1.

**Time Complexity:** O(N log N + N log D), where D is the max difference (10^6), due to sorting and binary search with O(N) count.

**Space Complexity:** O(1) extra space besides the input.
