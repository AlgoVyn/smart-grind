# Roman to Integer

## Problem Description

Roman numerals are an ancient numeral system originating from Rome and used throughout the Roman Empire. They represent numbers using combinations of letters from the Latin alphabet.

**Roman Numeral Symbols and Values:**

| Symbol | Value |
|--------|-------|
| I      | 1     |
| V      | 5     |
| X      | 10    |
| L      | 50    |
| C      | 100   |
| D      | 500   |
| M      | 1000  |

**Understanding Subtractive Notation:**

Roman numerals follow specific rules for combination:

1. **Standard Notation:** Symbols are written from largest to smallest, left to right (additive)
   - `III` = 1 + 1 + 1 = 3
   - `VIII` = 5 + 1 + 1 + 1 = 8

2. **Subtractive Notation:** A smaller value before a larger value indicates subtraction
   - `IV` = 5 - 1 = 4
   - `IX` = 10 - 1 = 9
   - `XL` = 50 - 10 = 40
   - `XC` = 100 - 10 = 90
   - `CD` = 500 - 100 = 400
   - `CM` = 1000 - 100 = 900

**Problem Statement:**

Given a string `s` representing a Roman numeral, convert it to its corresponding integer value.

This problem is a classic string parsing challenge that tests your ability to:
- Understand and implement specific rules (subtractive notation)
- Process strings efficiently with O(n) time complexity
- Handle edge cases and boundary conditions
- Choose the optimal algorithmic approach

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

**Explanation:** `III` = 3 (1 + 1 + 1) — three `I` symbols simply add up.

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

**Explanation:** `IV` = 4 (5 - 1) — this demonstrates the subtractive notation where `I` (1) precedes `V` (5).

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

**Explanation:** `IX` = 9 (10 - 1) — another subtractive notation example.

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

**Explanation:** `LVIII` = 58 (50 + 5 + 1 + 1 + 1) — this combines additive symbols.

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

**Explanation:** `MCMXCIV` = 1994 (1000 + 900 + 90 + 4)
- `M` = 1000
- `CM` = 900 (1000 - 100)
- `XC` = 90 (100 - 10)
- `IV` = 4 (5 - 1)

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `1 ≤ s.length ≤ 15` | Input string length is very small |
| Valid Characters | Only 'I', 'V', 'X', 'L', 'C', 'D', 'M' |
| Valid Range | Result is guaranteed to be in [1, 3999] |

---

## Intuition

The core challenge in converting Roman numerals to integers is handling **subtractive notation**. The key insight is:

> **When a symbol of lesser value appears before a symbol of greater value, it means subtraction; otherwise, it means addition.**

This observation leads to two elegant solution strategies:

### Strategy 1: Right-to-Left Processing

Process characters from right to left while tracking the previous value. If the current value is less than the previously seen value, subtract it; otherwise, add it. This elegantly handles subtractive notation without needing lookahead.

**Why it works:** When processing from right to left, the "previous" value you see is actually the next character in the original left-to-right order. Subtractive pairs like `IV` are automatically detected because `V` (5) > `I` (1), so `I` gets subtracted.

### Strategy 2: Left-to-Right with Lookahead

Process characters from left to right and look ahead to the next character. If the next character has a greater value, subtract the current value; otherwise, add it.

**Why it works:** This directly models the Roman numeral rules by checking whether the current symbol should be subtracted based on what follows it.

---

## Approach 1: Right-to-Left Processing ⭐ (Most Elegant)

### Algorithm

1. Create a lookup table mapping each Roman symbol to its integer value
2. Initialize `total = 0` and `prevValue = 0`
3. Iterate through the string from right to left:
   - Get the current symbol's value
   - If `currentValue < prevValue`, subtract it from total (subtractive notation)
   - Otherwise, add it to total
   - Update `prevValue` to the current value
4. Return the total

### Why This Works

This approach elegantly handles subtractive notation by leveraging the fact that when we process right-to-left, the "previous" value we track is actually the value that comes after the current symbol in the original string. For subtractive pairs like `IV`:
- Process `V` first: add 5, prevValue = 5
- Process `I` next: current (1) < prev (5), so subtract 1
- Result: 5 - 1 = 4

### Code

