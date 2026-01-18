# Sliding Window - Fixed Size (Subarray Calculation)

## Overview

The Sliding Window - Fixed Size pattern is used for problems that require performing calculations on subarrays of a constant size k. This pattern is particularly effective for scenarios where you need to compute metrics like sums, averages, or maximums over every possible subarray of length k in an array. Instead of using a brute-force approach that would result in O(n*k) time complexity, this pattern achieves O(n) time by maintaining a running calculation as the window slides through the array.

When to use: This pattern is ideal for problems involving contiguous subarrays of fixed length, such as finding the maximum sum of any k consecutive elements, computing moving averages, or identifying patterns in fixed-size windows.

Benefits: Reduces time complexity from O(n*k) to O(n), making it suitable for large arrays. It also typically uses O(1) extra space beyond the input.

## Key Concepts

- **Window Maintenance**: Maintain two pointers (start and end) that define the current window of size k.
- **Sliding Mechanism**: Move the window by incrementing both pointers, updating the calculation incrementally rather than recomputing from scratch.
- **Incremental Updates**: For sums, subtract the element leaving the window and add the new element entering.
- **Edge Cases**: Handle arrays shorter than k, empty arrays, and k=0.

## Template

```python
def fixed_size_sliding_window(arr, k):
    """
    Template for fixed-size sliding window problems.
    This example finds the maximum sum of any subarray of size k.
    """
    if not arr or k > len(arr) or k <= 0:
        return 0  # or appropriate default
    
    # Initialize the window sum with the first k elements
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    # Slide the window from index k to the end
    for i in range(k, len(arr)):
        # Update window sum: remove element at i-k, add element at i
        window_sum += arr[i] - arr[i - k]
        # Update maximum sum
        max_sum = max(max_sum, window_sum)
    
    return max_sum
```

## Example Problems

1. **Maximum Sum Subarray of Size K**: Find the maximum sum of any contiguous subarray of size k in an array of integers.
2. **Average of Subarrays of Size K**: Calculate the average of every subarray of size k and return the maximum average.
3. **Find Maximum in Each Subarray of Size K**: For each position, find the maximum element in the subarray starting at that position with length k.

## Time and Space Complexity

- **Time Complexity**: O(n), where n is the length of the array, as we perform a single pass through the array.
- **Space Complexity**: O(1), excluding the input array, since we only use a constant amount of extra space for variables like window_sum and max_sum.

## Common Pitfalls

- **Off-by-One Errors**: Ensure the loop starts from index k and correctly updates the window boundaries.
- **Edge Cases**: Always check for k > len(arr), k <= 0, or empty arrays to avoid index errors.
- **Integer Overflow**: For large arrays, be cautious with sum calculations if using languages with fixed integer sizes.
- **Negative Numbers**: The pattern works with negative numbers, but ensure the logic handles cases where all elements are negative.