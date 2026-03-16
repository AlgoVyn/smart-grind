## DFS Inorder Traversal

**Question:** Perform inorder traversal (left-root-right)?

<!-- front -->

---

## Answer: Recursive and Iterative

### Recursive Solution
```python
def inorder(root):
    result = []
    
    def traverse(node):
        if not node:
            return
        traverse(node.left)        # Left
        result.append(node.val)    # Visit root
        traverse(node.right)       # Right
    
    traverse(root)
    return result
```

### Iterative Solution
```python
def inorderIterative(root):
    result = []
    stack = []
    current = root
    
    while current or stack:
        # Go to leftmost
        while current:
            stack.append(current)
            current = current.left
        
        # Process current
        current = stack.pop()
        result.append(current.val)
        
        # Move to right
        current = current.right
    
    return result
```

### Visual: Inorder (BST gives sorted!)
```
Tree:          Visit Order:
    2              1
   / \            2, 3
  1   3          (sorted for BST)

Result: [1, 2, 3]
```

### ⚠️ Tricky Parts

#### 1. Inorder on BST is Sorted!
```python
# Inorder traversal of BST gives sorted order
# Very useful property!

# Can verify if BST is valid using inorder
```

#### 2. Iterative Needs Inner Loop
```python
# Must go to leftmost first
# Then process, then go right
# Use while loop inside while loop
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Recursive | O(n) | O(h) |
| Iterative | O(n) | O(h) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Wrong order | Left→Root→Right |
| Iterative: missing inner loop | Go to leftmost first |
| Forgetting to move current | Move to right subtree |

<!-- back -->
