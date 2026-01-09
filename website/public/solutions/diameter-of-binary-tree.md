# Diameter Of Binary Tree

## Problem Description
Given the root of a binary tree, return the length of the diameter of the tree.
The diameter of a binary tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the root.
The length of a path between two nodes is represented by the number of edges between them.

## Examples

**Example 1:**

**Input:**
```python
root = [1,2,3,4,5]
```

**Output:**
```python
3
```

**Explanation:**
3 is the length of the path [4,2,1,3] or [5,2,1,3].

**Example 2:**

**Input:**
```python
root = [1,2]
```

**Output:**
```python
1
```

## Constraints

- The number of nodes in the tree is in the range `[1, 10^4]`.
- `-100 <= Node.val <= 100`.

## Solution

```
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        self.diameter = 0

        def dfs(node):
            if not node:
                return 0
            left = dfs(node.left)
            right = dfs(node.right)
            self.diameter = max(self.diameter, left + right)
            return max(left, right) + 1

        dfs(root)
        return self.diameter
```

## Explanation
The solution uses DFS to compute the height of each subtree. For each node, the diameter passing through it is left_height + right_height. Update the global diameter with this value. The height is max(left, right) + 1.

**Time Complexity:** O(n)

**Space Complexity:** O(h) for recursion stack.
