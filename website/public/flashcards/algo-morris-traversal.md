## Morris Traversal (In-Order)

**Questions:**
1. How does it achieve O(1) space?
2. What temporary modification is made to the tree?

<!-- front -->

---

## Morris Traversal

### Space Complexity: O(1)
Uses **threaded pointers** instead of recursion stack or parent pointers.

### Temporary Tree Modification
Creates temporary links (threads) from inorder predecessors back to current nodes.

### Algorithm Steps
```python
def morris_inorder(root):
    curr = root
    while curr:
        if not curr.left:
            visit(curr)
            curr = curr.right
        else:
            # Find inorder predecessor
            pred = curr.left
            while pred.right and pred.right != curr:
                pred = pred.right
            
            if not pred.right:
                # Create thread
                pred.right = curr
                curr = curr.left
            else:
                # Remove thread
                pred.right = None
                visit(curr)
                curr = curr.right
```

### ⚠️ Important Notes
- **Not thread-safe** (modifies tree temporarily)
- Restores original tree structure after traversal
- Each edge is visited at most 3 times → O(n) time

<!-- back -->
