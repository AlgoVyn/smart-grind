# Move Pieces To Obtain A String

## Problem Description

You are given two strings `start` and `target`, both of length `n`. Each string consists only of the characters `'L'`, `'R'`, and `'_'` where:

- The characters `'L'` and `'R'` represent pieces, where a piece `'L'` can move to the left only if there is a blank space directly to its left, and a piece `'R'` can move to the right only if there is a blank space directly to its right.
- The character `'_'` represents a blank space that can be occupied by any of the `'L'` or `'R'` pieces.

Return `true` if it is possible to obtain the string `target` by moving the pieces of the string `start` any number of times. Otherwise, return `false`.

## Examples

### Example 1

**Input:**
```python
start = "_L__R__R_", target = "L______RR"
```

**Output:**
```python
true
```

**Explanation:**
We can obtain the string `target` from `start` by doing the following moves:
- Move the first piece one step to the left, `start` becomes equal to `"L___R__R_"`.
- Move the last piece one step to the right, `start` becomes equal to `"L___R___R"`.
- Move the second piece three steps to the right, `start` becomes equal to `"L______RR"`.

### Example 2

**Input:**
```python
start = "R_L_", target = "__LR"
```

**Output:**
```python
false
```

**Explanation:**
The `'R'` piece in the string `start` can move one step to the right to obtain `"_RL_"`.
After that, no pieces can move anymore, so it is impossible to obtain the string `target` from `start`.

### Example 3

**Input:**
```python
start = "_R", target = "R_"
```

**Output:**
```python
false
```

**Explanation:**
The piece in the string `start` can move only to the right, so it is impossible to obtain the string `target` from `start`.

## Constraints

- `n == start.length == target.length`
- `1 <= n <= 10^5`
- `start` and `target` consist of the characters `'L'`, `'R'`, and `'_'`.

## Solution

```python
class Solution:
    def canChange(self, start: str, target: str) -> bool:
        # First, check if the non-blank characters match
        if start.replace('_', '') != target.replace('_', ''):
            return False
        
        i, j = 0, 0
        n = len(start)
        
        # Use two pointers to ensure 'L' can only move left and 'R' can only move right
        while i < n and j < n:
            # Skip blanks in start
            while i < n and start[i] == '_':
                i += 1
            # Skip blanks in target
            while j < n and target[j] == '_':
                j += 1
            
            if i < n and j < n:
                # Check if characters match
                if start[i] != target[j]:
                    return False
                # Check movement constraints
                if start[i] == 'L' and i < j:
                    return False
                if start[i] == 'R' and i > j:
                    return False
                i += 1
                j += 1
        
        return True
```

## Explanation

This problem requires checking if we can transform one string into another by moving pieces according to specific rules.

1. **Check character match**: First, verify that both strings contain the same non-blank characters in the same order.

2. **Two-pointer approach**: Use two pointers to traverse both strings:
   - Skip blanks in both strings
   - When both pointers point to non-blank characters:
     - Verify they match
     - For `'L'`: the position in start must be >= position in target (can only move left)
     - For `'R'`: the position in start must be <= position in target (can only move right)

3. If all checks pass, the transformation is possible.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of the strings
- **Space Complexity:** O(1), using only constant extra space
