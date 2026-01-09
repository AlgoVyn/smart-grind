# House Robber III

## Problem Description

The thief has found a new place for his thievery. There is only one entrance to this area, called `root`. Besides the root, each house has one and only one parent house.

After investigation, the thief realized that all houses in this place form a **binary tree**. The security system will automatically contact the police if two directly-linked houses were broken into on the same night.

Given the root of the binary tree, return the maximum amount of money the thief can rob without alerting the police.

---

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `root = [3,2,3,null,3,null,1]` | `7` |

**Explanation:** Maximum amount = `3 + 3 + 1 = 7`.

**Example 2:**

| Input | Output |
|-------|--------|
| `root = [3,4,5,1,3,null,1]` | `9` |

**Explanation:** Maximum amount = `4 + 5 = 9`.

---

## Constraints

- The number of nodes in the tree is in the range `[1, 10⁴]`.
- `0 <= Node.val <= 10⁴`

---

## Solution

```python
from typing import Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def rob(self, root: Optional[TreeNode]) -> int:
        def dfs(node):
            if not node:
                return 0, 0
            left_rob, left_not = dfs(node.left)
            right_rob, right_not = dfs(node.right)
            rob = node.val + left_not + right_not
            not_rob = max(left_rob, left_not) + max(right_rob, right_not)
            return rob, not_rob
        return max(dfs(root))
```

---

## Explanation

This problem maximizes money robbed from a binary tree without robbing adjacent nodes (parent-child relationships).

### State Definition

For each node, we return a tuple `(rob, not_rob)`:
- `rob`: Maximum money if we rob this node
- `not_rob`: Maximum money if we don't rob this node

### Transition Logic

1. **If we rob the current node:**
   - We cannot rob its children.
   - `rob = node.val + left_not + right_not`

2. **If we don't rob the current node:**
   - We can choose to rob or not rob each child.
   - `not_rob = max(left_rob, left_not) + max(right_rob, right_not)`

### Root Answer

Return `max(dfs(root))` which is the maximum of robbing or not robbing the root.

---

## Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - visits each node exactly once |
| **Space** | O(h) - recursion stack where h is the tree height |
