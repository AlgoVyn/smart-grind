## DFS Inorder: Comparison Guide

How does inorder traversal compare to other tree traversals?

<!-- front -->

---

### Traversal Order Comparison

| Order | Sequence | When to Use |
|-------|----------|-------------|
| **Preorder** | Root-Left-Right | Copy tree, prefix expression, serialization |
| **Inorder** | Left-Root-Right | BST validation, sorted order, kth element |
| **Postorder** | Left-Right-Root | Delete tree, postfix expression, bottom-up |
| **Level-order** | By depth | BFS problems, shortest path in tree |

---

### Implementation Comparison

| Method | Space | Use When |
|--------|-------|----------|
| **Recursive** | O(h) | Simple, no stack limits |
| **Iterative** | O(h) | Need manual control, large trees |
| **Morris** | O(1) | Space critical, temporary threads ok |
| **Threaded** | O(1) | Permanent threaded tree structure |

---

### BST-Specific Traversals

| Goal | Traversal Direction |
|------|---------------------|
| **Kth smallest** | Inorder (ascending) |
| **Kth largest** | Reverse inorder (descending) |
| **Range query** | Inorder with pruning |
| **Floor/Ceiling** | Modified binary search |
| **Validate BST** | Inorder (check sorted) |

---

### Time Complexity Summary

| Operation | Time | Notes |
|-----------|------|-------|
| **Full traversal** | O(n) | Visit all nodes |
| **Kth element** | O(h + k) | Early termination possible |
| **Search in BST** | O(h) | Can stop early |
| **Range query** | O(h + m) | m = nodes in range |
| **Next successor** | O(h) | With parent pointer: O(1) avg |

---

### When Each Traversal Wins

```
Need sorted order from BST?
  ├─ Ascending → Inorder
  └─ Descending → Reverse inorder

Need to process children before parent?
  → Postorder (bottom-up DP)

Need to process parent before children?
  → Preorder (top-down propagation)

Need shortest path or level-based?
  → Level-order (BFS)

Space constrained on deep tree?
  → Morris traversal
```

<!-- back -->
