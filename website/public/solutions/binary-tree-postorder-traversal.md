# Binary Tree Postorder Traversal

## Problem Description
[Link to problem](https://leetcode.com/problems/binary-tree-postorder-traversal/)

Given the root of a binary tree, return the postorder traversal of its nodes' values.
 
Example 1:

Input: root = [1,null,2,3]
Output: [3,2,1]
Explanation:


Example 2:

Input: root = [1,2,3,4,5,null,8,null,null,6,7,9]
Output: [4,6,7,5,2,9,8,3,1]
Explanation:


Example 3:

Input: root = []
Output: []

Example 4:

Input: root = [1]
Output: [1]

 
Constraints:

The number of the nodes in the tree is in the range [0, 100].
-100 <= Node.val <= 100

 
Follow up: Recursive solution is trivial, could you do it iteratively?


## Solution

```python
from typing import List, Optional

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def postorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        if not root:
            return []
        stack = [root]
        result = []
        while stack:
            node = stack.pop()
            result.append(node.val)
            if node.left:
                stack.append(node.left)
            if node.right:
                stack.append(node.right)
        return result[::-1]
```

## Explanation
Postorder traversal visits nodes in the order: left subtree, right subtree, root. Since the recursive solution is trivial, we implement an iterative version using a stack.

We use a stack initialized with the root. While the stack is not empty, we pop the top node, append its value to the result list, and push its left and right children onto the stack (right first, but since stack is LIFO, left will be processed after right in the reversed result).

This process gives the reverse of postorder, so we reverse the result list at the end.

Time complexity: O(n), where n is the number of nodes, as each node is visited once. Space complexity: O(n) for the stack and result list.
