# Frequency Of The Most Frequent Element

## Problem Description

The frequency of an element is the number of times it occurs in an array.
You are given an integer array nums and an integer k. In one operation, you can choose an index of nums and increment the element at that index by 1.
Return the maximum possible frequency of an element after performing at most k operations.

### Examples

**Example 1:**

**Input:** nums = [1,2,4], k = 5

**Output:** 3

**Explanation:** Increment the first element three times and the second element two times to make nums = [4,4,4]. 4 has a frequency of 3.

**Example 2:**

**Input:** nums = [1,4,8,13], k = 5

**Output:** 2

**Explanation:** There are multiple optimal solutions:
- Increment the first element three times to make nums = [4,4,8,13]. 4 has a frequency of 2.
- Increment the second element four times to make nums = [1,8,8,13]. 8 has a frequency of 2.
- Increment the third element five times to make nums = [1,4,13,13]. 13 has a frequency of 2.

**Example 3:**

**Input:** nums = [3,9,6], k = 2

**Output:** 1

### Constraints

- 1 <= nums.length <= 10^5
- 1 <= nums[i] <= 10^5
- 1 <= k <= 10^5

## Solution

```python
from typing import List

class Solution:
    def maxFrequency(self, nums: List[int], k: int) -> int:
        nums.sort()
        prefix = [0]
        for num in nums:
            prefix.append(prefix[-1] + num)
        
        left = 0
        max_freq = 1
        for right in range(len(nums)):
            cost = (right - left + 1) * nums[right] - (prefix[right + 1] - prefix[left])
            while cost > k and left <= right:
                left += 1
                cost = (right - left + 1) * nums[right] - (prefix[right + 1] - prefix[left])
            max_freq = max(max_freq, right - left + 1)
        return max_freq
```

### Approach

Sort the array.
Use prefix sum for quick range sum calculation.
Use sliding window: for each right, calculate cost to make all in [left, right] equal to nums[right].
If cost > k, move left.
Update max frequency.

### Complexity

**Time Complexity:** O(n log n) for sort, O(n) for window.

**Space Complexity:** O(n) for prefix.
