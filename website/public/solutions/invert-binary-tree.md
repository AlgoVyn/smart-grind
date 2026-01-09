# Invert Binary Tree

## Problem Description

Given the root of a binary tree, **invert** the tree, and return its root.

Inverting a binary tree means swapping every left and right child node. This operation transforms the tree into the mirror image of itself.

---

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `root = [4,2,7,1,3,6,9]` | `[4,7,2,9,6,3,1]` |

**Example 2:**

| Input | Output |
|-------|--------|
| `root = [2,1,3]` | `[2,3,1]` |

**Example 3:**

| Input | Output |
|-------|--------|
| `root = []` | `[]` |

---

## Constraints

- The number of nodes in the tree is in the range `[0, 100]`.
- `-100 <= Node.val <= 100`

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
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        if not root:
            return None
        
        # Swap left and right children
        root.left, root.right = root.right, root.left
        
        # Recursively invert subtrees
        self.invertTree(root.left)
        self.invertTree(root.right)
        
        return root
```

---

## Explanation

This problem inverts a binary tree by swapping left and right subtrees recursively.

### Algorithm

1. **Base Case:** If `root` is `None`, return `None`.

2. **Swap Children:** Exchange `root.left` and `root.right`.

3. **Recursive Inversion:**
   - Call `invertTree` on the new left child (originally right).
   - Call `invertTree` on the new right child (originally left).

4. **Return Root:** Return the inverted tree root.

### Alternative Approaches

- **Iterative (BFS):** Use a queue to process nodes level by level, swapping children at each node.
- **Iterative (DFS):** Use a stack for depth-first traversal with explicit stack management.

---

## Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - visits each node exactly once |
| **Space** | O(h) - recursion stack where h is the tree height |

For a balanced tree, O(log n); for a skewed tree, O(n).
