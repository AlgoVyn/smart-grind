## Binary Search: Core Concepts

What is binary search, when is it applicable, and how does it achieve O(log n) complexity?

<!-- front -->

---

### Fundamental Definition

Binary search finds a target value in a **sorted array** by repeatedly dividing the search interval in half.

**Key insight:** Compare target to middle element, eliminate half the array each step.

```
Array: [1, 3, 5, 7, 9, 11, 13, 15]
         ↑
       mid = 7

Target = 11 > 7, search right half: [9, 11, 13, 15]
                                          ↑
                                        mid = 11 ✓
```

---

### Applicability Requirements

| Requirement | Description |
|-------------|-------------|
| **Monotonic predicate** | Array must be sorted or predicate monotone |
| **Random access** | O(1) access to any element |
| **Comparable elements** | Can determine <, =, > |

**Monotonic predicate:** If condition is true at i, it's true for all j > i (or vice versa).

---

### Complexity Analysis

| Aspect | Value |
|--------|-------|
| **Time** | O(log n) |
| **Space** | O(1) iterative, O(log n) recursive |
| **Comparisons** | At most ⌈log₂(n+1)⌉ |

**Why log n?** Each iteration halves the search space: n → n/2 → n/4 → ... → 1

---

### When to Use

| ✅ Use Binary Search | ❌ Don't Use |
|---------------------|--------------|
| Sorted array search | Unsorted data (use hash map) |
| Finding boundary in monotonic function | Need all occurrences (linear scan) |
| Optimization problems | Real-time streaming data |
| Finding square root, min/max satisfying condition | Very small arrays |

---

### Common Pitfalls

| Mistake | Consequence | Fix |
|---------|-------------|-----|
| **Integer overflow** | Infinite loop | Use `mid = left + (right - left) // 2` |
| **Boundary errors** | Off-by-one | Test with arrays of size 0, 1, 2 |
| **Strict vs loose** | Wrong result | Use `<` vs `<=` consistently |
| **Not checking mid** | Miss target | Always check a[mid] |
| **Infinite loop** | Hangs | Ensure left strictly increases or right decreases |

<!-- back -->
