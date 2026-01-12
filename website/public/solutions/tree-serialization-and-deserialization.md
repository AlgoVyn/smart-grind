# Tree - Serialization and Deserialization

## Overview

Serialization converts a binary tree into a string representation for storage or transmission, while deserialization reconstructs the tree from that string. This pattern is commonly implemented using preorder traversal with null markers to preserve the tree structure. It's useful for persisting tree data, sending trees over networks, or caching. The benefit is enabling tree manipulation in environments where tree objects aren't directly usable.

## Key Concepts

- **Serialization**: Traverse the tree (preorder), append node values and "null" for missing nodes.
- **Deserialization**: Use an iterator over the serialized data to rebuild the tree recursively.
- **Null Markers**: Indicate missing subtrees to maintain structure.
- **Preorder Preference**: Ensures root is processed first, aiding reconstruction.

## Template

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Codec:
    def serialize(self, root: TreeNode) -> str:
        """Encodes a tree to a single string."""
        if not root:
            return "null"
        return str(root.val) + "," + self.serialize(root.left) + "," + self.serialize(root.right)
    
    def deserialize(self, data: str) -> TreeNode:
        """Decodes your encoded data to tree."""
        def dfs():
            val = next(vals)
            if val == "null":
                return None
            node = TreeNode(int(val))
            node.left = dfs()
            node.right = dfs()
            return node
        
        vals = iter(data.split(","))
        return dfs()
```

## Example Problems

- **Serialize and Deserialize Binary Tree**: Convert a binary tree to a string and back.
- **Serialize and Deserialize BST**: Similar, but for binary search trees.
- **Encode and Decode TinyURL**: Though not tree-specific, similar serialization concepts apply.

## Time and Space Complexity

- **Time Complexity**: O(n), where n is the number of nodes, as each node is processed once during serialization and deserialization.
- **Space Complexity**: O(n) for the serialized string and O(h) for the recursion stack during deserialization, where h is the tree height.

## Common Pitfalls

- **Delimiter Choice**: Ensure the delimiter (e.g., ",") doesn't conflict with node values; use unique separators if needed.
- **Iterator Exhaustion**: In deserialization, ensure the iterator is properly managed to avoid index errors.
- **Null Handling**: Correctly handle "null" strings; don't confuse with string "null" as a value.
- **Tree Reconstruction**: Maintain the correct order (preorder) to rebuild the exact tree structure.