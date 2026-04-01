## Combination Sum: Comparison Guide

How does combination sum compare to similar backtracking and DP problems?

<!-- front -->

---

### Backtracking Problems Comparison

| Problem | Choice | Constraints | Output |
|---------|--------|-------------|--------|
| **Combination Sum** | With replacement | Target sum | All combos |
| **Combination Sum II** | Without replacement | Target sum, no reuse | All combos |
| **Subsets** | Binary (include/exclude) | None | All subsets |
| **Permutations** | Ordering | Use all elements | All orderings |
| **N-Queens** | Position | No attacks | All valid configs |
| **Sudoku** | Number | Valid grid | Single solution |

---

### DP vs Backtracking Decision

```
Need all solutions? 
  ├─ YES → Backtracking (enumerate)
  └─ NO  → Can use DP (count/boolean)

Constraint type:
  ├─ Sum target → Subset sum / knapsack family
  ├─ Count constraint → Add dimension
  └─ Multiple constraints → Multi-dimensional DP or backtrack
```

| Approach | Time | When to Use |
|----------|------|-------------|
| **Backtracking** | O(2^n) worst | Small n, need all solutions |
| **DP (count)** | O(target × n) | Just need count, target not too large |
| **Meet-in-middle** | O(2^(n/2)) | Medium n, target large |
| **Branch and bound** | Better than O(2^n) | Good heuristics available |

---

### Variants Quick Reference

| Variant | Loop Order | Reuse | Duplicates in Input |
|---------|------------|-------|---------------------|
| **I** | i (current) | Yes | No |
| **II** | i+1 | No | Yes (skip i>start) |
| **III** | i+1, count track | No | N/A (1-9) |
| **IV** | DP: amount outer | Yes | N/A |

---

### Coin Change vs Combination Sum

| Aspect | Coin Change | Combination Sum |
|--------|-------------|---------------|
| **Goal** | Minimize or count | Find all valid |
| **Must use all?** | No | No |
| **Output** | Number | List of lists |
| **Technique** | DP (optimization) | Backtracking (enumeration) |
| **Time** | Polynomial | Exponential |

**Connection:** Coin change is the "optimization" version, combination sum is the "enumeration" version.

---

### Template Selection Guide

```python
# Combination I: unlimited, distinct input
def combo_I(): 
    backtrack(i, ...)  # i not i+1

# Combination II: once only, input may have dups
def combo_II():
    sort first
    if i > start and nums[i] == nums[i-1]: continue
    backtrack(i+1, ...)  # i+1 for no reuse

# Combination III: k elements from 1-9
def combo_III():
    track count parameter
    backtrack(i+1, ..., count+1)

# Combination IV: count permutations
def combo_IV():
    DP with amount outer loop
```

<!-- back -->
