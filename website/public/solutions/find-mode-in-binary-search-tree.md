# Find Mode In Binary Search Tree

## Problem Description

Given the root of a binary search tree (BST) with duplicates, return all the mode(s) (i.e., the most frequently occurred element) in it.
If the tree has more than one mode, return them in any order.
Assume a BST is defined as follows:

- The left subtree of a node contains only nodes with keys less than or equal to the node's key.
- The right subtree of a node contains only nodes with keys greater than or equal to the node's key.
- Both the left and right subtrees must also be binary search trees.

### Examples

**Example 1:**

**Input:** root = [1,null,2,2]

**Output:** [2]

**Example 2:**

**Input:** root = [0]

**Output:** [0]

### Constraints

- The number of nodes in the tree is in the range [1, 10^4].
- -10^5 <= Node.val <= 10^5

### Follow up

Could you do that without using any extra space? (Assume that the implicit stack space incurred due to recursion does not count).

## Solution

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

from typing import List, Optional

class Solution:
    def findMode(self, root: Optional[TreeNode]) -> List[int]:
        if not root:
            return []
        
        self.max_count = 0
        self.count = 0
        self.prev = None
        self.modes = []
        
        def inorder(node):
            if not node:
                return
            inorder(node.left)
            if self.prev is None or node.val != self.prev:
                self.count = 1
            else:
                self.count += 1
            if self.count > self.max_count:
                self.max_count = self.count
                self.modes = [node.val]
            elif self.count == self.max_count:
                self.modes.append(node.val)
            self.prev = node.val
            inorder(node.right)
        
        inorder(root)
        return self.modes
```

### Approach

Since it's a BST, an inorder traversal visits nodes in sorted order. We can use this to count frequencies of consecutive equal values.

1. Perform inorder traversal.

2. Track the previous value, current count, max count, and list of modes.

3. For each node:
   - If it's different from previous, reset count to 1.
   - Else, increment count.
   - If count > max_count, update max_count and reset modes to [current val].
   - If count == max_count, append current val to modes.
   - Update previous to current val.

4. Return the modes list.

This uses O(1) extra space besides the output and recursion stack.

### Complexity

**Time Complexity:** O(n), where n is the number of nodes.

**Space Complexity:** O(h) for recursion stack, where h is tree height, plus O(k) for modes where k is number of modes.
