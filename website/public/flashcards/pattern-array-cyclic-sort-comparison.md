## Array - Cyclic Sort: Comparison

When should you use cyclic sort versus other approaches?

<!-- front -->

---

### Cyclic Sort vs Standard Sort vs Hash Set

| Aspect | Cyclic Sort | Standard Sort | Hash Set |
|--------|-------------|-----------------|----------|
| **Time** | O(n) | O(n log n) | O(n) |
| **Space** | O(1) | O(1) or O(n) | O(n) |
| **Modifies input** | Yes | Depends | No |
| **Range required** | Known range | No | No |
| **Finding missing** | Easy | Medium | Easy |

**Winner**: Cyclic sort for [1,n] range with O(1) space

---

### When to Use Each

**Cyclic Sort:**
- Numbers in range [1, n] or [0, n-1]
- O(1) extra space required
- Finding missing/duplicates
- In-place sorting needed

**Standard Sort:**
- General sorting
- No range constraints
- Stable sort needed

**Hash Set:**
- Fast lookup needed
- Can use O(n) space
- Don't want to modify input

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|----- |
| [1,n] range, O(1) space | Cyclic sort | Optimal for this case |
| General sorting | Standard sort | More flexible |
| Preserve input | Hash set | Don't modify original |
| Missing number | Any | All O(n) possible |

<!-- back -->
