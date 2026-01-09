# Longest Increasing Subsequence II

## Problem Description

You are given an integer array `nums` and an integer `k`. Find the longest subsequence of `nums` that meets the following requirements:

- The subsequence is **strictly increasing**
- The difference between adjacent elements in the subsequence is at most `k`

Return the length of the longest subsequence that meets the requirements.

A **subsequence** is an array that can be derived from another array by deleting some or no elements without changing the order of the remaining elements.

---

## Examples

### Example 1

**Input:**
```python
nums = [4, 2, 1, 4, 3, 4, 5, 8, 15], k = 3
```

**Output:**
```python
5
```

**Explanation:** The longest valid subsequence is `[1, 3, 4, 5, 8]` with length `5`. The subsequence `[1, 3, 4, 5, 8, 15]` is invalid because `15 - 8 = 7 > 3`.

### Example 2

**Input:**
```python
nums = [7, 4, 5, 1, 8, 12, 4, 7], k = 5
```

**Output:**
```python
4
```

**Explanation:** The longest valid subsequence is `[4, 5, 8, 12]` with length `4`.

### Example 3

**Input:**
```python
nums = [1, 5], k = 1
```

**Output:**
```python
1
```

**Explanation:** The longest valid subsequence is `[1]` (or `[5]`) with length `1`.

---

## Constraints

- `1 <= nums.length <= 10^5`
- `1 <= nums[i], k <= 10^5`

---

## Solution

```python
from typing import List

class Solution:
    def lengthOfLIS(self, nums: List[int], k: int) -> int:
        if not nums:
            return 0
        max_val = max(nums)
        tree = [0] * (max_val + 2)
        
        def update(idx: int, val: int) -> None:
            idx += 1
            while idx < len(tree):
                tree[idx] = max(tree[idx], val)
                idx += idx & -idx
        
        def query(idx: int) -> int:
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

---

## Explanation

This problem requires finding the longest strictly increasing subsequence where adjacent elements differ by at most `k`.

### Dynamic Programming with Fenwick Tree

We use dynamic programming where `dp[i]` represents the length of the longest valid subsequence ending at `nums[i]`.

### Fenwick Tree (Binary Indexed Tree)

The Fenwick tree supports:
- **Range Maximum Query**: Find the maximum `dp` value for elements in range `[num - k, num - 1]`
- **Point Update**: Update the tree with the new `dp` value at position `num`

### Algorithm

1. Initialize a Fenwick tree with size `max(nums) + 2`
2. For each number `num` in `nums`:
   - Query the maximum `dp` value for values in `[max(0, num - k), num - 1]`
   - The current `dp` value is `1 + query_result`
   - Update the tree at position `num` with this value
3. Track and return the maximum `dp` value

---

## Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | `O(n log M)` — `n` is array length, `M` is max value (`10^5`) |
| **Space** | `O(M)` — Fenwick tree size based on maximum value |
