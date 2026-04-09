## Bitwise - Counting Set Bits: Framework

What is the complete code template for counting set bits (Hamming Weight)?

<!-- front -->

---

### Framework: Brian Kernighan's Algorithm

```
┌─────────────────────────────────────────────────────┐
│  HAMMING WEIGHT - TEMPLATE                             │
├─────────────────────────────────────────────────────┤
│  Key Insight: n & (n - 1) clears the least            │
│  significant 1 bit                                   │
│                                                        │
│  1. Initialize count = 0                             │
│  2. While n != 0:                                    │
│     a. count += 1  (found a set bit)                 │
│     b. n &= (n - 1)  (clear least significant 1)     │
│  3. Return count                                       │
│                                                        │
│  Time: O(k) where k = number of set bits              │
│  Space: O(1)                                          │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: Brian Kernighan (Recommended)

```python
def hamming_weight(n: int) -> int:
    """
    Count set bits using Brian Kernighan's algorithm.
    LeetCode 191 - Number of 1 Bits
    Time: O(k), Space: O(1) where k = number of set bits
    """
    count = 0
    
    while n:
        count += 1
        n &= (n - 1)  # Remove the least significant 1 bit
    
    return count
```

**Why it works:** `n & (n - 1)` always clears the lowest set bit. Example: `n = 12 (1100)`, `n - 1 = 11 (1011)`, `n & (n - 1) = 1000 (8)` - lowest 1 cleared.

---

### Implementation: Right Shift (Basic)

```python
def hamming_weight_shift(n: int) -> int:
    """
    Count set bits by checking each bit position.
    Time: O(32) = O(1), Space: O(1)
    """
    count = 0
    
    for _ in range(32):  # Process all 32 bits
        if n & 1:        # Check if least significant bit is 1
            count += 1
        n >>= 1          # Right shift to check next bit
    
    return count
```

---

### Implementation: Built-in Functions

```python
# Python 3.10+
def hamming_weight_builtin(n: int) -> int:
    """Use Python's built-in bit_count()."""
    return n.bit_count()

# Alternative using bin()
def hamming_weight_bin(n: int) -> int:
    """Convert to binary string and count '1' characters."""
    return bin(n).count('1')
```

**C/C++:** `__builtin_popcount(n)` (32-bit), `__builtin_popcountll(n)` (64-bit)  
**Java:** `Integer.bitCount(n)` (32-bit), `Long.bitCount(n)` (64-bit)  
**JavaScript:** `n.toString(2).split('1').length - 1`

---

### Key Framework Elements

| Element | Purpose | Complexity |
|---------|---------|------------|
| `count` | Track set bits | O(1) space |
| `n & (n - 1)` | Clear lowest set bit | O(1) per iteration |
| `while n` | Loop until all bits cleared | O(k) iterations |
| `n & 1` | Check if bit is set | O(1) |
| `n >>= 1` | Shift to next bit | O(1) |

---

### Lookup Table (For High-Frequency)

```python
class BitCounter:
    """Precomputed lookup table for fast bit counting."""
    
    def __init__(self):
        # Precompute lookup table for 8-bit values (0-255)
        self.lookup = [0] * 256
        for i in range(256):
            self.lookup[i] = self.lookup[i >> 1] + (i & 1)
    
    def count(self, n: int) -> int:
        """Count set bits using lookup table."""
        return (self.lookup[n & 0xff] +
                self.lookup[(n >> 8) & 0xff] +
                self.lookup[(n >> 16) & 0xff] +
                self.lookup[(n >> 24) & 0xff])
```

**Best for:** High-frequency bit counting operations requiring O(1) time.

<!-- back -->
