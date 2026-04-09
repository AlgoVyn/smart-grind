## Sliding Window Variable Size: Core Concepts

What are the fundamental concepts behind condition-based variable-size sliding windows?

<!-- front -->

---

### Core Concept

The **Variable Size Sliding Window** dynamically adjusts both boundaries based on a condition rather than fixed size. The window expands to explore possibilities and contracts to optimize or restore validity.

**Key Insight**: If window `[l, r]` satisfies a condition, all larger windows starting at `l` may also satisfy it (monotonicity property).

---

### Two-Pointer Mechanics

```
Array: [2, 3, 1, 2, 4, 3], target sum >= 7

Step 1: Expand right until condition met
  [2] sum=2       → expand
  [2,3] sum=5     → expand  
  [2,3,1] sum=6   → expand
  [2,3,1,2] sum=9 ≥ 7 → condition met!

Step 2: Contract left while condition holds
  [2,3,1,2] sum=9 ≥ 7 → record length 4, shrink
  [3,1,2] sum=6 < 7   → stop shrinking

Step 3: Repeat until end
  [3,1,2,4] sum=10 ≥ 7 → record, shrink
  [1,2,4] sum=7 ≥ 7    → record length 3, shrink
  [2,4] sum=6 < 7      → expand
  [2,4,3] sum=9 ≥ 7    → record, shrink
  [4,3] sum=7 ≥ 7      → best! length 2
```

---

### State Maintenance Principle

**Critical Rule**: Never recompute state from scratch - update incrementally.

| Operation | Action | Time |
|-----------|--------|------|
| Expand right | Add element to state | O(1) |
| Contract left | Remove element from state | O(1) |
| Check condition | Use maintained state | O(1) |
| Recompute sum | ❌ Forbidden | O(n) ❌ |

---

### Key Observations

1. **Monotonicity**: Expanding increases sum (for positives), contracting decreases it
2. **Optimal Substructure**: Valid windows contain valid sub-windows
3. **Greedy Shrinking**: Always shrink as much as possible when optimizing
4. **At Most 2n Operations**: Each element enters and exits window once

---

### When to Use Variable vs Fixed Window

| Scenario | Pattern | Reason |
|----------|---------|--------|
| "Find smallest subarray with sum ≥ K" | Variable | Size depends on values |
| "Find average of all size-K subarrays" | Fixed | Size is predetermined |
| "Longest substring with ≤ K distinct" | Variable | Constraint on content, not size |
| "Maximum sum of any K consecutive" | Fixed | Fixed size requirement |

<!-- back -->
