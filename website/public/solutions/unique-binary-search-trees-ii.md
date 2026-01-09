# Unique Binary Search Trees II

## Problem Description

Given an integer `n`, return all the structurally unique BST's (binary search trees) which has exactly `n` nodes of unique values from `1` to `n`. Return the answer in any order.

### Examples

**Example 1:**

**Input:**
```
n = 3
```

**Output:**
```
[[1,null,2,null,3],[1,null,3,2],[2,1,3],[3,1,null,null,2],[3,2,null,1]]
```

**Example 2:**

**Input:**
```
n = 1
```

**Output:**
```
[[1]]
```

### Constraints

- `1 <= n <= 8`

## Solution

```python
from typing import List

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def generateTrees(self, n: int) -> List[TreeNode]:
        def generate(start, end):
            if start > end:
                return [None]
            result = []
            for i in range(start, end + 1):
                left_trees = generate(start, i - 1)
                right_trees = generate(i + 1, end)
                for left in left_trees:
                    for right in right_trees:
                        root = TreeNode(i)
                        root.left = left
                        root.right = right
                        result.append(root)
            return result
        
        if n == 0:
            return []
        return generate(1, n)
```

## Explanation

Use recursion to generate all possible BSTs. For each possible root `i` from `start` to `end`, generate all left subtrees from `start` to `i-1` and right from `i+1` to `end`, then combine each pair to form the tree.

### Time Complexity

- **O(4^n / sqrt(n))**, due to Catalan number growth, as each tree is generated once.

### Space Complexity

- **O(4^n / sqrt(n))**, for storing all trees.
