# Clone Graph

## Problem Description

You are given a reference to a node in a connected undirected graph. Return a deep copy (clone) of the entire graph. Each node in the graph contains a value `val` (a positive integer, 1-indexed and unique for each node) and a list of references to its neighboring nodes.

The graph is undirected, meaning if node A has node B in its neighbors list, then node B must also have node A in its neighbors list. The graph is guaranteed to be connected, so all nodes are reachable from the given starting node.

**Input**: A reference to a `Node` object representing the starting node of the graph.

**Output**: A reference to a cloned `Node` object representing the starting node of the copied graph.

### Node Class Definition

```python
class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []
```

---

## Examples

### Example 1

**Input**: A graph with 4 nodes forming a cycle
```python
Adjacency List: [[2,4],[1,3],[2,4],[1,3]]
```

**Visual Representation**:
```python
1 --- 2
|     |
4 --- 3
```

**Output**: A cloned graph with the same structure
```python
Adjacency List: [[2,4],[1,3],[2,4],[1,3]]
```

**Explanation**: The clone contains completely new Node objects with the same values and connections. Modifying the original graph should not affect the clone and vice versa.

---

### Example 2

**Input**: A single node with no neighbors
```python
Adjacency List: [[]]
```

**Output**: A cloned single node
```python
Adjacency List: [[]]
```

---

### Example 3

**Input**: Empty graph (null node)
```python
Adjacency List: []
```

**Output**: `null`

**Explanation**: Return `None` for an empty graph.

---

## Intuition

The goal is to create a **deep copy** of the graph - not just a reference copy, but an entirely new graph with new Node objects that preserve all the connections and values of the original.

The key challenges are:
1. **Handling Cycles**: Since the graph is undirected and connected, it may contain cycles. Without proper tracking, we could enter an infinite loop during traversal.
2. **Maintaining Connections**: We must ensure that the cloned nodes are correctly connected to their cloned neighbors, not the original nodes.
3. **Avoiding Duplication**: Each original node should correspond to exactly one cloned node.

**Key Insight**: Use a **hash map (dictionary)** to track the mapping between original nodes and their clones. This allows us to:
- Detect if we've already visited a node (preventing infinite loops)
- Reuse existing clones when connecting neighbors
- Check if a node has been cloned in O(1) time

We can traverse the graph using either **DFS** (recursively or iteratively with a stack) or **BFS** (with a queue). All approaches achieve the same goal but differ in traversal order.

---

## Multiple Approaches with Code

### Approach 1: Recursive DFS (Depth-First Search)

This approach uses recursion to traverse the graph depth-first. For each node, we:
1. Check if it's already cloned (return existing clone)
2. Create a new clone node
3. Store the mapping
4. Recursively clone all neighbors and add them to the clone's list

