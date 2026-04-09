## Tree DFS - Recursive Postorder Traversal: Core Concepts

What are the fundamental principles of postorder tree traversal?

<!-- front -->

---

### Core Concept

Use **postorder traversal (Left → Right → Root)** when you need to process child nodes before their parent.

**Key insight**: Children are completely processed before the parent node is visited.

---

### The Pattern

```
Tree:         A                    Visit Order: D, E, B, F, C, A
             / \
            B   C
           / \   \
          D   E   F

Traversal Steps:
  1. Go left to B, then left to D
  2. D has no children → visit D
  3. Back to D, no right → back to B
  4. Go right to E → visit E
  5. Back to E, no right → back to B
  6. B has no more children → visit B
  7. Back to A, go right to C
  8. Go left to F → visit F
  9. Back to F, no right → back to C
  10. C has no more children → visit C
  11. Back to A → visit A

Result: [D, E, B, F, C, A] ✓
```

---

### Why Postorder?

| Scenario | Why Postorder? |
|----------|---------------|
| **Tree Deletion** | Delete children before parent to avoid dangling pointers |
| **Expression Trees** | Produces postfix notation (Reverse Polish) for stack evaluation |
| **Subtree Properties** | Compute height, sum, or size of children before parent |
| **Bottom-Up DP** | Solution depends on children's solutions |
| **Cleanup Operations** | Release resources from leaves up to root |

---

### Common Applications

| Problem Type | Use Case | Example |
|--------------|----------|---------|
| Tree Height | Compute height bottom-up | Diameter of Binary Tree |
| Tree Deletion | Delete children first | Delete Nodes and Return Forest |
| Expression Eval | Postfix notation | Evaluate Reverse Polish Notation |
| Subtree Sum | Calculate sums | Maximum Product of Splitted Tree |
| File System | Process directories | Delete directory after contents |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(n) | Each node visited exactly once |
| Space | O(h) | Recursion stack = tree height |
| Space (worst) | O(n) | Skewed tree (linked list shape) |

Where:
- n = number of nodes
- h = height of tree

---

### Traversal Comparison

| Traversal | Order | Best For |
|-----------|-------|----------|
| **Preorder** | Root → Left → Right | Root-to-leaf paths, cloning |
| **Inorder** | Left → Root → Right | BST sorting, valid BST check |
| **Postorder** | Left → Right → Root | Deletion, bottom-up calculations |

<!-- back -->
