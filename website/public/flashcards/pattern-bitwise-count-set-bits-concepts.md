## Bitwise - Counting Set Bits: Core Concepts

What are the fundamental principles for counting set bits (population count)?

<!-- front -->

---

### Core Concept

Use **bit manipulation techniques to count 1s in binary representation**, with methods ranging from naive shifting to optimized Brian Kernighan algorithms.

**Key insight**: `n & (n-1)` clears the lowest set bit, allowing us to count bits in O(number of set bits) time.

---

### The Pattern

```
Count set bits in n = 13 (binary 1101)

Method 1: Naive (check each bit)
  1101 & 1 = 1, count=1, shift
  110 & 1 = 0, count=1, shift
  11 & 1 = 1, count=2, shift
  1 & 1 = 1, count=3, shift
  0, done
  Result: 3 ✓

Method 2: Brian Kernighan (faster)
  n = 1101 (13)
  n-1 = 1100
  n & (n-1) = 1100 (clears lowest set bit)
  count=1
  
  n = 1100
  n-1 = 1011
  n & (n-1) = 1000
  count=2
  
  n = 1000
  n-1 = 0111
  n & (n-1) = 0000
  count=3, done
  
  Result: 3 ✓ (only 3 iterations vs 4)
```

---

### Comparison of Methods

| Method | Time | Space | Use Case |
|--------|------|-------|----------|
| **Naive (shift)** | O(log n) | O(1) | Simple, always works |
| **Brian Kernighan** | O(k) | O(1) | k = number of set bits, faster for sparse |
| **Lookup table** | O(1) | O(1) | Precomputed, fastest |
| **Built-in** | O(1) | O(1) | `bin(n).count('1')` in Python |

---

### Common Applications

| Problem Type | Description | Example |
|--------------|-------------|---------|
| **Hamming Weight** | Population count | Number of 1 Bits |
| **Hamming Distance** | XOR then count | Hamming Distance |
| **Bit Counting DP** | Count bits 0..n | Counting Bits |
| **Power of Two** | Exactly one bit | Power of Two |
| **Parity Check** | Odd/even number of 1s | Parity |

---

### Complexity

| Method | Time | Notes |
|--------|------|-------|
| Naive | O(log n) | Check all bits |
| Brian Kernighan | O(k) | k = number of set bits |
| DP (counting bits) | O(n) | For 0 to n |

<!-- back -->
