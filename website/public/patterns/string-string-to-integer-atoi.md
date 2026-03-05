# String - String to Integer (atoi)

## Problem Description

The String to Integer (atoi) pattern converts a string representation of an integer to an actual integer value. This implementation handles leading whitespace, optional sign characters (+/-), digit parsing, and overflow/underflow conditions by clamping to 32-bit signed integer bounds. The function reads characters sequentially until it encounters an invalid character or reaches the end of the string.

This pattern is essential for:
- **Input validation**: Converting user input strings to numeric values
- **Data parsing**: Processing numeric data from text files or APIs
- **String processing**: Building custom parsers for specific numeric formats
- **Error handling**: Gracefully handling malformed numeric strings

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n) - Single pass through the string |
| Space Complexity | O(1) - Fixed number of variables used |
| Input | String containing optional whitespace, sign, and digits |
| Output | 32-bit signed integer (clamped to [-2³¹, 2³¹ - 1]) |
| Approach | Sequential character parsing with overflow detection |

### When to Use

- Converting string user input to integers
- Building custom parsers for numeric data
- Validating and sanitizing numeric strings
- Problems requiring strict overflow/underflow handling
- Implementing language-level string-to-int conversion
- Processing numeric data from unstructured text

## Intuition

The key insight is to process the string sequentially while maintaining state (sign, current result) and checking for overflow BEFORE it happens.

The "aha!" moments:

1. **Whitespace skipping**: Leading spaces are irrelevant and should be skipped before processing
2. **Sign handling**: Only one optional sign character (+ or -) is valid immediately after whitespace
3. **Overflow prevention**: Check for overflow BEFORE multiplying by 10 and adding the digit: `result > (INT_MAX - digit) / 10`
4. **Early termination**: Stop at the first non-digit character after starting digit parsing
5. **Empty/invalid handling**: Return 0 for empty strings, strings with only whitespace, or strings without valid digits

## Solution Approaches

### Approach 1: Iterative Parsing with Overflow Check ✅ Recommended

#### Algorithm

1. **Initialize**: Set `result = 0`, `sign = 1`, `i = 0`
2. **Skip whitespace**: Increment `i` while `s[i]` is a space character
3. **Handle sign**: If `s[i]` is '+' or '-', set `sign` accordingly and increment `i`
4. **Parse digits**: While `s[i]` is a digit:
   - Convert character to digit: `digit = s[i] - '0'`
   - **Check overflow**: If `result > (INT_MAX - digit) / 10`, return `INT_MAX` (if sign is positive) or `INT_MIN` (if sign is negative)
   - Update result: `result = result * 10 + digit`
   - Increment `i`
5. **Return**: `sign * result`

#### Implementation

