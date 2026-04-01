## Title: Sliding Window - Core Concepts

What is the Sliding Window technique and when should it be used?

<!-- front -->

---

### Definition
A technique for performing operations on a specific window (subarray/substring) that slides through a data structure, maintaining O(n) time complexity.

| Without Sliding Window | With Sliding Window |
|------------------------|---------------------|
| O(n × k) for nested loops | O(n) single pass |
| Recompute from scratch | Incremental updates |
| O(k) space for each window | O(1) or O(k) space |

---

### Window State

The information needed to answer the problem question:

| State Type | Description | Example |
|------------|-------------|---------|
| **Sum** | Running total of elements | Sum of current window |
| **Frequency Map** | Count of elements | Character counts in substring |
| **Monotonic Deque** | Indices in sorted order | Max/min tracking |
| **Unique Count** | Number of distinct elements | Distinct characters |

### Incremental Update

```
New State = Old State - Outgoing Element + Incoming Element
```

This is the key to achieving O(n) time complexity.

---

### Window Invariants

Conditions that must hold for a valid window:

- **Fixed Size:** `right - left + 1 == k`
- **At Most K Distinct:** `distinct_count <= k`
- **Sum Constraint:** `window_sum >= target`
- **No Repeating:** All characters unique

---

### Two Main Types

| Type | Description | When to Use |
|------|-------------|-------------|
| **Fixed-Size** | Window size k is given | Calculate metric for each window |
| **Variable-Size** | Window expands/contracts | Find optimal subarray meeting condition |

<!-- back -->
