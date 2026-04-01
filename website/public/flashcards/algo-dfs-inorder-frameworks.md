## DFS Inorder: Algorithm Framework

What are the complete implementations for inorder traversal?

<!-- front -->

---

### Recursive Implementation

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder_recursive(root):
    """
    Simple recursive inorder traversal
    """
    result = []
    
    def traverse(node):
        if not node:
            return
        traverse(node.left)
        result.append(node.val)
        traverse(node.right)
    
    traverse(root)
    return result

# Generator version
def inorder_generator(root):
    if root:
        yield from inorder_generator(root.left)
        yield root.val
        yield from inorder_generator(root.right)
```

---

### Iterative with Stack

```python
def inorder_iterative(root):
    """
    Iterative inorder using explicit stack
    """
    result = []
    stack = []
    current = root
    
    while current or stack:
        # Go to leftmost node
        while current:
            stack.append(current)
            current = current.left
        
        # Process current and move right
        current = stack.pop()
        result.append(current.val)
        current = current.right
    
    return result
```

---

### Morris Traversal (O(1) Space)

```python
def inorder_morris(root):
    """
    Threaded binary tree traversal
    No stack, O(1) space
    """
    result = []
    current = root
    
    while current:
        if not current.left:
            # No left subtree, visit and go right
            result.append(current.val)
            current = current.right
        else:
            # Find inorder predecessor (rightmost in left subtree)
            predecessor = current.left
            while predecessor.right and predecessor.right != current:
                predecessor = predecessor.right
            
            if not predecessor.right:
                # Create thread
                predecessor.right = current
                current = current.left
            else:
                # Thread exists, remove it and visit
                predecessor.right = None
                result.append(current.val)
                current = current.right
    
    return result
```

---

### Kth Smallest (BST)

```python
def kth_smallest(root, k):
    """
    Find kth smallest in BST using inorder
    """
    stack = []
    current = root
    count = 0
    
    while current or stack:
        while current:
            stack.append(current)
            current = current.left
        
        current = stack.pop()
        count += 1
        
        if count == k:
            return current.val
        
        current = current.right
    
    return None
```

---

### Validate BST

```python
def is_valid_bst(root):
    """
    Check if tree is valid BST using inorder
    """
    stack = []
    current = root
    prev = float('-inf')
    
    while current or stack:
        while current:
            stack.append(current)
            current = current.left
        
        current = stack.pop()
        
        if current.val <= prev:
            return False
        prev = current.val
        
        current = current.right
    
    return True
```

<!-- back -->
