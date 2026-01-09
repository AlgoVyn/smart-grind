# Longest Continuous Subarray With Absolute Diff Less Than Or Equal To Limit

## Problem Description

Given an array of integers `nums` and an integer `limit`, return the size of the longest non-empty subarray such that the absolute difference between any two elements of this subarray is less than or equal to `limit`.

---

## Examples

**Example 1:**

**Input:** `nums = [8,2,4,7]`, `limit = 4`

**Output:** `2`

**Explanation:**
- `[8]` with maximum absolute diff `|8-8| = 0 <= 4`.
- `[8,2]` with maximum absolute diff `|8-2| = 6 > 4`.
- `[8,2,4]` with maximum absolute diff `|8-2| = 6 > 4`.
- `[8,2,4,7]` with maximum absolute diff `|8-2| = 6 > 4`.
- `[2]` with maximum absolute diff `|2-2| = 0 <= 4`.
- `[2,4]` with maximum absolute diff `|2-4| = 2 <= 4`.
- `[2,4,7]` with maximum absolute diff `|2-7| = 5 > 4`.
- `[4]` with maximum absolute diff `|4-4| = 0 <= 4`.
- `[4,7]` with maximum absolute diff `|4-7| = 3 <= 4`.
- `[7]` with maximum absolute diff `|7-7| = 0 <= 4`.

Therefore, the size of the longest subarray is `2`.

**Example 2:**

**Input:** `nums = [10,1,2,4,7,2]`, `limit = 5`

**Output:** `4`

**Explanation:** The subarray `[2,4,7,2]` is the longest since the maximum absolute diff is `|2-7| = 5 <= 5`.

**Example 3:**

**Input:** `nums = [4,2,2,2,4,4,2,2]`, `limit = 0`

**Output:** `3`

---

## Constraints

- `1 <= nums.length <= 10^5`
- `1 <= nums[i] <= 10^9`
- `0 <= limit <= 10^9`

---

## Solution

```python
from typing import List
from collections import deque

class Solution:
    def longestSubarray(self, nums: List[int], limit: int) -> int:
        max_d = deque()
        min_d = deque()
        left = 0
        max_len = 0
        for right in range(len(nums)):
            while max_d and nums[max_d[-1]] <= nums[right]:
                max_d.pop()
            max_d.append(right)
            while min_d and nums[min_d[-1]] >= nums[right]:
                min_d.pop()
            min_d.append(right)
            while nums[max_d[0]] - nums[min_d[0]] > limit:
                if max_d[0] == left:
                    max_d.popleft()
                if min_d[0] == left:
                    min_d.popleft()
                left += 1
            max_len = max(max_len, right - left + 1)
        return max_len
```

---

## Explanation

We use a sliding window with two deques to maintain the maximum and minimum values in the current window.

For each `right` pointer, add the element to both deques, maintaining decreasing order for max and increasing order for min.

If the difference between max and min exceeds `limit`, move the `left` pointer, removing elements from deques if they are out of window.

Update the max length.

---

## Complexity Analysis

- **Time Complexity:** `O(n)`, each element is added and removed from deques at most once.
- **Space Complexity:** `O(n)`, for the deques.
