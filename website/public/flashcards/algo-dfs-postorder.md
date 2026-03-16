## DFS Postorder Traversal

**Question:** Perform postorder traversal (left-right-root)?

<!-- front -->

---

## Answer: Recursive and Iterative

### Recursive Solution
```python
def postorder(root):
    result = []
    
    def traverse(node):
        if not node:
            return
        traverse(node.left)        # Left
        traverse(node.right)       # Right
        result.append(node.val)    # Visit root
    
    traverse(root)
    return result
```

### Iterative Solution (Reverse of Preorder)
```python
def postorderIterative(root):
    if not root:
        return []
    
    result = []
    stack = [root]
    
    while stack:
        node = stack.pop()
        result.append(node.val)
        
        # Push left first, then right
        # Result will be reversed
        if node.left:
            stack.append(node.left)
        if node.right:
            stack.append(node.right)
    
    return result[::-1]  # Reverse
```

### Visual: Postorder
```
Tree:          Visit Order:
    1              4, 5, 2, 6, 7, 3, 1
   / \
  2   3
 / \ / \
4  5 6  7

Result: [4, 5, 2, 6, 7, 3, 1]
```

### ⚠️ Tricky Parts

#### 1. Root Visited Last
```python
# Postorder: Left → Right → Root
# Root is processed AFTER all children

# Useful for: delete tree, free memory
# Useful for: expression trees (evaluate)
```

#### 2. Iterative Trick
```python
# Postorder is reverse of:
# Root → Right → Left (modified preorder)

# 1. Do modified preorder (root, right, left)
# 2. Reverse the result

# This avoids complex stack management
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Recursive | O(n) | O(h) |
| Iterative | O(n) | O(h) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Wrong order | Left→Right→Root |
| Iterative: missing reverse | Reverse at the end |
| Confusing with preorder | Remember: root last |

<!-- back -->
