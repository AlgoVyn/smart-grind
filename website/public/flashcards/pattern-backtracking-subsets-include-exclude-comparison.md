## Backtracking - Subsets Include/Exclude: Comparison

When should you use the include/exclude approach vs alternative methods?

<!-- front -->

---

### Include/Exclude vs For-Loop Backtracking

| Aspect | Include/Exclude | For-Loop Backtracking |
|--------|----------------|----------------------|
| **Structure** | Two explicit branches | Loop through remaining elements |
| **Code size** | Slightly more verbose | More compact |
| **Intuition** | Explicit binary decisions | Choose from remaining pool |
| **Duplicate handling** | Same approach, sort first | Same approach, skip with `i > start` |
| **Best for** | Pure include/exclude logic | Subsets with constraints (size k, sum) |

**Winner**: Both are valid - include/exclude is more explicit about the binary choice nature.

---

### Recursive vs Iterative (Bitmask)

| Aspect | Recursive Include/Exclude | Bitmask Iterative |
|--------|--------------------------|-------------------|
| **Space** | O(n) stack | O(1) auxiliary |
| **Time** | O(2^n × n) | O(2^n × n) |
| **Clarity** | More intuitive | Less intuitive |
| **Max n** | ~25-30 (stack limit) | ~20-25 (time limit) |
| **Debugging** | Easier (trace decisions) | Harder |

**Winner**: Recursive for learning/interviews, bitmask for memory-constrained or very large n.

---

### When to Use Each

**Include/Exclude Recursive:**
- Learning the pattern
- Interviews (more explicit)
- Need to add constraints easily (sum, size)
- Understanding decision trees

**For-Loop Backtracking:**
- Subsets with specific size k
- Combination problems
- When you need to pick from remaining pool

**Bitmask:**
- No recursion stack available
- Very large n but still manageable
- Bit manipulation preferred

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|----- |
| Interview | Include/Exclude | Clear, easy to explain |
| Memory constrained | Bitmask | No stack overhead |
| Size constraints | For-Loop | Natural fit for picking k elements |
| Target sum | Either | Both work with sum tracking |
| Very large n (30+) | Bitmask or DP | Avoid stack overflow |

---

### Comparison: Handling Duplicates

Both approaches handle duplicates the same way:

```python
# Include/Exclude with duplicates
nums.sort()
# ... in include branch, check for duplicates:
# Already handled by structure

# For-Loop with duplicates  
nums.sort()
for i in range(start, len(nums)):
    if i > start and nums[i] == nums[i - 1]:
        continue  # Skip duplicate
```

<!-- back -->
