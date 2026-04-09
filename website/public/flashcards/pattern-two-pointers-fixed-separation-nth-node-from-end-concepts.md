## Two Pointers - Fixed Separation (Nth Node from End): Core Concepts

What are the fundamental principles of the fixed separation two-pointer pattern?

<!-- front -->

---

### Core Concept

Maintain a **fixed gap of n nodes** between two pointers while traversing a linked list. When the leading pointer reaches the end, the trailing pointer is exactly n nodes from the end.

**Key insight:** By creating and maintaining a constant separation, we can access elements at specific offsets from the end in a single pass.

---

### The Pattern

```
Find 2nd node from end in 1 → 2 → 3 → 4 → 5 → null

Initial State:
fast → 1 → 2 → 3 → 4 → 5 → null
slow → 1 → 2 → 3 → 4 → 5 → null

After advancing fast by n=2 steps:
fast → 3 → 4 → 5 → null
slow → 1 → 2 → 3 → 4 → 5 → null

Move both pointers together:
fast → 4 → 5 → null      slow → 2 → 3 → 4 → 5 → null
fast → 5 → null          slow → 3 → 4 → 5 → null
fast → null (end)        slow → 4 → 5 → null  ✓ 2nd from end!
```

---

### Key Principles

| Principle | Description |
|-----------|-------------|
| **Gap Creation** | Advance `fast` by n steps to establish separation |
| **Simultaneous Movement** | Move both pointers one step at a time together |
| **Offset Access** | `slow` reaches target when `fast` hits the end |
| **Dummy Node** | Optional helper to simplify edge case handling |
| **Single Pass** | O(n) time, O(1) space complexity |

---

### Mathematical Relationship

If `fast` is `n` nodes ahead of `slow`:
- When `fast` traverses `L` nodes (full list length)
- `slow` traverses `L - n` nodes
- Therefore `slow` ends at position `n` from the end

---

### Common Applications

| Problem Type | Use Case | Example |
|--------------|----------|---------|
| Access by Position | Get nth from end | Return node value |
| Deletion | Remove nth from end | Modify list structure |
| Swapping | Exchange nodes | Swap without values |
| Rotation | Rotate list by k | Connect end to start |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(L) | Single traversal, L = list length |
| Space | O(1) | Only two pointers |
| Alternative | O(L) time, O(L) space | Store all nodes in array |

<!-- back -->