````carousel
```python
# Definition for a Node.
class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []

class Solution:
    def cloneGraph(self, node: 'Node') -> 'Node':
        """
        Clone a graph using recursive DFS approach.
        
        Args:
            node: The starting node of the graph to clone.
            
        Returns:
            The starting node of the cloned graph.
        """
        if not node:
            return None
        
        # Hash map to track original node -> cloned node
        old_to_new = {}
        
        def dfs(current: 'Node') -> 'Node':
            # If already cloned, return the existing clone
            if current in old_to_new:
                return old_to_new[current]
            
            # Create a new clone node
            clone = Node(current.val)
            old_to_new[current] = clone
            
            # Recursively clone all neighbors
            for neighbor in current.neighbors:
                clone.neighbors.append(dfs(neighbor))
            
            return clone
        
        return dfs(node)
```
<!-- slide -->
```java
/**
 * Definition for a Node.
 * class Node {
 *     public int val;
 *     public List<Node> neighbors;
 *     public Node() {
 *         val = 0;
 *         neighbors = new ArrayList<Node>();
 *     }
 *     public Node(int _val) {
 *         val = _val;
 *         neighbors = new ArrayList<Node>();
 *     }
 *     public Node(int _val, ArrayList<Node> _neighbors) {
 *         val = _val;
 *         neighbors = _neighbors;
 *     }
 * }
 */

class Solution {
    private Map<Node, Node> oldToNew;
    
    public Node cloneGraph(Node node) {
        oldToNew = new HashMap<>();
        return dfs(node);
    }
    
    private Node dfs(Node node) {
        if (node == null) {
            return null;
        }
        
        // If already cloned, return existing clone
        if (oldToNew.containsKey(node)) {
            return oldToNew.get(node);
        }
        
        // Create new clone node
        Node clone = new Node(node.val);
        oldToNew.put(node, clone);
        
        // Recursively clone all neighbors
        for (Node neighbor : node.neighbors) {
            clone.neighbors.add(dfs(neighbor));
        }
        
        return clone;
    }
}
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
        neighbors = {};
    }
    Node(int _val) {
        val = _val;
        neighbors = {};
    }
    Node(int _val, vector<Node*> _neighbors) {
        val = _val;
        neighbors = _neighbors;
    }
};
*/

class Solution {
private:
    unordered_map<Node*, Node*> oldToNew;
    
public:
    Node* cloneGraph(Node* node) {
        return dfs(node);
    }
    
private:
    Node* dfs(Node* node) {
        if (node == nullptr) {
            return nullptr;
        }
        
        // If already cloned, return existing clone
        if (oldToNew.find(node) != oldToNew.end()) {
            return oldToNew[node];
        }
        
        // Create new clone node
        Node* clone = new Node(node->val);
        oldToNew[node] = clone;
        
        // Recursively clone all neighbors
        for (Node* neighbor : node->neighbors) {
            clone->neighbors.push_back(dfs(neighbor));
        }
        
        return clone;
    }
};
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
var cloneGraph = function(node) {
    if (!node) return null;
    
    // Hash map to track original node -> cloned node
    const oldToNew = new Map();
    
    function dfs(current) {
        // If already cloned, return existing clone
        if (oldToNew.has(current)) {
            return oldToNew.get(current);
        }
        
        // Create new clone node
        const clone = new Node(current.val);
        oldToNew.set(current, clone);
        
        // Recursively clone all neighbors
        for (const neighbor of current.neighbors) {
            clone.neighbors.push(dfs(neighbor));
        }
        
        return clone;
    }
    
    return dfs(node);
};
```
````

### Explanation

1. **Base Case**: If the input node is `null`, return `null`.
2. **Check Cache**: If the current node has already been cloned, return the cached clone to avoid infinite recursion and duplication.
3. **Create Clone**: Create a new `Node` with the same value as the current node.
4. **Store Mapping**: Add the mapping from original to clone in the hash map.
5. **Recurse**: For each neighbor, recursively clone it and add to the clone's neighbors list.
6. **Return Clone**: Return the fully cloned node.

### Complexity Analysis

- **Time Complexity**: O(V + E), where V is the number of vertices (nodes) and E is the number of edges. Each node and edge is visited exactly once.
- **Space Complexity**: O(V) for the hash map plus O(V) for the recursion stack in the worst case (for a skewed graph).

---

### Approach 2: Iterative DFS (Using Stack)

This approach is similar to recursive DFS but uses an explicit stack instead of the call stack. It's useful when recursion depth might be a concern (though with n ≤ 100, this is rarely an issue).