````carousel
```python
def myAtoi(s: str) -> int:
    """
    Convert string to 32-bit signed integer.
    LeetCode 8 - String to Integer (atoi)
    
    Time: O(n), Space: O(1)
    """
    INT_MAX = 2**31 - 1  # 2147483647
    INT_MIN = -2**31     # -2147483648
    
    i = 0
    n = len(s)
    result = 0
    sign = 1
    
    # Step 1: Skip leading whitespace
    while i < n and s[i] == ' ':
        i += 1
    
    # Step 2: Handle empty string after whitespace
    if i >= n:
        return 0
    
    # Step 3: Handle sign
    if i < n and (s[i] == '+' or s[i] == '-'):
        sign = -1 if s[i] == '-' else 1
        i += 1
    
    # Step 4: Parse digits with overflow detection
    while i < n and s[i].isdigit():
        digit = int(s[i])
        
        # Check for overflow BEFORE updating result
        # If result > (INT_MAX - digit) // 10, then result * 10 + digit > INT_MAX
        if result > (INT_MAX - digit) // 10:
            return INT_MIN if sign == -1 else INT_MAX
        
        result = result * 10 + digit
        i += 1
    
    # Step 5: Apply sign and return
    return sign * result
```
<!-- slide -->
```cpp
class Solution {
public:
    int myAtoi(string s) {
        const int INT_MAX = 2147483647;
        const int INT_MIN = -2147483648;
        
        int i = 0;
        int n = s.length();
        long result = 0;  // Use long to detect overflow
        int sign = 1;
        
        // Skip leading whitespace
        while (i < n && s[i] == ' ') {
            i++;
        }
        
        // Handle empty string
        if (i >= n) return 0;
        
        // Handle sign
        if (i < n && (s[i] == '+' || s[i] == '-')) {
            sign = (s[i] == '-') ? -1 : 1;
            i++;
        }
        
        // Parse digits with overflow detection
        while (i < n && isdigit(s[i])) {
            int digit = s[i] - '0';
            
            // Check for overflow
            if (result > (static_cast<long>(INT_MAX) - digit) / 10) {
                return (sign == -1) ? INT_MIN : INT_MAX;
            }
            
            result = result * 10 + digit;
            i++;
        }
        
        result *= sign;
        
        // Final clamp (shouldn't be needed if checks above work, but for safety)
        if (result > INT_MAX) return INT_MAX;
        if (result < INT_MIN) return INT_MIN;
        
        return static_cast<int>(result);
    }
};
```
<!-- slide -->
```java
class Solution {
    public int myAtoi(String s) {
        final int INT_MAX = Integer.MAX_VALUE;  // 2147483647
        final int INT_MIN = Integer.MIN_VALUE;  // -2147483648
        
        int i = 0;
        int n = s.length();
        int result = 0;
        int sign = 1;
        
        // Skip leading whitespace
        while (i < n && s.charAt(i) == ' ') {
            i++;
        }
        
        // Handle empty string
        if (i >= n) return 0;
        
        // Handle sign
        if (i < n && (s.charAt(i) == '+' || s.charAt(i) == '-')) {
            sign = (s.charAt(i) == '-') ? -1 : 1;
            i++;
        }
        
        // Parse digits with overflow detection
        while (i < n && Character.isDigit(s.charAt(i))) {
            int digit = s.charAt(i) - '0';
            
            // Check for overflow
            // If result > (INT_MAX - digit) / 10, multiplying by 10 and adding digit would overflow
            if (result > (INT_MAX - digit) / 10) {
                return (sign == 1) ? INT_MAX : INT_MIN;
            }
            
            result = result * 10 + digit;
            i++;
        }
        
        return sign * result;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {string} s
 * @return {number}
 */
var myAtoi = function(s) {
    const INT_MAX = 2147483647;
    const INT_MIN = -2147483648;
    
    let i = 0;
    const n = s.length;
    let result = 0;
    let sign = 1;
    
    // Skip leading whitespace
    while (i < n && s[i] === ' ') {
        i++;
    }
    
    // Handle empty string
    if (i >= n) return 0;
    
    // Handle sign
    if (i < n && (s[i] === '+' || s[i] === '-')) {
        sign = (s[i] === '-') ? -1 : 1;
        i++;
    }
    
    // Parse digits with overflow detection
    while (i < n && s[i] >= '0' && s[i] <= '9') {
        const digit = s.charCodeAt(i) - 48;  // '0' is 48 in ASCII
        
        // Check for overflow
        if (result > Math.floor((INT_MAX - digit) / 10)) {
            return (sign === 1) ? INT_MAX : INT_MIN;
        }
        
        result = result * 10 + digit;
        i++;
    }
    
    return sign * result;
};
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - Single pass through the string |
| Space | O(1) - Only using a few variables |

### Approach 2: Using Regular Expressions

This approach uses regex to extract the valid integer pattern from the string, then converts it with standard library functions and clamps the result.

#### Implementation

````carousel
```python
import re

def myAtoi_regex(s: str) -> int:
    """
    Convert string to integer using regex pattern matching.
    Less efficient but concise.
    """
    INT_MAX = 2**31 - 1
    INT_MIN = -2**31
    
    # Match optional whitespace, optional sign, then digits
    match = re.match(r'^\s*([+-]?\d+)', s)
    
    if not match:
        return 0
    
    # Extract and convert
    num_str = match.group(1)
    result = int(num_str)
    
    # Clamp to 32-bit range
    return max(INT_MIN, min(INT_MAX, result))
```
<!-- slide -->
```javascript
/**
 * @param {string} s
 * @return {number}
 */
