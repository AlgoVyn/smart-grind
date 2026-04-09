## DP - Kadane's Algorithm: Comparison

When should you use Kadane's algorithm versus other approaches?

<!-- front -->

---

### Kadane's vs Divide & Conquer

| Aspect | Kadane's | Divide & Conquer |
|--------|----------|------------------|
| **Time** | O(n) | O(n log n) |
| **Space** | O(1) | O(log n) stack |
| **Code** | Simple | Complex |
| **Intuition** | Greedy/DP | Recursive splitting |
| **Use case** | Production | Learning, parallel processing |

**Winner**: Kadane's for all practical purposes

---

### When to Use Each Approach

**Kadane's Algorithm**:
- Maximum/minimum subarray sum
- Single transaction stock profit
- Circular array maximum sum
- Contiguous subarray problems

**Prefix Sum + Hash Map**:
- Subarray sum equals k (any length)
- Subarray with specific sum
- Negative numbers allowed
- Non-contiguous not needed

**Sliding Window**:
- Fixed-size subarray problems
- Window constraints (distinct elements, etc.)
- Average/max of subarrays

**DP with 2D Array**:
- Maximum sum rectangle in 2D
- Multiple constraint subarrays

---

### Comparison with Subarray Patterns

| Pattern | Time | Space | Best For |
|---------|------|-------|----------|
| **Kadane's** | O(n) | O(1) | Max/min contiguous sum |
| **Prefix Sum + Hash** | O(n) | O(n) | Sum equals target |
| **Sliding Window** | O(n) | O(1) | Fixed-size constraints |
| **Divide & Conquer** | O(n log n) | O(log n) | Alternative approach |
| **Brute Force** | O(n²) | O(1) | Never use |

---

### Decision Tree

```
Subarray sum problem?
├── Contiguous elements required?
│   ├── Yes → Optimization problem?
│   │   ├── Yes → KADANE'S
│   │   └── No → Fixed size?
│   │       ├── Yes → SLIDING WINDOW
│   │       └── No → SLIDING WINDOW VARIABLE
│   └── No → Any elements?
│       └── Yes → PREFIX SUM
└── Specific sum target?
    └── Yes → PREFIX SUM + HASH
```

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|----- |
| Max subarray sum | Kadane's | Optimal O(n) time, O(1) space |
| Sum equals k | Prefix Sum + Hash | Finds any subarray, not just max |
| Stock profit (single) | Kadane's | Special case of max subarray |
| Stock profit (multiple) | DP | Multiple transactions |
| All negative numbers | Kadane's | Still works correctly |
| Circular array | Kadane's + min subarray | Two cases to consider |

<!-- back -->
