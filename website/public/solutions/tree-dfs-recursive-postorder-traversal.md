# Tree DFS - Recursive Postorder Traversal

## Overview

Postorder traversal is a depth-first search (DFS) technique that visits the left subtree first, then the right subtree, and finally the root node. This pattern is essential for scenarios where you need to process child nodes before their parent, such as deleting a tree (to avoid dangling pointers), evaluating postfix expressions, or computing properties that depend on subtree results. The benefit lies in ensuring all descendants are handled before the current node, making it ideal for bottom-up computations.

## Key Concepts

- **Left and Right First**: Recursively traverse both subtrees before processing the current node.
- **Root Last**: Visit the root after its children.
- **Base Case**: Terminate when node is null.
- **Bottom-Up Processing**: Useful for aggregating results from subtrees.

## Template

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def postorder_traversal(root: TreeNode) -> list[int]:
    result = []
    
    def dfs(node):
        if not node:
            return
        dfs(node.left)           # Traverse left
        dfs(node.right)          # Traverse right
        result.append(node.val)  # Visit root
    
    dfs(root)
    return result
```

## Example Problems

- **Binary Tree Postorder Traversal**: Return the postorder traversal of a binary tree's node values.
- **Delete Tree**: Safely delete all nodes in a tree by processing children first.
- **Binary Tree Maximum Path Sum**: Compute the maximum path sum, where subtree sums are calculated before combining with root.

## Time and Space Complexity

- **Time Complexity**: O(n), where n is the number of nodes, as each node is visited once.
- **Space Complexity**: O(h), where h is the height of the tree, due to the recursion stack. Worst case O(n) for skewed trees.

## Common Pitfalls

- **Recursion Depth Issues**: Similar to other DFS, deep trees may exceed stack limits.
- **Order of Operations**: Ensure left and right are processed before root; swapping order changes the traversal type.
- **Null Checks**: Crucial to avoid accessing attributes of null nodes.
- **Result Accumulation**: Make sure the result list is modified correctly within the recursive scope.