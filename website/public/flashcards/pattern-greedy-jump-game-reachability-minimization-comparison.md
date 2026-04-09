## Greedy - Jump Game Reachability/Minimization: Comparison

How do Jump Game variants and alternative approaches compare?

<!-- front -->

---

### Jump Game I vs Jump Game II

| Aspect | Jump Game I (Reachability) | Jump Game II (Minimization) |
|--------|---------------------------|----------------------------|
| **Question** | Can we reach the end? | Minimum jumps to reach end? |
| **Output** | Boolean | Integer |
| **Extra state** | Just `farthest` | `jumps` + `current_end` |
| **Loop bound** | `range(n)` | `range(n-1)` |
| **Early exit** | `if farthest >= n-1: return True` | `if current_end >= n-1: break` |
| **Key check** | `if i > farthest: return False` | `if i == current_end: jumps++` |

---

### Approach Comparison: Greedy vs Alternatives

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| **Greedy** | O(n) | O(1) | ✅ Always preferred |
| **DP (Can Reach)** | O(n²) | O(n) | Never - for understanding only |
| **DP (Min Jumps)** | O(n²) | O(n) | Never - greedy is optimal |
| **BFS** | O(n²) | O(n) | Path reconstruction needed |

**Why Greedy wins:** The farthest reachable point at any step is independent of path taken.

---

### Greedy vs BFS Intuition

```
BFS approach:
  Level 0: position 0
  Level 1: positions 1, 2 (from 0 with jump 2)
  Level 2: positions 2, 3, 4 (from positions in level 1)
  ...

Greedy approach:
  Track max reach: [0] → [0,2] → [0,4] → ...
  Same effect but O(1) space vs O(n) space
```

**Trade-off:** BFS can reconstruct path; Greedy cannot (only gives count).

---

### Variant Problems Comparison

| Problem | LeetCode | Key Difference | Approach |
|---------|----------|---------------|----------|
| Jump Game | 55 | Basic reachability | Greedy O(n) |
| Jump Game II | 45 | Minimum jumps | Greedy O(n) |
| Jump Game III | 1306 | Index constraints (±jump) | BFS/DFS |
| Jump Game VII | 1871 | Sliding window constraint | Sliding window + BFS |
| Video Stitching | 1024 | Interval coverage | Greedy (interval) |
| Min Taps to Water Garden | 1326 | Range to point | Greedy (similar to JG II) |

---

### When Each Approach Applies

**Use Greedy when:**
- Only need to know IF reachable
- Need minimum count (not actual path)
- Standard Jump Game constraints

**Use BFS/DP when:**
- Need actual path reconstruction
- Non-standard movement constraints
- Additional state tracking needed

<!-- back -->
