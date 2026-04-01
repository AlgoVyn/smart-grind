## DFS Preorder: Tactics & Tricks

What are the essential tactics for preorder traversal problems?

<!-- front -->

---

### Tactic 1: Pass State Down

```python
def preorder_with_state(root):
    """
    Pass accumulated state to children
    """
    def dfs(node, depth, path_sum, max_so_far):
        if not node:
            return
        
        # Update state with current node
        new_depth = depth + 1
        new_sum = path_sum + node.val
        new_max = max(max_so_far, node.val)
        
        # Process at this node if needed
        process(node, new_depth, new_sum, new_max)
        
        # Pass to children
        dfs(node.left, new_depth, new_sum, new_max)
        dfs(node.right, new_depth, new_sum, new_max)
    
    dfs(root, 0, 0, float('-inf'))
```

---

### Tactic 2: Iterative with Explicit Stack State

```python
def preorder_with_iterative_state(root):
    """
    Maintain state in iterative version
    """
    if not root:
        return
    
    # Stack: (node, state)
    stack = [(root, initial_state)]
    
    while stack:
        node, state = stack.pop()
        
        # Process node
        result = process(node, state)
        
        # Push children with updated state
        if node.right:
            stack.append((node.right, update_state(state, result)))
        if node.left:
            stack.append((node.left, update_state(state, result)))
```

---

### Tactic 3: Global Path Tracking

```python
def all_root_to_leaf_paths(root):
    """
    Track path as you traverse
    """
    all_paths = []
    current_path = []
    
    def dfs(node):
        if not node:
            return
        
        current_path.append(node.val)
        
        if not node.left and not node.right:
            all_paths.append(list(current_path))
        else:
            dfs(node.left)
            dfs(node.right)
        
        current_path.pop()  # Backtrack
    
    dfs(root)
    return all_paths
```

---

### Tactic 4: Preorder for Search with Pruning

```python
def search_with_pruning(root, target):
    """
    Stop exploring branches that can't contain answer
    """
    found = [False]
    
    def dfs(node, current):
        if not node or found[0]:
            return
        
        new_current = combine(current, node.val)
        
        # Prune if this path can't lead to answer
        if not can_lead_to_answer(new_current, target):
            return
        
        if is_answer(new_current, target):
            found[0] = True
            return
        
        dfs(node.left, new_current)
        dfs(node.right, new_current)
    
    dfs(root, initial_value)
    return found[0]
```

---

### Tactic 5: Preorder Index Tracking

```python
def construct_from_traversal(preorder, inorder):
    """
    Use index instead of slicing for O(1) extra space
    """
    def build(pre_start, pre_end, in_start, in_end):
        if pre_start > pre_end or in_start > in_end:
            return None
        
        root_val = preorder[pre_start]
        root = TreeNode(root_val)
        
        root_idx = inorder_index[root_val]  # Precomputed
        left_size = root_idx - in_start
        
        root.left = build(
            pre_start + 1,
            pre_start + left_size,
            in_start,
            root_idx - 1
        )
        root.right = build(
            pre_start + left_size + 1,
            pre_end,
            root_idx + 1,
            in_end
        )
        
        return root
    
    # Precompute inorder indices
    inorder_index = {val: i for i, val in enumerate(inorder)}
    return build(0, len(preorder) - 1, 0, len(inorder) - 1)
```

<!-- back -->
