# Tree DFS - Recursive Preorder Traversal

## Overview

Preorder traversal is a depth-first search (DFS) approach that visits the root node first, then recursively traverses the left subtree, and finally the right subtree. This pattern is ideal for scenarios where you need to process the root before its children, such as creating a copy of the tree, evaluating expressions in a tree representation, or performing operations that require a top-down approach. Benefits include simplicity in implementation and the ability to maintain the tree's structure during traversal.

## Key Concepts

- **Root First**: Process the current node before recursing into subtrees.
- **Recursive Calls**: Call the function on left child, then right child.
- **Base Case**: Return when node is null to stop recursion.
- **Result Accumulation**: Collect results in a list or perform actions during visits.

## Template

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def preorder_traversal(root: TreeNode) -> list[int]:
    result = []
    
    def dfs(node):
        if not node:
            return
        result.append(node.val)  # Visit root
        dfs(node.left)           # Traverse left
        dfs(node.right)          # Traverse right
    
    dfs(root)
    return result
```

## Example Problems

- **Binary Tree Preorder Traversal**: Return the preorder traversal of a binary tree's node values.
- **Construct Binary Tree from Preorder and Inorder Traversal**: Build a tree given preorder and inorder traversals.
- **Path Sum**: Check if there's a path from root to leaf with a given sum, using preorder to explore paths.

## Time and Space Complexity

- **Time Complexity**: O(n), where n is the number of nodes, as each node is visited once.
- **Space Complexity**: O(h), where h is the height of the tree, due to the recursion stack. In the worst case (skewed tree), this is O(n).

## Common Pitfalls

- **Recursion Depth Limit**: For very deep trees, recursion might exceed the stack limit; consider iterative approaches if necessary.
- **Forgetting Base Case**: Always check for null nodes to prevent infinite recursion.
- **Modifying Tree During Traversal**: Be cautious if the traversal involves changes, as it might affect subsequent recursions.
- **Not Collecting Results Properly**: Ensure the result list is accessible within the recursive function scope.