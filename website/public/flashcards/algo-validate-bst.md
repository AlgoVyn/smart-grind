## Validate Binary Search Tree

**Question:** Determine if binary tree is valid BST?

<!-- front -->

---

## Answer: Recursive with Bounds

### Solution
```python
def isValidBST(root):
    def validate(node, low, high):
        # Empty trees are valid
        if not node:
            return True
        
        # Current node must be in valid range
        if node.val <= low or node.val >= high:
            return False
        
        # Recursively validate subtrees
        return validate(node.left, low, node.val) and \
               validate(node.right, node.val, high)
    
    return validate(root, float('-inf'), float('inf'))
```

### Visual: BST Validation with Bounds
```
        5
       / \
      1   6
         / \
        3   7  ← Invalid! 3 < 5 but in right subtree

Node 6: Valid range (5, inf)
  Left child 3: 3 <= 5? YES → Invalid!
  
All nodes must satisfy:
- Left subtree: all < current
- Right subtree: all > current
```

### ⚠️ Tricky Parts

#### 1. Why Use Bounds?
```python
# Not enough to check:
# node.left.val < node.val < node.right.val

# Must ensure ALL left values < node < ALL right values

# Use low/high bounds inherited from ancestors
```

#### 2. Float('inf') for Edge Cases
```python
# Use float('-inf') and float('inf')
# Any real number will satisfy:
# - val > float('-inf')
# - val < float('inf')
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Inorder traversal | O(n) | O(h) |
| Recursive bounds | O(n) | O(h) |

h = height (recursion stack)

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Only checking immediate children | Use bounds from ancestors |
| Using integer limits | Use float('inf') |
| Not handling empty tree | Base case returns True |

<!-- back -->
