## Stack - Largest Rectangle in Histogram: Comparison

When should you use different approaches for rectangle/histogram problems?

<!-- front -->

---

### Monotonic Stack vs Two-Pass NSE vs Divide & Conquer

| Aspect | Monotonic Stack | Two-Pass NSE | Divide & Conquer |
|--------|-----------------|--------------|------------------|
| **Code complexity** | Moderate | Higher | Complex |
| **Time** | O(n) | O(n) | O(n log n) or O(n) with RMQ |
| **Space** | O(n) | O(n) | O(log n) recursion stack |
| **Single pass** | Yes | No (3 passes) | No |
| **Input modified** | Optional sentinel | No | No |
| **NSE arrays available** | No | Yes | No |
| **Cache efficiency** | Good | Moderate | Poor |

**Winner:** Monotonic stack for simplicity and performance.

---

### When to Use Each Approach

**Monotonic Stack - Use when:**
- Standard largest rectangle problem
- Want clean, efficient single-pass solution
- Don't need NSE arrays for other purposes
- Interview setting (most expected solution)

**Two-Pass NSE - Use when:**
- Need next smaller element arrays for multiple queries
- Problem asks for boundaries of all maximal rectangles
- Building on top of NSE-related subproblems

**Divide & Conquer - Use when:**
- Stack-based solution restricted
- Have segment tree / RMQ infrastructure available
- Academic interest in alternative algorithms

---

### 1D Histogram vs 2D Matrix Extension

| Aspect | 1D Histogram | 2D Maximal Rectangle |
|--------|------------|---------------------|
| **Input** | Array of heights | Binary matrix |
| **Core algorithm** | Monotonic stack | Histogram per row |
| **Time** | O(n) | O(rows × cols) |
| **Space** | O(n) | O(cols) for heights array |
| **Preprocessing** | None | Build row histograms |
| **Problem examples** | LeetCode 84 | LeetCode 85 |

**Key insight for 2D:** Each row becomes a histogram where height = consecutive 1s above.

```
Matrix:          Row histograms:
1 0 1 1          Row 0: [1, 0, 1, 1]
1 1 1 1    →     Row 1: [2, 1, 2, 2]
0 1 1 0          Row 2: [0, 2, 3, 0]

Apply largest rectangle algorithm to each row's histogram.
```

---

### Key Trade-offs by Situation

| Situation | Best Choice | Why |
|-----------|-------------|-----|
| Interview (standard) | Monotonic stack | Expected optimal solution |
| Interview (explain alternatives) | NSE approach | Shows deeper understanding |
| Multiple queries on same histogram | Precompute NSE arrays | Reuse left/right boundaries |
| Need rectangle coordinates | Modified stack or NSE | Track left/right during calculation |
| Binary matrix problem | Histogram per row + stack | Standard 2D extension |
| Very large n (millions) | Monotonic stack | Best cache performance |

---

### Space Complexity Comparison

**For histogram with n bars:**

| Approach | Space | Components |
|----------|-------|------------|
| Monotonic stack | O(n) | Stack (indices) |
| Two-pass NSE | O(n) | Left array + Right array + Stack |
| Divide & conquer | O(log n) | Recursion stack |

**Note:** All approaches are O(n); stack is most space-efficient in practice.

---

### Comparison with Other Stack Patterns

| Pattern | Stack Type | When to Pop | Problem Types |
|---------|------------|-------------|---------------|
| **Largest Rectangle** | Increasing | Height decreases | Area calculations |
| **Valid Parentheses** | Standard | Matching bracket | Validation |
| **Next Greater Element** | Decreasing | Element found | Finding boundaries |
| **Min Stack** | Auxiliary | On every push | Tracking min/max |
| **Daily Temperatures** | Decreasing | Warmer day found | Waiting times |
| **Trapping Rain Water** | Decreasing | Form container | Water accumulation |

<!-- back -->
