## DFS Postorder: Problem Forms

What are the variations and applications of postorder traversal?

<!-- front -->

---

### Tree Diameter

```python
def tree_diameter(root):
    """
    Longest path between any two nodes
    """
    diameter = [0]
    
    def height(node):
        if not node:
            return 0
        
        left = height(node.left)
        right = height(node.right)
        
        # Path through this node
        diameter[0] = max(diameter[0], left + right)
        
        return max(left, right) + 1
    
    height(root)
    return diameter[0]
```

---

### Maximum Path Sum

```python
def max_path_sum(root):
    """
    Maximum sum of any path (can be single node)
    """
    max_sum = float('-inf')
    
    def max_gain(node):
        nonlocal max_sum
        
        if not node:
            return 0
        
        # Don't take negative contributions
        left_gain = max(max_gain(node.left), 0)
        right_gain = max(max_gain(node.right), 0)
        
        # Price of path going through this node
        price = node.val + left_gain + right_gain
        max_sum = max(max_sum, price)
        
        # Return max gain if continue path upward
        return node.val + max(left_gain, right_gain)
    
    max_gain(root)
    return max_sum
```

---

### Subtree of Another Tree

```python
def is_subtree(root, subRoot):
    """
    Check if subRoot is a subtree of root
    """
    def serialize(node):
        if not node:
            return "#"
        return f"({node.val},{serialize(node.left)},{serialize(node.right)})"
    
    main_str = serialize(root)
    sub_str = serialize(subRoot)
    
    return sub_str in main_str
```

---

### Serialize and Deserialize

```python
def serialize_postorder(root):
    """
    Serialize using postorder
    """
    def build(node):
        if not node:
            return "#"
        return f"{build(node.left)},{build(node.right)},{node.val}"
    
    return build(root)

def deserialize_postorder(data):
    """
    Deserialize postorder string
    """
    vals = iter(data.split(","))
    
    def build():
        val = next(vals)
        if val == "#":
            return None
        
        # Postorder: build left, right, then root
        left = build()
        right = build()
        
        node = TreeNode(int(val))
        node.left = left
        node.right = right
        return node
    
    # Actually need to reverse for proper postorder deserialization
    vals = reversed(list(data.split(",")))
    def build_rev():
        val = next(vals)
        if val == "#":
            return None
        node = TreeNode(int(val))
        node.right = build_rev()
        node.left = build_rev()
        return node
    
    return build_rev()
```

---

### Lowest Common Ancestor (Binary Tree)

```python
def lowest_common_ancestor(root, p, q):
    """
    Find LCA of p and q in binary tree (not necessarily BST)
    """
    if not root or root == p or root == q:
        return root
    
    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)
    
    if left and right:
        return root  # Both found in different subtrees
    
    return left if left else right
```

<!-- back -->
