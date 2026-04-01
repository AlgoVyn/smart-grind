## DFS Inorder: Tactics & Tricks

What are the essential tactics for inorder traversal problems?

<!-- front -->

---

### Tactic 1: Use Iterative for Early Exit

```python
def find_first_greater(root, target):
    """
    Find first value > target in BST
    Iterative allows early termination
    """
    current = root
    result = None
    
    while current:
        if current.val > target:
            result = current.val
            current = current.left  # May find smaller valid
        else:
            current = current.right
    
    return result

# Compare to recursive - can't easily exit early
def find_first_greater_recursive(root, target):
    if not root:
        return None
    if root.val > target:
        left = find_first_greater_recursive(root.left, target)
        return min(root.val, left) if left else root.val
    else:
        return find_first_greater_recursive(root.right, target)
```

---

### Tactic 2: Morris Traversal for Space

```python
def when_to_use_morris():
    """
    Use Morris when:
    1. Space is critical (O(1) required)
    2. Can modify tree temporarily
    3. Don't need parent references
    4. Tree not too deep (thread overhead)
    
    Don't use when:
    1. Tree structure must not change
    2. Concurrent access possible
    3. Simple recursive/iterative suffices
    """
    pass
```

---

### Tactic 3: Reverse Inorder for Descending

```python
def reverse_inorder(root):
    """
    Right → Root → Left gives descending order
    Useful for: kth largest, reverse sorted list
    """
    result = []
    stack = []
    current = root
    
    while current or stack:
        while current:
            stack.append(current)
            current = current.right  # Go right first!
        
        current = stack.pop()
        result.append(current.val)
        current = current.left
    
    return result

# Or simply reverse regular inorder
def reverse_inorder_simple(root):
    return inorder(root)[::-1]
```

---

### Tactic 4: Successor and Predecessor

```python
class BSTWithNavigation:
    """
    Find inorder successor and predecessor
    """
    def successor(self, root, p):
        """Next node in inorder sequence"""
        succ = None
        while root:
            if p.val < root.val:
                succ = root
                root = root.left
            else:
                root = root.right
        return succ
    
    def predecessor(self, root, p):
        """Previous node in inorder sequence"""
        pred = None
        while root:
            if p.val > root.val:
                pred = root
                root = root.right
            else:
                root = root.left
        return pred
```

---

### Tactic 5: Track Previous for Comparisons

```python
def inorder_with_comparison(root):
    """
    Template for problems needing inorder comparison
    """
    stack = []
    current = root
    prev = None
    
    while current or stack:
        while current:
            stack.append(current)
            current = current.left
        
        current = stack.pop()
        
        # Process current with prev reference
        if prev:
            # Do comparison: current vs prev
            pass
        
        prev = current
        current = current.right
```

<!-- back -->
