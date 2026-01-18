# Backtracking - Parentheses Generation

## Overview

The Backtracking - Parentheses Generation pattern is designed to generate all valid combinations of parentheses for a given number of pairs. It uses backtracking to build strings by adding opening and closing parentheses while ensuring the parentheses remain balanced and valid at every step. This pattern is crucial for problems involving balanced structures, such as generating expressions or validating nested constructs.

Apply this pattern when you need to generate all possible valid arrangements of paired symbols, like parentheses, brackets, or other matching delimiters. The benefits include guaranteed validity of generated strings, efficient pruning of invalid combinations, and the ability to handle constraints like maximum depth or specific pair counts.

## Key Concepts

- **Count Tracking**: Maintain counts of open and close parentheses to ensure balance.
- **Constraint Checks**: Only add an opening parenthesis if we haven't reached the maximum pairs; only add a closing parenthesis if it doesn't exceed the number of open ones.
- **Backtracking**: Add a parenthesis, recurse, then remove it to try alternatives.
- **Base Case**: When the string length reaches 2*n (n pairs), a valid combination is found.
- **Catalan Number**: The number of valid combinations follows the Catalan sequence, reflecting the combinatorial nature.

## Template

```python
def backtrack(current, open_count, close_count, n, result):
    # Base case: when we have used all parentheses
    if len(current) == 2 * n:
        result.append(''.join(current))
        return
    
    # Add an opening parenthesis if we haven't used all n
    if open_count < n:
        current.append('(')
        backtrack(current, open_count + 1, close_count, n, result)
        current.pop()  # Backtrack
    
    # Add a closing parenthesis if it won't exceed open count
    if close_count < open_count:
        current.append(')')
        backtrack(current, open_count, close_count + 1, n, result)
        current.pop()  # Backtrack

def generateParenthesis(n):
    result = []
    backtrack([], 0, 0, n, result)
    return result
```

## Example Problems

1. **Generate Parentheses (LeetCode 22)**: Generate all combinations of well-formed parentheses for n pairs.
2. **Valid Parentheses (LeetCode 20)**: Check if a given string of parentheses is valid (though this uses a stack, the generation pattern informs validation).
3. **Remove Invalid Parentheses (LeetCode 301)**: Remove the minimum number of invalid parentheses to make the string valid.

## Time and Space Complexity

- **Time Complexity**: O(4^n / √n), following the Catalan number growth rate for valid parentheses combinations.
- **Space Complexity**: O(4^n) for storing all combinations in the result, plus O(n) for the recursion stack.

## Common Pitfalls

- **Unbalanced additions**: Adding a closing parenthesis before an opening one leads to invalid strings; always check close_count < open_count.
- **Exceeding pair limit**: Not enforcing open_count < n allows too many opening parentheses.
- **Forgetting backtracking**: Failing to pop after recursion leaves the current list in an incorrect state for sibling branches.
- **String vs list confusion**: Using a string for current can be inefficient due to immutability; prefer a list and join at the end.