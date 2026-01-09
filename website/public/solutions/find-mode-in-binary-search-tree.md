# Find Mode In Binary Search Tree

## Problem Description

Given the root of a binary search tree (BST) with duplicates, return all the mode(s) (i.e., the most frequently occurred element) in it. If the tree has more than one mode, return them in any order.

Assume a BST is defined as follows:

- The left subtree of a node contains only nodes with keys less than or equal to the node's key.
- The right subtree of a node contains only nodes with keys greater than or equal to the node's key.
- Both the left and right subtrees must also be binary search trees.

### Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `root = [1,null,2,2]` | `[2]` |

**Example 2:**

| Input | Output |
|-------|--------|
| `root = [0]` | `[0]` |

### Constraints

| Constraint | Description |
|------------|-------------|
| Number of nodes | `[1, 10^4]` |
| Node values | `-10^5 <= Node.val <= 10^5` |

### Follow-up

Could you do that without using any extra space? (Assume that the implicit stack space incurred due to recursion does not count).

---

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
            
            # Count frequency of current value
            if self.prev is None or node.val != self.prev:
                self.count = 1
            else:
                self.count += 1
            
            # Update max_count and modes
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

Since it's a BST, an inorder traversal visits nodes in sorted order. We can use this property to count frequencies of consecutive equal values efficiently.

1. **Perform inorder traversal** — Visits nodes in ascending order.
2. **Track four key variables:**
   - `prev` — Previous node value
   - `count` — Current frequency count
   - `max_count` — Maximum frequency encountered
   - `modes` — List of values with maximum frequency
3. **For each node:**
   - If different from `prev`, reset `count` to 1
   - Otherwise, increment `count`
   - Update `max_count` and `modes` accordingly
4. **Return** the `modes` list

**Key Insight:** In a BST, duplicate values appear consecutively during inorder traversal, making frequency counting straightforward.

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | `O(n)` — Each node is visited exactly once |
| **Space** | `O(h)` — Recursion stack depth, where `h` is tree height. Plus `O(k)` for modes output |

---
