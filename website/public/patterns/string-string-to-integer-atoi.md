# String - String to Integer (atoi)

## Overview

The String - String to Integer (atoi) pattern is used to convert a string representation of an integer to an actual integer value. This pattern handles leading whitespace, optional sign, digit parsing, and overflow/underflow conditions.

## Key Concepts

- **Leading Whitespace Handling**: Skip any leading whitespace characters.
- **Sign Detection**: Detect optional `'+'` or `'-'` sign.
- **Digit Parsing**: Parse subsequent characters as digits until a non-digit is encountered.
- **Overflow/Underflow Handling**: Ensure the result is within integer bounds (typically -2^31 to 2^31 - 1).
- **Early Termination**: Stop parsing at the first non-digit character after valid digits.

## Template

### Quick Reference Template

````carousel
```python
def string_to_integer(s: str) -> int:
    """
    Convert string to 32-bit signed integer.
    
    Args:
        s: Input string to convert
        
    Returns:
        32-bit signed integer representation
    """
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
    
    # Handle empty string after stripping whitespace
    if i >= n:
        return 0
    
    # Handle sign
    if i < n and (s[i] == '+' or s[i] == '-'):
        sign = -1 if s[i] == '-' else 1
        i += 1
    
    # Parse digits with overflow detection
    while i < n and s[i].isdigit():
        digit = int(s[i])
        
        # Check for overflow before adding
        if result > (INT_MAX - digit) // 10:
            return INT_MIN if sign == -1 else INT_MAX
        
        result = result * 10 + digit
        i += 1
    
    return sign * result
```

```java
public int stringToInteger(String s) {
    final int INT_MAX = Integer.MAX_VALUE;
    final int INT_MIN = Integer.MIN_VALUE;
    
    int i = 0, n = s.length();
    
    // Skip leading whitespace
    while (i < n && s.charAt(i) == ' ') i++;
    
    if (i >= n) return 0;
    
    // Handle sign
    int sign = 1;
    if (s.charAt(i) == '+' || s.charAt(i) == '-') {
        sign = s.charAt(i) == '-' ? -1 : 1;
        i++;
    }
    
    // Parse digits with overflow detection
    int result = 0;
    while (i < n && Character.isDigit(s.charAt(i))) {
        int digit = s.charAt(i) - '0';
        if (result > (INT_MAX - digit) / 10) {
            return sign == 1 ? INT_MAX : INT_MIN;
        }
        result = result * 10 + digit;
        i++;
    }
    
    return sign * result;
}
```

```cpp
int stringToInteger(string s) {
    const int INT_MAX = INT_MAX;
    const int INT_MIN = INT_MIN;
    
    int i = 0, n = s.length();
    
    // Skip leading whitespace
    while (i < n && s[i] == ' ') i++;
    
    if (i >= n) return 0;
    
    // Handle sign
    int sign = 1;
    if (s[i] == '+' || s[i] == '-') {
        sign = s[i] == '-' ? -1 : 1;
        i++;
    }
    
    // Parse digits with overflow detection
    long result = 0;
    while (i < n && isdigit(s[i])) {
        int digit = s[i] - '0';
        if (result > (static_cast<long>(INT_MAX) - digit) / 10) {
            return sign == 1 ? INT_MAX : INT_MIN;
        }
        result = result * 10 + digit;
        i++;
    }
    
    result *= sign;
    if (result > INT_MAX) return INT_MAX;
    if (result < INT_MIN) return INT_MIN;
    return static_cast<int>(result);
}
```

```javascript
function stringToInteger(s) {
    const INT_MAX = Math.pow(2, 31) - 1;
    const INT_MIN = -Math.pow(2, 31);
    
    let i = 0, n = s.length;
    
    // Skip leading whitespace
    while (i < n && s[i] === ' ') i++;
    
    if (i >= n) return 0;
    
    // Handle sign
    let sign = 1;
    if (s[i] === '+' || s[i] === '-') {
        sign = s[i] === '-' ? -1 : 1;
        i++;
    }
    
    // Parse digits with overflow detection
    let result = 0;
    while (i < n && s[i] >= '0' && s[i] <= '9') {
        const digit = s.charCodeAt(i) - 48;
        if (result > (INT_MAX - digit) / 10) {
            return sign === 1 ? INT_MAX : INT_MIN;
        }
        result = result * 10 + digit;
        i++;
    }
    
    return sign * result;
}
```
````

## Algorithm Steps

1. **Skip Leading Whitespace**: Iterate through the string, skipping any space characters at the beginning.

2. **Handle Sign Character**: Check if the next non-whitespace character is `'+'` or `'-'`. If `'-'`, set sign to -1; otherwise, keep sign as 1.

3. **Parse Digits**: Continue iterating, processing each digit character:
   - Convert character to integer value (e.g., `'5'` → `5`).
   - Before adding the digit, check if the result would overflow:
     - If `result > (INT_MAX - digit) / 10`, adding another digit would exceed INT_MAX.
   - Accumulate the result: `result = result * 10 + digit`.

4. **Apply Sign**: Multiply the final result by the sign factor.

5. **Return Result**: The result is already clamped due to the overflow check during parsing.

## Example Problems

1. **[String to Integer (atoi) (LeetCode 8)](https://leetcode.com/problems/string-to-integer-atoi/)**: Implement the atoi function.
2. **[Custom Integer Parser](/solutions/string-to-integer-atoi)**: Modify the parser for specific requirements.
3. **[Validate Integer Strings](/solutions/string-to-integer-atoi)**: Check if a string contains a valid integer.

## Time and Space Complexity

| Metric | Complexity | Description |
|--------|------------|-------------|
| **Time Complexity** | O(n) | Each character is processed at most once. |
| **Space Complexity** | O(1) | Using a fixed number of variables. |

## Common Pitfalls

- **Not handling leading whitespace**: Can lead to incorrect parsing.
- **Ignoring overflow/underflow**: Results in invalid integers outside the range.
- **Failing to handle sign correctly**: Missing negative numbers or double signs.
- **Stopping early on invalid characters**: Forgetting to continue parsing after leading non-digit characters.
- **Not handling empty strings or all-whitespace strings**: Leads to errors.
- **Checking overflow after adding**: Should check before adding to prevent undefined behavior.

## Related Patterns

- [String - Roman to Integer Conversion](/patterns/string-roman-to-integer-conversion) - Similar character-by-character parsing pattern.
- [Array - Plus One Handling Carry](/patterns/array-plus-one-handling-carry) - Overflow handling in array processing.
- [Stack - Expression Evaluation](/patterns/stack-expression-evaluation-rpn-infix) - Advanced string parsing with operators.

## Further Reading

- [Complete Solution with Multiple Approaches](/solutions/string-to-integer-atoi)
- [LeetCode Problem 8](https://leetcode.com/problems/string-to-integer-atoi/)
