## DP - Longest Increasing Subsequence (LIS): Comparison

When should you use LIS versus other approaches?

<!-- front -->

---

### LIS: O(n²) vs O(n log n)

| Aspect | DP O(n²) | Binary Search O(n log n) |
|--------|----------|--------------------------|
| **Time** | O(n²) | O(n log n) |
| **Space** | O(n) | O(n) |
| **Reconstruction** | Easy with parent pointers | Harder, need extra tracking |
| **Code complexity** | Simple | Moderate |
| **When to use** | n ≤ 10⁴, need path | n ≤ 10⁵, only need length |
| **Intuition** | Compare with all previous | Patience sorting piles |

**Rule of thumb**: Use O(n log n) for large inputs, O(n²) for learning/reconstruction.

---

### LIS vs Longest Common Subsequence (LCS)

| Aspect | LIS | LCS |
|--------|-----|-----|
| **Input** | Single array | Two sequences/strings |
| **Pattern** | One-dimensional DP | Two-dimensional DP |
| **Time** | O(n²) or O(n log n) | O(m × n) |
| **Space** | O(n) | O(m × n) or O(min(m,n)) |
| **Relation** | LCS(nums, sorted(nums)) | General case |

**Connection**: LIS can be reduced to LCS with the sorted array (but that's O(n²) anyway).

---

### Subsequence vs Substring vs Subarray

| Pattern | Contiguous? | Order Preserved? | Example |
|---------|-------------|------------------|---------|
| **Subarray** | Yes | Yes | `[2, 3]` in `[1, 2, 3, 4]` |
| **Substring** | Yes | Yes | Same as subarray (string context) |
| **Subsequence** | No | Yes | `[1, 3, 4]` in `[1, 2, 3, 4]` |
| **Subset** | No | No | Any elements, any order |

**LIS is a subsequence** - elements need not be adjacent but must preserve order.

---

### When to Use Each Approach

**Use LIS when**:
- Need longest strictly/non-strictly increasing sequence
- Order must be preserved from original array
- Elements can be skipped (non-contiguous)
- Problem mentions "increasing order" or "sorted subsequence"

**Use Kadane's when**:
- Need maximum sum subarray (contiguous)
- Problem is about sum, not length

**Use Sliding Window when**:
- Contiguous elements required
- Window has specific constraints (size, sum, distinct count)

**Use LCS when**:
- Two sequences involved
- Finding similarity between two strings

---

### Decision Tree

```
Need longest increasing sequence?
├── Single array?
│   ├── Contiguous required?
│   │   ├── Yes → Array problem (sliding window/Kadane's)
│   │   └── No → LIS!
│   │       ├── Only need length + n > 10⁴?
│   │       │   ├── Yes → O(n log n) binary search
│   │       │   └── No → O(n²) DP (or O(n log n))
│   │       └── Need actual subsequence?
│   │           ├── Yes → O(n²) DP with parent tracking
│   │           └── No → Either approach
│   └── Two arrays?
│       └── LCS problem
└── Additional constraints?
    ├── 2D (envelopes) → Sort + LIS
    ├── Count of LIS → DP with count tracking
    └── Divisible subset → Sort + modified LIS
```

---

### Complexity Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|-----|
| n ≤ 1000 | O(n²) DP | Simple, easy reconstruction |
| n ≤ 10⁵, length only | O(n log n) | Avoids TLE |
| Need actual sequence | O(n²) DP | Parent tracking is cleaner |
| Very large values | Coordinate compression + O(n log n) | Reduce value range |
| Real-time/streaming | Patience sorting variant | Process elements online |

<!-- back -->
