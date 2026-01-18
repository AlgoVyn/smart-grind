# Tree DFS - Recursive Inorder Traversal

## Overview

Inorder traversal is a depth-first search (DFS) method that visits the left subtree first, then the root node, and finally the right subtree. This pattern is crucial for binary search trees (BSTs), where inorder traversal produces a sorted sequence of node values. It's beneficial for problems requiring sorted access, validation of BST properties, or operations that depend on the natural order of elements. The main advantage is maintaining the relative ordering of nodes as they appear in a sorted list.

## Key Concepts

- **Left First**: Recursively traverse the left subtree before processing the current node.
- **Root Visit**: Process the current node after left subtree.
- **Right Last**: Traverse the right subtree after the root.
- **Base Case**: Stop recursion when node is null.
- **Sorted Output**: In BSTs, this yields ascending order.

## Template

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder_traversal(root: TreeNode) -> list[int]:
    result = []
    
    def dfs(node):
        if not node:
            return
        dfs(node.left)           # Traverse left
        result.append(node.val)  # Visit root
        dfs(node.right)          # Traverse right
    
    dfs(root)
    return result
```

## Example Problems

- **Binary Tree Inorder Traversal**: Return the inorder traversal of a binary tree's node values.
- **Validate Binary Search Tree**: Check if a given binary tree is a valid BST by ensuring inorder is sorted.
- **Kth Smallest Element in a BST**: Find the kth smallest element using inorder traversal properties.

## Time and Space Complexity

- **Time Complexity**: O(n), where n is the number of nodes, as each node is visited once.
- **Space Complexity**: O(h), where h is the height of the tree, due to the recursion stack. Worst case O(n) for skewed trees.

## Common Pitfalls

- **Recursion Stack Overflow**: Deep trees may cause stack issues; use iterative inorder if needed.
- **Assuming Sorted Order**: Only valid for BSTs; in general trees, inorder doesn't guarantee sorted output.
- **Null Node Checks**: Essential to prevent errors; always check before accessing node.val.
- **Result Scope**: Ensure the result list is in the outer scope for the recursive function to modify.