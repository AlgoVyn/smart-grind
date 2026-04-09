## DP - 2D Array (LCS): Comparison

When should you use different LCS approaches?

<!-- front -->

---

### Approach Comparison

| Approach | Space | Time | Use Case |
|----------|-------|------|----------|
| **2D DP** | O(m×n) | O(m×n) | Learning, reconstruction |
| **Space Optimized** | O(min(m,n)) | O(m×n) | Memory constrained |
| **Reconstruction** | O(m×n) | O(m×n) | Need actual LCS string |
| **Shortest Supersequence** | O(m×n) | O(m×n) | Merge two strings |

---

### 2D DP vs Space Optimized

| Aspect | 2D DP | Space Optimized |
|--------|-------|-----------------|
| **Space** | O(m×n) | O(min(m,n)) |
| **Reconstruction** | Easy | Harder |
| **Learning** | Visualize table | Less intuitive |
| **Production** | Use only if needed | Preferred |

**Winner**: Space optimized for production, 2D for learning

---

### When to Use Each

**2D DP Table:**
- Learning the algorithm
- Need to reconstruct the LCS string
- Multiple queries on same strings
- Debugging/visualization needed

**Space Optimized:**
- Large strings (memory constrained)
- Only need length value
- Production code

**With Reconstruction:**
- Need the actual LCS string
- Building Shortest Common Supersequence

<!-- back -->
