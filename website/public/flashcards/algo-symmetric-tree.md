## Symmetric Tree

**Question:** Check if binary tree is mirror of itself?

<!-- front -->

---

## Answer: Recursive Pair Comparison

### Solution
```python
def isSymmetric(root):
    def isMirror(left, right):
        # Base cases
        if not left and not right:
            return True
        if not left or not right:
            return False
        
        # Check values and children
        return (left.val == right.val and
                isMirror(left.left, right.right) and
                isMirror(left.right, right.left))
    
    return isMirror(root, root)
```

### Iterative
```python
from collections import deque

def isSymmetricIterative(root):
    queue = deque([root, root])
    
    while queue:
        t1 = queue.popleft()
        t2 = queue.popleft()
        
        if not t1 and not t2:
            continue
        if not t1 or not t2:
            return False
        if t1.val != t2.val:
            return False
        
        # Add mirror pairs
        queue.append(t1.left)
        queue.append(t2.right)
        queue.append(t1.right)
        queue.append(t2.left)
    
    return True
```

### Visual: Symmetric Tree
```
    1
   / \
  2   2
 / \ / \
3  4 4  3

Mirror pairs: (2,2), (3,3), (4,4)
```

### ⚠️ Tricky Parts

#### 1. Why Compare Root with Itself?
```python
# isMirror(root, root)
# Left subtree compared with right subtree

# left.left ↔ right.right
# left.right ↔ right.left
```

#### 2. Recursive Logic
```python
# Check current values match
# Recursively check left's left with right's right
# Recursively check left's right with right's left
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Recursive | O(n) | O(h) |
| Iterative | O(n) | O(w) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Wrong comparison | left ↔ right, not left ↔ left |
| Missing base case | Handle both null |
| Not using helper | Need two nodes |

<!-- back -->
