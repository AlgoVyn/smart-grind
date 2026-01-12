# Array - Cyclic Sort

## Overview

Cyclic sort is an in-place sorting algorithm for arrays containing integers in a specific range (typically 1 to n or 0 to n-1) with no duplicates. It places each element in its correct position by swapping elements iteratively, making it ideal for finding missing or duplicate numbers in constrained ranges. This pattern is efficient and uses constant extra space, perfect for problems where the array size equals the range of values.

## Key Concepts

The algorithm iterates through the array:
- For each index i, calculate the correct position as nums[i] - 1 (assuming 1-based indexing).
- If the current element is not at its correct position, swap it with the element at the correct position.
- Continue until the element is in the right place, then move to the next index.
This ensures each number is placed correctly in O(n) time with minimal swaps.

## Template

```python
def cyclic_sort(nums):
    """
    Sorts the array in place using cyclic sort, assuming nums contains
    unique integers from 1 to n.
    """
    i = 0
    n = len(nums)
    while i < n:
        correct = nums[i] - 1  # Assuming 1-based indexing
        if nums[i] != nums[correct]:
            # Swap
            nums[i], nums[correct] = nums[correct], nums[i]
        else:
            i += 1

# Example usage:
# nums = [3,1,5,4,2]
# cyclic_sort(nums)
# nums becomes [1,2,3,4,5]
```

## Example Problems

1. **Find the Missing Number (LeetCode 268)**: Given an array containing n distinct numbers taken from 0 to n, find the missing number.
2. **Find All Numbers Disappeared in an Array (LeetCode 448)**: Find all numbers that don't appear in the array within the range [1, n].
3. **Set Mismatch (LeetCode 645)**: Find the duplicate and missing number in an array of integers from 1 to n.

## Time and Space Complexity

- **Time Complexity**: O(n), as each element is swapped at most once and the loop runs in linear time.
- **Space Complexity**: O(1), since sorting is done in place without additional data structures.

## Common Pitfalls

- **Range Assumption**: The array must contain numbers in the range 1 to n (or 0 to n-1); adjust the correct index calculation accordingly.
- **Duplicates Handling**: If duplicates exist, the algorithm may not sort correctly; use for unique elements only.
- **Index Calculation**: Off-by-one errors in calculating the correct position can lead to infinite loops or incorrect swaps.
- **Edge Cases**: Handle empty arrays or arrays with one element gracefully.