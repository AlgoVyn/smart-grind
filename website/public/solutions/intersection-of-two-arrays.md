# Intersection of Two Arrays

## Problem Description

Given two integer arrays `nums1` and `nums2`, return an array of their **intersection**. Each element in the result must be **unique**, and you may return the result in any order.

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `nums1 = [1,2,2,1]`, `nums2 = [2,2]` | `[2]` |

**Example 2:**

| Input | Output |
|-------|--------|
| `nums1 = [4,9,5]`, `nums2 = [9,4,9,8,4]` | `[9, 4]` or `[4, 9]` |

## Constraints

- `1 <= nums1.length, nums2.length <= 1000`
- `0 <= nums1[i], nums2[i] <= 1000`

## Solution

```python
from typing import List

class Solution:
    def intersection(self, nums1: List[int], nums2: List[int]) -> List[int]:
        set1 = set(nums1)
        result = []
        for num in nums2:
            if num in set1:
                result.append(num)
                set1.remove(num)  # Prevent duplicates in result
        return result
```

## Explanation

This problem finds the unique intersection of two integer arrays.

### Algorithm

1. **Convert to Set:** Create a set from `nums1` for O(1) lookups.
2. **Iterate and Collect:** Iterate through `nums2`, adding elements to the result if they exist in the set.
3. **Remove to Prevent Duplicates:** After adding an element to the result, remove it from the set to ensure uniqueness.

### Alternative Approaches

- **Two Sets:** Build a set from each array, then compute intersection.
- **Sorting + Two Pointers:** Sort both arrays and use two pointers.

The chosen approach is efficient and straightforward for the given constraints.

## Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + m) where n and m are the lengths of the input arrays |
| **Space** | O(n) for the set from nums1 |

This solution efficiently handles the unique intersection requirement.
