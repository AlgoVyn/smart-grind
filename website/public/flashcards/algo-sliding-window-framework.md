## Title: Sliding Window - Frameworks

What are the structured approaches for solving sliding window problems?

<!-- front -->

---

### Framework 1: Fixed-Size Window Template

```
┌─────────────────────────────────────────────────────┐
│  FIXED-SIZE SLIDING WINDOW FRAMEWORK                 │
├─────────────────────────────────────────────────────┤
│  1. Compute initial window (first k elements)       │
│  2. Process initial state                              │
│  3. Slide from index k to n-1:                       │
│     a. Remove leftmost element (i-k) from state     │
│     b. Add new element (i) to state                   │
│     c. Update result                                 │
│  4. Return final result                              │
└─────────────────────────────────────────────────────┘
```

**When to use:** Window size k is given; need max/min/sum of every window.

---

### Framework 2: Variable-Size Window Template

```
┌─────────────────────────────────────────────────────┐
│  VARIABLE-SIZE SLIDING WINDOW FRAMEWORK               │
├─────────────────────────────────────────────────────┤
│  1. Initialize left = 0, state = empty              │
│  2. Expand right from 0 to n-1:                      │
│     a. Add element at right to state                │
│     b. While state violates condition:              │
│        - Remove element at left from state          │
│        - Increment left                              │
│     c. Update optimal result                           │
│  3. Return optimal result                              │
└─────────────────────────────────────────────────────┘
```

**When to use:** Finding optimal (longest/shortest) subarray meeting a condition.

---

### Framework 3: Monotonic Deque Template

```
┌─────────────────────────────────────────────────────┐
│  MONOTONIC DEQUE FRAMEWORK (for Max/Min)             │
├─────────────────────────────────────────────────────┤
│  1. Initialize empty deque (stores indices)         │
│  2. For each element at index i:                     │
│     a. Remove indices < i-k (out of window)           │
│     b. While deque not empty AND                    │
│        element[deque.back] < element[i]:              │
│        - Pop from back                               │
│     c. Push i to back                                │
│     d. If i >= k-1: result = element[deque.front]   │
│  3. Return results array                               │
└─────────────────────────────────────────────────────┘
```

**When to use:** Need max/min in every window of size k efficiently.

<!-- back -->
