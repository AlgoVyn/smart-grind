## DFS Inorder: Core Concepts

What is inorder tree traversal and what are its key properties?

<!-- front -->

---

### Definition

**Inorder traversal:** Left subtree → Root → Right subtree

```
    4
   / \
  2   6
 / \  / \
1  3 5  7

Inorder: 1, 2, 3, 4, 5, 6, 7 (sorted for BST)
```

---

### Key Properties

| Property | Inorder |
|----------|---------|
| **BST output** | Sorted ascending order |
| **Node position** | Between all left and right descendants |
| **First node** | Leftmost descendant |
| **Last node** | Rightmost descendant |

---

### When to Use

| Use Case | Why Inorder |
|----------|-------------|
| **BST validation** | Should produce sorted sequence |
| **Kth smallest** | Count nodes during traversal |
| **Sorted list from BST** | Natural output |
| **Expression trees** | Infix notation (with parentheses) |
| **Tree to list** | Convert to doubly-linked list |

---

### Traversal Comparison

| Order | Sequence | BST Property |
|-------|----------|--------------|
| **Preorder** | Root-Left-Right | No special property |
| **Inorder** | Left-Root-Right | Sorted ascending |
| **Postorder** | Left-Right-Root | Sorted descending (if reversed) |
| **Level-order** | By depth | No special property |

---

### Complexity

| Aspect | Complexity |
|--------|------------|
| **Time** | O(n) - visit each node once |
| **Space (recursive)** | O(h) - recursion stack, h = height |
| **Space (iterative)** | O(h) - explicit stack |
| **Space (Morris)** | O(1) - threaded traversal |

<!-- back -->
