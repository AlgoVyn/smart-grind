# 3sum Smaller

## Problem Description
## Solution

```python
from typing import List

class Solution:
    def threeSumSmaller(self, nums: List[int], target: int) -> int:
        nums.sort()
        count = 0
        n = len(nums)
        for i in range(n - 2):
            left, right = i + 1, n - 1
            while left < right:
                if nums[i] + nums[left] + nums[right] < target:
                    count += right - left
                    left += 1
                else:
                    right -= 1
        return count
```

## Explanation
To solve the 3Sum Smaller problem, we need to count the number of triplets where the sum is less than the target. The optimal approach is to sort the array and use a two-pointer technique.

After sorting the array, we iterate through each possible first element at index i. For each i, we use two pointers: left starting at i+1 and right at the end.

If the sum of nums[i], nums[left], and nums[right] is less than the target, then all elements from left to right-1 will also form a valid triplet with i, since the array is sorted. So, we add (right - left) to the count and increment left.

If the sum is not less than the target, we decrement right to reduce the sum.

This efficiently counts all valid triplets.

Time Complexity: O(n^2), where n is the length of the array, due to sorting (O(n log n)) and the two-pointer loops (O(n^2)).

Space Complexity: O(1) additional space, as sorting is done in place.
