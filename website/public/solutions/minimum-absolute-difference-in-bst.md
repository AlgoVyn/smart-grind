# Minimum Absolute Difference in BST

## Problem Description

Given the root of a Binary Search Tree (BST), return the **minimum absolute difference** between the values of any two different nodes in the tree.

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `root = [4,2,6,1,3]` | `1` |

**Example 2:**

| Input | Output |
|-------|--------|
| `root = [1,0,48,null,null,12,49]` | `1` |

## Constraints

- The number of nodes in the tree is in the range `[2, 10^4]`
- `0 <= Node.val <= 10^5`

> **Note:** This question is the same as LeetCode 783: Minimum Distance Between BST Nodes.

## Solution

```python
from typing import Optional

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def getMinimumDifference(self, root: Optional[TreeNode]) -> int:
        self.min_diff = float('inf')
        self.prev = None
        
        def inorder(node: Optional[TreeNode]) -> None:
            """Inorder traversal visits nodes in sorted order."""
            if not node:
                return
            
            # Traverse left subtree
            inorder(node.left)
            
            # Process current node
            if self.prev is not None:
                self.min_diff = min(self.min_diff, node.val - self.prev)
            self.prev = node.val
            
            # Traverse right subtree
            inorder(node.right)
        
        inorder(root)
        return self.min_diff
```

## Explanation

Since a **BST has in-order traversal in sorted order**, the minimum absolute difference must occur between **consecutive nodes** in the in-order traversal:

1. **Perform in-order traversal** recursively.
2. **Track the previous node's value** (`self.prev`).
3. **Calculate difference** between current node and previous node.
4. **Update minimum difference** found so far.
5. Return the minimum difference after traversal.

## Complexity Analysis

| Metric | Complexity |
|--------|------------|
| Time | `O(n)` — in-order traversal visits each node once |
| Space | `O(h)` — recursion stack, where `h` is the tree height |
