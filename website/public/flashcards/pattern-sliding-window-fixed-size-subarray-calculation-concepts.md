## Sliding Window - Fixed Size: Core Concepts

What are the fundamental concepts and insights behind fixed-size sliding window?

<!-- front -->

---

### Fundamental Definition

**Problem:** Given an array of size `n` and a fixed window size `k`, efficiently compute a calculation (sum, max, average, etc.) for every contiguous subarray of size `k`.

| Approach | Time | Space | Use Case |
|----------|------|-------|----------|
| **Brute Force** | O(n × k) | O(1) | Recompute each window |
| **Sliding Window** | O(n) | O(1) | Incremental update |
| **Prefix Sum** | O(n) | O(n) | Multiple range queries |
| **Monotonic Queue** | O(n) | O(k) | Max/min in each window |

---

### Key Insight: Window Overlap

```
Array: [2, 1, 5, 1, 3, 2], k = 3

Window 0: [2, 1, 5]  → sum = 8
              ↓↓↓      ↓↓↓
Window 1:    [1, 5, 1] → sum = 7
                 ↓↓↓      ↓↓↓
Window 2:       [5, 1, 3] → sum = 9
                    ↓↓↓      ↓↓↓
Window 3:          [1, 3, 2] → sum = 6

Adjacent windows share k-1 = 2 elements!
Instead of re-summing: new_sum = old_sum - outgoing + incoming
```

**Critical observation:** Windows overlap by `k-1` elements, enabling O(1) update per slide.

---

### The "Aha!" Moments

1. **Why is sliding window O(n)?**
   - Each element enters the window exactly once
   - Each element leaves the window exactly once
   - Total operations: 2n = O(n)

2. **The update formula:**
   ```
   window[i+1] = window[i] - arr[i] + arr[i+k]
   
   Or during iteration at index i:
   window_sum += arr[i] - arr[i-k]
   ```

3. **Why initialize separately?**
   - First window has no "outgoing" element
   - Loop starts at index k, not 0
   - Avoids special case handling inside loop

4. **Negative numbers work fine:**
   - Formula works regardless of sign
   - Just initialize `max_sum` to first window's value

---

### Optimality Proof

```
Theorem: Sliding window achieves O(n) time for fixed-size subarray calculations.

Proof:
1. Let n = array length, k = window size

2. Brute force computes n-k+1 windows, each requiring O(k) work:
   Time = O((n-k+1) × k) = O(n × k)

3. Sliding window observations:
   - Element at index i enters exactly one window (when i >= k-1)
   - Element at index i leaves exactly one window (when i >= 0)
   - Each slide: O(1) update (subtract outgoing, add incoming)

4. Total work:
   - Initialize first window: O(k)
   - Each of (n-k) slides: O(1)
   - Total: O(k) + O(n-k) = O(n)

5. Since we must examine each element at least once, O(n) is optimal.
```

---

### Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| **Basic Sliding Window** | O(n) | O(1) | Single metric (sum, average) |
| **With Result Array** | O(n) | O(n-k+1) | Need all window values |
| **Prefix Sum** | O(n) | O(n) | Multiple arbitrary queries |
| **Monotonic Deque** | O(n) | O(k) | Max/min in each window |

**Space note:** O(1) excludes output array. If returning all results, space is O(n-k+1).

---

### Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| Loop starts at 0 instead of k | Start at index k (first window done) |
| Using `max()` with 0 | Initialize with first window, not 0 |
| Off-by-one in outgoing index | Use `arr[i-k]`, not `arr[i-k-1]` |
| Forgetting k > n check | Always validate: `k <= 0 or k > len(arr)` |
| Integer overflow | Use `long long` / `long` for sums |
| Confusing window count | There are `n-k+1` windows of size k |

<!-- back -->
