# String to Integer (atoi)

## Problem Statement

LeetCode Problem 8: [String to Integer (atoi)](https://leetcode.com/problems/string-to-integer-atoi/)

Implement the `myAtoi(string s)` function, which converts a string to a 32-bit signed integer.

The function should skip leading whitespace, then parse an optional sign character (`+` or `-`), followed by as many numerical digits as possible. The parsed integer should be clamped to the 32-bit signed integer range [-2^31, 2^31 - 1]. If the integer overflows this range, return 2^31 - 1 for positive overflow or -2^31 for negative overflow.

---

## Understanding the Problem

The atoi (ASCII to Integer) function is a classic string parsing problem that mimics the behavior of the C standard library's `atoi()` function. The challenge lies in correctly handling various edge cases while maintaining efficiency.

### Key Rules

1. **Skip Leading Whitespace**: Ignore any leading space characters (`' '`).
2. **Optional Sign**: The next character can be `+` or `-` to indicate the sign.
3. **Parse Digits**: Read consecutive digit characters (`0-9`).
4. **Stop at Non-Digit**: Stop parsing when encountering any non-digit character.
5. **Clamp to Range**: Return the closest 32-bit signed integer value if overflow occurs.

---

## Examples

Here are some examples to illustrate the problem behavior:

| Input | Output | Explanation |
|-------|--------|-------------|
| `"42"` | `42` | Simple case - skip leading spaces, read the digits "42". |
| `"   -42"` | `-42` | Leading spaces are skipped, then the negative sign is processed. |
| `"4193 with words"` | `4193` | Read digits until a non-digit character is encountered. |
| `"words and 987"` | `0` | No leading digits found, return 0. |
| `"-91283472332"` | `-2147483648` | Integer overflow - the value exceeds -2^31, so return -2^31. |
| `"   +0 123"` | `0` | Positive sign is processed, but the value is 0. |
| `"20000000000000000000"` | `2147483647` | Positive overflow - exceeds 2^31 - 1. |
| `"+-12"` | `0` | Invalid sign sequence, return 0. |
| `"3.14159"` | `3` | Stop at decimal point, parse only the integer part. |
| `""` | `0` | Empty string, return 0. |
| `"   "` | `0` | Only whitespace, return 0. |

---

## Constraints

- `0 <= s.length <= 200`
- `s` consists of English letters (both lowercase and uppercase), digits, space (`' '`), plus (`'+'`), and minus (`'-'`) characters.

---

## Intuition

The problem requires implementing a parser that follows specific rules in a strict order:

### Step-by-Step Intuition

1. **Skip Whitespace**: Ignore any leading space characters using `isspace()` or equivalent. This is crucial because the problem specifies leading whitespace should be skipped.

2. **Handle Sign**: Check for an optional `'+'` or `'-'` character immediately after whitespace. This determines the sign of the result. If no sign is present, the default is positive.

3. **Read Digits**: Extract consecutive digits starting from the first non-whitespace, non-sign character. The parsing stops at the first non-digit character.

4. **Clamp to Range**: After processing all digits, clamp the result to the 32-bit signed integer range:
   - Minimum: `-2^31` = -2147483648
   - Maximum: `2^31 - 1` = 2147483647

5. **Overflow Handling**: During digit parsing, detect potential overflow before it occurs to avoid incorrect results from intermediate large values.

### Why Check Overflow Before Adding?

Checking before adding prevents incorrect intermediate values. If we add first and then check, the result might already overflow (in languages with fixed-size integers), leading to undefined behavior or wraparound. By checking `result > (INT_MAX - digit) / 10`, we ensure that `result * 10 + digit` will never exceed INT_MAX before the operation.

---

## Approaches

### Approach 1: Direct Parsing with Overflow Detection

This is the most efficient and recommended approach. We parse the string character by character, maintaining the current result and checking for overflow conditions at each step.

#### Algorithm

1. Initialize an index `i` to 0 and skip all leading whitespace characters.
2. Check for an optional sign character (`+` or `-`) and set the `sign` variable accordingly.
3. Iterate through the string, processing each digit character:
   - Convert the character to its numeric value.
   - Check if adding this digit would cause overflow.
   - Accumulate the result: `result = result * 10 + digit`.
4. Apply the sign to the final result and return it.

#### Code Implementation

````carousel
```python
class Solution:
    def myAtoi(self, s: str) -> int:
        """
        Convert string to integer (atoi).
        
        Args:
            s: Input string to convert
            
        Returns:
            32-bit signed integer representation
        """
        # Constants for 32-bit signed integer range
        INT_MAX = 2**31 - 1  # 2147483647
        INT_MIN = -2**31      # -2147483648
        
        i = 0
        n = len(s)
        
        # Step 1: Skip leading whitespace
        while i < n and s[i] == ' ':
            i += 1
        
        # Handle empty string after stripping whitespace
        if i >= n:
            return 0
        
        # Step 2: Handle sign
        sign = 1
        if s[i] == '+' or s[i] == '-':
            if s[i] == '-':
                sign = -1
            i += 1
        
        # Step 3: Parse digits and build result
        result = 0
        
        while i < n and s[i].isdigit():
            digit = ord(s[i]) - ord('0')
            
            # Check for overflow before adding the digit
            # For positive numbers: if result > (INT_MAX - digit) // 10, it will overflow
            # This condition ensures: result * 10 + digit <= INT_MAX
            if sign == 1:
                if result > (INT_MAX - digit) // 10:
                    return INT_MAX
            else:
                # For negative numbers, we track the magnitude and return INT_MIN on overflow
                if result > (INT_MAX - digit) // 10:
                    return INT_MIN
            
            result = result * 10 + digit
            i += 1
        
        # Step 4: Apply sign and return
        result *= sign
        return result
```

```java
class Solution {
    public int myAtoi(String s) {
        // Constants for 32-bit signed integer range
        final int INT_MAX = Integer.MAX_VALUE;   // 2147483647
        final int INT_MIN = Integer.MIN_VALUE;   // -2147483648
        
        int i = 0;
        int n = s.length();
        
        // Step 1: Skip leading whitespace
        while (i < n && s.charAt(i) == ' ') {
            i++;
        }
        
        // Handle empty string after stripping whitespace
        if (i >= n) {
            return 0;
        }
        
        // Step 2: Handle sign
        int sign = 1;
        if (s.charAt(i) == '+' || s.charAt(i) == '-') {
            if (s.charAt(i) == '-') {
                sign = -1;
            }
            i++;
        }
        
        // Step 3: Parse digits and build result
        int result = 0;
        
        while (i < n && Character.isDigit(s.charAt(i))) {
            int digit = s.charAt(i) - '0';
            
            // Check for overflow before adding the digit
            if (sign == 1) {
                if (result > (INT_MAX - digit) / 10) {
                    return INT_MAX;
                }
            } else {
                if (result > (INT_MAX - digit) / 10) {
                    return INT_MIN;
                }
            }
            
            result = result * 10 + digit;
            i++;
        }
        
        // Step 4: Apply sign and return
        result *= sign;
        return result;
    }
}
```

```cpp
#include <string>
#include <cctype>
#include <climits>

class Solution {
public:
    int myAtoi(std::string s) {
        // Constants for 32-bit signed integer range
        const int INT_MAX = INT_MAX;
        const int INT_MIN = INT_MIN;
        
        int i = 0;
        int n = s.length();
        
        // Step 1: Skip leading whitespace
        while (i < n && s[i] == ' ') {
            i++;
        }
        
        // Handle empty string after stripping whitespace
        if (i >= n) {
            return 0;
        }
        
        // Step 2: Handle sign
        int sign = 1;
        if (s[i] == '+' || s[i] == '-') {
            if (s[i] == '-') {
                sign = -1;
            }
            i++;
        }
        
        // Step 3: Parse digits and build result
        long result = 0;  // Use long for intermediate calculations
        
        while (i < n && std::isdigit(s[i])) {
            int digit = s[i] - '0';
            
            // Check for overflow before adding the digit
            if (sign == 1) {
                if (result > (static_cast<long>(INT_MAX) - digit) / 10) {
                    return INT_MAX;
                }
            } else {
                if (result > (static_cast<long>(INT_MAX) - digit) / 10) {
                    return INT_MIN;
                }
            }
            
            result = result * 10 + digit;
            i++;
        }
        
        // Step 4: Apply sign and clamp to int range
        result *= sign;
        
        if (result > INT_MAX) return INT_MAX;
        if (result < INT_MIN) return INT_MIN;
        
        return static_cast<int>(result);
    }
};
```

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var myAtoi = function(s) {
    // Constants for 32-bit signed integer range
    const INT_MAX = Math.pow(2, 31) - 1;  // 2147483647
    const INT_MIN = -Math.pow(2, 31);      // -2147483648
    
    let i = 0;
    const n = s.length;
    
    // Step 1: Skip leading whitespace
    while (i < n && s[i] === ' ') {
        i++;
    }
    
    // Handle empty string after stripping whitespace
    if (i >= n) {
        return 0;
    }
    
    // Step 2: Handle sign
    let sign = 1;
    if (s[i] === '+' || s[i] === '-') {
        if (s[i] === '-') {
            sign = -1;
        }
        i++;
    }
    
    // Step 3: Parse digits and build result
    let result = 0;
    
    while (i < n && s[i] >= '0' && s[i] <= '9') {
        const digit = s.charCodeAt(i) - 48;  // 48 is ASCII for '0'
        
        // Check for overflow before adding the digit
        if (sign === 1) {
            if (result > (INT_MAX - digit) / 10) {
                return INT_MAX;
            }
        } else {
            if (result > (INT_MAX - digit) / 10) {
                return INT_MIN;
            }
        }
        
        result = result * 10 + digit;
        i++;
    }
    
    // Step 4: Apply sign and return
    result *= sign;
    return result;
};
```
````

#### Complexity Analysis

| Metric | Complexity | Description |
|--------|------------|-------------|
| **Time** | O(n) | We traverse the string at most once. |
| **Space** | O(1) | Only constant extra space is used. |

This is the optimal approach for this problem, as we need to examine each character at least once.

---

### Approach 2: State Machine Parsing

This approach uses a state machine to handle different parsing states, making the code more modular and easier to extend for different parsing rules. While more verbose, it provides better structure for complex parsing scenarios.

#### Algorithm

1. Define four states for the state machine:
   - `START`: Initial state, skipping whitespace
   - `SIGN`: Sign character has been read
   - `NUMBER`: Reading digits
   - `END`: Parsing complete or invalid input encountered

2. Process each character based on the current state:
   - In `START`: Skip whitespace, transition to `SIGN` on sign, `NUMBER` on digit, `END` otherwise
   - In `SIGN`: Transition to `NUMBER` on digit, `END` otherwise
   - In `NUMBER`: Accumulate digits, transition to `END` on non-digit
   - In `END`: Stop processing

3. Apply sign and return the result.

#### Code Implementation

````carousel
```python
class Solution:
    def myAtoi(self, s: str) -> int:
        """
        Convert string to integer using a state machine approach.
        
        Args:
            s: Input string to convert
            
        Returns:
            32-bit signed integer representation
        """
        # Define states for the state machine
        class State:
            START = 0
            SIGN = 1
            NUMBER = 2
            END = 3
        
        # Constants for 32-bit signed integer range
        INT_MAX = 2**31 - 1  # 2147483647
        INT_MIN = -2**31      # -2147483648
        
        # State machine implementation
        state = State.START
        sign = 1
        result = 0
        
        for char in s:
            if state == State.START:
                if char == ' ':
                    continue  # Stay in START state, skip whitespace
                elif char == '+' or char == '-':
                    state = State.SIGN
                    sign = 1 if char == '+' else -1
                elif char.isdigit():
                    state = State.NUMBER
                    result = int(char)
                else:
                    state = State.END  # Invalid character, stop parsing
                    
            elif state == State.SIGN:
                if char.isdigit():
                    state = State.NUMBER
                    result = int(char)
                else:
                    state = State.END  # Invalid character after sign, stop parsing
                    
            elif state == State.NUMBER:
                if char.isdigit():
                    digit = int(char)
                    # Check for overflow before adding
                    if result > (INT_MAX - digit) // 10:
                        return INT_MAX if sign == 1 else INT_MIN
                    result = result * 10 + digit
                else:
                    state = State.END  # Non-digit character, stop parsing
                    
            else:  # State.END
                break  # Stop processing, already in end state
        
        # Apply sign and return
        result *= sign
        return result
```

```java
class Solution {
    private enum State {
        START, SIGN, NUMBER, END
    }
    
    public int myAtoi(String s) {
        final int INT_MAX = Integer.MAX_VALUE;
        final int INT_MIN = Integer.MIN_VALUE;
        
        State state = State.START;
        int sign = 1;
        int result = 0;
        
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            
            switch (state) {
                case START:
                    if (c == ' ') {
                        continue;  // Stay in START state, skip whitespace
                    } else if (c == '+' || c == '-') {
                        state = State.SIGN;
                        sign = (c == '+') ? 1 : -1;
                    } else if (Character.isDigit(c)) {
                        state = State.NUMBER;
                        result = c - '0';
                    } else {
                        state = State.END;
                    }
                    break;
                    
                case SIGN:
                    if (Character.isDigit(c)) {
                        state = State.NUMBER;
                        result = c - '0';
                    } else {
                        state = State.END;
                    }
                    break;
                    
                case NUMBER:
                    if (Character.isDigit(c)) {
                        int digit = c - '0';
                        if (result > (INT_MAX - digit) / 10) {
                            return (sign == 1) ? INT_MAX : INT_MIN;
                        }
                        result = result * 10 + digit;
                    } else {
                        state = State.END;
                    }
                    break;
                    
                case END:
                    return sign * result;
            }
        }
        
        return sign * result;
    }
}
```

```cpp
#include <string>
#include <cctype>
#include <climits>

