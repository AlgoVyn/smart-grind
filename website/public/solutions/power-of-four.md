# Power Of Four

## Problem Description

Given an integer `n`, return `true` if it is a power of four. Otherwise, return `false`.
An integer `n` is a power of four, if there exists an integer `x` such that `n == 4^x`.

### Example 1

**Input:** `n = 16`  
**Output:** `true`

### Example 2

**Input:** `n = 5`  
**Output:** `false`

### Example 3

**Input:** `n = 1`  
**Output:** `true`

### Constraints

- `-2^31 <= n <= 2^31 - 1`

### Follow up

Could you solve it without loops/recursion?

## Solution

```python
class Solution:
    def isPowerOfFour(self, n: int) -> bool:
        return n > 0 and (n & (n - 1)) == 0 and (n & 0xAAAAAAAA) == 0
```

## Explanation

Check if `n` is positive, power of 2 (only one bit set), and the bit is not in odd positions (since 4^k bits are at even positions). `0xAAAAAAAA` has bits set at odd positions.

### Step-by-step Approach

1. Check if `n > 0` (negative numbers and zero cannot be powers of four).
2. Check if `n` is a power of two using `n & (n - 1) == 0`.
3. Check if the single set bit is at an even position using `n & 0xAAAAAAAA == 0`.

### Complexity Analysis

- **Time Complexity:** O(1)
- **Space Complexity:** O(1)
