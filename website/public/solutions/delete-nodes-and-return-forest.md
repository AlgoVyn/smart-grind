# Delete Nodes And Return Forest

## Problem Description
[Link to problem](https://leetcode.com/problems/delete-nodes-and-return-forest/)

Given the root of a binary tree, each node in the tree has a distinct value.
After deleting all nodes with a value in to_delete, we are left with a forest (a disjoint union of trees).
Return the roots of the trees in the remaining forest. You may return the result in any order.
 
Example 1:


Input: root = [1,2,3,4,5,6,7], to_delete = [3,5]
Output: [[1,2,null,4],[6],[7]]

Example 2:

Input: root = [1,2,4,null,3], to_delete = [3]
Output: [[1,2,4]]

 
Constraints:

The number of nodes in the given tree is at most 1000.
Each node has a distinct value between 1 and 1000.
to_delete.length <= 1000
to_delete contains distinct values between 1 and 1000.


## Solution

```python
# Python solution
from typing import List, Optional

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def delNodes(self, root: Optional[TreeNode], to_delete: List[int]) -> List[TreeNode]:
        to_delete_set = set(to_delete)
        result = []
        
        def dfs(node, is_root):
            if not node:
                return None
            deleted = node.val in to_delete_set
            if is_root and not deleted:
                result.append(node)
            node.left = dfs(node.left, deleted)
            node.right = dfs(node.right, deleted)
            return None if deleted else node
        
        dfs(root, True)
        return result
```

## Explanation
We use a depth-first search (DFS) to traverse the tree. We maintain a set for quick lookup of nodes to delete.

The DFS function takes a node and a flag indicating if it's a root (i.e., its parent was deleted or it's the original root).

- If the node is to be deleted, we don't return it, but we continue processing its children.
- If the node is not deleted and it's a root, add it to the result.
- Recursively process left and right children, passing whether the current node is deleted.

This way, when a node is deleted, its children become roots if they are not deleted.

Time complexity: O(n), where n is the number of nodes, as we visit each node once.
Space complexity: O(n) for the recursion stack and the set.
