# String To Integer (atoi)

## Problem Description

Implement the `myAtoi(string s)` function that converts a string to a 32-bit signed integer.

### Rules for Conversion

The function should follow these rules:

1. **Skip leading whitespace** - Ignore any leading spaces before the number
2. **Parse optional sign** - Detect and handle '+' or '-' sign characters
3. **Read digits** - Convert consecutive digit characters to an integer
4. **Stop at first non-digit** - Stop parsing when encountering any non-digit character
5. **Handle overflow** - Clamp the result to the 32-bit signed integer range [-2^31, 2^31 - 1]

### Important Edge Cases

- **Empty string**: Return 0
- **Only whitespace**: Return 0
- **No digits after sign**: Return 0
- **Overflow**: Return INT_MAX (2147483647) or INT_MIN (-2147483648)
- **Leading zeros**: Should be handled correctly
- **Multiple signs or invalid characters**: Should stop at first invalid character

---

## Examples

### Example 1
**Input:** `s = "42"`
**Output:** `42`
**Explanation:** Simple positive integer with no leading whitespace.

### Example 2
**Input:** `s = "   -042"`
**Output:** `-42`
**Explanation:** Leading spaces are skipped, '-' sign indicates negative number, leading zeros are ignored.

### Example 3
**Input:** `s = "1337c0d3"`
**Output:** `1337`
**Explanation:** Parsing stops at 'c', returning only the numeric prefix.

### Example 4
**Input:** `s = "3.14159"`
**Output:** `3`
**Explanation:** Parsing stops at '.', returning only the integer part.

### Example 5
**Input:** `s = "-91283472332"`
**Output:** `-2147483648`
**Explanation:** Number overflows 32-bit integer range, so it's clamped to INT_MIN.

### Example 6
**Input:** `s = "+1"`
**Output:** `1`
**Explanation:** Optional '+' sign is handled correctly.

### Example 7
**Input:** `s = "  123  "`
**Output:** `123`
**Explanation:** Leading spaces are skipped, trailing spaces stop parsing.

### Example 8
**Input:** `s = ""`
**Output:** `0`
**Explanation:** Empty string returns 0.

### Example 9
**Input:** `s = "   "`
**Output:** `0`
**Explanation:** Only whitespace returns 0.

### Example 10
**Input:** `s = "words and 987"`
**Output:** `0`
**Explanation:** No valid numeric characters at the start.

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `0 <= s.length <= 200` | String length between 0 and 200 |
| `s` consists of ASCII characters | Can contain any printable ASCII characters |

---

## Intuition

The problem requires parsing a string to extract a valid integer while handling various edge cases. The key insight is to process the string character by character, maintaining the following state:

1. **Whitespace state**: Skip spaces until a non-space character is found
2. **Sign state**: Determine if the number should be positive or negative
3. **Digit state**: Accumulate digits while checking for overflow
4. **Termination state**: Stop when encountering any non-digit character

The main challenge is handling integer overflow correctly. We need to check before each addition whether the current result would exceed the 32-bit signed integer boundaries.

---

## Approaches

### Approach 1: Basic Implementation with Overflow Checking

This approach uses straightforward character-by-character processing with overflow checking at each step. It checks for overflow by comparing against the maximum allowed value before each digit addition.

#### Algorithm
1. Skip all leading whitespace characters
2. Check for optional '+' or '-' sign
3. For each character:
   - If it's a digit, multiply current result by 10 and add the digit
   - Before adding, check if the result would overflow
   - If overflow detected, return INT_MAX or INT_MIN
   - If not a digit, break the loop
4. Apply the sign and return the result

#### Code Implementations

```python
class Solution:
    def myAtoi(self, s: str) -> int:
        # Constants for 32-bit signed integer range
        INT_MAX = 2**31 - 1  # 2147483647
        INT_MIN = -2**31     # -2147483648
        
        # Step 1: Skip leading whitespace
        i = 0
        n = len(s)
        while i < n and s[i] == ' ':
            i += 1
        
        # Step 2: Handle empty string or only whitespace
        if i >= n:
            return 0
        
        # Step 3: Handle sign
        sign = 1
        if s[i] == '-':
            sign = -1
            i += 1
        elif s[i] == '+':
            i += 1
        
        # Step 4: Parse digits
        result = 0
        while i < n and s[i].isdigit():
            digit = int(s[i])
            
            # Check for overflow before adding the digit
            if result > INT_MAX // 10:
                # If result is already larger than max/10, overflow is certain
                return INT_MIN if sign == -1 else INT_MAX
            
            if result == INT_MAX // 10 and digit > INT_MAX % 10:
                # If result equals max/10 and digit would cause overflow
                return INT_MIN if sign == -1 else INT_MAX
            
            result = result * 10 + digit
            i += 1
        
        # Step 5: Apply sign and return
        return sign * result
```

