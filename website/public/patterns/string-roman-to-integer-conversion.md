# String - Roman to Integer Conversion

## Overview

The String - Roman to Integer Conversion pattern is used to convert a Roman numeral string to an integer. Roman numerals use specific characters and subtractive notation to represent numbers, requiring a specific approach for conversion.

## Key Concepts

- **Roman Numeral Values**: Each character has a specific value (I=1, V=5, X=10, L=50, C=100, D=500, M=1000).
- **Subtractive Notation**: If a smaller value precedes a larger value, it is subtracted (IV=4, IX=9, XL=40, etc.).
- **Iterative Processing**: Process the string from right to left to handle subtractive notation.
- **Sum Calculation**: Accumulate values, subtracting when a smaller value comes before a larger one.

## Template

```python
def roman_to_integer(s):
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
    
    for char in reversed(s):
        current_value = roman_values[char]
        if current_value < prev_value:
            total -= current_value
        else:
            total += current_value
        prev_value = current_value
    
    return total
```

## Example Problems

1. **Roman to Integer (LeetCode 13)**: Convert Roman numeral to integer.
2. **Integer to Roman (LeetCode 12)**: Reverse of this problem.
3. **Valid Roman Numeral Check**: Verify if a string is a valid Roman numeral.

## Time and Space Complexity

- **Time Complexity**: O(n), where n is the length of the string (each character is processed once).
- **Space Complexity**: O(1), as we use a fixed-size dictionary and variables.

## Common Pitfalls

- **Incorrect handling of subtractive notation**: Forgetting to check if current value is less than previous.
- **Failing to process from right to left**: Makes subtractive notation harder to handle.
- **Not using a value lookup table**: Hardcoding values leads to less maintainable code.
- **Handling invalid characters**: Not checking for characters outside the Roman numeral set.
- **Overcomplicating with nested conditions**: Simple right-to-left iteration works better.
