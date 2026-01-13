## Clone Graph

### Problem Statement

You are given a reference to a node in a connected undirected graph. Return a deep copy (clone) of the entire graph.

Each node in the graph contains:
- `val`: An integer value (1-indexed and unique for each node).
- `neighbors`: A list of references to its neighboring nodes.

The graph is undirected, meaning edges are bidirectional, and it is connected, so all nodes are reachable from the given node. There are no self-loops or repeated edges.

**Input**: A reference to a `Node` (the starting node, which may have `val = 1` in examples, but can be any value).
**Output**: A reference to the cloned `Node` (the corresponding starting node in the cloned graph).

**Constraints**:
- Number of nodes: `0 ≤ n ≤ 100`.
- `1 ≤ Node.val ≤ 100`.
- All `Node.val` values are unique.
- The graph is connected and undirected with no self-loops or multiple edges.

The graph is often represented in examples using an adjacency list format for clarity (e.g., `adjList`), where `adjList[i-1]` lists the neighbors of node `i`. However, in code, you work with the `Node` class directly.

**Node Class Definition** (in Python, for reference):
```python
class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []
```

### Examples

**Example 1**:
- Input: A graph with 4 nodes.
  - Adjacency list representation: `[[2,4],[1,3],[2,4],[1,3]]`
  - This means:
    - Node 1 connected to 2 and 4.
    - Node 2 connected to 1 and 3.
    - Node 3 connected to 2 and 4.
    - Node 4 connected to 1 and 3.
- Output: A cloned graph with the same structure (adjacency list: `[[2,4],[1,3],[2,4],[1,3]]`).
- Explanation: The clone is a separate graph with new nodes having the same values and connections.

**Example 2**:
- Input: A single node with no neighbors.
  - Adjacency list: `[[]]`
- Output: `[[]]`
- Explanation: Clone a isolated node.

**Example 3**:
- Input: Empty graph (no nodes).
  - Adjacency list: `[]`
- Output: `[]`
- Explanation: Return None or equivalent for empty graph.

### Intuition

The goal is to create a deep copy of the graph, meaning we duplicate every node and every edge while preserving the structure. Since the graph can have cycles (it's undirected and connected), we must avoid infinite loops during traversal. The key is to:
- Traverse the graph using DFS or BFS.
- Use a dictionary (hash map) to track visited nodes and their corresponding clones. This maps original nodes to their cloned versions, preventing re-creation of nodes and handling cycles.
- For each node, create a clone, then recursively/iteratively clone its neighbors and add them to the clone's neighbor list.

This ensures we visit each node once and correctly wire up the connections in the clone.

### Multiple Approaches with Code

Here are three common approaches: Recursive DFS, Iterative DFS, and BFS. All use a hash map for tracking clones. Codes are in Python, assuming the `Node` class is defined as above. For LeetCode, the function signature is `def cloneGraph(self, node: Node) -> Node:`.

#### Approach 1: Recursive DFS
- Use recursion to traverse the graph depth-first.
- Base case: If node is None, return None. If already cloned (in map), return the clone.
- Create a new node, add to map, then recursively clone neighbors.

```python
from typing import Dict

class Solution:
    def cloneGraph(self, node: 'Node') -> 'Node':
        if not node:
            return None
        
        old_to_new: Dict['Node', 'Node'] = {}
        
        def dfs(curr: 'Node') -> 'Node':
            if curr in old_to_new:
                return old_to_new[curr]
            
            clone = Node(curr.val)
            old_to_new[curr] = clone
            
            for neighbor in curr.neighbors:
                clone.neighbors.append(dfs(neighbor))
            
            return clone
        
        return dfs(node)
```

- **Time Complexity**: O(V + E), where V is the number of vertices (nodes) and E is the number of edges. We visit each node and edge once.
- **Space Complexity**: O(V) for the hash map and recursion stack (up to O(V) in worst case for a skewed graph).

#### Approach 2: Iterative DFS
- Use a stack for iterative depth-first traversal.
- Similar to recursive, but manage the stack manually to avoid recursion depth issues (though n <= 100, so recursion is fine).

```python
from typing import Dict

class Solution:
    def cloneGraph(self, node: 'Node') -> 'Node':
        if not node:
            return None
        
        old_to_new: Dict['Node', 'Node'] = {}
        stack = [node]
        old_to_new[node] = Node(node.val)  # Pre-create clone
        
        while stack:
            curr = stack.pop()
            clone = old_to_new[curr]
            
            for neighbor in curr.neighbors:
                if neighbor not in old_to_new:
                    old_to_new[neighbor] = Node(neighbor.val)
                    stack.append(neighbor)
                clone.neighbors.append(old_to_new[neighbor])
        
        return old_to_new[node]
```

- **Time Complexity**: O(V + E), same as above.
- **Space Complexity**: O(V) for the hash map and stack.

#### Approach 3: BFS
- Use a queue for breadth-first traversal.
- Start with the given node, create its clone, then process levels by adding neighbors.

```python
from typing import Dict
from collections import deque

class Solution:
    def cloneGraph(self, node: 'Node') -> 'Node':
        if not node:
            return None
        
        old_to_new: Dict['Node', 'Node'] = {}
        queue = deque([node])
        old_to_new[node] = Node(node.val)
        
        while queue:
            curr = queue.popleft()
            clone = old_to_new[curr]
            
            for neighbor in curr.neighbors:
                if neighbor not in old_to_new:
                    old_to_new[neighbor] = Node(neighbor.val)
                    queue.append(neighbor)
                clone.neighbors.append(old_to_new[neighbor])
        
        return old_to_new[node]
```

- **Time Complexity**: O(V + E).
- **Space Complexity**: O(V) for the hash map and queue (queue can hold up to O(V) in worst case).

All approaches are efficient given the small constraints (n <= 100).

### Related Problems
- [138. Copy List with Random Pointer](https://leetcode.com/problems/copy-list-with-random-pointer/) – Similar deep copy with extra pointers.
- [1485. Clone Binary Tree With Random Pointer](https://leetcode.com/problems/clone-binary-tree-with-random-pointer/) – Tree cloning with random pointers.
- [1490. Clone N-ary Tree](https://leetcode.com/problems/clone-n-ary-tree/) – Cloning an n-ary tree.
Other graph traversal problems like [133. Clone Graph](https://leetcode.com/problems/clone-graph/) itself, or BFS/DFS variants (e.g., 200. Number of Islands).

### Video Tutorial Links
Here are some helpful video tutorials:
- [NeetCode: Clone Graph - Depth First Search - Leetcode 133](https://www.youtube.com/watch?v=mQeF6bN8hMk)
- [Graphs (Python): Clone Graph - Leetcode 133](https://www.youtube.com/watch?v=wWE7YzuBBkE)
- [LeetCode 133 - Clone Graph Explained and Solved in Python](https://www.youtube.com/watch?v=Lby2d8dfEk8)