# Binary Tree Maximum Path Sum

## Problem Description
A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root.

The path sum of a path is the sum of the node's values in the path.

Given the root of a binary tree, return the maximum path sum of any non-empty path.

---

## Examples

**Example 1:**

**Input:**
```
root = [1,2,3]
```

**Output:**
```
6
```

**Explanation:** The optimal path is `2 -> 1 -> 3` with a path sum of `2 + 1 + 3 = 6`.

**Example 2:**

**Input:**
```
root = [-10,9,20,null,null,15,7]
```

**Output:**
```
42
```

**Explanation:** The optimal path is `15 -> 20 -> 7` with a path sum of `15 + 20 + 7 = 42`.

---

## Constraints

- The number of nodes in the tree is in the range `[1, 3 * 10^4]`
- `-1000 <= Node.val <= 1000`
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
    def maxPathSum(self, root: Optional[TreeNode]) -> int:
        self.max_sum = float('-inf')
        
        def dfs(node):
            if not node:
                return 0
            left = max(dfs(node.left), 0)
            right = max(dfs(node.right), 0)
            self.max_sum = max(self.max_sum, node.val + left + right)
            return node.val + max(left, right)
        
        dfs(root)
        return self.max_sum
```

## Explanation
To find the maximum path sum in a binary tree, where a path can start and end at any node, we use a depth-first search (DFS) approach.

We define a helper function dfs that returns the maximum path sum starting from the current node and going downwards. For each node, we compute the maximum sum from the left and right subtrees, but only if they are positive (since we can choose not to include negative paths). We update the global maximum sum with the sum of the node value plus the left and right maximums.

The maximum path sum through the current node is node.val + left + right, and we take the maximum of that with the current global max.

For the return value of dfs, we return the maximum path sum from the current node downwards, which is node.val + max(left, right).

We initialize max_sum to negative infinity and call dfs on the root.

This ensures we consider all possible paths. Time complexity is O(n), where n is the number of nodes, as we visit each node once. Space complexity is O(h), where h is the height of the tree, due to the recursion stack.
