## Tree - DFS Recursive Inorder: Framework

What is the complete code template for DFS inorder traversal?

<!-- front -->

---

### Framework 1: Recursive Inorder Template

```
┌─────────────────────────────────────────────────────┐
│  DFS INORDER TRAVERSAL - RECURSIVE TEMPLATE          │
├─────────────────────────────────────────────────────┤
│  function inorder(node):                            │
│    1. If node is None: return                        │
│    2. Recursively traverse left: inorder(node.left)  │
│    3. Process current node: visit(node)             │
│    4. Recursively traverse right: inorder(node.right)│
└─────────────────────────────────────────────────────┘
```

---

### Implementation

```python
def inorder_recursive(root):
    """Inorder traversal using recursion."""
    result = []
    
    def inorder(node):
        if not node:
            return
        
        inorder(node.left)      # Left
        result.append(node.val) # Root
        inorder(node.right)     # Right
    
    inorder(root)
    return result
```

---

### Framework 2: Iterative Using Stack

```python
def inorder_iterative(root):
    """Inorder traversal without recursion."""
    result = []
    stack = []
    current = root
    
    while current or stack:
        # Go to leftmost node
        while current:
            stack.append(current)
            current = current.left
        
        # Process node and move right
        current = stack.pop()
        result.append(current.val)
        current = current.right
    
    return result
```

---

### Framework 3: Morris Traversal (O(1) Space)

```python
def inorder_morris(root):
    """Inorder with O(1) space using threaded tree."""
    result = []
    current = root
    
    while current:
        if not current.left:
            result.append(current.val)
            current = current.right
        else:
            # Find inorder predecessor
            predecessor = current.left
            while predecessor.right and predecessor.right != current:
                predecessor = predecessor.right
            
            if not predecessor.right:
                # Create threaded link
                predecessor.right = current
                current = current.left
            else:
                # Remove threaded link and visit
                predecessor.right = None
                result.append(current.val)
                current = current.right
    
    return result
```

---

### Key Pattern Elements

| Element | Recursive | Iterative | Morris |
|---------|-----------|-----------|--------|
| Space | O(h) stack | O(h) explicit | O(1) |
| Left | Recursive call | Push to stack | Threaded link |
| Visit | In middle | On pop | After predecessor check |
| Right | Recursive call | Set current | Follow link |

<!-- back -->
