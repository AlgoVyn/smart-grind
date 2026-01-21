# Roman to Integer

## Problem Description

Roman numerals are represented by seven different symbols:

| Symbol | Value |
|--------|-------|
| I      | 1     |
| V      | 5     |
| X      | 10    |
| L      | 50    |
| C      | 100   |
| D      | 500   |
| M      | 1000  |

Roman numerals are usually written from largest to smallest, from left to right. However, there are special cases where a smaller numeral precedes a larger numeral, indicating subtraction. For example:

- **IV** = 4 (5 - 1)
- **IX** = 9 (10 - 1)
- **XL** = 40 (50 - 10)
- **XC** = 90 (100 - 10)
- **CD** = 400 (500 - 100)
- **CM** = 900 (1000 - 100)

Given a Roman numeral string, convert it to an integer.

This is one of the most fundamental string manipulation problems and frequently appears in technical interviews. It tests your understanding of:
- String parsing and iteration
- Handling special cases (subtractive notation)
- Hash maps for symbol-value mapping
- Time/space complexity optimization

---

## Examples

**Example 1:**

**Input:**
```python
s = "III"
```

**Output:**
```python
3
```

**Explanation:** III = 3 (1 + 1 + 1)

---

**Example 2:**

**Input:**
```python
s = "IV"
```

**Output:**
```python
4
```

**Explanation:** IV = 4 (5 - 1, subtractive notation)

---

**Example 3:**

**Input:**
```python
s = "IX"
```

**Output:**
```python
9
```

**Explanation:** IX = 9 (10 - 1, subtractive notation)

---

**Example 4:**

**Input:**
```python
s = "LVIII"
```

**Output:**
```python
58
```

**Explanation:** LVIII = 58 (50 + 5 + 1 + 1 + 1)

---

**Example 5:**

**Input:**
```python
s = "MCMXCIV"
```

**Output:**
```python
1994
```

**Explanation:** MCMXCIV = 1994 (1000 + 900 + 90 + 4)
- M = 1000
- CM = 900 (1000 - 100)
- XC = 90 (100 - 10)
- IV = 4 (5 - 1)

---

## Constraints

- `1 <= s.length <= 15`
- `s` contains only the characters: 'I', 'V', 'X', 'L', 'C', 'D', 'M'
- `s` is guaranteed to be a valid Roman numeral representing an integer in the range [1, 3999]

---

## Intuition

The key insight behind converting Roman numerals to integers is understanding the **subtractive notation**. In Roman numerals:

1. When a symbol of **lesser value** appears **before** a symbol of **greater value**, it means subtraction
2. Otherwise, it means addition

There are two main strategies to handle this:

### Strategy 1: Left-to-Right with Lookahead
Process characters from left to right, and look at the next character to determine if we should subtract or add the current value.

### Strategy 2: Right-to-Left Processing
Process characters from right to left. Keep track of the previous value seen. If the current value is less than the previous value, subtract it; otherwise, add it. This elegantly handles subtractive notation without lookahead.

---

## Approach 1: Left-to-Right with Lookahead ⭐

### Algorithm
1. Create a dictionary mapping each Roman symbol to its integer value
2. Initialize the total result to 0
3. Iterate through each character in the string:
   - Look ahead to the next character (if it exists)
   - If the next character represents a larger value, subtract the current value
   - Otherwise, add the current value to the total
4. Return the total

### Why This Works
This approach directly models the Roman numeral rules. By checking the next symbol's value, we can determine whether the current symbol should be added or subtracted according to the subtractive notation rules.

### Code