var myAtoiRegex = function(s) {
    const INT_MAX = 2147483647;
    const INT_MIN = -2147483648;
    
    // Match optional whitespace, optional sign, then digits
    const match = s.match(/^\s*([+-]?\d+)/);
    
    if (!match) return 0;
    
    // Parse and clamp
    const result = parseInt(match[1], 10);
    
    return Math.max(INT_MIN, Math.min(INT_MAX, result));
};
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - Regex matching is linear |
| Space | O(n) - For storing the matched substring |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Iterative Parsing | O(n) | O(1) | **Recommended** - Most efficient, interview standard |
| Regular Expressions | O(n) | O(n) | Quick scripting, less efficient for interviews |
| Built-in Conversion | O(n) | O(n) | Production code, not for learning |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [String to Integer (atoi)](https://leetcode.com/problems/string-to-integer-atoi/) | 8 | Medium | The classic atoi implementation |
| [Valid Number](https://leetcode.com/problems/valid-number/) | 65 | Hard | Validate if string represents a valid number |
| [Roman to Integer](https://leetcode.com/problems/roman-to-integer/) | 13 | Easy | Convert Roman numerals to integers |
| [Integer to Roman](https://leetcode.com/problems/integer-to-roman/) | 12 | Medium | Convert integers to Roman numerals |
| [Reverse Integer](https://leetcode.com/problems/reverse-integer/) | 7 | Medium | Reverse digits of an integer with overflow handling |
| [Palindrome Number](https://leetcode.com/problems/palindrome-number/) | 9 | Easy | Check if integer is a palindrome |
| [Add Strings](https://leetcode.com/problems/add-strings/) | 415 | Easy | Add two numbers represented as strings |
| [Multiply Strings](https://leetcode.com/problems/multiply-strings/) | 43 | Medium | Multiply two numbers represented as strings |

## Video Tutorial Links

1. **[NeetCode - String to Integer (atoi)](https://www.youtube.com/watch?v=zw7xubJLVew)** - Step-by-step implementation
2. **[Kevin Naughton Jr. - LeetCode 8](https://www.youtube.com/watch?v=qZoFJKyHQ98)** - Clear edge case explanations
3. **[Nick White - Atoi Implementation](https://www.youtube.com/watch?v=2CZOVNu9PMc)** - Visual walkthrough
4. **[Back To Back SWE - String to Integer](https://www.youtube.com/watch?v=7xfdbFLEjAo)** - Detailed algorithm breakdown
5. **[Techdose - Atoi Interview Solution](https://www.youtube.com/watch?v=qZoFJKyHQ98)** - Interview-focused approach

## Summary

### Key Takeaways
- **Overflow check is critical**: Always check BEFORE the operation that would cause overflow
- **Overflow formula**: `result > (INT_MAX - digit) / 10` prevents overflow
- **Sequential processing**: Handle whitespace → sign → digits in order
- **Early termination**: Stop at first non-digit after starting digit parsing
- **32-bit bounds**: `INT_MAX = 2³¹ - 1 = 2147483647`, `INT_MIN = -2³¹ = -2147483648`

### Common Pitfalls
- **Checking overflow AFTER adding**: This causes undefined behavior; check BEFORE
- **Not handling empty strings**: Return 0 for empty or whitespace-only strings
- **Multiple signs**: Only one sign character is valid; "+-12" should return 0
- **Integer division truncation**: Use proper integer division in overflow check
- **Character to digit conversion**: Remember `'5' - '0' = 5`, not just casting
- **Sign application**: Apply sign only at the end to avoid double negative issues

### Follow-up Questions

1. **How would you handle floating point numbers?**
   - Parse integer part, then optionally parse decimal part as separate value

2. **What if the input uses different number bases (hex, octal, binary)?**
   - Check for prefixes (0x, 0o, 0b) and parse accordingly with different base

3. **How would you implement this for 64-bit integers?**
   - Change INT_MAX/INT_MIN to 64-bit values, use long for result

4. **Can you optimize space further?**
   - Already O(1) space; can't optimize further without changing approach

5. **How would you handle scientific notation (e.g., "1.23e10")?**
   - Parse mantissa and exponent separately, then compute result

6. **What about thousands separators (e.g., "1,000,000")?**
   - Strip commas before parsing, or skip them during digit parsing

7. **How would you parse negative zero?**
   - Return 0; in two's complement, -0 equals 0

8. **Can you handle Unicode digits?**
   - Use Character.isDigit() in Java, or check Unicode ranges

## Pattern Source

[String - String to Integer (atoi)](patterns/string-string-to-integer-atoi.md)
