## Binary Search on Answer: Comparison

How does binary search on answer compare to other approaches?

<!-- front -->

---

### Approach Comparison

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| **Binary Search on Answer** | O(n log S) | O(1) | Monotonic condition, need optimal value |
| **Greedy** | O(n) | O(1) | Only if problem has optimal substructure |
| **Dynamic Programming** | O(n²) to O(n³) | O(n²) | Non-monotonic, need exact optimization |
| **Brute Force** | O(n! or exponential) | O(n) | Small inputs only |
| **Linear Search** | O(n × S) | O(1) | Small search space S |

**Key:** S = range of possible answers (search space)

---

### Binary Search on Answer vs Linear Search

```
Scenario: Find minimum capacity for 1000 packages, sum = 1,000,000

Linear Search:
  for cap in range(max_weight, sum_weights + 1):
      if can_ship(cap, D):  # O(n) check
          return cap
  # Worst case: 1,000,000 iterations × O(1000) = 10^9 operations

Binary Search on Answer:
  while low < high:  # log2(1,000,000) ≈ 20 iterations
      mid = (low + high) // 2
      if can_ship(mid, D):  # O(n) check
          high = mid
      else:
          low = mid + 1
  # Total: 20 iterations × O(1000) = 20,000 operations

Speedup: 50,000x faster!
```

---

### Binary Search on Answer vs Dynamic Programming

| Factor | Binary Search on Answer | Dynamic Programming |
|--------|------------------------|-------------------|
| **Condition** | Must be monotonic | No monotonicity requirement |
| **Time** | O(n log S) | O(n²) or O(n × target) |
| **Space** | O(1) | O(n²) or O(target) |
| **Use case** | Optimization with feasibility check | Exact optimization, counting |
| **Example** | Split Array Largest Sum | Partition Equal Subset Sum |

**When to choose DP:**
- Need to count number of ways (not just find optimal)
- Condition is not monotonic
- Need to reconstruct exact solution with constraints

---

### When NOT to Use Binary Search on Answer

```
Don't use when:

1. Condition is NOT monotonic:
   [True, False, True, True, False]  ← No clear boundary!
   
2. Feasibility check is very expensive:
   - Check requires O(n²) or worse
   - Total: O(n² log S) might be worse than O(n²) DP
   
3. Problem requires finding ALL solutions:
   - Binary search finds ONE optimal value
   - Need enumeration, not optimization
   
4. Search space is small:
   - If S < 1000, linear scan might be simpler
   
5. Problem has discrete, non-ordered answer space:
   - Binary search requires ordered, comparable values
```

---

### Trade-off Analysis

| Factor | Binary Search Advantage | Limitation |
|--------|------------------------|------------|
| **Time** | Logarithmic search | Requires O(n) check per iteration |
| **Space** | O(1) extra space | None |
| **Simplicity** | Clean template | Designing condition function can be tricky |
| **Generality** | Works for many optimization problems | Requires monotonicity |
| **Precision** | Exact integer answers | Floating point needs epsilon handling |

---

### Algorithm Selection Guide

```
Is the answer monotonic (feasible/infeasible boundary exists)?
    ↓
    NO → Consider DP or other approaches
    ↓
    YES
    ↓
Can you check feasibility efficiently (O(n) or better)?
    ↓
    NO → Consider optimizing check or use different approach
    ↓
    YES
    ↓
Is search space large (S > 1000)?
    ↓
    YES → Use Binary Search on Answer ✓
    ↓
    NO → Linear scan might be simpler
```

<!-- back -->