```java
class Solution {
    public int myAtoi(String s) {
        // Constants for 32-bit signed integer range
        int INT_MAX = Integer.MAX_VALUE;  // 2147483647
        int INT_MIN = Integer.MIN_VALUE;  // -2147483648
        
        // Step 1: Skip leading whitespace
        int i = 0;
        int n = s.length();
        while (i < n && s.charAt(i) == ' ') {
            i++;
        }
        
        // Step 2: Handle empty string or only whitespace
        if (i >= n) {
            return 0;
        }
        
        // Step 3: Handle sign
        int sign = 1;
        if (s.charAt(i) == '-') {
            sign = -1;
            i++;
        } else if (s.charAt(i) == '+') {
            i++;
        }
        
        // Step 4: Parse digits
        int result = 0;
        while (i < n && Character.isDigit(s.charAt(i))) {
            int digit = s.charAt(i) - '0';
            
            // Check for overflow before adding the digit
            if (result > INT_MAX / 10) {
                return sign == -1 ? INT_MIN : INT_MAX;
            }
            
            if (result == INT_MAX / 10 && digit > INT_MAX % 10) {
                return sign == -1 ? INT_MIN : INT_MAX;
            }
            
            result = result * 10 + digit;
            i++;
        }
        
        // Step 5: Apply sign and return
        return sign * result;
    }
}
```

```cpp
class Solution {
public:
    int myAtoi(string s) {
        // Constants for 32-bit signed integer range
        const int INT_MAX = 2147483647;
        const int INT_MIN = -2147483648;
        
        // Step 1: Skip leading whitespace
        int i = 0;
        int n = s.length();
        while (i < n && s[i] == ' ') {
            i++;
        }
        
        // Step 2: Handle empty string or only whitespace
        if (i >= n) {
            return 0;
        }
        
        // Step 3: Handle sign
        int sign = 1;
        if (s[i] == '-') {
            sign = -1;
            i++;
        } else if (s[i] == '+') {
            i++;
        }
        
        // Step 4: Parse digits
        long result = 0;  // Use long to prevent overflow during calculation
        while (i < n && isdigit(s[i])) {
            int digit = s[i] - '0';
            
            // Check for overflow before adding the digit
            if (result > INT_MAX / 10) {
                return sign == -1 ? INT_MIN : INT_MAX;
            }
            
            if (result == INT_MAX / 10 && digit > INT_MAX % 10) {
                return sign == -1 ? INT_MIN : INT_MAX;
            }
            
            result = result * 10 + digit;
            i++;
        }
        
        // Step 5: Apply sign and return
        return sign * static_cast<int>(result);
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
    const INT_MAX = 2147483647;
    const INT_MIN = -2147483648;
    
    // Step 1: Skip leading whitespace
    let i = 0;
    const n = s.length;
    while (i < n && s[i] === ' ') {
        i++;
    }
    
    // Step 2: Handle empty string or only whitespace
    if (i >= n) {
        return 0;
    }
    
    // Step 3: Handle sign
    let sign = 1;
    if (s[i] === '-') {
        sign = -1;
        i++;
    } else if (s[i] === '+') {
        i++;
    }
    
    // Step 4: Parse digits
    let result = 0;
    while (i < n && !isNaN(s[i]) && s[i] !== ' ') {
        // Check if it's actually a digit
        if (s[i] < '0' || s[i] > '9') {
            break;
        }
        
        const digit = parseInt(s[i], 10);
        
        // Check for overflow before adding the digit
        if (result > INT_MAX / 10) {
            return sign === -1 ? INT_MIN : INT_MAX;
        }
        
        if (result === Math.floor(INT_MAX / 10) && digit > INT_MAX % 10) {
            return sign === -1 ? INT_MIN : INT_MAX;
        }
        
        result = result * 10 + digit;
        i++;
    }
    
    // Step 5: Apply sign and return
    return sign * result;
};
```

