## DFS Postorder: Algorithm Framework

What are the complete implementations for postorder traversal?

<!-- front -->

---

### Recursive Implementation

```python
def postorder_recursive(root):
    """
    Simple recursive postorder traversal
    """
    result = []
    
    def traverse(node):
        if not node:
            return
        traverse(node.left)
        traverse(node.right)
        result.append(node.val)
    
    traverse(root)
    return result

# Generator version
def postorder_generator(root):
    if root:
        yield from postorder_generator(root.left)
        yield from postorder_generator(root.right)
        yield root.val
```

---

### Iterative with Two Stacks

```python
def postorder_two_stacks(root):
    """
    Easy to understand but uses O(n) space
    """
    if not root:
        return []
    
    stack1 = [root]
    stack2 = []
    
    while stack1:
        node = stack1.pop()
        stack2.append(node.val)
        
        # Push left first so right is processed first
        if node.left:
            stack1.append(node.left)
        if node.right:
            stack1.append(node.right)
    
    # stack2 has root-right-left, reverse for left-right-root
    return stack2[::-1]
```

---

### Iterative with One Stack (Optimal)

```python
def postorder_one_stack(root):
    """
    Single stack, O(h) space
    Track visited state
    """
    if not root:
        return []
    
    result = []
    stack = [(root, False)]  # (node, visited)
    
    while stack:
        node, visited = stack.pop()
        
        if visited:
            result.append(node.val)
        else:
            # Push in reverse order of processing
            stack.append((node, True))  # Visit after children
            if node.right:
                stack.append((node.right, False))
            if node.left:
                stack.append((node.left, False))
    
    return result
```

---

### Tree Height (Bottom-Up)

```python
def tree_height(root):
    """
    Compute height using postorder logic
    """
    if not root:
        return -1  # or 0 depending on definition
    
    left_height = tree_height(root.left)
    right_height = tree_height(root.right)
    
    return max(left_height, right_height) + 1
```

---

### Check Balanced Binary Tree

```python
def is_balanced(root):
    """
    Check if tree is height-balanced
    Bottom-up: check heights and balance simultaneously
    """
    def check_height(node):
        if not node:
            return 0
        
        left_height = check_height(node.left)
        if left_height == -1:
            return -1
        
        right_height = check_height(node.right)
        if right_height == -1:
            return -1
        
        if abs(left_height - right_height) > 1:
            return -1
        
        return max(left_height, right_height) + 1
    
    return check_height(root) != -1
```

<!-- back -->
