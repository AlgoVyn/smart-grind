# Two Pointers - Converging

## Overview

The Two Pointers - Converging pattern is commonly used for problems involving sorted arrays where you need to find pairs or combinations that satisfy a certain condition, such as summing to a target value. This pattern employs two pointers starting from opposite ends of the array and moving them towards each other based on comparisons. It's particularly effective for problems requiring O(n) time complexity while maintaining O(1) auxiliary space. Use this pattern when dealing with sorted data and needing to optimize for linear time without additional data structures.

## Key Concepts

- **Sorted Array Assumption**: The array must be sorted for this pattern to work efficiently.
- **Pointer Movement**: One pointer starts at the beginning (left), the other at the end (right). Move them based on the current sum or condition relative to the target.
- **Convergence**: Pointers move towards each other until they meet or cross, ensuring all possible pairs are considered.
- **Early Termination**: Can break early when a condition is met, avoiding unnecessary iterations.

## Template

```python
def two_pointers_converging(nums, target):
    """
    Template for Two Pointers - Converging pattern.
    Assumes nums is sorted.
    """
    left, right = 0, len(nums) - 1  # Initialize pointers at start and end
    
    while left < right:  # Continue until pointers meet
        current_sum = nums[left] + nums[right]  # Calculate current sum
        
        if current_sum == target:
            # Found the target, return indices or values as needed
            return [left, right]
        elif current_sum < target:
            # Sum too small, move left pointer right to increase sum
            left += 1
        else:
            # Sum too large, move right pointer left to decrease sum
            right -= 1
    
    # No pair found
    return []
```

## Example Problems

1. **Two Sum II - Input Array Is Sorted**: Find two numbers in a sorted array that add up to a specific target number. Return their indices.
2. **3Sum**: Find all unique triplets in the array which gives the sum of zero. (Can be adapted with additional logic.)
3. **Container With Most Water**: Find two lines that form a container with the most water, using converging pointers to maximize area.

## Time and Space Complexity

- **Time Complexity**: O(n), where n is the length of the array, as each pointer moves at most n times.
- **Space Complexity**: O(1), since only a constant amount of extra space is used for the pointers.

## Common Pitfalls

- **Unsorted Array**: Ensure the array is sorted beforehand; if not, sorting may be needed, changing time complexity to O(n log n).
- **Duplicate Handling**: Be careful with duplicates; may need to skip identical elements to avoid repeated results.
- **Index vs. Value Return**: Decide whether to return indices or actual values based on problem requirements.
- **Edge Cases**: Handle empty arrays, single-element arrays, or cases where no pair exists.