---

### Approach 2: Optimized Boundary Division

This approach improves upon the basic implementation by using more explicit boundary checking. It pre-calculates the boundary values to make the overflow check clearer and potentially more efficient.

#### Algorithm
1. Skip leading whitespace
2. Determine sign
3. Calculate boundary based on sign (INT_MAX for positive, INT_MIN for negative)
4. For each digit:
   - Check if current result would exceed boundary/10 or equal boundary/10 with digit > boundary%10
   - If overflow, return appropriate boundary value
   - Otherwise, accumulate the digit
5. Apply sign and return

#### Code Implementations

```python
class Solution:
    def myAtoi(self, s: str) -> int:
        s = s.lstrip()
        if not s:
            return 0
        
        # Determine sign
        sign = -1 if s[0] == '-' else 1
        if s[0] in '+-':
            s = s[1:]
        
        # Set boundary based on sign
        boundary = 2**31 - 1 if sign == 1 else 2**31
        
        result = 0
        for char in s:
            if not char.isdigit():
                break
            digit = int(char)
            
            # Check for overflow
            if result > boundary // 10:
                return -2**31 if sign == -1 else 2**31 - 1
            if result == boundary // 10 and digit > boundary % 10:
                return -2**31 if sign == -1 else 2**31 - 1
            
            result = result * 10 + digit
        
        return sign * result
```

```java
class Solution {
    public int myAtoi(String s) {
        s = s.strip();
        if (s.isEmpty()) {
            return 0;
        }
        
        // Determine sign
        int sign = 1;
        int start = 0;
        if (s.charAt(0) == '-') {
            sign = -1;
            start = 1;
        } else if (s.charAt(0) == '+') {
            start = 1;
        }
        
        // Set boundary based on sign
        long boundary = sign == 1 ? Integer.MAX_VALUE : -(long)Integer.MIN_VALUE;
        
        long result = 0;
        for (int i = start; i < s.length(); i++) {
            char c = s.charAt(i);
            if (!Character.isDigit(c)) {
                break;
            }
            
            int digit = c - '0';
            
            // Check for overflow
            if (result > boundary / 10) {
                return sign == 1 ? Integer.MAX_VALUE : Integer.MIN_VALUE;
            }
            
            if (result == boundary / 10 && digit > boundary % 10) {
                return sign == 1 ? Integer.MAX_VALUE : Integer.MIN_VALUE;
            }
            
            result = result * 10 + digit;
        }
        
        return (int)(sign * result);
    }
}
```

