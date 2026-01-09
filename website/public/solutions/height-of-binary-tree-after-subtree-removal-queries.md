# Height of Binary Tree After Subtree Removal Queries

## Problem Description

You are given the root of a binary tree with `n` nodes. Each node is assigned a unique value from `1` to `n`. You are also given an array `queries` of size `m`.

For each query `i`, remove the subtree rooted at the node with the value `queries[i]` from the tree. The queries are independent, meaning the tree returns to its initial state after each query.

Return an array `answer` of size `m` where `answer[i]` is the height of the tree after performing the `i`th query.

> **Note:** The height of a tree is the number of edges in the longest simple path from the root to some node in the tree. It is guaranteed that `queries[i]` will not be equal to the value of the root.

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `root = [1,3,4,2,null,6,5,null,null,null,null,null,7]`, `queries = [4]` | `[2]` |

**Explanation:** The diagram above shows the tree after removing the subtree rooted at node with value `4`. The height of the tree is `2` (The path `1 -> 3 -> 2`).

**Example 2:**

| Input | Output |
|-------|--------|
| `root = [5,8,9,2,1,3,7,4,6]`, `queries = [3,2,4,8]` | `[3,2,3,2]` |

**Explanation:** The queries have the following effects:

- Removing the subtree rooted at node with value `3`. The height becomes `3` (The path `5 -> 8 -> 2 -> 4`).
- Removing the subtree rooted at node with value `2`. The height becomes `2` (The path `5 -> 8 -> 1`).
- Removing the subtree rooted at node with value `4`. The height becomes `3` (The path `5 -> 8 -> 2 -> 6`).
- Removing the subtree rooted at node with value `8`. The height becomes `2` (The path `5 -> 9 -> 3`).

## Constraints

- The number of nodes in the tree is `n`.
- `2 <= n <= 10⁵`
- `1 <= Node.val <= n`
- All values in the tree are unique.
- `m == queries.length`
- `1 <= m <= min(n, 10⁴)`
- `1 <= queries[i] <= n`
- `queries[i] != root.val`

## Solution

```python
from typing import List, Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def treeQueries(self, root: Optional[TreeNode], queries: List[int]) -> List[int]:
        heights = {}
        
        def get_height(node):
            if not node:
                return 0
            h = 1 + max(get_height(node.left), get_height(node.right))
            heights[node] = h
            return h
        
        get_height(root)
        max_h = max(heights.values())
        second_max = max((h for h in heights.values() if h != max_h), default=0)
        count_max = sum(1 for h in heights.values() if h == max_h)
        node_to_val = {node.val: heights[node] for node in heights}
        
        res = []
        for q in queries:
            h = node_to_val[q]
            if h == max_h and count_max == 1:
                res.append(second_max)
            else:
                res.append(max_h)
        return res
```

## Explanation

This problem computes the height of the tree after removing subtrees for each query using a strategic approach:

1. **Height Computation:** Use DFS to compute the height of each node (number of edges from that node to the deepest leaf).

2. **Global Height Analysis:**
   - Find the maximum height (`max_h`) among all nodes.
   - Find the second maximum height (`second_max`) among nodes that don't have the maximum height.
   - Count how many nodes have the maximum height (`count_max`).

3. **Query Processing:**
   - For each query node with height `h`:
     - If `h == max_h` and it's the **only** node with that height, removing it reduces the tree height to `second_max`.
     - Otherwise, the maximum height remains `max_h` because other branches maintain the original height.

This approach works because removing a subtree only affects the overall tree height if that subtree was uniquely responsible for the maximum height.

## Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + m) where n is the number of nodes and m is the number of queries |
| **Space** | O(n) for storing heights and mappings |

The solution efficiently handles up to 10⁵ nodes and 10⁴ queries.
