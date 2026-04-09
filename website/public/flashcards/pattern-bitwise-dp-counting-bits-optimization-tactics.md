## Bitwise DP - Counting Bits Optimization: Tactics

What are specific techniques for counting bits DP problems?

<!-- front -->

---

### Tactic 1: Bitwise vs Arithmetic Operators

Replace slower arithmetic with faster bitwise:

```python
def count_bits_optimized(n: int) -> list:
    """
    Use bitwise ops instead of arithmetic for speed.
    """
    ans = [0] * (n + 1)
    
    for i in range(1, n + 1):
        # Bitwise is often faster than arithmetic
        ans[i] = ans[i >> 1] + (i & 1)  # vs i // 2 + i % 2
    
    return ans
```

**Performance note:** Modern compilers often optimize both similarly, but bitwise shows deeper understanding.

---

### Tactic 2: Space Optimization (When Only Final Value Needed)

If you only need `ans[n]` (not the full array):

```python
def count_bits_single(n: int) -> int:
    """
    Count bits in just one number (not range).
    Use Brian Kernighan's for O(k) where k = set bits.
    """
    count = 0
    while n:
        count += 1
        n &= n - 1  # Clear lowest set bit
    return count
```

**When to use:** Single number → Kernighan's O(k). Range 0..n → DP O(n).

---

### Tactic 3: Lookup Table for High-Frequency Queries

Precompute for 8-bit chunks, then combine:

```python
class BitCounter:
    """Fast bit counting using lookup table."""
    
    def __init__(self):
        # Precompute 0-255 once
        self.lookup = [0] * 256
        for i in range(256):
            self.lookup[i] = self.lookup[i >> 1] + (i & 1)
    
    def count(self, n: int) -> int:
        """O(1) bit count for 32-bit integers."""
        return (self.lookup[n & 0xFF] + 
                self.lookup[(n >> 8) & 0xFF] +
                self.lookup[(n >> 16) & 0xFF] +
                self.lookup[(n >> 24) & 0xFF])
    
    def count_range(self, n: int) -> list:
        """Range query using lookup."""
        return [self.count(i) for i in range(n + 1)]
```

**Best for:** Very frequent queries, constant time per count.

---

### Tactic 4: MSB Tracking for Pattern Understanding

Use MSB approach to understand binary structure:

```python
def count_bits_with_msb_tracking(n: int) -> list:
    """
    Track MSB to understand power-of-2 boundaries.
    """
    ans = [0] * (n + 1)
    msb = 1
    
    for i in range(1, n + 1):
        if i == msb * 2:
            print(f"Power of 2 reached: {i} (binary: {bin(i)})")
            msb *= 2
        ans[i] = ans[i - msb] + 1
    
    return ans
```

**Educational value:** Shows where bit patterns reset to 1.

---

### Tactic 5: Pattern Recognition in Results

Observe useful patterns in the output array:

```python
# ans[i] patterns:
# - ans[2^k] = 1 for all k (powers of 2 have one bit)
# - ans[2^k - 1] = k (all 1s means k bits)
# - ans[i] + ans[(2^k - 1) - i] = k for i < 2^k

# Example verification:
n = 15  # 2^4 - 1
ans = count_bits(15)
# ans = [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4]
# Notice: ans[7] + ans[8] = 3 + 1 = 4, ans[6] + ans[9] = 2 + 2 = 4
```

---

### Tactic 6: Edge Case Handling

Common pitfalls and fixes:

```python
def count_bits_safe(n: int) -> list:
    """
    Handle all edge cases safely.
    """
    # Edge: n = 0
    if n < 0:
        return []
    
    ans = [0] * (n + 1)  # Correct size: n + 1, not n
    
    # Edge: Don't compute ans[0] (already correct)
    for i in range(1, n + 1):  # Start from 1, not 0
        ans[i] = ans[i >> 1] + (i & 1)
    
    return ans
```

| Edge Case | Issue | Fix |
|-----------|-------|-----|
| n = 0 | Array size | `[0]` not `[]` |
| Starting at 0 | ans[0] overwritten | Start loop at 1 |
| Integer overflow | Not in Python | Use `//` not `/` in other languages |
| Negative n | Invalid input | Return empty or raise |

---

### Tactic 7: Extension to Sum of Hamming Weights

When asked for sum instead of array:

```python
def sum_of_hamming_weights(n: int) -> int:
    """
    Sum of all ans[i] for i in [0, n].
    Can compute directly or accumulate during DP.
    """
    ans = [0] * (n + 1)
    total = 0
    
    for i in range(1, n + 1):
        ans[i] = ans[i >> 1] + (i & 1)
        total += ans[i]  # Accumulate sum
    
    return total

# Mathematical insight: Sum has closed form O(log n) solution
# but DP O(n) is acceptable for interview constraints
```

<!-- back -->
