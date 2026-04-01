## BST Insert: Comparison Guide

How does BST insertion compare to other ordered data structures?

<!-- front -->

---

### Ordered Data Structure Comparison

| Structure | Insert | Search | Delete | Inorder | Notes |
|-----------|--------|--------|--------|---------|-------|
| **BST (basic)** | O(h) | O(h) | O(h) | O(n) | h can be O(n) |
| **AVL Tree** | O(log n) | O(log n) | O(log n) | O(n) | Strictly balanced |
| **Red-Black** | O(log n) | O(log n) | O(log n) | O(n) | Faster insert than AVL |
| **Treap** | O(log n) exp | O(log n) exp | O(log n) exp | O(n) | Simple, randomized |
| **Skip List** | O(log n) exp | O(log n) exp | O(log n) exp | O(n) | Probabilistic, easier |
| **Sorted Array** | O(n) | O(log n) | O(n) | O(n) | Cache friendly |
| **Hash Table** | O(1) | O(1) | O(1) | O(n log n) | No ordering |

**Key insight:** BSTs maintain order; hash tables don't.

---

### BST vs Hash Table

| Aspect | BST | Hash Table |
|--------|-----|------------|
| **Ordering** | Maintained | None |
| **Min/Max** | O(log n) | O(n) |
| **Range query** | O(log n + k) | O(n) |
| **Successor/Predecessor** | O(log n) | O(n) |
| **Average operations** | O(log n) | O(1) |
| **Worst case** | O(n) | O(n) |
| **Space** | O(n) pointers | O(n) + overhead |

**Choose BST when:** Order matters, need range queries
**Choose Hash when:** Fast lookup only, no ordering needed

---

### Balanced BST Comparison

| Tree | Rotations | Balance Factor | Best For |
|------|-----------|----------------|----------|
| **AVL** | Strict | |height| ≤ 1 | Frequent lookups |
| **Red-Black** | Fewer | Black height | Frequent inserts/deletes |
| **Treap** | Randomized | Heap priority | Simple implementation |
| **Splay** | Self-adjusting | Access-based | Locality of reference |
| **B-Tree** | Multiple keys | Fill factor | Disk storage |

---

### When to Use Each Structure

| Requirement | Structure |
|-------------|-----------|
| Need ordering + fast ops | Balanced BST (AVL/RB) |
| Fast lookup only | Hash table |
| Persistent/immutable | Functional BST |
| Concurrent access | Lock-free BST or B-link tree |
| Range queries | Augmented BST or Segment tree |
| Order statistics | Order statistic tree (augmented) |
| External memory | B-tree or B+ tree |

---

### Implementation Trade-offs

```
Basic BST:
  Pros: Simple code, minimal overhead
  Cons: O(n) worst case

AVL Tree:
  Pros: Guaranteed O(log n)
  Cons: Complex rotations, slower insert

Red-Black:
  Pros: Good balance, widely used (C++ std::map)
  Cons: Still complex

Treap:
  Pros: Simple, no complex cases
  Cons: Randomized (expected, not guaranteed)

Skip List:
  Pros: No tree structure, iterative
  Cons: Higher constant factors
```

<!-- back -->
