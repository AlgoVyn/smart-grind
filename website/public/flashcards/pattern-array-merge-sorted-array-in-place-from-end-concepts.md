## Array - Merge Sorted Array (In-place from End): Core Concepts

What are the fundamental concepts behind merging sorted arrays in-place from the end?

<!-- front -->

---

### The Core Insight

**Merge from the END where there's empty space, not the beginning**

If we merge from the beginning, we'd overwrite unprocessed elements in nums1 before using them. By starting from the end (where empty space exists), we safely place larger elements without data loss.

```
nums1 = [1, 2, 3, 0, 0, 0]  m = 3
nums2 = [2, 5, 6]           n = 3

Merge from beginning? ❌
  Step 1: compare 1 vs 2, put 1 at nums1[0] - already there, wasteful
  Step 2: compare 2 vs 2, put 2 at nums1[1] - OVERWRITES nums1's 2!
  
Merge from end? ✓
  Start: k = 5 (position for largest element)
  Step 1: compare 3 vs 6, put 6 at nums1[5] ✓
  Step 2: compare 3 vs 5, put 5 at nums1[4] ✓
  Step 3: compare 3 vs 2, put 3 at nums1[3] ✓
  Continue with remaining...
```

---

### The "Aha!" Moments

| Moment | Insight | Why It Matters |
|--------|---------|----------------|
| **Start from end** | Empty space is at the end | Safe write position without overwriting |
| **Pick larger element** | Larger elements go to the back | Maintains sorted order when filling backwards |
| **Work backwards** | k decreases each iteration | Fills merged array from largest to smallest |
| **Only copy nums2 remainders** | nums1 elements already in place | Avoids unnecessary work, handles edge cases |
| **Three pointers** | i, j, k each have clear role | Clean separation of concerns |

---

### Visual Walkthrough

```
Initial state:
nums1: [1, 2, 3, 0, 0, 0]   i=2 (points to 3)
nums2: [2, 5, 6]            j=2 (points to 6)
                            k=5 (write position)

Step 1: 3 < 6, place 6 at k=5
nums1: [1, 2, 3, 0, 0, 6]   j=1, k=4

Step 2: 3 < 5, place 5 at k=4
nums1: [1, 2, 3, 0, 5, 6]   j=0, k=3

Step 3: 3 > 2, place 3 at k=3
nums1: [1, 2, 3, 3, 5, 6]   i=1, k=2

Step 4: 2 == 2, place 2 at k=2 (from nums2)
nums1: [1, 2, 2, 3, 5, 6]   j=-1, k=1

j < 0, exit main loop. Remaining nums2? No (j=-1)
Result: [1, 2, 2, 3, 5, 6] ✓
```

---

### Why This Works

**The key invariant:** At each step, nums1[k] is the correct position for the next largest unmerged element.

1. Both input arrays are sorted (given)
2. The largest unmerged element must be at either nums1[i] or nums2[j]
3. Placing the larger one at k maintains sorted order
4. Working backwards ensures we never need to shift elements

---

### When to Apply This Pattern

| Scenario | Example |
|----------|---------|
| In-place merge required | nums1 has extra space at end |
| O(1) extra space constraint | Cannot allocate new array |
| Part of merge sort | The merge step in merge sort |
| Stream processing | Building result at buffer end |
| Two sorted sequences | Arrays, lists, or file chunks |

---

### Time/Space Complexity

| Aspect | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | O(m + n) | Single pass through both arrays |
| **Space** | O(1) | Only pointer variables, no extra data structures |
| **Comparisons** | O(m + n) | One comparison per element in worst case |
| **Assignments** | O(m + n) | Each element written exactly once |

<!-- back -->
