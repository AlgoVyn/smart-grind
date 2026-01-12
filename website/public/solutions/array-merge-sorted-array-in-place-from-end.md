# Array - Merge Sorted Array (In-place from End)

## Overview

This pattern merges two sorted arrays into one sorted array in place, assuming the first array has sufficient space allocated. It's efficient for scenarios where extra space is limited and in-place operations are preferred. By merging from the end of the arrays, it avoids overwriting elements that haven't been processed yet, ensuring correctness.

## Key Concepts

Use three pointers:
- One for the end of the first array's valid elements.
- One for the end of the second array.
- One for the position in the first array where the next element should be placed.
Compare elements from both arrays and place the larger one at the current position, moving pointers accordingly. This continues until all elements from the second array are merged.

## Template

```python
def merge(nums1, m, nums2, n):
    """
    Merges nums2 into nums1 as one sorted array in place.
    nums1 has enough space for m + n elements.
    """
    i, j, k = m - 1, n - 1, m + n - 1
    
    while j >= 0:
        if i >= 0 and nums1[i] > nums2[j]:
            nums1[k] = nums1[i]
            i -= 1
        else:
            nums1[k] = nums2[j]
            j -= 1
        k -= 1

# Example usage:
# nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
# merge(nums1, m, nums2, n)
# nums1 becomes [1,2,2,3,5,6]
```

## Example Problems

1. **Merge Sorted Array (LeetCode 88)**: Given two sorted integer arrays nums1 and nums2, merge nums2 into nums1 as one sorted array.
2. **Merge Intervals**: Variants involving merging overlapping sorted intervals in place.
3. **In-Place Array Merging**: Problems requiring merging multiple sorted subarrays without extra space.

## Time and Space Complexity

- **Time Complexity**: O(m + n), where m and n are the lengths of the arrays, as each element is processed once.
- **Space Complexity**: O(1), since the merge is done in place within the first array.

## Common Pitfalls

- **Pointer Management**: Incorrectly updating pointers can lead to out-of-bounds errors or missed elements.
- **Array Bounds**: Ensure nums1 has at least m + n space; otherwise, the merge will fail.
- **Empty Arrays**: Handle cases where one array is empty (m=0 or n=0) gracefully.
- **Order Preservation**: Merging from the end is crucial; starting from the beginning would overwrite unprocessed elements.