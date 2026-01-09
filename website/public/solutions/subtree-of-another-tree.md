# Subtree of Another Tree

## Problem Description

Given the roots of two binary trees `root` and `subRoot`, return `true` if there is a subtree of `root` with the same structure and node values of `subRoot` and `false` otherwise.

A subtree of a binary tree is a tree that consists of a node in tree and all of this node's descendants. The tree could also be considered as a subtree of itself.

**Example 1:**

Input: `root = [3,4,5,1,2]`, `subRoot = [4,1,2]`
Output: `true`

**Example 2:**

Input: `root = [3,4,5,1,2,null,null,null,null,0]`, `subRoot = [4,1,2]`
Output: `false`

---

## Constraints

- The number of nodes in the root tree is in the range `[1, 2000]`.
- The number of nodes in the subRoot tree is in the range `[1, 1000]`.
- `-10^4 <= root.val <= 10^4`
- `-10^4 <= subRoot.val <= 10^4`

---

## Solution

```
# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def isSubtree(root: TreeNode, subRoot: TreeNode) -> bool:
    if not root:
        return False
    if isSameTree(root, subRoot):
        return True
    return isSubtree(root.left, subRoot) or isSubtree(root.right, subRoot)

def isSameTree(p: TreeNode, q: TreeNode) -> bool:
    if not p and not q:
        return True
    if not p or not q:
        return False
    return p.val == q.val and isSameTree(p.left, q.left) and isSameTree(p.right, q.right)
```

---

## Explanation

To check if `subRoot` is a subtree of `root`, we traverse `root` and at each node, check if the subtree rooted there matches `subRoot` exactly.

1. If `root` is `None`, return `False`.
2. Check if the current `root` matches `subRoot` using `isSameTree`.
3. If yes, return `True`.
4. Otherwise, recursively check left and right subtrees.
5. `isSameTree` compares two trees: both `None` → `True`; one `None` → `False`; else, values equal and left/right match.

This ensures we find any subtree identical to `subRoot`.

**Time Complexity:** O(n * m), where n is root nodes, m is subRoot nodes, worst case skewed trees.

**Space Complexity:** O(h), recursion stack, h is height of root.
