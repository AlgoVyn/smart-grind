# Maximum Level Sum Of A Binary Tree

## Problem Description
Given the root of a binary tree, the level of its root is 1, the level of its children is 2, and so on.
Return the smallest level x such that the sum of all the values of nodes at level x is maximal.
 
Example 1:
Input: root = [1,7,0,7,-8,null,null]
Output: 2
Explanation: 
Level 1 sum = 1.
Level 2 sum = 7 + 0 = 7.
Level 3 sum = 7 + -8 = -1.
So we return the level with the maximum sum which is level 2.

Example 2:

Input: root = [989,null,10250,98693,-89388,null,null,null,-32127]
Output: 2

 
Constraints:

The number of nodes in the tree is in the range [1, 104].
-105 <= Node.val <= 105
## Solution

```python
from collections import deque

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def maxLevelSum(self, root: TreeNode) -> int:
        if not root:
            return 0
        
        queue = deque([root])
        level = 1
        max_sum = float('-inf')
        max_level = 0
        
        while queue:
            level_sum = 0
            for _ in range(len(queue)):
                node = queue.popleft()
                level_sum += node.val
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            
            if level_sum > max_sum:
                max_sum = level_sum
                max_level = level
            
            level += 1
        
        return max_level
```

## Explanation

This problem finds the level with the maximum sum in a binary tree, returning the smallest level if ties.

### Step-by-Step Approach:

1. **BFS Setup**: Use a queue starting with root, level = 1.

2. **Track Max**: Initialize max_sum = -inf, max_level = 0.

3. **Process Levels**: While queue not empty:
   - Calculate level_sum by summing node values in current level.
   - Enqueue children.
   - If level_sum > max_sum, update max_sum and max_level.
   - Increment level.

4. **Return Result**: max_level.

### Time Complexity:
- O(n), where n is nodes, each visited once.

### Space Complexity:
- O(w), where w is max width of tree.
