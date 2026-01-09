# Find Largest Value In Each Tree Row

## Problem Description

Given the root of a binary tree, return an array of the largest value in each row of the tree (0-indexed).

## Constraints

- The number of nodes in the tree will be in the range [0, 104].
- -231 <= Node.val <= 231 - 1

## Example 1

**Input:**
```python
root = [1,3,2,5,3,null,9]
```

**Output:**
```python
[1,3,9]
```

## Example 2

**Input:**
```python
root = [1,2,3]
```

**Output:**
```python
[1,3]
```

## Solution

```
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

from typing import List, Optional

class Solution:
    def largestValues(self, root: Optional[TreeNode]) -> List[int]:
        if not root:
            return []
        
        result = []
        queue = [root]
        
        while queue:
            level_size = len(queue)
            max_val = float('-inf')
            
            for _ in range(level_size):
                node = queue.pop(0)
                max_val = max(max_val, node.val)
                
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            
            result.append(max_val)
        
        return result
```

## Explanation

To solve this problem, we need to find the largest value in each row (level) of a binary tree. We can use a breadth-first search (BFS) approach to traverse the tree level by level.

### Step-by-Step Explanation:

1. If the root is None, return an empty list since there are no rows.

2. Initialize a queue with the root node and an empty result list.

3. While the queue is not empty:
   - Determine the number of nodes at the current level (level_size).
   - Initialize max_val to negative infinity.
   - For each node in the current level:
     - Dequeue the node.
     - Update max_val with the maximum of max_val and the node's value.
     - Enqueue the left and right children if they exist.
   - Append max_val to the result list.

4. Return the result list.

This approach ensures we process each level separately and find the maximum value for each.

### Time Complexity:

O(n), where n is the number of nodes in the tree, as we visit each node exactly once.

### Space Complexity:

O(w), where w is the maximum width of the tree (the maximum number of nodes at any level), due to the queue used in BFS. In the worst case, for a complete binary tree, w can be up to n/2.
