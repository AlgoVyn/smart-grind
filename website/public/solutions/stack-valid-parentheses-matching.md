# Stack - Valid Parentheses Matching

## Overview

The Valid Parentheses Matching pattern uses a stack data structure to check if parentheses (or brackets) in a string are properly matched and nested. This pattern is essential for validating syntax in programming languages, mathematical expressions, or any context involving nested structures like XML/HTML tags. It's particularly useful when you need to ensure that every opening bracket has a corresponding closing bracket in the correct order.

This pattern should be used when:
- Validating string expressions with nested delimiters
- Parsing code or markup languages
- Checking for balanced structures in data formats

Benefits include:
- Linear time complexity O(n) for processing the string
- Simple and intuitive implementation
- Can be extended to handle multiple types of brackets
- Memory efficient with O(n) worst-case space usage

## Key Concepts

- **Stack Usage**: A stack follows Last-In-First-Out (LIFO) principle, perfect for tracking opening brackets
- **Bracket Mapping**: Maintain a mapping between opening and closing brackets
- **Matching Logic**: Push opening brackets onto stack, pop and compare when encountering closing brackets
- **Validation Rules**: String is valid if stack is empty at end and no mismatched brackets found

## Template

```python
def is_valid_parentheses(s: str) -> bool:
    # Dictionary mapping closing brackets to their opening counterparts
    bracket_map = {')': '(', '}': '{', ']': '['}
    # Stack to keep track of opening brackets
    stack = []
    
    for char in s:
        if char in bracket_map:
            # If it's a closing bracket, check if stack has matching opening
            if not stack or stack[-1] != bracket_map[char]:
                return False
            stack.pop()
        elif char in bracket_map.values():
            # If it's an opening bracket, push onto stack
            stack.append(char)
        # Ignore other characters if needed (not in this basic template)
    
    # Valid if stack is empty (all brackets matched)
    return not stack
```

## Example Problems

1. **Valid Parentheses** (LeetCode 20): Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.
2. **Minimum Add to Make Parentheses Valid** (LeetCode 921): Return the minimum number of parentheses to add to make the string valid.
3. **Remove Invalid Parentheses** (LeetCode 301): Remove the minimum number of invalid parentheses to make the string valid.

## Time and Space Complexity

- **Time Complexity**: O(n), where n is the length of the string, as we process each character once
- **Space Complexity**: O(n) in the worst case, when all characters are opening brackets stored in the stack

## Common Pitfalls

- Forgetting to check if stack is empty before popping when encountering a closing bracket
- Not handling different types of brackets correctly (e.g., mixing (), {}, [])
- Ignoring case sensitivity if brackets are case-sensitive
- Not accounting for strings with non-bracket characters that should be ignored
- Edge cases: empty string (valid), single bracket (invalid), nested brackets