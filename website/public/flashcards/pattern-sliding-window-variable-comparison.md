## Sliding Window - Variable Size: Comparison

When should you use variable-size sliding window versus other approaches?

<!-- front -->

---

### Variable vs Fixed Window

| Aspect | Variable | Fixed |
|--------|----------|-------|
| **Window size** | Dynamic | Constant |
| **Condition** | Flexible (varies) | Fixed constraint |
| **Goal** | Optimize size | Calculate per window |
| **Complexity** | O(n) | O(n) |
| **Use case** | Find optimal subarray | Process each window |

**Winner**: Variable for optimization problems, Fixed for fixed-size calculations

---

### When to Use Variable Sliding Window

**Use when:**
- Finding minimum/maximum size subarray meeting condition
- Condition depends on window contents (sum, unique chars, etc.)
- Window can expand and contract
- Optimal subarray size is unknown

**Don't use when:**
- Fixed window size given (use fixed)
- Need all subarrays, not just optimal (use brute force)
- Condition requires non-contiguous elements
- Array has negatives and condition is sum-based (use prefix sums)

---

### Comparison with Other Subarray Patterns

| Pattern | Time | Space | Best For |
|---------|------|-------|----------|
| **Variable Window** | O(n) | O(k) | Optimize size with condition |
| **Fixed Window** | O(n) | O(1) | Fixed size calculations |
| **Prefix Sum + Hash** | O(n) | O(n) | Subarray sum equals target |
| **Kadane's** | O(n) | O(1) | Max subarray sum |
| **Divide & Conquer** | O(n log n) | O(log n) | Max subarray (alternative) |

---

### Decision Tree

```
Subarray problem?
├── Yes → Size fixed?
│   ├── Yes → FIXED WINDOW
│   └── No → Need to optimize size?
│       ├── Yes → VARIABLE WINDOW
│       └── No → Sum-related?
│           ├── Yes → PREFIX SUM
│           └── No → Other pattern
└── No → Different pattern
```

---

### Key Trade-offs

| Consideration | Variable Window Wins | Fixed Window Wins |
|-------------|---------------------|-------------------|
| Unknown optimal size | ✓ | - |
| Processing every window | - | ✓ |
| Complex conditions | ✓ | - |
| Simple implementation | - | ✓ |

<!-- back -->
