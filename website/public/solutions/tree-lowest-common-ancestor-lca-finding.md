# Tree - Lowest Common Ancestor (LCA) Finding

## Overview

Finding the Lowest Common Ancestor (LCA) involves identifying the deepest node in a tree that is an ancestor of both given nodes. This pattern is useful in tree-based queries, such as finding the closest common parent in genealogical trees or optimizing path-related computations. The recursive approach checks subtrees and combines results to pinpoint the LCA. Benefits include efficient ancestor queries and applicability to various tree structures beyond binary trees.

## Key Concepts

- **Recursive Traversal**: Search left and right subtrees for the target nodes.
- **Base Cases**: Return the node if it matches p or q, or if null.
- **Combination Logic**: If both subtrees return non-null, current node is LCA; otherwise, return the non-null result.
- **Node Existence**: Assumes p and q exist in the tree.

## Template

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def lowest_common_ancestor(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
    # Base case: if root is null or matches p or q
    if not root or root == p or root == q:
        return root
    
    # Recurse on left and right subtrees
    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)
    
    # If both left and right are non-null, root is LCA
    if left and right:
        return root
    
    # Otherwise, return the non-null one (or None)
    return left or right
```

## Example Problems

- **Lowest Common Ancestor of a Binary Tree**: Find the LCA of two nodes in a general binary tree.
- **Lowest Common Ancestor of a Binary Search Tree**: Optimize LCA finding using BST properties (though the template works for both).
- **Smallest Common Region**: Find the LCA in a tree representing regions or hierarchies.

## Time and Space Complexity

- **Time Complexity**: O(n), where n is the number of nodes, in the worst case when traversing the entire tree.
- **Space Complexity**: O(h), where h is the height of the tree, due to the recursion stack. Worst case O(n) for skewed trees.

## Common Pitfalls

- **Node Not Found**: If p or q is not in the tree, the function may return incorrect results; ensure nodes exist.
- **One Node is Ancestor**: If one node is the ancestor of the other, LCA is the ancestor node.
- **Null Handling**: Properly handle null returns from subtrees.
- **BST Optimization**: For BSTs, you can optimize by comparing values, but the recursive template is general.