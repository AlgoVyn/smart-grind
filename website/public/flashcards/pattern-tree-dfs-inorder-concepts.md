## Tree - DFS Recursive Inorder: Core Concepts

What are the fundamental principles of DFS inorder traversal on trees?

<!-- front -->

---

### Core Concept

Use **recursion to traverse left subtree, current node, then right subtree** to process nodes in sorted order (for BST).

**Key insight**: Inorder traversal of a BST yields elements in ascending order.

---

### The Pattern

```
Tree:      4
         /   \
        2     6
       / \   / \
      1   3 5   7

Inorder traversal:
  1. Go left of 4 → 2
     1a. Go left of 2 → 1
         1a.i. Go left of 1 → null, return
         1a.ii. Visit 1 ✓
         1a.iii. Go right of 1 → null, return
     1b. Visit 2 ✓
     1c. Go right of 2 → 3
         1c.i. Go left of 3 → null, return
         1c.ii. Visit 3 ✓
         1c.iii. Go right of 3 → null, return
  2. Visit 4 ✓
  3. Go right of 4 → 6 (similar process)
     ... 5, 6, 7

Result: [1, 2, 3, 4, 5, 6, 7] ✓ (sorted!)
```

---

### Traversal Order

| Traversal | Order | BST Property |
|-----------|-------|--------------|
| **Inorder** | Left → Root → Right | Sorted output |
| **Preorder** | Root → Left → Right | Copy/serialize tree |
| **Postorder** | Left → Right → Root | Delete/bottom-up processing |

---

### Common Applications

| Problem Type | Use Case | Example |
|--------------|----------|---------|
| BST Validation | Check if tree is BST | Validate BST |
| K-th Smallest | Find k-th element | Kth Smallest in BST |
| Sorted Array | Convert BST to sorted list | BST to Sorted List |
| Range Query | Find elements in range | Range Sum BST |
| Inorder Successor | Next element in traversal | Successor |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(n) | Visit each node once |
| Space | O(h) | Recursion stack, h = height |
| Space (skewed) | O(n) | Worst case |
| Space (balanced) | O(log n) | Best case |

<!-- back -->
