## DFS Preorder: Algorithm Framework

What are the complete implementations for preorder traversal?

<!-- front -->

---

### Recursive Implementation

```python
def preorder_recursive(root):
    """
    Simple recursive preorder traversal
    """
    result = []
    
    def traverse(node):
        if not node:
            return
        result.append(node.val)
        traverse(node.left)
        traverse(node.right)
    
    traverse(root)
    return result

# Generator version
def preorder_generator(root):
    if root:
        yield root.val
        yield from preorder_generator(root.left)
        yield from preorder_generator(root.right)
```

---

### Iterative Implementation

```python
def preorder_iterative(root):
    """
    Iterative preorder using stack
    """
    if not root:
        return []
    
    result = []
    stack = [root]
    
    while stack:
        node = stack.pop()
        result.append(node.val)
        
        # Push right first so left is processed first
        if node.right:
            stack.append(node.right)
        if node.left:
            stack.append(node.left)
    
    return result
```

---

### Morris Preorder Traversal

```python
def preorder_morris(root):
    """
    O(1) space preorder traversal
    """
    result = []
    current = root
    
    while current:
        if not current.left:
            result.append(current.val)
            current = current.right
        else:
            # Find predecessor
            predecessor = current.left
            while predecessor.right and predecessor.right != current:
                predecessor = predecessor.right
            
            if not predecessor.right:
                # Create thread, process current (preorder!)
                result.append(current.val)
                predecessor.right = current
                current = current.left
            else:
                # Remove thread
                predecessor.right = None
                current = current.right
    
    return result
```

---

### Path Sum Root to Leaf

```python
def has_path_sum(root, target):
    """
    Check if any root-to-leaf path sums to target
    """
    if not root:
        return False
    
    # Leaf check
    if not root.left and not root.right:
        return root.val == target
    
    # Pass remaining sum to children
    remaining = target - root.val
    return (has_path_sum(root.left, remaining) or
            has_path_sum(root.right, remaining))
```

---

### Serialize with Markers

```python
def serialize_preorder(root):
    """
    Serialize tree to string with null markers
    """
    def build(node):
        if not node:
            return "null"
        return f"{node.val},{build(node.left)},{build(node.right)}"
    
    return build(root)

def deserialize_preorder(data):
    """
    Deserialize from preorder string
    """
    vals = iter(data.split(","))
    
    def build():
        val = next(vals)
        if val == "null":
            return None
        node = TreeNode(int(val))
        node.left = build()
        node.right = build()
        return node
    
    return build()
```

<!-- back -->
