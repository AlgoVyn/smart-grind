## Tree DFS - Recursive Postorder Traversal: Problem Forms

What are the common variations and problem forms for postorder traversal?

<!-- front -->

---

### Form 1: Basic Postorder Traversal (Classic)

**Problem**: Return node values in postorder sequence.

```python
# Input:     1
#           / \
#          2   3
#         / \   \
#        4   5   6
#
# Output: [4, 5, 2, 6, 3, 1]

def postorder_traversal(root):
    result = []
    
    def dfs(node):
        if not node:
            return
        dfs(node.left)
        dfs(node.right)
        result.append(node.val)
    
    dfs(root)
    return result
```

**LeetCode**: 145 - Binary Tree Postorder Traversal

---

### Form 2: Tree Height / Maximum Depth

**Problem**: Find the maximum depth of a binary tree.

```python
# Input:     3
#           / \
#          9  20
#            /  \
#           15   7
#
# Output: 3 (longest path: 3 -> 20 -> 15 or 7)

def max_depth(root):
    if not root:
        return 0
    
    left_depth = max_depth(root.left)
    right_depth = max_depth(root.right)
    
    return max(left_depth, right_depth) + 1
```

**LeetCode**: 104 - Maximum Depth of Binary Tree

---

### Form 3: Tree Diameter

**Problem**: Find the longest path between any two nodes.

```python
# Diameter can pass through root or be entirely in one subtree

def diameter_of_binary_tree(root):
    self.max_diameter = 0
    
    def dfs(node):
        if not node:
            return 0
        
        left_height = dfs(node.left)
        right_height = dfs(node.right)
        
        # Update diameter (path through this node)
        self.max_diameter = max(
            self.max_diameter,
            left_height + right_height
        )
        
        return max(left_height, right_height) + 1
    
    dfs(root)
    return self.max_diameter
```

**LeetCode**: 543 - Diameter of Binary Tree

---

### Form 4: Delete Nodes and Return Forest

**Problem**: Delete specified nodes and return remaining trees.

```python
def delNodes(root, to_delete):
    to_delete_set = set(to_delete)
    result = []
    
    def dfs(node, is_root):
        if not node:
            return None
        
        is_deleted = node.val in to_delete_set
        
        # If current is a root and not deleted, add to forest
        if is_root and not is_deleted:
            result.append(node)
        
        # Recurse on children
        # Child becomes root if current is deleted
        node.left = dfs(node.left, is_deleted)
        node.right = dfs(node.right, is_deleted)
        
        return None if is_deleted else node
    
    dfs(root, True)
    return result
```

**LeetCode**: 1110 - Delete Nodes And Return Forest

---

### Form 5: Subtree Sum / Maximum Product

**Problem**: Compute subtree sums and find maximum product of split.

```python
def max_product(root):
    total_sum = 0
    subtree_sums = []
    
    def dfs(node):
        if not node:
            return 0
        
        left_sum = dfs(node.left)
        right_sum = dfs(node.right)
        current_sum = left_sum + right_sum + node.val
        
        subtree_sums.append(current_sum)
        return current_sum
    
    total_sum = dfs(root)
    
    max_product = 0
    for s in subtree_sums:
        max_product = max(max_product, s * (total_sum - s))
    
    return max_product % (10**9 + 7)
```

**LeetCode**: 1339 - Maximum Product of Splitted Binary Tree

---

### Form 6: Construct Tree from Traversals

**Problem**: Build tree from inorder and postorder traversals.

```python
def build_tree(inorder, postorder):
    # Last element in postorder is the root
    # Find root in inorder to split left/right subtrees
    
    inorder_index_map = {v: i for i, v in enumerate(inorder)}
    
    def helper(in_left, in_right):
        if in_left > in_right:
            return None
        
        # Root is last in current postorder range
        root_val = postorder.pop()
        root = TreeNode(root_val)
        
        index = inorder_index_map[root_val]
        
        # Build right first (postorder processes right before root)
        root.right = helper(index + 1, in_right)
        root.left = helper(in_left, index - 1)
        
        return root
    
    return helper(0, len(inorder) - 1)
```

**LeetCode**: 106 - Construct Binary Tree from Inorder and Postorder Traversal

---

### Form Variations Summary

| Form | Return Type | Key Pattern |
|------|-------------|-------------|
| Basic Postorder | `List[int]` | Collect values in L→R→Root order |
| Tree Height | `int` | Return `max(left, right) + 1` |
| Diameter | `int` | Track `left_height + right_height` |
| Delete Nodes | `List[TreeNode]` | Process children, decide on current |
| Subtree Sum | `int` | Return sum, use in parent calculation |
| Construct Tree | `TreeNode` | Root from postorder end, build right first |
| Expression Eval | `int/float` | Leaf = operand, internal = operator |

<!-- back -->
