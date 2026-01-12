# Kth Smallest Element In A BST

## Problem Description

Given the root of a **Binary Search Tree (BST)** and an integer `k`, return the kth smallest value (1-indexed) of all node values in the tree.

---

## Examples

### Example 1

| Input | Output |
|-------|--------|
| `root = [3,1,4,null,2], k = 1` | `1` |

### Example 2

| Input | Output |
|-------|--------|
| `root = [5,3,6,2,4,null,null,1], k = 3` | `3` |

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `1 ≤ k ≤ n ≤ 10^4` | Tree node count |
| `0 ≤ Node.val ≤ 10^4` | Node values |

---

## Solution

```python
from typing import Optional

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val: int = 0, left: Optional['TreeNode'] = None, right: Optional['TreeNode'] = None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:
        stack = []
        curr = root
        
        # Inorder traversal: left -> node -> right
        while curr or stack:
            # Go to the leftmost node
            while curr:
                stack.append(curr)
                curr = curr.left
            
            # Process the node
            curr = stack.pop()
            k -= 1
            if k == 0:
                return curr.val
            
            # Move to right subtree
            curr = curr.right
```

---

## Explanation

Since **BST inorder traversal visits nodes in sorted order**, we perform an **iterative inorder traversal**:

1. **Traverse left:** Push all left children onto the stack
2. **Process node:** Pop from stack, this is the next smallest
3. **Decrement k:** Track how many nodes we've visited
4. **Return:** When `k == 0`, we've found the kth smallest
5. **Right subtree:** Continue with the right subtree

### Key Insight

We stop as soon as we find the kth smallest element, making this efficient when k is small.

---

## Complexity Analysis

| Metric | Complexity | Description |
|--------|------------|-------------|
| **Time** | `O(h + k)` | Height + k nodes visited |
| **Space** | `O(h)` | Stack depth (height of tree) |

- In worst case (skewed tree): `O(n)` time and space
- In balanced tree: `O(log n)` time and space

---

## Follow-up Challenge

**Optimized approach for frequent queries:**

If the BST is modified often (insert/delete) and you need to find kth smallest frequently:

> Add a `size` attribute to each node representing the subtree size. This allows O(h) queries and O(h) updates.

```python
# Concept: Augmented TreeNode
class TreeNode:
    def __init__(self, val: int, left: Optional['TreeNode'] = None, right: Optional['TreeNode'] = None):
        self.val = val
        self.left = left
        self.right = right
        self.size = 1  # Size of this subtree

# Query: kthSmallest using size
def kthSmallest(root: Optional[TreeNode], k: int) -> int:
    left_size = root.left.size if root.left else 0
    if k <= left_size:
        return kthSmallest(root.left, k)
    elif k == left_size + 1:
        return root.val
    else:
        return kthSmallest(root.right, k - left_size - 1)
```