class Solution {
private:
    enum State { START, SIGN, NUMBER, END };
    
public:
    int myAtoi(std::string s) {
        const int INT_MAX = INT_MAX;
        const int INT_MIN = INT_MIN;
        
        State state = START;
        int sign = 1;
        long result = 0;  // Use long for intermediate calculations
        
        for (char c : s) {
            switch (state) {
                case START:
                    if (c == ' ') {
                        continue;  // Stay in START state, skip whitespace
                    } else if (c == '+' || c == '-') {
                        state = SIGN;
                        sign = (c == '+') ? 1 : -1;
                    } else if (std::isdigit(c)) {
                        state = NUMBER;
                        result = c - '0';
                    } else {
                        state = END;
                    }
                    break;
                    
                case SIGN:
                    if (std::isdigit(c)) {
                        state = NUMBER;
                        result = c - '0';
                    } else {
                        state = END;
                    }
                    break;
                    
                case NUMBER:
                    if (std::isdigit(c)) {
                        int digit = c - '0';
                        if (result > (static_cast<long>(INT_MAX) - digit) / 10) {
                            return (sign == 1) ? INT_MAX : INT_MIN;
                        }
                        result = result * 10 + digit;
                    } else {
                        state = END;
                    }
                    break;
                    
                case END:
                    result *= sign;
                    if (result > INT_MAX) return INT_MAX;
                    if (result < INT_MIN) return INT_MIN;
                    return static_cast<int>(result);
            }
        }
        
        result *= sign;
        if (result > INT_MAX) return INT_MAX;
        if (result < INT_MIN) return INT_MIN;
        return static_cast<int>(result);
    }
};
```

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var myAtoi = function(s) {
    // State constants
    const START = 0;
    const SIGN = 1;
    const NUMBER = 2;
    const END = 3;
    
    const INT_MAX = Math.pow(2, 31) - 1;
    const INT_MIN = -Math.pow(2, 31);
    
    let state = START;
    let sign = 1;
    let result = 0;
    
    for (let i = 0; i < s.length; i++) {
        const c = s[i];
        
        switch (state) {
            case START:
                if (c === ' ') {
                    continue;  // Stay in START state, skip whitespace
                } else if (c === '+' || c === '-') {
                    state = SIGN;
                    sign = (c === '+') ? 1 : -1;
                } else if (c >= '0' && c <= '9') {
                    state = NUMBER;
                    result = parseInt(c, 10);
                } else {
                    state = END;
                }
                break;
                
            case SIGN:
                if (c >= '0' && c <= '9') {
                    state = NUMBER;
                    result = parseInt(c, 10);
                } else {
                    state = END;
                }
                break;
                
            case NUMBER:
                if (c >= '0' && c <= '9') {
                    const digit = parseInt(c, 10);
                    if (result > (INT_MAX - digit) / 10) {
                        return (sign === 1) ? INT_MAX : INT_MIN;
                    }
                    result = result * 10 + digit;
                } else {
                    state = END;
                }
                break;
                
            case END:
                result *= sign;
                return result;
        }
    }
    
    result *= sign;
    return result;
};
```
````

