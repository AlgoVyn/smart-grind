# House Robber Iii

## Problem Description
The thief has found himself a new place for his thievery again. There is only one entrance to this area, called root.
Besides the root, each house has one and only one parent house. After a tour, the smart thief realized that all houses in this place form a binary tree. It will automatically contact the police if two directly-linked houses were broken into on the same night.
Given the root of the binary tree, return the maximum amount of money the thief can rob without alerting the police.
 
Example 1:
Input: root = [3,2,3,null,3,null,1]
Output: 7
Explanation: Maximum amount of money the thief can rob = 3 + 3 + 1 = 7.

Example 2:
Input: root = [3,4,5,1,3,null,1]
Output: 9
Explanation: Maximum amount of money the thief can rob = 4 + 5 = 9.

 
Constraints:

The number of nodes in the tree is in the range [1, 104].
0 <= Node.val <= 104
## Solution

```python
from typing import Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def rob(self, root: Optional[TreeNode]) -> int:
        def dfs(node):
            if not node:
                return 0, 0
            left_rob, left_not = dfs(node.left)
            right_rob, right_not = dfs(node.right)
            rob = node.val + left_not + right_not
            not_rob = max(left_rob, left_not) + max(right_rob, right_not)
            return rob, not_rob
        return max(dfs(root))
```

## Explanation
This problem maximizes money robbed from a binary tree without robbing adjacent nodes.

Use DFS to return for each node: max if robbed, max if not.

For a node, if robbed, add val + not robbed of children.

If not, max of robbed or not of children.

Return max of the two for root.

**Time Complexity:** O(n), visits each node once.

**Space Complexity:** O(n), recursion stack.
