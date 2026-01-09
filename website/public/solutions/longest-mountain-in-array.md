# Longest Mountain In Array

## Problem Description

You may recall that an array `arr` is a **mountain array** if and only if:

- `arr.length >= 3`
- There exists some index `i` (0-indexed) with `0 < i < arr.length - 1` such that:
  - `arr[0] < arr[1] < ... < arr[i - 1] < arr[i]`
  - `arr[i] > arr[i + 1] > ... < arr[arr.length - 1]`

Given an integer array `arr`, return the length of the longest subarray which is a mountain. Return `0` if there is no mountain subarray.

---

## Examples

**Example 1:**

**Input:** `arr = [2,1,4,7,3,2,5]`

**Output:** `5`

**Explanation:** The largest mountain is `[1,4,7,3,2]` which has length `5`.

**Example 2:**

**Input:** `arr = [2,2,2]`

**Output:** `0`

**Explanation:** There is no mountain.

---

## Constraints

- `1 <= arr.length <= 10^4`
- `0 <= arr[i] <= 10^4`

---

## Follow Up

- Can you solve it using only one pass?
- Can you solve it in `O(1)` space?

---

## Solution

```python
from typing import List

class Solution:
    def longestMountain(self, arr: List[int]) -> int:
        n = len(arr)
        if n < 3:
            return 0
        max_len = 0
        for i in range(1, n - 1):
            if arr[i - 1] < arr[i] > arr[i + 1]:
                left = i
                right = i
                while left > 0 and arr[left - 1] < arr[left]:
                    left -= 1
                while right < n - 1 and arr[right] > arr[right + 1]:
                    right += 1
                max_len = max(max_len, right - left + 1)
        return max_len
```

---

## Explanation

We iterate through each possible peak `i` where `arr[i-1] < arr[i] > arr[i+1]`.

For each peak, expand leftward while increasing and rightward while decreasing.

Update the maximum length.

---

## Complexity Analysis

- **Time Complexity:** `O(n)`, as each element is visited at most twice.
- **Space Complexity:** `O(1)`, using constant space.
