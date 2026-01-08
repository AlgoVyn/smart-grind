# Smallest String Starting From Leaf

## Problem Description
[Link to problem](https://leetcode.com/problems/smallest-string-starting-from-leaf/)

You are given the root of a binary tree where each node has a value in the range [0, 25] representing the letters 'a' to 'z'.
Return the lexicographically smallest string that starts at a leaf of this tree and ends at the root.
As a reminder, any shorter prefix of a string is lexicographically smaller.

For example, "ab" is lexicographically smaller than "aba".

A leaf of a node is a node that has no children.
 
Example 1:


Input: root = [0,1,2,3,4,3,4]
Output: "dba"

Example 2:


Input: root = [25,1,3,1,3,0,2]
Output: "adz"

Example 3:


Input: root = [2,2,1,null,1,0,null,0]
Output: "abc"

 
Constraints:

The number of nodes in the tree is in the range [1, 8500].
0 <= Node.val <= 25


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

## Explanation
To find the lexicographically smallest string from a leaf to the root, use DFS to explore all root-to-leaf paths.

1. DFS function takes node and current path (list of chars).
2. Append current node's char to path.
3. If leaf (no children), reverse path to get leaf-to-root string, compare with smallest.
4. Recurse on left and right, then backtrack by popping path.
5. Return the smallest string found.

Since shorter prefixes are smaller, and we compare full strings, this works.

**Time Complexity:** O(n * h), n nodes, h height, for string operations at leaves.
**Space Complexity:** O(h), for recursion and path.
