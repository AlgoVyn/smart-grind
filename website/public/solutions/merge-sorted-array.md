# Merge Sorted Array

## Problem Description

You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order, and two integers `m` and `n` representing the number of elements in `nums1` and `nums2` respectively.

Merge `nums1` and `nums2` into a single array sorted in non-decreasing order. The result should be stored in `nums1` in place.

### Important Notes

- `nums1` has length `m + n`, where the first `m` elements are valid and the last `n` elements are placeholders (initialized to 0).
- `nums2` has length `n`.
- The merge must be done **in-place** within `nums1`.

---

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3` | `[1,2,2,3,5,6]` |

**Explanation:** Merging `[1,2,3]` and `[2,5,6]` produces `[1,2,2,3,5,6]`.

**Example 2:**

| Input | Output |
|-------|--------|
| `nums1 = [1], m = 1, nums2 = [], n = 0` | `[1]` |

**Example 3:**

| Input | Output |
|-------|--------|
| `nums1 = [0], m = 0, nums2 = [1], n = 1` | `[1]` |

---

## Constraints

- `nums1.length == m + n`
- `nums2.length == n`
- `0 <= m, n <= 200`
- `1 <= m + n <= 200`
- `-10^9 <= nums1[i], nums2[j] <= 10^9`

**Follow-up:** Can you achieve this in `O(m + n)` time?

---

## Solution

```python
from typing import List

class Solution:
    def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:
        """
        Merge two sorted arrays in place using three pointers.
        Pointers: i (end of nums1 valid), j (end of nums2), k (end of nums1 total)
        """
        i, j, k = m - 1, n - 1, m + n - 1
        
        # Merge from the end to avoid overwriting unprocessed elements
        while i >= 0 and j >= 0:
            if nums1[i] > nums2[j]:
                nums1[k] = nums1[i]
                i -= 1
            else:
                nums1[k] = nums2[j]
                j -= 1
            k -= 1
        
        # Copy remaining elements from nums2 if any
        while j >= 0:
            nums1[k] = nums2[j]
            j -= 1
            k -= 1
```

---

## Explanation

To merge two sorted arrays **in-place** without overwriting unprocessed elements, we use a three-pointer approach starting from the **end**:

1. **Initialize pointers**:
   - `i = m - 1` — end of valid elements in `nums1`
   - `j = n - 1` — end of `nums2`
   - `k = m + n - 1` — end of `nums1` total space

2. **Compare and place elements** from the end:
   - If `nums1[i] > nums2[j]`: Place `nums1[i]` at position `k`.
   - Otherwise: Place `nums2[j]` at position `k`.
   - Decrement the appropriate pointer and `k`.

3. **Handle remaining elements** in `nums2` (elements in `nums1` are already in place).

---

## Complexity Analysis

| Metric | Complexity |
|--------|------------|
| Time | `O(m + n)` — each element is processed exactly once |
| Space | `O(1)` — in-place merge with constant extra space |
