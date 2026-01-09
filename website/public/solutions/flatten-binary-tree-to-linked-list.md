# Flatten Binary Tree To Linked List

## Problem Description
Given the root of a binary tree, flatten the tree into a "linked list":

The "linked list" should use the same TreeNode class where the right child pointer points to the next node in the list and the left child pointer is always null.
The "linked list" should be in the same order as a pre-order traversal of the binary tree.

 
Example 1:
Input: root = [1,2,5,3,4,null,6]
Output: [1,null,2,null,3,null,4,null,5,null,6]

Example 2:

Input: root = []
Output: []

Example 3:

Input: root = [0]
Output: [0]

 
Constraints:

The number of nodes in the tree is in the range [0, 2000].
-100 <= Node.val <= 100

 
Follow up: Can you flatten the tree in-place (with O(1) extra space)?
## Solution

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

from typing import Optional

class Solution:
    def flatten(self, root: Optional[TreeNode]) -> None:
        """
        Do not return anything, modify root in-place instead.
        """
        if not root:
            return
        
        self.flatten(root.right)
        self.flatten(root.left)
        
        right = root.right
        root.right = root.left
        root.left = None
        
        curr = root
        while curr.right:
            curr = curr.right
        curr.right = right
```

## Explanation

Recursively flatten the right and left subtrees.

Then, set root.right to root.left, set root.left to None.

Find the end of the new right chain and attach the original right subtree.

This modifies the tree in-place to a linked list in preorder.

**Time Complexity:** O(n), where n is the number of nodes.

**Space Complexity:** O(h), where h is the tree height, due to recursion stack.
