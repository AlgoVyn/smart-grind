# Array - Merge Sorted Array (In-place from End)

## Overview

The Array - Merge Sorted Array (In-place from End) pattern is used to merge two sorted arrays into one in-place, using the end of the target array as the starting point for merging. This technique avoids shifting elements and ensures efficient merging without extra space.

## Key Concepts

- **Three Pointers**: Use three pointers to track positions in the two input arrays and the merged array.
- **Merge from End**: Start merging from the end of the target array to avoid overwriting unmerged elements.
- **In-place Modification**: Merge directly into the target array without using additional space.

## Template

```python
def merge(nums1, m, nums2, n):
    i = m - 1
    j = n - 1
    k = m + n - 1
    
    while i >= 0 and j >= 0:
        if nums1[i] > nums2[j]:
            nums1[k] = nums1[i]
            i -= 1
        else:
            nums1[k] = nums2[j]
            j -= 1
        k -= 1
    
    # If there are remaining elements in nums2
    while j >= 0:
        nums1[k] = nums2[j]
        j -= 1
        k -= 1
    
    return nums1
```

## Example Problems

1. **Merge Sorted Array (LeetCode 88)**: Merge two sorted arrays into one in-place.
2. **Merge Sorted Arrays II**: Extend to merge more than two arrays.
3. **Merge Sorted Lists**: Similar approach for linked lists.

## Time and Space Complexity

- **Time Complexity**: O(m + n), where m and n are the lengths of the two arrays.
- **Space Complexity**: O(1), as merging is done in-place.

## Common Pitfalls

- **Merging from the start**: Causes overwriting of unmerged elements in nums1.
- **Forgetting to handle remaining elements**: If nums2 has elements left after nums1 is exhausted, they need to be copied.
- **Incorrect pointer initialization**: Starting pointers at the wrong positions leads to errors.
- **Off-by-one errors**: Incorrect loop conditions or pointer updates cause missing elements.
