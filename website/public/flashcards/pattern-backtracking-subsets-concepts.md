## Backtracking - Subsets: Core Concepts

What are the fundamental principles of the subsets pattern?

<!-- front -->

---

### Core Concept

**For n elements, there are exactly 2^n subsets (power set). Each element contributes a binary choice: include or exclude.**

The key insight: Model this as a decision tree where each level represents an element, and each branch represents include/exclude.

**Decision tree for [1, 2, 3]:**
```
        Start
       /    \
     Excl1  Incl1
     /  \    /  \
   Ex2 In2 Ex2 In2
   | | | | | | | |
   ∅ 2 3 23 1 12 13 123
```

---

### The Pattern

```
For each element, two recursive calls:
1. Exclude: Don't add to subset, move to next element
2. Include: Add to subset, move to next element

When all elements processed:
- Save the current subset to results

This generates all 2^n subsets naturally.
```

---

### Common Applications

| Problem Type | Use Case | Example |
|--------------|----------|---------|
| Power set | All subsets | LeetCode 78 |
| Subsets with duplicates | Skip duplicates | LeetCode 90 |
| Subset sum | Find subset with target sum | Classic NP-complete |
| Partition | Divide into equal subsets | LeetCode 416 |
| Combination sum | Subsets with sum constraint | LeetCode 39 |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(2^n × n) | 2^n subsets, O(n) to copy each |
| Space | O(n) | Recursion stack depth |
| Total subsets | 2^n | Including empty set |

---

### Handling Duplicates

```python
nums.sort()  # Group duplicates: [1, 2, 2, 2, 3]

for i in range(start, len(nums)):
    if i > start and nums[i] == nums[i-1]:
        continue  # Skip duplicates
    # Process nums[i]
```

**Why it works**: By sorting, duplicates are adjacent. `i > start` ensures we only skip duplicates at the same recursion level, not across different branches.

<!-- back -->
