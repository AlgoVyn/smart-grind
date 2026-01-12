# Binary Search - Median / Kth across Two Sorted Arrays

## Overview

This advanced binary search pattern is used to find the median or the kth smallest element across two sorted arrays. It leverages binary search to partition one array and find the correct split point, ensuring elements on the left are smaller than those on the right across both arrays. This approach achieves O(log min(n,m)) time complexity, making it efficient for large arrays. It's particularly useful for median finding in statistics or selecting kth elements in merged datasets, avoiding the need for full sorting.

## Key Concepts

- **Partitioning**: Divide one array at a point and find the corresponding partition in the second array.
- **Balance Condition**: Ensure all elements in the left partitions are ≤ all elements in the right partitions.
- **Median Calculation**: For median, the partition should balance the total elements.
- **Kth Element**: Adjust the partition to ensure exactly k-1 elements are on the left.

## Template

```python
def find_median_sorted_arrays(nums1, nums2):
    """
    Finds the median of two sorted arrays.
    
    Args:
    nums1 (list): First sorted list of integers.
    nums2 (list): Second sorted list of integers.
    
    Returns:
    float: The median value.
    """
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1  # Ensure nums1 is smaller
    
    x, y = len(nums1), len(nums2)
    low, high = 0, x
    
    while low <= high:
        partition_x = (low + high) // 2
        partition_y = (x + y + 1) // 2 - partition_x
        
        max_left_x = float('-inf') if partition_x == 0 else nums1[partition_x - 1]
        min_right_x = float('inf') if partition_x == x else nums1[partition_x]
        
        max_left_y = float('-inf') if partition_y == 0 else nums2[partition_y - 1]
        min_right_y = float('inf') if partition_y == y else nums2[partition_y]
        
        if max_left_x <= min_right_y and max_left_y <= min_right_x:
            # Correct partition
            if (x + y) % 2 == 0:
                return (max(max_left_x, max_left_y) + min(min_right_x, min_right_y)) / 2
            else:
                return max(max_left_x, max_left_y)
        elif max_left_x > min_right_y:
            high = partition_x - 1
        else:
            low = partition_x + 1
    
    raise ValueError("Input arrays are not sorted")

def find_kth_element(nums1, nums2, k):
    """
    Finds the kth smallest element in two sorted arrays.
    
    Args:
    nums1 (list): First sorted list.
    nums2 (list): Second sorted list.
    k (int): The kth position (1-based).
    
    Returns:
    int: The kth smallest element.
    """
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    
    if k > len(nums1) + len(nums2) or k < 1:
        raise ValueError("Invalid k")
    
    low, high = max(0, k - len(nums2)), min(k, len(nums1))
    
    while low <= high:
        i = (low + high) // 2
        j = k - i
        
        a_left = nums1[i-1] if i > 0 else float('-inf')
        a_right = nums1[i] if i < len(nums1) else float('inf')
        b_left = nums2[j-1] if j > 0 else float('-inf')
        b_right = nums2[j] if j < len(nums2) else float('inf')
        
        if a_left <= b_right and b_left <= a_right:
            return max(a_left, b_left)
        elif a_left > b_right:
            high = i - 1
        else:
            low = i + 1
    
    raise ValueError("Arrays not sorted or invalid k")
```

## Example Problems

1. **Median of Two Sorted Arrays**: Given two sorted arrays, find the median. This is the classic problem for this pattern.
2. **Kth Smallest Element in Two Sorted Arrays**: Find the kth smallest element across two sorted arrays.
3. **Median of Two Sorted Arrays of Different Sizes**: Handles cases where arrays have unequal lengths.

## Time and Space Complexity

- **Time Complexity**: O(log min(n,m)) for both median and kth element finding.
- **Space Complexity**: O(1), as no additional data structures are used.

## Common Pitfalls

- **Partition Calculation**: Ensure the partition balances the elements correctly for median.
- **Edge Cases**: Handle empty arrays, single-element arrays, and odd/even total elements.
- **Index Bounds**: Carefully check for out-of-bounds access when accessing array elements.
- **Sorting Assumption**: The arrays must be sorted; unsorted inputs will fail.