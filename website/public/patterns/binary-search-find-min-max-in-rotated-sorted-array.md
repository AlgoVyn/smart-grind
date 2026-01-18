# Binary Search - Find Min/Max in Rotated Sorted Array

## Overview

This binary search variant is designed to find the minimum or maximum element in a rotated sorted array. A rotated sorted array is one that was originally sorted in ascending order but has been rotated (shifted) at some pivot point. For example, [1,2,3,4,5] rotated at index 3 becomes [4,5,1,2,3]. This pattern is crucial for problems involving cyclic or rotated data structures. It leverages binary search to efficiently locate the pivot point or the min/max element in O(log n) time, making it ideal for scenarios where the array is large and rotation is unknown.

## Key Concepts

- **Rotated Array Property**: The array consists of two sorted subarrays; one from the start to the pivot and another from the pivot to the end.
- **Pivot Identification**: The minimum element is at the pivot point where the rotation occurred.
- **Comparison Logic**: Compare the middle element with the end element to determine which half contains the minimum.
- **Edge Cases**: Handle arrays that are not rotated (fully sorted) or have duplicate elements.

## Template

```python
def find_min_in_rotated_sorted_array(nums):
    """
    Finds the minimum element in a rotated sorted array.
    
    Args:
    nums (list): A rotated sorted list of integers.
    
    Returns:
    int: The minimum element in the array.
    """
    if not nums:
        return None
    
    low = 0
    high = len(nums) - 1
    
    while low < high:
        mid = low + (high - low) // 2
        
        # If mid element is greater than high element, min is in right half
        if nums[mid] > nums[high]:
            low = mid + 1
        else:
            # Min is in left half or at mid
            high = mid
    
    return nums[low]
```

## Example Problems

1. **Find Minimum in Rotated Sorted Array**: Given a rotated sorted array, find the minimum element. This is the classic problem for this pattern.
2. **Search in Rotated Sorted Array**: Find the index of a target element in a rotated sorted array. This combines finding the pivot with standard binary search.
3. **Find Peak Element**: In an array where elements increase to a peak and then decrease, find the peak element. This can be adapted from rotated array logic.

## Time and Space Complexity

- **Time Complexity**: O(log n), as the search space is halved in each iteration.
- **Space Complexity**: O(1), using only a few variables for pointers.

## Common Pitfalls

- **Duplicate Elements**: If duplicates are allowed, the standard approach may not work; additional checks are needed to handle cases where nums[mid] == nums[high].
- **Empty Array**: Always check for empty input to avoid index errors.
- **Fully Sorted Array**: The algorithm should still work, but ensure it doesn't loop indefinitely.
- **Off-by-One in Pointer Updates**: Carefully adjust low and high to avoid skipping the minimum element.