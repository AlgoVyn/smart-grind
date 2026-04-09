## Bit Manipulation - XOR Single Missing: Core Concepts

What are the fundamental principles of using XOR to find missing or duplicate numbers?

<!-- front -->

---

### Core Concept

Use **XOR properties to cancel out paired numbers**, leaving only the unique/unpaired number.

**Key insight**: XOR has magical properties: `a ^ a = 0`, `a ^ 0 = a`, and it's commutative/associative.

---

### The XOR Properties

| Property | Expression | Result |
|----------|------------|--------|
| **Self-cancel** | `a ^ a` | `0` |
| **Identity** | `a ^ 0` | `a` |
| **Commutative** | `a ^ b` | `b ^ a` |
| **Associative** | `(a ^ b) ^ c` | `a ^ (b ^ c)` |

---

### The Pattern

```
Problem: Find the single number that appears once (others twice)
Array: [4, 1, 2, 1, 2]

XOR all elements:
  4 ^ 1 ^ 2 ^ 1 ^ 2
  = 4 ^ (1 ^ 1) ^ (2 ^ 2)  [commutative]
  = 4 ^ 0 ^ 0
  = 4 ✓

Problem: Find missing number in [0, 1, ..., n]
Array: [3, 0, 1] (missing 2, n=3)

XOR indices with values:
  indices: 0 ^ 1 ^ 2 ^ 3
  values:  3 ^ 0 ^ 1
  
  (0^1^2^3) ^ (3^0^1)
  = 0^0 ^ 1^1 ^ 2 ^ 3^3
  = 0 ^ 0 ^ 2 ^ 0
  = 2 ✓
```

---

### Common Applications

| Problem Type | Description | Solution |
|--------------|-------------|----------|
| **Single Number** | One appears once, others twice | XOR all |
| **Single Number II** | One once, others three times | Bit count |
| **Missing Number** | Find missing in 0..n | XOR indices ^ values |
| **Duplicate** | Find duplicate, others once | XOR expected ^ actual |
| **Two Single** | Two appear once, others twice | XOR + partition |

---

### Complexity

| Approach | Time | Space |
|----------|------|-------|
| **XOR** | O(n) | O(1) |
| **Hash Set** | O(n) | O(n) |
| **Sort** | O(n log n) | O(1) or O(n) |
| **Math (sum)** | O(n) | O(1) | (may overflow)

<!-- back -->
