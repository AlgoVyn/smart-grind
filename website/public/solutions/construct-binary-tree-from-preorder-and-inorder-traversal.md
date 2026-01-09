# Construct Binary Tree From Preorder And Inorder Traversal

## Problem Description
Given two integer arrays preorder and inorder where preorder is the preorder traversal of a binary tree and inorder is the inorder traversal of the same tree, construct and return the binary tree.

## Examples

**Example 1:**

**Input:**
```python
preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
```

**Output:**
```python
[3,9,20,null,null,15,7]
```

**Example 2:**

**Input:**
```python
preorder = [-1], inorder = [-1]
```

**Output:**
```python
[-1]
```

## Constraints

- `1 <= preorder.length <= 3000`
- `inorder.length == preorder.length`
- `-3000 <= preorder[i], inorder[i] <= 3000`
- `preorder` and `inorder` consist of unique values.
- Each value of `inorder` also appears in `preorder`.
- `preorder` is guaranteed to be the preorder traversal of the tree.
- `inorder` is guaranteed to be the inorder traversal of the tree.

## Solution

```python
from typing import List, Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
        if not preorder:
            return None
        root_val = preorder[0]
        root = TreeNode(root_val)
        idx = inorder.index(root_val)
        root.left = self.buildTree(preorder[1:1 + idx], inorder[:idx])
        root.right = self.buildTree(preorder[1 + idx:], inorder[idx + 1:])
        return root
```

## Explanation
This solution uses recursion. The first element of preorder is the root. Find its index in inorder to split left and right subtrees. Recursively build left with preorder[1:1+idx] and inorder[:idx], right with preorder[1+idx:] and inorder[idx+1:].

## Time Complexity
**O(n^2)**, due to index search in inorder.

## Space Complexity
**O(n)**, for the recursion stack.
