# Invert Binary Tree

## Problem Description
Given the root of a binary tree, invert the tree, and return its root.
 
Example 1:
Input: root = [4,2,7,1,3,6,9]
Output: [4,7,2,9,6,3,1]

Example 2:
Input: root = [2,1,3]
Output: [2,3,1]

Example 3:

Input: root = []
Output: []

 
Constraints:

The number of nodes in the tree is in the range [0, 100].
-100 <= Node.val <= 100
## Solution

```python
from typing import Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        if not root:
            return None
        root.left, root.right = root.right, root.left
        self.invertTree(root.left)
        self.invertTree(root.right)
        return root
```

## Explanation
This problem inverts a binary tree by swapping left and right subtrees.

Use recursion: swap left and right, then invert subtrees.

**Time Complexity:** O(n), visits each node.

**Space Complexity:** O(h), recursion stack, h is height.
