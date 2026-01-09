# Minimum Remove To Make Valid Parentheses

## Problem Description

Given a string `s` of `'('`, `')'` and lowercase English characters. Your task is to remove the minimum number of parentheses (`'('` or `')'`, in any positions) so that the resulting parentheses string is valid and return any valid string.

Formally, a parentheses string is valid if and only if:

- It is the empty string, contains only lowercase characters, or
- It can be written as `AB` (A concatenated with B), where A and B are valid strings, or
- It can be written as `(A)`, where A is a valid string

## Examples

### Example 1

**Input:**
```python
s = "lee(t(c)o)de)"
```

**Output:**
```python
"lee(t(c)o)de"
```

**Explanation:**
`"lee(t(co)de)"`, `"lee(t(c)ode)"` would also be accepted.

### Example 2

**Input:**
```python
s = "a)b(c)d"
```

**Output:**
```python
"ab(c)d"
```

### Example 3

**Input:**
```python
s = "))(("
```

**Output:**
```python
""
```

**Explanation:**
An empty string is also valid.

## Constraints

- `1 <= s.length <= 10^5`
- `s[i]` is either `'('`, `')'`, or lowercase English letter

## Solution

```python
class Solution:
    def minRemoveToMakeValid(self, s: str) -> str:
        """
        Remove minimum parentheses to make the string valid.
        
        Uses a stack to track indices of unmatched '('.
        """
        stack = []
        to_remove = set()
        
        # First pass: find unmatched parentheses
        for i, c in enumerate(s):
            if c == '(':
                stack.append(i)
            elif c == ')':
                if stack:
                    stack.pop()
                else:
                    to_remove.add(i)
        
        # Add remaining unmatched '(' to remove set
        to_remove.update(stack)
        
        # Build result string excluding removed indices
        result = []
        for i, c in enumerate(s):
            if i not in to_remove:
                result.append(c)
        
        return ''.join(result)
```

## Explanation

This problem requires removing the minimum number of parentheses to make the string valid, keeping lowercase letters.

1. **Use a stack**: Track indices of unmatched `'('` characters.

2. **First pass**: Iterate through the string:
   - For `'('`: push its index onto the stack
   - For `')'`: if stack is not empty, pop (match); else, add index to remove set

3. **Handle remaining**: Add all remaining indices in the stack to the remove set (unmatched `'('`).

4. **Build result**: Include characters whose indices are not in the remove set.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the string length
- **Space Complexity:** O(n), for the stack and set
