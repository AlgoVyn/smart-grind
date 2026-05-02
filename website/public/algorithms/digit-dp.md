# Digit DP

## Category
Dynamic Programming

## Description

Digit DP solves counting problems involving numbers with specific digit properties (e.g., count numbers <= n with digit sum = k, or count numbers without certain digit patterns). Uses digit-by-digit construction with memoization.

---

## Concepts

### 1. Tight Constraint

Tracks if current prefix equals the bound prefix.
- If tight, can only use digits 0 to bound_digit
- If not tight, can use 0 to 9

### 2. DP State

```python
dp(pos, tight, current_sum, started)
- pos: current digit position
- tight: whether bounded
- current_sum: running sum
- started: whether number has started (for leading zeros)
```

### 3. State Transitions

For each digit position, try all valid digits and recurse.

---

## Frameworks

### Framework 1: Standard Digit DP

```
┌─────────────────────────────────────────────────────────────┐
│  DIGIT DP FRAMEWORK                                          │
├─────────────────────────────────────────────────────────────┤
│  1. Convert number to digit array                            │
│                                                              │
│  2. Define dp(pos, tight, state):                          │
│     If pos == len(digits):                                   │
│       Return base case check                                 │
│                                                              │
│     limit = digits[pos] if tight else 9                       │
│     total = 0                                                │
│                                                              │
│     For d from 0 to limit:                                   │
│       new_tight = tight and (d == limit)                   │
│       total += dp(pos+1, new_tight, new_state)              │
│                                                              │
│     Return total                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Forms

### Form 1: Digit Sum Count

Count numbers with specific digit sum.

| Aspect | Details |
|--------|---------|
| **State** | (pos, tight, current_sum) |
| **Base** | current_sum == target |

### Form 2: Unique Digits

Count numbers with all unique digits.

| Aspect | Details |
|--------|---------|
| **State** | (pos, tight, mask, started) |
| **Mask** | Bitmask of used digits |

---

## Tactics

### Tactic 1: Digit Sum Count

```python
from functools import lru_cache

def digit_dp(n, target_sum):
    digits = list(map(int, str(n)))
    
    @lru_cache(maxsize=None)
    def dp(pos, tight, current_sum):
        if current_sum > target_sum:
            return 0
        if pos == len(digits):
            return 1 if current_sum == target_sum else 0
        
        limit = digits[pos] if tight else 9
        total = 0
        
        for d in range(limit + 1):
            new_tight = tight and (d == limit)
            total += dp(pos + 1, new_tight, current_sum + d)
        
        return total
    
    return dp(0, True, 0)
```

---

## Python Templates

### Template 1: Digit Sum Count

```python
from functools import lru_cache

def digit_dp(n, target_sum):
    """
    Count numbers from 0 to n with digit sum = target_sum.
    
    Time: O(d * states) where d = number of digits
    Space: O(d * states)
    """
    digits = list(map(int, str(n)))
    
    @lru_cache(maxsize=None)
    def dp(pos, tight, current_sum):
        if current_sum > target_sum:
            return 0
        if pos == len(digits):
            return 1 if current_sum == target_sum else 0
        
        limit = digits[pos] if tight else 9
        total = 0
        
        for d in range(limit + 1):
            new_tight = tight and (d == limit)
            total += dp(pos + 1, new_tight, current_sum + d)
        
        return total
    
    return dp(0, True, 0)
```

---

## Practice Problems

### Problem 1: Numbers At Most N Given Digit Set
**Problem:** [LeetCode 902](https://leetcode.com/problems/numbers-at-most-n-given-digit-set/)

### Problem 2: Numbers With Repeated Digits
**Problem:** [LeetCode 1012](https://leetcode.com/problems/numbers-with-repeated-digits/)

---

## Summary

Digit DP:
- Process digits from most significant
- Tight constraint tracks bound
- Memoize on (pos, tight, state)
- Range queries: f(r) - f(l-1)
- Best for n up to 10^18 or more
