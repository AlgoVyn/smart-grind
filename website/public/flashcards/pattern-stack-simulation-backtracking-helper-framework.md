## Stack - Simulation / Backtracking Helper: Framework

What is the complete code template for solving backtracking/stack simulation problems iteratively?

<!-- front -->

---

### Framework: Stack Simulation / Backtracking Helper

```
┌─────────────────────────────────────────────────────────────────────┐
│  STACK SIMULATION / BACKTRACKING HELPER - TEMPLATE                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Key Insight: Simulate call stack explicitly to avoid recursion    │
│                                                                     │
│  1. Initialize stack with starting state:                            │
│     - stack = [(initial_state, context)]                             │
│                                                                     │
│  2. While stack not empty:                                           │
│     - Pop (state, context) from stack                               │
│     - Process state (check base case/result)                        │
│     - Push next states with updated context                         │
│       * Push right child before left for pre-order                  │
│       * Store accumulated values (sums, paths, etc.)                │
│                                                                     │
│  3. Key patterns by use case:                                        │
│     ├─ Tree DFS: (node)                                              │
│     │   stack = [root]                                               │
│     │   while stack:                                                 │
│     │       node = stack.pop()                                       │
│     │       process(node)                                            │
│     │       push children (right first)                              │
│     ├─ In-order: (node + visited flag OR use while to go left)      │
│     │   while current or stack:                                      │
│     │       while current: stack.push(current); current = left       │
│     │       current = stack.pop(); process; current = right          │
│     └─ Backtracking: (state, accumulated_data)                       │
│         stack = [(start, initial_value)]                             │
│         while stack:                                                 │
│             state, acc = stack.pop()                                 │
│             if terminal(state): check result                         │
│             else: push (next_state, acc + delta)                   │
│                                                                     │
│  4. State representation:                                            │
│     - Node reference + accumulated values (path sum, depth, etc.)  │
│     - Tuple: (node, current_sum, path, ...)                         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Implementation: Tree Traversal (Iterative DFS)

```python
def preorder_traversal(root: TreeNode) -> list[int]:
    """
    Pre-order: root, left, right.
    Push right first so left is processed first (LIFO).
    """
    if not root:
        return []
    
    result = []
    stack = [root]
    
    while stack:
        node = stack.pop()
        result.append(node.val)
        
        # Push right first (processed last = left first)
        if node.right:
            stack.append(node.right)
        if node.left:
            stack.append(node.left)
    
    return result
```

---

### Implementation: In-order Traversal (Classic Pattern)

```python
def inorder_traversal(root: TreeNode) -> list[int]:
    """
    In-order: left, root, right.
    Use while loop to reach leftmost, then process and go right.
    """
    result = []
    stack = []
    current = root
    
    while current or stack:
        # Go to leftmost node
        while current:
            stack.append(current)
            current = current.left
        
        # Process node
        current = stack.pop()
        result.append(current.val)
        
        # Visit right subtree
        current = current.right
    
    return result
```

---

### Implementation: Backtracking with Stack (Path Sum)

```python
def has_path_sum(root: TreeNode, target: int) -> bool:
    """
    Check if root-to-leaf path equals target.
    Stack stores (node, current_sum) pairs.
    """
    if not root:
        return False
    
    # Stack: each element is (node, accumulated_sum_from_root)
    stack = [(root, root.val)]
    
    while stack:
        node, current_sum = stack.pop()
        
        # Check if leaf with target sum
        if not node.left and not node.right:
            if current_sum == target:
                return True
            continue
        
        # Push children with updated sums
        if node.right:
            stack.append((node.right, current_sum + node.right.val))
        if node.left:
            stack.append((node.left, current_sum + node.left.val))
    
    return False
```

---

### Key Framework Elements

| Element | Purpose | Example |
|---------|---------|---------|
| `stack` | Explicit call stack simulation | `[root]` or `[(node, sum)]` |
| `while stack` | Continue until all states processed | Main loop |
| `state = stack.pop()` | Retrieve current state | Get node to process |
| Push order | Controls traversal order | Right before left for pre-order |
| State tuple | Store accumulated context | `(node, path_sum, depth)` |
| Base case check | Terminal condition in loop | Leaf node check |

---

### Common State Structures

```python
# Simple: Just the node
stack = [root]

# With accumulated value
stack = [(root, root.val)]  # Path sum

# With depth
stack = [(root, 0)]  # Depth tracking

# With path reconstruction
stack = [(root, [root.val])]  # Full path

# Multi-value tracking
stack = [(root, current_sum, current_depth, parent_ref)]
```

<!-- back -->
