## DP - Longest Common Subsequence: Comparison

When should you use different approaches?

<!-- front -->

---

### 2D DP vs Space Optimized

| Aspect | 2D DP | Space Optimized |
|--------|-------|-----------------|
| **Space** | O(m×n) | O(min(m,n)) |
| **Time** | O(m×n) | O(m×n) |
| **Reconstruction** | Easy | Hard |
| **Use case** | Need string | Just need length |

**Winner**: Space optimized for length only, 2D for reconstruction

---

### When to Use Each

**2D Table:**
- Need to reconstruct LCS
- Learning the algorithm
- Multiple queries on same strings

**Space Optimized:**
- Just need length
- Memory constrained
- Large strings

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|----- |
| Just length | Space optimized | Memory efficient |
| Need LCS string | 2D table | Easy backtracking |
| Very large strings | Space optimized | Fits in memory |
| Learning | 2D table | Visualize algorithm |

<!-- back -->
