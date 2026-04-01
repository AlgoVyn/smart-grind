## Count Bits: Core Concepts

What is the counting bits problem and how does it use bit manipulation patterns?

<!-- front -->

---

### Problem Definition

Given an integer `n`, return an array where `ans[i]` is the number of 1 bits in the binary representation of `i` for all `0 ≤ i ≤ n`.

**Example:** n = 5
```
0 → 0b0  → 0 ones
1 → 0b1  → 1 one
2 → 0b10 → 1 one
3 → 0b11 → 2 ones
4 → 0b100 → 1 one
5 → 0b101 → 2 ones

Output: [0, 1, 1, 2, 1, 2]
```

---

### Key Patterns

| Pattern | Formula | Explanation |
|---------|---------|-------------|
| **i & 1** | LSB check | Is number odd? |
| **i >> 1** | Right shift | i // 2, removes LSB |
| **i & (i-1)** | Clear LSB | Removes rightmost 1 |
| **i & -i** | Isolate LSB | Gets lowest set bit |

---

### Recurrence Relations

```
Pattern 1: Using i >> 1
dp[i] = dp[i >> 1] + (i & 1)
# Bits in i = bits in i//2 + last bit

Pattern 2: Using i & (i-1)
dp[i] = dp[i & (i-1)] + 1
# Bits in i = bits in (i with lowest 1 cleared) + 1

Pattern 3: Using most significant bit
dp[i] = dp[i - highestPowerOf2] + 1
```

---

### Population Count (Popcount)

This is essentially computing popcount for all numbers 0..n.

| Method | Time per number | Notes |
|--------|-----------------|-------|
| **Naive** | O(log n) | Check each bit |
| **Brian Kernighan** | O(popcount) | Clear bits one by one |
| **Lookup table** | O(1) | Precompute 8/16-bit chunks |
| **DP/Hamming** | O(1) amortized | Use previously computed |

---

### Applications

| Use Case | Why Count Bits |
|----------|----------------|
| **Parity check** | Odd/even number of 1s |
| **Hamming distance** | XOR then popcount |
| **Subset enumeration** | Bitmask representation |
| **Bitmap indexing** | Index into compact arrays |
| **Error correction** | Checksum algorithms |

<!-- back -->
