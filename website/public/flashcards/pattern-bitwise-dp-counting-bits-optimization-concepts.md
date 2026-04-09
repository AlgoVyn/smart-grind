## Bitwise DP - Counting Bits Optimization: Core Concepts

What are the fundamental concepts behind counting bits using dynamic programming?

<!-- front -->

---

### Core Principle

**The key insight:** The number of set bits in `i` is related to the number of set bits in `i // 2` (or `i >> 1`).

```
Binary Structure Pattern:
┌─────────────────────────────────────────────────────────┐
│  i = 6:  110     i // 2 = 3:  11                       │
│  i = 7:  111     i // 2 = 3:  11                       │
│                                                         │
│  Observation: Binary of i is binary of i//2 with       │
│  the LSB (0 or 1) appended at the end                   │
│                                                         │
│  Therefore: bits(i) = bits(i//2) + (i % 2)            │
└─────────────────────────────────────────────────────────┘
```

---

### Mathematical Structure

**Fundamental Recurrence Relation:**

```
Even number (i % 2 = 0):
  bits(i) = bits(i // 2) + 0
  
Odd number (i % 2 = 1):
  bits(i) = bits(i // 2) + 1

Unified formula:
  bits(i) = bits(i // 2) + (i % 2)
  bits(i) = bits(i >> 1) + (i & 1)   [bitwise form]
```

**Why i // 2 is always computed first:**
```
Since i // 2 < i for all i >= 1:
  - When computing ans[i], ans[i // 2] already exists
  - Natural bottom-up DP ordering
  - No need for recursion or memoization checks
```

---

### Alternative Recurrence Relations

All these are mathematically equivalent:

| Approach | Formula | Intuition |
|----------|---------|-----------|
| **LSB-based** | `dp[i] = dp[i >> 1] + (i & 1)` | Remove LSB, add it back |
| **Brian Kernighan's** | `dp[i] = dp[i & (i-1)] + 1` | Clear lowest set bit |
| **Lowest Set Bit** | `dp[i] = dp[i - (i & -i)] + 1` | Subtract lowest power of 2 |
| **MSB-based** | `dp[i] = dp[i - msb] + 1` | Remove highest power of 2 |

---

### The "Aha!" Moment - Visual Proof

```
Compute ans for i = 0 to 7:

i    Binary   i//2   ans[i//2]   i%2   ans[i]
─────────────────────────────────────────────
0    000      -      -           -     0 (base)
1    001      0      0           1     0+1=1
2    010      1      1           0     1+0=1
3    011      1      1           1     1+1=2
4    100      2      1           0     1+0=1
5    101      2      1           1     1+1=2
6    110      3      2           0     2+0=2
7    111      3      2           1     2+1=3

Result: [0, 1, 1, 2, 1, 2, 2, 3] ✓
```

---

### Bit Manipulation Fundamentals

| Operation | Description | Example | Equivalent |
|-----------|-------------|---------|------------|
| `i >> 1` | Right shift by 1 | `6 >> 1 = 3` | `i // 2` |
| `i & 1` | Check LSB | `7 & 1 = 1` | `i % 2` |
| `i & (i-1)` | Remove lowest set bit | `7 & 6 = 6` | Clear LSB 1 |
| `i & -i` | Isolate lowest set bit | `6 & -6 = 2` | Lowest power |
| `i.bit_length()` | Bits needed | `5.bit_length() = 3` | ⌊log₂(i)⌋ + 1 |

**Two's Complement for `i & -i`:**
```
i = 6:  0110
-i = -6: 1010 (two's complement)
i & -i:  0010 = 2 ✓ (lowest set bit isolated)
```

---

### Why O(n) is Optimal

**Can we do better than O(n)?**

```
NO - We must compute n + 1 values (output constraint)

Lower bound argument:
  - Any correct algorithm must fill ans[0..n]
  - That's n + 1 writes
  - Therefore Ω(n) time is required

Space lower bound:
  - Output array itself requires O(n) space
  - Cannot use less space than the output

Conclusion: The DP solution is asymptotically optimal
```

---

### Base Case

```
ans[0] = 0

Reasoning:
  - Binary representation of 0 is "0"
  - No set bits (no 1s in the representation)
  - Foundation for all other calculations
```

---

### Problem Identification

**Signal this pattern applies when:**

| Phrase/Context | Why |
|----------------|-----|
| "Count 1's in binary" | Direct application |
| "Hamming weight for range" | Array of popcounts |
| "Sum of set bits from 0 to n" | Variation of counting |
| LeetCode 338 | The classic problem |
| "O(n) solution required" | Can't use O(n log n) per number |

<!-- back -->
