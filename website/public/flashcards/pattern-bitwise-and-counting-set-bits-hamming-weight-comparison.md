## Bitwise - Counting Set Bits: Comparison Guide

How do different bit counting approaches compare?

<!-- front -->

---

### Bit Counting Algorithm Comparison

| Algorithm | Time | Space | Iterations | Best For |
|-----------|------|-------|------------|----------|
| **Brian Kernighan** | O(k) | O(1) | k = set bits | Sparse numbers |
| **Right Shift Check** | O(32) = O(1) | O(1) | Always 32 | Predictable time |
| **Built-in Functions** | O(1) | O(1) | Hardware | Production code |
| **Lookup Table** | O(1) | O(256) | 4 lookups | High frequency |
| **Parallel SWAR** | O(1) | O(1) | 5 operations | Branchless code |
| **DP (Range)** | O(n) | O(n) | n numbers | Count bits 0 to n |

**k = number of set bits (worst case k = 32 for 32-bit integers)**

---

### Brian Kernighan vs Right Shift

| Aspect | Brian Kernighan | Right Shift |
|--------|-----------------|-------------|
| **Iterations** | O(k) - only set bits | O(32) - all bits |
| **n = 1** (sparse) | 1 iteration | 32 iterations |
| **n = 0xFFFFFFFF** (dense) | 32 iterations | 32 iterations |
| **Code clarity** | Requires understanding | Very intuitive |
| **Typical case** | Faster for sparse data | Consistent speed |

```python
# Brian Kernighan - skips zeros
def hamming_weight_kernighan(n):
    count = 0
    while n:              # Stops when n becomes 0
        count += 1
        n &= (n - 1)      # Clears lowest 1 bit
    return count          # Only k iterations

# Right shift - checks all positions
def hamming_weight_shift(n):
    count = 0
    for _ in range(32):   # Always 32 iterations
        count += n & 1
        n >>= 1
    return count
```

**Recommendation:** Use Brian Kernighan for interviews, right shift if clarity matters more.

---

### Built-in Functions by Language

| Language | Function | 32-bit | 64-bit | Notes |
|----------|----------|--------|--------|-------|
| **Python** | `int.bit_count()` | ✓ | ✓ | Python 3.10+, arbitrary precision |
| **C/C++** | `__builtin_popcount` | ✓ | `__builtin_popcountll` | GCC/Clang only |
| **Java** | `Integer.bitCount()` | ✓ | `Long.bitCount()` | Standard library |
| **JavaScript** | N/A | - | - | Use manual or `toString(2).split('1').length-1` |
| **C#** | `BitOperations.PopCount()` | ✓ | ✓ | .NET Core 3.0+ |
| **Rust** | `count_ones()` | ✓ | ✓ | On integer types |
| **Go** | `bits.OnesCount()` | ✓ | `bits.OnesCount64()` | math/bits package |

```python
# Python examples
n = 29  # 11101

# Built-in (fastest, recommended for production)
n.bit_count()           # → 4

# bin() string method (slower but simple)
bin(n).count('1')       # → 4

# Manual implementations (for understanding)
hamming_weight_kernighan(n)  # → 4
```

---

### Lookup Table vs Direct Computation

| Scenario | Lookup Table | Direct Computation |
|----------|--------------|-------------------|
| **Single count** | Slower (cache setup) | Faster |
| **Many counts** | Much faster (O(1) each) | Slower per count |
| **Memory** | O(256) bytes | O(1) |
| **Cache impact** | Small table stays in cache | No cache pressure |

```python
# Lookup table approach
class BitCounter:
    def __init__(self):
        self.lookup = [0] * 256
        for i in range(256):
            self.lookup[i] = self.lookup[i >> 1] + (i & 1)
    
    def count(self, n):
        return (self.lookup[n & 0xff] +
                self.lookup[(n >> 8) & 0xff] +
                self.lookup[(n >> 16) & 0xff] +
                self.lookup[(n >> 24) & 0xff])

# Trade-off: 256 bytes for O(1) lookups
```

**Use lookup table when:** Processing millions of integers.

---

### When to Use Each Approach

| Scenario | Recommended Approach | Why |
|----------|---------------------|-----|
| **Coding interview** | Brian Kernighan | Shows bit manipulation knowledge |
| **Production code** | Built-in functions | Most optimized, tested |
| **Very sparse data** | Brian Kernighan | O(k) where k << 32 |
| **Real-time/high freq** | Lookup table | Consistent O(1) |
| **Branchless required** | Parallel SWAR | No loops/conditionals |
| **Range 0 to n** | DP approach | O(n) for all numbers |
| **Teaching/learning** | Right shift | Most intuitive |
| **Cross-platform** | Manual implementation | No dependencies |

---

### Counting Bits vs Related Operations

| Operation | Formula | Use Case |
|-----------|---------|----------|
| **Count set bits** | `hamming_weight(n)` | Population count |
| **Check power of 2** | `n & (n - 1) == 0` | Exactly one bit set |
| **Isolate rightmost bit** | `n & -n` | Get lowest 1 value |
| **Clear rightmost bit** | `n & (n - 1)` | Hamming weight step |
| **Set rightmost 0** | `n \| (n + 1)` | Flip lowest 0 to 1 |
| **Flip all bits** | `~n` | Bitwise NOT |
| **XOR swap** | `a ^= b; b ^= a; a ^= b` | Swap without temp |

<!-- back -->
