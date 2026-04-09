## Linked List - In-Place Reversal: Comparison

When should you use different reversal approaches?

<!-- front -->

---

### Iterative vs Recursive

| Aspect | Iterative | Recursive |
|--------|-----------|-----------|
| **Space** | O(1) | O(n) stack |
| **Code** | Longer | Shorter |
| **Risk** | None | Stack overflow |
| **Use case** | Production | Educational |

**Winner**: Iterative for production, recursive for understanding

---

### When to Use Each

**Iterative:**
- Production code
- O(1) space requirement
- Large lists
- Interview standard

**Recursive:**
- Clean, elegant code
- Learning recursion
- Small lists

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|----- |
| Interview | Iterative | Standard solution |
| Large list | Iterative | No stack overflow |
| Code golf | Recursive | Fewer lines |
| Learning | Both | Understand both |

<!-- back -->
