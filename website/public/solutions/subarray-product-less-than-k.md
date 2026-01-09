# Subarray Product Less Than K

## Problem Description

Given an array of integers `nums` and an integer `k`, return the number of contiguous subarrays where the product of all the elements in the subarray is strictly less than `k`.

**Example 1:**

Input: `nums = [10,5,2,6]`, `k = 100`
Output: `8`

Explanation: The 8 subarrays that have product less than 100 are:
`[10]`, `[5]`, `[2]`, `[6]`, `[10, 5]`, `[5, 2]`, `[2, 6]`, `[5, 2, 6]`

Note that `[10, 5, 2]` is not included as the product of 100 is not strictly less than k.

**Example 2:**

Input: `nums = [1,2,3]`, `k = 0`
Output: `0`

## Constraints

- `1 <= nums.length <= 3 * 10^4`
- `1 <= nums[i] <= 1000`
- `0 <= k <= 10^6`

## Solution

```python
from typing import List

def numSubarrayProductLessThanK(nums: List[int], k: int) -> int:
    if k <= 1:
        return 0

    prod = 1
    left = 0
    count = 0

    for right in range(len(nums)):
        prod *= nums[right]
        while prod >= k and left <= right:
            prod //= nums[left]
            left += 1
        count += right - left + 1

    return count
```

## Explanation

To count subarrays with product < k, use a sliding window approach.

1. If `k <= 1`, no subarray qualifies since products are at least 1.
2. Initialize `prod = 1`, `left = 0`, `count = 0`.
3. For each `right` from 0 to n-1:
   - Multiply `prod` by `nums[right]`.
   - While `prod >= k` and `left <= right`, divide `prod` by `nums[left]` and increment `left`.
   - Add `right - left + 1` to `count`, as all subarrays from `left` to `right` have product < k.
4. Return `count`.

This ensures O(n) time by moving pointers at most n times.

**Time Complexity:** O(n), each element processed at most twice.

**Space Complexity:** O(1), constant extra space.
