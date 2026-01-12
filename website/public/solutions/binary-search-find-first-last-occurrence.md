# Binary Search - Find First/Last Occurrence

## Overview

This binary search variant is used to find the first (leftmost) and last (rightmost) occurrences of a target element in a sorted array that may contain duplicates. It builds on standard binary search by performing two separate searches: one to find the leftmost index and another for the rightmost. This pattern is essential for range queries, counting occurrences, or finding boundaries in sorted data. It ensures efficient O(log n) time even with duplicates, making it suitable for large datasets where linear scans would be too slow.

## Key Concepts

- **Leftmost Search**: Adjust the high pointer when the target is found or greater, to find the earliest occurrence.
- **Rightmost Search**: Adjust the low pointer when the target is found or less, to find the latest occurrence.
- **Duplicate Handling**: The algorithm naturally handles duplicates by continuing the search in the appropriate half.
- **Boundary Conditions**: Return -1 if the target is not found, and handle cases where the target appears once or multiple times.

## Template

```python
def find_first_occurrence(nums, target):
    """
    Finds the first occurrence of target in a sorted array.
    
    Args:
    nums (list): A sorted list of integers.
    target (int): The target value to find.
    
    Returns:
    int: The index of the first occurrence, or -1 if not found.
    """
    low = 0
    high = len(nums) - 1
    result = -1
    
    while low <= high:
        mid = low + (high - low) // 2
        
        if nums[mid] == target:
            result = mid
            high = mid - 1  # Continue searching left for first occurrence
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    
    return result

def find_last_occurrence(nums, target):
    """
    Finds the last occurrence of target in a sorted array.
    
    Args:
    nums (list): A sorted list of integers.
    target (int): The target value to find.
    
    Returns:
    int: The index of the last occurrence, or -1 if not found.
    """
    low = 0
    high = len(nums) - 1
    result = -1
    
    while low <= high:
        mid = low + (high - low) // 2
        
        if nums[mid] == target:
            result = mid
            low = mid + 1  # Continue searching right for last occurrence
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    
    return result
```

## Example Problems

1. **Find First and Last Position of Element in Sorted Array**: Given a sorted array, find the starting and ending positions of a given target value.
2. **Count of Target in Sorted Array**: Use the first and last occurrences to calculate the count of the target element.
3. **Search for a Range**: Similar to the first, but often combined with other operations like finding the range of values.

## Time and Space Complexity

- **Time Complexity**: O(log n) for each search (first or last), as it's standard binary search.
- **Space Complexity**: O(1), using constant extra space.

## Common Pitfalls

- **Not Updating Result Correctly**: When target is found, update result and continue searching in the correct direction.
- **Infinite Loops**: Ensure pointers are updated properly to avoid getting stuck.
- **Edge Cases**: Handle empty arrays, single-element arrays, and targets not present.
- **Duplicate Confusion**: Remember that for first occurrence, you search left even when found; for last, search right.