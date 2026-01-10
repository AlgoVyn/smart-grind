# Split Array Largest Sum

## Problem Description

Given an integer array `nums` and an integer `k`, split `nums` into `k` non-empty subarrays such that the largest sum of any subarray is minimized.

Return the minimized largest sum of the split.

A subarray is a contiguous part of the array.

### Examples

**Example 1:**
```python
Input: nums = [7,2,5,10,8], k = 2
Output: 18
```

**Example 2:**
```python
Input: nums = [1,2,3,4,5], k = 2
Output: 9
```

### Constraints

- `1 <= nums.length <= 1000`
- `0 <= nums[i] <= 10^6`
- `1 <= k <= min(50, nums.length)`

---

## Solution

```python
from typing import List

class Solution:
    def splitArray(self, nums: List[int], k: int) -> int:
        def can_split(mid: int) -> bool:
            count = 1
            current_sum = 0
            
            for num in nums:
                current_sum += num
                if current_sum > mid:
                    count += 1
                    current_sum = num
                    if count > k:
                        return False
            
            return True
        
        left = max(nums)
        right = sum(nums)
        
        while left < right:
            mid = (left + right) // 2
            if can_split(mid):
                right = mid
            else:
                left = mid + 1
        
        return left
```

---

## Explanation

### Approach

Use binary search on the possible values of the largest subarray sum, ranging from the maximum element to the total sum. For each candidate sum, check if it's possible to split the array into at most `k` subarrays without exceeding that sum.

### Step-by-Step Explanation

1. Set the search range: `low = max(nums)`, `high = sum(nums)`.
2. While `low < high`:
   - Compute `mid = (low + high) // 2`.
   - Check if we can split the array into `<= k` subarrays where each subarray sum `<= mid`.
   - If yes, set `high = mid`.
   - Else, set `low = mid + 1`.
3. The answer is `low`.

### Time Complexity

- **O(n log(sum(nums)))**, due to binary search and O(n) check per iteration.

### Space Complexity

- **O(1)**, excluding the input array.