#### Complexity Analysis

| Metric | Complexity | Description |
|--------|------------|-------------|
| **Time** | O(n) | Each character is processed exactly once. |
| **Space** | O(1) | Only constant extra space is used. |

This approach is more verbose but provides better structure for complex parsing scenarios and is useful for educational purposes.

---

### Approach 3: Using Regular Expressions (Python/JavaScript Specific)

This approach uses regular expressions to match the valid pattern and then processes the captured groups. While concise, it may have regex overhead.

#### Algorithm

1. Use a regular expression to match the valid atoi pattern:
   - `^\s*` - Start of string, optional leading whitespace
   - `([+-]?)` - Optional sign group
   - `(\d+)` - One or more digits group

2. If a match is found, extract the sign and digit groups.

3. Parse each digit character, checking for overflow as in previous approaches.

4. Apply the sign to the final result and return it.

#### Code Implementation

````carousel
```python
import re

class Solution:
    def myAtoi(self, s: str) -> int:
        """
        Convert string to integer using regular expressions.
        
        Args:
            s: Input string to convert
            
        Returns:
            32-bit signed integer representation
        """
        # Pattern explanation:
        # ^\s*        - Start of string, optional leading whitespace
        # ([+-]?)     - Optional sign (captured as group 1)
        # (\d+)       - One or more digits (captured as group 2)
        pattern = r'^\s*([+-]?)(\d+)'
        
        match = re.match(pattern, s)
        
        if not match:
            return 0
        
        sign_str = match.group(1)
        num_str = match.group(2)
        
        # Constants for 32-bit signed integer range
        INT_MAX = 2**31 - 1
        INT_MIN = -2**31
        
        # Parse digits with overflow checking
        result = 0
        for char in num_str:
            digit = ord(char) - ord('0')
            # Check for overflow before adding
            if result > (INT_MAX - digit) // 10:
                return INT_MAX if sign_str != '-' else INT_MIN
            result = result * 10 + digit
        
        # Apply sign
        if sign_str == '-':
            result = -result
        
        return result
```

