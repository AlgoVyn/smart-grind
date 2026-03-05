# Graph - Deep Copy / Cloning

## Problem Description

The Graph Deep Copy pattern creates a complete deep copy of a graph, duplicating all nodes and edges while preserving the structure. This is crucial when you need independent copies of graph data structures, especially with complex node objects containing additional data. The pattern handles cyclic references properly using a visited map.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(V + E) where V is vertices, E is edges |
| Space Complexity | O(V) for the visited map |
| Input | Node-based graph or adjacency list |
| Output | Deep copy of the graph |
| Approach | DFS/BFS with hash map for visited tracking |

### When to Use

- Create independent copies of graph structures
- Modify a graph without affecting the original
- Serialize/deserialize graph objects
- Implement undo functionality for graph operations
- Clone complex object graphs with references
- Handle cyclic graph structures safely

## Intuition

The key insight is to use a hash map to track visited nodes, mapping original nodes to their copies to handle cycles and avoid infinite recursion.

The "aha!" moments:

1. **Node mapping**: Use a hash map to map original nodes to their copies
2. **Cycle handling**: Visited tracking prevents infinite loops in cyclic graphs
3. **Create before recurse**: Create the copy node before recursing to neighbors
4. **Reuse copies**: Return existing copy if node already visited
5. **Edge recreation**: Connect copied nodes using the same relationships

## Solution Approaches

### Approach 1: DFS Recursive Deep Copy ✅ Recommended

#### Algorithm

1. Create a hash map to store original node -> copy node mapping
2. Define recursive function that:
   - Returns None if input node is None
   - Returns existing copy if node already in map
   - Creates new copy node with same value
   - Stores mapping in visited map
   - Recursively copies all neighbors
   - Appends copied neighbors to copy node's neighbors list
3. Return the copied node

#### Implementation

