# Longest Increasing Subsequence Ii

## Problem Description
You are given an integer array `nums` and an integer `k`. Find the longest subsequence of `nums` that meets the following requirements:

- The subsequence is strictly increasing and
- The difference between adjacent elements in the subsequence is at most `k`.

Return the length of the longest subsequence that meets the requirements.

A subsequence is an array that can be derived from another array by deleting some or no elements without changing the order of the remaining elements.

---

## Examples

**Example 1:**

**Input:**
```
nums = [4,2,1,4,3,4,5,8,15], k = 3
```

**Output:**
```
5
```

**Explanation:** The longest subsequence that meets the requirements is `[1,3,4,5,8]`. The subsequence has a length of 5, so we return 5. Note that the subsequence `[1,3,4,5,8,15]` does not meet the requirements because `15 - 8 = 7` is larger than 3.

**Example 2:**

**Input:**
```
nums = [7,4,5,1,8,12,4,7], k = 5
```

**Output:**
```
4
```

**Explanation:** The longest subsequence that meets the requirements is `[4,5,8,12]`. The subsequence has a length of 4, so we return 4.

**Example 3:**

**Input:**
```
nums = [1,5], k = 1
```

**Output:**
```
1
```

**Explanation:** The longest subsequence that meets the requirements is `[1]`. The subsequence has a length of 1, so we return 1.

---

## Constraints

- `1 <= nums.length <= 10^5`
- `1 <= nums[i], k <= 10^5`

## Solution

```python
from typing import List

class Solution:
    def lengthOfLIS(self, nums: List[int], k: int) -> int:
        if not nums:
            return 0
        max_val = max(nums)
        tree = [0] * (max_val + 2)
        
        def update(idx, val):
            idx += 1
            while idx < len(tree):
                tree[idx] = max(tree[idx], val)
                idx += idx & -idx
        
        def query(idx):
            idx += 1
            res = 0
            while idx > 0:
                res = max(res, tree[idx])
                idx -= idx & -idx
            return res
        
        ans = 1
        for num in nums:
            left = max(0, num - k)
            prev = query(left)
            curr = 1 + prev
            ans = max(ans, curr)
            update(num, curr)
        return ans
```

## Explanation
This problem requires finding the longest strictly increasing subsequence where adjacent elements differ by at most k.

We use dynamic programming with a Fenwick tree (binary indexed tree) for efficient range maximum queries.

`dp[i]` represents the length of the longest subsequence ending at `nums[i]`.

For each num, query the maximum dp value for values in `[num - k, num - 1]`, add 1, update the tree at num with this value.

The Fenwick tree supports range max queries and point updates in O(log M) time, where M is the max value (10^5).

### Time Complexity:
- O(n log M), where n is the length of nums and M is the maximum value

### Space Complexity:
- O(M), where M is the maximum value in nums
