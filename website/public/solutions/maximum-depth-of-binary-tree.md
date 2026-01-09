# Maximum Depth of Binary Tree

## Problem Description

Given the root of a binary tree, return its **maximum depth**.

The **maximum depth** of a binary tree is the number of nodes along the longest path from the root node down to the farthest leaf node.

---

## Examples

### Example 1

**Input:**
```python
root = [3, 9, 20, null, null, 15, 7]
```

**Output:**
```python
3
```

**Explanation:** The longest path is `3 → 20 → 7` (or `3 → 20 → 15`), which has 3 nodes.

### Example 2

**Input:**
```python
root = [1, null, 2]
```

**Output:**
```python
2
```

**Explanation:** The path `1 → 2` has 2 nodes.

---

## Constraints

- The number of nodes in the tree is in the range `[0, 10^4]`
- `-100 <= Node.val <= 100`

---

## Solution

```
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))
```

---

## Explanation

We use **recursive Depth-First Search (DFS)** to compute the depth.

### Key Insight

For any node, the depth of the tree rooted at that node is:
```python
1 + max(depth of left subtree, depth of right subtree)
```

### Algorithm

1. If the node is `None` (empty tree), return `0`
2. Recursively compute the depth of the left subtree
3. Recursively compute the depth of the right subtree
4. Return `1 + max(left_depth, right_depth)`

### Base Case

- An empty tree has depth `0`
- A single node has depth `1`

---

## Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | `O(n)` — Each node is visited exactly once |
| **Space** | `O(h)` — Recursion stack, where `h` is the height of the tree |
