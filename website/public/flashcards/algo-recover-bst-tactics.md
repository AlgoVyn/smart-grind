## Recover BST: Tactics & Techniques

What are the tactical patterns for BST recovery problems?

<!-- front -->

---

### Tactic 1: Track Previous Node

The key is maintaining the previous node in inorder traversal:

```python
def inorder_with_prev(node):
    nonlocal prev, first, second
    if not node:
        return
    
    inorder_with_prev(node.left)
    
    # Process node
    if prev and prev.val > node.val:
        # Found violation
        if not first:
            first = prev
        second = node
    
    prev = node  # Update for next iteration
    
    inorder_with_prev(node.right)
```

---

### Tactic 2: Handle Both Cases

```python
def find_swapped_nodes(root):
    """
    Returns (first, second) nodes to swap.
    Handles both adjacent and non-adjacent cases.
    """
    first = second = prev = None
    
    def inorder(node):
        nonlocal first, second, prev
        if not node:
            return
        
        inorder(node.left)
        
        if prev and prev.val > node.val:
            # First violation
            if not first:
                first = prev
                second = node  # Tentative
            else:
                # Second violation
                second = node  # Update
        
        prev = node
        inorder(node.right)
    
    inorder(root)
    return first, second
```

---

### Tactic 3: Morris Traversal for Space

When O(1) space is required:

```python
def recover_tree_o1_space(root):
    """
    Morris traversal uses threaded pointers instead of stack.
    Temporarily modifies tree structure during traversal.
    """
    current = root
    first = second = prev = None
    
    while current:
        if not current.left:
            # Same as regular inorder processing
            process_node(current)
            current = current.right
        else:
            # Find predecessor
            pred = current.left
            while pred.right and pred.right != current:
                pred = pred.right
            
            if not pred.right:
                # Create thread
                pred.right = current
                current = current.left
            else:
                # Remove thread and process
                pred.right = None
                process_node(current)
                current = current.right
```

---

### Tactic 4: Value vs Node Swap

| Swap Type | Difficulty | When Needed |
|-----------|-----------|-------------|
| Values | Easy | Most cases |
| Pointers | Hard | External references exist |

```python
# Value swap (preferred)
first.val, second.val = second.val, first.val

# Node pointer swap (complex)
# Need to handle:
# - Parent pointers
# - Child pointers  
# - Root update
# Avoid unless absolutely necessary
```

---

### Tactic 5: Test and Validate

```python
def recover_and_validate(root):
    """
    Recover tree and verify it's now valid.
    """
    recover_tree(root)
    
    # Validate
    def is_valid(node, min_val, max_val):
        if not node:
            return True
        if node.val <= min_val or node.val >= max_val:
            return False
        return (is_valid(node.left, min_val, node.val) and
                is_valid(node.right, node.val, max_val))
    
    return is_valid(root, float('-inf'), float('inf'))
```

<!-- back -->
