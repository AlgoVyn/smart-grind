## Lowest Common Ancestor in BST

**Question:** Find LCA in binary search tree?

<!-- front -->

---

## Answer: BST Property

### Solution
```python
def lowestCommonAncestor(root, p, q):
    # Both in left subtree
    if p.val < root.val and q.val < root.val:
        return lowestCommonAncestor(root.left, p, q)
    
    # Both in right subtree
    if p.val > root.val and q.val > root.val:
        return lowestCommonAncestor(root.right, p, q)
    
    # Split (p and q on different sides or one is root)
    return root
```

### Solution: Iterative
```python
def lowestCommonAncestorIter(root, p, q):
    while root:
        if p.val < root.val and q.val < root.val:
            root = root.left
        elif p.val > root.val and q.val > root.val:
            root = root.right
        else:
            return root
    
    return None
```

### Visual: BST LCA
```
        6
       / \
      2   8
     / \ / \
    0  4 7  9
      / \
     3  5

Find LCA of 3 and 5:

6 > 3 and 6 > 5 → go left to 2
2 < 3 and 2 < 4 → go right to 4
4 > 3 and 4 > 3 → go left to 3
3 is one of targets → return 4

LCA = 4
```

### ⚠️ Tricky Parts

#### 1. BST Property Makes It Simple
```python
# In BST:
# - Left subtree values < root
# - Right subtree values > root

# LCA is first node where p and q split
# Either p ≤ root ≤ q or q ≤ root ≤ p
```

#### 2. LCA vs Regular Binary Tree
```python
# For non-BST, need parent pointers or traverse both paths
# For BST, can use value comparisons

# General approach:
def LCAGeneral(root, p, q):
    if not root or root == p or root == q:
        return root
    
    left = LCAGeneral(root.left, p, q)
    right = LCAGeneral(root.right, p, q)
    
    if left and right:
        return root
    return left or right
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| BST | O(h) | O(h) recursion |
| Iterative | O(h) | O(1) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Not using BST property | Use value comparisons |
| Wrong comparison direction | p.val < root.val → left |
| Missing split case | Return root when split |

<!-- back -->
