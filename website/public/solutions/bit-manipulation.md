# Bit Manipulation

## Problem Description

Check if a given integer is a power of two.

## Examples

**Example 1:**

**Input:**
```python
n = 1
```

**Output:**
```python
true
```

**Explanation:** 1 is 2^0

**Example 2:**

**Input:**
```python
n = 16
```

**Output:**
```python
true
```

**Explanation:** 16 is 2^4

**Example 3:**

**Input:**
```python
n = 3
```

**Output:**
```python
false
```

**Explanation:** 3 is not a power of two

## Solution

```python
class Solution:
    def isPowerOfTwo(self, n: int) -> bool:
        return n > 0 and (n & (n - 1)) == 0
```

## Explanation

This solution checks if a given integer is a power of two using bit manipulation. A number is a power of two if it has exactly one bit set in its binary representation. By performing a bitwise AND operation between `n` and `n-1`, we can check if `n` is a power of two: if the result is 0, then `n` is a power of two.

## Time Complexity
**O(1)**, as the operation is performed in constant time.

## Space Complexity
**O(1)**, as no additional space is used.
