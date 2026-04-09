## Graph BFS - Connected Components: Comparison

When should you use BFS vs DFS for connected components?

<!-- front -->

---

### BFS vs DFS for Components

| Aspect | BFS | DFS |
|--------|-----|-----|
| **Stack overflow** | No risk | Risk on deep graphs |
| **Code complexity** | More (queue) | Less (recursive) |
| **Shortest path** | Finds it | Not guaranteed |
| **Memory** | O(width) | O(depth) |
| **Level order** | Natural | Not available |

**Winner**: DFS for cleaner code, BFS for deep graphs

---

### When to Use Each

**BFS:**
- Deep graphs (many levels)
- Find shortest path
- Avoid stack overflow
- Level-order processing

**DFS:**
- Simpler implementation
- Path tracking needed
- Shallow graphs
- Backtracking required

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|----- |
| Standard interview | DFS | Cleaner code |
| Large/deep grid | BFS | No overflow |
| Shortest path needed | BFS | Unweighted shortest |
| Path reconstruction | DFS | Natural tracking |

<!-- back -->
