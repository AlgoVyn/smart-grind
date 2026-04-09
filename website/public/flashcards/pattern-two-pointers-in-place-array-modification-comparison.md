## Two Pointers - In-place Array Modification: Comparison

When should you use different two pointer approaches?

<!-- front -->

---

### Fast/Slow vs Two Pointers with Swap vs Dutch National Flag

| Aspect | Fast/Slow (Overwrite) | Two Pointers Swap | Dutch National Flag |
|--------|----------------------|-------------------|---------------------|
| **Direction** | Same (left to right) | Opposite ends | Same (3 pointers) |
| **Preserves order** | Yes | No | No |
| **Use case** | Remove elements | Partition (2 groups) | Partition (3 groups) |
| **Operation** | Overwrite | Swap | Swap |
| **Return value** | New length | Partition index | Sorted array |

**Winner**: Fast/Slow for order preservation, Swap for partitioning

---

### When to Use Each

**Fast/Slow Pointers (Overwrite):**
- Remove Element
- Remove Duplicates from Sorted Array
- Move Zeroes
- Must preserve relative order

**Two Pointers with Swap:**
- Partition into two groups
- Order doesn't matter
- First Missing Positive
- Move all X to one side

**Dutch National Flag (3 Pointers):**
- Sort Colors (0s, 1s, 2s)
- Three-way partitioning
- Wiggle Sort variations

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|-----|
| Preserve order | Fast/Slow | Overwrite maintains sequence |
| Minimize swaps | Fast/Slow | Only write when needed |
| Partition 2 groups | Swap | Groups elements efficiently |
| Partition 3 groups | Dutch Flag | Handles 3 values elegantly |
| Deeply nested data | Fast/Slow | Simpler logic |

---

### Approach Selection Flowchart

```
Need in-place modification?
├── Must preserve order?
│   └── Use Fast/Slow (overwrite)
│       └── O(n) time, O(1) space
│
└── Order doesn't matter?
    ├── Two distinct groups?
    │   └── Use Two Pointers (swap)
    │       └── left/right from ends
    │
    └── Three distinct groups?
        └── Use Dutch National Flag
            └── low/mid/high pointers
```

<!-- back -->
