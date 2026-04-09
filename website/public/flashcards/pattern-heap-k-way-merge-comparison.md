## Heap - K-way Merge: Comparison

When should you use different approaches?

<!-- front -->

---

### Heap vs Divide & Conquer vs Sequential

| Aspect | Heap | Divide & Conquer | Sequential |
|--------|------|------------------|------------|
| **Time** | O(N log K) | O(N log K) | O(N K) |
| **Space** | O(K) | O(log K) stack | O(1) |
| **Implementation** | Clean | Recursive | Simple |
| **Streaming** | Yes | No | No |

**Winner**: Heap for streaming, D&C for no extra space

---

### When to Use Each

**Heap:**
- Clean implementation
- Streaming data
- Real-time merging

**Divide & Conquer:**
- No extra space for heap
- Batch processing
- Parallel potential

**Sequential:**
- Small K
- Simple code preferred
- Not performance critical

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|----- |
| Large K | Heap or D&C | O(N log K) |
| Streaming | Heap | Continuous input |
| Small K | Sequential | Simpler code |
| No extra space | D&C | Recursion stack only |

<!-- back -->
