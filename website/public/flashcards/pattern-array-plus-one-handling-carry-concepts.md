## Array - Plus One (Handling Carry): Core Concepts

What are the fundamental principles for handling carry in digit arrays?

<!-- front -->

---

### Core Concept

**Simulate manual addition: Start from the right (least significant digit), increment by 1, and propagate carry left through consecutive 9s.**

**The addition process:**
```
[1, 2, 9] + 1:

Position:  0   1   2
Digits:    1   2   9
              ↑   ↑
            MSD   LSD (start here)

Step 1: digits[2] = 9, so set to 0, carry left
        Result: [1, 2, 0]

Step 2: digits[1] = 2 < 9, so increment to 3
        Result: [1, 3, 0] ✓ Done!
```

---

### The Pattern

```
Digit Array Arithmetic:
- Standard integers overflow with large numbers
- Arrays can represent arbitrarily large numbers
- Carry propagates from right to left

Three key cases:
1. Last digit < 9: Simple increment, early return
2. Trailing 9s: Each becomes 0, carry continues
3. All digits are 9: Need new leading 1 (array grows)
```

---

### Common Applications

| Problem Type | Use Case | Example |
|--------------|----------|---------|
| Big number arithmetic | Numbers too large for int64 | 999-digit numbers |
| Digit manipulation | Array-based math | Adding to large numbers |
| Carry propagation | Multi-digit operations | Addition, multiplication |
| Array increment | Counter implementations | Frequency arrays |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(n) | Worst case: all 9s |
| Space | O(1) | In-place modification |
| All 9s space | O(n) | New array with leading 1 |
| Average time | O(1) | Early termination for most inputs |

<!-- back -->
