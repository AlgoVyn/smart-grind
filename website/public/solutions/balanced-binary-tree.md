# Balanced Binary Tree

## Problem Description
Given a binary tree, determine if it is height-balanced.
 
Example 1:
Input: root = [3,9,20,null,null,15,7]
Output: true

Example 2:
Input: root = [1,2,2,3,3,null,null,4,4]
Output: false

Example 3:

Input: root = []
Output: true

 
Constraints:

The number of nodes in the tree is in the range [0, 5000].
-104 <= Node.val <= 104
## Solution

```python
# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def isBalanced(self, root: TreeNode) -> bool:
        def check(node):
            if not node:
                return 0
            left = check(node.left)
            if left == -1:
                return -1
            right = check(node.right)
            if right == -1:
                return -1
            if abs(left - right) > 1:
                return -1
            return max(left, right) + 1
        return check(root) != -1
```

## Explanation

A binary tree is balanced if the height difference between left and right subtrees of every node is at most 1.

We use a recursive helper function that returns the height of the subtree if balanced, or -1 if not. For each node, compute heights of left and right subtrees. If either is -1 or their difference >1, return -1. Otherwise, return max height +1.

The main function checks if the root's check result is not -1.

Time complexity is O(N) as we visit each node once. Space complexity is O(H) for recursion stack, where H is tree height.

This approach efficiently checks balance in a single pass.
