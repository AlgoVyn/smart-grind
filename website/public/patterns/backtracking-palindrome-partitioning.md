# Backtracking - Palindrome Partitioning

## Overview

The Backtracking - Palindrome Partitioning pattern partitions a given string into substrings where each substring is a palindrome. It uses backtracking to try different partition points, checking if each segment is a palindrome before proceeding. This pattern is useful for problems requiring decomposition of strings into meaningful palindromic components.

Use this pattern for string partitioning problems where palindromic properties must be maintained in each part. The benefits include systematic exploration of all valid partitions, efficient pruning when non-palindromic segments are encountered, and the ability to find all possible ways to split the string.

## Key Concepts

- **Partition Points**: Try ending a palindrome at every possible position from the current start.
- **Palindrome Check**: Verify if the substring from start to end is a palindrome.
- **Recursion**: After adding a valid palindrome, recurse on the remaining string.
- **Backtracking**: Remove the last added substring to try alternative partitions.
- **Base Case**: When the start index reaches the string length, a valid partition is found.

## Template

```python
def partition(s):
    def backtrack(start, current):
        # Base case: reached the end of the string
        if start == len(s):
            result.append(current[:])  # Add a copy of the current partition
            return
        
        # Try all possible end positions for the next palindrome
        for end in range(start + 1, len(s) + 1):
            substring = s[start:end]
            if is_palindrome(substring):
                current.append(substring)
                backtrack(end, current)
                current.pop()  # Backtrack
    
    def is_palindrome(sub):
        return sub == sub[::-1]
    
    result = []
    backtrack(0, [])
    return result
```

## Example Problems

1. **Palindrome Partitioning (LeetCode 131)**: Partition a string into all possible palindrome substrings.
2. **Palindrome Partitioning II (LeetCode 132)**: Find the minimum number of cuts needed to partition a string into palindromic substrings.
3. **Palindrome Partitioning III (LeetCode 1278)**: Partition a string into k palindromic substrings with minimum changes.

## Time and Space Complexity

- **Time Complexity**: O(2^n) in the worst case, as each position can be a partition point, but palindrome checks add overhead.
- **Space Complexity**: O(n) for the recursion stack, plus O(2^n * n) for storing all partitions.

## Common Pitfalls

- **Inefficient palindrome check**: Using string reversal repeatedly; consider precomputing or optimizing checks.
- **Forgetting to copy the partition**: Always append a copy of current to results, as lists are mutable.
- **Invalid ranges**: Ensure end goes up to len(s) + 1, and start < end.
- **Empty strings**: Handle cases where the string is empty or has no palindromic partitions.
- **Overlapping partitions**: The pattern ensures non-overlapping partitions by advancing start to end.