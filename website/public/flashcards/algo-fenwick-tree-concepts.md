## Fenwick Tree: Core Concepts

What is a Fenwick Tree (Binary Indexed Tree) and when should it be used?

<!-- front -->

---

### Fundamental Definition

Fenwick Tree is a data structure for efficient **prefix sum queries** and **point updates**.

| Operation | Time Complexity |
|-----------|----------------|
| **Prefix sum** | O(log n) |
| **Point update** | O(log n) |
| **Range sum** | O(log n) |
| **Build** | O(n) |

**Key insight:** Uses tree structure where each node stores sum of a range, indexed by binary representation.

---

### Structure Concept

```
Array: [3, 2, -1, 6, 5, 4, -3, 3, 7, 2, 3]

BIT Tree (partial sums):
Tree[1]:  sum[1..1]    = 3     (001: range of 1)
Tree[2]:  sum[1..2]    = 5     (010: range of 2)
Tree[4]:  sum[1..4]    = 10    (100: range of 4)
Tree[8]:  sum[1..8]    = 19    (1000: range of 8)

Pattern: Tree[i] stores sum of range [i - 2^r + 1 .. i]
where r = position of lowest set bit
```

---

### When to Use vs Alternatives

| Scenario | Fenwick | Segment Tree | Prefix Array |
|----------|---------|--------------|--------------|
| **Static array** | ✓ | ✓ | Best: O(1) query |
| **Point update only** | Best | ✓ | ✗ O(n) update |
| **Range update** | ✗ (complex) | ✓ | ✗ |
| **Min/max query** | ✗ | ✓ | O(n) |
| **Code simplicity** | Best | Verbose | Simple |

---

### Core Operations

| Operation | Formula |
|-----------|---------|
| **Get parent** | `i - (i & -i)` |
| **Get next** | `i + (i & -i)` |
| **Lowest set bit** | `i & -i` |

**Why `i & -i` works:** Two's complement negation flips bits, AND isolates lowest set bit.

```
i = 12 = 1100
-i = -12 = 0100 (two's complement)
i & -i = 0100 = 4
```

<!-- back -->
