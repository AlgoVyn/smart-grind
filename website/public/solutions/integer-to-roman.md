# Integer to Roman

## Problem Description

Seven different symbols represent Roman numerals with the following values:

| Symbol | Value |
|--------|-------|
| I | 1 |
| V | 5 |
| X | 10 |
| L | 50 |
| C | 100 |
| D | 500 |
| M | 1000 |

Roman numerals are formed by appending the conversions of decimal place values from **highest to lowest**. The conversion rules are:

1. **Standard Values:** If the value does not start with 4 or 9, select the symbol of the maximal value that can be subtracted from the input, append that symbol, subtract its value, and repeat.

2. **Subtractive Forms:** If the value starts with 4 or 9, use the subtractive form:
   - 4 = IV (1 less than 5)
   - 9 = IX (1 less than 10)
   - 40 = XL, 90 = XC, 400 = CD, 900 = CM

3. **Repetition:** Only powers of 10 (I, X, C, M) can be appended consecutively at most 3 times.

Given an integer, convert it to a Roman numeral.

**Link to problem:** [Integer to Roman - LeetCode 12](https://leetcode.com/problems/integer-to-roman/)

---

## Examples

### Example 1

| Input | Output |
|-------|--------|
| `num = 3749` | `"MMMDCCXLIX"` |

**Explanation:**
```
3000 = MMM (1000 + 1000 + 1000)
 700 = DCC (500 + 100 + 100)
  40 = XL (10 less than 50)
   9 = IX (1 less than 10)
```

### Example 2

| Input | Output |
|-------|--------|
| `num = 58` | `"LVIII"` |

**Explanation:**
```
50 = L
 8 = VIII
```

### Example 3

| Input | Output |
|-------|--------|
| `num = 1994` | `"MCMXCIV"` |

**Explanation:**
```
1000 = M
 900 = CM
  90 = XC
   4 = IV
```

---

## Constraints

- `1 <= num <= 3999`

---

## Pattern: Greedy - Mapping Lookup

This problem demonstrates the **Greedy** pattern with mapping lookup. The key is using predefined value-symbol pairs to convert integer to Roman numerals.

---

## Intuition

The key insight for this problem is understanding Roman numeral formation rules:

> At each step, select the largest Roman numeral value that can be subtracted from the remaining number, append it, and repeat.

### Key Observations

1. **Value-Symbol Pairs**: Include all values in descending order, including subtractive forms (4, 9, 40, 90, 400, 900).

2. **Greedy Selection**: Always pick the largest value that fits - this works because Roman numerals use additive notation.

3. **Limited Range**: Input is 1-3999, which guarantees constant time complexity.

4. **Subtractive Forms**: Special handling for 4, 9, 40, 90, 400, 900 (e.g., IV for 4, IX for 9).

### Algorithm Overview

1. Create a list of value-symbol pairs in descending order
2. For each pair, while num >= value:
   - Append symbol to result
   - Subtract value from num
3. Return result

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Greedy Mapping** - Optimal solution using predefined pairs
2. **Digit-by-Digit** - Process each decimal place separately

---

## Approach 1: Greedy Mapping (Optimal) ⭐

### Algorithm Steps

1. Define value-symbol pairs in descending order including subtractive forms
2. Iterate through each pair
3. While num >= value, append symbol and subtract value
4. Return the result string

### Why It Works

The greedy approach works because:
1. Roman numerals use largest values first (additive principle)
2. Subtractive forms (4, 9, 40, etc.) are explicitly handled
3. Processing in descending order ensures correct representation

### Code Implementation

````carousel
```python
class Solution:
    def intToRoman(self, num: int) -> str:
        """
        Convert integer to Roman numeral using greedy mapping.
        
        Args:
            num: Integer between 1 and 3999
            
        Returns:
            Roman numeral string
        """
        # Value-Symbol pairs in descending order (including subtractive forms)
        vals = [
            (1000, "M"),
            (900, "CM"),
            (500, "D"),
            (400, "CD"),
            (100, "C"),
            (90, "XC"),
            (50, "L"),
            (40, "XL"),
            (10, "X"),
            (9, "IX"),
            (5, "V"),
            (4, "IV"),
            (1, "I")
        ]
        res = ""
        for val, sym in vals:
            while num >= val:
                res += sym
                num -= val
        return res
```

<!-- slide -->
```cpp
class Solution {
public:
    string intToRoman(int num) {
        // Value-Symbol pairs in descending order
        vector<pair<int, string>> vals = {
            {1000, "M"},
            {900, "CM"},
            {500, "D"},
            {400, "CD"},
            {100, "C"},
            {90, "XC"},
            {50, "L"},
            {40, "XL"},
            {10, "X"},
            {9, "IX"},
            {5, "V"},
            {4, "IV"},
            {1, "I"}
        };
        
        string result = "";
        for (const auto& [val, sym] : vals) {
            while (num >= val) {
                result += sym;
                num -= val;
            }
        }
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public String intToRoman(int num) {
        // Value-Symbol pairs in descending order
        int[] values = {1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1};
        String[] symbols = {"M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"};
        
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < values.length; i++) {
            while (num >= values[i]) {
                result.append(symbols[i]);
                num -= values[i];
            }
        }
        return result.toString();
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} num
 * @return {string}
 */
var intToRoman = function(num) {
    // Value-Symbol pairs in descending order
    const vals = [
        [1000, "M"],
        [900, "CM"],
        [500, "D"],
        [400, "CD"],
        [100, "C"],
        [90, "XC"],
        [50, "L"],
        [40, "XL"],
        [10, "X"],
        [9, "IX"],
        [5, "V"],
        [4, "IV"],
        [1, "I"]
    ];
    
    let result = "";
    for (const [val, sym] of vals) {
        while (num >= val) {
            result += sym;
            num -= val;
        }
    }
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(1) - num ≤ 3999, constant number of iterations |
| **Space** | O(1) - fixed size list, output string excluded |

---

## Approach 2: Digit-by-Digit

### Algorithm Steps

1. Process each digit place: thousands, hundreds, tens, ones
2. Use lookup tables for each place
3. Concatenate results

### Why It Works

This approach processes each decimal place separately, which is intuitive and easy to verify.

### Code Implementation

````carousel
```python
class Solution:
    def intToRoman(self, num: int) -> str:
        """
        Convert integer to Roman using digit-by-digit approach.
        """
        thousands = ["", "M", "MM", "MMM"]
        hundreds = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"]
        tens = ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"]
        ones = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"]
        
        return thousands[num // 1000] + hundreds[(num % 1000) // 100] + tens[(num % 100) // 10] + ones[num % 10]
```

<!-- slide -->
```cpp
class Solution {
public:
    string intToRoman(int num) {
        string thousands[] = {"", "M", "MM", "MMM"};
        string hundreds[] = {"", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"};
        string tens[] = {"", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"};
        string ones[] = {"", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"};
        
        return thousands[num / 1000] + hundreds[(num % 1000) / 100] + tens[(num % 100) / 10] + ones[num % 10];
    }
};
```

<!-- slide -->
```java
class Solution {
    public String intToRoman(int num) {
        String[] thousands = {"", "M", "MM", "MMM"};
        String[] hundreds = {"", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"};
        String[] tens = {"", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"};
        String[] ones = {"", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"};
        
        return thousands[num / 1000] + hundreds[(num % 1000) / 100] + tens[(num % 100) / 10] + ones[num % 10];
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} num
 * @return {string}
 */
var intToRoman = function(num) {
    const thousands = ["", "M", "MM", "MMM"];
    const hundreds = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"];
    const tens = ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"];
    const ones = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
    
    return thousands[Math.floor(num / 1000)] + 
           hundreds[Math.floor((num % 1000) / 100)] + 
           tens[Math.floor((num % 100) / 10)] + 
           ones[num % 10];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(1) - constant time for all inputs |
| **Space** | O(1) - fixed lookup tables |

---

## Comparison of Approaches

| Aspect | Greedy Mapping | Digit-by-Digit |
|--------|---------------|-----------------|
| **Time Complexity** | O(1) | O(1) |
| **Space Complexity** | O(1) | O(1) |
| **Implementation** | Simple | Moderate |
| **Readability** | Good | Very good |
| **LeetCode Optimal** | ✅ | ✅ |

**Best Approach:** Use Approach 1 (Greedy Mapping) as it's more general and easier to extend.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Occasionally asked in technical interviews
- **Companies**: Amazon, Uber, Bloomberg
- **Difficulty**: Medium
- **Concepts Tested**: Greedy algorithms, lookup tables, string manipulation

### Learning Outcomes

1. **Greedy Algorithm**: Understand when greedy works (largest value first)
2. **Lookup Tables**: Precompute value-symbol mappings
3. **Edge Cases**: Handle subtractive forms (4, 9, 40, 90, etc.)

---

## Related Problems

Based on similar themes (number conversion, string manipulation):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Roman to Integer | [Link](https://leetcode.com/problems/roman-to-integer/) | Reverse conversion |
| Integer Replacement | [Link](https://leetcode.com/problems/integer-replacement/) | Number manipulation |
| Base 7 | [Link](https://leetcode.com/problems/base-7/) | Number system conversion |
| Convert to Base -2 | [Link](https://leetcode.com/problems/convert-to-base-2/) | Base conversion |

### Pattern Reference

For more detailed explanations of the Greedy pattern, see:
- **[Greedy Pattern](/patterns/greedy-buy-sell-stock)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Integer to Roman](https://www.youtube.com/watch?v=xT0v6XaWzNc)** - Clear explanation with visual examples
2. **[Integer to Roman - LeetCode 12](https://www.youtube.com/watch?v=Q2k4d2ohkT8)** - Detailed walkthrough
3. **[Roman Numerals Explained](https://www.youtube.com/watch?v=4CquEYd4jTU)** - Roman numeral system

### Related Concepts

- **[Greedy Algorithm](https://www.youtube.com/watch?v=AXx1WuKjD1w)** - Understanding greedy approach
- **[Hash Table Lookup](https://www.youtube.com/watch?v=zaBhtK3WC9Q)** - Lookup optimization

---

## Follow-up Questions

### Q1: How would you reverse this (Roman to Integer)?

**Answer:** Use a lookup table to process Roman numerals. Iterate through characters, and if current value is less than next, subtract it; otherwise, add it.

---

### Q2: What if the input range was larger than 3999?

**Answer:** For numbers > 3999, you'd need to use overlines or parentheses notation. The algorithm would need adjustment for higher place values.

---

### Q3: How would you validate if a string is a valid Roman numeral?

**Answer:** Check for valid symbols, ensure no more than 3 consecutive same symbols, validate subtractive forms, and verify using the same parsing logic.

---

### Q4: Can you solve this using recursion?

**Answer:** Yes, you can use recursion to process each value-symbol pair, but iteration is more efficient and straightforward.

---

### Q5: What's the maximum length of Roman numeral for 3999?

**Answer:** It's "MMMCMXCIX" which is 9 characters long.

---

## Common Pitfalls

### 1. Missing Subtractive Forms
**Issue:** Not including 4, 9, 40, 90, 400, 900 in value list.

**Solution:** Include all subtractive forms (IV, IX, XL, XC, CD, CM) in the mapping.

### 2. Wrong Order of Values
**Issue:** Not processing values in descending order.

**Solution:** Sort values from largest to smallest.

### 3. Not Handling Edge Cases
**Issue:** Not handling 0 or negative numbers.

**Solution:** Problem guarantees num >= 1, but add validation if needed.

### 4. Forgetting to Subtract
**Issue:** Appending symbol but not subtracting value.

**Solution:** Always subtract val from num after appending symbol.

### 5. String Concatenation Performance
**Issue:** Using string concatenation in a loop can be inefficient in some languages.

**Solution:** Use StringBuilder in Java, StringBuilder/concat in other languages.

---

## Summary

The **Integer to Roman** problem demonstrates the **Greedy** pattern with mapping lookup. The key is using predefined value-symbol pairs to convert integer to Roman numerals.

### Key Takeaways

1. **Value-Symbol Pairs**: Include all values including subtractive forms (IV, IX, XL, XC, CD, CM)
2. **Descending Order**: Process from largest to smallest value
3. **Greedy Selection**: Always take the largest possible value that fits
4. **Constant Time**: Limited input range (1-3999) guarantees O(1) time

### Pattern Summary

This problem exemplifies the **Greedy - Mapping Lookup** pattern, characterized by:
- Predefined mappings for lookup
- Processing in sorted order (descending)
- Taking the largest available option at each step

For more details on this pattern, see the **[Greedy](/patterns/greedy)**.

---

## Additional Resources

- [LeetCode Problem 12](https://leetcode.com/problems/integer-to-roman/) - Official problem page
- [Roman Numerals - Wikipedia](https://en.wikipedia.org/wiki/Roman_numerals) - Roman numeral system
- [Greedy Algorithms](https://www.geeksforgeeks.org/greedy-algorithms/) - Detailed greedy explanation
- [Pattern: Greedy](/patterns/greedy-buy-sell-stock) - Comprehensive pattern guide
