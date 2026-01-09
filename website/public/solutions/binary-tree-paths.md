# Binary Tree Paths

## Problem Description
Given the root of a binary tree, return all root-to-leaf paths in any order.
A leaf is a node with no children.
 
Example 1:
Input: root = [1,2,3,null,5]
Output: ["1->2->5","1->3"]

Example 2:

Input: root = [1]
Output: ["1"]

 
Constraints:

The number of nodes in the tree is in the range [1, 100].
-100 <= Node.val <= 100
## Solution
```python
from typing import List, Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def binaryTreePaths(self, root: Optional[TreeNode]) -> List[str]:
        def dfs(node, path):
            if not node:
                return
            path += str(node.val)
            if not node.left and not node.right:
                result.append(path)
            else:
                path += '->'
                dfs(node.left, path)
                dfs(node.right, path)
        
        result = []
        dfs(root, '')
        return result
```

## Explanation
This solution uses depth-first search (DFS) to traverse from root to each leaf, building the path string along the way. When a leaf is reached, the complete path is added to the result list.

Time complexity: O(n), where n is the number of nodes, as each node is visited once.

Space complexity: O(h), where h is the height of the tree, due to the recursion stack and path string.
