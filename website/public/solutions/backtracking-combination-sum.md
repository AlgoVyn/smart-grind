# Backtracking - Combination Sum

## Overview

The Backtracking - Combination Sum pattern is used to find all unique combinations of numbers from a given array that sum up to a target value. This pattern handles problems where you need to explore combinations with or without element reuse, making it ideal for subset sum problems and combinatorial optimization. It systematically builds combinations by adding numbers and backtracking when the sum exceeds the target or when all possibilities are explored.

Use this pattern for problems requiring finding combinations that meet a sum constraint, such as coin change problems or subset sum variations. The benefits include efficient pruning of invalid paths (e.g., when current sum exceeds target), handling of duplicates, and flexibility for reuse or no-reuse scenarios.

## Key Concepts

- **Recursive Combination Building**: Start from an index and decide whether to include the current number in the combination.
- **Sum Tracking**: Maintain a running sum and compare against the target to prune branches early.
- **Reuse Handling**: For problems allowing reuse, stay at the same index; for no reuse, move to the next index.
- **Sorting for Optimization**: Sort the array to enable early termination when numbers exceed the remaining target.
- **Backtracking**: Remove the last added number to explore alternative combinations.

## Template

```python
def backtrack(start, target, current, candidates, result):
    # Base case: if target is 0, we found a valid combination
    if target == 0:
        result.append(current[:])  # Add a copy of the current combination
        return
    
    # Iterate through candidates starting from 'start' index
    for i in range(start, len(candidates)):
        # Prune: if current candidate exceeds remaining target, skip (since sorted)
        if candidates[i] > target:
            break
        
        # Include the current candidate
        current.append(candidates[i])
        
        # Recurse: for reuse allowed, pass i; for no reuse, pass i+1
        backtrack(i, target - candidates[i], current, candidates, result)  # Change to i+1 for no reuse
        
        # Backtrack: remove the last added candidate
        current.pop()

def combinationSum(candidates, target):
    candidates.sort()  # Sort for early pruning
    result = []
    backtrack(0, target, [], candidates, result)
    return result
```

## Example Problems

1. **Combination Sum (LeetCode 39)**: Find all unique combinations where the candidate numbers sum to target, with reuse allowed.
2. **Combination Sum II (LeetCode 40)**: Find combinations that sum to target without reusing elements and avoiding duplicate combinations.
3. **Combination Sum III (LeetCode 216)**: Find all valid combinations of k numbers that sum up to n, using numbers 1-9 with no reuse.

## Time and Space Complexity

- **Time Complexity**: Exponential in the worst case (O(2^n) or worse), but pruning reduces it significantly; depends on target and candidate values.
- **Space Complexity**: O(target/min_candidate) for recursion depth, plus O(number of combinations * combination length) for storing results.

## Common Pitfalls

- **Infinite recursion**: If reuse is allowed and no pruning, may loop indefinitely; always check bounds and sort for early termination.
- **Duplicate combinations**: For problems with duplicates, sort and skip identical elements in the loop.
- **Not handling reuse correctly**: Use i for reuse allowed, i+1 for no reuse; mixing them leads to incorrect results.
- **Forgetting to sort**: Sorting enables pruning when candidates[i] > target, improving performance.