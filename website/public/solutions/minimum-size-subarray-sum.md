# Minimum Size Subarray Sum

## Problem Description

Given an array of positive integers `nums` and a positive integer `target`, return the minimal length of a subarray whose sum is greater than or equal to `target`. If there is no such subarray, return `0` instead.

---

## Examples

### Example 1

**Input:**
```python
target = 7, nums = [2, 3, 1, 2, 4, 3]
```

**Output:**
```python
2
```

**Explanation:**
The subarray `[4, 3]` has the minimal length under the problem constraint.

### Example 2

**Input:**
```python
target = 4, nums = [1, 4, 4]
```

**Output:**
```python
1
```

### Example 3

**Input:**
```python
target = 11, nums = [1, 1, 1, 1, 1, 1, 1, 1]
```

**Output:**
```python
0
```

---

## Constraints

- `1 <= target <= 10^9`
- `1 <= nums.length <= 10^5`
- `1 <= nums[i] <= 10^4`

**Follow-up:** If you have figured out the O(n) solution, try coding another solution of which the time complexity is O(n log(n)).

---

## Solution

```python
from typing import List

class Solution:
    def minSubArrayLen(self, target: int, nums: List[int]) -> int:
        """
        Find minimal length subarray with sum >= target using sliding window.
        
        Uses two pointers to maintain a window of elements.
        """
        n = len(nums)
        min_length = float('inf')
        current_sum = 0
        left = 0
        
        for right in range(n):
            current_sum += nums[right]
            
            # Shrink window from left while sum is sufficient
            while current_sum >= target and left <= right:
                min_length = min(min_length, right - left + 1)
                current_sum -= nums[left]
                left += 1
        
        return min_length if min_length != float('inf') else 0
```

---

## Explanation

This problem requires finding the minimal length of a contiguous subarray with sum at least target.

1. **Sliding window technique**: Use two pointers, `left` and `right`, to maintain a window.

2. **Expand right**: Add `nums[right]` to `current_sum`.

3. **Contract left**: While `current_sum >= target`:
   - Update minimum length
   - Subtract `nums[left]` from sum
   - Increment `left` to shrink window

4. **Return**: Minimum length found, or 0 if none exists.

---

## Complexity Analysis

- **Time Complexity:** O(n), where n is the array length (each element is added and removed at most once)
- **Space Complexity:** O(1), using only a few variables
