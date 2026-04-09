## Stack - Simulation / Backtracking Helper: Forms

What are the different variations and forms of stack simulation patterns?

<!-- front -->

---

### Form 1: Simple Node Stack (Pre-order)

Basic DFS with just nodes in stack.

```python
def preorder_simple(root: TreeNode) -> list[int]:
    """Basic pre-order with node-only stack."""
    if not root:
        return []
    
    result = []
    stack = [root]
    
    while stack:
        node = stack.pop()
        result.append(node.val)
        
        if node.right:
            stack.append(node.right)
        if node.left:
            stack.append(node.left)
    
    return result
```

---

### Form 2: State Tuple Stack (Accumulated Values)

Stack elements include accumulated context.

```python
def path_sum_exists(root: TreeNode, target: int) -> bool:
    """Stack with (node, current_sum) tuples."""
    if not root:
        return False
    
    stack = [(root, root.val)]
    
    while stack:
        node, current_sum = stack.pop()
        
        if not node.left and not node.right and current_sum == target:
            return True
        
        if node.right:
            stack.append((node.right, current_sum + node.right.val))
        if node.left:
            stack.append((node.left, current_sum + node.left.val))
    
    return False
```

---

### Form 3: Visited Flag Pattern (Post-order)

Track whether node has been processed before.

```python
def postorder_visited(root: TreeNode) -> list[int]:
    """Post-order with boolean visited flag."""
    result = []
    if not root:
        return result
    
    # (node, visited)
    stack = [(root, False)]
    
    while stack:
        node, visited = stack.pop()
        
        if visited:
            result.append(node.val)
        else:
            stack.append((node, True))
            if node.right:
                stack.append((node.right, False))
            if node.left:
                stack.append((node.left, False))
    
    return result
```

---

### Form 4: In-order with Current Pointer

Classic pattern for in-order without visited flag.

```python
def inorder_current_pointer(root: TreeNode) -> list[int]:
    """In-order using current pointer + stack."""
    result = []
    stack = []
    current = root
    
    while current or stack:
        while current:
            stack.append(current)
            current = current.left
        
        current = stack.pop()
        result.append(current.val)
        current = current.right
    
    return result
```

---

### Form 5: Full Path Tracking

Store complete path for reconstruction problems.

```python
def all_paths_with_sum(root: TreeNode, target: int) -> list[list[int]]:
    """Track full path in stack elements."""
    result = []
    if not root:
        return result
    
    # (node, current_sum, path_list)
    stack = [(root, root.val, [root.val])]
    
    while stack:
        node, current_sum, path = stack.pop()
        
        if not node.left and not node.right and current_sum == target:
            result.append(path)
            continue
        
        if node.right:
            stack.append((node.right, 
                         current_sum + node.right.val, 
                         path + [node.right.val]))
        if node.left:
            stack.append((node.left, 
                         current_sum + node.left.val, 
                         path + [node.left.val]))
    
    return result
```

---

### Form Comparison

| Form | Stack Element | Use Case | Space |
|------|---------------|----------|-------|
| Simple | `node` | Basic traversal | O(h) |
| State tuple | `(node, value)` | Accumulated sums | O(h) |
| Visited flag | `(node, bool)` | Post-order | O(h) |
| Current pointer | `node` + external | In-order | O(h) |
| Full path | `(node, val, path)` | Path reconstruction | O(h × path_len) |

---

### Form 6: Simplify Path (String Processing)

Stack for path navigation (non-tree application).

```python
def simplify_path(path: str) -> str:
    """
    Simplify Unix-style file path.
    LeetCode 71 - Simplify Path
    """
    stack = []
    components = path.split('/')
    
    for component in components:
        if component == '..':
            if stack:
                stack.pop()  # Backtrack
        elif component and component != '.':
            stack.append(component)
    
    return '/' + '/'.join(stack)
```

---

### Form 7: Decode String (Nested Structure)

Stack for parsing nested patterns.

```python
def decode_string_nested(s: str) -> str:
    """
    Decode nested k[encoded_string] patterns.
    """
    stack = []
    current_str = ""
    current_num = 0
    
    for char in s:
        if char.isdigit():
            current_num = current_num * 10 + int(char)
        elif char == '[':
            stack.append((current_str, current_num))
            current_str = ""
            current_num = 0
        elif char == ']':
            prev_str, num = stack.pop()
            current_str = prev_str + num * current_str
        else:
            current_str += char
    
    return current_str
```

---

### Form Selection Guide

**Choosing the right form:**

| Problem Type | Recommended Form | Why |
|--------------|------------------|-----|
| Simple tree traversal | Simple node stack | Clean, minimal state |
| Path sum check | State tuple | Track accumulated value |
| Post-order needed | Visited flag | Handle children before parent |
| In-order needed | Current pointer | Standard pattern |
| All paths | Full path tracking | Reconstruct paths |
| String parsing | Context stack | Store previous context |
| Backtracking search | State tuple with depth | Track all context |

<!-- back -->
