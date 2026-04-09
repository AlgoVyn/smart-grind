## Linked List Reordering/Partitioning: Comparison

When should you use different approaches for linked list reordering problems?

<!-- front -->

---

### Position-Based vs Value-Based Partitioning

| Aspect | Position-Based (Odd/Even) | Value-Based (< x, >= x) |
|--------|---------------------------|------------------------|
| **Criteria** | Node position (index) | Node value comparison |
| **Toggle mechanism** | Boolean flip `is_odd = not is_odd` | Compare `current.val < x` |
| **Number of partitions** | Fixed (2: odd/even) | Variable (depends on problem) |
| **Examples** | LeetCode 328 | LeetCode 86 |
| **Relative order** | Preserved automatically | Preserved automatically |

---

### Dummy Head vs No Dummy Head

| Aspect | With Dummy | Without Dummy |
|--------|------------|---------------|
| **Code complexity** | Simpler, uniform handling | More edge cases |
| **First element handling** | Same as others | Special case |
| **Return value** | `dummy.next` | First non-null head |
| **Memory** | O(1) extra node | O(0) extra nodes |
| **Recommended?** | **Yes** - cleaner code | Only if memory is extremely tight |

**Winner**: Always use dummy heads for clarity.

---

### Single Pass vs Multiple Passes

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| **Single Pass** | O(n) | O(1) | **Always preferred** - standard pattern |
| Two Pass (find middle, then partition) | O(n) | O(1) | Reorder list (LeetCode 143) |
| Multiple Passes | O(kn) | O(1) | Complex multi-step reorganization |

**Note**: Most partitioning is single-pass. Reordering patterns (like L0→Ln→L1→Ln-1) may need two passes: find middle, reverse second half, then merge.

---

### Partitioning vs Reversing

| Feature | Partitioning | Reversing |
|---------|--------------|-----------|
| **Goal** | Group by criteria | Change direction |
| **Node count per group** | Variable | All or fixed size |
| **Pointer changes** | Re-link to dummies | Reverse `next` pointers |
| **Common problem** | Odd/Even, Partition List | Reverse Linked List |
| **Can combine?** | Yes - partition then reverse within | Yes - reverse sublists |

**Combined example**: Reverse nodes in even positions only:
1. Partition into odd/even
2. Reverse even chain
3. Reconnect

---

### Decision Tree

```
Problem type?
├── Separate by position (odd/even indices)?
│   └── Use position-based partitioning
│   └── Toggle: is_odd = not is_odd
│
├── Separate by value (< x vs >= x)?
│   └── Use value-based partitioning
│   └── Compare: current.val < x
│
├── Reorder to L0→Ln→L1→Ln-1...?
│   └── Two-step: find middle + reverse + merge
│
├── Group by k nodes, reverse each group?
│   └── Extension: partition in chunks of k
│
└── Custom criteria?
    └── General partitioning with condition function
```

---

### Comparison: Common Problems

| Problem | Approach | Key Variation |
|---------|----------|---------------|
| Odd Even Linked List (328) | Position-based | Boolean toggle |
| Partition List (86) | Value-based | Compare with pivot x |
| Reorder List (143) | Two-pointer + reverse | Find middle, reverse, merge |
| Swap Nodes in Pairs (24) | Two-node partitioning | Process in pairs |
| Reverse Nodes in k-Group (25) | Chunk partitioning | Partition every k nodes |

<!-- back -->
