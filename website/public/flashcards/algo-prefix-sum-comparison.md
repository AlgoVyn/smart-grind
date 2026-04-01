## Prefix Sum: Comparison

How do different prefix sum approaches compare?

<!-- front -->

---

### Static vs Dynamic

| Scenario | Data Structure | Query | Update | Precompute |
|----------|---------------|-------|--------|------------|
| Static array | Prefix sum | O(1) | N/A | O(n) |
| Point updates | Fenwick/BIT | O(log n) | O(log n) | O(n) |
| Range updates | Segment tree | O(log n) | O(log n) | O(n) |
| Range add, point query | Diff array | O(1) | O(1) | O(n) |

---

### Query Type Guidelines

| Query Type | Best Structure | Complexity |
|------------|---------------|------------|
| Range sum | Prefix sum | O(1) query |
| Range min/max | Sparse table | O(1) query, O(n log n) build |
| Range sum with updates | Fenwick tree | O(log n) both |
| 2D range sum | 2D prefix | O(1) query, O(n²) build |
| 2D with updates | 2D Fenwick | O(log² n) |

---

### Space vs Time Tradeoffs

| Structure | Space | Build | Query | Notes |
|-----------|-------|-------|-------|-------|
| Prefix sum | O(n) | O(n) | O(1) | Immutable |
| Segment tree | O(4n) | O(n) | O(log n) | Flexible |
| Fenwick tree | O(n) | O(n) | O(log n) | Compact |
| Sparse table | O(n log n) | O(n log n) | O(1) | Static only |
| Sqrt decomposition | O(n) | O(n) | O(√n) | Simple |

---

### When to Use Each

| Problem | Recommended Approach | Why |
|---------|---------------------|-----|
| Static range sum | 1D/2D prefix sum | O(1) query |
| Subarray sum = k | Prefix + hashmap | Linear time |
| Frequent point updates | Fenwick tree | O(log n) updates |
| Frequent range updates | Differential + prefix | O(1) per update |
| Range min with static | Sparse table | O(1) query |

---

### Dimensional Complexity

| Dimension | Precompute | Query | Applications |
|-----------|------------|-------|--------------|
| 1D | O(n) | O(1) | Subarray sums |
| 2D | O(n²) | O(1) | Rectangle sums |
| 3D | O(n³) | O(1) | Cube sums (rare) |

**Note**: Higher dimensions have rapid space growth. Consider alternatives for 3D+.

<!-- back -->