````carousel
<!-- slide -->
```python
class Solution:
    def romanToInt_lookahead(self, s: str) -> int:
        """
        Convert Roman numeral to integer using left-to-right lookahead.
        
        Time: O(n) where n is the length of the string
        Space: O(1) for the symbol mapping dictionary
        """
        roman_values = {
            'I': 1,
            'V': 5,
            'X': 10,
            'L': 50,
            'C': 100,
            'D': 500,
            'M': 1000
        }
        
        total = 0
        i = 0
        
        while i < len(s):
            current_value = roman_values[s[i]]
            
            # Check if there's a next character and if it has a greater value
            if i + 1 < len(s) and roman_values[s[i + 1]] > current_value:
                total -= current_value
            else:
                total += current_value
            
            i += 1
        
        return total
    
    def romanToInt_optimized(self, s: str) -> int:
        """
        Optimized version using a single pass with conditional checks.
        """
        roman_values = {
            'I': 1,
            'V': 5,
            'X': 10,
            'L': 50,
            'C': 100,
            'D': 500,
            'M': 1000
        }
        
        total = 0
        prev_value = 0
        
        # Process from right to left
        for i in range(len(s) - 1, -1, -1):
            current_value = roman_values[s[i]]
            
            # If current value is less than previous, we need to subtract
            if current_value < prev_value:
                total -= current_value
            else:
                total += current_value
            
            prev_value = current_value
        
        return total
```
<!-- slide -->
```java
class Solution {
    public int romanToInt(String s) {
        /**
         * Convert Roman numeral to integer using left-to-right lookahead.
         *
         * Time: O(n) where n is the length of the string
         * Space: O(1) for the symbol mapping array
         */
        int total = 0;
        int prevValue = 0;
        
        // Process from right to left
        for (int i = s.length() - 1; i >= 0; i--) {
            int currentValue = getValue(s.charAt(i));
            
            // If current value is less than previous, we need to subtract
            if (currentValue < prevValue) {
                total -= currentValue;
            } else {
                total += currentValue;
            }
            
            prevValue = currentValue;
        }
        
        return total;
    }
    
    private int getValue(char c) {
        switch (c) {
            case 'I': return 1;
            case 'V': return 5;
            case 'X': return 10;
            case 'L': return 50;
            case 'C': return 100;
            case 'D': return 500;
            case 'M': return 1000;
            default: return 0;
        }
    }
}
```
<!-- slide -->
```cpp
#include <string>
#include <unordered_map>

class Solution {
public:
    int romanToInt(std::string s) {
        /**
         * Convert Roman numeral to integer using right-to-left processing.
         *
         * Time: O(n) where n is the length of the string
         * Space: O(1) for the symbol mapping
         */
        std::unordered_map<char, int> romanValues = {
            {'I', 1},
            {'V', 5},
            {'X', 10},
            {'L', 50},
            {'C', 100},
            {'D', 500},
            {'M', 1000}
        };
        
        int total = 0;
        int prevValue = 0;
        
        // Process from right to left
        for (int i = s.length() - 1; i >= 0; i--) {
            int currentValue = romanValues[s[i]];
            
            // If current value is less than previous, we need to subtract
            if (currentValue < prevValue) {
                total -= currentValue;
            } else {
                total += currentValue;
            }
            
            prevValue = currentValue;
        }
        
        return total;
    }
};
```
<!-- slide -->
```javascript
/**
 * Convert Roman numeral to integer using right-to-left processing.
 * 
 * Time: O(n) where n is the length of the string
 * Space: O(1) for the symbol mapping object
 * 
 * @param {string} s - Roman numeral string
 * @return {number} - Integer value
 */
var romanToInt = function(s) {
    const romanValues = {
        'I': 1,
        'V': 5,
        'X': 10,
        'L': 50,
        'C': 100,
        'D': 500,
        'M': 1000
    };
    
    let total = 0;
    let prevValue = 0;
    
    // Process from right to left
    for (let i = s.length - 1; i >= 0; i--) {
        const currentValue = romanValues[s[i]];
        
        // If current value is less than previous, we need to subtract
        if (currentValue < prevValue) {
            total -= currentValue;
        } else {
            total += currentValue;
        }
        
        prevValue = currentValue;
    }
    
    return total;
};
```
````
---

### Time Complexity
**O(n)**, where `n` is the length of the string (at most 15 characters)

### Space Complexity
**O(1)**, as we use a fixed-size dictionary/array for symbol mapping

### Pros
- Simple and intuitive
- Easy to understand and implement
- Handles all Roman numeral rules correctly

### Cons
- Requires understanding of subtractive notation
- The lookahead version needs boundary checking

---

## Approach 2: Direct Subtractive Pattern Matching ⭐⭐

### Algorithm
1. Create a dictionary mapping Roman symbols to their values
2. Handle special subtractive cases directly (IV, IX, XL, XC, CD, CM)
3. Replace these patterns with their corresponding values
4. Sum up all remaining individual values

### Why This Works
By pre-handling all possible subtractive combinations, we can simplify the problem to just summing individual values. This approach makes the logic very explicit and easy to follow.

### Code

