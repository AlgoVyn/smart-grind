## Strongly Connected Components: Comparison

When should you use Kosaraju vs Tarjan?

<!-- front -->

---

### Kosaraju vs Tarjan

| Aspect | Kosaraju | Tarjan |
|--------|----------|--------|
| **Passes** | 2 DFS + reverse | 1 DFS |
| **Code** | Simpler | More complex |
| **Space** | O(V+E) for reverse | O(V) |
| **Time** | O(V+E) | O(V+E) |

**Winner**: Kosaraju for learning, Tarjan for single pass

---

### When to Use Each

**Kosaraju:**
- Learning SCCs
- Two passes acceptable
- Reverse graph available

**Tarjan:**
- Single pass required
- Memory constrained
- Production code

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|----- |
| Learning | Kosaraju | Conceptually simpler |
| Production | Tarjan | Single pass |
| Memory tight | Tarjan | No reverse graph |
| Interview | Either | Both O(V+E) |

<!-- back -->
