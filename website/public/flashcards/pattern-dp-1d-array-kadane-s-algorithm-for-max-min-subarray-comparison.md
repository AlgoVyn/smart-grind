## DP - 1D Array (Kadane's Algorithm): Comparison

When should you use Kadane's algorithm versus other approaches?

<!-- front -->

---

### Kadane's vs Divide & Conquer

| Aspect | Kadane's | Divide & Conquer |
|--------|----------|------------------|
| **Time** | O(n) | O(n log n) |
| **Space** | O(1) | O(log n) stack |
| **Code** | Simple, iterative | Complex, recursive |
| **Intuition** | Greedy/DP | Recursive splitting |
| **Practical use** | Always preferred | Academic/parallel processing |

**Winner:** Kadane's for all production use cases.

---

### Kadane's vs Prefix Sum + Hash

| Aspect | Kadane's | Prefix Sum + Hash |
|--------|----------|-------------------|
| **Problem** | Max/min sum subarray | Subarray sum equals K |
| **Constraint** | Must find max/min | Must find exact target |
| **Can handle** | Contiguous optimization | Any subarray meeting criteria |
| **Negative nums** | Yes | Yes |
| **Time** | O(n) | O(n) |
| **Space** | O(1) | O(n) |

**Use Kadane's for:** Optimization problems (max/min)
**Use Prefix Sum for:** Target-specific problems (equals k)

---

### Kadane's vs Sliding Window

| Aspect | Kadane's | Sliding Window |
|--------|----------|----------------|
| **Size constraint** | None | Fixed or bounded |
| **Optimization** | Sum | Various constraints |
| **Example** | Max sum any length | Max sum of exactly k elements |
| **Expansion rule** | Extend or restart | Grow/shrink based on condition |

**Use Kadane's for:** Variable-length optimization
**Use Sliding Window for:** Fixed-size or constraint-based windows

---

### Complete Subarray Problem Decision Tree

```
Subarray problem?
│
├── Must be contiguous?
│   ├── NO → Subsequence DP (LIS, etc.)
│   └── YES → Continue...
│
├── Optimization problem?
│   ├── YES (max/min sum)
│   │   └── KADANE'S ALGORITHM
│   │       ├── Can wrap around? → Circular Kadane's
│   │       ├── Product instead of sum? → Track max+min
│   │       └── 2D array? → Compress + Kadane's
│   │
│   └── NO → Continue...
│
├── Exact target sum?
│   ├── YES → PREFIX SUM + HASH MAP
│   └── NO → Continue...
│
├── Fixed length constraint?
│   ├── YES → SLIDING WINDOW (fixed size)
│   └── NO → Continue...
│
└── Variable constraint?
    └── YES → SLIDING WINDOW (variable size)
```

---

### Pattern Comparison Table

| Pattern | Time | Space | Best For | Example |
|---------|------|-------|----------|---------|
| **Kadane's** | O(n) | O(1) | Max/min contiguous sum | LeetCode 53 |
| **Circular Kadane's** | O(n) | O(1) | Wrap-around arrays | LeetCode 918 |
| **Kadane's Product** | O(n) | O(1) | Max product | LeetCode 152 |
| **Prefix Sum + Hash** | O(n) | O(n) | Sum equals k | LeetCode 560 |
| **Sliding Window Fixed** | O(n) | O(1) | Exactly k elements | - |
| **Sliding Window Variable** | O(n) | O(1) | Condition-based | LeetCode 3 |
| **Divide & Conquer** | O(n log n) | O(log n) | Alternative approach | - |
| **Brute Force** | O(n²) | O(1) | Never use | - |

---

### Real Problem Mapping

| Problem | Best Approach | Why |
|---------|---------------|-----|
| Maximum Subarray | Kadane's | Optimal O(n) |
| Maximum Sum Circular | Kadane's + min subarray | Two cases |
| Maximum Product | Kadane's variant | Track max+min |
| Best Time to Buy Stock | Kadane's on diffs | Same pattern |
| Subarray Sum Equals K | Prefix Sum + Hash | Need exact target |
| Maximum Average Subarray | Sliding Window | Fixed length k |
| Longest Substring w/o Repeating | Sliding Window | Variable constraint |
| Maximum Sum BST in Binary Tree | Kadane's + tree | Combine patterns |

<!-- back -->
