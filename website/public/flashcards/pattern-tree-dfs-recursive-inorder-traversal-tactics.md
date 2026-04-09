## Tree DFS - Recursive Inorder Traversal: Tactics

What are the advanced techniques and variations for inorder traversal?

<!-- front -->

---

### Tactic 1: Kth Smallest Element in BST

Stop traversal early once k elements are found.

```python
def kth_smallest(root, k):
    """Find kth smallest element in BST using inorder."""
    result = None
    count = 0
    
    def dfs(node):
        nonlocal result, count
        if not node or result is not None:
            return
        
        dfs(node.left)
        
        count += 1
        if count == k:
            result = node.val
            return
        
        dfs(node.right)
    
    dfs(root)
    return result
```

**Key Insight:** Inorder on BST gives sorted order. Stop at kth element.

---

### Tactic 2: Validate Binary Search Tree

Check if inorder sequence is strictly increasing.

```python
def is_valid_bst(root):
    """Validate BST using inorder property."""
    prev = float('-inf')
    is_valid = True
    
    def dfs(node):
        nonlocal prev, is_valid
        if not node or not is_valid:
            return
        
        dfs(node.left)
        
        # Check current against previous
        if node.val <= prev:
            is_valid = False
            return
        prev = node.val
        
        dfs(node.right)
    
    dfs(root)
    return is_valid
```

---

### Tactic 3: Iterative Inorder (Stack-Based)

Avoid recursion depth limits with explicit stack.

```python
def inorder_iterative(root):
    """Iterative inorder using stack."""
    result = []
    stack = []
    current = root
    
    while current or stack:
        # Go to leftmost node
        while current:
            stack.append(current)
            current = current.left
        
        # Pop and visit
        current = stack.pop()
        result.append(current.val)
        
        # Visit right subtree
        current = current.right
    
    return result
```

**Use When:** Very deep trees where recursion might overflow.

---

### Tactic 4: Morris Traversal (O(1) Space)

Threaded binary tree for constant space traversal.

```python
def morris_inorder(root):
    """O(1) space inorder using temporary threads."""
    result = []
    current = root
    
    while current:
        if not current.left:
            # No left subtree, visit and go right
            result.append(current.val)
            current = current.right
        else:
            # Find predecessor (rightmost in left subtree)
            predecessor = current.left
            while predecessor.right and predecessor.right != current:
                predecessor = predecessor.right
            
            if not predecessor.right:
                # Create thread and go left
                predecessor.right = current
                current = current.left
            else:
                # Thread exists, visit and go right
                predecessor.right = None
                result.append(current.val)
                current = current.right
    
    return result
```

**Trade-off:** Modifies tree temporarily, O(1) space.

---

### Tactic 5: Inorder Successor/Predecessor

Find next/previous node in inorder sequence.

```python
def inorder_successor(root, target):
    """Find inorder successor in BST."""
    successor = None
    current = root
    
    while current:
        if target.val < current.val:
            successor = current
            current = current.left
        else:
            current = current.right
    
    return successor

def inorder_predecessor(root, target):
    """Find inorder predecessor in BST."""
    predecessor = None
    current = root
    
    while current:
        if target.val > current.val:
            predecessor = current
            current = current.right
        else:
            current = current.left
    
    return predecessor
```

---

### Tactic 6: Common Pitfalls & Fixes

| Pitfall | Issue | Fix |
|---------|-------|-----|
| **Wrong order** | Root before left = preorder | Remember: Left → Root → Right |
| **Forgetting base case** | Infinite recursion | Always check `if not node: return` |
| **Not capturing result** | Empty output | Use closure or instance variable |
| **BST assumption** | Sorted output on non-BST | Only BST guarantees sorted order |
| **Stack overflow** | Deep trees crash | Use iterative or Morris traversal |
| **Null root** | Crash on empty tree | Handle `if not root: return []` |

---

### Tactic 7: Recover BST (Two Swapped Nodes)

Find and fix two swapped nodes using inorder.

```python
def recover_tree(root):
    """Recover BST where two nodes were swapped."""
    first = second = prev = None
    
    def dfs(node):
        nonlocal first, second, prev
        if not node:
            return
        
        dfs(node.left)
        
        # Find violations of sorted order
        if prev and prev.val > node.val:
            if not first:
                first = prev
            second = node
        prev = node
        
        dfs(node.right)
    
    dfs(root)
    # Swap values back
    first.val, second.val = second.val, first.val
```

<!-- back -->
