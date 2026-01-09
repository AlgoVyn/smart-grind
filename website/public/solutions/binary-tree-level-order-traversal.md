# Binary Tree Level Order Traversal

## Problem Description

Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).

## Examples

**Example 1:**

**Input:**
```python
root = [3,9,20,null,null,15,7]
```

**Output:**
```python
[[3],[9,20],[15,7]]
```

**Example 2:**

**Input:**
```python
root = [1]
```

**Output:**
```python
[[1]]
```

**Example 3:**

**Input:**
```python
root = []
```

**Output:**
```python
[]
```

## Constraints

- The number of nodes in the tree is in the range `[0, 2000]`.
- `-1000 <= Node.val <= 1000`

## Solution

```python
from typing import List, Optional
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        if not root:
            return []
        result = []
        queue = deque([root])
        while queue:
            level = []
            for _ in range(len(queue)):
                node = queue.popleft()
                level.append(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            result.append(level)
        return result
```

## Explanation

This solution uses breadth-first search (BFS) with a queue to traverse the tree level by level. For each level, we process all nodes at that level, collect their values, and enqueue their children for the next level.

## Time Complexity
**O(n)**, where n is the number of nodes, as each node is visited once.

## Space Complexity
**O(w)**, where w is the maximum width of the tree (number of nodes at the widest level), due to the queue.
