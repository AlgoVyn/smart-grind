## Sliding Window - Fixed Size: Comparison

When should you use fixed-size sliding window versus other approaches?

<!-- front -->

---

### Fixed Window vs Naive Recalculation

| Aspect | Fixed Window | Naive |
|--------|--------------|-------|
| **Time** | O(n) | O(n × k) |
| **Space** | O(1) or O(k) | O(1) or O(k) |
| **Per window update** | O(1) | O(k) |
| **Large k** | Efficient | Slow |

**Winner**: Fixed window for k > 1, either works for k = 1

---

### When to Use Fixed Sliding Window

**Use when:**
- Window size k is given/fixed
- Need to process every window of that size
- Can update window state in O(1)
- Comparing/counting within window

**Don't use when:**
- Window size varies (use variable window)
- Need optimal window size (use variable)
- Window state update is O(k) anyway
- Non-contiguous elements needed

---

### Comparison with Variable Window

| Aspect | Fixed | Variable |
|--------|-------|----------|
| **Window size** | Constant k | Dynamic |
| **Goal** | Process all windows | Find optimal window |
| **Condition** | None (process all) | Flexible |
| **Movement** | Slide by 1 | Expand/shrink |

---

### Decision Tree

```
Sliding window problem?
├── Yes → Window size fixed?
│   ├── Yes → FIXED WINDOW
│   └── No → Optimize size?
│       ├── Yes → VARIABLE WINDOW
│       └── No → Other pattern
└── No → Different pattern
```

---

### Key Trade-offs

| Consideration | Fixed Window Wins | Variable Window Wins |
|-------------|-------------------|---------------------|
| Given window size | ✓ | - |
| Find optimal size | - | ✓ |
| Process every window | ✓ | - |
| Complex constraints | - | ✓ |
| Implementation simplicity | ✓ | - |

<!-- back -->
