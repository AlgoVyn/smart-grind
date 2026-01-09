# Same Tree

## Problem Description

Given the roots of two binary trees `p` and `q`, write a function to check if they are the same or not. Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.

### Examples

**Example 1:**
- Input: `p = [1,2,3], q = [1,2,3]`
- Output: `true`

**Example 2:**
- Input: `p = [1,2], q = [1,null,2]`
- Output: `false`

**Example 3:**
- Input: `p = [1,2,1], q = [1,1,2]`
- Output: `false`

### Constraints

- The number of nodes in both trees is in the range `[0, 100]`
- `-10^4 <= Node.val <= 10^4`

---

## Solution

```
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

---

## Explanation

This problem requires checking if two binary trees are identical in structure and values.

### Approach

Use recursive traversal to compare nodes at each level.

### Algorithm Steps

1. **Base Cases**: If both nodes are `None`, return `true`; if only one is `None`, return `false`.
2. **Value Check**: If the values differ, return `false`.
3. **Recursive Call**: Check left and right subtrees recursively.

### Time Complexity

- **O(n)**, where `n` is the number of nodes in the trees.

### Space Complexity

- **O(h)**, where `h` is the height of the tree (recursion stack).
