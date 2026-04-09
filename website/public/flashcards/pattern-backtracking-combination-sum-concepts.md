## Backtracking - Combination Sum: Core Concepts

What are the fundamental principles of combination sum backtracking?

<!-- front -->

---

### Core Concept

Use **recursive exploration to find all combinations that sum to target**, with each number usable multiple times (unbounded) or once (bounded).

**Key insight**: Systematically try each candidate, recursively explore with reduced target, and backtrack when target becomes negative.

---

### The Pattern

```
Find combinations summing to 7 from [2, 3, 6, 7]

Start: path=[], target=7, index=0

Choose 2: path=[2], target=5, index=0 (can reuse)
  Choose 2: path=[2,2], target=3
    Choose 2: path=[2,2,2], target=1
      Can't choose 2 (would exceed)
      Can't choose 3 (would exceed)
      Backtrack
    Choose 3: path=[2,2,3], target=0 ✓ Found!
      Backtrack
  Choose 3: path=[2,3], target=2
    Can't choose 2 or 3
    Backtrack
  
Choose 3: path=[3], target=4
  Choose 3: path=[3,3], target=1
    Can't complete
    Backtrack
  
Choose 6: path=[6], target=1
  Can't complete
  
Choose 7: path=[7], target=0 ✓ Found!

Result: [[2,2,3], [7]]
```

---

### Common Variations

| Variation | Rule | Example |
|-----------|------|---------|
| **Unbounded** | Reuse same number | Combination Sum I |
| **Bounded** | Use each once | Combination Sum II |
| **Limited k** | Exactly k numbers | Combination Sum III |
| **Target with constraints** | Additional rules | Custom variations |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| **Time** | O(N^(T/M)) | N candidates, T target, M min candidate |
| **Space** | O(T/M) | Recursion depth |
| **Solutions** | Exponential | All valid combinations |

<!-- back -->
