## Title: Sparse Table - Core Concepts

What is a Sparse Table and when should it be used?

<!-- front -->

---

### Definition
A data structure enabling O(1) range query time after O(n log n) preprocessing for idempotent operations like min, max, GCD on static arrays.

| Aspect | Details |
|--------|---------|
| **Preprocessing** | O(n log n) |
| **Query** | O(1) |
| **Space** | O(n log n) |
| **Limitation** | Static only - no updates |

---

### Idempotent Operations

Sparse Table only works for operations where `f(f(x,y),z) = f(x,y,z)` and `f(x,x) = x`.

| Operation | Idempotent | Compatible |
|-----------|------------|------------|
| **Min** | Yes | ✅ |
| **Max** | Yes | ✅ |
| **GCD** | Yes | ✅ |
| **Bitwise AND/OR** | Yes | ✅ |
| **Sum** | No | ❌ |
| **Product** | No | ❌ |

---

### Power-of-Two Decomposition

Any range [L, R] of length `len = R - L + 1` can be covered by two overlapping power-of-two intervals:

```
k = floor(log2(len))
Interval 1: [L, L + 2^k - 1] (starts at L)
Interval 2: [R - 2^k + 1, R] (ends at R)
```

These two intervals together cover [L, R] completely.

---

### Table Structure

`table[j][i]` stores the result for range `[i, i + 2^j - 1]`.

```
j=0 (len=1):  table[0][i] = arr[i]
j=1 (len=2):  table[1][i] = func(table[0][i], table[0][i+1])
j=2 (len=4):  table[2][i] = func(table[1][i], table[1][i+2])
```

<!-- back -->
