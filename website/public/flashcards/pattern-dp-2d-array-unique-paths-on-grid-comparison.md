## DP - 2D Array (Unique Paths on Grid): Comparison

When should you use different approaches?

<!-- front -->

---

### 2D DP vs Space Optimized vs Combinatorics

| Aspect | 2D DP | Space Optimized | Combinatorics |
|--------|-------|-----------------|---------------|
| **Space** | O(m×n) | O(min(m,n)) | O(1) |
| **Time** | O(m×n) | O(m×n) | O(min(m,n)) |
| **Obstacles** | ✓ Handles any pattern | ✓ Handles any pattern | ✗ Cannot use |
| **Path reconstruction** | Easy | Hard | Impossible |
| **Learning** | Best visualization | Good practice | Math insight |

**Winner**: 
- Combinatorics for large obstacle-free grids
- Space optimized for production with obstacles
- 2D for learning and interview clarity

---

### Path Counting vs Path Sum Problems

| Feature | Unique Paths | Minimum Path Sum |
|---------|--------------|------------------|
| **Recurrence** | `dp[i][j] = top + left` | `dp[i][j] = min(top, left) + weight` |
| **Operation** | Addition | Min/Max + Addition |
| **Base case** | All 1s | `grid[0][0]` |
| **First row/col** | All 1s | Cumulative sum |
| **Obstacles** | Set to 0 | Cannot apply directly |

**Key difference**: 
- Path counting aggregates (sum) the number of ways
- Path optimization chooses (min/max) the best way

---

### When to Use Each Approach

**2D DP (Full Grid)**
- Learning the algorithm
- Need to reconstruct the actual path
- Multiple queries on same grid
- Interview clarity is important

**Space Optimized (1D Array)**
- Large grids (m or n > 1000)
- Memory constrained environments
- Only need final answer, not path
- Production code

**Combinatorics**
- Very large grids without obstacles
- Need O(1) space and O(min(m,n)) time
- Just need count, not actual paths
- Can handle modulo with modular inverse

**In-Place (Modify Input)**
- O(1) extra space strictly required
- Input can be modified
- Trade-off: destroys original data

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|----- |
| Large grid, no obstacles | Combinatorics | O(min(m,n)) time, O(1) space |
| Grid with obstacles | Space Optimized DP | Memory efficient, handles obstacles |
| Need path reconstruction | 2D DP | Easy backtracking |
| Interview setting | 2D DP first, then optimize | Shows understanding |
| Production, memory critical | Space Optimized | Best practical choice |

---

### BFS/DFS vs DP

| Approach | Time | Space | Use Case |
|----------|------|-------|----------|
| **DP (Bottom-up)** | O(m×n) | O(m×n) or O(n) | Path counting, optimization |
| **BFS** | O(m×n) | O(m×n) | Shortest path (unweighted), level-order |
| **DFS** | O(2^(m+n)) | O(m+n) stack | Path existence, all paths enumeration |

**Choose DP when**: Counting paths or finding optimal sum (weighted).
**Choose BFS when**: Finding shortest path in unweighted grid.
**Choose DFS when**: Enumerating all paths or checking reachability.

<!-- back -->
