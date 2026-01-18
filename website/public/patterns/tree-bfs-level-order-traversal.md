# Tree BFS - Level Order Traversal

## Overview

Level order traversal, also known as breadth-first search (BFS) for trees, visits all nodes at each level before moving to the next level, processing nodes from left to right. This pattern is particularly useful when you need to process nodes by their depth or when the problem requires understanding the tree's structure level by level, such as finding the maximum width of the tree, calculating sums at each level, or performing operations that depend on node proximity. The benefits include maintaining the hierarchical order of the tree and being efficient for scenarios where depth matters more than the order of visitation within a level.

## Key Concepts

- **Queue Usage**: A queue (FIFO structure) is used to keep track of nodes to visit next. Start by enqueuing the root node.
- **Level Processing**: For each level, dequeue all nodes at that level, process them, and enqueue their children.
- **Null Handling**: Always check for null nodes to avoid errors, especially when dealing with incomplete trees.
- **Result Collection**: Typically, collect results in a list of lists, where each sublist represents a level.

## Template

```python
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def level_order_traversal(root: TreeNode) -> list[list[int]]:
    # Handle edge case: empty tree
    if not root:
        return []
    
    result = []  # To store levels
    queue = deque([root])  # Initialize queue with root
    
    while queue:
        level_size = len(queue)  # Number of nodes at current level
        level = []  # List to hold values at this level
        
        # Process all nodes at current level
        for _ in range(level_size):
            node = queue.popleft()  # Dequeue front node
            level.append(node.val)  # Add node value to level
            
            # Enqueue left and right children if they exist
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        # Add the level to result
        result.append(level)
    
    return result
```

## Example Problems

- **Binary Tree Level Order Traversal**: Given a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).
- **Maximum Level Sum of a Binary Tree**: Find the level in a binary tree that has the maximum sum of node values.
- **Find Largest Value in Each Tree Row**: For each level in a binary tree, find the largest value among the nodes at that level.

## Time and Space Complexity

- **Time Complexity**: O(n), where n is the number of nodes in the tree, as each node is visited exactly once.
- **Space Complexity**: O(w), where w is the maximum width of the tree (the widest level), due to the queue storing nodes at each level. In the worst case for a complete binary tree, this could be O(n).

## Common Pitfalls

- **Forgetting to Handle Empty Trees**: Always check if the root is null at the beginning to avoid runtime errors.
- **Incorrect Level Grouping**: Ensure you process all nodes at a level before moving to the next by using the level size in the loop.
- **Space Issues with Wide Trees**: Be aware that for trees with many nodes at the same level, the queue can grow large, potentially causing memory issues.
- **Not Enqueuing Children Properly**: Always enqueue left before right to maintain left-to-right order, and check for null children.