````carousel
```python
class Node:
    """Graph node definition."""
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []

def clone_graph(node: 'Node') -> 'Node':
    """
    Clone an undirected graph using DFS.
    LeetCode 133 - Clone Graph
    Time: O(V + E), Space: O(V)
    """
    if not node:
        return None
    
    # Map original nodes to their copies
    visited = {}
    
    def dfs(original):
        if original in visited:
            return visited[original]
        
        # Create copy
        copy = Node(original.val)
        visited[original] = copy
        
        # Recursively copy neighbors
        for neighbor in original.neighbors:
            copy.neighbors.append(dfs(neighbor))
        
        return copy
    
    return dfs(node)


# Alternative: Handle adjacency list representation
def clone_graph_adj_list(graph):
    """
    Clone graph represented as adjacency list.
    """
    if not graph:
        return {}
    
    visited = {}
    
    def dfs(node):
        if node in visited:
            return
        
        visited[node] = []
        for neighbor in graph.get(node, []):
            dfs(neighbor)
            visited[node].append(neighbor)
    
    for node in graph:
        if node not in visited:
            dfs(node)
    
    return visited
```
<!-- slide -->
```cpp
/*
// Definition for a Node.
class Node {
public:
    int val;
    vector<Node*> neighbors;
    Node() {
        val = 0;
        neighbors = vector<Node*>();
    }
    Node(int _val) {
        val = _val;
        neighbors = vector<Node*>();
    }
    Node(int _val, vector<Node*> _neighbors) {
        val = _val;
        neighbors = _neighbors;
    }
};
*/

class Solution {
public:
    Node* cloneGraph(Node* node) {
        if (!node) return nullptr;
        
        unordered_map<Node*, Node*> visited;
        return dfs(node, visited);
    }
    
private:
    Node* dfs(Node* original, unordered_map<Node*, Node*>& visited) {
        if (visited.count(original)) {
            return visited[original];
        }
        
        // Create copy
        Node* copy = new Node(original->val);
        visited[original] = copy;
        
        // Recursively copy neighbors
        for (Node* neighbor : original->neighbors) {
            copy->neighbors.push_back(dfs(neighbor, visited));
        }
        
        return copy;
    }
};
```
<!-- slide -->
```java
/*
// Definition for a Node.
class Node {
    public int val;
    public List<Node> neighbors;
    public Node() {
        val = 0;
        neighbors = new ArrayList<Node>();
    }
    public Node(int _val) {
        val = _val;
        neighbors = new ArrayList<Node>();
    }
    public Node(int _val, ArrayList<Node> _neighbors) {
        val = _val;
        neighbors = _neighbors;
    }
}
*/

class Solution {
    private Map<Node, Node> visited = new HashMap<>();
    
    public Node cloneGraph(Node node) {
        if (node == null) return null;
        return dfs(node);
    }
    
    private Node dfs(Node original) {
        if (visited.containsKey(original)) {
            return visited.get(original);
        }
        
        // Create copy
        Node copy = new Node(original.val);
        visited.put(original, copy);
        
        // Recursively copy neighbors
        for (Node neighbor : original.neighbors) {
            copy.neighbors.add(dfs(neighbor));
        }
        
        return copy;
    }
}
```
<!-- slide -->
```javascript
/**
 * // Definition for a Node.
 * function Node(val, neighbors) {
 *    this.val = val === undefined ? 0 : val;
 *    this.neighbors = neighbors === undefined ? [] : neighbors;
 * };
 */

/**
 * @param {Node} node
 * @return {Node}
 */
function cloneGraph(node) {
    if (!node) return null;
    
    const visited = new Map();
    
    function dfs(original) {
        if (visited.has(original)) {
            return visited.get(original);
        }
        
        // Create copy
        const copy = new Node(original.val);
        visited.set(original, copy);
        
        // Recursively copy neighbors
        for (const neighbor of original.neighbors) {
            copy.neighbors.push(dfs(neighbor));
        }
        
        return copy;
    }
    
    return dfs(node);
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(V + E) - Visit each node and edge once |
| Space | O(V) - Hash map for visited nodes |

### Approach 2: BFS Iterative Deep Copy

#### Algorithm

1. Handle edge case: return None if input node is None
2. Create hash map and initialize with first node
3. Use queue starting with input node
4. While queue not empty:
   - Dequeue original node
   - For each neighbor:
     - If not in map, create copy and enqueue
     - Add copied neighbor to copy node's neighbors
5. Return the copied starting node

#### Implementation

````carousel
```python
from collections import deque

def clone_graph_bfs(node: 'Node') -> 'Node':
    """
    Clone graph using BFS iteration.
    Time: O(V + E), Space: O(V)
    """
    if not node:
        return None
    
    # Map original nodes to copies
    visited = {node: Node(node.val)}
    queue = deque([node])
    
    while queue:
        original = queue.popleft()
        copy = visited[original]
        
        for neighbor in original.neighbors:
            if neighbor not in visited:
                # Create copy and enqueue
                visited[neighbor] = Node(neighbor.val)
                queue.append(neighbor)
            # Connect to copied neighbor
            copy.neighbors.append(visited[neighbor])
    
    return visited[node]
