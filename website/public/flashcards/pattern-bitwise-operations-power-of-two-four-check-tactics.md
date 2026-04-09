## Bitwise - Power of Two/Four Check: Tactics

What are the advanced techniques and variations for power of 2/4 checks?

<!-- front -->

---

### Tactic 1: Next Power of Two

Find the next power of 2 greater than or equal to n.

```python
def next_power_of_two(n: int) -> int:
    """
    Round up to next power of 2.
    If n is already power of 2, returns n.
    Time: O(1), Space: O(1)
    """
    if n <= 1:
        return 1
    
    # Method 1: Using bit_length
    return 1 << (n - 1).bit_length()


def next_power_of_two_manual(n: int) -> int:
    """
    Manual bit manipulation approach.
    Time: O(1), Space: O(1)
    """
    if n <= 1:
        return 1
    
    # Propagate all bits to the right
    n -= 1
    n |= n >> 1
    n |= n >> 2
    n |= n >> 4
    n |= n >> 8
    n |= n >> 16
    n += 1
    
    return n
```

**Use case:** Memory allocation, buffer sizing, hash table resizing.

---

### Tactic 2: Previous Power of Two

Find the largest power of 2 less than or equal to n.

```python
def previous_power_of_two(n: int) -> int:
    """
    Round down to previous power of 2.
    Time: O(1), Space: O(1)
    """
    if n <= 1:
        return 1 if n == 1 else 0
    
    # Method 1: Using bit_length
    return 1 << ((n.bit_length() - 1))


def previous_power_of_two_manual(n: int) -> int:
    """
    Manual bit manipulation.
    Time: O(1), Space: O(1)
    """
    # Clear all bits except the highest
    n |= n >> 1
    n |= n >> 2
    n |= n >> 4
    n |= n >> 8
    n |= n >> 16
    
    return (n + 1) >> 1
```

**Use case:** Alignment operations, block sizing.

---

### Tactic 3: Highest/Lowest Set Bit

```python
def highest_power_of_two(n: int) -> int:
    """Same as previous_power_of_two."""
    if n == 0:
        return 0
    return 1 << (n.bit_length() - 1)


def lowest_set_bit(n: int) -> int:
    """
    Isolate the lowest set bit.
    Time: O(1), Space: O(1)
    """
    return n & (-n)  # Two's complement trick


# Examples:
# lowest_set_bit(12)  →  4  (1100 → 0100)
# lowest_set_bit(10)  →  2  (1010 → 0010)
# lowest_set_bit(8)   →  8  (1000 → 1000)
```

---

### Tactic 4: Power of 8, 16, etc.

Extend the pattern to other power bases.

```python
def is_power_of_eight(n: int) -> bool:
    """
    Check if n is power of 8.
    Powers of 8: 1, 8, 64, 512, ...
    Single bit at positions 0, 3, 6, 9, ... (multiples of 3)
    """
    # Must be power of 2
    if n <= 0 or (n & (n - 1)) != 0:
        return False
    
    # Check position is multiple of 3
    # Count trailing zeros
    position = (n & -n).bit_length() - 1
    return position % 3 == 0


def is_power_of_sixteen(n: int) -> bool:
    """
    Check if n is power of 16.
    Single bit at positions 0, 4, 8, 12, ... (multiples of 4)
    """
    # 0xEEEEEEEE masks positions not divisible by 4
    return n > 0 and (n & (n - 1)) == 0 and (n & 0xEEEEEEEE) == 0
```

---

### Tactic 5: Count Powers in Range

```python
def count_powers_of_two_in_range(left: int, right: int) -> int:
    """
    Count powers of 2 in range [left, right].
    Time: O(log(right)), Space: O(1)
    """
    import math
    
    # Find first power of 2 >= left
    first = 1 << max(0, (left - 1).bit_length())
    
    # Find last power of 2 <= right
    if right < 1:
        return 0
    last = 1 << (right.bit_length() - 1)
    
    if first > last:
        return 0
    
    # Count: 2^k where k ranges from log2(first) to log2(last)
    return (last.bit_length() - 1) - (first.bit_length() - 1) + 1
```

---

### Tactic 6: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|-----|
| **Missing n > 0 check** | Zero passes as power of 2 | Always include `n > 0` |
| **Negative numbers** | Some negatives may have single bit | Check positivity first |
| **Wrong mask for power of 4** | Using 0x55555555 instead | Use 0xAAAAAAAA for odd position mask |
| **Confusing & with &&** | Bitwise vs logical AND | Both work, but be consistent |
| **Floating point log** | Using `log2(n) % 1 == 0` | Precision errors! Use bitwise. |
| **Integer overflow** | Not applicable for 32-bit | n=2^31 works fine in Python |

---

### Tactic 7: Using Built-ins

```python
# Python 3.10+
def is_power_of_two_builtin(n: int) -> bool:
    """Using bit_count() for set bit counting."""
    return n > 0 and n.bit_count() == 1


# C/C++ builtins
def is_power_of_two_cpp(n):
    # __builtin_popcount returns count of set bits
    return n > 0 and __builtin_popcount(n) == 1


# Alternative: Check if number is of form 2^k
def is_power_of_two_alternative(n: int) -> bool:
    """Using math.log - NOT recommended due to precision."""
    import math
    if n <= 0:
        return False
    log_val = math.log2(n)
    return log_val == int(log_val)
```

**Warning:** Floating-point approaches fail for large numbers due to precision.

<!-- back -->
