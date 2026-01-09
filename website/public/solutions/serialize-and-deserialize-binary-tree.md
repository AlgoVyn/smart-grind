# Serialize And Deserialize Binary Tree

## Problem Description
Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.
Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.
Clarification: The input/output format is the same as how LeetCode serializes a binary tree. You do not necessarily need to follow this format, so please be creative and come up with different approaches yourself.
 
Example 1:
Input: root = [1,2,3,null,null,4,5]
Output: [1,2,3,null,null,4,5]

Example 2:

Input: root = []
Output: []

 
Constraints:

The number of nodes in the tree is in the range [0, 104].
-1000 <= Node.val <= 1000
## Solution

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Codec:
    def serialize(self, root):
        def dfs(node):
            if not node:
                return ["null"]
            return [str(node.val)] + dfs(node.left) + dfs(node.right)
        return ",".join(dfs(root))
    
    def deserialize(self, data):
        vals = data.split(",")
        i = 0
        def dfs():
            nonlocal i
            if vals[i] == "null":
                i += 1
                return None
            node = TreeNode(int(vals[i]))
            i += 1
            node.left = dfs()
            node.right = dfs()
            return node
        return dfs()
```

## Explanation
For serialization, use preorder DFS to traverse the tree, appending node values as strings and "null" for None nodes, joined by commas. For deserialization, split the string into a list, use a global index to recursively build the tree in preorder: create node, then left, then right.

**Time Complexity:** O(n), where n is number of nodes, for traversal.

**Space Complexity:** O(n), for the serialized string and recursion stack.
