## Sliding Window - Fixed Size: Core Concepts

What are the fundamental principles of the fixed-size sliding window pattern?

<!-- front -->

---

### Core Concept

Use **two pointers maintaining a constant distance apart** to efficiently calculate values for every subarray of size k.

**Key insight**: Compute initial window, then slide one element at a time, removing the leftmost and adding the new right element.

---

### The Pattern

```
Find max sum of subarray of size k=3:

Array: [2, 1, 5, 1, 3, 2], k = 3

Initial window: [2, 1, 5] sum = 8

Slide:
Remove 2, add 1: [1, 5, 1] sum = 8 - 2 + 1 = 7
Remove 1, add 3: [5, 1, 3] sum = 7 - 1 + 3 = 9  ← Max
Remove 5, add 2: [1, 3, 2] sum = 9 - 5 + 2 = 6

Result: 9
```

**Why efficient**: O(1) update per slide instead of O(k) recalculation

---

### Common Applications

| Problem Type | Calculation | Example |
|--------------|-------------|---------|
| Maximum Average | Sum / k | Maximum Average Subarray |
| Maximum Sum | Running sum | Maximum Sum of k Elements |
| Contains Pattern | Hash comparison | Find Anagrams |
| Moving Average | Average per window | Data smoothing |
| Fixed Substring | Character frequency | Find All Anagrams |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(n) | Single pass, O(1) per slide |
| Space | O(1) or O(k) | Depends on tracking needs |
| Naive comparison | O(n × k) | Recalculate each window |

<!-- back -->