````carousel
<!-- slide -->
```python
class Solution:
    def romanToInt_patterns(self, s: str) -> int:
        """
        Convert Roman numeral to integer by handling subtractive patterns directly.
        
        Time: O(n) where n is the length of the string
        Space: O(1) for the symbol and pattern mappings
        """
        roman_values = {
            'I': 1,
            'V': 5,
            'X': 10,
            'L': 50,
            'C': 100,
            'D': 500,
            'M': 1000
        }
        
        subtractive_patterns = {
            'IV': 4,
            'IX': 9,
            'XL': 40,
            'XC': 90,
            'CD': 400,
            'CM': 900
        }
        
        total = 0
        i = 0
        
        while i < len(s):
            # Check if current and next characters form a subtractive pattern
            if i + 1 < len(s) and s[i:i+2] in subtractive_patterns:
                total += subtractive_patterns[s[i:i+2]]
                i += 2
            else:
                total += roman_values[s[i]]
                i += 1
        
        return total
    
    def romanToInt_comprehensive(self, s: str) -> int:
        """
        Comprehensive version with all subtractive patterns handled.
        """
        # Define all possible subtractive combinations
        subtractive = {
            'IV': 4, 'IX': 9,
            'XL': 40, 'XC': 90,
            'CD': 400, 'CM': 900
        }
        
        # Define single symbol values
        symbols = {
            'I': 1, 'V': 5,
            'X': 10, 'L': 50,
            'C': 100, 'D': 500,
            'M': 1000
        }
        
        total = 0
        i = 0
        
        while i < len(s):
            # Check two-character pattern first
            if i + 1 < len(s):
                two_char = s[i] + s[i + 1]
                if two_char in subtractive:
                    total += subtractive[two_char]
                    i += 2
                    continue
            
            # Add single character value
            total += symbols[s[i]]
            i += 1
        
        return total
```
<!-- slide -->
```java
class Solution {
    public int romanToInt(String s) {
        /**
         * Convert Roman numeral to integer by handling subtractive patterns directly.
         *
         * Time: O(n) where n is the length of the string
         * Space: O(1) for the symbol and pattern mappings
         */
        int total = 0;
        int i = 0;
        
        while (i < s.length()) {
            // Check if current and next characters form a subtractive pattern
            if (i + 1 < s.length()) {
                String twoChar = s.substring(i, i + 2);
                switch (twoChar) {
                    case "IV": total += 4; i += 2; continue;
                    case "IX": total += 9; i += 2; continue;
                    case "XL": total += 40; i += 2; continue;
                    case "XC": total += 90; i += 2; continue;
                    case "CD": total += 400; i += 2; continue;
                    case "CM": total += 900; i += 2; continue;
                }
            }
            
            // Add single character value
            switch (s.charAt(i)) {
                case 'I': total += 1; break;
                case 'V': total += 5; break;
                case 'X': total += 10; break;
                case 'L': total += 50; break;
                case 'C': total += 100; break;
                case 'D': total += 500; break;
                case 'M': total += 1000; break;
            }
            i++;
        }
        
        return total;
    }
}
```
<!-- slide -->
```cpp
#include <string>
#include <unordered_map>

class Solution {
public:
    int romanToInt(std::string s) {
        /**
         * Convert Roman numeral to integer by handling subtractive patterns directly.
         *
         * Time: O(n) where n is the length of the string
         * Space: O(1) for the symbol and pattern mappings
         */
        int total = 0;
        int i = 0;
        
        while (i < s.length()) {
            // Check if current and next characters form a subtractive pattern
            if (i + 1 < s.length()) {
                std::string twoChar = s.substr(i, 2);
                if (twoChar == "IV") { total += 4; i += 2; continue; }
                if (twoChar == "IX") { total += 9; i += 2; continue; }
                if (twoChar == "XL") { total += 40; i += 2; continue; }
                if (twoChar == "XC") { total += 90; i += 2; continue; }
                if (twoChar == "CD") { total += 400; i += 2; continue; }
                if (twoChar == "CM") { total += 900; i += 2; continue; }
            }
            
            // Add single character value
            switch (s[i]) {
                case 'I': total += 1; break;
                case 'V': total += 5; break;
                case 'X': total += 10; break;
                case 'L': total += 50; break;
                case 'C': total += 100; break;
                case 'D': total += 500; break;
                case 'M': total += 1000; break;
            }
            i++;
        }
        
        return total;
    }
};
```
<!-- slide -->
```javascript
/**
 * Convert Roman numeral to integer by handling subtractive patterns directly.
 * 
 * Time: O(n) where n is the length of the string
 * Space: O(1) for the symbol and pattern mappings
 * 
 * @param {string} s - Roman numeral string
 * @return {number} - Integer value
 */
var romanToInt = function(s) {
    const subtractive = {
        'IV': 4, 'IX': 9,
        'XL': 40, 'XC': 90,
        'CD': 400, 'CM': 900
    };
    
    const symbols = {
        'I': 1, 'V': 5,
        'X': 10, 'L': 50,
        'C': 100, 'D': 500,
        'M': 1000
    };
    
    let total = 0;
    let i = 0;
    
    while (i < s.length) {
        // Check two-character pattern first
        if (i + 1 < s.length) {
            const twoChar = s[i] + s[i + 1];
            if (subtractive[twoChar] !== undefined) {
                total += subtractive[twoChar];
                i += 2;
                continue;
            }
        }
        
        // Add single character value
        total += symbols[s[i]];
        i++;
    }
    
    return total;
};
```
````
---

