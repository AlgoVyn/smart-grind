# Minimum Operations To Reduce X To Zero

## Problem Description

You are given an integer array `nums` and an integer `x`. In one operation, you can either remove the leftmost or the rightmost element from the array `nums` and subtract its value from `x`. Note that this modifies the array for future operations.

Return the minimum number of operations to reduce `x` to exactly `0` if it is possible, otherwise, return `-1`.

## Examples

### Example 1

**Input:**
```python
nums = [1, 1, 4, 2, 3], x = 5
```

**Output:**
```python
2
```

**Explanation:**
The optimal solution is to remove the last two elements to reduce `x` to zero.

### Example 2

**Input:**
```python
nums = [5, 6, 7, 8, 9], x = 4
```

**Output:**
```python
-1
```

### Example 3

**Input:**
```python
nums = [3, 2, 20, 1, 1, 3], x = 10
```

**Output:**
```python
5
```

**Explanation:**
The optimal solution is to remove the last three elements and the first two elements (5 operations in total) to reduce `x` to zero.

## Constraints

- `1 <= nums.length <= 10^5`
- `1 <= nums[i] <= 10^4`
- `1 <= x <= 10^9`

## Solution

```python
from typing import List

class Solution:
    def minOperations(self, nums: List[int], x: int) -> int:
        """
        Find minimum operations to reduce x to zero.
        
        Key insight: The remaining elements form a contiguous subarray
        with sum = total_sum - x. We need to maximize this subarray length.
        """
        total = sum(nums)
        if total < x:
            return -1
        
        target = total - x
        prefix = {0: -1}  # prefix sum -> index
        current = 0
        max_len = -1
        
        for i, num in enumerate(nums):
            current += num
            if current - target in prefix:
                max_len = max(max_len, i - prefix[current - target])
            if current not in prefix:
                prefix[current] = i
        
        if max_len == -1:
            return -1
        return len(nums) - max_len
```

## Explanation

This problem requires finding the minimum operations to reduce `x` to zero by removing elements from the ends of the array.

1. **Key insight**: The remaining elements form a contiguous subarray whose sum equals `total_sum - x`.

2. **Goal**: Maximize the length of this subarray to minimize removals.

3. **Algorithm**:
   - Compute total sum and target (`total - x`)
   - Use a hashmap to store prefix sums and their indices
   - For each position, check if `prefix - target` exists to find a valid subarray
   - Track the maximum subarray length

4. **Return**: `n - max_length` (minimum removals)

## Complexity Analysis

- **Time Complexity:** O(n), where n is the array length
- **Space Complexity:** O(n), for the hashmap storing prefix sums
