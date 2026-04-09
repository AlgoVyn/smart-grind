## Tree DFS - Recursive Inorder Traversal: Forms

What are the different variations of inorder traversal problems?

<!-- front -->

---

### Form 1: Basic Inorder Traversal

Return all node values in inorder sequence.

```python
def inorder_traversal(root):
    """LeetCode 94: Binary Tree Inorder Traversal"""
    result = []
    
    def dfs(node):
        if not node:
            return
        dfs(node.left)
        result.append(node.val)
        dfs(node.right)
    
    dfs(root)
    return result
```

**Output:** List of values in Left → Root → Right order.

---

### Form 2: Validate Binary Search Tree

Check if tree satisfies BST property using inorder.

```python
def is_valid_bst(root):
    """LeetCode 98: Validate Binary Search Tree"""
    prev = float('-inf')
    is_valid = True
    
    def dfs(node):
        nonlocal prev, is_valid
        if not node or not is_valid:
            return
        
        dfs(node.left)
        
        if node.val <= prev:
            is_valid = False
            return
        prev = node.val
        
        dfs(node.right)
    
    dfs(root)
    return is_valid
```

**Key:** Inorder of valid BST must be strictly increasing.

---

### Form 3: Kth Smallest Element in BST

Find kth smallest using early termination.

```python
def kth_smallest(root, k):
    """LeetCode 230: Kth Smallest Element in a BST"""
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

**Optimization:** Stop traversal after finding kth element.

---

### Form 4: Binary Search Tree Iterator

Implement iterator using controlled inorder traversal.

```python
class BSTIterator:
    """LeetCode 173: Binary Search Tree Iterator"""
    
    def __init__(self, root):
        self.stack = []
        self._leftmost_inorder(root)
    
    def _leftmost_inorder(self, node):
        """Push all left nodes onto stack."""
        while node:
            self.stack.append(node)
            node = node.left
    
    def next(self):
        """Return next smallest number."""
        node = self.stack.pop()
        # If has right child, push its leftmost path
        if node.right:
            self._leftmost_inorder(node.right)
        return node.val
    
    def hasNext(self):
        """Return True if has next element."""
        return len(self.stack) > 0
```

**Pattern:** Lazy evaluation with explicit stack.

---

### Form 5: Recover Binary Search Tree

Fix BST where exactly two nodes were swapped.

```python
def recover_tree(root):
    """LeetCode 99: Recover Binary Search Tree"""
    first = second = prev = None
    
    def dfs(node):
        nonlocal first, second, prev
        if not node:
            return
        
        dfs(node.left)
        
        # Detect out-of-order pair
        if prev and prev.val > node.val:
            if not first:
                first = prev
            second = node
        prev = node
        
        dfs(node.right)
    
    dfs(root)
    # Swap values to fix
    first.val, second.val = second.val, first.val
```

**Key:** Find two violations in inorder sequence.

---

### Form 6: Minimum Absolute Difference in BST

Find min difference between any two nodes.

```python
def get_minimum_difference(root):
    """LeetCode 530: Minimum Absolute Difference in BST"""
    prev = None
    min_diff = float('inf')
    
    def dfs(node):
        nonlocal prev, min_diff
        if not node:
            return
        
        dfs(node.left)
        
        if prev is not None:
            min_diff = min(min_diff, node.val - prev)
        prev = node.val
        
        dfs(node.right)
    
    dfs(root)
    return min_diff
```

**Insight:** Min diff is always between adjacent inorder elements.

---

### Form Comparison Summary

| Form | Problem | Key Twist | Output |
|------|---------|-----------|--------|
| **Basic** | Binary Tree Inorder Traversal | None | List of values |
| **Validation** | Validate BST | Check increasing order | Boolean |
| **Kth Element** | Kth Smallest in BST | Early termination | kth value |
| **Iterator** | BST Iterator | Controlled traversal | Iterator object |
| **Recovery** | Recover BST | Find swapped nodes | Modified tree |
| **Min Diff** | Min Abs Difference in BST | Compare adjacent | Integer diff |

---

### Related Inorder Problems

| Problem | Pattern | Key Idea |
|---------|---------|----------|
| Inorder Successor in BST | BST property | Leftmost in right subtree |
| Inorder Predecessor in BST | BST property | Rightmost in left subtree |
| Two Sum IV - Input is a BST | Two pointer | Inorder + two sum pattern |
| Closest BST Value | Binary search | Inorder-like traversal |
| Construct Tree from Inorder + Postorder | Tree building | Root from postorder, split by inorder |

<!-- back -->
