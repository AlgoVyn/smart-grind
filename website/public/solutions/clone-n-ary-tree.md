# Clone N Ary Tree

## Problem Description
## Solution
```python
class Node:
    def __init__(self, val=None, children=None):
        self.val = val
        self.children = children if children is not None else []

class Solution:
    def cloneTree(self, root: 'Node') -> 'Node':
        if not root:
            return None
        clone = Node(root.val, [])
        for child in root.children:
            clone.children.append(self.cloneTree(child))
        return clone
```

## Explanation
This solution uses recursive DFS to clone the N-ary tree. For each node, create a new node with the same value and recursively clone each child, appending to the children's list.

Time Complexity: O(n), where n is the number of nodes, as we visit each node once.

Space Complexity: O(h), where h is the height of the tree, due to the recursion stack.
