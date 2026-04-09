## Strongly Connected Components (Kosaraju/Tarjan): Comparison

When should you use different approaches?

<!-- front -->

---

### Kosaraju vs Tarjan: Head-to-Head

| Aspect | Kosaraju | Tarjan |
|--------|----------|--------|
| **Passes** | Two DFS passes | Single DFS pass |
| **Graph reversal** | Required | Not required |
| **Memory** | Needs reversed graph | Only one copy needed |
| **Implementation** | Simpler to understand | Slightly more complex |
| **Low-link values** | Not needed | Essential |
| **Time complexity** | O(V + E) | O(V + E) |
| **Space complexity** | O(V + E) | O(V) |
| **Constant factors** | Higher | Lower |

---

### When to Use Each

**Use Kosaraju's Algorithm when:**
- Learning the concept (simpler to understand)
- Graph is already reversed elsewhere
- Memory is not a constraint
- Two-pass approach is clearer for your problem
- Teaching the algorithm

**Use Tarjan's Algorithm when:**
- Efficiency matters (single pass)
- Graph reversal is expensive
- Space is constrained
- Production code (preferred in practice)
- Need to identify SCCs during traversal

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|----- |
| Interview | Kosaraju | Easier to explain |
| Production | Tarjan | Single pass, less memory |
| Space critical | Tarjan | No reversed graph needed |
| Teaching | Kosaraju | Conceptually cleaner |
| Graph already reversed | Kosaraju | Reuse existing structure |
| Need SCC IDs during DFS | Tarjan | Natural fit |

---

### Recursive vs Iterative Variants

| Aspect | Recursive | Iterative |
|--------|-----------|-----------|
| **Code clarity** | Clean | Verbose |
| **Stack overflow risk** | Yes | No |
| **Speed** | Slightly faster | Slightly slower |
| **Large graphs** | Risky | Safe |
| **LeetCode** | Usually safe | Use for N > 10^5 |

**Recommendation:** Start with recursive, convert to iterative if needed.

---

### Summary Decision Tree

```
Need to find SCCs?
    │
    ├─► Graph already reversed?
    │       ├─► Yes → Kosaraju
    │       └─► No → Continue
    │
    ├─► Space/memory critical?
    │       ├─► Yes → Tarjan
    │       └─► No → Continue
    │
    ├─► Teaching/learning?
    │       ├─► Yes → Kosaraju
    │       └─► No → Continue
    │
    └─► Default choice → Tarjan (more efficient)
```

<!-- back -->