```carousel
<!-- slide -->
```python
class Solution:
    def romanToInt(self, s: str) -> int:
        """
        Convert Roman numeral to integer using right-to-left processing.
        
        Time: O(n) where n is the length of the string
        Space: O(1) for the symbol mapping dictionary
        
        This is the most elegant and commonly used approach.
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
         * Convert Roman numeral to integer using right-to-left processing.
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
```

### Time Complexity

**O(n)**, where `n` is the length of the string (at most 15 characters).

### Space Complexity

**O(1)**, as we use a fixed-size dictionary for symbol mapping, regardless of input size.

### Pros

- ✅ Elegant and concise solution
- ✅ No lookahead or boundary checking needed
- ✅ Easy to understand and implement
- ✅ Excellent performance with minimal operations
- ✅ Only requires tracking one additional variable

### Cons

- ❗ May not be intuitive at first glance
- ❗ Requires understanding of why right-to-left processing works

---

## Approach 2: Direct Subtractive Pattern Matching ⭐⭐

### Algorithm

1. Create two lookup tables: one for individual symbols and one for subtractive patterns
2. Initialize `total = 0` and iterate with index `i = 0`
3. At each step:
   - Check if the current and next characters form a known subtractive pattern (e.g., "IV", "IX")
   - If yes, add the pattern's value and skip both characters
   - Otherwise, add the individual symbol's value and move to the next character
4. Return the total

### Why This Works

By explicitly handling all possible subtractive combinations upfront, we simplify the problem to just summing values. This approach makes the Roman numeral rules very explicit in the code.

### Code

```carousel
<!-- slide -->
```python
class Solution:
    def romanToInt(self, s: str) -> int:
        """
        Convert Roman numeral to integer by handling subtractive patterns directly.
        
        Time: O(n) where n is the length of the string
        Space: O(1) for the symbol and pattern mappings
        
        This approach makes the subtractive rules very explicit.
        """
        # Define single symbol values
        roman_values = {
            'I': 1,
            'V': 5,
            'X': 10,
            'L': 50,
            'C': 100,
            'D': 500,
            'M': 1000
        }
        
        # Define all possible subtractive combinations
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
```

### Time Complexity

**O(n)**, where `n` is the length of the string.

### Space Complexity

**O(1)**, as we use fixed-size mappings for symbols and patterns.

### Pros

- ✅ Very explicit about subtractive patterns
- ✅ Easy to understand the logic flow
- ✅ No need to remember the right-to-left trick
- ✅ Clear mapping between patterns and their values

### Cons

- ❗ More code than the right-to-left approach
- ❗ Pattern matching overhead (though negligible for small strings)
- ❗ Requires maintaining two lookup tables

---

## Approach 3: Conditional Logic (Language-Native)

### Algorithm

This approach uses the language's native switch/case or conditional logic to handle each character directly, with nested conditionals for subtractive patterns.

### Code

```carousel
<!-- slide -->
```python
class Solution:
    def romanToInt(self, s: str) -> int:
        """
        Convert Roman numeral to integer using conditional logic.
        
        Time: O(n) where n is the length of the string
        Space: O(1)
        
        This approach is verbose but explicit about each case.
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
```

### Time Complexity

**O(n)**, where `n` is the length of the string.

### Space Complexity

**O(1)**, no additional data structures needed.

### Pros

- ✅ Very explicit about each case
- ✅ No dictionary/hash table overhead
- ✅ Fast execution with direct conditionals
- ✅ Easy to debug and trace

### Cons

- ❗ More verbose code
- ❗ Repetitive code structure
- ❗ Harder to maintain if rules change
- ❗ Not as elegant as other approaches

---

## Step-by-Step Example

Let's trace through `s = "MCMXCIV"` using the right-to-left approach:

### Initial State
```
total = 0
prev_value = 0
```

### Step 1: Process 'V' (from right)
- `current_value = 5`
- `5 < 0`? No → `total = 0 + 5 = 5`
- `prev_value = 5`

### Step 2: Process 'I'
- `current_value = 1`
- `1 < 5`? Yes → `total = 5 - 1 = 4`
- `prev_value = 1`

### Step 3: Process 'C'
- `current_value = 100`
- `100 < 1`? No → `total = 4 + 100 = 104`
- `prev_value = 100`

### Step 4: Process 'X'
- `current_value = 10`
- `10 < 100`? Yes → `total = 104 - 10 = 94`
- `prev_value = 10`

### Step 5: Process 'M'
- `current_value = 1000`
- `1000 < 10`? No → `total = 94 + 1000 = 1094`
- `prev_value = 1000`

### Step 6: Process 'C'
- `current_value = 100`
- `100 < 1000`? Yes → `total = 1094 - 100 = 994`
- `prev_value = 100`

### Step 7: Process 'M'
- `current_value = 1000`
- `1000 < 100`? No → `total = 994 + 1000 = 1994`
- `prev_value = 1000`

### Final Result
```
1994
```

---

## Time Complexity Comparison

| Approach | Time Complexity | Space Complexity | Best For |
|----------|-----------------|------------------|----------|
| Right-to-Left Processing | O(n) | O(1) | **Optimal - most elegant** |
| Pattern Matching | O(n) | O(1) | Explicit logic and clarity |
| Conditional Logic | O(n) | O(1) | Language-native style |

All approaches achieve optimal O(n) time complexity for this problem.

---

## Related Problems

| Problem | Difficulty | Description |
|---------|------------|-------------|
| [Integer to Roman](/solutions/integer-to-roman.md) | Medium | Reverse of this problem - convert integer to Roman numeral |
| [Roman to Integer II](https://leetcode.com/problems/roman-to-integer-ii/) | Easy | Variant with additional validation constraints |
| [Valid Parentheses](/solutions/valid-parentheses.md) | Easy | Similar stack-based parsing problem |
| [Basic Calculator II](/solutions/basic-calculator-ii.md) | Medium | More complex expression evaluation |

---

## Video Tutorials

| Tutorial | Platform | Link |
|----------|----------|------|
| NeetCode - Roman to Integer Solution | YouTube | [Watch](https://www.youtube.com/watch?v=3j-oG-7k1r0) |
| Back to Back SWE - Roman to Integer | YouTube | [Watch](https://www.youtube.com/watch?v=9K3oO88nCqU) |
| LeetCode Official Solution | YouTube | [Watch](https://www.youtube.com/watch?v=3j-oG-7k1r0) |
| TechDive - Roman to Integer | YouTube | [Watch](https://www.youtube.com/watch?v=vlggw8219hQ) |

---

## Follow-up Questions

**1. How would you modify the solution to handle Roman numerals beyond 3999?**

Extended Roman numerals use overline notation where a bar over a symbol multiplies its value by 1000. For example, V̄ = 5000. Implementation would require extending the symbol-value mapping and handling these special characters.

**2. What if you needed to validate that a Roman numeral string is valid?**

Add validation checks for:
- Invalid patterns (e.g., 'IL', 'IC', 'XD' which are not standard)
- Excessive repetitions (e.g., 'IIII', 'VV' - maximum 3 consecutive 'I', 'X', 'C', 'M')
- Invalid placement of subtractive symbols

**3. How would you verify correctness through round-trip conversion?**

Implement both `romanToInt()` and `intToRoman()` functions. Test that converting Roman → Integer → Roman produces the original string for all valid inputs in the range [1, 3999].

**4. What is the maximum value this problem can handle?**

3999 (MMMCMXCIX). This is because the Roman numeral system traditionally doesn't have a standard representation for 4000+ using standard symbols.

**5. How would you handle invalid input strings?**

Add input validation:
- Check that all characters are valid Roman numerals (I, V, X, L, C, D, M)
- Check for empty strings
- Return an error code or throw an exception for invalid inputs

**6. What if Roman numerals had additional symbols (like in extended Roman numerals)?**

Extend the symbol-value mapping dictionary and subtractive pattern dictionary to include the new symbols. The algorithmic approach remains the same.

**7. How would you optimize this for very long strings (beyond the constraint)?**

All approaches are already O(n), making them efficient. For extremely long strings, the constant factors become more relevant:
- Right-to-left processing has minimal overhead
- Pattern matching may have slightly higher constant factors due to substring operations
- Consider using array indexing instead of dictionaries for marginal performance gains

**8. What if you needed to process millions of Roman numerals?**

All approaches are O(n) with O(1) space, making them highly efficient for batch processing:
- The right-to-left approach is fastest due to minimal operations
- Consider parallel processing for independent conversions
- Use streaming to handle large datasets without loading everything into memory

---

## Common Mistakes to Avoid

1. **❌ Not handling subtractive notation correctly**
   - Always check if a smaller value precedes a larger one
   - The right-to-left approach automatically handles this

2. **❌ Processing in the wrong direction**
   - Left-to-right requires lookahead; right-to-left requires tracking previous value
   - Choose one direction and stick with it consistently

3. **❌ Forgetting boundary checks**
   - Always check `i + 1 < len(s)` before accessing the next character
   - This prevents index out of bounds errors

4. **❌ Using hardcoded values without explanation**
   - Use a dictionary/mapping for better maintainability
   - Makes the code self-documenting

5. **❌ Not understanding Roman numeral rules**
   - Study the subtractive notation before implementing
   - Understand the six valid subtractive pairs

6. **❌ Not testing edge cases**
   - Test with "I", "IV", "IX", "XL", "XC", "CD", "CM"
   - Test with maximum value "MMMCMXCIX" = 3999

---

## References

- [LeetCode 13 - Roman to Integer](https://leetcode.com/problems/roman-to-integer/)
- [Roman Numerals - Wikipedia](https://en.wikipedia.org/wiki/Roman_numerals)
- [Subtractive Notation in Roman Numerals](https://en.wikipedia.org/wiki/Roman_numerals#Additive_notation)
