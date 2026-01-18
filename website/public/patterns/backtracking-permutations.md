# Backtracking - Permutations

## Overview

The Backtracking - Permutations pattern generates all possible arrangements (permutations) of elements in a given set by systematically swapping elements and exploring different orderings through recursion. This pattern is essential for problems requiring exhaustive exploration of all possible sequences or arrangements, such as generating all possible orders of items or solving puzzles involving rearrangement.

Apply this pattern when you need to find all unique permutations of a collection, particularly when dealing with combinatorial problems where the order of elements matters. The benefits include a complete enumeration of possibilities, efficient handling of duplicates through skipping, and the ability to generate permutations in a depth-first manner with backtracking for pruning invalid paths.

## Key Concepts

- **Swapping Mechanism**: Elements are swapped to create different arrangements at each level of recursion.
- **Recursion Depth**: The recursion depth corresponds to the position being filled in the permutation.
- **Backtracking**: After exploring a branch, swap back to the original state to try other possibilities.
- **Base Case**: When all positions are filled (start index reaches array length), a valid permutation is found.
- **Duplicate Handling**: For arrays with duplicates, skip swaps that would create identical permutations.

## Template

```python
def backtrack(nums, start, result):
    # Base case: when start reaches the end, we have a complete permutation
    if start == len(nums):
        result.append(nums[:])  # Add a copy of the current permutation
        return
    
    # Try swapping the current position with each subsequent position
    for i in range(start, len(nums)):
        # Swap to place nums[i] at the current start position
        nums[start], nums[i] = nums[i], nums[start]
        
        # Recurse to fill the next position
        backtrack(nums, start + 1, result)
        
        # Backtrack: swap back to restore the original array
        nums[start], nums[i] = nums[i], nums[start]

def permute(nums):
    result = []
    backtrack(nums, 0, result)
    return result
```

## Example Problems

1. **Permutations (LeetCode 46)**: Generate all possible permutations of a given array of distinct integers.
2. **Permutations II (LeetCode 47)**: Generate all unique permutations from an array that may contain duplicates.
3. **Letter Case Permutation (LeetCode 784)**: Generate all possible letter case permutations of a given string.

## Time and Space Complexity

- **Time Complexity**: O(n!), where n is the number of elements, as there are n! permutations and each permutation takes O(n) time to generate.
- **Space Complexity**: O(n!) for storing all permutations in the result list, plus O(n) for the recursion stack.

## Common Pitfalls

- **Modifying the input array**: Since the algorithm swaps elements in place, ensure you work on a copy if the original array must remain unchanged.
- **Handling duplicates**: Without proper duplicate handling, identical permutations will be generated; use a set or skip identical elements during swaps.
- **Stack overflow**: For n > 10, the factorial time complexity can cause timeouts; consider if a full permutation generation is necessary.
- **Forgetting to copy**: Always append a copy of the array to results, as the array continues to be modified after the base case.