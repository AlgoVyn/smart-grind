# Array - Plus One (Handling Carry)

## Overview

This pattern handles incrementing a large number represented as an array of digits by 1, managing carry propagation from the least significant digit. It's useful for problems involving arbitrary-precision arithmetic where numbers are too large for standard integer types. The approach modifies the array in place when possible, only creating a new array if a carry extends beyond the existing digits.

## Key Concepts

The core idea is to iterate from the rightmost digit:
- Add 1 to the current digit.
- If it's less than 10, no carry; return the array.
- If it's 10, set to 0 and propagate carry to the left.
- If carry reaches the leftmost digit, prepend a 1 to the array.
This simulates addition with carry in base-10.

## Template

```python
def plus_one(digits):
    """
    Increments the large integer represented by digits by one.
    """
    n = len(digits)
    for i in range(n - 1, -1, -1):
        if digits[i] < 9:
            digits[i] += 1
            return digits
        digits[i] = 0
    # If all digits were 9, add a new leading 1
    return [1] + digits

# Example usage:
# digits = [1,2,3]
# print(plus_one(digits))  # Output: [1,2,4]
# digits = [9,9,9]
# print(plus_one(digits))  # Output: [1,0,0,0]
```

## Example Problems

1. **Plus One (LeetCode 66)**: Given a non-empty array of decimal digits representing a non-negative integer, increment it by one.
2. **Add One to Number**: Variants where you need to handle carry in digit arrays for large numbers.
3. **Increment Counter**: Problems involving counters or version numbers stored as arrays.

## Time and Space Complexity

- **Time Complexity**: O(n), where n is the number of digits, as we may traverse the entire array.
- **Space Complexity**: O(1) in most cases (modifying in place), but O(n) in the worst case when a new digit is added.

## Common Pitfalls

- **Carry Propagation**: Forgetting to continue checking after setting a digit to 0 can miss further carries.
- **Leading Zeros**: The array shouldn't have leading zeros except for the number 0, but handle cases where all digits are 9.
- **Empty Array**: Though unlikely, ensure the array is non-empty as per problem constraints.
- **In-Place Modification**: Remember that the function modifies the input array; if preservation is needed, make a copy first.