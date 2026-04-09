## Array - Merge Sorted In-Place: Comparison

When should you use different merge approaches?

<!-- front -->

---

### In-Place vs New Array

| Aspect | In-Place | New Array |
|--------|----------|-----------|
| **Space** | O(1) | O(m+n) |
| **Time** | O(m+n) | O(m+n) |
| **Input** | Modified | Preserved |
| **Use case** | Space constrained | Need original |

**Winner**: In-place for interviews, new array if original needed

---

### When to Use Each

**In-Place from End:**
- nums1 has space at end
- O(1) space required
- Standard interview solution

**New Array:**
- Need to preserve inputs
- Both arrays are "full"
- Clarity over optimization

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|----- |
| Interview standard | In-place from end | Standard solution |
| Preserve inputs | New array | Keep originals |
| Large arrays | In-place | Memory efficient |

<!-- back -->
