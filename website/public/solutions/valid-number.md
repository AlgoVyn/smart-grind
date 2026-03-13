# Valid Number

## Problem Description

Given a string `s`, return whether `s` is a valid number.

For example, all the following are valid numbers: `"2"`, `"0089"`, `"-0.1"`, `"+3.14"`, `"4."`, `"-.9"`, `"2e10"`, `"-90E3"`, `"3e+7"`, `"+6e-1"`, `"53.5e93"`, `"-123.456e789"`, while the following are not valid numbers: `"abc"`, `"1a"`, `"1e"`, `"e3"`, `"99e2.5"`, `"--"`, `"-+3"`, `"95a54e53"`.

Formally, a valid number is defined using one of the following definitions:

- An integer number followed by an optional exponent.
- A decimal number followed by an optional exponent.

An integer number is defined with an optional sign `'-'` or `'+'` followed by digits. A decimal number is defined with an optional sign `'-'` or `'+'` followed by one of the following definitions:

- Digits followed by a dot `'.'`.
- Digits followed by a dot `'.'` followed by digits.
- A dot `'.'` followed by digits.

An exponent is defined with an exponent notation `'e'` or `'E'` followed by an integer number. The digits are defined as one or more digits.

**LeetCode Link:** [Valid Number](https://leetcode.com/problems/valid-number/)

---

## Examples

**Example 1:**

Input:
```python
s = "0"
```

Output:
```python
true
```

**Example 2:**

Input:
```python
s = "e"
```

Output:
```python
false
```

**Example 3:**

Input:
```python
s = "."
```

Output:
```python
false
```

---

## Constraints

- `1 <= s.length <= 20`
- `s` consists of only English letters (both uppercase and lowercase), digits (0-9), plus `'+'`, minus `'-'`, or dot `'.'`.

---

## Pattern: Regular Expression (Regex) / Finite State Machine

This problem uses a **regular expression** to validate whether a string represents a valid number. The regex pattern matches the formal definition of valid numbers including integers, decimals, and scientific notation with optional signs.

### Core Concept

- **Regex Pattern**: Match entire string against valid number format
- **Finite State Machine**: Alternative approach using state transitions
- **Edge Case Handling**: Must handle all valid/invalid formats

---

## Intuition

The key insight for this problem is understanding the formal definition of a valid number and breaking it down into components:

1. **Number Components**:
   - **Integer**: Optional sign + digits (e.g., "123", "-45", "+67")
   - **Decimal**: Optional sign + digits + dot + optional digits (e.g., "3.14", ".5", "5.")
   - **Scientific**: Base + "e/E" + exponent (e.g., "2e10", "3.5e-7")

2. **Key Observations**:
   - A decimal must have digits before OR after the dot (not just ".")
   - An exponent requires a valid number before "e"
   - Signs can only appear at the start or after "e"

3. **Alternative: Finite State Machine**:
   - States: SIGN, DIGIT, DOT, EXPONENT, END
   - Each character transitions between states
   - Some transitions are invalid

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Regular Expression** - Most common and readable
2. **Finite State Machine** - More explicit, no regex library needed
3. **Strip and Parse** - Try to parse and catch exceptions

---

## Approach 1: Regular Expression (Most Common)

### Algorithm Steps

1. Define a regex pattern that matches valid numbers:
   - Optional sign: `[+-]?`
   - Integer or decimal: `(\d+\.?\d*|\.\d+)`
   - Optional exponent: `([eE][+-]?\d+)?`
2. Use `re.match()` to check if entire string matches
3. Return boolean result

### Why It Works

The regex pattern exactly follows the formal definition of valid numbers. Each component is carefully constructed to match valid formats while rejecting invalid ones.

### Code Implementation

````carousel
```python
import re

def isNumber(s: str) -> bool:
    # Regex pattern for valid number
    pattern = r'^[+-]?((\d+\.?\d*)|(\.\d+))([eE][+-]?\d+)?$'
    return bool(re.match(pattern, s.strip()))
```

<!-- slide -->
```cpp
#include <string>
#include <regex>
using namespace std;

class Solution {
public:
    bool isNumber(string s) {
        // Trim whitespace
        int start = 0, end = s.size() - 1;
        while (start <= end && isspace(s[start])) start++;
        while (end >= start && isspace(s[end])) end--;
        
        if (start > end) return false;
        
        // Regex pattern
        regex pattern(R"([+-]?((\d+\.?\d*)|(\.\d+))([eE][+-]?\d+)?)");
        string trimmed = s.substr(start, end - start + 1);
        return regex_match(trimmed, pattern);
    }
};
```

<!-- slide -->
```java
class Solution {
    public boolean isNumber(String s) {
        s = s.trim();
        if (s.isEmpty()) return false;
        
        // Regex pattern
        String pattern = "[+-]?((\\d+\\.?\\d*)|(\\.\\d+))([eE][+-]?\\d+)?";
        return s.matches(pattern);
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} s
 * @return {boolean}
 */
var isNumber = function(s) {
    s = s.trim();
    if (!s) return false;
    
    // Regex pattern
    const pattern = /^[+-]?((\d+\.?\d*)|(\.\d+))([eE][+-]?\d+)?$/;
    return pattern.test(s);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) where n is string length |
| **Space** | O(1) - constant space (regex engine handles pattern) |

---

## Approach 2: Finite State Machine

### Algorithm Steps

1. Define states: START, SIGN, INT, DOT, FRAC, EXP, EXP_SIGN, EXP_DIGIT, END
2. Define valid transitions for each state
3. Process each character, transitioning between states
4. Accept if ending in a valid final state

### Why It Works

A finite state machine explicitly models all valid number formats as state transitions. This is more verbose but doesn't require regex.

### Code Implementation

````carousel
```python
def isNumber(s: str) -> bool:
    s = s.strip()
    if not s:
        return False
    
    # State enum
    STATE = {
        'START': 0,
        'SIGN': 1,
        'DIGIT': 2,
        'DOT': 3,
        'FRAC': 4,
        'EXP': 5,
        'EXP_SIGN': 6,
        'EXP_DIGIT': 7,
        'END': 8
    }
    
    # Transitions: state -> [(char_category, next_state), ...]
    transitions = {
        STATE['START']: [('sign', STATE['SIGN']), ('digit', STATE['DIGIT']), ('dot', STATE['DOT'])],
        STATE['SIGN']: [('digit', STATE['DIGIT']), ('dot', STATE['DOT'])],
        STATE['DIGIT']: [('digit', STATE['DIGIT']), ('dot', STATE['DOT']), ('exp', STATE['EXP'])],
        STATE['DOT']: [('digit', STATE['FRAC'])],
        STATE['FRAC']: [('digit', STATE['FRAC']), ('exp', STATE['EXP'])],
        STATE['EXP']: [('sign', STATE['EXP_SIGN']), ('digit', STATE['EXP_DIGIT'])],
        STATE['EXP_SIGN']: [('digit', STATE['EXP_DIGIT'])],
        STATE['EXP_DIGIT']: [('digit', STATE['EXP_DIGIT'])],
    }
    
    def char_type(c):
        if c in '+-': return 'sign'
        if c.isdigit(): return 'digit'
        if c == '.': return 'dot'
        if c in 'eE': return 'exp'
        return 'invalid'
    
    state = STATE['START']
    for c in s:
        ct = char_type(c)
        if ct == 'invalid':
            return False
        
        found = False
        if state in transitions:
            for cat, next_state in transitions[state]:
                if cat == ct:
                    state = next_state
                    found = True
                    break
        if not found:
            return False
    
    # Valid end states
    return state in [STATE['DIGIT'], STATE['FRAC'], STATE['EXP_DIGIT']]
```

<!-- slide -->
```cpp
#include <string>
#include <unordered_map>
#include <set>
using namespace std;

class Solution {
public:
    bool isNumber(string s) {
        // Trim
        int i = 0, j = s.size() - 1;
        while (i <= j && isspace(s[i])) i++;
        while (j >= i && isspace(s[j])) j--;
        if (i > j) return false;
        
        // State machine
        enum State { START, SIGN, DIGIT, DOT, FRAC, EXP, EXP_SIGN, EXP_DIGIT };
        State state = START;
        
        auto charType = [](char c) {
            if (c == '+' || c == '-') return 0; // SIGN
            if (isdigit(c)) return 1; // DIGIT
            if (c == '.') return 2; // DOT
            if (c == 'e' || c == 'E') return 3; // EXP
            return -1; // INVALID
        };
        
        for (; i <= j; i++) {
            int ct = charType(s[i]);
            switch(state) {
                case START:
                    if (ct == 0) state = SIGN;
                    else if (ct == 1) state = DIGIT;
                    else if (ct == 2) state = DOT;
                    else return false;
                    break;
                case SIGN:
                    if (ct == 1) state = DIGIT;
                    else if (ct == 2) state = DOT;
                    else return false;
                    break;
                case DIGIT:
                    if (ct == 1) state = DIGIT;
                    else if (ct == 2) state = FRAC;
                    else if (ct == 3) state = EXP;
                    else return false;
                    break;
                case DOT:
                    if (ct == 1) state = FRAC;
                    else return false;
                    break;
                case FRAC:
                    if (ct == 1) state = FRAC;
                    else if (ct == 3) state = EXP;
                    else return false;
                    break;
                case EXP:
                    if (ct == 0) state = EXP_SIGN;
                    else if (ct == 1) state = EXP_DIGIT;
                    else return false;
                    break;
                case EXP_SIGN:
                    if (ct == 1) state = EXP_DIGIT;
                    else return false;
                    break;
                case EXP_DIGIT:
                    if (ct == 1) state = EXP_DIGIT;
                    else return false;
                    break;
            }
        }
        
        return state == DIGIT || state == FRAC || state == EXP_DIGIT;
    }
};
```

<!-- slide -->
```java
class Solution {
    public boolean isNumber(String s) {
        s = s.trim();
        if (s.isEmpty()) return false;
        
        int i = 0, n = s.length();
        
        // State: 0=START, 1=SIGN, 2=DIGIT, 3=DOT, 4=FRAC, 5=EXP, 6=EXP_SIGN, 7=EXP_DIGIT
        int state = 0;
        
        while (i < n) {
            char c = s.charAt(i);
            switch(state) {
                case 0:
                    if (c == '+' || c == '-') state = 1;
                    else if (Character.isDigit(c)) state = 2;
                    else if (c == '.') state = 3;
                    else return false;
                    break;
                case 1:
                    if (Character.isDigit(c)) state = 2;
                    else if (c == '.') state = 3;
                    else return false;
                    break;
                case 2:
                    if (Character.isDigit(c)) state = 2;
                    else if (c == '.') state = 4;
                    else if (c == 'e' || c == 'E') state = 5;
                    else return false;
                    break;
                case 3:
                    if (Character.isDigit(c)) state = 4;
                    else return false;
                    break;
                case 4:
                    if (Character.isDigit(c)) state = 4;
                    else if (c == 'e' || c == 'E') state = 5;
                    else return false;
                    break;
                case 5:
                    if (c == '+' || c == '-') state = 6;
                    else if (Character.isDigit(c)) state = 7;
                    else return false;
                    break;
                case 6:
                    if (Character.isDigit(c)) state = 7;
                    else return false;
                    break;
                case 7:
                    if (Character.isDigit(c)) state = 7;
                    else return false;
                    break;
            }
            i++;
        }
        
        return state == 2 || state == 4 || state == 7;
    }
}
```

<!-- slide -->
```javascript
var isNumber = function(s) {
    s = s.trim();
    if (!s) return false;
    
    // States: 0=START, 1=SIGN, 2=DIGIT, 3=DOT, 4=FRAC, 5=EXP, 6=EXP_SIGN, 7=EXP_DIGIT
    let state = 0;
    
    for (let i = 0; i < s.length; i++) {
        const c = s[i];
        
        switch(state) {
            case 0:
                if (c === '+' || c === '-') state = 1;
                else if (/\d/.test(c)) state = 2;
                else if (c === '.') state = 3;
                else return false;
                break;
            case 1:
                if (/\d/.test(c)) state = 2;
                else if (c === '.') state = 3;
                else return false;
                break;
            case 2:
                if (/\d/.test(c)) state = 2;
                else if (c === '.') state = 4;
                else if (c === 'e' || c === 'E') state = 5;
                else return false;
                break;
            case 3:
                if (/\d/.test(c)) state = 4;
                else return false;
                break;
            case 4:
                if (/\d/.test(c)) state = 4;
                else if (c === 'e' || c === 'E') state = 5;
                else return false;
                break;
            case 5:
                if (c === '+' || c === '-') state = 6;
                else if (/\d/.test(c)) state = 7;
                else return false;
                break;
            case 6:
                if (/\d/.test(c)) state = 7;
                else return false;
                break;
            case 7:
                if (/\d/.test(c)) state = 7;
                else return false;
                break;
        }
    }
    
    return state === 2 || state === 4 || state === 7;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) where n is string length |
| **Space** | O(1) - constant space |

---

## Approach 3: Strip and Parse (Exception-Based)

### Algorithm Steps

1. Strip leading/trailing whitespace
2. Try to parse as float
3. Catch exceptions and return False if fails

### Why It Works

Python's float() can parse most valid number formats. We just need to handle some edge cases manually.

### Code Implementation

````carousel
```python
def isNumber(s: str) -> bool:
    s = s.strip()
    if not s:
        return False
    
    # Handle edge cases that float() doesn't cover correctly
    if s.lower() == 'inf' or s.lower() == 'nan':
        return False
    
    try:
        float(s)
        # Additional check: ensure it's not just ".", "e", etc.
        # float(".") returns 0.0 which might not be desired
        if s == '.' or s == '+.' or s == '-.':
            return False
        return True
    except ValueError:
        return False
```

<!-- slide -->
```cpp
#include <string>
#include <cstdlib>
#include <cctype>
using namespace std;

class Solution {
public:
    bool isNumber(string s) {
        // Trim
        int i = 0, j = s.size() - 1;
        while (i <= j && isspace(s[i])) i++;
        while (j >= i && isspace(s[j])) j--;
        if (i > j) return false;
        
        s = s.substr(i, j - i + 1);
        
        // Try strtod
        char* end;
        double val = strtod(s.c_str(), &end);
        
        // Check if any conversion happened and we reached end
        if (end == s.c_str()) return false;
        if (*end != '\0') {
            // Could be "inf" or "nan" which we should reject
            if (s.find("inf") != string::npos || s.find("nan") != string::npos) {
                return false;
            }
            // Not a valid number
            return false;
        }
        
        return true;
    }
};
```

<!-- slide -->
```java
class Solution {
    public boolean isNumber(String s) {
        s = s.trim();
        if (s.isEmpty()) return false;
        
        try {
            Double.parseDouble(s);
            // Reject special cases
            if (s.equals(".") || s.equals("+.") || s.equals("-.")) {
                return false;
            }
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }
}
```

<!-- slide -->
```javascript
var isNumber = function(s) {
    s = s.trim();
    if (!s) return false;
    
    // Reject edge cases
    if (s === '.' || s === '+.' || s === '-.') return false;
    
    const num = Number(s);
    return !isNaN(num) && isFinite(num);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) typically |
| **Space** | O(1) |

---

## Comparison of Approaches

| Aspect | Regex | Finite State Machine | Strip and Parse |
|--------|-------|---------------------|-----------------|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(1) | O(1) | O(1) |
| **Implementation** | Simple | Complex | Simple |
| **LeetCode Optimal** | ✅ | ✅ | ✅ |
| **Difficulty** | Easy | Medium | Easy |

**Best Approach:** Use Approach 1 (Regex) for readability, or Approach 2 (FSM) to avoid regex library.

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| String to Integer (atoi) | [Link](https://leetcode.com/problems/string-to-integer-atoi/) | Parse integer strings |
| Number of Segments in a String | [Link](https://leetcode.com/problems/number-of-segments-in-a-string/) | Count string segments |

---

## Video Tutorial Links

1. **[NeetCode - Valid Number](https://www.youtube.com/watch?v=EXAMPLE)** - Clear explanation
2. **[Finite State Machine Tutorial](https://www.youtube.com/watch?v=EXAMPLE)** - Understanding FSMs

---

## Follow-up Questions

### Q1: How would you handle hexadecimal numbers?

**Answer:** Extend the regex pattern to include "0x" prefix and hex digits (0-9, a-f, A-F).

---

### Q2: Can you solve this without any libraries?

**Answer:** Yes, use the finite state machine approach (Approach 2) which only uses basic string operations.

---

### Q3: What's the difference between float("") and ValueError?

**Answer:** float("") raises ValueError, which we catch. But we also need to handle other edge cases like ".", "e", etc.

---

## Common Pitfalls

### 1. Not Trimming Whitespace
**Issue**: Input may have leading/trailing spaces.

**Solution**: Use `s.strip()` or manual trimming.

### 2. Regex Not Matching Entire String
**Issue**: Using `re.search()` instead of `re.match()`.

**Solution**: Use `re.match()` which matches from beginning, or use `^...$` in pattern.

### 3. Edge Cases with Dot
**Issue**: "." alone is invalid, but float(".") = 0.0.

**Solution**: Explicitly check for "." pattern before parsing.

### 4. Scientific Notation
**Issue**: Forgetting to handle "e" or "E" for exponents.

**Solution**: Include `[eE][+-]?\d+` in regex pattern.

---

## Summary

The **Valid Number** problem demonstrates:
- **String parsing**: Converting string representations to numbers
- **Regex patterns**: Using patterns to validate formats
- **Finite state machines**: Explicit modeling of valid transitions
- **Edge case handling**: Special cases like ".", "e", signs

Key takeaways:
1. Understand the formal definition of valid numbers
2. Use regex for concise pattern matching
3. Handle edge cases: ".", signs, exponents
4. Always trim whitespace before validation

This problem is essential for understanding string validation and parsing techniques.

---

### Pattern Summary

This problem exemplifies the **String Parsing/Validation** pattern, characterized by:
- Validating input against a specific format
- Handling multiple valid representations
- Edge case handling
- Using regex or FSM for validation

For more details on this pattern, see the **[String Parsing Pattern](/patterns/string-parsing)**.