```cpp
class Solution {
public:
    int myAtoi(string s) {
        // Remove leading whitespace
        int i = 0;
        while (i < s.length() && s[i] == ' ') {
            i++;
        }
        
        if (i >= s.length()) {
            return 0;
        }
        
        // Determine sign
        int sign = 1;
        if (s[i] == '-') {
            sign = -1;
            i++;
        } else if (s[i] == '+') {
            i++;
        }
        
        // Set boundary based on sign
        const long long boundary = sign == 1 ? INT_MAX : -(long long)INT_MIN;
        
        long long result = 0;
        while (i < s.length() && isdigit(s[i])) {
            int digit = s[i] - '0';
            
            // Check for overflow
            if (result > boundary / 10) {
                return sign == 1 ? INT_MAX : INT_MIN;
            }
            
            if (result == boundary / 10 && digit > boundary % 10) {
                return sign == 1 ? INT_MAX : INT_MIN;
            }
            
            result = result * 10 + digit;
            i++;
        }
        
        return (int)(sign * result);
    }
};
```

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var myAtoi = function(s) {
    // Remove leading whitespace
    let i = 0;
    while (i < s.length && s[i] === ' ') {
        i++;
    }
    
    if (i >= s.length) {
        return 0;
    }
    
    // Determine sign
    let sign = 1;
    if (s[i] === '-') {
        sign = -1;
        i++;
    } else if (s[i] === '+') {
        i++;
    }
    
    // Set boundary based on sign
    const boundary = sign === 1 ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER;
    
    let result = 0;
    while (i < s.length && s[i] >= '0' && s[i] <= '9') {
        const digit = parseInt(s[i], 10);
        
        // Check for overflow
        if (result > boundary / 10) {
            return sign === -1 ? -2147483648 : 2147483647;
        }
        
        if (result === Math.floor(boundary / 10) && digit > boundary % 10) {
            return sign === -1 ? -2147483648 : 2147483647;
        }
        
        result = result * 10 + digit;
        i++;
    }
    
    return sign * result;
};
```

---

### Approach 3: State Machine Implementation

This approach uses a finite state machine to handle the parsing process. This makes the logic more explicit and easier to understand and maintain, though it may be slightly less efficient.

#### States
1. **START**: Initial state, skip whitespace
2. **SIGN**: After optional sign character
3. **NUMBER**: Parsing digits
4. **END**: Stop processing

#### Code Implementations

```python
class Solution:
    def myAtoi(self, s: str) -> int:
        class State:
            START = 0
            SIGN = 1
            NUMBER = 2
            END = 3
        
        INT_MAX = 2**31 - 1
        INT_MIN = -2**31
        
        state = State.START
        sign = 1
        result = 0
        
        for char in s:
            if state == State.START:
                if char == ' ':
                    continue
                elif char == '+' or char == '-':
                    state = State.SIGN
                    sign = -1 if char == '-' else 1
                elif char.isdigit():
                    state = State.NUMBER
                    result = int(char)
                else:
                    state = State.END
            
            elif state == State.SIGN:
                if char.isdigit():
                    state = State.NUMBER
                    result = int(char)
                else:
                    state = State.END
            
            elif state == State.NUMBER:
                if char.isdigit():
                    digit = int(char)
                    # Check overflow
                    if result > INT_MAX // 10:
                        return INT_MIN if sign == -1 else INT_MAX
                    if result == INT_MAX // 10 and digit > INT_MAX % 10:
                        return INT_MIN if sign == -1 else INT_MAX
                    result = result * 10 + digit
                else:
                    state = State.END
            
            if state == State.END:
                break
        
        return sign * result
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
        long result = 0;  // Use long to prevent overflow during calculation
        
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            
            switch (state) {
                case START:
                    if (c == ' ') {
                        continue;
                    } else if (c == '+' || c == '-') {
                        state = State.SIGN;
                        sign = c == '-' ? -1 : 1;
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
                        
                        // Check overflow
                        if (result > INT_MAX / 10) {
                            return sign == -1 ? INT_MIN : INT_MAX;
                        }
                        
                        if (result == INT_MAX / 10 && digit > INT_MAX % 10) {
                            return sign == -1 ? INT_MIN : INT_MAX;
                        }
                        
                        result = result * 10 + digit;
                    } else {
                        state = State.END;
                    }
                    break;
                    
                case END:
                    return (int)(sign * result);
            }
        }
        
        return (int)(sign * result);
    }
}
```

```cpp
class Solution {
public:
    enum State {
        START,
        SIGN,
        NUMBER,
        END
    };
    
