## Two Pointers - Converging (Sorted Array Target Sum): Core Concepts

What are the fundamental principles of the Converging Two Pointers pattern for target sum problems?

<!-- front -->

---

### Core Concept

Use **two pointers starting at opposite ends** of a **sorted array**, moving toward each other based on how the current sum compares to the target.

**Key insight**: Because the array is sorted, we know:
- Moving `left` right increases the sum
- Moving `right` left decreases the sum
- This creates a systematic way to converge on the target

---

### The Pattern

```
Array: [2, 7, 11, 15], Target: 9

Initial:  left=0 (2) ────────────── right=3 (15)
          sum = 2 + 15 = 17 > 9

Step 1:   left=0 (2) ───────── right=2 (11)
          sum = 2 + 11 = 13 > 9

Step 2:   left=0 (2) ─── right=1 (7)
          sum = 2 + 7 = 9 == target ✓

Result: [1, 2] (1-based indices)
```

---

### Why It Works

| Sorted Property | Pointer Movement | Effect on Sum |
|-----------------|------------------|---------------|
| `arr[i] < arr[i+1]` | `left++` | Sum **increases** |
| `arr[i] > arr[i-1]` | `right--` | Sum **decreases** |

This monotonic property guarantees we never miss the target if it exists.

---

### Common Applications

| Problem Type | Description | Example |
|--------------|-------------|---------|
| Two Sum II | Find one pair in sorted array | LeetCode 167 |
| Find All Pairs | All unique pairs summing to target | Interview variation |
| Closest Sum | Pair with sum closest to target | Variation |
| 3Sum | Fix one, use converging pointers for other two | LeetCode 15 |
| 4Sum | Recursively reduce to 3Sum/2Sum | LeetCode 18 |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| **Time** | O(n) | Single pass through array |
| **Space** | O(1) | No extra storage |
| **Brute Force** | O(n²) | Compare all pairs |
| **Hash Map** | O(n) time, O(n) space | For unsorted arrays |

---

### Requirements

1. **Array must be sorted** - This is mandatory
2. **Need pair/triplet** - Single element problems don't apply
3. **Sum-based condition** - Target sum, closest sum, or zero sum

<!-- back -->
