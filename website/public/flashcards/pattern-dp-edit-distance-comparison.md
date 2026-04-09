## DP - Edit Distance: Comparison

When should you use different approaches?

<!-- front -->

---

### 2D DP vs Space Optimized

| Aspect | 2D DP | Space Optimized |
|--------|-------|-----------------|
| **Space** | O(m×n) | O(min(m,n)) |
| **Time** | O(m×n) | Same |
| **Reconstruction** | Easy | Harder |
| **Use case** | Learning/reconstruction | Memory constrained |

**Winner**: Space optimized for production, 2D for learning

---

### When to Use Each

**2D DP:**
- Learning the algorithm
- Need to reconstruct operations
- Multiple queries on same string

**Space Optimized:**
- Large strings
- Memory constrained
- Only need distance value

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|----- |
| Learning | 2D | Visualize table |
| Large strings | Optimized | Memory efficient |
| Reconstruct ops | 2D | Backtracking easier |
| Just distance | Optimized | O(min(m,n)) space |

<!-- back -->
