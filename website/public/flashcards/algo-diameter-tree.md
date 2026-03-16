## Diameter of Binary Tree

**Question:** Find longest path between any two nodes in tree?

<!-- front -->

---

## Answer: DFS - Height Calculation

### Solution
```python
def diameterOfBinaryTree(root):
    diameter = 0
    
    def depth(node):
        nonlocal diameter
        
        if not node:
            return 0
        
        left_depth = depth(node.left)
        right_depth = depth(node.right)
        
        # Update diameter at this node
        diameter = max(diameter, left_depth + right_depth)
        
        # Return height of this subtree
        return max(left_depth, right_depth) + 1
    
    depth(root)
    return diameter
```

### Visual: Diameter
```
        1
       / \
      2   3
     / \
    4   5

Diameter = 3 (path: 4→2→1→3)
- Goes through root
- Left depth + right depth = 2 + 1 = 3
```

### ⚠️ Tricky Parts

#### 1. Diameter May Not Pass Through Root
```python
# Could be in left subtree only
# Could be in right subtree only

# Must check ALL nodes as potential center
```

#### 2. Height vs Diameter
```python
# Height: longest path from node to leaf
# Diameter: longest path through node (left + right)

# At each node:
# diameter = left_height + right_height
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| DFS | O(n) | O(h) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Only checking root | Check at every node |
| Returning diameter | Return height, track diameter |
| Wrong formula | left + right heights |

<!-- back -->
