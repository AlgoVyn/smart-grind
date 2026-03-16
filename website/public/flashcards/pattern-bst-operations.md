## BST Operations: Insert, Delete, Search

**Question:** How do you implement BST operations efficiently?

<!-- front -->

---

## Answer: Leverage BST Property

### Search
```python
def search(root, val):
    if not root or root.val == val:
        return root
    
    if val < root.val:
        return search(root.left, val)
    return search(root.right, val)

# Iterative
def search(root, val):
    while root and root.val != val:
        if val < root.val:
            root = root.left
        else:
            root = root.right
    return root
```

### Insert
```python
def insert(root, val):
    if not root:
        return TreeNode(val)
    
    if val < root.val:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)
    
    return root
```

### Delete (Tricky!)
```python
def delete(root, val):
    if not root:
        return None
    
    if val < root.val:
        root.left = delete(root.left, val)
    elif val > root.val:
        root.right = delete(root.right, val)
    else:
        # Case 1: No children
        if not root.left and not root.right:
            return None
        
        # Case 2: One child
        if not root.left:
            return root.right
        if not root.right:
            return root.left
        
        # Case 3: Two children
        # Find inorder successor (smallest in right subtree)
        successor = find_min(root.right)
        root.val = successor.val
        root.right = delete(root.right, successor.val)
    
    return root

def find_min(node):
    while node.left:
        node = node.left
    return node
```

### Visual: Delete Cases
```
Case 1: No children
        5                    null
       /
      3     → remove 3 →

Case 2: One child
        5                    5
       /                     \
      3      → remove 3 →    4

Case 3: Two children
        5                    6 (successor)
       / \                  / \
      3   7        →      3   7
         /                    /
        6                    6
```

### ⚠️ Tricky Parts

#### 1. Delete Two Children
```python
# Two options: inorder successor OR predecessor
# Successor: smallest in right subtree
# Predecessor: largest in left subtree

# Use successor (more common)
def delete_two_children(root):
    successor = find_min(root.right)
    root.val = successor.val
    root.right = delete(root.right, successor.val)
```

#### 2. Iterative Insert vs Recursive
```python
# Recursive - simpler, returns new root
def insert(root, val):
    if not root:
        return TreeNode(val)
    # ... recursive calls
    return root

# Iterative - need to traverse to find position
def insert(root, val):
    if not root:
        return TreeNode(val)
    
    curr = root
    while True:
        if val < curr.val:
            if not curr.left:
                curr.left = TreeNode(val)
                break
            curr = curr.left
        else:
            if not curr.right:
                curr.right = TreeNode(val)
                break
            curr = curr.right
    return root
```

### Time Complexity

| Operation | Average | Worst |
|-----------|---------|-------|
| Search | O(log n) | O(n) |
| Insert | O(log n) | O(n) |
| Delete | O(log n) | O(n) |

### BST Validation
```python
def isValidBST(root):
    def validate(node, low, high):
        if not node:
            return True
        
        if node.val <= low or node.val >= high:
            return False
        
        return validate(node.left, low, node.val) and \
               validate(node.right, node.val, high)
    
    return validate(root, float('-inf'), float('inf'))
```

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Delete with two children | Use successor/predecessor |
| Not updating parent | Return updated child |
| Forgetting to return | Always return root/subtree |

<!-- back -->