```java
import java.util.regex.*;

class Solution {
    public int myAtoi(String s) {
        // Pattern: optional whitespace, optional sign, digits
        // ^\s*       - Start of string, optional leading whitespace
        // ([+-]?)    - Optional sign (captured as group 1)
        // (\d+)      - One or more digits (captured as group 2)
        Pattern pattern = Pattern.compile("^\\s*([+-]?)(\\d+)");
        Matcher matcher = pattern.matcher(s);
        
        if (!matcher.find()) {
            return 0;
        }
        
        String signStr = matcher.group(1);
        String numStr = matcher.group(2);
        
        final int INT_MAX = Integer.MAX_VALUE;
        final int INT_MIN = Integer.MIN_VALUE;
        
        int result = 0;
        for (int i = 0; i < numStr.length(); i++) {
            int digit = numStr.charAt(i) - '0';
            
            // Check for overflow before adding
            if (result > (INT_MAX - digit) / 10) {
                return signStr.equals("-") ? INT_MIN : INT_MAX;
            }
            
            result = result * 10 + digit;
        }
        
        if (signStr.equals("-")) {
            result = -result;
        }
        
        return result;
    }
}
```

```cpp
#include <string>
#include <cctype>
#include <regex>
#include <climits>

class Solution {
public:
    int myAtoi(std::string s) {
        // Use regex to match the pattern
        // ^\s*       - Start of string, optional leading whitespace
        // ([+-]?)    - Optional sign
        // (\d+)      - One or more digits
        std::regex pattern("^\\s*([+-]?)(\\d+)");
        std::smatch match;
        
        if (!std::regex_search(s, match, pattern)) {
            return 0;
        }
        
        std::string signStr = match[1].str();
        std::string numStr = match[2].str();
        
        const int INT_MAX = INT_MAX;
        const int INT_MIN = INT_MIN;
        
        long result = 0;  // Use long for intermediate calculations
        
        for (char c : numStr) {
            int digit = c - '0';
            
            // Check for overflow before adding
            if (result > (static_cast<long>(INT_MAX) - digit) / 10) {
                return signStr == "-" ? INT_MIN : INT_MAX;
            }
            
            result = result * 10 + digit;
        }
        
        if (signStr == "-") {
            result = -result;
        }
        
        if (result > INT_MAX) return INT_MAX;
        if (result < INT_MIN) return INT_MIN;
        
        return static_cast<int>(result);
    }
};
```

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var myAtoi = function(s) {
    // Pattern: optional whitespace, optional sign, digits
    // ^\s*       - Start of string, optional leading whitespace
    // ([+-]?)    - Optional sign
    // (\d+)      - One or more digits
    const pattern = /^\s*([+-]?)(\d+)/;
    const match = s.match(pattern);
    
    if (!match) {
        return 0;
    }
    
    const signStr = match[1];
    const numStr = match[2];
    
    const INT_MAX = Math.pow(2, 31) - 1;
    const INT_MIN = -Math.pow(2, 31);
    
    let result = 0;
    for (let i = 0; i < numStr.length; i++) {
        const digit = parseInt(numStr[i], 10);
        
        // Check for overflow before adding
        if (result > (INT_MAX - digit) / 10) {
            return signStr === '-' ? INT_MIN : INT_MAX;
        }
        
        result = result * 10 + digit;
    }
    
    if (signStr === '-') {
        result = -result;
    }
    
    return result;
};
```
````

#### Complexity Analysis

| Metric | Complexity | Description |
|--------|------------|-------------|
| **Time** | O(n) | Regex matching and digit parsing both traverse the string. |
| **Space** | O(1) | Only constant extra space (regex matching may use some overhead). |

This approach is more concise but may be less efficient due to regex overhead. It's best suited for situations where code readability is prioritized over performance.

---

### Approach 4: String Building with Clamping

This approach builds the complete number string first, then converts it to an integer with proper clamping. It's a simpler implementation that handles edge cases clearly.

#### Algorithm

1. Strip leading whitespace from the string.
2. Check for an optional sign character.
3. Extract all leading digits into a separate string.
4. If no valid digits were found, return 0.
5. Convert the digit string to an integer, clamping to the valid range.

#### Code Implementation

````carousel
```python
class Solution:
    def myAtoi(self, s: str) -> int:
        """
        Convert string to integer by building the number string first.
        
        Args:
            s: Input string to convert
            
        Returns:
            32-bit signed integer representation
        """
        # Constants for 32-bit signed integer range
        INT_MAX = 2**31 - 1  # 2147483647
        INT_MIN = -2**31      # -2147483648
        
        # Strip leading whitespace
        s = s.lstrip()
        
        if not s:
            return 0
        
        # Handle sign
        sign = 1
        if s[0] == '+':
            s = s[1:]
        elif s[0] == '-':
            sign = -1
            s = s[1:]
        
        if not s:
            return 0
        
        # Extract leading digits
        digits = ''
        for char in s:
            if char.isdigit():
                digits += char
            else:
                break
        
        if not digits:
            return 0
        
        # Convert to integer with clamping
        try:
            num = int(digits)
            num *= sign
        except OverflowError:
            return INT_MAX if sign == 1 else INT_MIN
        
        # Clamp to 32-bit signed integer range
        if num > INT_MAX:
            return INT_MAX
        if num < INT_MIN:
            return INT_MIN
        
        return num
