## Greedy - Jump Game Reachability/Minimization: Core Concepts

What are the fundamental concepts and greedy intuition behind Jump Game problems?

<!-- front -->

---

### Fundamental Definition

**Problem:** Given an array where `nums[i]` = max jump length from position `i`, determine:
- **Reachability:** Can we reach the last index from start?
- **Minimization:** What is the minimum number of jumps to reach the end?

| Variant | Output | Key Insight |
|---------|--------|-------------|
| **Jump Game I** | Boolean | Track farthest reachable |
| **Jump Game II** | Integer | Track jump boundaries |

---

### Core Intuition: Farthest Reach

```
Position:  0    1    2    3    4    5
nums:     [2,   3,   1,   1,   4,   0]
           ↓    ↓    ↓    ↓    ↓
Can reach: 0→2  1→4  2→3  3→4  4→8

Farthest from each position: max(i + nums[i])

At i=0: farthest = max(0, 0+2) = 2
At i=1: farthest = max(2, 1+3) = 4
At i=4: farthest = max(4, 4+4) = 8 >= n-1 ✓
```

**Key insight:** Always greedily extend the farthest reachable position.

---

### Critical Concept: Jump Boundaries

```
For minimum jumps, track two ranges:

Current jump range:  [0, current_end]
Next jump range:     [current_end+1, farthest]

When we reach current_end:
  - We must make another jump
  - New range extends to farthest
  - This is optimal (greedy choice)

Example: nums = [2,3,1,1,4]

i=0: farthest = 2, range [0,2] → jump 1
i=2: farthest = 4, range [2,4] → jump 2 (reach end)
```

---

### Why Greedy is Optimal

**Proof sketch for Jump Game II:**

1. At each boundary, we've explored ALL positions reachable within current jumps
2. The farthest point from any position in current range becomes next boundary
3. No other choice can do better - any valid path must pass through this boundary
4. Therefore, greedy extension yields minimum jumps

**Why not DP?** Greedy achieves O(n) vs O(n²) for DP.

---

### Complexity Analysis

| Approach | Time | Space | Use Case |
|----------|------|-------|----------|
| **Greedy** | O(n) | O(1) | ✅ Always preferred |
| **DP (reachability)** | O(n²) | O(n) | For understanding only |
| **BFS** | O(n²) | O(n) | Path reconstruction |

<!-- back -->
