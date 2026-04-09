## Bitwise - Power of Two/Four Check: Core Concepts

What are the fundamental principles behind the power of 2/4 check using bit manipulation?

<!-- front -->

---

### Core Concept: Single Set Bit Property

**Key Insight:** Powers of 2 have exactly **one bit set to 1** in binary.

```
Decimal    Binary      Set Bits
────────────────────────────────
1          0001        1 bit (position 0)
2          0010        1 bit (position 1)
4          0100        1 bit (position 2)
8          1000        1 bit (position 3)
16         10000       1 bit (position 4)
```

**Why this matters:** If a number has exactly one bit set, it must be a power of 2.

---

### The "n & (n - 1)" Trick

**What it does:** Clears the **lowest set bit** in `n`.

```
Example: n = 8 (1000 in binary)
────────────────────────────────
n        = 8    →    1000
n - 1    = 7    →    0111
n & (n-1) = 0    →    0000  ← Cleared the only set bit!

Result is 0 → n was a power of 2 ✓
```

```
Example: n = 12 (1100 in binary) - NOT a power of 2
────────────────────────────────
n        = 12   →    1100
n - 1    = 11   →    1011
n & (n-1) = 8    →    1000  ← Only cleared the lowest bit!

Result is not 0 → n is NOT a power of 2 ✗
```

---

### Why We Need "n > 0"

**Critical check:** Without `n > 0`, zero and negatives can pass the bitwise test.

```
Zero case:
n = 0 → 0000
n - 1 = -1 → ...1111 (two's complement)
n & (n-1) = 0 ✓  (Would incorrectly return true!)

Negative case:
n = -2 → ...1110
n - 1 = -3 → ...1101
n & (n-1) = ...1100 ≠ 0 ✓ (Correctly fails)

But some negatives might have single bit set in certain representations!
```

**Always include:** `n > 0 && (n & (n - 1)) == 0`

---

### Power of Four: Bit Position Check

**Key Insight:** Powers of 4 have their single bit in an **even position** (0, 2, 4, 6, ...).

```
Power of 4:     Binary:      Position:
───────────────────────────────────────
1  (4^0)        0001         0 (even) ✓
4  (4^1)        0100         2 (even) ✓
16 (4^2)        10000        4 (even) ✓
64 (4^3)        1000000      6 (even) ✓

Power of 2 (not 4):
2  (2^1)        0010         1 (odd)  ✗
8  (2^3)        1000         3 (odd)  ✗
32 (2^5)       100000        5 (odd)  ✗
```

**The Mask:** `0xAAAAAAAA`
- Binary: `10101010101010101010101010101010`
- Has 1s in all **odd positions** (1, 3, 5, 7, ...)
- If `n & 0xAAAAAAAA == 0`, no bit is set in odd position
- Therefore, the bit must be in an **even position**

---

### Common Applications

| Application | Why Power of 2 Matters | Example |
|-------------|------------------------|---------|
| **Array sizes** | Memory alignment | Dynamic array resizing |
| **Binary trees** | Perfect trees have 2^n - 1 nodes | Heap structures |
| **Bit masking** | Efficient modulo with & | `x % 8 == x & 7` |
| **Image processing** | Textures often power-of-2 | GPU optimization |
| **Hash tables** | Resize efficiency | Load factor triggers |

---

### Complexity Analysis

| Aspect | Complexity | Explanation |
|--------|-----------|-------------|
| **Time** | O(1) | Fixed number of bitwise ops |
| **Space** | O(1) | No extra storage needed |
| **Operations** | 2-3 | `>`, `&`, possibly `&` again |

**Why O(1) is powerful:** Beats O(log n) iterative division and O(1) with logarithm (floating point issues).

<!-- back -->
