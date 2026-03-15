## Recover BST - Two Nodes Swapped

**Question:** How does inorder traversal help identify swapped nodes in a BST?

<!-- front -->

---

## Recover BST

### Key Insight
In a valid BST, inorder traversal produces **sorted** values.
When two nodes are swapped, we get **two violations**.

### Algorithm
```python
def recover_tree(root):
    first = None
    middle = None
    last = None
    prev = TreeNode(float("-inf"))
    
    def inorder(node):
        nonlocal first, middle, last, prev
        if not node:
            return
        
        inorder(node.left)
        
        # First violation
        if prev.val >= node.val and not first:
            first = prev
            middle = node
        # Second violation
        elif prev.val >= node.val and first:
            last = node
        
        prev = node
        
        inorder(node.right)
    
    inorder(root)
    
    # Swap values
    if first and last:
        first.val, last.val = last.val, first.val
    elif first and middle:
        first.val, middle.val = middle.val, first.val
```

### Morris Traversal (O(1) space)
Same logic but using threaded binary tree approach.

### 💡 Cases
| Pattern | Example | Swap |
|---------|---------|------|
| Adjacent swap | [1,2,3,4,5] → [1,3,2,4,5] | 3↔2 |
| Non-adjacent | [1,2,3,4,5] → [1,4,2,3,5] | 4↔2 |

<!-- back -->
