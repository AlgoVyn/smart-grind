# Array - Plus One (Handling Carry)

## Overview

The Array - Plus One pattern is used to increment a number represented as an array of digits by 1. This pattern handles carry-over from the least significant digit to more significant digits, and potentially adding a new digit if all digits are 9.

## Key Concepts

- **Digit-wise Increment**: Start from the last digit (least significant) and increment.
- **Carry Handling**: If a digit becomes 10 after increment, set to 0 and carry 1 to next digit.
- **Leading Digit Carry**: If all digits are 9, add a new digit at the beginning.

## Template

```python
def plusOne(digits):
    n = len(digits)
    
    for i in range(n-1, -1, -1):
        if digits[i] < 9:
            digits[i] += 1
            return digits
        digits[i] = 0
    
    # If all digits were 9, add a new digit at the beginning
    return [1] + digits
```

## Example Problems

1. **Plus One (LeetCode 66)**: Increment a number represented as an array of digits.
2. **Plus Two or Other Values**: Extend the pattern to add other single-digit values.
3. **Add Two Numbers as Arrays**: Add two numbers represented as digit arrays.

## Time and Space Complexity

- **Time Complexity**: O(n), where n is the number of digits (worst case, all digits are 9).
- **Space Complexity**: O(n) in the worst case (when a new digit is added), O(1) otherwise.

## Common Pitfalls

- **Not handling carry correctly**: Failing to propagate carry to higher digits leads to incorrect results.
- **Forgetting the case where all digits are 9**: Can result in an incorrect length array.
- **Incorrect loop direction**: Starting from the first digit instead of the last digit.
- **Off-by-one errors**: Incorrect loop bounds can cause digits to be missed.
