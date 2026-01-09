# Peak Index In A Mountain Array

## Problem Description

You are given an integer mountain array `arr` of length `n` where the values increase to a peak element and then decrease.
Return the index of the peak element.
Your task is to solve it in O(log(n)) time complexity.

### Example 1

**Input:** `arr = [0,1,0]`  
**Output:** `1`

### Example 2

**Input:** `arr = [0,2,1,0]`  
**Output:** `1`

### Example 3

**Input:** `arr = [0,10,5,2]`  
**Output:** `1`

### Constraints

- `3 <= arr.length <= 10^5`
- `0 <= arr[i] <= 10^6`
- `arr` is guaranteed to be a mountain array.

## Solution

```python
class Solution:
    def peakIndexInMountainArray(self, arr: List[int]) -> int:
        left, right = 0, len(arr) - 1
        while left < right:
            mid = (left + right) // 2
            if arr[mid] < arr[mid + 1]:
                left = mid + 1
            else:
                right = mid
        return left
```

## Explanation

Use binary search to find the peak. If the middle element is less than the next, the peak is in the right half; otherwise, in the left half. Continue until `left == right`.

### Step-by-step Approach

1. Set left pointer to 0 and right pointer to end of array.
2. While left < right:
   - Find middle index.
   - If `arr[mid] < arr[mid + 1]`, peak is to the right (move left).
   - Otherwise, peak is at mid or to the left (move right).
3. Return left (or right, they are equal at the peak).

### Complexity Analysis

- **Time Complexity:** O(log n)
- **Space Complexity:** O(1)
