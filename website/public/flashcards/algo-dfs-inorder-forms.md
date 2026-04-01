## DFS Inorder: Problem Forms

What are the variations and applications of inorder traversal?

<!-- front -->

---

### BST Iterator

```python
class BSTIterator:
    """
    Next() and hasNext() for BST in inorder
    """
    def __init__(self, root):
        self.stack = []
        self._leftmost_inorder(root)
    
    def _leftmost_inorder(self, node):
        while node:
            self.stack.append(node)
            node = node.left
    
    def next(self):
        top = self.stack.pop()
        if top.right:
            self._leftmost_inorder(top.right)
        return top.val
    
    def hasNext(self):
        return len(self.stack) > 0
```

---

### Recover BST (Two Swapped Nodes)

```python
def recover_tree(root):
    """
    Two nodes were swapped, find and fix them
    """
    stack = []
    current = root
    first = second = prev = None
    
    while current or stack:
        while current:
            stack.append(current)
            current = current.left
        
        current = stack.pop()
        
        if prev and current.val < prev.val:
            if not first:
                first = prev
            second = current
        
        prev = current
        current = current.right
    
    # Swap values
    first.val, second.val = second.val, first.val
```

---

### Convert to Doubly Linked List

```python
def tree_to_doubly_list(root):
    """
    Convert BST to sorted circular doubly-linked list
    In-place using inorder
    """
    if not root:
        return None
    
    first = last = None
    stack = []
    current = root
    
    while current or stack:
        while current:
            stack.append(current)
            current = current.left
        
        current = stack.pop()
        
        if last:
            last.right = current
            current.left = last
        else:
            first = current
        last = current
        
        current = current.right
    
    # Make circular
    first.left = last
    last.right = first
    
    return first
```

---

### Range Sum in BST

```python
def range_sum_bst(root, low, high):
    """
    Sum of values in range [low, high]
    Prune branches outside range
    """
    if not root:
        return 0
    
    # Pruning: if root < low, skip left subtree
    if root.val < low:
        return range_sum_bst(root.right, low, high)
    
    # Pruning: if root > high, skip right subtree
    if root.val > high:
        return range_sum_bst(root.left, low, high)
    
    # In range, include root and both subtrees
    return (root.val + 
            range_sum_bst(root.left, low, high) + 
            range_sum_bst(root.right, low, high))
```

---

### Inorder with State

```python
def inorder_with_depth(root):
    """
    Track depth during traversal
    """
    result = []
    
    def traverse(node, depth):
        if not node:
            return
        traverse(node.left, depth + 1)
        result.append((node.val, depth))
        traverse(node.right, depth + 1)
    
    traverse(root, 0)
    return result
```

<!-- back -->
