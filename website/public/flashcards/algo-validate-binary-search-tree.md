## Validate Binary Search Tree

**Question:** Is valid BST?

<!-- front -->

---

## Answer: Range Checking

### Solution
```python
def isValidBST(root):
    def validate(node, low, high):
        # Empty is valid
        if not node:
            return True
        
        # Check node value in range
        if node.val <= low or node.val >= high:
            return False
        
        # Recurse on subtrees
        return validate(node.left, low, node.val) and \
               validate(node.right, node.val, high)
    
    return validate(root, float('-inf'), float('inf'))
```

### Visual: Range Checking
```
        5
       / \
      1   6
         / \
        4   7

Node 5: range (-∞, ∞) → valid
  Node 1: range (-∞, 5) → valid
    Left/Right: None → valid
  Node 6: range (5, ∞) → valid
    Node 4: range (5, 6) → 4 <= 5 ✗ INVALID!

Return: False
```

### ⚠️ Tricky Parts

#### 1. Why Use float('-inf') and float('inf')?
```python
# BST can have any integer value
# Need bounds outside any possible value
# float('inf') is greater than all integers

# Important: Use exclusive bounds (<=)
# node.val must be > low and < high
```

#### 2. In-Order Traversal Alternative
```python
def isValidBSTInorder(root):
    stack = []
    prev = float('-inf')
    current = root
    
    while stack or current:
        # Go to leftmost
        while current:
            stack.append(current)
            current = current.left
        
        current = stack.pop()
        
        # Check in-order is increasing
        if current.val <= prev:
            return False
        prev = current.val
        
        current = current.right
    
    return True
```

#### 3. Common Mistakes with Equal Values
```python
# BST definition: left < root < right
# Not: left <= root <= right

# If duplicates allowed in one side:
# left <= root < right OR left < root <= right
# Depends on problem specification
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Range Check | O(n) | O(h) |
| In-Order | O(n) | O(h) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Wrong bounds | Use -inf and inf |
| Using <= | Use < for bounds |
| Not checking all | Check both subtrees |

<!-- back -->
