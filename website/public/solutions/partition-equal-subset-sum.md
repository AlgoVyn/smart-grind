# Partition Equal Subset Sum

## Problem Description

Given an integer array `nums`, return `true` if you can partition the array into two subsets such that the sum of the elements in both subsets is equal or `false` otherwise.

### Example 1

**Input:** `nums = [1,5,11,5]`  
**Output:** `true`

**Explanation:** The array can be partitioned as `[1, 5, 5]` and `[11]`.

### Example 2

**Input:** `nums = [1,2,3,5]`  
**Output:** `false`

**Explanation:** The array cannot be partitioned into equal sum subsets.

### Constraints

- `1 <= nums.length <= 200`
- `1 <= nums[i] <= 100`

---

## Solution

```python
class Solution:
    def canPartition(self, nums: List[int]) -> bool:
        total = sum(nums)
        if total % 2 != 0:
            return False
        target = total // 2
        dp = [False] * (target + 1)
        dp[0] = True
        for num in nums:
            for j in range(target, num - 1, -1):
                dp[j] = dp[j] or dp[j - num]
        return dp[target]
```

---

## Explanation

This problem requires determining if an array can be partitioned into two subsets with equal sums. First, calculate the total sum of the array. If the sum is odd, it's impossible to split into two equal parts, so return false. If even, check if a subset sums to half the total sum.

Use dynamic programming: create a boolean array `dp` where `dp[j]` indicates if sum `j` can be achieved. Initialize `dp[0] = true`. For each number, update the `dp` array from back to front to avoid using the same element multiple times.

### Step-by-step Approach

1. Calculate the total sum of the array.
2. If the total is odd, return `false` immediately.
3. Set target as half of the total sum.
4. Initialize a DP array where `dp[j]` is `True` if sum `j` can be achieved.
5. For each number in the array, update the DP array from high to low.
6. Return `dp[target]`.

### Complexity Analysis

- **Time Complexity:** O(n * sum), where n is array length and sum is total sum.
- **Space Complexity:** O(sum).

The solution uses 0/1 knapsack approach for subset sum.
