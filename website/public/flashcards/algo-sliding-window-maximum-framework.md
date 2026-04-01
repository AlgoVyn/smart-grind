## Title: Sliding Window Maximum - Frameworks

What are the structured approaches for solving sliding window maximum problems?

<!-- front -->

---

### Framework 1: Maximum with Monotonic Deque

```
┌─────────────────────────────────────────────────────┐
│  SLIDING WINDOW MAXIMUM FRAMEWORK                    │
├─────────────────────────────────────────────────────┤
│  1. Initialize empty deque and result array          │
│  2. For each index i from 0 to n-1:                 │
│     a. Remove indices from front that are            │
│        outside the window (i - k + 1)                │
│     b. Remove indices from back with values          │
│        smaller than nums[i]                          │
│     c. Push current index i to back                  │
│     d. If window is full (i >= k-1):                 │
│        - result.append(nums[deque[0]])               │
│  3. Return result array                              │
└─────────────────────────────────────────────────────┘
```

**When to use:** Finding maximum in each window of size k efficiently.

---

### Framework 2: Minimum with Monotonic Deque

```
┌─────────────────────────────────────────────────────┐
│  SLIDING WINDOW MINIMUM FRAMEWORK                    │
├─────────────────────────────────────────────────────┤
│  1. Initialize empty deque (maintains increasing)    │
│  2. For each index i from 0 to n-1:                   │
│     a. Remove indices from front outside window      │
│     b. Remove indices from back with values          │
│        LARGER than nums[i] (flip comparison)         │
│     c. Push current index i to back                  │
│     d. If window is full:                            │
│        - result.append(nums[deque[0]])                 │
│  3. Return result array                                │
└─────────────────────────────────────────────────────┘
```

**When to use:** Finding minimum in each window of size k efficiently.

---

### Framework 3: Sliding Window with Two Heaps (Median)

```
┌─────────────────────────────────────────────────────┐
│  SLIDING WINDOW MEDIAN FRAMEWORK                     │
├─────────────────────────────────────────────────────┤
│  1. Maintain two heaps: max-heap (lower half)       │
│     and min-heap (upper half)                         │
│  2. Balance heaps so sizes differ by at most 1      │
│  3. For each new element:                            │
│     a. Add to appropriate heap                       │
│     b. Rebalance heaps                               │
│     c. Remove outgoing element (lazy deletion)       │
│  4. Median is top of larger heap or average         │
└─────────────────────────────────────────────────────┘
```

**When to use:** Finding median in each window (requires O(n log k) time).

<!-- back -->
