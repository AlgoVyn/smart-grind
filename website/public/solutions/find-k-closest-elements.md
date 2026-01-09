# Find K Closest Elements

## Problem Description

Given a sorted integer array arr, two integers k and x, return the k closest integers to x in the array. The result should also be sorted in ascending order.
An integer a is closer to x than an integer b if:

- |a - x| < |b - x|, or
- |a - x| == |b - x| and a < b

---

## Constraints

- 1 <= k <= arr.length
- 1 <= arr.length <= 104
- arr is sorted in ascending order.
- -104 <= arr[i], x <= 104

---

## Example 1

**Input:**
```python
arr = [1,2,3,4,5], k = 4, x = 3
```

**Output:**
```python
[1,2,3,4]
```

---

## Example 2

**Input:**
```python
arr = [1,1,2,3,4,5], k = 4, x = -1
```

**Output:**
```python
[1,1,2,3]
```

---

## Solution

```python
from typing import List

class Solution:
    def findClosestElements(self, arr: List[int], k: int, x: int) -> List[int]:
        left, right = 0, len(arr) - k
        while left < right:
            mid = (left + right) // 2
            if x - arr[mid] > arr[mid + k] - x:
                left = mid + 1
            else:
                right = mid
        return arr[left:left + k]
```

---

## Explanation

This problem requires finding the k elements in a sorted array that are closest to a given value x.

### Step-by-Step Explanation:

1. **Binary search for the window:**
   - Use binary search on the possible starting indices (0 to len(arr)-k).
   - For each mid, compare the distance from x to arr[mid] and arr[mid+k].
   - If x is farther from arr[mid] than arr[mid+k] is from x, move left to mid+1.
   - Otherwise, move right to mid.

2. **Result:**
   - The left index gives the start of the k closest elements.
   - Return the subarray arr[left:left+k].

3. **Why it works:**
   - The binary search finds the optimal window where the elements are closest to x, leveraging the sorted order.

### Time Complexity:

O(log N + K), where N is array length, due to binary search and slicing.

### Space Complexity:

O(K) for the result list.
