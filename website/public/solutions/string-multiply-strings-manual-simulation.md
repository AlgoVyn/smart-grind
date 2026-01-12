# String - Multiply Strings (Manual Simulation)

## Overview

Multiply two large numbers represented as strings without built-in big integer support. Use this pattern for manual arithmetic simulation. Benefits: Handles arbitrary precision.

## Key Concepts

- Simulate multiplication like in elementary math, using arrays for result.

## Template

```python
def multiply(num1: str, num2: str) -> str:
    if num1 == "0" or num2 == "0":
        return "0"
    result = [0] * (len(num1) + len(num2))
    for i in range(len(num1) - 1, -1, -1):
        for j in range(len(num2) - 1, -1, -1):
            mul = (ord(num1[i]) - ord('0')) * (ord(num2[j]) - ord('0'))
            pos1 = i + j
            pos2 = i + j + 1
            total = mul + result[pos2]
            result[pos2] = total % 10
            result[pos1] += total // 10
    # Remove leading zeros
    start = 0
    while start < len(result) - 1 and result[start] == 0:
        start += 1
    return ''.join(str(d) for d in result[start:])
```

## Example Problems

- **Multiply Strings**: Multiply two strings representing numbers.
- **Add Strings**: Add two string numbers.
- **Divide Two Integers**: Divide without built-in division.

## Time and Space Complexity

- O(m * n) time, O(m + n) space.

## Common Pitfalls

- Forgetting to handle leading zeros in result.
- Carry propagation errors.
- Edge cases like multiplying by zero.