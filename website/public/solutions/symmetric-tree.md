# Symmetric Tree

## Problem Description

Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).

**Example 1:**

Input: `root = [1,2,2,3,4,4,3]`
Output: `true`

**Example 2:**

Input: `root = [1,2,2,null,3,null,3]`
Output: `false`

## Constraints

- The number of nodes in the tree is in the range `[1, 1000]`.
- `-100 <= Node.val <= 100`

**Follow up:** Could you solve it both recursively and iteratively?

## Solution

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def isSymmetric(self, root: TreeNode) -> bool:
        def is_mirror(left, right):
            if not left and not right:
                return True
            if not left or not right:
                return False
            return (left.val == right.val and
                    is_mirror(left.left, right.right) and
                    is_mirror(left.right, right.left))

        if not root:
            return True
        return is_mirror(root.left, root.right)
```

## Explanation

Define a recursive helper function `is_mirror` that checks if two subtrees are mirrors: both `None`, or values equal and left of one matches right of other. Call `is_mirror` on root's left and right subtrees.

**Time Complexity:** O(n), where n is number of nodes, as each node is visited once.

**Space Complexity:** O(h), where h is tree height, for recursion stack.