```
<!-- slide -->
```cpp
class Solution {
public:
    Node* cloneGraph(Node* node) {
        if (!node) return nullptr;
        
        unordered_map<Node*, Node*> visited;
        queue<Node*> q;
        
        // Initialize with first node
        visited[node] = new Node(node->val);
        q.push(node);
        
        while (!q.empty()) {
            Node* original = q.front();
            q.pop();
            
            for (Node* neighbor : original->neighbors) {
                if (!visited.count(neighbor)) {
                    visited[neighbor] = new Node(neighbor->val);
                    q.push(neighbor);
                }
                visited[original]->neighbors.push_back(visited[neighbor]);
            }
        }
        
        return visited[node];
    }
};
```
<!-- slide -->
```java
class Solution {
    public Node cloneGraph(Node node) {
        if (node == null) return null;
        
        Map<Node, Node> visited = new HashMap<>();
        Queue<Node> queue = new LinkedList<>();
        
        // Initialize with first node
        visited.put(node, new Node(node.val));
        queue.offer(node);
        
        while (!queue.isEmpty()) {
            Node original = queue.poll();
            
            for (Node neighbor : original.neighbors) {
                if (!visited.containsKey(neighbor)) {
                    visited.put(neighbor, new Node(neighbor.val));
                    queue.offer(neighbor);
                }
                visited.get(original).neighbors.add(visited.get(neighbor));
            }
        }
        
        return visited.get(node);
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {Node} node
 * @return {Node}
 */
function cloneGraph(node) {
    if (!node) return null;
    
    const visited = new Map();
    const queue = [node];
    
    // Initialize with first node
    visited.set(node, new Node(node.val));
    
    while (queue.length > 0) {
        const original = queue.shift();
        
        for (const neighbor of original.neighbors) {
            if (!visited.has(neighbor)) {
                visited.set(neighbor, new Node(neighbor.val));
                queue.push(neighbor);
            }
            visited.get(original).neighbors.push(visited.get(neighbor));
        }
    }
    
    return visited.get(node);
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(V + E) - Visit each node and edge once |
| Space | O(V) - Hash map and queue |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| DFS Recursive | O(V + E) | O(V) | **Recommended** - Clean and intuitive |
| BFS Iterative | O(V + E) | O(V) | When recursion depth is a concern |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Clone Graph](https://leetcode.com/problems/clone-graph/) | 133 | Medium | Deep copy of connected undirected graph |
| [Copy List with Random Pointer](https://leetcode.com/problems/copy-list-with-random-pointer/) | 138 | Medium | Linked list with random pointers |
| [Clone Binary Tree with Random Pointer](https://leetcode.com/problems/clone-binary-tree-with-random-pointer/) | 1485 | Medium | Binary tree with random pointers |
| [Clone N-ary Tree](https://leetcode.com/problems/clone-n-ary-tree/) | 1490 | Easy | Clone an n-ary tree |
| [Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/) | 297 | Hard | Convert tree to string and back |

## Video Tutorial Links

1. **[NeetCode - Clone Graph](https://www.youtube.com/watch?v=mQeF6bN8hMk)** - DFS and BFS solutions
2. **[Kevin Naughton Jr. - Clone Graph](https://www.youtube.com/watch?v=5W7Aq v-J6Q)** - Hash map approach
3. **[Nick White - Clone Graph](https://www.youtube.com/watch?v=vmaX8NjYHU)** - Step by step walkthrough
4. **[Back To Back SWE - Deep Copy](https://www.youtube.com/watch?v=vXqKx6F8fVg)** - General pattern explanation

## Summary

### Key Takeaways

- **Hash map is essential**: Maps original nodes to copies
- **Create copy first**: Add to map before recursing to handle cycles
- **Check map first**: Return existing copy if already visited
- **DFS vs BFS**: Both work; DFS is often more intuitive
- **Cycle handling**: The map naturally handles cycles

### Common Pitfalls

- Forgetting the visited map leads to infinite recursion in cycles
- Not adding to map before recursing (causes duplicate nodes)
- Creating copy nodes multiple times for same original node
- Incorrectly mapping neighbors to original instead of copied nodes
- Not handling disconnected graphs (iterate through all nodes)
- Shallow copying node data instead of deep copying

### Follow-up Questions

1. **How to clone a graph with weighted edges?**
   - Same approach, just include weight in edge information

2. **What if the graph is disconnected?**
   - Iterate through all nodes and clone each component

3. **How to handle very large graphs that don't fit in memory?**
   - Use external storage or stream-based processing

4. **Can you clone without extra space?**
   - Not for general graphs; need some way to track visited nodes

## Pattern Source

[Graph - Deep Copy / Cloning](patterns/graph-deep-copy-cloning.md)
