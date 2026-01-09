# Sort Array By Parity

## Problem Description

Given an integer array `nums`, move all even integers to the front of the array followed by all odd integers.

Return any array that satisfies this condition.

---

## Examples

**Example 1:**
```python
Input: nums = [3,1,2,4]
Output: [2,4,3,1]
```

**Example 2:**
```python
Input: nums = [0]
Output: [0]
```

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `1 <= nums.length <= 5000` | Array length |
| `0 <= nums[i] <= 5000` | Element value |

---

## Solution

```python
from typing import List

class Solution:
    def sortArrayByParity(self, nums: List[int]) -> List[int]:
        left, right = 0, len(nums) - 1
        while left < right:
            if nums[left] % 2 == 0:
                left += 1
            else:
                nums[left], nums[right] = nums[right], nums[left]
                right -= 1
        return nums
```

---

## Explanation

### Approach: Two Pointers

1. **Left pointer** moves right, skipping even numbers
2. **Right pointer** moves left
3. When left points to odd, swap with right
4. Continue until pointers meet

### Time Complexity

- **O(n)** — Single pass through array

### Space Complexity

- **O(1)** — In-place modification

---


## Related Problems

- [Sort Array By Parity](https://leetcode.com/problems/sort-array-by-parity/)