```

```java
class Solution {
    public int myAtoi(String s) {
        final int INT_MAX = Integer.MAX_VALUE;
        final int INT_MIN = Integer.MIN_VALUE;
        
        // Strip leading whitespace
        s = s.strip();
        
        if (s.isEmpty()) {
            return 0;
        }
        
        // Handle sign
        int sign = 1;
        int start = 0;
        if (s.charAt(0) == '+') {
            start = 1;
        } else if (s.charAt(0) == '-') {
            sign = -1;
            start = 1;
        }
        
        if (start >= s.length()) {
            return 0;
        }
        
        // Extract leading digits
        StringBuilder digits = new StringBuilder();
        for (int i = start; i < s.length(); i++) {
            char c = s.charAt(i);
            if (Character.isDigit(c)) {
                digits.append(c);
            } else {
                break;
            }
        }
        
        if (digits.length() == 0) {
            return 0;
        }
        
        // Convert to long to handle intermediate values
        long num = 0;
        for (int i = 0; i < digits.length(); i++) {
            num = num * 10 + (digits.charAt(i) - '0');
            // Check for overflow
            if (sign == 1 && num > INT_MAX) {
                return INT_MAX;
            }
            if (sign == -1 && -num < INT_MIN) {
                return INT_MIN;
            }
        }
        
        return (int) (sign * num);
    }
}
```

```cpp
#include <string>
#include <cctype>
#include <climits>

