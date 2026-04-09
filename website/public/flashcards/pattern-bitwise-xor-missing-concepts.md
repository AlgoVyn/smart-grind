## Bitwise XOR - Missing Number: Core Concepts

What are the fundamental principles of XOR for finding missing numbers?

<!-- front -->

---

### Core Concept

**XOR's self-inverse property cancels paired numbers, leaving only the unique or missing element.**

**Example - Single Number:**
```
[4, 1, 2, 1, 2]

XOR all:
4 ^ 1 ^ 2 ^ 1 ^ 2
= 4 ^ (1 ^ 1) ^ (2 ^ 2)
= 4 ^ 0 ^ 0
= 4
```

**Example - Missing Number:**
```
[0, 1, 3] (missing 2 in [0..3])

XOR indices: 0 ^ 1 ^ 2 ^ 3
XOR values:  0 ^ 1 ^ 3
Result: (0^0) ^ (1^1) ^ 2 ^ (3^3) = 2
```

---

### The Pattern

```
Key insight: XOR all together
- Pairs become 0 and disappear
- Single element remains
- Missing number revealed by index XOR

Why it works:
- XOR is its own inverse: a ^ a = 0
- Order doesn't matter (commutative)
- 0 is identity: a ^ 0 = a
```

---

### Common Applications

| Problem Type | Use Case | Example |
|--------------|----------|---------|
| Single number | Find unique | LeetCode 136 |
| Missing number | Find gap | LeetCode 268 |
| Two singles | Find both | LeetCode 260 |
| Duplicate | Find twice | Variations |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(n) | Single pass |
| Space | O(1) | One variable |
| Best for | One/missing element | Not for multiple |

<!-- back -->
