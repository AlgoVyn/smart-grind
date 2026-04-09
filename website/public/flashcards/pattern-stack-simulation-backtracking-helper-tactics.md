## Stack - Simulation / Backtracking Helper: Tactics

What are the advanced techniques and variations for stack simulation problems?

<!-- front -->

---

### Tactic 1: Post-order Traversal (Two Stacks Method)

Use two stacks: first for reverse post-order, second to reverse it.

```python
def postorder_traversal(root: TreeNode) -> list[int]:
    """
    Post-order: left, right, root.
    Use two stacks approach.
    """
    if not root:
        return []
    
    stack1 = [root]
    stack2 = []
    
    while stack1:
        node = stack1.pop()
        stack2.append(node)
        
        # Push left first (so right processed first in stack2 reverse)
        if node.left:
            stack1.append(node.left)
        if node.right:
            stack1.append(node.right)
    
    # stack2 has nodes in reverse post-order
    return [node.val for node in reversed(stack2)]
```

---

### Tactic 2: Post-order with Visited Flag

Single stack with state tracking to avoid second stack.

```python
def postorder_visited_flag(root: TreeNode) -> list[int]:
    """
    Post-order with visited flag to distinguish first vs second visit.
    """
    result = []
    stack = [(root, False)] if root else []
    
    while stack:
        node, visited = stack.pop()
        
        if visited:
            result.append(node.val)
        else:
            # Push in reverse order of processing:
            # root (mark visited), right, left
            stack.append((node, True))
            if node.right:
                stack.append((node.right, False))
            if node.left:
                stack.append((node.left, False))
    
    return result
```

---

### Tactic 3: Track Path for Reconstruction

Store full path in stack element for path reconstruction.

```python
def path_sum_ii(root: TreeNode, target: int) -> list[list[int]]:
    """
    Find all root-to-leaf paths that sum to target.
    LeetCode 113 - Path Sum II (iterative version)
    """
    result = []
    if not root:
        return result
    
    # Stack: (node, current_sum, path_so_far)
    stack = [(root, root.val, [root.val])]
    
    while stack:
        node, current_sum, path = stack.pop()
        
        # Check leaf
        if not node.left and not node.right:
            if current_sum == target:
                result.append(path[:])  # Copy path
            continue
        
        # Push children with extended path
        if node.right:
            new_path = path + [node.right.val]
            stack.append((node.right, current_sum + node.right.val, new_path))
        if node.left:
            new_path = path + [node.left.val]
            stack.append((node.left, current_sum + node.left.val, new_path))
    
    return result
```

---

### Tactic 4: Morris Traversal (O(1) Space)

Threaded binary tree for true O(1) space traversal.

```python
def morris_inorder(root: TreeNode) -> list[int]:
    """
    In-order with O(1) space using threaded trees.
    Modifies tree temporarily during traversal.
    """
    result = []
    current = root
    
    while current:
        if not current.left:
            result.append(current.val)
            current = current.right
        else:
            # Find in-order predecessor
            predecessor = current.left
            while predecessor.right and predecessor.right != current:
                predecessor = predecessor.right
            
            if not predecessor.right:
                # Create thread
                predecessor.right = current
                current = current.left
            else:
                # Remove thread and process
                predecessor.right = None
                result.append(current.val)
                current = current.right
    
    return result
```

**When to use:** Extreme memory constraints, very large trees.

---

### Tactic 5: Level-order with Two Queues (Simulation)

Not stack-based, but contrast with BFS pattern:

```python
def level_order_with_level_tracking(root: TreeNode) -> list[list[int]]:
    """
    Level order using queue (BFS) - for comparison.
    Stack gives depth-first, queue gives breadth-first.
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(level)
    
    return result
```

---

### Tactic 6: Generic Backtracking Template

For non-tree backtracking problems (combinatorial search).

```python
def iterative_backtrack(options, is_valid, is_solution):
    """
    Generic iterative backtracking template.
    """
    # Stack: (current_state, remaining_options, path)
    stack = [(initial_state, options[:], [])]
    solutions = []
    
    while stack:
        state, remaining, path = stack.pop()
        
        if is_solution(state):
            solutions.append(path[:])
            continue
        
        for i, option in enumerate(remaining):
            new_state = apply(state, option)
            if is_valid(new_state):
                new_remaining = remaining[i+1:]
                new_path = path + [option]
                stack.append((new_state, new_remaining, new_path))
    
    return solutions
```

---

### Tactic 7: Common Pitfalls & Fixes

| Pitfall | Issue | Fix |
|---------|-------|-----|
| **Null checks** | Pushing None causes errors | Check `if node:` before push |
| **Wrong push order** | Left/right reversed | Remember LIFO: push right first for left-first processing |
| **Insufficient state** | Missing accumulated data | Include all context in stack tuple |
| **Modifying while iterating** | Changing tree structure | Copy values if needed, don't modify input |
| **Path reference issue** | Appending same list reference | Use `path[:]` to copy before storing |

---

### Tactic 8: Decode String (Nested Structure)

Stack for parsing nested structures.

```python
def decode_string(s: str) -> str:
    """
    Decode k[encoded_string] pattern.
    LeetCode 394 - Decode String
    """
    stack = []
    current_string = ""
    current_num = 0
    
    for char in s:
        if char.isdigit():
            current_num = current_num * 10 + int(char)
        elif char == '[':
            # Push state and reset
            stack.append((current_string, current_num))
            current_string = ""
            current_num = 0
        elif char == ']':
            # Pop and decode
            prev_string, num = stack.pop()
            current_string = prev_string + num * current_string
        else:
            current_string += char
    
    return current_string
```

<!-- back -->