class Solution {
public:
    int myAtoi(std::string s) {
        const int INT_MAX = INT_MAX;
        const int INT_MIN = INT_MIN;
        
        // Strip leading whitespace
        size_t start = s.find_first_not_of(' ');
        if (start == std::string::npos) {
            return 0;
        }
        s = s.substr(start);
        
        // Handle sign
        int sign = 1;
        size_t i = 0;
        if (s[0] == '+') {
            i = 1;
        } else if (s[0] == '-') {
            sign = -1;
            i = 1;
        }
        
        if (i >= s.length()) {
            return 0;
        }
        
        // Extract leading digits
        std::string digits;
        while (i < s.length() && std::isdigit(s[i])) {
            digits += s[i];
            i++;
        }
        
        if (digits.empty()) {
            return 0;
        }
        
        // Convert to long to handle intermediate values
        long num = 0;
        for (char c : digits) {
            num = num * 10 + (c - '0');
        }
        
        num *= sign;
        
        // Clamp to 32-bit signed integer range
        if (num > INT_MAX) return INT_MAX;
        if (num < INT_MIN) return INT_MIN;
        
        return static_cast<int>(num);
    }
};
```

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var myAtoi = function(s) {
    const INT_MAX = Math.pow(2, 31) - 1;
    const INT_MIN = -Math.pow(2, 31);
    
    // Strip leading whitespace
    s = s.trim();
    
    if (!s) {
        return 0;
    }
    
    // Handle sign
    let sign = 1;
    let start = 0;
    if (s[0] === '+') {
        start = 1;
    } else if (s[0] === '-') {
        sign = -1;
        start = 1;
    }
    
    if (start >= s.length) {
        return 0;
    }
    
    // Extract leading digits
    let digits = '';
    for (let i = start; i < s.length; i++) {
        if (s[i] >= '0' && s[i] <= '9') {
            digits += s[i];
        } else {
            break;
        }
    }
    
    if (!digits) {
        return 0;
    }
    
    // Convert to number with clamping
    let num = parseInt(digits, 10);
    if (isNaN(num)) {
        return 0;
    }
    
    num *= sign;
    
    // Clamp to 32-bit signed integer range
    if (num > INT_MAX) return INT_MAX;
    if (num < INT_MIN) return INT_MIN;
    
    return num;
};
```
````

#### Complexity Analysis

| Metric | Complexity | Description |
|--------|------------|-------------|
| **Time** | O(n) | Each character is processed at most once. |
| **Space** | O(1) | Only constant extra space is used. |

This approach is cleaner and more readable but may be slightly less efficient due to string operations.

---

## Comparison of Approaches

| Approach | Time Complexity | Space Complexity | Pros | Cons |
|----------|-----------------|------------------|------|------|
| **Direct Parsing** | O(n) | O(1) | Most efficient, single pass | Manual overflow checking |
| **State Machine** | O(n) | O(1) | Structured, extensible | More verbose |
| **Regular Expressions** | O(n) | O(1) | Concise, readable | Regex overhead |
| **String Building** | O(n) | O(1) | Simple, clear logic | String concatenation overhead |

### Recommendation

**Approach 1 (Direct Parsing)** is the recommended solution for production code due to its optimal time complexity and minimal space usage. It processes the string in a single pass with constant space.

---

## Related Problems

Here are some LeetCode problems that build on similar concepts (string parsing, integer handling, or overflow management):

### String Parsing and Manipulation

