## Array - Merge Sorted In-Place: Core Concepts

What are the fundamental principles for merging from the end?

<!-- front -->

---

### Core Concept

**Merge from the end (where there's empty space) instead of the beginning to avoid overwriting elements that haven't been processed yet.**

**Why from the end works:**
```
nums1 = [1, 2, 3, 0, 0, 0]  m=3
nums2 = [2, 5, 6]           n=3

If we merge from start:
- Compare 1 and 2, put 1 at position 0 ✓
- Compare 2 and 2, put 2 at position 1 ✓
- But wait, nums1[1] was 2, we need it!

From end:
- Compare 3 and 6, put 6 at position 5 (empty) ✓
- Compare 3 and 5, put 5 at position 4 (empty) ✓
- Continue safely...
```

---

### The Pattern

```
Merge sort merge step:
- Standard: Need O(m+n) extra space
- In-place: Start from end, work backwards

Three pointers:
- i: largest unmerged in nums1
- j: largest unmerged in nums2
- k: next position to fill

Always place the larger of nums1[i] and nums2[j]
```

---

### Common Applications

| Problem Type | Use Case | Example |
|--------------|----------|---------|
| Merge step | Merge sort | Standard algorithm |
| In-place merge | No extra space | This pattern |
| Sorted arrays | Combine results | Database operations |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(m + n) | Single pass |
| Space | O(1) | In-place |
| Standard merge | O(m+n) time, O(m+n) space | Uses extra array |

<!-- back -->
