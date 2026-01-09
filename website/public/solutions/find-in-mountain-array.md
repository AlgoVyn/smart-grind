# Find In Mountain Array

## Problem Description

(This problem is an interactive problem.)
You may recall that an array arr is a mountain array if and only if:

- arr.length >= 3
- There exists some i with 0 < i < arr.length - 1 such that:
  - arr[0] < arr[1] < ... < arr[i - 1] < arr[i]
  - arr[i] > arr[i + 1] > ... > arr[arr.length - 1]

Given a mountain array mountainArr, return the minimum index such that mountainArr.get(index) == target. If such an index does not exist, return -1.
You cannot access the mountain array directly. You may only access the array using a MountainArray interface:

- MountainArray.get(k) returns the element of the array at index k (0-indexed).
- MountainArray.length() returns the length of the array.

Submissions making more than 100 calls to MountainArray.get will be judged Wrong Answer. Also, any solutions that attempt to circumvent the judge will result in disqualification.

## Constraints

- 3 <= mountainArr.length() <= 104
- 0 <= target <= 109
- 0 <= mountainArr.get(index) <= 109

## Example 1

**Input:**
```python
mountainArr = [1,2,3,4,5,3,1], target = 3
```

**Output:**
```python
2
```

**Explanation:**
3 exists in the array, at index=2 and index=5. Return the minimum index, which is 2.

## Example 2

**Input:**
```python
mountainArr = [0,1,2,4,2,1], target = 3
```

**Output:**
```python
-1
```

**Explanation:**
3 does not exist in the array, so we return -1.

## Solution

```
# """
# This is MountainArray's API interface.
# You should not implement it, or speculate about its implementation
# """
# class MountainArray:
#     def get(self, index: int) -> int:
#     def length(self) -> int:

class Solution:
    def findInMountainArray(self, target: int, mountain_arr: 'MountainArray') -> int:
        n = mountain_arr.length()
        
        # Find the peak
        l, r = 0, n - 1
        while l < r:
            m = (l + r) // 2
            if mountain_arr.get(m) < mountain_arr.get(m + 1):
                l = m + 1
            else:
                r = m
        peak = l
        
        # Binary search in the increasing part
        def bin_search(left, right, is_increasing):
            while left <= right:
                m = (left + right) // 2
                val = mountain_arr.get(m)
                if val == target:
                    return m
                if is_increasing:
                    if val < target:
                        left = m + 1
                    else:
                        right = m - 1
                else:
                    if val > target:
                        left = m + 1
                    else:
                        right = m - 1
            return -1
        
        # Search left part
        res = bin_search(0, peak, True)
        if res != -1:
            return res
        # Search right part
        return bin_search(peak, n - 1, False)
```

## Explanation

This interactive problem requires finding the target in a mountain array (increasing then decreasing) with limited API calls.

### Step-by-Step Explanation:

1. **Find the peak:**
   - Use binary search to locate the peak index where the array starts decreasing.
   - Compare mid and mid+1 to decide the direction.

2. **Binary search in parts:**
   - Search the increasing left part (0 to peak) for the target.
   - If not found, search the decreasing right part (peak to n-1).
   - Adjust binary search logic based on whether the part is increasing or decreasing.

3. **Efficiency:**
   - Peak finding: O(log N) calls.
   - Each binary search: O(log N) calls.
   - Total calls: O(log N), well under the 100 limit.

### Time Complexity:

O(log N) due to binary searches.

### Space Complexity:

O(1), using only variables.
