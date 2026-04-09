## LCA Finding: Forms & Variations

What are the different forms of LCA problems?

<!-- front -->

---

### Form 1: Binary Tree LCA (Standard)

```python
def lca_binary_tree(root, p, q):
    """
    Standard binary tree LCA using recursive DFS.
    LeetCode 236: Lowest Common Ancestor of a Binary Tree
    """
    if not root or root == p or root == q:
        return root
    
    left = lca_binary_tree(root.left, p, q)
    right = lca_binary_tree(root.right, p, q)
    
    if left and right:
        return root
    return left if left else right
```

---

### Form 2: BST LCA

```python
def lca_bst(root, p, q):
    """
    Leverage BST property for O(h) solution.
    LeetCode 235: Lowest Common Ancestor of a Binary Search Tree
    """
    while root:
        if p.val < root.val and q.val < root.val:
            root = root.left
        elif p.val > root.val and q.val > root.val:
            root = root.right
        else:
            return root
    return None

# Recursive version
def lca_bst_recursive(root, p, q):
    if p.val < root.val and q.val < root.val:
        return lca_bst_recursive(root.left, p, q)
    elif p.val > root.val and q.val > root.val:
        return lca_bst_recursive(root.right, p, q)
    else:
        return root
```

---

### Form 3: N-ary Tree LCA (with parent pointers)

```python
def lca_nary_tree(root, p, q):
    """
    For N-ary trees, parent pointers help.
    Approach: Build depth map, lift deeper node, then lift together.
    """
    # Step 1: BFS to get parent and depth for all nodes
    parent = {root: None}
    depth = {root: 0}
    
    from collections import deque
    queue = deque([root])
    
    while queue:
        node = queue.popleft()
        for child in node.children:
            parent[child] = node
            depth[child] = depth[node] + 1
            queue.append(child)
    
    # Step 2: Lift deeper node to same depth
    while depth[p] > depth[q]:
        p = parent[p]
    while depth[q] > depth[p]:
        q = parent[q]
    
    # Step 3: Lift both until they meet
    while p != q:
        p = parent[p]
        q = parent[q]
    
    return p
```

---

### Form 4: LCA of Deepest Leaves

```python
def lca_deepest_leaves(root):
    """
    Find LCA of all nodes at maximum depth.
    LeetCode 1123: Lowest Common Ancestor of Deepest Leaves
    """
    def dfs(node):
        if not node:
            return (0, None)  # (depth, lca)
        
        left_depth, left_lca = dfs(node.left)
        right_depth, right_lca = dfs(node.right)
        
        if left_depth > right_depth:
            return (left_depth + 1, left_lca)
        elif right_depth > left_depth:
            return (right_depth + 1, right_lca)
        else:
            # Both subtrees have same max depth
            return (left_depth + 1, node)
    
    return dfs(root)[1]
```

---

### Form 5: LCA with Node Values (not references)

```python
def lca_by_value(root, p_val, q_val):
    """
    When given values instead of node references.
    Need to find nodes first, then compute LCA.
    """
    # First DFS to find the nodes
    def find_node(node, val):
        if not node:
            return None
        if node.val == val:
            return node
        left = find_node(node.left, val)
        if left:
            return left
        return find_node(node.right, val)
    
    p = find_node(root, p_val)
    q = find_node(root, q_val)
    
    # Then standard LCA
    if not p or not q:
        return None
    return lca_binary_tree(root, p, q)
```

---

### Form Summary

| Form | Key Difference | Approach |
|------|----------------|----------|
| Binary Tree | Standard | Recursive DFS |
| BST | Ordered structure | Compare values |
| N-ary Tree | Multiple children | Parent pointers |
| Deepest Leaves | Find deepest first | Track depth in DFS |
| By Value | Find nodes first | Two-pass approach |

<!-- back -->
