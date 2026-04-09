## Tree DFS - Recursive Inorder Traversal: Comparison

When should you use different approaches for inorder traversal?

<!-- front -->

---

### Recursive vs Iterative vs Morris: Trade-off Analysis

| Aspect | Recursive | Iterative (Stack) | Morris Traversal |
|--------|-----------|-------------------|------------------|
| **Code Clarity** | Cleanest | Moderate | Complex |
| **Space** | O(h) call stack | O(h) explicit stack | O(1) |
| **Stack Overflow Risk** | Yes | Yes | No |
| **Tree Modification** | No | No | Yes (temporary) |
| **Implementation** | Simple | Moderate | Complex |
| **Best For** | Interviews, balanced trees | Deep trees, avoiding recursion | Memory-constrained |

Where h = tree height (can be O(n) for skewed trees)

---

### When to Use Each Approach

#### Recursive DFS - Use When:
- Standard interview setting (most common)
- Tree is reasonably balanced
- Clean, readable code is priority
- No risk of stack overflow

#### Iterative DFS - Use When:
- Very deep trees (10^5+ levels)
- Recursion stack would overflow
- Need explicit control over traversal
- Stack depth is limited (e.g., Python default ~1000)

#### Morris Traversal - Use When:
- Memory is severely constrained
- O(1) space is required
- Can temporarily modify tree structure
- Understand threading mechanism

---

### Space Complexity Comparison

| Tree Type | Recursive | Iterative | Morris |
|-----------|-----------|-----------|--------|
| **Balanced** | O(log n) | O(log n) | O(1) |
| **Skewed (left)** | O(n) | O(n) | O(1) |
| **Skewed (right)** | O(n) | O(n) | O(1) |

**Interview Default:** Recursive (clean, standard)
**Production Default:** Iterative (safer, predictable)
**Special Case:** Morris (memory-constrained only)

---

### Traversal Order Comparison

| Traversal | Order | Use Case |
|-----------|-------|----------|
| **Preorder** | Root → Left → Right | Tree cloning, prefix expressions |
| **Inorder** | Left → Root → Right | BST validation, sorted output |
| **Postorder** | Left → Right → Root | Tree deletion, postfix expressions |
| **Level Order** | By levels (BFS) | Shortest path, level tracking |

---

### Algorithm Selection Decision Tree

```
Start
  │
  ├── Need O(1) space? ──→ Morris Traversal
  │
  ├── Very deep tree (risk stack overflow)?
  │     │
  │     ├── Yes ──→ Iterative with stack
  │     │
  │     └── No ──→ Recursive (default)
  │
  ├── Need to stop early (kth element)? ──→ Recursive with counter
  │
  └── Default ──→ Recursive inorder
```

---

### Summary Table: Choose Your Approach

| Situation | Best Approach | Why |
|-----------|---------------|-----|
| Standard interview | Recursive | Clean, expected solution |
| Deep/skewed tree | Iterative | No stack overflow |
| Memory constrained | Morris | O(1) space |
| BST validation | Recursive inorder | Natural sorted property |
| Threaded tree exists | Morris | Leverage existing threads |
| Need level info | BFS level-order | Natural level tracking |

---

### Python-Specific Considerations

| Factor | Limitation | Solution |
|--------|------------|----------|
| Recursion limit | Default ~1000 | `sys.setrecursionlimit()` or iterative |
| Stack inspection | Debugging harder | Use explicit stack for clarity |
| Generator option | `yield` for streaming | Memory-efficient for large trees |

```python
# Generator version for large trees
def inorder_generator(root):
    """Memory-efficient streaming traversal."""
    if root:
        yield from inorder_generator(root.left)
        yield root.val
        yield from inorder_generator(root.right)
```

<!-- back -->
