# String - Multiply Strings (Manual Simulation)

## Overview

The String - Multiply Strings pattern is used to multiply two large numbers represented as strings, which would otherwise cause overflow with standard numeric types. This pattern simulates the manual multiplication process.

## Key Concepts

- **Digit-by-Digit Multiplication**: Multiply each digit of one number with each digit of the other.
- **Position Tracking**: Track the position of each product digit in the result.
- **Carry Handling**: Handle carry values during multiplication and addition.
- **Zero Handling**: Handle cases where one or both numbers are zero.

## Template

```python
def multiply_strings(num1, num2):
    if num1 == "0" or num2 == "0":
        return "0"
    
    m, n = len(num1), len(num2)
    result = [0] * (m + n)
    
    # Multiply each digit from right to left
    for i in range(m-1, -1, -1):
        for j in range(n-1, -1, -1):
            product = int(num1[i]) * int(num2[j])
            p1 = i + j
            p2 = i + j + 1
            total = product + result[p2]
            
            result[p2] = total % 10
            result[p1] += total // 10
    
    # Convert to string, skipping leading zeros
    result_str = "".join(map(str, result))
    return result_str.lstrip("0")
```

## Example Problems

1. **Multiply Strings (LeetCode 43)**: Multiply two numbers represented as strings.
2. **Large Number Operations**: Handle addition, subtraction, or division of large numbers as strings.
3. **Arbitrary Precision Calculation**: Implement libraries for big integer calculations.

## Time and Space Complexity

- **Time Complexity**: O(m * n), where m and n are lengths of the two numbers (each digit multiplied by each other digit).
- **Space Complexity**: O(m + n), for storing the result array.

## Common Pitfalls

- **Not handling zero case**: Returns incorrect result when either number is zero.
- **Incorrect position calculation**: Failing to track p1 and p2 correctly.
- **Forgetting to handle carry in p1**: Failing to add carry to the higher position.
- **Not trimming leading zeros**: Results in strings like "0000" instead of "0".
- **Processing from left to right**: Makes position tracking more difficult.
