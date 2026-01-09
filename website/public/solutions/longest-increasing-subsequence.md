# Longest Increasing Subsequence

## Problem Description

Given an integer array `nums`, return the length of the longest strictly increasing subsequence.

---

## Examples

**Example 1:**

**Input:** `nums = [10,9,2,5,3,7,101,18]`

**Output:** `4`

**Explanation:** The longest increasing subsequence is `[2,3,7,101]`, therefore the length is `4`.

**Example 2:**

**Input:** `nums = [0,1,0,3,2,3]`

**Output:** `4`

**Example 3:**

**Input:** `nums = [7,7,7,7,7,7,7]`

**Output:** `1`

---

## Constraints

- `1 <= nums.length <= 2500`
- `-10^4 <= nums[i] <= 10^4`

---

## Follow Up

Can you come up with an algorithm that runs in `O(n log(n))` time complexity?

---

## Solution

```python
from typing import List

class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        tails = []
        for num in nums:
            left, right = 0, len(tails)
            while left < right:
                mid = (left + right) // 2
                if tails[mid] < num:
                    left = mid + 1
                else:
                    right = mid
            if left == len(tails):
                tails.append(num)
            else:
                tails[left] = num
        return len(tails)
```

---

## Explanation

We use a dynamic approach with binary search. Maintain a list `tails` where `tails[i]` is the smallest tail of all increasing subsequences with length `i+1`.

For each number, use binary search to find the position to replace or append.

The length of `tails` is the LIS length.

---

## Complexity Analysis

- **Time Complexity:** `O(n log n)`, due to binary search for each element.
- **Space Complexity:** `O(n)`, for the `tails` list.
