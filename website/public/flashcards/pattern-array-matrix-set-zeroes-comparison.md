## Array/Matrix - Set Matrix Zeroes: Comparison

When should you use different approaches for setting matrix zeroes?

<!-- front -->

---

### Space Complexity Trade-offs

| Approach | Space | Time | Use When |
|----------|-------|------|----------|
| **O(1) In-place** | O(1) | O(m×n) | Space constrained |
| **O(m+n) Sets** | O(m+n) | O(m×n) | Clarity matters |
| **O(m×n) Copy** | O(m×n) | O(m×n) | Can't modify input |

**Winner**: O(1) for interviews, O(m+n) for understanding

---

### When to Use Each

**O(1) In-place:**
- Strict space constraints
- Can modify input
- Interview standard

**O(m+n) with Sets:**
- Learning the problem
- Code clarity
- Don't need strict O(1)

**Copy and Modify:**
- Can't modify input
- Need original preserved

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|----- |
| Interview | O(1) in-place | Standard solution |
| Learning | O(m+n) sets | Easier to understand |
| Read-only input | Copy first | Preserve input |
| Very large matrix | O(1) | Memory efficient |

<!-- back -->
