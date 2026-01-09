# Product Of Array Except Self

## Problem Description

Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.

The product of any prefix or suffix of `nums` is guaranteed to fit in a 32-bit integer.
You must write an algorithm that runs in O(n) time and without using the division operation.

### Example 1

**Input:** `nums = [1,2,3,4]`  
**Output:** `[24,12,8,6]`

### Example 2

**Input:** `nums = [-1,1,0,-3,3]`  
**Output:** `[0,0,9,0,0]`

### Constraints

- `2 <= nums.length <= 10^5`
- `-30 <= nums[i] <= 30`
- The input is generated such that `answer[i]` is guaranteed to fit in a 32-bit integer.

### Follow up

Can you solve the problem in O(1) extra space complexity? (The output array does not count as extra space for space complexity analysis.)

## Solution

```python
class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        n = len(nums)
        res = [1] * n
        left = 1
        for i in range(n):
            res[i] = left
            left *= nums[i]
        right = 1
        for i in range(n-1, -1, -1):
            res[i] *= right
            right *= nums[i]
        return res
```

## Explanation

Use result array to store prefix products from left. Then multiply with suffix products from right. This avoids division and uses O(1) extra space.

### Step-by-step Approach

1. Initialize result array with 1s.
2. Calculate prefix products from left to right, storing in result.
3. Calculate suffix products from right to left, multiplying with existing result values.
4. Return the result array.

### Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(1) extra (output array doesn't count)
