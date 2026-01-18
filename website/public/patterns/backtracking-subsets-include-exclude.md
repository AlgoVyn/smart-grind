# Backtracking - Subsets (Include/Exclude)

## Overview

The Backtracking - Subsets pattern is a fundamental approach in combinatorial problem-solving that systematically explores all possible subsets of a given set by making binary decisions for each element: whether to include it in the current subset or exclude it. This pattern is particularly useful for problems requiring exhaustive search through combinations, such as finding subsets that meet specific criteria like summing to a target value or satisfying constraints.

Use this pattern when you need to generate all possible combinations of elements from a collection, especially in scenarios involving decision trees where each choice branches into include/exclude paths. The benefits include a systematic exploration of the solution space, natural handling of constraints through pruning, and the ability to find all valid solutions rather than just one.

## Key Concepts

- **Decision Tree**: Each element in the input array represents a decision point with two choices - include the element in the current subset or exclude it.
- **Recursion and Backtracking**: The algorithm recursively builds subsets by exploring both choices for each element, then backtracks to try alternative paths.
- **State Management**: Track the current position in the array (index) and the subset being constructed.
- **Base Case**: When all elements have been considered (index reaches array length), the current subset is a valid solution.
- **Subset Construction**: Use a list to build the current subset, appending elements when included and popping when backtracking.

## Template

```python
def backtrack(index, current_subset, nums, result):
    # Base case: when we've considered all elements
    if index == len(nums):
        # Add a copy of the current subset to results
        result.append(current_subset[:])
        return
    
    # Decision 1: Exclude the current element
    backtrack(index + 1, current_subset, nums, result)
    
    # Decision 2: Include the current element
    current_subset.append(nums[index])
    backtrack(index + 1, current_subset, nums, result)
    
    # Backtrack: remove the last added element to explore other paths
    current_subset.pop()

def subsets(nums):
    result = []
    backtrack(0, [], nums, result)
    return result
```

## Example Problems

1. **Subsets (LeetCode 78)**: Generate all possible subsets (power set) of a given array of unique integers.
2. **Subsets II (LeetCode 90)**: Generate all possible subsets from an array that may contain duplicates, ensuring no duplicate subsets in the result.
3. **Partition Equal Subset Sum (LeetCode 416)**: Determine if an array can be partitioned into two subsets with equal sum, using subset sum logic.

## Time and Space Complexity

- **Time Complexity**: O(2^n), where n is the number of elements, as each element has two choices (include/exclude), leading to 2^n possible subsets.
- **Space Complexity**: O(2^n * n) for storing all subsets in the result list, plus O(n) for the recursion stack depth.

## Common Pitfalls

- **Forgetting to copy the subset**: Always create a copy when adding to results, as lists are mutable and references will change during backtracking.
- **Handling duplicates**: If the input may contain duplicates, sort the array first and skip duplicate elements during recursion to avoid duplicate subsets.
- **Stack overflow**: For large inputs (n > 20), the exponential time complexity may cause timeouts or stack overflows; consider iterative approaches or optimizations.
- **Not resetting state**: Ensure proper backtracking by popping elements after recursive calls to maintain correct state for sibling branches.