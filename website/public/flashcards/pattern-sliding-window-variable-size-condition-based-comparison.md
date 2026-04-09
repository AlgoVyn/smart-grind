## Sliding Window Variable Size: Comparison

When should you use variable-size sliding window versus other approaches?

<!-- front -->

---

### Variable Window vs Fixed Window

| Aspect | Variable Size | Fixed Size |
|--------|---------------|------------|
| **Window size** | Dynamic, adjusts to condition | Constant, predetermined |
| **Movement** | Both pointers move freely | Right moves, left follows at fixed distance |
| **Use case** | "Find optimal size satisfying constraint" | "Calculate something for every k elements" |
| **Examples** | Min subarray sum ≥ K, longest K distinct | Average of subarrays of size K, max sum of size K |
| **Complexity** | O(n) time, O(k) space | O(n) time, O(1) space |

**Decision**: Is the size given in the problem? → Fixed. Is size what we're finding? → Variable.

---

### Sliding Window vs Prefix Sum + Hash

| Scenario | Sliding Window | Prefix Sum + Hash |
|----------|----------------|-------------------|
| **Array contents** | Positive numbers only | Any (including negatives) |
| **Target condition** | Sum ≥, ≤ target | Sum = target exactly |
| **Optimization** | Min/max window size | Count subarrays |
| **State tracking** | Current window state | Historical prefix sums |
| **Space** | O(1) or O(k) | O(n) |

**Example**: 
- Sum ≥ 7 with positives → Sliding window
- Sum = 7 with negatives → Prefix sum

---

### Comparison with Other Subarray Patterns

| Pattern | Time | Space | Best For | Key Feature |
|---------|------|-------|----------|-------------|
| **Variable Window** | O(n) | O(k) | Optimal size for constraint | Dynamic boundaries |
| **Fixed Window** | O(n) | O(1) | Fixed-size calculations | Constant window |
| **Kadane's** | O(n) | O(1) | Max/min subarray sum | Greedy/DP hybrid |
| **Prefix Sum + Hash** | O(n) | O(n) | Exact sum with negatives | Historical tracking |
| **Divide & Conquer** | O(n log n) | O(log n) | Alternative max subarray | Recursive splitting |
| **Brute Force** | O(n²) | O(1) | Never use | Check all subarrays |

---

### Decision Tree

```
Subarray/substring problem?
├── Constraint on SIZE? (find min/max length)
│   └── YES → Constraint involves CONTENT?
│       ├── YES (e.g., "longest with K distinct")
│       │   └── VARIABLE SIZE SLIDING WINDOW
│       └── NO (e.g., "sum of every 3 elements")
│           └── FIXED SIZE SLIDING WINDOW
├── Need EXACT sum?
│   ├── YES → Negative numbers present?
│   │   ├── YES → PREFIX SUM + HASH
│   │   └── NO → SLIDING WINDOW or PREFIX SUM
│   └── NO → Optimization problem?
│       └── YES → KADANE'S (max/min sum)
└── Constraint on CHARACTERISTICS?
    └── YES → VARIABLE SIZE SLIDING WINDOW
```

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|----- |
| Longest substring with K distinct | Variable Window | Size depends on character distribution |
| Maximum sum subarray | Kadane's | O(n) with simpler logic |
| Subarray sum equals K (negatives) | Prefix Sum + Hash | Handles negative numbers |
| Minimum size with sum ≥ K | Variable Window | Shrinks when condition met |
| Count subarrays with sum K | Prefix Sum + Hash | O(n) counting with hashmap |
| Fixed-size max average | Fixed Window | Size is predetermined |

---

### When Variable Window Fails

| Scenario | Problem | Solution |
|----------|---------|----------|
| Negative numbers | Sum constraint breaks monotonicity | Use prefix sums |
| Non-contiguous required | Window must be contiguous | Use DP or other pattern |
| Multiple independent constraints | Single window insufficient | Use multiple passes or DP |
| Circular array | Wrap-around edges | Duplicate array or special handling |

<!-- back -->
