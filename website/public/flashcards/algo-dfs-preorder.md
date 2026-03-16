## DFS Preorder Traversal

**Question:** Perform preorder traversal (root-left-right)?

<!-- front -->

---

## Answer: Recursive and Iterative

### Recursive Solution
```python
def preorder(root):
    result = []
    
    def traverse(node):
        if not node:
            return
        result.append(node.val)    # Visit root
        traverse(node.left)        # Left
        traverse(node.right)       # Right
    
    traverse(root)
    return result
```

### Iterative Solution
```python
def preorderIterative(root):
    if not root:
        return []
    
    result = []
    stack = [root]
    
    while stack:
        node = stack.pop()
        result.append(node.val)
        
        # Push right first (so left is processed first)
        if node.right:
            stack.append(node.right)
        if node.left:
            stack.append(node.left)
    
    return result
```

### Visual: Preorder
```
Tree:          Visit Order:
    1              1
   / \            2, 3
  2   3          4, 5, 6, 7

Result: [1, 2, 4, 5, 3, 6, 7]
```

### ⚠️ Tricky Parts

#### 1. When to Process Root?
```python
# Preorder: Root → Left → Right
# Root is processed FIRST before children

# Different from inorder (Left→Root→Right)
# Different from postorder (Left→Right→Root)
```

#### 2. Iterative: Right Before Left
```python
# Stack is LIFO
# Push right first, left second
# Left gets processed before right
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Recursive | O(n) | O(h) |
| Iterative | O(n) | O(h) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Wrong order | Remember: root-first |
| Iterative: wrong push order | Push right, then left |
| Missing base case | Handle null node |

<!-- back -->
