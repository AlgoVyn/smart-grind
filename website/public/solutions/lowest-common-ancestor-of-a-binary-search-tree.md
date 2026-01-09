# Lowest Common Ancestor Of A Binary Search Tree

## Problem Description

Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.

According to the definition of LCA on Wikipedia: "The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself)."

## Examples

**Example 1:**

**Input:** `root = [6,2,8,0,4,7,9,null,null,3,5]`, `p = 2`, `q = 8`

**Output:** `6`

**Explanation:** The LCA of nodes `2` and `8` is `6`.

**Example 2:**

**Input:** `root = [6,2,8,0,4,7,9,null,null,3,5]`, `p = 2`, `q = 4`

**Output:** `2`

**Explanation:** The LCA of nodes `2` and `4` is `2`, since a node can be a descendant of itself according to the LCA definition.

**Example 3:**

**Input:** `root = [2,1]`, `p = 2`, `q = 1`

**Output:** `2`

## Constraints

- The number of nodes in the tree is in the range `[2, 10^5]`.
- `-10^9 <= Node.val <= 10^9`
- All `Node.val` are unique.
- `p != q`
- `p` and `q` will exist in the BST.

## Solution

```
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        while root:
            if p.val < root.val and q.val < root.val:
                root = root.left
            elif p.val > root.val and q.val > root.val:
                root = root.right
            else:
                return root
```

## Explanation

Since the tree is a binary search tree, the values are ordered. We start from the root and traverse down.

- If both `p` and `q` are less than the current node's value, the LCA must be in the left subtree, so move to `root.left`.
- If both are greater, move to `root.right`.
- Otherwise, the current node is the LCA, as it is the split point where `p` and `q` diverge.

This iterative approach ensures we find the LCA efficiently.

## Complexity Analysis

- **Time Complexity:** `O(h)`, where `h` is the height of the tree, which is `O(log n)` for balanced BST and `O(n)` in the worst case.
- **Space Complexity:** `O(1)`, as we use constant extra space.