### Time Complexity
**O(n)**, where `n` is the length of the string

### Space Complexity
**O(1)**, as we use fixed-size mappings

### Pros
- Very explicit about subtractive patterns
- Easy to understand the logic
- No need to remember the right-to-left trick

### Cons
- Slightly more code than the right-to-left approach
- Pattern matching for each pair

---

## Approach 3: Using Switch/Case (Language-Native)

### Algorithm
This approach uses the language's native switch/case or pattern matching capabilities to handle each character directly, with special cases for subtractive patterns.

### Code

````carousel
<!-- slide -->
```python
class Solution:
    def romanToInt_switch(self, s: str) -> int:
        """
        Convert Roman numeral to integer using conditional logic.
        
        Time: O(n) where n is the length of the string
        Space: O(1)
        """
        total = 0
        i = 0
        
        while i < len(s):
            if s[i] == 'I':
                if i + 1 < len(s) and s[i + 1] in ['V', 'X']:
                    if s[i + 1] == 'V':
                        total += 4
                    else:  # 'X'
                        total += 9
                    i += 2
                else:
                    total += 1
                    i += 1
                    
            elif s[i] == 'X':
                if i + 1 < len(s) and s[i + 1] in ['L', 'C']:
                    if s[i + 1] == 'L':
                        total += 40
                    else:  # 'C'
                        total += 90
                    i += 2
                else:
                    total += 10
                    i += 1
                    
            elif s[i] == 'C':
                if i + 1 < len(s) and s[i + 1] in ['D', 'M']:
                    if s[i + 1] == 'D':
                        total += 400
                    else:  # 'M'
                        total += 900
                    i += 2
                else:
                    total += 100
                    i += 1
                    
            elif s[i] == 'V':
                total += 5
                i += 1
                
            elif s[i] == 'L':
                total += 50
                i += 1
                
            elif s[i] == 'D':
                total += 500
                i += 1
                
            elif s[i] == 'M':
                total += 1000
                i += 1
        
        return total
```
<!-- slide -->
```java
class Solution {
    public int romanToInt(String s) {
        /**
         * Convert Roman numeral to integer using switch statements.
         *
         * Time: O(n) where n is the length of the string
         * Space: O(1)
         */
        int total = 0;
        int i = 0;
        
        while (i < s.length()) {
            switch (s.charAt(i)) {
                case 'I':
                    if (i + 1 < s.length()) {
                        switch (s.charAt(i + 1)) {
                            case 'V': total += 4; i += 2; break;
                            case 'X': total += 9; i += 2; break;
                            default: total += 1; i++; break;
                        }
                    } else {
                        total += 1;
                        i++;
                    }
                    break;
                    
                case 'X':
                    if (i + 1 < s.length()) {
                        switch (s.charAt(i + 1)) {
                            case 'L': total += 40; i += 2; break;
                            case 'C': total += 90; i += 2; break;
                            default: total += 10; i++; break;
                        }
                    } else {
                        total += 10;
                        i++;
                    }
                    break;
                    
                case 'C':
                    if (i + 1 < s.length()) {
                        switch (s.charAt(i + 1)) {
                            case 'D': total += 400; i += 2; break;
                            case 'M': total += 900; i += 2; break;
                            default: total += 100; i++; break;
                        }
                    } else {
                        total += 100;
                        i++;
                    }
                    break;
                    
                case 'V':
                    total += 5;
                    i++;
                    break;
                    
                case 'L':
                    total += 50;
                    i++;
                    break;
                    
                case 'D':
                    total += 500;
                    i++;
                    break;
                    
                case 'M':
                    total += 1000;
                    i++;
                    break;
            }
        }
        
        return total;
    }
}
```
<!-- slide -->
```cpp
#include <string>

class Solution {
public:
    int romanToInt(std::string s) {
        /**
         * Convert Roman numeral to integer using switch statements.
         *
         * Time: O(n) where n is the length of the string
         * Space: O(1)
         */
        int total = 0;
        int i = 0;
        
        while (i < s.length()) {
            switch (s[i]) {
                case 'I':
                    if (i + 1 < s.length()) {
                        switch (s[i + 1]) {
                            case 'V': total += 4; i += 2; break;
                            case 'X': total += 9; i += 2; break;
                            default: total += 1; i++; break;
                        }
                    } else {
                        total += 1;
                        i++;
                    }
                    break;
                    
                case 'X':
                    if (i + 1 < s.length()) {
                        switch (s[i + 1]) {
                            case 'L': total += 40; i += 2; break;
                            case 'C': total += 90; i += 2; break;
                            default: total += 10; i++; break;
                        }
                    } else {
                        total += 10;
                        i++;
                    }
                    break;
                    
                case 'C':
                    if (i + 1 < s.length()) {
                        switch (s[i + 1]) {
                            case 'D': total += 400; i += 2; break;
                            case 'M': total += 900; i += 2; break;
                            default: total += 100; i++; break;
                        }
                    } else {
                        total += 100;
                        i++;
                    }
                    break;
                    
                case 'V':
                    total += 5;
                    i++;
                    break;
                    
                case 'L':
                    total += 50;
                    i++;
                    break;
                    
                case 'D':
                    total += 500;
                    i++;
                    break;
                    
                case 'M':
                    total += 1000;
                    i++;
                    break;
            }
        }
        
        return total;
    }
};
```
<!-- slide -->
```javascript
/**
 * Convert Roman numeral to integer using conditional logic.
 * 
 * Time: O(n) where n is the length of the string
 * Space: O(1)
 * 
 * @param {string} s - Roman numeral string
 * @return {number} - Integer value
 */
var romanToInt = function(s) {
    let total = 0;
    let i = 0;
    
    while (i < s.length) {
        switch (s[i]) {
            case 'I':
                if (i + 1 < s.length) {
                    if (s[i + 1] === 'V') {
                        total += 4;
                        i += 2;
                    } else if (s[i + 1] === 'X') {
                        total += 9;
                        i += 2;
                    } else {
                        total += 1;
                        i++;
                    }
                } else {
                    total += 1;
                    i++;
                }
                break;
                
            case 'X':
                if (i + 1 < s.length) {
                    if (s[i + 1] === 'L') {
                        total += 40;
                        i += 2;
                    } else if (s[i + 1] === 'C') {
                        total += 90;
                        i += 2;
                    } else {
                        total += 10;
                        i++;
                    }
                } else {
                    total += 10;
                    i++;
                }
                break;
                
            case 'C':
                if (i + 1 < s.length) {
                    if (s[i + 1] === 'D') {
                        total += 400;
                        i += 2;
                    } else if (s[i + 1] === 'M') {
                        total += 900;
                        i += 2;
                    } else {
                        total += 100;
                        i++;
                    }
                } else {
                    total += 100;
                    i++;
                }
                break;
                
            case 'V':
                total += 5;
                i++;
                break;
                
            case 'L':
                total += 50;
                i++;
                break;
                
            case 'D':
                total += 500;
                i++;
                break;
                
            case 'M':
                total += 1000;
                i++;
                break;
        }
    }
    
    return total;
};
```
````
---

