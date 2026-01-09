# Serialize and Deserialize Binary Tree

## Problem Description

Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.

Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.

### Note

The input/output format is the same as how LeetCode serializes a binary tree. You do not necessarily need to follow this format, so please be creative and come up with different approaches yourself.

### Examples

**Example 1:**
- Input: `root = [1,2,3,null,null,4,5]`
- Output: `[1,2,3,null,null,4,5]`

**Example 2:**
- Input: `root = []`
- Output: `[]`

### Constraints

- The number of nodes in the tree is in the range `[0, 10^4]`
- `-1000 <= Node.val <= 1000`

---

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

---

## Explanation

This solution uses preorder traversal for both serialization and deserialization.

### Approach

**Serialization:**
- Use preorder DFS to traverse the tree.
- Append node values as strings and `"null"` for None nodes.
- Join all values with commas to create the serialized string.

**Deserialization:**
- Split the string into a list of values.
- Use a global index to recursively build the tree in preorder.
- For each value:
  - If `"null"`, return `None` and increment index.
  - Otherwise, create a node, then recursively build left and right subtrees.

### Algorithm Steps

1. **Serialize:**
   - Define a recursive function that returns a list of values.
   - For each node, add its value (or `"null"` if `None`).
   - Recursively serialize left and right subtrees.
   - Join the list with commas.

2. **Deserialize:**
   - Split the serialized string into a list of values.
   - Use a nonlocal index to track current position.
   - Define a recursive function that reads the next value and builds the tree.
   - Return the root node.

### Time Complexity

- **O(n)**, where `n` is the number of nodes, for traversal.

### Space Complexity

- **O(n)**, for the serialized string and recursion stack.
