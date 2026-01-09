# Two Pointers

## Problem Description

The Two Pointers technique is a common algorithmic approach used to solve problems involving arrays or strings efficiently. It involves using two pointers (indices) to traverse the data structure from different ends or at different speeds.

Common use cases include:
- Finding pairs that sum to a target (e.g., Two Sum with sorted array)
- Removing duplicates or elements
- Reversing arrays
- Checking palindromes
- Container problems like trapping rain water

---

## Solution

```
# Example: Two Sum with sorted array using two pointers
def twoSumSorted(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        current_sum = nums[left] + nums[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return []
```

---

## Explanation

The Two Pointers technique uses two indices to scan an array from opposite ends or same direction at different speeds.

1. Initialize two pointers: `left` at start, `right` at end.
2. Move pointers based on conditions:
   - If sum < target, move `left` pointer right to increase sum.
   - If sum > target, move `right` pointer left to decrease sum.
   - If equal, found the pair.
3. Continue until pointers meet.

This is efficient for sorted arrays, achieving O(n) time and O(1) space.

**Time Complexity:** O(n), linear scan.

**Space Complexity:** O(1), constant extra space.
