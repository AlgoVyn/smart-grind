# Find Duplicate Subtrees

## Problem Description

Given the root of a binary tree, return all duplicate subtrees.
For each kind of duplicate subtrees, you only need to return the root node of any one of them.
Two trees are duplicate if they have the same structure with the same node values.

## Constraints

- The number of the nodes in the tree will be in the range [1, 5000]
- -200 <= Node.val <= 200

## Example 1

**Input:**
```python
root = [1,2,3,4,null,2,4,null,null,4]
```

**Output:**
```python
[[2,4],[4]]
```

## Example 2

**Input:**
```python
root = [2,1,1]
```

**Output:**
```python
[[1]]
```

## Example 3

**Input:**
```python
root = [2,2,2,3,null,3,null]
```

**Output:**
```python
[[2,3],[3]]
```

## Solution

```python
from typing import List, Optional

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def findDuplicateSubtrees(self, root: Optional[TreeNode]) -> List[Optional[TreeNode]]:
        from collections import defaultdict
        
        count = defaultdict(int)
        result = []
        
        def dfs(node):
            if not node:
                return "#"
            left = dfs(node.left)
            right = dfs(node.right)
            s = str(node.val) + "," + left + "," + right
            count[s] += 1
            if count[s] == 2:
                result.append(node)
            return s
        
        dfs(root)
        return result
```

## Explanation

This problem requires finding all duplicate subtrees in a binary tree, where duplicates have the same structure and node values.

### Step-by-Step Explanation:

1. **Serialization approach:**
   - Use DFS to traverse the tree and serialize each subtree into a string representation.
   - The serialization includes the node value and the serialized left and right subtrees, separated by commas.
   - Use a dictionary to count occurrences of each serialized string.

2. **Identify duplicates:**
   - During DFS, increment the count for each subtree's serialization.
   - When a serialization's count reaches 2, add the current node to the result list (ensuring each duplicate type is added only once).

3. **Edge cases:**
   - Null nodes are represented as "#" in serialization.
   - The result contains root nodes of duplicate subtrees, not copies.

### Time Complexity:

O(N), where N is the number of nodes, as each node is visited once and string operations are proportional to subtree size.

### Space Complexity:

O(N), for the recursion stack, count dictionary, and result list. String storage could be O(N^2) in worst case, but typically acceptable.
