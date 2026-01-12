# Binary Search - On Sorted Array/List

## Overview

Binary search on a sorted array or list is a fundamental algorithmic technique used to efficiently locate a target element within a sorted collection. This pattern is particularly useful when dealing with large datasets where linear search would be inefficient. It works by repeatedly dividing the search interval in half, comparing the target value to the middle element, and narrowing down the search space accordingly. The primary benefits include logarithmic time complexity (O(log n)), making it ideal for scenarios requiring fast lookups, such as searching in databases, finding insertion points, or solving optimization problems on sorted data.

## Key Concepts

- **Sorted Order**: The array must be sorted in ascending or descending order for binary search to work correctly.
- **Search Interval**: Maintain two pointers (low and high) representing the current search range.
- **Midpoint Calculation**: Use integer division to find the middle index: mid = (low + high) // 2.
- **Comparison and Adjustment**: Compare the target with the middle element and adjust the search interval based on whether the target is less than, equal to, or greater than the middle element.
- **Termination**: The search ends when the target is found or the search interval becomes empty (low > high).

## Template

```python
def binary_search(arr, target):
    """
    Performs binary search on a sorted array to find the index of the target element.
    
    Args:
    arr (list): A sorted list of elements.
    target: The element to search for.
    
    Returns:
    int: The index of the target element if found, otherwise -1.
    """
    low = 0
    high = len(arr) - 1
    
    while low <= high:
        # Calculate the midpoint to avoid overflow
        mid = low + (high - low) // 2
        
        if arr[mid] == target:
            return mid  # Target found
        elif arr[mid] < target:
            low = mid + 1  # Search in the right half
        else:
            high = mid - 1  # Search in the left half
    
    return -1  # Target not found
```

## Example Problems

1. **Search in Rotated Sorted Array**: Given a rotated sorted array, find the index of a target element. This builds on basic binary search but requires additional logic to handle the rotation.
2. **Find First and Last Position of Element in Sorted Array**: Given a sorted array and a target, find the starting and ending positions of the target. This involves two binary searches to find the leftmost and rightmost occurrences.
3. **Sqrt(x)**: Compute the square root of a non-negative integer x, rounded down to the nearest integer. Use binary search to find the largest integer whose square is less than or equal to x.

## Time and Space Complexity

- **Time Complexity**: O(log n), where n is the number of elements in the array. Each iteration reduces the search space by half.
- **Space Complexity**: O(1), as the algorithm uses a constant amount of extra space regardless of input size.

## Common Pitfalls

- **Off-by-One Errors**: Incorrectly setting low and high boundaries or mishandling the midpoint calculation can lead to infinite loops or missed elements.
- **Unsorted Arrays**: Binary search assumes the array is sorted; applying it to unsorted data will produce incorrect results.
- **Integer Overflow**: When calculating mid as (low + high) // 2, use low + (high - low) // 2 to prevent overflow in languages with fixed integer sizes.
- **Edge Cases**: Handle empty arrays, arrays with one element, and cases where the target is not present or appears multiple times.