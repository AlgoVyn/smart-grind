## DFS Preorder: Comparison Guide

How does preorder traversal compare to other tree traversals?

<!-- front -->

---

### Traversal Selection Guide

| Goal | Best Traversal | Reason |
|------|----------------|--------|
| **Serialize tree** | Preorder | Root first + markers = reconstructible |
| **Copy tree** | Preorder | Parent before children |
| **Root-to-leaf sum** | Preorder | Accumulate as you go down |
| **Delete tree** | Postorder | Children before parent |
| **BST check** | Inorder | Natural sorted order |
| **Tree height** | Postorder | Need children's heights |
| **Level order** | BFS | By depth naturally |

---

### Preorder vs Postorder

| Aspect | Preorder | Postorder |
|--------|----------|-----------|
| **Direction** | Top-down | Bottom-up |
| **Root timing** | First | Last |
| **Use for** | Propagation | Aggregation |
| **Path problems** | Root-to-X | X-to-leaf or any path |
| **Space** | O(h) | O(h) |

**Combined approach for path problems:**
```python
# Max path sum (any node to any node)
# - Postorder for subtree contributions
# - Track max with global
```

---

### Implementation Comparison

| Method | Code Simplicity | Space | Use When |
|--------|-----------------|-------|----------|
| **Recursive** | Simple | O(h) | Standard, no stack concerns |
| **Iterative** | Moderate | O(h) | More control needed |
| **Morris** | Complex | O(1) | Space critical |

---

### Serialization Comparison

| Traversal | Needs Second? | Null Markers | Reconstruction |
|-----------|---------------|--------------|--------------|
| **Preorder** | Yes (or inorder/postorder) | Required | With markers alone |
| **Inorder** | Yes (needs preorder/postorder) | Optional | With partner |
| **Postorder** | Yes (or preorder/inorder) | Required | With markers alone |
| **Level-order** | No | Required | With markers alone |

---

### When to Use Preorder

```
Tree reconstruction from array/string?
  → Preorder with null markers

Need to process parent before children?
  → Preorder (copy, decision propagation)

Root-to-leaf path tracking?
  → Preorder with state passing

Search with pruning?
  → Preorder (stop early on invalid branches)

Expression tree (prefix)?
  → Preorder

Comparing tree structures?
  → Any order consistently, preorder is simple
```

<!-- back -->
