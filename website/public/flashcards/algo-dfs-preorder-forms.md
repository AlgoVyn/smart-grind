## DFS Preorder: Problem Forms

What are the variations and applications of preorder traversal?

<!-- front -->

---

### Sum Root to Leaf Numbers

```python
def sum_numbers(root):
    """
    Each root-to-leaf path forms a number
    Sum all such numbers
    """
    def dfs(node, current_sum):
        if not node:
            return 0
        
        current_sum = current_sum * 10 + node.val
        
        if not node.left and not node.right:
            return current_sum
        
        return dfs(node.left, current_sum) + dfs(node.right, current_sum)
    
    return dfs(root, 0)
```

---

### Binary Tree Paths

```python
def binary_tree_paths(root):
    """
    Return all root-to-leaf paths as strings
    """
    if not root:
        return []
    
    paths = []
    
    def dfs(node, path):
        if not node.left and not node.right:
            paths.append(path + str(node.val))
            return
        
        new_path = path + str(node.val) + "->"
        if node.left:
            dfs(node.left, new_path)
        if node.right:
            dfs(node.right, new_path)
    
    dfs(root, "")
    return paths
```

---

### Path Sum III (Any to Any)

```python
def path_sum_any(root, target):
    """
    Count paths summing to target (can start anywhere)
    """
    from collections import defaultdict
    
    count = 0
    prefix_sum = defaultdict(int)
    prefix_sum[0] = 1  # Empty path
    
    def dfs(node, current_sum):
        nonlocal count
        
        if not node:
            return
        
        current_sum += node.val
        count += prefix_sum[current_sum - target]
        
        prefix_sum[current_sum] += 1
        
        dfs(node.left, current_sum)
        dfs(node.right, current_sum)
        
        prefix_sum[current_sum] -= 1
    
    dfs(root, 0)
    return count
```

---

### Construct from Preorder and Inorder

```python
def build_tree(preorder, inorder):
    """
    Construct tree from preorder and inorder traversals
    """
    if not preorder or not inorder:
        return None
    
    # First element in preorder is root
    root_val = preorder[0]
    root = TreeNode(root_val)
    
    # Find root in inorder to split left/right
    root_idx = inorder.index(root_val)
    
    # Recursively build subtrees
    root.left = build_tree(
        preorder[1:1+root_idx],
        inorder[:root_idx]
    )
    root.right = build_tree(
        preorder[1+root_idx:],
        inorder[root_idx+1:]
    )
    
    return root
```

---

### N-ary Tree Preorder

```python
class Node:
    def __init__(self, val=None, children=None):
        self.val = val
        self.children = children if children else []

def nary_preorder(root):
    """
    Preorder for N-ary tree
    """
    if not root:
        return []
    
    result = [root.val]
    
    for child in root.children:
        result.extend(nary_preorder(child))
    
    return result

# Iterative
def nary_preorder_iterative(root):
    if not root:
        return []
    
    result = []
    stack = [root]
    
    while stack:
        node = stack.pop()
        result.append(node.val)
        # Push children in reverse order
        for i in range(len(node.children) - 1, -1, -1):
            stack.append(node.children[i])
    
    return result
```

<!-- back -->
