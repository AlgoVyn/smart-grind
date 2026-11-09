# Flashcards: Tree DFS Recursive Preorder Traversal - Concepts

What is Depth-First Search (DFS) in the context of tree traversal?

<!-- front -->

DFS explores as far as possible along each branch before backtracking. In trees, it follows a path from root to leaf before exploring other branches.

Preorder DFS visits **root first**, then traverses left, then right.

---

### Card 2: Preorder Definition: Why is it called "preorder" traversal?

**"Pre"** refers to processing the root **before** (pre-) visiting the children.

The root is visited:
- Before left subtree
- Before right subtree

This distinguishes it from inorder (middle) and postorder (after).

---

### Card 3: Recursion Stack: How does the recursion stack work in preorder traversal?

Each recursive call adds a stack frame containing:
- Current node reference
- Return address
- Local variables

The call stack **implicitly** manages traversal state, naturally following the root → left → right order.

---

### Card 4: Base Case: What is the base case in recursive tree traversal?

```python
if not node:   # or node == null
    return
```

When reaching a null child (non-existent node), recursion terminates for that branch. This is essential to prevent infinite recursion.

---

### Card 5: Top-Down Processing: What does "top-down processing" mean in preorder traversal?

Processing information flows **from parent to children**:
- Parent node's value is available before child processing
- Can pass accumulated data down (paths, sums, depth)
- Cannot use children's results (that's postorder)

<!-- back -->