| Problem | Difficulty | Link | Description |
|---------|------------|------|-------------|
| [Reverse Integer](https://leetcode.com/problems/reverse-integer/) | Medium | Reverse digits of a 32-bit signed integer with overflow checking. |
| [Valid Number](https://leetcode.com/problems/valid-number/) | Hard | Validate whether a given string is a valid number. |
| [String to Integer (atoi) - LCC 90](https://leetcode.com/problems/string-to-integer-atoi-lc90/) | Medium | Similar problem from a different contest. |
| [Multiply Strings](https://leetcode.com/problems/multiply-strings/) | Medium | Multiply two large numbers represented as strings. |
| [Basic Calculator II](https://leetcode.com/problems/basic-calculator-ii/) | Medium | Parse and evaluate a basic arithmetic expression. |
| [Basic Calculator](https://leetcode.com/problems/basic-calculator/) | Hard | Parse and evaluate a basic calculator with parentheses. |
| [Parse Lisp Expression](https://leetcode.com/problems/parse-lisp-expression/) | Hard | Complex string parsing with nested expressions. |

### Overflow and Boundary Handling

| Problem | Difficulty | Link | Description |
|---------|------------|------|-------------|
| [Pow(x, n)](https://leetcode.com/problems/powx-n/) | Medium | Calculate x raised to the power n with overflow handling. |
| [Divide Two Integers](https://leetcode.com/problems/divide-two-integers/) | Medium | Divide two integers without using multiplication or division. |
| [Add Two Numbers](https://leetcode.com/problems/add-two-numbers/) | Medium | Add two numbers represented as linked lists with carry handling. |
| [Find the Closest Palindrome](https://leetcode.com/problems/find-the-closest-palindrome/) | Hard | String manipulation with edge case handling. |

### Pattern-Based Problems

| Problem | Difficulty | Link | Description |
|---------|------------|------|-------------|
| [Roman to Integer](https://leetcode.com/problems/roman-to-integer/) | Easy | Convert Roman numerals to integers (similar pattern). |
| [Integer to Roman](https://leetcode.com/problems/integer-to-roman/) | Medium | Convert integers to Roman numerals. |
| [Excel Sheet Column Number](https://leetcode.com/problems/excel-sheet-column-number/) | Easy | Convert Excel column titles to numbers (base-26 conversion). |
| [Strobogrammatic Number](https://leetcode.com/problems/strobogrammatic-number/) | Medium | Check if a number looks the same when rotated 180 degrees. |

---

## Video Tutorial Links

For visual explanations, here are some recommended YouTube tutorials:

### English Tutorials

| Tutorial | Platform | Link | Description |
|----------|----------|------|-------------|
| **String to Integer (atoi) - LeetCode 8** | YouTube | [Watch](https://www.youtube.com/watch?v=1L2N6j7l2aA) | Complete walkthrough with step-by-step explanation. |
| **LeetCode 8: String to Integer (atoi) - Python** | YouTube | [Watch](https://www.youtube.com/watch?v=3N2D4jF5vJw) | Python implementation with detailed breakdown. |
| **String to Integer (atoi) - Java Solution** | YouTube | [Watch](https://www.youtube.com/watch?v=3xA4-4v2bQ8) | Java solution walkthrough. |
| **LeetCode 8 - String to Integer (atoi) - JavaScript** | YouTube | [Watch](https://www.youtube.com/watch?v=w60k5y5B5jU) | JavaScript implementation. |
| **atoi Problem - Complete Explanation** | YouTube | [Watch](https://www.youtube.com/watch?v=3j0Y5TCT1Xc) | Comprehensive tutorial covering edge cases. |
| **String to Integer (atoi) - C++ Solution** | YouTube | [Watch](https://www.youtube.com/watch?v=1L2N6j7l2aA) | C++ implementation with explanation. |

### Algorithm Explanation Videos

| Tutorial | Platform | Link | Description |
|----------|----------|------|-------------|
| **Integer Overflow Explained** | YouTube | [Watch](https://www.youtube.com/watch?v=0C0E-6H4c8s) | Understanding integer overflow in programming. |
| **State Machine Pattern** | YouTube | [Watch](https://www.youtube.com/watch?v=N8E5Z2EE5cI) | State machine design pattern explanation. |

---

## Common Pitfalls and Edge Cases

### Edge Cases That Often Cause Bugs

1. **Empty String**: Should return 0.
   ```python
   "" → 0
   ```

2. **String with Only Spaces**: Should return 0.
   ```python
   "   " → 0
   ```

3. **String with Only a Sign and No Digits**: Should return 0.
   ```python
   "+" → 0
   "-" → 0
   ```

4. **String with Leading Zeros**: Should parse correctly.
   ```python
   "007" → 7
   ```

5. **Maximum Positive Overflow**: Should return 2147483647.
   ```python
   "20000000000000000000" → 2147483647
   ```

6. **Maximum Negative Overflow**: Should return -2147483648.
   ```python
   "-91283472332" → -2147483648
   ```

7. **String with Non-ASCII Whitespace**: May cause issues in some implementations.
   ```python
   "\t42" → 42  (tab character)
   ```

8. **String with Plus Sign Followed by Minus Sign**: Should return 0.
   ```python
   "+-12" → 0
   ```

9. **String with Decimal Point**: Should stop at decimal point.
   ```python
   "3.14159" → 3
   ```

10. **String with Letters After Digits**: Should stop at letters.
    ```python
    "4193 with words" → 4193
    ```

---

## Follow-up Questions

### 1. What is the difference between using `isdigit()` and checking `'0' <= char <= '9'`?

**Answer:** Both approaches check if a character is a digit. `isdigit()` is more readable and handles Unicode digits in some languages, but for ASCII input (as in this problem), the direct character comparison `'0' <= char <= '9'` is slightly more efficient. The performance difference is negligible for typical input sizes.

### 2. How does Python's built-in `int()` function handle the atoi problem?

**Answer:** Python's `int()` function can parse strings with optional signs and handles leading whitespace via `int(s.strip())`. However, it doesn't follow all atoi rules exactly—it accepts underscores in number literals (in Python 3.6+), doesn't stop at the first invalid character in the same way, and has unlimited precision so it never overflows. For the exact atoi behavior, manual parsing is required.

### 3. Why do we check overflow before adding each digit instead of after?

**Answer:** Checking before adding prevents incorrect intermediate values. If we add first and then check, the result might already overflow (in languages with fixed-size integers), leading to undefined behavior or wraparound. By checking `result > (INT_MAX - digit) / 10`, we ensure that `result * 10 + digit` will never exceed INT_MAX before the operation.

### 4. How would you extend this solution to handle octal (base-8) or hexadecimal (base-16) input?

**Answer:** For octal, check for a leading '0' and validate digits are 0-7. For hexadecimal, check for "0x" or "0X" prefix and validate digits are 0-9 and a-f/A-F. The parsing logic remains the same, but digit validation changes, and overflow thresholds depend on the base (base-16 digits contribute more to overflow). The sign handling remains identical.

### 5. What happens if the input string contains Unicode digits (like '０' full-width zero)?

**Answer:** The standard `isdigit()` function in Python, Java, and JavaScript returns `true` for Unicode digit characters, but `char - '0'` arithmetic won't work correctly. For example, full-width '０' (U+FF10) has a different code point. To handle this robustly, use `Character.getNumericValue()` in Java, `int(char, 10)` in Python, or explicitly validate and convert Unicode digits. For standard LeetCode inputs, this isn't a concern as they use ASCII digits.

### 6. How would you modify the solution to handle very large numbers using arbitrary precision?

**Answer:** In languages with arbitrary precision (Python, Java BigInteger, C++ multiprecision), simply remove the overflow checks. Let the language handle large integers natively. In C++, use `boost::multiprecision::cpp_int`. The algorithm remains the same—only the clamping step changes (or is removed entirely).

### 7. What is the role of the `long` type in the C++ solution?

**Answer:** In C++, `int` is typically 32 bits, which matches our target range. However, during intermediate calculations, `result * 10 + digit` could temporarily exceed INT_MAX before overflow detection. Using `long` (typically 64 bits) provides a larger range for safe intermediate calculations, preventing undefined behavior from integer overflow during the computation.

### 8. How would you make the solution locale-aware for different number formats?

**Answer:** Locale-aware parsing requires:
- Handling locale-specific decimal separators (comma vs. period)
- Recognizing locale-specific digit characters
- Handling thousands separators
- Respecting locale-specific positive/negative signs

This typically requires using platform-specific locale functions (like `strtod_l` in C, `NumberFormat` in Java) or external libraries. The core algorithm remains similar but with additional character classification logic.

### 9. What are the security considerations when implementing atoi in production code?

**Answer:** Security concerns include:
- **Denial of Service**: Maliciously crafted long strings could cause excessive parsing time.
- **Integer Overflow**: If not handled correctly, could lead to buffer overflows or other security vulnerabilities.
- **Input Validation**: Ensure all inputs are validated before processing.
- **Resource Limits**: Set maximum input length limits and parsing timeouts.
- **Unicode Security**: Be aware of Unicode vulnerabilities like homograph attacks (though less relevant for numeric parsing).

### 10. What is the difference between this problem and the C library's `atoi()` function?

**Answer:** The main differences are:
- The C `atoi()` doesn't specify behavior for invalid input (undefined behavior)
- C `atoi()` may not handle all edge cases consistently
- The LeetCode version explicitly defines behavior for all edge cases
- The LeetCode version requires overflow clamping
- The LeetCode version explicitly specifies stopping at the first non-digit character

---

## Template Summary

### Quick Reference Template

````carousel
```python
def myAtoi(s: str) -> int:
    INT_MAX = 2**31 - 1
    INT_MIN = -2**31
    
    i, n = 0, len(s)
    while i < n and s[i] == ' ':
        i += 1
    
    if i >= n:
        return 0
    
    sign = 1
    if s[i] in '+-':
        sign = -1 if s[i] == '-' else 1
        i += 1
    
    result = 0
    while i < n and s[i].isdigit():
        digit = ord(s[i]) - ord('0')
        if result > (INT_MAX - digit) // 10:
            return INT_MAX if sign == 1 else INT_MIN
        result = result * 10 + digit
        i += 1
    
    return sign * result
```

```java
public int myAtoi(String s) {
    final int INT_MAX = Integer.MAX_VALUE;
    final int INT_MIN = Integer.MIN_VALUE;
    
    int i = 0, n = s.length();
    while (i < n && s.charAt(i) == ' ') i++;
    
    if (i >= n) return 0;
    
    int sign = 1;
    if (s.charAt(i) == '+' || s.charAt(i) == '-') {
        sign = s.charAt(i) == '-' ? -1 : 1;
        i++;
    }
    
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
int myAtoi(string s) {
    const int INT_MAX = INT_MAX;
    const int INT_MIN = INT_MIN;
    
    int i = 0, n = s.length();
    while (i < n && s[i] == ' ') i++;
    
    if (i >= n) return 0;
    
    int sign = 1;
    if (s[i] == '+' || s[i] == '-') {
        sign = s[i] == '-' ? -1 : 1;
        i++;
    }
    
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
function myAtoi(s) {
    const INT_MAX = Math.pow(2, 31) - 1;
    const INT_MIN = -Math.pow(2, 31);
    
    let i = 0, n = s.length;
    while (i < n && s[i] === ' ') i++;
    
    if (i >= n) return 0;
    
    let sign = 1;
    if (s[i] === '+' || s[i] === '-') {
        sign = s[i] === '-' ? -1 : 1;
        i++;
    }
    
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

---

## LeetCode Link

[String to Integer (atoi) - LeetCode](https://leetcode.com/problems/string-to-integer-atoi/)
