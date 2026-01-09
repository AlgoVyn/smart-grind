# String To Integer (atoi)

## Problem Description

Implement `myAtoi(string s)` to convert a string to a 32-bit signed integer.

### Rules

1. **Skip leading whitespace**
2. **Determine sign** (+ or -)
3. **Read digits** until non-digit or end
4. **Clamp** to [-2^31, 2^31 - 1]

---

## Examples

**Example 1:**
```python
Input: s = "42"
Output: 42
```

**Example 2:**
```python
Input: s = "   -042"
Output: -42
```

**Example 3:**
```python
Input: s = "1337c0d3"
Output: 1337
```

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `0 <= s.length <= 200` | String length |

---

## Solution

```python
class Solution:
    def myAtoi(self, s: str) -> int:
        s = s.lstrip()
        if not s:
            return 0
        
        sign = 1
        if s[0] == '-':
            sign = -1
            s = s[1:]
        elif s[0] == '+':
            s = s[1:]
        
        num = 0
        for c in s:
            if not c.isdigit():
                break
            num = num * 10 + int(c)
            if sign * num > 2**31 - 1:
                return 2**31 - 1
            if sign * num < -2**31:
                return -2**31
        
        return sign * num
```

---

## Explanation

### Algorithm Steps

1. Strip leading whitespace
2. Parse sign character
3. Build number digit by digit
4. Check overflow at each step
5. Return signed result

### Time Complexity

- **O(n)** — n = string length

### Space Complexity

- **O(1)** — Constant extra space

---


## Related Problems

- [String to Integer (atoi)](https://leetcode.com/problems/string-to-integer-atoi/)
