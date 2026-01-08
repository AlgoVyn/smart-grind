# Validate Binary Search Tree

## Problem Description
[Link to problem](https://leetcode.com/problems/validate-binary-search-tree/)

Given the root of a binary tree, determine if it is a valid binary search tree (BST).
A valid BST is defined as follows:

The left subtree of a node contains only nodes with keys strictly less than the node's key.
The right subtree of a node contains only nodes with keys strictly greater than the node's key.
Both the left and right subtrees must also be binary search trees.

 
Example 1:


Input: root = [2,1,3]
Output: true

Example 2:


Input: root = [5,1,4,null,null,3,6]
Output: false
Explanation: The root node's value is 5 but its right child's value is 4.

 
Constraints:

The number of nodes in the tree is in the range [1, 104].
-231 <= Node.val <= 231 - 1


## Solution

```python
# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def isValidBST(root: TreeNode) -> bool:
    def helper(node, low, high):
        if not node:
            return True
        if not (low < node.val < high):
            return False
        return helper(node.left, low, node.val) and helper(node.right, node.val, high)

    return helper(root, float('-inf'), float('inf'))
```

## Explanation
To validate if a binary tree is a BST, we use a recursive helper function that checks each node against lower and upper bounds.

1. The helper function takes a node and bounds (low, high).
2. If the node is None, it's valid.
3. If the node's value is not strictly between low and high, it's invalid.
4. Recursively check the left subtree with updated high = node.val, and right with low = node.val.
5. The root call uses -inf and +inf as initial bounds.

This ensures all left descendants are < node.val and right > node.val.

**Time Complexity:** O(n), where n is the number of nodes, as we visit each node once.
**Space Complexity:** O(h), where h is the tree height, due to recursion stack (worst case O(n) for skewed tree).