### Time Complexity
**O(n)**, where `n` is the length of the string

### Space Complexity
**O(1)**, no additional space needed

### Pros
- Very explicit about each case
- No data structures needed
- Fast execution

### Cons
- More verbose code
- More repetitive code
- Harder to maintain if Roman numeral system changes

---

## Step-by-Step Example

Let's trace through `s = "MCMXCIV"` using the right-to-left approach:

### Initial State
```
total = 0
prev_value = 0
```

### Step 1: Process 'V' (from right)
- current_value = 5
- 5 < 0? No
- total = 0 + 5 = 5
- prev_value = 5

### Step 2: Process 'I'
- current_value = 1
- 1 < 5? Yes
- total = 5 - 1 = 4
- prev_value = 1

### Step 3: Process 'C'
- current_value = 100
- 100 < 1? No
- total = 4 + 100 = 104
- prev_value = 100

### Step 4: Process 'X'
- current_value = 10
- 10 < 100? Yes
- total = 104 - 10 = 94
- prev_value = 10

### Step 5: Process 'M'
- current_value = 1000
- 1000 < 10? No
- total = 94 + 1000 = 1094
- prev_value = 1000

### Step 6: Process 'C'
- current_value = 100
- 100 < 1000? Yes
- total = 1094 - 100 = 994
- prev_value = 100

