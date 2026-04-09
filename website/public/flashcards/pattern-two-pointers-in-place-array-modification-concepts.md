## Two Pointers - In-place Array Modification: Core Concepts

What are the fundamental principles of two pointers in-place array modification?

<!-- front -->

---

### Core Concept

**Use two pointers moving at different speeds to modify arrays in O(1) space.**

**Key insight:**
- Read pointer scans every element (fast)
- Write pointer only moves when we find valid elements (slow)
- Valid elements overwrite positions of invalid ones

---

### The Pattern

```
1. Initialize write = 0

2. For each element (read pointer):
   If element is valid:
      nums[write] = element
      write++

3. Return write (count of valid elements)
   First 'write' elements are the result
```

---

### Why It Works

| Property | Explanation |
|----------|-------------|
| No data loss | Write ≤ Read always, so we never overwrite unread data |
| Single pass | Each element visited exactly once |
| O(1) space | Only two integer pointers |
| Order preserved | Elements placed in discovery order |

---

### Common Problem Types

| Type | Example | Condition |
|------|---------|-----------|
| Remove element | Remove Element | `num != val` |
| Remove duplicates | Remove Duplicates | `num != nums[write-1]` |
| Move zeros | Move Zeroes | `num != 0` |
| Partition | Sort Colors | Value-based swap |

---

### Complexity

| Aspect | Fast/Slow | Swap |
|--------|-----------|------|
| Time | O(n) | O(n) |
| Space | O(1) | O(1) |
| Preserves order | Yes | No |

<!-- back -->
