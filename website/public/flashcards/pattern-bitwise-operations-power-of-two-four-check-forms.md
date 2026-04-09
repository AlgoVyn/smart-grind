## Bitwise - Power of Two/Four Check: Forms

What are the different variations of power checks and their implementations?

<!-- front -->

---

### Form 1: Basic Power of Two

**Problem:** Check if n is a power of 2 (LeetCode 231).

```python
def is_power_of_two(n: int) -> bool:
    """
    Basic power of 2 check.
    Time: O(1), Space: O(1)
    """
    return n > 0 and (n & (n - 1)) == 0
```

**Key conditions:**
1. `n > 0` - positive check
2. `(n & (n - 1)) == 0` - single bit check

---

### Form 2: Power of Four (Mask Method)

**Problem:** Check if n is a power of 4 (LeetCode 342).

```python
def is_power_of_four_mask(n: int) -> bool:
    """
    Power of 4 using bit mask.
    0xAAAAAAAA = 10101010... in binary (1s at odd positions).
    Time: O(1), Space: O(1)
    """
    return (n > 0 and 
            (n & (n - 1)) == 0 and 
            (n & 0xAAAAAAAA) == 0)
```

**How it works:**
- Power of 4 must be power of 2
- The set bit must be in an even position (0, 2, 4, ...)
- `0xAAAAAAAA` masks odd positions - if AND is 0, bit is in even position

---

### Form 3: Power of Four (Modulo Method)

**Problem:** Alternative power of 4 check using mathematical property.

```python
def is_power_of_four_modulo(n: int) -> bool:
    """
    Power of 4 using modulo property.
    Powers of 4 modulo 3 always equal 1.
    Time: O(1), Space: O(1)
    """
    return (n > 0 and 
            (n & (n - 1)) == 0 and 
            (n % 3 == 1))
```

**Mathematical proof:**
- `4^k mod 3 = (3 + 1)^k mod 3 = 1^k mod 3 = 1`
- Powers of 2 that are NOT powers of 4: `2^(2k+1) mod 3 = 2`

---

### Form 4: Power of Any Base

**Problem:** Check if n is a power of arbitrary base k.

```python
def is_power_of_k(n: int, k: int) -> bool:
    """
    Check if n is a power of k.
    Time: O(log_k(n)), Space: O(1)
    """
    if n <= 0 or k <= 1:
        return n == 1
    
    while n % k == 0:
        n //= k
    
    return n == 1


# Example: Power of 3 (LeetCode 326)
def is_power_of_three(n: int) -> bool:
    """
    Check if n is power of 3.
    Alternative: n > 0 and 1162261467 % n == 0
    (1162261467 = 3^19, largest power of 3 in int32)
    """
    if n <= 0:
        return False
    
    while n % 3 == 0:
        n //= 3
    
    return n == 1
```

---

### Form 5: Power of Two with Edge Cases

**Problem:** Handle all edge cases including 0, 1, and negative numbers.

```python
def is_power_of_two_complete(n: int) -> dict:
    """
    Complete analysis of power of 2 check.
    Returns detailed result for debugging.
    """
    result = {
        'n': n,
        'is_positive': n > 0,
        'binary': bin(n) if n >= 0 else bin(n & 0xFFFFFFFF),
        'n_minus_1': n - 1,
        'n_and_n_minus_1': n & (n - 1) if n > 0 else None,
        'is_power_of_two': n > 0 and (n & (n - 1)) == 0,
        'which_power': n.bit_length() - 1 if n > 0 and (n & (n - 1)) == 0 else None
    }
    return result


# Test cases:
# n = 0    → False (not positive)
# n = 1    → True (2^0), which_power = 0
# n = 2    → True (2^1), which_power = 1
# n = 3    → False (two bits set: 11)
# n = 4    → True (2^2), which_power = 2
# n = -2   → False (not positive)
```

---

### Form 6: Count Set Bits Alternative

**Problem:** Using popcount as alternative approach.

```python
def is_power_of_two_popcount(n: int) -> bool:
    """
    Using bit count as alternative.
    Time: O(1) with built-in, O(k) manual.
    """
    # Python 3.10+ built-in
    return n > 0 and n.bit_count() == 1


def is_power_of_two_manual_popcount(n: int) -> bool:
    """
    Manual popcount (Brian Kernighan).
    Time: O(number of set bits), Space: O(1)
    """
    if n <= 0:
        return False
    
    count = 0
    while n:
        n &= n - 1  # Clear lowest set bit
        count += 1
        if count > 1:  # Early exit
            return False
    
    return count == 1
```

---

### Form Comparison Summary

| Form | Problem | Method | Time | Space |
|------|---------|--------|------|-------|
| Basic | Power of 2 | `n & (n-1)` | O(1) | O(1) |
| Power of 4 (mask) | Power of 4 | `0xAAAAAAAA` mask | O(1) | O(1) |
| Power of 4 (mod) | Power of 4 | `n % 3 == 1` | O(1) | O(1) |
| Arbitrary base | Power of k | Iterative division | O(log n) | O(1) |
| Complete analysis | Debug/diagnosis | All checks | O(1) | O(1) |
| Popcount | Alternative | `bit_count() == 1` | O(1) | O(1) |

---

### Related Patterns

| Pattern | Relationship | Example Problem |
|---------|-------------|-----------------|
| **Counting Set Bits** | Uses same `n & (n-1)` trick | Hamming weight |
| **Is Power of 3** | Similar but no bit trick | 1162261467 % n == 0 |
| **Single Number (XOR)** | Uses property of powers | XOR all numbers |
| **Next/Previous Power** | Extension of this pattern | Bit manipulation |
| **Divide Two Integers** | Uses bit shifting | Power-of-2 multiples |

<!-- back -->
