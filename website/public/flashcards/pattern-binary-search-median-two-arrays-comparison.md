## Binary Search - Median of Two Arrays: Comparison

When should you use different approaches for median of two arrays?

<!-- front -->

---

### Binary Search vs Merge vs Heap

| Aspect | Binary Search | Merge | Heap |
|--------|---------------|-------|------|
| **Time** | O(log(min)) | O(m+n) | O((m+n)log(m+n)) |
| **Space** | O(1) | O(m+n) or O(1) | O(m+n) |
| **Implementation** | Complex | Simple | Moderate |
| **Use case** | Interview/optimize | Understanding | K largest |

**Winner**: Binary search for interviews, merge for understanding

---

### When to Use Each

**Binary Search Partition:**
- O(log n) required
- Space constrained
- Interview hard problem

**Merge:**
- Understanding the problem
- Simpler code preferred
- Not performance-critical

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|----- |
| Interview optimal | Binary search | Expected solution |
| Quick implementation | Merge | Easier to get right |
| Very large arrays | Binary search | O(log n) critical |
| Multiple queries | Preprocess | Depends on use case |

<!-- back -->
