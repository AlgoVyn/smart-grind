# Squares Of A Sorted Array

## Problem Description

Given a sorted array `nums` in non-decreasing order, return an array of the squares of each number, also sorted in non-decreasing order.

**Follow-up:** Solve in O(n) time using a two-pointer approach.

---

## Examples

**Example 1:**
```
Input: nums = [-4,-1,0,3,10]
Output: [0,1,9,16,100]

Explanation: After squaring → [16,1,0,9,100], sorted → [0,1,9,16,100]
```

**Example 2:**
```
Input: nums = [-7,-3,2,3,11]
Output: [4,9,9,49,121]
```

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `1 <= nums.length <= 10^4` | Array length |
| `-10^4 <= nums[i] <= 10^4` | Element value |

---

## Solution

```python
from typing import List

class Solution:
    def sortedSquares(self, nums: List[int]) -> List[int]:
        n = len(nums)
        result = [0] * n
        left, right = 0, n - 1
        
        for i in range(n - 1, -1, -1):
            if abs(nums[left]) > abs(nums[right]):
                result[i] = nums[left] ** 2
                left += 1
            else:
                result[i] = nums[right] ** 2
                right -= 1
        
        return result
```

---

## Explanation

### Approach: Two Pointers

1. **Pointers at both ends:** Largest magnitudes are at edges
2. **Fill from end:** Compare absolute values, place larger square
3. **Move inward:** Increment/decrement pointers

### Time Complexity

- **O(n)** — Single pass through array

### Space Complexity

- **O(n)** — Output array

---

## Related Problems

- [Squares of a Sorted Array](https://leetcode.com/problems/squares-of-a-sorted-array/)
