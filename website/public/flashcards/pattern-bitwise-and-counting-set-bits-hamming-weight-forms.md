## Bitwise - Counting Set Bits: Forms

What are the different variations of counting set bits?

<!-- front -->

---

### Form 1: Single Number Count (Basic)

```python
def hamming_weight_basic(n: int) -> int:
    """
    Standard Brian Kernighan algorithm.
    LeetCode 191 - Number of 1 Bits
    """
    count = 0
    while n:
        count += 1
        n &= (n - 1)
    return count
```

**Use case:** Count bits in a single 32-bit integer.

---

### Form 2: Range Count (0 to n)

```python
def count_bits_range(n: int) -> list:
    """
    Count bits for all numbers from 0 to n.
    LeetCode 338 - Counting Bits
    """
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        dp[i] = dp[i >> 1] + (i & 1)
    return dp

# Alternative: Brian Kernighan pattern
def count_bits_kernighan(n: int) -> list:
    """Using i & (i-1) pattern."""
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        dp[i] = dp[i & (i - 1)] + 1
    return dp
```

**Use case:** When you need bit counts for all numbers in a range (DP approach).

---

### Form 3: 64-bit Integer Count

```python
def hamming_weight_64(n: int) -> int:
    """
    Count bits in 64-bit integer.
    """
    # Split and count each half
    lower = n & 0xFFFFFFFF
    upper = (n >> 32) & 0xFFFFFFFF
    return hamming_weight_basic(lower) + hamming_weight_basic(upper)

# Or use built-in when available
def hamming_weight_builtin_64(n: int) -> int:
    """Python's bit_count handles arbitrary precision."""
    return n.bit_count()
```

**Use case:** Counting bits in 64-bit or larger integers.

---

### Form 4: Lookup Table (Precomputed)

```python
class HammingWeightLookup:
    """Precomputed lookup for maximum speed."""
    
    def __init__(self):
        self.table = [0] * 256
        for i in range(256):
            self.table[i] = self.table[i >> 1] + (i & 1)
    
    def count(self, n: int) -> int:
        """O(1) lookup using 8-bit chunks."""
        return (self.table[n & 0xFF] +
                self.table[(n >> 8) & 0xFF] +
                self.table[(n >> 16) & 0xFF] +
                self.table[(n >> 24) & 0xFF])

# Usage
counter = HammingWeightLookup()
count = counter.some_number  # O(1) lookup
```

**Use case:** High-frequency bit counting where initialization cost is amortized.

---

### Form 5: Parallel Bit Counting (SWAR)

```python
def hamming_weight_swar(n: int) -> int:
    """
    Parallel counting without loops.
    Simultaneously counts bits in all positions.
    """
    n = n - ((n >> 1) & 0x55555555)
    n = (n & 0x33333333) + ((n >> 2) & 0x33333333)
    n = (n + (n >> 4)) & 0x0F0F0F0F
    n = n + (n >> 8)
    n = n + (n >> 16)
    return n & 0x3F
```

**Use case:** Branchless code where loop elimination matters (e.g., GPU, SIMD).

---

### Form Comparison

| Form | Time | Space | Initialization | Best For |
|------|------|-------|----------------|----------|
| **Single (Basic)** | O(k) | O(1) | None | One-off counting |
| **Range (DP)** | O(n) | O(n) | None | All numbers 0 to n |
| **64-bit** | O(k) | O(1) | None | Large integers |
| **Lookup Table** | O(1) | O(256) | O(256) | High frequency |
| **SWAR** | O(1) | O(1) | None | Branchless/GPU |

**k = number of set bits*

---

### Form 6: Language-Specific Built-ins

```python
# Python (3.10+)
def hamming_weight_py(n: int) -> int:
    return n.bit_count()

# C++
# int count = __builtin_popcount(n);        // 32-bit
# int count = __builtin_popcountll(n);      // 64-bit

# Java
# int count = Integer.bitCount(n);          // 32-bit
# int count = Long.bitCount(n);             // 64-bit

# JavaScript
function hammingWeight(n) {
    return n.toString(2).split('1').length - 1;
    // Or: n.toString(2).replace(/0/g, '').length;
}

# Go
# import "math/bits"
# count := bits.OnesCount(uint(n))
```

**Use case:** Production code where readability and performance matter.

---

### Form 7: Hamming Distance (Related)

```python
def hamming_distance(x: int, y: int) -> int:
    """Count positions where bits differ."""
    return hamming_weight_basic(x ^ y)

def total_hamming_distance(nums: list) -> int:
    """Sum of distances between all pairs."""
    total = 0
    n = len(nums)
    for i in range(32):
        ones = sum((num >> i) & 1 for num in nums)
        total += ones * (n - ones)
    return total
```

**Use case:** Comparing binary representations (LeetCode 461, 477).

<!-- back -->
