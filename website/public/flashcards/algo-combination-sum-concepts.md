## Combination Sum: Core Concepts

What is the combination sum problem and how does it relate to backtracking and DP?

<!-- front -->

---

### Problem Variants

| Variant | Question | Constraint |
|---------|----------|------------|
| **Combination Sum I** | Find all unique combos summing to target | Unlimited use of each number |
| **Combination Sum II** | Find all unique combos | Each number used once |
| **Combination Sum III** | Find all k numbers summing to n | 1-9 used at most once |
| **Combination Sum IV** | Count combinations (order matters) | Unlimited use, count permutations |

---

### Key Distinctions

| Feature | Combination Sum I | Combination Sum II | Coin Change |
|---------|-------------------|-------------------|-------------|
| **Repetition** | Unlimited | Once | Unlimited (I/IV) |
| **Output** | All combinations | All combinations | Count only |
| **Order matters?** | No | No | IV: Yes |
| **Duplicates in input?** | No | Yes (must handle) | Usually no |

---

### Backtracking Fundamentals

```
State space tree:
                    []
           ┌────────┼────────┐
          [2]      [3]      [5]
         / | \      |        |
       [2,2] [2,3] [2,5]  [3,3] ...
       
Pruned by: sum > target
```

**Key decisions:**
- Include current number again (for I/IV)
- Include next number
- Skip current number (for II)

---

### DP vs Backtracking

| Aspect | Backtracking | DP |
|--------|--------------|-----|
| **Goal** | Enumerate all solutions | Count or boolean |
| **Time** | Exponential in worst case | Polynomial |
| **Space** | O(target / min_num) stack | O(target) table |
| **Use when** | Need actual combinations | Just need count |

---

### Complexity Overview

| Variant | Time | Space |
|---------|------|-------|
| **I - Backtracking** | O(2^(target/min)) | O(target/min) recursion |
| **II - Backtracking** | O(2^n) | O(n) recursion |
| **IV - DP** | O(target × n) | O(target) |
| **IV - Optimized** | O(target × n) | Can optimize to O(max_num) |

<!-- back -->
