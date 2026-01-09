# Binary Tree Zigzag Level Order Traversal

## Problem Description
Given the root of a binary tree, return the zigzag level order traversal of its nodes' values. (i.e., from left to right, then right to left for the next level and alternate between).
 
Example 1:
Input: root = [3,9,20,null,null,15,7]
Output: [[3],[20,9],[15,7]]

Example 2:

Input: root = [1]
Output: [[1]]

Example 3:

Input: root = []
Output: []

 
Constraints:

The number of nodes in the tree is in the range [0, 2000].
-100 <= Node.val <= 100
## Solution
```python
from typing import Optional, List
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def zigzagLevelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        if not root:
            return []
        result = []
        queue = deque([root])
        left_to_right = True
        while queue:
            level_size = len(queue)
            level = []
            for _ in range(level_size):
                node = queue.popleft()
                level.append(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            if not left_to_right:
                level.reverse()
            result.append(level)
            left_to_right = not left_to_right
        return result
```

## Explanation
This solution uses Breadth-First Search (BFS) to traverse the binary tree level by level. We maintain a queue and a flag to track the direction of traversal. For each level, we collect the node values in a list. If the direction is right-to-left (indicated by the flag), we reverse the list before adding it to the result.

Time Complexity: O(n), where n is the number of nodes in the tree, since we visit each node exactly once.

Space Complexity: O(w), where w is the maximum width of the tree, which is the size of the queue in the worst case.
