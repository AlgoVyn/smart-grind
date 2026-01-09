# Find Leaves Of Binary Tree

## Problem Description

Given the root of a binary tree, collect and remove all leaves, repeat until the tree is empty. Return the collection of leaf values in the order they were collected. You answer should be a list of lists, where each list contains the leaf values collected at each step.

---

## Constraints

- The number of nodes in the tree is in the range [1, 100].
- -100 <= Node.val <= 100

---

## Example 1

**Input:**
```python
root = [1,2,3,4,5]
```

**Output:**
```python
[[4,5,3],[2],[1]]
```

---

## Example 2

**Input:**
```python
root = [1]
```

**Output:**
```python
[[1]]
```

---

## Solution

```
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

from typing import List, Optional

class Solution:
    def findLeaves(self, root: Optional[TreeNode]) -> List[List[int]]:
        res = []
        
        def dfs(node):
            if not node:
                return 0
            left = dfs(node.left)
            right = dfs(node.right)
            height = max(left, right) + 1
            if len(res) < height:
                res.extend([[] for _ in range(height - len(res))])
            res[height - 1].append(node.val)
            return height
        
        dfs(root)
        return res
```

---

## Explanation

This problem requires collecting and removing all leaves of a binary tree iteratively until the tree is empty, and returning the lists of leaf values at each step.

We use a depth-first search (DFS) approach with a helper function that computes the height of each subtree and collects the leaves at each level.

### Step-by-Step Explanation:

1. Initialize an empty list `res` to store the result.

2. Define a recursive DFS function that takes a node:
   - If the node is None, return 0 (height of empty tree).
   - Recursively compute the height of the left and right subtrees.
   - The height of the current node is max(left_height, right_height) + 1.
   - If the result list doesn't have enough sublists, extend it with empty lists.
   - Append the node's value to the list at index height - 1 (since heights start from 1).
   - Return the height.

3. Call DFS on the root.

4. Return the result list.

This method ensures that leaves (nodes with height 1) are collected first, then nodes that become leaves after removal, and so on.

### Time Complexity:

O(n), where n is the number of nodes, as each node is visited once.

### Space Complexity:

O(h), where h is the height of the tree, due to the recursion stack. In the worst case, for a skewed tree, h can be n.
