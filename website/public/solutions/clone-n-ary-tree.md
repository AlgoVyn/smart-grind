# Clone N-Ary Tree

## Problem Description

> Given the root of an N-ary tree, return a deep copy of the tree. Each node in the N-ary tree contains a value and a list of its children.

## Solution

```python
class Node:
    def __init__(self, val=None, children=None):
        """
        N-ary tree node.

        Args:
            val: The value of the node
            children: List of child nodes (default: empty list)
        """
        self.val = val
        self.children = children if children is not None else []

class Solution:
    def cloneTree(self, root: 'Node') -> 'Node':
        """
        Create a deep copy of an N-ary tree.

        Args:
            root: Root node of the source tree

        Returns:
            Root node of the cloned tree
        """
        if not root:
            return None

        # Create a new node with the same value
        clone = Node(root.val, [])

        # Recursively clone each child and add to the new node
        for child in root.children:
            clone.children.append(self.cloneTree(child))

        return clone
```

## Explanation

### Algorithm: Recursive DFS

This solution uses a recursive depth-first search to clone the N-ary tree:

1. **Base Case**: If the current node is null, return null.
2. **Create Node**: Create a new node with the same value as the current node.
3. **Recurse**: For each child, recursively clone it and append to the new node's children list.
4. **Return**: Return the cloned subtree.

This approach ensures each node and its entire subtree is copied.

## Complexity Analysis

| Metric | Complexity |
|--------|------------|
| Time | **O(n)** |
| Space | **O(h)** |

- **Time**: O(n), where n is the number of nodes (each node is visited exactly once)
- **Space**: O(h), where h is the height of the tree (due to the recursion stack)
