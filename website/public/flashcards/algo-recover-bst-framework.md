## Recover BST: Framework

What are the complete implementations for recovering a BST?

<!-- front -->

---

### Recursive Inorder Solution

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def recover_tree(root):
    """
    Recover BST with two swapped nodes.
    O(n) time, O(h) space.
    """
    first = second = prev = None
    
    def inorder(node):
        nonlocal first, second, prev
        if not node:
            return
        
        # Traverse left
        inorder(node.left)
        
        # Check for violation
        if prev and prev.val > node.val:
            if not first:
                first = prev  # First violation
            second = node     # Second violation (or update)
        
        prev = node
        
        # Traverse right
        inorder(node.right)
    
    inorder(root)
    
    # Swap values
    first.val, second.val = second.val, first.val
```

---

### Iterative Solution

```python
def recover_tree_iterative(root):
    """
    O(n) time, O(h) space using explicit stack.
    """
    first = second = prev = None
    stack = []
    current = root
    
    while stack or current:
        # Go to leftmost
        while current:
            stack.append(current)
            current = current.left
        
        # Process node
        node = stack.pop()
        
        if prev and prev.val > node.val:
            if not first:
                first = prev
            second = node
        
        prev = node
        current = node.right
    
    # Swap values
    first.val, second.val = second.val, first.val
```

---

### Morris Traversal (O(1) Space)

```python
def recover_tree_morris(root):
    """
    O(n) time, O(1) space using Morris inorder traversal.
    """
    first = second = prev = None
    current = root
    
    while current:
        if not current.left:
            # Process current (no left subtree)
            if prev and prev.val > current.val:
                if not first:
                    first = prev
                second = current
            prev = current
            current = current.right
        else:
            # Find inorder predecessor
            predecessor = current.left
            while predecessor.right and predecessor.right != current:
                predecessor = predecessor.right
            
            if not predecessor.right:
                # Create temporary link
                predecessor.right = current
                current = current.left
            else:
                # Remove temporary link and process
                predecessor.right = None
                if prev and prev.val > current.val:
                    if not first:
                        first = prev
                    second = current
                prev = current
                current = current.right
    
    # Swap values
    first.val, second.val = second.val, first.val
```

---

### With Parent Pointers

```python
def recover_tree_with_parent(root):
    """
    Alternative: Store parent references first.
    Useful if need to swap nodes (not just values).
    """
    # First pass: find violations
    violations = []
    prev = None
    
    def find_violations(node):
        nonlocal prev
        if not node:
            return
        find_violations(node.left)
        
        if prev and prev.val > node.val:
            violations.append((prev, node))
        prev = node
        
        find_violations(node.right)
    
    find_violations(root)
    
    # Determine which nodes to swap
    if len(violations) == 1:
        first, second = violations[0]
    else:
        first = violations[0][0]
        second = violations[1][1]
    
    # Swap node values
    first.val, second.val = second.val, first.val
```

---

### Swap Nodes (Not Values)

```python
def recover_tree_swap_nodes(root):
    """
    Actually swap node pointers, not just values.
    Much more complex - rarely needed.
    """
    # This requires finding parents and carefully
    # rewiring pointers. Omitted for brevity.
    # In practice, swapping values is sufficient.
    pass
```

<!-- back -->
