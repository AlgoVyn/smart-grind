# Kth Smallest Element In A Bst

## Problem Description
Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.
 
Example 1:
Input: root = [3,1,4,null,2], k = 1
Output: 1

Example 2:
Input: root = [5,3,6,2,4,null,null,1], k = 3
Output: 3

 
Constraints:

The number of nodes in the tree is n.
1 <= k <= n <= 104
0 <= Node.val <= 104

 
Follow up: If the BST is modified often (i.e., we can do insert and delete operations) and you need to find the kth smallest frequently, how would you optimize?
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
    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:
        stack = []
        curr = root
        while curr or stack:
            while curr:
                stack.append(curr)
                curr = curr.left
            curr = stack.pop()
            k -= 1
            if k == 0:
                return curr.val
            curr = curr.right
```

## Explanation
Since a BST's inorder traversal visits nodes in sorted order, we perform an iterative inorder traversal using a stack.

We traverse to the leftmost node, pushing nodes onto the stack. Then, pop a node, decrement k. If k reaches 0, return the node's value. Otherwise, move to the right subtree.

This stops early when we find the kth smallest, making it efficient.

Time complexity: O(h + k), where h is the height of the tree, as we may traverse up to k nodes. In the worst case, O(n).
Space complexity: O(h), for the stack.
