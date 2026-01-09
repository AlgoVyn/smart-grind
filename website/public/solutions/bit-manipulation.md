# Bit Manipulation

## Problem Description
## Solution
```python
class Solution:
    def isPowerOfTwo(self, n: int) -> bool:
        return n > 0 and (n & (n - 1)) == 0
```

## Explanation
This solution checks if a given integer is a power of two using bit manipulation. A number is a power of two if it has exactly one bit set in its binary representation. By performing a bitwise AND operation between n and n-1, we can check if n is a power of two: if the result is 0, then n is a power of two.

Time Complexity: O(1), as the operation is performed in constant time.

Space Complexity: O(1), as no additional space is used.