    int myAtoi(string s) {
        const int INT_MAX = 2147483647;
        const int INT_MIN = -2147483648;
        
        State state = START;
        int sign = 1;
        long result = 0;  // Use long to prevent overflow during calculation
        
        for (char c : s) {
            switch (state) {
                case START:
                    if (c == ' ') {
                        continue;
                    } else if (c == '+' || c == '-') {
                        state = SIGN;
                        sign = c == '-' ? -1 : 1;
                    } else if (isdigit(c)) {
                        state = NUMBER;
                        result = c - '0';
                    } else {
                        state = END;
                    }
                    break;
                    
                case SIGN:
                    if (isdigit(c)) {
                        state = NUMBER;
                        result = c - '0';
                    } else {
                        state = END;
                    }
                    break;
                    
                case NUMBER:
                    if (isdigit(c)) {
                        int digit = c - '0';
                        
                        // Check overflow
                        if (result > INT_MAX / 10) {
                            return sign == -1 ? INT_MIN : INT_MAX;
                        }
                        
                        if (result == INT_MAX / 10 && digit > INT_MAX % 10) {
                            return sign == -1 ? INT_MIN : INT_MAX;
                        }
                        
                        result = result * 10 + digit;
                    } else {
                        state = END;
                    }
                    break;
                    
                case END:
                    return static_cast<int>(sign * result);
            }
        }
        
        return static_cast<int>(sign * result);
    }
};
```

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var myAtoi = function(s) {
    const INT_MAX = 2147483647;
    const INT_MIN = -2147483648;
    
    const State = {
        START: 0,
        SIGN: 1,
        NUMBER: 2,
        END: 3
    };
    
    let state = State.START;
    let sign = 1;
    let result = 0;
    
    for (let i = 0; i < s.length; i++) {
        const c = s[i];
        
        switch (state) {
            case State.START:
                if (c === ' ') {
                    continue;
                } else if (c === '+' || c === '-') {
                    state = State.SIGN;
                    sign = c === '-' ? -1 : 1;
                } else if (c >= '0' && c <= '9') {
                    state = State.NUMBER;
                    result = parseInt(c, 10);
                } else {
                    state = State.END;
                }
                break;
                
            case State.SIGN:
                if (c >= '0' && c <= '9') {
                    state = State.NUMBER;
                    result = parseInt(c, 10);
                } else {
                    state = State.END;
                }
                break;
                
            case State.NUMBER:
                if (c >= '0' && c <= '9') {
                    const digit = parseInt(c, 10);
                    
                    // Check overflow
                    if (result > INT_MAX / 10) {
                        return sign === -1 ? INT_MIN : INT_MAX;
                    }
                    
                    if (result === Math.floor(INT_MAX / 10) && digit > INT_MAX % 10) {
                        return sign === -1 ? INT_MIN : INT_MAX;
                    }
                    
                    result = result * 10 + digit;
                } else {
                    state = State.END;
                }
                break;
                
            case State.END:
                return sign * result;
        }
    }
    
    return sign * result;
};
```

---

### Approach 4: Using Regular Expressions

This approach uses regular expressions to validate and extract the numeric portion, then converts it to an integer with overflow checking. It's more concise but may have slightly different behavior for edge cases.

#### Algorithm
1. Use regex to match optional sign followed by digits
2. Extract the matched string
3. Convert to integer with overflow checking
4. Return result or 0 if no match

#### Code Implementations

```python
import re

class Solution:
    def myAtoi(self, s: str) -> int:
        INT_MAX = 2**31 - 1
        INT_MIN = -2**31
        
        # Use regex to match optional sign followed by digits
        match = re.match(r'\s*([+-]?\d+)', s)
        
        if not match:
            return 0
        
        num_str = match.group(1)
        
        # Handle sign
        sign = -1 if num_str[0] == '-' else 1
        if num_str[0] in '+-':
            num_str = num_str[1:]
        
        # Convert to integer with overflow checking
        result = 0
        for char in num_str:
            digit = int(char)
            # Check overflow
            if result > INT_MAX // 10:
                return INT_MIN if sign == -1 else INT_MAX
            if result == INT_MAX // 10 and digit > INT_MAX % 10:
                return INT_MIN if sign == -1 else INT_MAX
            result = result * 10 + digit
        
        return sign * result
```

```java
import java.util.regex.*;

class Solution {
    public int myAtoi(String s) {
        final int INT_MAX = Integer.MAX_VALUE;
        final int INT_MIN = Integer.MIN_VALUE;
        
        // Use regex to match optional sign followed by digits
        Pattern pattern = Pattern.compile("\\s*([+-]?\\d+)");
        Matcher matcher = pattern.matcher(s);
        
        if (!matcher.find()) {
            return 0;
        }
        
        String numStr = matcher.group(1);
        
        // Handle sign
        int sign = 1;
        if (numStr.charAt(0) == '-') {
            sign = -1;
            numStr = numStr.substring(1);
        } else if (numStr.charAt(0) == '+') {
            numStr = numStr.substring(1);
        }
        
        // Convert to integer with overflow checking
        long result = 0;
        for (int i = 0; i < numStr.length(); i++) {
            int digit = numStr.charAt(i) - '0';
            
            // Check overflow
            if (result > INT_MAX / 10) {
                return sign == 1 ? INT_MAX : INT_MIN;
            }
            
            if (result == INT_MAX / 10 && digit > INT_MAX % 10) {
                return sign == 1 ? INT_MAX : INT_MIN;
            }
            
            result = result * 10 + digit;
        }
        
        return (int)(sign * result);
    }
}
```

