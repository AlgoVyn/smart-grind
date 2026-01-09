# Binary Tree Inorder Traversal

## Problem Description

Given the root of a binary tree, return the inorder traversal of its nodes' values.

---

## Examples

**Example 1:**

**Input:**
```python
root = [1,null,2,3]
```

**Output:**
```python
[1,3,2]
```

**Explanation:**

**Example 2:**

**Input:**
```python
root = [1,2,3,4,5,null,8,null,null,6,7,9]
```

**Output:**
```python
[4,2,6,5,7,1,3,9,8]
```

**Explanation:**

**Example 3:**

**Input:**
```python
root = []
```

**Output:**
```python
[]
```

**Example 4:**

**Input:**
```python
root = [1]
```

**Output:**
```python
[1]
```

---

## Constraints

- The number of nodes in the tree is in the range `[0, 100]`.
- `-100 <= Node.val <= 100`

---

## Follow up

Recursive solution is trivial, could you do it iteratively?

---

## Solution

```python
from typing import List, Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        result = []
        def inorder(node):
            if node:
                inorder(node.left)
                result.append(node.val)
                inorder(node.right)
        inorder(root)
        return result
```

---

## Explanation

This recursive solution performs an inorder traversal: visit left subtree, then root, then right subtree. We use a helper function to append node values to the result list in the correct order.

---

## Time Complexity
**O(n)**, where n is the number of nodes, as each node is visited once.

---

## Space Complexity
**O(h)**, where h is the height of the tree, due to the recursion stack. In the worst case (skewed tree), this is O(n).
