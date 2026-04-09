## LCA Finding: Tactics

What are the advanced techniques for LCA finding?

<!-- front -->

---

### Tactic 1: BST LCA Optimization

```python
def lca_bst(root, p, q):
    """
    Leverage BST property: left < root < right
    Time: O(h) where h = height of tree
    """
    # Get values for comparison
    val = root.val
    p_val = p.val
    q_val = q.val
    
    # Both in left subtree
    if p_val < val and q_val < val:
        return lca_bst(root.left, p, q)
    
    # Both in right subtree  
    elif p_val > val and q_val > val:
        return lca_bst(root.right, p, q)
    
    # Divergence: one left, one right (or one is root)
    else:
        return root
```

---

### Tactic 2: Parent Pointers (Iterative)

```python
def lca_parent_pointers(root, p, q):
    """
    Use parent pointers to trace paths to root.
    Build ancestor set for p, find first match in q's path.
    """
    # Build parent map using DFS/BFS
    parent = {root: None}
    stack = [root]
    
    while p not in parent or q not in parent:
        node = stack.pop()
        if node.left:
            parent[node.left] = node
            stack.append(node.left)
        if node.right:
            parent[node.right] = node
            stack.append(node.right)
    
    # Build ancestor set for p
    ancestors = set()
    while p:
        ancestors.add(p)
        p = parent[p]
    
    # Find first ancestor of q in the set
    while q not in ancestors:
        q = parent[q]
    
    return q
```

---

### Tactic 3: Multiple Nodes LCA

```python
def lca_multiple(root, nodes):
    """
    Find LCA of multiple nodes by pairwise reduction.
    """
    if not nodes:
        return None
    
    lca_result = nodes[0]
    for node in nodes[1:]:
        lca_result = lowest_common_ancestor(root, lca_result, node)
        if not lca_result:
            return None
    
    return lca_result
```

---

### Tactic 4: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|----- |
| Value vs Reference | Comparing node.val instead of node | Use `node is p`, not `node.val == p.val` |
| One node as ancestor | Expecting LCA to be different node | Return ancestor if found |
| Null handling | Crashing on empty tree | Check `if not root` first |
| Recursion depth | Stack overflow on deep trees | Use iterative for production |

---

### Tactic 5: Distance Calculation

```python
def distance_between_nodes(u, v, lca_finder):
    """
    Distance = depth(u) + depth(v) - 2*depth(LCA)
    """
    lca = lca_finder.lca(u, v)
    return (lca_finder.depth[u] + 
            lca_finder.depth[v] - 
            2 * lca_finder.depth[lca])
```

<!-- back -->
