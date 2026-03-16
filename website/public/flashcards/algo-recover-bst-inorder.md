## Recover Binary Search Tree

**Question:** How do you recover a BST where two nodes have been swapped?

<!-- front -->

---

## Answer: Inorder Traversal + Two Pass

### Solution
```python
class Solution:
    def recoverTree(self, root):
        self.first = None
        self.second = None
        self.prev = None
        
        def inorder(node):
            if not node:
                return
            
            inorder(node.left)
            
            # Check for violation
            if self.prev and self.prev.val > node.val:
                if not self.first:
                    self.first = self.prev
                self.second = node
            
            self.prev = node
            inorder(node.right)
        
        inorder(root)
        
        # Swap values
        self.first.val, self.second.val = self.second.val, self.first.val
```

### Visual: Finding Swapped Nodes
```
Original:     1 2 3 4 5 6 7
Swapped:     1 6 3 4 5 2 7
              ↑         ↑
            first     second

Inorder traversal:
- 1 → 6 → 3 → 4 → 5 → 2 → 7
         ↑___________↑
      first=6, second=2 (descending)

Swap found at:
- 6 > 3 → first=6, second=3
- 5 > 2 → first stays 6, second=2
```

### ⚠️ Tricky Parts

#### 1. Two Cases for Swapped Nodes

```python
# Case 1: Adjacent nodes swapped
# Original: 1 2 3 4 5 → Swapped: 1 3 2 4 5
# Inorder:  1 3 2 4 5
# Only ONE violation: 3 > 2

# Case 2: Non-adjacent nodes swapped
# Original: 1 2 3 4 5 → Swapped: 1 4 3 2 5
# Inorder:  1 4 3 2 5
# TWO violations: 4 > 3 AND 3 > 2
```

#### 2. Why Keep First but Update Second
```python
# First violation: prev > curr
# first = prev (larger value swapped left)

# Second violation: prev > curr  
# second = curr (smaller value swapped right)
# Keep first same, update second
```

#### 3. One-Pass Morris Traversal
```python
def recoverTreeMorris(root):
    first = second = pred = None
    
    while root:
        if root.right and root.val < root.right.val:
            # Find successor in right subtree
            pred = root.right
            while pred.left and pred.left != root:
                pred = pred.left
            
            if pred.left != root:
                pred.left = root
                root = root.right
            else:
                pred.left = None
                # Process node
                if pred and pred.val < root.val:
                    if not first:
                        first = pred
                    second = root
                root = root.left
        else:
            # No right child or already processed
            if root.left:
                pred = root.left
                while pred.right and pred.right != root:
                    pred = pred.right
                
                if pred.right != root:
                    pred.right = root
                    root = root.left
                else:
                    pred.right = None
                    # Process node
                    if pred and pred.val < root.val:
                        if not first:
                            first = pred
                        second = root
                    root = root.right
            else:
                # Process leaf
                if pred and pred.val < root.val:
                    if not first:
                        first = pred
                    second = root
                root = root.right
    
    first.val, second.val = second.val, first.val
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Recursive | O(n) | O(h) |
| Morris | O(n) | O(1) |
| Hash + Sort | O(n) | O(n) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Missing first update | Update both first and second |
| Wrong comparison | prev.val > node.val (descending) |
| Not swapping at end | Swap values, not nodes |

<!-- back -->
