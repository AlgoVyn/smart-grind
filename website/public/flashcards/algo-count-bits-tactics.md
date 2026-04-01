## Count Bits: Tactics & Tricks

What are the essential tactics for bit counting optimizations?

<!-- front -->

---

### Tactic 1: Use Built-in When Available

```python
# Python 3.10+
def count_bits_builtin(n):
    return [i.bit_count() for i in range(n + 1)]

# Or map
import builtins
def count_bits_map(n):
    return list(map(int.bit_count, range(n + 1)))
```

**Performance:** Built-in is usually fastest (C implementation).

---

### Tactic 2: Brian Kernighan's Algorithm

```python
def popcount_kernighan(x):
    """
    Iterates once per set bit, not per bit position
    """
    count = 0
    while x:
        x &= x - 1  # Clear lowest set bit
        count += 1
    return count

# When to use: Sparse numbers (few set bits)
# Avoid when: Dense numbers (many set bits)
```

---

### Tactic 3: Parallel Count (SWAR)

```python
def popcount_swar(x):
    """
    SIMD Within A Register - no loops
    """
    # Count bits in parallel
    x = x - ((x >> 1) & 0x55555555)
    x = (x & 0x33333333) + ((x >> 2) & 0x33333333)
    x = (x + (x >> 4)) & 0x0F0F0F0F
    x = x + (x >> 8)
    x = x + (x >> 16)
    return x & 0x3F

# Note: Python integers are arbitrary precision
# Use only for 32-bit values, or adapt for 64-bit
```

---

### Tactic 4: DP Pattern Selection

```python
def choose_dp_pattern(n, access_pattern):
    """
    Select DP pattern based on how you'll access data
    """
    if access_pattern == "sequential":
        # i >> 1 pattern - natural for sequential access
        dp = [0] * (n + 1)
        for i in range(1, n + 1):
            dp[i] = dp[i >> 1] + (i & 1)
    
    elif access_pattern == "sparse":
        # i & (i-1) pattern - good for random access
        dp = [0] * (n + 1)
        for i in range(1, n + 1):
            dp[i] = dp[i & (i - 1)] + 1
    
    elif access_pattern == "power_of_2":
        # MSB pattern - good for power-of-2 aligned data
        dp = [0] * (n + 1)
        msb = 1
        for i in range(1, n + 1):
            if i == msb * 2:
                msb *= 2
            dp[i] = dp[i - msb] + 1
    
    return dp
```

---

### Tactic 5: Bit Position Analysis

```python
def analyze_bit_position(n: int, pos: int) -> tuple:
    """
    Analyze pattern of bit at position pos (0-indexed from LSB)
    """
    period = 2 ** (pos + 1)
    
    # In each period: 2^pos zeros, 2^pos ones
    zeros_per_period = 2 ** pos
    ones_per_period = 2 ** pos
    
    complete_periods = (n + 1) // period
    remainder = (n + 1) % period
    
    total_ones = (complete_periods * ones_per_period + 
                  max(0, remainder - zeros_per_period))
    
    return {
        'period': period,
        'total_ones': total_ones,
        'total_zeros': (n + 1) - total_ones
    }
```

<!-- back -->
