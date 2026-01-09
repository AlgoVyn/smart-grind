# Multiply Strings

## Problem Description

Given two non-negative integers `num1` and `num2` represented as strings, return the product of `num1` and `num2`, also represented as a string.

**Note:** You must not use any built-in BigInteger library or convert the inputs to integer directly.

## Examples

### Example 1

**Input:**
```
num1 = "2", num2 = "3"
```

**Output:**
```
"6"
```

### Example 2

**Input:**
```
num1 = "123", num2 = "456"
```

**Output:**
```
"56088"
```

## Constraints

- `1 <= num1.length, num2.length <= 200`
- `num1` and `num2` consist of digits only
- Both `num1` and `num2` do not contain any leading zero, except the number 0 itself

## Solution

```python
class Solution:
    def multiply(self, num1: str, num2: str) -> str:
        """
        Multiply two large numbers represented as strings.
        
        Uses grade-school multiplication algorithm.
        """
        # Handle zero case
        if num1 == "0" or num2 == "0":
            return "0"
        
        m, n = len(num1), len(num2)
        result = [0] * (m + n)
        
        # Multiply each digit and add to result
        for i in range(m - 1, -1, -1):
            for j in range(n - 1, -1, -1):
                mul = (ord(num1[i]) - ord('0')) * (ord(num2[j]) - ord('0'))
                p1, p2 = i + j, i + j + 1
                
                # Add to current position
                sum_val = mul + result[p2]
                result[p2] = sum_val % 10
                result[p1] += sum_val // 10
        
        # Handle carry propagation
        for i in range(m + n - 1, 0, -1):
            if result[i] >= 10:
                result[i - 1] += result[i] // 10
                result[i] %= 10
        
        # Convert to string, skipping leading zeros
        start = 0
        while start < m + n and result[start] == 0:
            start += 1
        
        return ''.join(str(d) for d in result[start:])
```

## Explanation

This problem requires multiplying two large numbers given as strings.

### Algorithm Steps

1. **Grade-school multiplication**: Treat the strings as arrays of digits.

2. **Initialize result**: Create an array of size `m + n` to store the product.

3. **Multiply digits**: For each pair of digits:
   - Multiply and add to the corresponding position (`i + j`)
   - Handle carry in the next position

4. **Propagate carry**: Iterate through the result array to handle any remaining carries.

5. **Convert to string**: Remove leading zeros and join digits.

## Complexity Analysis

- **Time Complexity:** O(m × n), where m and n are the lengths of the strings
- **Space Complexity:** O(m + n), for the result array