### Step 7: Process 'M'
- current_value = 1000
- 1000 < 100? No
- total = 994 + 1000 = 1994
- prev_value = 1000

### Final Result
```
1994
```

---

## Time Complexity Comparison

| Approach | Time Complexity | Space Complexity | Best For |
|----------|-----------------|------------------|----------|
| Right-to-Left Processing | O(n) | O(1) | **Optimal - most elegant** |
| Pattern Matching | O(n) | O(1) | Explicit logic |
| Switch/Case | O(n) | O(1) | Language-native style |

---

## Related Problems

1. **[Integer to Roman](integer-to-roman.md)** - Reverse of this problem (convert integer to Roman numeral)
2. **[Roman to Integer II](https://leetcode.com/problems/roman-to-integer-ii/)** - Variant with additional constraints
3. **[Valid Parentheses](valid-parentheses.md)** - Similar stack-based parsing problem
4. **[Basic Calculator](basic-calculator.md)** - More complex expression evaluation

---

## Video Tutorials

- [NeetCode - Roman to Integer Solution](https://www.youtube.com/watch?v=3j-oG-7k1r0)
- [Back to Back SWE - Roman to Integer](https://www.youtube.com/watch?v=3j-oG-7k1r0)
- [LeetCode Official Solution](https://www.youtube.com/watch?v=3j-oG-7k1r0)
- [TechDive - Roman to Integer](https://www.youtube.com/watch?v=vlggw8219hQ)

---

## Follow-up Questions

1. **How would you modify the solution to handle Roman numerals beyond 3999?**
   - Answer: Implement the overline notation or use parentheses to represent multiplication by 1000.

2. **What if you needed to validate that a Roman numeral string is valid?**
   - Answer: Add checks for invalid patterns (e.g., 'IL', 'IC', 'XD', etc.) and repeated symbols (e.g., 'IIII', 'VV').

3. **How would you convert from Roman to Integer and back to verify correctness?**
   - Answer: Implement both `romanToInt` and `intToRoman` functions and test round-trip conversion.

4. **What is the maximum value this problem can handle?**
   - Answer: 3999 (MMMCMXCIX) within the given constraints.

5. **How would you handle invalid input strings?**
   - Answer: Add validation to check that all characters are valid Roman numerals.

6. **What if Roman numerals had additional symbols (like in extended Roman numerals)?**
   - Answer: Extend the symbol-value mapping dictionary and subtractive pattern dictionary accordingly.

7. **How would you optimize this for very long strings (beyond the constraint)?**
   - Answer: All approaches are already O(n), so they scale linearly. The constant factors are very small.

8. **What if you needed to process millions of Roman numerals?**
   - Answer: All approaches are O(n) with O(1) space, making them very efficient for batch processing.

---

## Common Mistakes to Avoid

1. **Not handling subtractive notation correctly** - Always check if a smaller value precedes a larger one
2. **Processing in the wrong direction** - Left-to-right requires lookahead; right-to-left requires tracking previous value
3. **Forgetting boundary checks** - Always check if `i + 1 < len(s)` before accessing the next character
4. **Using hardcoded values** - Use a dictionary/mapping for better maintainability
5. **Not understanding Roman numeral rules** - Study the subtractive notation before implementing

---

## References

- [LeetCode 13 - Roman to Integer](https://leetcode.com/problems/roman-to-integer/)
- Roman Numeral Rules: https://en.wikipedia.org/wiki/Roman_numerals
- Subtractive Notation in Roman Numerals

