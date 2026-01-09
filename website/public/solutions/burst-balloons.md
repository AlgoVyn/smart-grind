# Burst Balloons

## Problem Description

You are given `n` balloons, indexed from `0` to `n - 1`. Each balloon is painted with a number on it represented by an array `nums`. You are asked to burst all the balloons.
If you burst the ith balloon, you will get `nums[i - 1] * nums[i] * nums[i + 1]` coins. If `i - 1` or `i + 1` goes out of bounds of the array, then treat it as if there is a balloon with a 1 painted on it.
Return the maximum coins you can collect by bursting the balloons wisely.

## Examples

**Example 1:**

**Input:**
```python
nums = [3,1,5,8]
```

**Output:**
```
167
```

**Explanation:**
```python
nums = [3,1,5,8] --> [3,5,8] --> [3,8] --> [8] --> []
coins =  3*1*5    +   3*5*8   +  1*3*8  + 1*8*1 = 167
```

**Example 2:**

**Input:**
```python
nums = [1,5]
```

**Output:**
```
10
```

## Constraints

- `n == nums.length`
- `1 <= n <= 300`
- `0 <= nums[i] <= 100`

## Solution

```python
from typing import List

class Solution:
    def maxCoins(self, nums: List[int]) -> int:
        nums = [1] + nums + [1]
        n = len(nums)
        dp = [[0] * n for _ in range(n)]
        for length in range(2, n):
            for i in range(n - length):
                j = i + length
                for k in range(i + 1, j):
                    dp[i][j] = max(dp[i][j], dp[i][k] + dp[k][j] + nums[i] * nums[k] * nums[j])
        return dp[0][n - 1]
```

## Explanation

This solution uses dynamic programming. We add 1s to the start and end of the array to handle boundary cases. `dp[i][j]` represents the maximum coins obtainable from bursting balloons from index `i` to `j`. For each subarray, we consider each balloon `k` as the last one burst, adding the coins from bursting it (`nums[i] * nums[k] * nums[j]`) plus the max from left and right subarrays. We iterate over increasing lengths and positions to fill the DP table.

## Time Complexity
**O(n^3)**, due to three nested loops over the array.

## Space Complexity
**O(n^2)**, for the DP table.
