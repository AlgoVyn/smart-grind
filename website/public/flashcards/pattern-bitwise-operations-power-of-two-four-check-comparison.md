## Bitwise - Power of Two/Four Check: Comparison

When should you use bitwise checks versus other approaches?

<!-- front -->

---

### Bitwise vs Iterative Division

| Aspect | Bitwise (n & (n-1)) | Iterative Division |
|--------|---------------------|-------------------|
| **Time** | O(1) | O(log n) |
| **Space** | O(1) | O(1) |
| **Code** | One-liner | Loop required |
| **Readability** | Requires bit knowledge | Mathematically intuitive |
| **Performance** | Fastest | Acceptable for small n |
| **Overflow risk** | None | None |

**Winner:** Bitwise for all practical purposes.

---

### Bitwise vs Logarithm Approach

| Aspect | Bitwise | Math.log2 |
|--------|---------|-----------|
| **Time** | O(1) | O(1) |
| **Space** | O(1) | O(1) |
| **Precision** | Exact | Floating-point errors |
| **Large n** | Works perfectly | May fail for n > 2^53 |
| **Portability** | All languages | Language-dependent precision |

```python
# Logarithm approach - PROBLEMATIC
def is_power_of_two_log(n: int) -> bool:
    import math
    if n <= 0:
        return False
    # Fails for large numbers!
    # Example: 2**100 might not be represented exactly
    return math.log2(n).is_integer()
```

**Winner:** Bitwise - no precision issues.

---

### Power of 2 Check vs Power of 4 Check

| Check | Conditions | Additional Requirement |
|-------|-----------|----------------------|
| **Power of 2** | `n > 0 && (n & (n-1)) == 0` | None |
| **Power of 4** | Power of 2 check + position check | `(n & 0xAAAAAAAA) == 0` |
| **Power of 8** | Power of 2 check + mod 3 position | Position % 3 == 0 |

```
Hierarchy:
Power of 4 → Must be power of 2 → Must have single bit set
                    ↓
            Bit in even position (0, 2, 4, ...)
```

---

### Comparison Table: All Approaches

| Approach | Time | Space | Best For | Avoid When |
|----------|------|-------|----------|------------|
| **Bitwise (n & (n-1))** | O(1) | O(1) | Production, interviews | - |
| **Bit count == 1** | O(1) | O(1) | Readability (with builtins) | Custom bit_count |
| **Iterative /2** | O(log n) | O(1) | Educational purposes | Performance critical |
| **Iterative /4** | O(log₄n) | O(1) | Understanding the math | Performance critical |
| **Logarithm** | O(1) | O(1) | Never | Precision matters |
| **Lookup table** | O(1) | O(n) | Known small range | General cases |
| **Regular expression** | - | - | Never | Code golf only |

---

### Decision Tree

```
Need to check if n is power of...
│
├── 2?
│   └── Use: n > 0 && (n & (n - 1)) == 0
│
├── 4?
│   ├── Use mask: (n & 0xAAAAAAAA) == 0
│   └── Or modulo: n % 3 == 1
│
├── 3?
│   └── Use: n > 0 && 1162261467 % n == 0
│       (1162261467 = 3^19, max in int32)
│
└── Other (k)?
    └── Use: Iterate and divide, or math if precision ok
```

---

### Language-Specific Comparison

| Language | Built-in Method | Performance | Recommendation |
|----------|----------------|-------------|----------------|
| **Python** | `n.bit_count()` | O(1) | `n > 0 and n.bit_count() == 1` |
| **C++** | `__builtin_popcount()` | O(1) | `n > 0 && __builtin_popcount(n) == 1` |
| **Java** | `Integer.bitCount()` | O(1) | `n > 0 && Integer.bitCount(n) == 1` |
| **JavaScript** | None | - | `n > 0 && (n & (n - 1)) === 0` |
| **Go** | `bits.OnesCount()` | O(1) | `n > 0 && bits.OnesCount(uint(n)) == 1` |

**Note:** Bitwise `n & (n-1)` works in all languages and is universally optimal.

---

### When to Use Each Check

| Situation | Best Approach | Why |
|-----------|---------------|----- |
| Interview (LeetCode) | Bitwise `n & (n-1)` | Expected optimal solution |
| Production code | Built-in popcount if available | Most readable |
| Cross-platform | Bitwise `n & (n-1)` | Universal portability |
| Educational | All approaches | Understanding trade-offs |
| Power of 4 | Bitwise with mask | O(1), no division |
| Range queries | Precompute lookup table | Multiple queries fast |

<!-- back -->
