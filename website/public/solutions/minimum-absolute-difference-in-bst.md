# Minimum Absolute Difference In Bst

## Problem Description
[Link to problem](https://leetcode.com/problems/minimum-absolute-difference-in-bst/)

Given the root of a Binary Search Tree (BST), return the minimum absolute difference between the values of any two different nodes in the tree.
 
Example 1:


Input: root = [4,2,6,1,3]
Output: 1

Example 2:


Input: root = [1,0,48,null,null,12,49]
Output: 1

 
Constraints:

The number of nodes in the tree is in the range [2, 104].
0 <= Node.val <= 105

 
Note: This question is the same as 783: https://leetcode.com/problems/minimum-distance-between-bst-nodes/


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
    def getMinimumDifference(self, root: Optional[TreeNode]) -> int:
        self.min_diff = float('inf')
        self.prev = None
        
        def inorder(node):
            if not node:
                return
            inorder(node.left)
            if self.prev is not None:
                self.min_diff = min(self.min_diff, node.val - self.prev)
            self.prev = node.val
            inorder(node.right)
        
        inorder(root)
        return self.min_diff
```

## Explanation
Since a BST has the property that inorder traversal visits nodes in sorted order, we can find the minimum absolute difference by traversing inorder and tracking consecutive values.

1. Use a recursive inorder traversal.

2. Maintain a variable for the previous node's value and the minimum difference found so far.

3. During traversal, after visiting left subtree, update the min_diff with the difference between current and previous values, then update previous to current.

4. After right subtree, the min_diff will hold the answer.

Time complexity: O(n), where n is the number of nodes, as inorder traversal visits each node once.
Space complexity: O(h), where h is the height of the tree, for the recursion stack.
