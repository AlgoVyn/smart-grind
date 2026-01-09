# Merge Sorted Array

## Problem Description
You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order, and two integers `m` and `n`, representing the number of elements in `nums1` and `nums2` respectively.

Merge `nums1` and `nums2` into a single array sorted in non-decreasing order.

The final sorted array should not be returned by the function, but instead be stored inside the array `nums1`. To accommodate this, `nums1` has a length of `m + n`, where the first `m` elements denote the elements that should be merged, and the last `n` elements are set to 0 and should be ignored. `nums2` has a length of `n`.

---

## Examples

**Example 1:**

**Input:**
```
nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
```

**Output:**
```
[1,2,2,3,5,6]
```

**Explanation:** The arrays we are merging are `[1,2,3]` and `[2,5,6]`. The result of the merge is `[1,2,2,3,5,6]` with the underlined elements coming from nums1.

**Example 2:**

**Input:**
```
nums1 = [1], m = 1, nums2 = [], n = 0
```

**Output:**
```
[1]
```

**Explanation:** The arrays we are merging are `[1]` and `[]`. The result of the merge is `[1]`.

**Example 3:**

**Input:**
```
nums1 = [0], m = 0, nums2 = [1], n = 1
```

**Output:**
```
[1]
```

**Explanation:** The arrays we are merging are `[]` and `[1]`. The result of the merge is `[1]`. Note that because `m = 0`, there are no elements in `nums1`. The 0 is only there to ensure the merge result can fit in `nums1`.

---

## Constraints

- `nums1.length == m + n`
- `nums2.length == n`
- `0 <= m, n <= 200`
- `1 <= m + n <= 200`
- `-10^9 <= nums1[i], nums2[j] <= 10^9`

**Follow-up:** Can you come up with an algorithm that runs in O(m + n) time?

## Solution

```python
from typing import List

class Solution:
    def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:
        i, j, k = m - 1, n - 1, m + n - 1
        while i >= 0 and j >= 0:
            if nums1[i] > nums2[j]:
                nums1[k] = nums1[i]
                i -= 1
            else:
                nums1[k] = nums2[j]
                j -= 1
            k -= 1
        while j >= 0:
            nums1[k] = nums2[j]
            j -= 1
            k -= 1
```

## Explanation
To merge two sorted arrays in place within nums1, we use a three-pointer approach starting from the end to avoid overwriting unprocessed elements.

1. Initialize pointers: `i = m - 1` (end of nums1's valid elements), `j = n - 1` (end of nums2), `k = m + n - 1` (end of nums1's total space).
2. While both `i` and `j` are within bounds:
   - Compare `nums1[i]` and `nums2[j]`.
   - If `nums1[i]` is greater, place `nums1[i]` at `nums1[k]`, decrement `i` and `k`.
   - Otherwise, place `nums2[j]` at `nums1[k]`, decrement `j` and `k`.
3. If `nums2` has remaining elements (`j >= 0`), copy them to the front of `nums1`.
4. The remaining elements in `nums1` are already in their correct positions.

### Time Complexity:
- O(m + n), where m and n are the lengths of the valid parts of nums1 and nums2, as each element is processed once.

### Space Complexity:
- O(1), since the merge is done in place within nums1.
