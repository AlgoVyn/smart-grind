## Graph DFS - Connected Components: Comparison

When should you use different approaches?

<!-- front -->

---

### Iterative DFS vs Recursive DFS vs BFS

| Aspect | Recursive DFS | Iterative DFS | BFS |
|--------|---------------|---------------|-----|
| **Code** | Cleanest | Moderate | Moderate |
| **Stack risk** | Yes | No | No |
| **Space** | O(depth) | O(depth) | O(width) |
| **Implementation** | Simple | Stack needed | Queue needed |

**Winner**: Recursive DFS for interviews, BFS for safety

---

### When to Use Each

**Recursive DFS:**
- Standard solution
- Clean, readable
- Shallow graphs

**Iterative DFS:**
- Avoid recursion limit
- Explicit stack control
- Large graphs

**BFS:**
- Shortest path
- Level-order needed
- Deepest graphs

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|----- |
| Interview | Recursive DFS | Standard |
| Production | BFS | Safer |
| Huge grid | Iterative | No stack issues |
| Shortest path | BFS | Required |

<!-- back -->
