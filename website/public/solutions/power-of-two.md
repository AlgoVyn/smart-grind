# Power Of Two

## Problem Description

Given an integer `n`, return `true` if it is a power of two. Otherwise, return `false`.
An integer `n` is a power of two, if there exists an integer `x` such that `n == 2^x`.

### Example 1

**Input:** `n = 1`  
**Output:** `true`

**Explanation:** 2^0 = 1

### Example 2

**Input:** `n = 16`  
**Output:** `true`

**Explanation:** 2^4 = 16

### Example 3

**Input:** `n = 3`  
**Output:** `false`

### Constraints

- `-2^31 <= n <= 2^31 - 1`

### Follow up

Could you solve it without loops/recursion?

---

## Solution

```python
class Solution:
    def isPowerOfTwo(self, n: int) -> bool:
        return n > 0 and (n & (n - 1)) == 0
```

---

## Explanation

Powers of two have exactly one bit set in binary. `n & (n-1)` clears the lowest set bit, so for powers of two, result is 0. Also check `n > 0`.

### Step-by-step Approach

1. Check if `n > 0` (negative numbers and zero cannot be powers of two).
2. Check if `n & (n - 1) == 0` (only one bit set).

### Complexity Analysis

- **Time Complexity:** O(1)
- **Space Complexity:** O(1)
