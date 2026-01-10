# Sort Colors

## Problem Statement

Given an array `nums` with `n` objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue.

We will use the integers `0`, `1`, and `2` to represent the color red, white, and blue, respectively.

You must solve this problem without using the library's sort function.

### Examples

**Example 1:**
```python
Input: nums = [2,0,2,1,1,0]
Output: [0,0,1,1,2,2]
```

**Example 2:**
```python
Input: nums = [2,0,1]
Output: [0,1,2]
```

### Constraints

- `n == nums.length`
- `1 <= n <= 300`
- `nums[i]` is either `0`, `1`, or `2`.

---

## Solution

```python
from typing import List

class Solution:
    def sortColors(self, nums: List[int]) -> None:
        low, mid, high = 0, 0, len(nums) - 1
        
        while mid <= high:
            if nums[mid] == 0:
                nums[low], nums[mid] = nums[mid], nums[low]
                low += 1
                mid += 1
            elif nums[mid] == 1:
                mid += 1
            else:
                nums[mid], nums[high] = nums[high], nums[mid]
                high -= 1
```

---

## Explanation

### Approach

Use the Dutch National Flag algorithm with three pointers to sort the array in-place.

### Step-by-Step Explanation

1. Initialize three pointers: `low = 0`, `mid = 0`, `high = len(nums) - 1`.
2. While `mid <= high`:
   - If `nums[mid] == 0`, swap `nums[low]` and `nums[mid]`, increment `low` and `mid`.
   - If `nums[mid] == 1`, increment `mid`.
   - If `nums[mid] == 2`, swap `nums[mid]` and `nums[high]`, decrement `high`.
3. The array is sorted with `0`s, then `1`s, then `2`s.

### Time Complexity

- **O(n)**, where `n` is the length of the array.

### Space Complexity

- **O(1)**, as it modifies the array in-place.
