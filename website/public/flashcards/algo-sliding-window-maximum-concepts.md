## Title: Sliding Window Maximum - Core Concepts

What is the Sliding Window Maximum problem and how is it solved?

<!-- front -->

---

### Definition
Find the maximum value in each sliding window of size k as it moves across an array. The optimal solution uses a monotonic deque for O(n) time complexity.

| Aspect | Details |
|--------|---------|
| **Time** | O(n) - each element processed at most twice |
| **Space** | O(k) - deque holds at most k indices |
| **Key Data Structure** | Monotonic deque |

---

### Monotonic Deque

A deque that maintains elements in sorted order:

| Property | Description |
|----------|-------------|
| **Front** | Always contains the maximum element of current window |
| **Order** | Elements stored in decreasing order of their values |
| **Indices** | Stores indices (not values) to track window boundaries |

### Window Invariant

```
For decreasing deque: nums[deque[0]] >= nums[deque[1]] >= ... >= nums[deque[-1]]
```

This ensures the front always holds the maximum for the current window.

---

### Incremental Update

Instead of scanning the entire window:

1. **Remove outgoing:** Elements that left the window (from front)
2. **Remove smaller:** Elements that can never be maximum (from back)
3. **Add incoming:** New element enters the window (at back)

---

### Amortized Analysis

Each element is:
- Pushed exactly once
- Popped at most once (from front when leaving window)
- Popped at most once (from back when smaller than new element)

Total operations: O(2n) = O(n)

<!-- back -->