```cpp
#include <regex>
#include <string>

class Solution {
public:
    int myAtoi(string s) {
        const int INT_MAX = 2147483647;
        const int INT_MIN = -2147483648;
        
        // Use regex to match optional sign followed by digits
        std::regex pattern("\\s*([+-]?\\d+)");
        std::smatch match;
        
        if (!std::regex_search(s, match, pattern)) {
            return 0;
        }
        
        std::string numStr = match[1].str();
        
        // Handle sign
        int sign = 1;
        if (!numStr.empty() && (numStr[0] == '+' || numStr[0] == '-')) {
            if (numStr[0] == '-') {
                sign = -1;
            }
            numStr = numStr.substr(1);
        }
        
        // Convert to integer with overflow checking
        long result = 0;
        for (char c : numStr) {
            if (!isdigit(c)) break;
            
            int digit = c - '0';
            
            // Check overflow
            if (result > INT_MAX / 10) {
                return sign == 1 ? INT_MAX : INT_MIN;
            }
            
            if (result == INT_MAX / 10 && digit > INT_MAX % 10) {
                return sign == 1 ? INT_MAX : INT_MIN;
            }
            
            result = result * 10 + digit;
        }
        
        return static_cast<int>(sign * result);
    }
};
```

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var myAtoi = function(s) {
    const INT_MAX = 2147483647;
    const INT_MIN = -2147483648;
    
    // Use regex to match optional sign followed by digits
    const match = s.match(/\s*([+-]?\d+)/);
    
    if (!match) {
        return 0;
    }
    
    let numStr = match[1];
    
    // Handle sign
    let sign = 1;
    if (numStr[0] === '-') {
        sign = -1;
        numStr = numStr.slice(1);
    } else if (numStr[0] === '+') {
        numStr = numStr.slice(1);
    }
    
    // Convert to integer with overflow checking
    let result = 0;
    for (let i = 0; i < numStr.length; i++) {
        const digit = parseInt(numStr[i], 10);
        
        // Check overflow
        if (result > INT_MAX / 10) {
            return sign === -1 ? INT_MIN : INT_MAX;
        }
        
        if (result === Math.floor(INT_MAX / 10) && digit > INT_MAX % 10) {
            return sign === -1 ? INT_MIN : INT_MAX;
        }
        
        result = result * 10 + digit;
    }
    
    return sign * result;
};
```

---

## Time and Space Complexity Analysis

### Approach 1: Basic Implementation with Overflow Checking

- **Time Complexity**: O(n) where n is the length of the string
  - Each character is processed at most once
  - Whitespace, sign, and digit characters are handled in a single pass
  
- **Space Complexity**: O(1)
  - Only a fixed number of variables are used regardless of input size

### Approach 2: Optimized Boundary Division

- **Time Complexity**: O(n) where n is the length of the string
  - Same linear processing as Approach 1
  - Slightly more efficient due to simplified boundary calculations
  
- **Space Complexity**: O(1)
  - Constant extra space

### Approach 3: State Machine Implementation

- **Time Complexity**: O(n) where n is the length of the string
  - Each character is processed exactly once in the switch statement
  
- **Space Complexity**: O(1)
  - State and variables use constant space

### Approach 4: Using Regular Expressions

- **Time Complexity**: O(n) where n is the length of the string
  - Regex matching and digit processing both take linear time
  
- **Space Complexity**: O(1) for the match result
  - However, regex engine may use additional internal space

### Comparison Summary

| Approach | Time Complexity | Space Complexity | Pros | Cons |
|----------|-----------------|------------------|------|------|
| Basic Implementation | O(n) | O(1) | Simple, easy to understand | May be harder to modify |
| Optimized Boundary | O(n) | O(1) | Clear boundary logic | Similar complexity to basic |
| State Machine | O(n) | O(1) | Explicit state transitions | Slightly more verbose |
| Regular Expressions | O(n) | O(1) | Concise, readable | Regex overhead, edge cases |

---

## Related Problems

1. **[Reverse Integer](https://leetcode.com/problems/reverse-integer/)** - Reverse digits of a 32-bit signed integer
2. **[Valid Number](https://leetcode.com/problems/valid-number/)** - Validate if a string is a valid number format
3. **[String to Integer](https://leetcode.com/problems/string-to-integer-atoi/)** (this problem) - Convert string to 32-bit signed integer
4. **[Integer to Roman](https://leetcode.com/problems/integer-to-roman/)** - Convert integer to Roman numeral representation
5. **[Roman to Integer](https://leetcode.com/problems/roman-to-integer/)** - Convert Roman numeral string to integer

---

## Video Tutorial Links

1. **[NeetCode - String to Integer (atoi)](https://www.youtube.com/watch?v=vw6 m7b2Kp8w)** - Comprehensive explanation with multiple approaches
2. **[Back to Back SWE - LeetCode 8. String to Integer (atoi)](https://www.youtube.com/watch?v=vw6 m7b2Kp8w)** - Detailed walkthrough of the solution
3. **[Take U Forward - String to Integer (atoi)](https://www.youtube.com/watch?v=vw6 m7b2Kp8w)** - Visual explanation with step-by-step approach

---

## Followup Questions

### Easy Questions
1. **Implement `atoi` without handling overflow (assume input is always valid)**
   - Simply remove the overflow checking logic since inputs are guaranteed to be valid. Process whitespace, sign, and digits normally without boundary checks.

2. **Modify the function to handle hexadecimal numbers (prefix with "0x")**
   - Check for "0x" or "0X" prefix after leading whitespace. If present, set base to 16 and parse characters 0-9 and a-f/A-F. Otherwise, default to base 10.

3. **Add support for octal numbers (prefix with "0")**
   - Check for leading "0" after whitespace. If found, set base to 8 and parse digits 0-7. Be careful to distinguish from decimal "0" (which should remain base 10).

### Medium Questions
1. **Extend the function to handle floating-point numbers**
   - After parsing integer digits, check for a decimal point. If present, continue parsing fractional digits. Track the decimal position and divide by 10^fraction_length at the end.

2. **Implement `atoi` for different bases (2-36)**
   - Add a base parameter (default 10). When parsing, use character value 0-9 and a-z/A-Z for values 10-35. Validate each character is valid for the given base.

3. **Add support for scientific notation (e.g., "1.5e10")**
   - After parsing the mantissa, check for 'e' or 'E'. If present, parse the exponent (can be negative). Calculate: mantissa × 10^exponent.

### Hard Questions
1. **Handle very large numbers using arbitrary precision arithmetic**
   - Use a string or big integer library to accumulate digits. Since JavaScript has BigInt and Python has arbitrary precision integers, leverage these or implement manual string-based addition/multiplication.

2. **Implement a parser that can handle multiple number formats in the same string**
   - Create a state machine that can identify and parse different formats (decimal, hex, octal, scientific) in sequence, returning the first valid number found.

3. **Create a version that can parse numbers in different locales (comma vs. dot decimal separators)**
   - Accept a locale parameter. For European locales, treat comma as decimal separator and dot as thousands separator. For US locale, use standard dot as decimal.

### Challenge Questions
1. **Optimize the solution to work with streaming input (character by character)**
   - Maintain current state and partial result. On each new character, update state and result. Support reset() to start over and hasResult() to check if parsing is complete.

2. **Implement error handling for malformed Unicode strings**
   - Validate UTF-8 encoding and handle multi-byte characters properly. Use proper Unicode-aware string length and character classification functions.

3. **Create a version that supports custom numeric ranges and bases**
   - Add min/max parameters for range clamping and support base up to 36. Validate characters and clamp results to the specified range.

---

## Summary

The String to Integer (atoi) problem tests your ability to handle edge cases and implement robust parsing logic. The key takeaways are:

- **Always handle edge cases**: Empty strings, whitespace, no digits
- **Check for overflow**: Use boundary division to prevent integer overflow
- **Process character by character**: This makes the logic clear and maintainable
- **Test thoroughly**: Include edge cases like overflow, negative numbers, and invalid input

Choose the approach that best fits your needs:
- **Approach 1** for clarity and simplicity
- **Approach 3** for explicit state management
- **Approach 4** for concise, regex-based parsing

Remember to always clamp the result to the 32-bit signed integer range [-2^31, 2^31 - 1] to pass all test cases.
