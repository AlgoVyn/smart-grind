## Array - Product Except Self: Comparison

When should you use different approaches for product except self?

<!-- front -->

---

### Prefix/Suffix vs Division

| Aspect | Prefix/Suffix | Division |
|--------|---------------|----------|
| **Handles zeros** | ✓ Yes | ✗ No (division by zero) |
| **Space** | O(n) or O(1) | O(1) |
| **Time** | O(n) | O(n) |
| **Constraints** | No division allowed | Division allowed |
| **Correctness** | Always correct | Fails with zeros |

**Winner**: Prefix/Suffix - always correct

---

### When to Use Each Approach

**Two Arrays (Prefix + Suffix)**:
- Learning the pattern
- Code clarity matters
- Extra space available

**O(1) Space (Output array trick)**:
- Space constrained
- Production code
- Interview optimal solution

**Division (theoretical only)**:
- Never use in practice
- Fails with zeros
- LeetCode 238 forbids it

---

### Space-Time Trade-offs

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Two arrays | O(n) | O(n) | Learning, clarity |
| Output array trick | O(n) | O(1) | **Optimal, recommended** |
| With division | O(n) | O(1) | Forbidden by problem |

---

### Decision Tree

```
Product except self?
├── Array contains zeros?
│   ├── Yes → Must use prefix/suffix
│   └── No → Still use prefix/suffix (more robust)
├── Space constraint O(1)?
│   ├── Yes → Use output array for prefix, scalar for suffix
│   └── No → Two arrays approach (clearer)
└── Division allowed?
    ├── Yes → Still don't use (bad practice)
    └── No → Prefix/suffix required
```

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|-----|
| Interview | O(1) space | Shows optimization skill |
| Learning | Two arrays | Easier to understand |
| Production | O(1) space | Memory efficient |
| Array with zeros | Any prefix/suffix | Only correct approach |

<!-- back -->
