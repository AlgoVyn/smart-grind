## DFS Postorder: Comparison Guide

How does postorder compare to other tree processing approaches?

<!-- front -->

---

### Tree Traversal Use Cases

| Goal | Best Traversal | Why |
|------|----------------|-----|
| **Delete tree** | Postorder | Children before parent |
| **Tree height** | Postorder | Need children's heights |
| **Copy tree** | Preorder | Create parent before children |
| **Validate BST** | Inorder | Check sorted property |
| **Level-by-level** | Level-order | Natural BFS ordering |
| **Expression eval** | Postorder | Postfix notation |
| **Build from array** | Preorder | Reconstruct root first |

---

### Bottom-Up vs Top-Down

| Approach | Direction | Use When |
|----------|-----------|----------|
| **Postorder (bottom-up)** | Leaves to root | Subtree results needed |
| **Preorder (top-down)** | Root to leaves | Propagate global state |
| **Both combined** | Mixed | Complex state passing |

**Example - path sum:**
```python
# Bottom-up: diameter (max of all paths)
# Top-down: check if path sum equals target
# Combined: max path sum any to any
```

---

### Space Complexity Comparison

| Traversal | Recursion | Iterative | Morris |
|-----------|-----------|-----------|--------|
| **Preorder** | O(h) | O(h) | O(1) |
| **Inorder** | O(h) | O(h) | O(1) |
| **Postorder** | O(h) | O(h) | Complex |

**Note:** Postorder Morris traversal is possible but significantly more complex.

---

### Recursive vs Iterative

| Aspect | Recursive | Iterative |
|--------|-----------|-----------|
| **Code clarity** | Clean, natural | More verbose |
| **Stack overflow risk** | Yes for deep trees | Yes but controllable |
| **Early termination** | Can use exceptions | Easier with flags |
| **Performance** | Function call overhead | Slightly faster |
| **Tail recursion** | May optimize | N/A |

---

### When to Use Each

```
Tree deletion?
  → Postorder (children before parent)

Subtree computation (sum, count, height)?
  → Postorder bottom-up

Path from root problems?
  → Preorder with path tracking

Expression trees?
  → Postorder for evaluation
  → Preorder for prefix notation
  → Inorder for infix (with parens)

Binary search tree operations?
  → Inorder for sorted order
  → Modified binary search for queries
```

<!-- back -->
