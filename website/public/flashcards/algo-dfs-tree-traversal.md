## Tree DFS Traversal: Preorder, Inorder, Postorder

**Question:** How do you implement tree traversals and when do you use each?

<!-- front -->

---

## Answer: Three Ways to Visit Each Node

### Recursive Implementations
```python
# Preorder: Root → Left → Right
def preorder(root):
    if not root:
        return []
    return [root.val] + preorder(root.left) + preorder(root.right)

# Inorder: Left → Root → Right
def inorder(root):
    if not root:
        return []
    return inorder(root.left) + [root.val] + inorder(root.right)

# Postorder: Left → Right → Root
def postorder(root):
    if not root:
        return []
    return postorder(root.left) + postorder(root.right) + [root.val]
```

### Iterative Implementations
```python
# Preorder - use stack
def preorder(root):
    if not root:
        return []
    
    result = []
    stack = [root]
    
    while stack:
        node = stack.pop()
        result.append(node.val)
        
        if node.right:
            stack.append(node.right)
        if node.left:
            stack.append(node.left)
    
    return result

# Inorder - use stack, go left first
def inorder(root):
    result = []
    stack = []
    curr = root
    
    while curr or stack:
        while curr:
            stack.append(curr)
            curr = curr.left
        
        curr = stack.pop()
        result.append(curr.val)
        curr = curr.right
    
    return result
```

### Visual: Traversal Order
```
        1
       / \
      2   3
     / \
    4   5

Preorder:  1 2 4 5 3     (Root first)
Inorder:   4 2 5 1 3     (Left-Root-Right)
Postorder: 4 5 2 3 1     (Left-Right-Root)
```

### ⚠️ Tricky Parts

#### 1. Order of Children in Stack
```python
# For preorder: push right first, then left
# This ensures left is processed first (LIFO)
stack.append(right)
stack.append(left)
```

#### 2. When to Use Each

| Traversal | Use Case |
|-----------|----------|
| Preorder | Copy tree, serialize, prefix expression |
| Inorder | BST (sorted order), Morris traversal |
| Postorder | Delete tree, postfix expression, bottom-up |

#### 3. Morris Traversal (Inorder without Stack)
```python
def inorder(root):
    result = []
    curr = root
    
    while curr:
        if not curr.left:
            result.append(curr.val)
            curr = curr.right
        else:
            # Find inorder predecessor
            pred = curr.left
            while pred.right and pred.right != curr:
                pred = pred.right
            
            if not pred.right:
                pred.right = curr
                curr = curr.left
            else:
                pred.right = None
                result.append(curr.val)
                curr = curr.right
    
    return result
```

### BST Validation with Inorder
```python
# Inorder of BST is sorted!
prev = float('-inf')

def isValidBST(root):
    global prev
    if not root:
        return True
    
    if not isValidBST(root.left):
        return False
    
    if root.val <= prev:
        return False
    prev = root.val
    
    return isValidBST(root.right)
```

### Iterative Postorder (Tricky!)
```python
def postorder(root):
    if not root:
        return []
    
    result = []
    stack = [root]
    
    while stack:
        node = stack.pop()
        result.append(node.val)
        
        if node.left:
            stack.append(node.left)
        if node.right:
            stack.append(node.right)
    
    return result[::-1]  # Reverse!
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Recursive | O(n) | O(h) call stack |
| Iterative | O(n) | O(h) stack |

h = height of tree (O(log n) balanced, O(n) skewed)

<!-- back -->
