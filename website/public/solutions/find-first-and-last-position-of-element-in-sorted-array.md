# Find First And Last Position Of Element In Sorted Array

## Problem Description

Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value.
If target is not found in the array, return [-1, -1].
You must write an algorithm with O(log n) runtime complexity.

---

## Constraints

- 0 <= nums.length <= 105
- -109 <= nums[i] <= 109
- nums is a non-decreasing array.
- -109 <= target <= 109

---

## Example 1

**Input:**
```python
nums = [5,7,7,8,8,10], target = 8
```

**Output:**
```python
[3,4]
```

---

## Example 2

**Input:**
```python
nums = [5,7,7,8,8,10], target = 6
```

**Output:**
```python
[-1,-1]
```

---

## Example 3

**Input:**
```python
nums = [], target = 0
```

**Output:**
```python
[-1,-1]
```

---

## Solution

```python
from typing import List

class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
        def find_left():
            l, r = 0, len(nums) - 1
            while l <= r:
                m = (l + r) // 2
                if nums[m] < target:
                    l = m + 1
                else:
                    r = m - 1
            return l
        
        def find_right():
            l, r = 0, len(nums) - 1
            while l <= r:
                m = (l + r) // 2
                if nums[m] <= target:
                    l = m + 1
                else:
                    r = m - 1
            return r
        
        left = find_left()
        if left >= len(nums) or nums[left] != target:
            return [-1, -1]
        right = find_right()
        return [left, right]
```

---

## Explanation

This problem requires finding the first and last positions of a target value in a sorted array using binary search for O(log N) time.

### Step-by-Step Explanation:

1. **Find leftmost position:**
   - Use binary search to find the smallest index where nums[mid] >= target.
   - This gives the potential start of the range.

2. **Find rightmost position:**
   - Use binary search to find the largest index where nums[mid] <= target.
   - This gives the end of the range.

3. **Validation:**
   - Check if the left index is within bounds and equals the target.
   - If not, return [-1, -1].

4. **Edge cases:**
   - Empty array or target not found handled by checks.

### Time Complexity:

O(log N), as two binary searches are performed.

### Space Complexity:

O(1), using only a few variables.