````carousel
```python
# Definition for a Node.
class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []

class Solution:
    def cloneGraph(self, node: 'Node') -> 'Node':
        """
        Clone a graph using iterative DFS approach with explicit stack.
        
        Args:
            node: The starting node of the graph to clone.
            
        Returns:
            The starting node of the cloned graph.
        """
        if not node:
            return None
        
        # Hash map to track original node -> cloned node
        old_to_new = {}
        
        # Stack for DFS traversal
        stack = [node]
        
        # Create the first clone
        old_to_new[node] = Node(node.val)
        
        while stack:
            current = stack.pop()
            clone = old_to_new[current]
            
            for neighbor in current.neighbors:
                # If neighbor hasn't been cloned yet, create and push to stack
                if neighbor not in old_to_new:
                    old_to_new[neighbor] = Node(neighbor.val)
                    stack.append(neighbor)
                # Add the cloned neighbor to the current clone's neighbors
                clone.neighbors.append(old_to_new[neighbor])
        
        return old_to_new[node]
```
<!-- slide -->
```java
/**
 * Definition for a Node.
 * class Node {
 *     public int val;
 *     public List<Node> neighbors;
 *     public Node() {
 *         val = 0;
 *         neighbors = new ArrayList<Node>();
 *     }
 *     public Node(int _val) {
 *         val = _val;
 *         neighbors = new ArrayList<Node>();
 *     }
 *     public Node(int _val, ArrayList<Node> _neighbors) {
 *         val = _val;
 *         neighbors = _neighbors;
 *     }
 * }
 */

class Solution {
    public Node cloneGraph(Node node) {
        if (node == null) {
            return null;
        }
        
        // Hash map to track original node -> cloned node
        Map<Node, Node> oldToNew = new HashMap<>();
        
        // Stack for DFS traversal
        Stack<Node> stack = new Stack<>();
        stack.push(node);
        
        // Create the first clone
        oldToNew.put(node, new Node(node.val));
        
        while (!stack.isEmpty()) {
            Node current = stack.pop();
            Node clone = oldToNew.get(current);
            
            for (Node neighbor : current.neighbors) {
                // If neighbor hasn't been cloned yet, create and push to stack
                if (!oldToNew.containsKey(neighbor)) {
                    oldToNew.put(neighbor, new Node(neighbor.val));
                    stack.push(neighbor);
                }
                // Add the cloned neighbor to the current clone's neighbors
                clone.neighbors.add(oldToNew.get(neighbor));
            }
        }
        
        return oldToNew.get(node);
    }
}
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
        neighbors = {};
    }
    Node(int _val) {
        val = _val;
        neighbors = {};
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
        if (node == nullptr) {
            return nullptr;
        }
        
        // Hash map to track original node -> cloned node
        unordered_map<Node*, Node*> oldToNew;
        
        // Stack for DFS traversal
        stack<Node*> st;
        st.push(node);
        
        // Create the first clone
        oldToNew[node] = new Node(node->val);
        
        while (!st.empty()) {
            Node* current = st.top();
            st.pop();
            
            Node* clone = oldToNew[current];
            
            for (Node* neighbor : current->neighbors) {
                // If neighbor hasn't been cloned yet, create and push to stack
                if (oldToNew.find(neighbor) == oldToNew.end()) {
                    oldToNew[neighbor] = new Node(neighbor->val);
                    st.push(neighbor);
                }
                // Add the cloned neighbor to the current clone's neighbors
                clone->neighbors.push_back(oldToNew[neighbor]);
            }
        }
        
        return oldToNew[node];
    }
};
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
var cloneGraph = function(node) {
    if (!node) return null;
    
    // Hash map to track original node -> cloned node
    const oldToNew = new Map();
    
    // Stack for DFS traversal
    const stack = [node];
    
    // Create the first clone
    oldToNew.set(node, new Node(node.val));
    
    while (stack.length > 0) {
        const current = stack.pop();
        const clone = oldToNew.get(current);
        
        for (const neighbor of current.neighbors) {
            // If neighbor hasn't been cloned yet, create and push to stack
            if (!oldToNew.has(neighbor)) {
                oldToNew.set(neighbor, new Node(neighbor.val));
                stack.push(neighbor);
            }
            // Add the cloned neighbor to the current clone's neighbors
            clone.neighbors.push(oldToNew.get(neighbor));
        }
    }
    
    return oldToNew.get(node);
};
```
````

### Explanation

