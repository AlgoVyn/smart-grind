# Same Tree

## Problem Description
[Link to problem](https://leetcode.com/problems/same-tree/)

Given the roots of two binary trees p and q, write a function to check if they are the same or not.
Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.
 
Example 1:


Input: p = [1,2,3], q = [1,2,3]
Output: true

Example 2:


Input: p = [1,2], q = [1,null,2]
Output: false

Example 3:


Input: p = [1,2,1], q = [1,1,2]
Output: false

 
Constraints:

The number of nodes in both trees is in the range [0, 100].
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
    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
        if not p and not q:
            return True
        if not p or not q:
            return False
        if p.val != q.val:
            return False
        return self.isSameTree(p.left, q.left) and self.isSameTree(p.right, q.right)
```

## Explanation

This problem requires checking if two binary trees are identical in structure and values.

### Approach

Use recursive traversal to compare nodes at each level.

### Step-by-Step Explanation

1. **Base Cases**: If both None, true; if one None, false.

2. **Value Check**: If values differ, false.

3. **Recursive**: Check left and right subtrees.

### Time Complexity

- O(n), where n is the number of nodes.

### Space Complexity

- O(h), where h is the height of the tree.
