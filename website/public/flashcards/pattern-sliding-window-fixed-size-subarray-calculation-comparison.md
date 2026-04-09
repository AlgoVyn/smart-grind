## Sliding Window - Fixed Size: Comparison

When should you use different approaches for fixed-size sliding window problems?

<!-- front -->

---

### Sliding Window vs Prefix Sum

| Aspect | Sliding Window | Prefix Sum |
|--------|----------------|------------|
| **Time (single query)** | O(n) | O(n) to build, O(1) to query |
| **Time (multiple queries)** | O(n) per pass | O(n) build once, O(1) each query |
| **Space** | O(1) | O(n) for prefix array |
| **Fixed window size** | ✅ Natural fit | Works but overkill |
| **Variable window sizes** | ❌ Needs recompute | ✅ O(1) per query |
| **Streaming data** | ✅ Works | ❌ Needs full array first |
| **Code simplicity** | ✅ Simple loop | Two-phase (build + query) |

**Rule of thumb:** Use sliding window for fixed k; prefix sum for multiple arbitrary ranges.

---

### Basic Sum vs Monotonic Deque

| Feature | Sum/Average | Max/Min Element |
|---------|-------------|-----------------|
| **Calculation** | Incremental add/subtract | Need to track all candidates |
| **Data structure** | Single variable | Monotonic deque |
| **Update cost** | O(1) | O(1) amortized |
| **Space** | O(1) | O(k) |
| **Example** | Max sum subarray | Sliding window maximum |

**Key difference:** Sum is additive; max/min requires comparing all elements in window.

---

### Iterative Sliding vs Single-Pass Streaming

| Aspect | Two-phase (init + slide) | Single-pass streaming |
|--------|--------------------------|----------------------|
| **Code structure** | Initialize first k, then loop | One unified loop |
| **Initial window** | `sum(arr[:k])` | Build gradually |
| **Loop start** | `range(k, n)` | `range(n)` |
| **When to remove** | `arr[i-k]` | `arr[i-k+1]` when `i >= k-1` |
| **Best for** | Random access arrays | Streaming/chunked data |
| **Clarity** | ✅ Very clear | Slightly more complex |

**Winner:** Two-phase for most cases; streaming for real-time processing.

---

### Decision Matrix: Which Approach?

```
What do you need to calculate?
├── Sum or average of each window
│   └── Use: Basic sliding window O(n) time, O(1) space
│
├── Maximum or minimum element in each window
│   └── Use: Monotonic deque O(n) time, O(k) space
│
├── Arbitrary range queries (different sizes)
│   └── Use: Prefix sum O(n) build, O(1) per query
│
└── Multiple different calculations on same array
    └── Use: Sliding window with multiple accumulators
        OR: Prefix sum for range-based calculations
```

---

### Complexity Comparison Table

| Approach | Preprocess | Per Window | Total Time | Space | Best For |
|----------|------------|------------|------------|-------|----------|
| **Brute Force** | - | O(k) | O(n × k) | O(1) | Never use |
| **Sliding Window** | O(k) | O(1) | O(n) | O(1) | Fixed k, sum/avg |
| **Prefix Sum** | O(n) | O(1) | O(n) | O(n) | Multiple queries |
| **Monotonic Deque** | O(1) | O(1)* | O(n) | O(k) | Max/min in window |

*Amortized O(1) - each element pushed/popped once

---

### Common Pitfalls Comparison

| Pitfall | Sliding Window | Prefix Sum | Monotonic Deque |
|---------|----------------|------------|-----------------|
| Off-by-one errors | ⚠️ Loop bounds | ⚠️ Index mapping | ⚠️ Window boundaries |
| Integer overflow | ⚠️ Use long long | Same | Less common |
| Empty array | ✅ Easy check | ✅ Easy check | ✅ Easy check |
| k > n | ⚠️ Must check | ⚠️ Must check | ⚠️ Must check |
| Negative numbers | ✅ Works fine | ✅ Works fine | ✅ Works fine |
| Space efficiency | ✅ Best | O(n) overhead | O(k) overhead |

<!-- back -->