1. **Initialization**: Handle null input. Create a hash map and stack.
2. **First Clone**: Create a clone for the starting node and add it to the map.
3. **DFS Loop**: While the stack is not empty:
   - Pop a node from the stack
   - Get its clone from the map
   - For each neighbor:
     - If not yet cloned, create the clone and push to stack
     - Add the cloned neighbor to the current clone's neighbors list
4. **Return**: Return the cloned starting node from the map.

### Complexity Analysis

- **Time Complexity**: O(V + E), same as recursive DFS.
- **Space Complexity**: O(V) for the hash map plus O(V) for the stack in the worst case.

---

### Approach 3: BFS (Breadth-First Search)

This approach uses a queue for breadth-first traversal. It processes nodes level by level, which can be more intuitive for some and ensures we clone nodes in order of their distance from the start.

````carousel
```python
# Definition for a Node.
class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []

from collections import deque

class Solution:
    def cloneGraph(self, node: 'Node') -> 'Node':
        """
        Clone a graph using BFS approach with queue.
        
        Args:
            node: The starting node of the graph to clone.
            
        Returns:
            The starting node of the cloned graph.
        """
        if not node:
            return None
        
        # Hash map to track original node -> cloned node
        old_to_new = {}
        
        # Queue for BFS traversal
        queue = deque([node])
        
        # Create the first clone
        old_to_new[node] = Node(node.val)
        
        while queue:
            current = queue.popleft()
            clone = old_to_new[current]
            
            for neighbor in current.neighbors:
                # If neighbor hasn't been cloned yet, create and enqueue
                if neighbor not in old_to_new:
                    old_to_new[neighbor] = Node(neighbor.val)
                    queue.append(neighbor)
                # Add the cloned neighbor to the current clone's neighbors
                clone.neighbors.append(old_to_new[neighbor])
        
        return old_to_new[node]
```
<!-- slide -->
```java
/**
 * Definition for a Node.
 * class Node {
 *     public int val;
 *     public List<Node> neighbors;
 *     public Node() {
 *         val = 0;
 *         neighbors = new ArrayList<Node>();
 *     }
 *     public Node(int _val) {
 *         val = _val;
 *         neighbors = new ArrayList<Node>();
 *     }
 *     public Node(int _val, ArrayList<Node> _neighbors) {
 *         val = _val;
 *         neighbors = _neighbors;
 *     }
 * }
 */

import java.util.Queue;
import java.util.ArrayDeque;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

class Solution {
    public Node cloneGraph(Node node) {
        if (node == null) {
            return null;
        }
        
        // Hash map to track original node -> cloned node
        Map<Node, Node> oldToNew = new HashMap<>();
        
        // Queue for BFS traversal
        Queue<Node> queue = new ArrayDeque<>();
        queue.offer(node);
        
        // Create the first clone
        oldToNew.put(node, new Node(node.val));
        
        while (!queue.isEmpty()) {
            Node current = queue.poll();
            Node clone = oldToNew.get(current);
            
            for (Node neighbor : current.neighbors) {
                // If neighbor hasn't been cloned yet, create and enqueue
                if (!oldToNew.containsKey(neighbor)) {
                    oldToNew.put(neighbor, new Node(neighbor.val));
                    queue.offer(neighbor);
                }
                // Add the cloned neighbor to the current clone's neighbors
                clone.neighbors.add(oldToNew.get(neighbor));
            }
        }
        
        return oldToNew.get(node);
    }
}
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
        neighbors = {};
    }
    Node(int _val) {
        val = _val;
        neighbors = {};
    }
    Node(int _val, vector<Node*> _neighbors) {
        val = _val;
        neighbors = _neighbors;
    }
};
*/

#include <queue>
#include <unordered_map>
#include <vector>

class Solution {
public:
    Node* cloneGraph(Node* node) {
        if (node == nullptr) {
            return nullptr;
        }
        
        // Hash map to track original node -> cloned node
        unordered_map<Node*, Node*> oldToNew;
        
        // Queue for BFS traversal
        queue<Node*> q;
        q.push(node);
        
        // Create the first clone
        oldToNew[node] = new Node(node->val);
        
        while (!q.empty()) {
            Node* current = q.front();
            q.pop();
            
            Node* clone = oldToNew[current];
            
            for (Node* neighbor : current->neighbors) {
                // If neighbor hasn't been cloned yet, create and enqueue
                if (oldToNew.find(neighbor) == oldToNew.end()) {
                    oldToNew[neighbor] = new Node(neighbor->val);
                    q.push(neighbor);
                }
                // Add the cloned neighbor to the current clone's neighbors
                clone->neighbors.push_back(oldToNew[neighbor]);
            }
        }
        
        return oldToNew[node];
    }
};
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
var cloneGraph = function(node) {
    if (!node) return null;
    
    // Hash map to track original node -> cloned node
    const oldToNew = new Map();
    
    // Queue for BFS traversal
    const queue = [node];
    
    // Create the first clone
    oldToNew.set(node, new Node(node.val));
    
    while (queue.length > 0) {
        const current = queue.shift();
        const clone = oldToNew.get(current);
        
        for (const neighbor of current.neighbors) {
            // If neighbor hasn't been cloned yet, create and enqueue
            if (!oldToNew.has(neighbor)) {
                oldToNew.set(neighbor, new Node(neighbor.val));
                queue.push(neighbor);
            }
            // Add the cloned neighbor to the current clone's neighbors
            clone.neighbors.push(oldToNew.get(neighbor));
        }
    }
    
    return oldToNew.get(node);
};
```
````

