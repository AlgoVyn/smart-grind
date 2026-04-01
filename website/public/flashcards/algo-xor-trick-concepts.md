## Title: XOR Trick - Core Concepts

What are the fundamental properties of XOR that enable problem-solving tricks?

<!-- front -->

---

### XOR Definition

XOR (exclusive or) returns 1 when bits differ, 0 when they match.

| A | B | A ^ B |
|---|---|-------|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

---

### Fundamental Properties

```
1. a ^ a = 0              (Self-inverse: XOR with itself = 0)
2. a ^ 0 = a              (Identity: XOR with 0 unchanged)
3. a ^ b = b ^ a          (Commutative: order doesn't matter)
4. (a ^ b) ^ c = a ^ (b ^ c)  (Associative: grouping doesn't matter)
```

**Combined Property:** `a ^ b ^ a = b` (a cancels out)

---

### Key Insight: Cancelation

The self-inverse property makes XOR powerful for "find the unique" problems:

```
Array: [4, 1, 2, 1, 2]
XOR all: 4 ^ 1 ^ 2 ^ 1 ^ 2
       = 4 ^ (1 ^ 1) ^ (2 ^ 2)  [by commutativity]
       = 4 ^ 0 ^ 0
       = 4
```

| Property | Use Case |
|----------|----------|
| Self-inverse | Find unique element in pairs |
| Commutative | Order-independent computation |
| Associative | Group operations arbitrarily |
| Identity | Preserve values with 0 |

---

### Bit-Level Properties

| Operation | Result | Use |
|-----------|--------|-----|
| `a ^ (1 << i)` | Toggle i-th bit | Flip specific bit |
| `a & ~(1 << i)` | Clear i-th bit | Turn off bit |
| `a \| (1 << i)` | Set i-th bit | Turn on bit |
| `a & (1 << i)` | Check i-th bit | Test if set |

---

### Common Problem Patterns

| Pattern | XOR Application |
|---------|-----------------|
| **Single number** | XOR all, pairs cancel |
| **Missing number** | XOR 1..n XOR array |
| **Swap** | a ^= b; b ^= a; a ^= b |
| **Bit parity** | XOR all bits |
| **Find duplicate** | XOR expected vs actual |
| **Range XOR** | Prefix XOR array |

---

### XOR with Ranges

```python
# XOR from 0 to n
def xor_0_to_n(n):
    pattern = [n, 1, n+1, 0]
    return pattern[n % 4]

# XOR from L to R
# xor(L, R) = xor(0, R) ^ xor(0, L-1)
```

| n % 4 | XOR(0..n) |
|-------|-----------|
| 0 | n |
| 1 | 1 |
| 2 | n + 1 |
| 3 | 0 |

<!-- back -->
