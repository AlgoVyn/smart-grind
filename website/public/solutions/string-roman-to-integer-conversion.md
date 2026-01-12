# String - Roman to Integer Conversion

## Overview

Convert Roman numerals to integers. Roman numerals use letters I, V, X, L, C, D, M with subtractive notation. Use this pattern for parsing Roman numeral strings. Benefits: Handles standard numeral conversion efficiently.

## Key Concepts

- Map each symbol to its value.
- Iterate from left to right, add value unless smaller than next (then subtract).

## Template

```python
def roman_to_int(s: str) -> int:
    roman = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
    total = 0
    for i in range(len(s)):
        if i + 1 < len(s) and roman[s[i]] < roman[s[i+1]]:
            total -= roman[s[i]]
        else:
            total += roman[s[i]]
    return total
```

## Example Problems

- **Roman to Integer**: Convert Roman numeral string to integer.
- **Integer to Roman**: Convert integer to Roman numeral (reverse).
- **Roman Numeral Validation**: Check if a string is a valid Roman numeral.

## Time and Space Complexity

- O(n) time, O(1) space.

## Common Pitfalls

- Incorrect handling of subtractive cases like IV (4), IX (9).
- Not validating input as valid Roman numerals.
- Case sensitivity.