### Explanation

1. **Initialization**: Handle null input. Create a hash map and queue.
2. **First Clone**: Create a clone for the starting node and add it to the map.
3. **BFS Loop**: While the queue is not empty:
   - Dequeue a node
   - Get its clone from the map
   - For each neighbor:
     - If not yet cloned, create the clone and enqueue
     - Add the cloned neighbor to the current clone's neighbors list
4. **Return**: Return the cloned starting node from the map.

### Complexity Analysis

- **Time Complexity**: O(V + E), same as DFS approaches.
- **Space Complexity**: O(V) for the hash map plus O(V) for the queue (in the worst case, the queue can hold up to all nodes at the widest level).

---

## Comparison of Approaches

| Approach | Time Complexity | Space Complexity | Traversal Order | Pros | Cons |
|----------|-----------------|------------------|-----------------|------|------|
| Recursive DFS | O(V + E) | O(V) | Depth-first | Simple, elegant, natural recursion | Stack overflow for very deep graphs |
| Iterative DFS | O(V + E) | O(V) | Depth-first | Avoids recursion stack | Requires manual stack management |
| BFS | O(V + E) | O(V) | Level-order | Processes nodes by distance | Queue can be larger than stack |

All three approaches are optimal for this problem. The choice depends on personal preference and specific requirements:
- **BFS** is often preferred for its level-order processing and predictable memory usage.
- **Recursive DFS** is the most concise and readable.
- **Iterative DFS** is useful when recursion depth is a concern.

---

## Related Problems

Here are some LeetCode problems that involve similar deep copy or graph traversal concepts:

