## Array - Cyclic Sort: Core Concepts

What are the fundamental principles of cyclic sort for arrays with elements in a known range?

<!-- front -->

---

### Core Concept

Use **in-place swapping to place each element at its correct index**, iterating until the entire array is sorted in O(n) time with O(1) space.

**Key insight**: When elements are in range [1..n] or [0..n-1], each element has a "correct" index it should be at.

---

### The Pattern

```
Sort [3, 1, 5, 4, 2] (range 1 to 5)

Index: 0   1   2   3   4
Value: 3   1   5   4   2
       ↑
       i=0, val=3 should be at index 2
       Swap with index 2: [5, 1, 3, 4, 2]
       ↑
       i=0, val=5 should be at index 4
       Swap with index 4: [2, 1, 3, 4, 5]
       ↑
       i=0, val=2 should be at index 1
       Swap with index 1: [1, 2, 3, 4, 5]
       ↑
       i=0, val=1 is at correct index, move i

Continue i=1,2,3,4: all elements in place ✓
```

---

### When to Use

| Condition | Example |
|-----------|---------|
| **Range [1..n]** | [1, 2, 3, ..., n] |
| **Range [0..n-1]** | [0, 1, 2, ..., n-1] |
| **Find missing/duplicate** | First Missing Positive |
| **In-place required** | O(1) space constraint |

---

### Common Applications

| Problem Type | Description | Example |
|--------------|-------------|---------|
| **Find Missing** | Find missing number | First Missing Positive |
| **Find Duplicate** | Find duplicate number | Find the Duplicate |
| **Find All Missing** | All disappeared numbers | Find All Numbers Disappeared |
| **Set Mismatch** | Wrong number in set | Set Mismatch |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| **Time** | O(n) | Each element swapped at most once |
| **Space** | O(1) | In-place |
| **Comparisons** | O(n) | Each element checked |

<!-- back -->
