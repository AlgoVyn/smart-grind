# Maximum Depth Of Binary Tree

## Problem Description
Given the root of a binary tree, return its maximum depth.
A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.
 
Example 1:
Input: root = [3,9,20,null,null,15,7]
Output: 3

Example 2:

Input: root = [1,null,2]
Output: 2

 
Constraints:

The number of nodes in the tree is in the range [0, 104].
-100 <= Node.val <= 100
## Solution

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))
```

## Explanation
We use recursive DFS to compute the depth. For each node, the depth is 1 plus the maximum depth of its subtrees.

Time complexity: O(n), where n is the number of nodes.

Space complexity: O(h), where h is the height of the tree.
