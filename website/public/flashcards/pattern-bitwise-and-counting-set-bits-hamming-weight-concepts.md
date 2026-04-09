## Bitwise - Counting Set Bits: Core Concepts

What are the fundamental principles of counting set bits?

<!-- front -->

---

### Core Concept

**Counting set bits (Hamming Weight) is the population count of 1s in binary representation. The key insight is to leverage `n & (n - 1)` which efficiently clears the least significant 1 bit.**

**Binary representation example:**
```
n = 29
Binary: 11101
Set bits: 4 (positions 0, 2, 3, 4)
```

---

### The "n & (n - 1)" Trick

```
Why does n & (n - 1) clear the lowest set bit?

Example: n = 12 (1100 in binary)
n     = 1100  (12)
n - 1 = 1011  (11)
        ----
n&(n-1)= 1000  (8) ← lowest 1 cleared!

General pattern:
- n - 1 flips all bits from rightmost 1 to the end
- AND with n keeps only bits left of that 1
```

**Visual breakdown:**
```
n      = abc1000...0  (rightmost 1 at position k)
n - 1  = abc0111...1  (flip rightmost 1 and all to right)
n&(n-1)= abc0000...0  (only abc survive, right bits cleared)
        ↑↑↑
        These stay the same
```

---

### Common Applications

| Application | Use Case | Example |
|-------------|----------|---------|
| Population count | Count 1s in binary | Hamming Weight |
| Power of two check | `n & (n - 1) == 0` | LeetCode 231 |
| Rightmost bit isolation | `n & -n` | Find lowest set bit |
| Parity check | Count % 2 | Error detection |
| Bit density analysis | Sparse vs dense integers | Database bitmaps |

---

### Complexity Analysis

| Approach | Time | Space | Iterations |
|----------|------|-------|------------|
| Brian Kernighan | O(k) | O(1) | k = number of set bits |
| Right shift | O(32) = O(1) | O(1) | Always 32 iterations |
| Built-in | O(1) | O(1) | Hardware optimized |
| Lookup table | O(1) | O(256) | 4 table lookups |

**Why Brian Kernighan wins for sparse numbers:**
- Number `1` (binary: `1`): 1 iteration
- Number `256` (binary: `100000000`): 1 iteration
- Number `65536`: 1 iteration
- Worst case: 32 iterations for `0xFFFFFFFF`

---

### Related Bit Manipulation Patterns

| Pattern | Operation | Use Case |
|---------|-----------|----------|
| **Power of Two** | `n & (n - 1) == 0` | Check if single bit set |
| **Isolate Rightmost** | `n & -n` | Get value of lowest 1 bit |
| **Clear Rightmost** | `n & (n - 1)` | Hamming weight step |
| **Set Rightmost 0** | `n \| (n + 1)` | Set lowest 0 bit |
| **Toggle Rightmost** | `n ^ (n & -n)` | Flip lowest 1 to 0 |

---

### Edge Cases to Remember

```python
# Empty / Zero
hamming_weight(0)      # → 0 (no bits set)

# Single bit
hamming_weight(1)      # → 1
hamming_weight(2**31)  # → 1

# All bits set
hamming_weight(2**32 - 1)  # → 32 (for 32-bit)

# Signed integers (C++ pitfall)
# Use unsigned to avoid infinite loop with >> 
```

<!-- back -->
