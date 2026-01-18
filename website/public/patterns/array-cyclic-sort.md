# Array - Cyclic Sort

## Overview

The Array - Cyclic Sort pattern is used to sort arrays containing numbers in a specific range (usually 1 to n) in O(n) time complexity. This pattern places each number in its correct position by swapping elements until each number is at the index corresponding to its value.

## Key Concepts

- **Correct Position Check**: Each number should be at index (value - 1) for 1-based arrays.
- **Swap and Check**: If a number is not in its correct position, swap it with the number at its correct index.
- **Skip Duplicates**: For arrays with duplicates, skip elements that are already in correct positions.

## Template

```python
def cyclicSort(nums):
    i = 0
    n = len(nums)
    
    while i < n:
        correct_idx = nums[i] - 1
        if 0 <= correct_idx < n and nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    return nums
```

## Example Problems

1. **Find All Numbers Disappeared in an Array (LeetCode 448)**: Find missing numbers using cyclic sort.
2. **Find the Duplicate Number (LeetCode 287)**: Identify duplicates using cyclic sort.
3. **First Missing Positive (LeetCode 41)**: Find the smallest missing positive number.
4. **Set Mismatch (LeetCode 645)**: Find the duplicate and missing numbers.

## Time and Space Complexity

- **Time Complexity**: O(n), where n is the number of elements (each element is swapped at most once).
- **Space Complexity**: O(1), as sorting is done in-place.

## Common Pitfalls

- **Incorrect range handling**: Forgetting that numbers are 1-based can lead to off-by-one errors.
- **Not handling duplicates**: Failing to skip duplicates causes infinite loops.
- **Incorrect termination conditions**: Loop should run while i < n, not just once through.
- **Overcomplicating with additional space**: Using extra space defeats the purpose of cyclic sort.
