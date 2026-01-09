# Move Zeroes

## Problem Description

Given an integer array `nums`, move all `0`'s to the end of it while maintaining the relative order of the non-zero elements.

**Note:** You must do this in-place without making a copy of the array.

---

## Examples

### Example 1

**Input:**
```python
nums = [0, 1, 0, 3, 12]
```

**Output:**
```python
[1, 3, 12, 0, 0]
```

### Example 2

**Input:**
```python
nums = [0]
```

**Output:**
```python
[0]
```

---

## Constraints

- `1 <= nums.length <= 10^4`
- `-2^31 <= nums[i] <= 2^31 - 1`

**Follow-up:** Could you minimize the total number of operations done?

---

## Solution

```python
from typing import List

class Solution:
    def moveZeroes(self, nums: List[int]) -> None:
        """
        Moves all zeros to the end of the array in-place.
        
        Uses a two-pointer approach where last_non_zero points to
        the position where the next non-zero element should be placed.
        """
        last_non_zero = 0
        
        for i in range(len(nums)):
            if nums[i] != 0:
                # Swap current non-zero element to its correct position
                nums[last_non_zero], nums[i] = nums[i], nums[last_non_zero]
                last_non_zero += 1
```

---

## Explanation

This problem requires moving all zeros to the end of the array while maintaining the relative order of non-zero elements.

1. **Two-pointer technique**: Use a pointer `last_non_zero` to track the position where the next non-zero element should be placed.

2. **Single pass**: Iterate through the array once:
   - When a non-zero element is found, swap it with the element at `last_non_zero`
   - Increment `last_non_zero`

3. This approach ensures all non-zero elements maintain their relative order and all zeros are moved to the end.

---

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of the array
- **Space Complexity:** O(1), in-place algorithm using only constant extra space
