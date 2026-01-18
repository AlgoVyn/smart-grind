# String - String to Integer (atoi)

## Overview

The String - String to Integer (atoi) pattern is used to convert a string representation of an integer to an actual integer value. This pattern handles leading whitespace, optional sign, digit parsing, and overflow/underflow conditions.

## Key Concepts

- **Leading Whitespace Handling**: Skip any leading whitespace characters.
- **Sign Detection**: Detect optional '+' or '-' sign.
- **Digit Parsing**: Parse subsequent characters as digits until a non-digit is encountered.
- **Overflow/Underflow Handling**: Ensure the result is within integer bounds (typically -2^31 to 2^31 - 1).

## Template

```python
def string_to_integer(s):
    # Constants for 32-bit signed integer range
    INT_MIN = -2**31
    INT_MAX = 2**31 - 1
    
    i = 0
    n = len(s)
    result = 0
    sign = 1
    
    # Skip leading whitespace
    while i < n and s[i] == ' ':
        i += 1
    
    # Handle sign
    if i < n and (s[i] == '+' or s[i] == '-'):
        sign = -1 if s[i] == '-' else 1
        i += 1
    
    # Parse digits
    while i < n and s[i].isdigit():
        digit = int(s[i])
        
        # Check for overflow/underflow
        if result > INT_MAX // 10 or (result == INT_MAX // 10 and digit > INT_MAX % 10):
            return INT_MIN if sign == -1 else INT_MAX
        
        result = result * 10 + digit
        i += 1
    
    return sign * result
```

## Example Problems

1. **String to Integer (atoi) (LeetCode 8)**: Implement the atoi function.
2. **Custom Integer Parser**: Modify the parser for specific requirements.
3. **Validate Integer Strings**: Check if a string contains a valid integer.

## Time and Space Complexity

- **Time Complexity**: O(n), where n is the length of the string (each character is processed at most once).
- **Space Complexity**: O(1), using a fixed number of variables.

## Common Pitfalls

- **Not handling leading whitespace**: Can lead to incorrect parsing.
- **Ignoring overflow/underflow**: Results in invalid integers outside the range.
- **Failing to handle sign correctly**: Missing negative numbers or double signs.
- **Stopping early on invalid characters**: Forgetting to continue parsing after leading non-digit characters.
- **Not handling empty strings or all-whitespace strings**: Leads to errors.
