## Greedy - Sorting Based: Comparison

How does sorting-based greedy compare to other approaches?

<!-- front -->

---

### Approach Comparison Table

| Approach | Time | Space | When to Use | Trade-offs |
|----------|------|-------|-------------|------------|
| **Sort + Two Pointers** | O(n log n) | O(1) or O(n) | Standard approach | General purpose, proven optimal |
| **Counting Sort + Greedy** | O(n + k) | O(k) | Small value range k | Faster when k << n log n |
| **Brute Force** | O(n²) or O(n!) | O(1) | Small n, verification | Too slow for large inputs |
| **Dynamic Programming** | O(n²) or higher | O(n) | When greedy fails | More general but slower |
| **Heap/Priority Queue** | O(n log n) | O(n) | Online/streaming | Works with incremental data |

---

### Greedy vs DP: When Each Applies

```
Sorting-Based Greedy Works:
- Local optimal choice leads to global optimal
- No need to reconsider previous decisions
- Example: Assign Cookies, Boats, Two City Scheduling

DP Required (Greedy Fails):
- Future choices depend on current state
- Need to explore multiple paths
- Example: Knapsack with arbitrary weights
```

| Problem | Greedy Works? | Why? |
|---------|---------------|------|
| Assign Cookies | ✓ Yes | Once sorted, each assignment is independent |
| Boats to Save People | ✓ Yes | Pairing extremes is always optimal |
| Two City Scheduling | ✓ Yes | Sorting by advantage reveals optimal split |
| 0/1 Knapsack | ✗ No | Item combinations matter, not just order |
| Maximum Subarray | ✗ No | Need Kadane's DP approach |

---

### Sorting Algorithms: Which to Choose?

| Algorithm | Time | Space | Stable | When to Use |
|-----------|------|-------|--------|-------------|
| **Timsort (Python)** | O(n log n) | O(n) | Yes | Default, good for real data |
| **Dual-Pivot Quicksort (Java)** | O(n log n) avg | O(log n) | No | Primitives, average case |
| **Collections.sort (Java)** | O(n log n) | O(n) | Yes | Objects, stable needed |
| **std::sort (C++)** | O(n log n) | O(log n) | No | Introsort hybrid |
| **Counting Sort** | O(n + k) | O(k) | Yes | Small integer range |
| **Radix Sort** | O(nk) | O(n + k) | Yes | Large n, fixed digit length |

---

### When Sorting-Based Greedy Fails

| Problem | Why Greedy Fails | Correct Approach |
|---------|------------------|------------------|
| **0/1 Knapsack** | Taking highest value/weight first misses optimal combo | DP O(n×W) |
| **Longest Increasing Subsequence** | Greedy length tracking fails | DP with binary search O(n log n) |
| **Matrix Chain Multiplication** | Order of operations matters | DP O(n³) |
| **Traveling Salesman** | Nearest neighbor gets stuck | DP or approximation |
| **Set Cover** | Greedy is logarithmic approximation | NP-hard, use approximation |

---

### Comparison with Related Patterns

| Pattern | Core Idea | Overlap with Sorting Greedy |
|---------|-----------|------------------------------|
| **Two Pointers** | Pointers from start/end or both from start | Sorting-based uses this after sorting |
| **Sliding Window** | Variable-size subarray optimization | Different use case |
| **Heap (Priority Queue)** | Always access min/max element | Alternative for online problems |
| **Union-Find** | Connected components | Used for different problem types |
| **Binary Search** | Divide search space | Can combine with sorting greedy |

```python
# Example: Hybrid approach
# Binary search on answer + greedy verification
def can_assign_with_limit(arr, limit, k):
    """Binary search with greedy check."""
    arr.sort()
    # Greedy verification within binary search
    # ...
```

<!-- back -->
