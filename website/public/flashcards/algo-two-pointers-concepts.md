## Title: Two Pointers - Core Concepts

What is the Two Pointers technique?

<!-- front -->

---

### Definition
A method of optimizing search space traversal by maintaining two indices that traverse the data structure simultaneously, often reducing O(n²) to O(n) time complexity.

| Aspect | Details |
|--------|---------|
| **Time** | O(n) typically |
| **Space** | O(1) |
| **Key Idea** | Maintain two pointers that eliminate large portions of search space at each step |

---

### Pointer Movement Patterns

| Pattern | Movement | When to Use | Example |
|---------|----------|-------------|---------|
| **Opposite Ends** | left=0, right=n-1, move toward center | Sorted arrays, finding pairs | Two Sum II, Valid Palindrome |
| **Fast and Slow** | slow moves 1 step, fast moves 2 steps | Linked Lists, cycle detection | Detect Cycle, Find Middle |
| **Same Direction** | Both start at 0, reader moves ahead | Array modification, filtering | Remove Duplicates, Move Zeroes |
| **Two Iterables** | p1 on array1, p2 on array2 | Merging sorted arrays | Merge Sorted Arrays |

---

### Monotonicity Property

Many two-pointer problems leverage sorted data:

```
If array is sorted: arr[i] ≤ arr[i+1] for all i
→ Moving left pointer increases value
→ Moving right pointer decreases value
```

This property allows decisions about which pointer to move based on comparisons.

---

### Invariants and Conditions

Common conditions that must be maintained:

- **Sum Constraint:** `arr[left] + arr[right] == target`
- **Window Size:** `right - left + 1 <= k`
- **Unique Elements:** `arr[left] != arr[right]`
- **Sorted Order:** Array must be sorted for opposite ends pattern

<!-- back -->
