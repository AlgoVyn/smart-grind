# Binary Tree Right Side View

## Problem Description

Given the root of a binary tree, imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.

---

## Examples

**Example 1:**

**Input:**

```

root = [1,2,3,null,5,null,4]

```

**Output:**

```

[1,3,4]

```

**Explanation:**

**Example 2:**

**Input:**

```

root = [1,2,3,4,null,null,null,5]

```

**Output:**

```

[1,3,4,5]

```

**Explanation:**

**Example 3:**

**Input:**

```

root = [1,null,3]

```

**Output:**

```

[1,3]

```

**Example 4:**

**Input:**

```

root = []

```

**Output:**

```

[]

```

---

## Constraints

- The number of nodes in the tree is in the range [0, 100].
- -100 <= Node.val <= 100

---

## Solution

```python
from typing import Optional, List
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def rightSideView(self, root: Optional[TreeNode]) -> List[int]:
        if not root:
            return []
        result = []
        queue = deque([root])
        while queue:
            level_size = len(queue)
            for i in range(level_size):
                node = queue.popleft()
                if i == level_size - 1:
                    result.append(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
        return result
```

---

## Explanation

This solution uses Breadth-First Search (BFS) to traverse the binary tree level by level. We maintain a queue to process nodes in order. For each level, we keep track of the level size and append the value of the last node in that level to the result list, as it represents the rightmost node visible from the right side.

---

## Time Complexity
**O(n)**, where n is the number of nodes in the tree, since we visit each node exactly once.

---

## Space Complexity
**O(w)**, where w is the maximum width of the tree, which is the size of the queue in the worst case.