- [138. Copy List with Random Pointer](https://leetcode.com/problems/copy-list-with-random-pointer/) - Deep copy a linked list where each node has a random pointer in addition to the next pointer.
- [1485. Clone Binary Tree With Random Pointer](https://leetcode.com/problems/clone-binary-tree-with-random-pointer/) - Clone a binary tree where each node has a random pointer.
- [1490. Clone N-ary Tree](https://leetcode.com/problems/clone-n-ary-tree/) - Clone an N-ary tree structure.
- [133. Clone Graph](https://leetcode.com/problems/clone-graph/) - The original problem this solution addresses.
- [200. Number of Islands](https://leetcode.com/problems/number-of-islands/) - Graph traversal problem using BFS/DFS.
- [695. Max Area of Island](https://leetcode.com/problems/max-area-of-island/) - Find the largest island in a grid using graph traversal.
- [1339. Maximum Product of Splitted Binary Tree](https://leetcode.com/problems/maximum-product-of-splitted-binary-tree/) - Tree traversal and computation.

---

## Video Tutorial Links

For visual explanations and step-by-step tutorials, here are recommended YouTube videos:

- [NeetCode: Clone Graph - Depth First Search - Leetcode 133](https://www.youtube.com/watch?v=mQeF6bN8hMk) - Clear explanation of the DFS approach with visualizations.
- [Graphs (Python): Clone Graph - Leetcode 133](https://www.youtube.com/watch?v=wWE7YzuBBkE) - Python implementation with detailed walkthrough.
- [LeetCode 133 - Clone Graph Explained and Solved in Python](https://www.youtube.com/watch?v=Lby2d8dfEk8) - Comprehensive solution explanation.
- [Clone Graph - BFS Approach - LeetCode 133](https://www.youtube.com/watch?v=n4t_Wc8_C6U) - BFS implementation with detailed explanation.
- [Clone Graph - DFS Recursive - LeetCode 133](https://www.youtube.com/watch?v=vB0l6F1z1Xg) - Recursive DFS approach explained.

---

## Follow-up Questions

1. **How would you clone a graph that might be disconnected?**

   **Answer:** The current solutions assume a connected graph. For a disconnected graph, you would need to: (1) Iterate through all nodes to find all connected components, (2) Run the cloning algorithm on each component's starting node, and (3) Return all cloned components. In practice, you could add a loop after the main BFS/DFS to check if any nodes remain uncloned, then start a new BFS/DFS from those nodes.

2. **What if the graph contains self-loops (nodes connected to themselves)?**

   **Answer:** The existing solutions already handle self-loops correctly. When processing a neighbor that is the same as the current node, the hash map check ensures we either return the existing clone or create it if needed. The clone's neighbor list will correctly include itself after cloning.

3. **How would you modify the solution to handle very large graphs (e.g., millions of nodes)?**

   **Answer:** For very large graphs: (1) Use iterative DFS or BFS to avoid recursion stack overflow, (2) Consider processing the graph in chunks if memory is limited, (3) Use more memory-efficient data structures for the hash map, and (4) Consider parallelization for disconnected components. The O(V + E) time complexity is optimal, but memory usage becomes the bottleneck.

4. **How can you verify that the cloned graph is correct?**

   **Answer:** To verify correctness: (1) Check that the number of nodes matches, (2) Check that node values match, (3) Verify that every edge in the original has a corresponding edge in the clone (same neighbors, but pointing to cloned nodes), and (4) Ensure no edges point to original nodes. You can write a verification function that traverses both graphs simultaneously and compares structures.

5. **What if you need to clone a directed graph instead of undirected?**

   **Answer:** The algorithm remains largely the same! The only difference is that when cloning a directed graph, you only follow edges in their specified direction. The hash map approach still prevents cycles and duplication. The traversal order (DFS/BFS) and overall complexity remain unchanged.

6. **How would you handle cloning if nodes have additional data beyond `val` and `neighbors`?**

   **Answer:** You would need to: (1) Ensure the Node class copy constructor or clone method copies all fields, (2) For complex nested objects, implement deep copy for those fields as well, and (3) Consider using a copy constructor or factory pattern to centralize the cloning logic.

7. **Can you clone a graph without using a hash map?**

   **Answer:** In theory, you could use a combination of marking nodes (modifying the original temporarily) and restoring them, but this would alter the original graph. Another approach is to serialize the graph to a string and deserialize it to create a copy. However, the hash map approach is the standard, clean solution with O(V + E) time complexity.

8. **How would you optimize space complexity if memory is limited?**

   **Answer:** The hash map is essential for handling cycles, so O(V) space is necessary. However, you could: (1) Use BFS instead of DFS to potentially use less stack space on skewed graphs, (2) Process nodes in-place if modification is allowed (mark original nodes temporarily), or (3) Use a more memory-efficient hash map implementation.

---

## LeetCode Link

[Clone Graph - LeetCode 133](https://leetcode.com/problems/clone-graph/)

