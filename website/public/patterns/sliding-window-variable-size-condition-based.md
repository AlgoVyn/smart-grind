# Sliding Window - Variable Size (Condition-Based)

## Overview

The Sliding Window - Variable Size pattern is employed for problems where the window size needs to dynamically adjust based on certain conditions, such as finding the smallest or largest subarray that meets a specific criterion. This pattern uses two pointers to expand and contract the window, allowing for efficient exploration of subarrays without fixed lengths. It's particularly useful for optimization problems where you need to minimize or maximize something under constraints.

When to use: Ideal for problems requiring the shortest/longest subarray with a sum greater than or equal to a target, or subarrays with unique elements, distinct characters, etc.

Benefits: Achieves O(n) time complexity in most cases, avoiding brute-force O(n^2) approaches. It adapts to varying window sizes based on the problem's requirements.

## Key Concepts

- **Two Pointers**: Left and right pointers to define the current window.
- **Expansion and Contraction**: Move the right pointer to expand the window, and the left pointer to shrink it when conditions are met.
- **Condition Checking**: Continuously check if the current window satisfies the problem's condition.
- **Tracking Metrics**: Maintain variables for sum, count, or other metrics as the window changes.

## Template

```python
def variable_size_sliding_window(arr, target):
    """
    Template for variable-size sliding window problems.
    This example finds the minimum length subarray with sum >= target.
    """
    if not arr:
        return 0
    
    left = 0
    min_length = float('inf')
    current_sum = 0
    
    for right in range(len(arr)):
        # Expand window by adding right element
        current_sum += arr[right]
        
        # Contract window from left while condition is met
        while current_sum >= target and left <= right:
            # Update minimum length
            min_length = min(min_length, right - left + 1)
            # Shrink window from left
            current_sum -= arr[left]
            left += 1
    
    return min_length if min_length != float('inf') else 0
```

## Example Problems

1. **Minimum Size Subarray Sum**: Find the minimal length of a contiguous subarray with sum >= target.
2. **Longest Substring Without Repeating Characters**: Find the length of the longest substring with all distinct characters.
3. **Fruit Into Baskets**: Find the maximum number of fruits you can pick with at most two types.

## Time and Space Complexity

- **Time Complexity**: O(n), where n is the length of the array, as each element is visited at most twice (once by right, once by left).
- **Space Complexity**: O(1), excluding the input, though some variations may use O(k) space for sets or maps to track frequencies.

## Common Pitfalls

- **Infinite Loops**: Ensure the left pointer only moves when the condition is satisfied to avoid getting stuck.
- **Pointer Bounds**: Always check that left <= right to prevent invalid window sizes.
- **Edge Cases**: Handle empty arrays, target values larger than total sum, or arrays with all negative numbers.
- **Overflow**: Be mindful of sum calculations with large numbers or negative values.