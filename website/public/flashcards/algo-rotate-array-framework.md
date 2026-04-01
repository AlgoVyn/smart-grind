## Title: Rotate Array - Frameworks

What are the structured approaches for solving array rotation problems?

<!-- front -->

---

### Framework 1: Reversal Method (Recommended)

```
┌─────────────────────────────────────────────────────┐
│  ARRAY ROTATION - REVERSAL FRAMEWORK                  │
├─────────────────────────────────────────────────────┤
│  1. Handle edge cases (empty, single element, k=0)   │
│  2. Normalize k: k = k % n                         │
│  3. Reverse entire array (index 0 to n-1)           │
│  4. Reverse first k elements (index 0 to k-1)       │
│  5. Reverse remaining n-k elements (index k to n-1)   │
└─────────────────────────────────────────────────────┘
```

**When to use:** Standard array rotation with in-place constraint.

---

### Framework 2: Cyclic Replacements

```
┌─────────────────────────────────────────────────────┐
│  CYCLIC REPLACEMENT FRAMEWORK                        │
├─────────────────────────────────────────────────────┤
│  1. Normalize k: k = k % n                          │
│  2. Initialize: count = 0, start = 0               │
│  3. While count < n:                                │
│     a. current = start                              │
│     b. prev = arr[start]                             │
│     c. Do:                                          │
│        - next_idx = (current + k) % n              │
│        - temp = arr[next_idx]                       │
│        - arr[next_idx] = prev                        │
│        - prev = temp                                 │
│        - current = next_idx                          │
│        - count += 1                                  │
│        - Until current == start (cycle complete)     │
│     d. start += 1 (next cycle)                      │
└─────────────────────────────────────────────────────┘
```

**When to use:** Alternative when tracking element movement is important.

---

### Framework 3: Juggling Algorithm (GCD-based)

```
┌─────────────────────────────────────────────────────┐
│  JUGGLING ALGORITHM FRAMEWORK                      │
├─────────────────────────────────────────────────────┤
│  For left rotation:                                 │
│  1. Compute g = GCD(k, n)                          │
│  2. For i from 0 to g-1:                           │
│     a. temp = arr[i]                                │
│     b. j = i                                         │
│     c. While True:                                   │
│        - next_idx = (j + k) % n                    │
│        - If next_idx == i: break                     │
│        - arr[j] = arr[next_idx]                     │
│        - j = next_idx                                │
│     d. arr[j] = temp                                  │
└─────────────────────────────────────────────────────┘
```

**When to use:** Alternative for left rotation, educational purposes.

---

### Framework Comparison

| Framework | Time | Space | Best For |
|-----------|------|-------|----------|
| **Reversal** | O(n) | O(1) | Simple, efficient, recommended |
| **Cyclic** | O(n) | O(1) | Understanding element movement |
| **Juggling** | O(n) | O(1) | Left rotation, GCD concept |
| **Extra Array** | O(n) | O(n) | When space not constrained |

<!-- back -->
