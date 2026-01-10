# Smallest String Starting From Leaf

## Problem Description

You are given the root of a binary tree where each node has a value in the range `[0, 25]` representing the letters 'a' to 'z'.

Return the lexicographically smallest string that starts at a leaf of this tree and ends at the root.

As a reminder, any shorter prefix of a string is lexicographically smaller.

For example, "ab" is lexicographically smaller than "aba".

A leaf of a node is a node that has no children.

### Examples

**Example 1:**
```python
Input: root = [0,1,2,3,4,3,4]
Output: "dba"
```

**Example 2:**
```python
Input: root = [25,1,3,1,3,0,2]
Output: "adz"
```

**Example 3:**
```python
Input: root = [2,2,1,null,1,0,null,0]
Output: "abc"
```

### Constraints

- The number of nodes in the tree is in the range `[1, 8500]`.
- `0 <= Node.val <= 25`

---

## Solution

```python
# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def smallestFromLeaf(root: TreeNode) -> str:
    def dfs(node, path):
        nonlocal smallest
        if not node:
            return
        path.append(chr(ord('a') + node.val))
        if not node.left and not node.right:
            current = ''.join(reversed(path))
            if smallest is None or current < smallest:
                smallest = current
        dfs(node.left, path)
        dfs(node.right, path)
        path.pop()

    smallest = None
    dfs(root, [])
    return smallest
```

---

## Explanation

### Approach

Use DFS to traverse all root-to-leaf paths, building the string from root to leaf, then reverse it to get leaf-to-root string, and keep track of the lexicographically smallest one.

### Step-by-Step Explanation

1. Define a DFS helper function that takes the current node and the path (list of characters).
2. If the node is None, return.
3. Append the current node's character (converted from value) to the path.
4. If the node is a leaf (no left or right children), reverse the path to get the leaf-to-root string and compare it with the current smallest.
5. Recurse on the left and right children.
6. Backtrack by popping the last character from the path.

### Time Complexity

- **O(n * h)**, where `n` is the number of nodes and `h` is the height of the tree, due to string operations at each leaf.

### Space Complexity

- **O(h)**, for the recursion stack and the path list.
