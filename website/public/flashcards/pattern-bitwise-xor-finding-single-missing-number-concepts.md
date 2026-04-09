## Bitwise XOR - Finding Single/Missing Number: Concepts

What are the fundamental XOR properties that make this pattern work for finding single/missing numbers?

<!-- front -->

---

### Core XOR Properties

| Property | Formula | Meaning |
|----------|---------|---------|
| **Identity** | `a ^ 0 = a` | XOR with 0 leaves number unchanged |
| **Self-Inverse** | `a ^ a = 0` | Any number XORed with itself cancels to 0 |
| **Commutative** | `a ^ b = b ^ a` | Order of operations doesn't matter |
| **Associative** | `(a ^ b) ^ c = a ^ (b ^ c)` | Grouping doesn't matter |

---

### The Cancellation Principle

**The "Aha!" Moment:**

When XORing all elements in an array where pairs exist:

```
Array: [4, 1, 2, 1, 2]

Step by step:
4 ^ 1 ^ 2 ^ 1 ^ 2
= 4 ^ (1 ^ 1) ^ (2 ^ 2)   [Commutative/Associative]
= 4 ^ 0 ^ 0               [Self-Inverse]
= 4                       [Identity]
```

**Visual:**
```
Pairs cancel out:
(1,1) → 1 ^ 1 = 0
(2,2) → 2 ^ 2 = 0
Single: 4 ^ 0 ^ 0 = 4
```

---

### Why XOR Works for Missing Numbers

For range [0..n] with one missing:

```
Given: nums = [0, 1, 3] (missing 2)

XOR all array:    0 ^ 1 ^ 3 = 2
XOR full range:   0 ^ 1 ^ 2 ^ 3 = 0
Missing number:   2 ^ 0 = 2

Why? Numbers present in both cancel out (0^0=0, 1^1=0, 3^3=0)
Only the missing number remains (2 from full range has no pair)
```

---

### Bit-Level Understanding

**XOR Truth Table:**

| A | B | A ^ B |
|---|---|-------|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

**Key Observation:** XOR returns 1 where bits differ, 0 where they match.

```
Example: 5 ^ 3
  5 = 101
  3 = 011
      ---
  6 = 110  (bits differ at positions 0 and 2)
```

---

### Mathematical Foundation

**Why only XOR works:**

To find a single unique element by pairwise cancellation, we need an operation with:
1. **Commutativity** - Order doesn't matter
2. **Associativity** - Grouping doesn't matter
3. **Identity element** - Starting point that doesn't change result
4. **Self-inverse** - `a ⊕ a = 0` (the cancellation property)

XOR (and XNOR) are the only binary bitwise operations satisfying all four.

**Why addition fails:**
```
a + a = 2a ≠ 0  # Doesn't cancel!
```

---

### Finding the Differentiating Bit

When `xor_all = a ^ b` (two singles), we need to separate them:

```
xor_all = a ^ b ≠ 0  (a ≠ b, so at least one bit differs)

diff_bit = xor_all & -xor_all  # Rightmost set bit

Why this works:
- Two's complement: -x = ~x + 1
- -xor_all has all bits flipped up to and including rightmost 1
- xor_all & -xor_all isolates just that rightmost 1

Example: xor_all = 6 (110), -6 = ...11111010
         6 & -6 = 110 & 010 = 010 = 2
```

This bit is set in exactly one of {a, b}, allowing us to partition.

<!-- back -->
