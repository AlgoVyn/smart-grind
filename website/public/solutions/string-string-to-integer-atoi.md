# String - String to Integer (atoi)

## Overview

Convert a string to a 32-bit signed integer, handling leading spaces, signs, and overflow. Use this pattern for parsing numeric strings with constraints. Benefits: Robust handling of edge cases.

## Key Concepts

- Skip leading whitespace, check for sign, parse digits, handle overflow.

## Template

```python
def my_atoi(s: str) -> int:
    s = s.lstrip()
    if not s:
        return 0
    sign = 1
    if s[0] in '+-':
        sign = 1 if s[0] == '+' else -1
        s = s[1:]
    num = 0
    for char in s:
        if not char.isdigit():
            break
        num = num * 10 + int(char)
        if sign * num > 2**31 - 1:
            return 2**31 - 1
        if sign * num < -2**31:
            return -2**31
    return sign * num
```

## Example Problems

- **String to Integer (atoi)**: Implement atoi function.
- **Valid Number**: Check if string represents a valid number.
- **Reverse Integer**: Reverse digits of an integer.

## Time and Space Complexity

- O(n) time, O(1) space.

## Common Pitfalls

- Not handling leading/trailing spaces.
- Overflow without clamping to 32-bit range.
- Invalid characters after digits.