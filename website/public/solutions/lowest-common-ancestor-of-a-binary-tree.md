# Lowest Common Ancestor Of A Binary Tree

## Problem Description

Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.

According to the definition of LCA on Wikipedia: "The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself)."

---

## Examples

**Example 1:**

**Input:** `root = [3,5,1,6,2,0,8,null,null,7,4]`, `p = 5`, `q = 1`

**Output:** `3`

**Explanation:** The LCA of nodes `5` and `1` is `3`.

**Example 2:**

**Input:** `root = [3,5,1,6,2,0,8,null,null,7,4]`, `p = 5`, `q = 4`

**Output:** `5`

**Explanation:** The LCA of nodes `5` and `4` is `5`, since a node can be a descendant of itself according to the LCA definition.

**Example 3:**

**Input:** `root = [1,2]`, `p = 1`, `q = 2`

**Output:** `1`

---

## Constraints

- The number of nodes in the tree is in the range `[2, 10^5]`.
- `-10^9 <= Node.val <= 10^9`
- All `Node.val` are unique.
- `p != q`
- `p` and `q` will exist in the tree.

---

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
        if not root or root == p or root == q:
            return root
        left = self.lowestCommonAncestor(root.left, p, q)
        right = self.lowestCommonAncestor(root.right, p, q)
        if left and right:
            return root
        return left or right
```

---

## Explanation

We use a recursive approach to find the lowest common ancestor. For each node, we check if it is `p` or `q`, or if `p` and `q` are in its subtrees.

- If the current node is null or is `p` or `q`, return it.
- Recursively find the LCA in the left and right subtrees.
- If both left and right return non-null values, it means `p` and `q` are in different subtrees, so the current node is the LCA.
- If only one is non-null, return that one (the LCA is in that subtree).

This ensures we find the lowest node that has both `p` and `q` as descendants.

---

## Complexity Analysis

- **Time Complexity:** `O(n)`, where `n` is the number of nodes, in the worst case we visit all nodes.
- **Space Complexity:** `O(h)`, where `h` is the height of the tree, due to the recursion stack.
