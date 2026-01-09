# All Nodes Distance K In Binary Tree

## Problem Description

Given the root of a binary tree, the value of a target node `target`, and an integer `k`, return an array of the values of all nodes that have a distance `k` from the target node.
You can return the answer in any order.

## Examples

**Example 1:**

**Input:**
```python
root = [3,5,1,6,2,0,8,null,null,7,4], target = 5, k = 2
```

**Output:**
```
[7,4,1]
```

**Explanation:** The nodes that are a distance 2 from the target node (with value 5) have values 7, 4, and 1.

**Example 2:**

**Input:**
```python
root = [1], target = 1, k = 3
```

**Output:**
```
[]
```

## Constraints

- The number of nodes in the tree is in the range `[1, 500]`.
- `0 <= Node.val <= 500`
- All the values `Node.val` are unique.
- `target` is the value of one of the nodes in the tree.
- `0 <= k <= 1000`

## Solution

```python
from collections import defaultdict, deque
from typing import List

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None

class Solution:
    def distanceK(self, root: TreeNode, target: TreeNode, k: int) -> List[int]:
        if not root:
            return []

        # Build graph
        graph = defaultdict(list)
        def build_graph(node, parent):
            if not node:
                return
            if parent:
                graph[node].append(parent)
                graph[parent].append(node)
            build_graph(node.left, node)
            build_graph(node.right, node)

        build_graph(root, None)

        # BFS from target
        visited = set([target])
        queue = deque([(target, 0)])
        result = []

        while queue:
            node, dist = queue.popleft()
            if dist == k:
                result.append(node.val)
            elif dist > k:
                break
            for nei in graph[node]:
                if nei not in visited:
                    visited.add(nei)
                    queue.append((nei, dist + 1))

        return result
```

## Explanation

To solve this problem, we need to find all nodes in a binary tree that are exactly K distance away from a given target node. Since a binary tree is not inherently a graph with bidirectional edges, we first convert it into an undirected graph by building an adjacency list. This is done using a DFS traversal where we add edges between parent and child nodes.

The graph building step has a time complexity of O(N), where N is the number of nodes, as we visit each node once.

Once the graph is built, we perform a BFS starting from the target node. We use a queue to keep track of nodes and their distances from the target. A visited set ensures we don't process the same node multiple times, which is crucial since the graph is undirected and could lead to cycles in traversal.

During BFS, when we encounter a node at distance exactly K, we add its value to the result list. We stop adding to the queue once the distance exceeds K to optimize performance.

## Time Complexity
**O(N)** in the worst case, as we might visit all nodes.

## Space Complexity
**O(N)** due to the graph storage and the queue.

This approach ensures we efficiently find all nodes at the required distance without redundant computations.
