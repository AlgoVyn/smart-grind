# All Nodes Distance K In Binary Tree

## Problem Description

Given the root of a binary tree, the value of a target node `target`, and an integer `k`, return an array of the values of all nodes that have a distance `k` from the target node.
You can return the answer in any order.

**Link to problem:** [All Nodes Distance K in Binary Tree - LeetCode 863](https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/)

---

## Pattern: Graph Construction + BFS

This problem exemplifies the **Graph Construction + BFS** pattern. The key insight is to convert the binary tree into an undirected graph, then perform BFS from the target node to find all nodes at distance k.

### Core Concept

The fundamental steps are:
1. **Convert tree to graph**: Build an adjacency list representing the binary tree as an undirected graph
2. **BFS traversal**: Use breadth-first search from the target node to find all nodes at exactly k distance
3. **Track visited nodes**: Avoid revisiting nodes to prevent infinite loops

---

## Examples

### Example

**Input:**
```
root = [3,5,1,6,2,0,8,null,null,7,4], target = 5, k = 2
```

**Output:**
```
[7,4,1]
```

**Explanation:** The nodes that are a distance 2 from the target node (with value 5) have values 7, 4, and 1.

### Example 2

**Input:**
```
root = [1], target = 1, k = 3
```

**Output:**
```
[]
```

---

## Constraints

- The number of nodes in the tree is in the range `[1, 500]`.
- `0 <= Node.val <= 500`
- All the values `Node.val` are unique.
- `target` is the value of one of the nodes in the tree.
- `0 <= k <= 1000`

---

## Intuition

The key insight is that a binary tree is not inherently a graph with bidirectional edges. To find nodes at distance k, we need to:

1. **Build a graph**: Convert the tree into an undirected graph where each node connects to its parent and children
2. **BFS from target**: Use BFS to explore outward from the target node, counting the distance
3. **Collect at distance k**: Gather all node values when we reach distance k

Why BFS? BFS explores nodes in increasing distance order, making it perfect for finding all nodes at a specific distance.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Graph + BFS** - Standard approach using adjacency list
2. **Parent Pointers + DFS** - More space-efficient using parent tracking

---

## Approach 1: Graph Construction + BFS (Standard)

This is the most intuitive approach that converts the tree to a graph and uses BFS.

### Algorithm Steps

1. Build an adjacency list (graph) from the binary tree
   - For each node, add edges to its left child, right child, and parent
2. Find the target node in the tree
3. Perform BFS starting from the target node
4. Track distance for each visited node
5. Collect all nodes at distance exactly k

### Why It Works

Converting the tree to an undirected graph allows us to traverse in all directions (up to parent, down to children). BFS naturally explores nodes level by level, so when we reach distance k, we've found all nodes at that distance.

### Code Implementation

````carousel
```python
from collections import defaultdict, deque
from typing import List, Optional

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None

class Solution:
    def distanceK(self, root: TreeNode, target: TreeNode, k: int) -> List[int]:
        """
        Find all nodes at distance k from target node in binary tree.
        
        Args:
            root: Root of the binary tree
            target: Target node (TreeNode object)
            k: Distance to find
            
        Returns:
            List of values at distance k from target
        """
        if not root:
            return []

        # Build graph (adjacency list)
        graph = defaultdict(list)
        
        def build_graph(node, parent):
            """Build undirected graph from binary tree."""
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
                
            for neighbor in graph[node]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append((neighbor, dist + 1))

        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <queue>
using namespace std;

// Definition for a binary tree node.
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    vector<int> distanceK(TreeNode* root, TreeNode* target, int k) {
        if (!root) return {};
        
        // Build graph
        unordered_map<TreeNode*, vector<TreeNode*>> graph;
        queue<TreeNode*> q;
        q.push(root);
        
        while (!q.empty()) {
            TreeNode* node = q.front();
            q.pop();
            
            if (node->left) {
                graph[node].push_back(node->left);
                graph[node->left].push_back(node);
                q.push(node->left);
            }
            if (node->right) {
                graph[node].push_back(node->right);
                graph[node->right].push_back(node);
                q.push(node->right);
            }
        }
        
        // BFS from target
        unordered_set<TreeNode*> visited;
        queue<pair<TreeNode*, int>> bfs;
        bfs.push({target, 0});
        visited.insert(target);
        
        vector<int> result;
        
        while (!bfs.empty()) {
            auto [node, dist] = bfs.front();
            bfs.pop();
            
            if (dist == k) {
                result.push_back(node->val);
            } else if (dist > k) {
                break;
            }
            
            for (auto neighbor : graph[node]) {
                if (!visited.count(neighbor)) {
                    visited.insert(neighbor);
                    bfs.push({neighbor, dist + 1});
                }
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

// Definition for a binary tree node.
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int x) { val = x; }
}

class Solution {
    public List<Integer> distanceK(TreeNode root, TreeNode target, int k) {
        if (root == null) return new ArrayList<>();
        
        // Build graph
        Map<TreeNode, List<TreeNode>> graph = new HashMap<>();
        buildGraph(root, null, graph);
        
        // BFS from target
        Set<TreeNode> visited = new HashSet<>();
        Queue<Object[]> queue = new LinkedList<>();
        queue.offer(new Object[]{target, 0});
        visited.add(target);
        
        List<Integer> result = new ArrayList<>();
        
        while (!queue.isEmpty()) {
            Object[] curr = queue.poll();
            TreeNode node = (TreeNode) curr[0];
            int dist = (int) curr[1];
            
            if (dist == k) {
                result.add(node.val);
            } else if (dist > k) {
                break;
            }
            
            for (TreeNode neighbor : graph.getOrDefault(node, new ArrayList<>())) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.offer(new Object[]{neighbor, dist + 1});
                }
            }
        }
        
        return result;
    }
    
    private void buildGraph(TreeNode node, TreeNode parent, Map<TreeNode, List<TreeNode>> graph) {
        if (node == null) return;
        
        graph.putIfAbsent(node, new ArrayList<>());
        if (parent != null) {
            graph.get(node).add(parent);
            graph.get(parent).add(node);
        }
        
        buildGraph(node.left, node, graph);
        buildGraph(node.right, node, graph);
    }
}
```

<!-- slide -->
```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @param {TreeNode} target
 * @param {number} k
 * @return {number[]}
 */
var distanceK = function(root, target, k) {
    if (!root) return [];
    
    // Build graph using adjacency list
    const graph = new Map();
    
    function buildGraph(node, parent) {
        if (!node) return;
        
        if (!graph.has(node)) graph.set(node, []);
        if (parent) {
            graph.get(node).push(parent);
            if (!graph.has(parent)) graph.set(parent, []);
            graph.get(parent).push(node);
        }
        
        buildGraph(node.left, node);
        buildGraph(node.right, node);
    }
    
    buildGraph(root, null);
    
    // BFS from target
    const visited = new Set([target]);
    const queue = [[target, 0]];
    const result = [];
    
    while (queue.length > 0) {
        const [node, dist] = queue.shift();
        
        if (dist === k) {
            result.push(node.val);
        } else if (dist > k) {
            break;
        }
        
        for (const neighbor of graph.get(node) || []) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push([neighbor, dist + 1]);
            }
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(N) - Visit each node once to build graph, then BFS explores up to all nodes |
| **Space** | O(N) - Store adjacency list and visited set |

---

## Approach 2: Parent Pointers + DFS

This approach avoids building a full graph by tracking parent nodes during DFS.

### Algorithm Steps

1. Find the target node using DFS
2. During DFS, track parent of each node
3. Perform DFS from target, avoiding revisiting nodes
4. Count distance as we traverse

### Why It Works

Instead of building a complete graph, we can navigate the tree by keeping track of parent nodes. This allows us to "climb up" to ancestors during traversal.

### Code Implementation

````carousel
```python
from typing import List, Optional

class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None

class Solution:
    def distanceK(self, root: TreeNode, target: TreeNode, k: int) -> List[int]:
        """
        Find nodes at distance k using parent pointers.
        """
        # First, find target and track parents
        parent = {}  # node -> parent node
        
        def find_target(node, par):
            if not node:
                return False
            if node == target:
                return True
            
            if node.left:
                parent[node.left] = node
                if find_target(node.left, node):
                    return True
            if node.right:
                parent[node.right] = node
                if find_target(node.right, node):
                    return True
            return False
        
        find_target(root, None)
        
        # DFS from target, avoiding parent
        result = []
        visited = set()
        
        def dfs(node, dist):
            if not node or node in visited:
                return
            
            visited.add(node)
            
            if dist == k:
                result.append(node.val)
                return
            
            # Explore all neighbors (children + parent)
            if node.left:
                dfs(node.left, dist + 1)
            if node.right:
                dfs(node.right, dist + 1)
            if node in parent:
                dfs(parent[node], dist + 1)
        
        dfs(target, 0)
        return result
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    vector<int> distanceK(TreeNode* root, TreeNode* target, int k) {
        TreeNode* targetNode = nullptr;
        unordered_map<TreeNode*, TreeNode*> parent;
        
        // Find target and build parent map
        function<bool(TreeNode*, TreeNode*)> findTarget = 
            [&](TreeNode* node, TreeNode* par) -> bool {
            if (!node) return false;
            parent[node] = par;
            if (node == target) {
                targetNode = node;
                return true;
            }
            return findTarget(node->left, node) || findTarget(node->right, node);
        };
        
        findTarget(root, nullptr);
        
        // DFS from target
        vector<int> result;
        unordered_set<TreeNode*> visited;
        
        function<void(TreeNode*, int)> dfs = [&](TreeNode* node, int dist) {
            if (!node || visited.count(node)) return;
            visited.insert(node);
            
            if (dist == k) {
                result.push_back(node->val);
                return;
            }
            
            if (node->left) dfs(node->left, dist + 1);
            if (node->right) dfs(node->right, dist + 1);
            if (parent.count(node)) dfs(parent[node], dist + 1);
        };
        
        dfs(targetNode, 0);
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    private Map<TreeNode, TreeNode> parent = new HashMap<>();
    private TreeNode targetNode;
    
    public List<Integer> distanceK(TreeNode root, TreeNode target, int k) {
        // Find target and build parent map
        findTarget(root, null, target);
        
        // DFS from target
        List<Integer> result = new ArrayList<>();
        Set<TreeNode> visited = new HashSet<>();
        
        dfs(target, 0, k, visited, result);
        return result;
    }
    
    private void findTarget(TreeNode node, TreeNode par, TreeNode target) {
        if (node == null) return;
        parent.put(node, par);
        if (node == target) {
            targetNode = node;
        }
        findTarget(node.left, node, target);
        findTarget(node.right, node, target);
    }
    
    private void dfs(TreeNode node, int dist, int k, Set<TreeNode> visited, List<Integer> result) {
        if (node == null || visited.contains(node)) return;
        visited.add(node);
        
        if (dist == k) {
            result.add(node.val);
            return;
        }
        
        dfs(node.left, dist + 1, k, visited, result);
        dfs(node.right, dist + 1, k, visited, result);
        dfs(parent.get(node), dist + 1, k, visited, result);
    }
}
```

<!-- slide -->
```javascript
var distanceK = function(root, target, k) {
    const parent = new Map();
    let targetNode = null;
    
    // Find target and build parent map
    function findTarget(node, par) {
        if (!node) return false;
        parent.set(node, par);
        if (node === target) {
            targetNode = node;
            return true;
        }
        return findTarget(node.left, node) || findTarget(node.right, node);
    }
    
    findTarget(root, null);
    
    // DFS from target
    const result = [];
    const visited = new Set();
    
    function dfs(node, dist) {
        if (!node || visited.has(node)) return;
        visited.add(node);
        
        if (dist === k) {
            result.push(node.val);
            return;
        }
        
        dfs(node.left, dist + 1);
        dfs(node.right, dist + 1);
        dfs(parent.get(node), dist + 1);
    }
    
    dfs(targetNode, 0);
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(N) - Visit each node at most twice |
| **Space** | O(N) - Parent map and visited set |

---

## Comparison of Approaches

| Aspect | Graph + BFS | Parent Pointers + DFS |
|--------|-------------|----------------------|
| **Time Complexity** | O(N) | O(N) |
| **Space Complexity** | O(N) | O(N) |
| **Implementation** | More intuitive | Slightly more complex |
| **Best For** | Most cases | Memory constrained |

**Best Approach:** Both approaches have similar complexity. The Graph + BFS approach is more intuitive, while Parent Pointers + DFS avoids building the full adjacency list.

---

## Why This Problem is Important

This problem demonstrates:
1. **Tree to Graph conversion**: Understanding how to treat trees as graphs
2. **BFS/DFS traversal**: Choosing the right traversal strategy
3. **Parent tracking**: Important technique for tree problems
4. **Distance problems**: Common pattern in tree/graph problems

---

## Related Problems

### Same Pattern (Tree + Distance)

| Problem | LeetCode Link | Difficulty | Description |
|---------|---------------|------------|-------------|
| [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/) | 102 | Medium | BFS traversal |
| [Sum of Distances in Tree](https://leetcode.com/problems/sum-of-distances-in-tree/) | 834 | Hard | Distance sums in tree |
| [Closest Binary Search Tree Value](https://leetcode.com/problems/closest-binary-search-tree-value/) | 270 | Easy | Target distance |

### Similar Concepts

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| [Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/) | 278 | Tree traversal |
| [Lowest Common Ancestor](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/) | 235 | Tree ancestors |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - All Nodes Distance K in Binary Tree](https://www.youtube.com/watch?v=nPtARJ0I6w4)** - Clear explanation with visual examples

2. **[All Nodes Distance K - Explanation](https://www.youtube.com/watch?v=o5D3D1Cj0L8)** - Detailed walkthrough

3. **[Tree to Graph Conversion](https://www.youtube.com/watch?v=LC-cIvMGNoE)** - Understanding the technique

4. **[BFS vs DFS for Trees](https://www.youtube.com/watch?v=63sPJr5Wz3E)** - Traversal strategies

---

## Follow-up Questions

### Q1: Can you solve it using DFS instead of BFS?

**Answer:** Yes! The parent pointers approach uses DFS. DFS can also be used with the graph approach, but BFS is more natural for finding all nodes at a specific distance level.

---

### Q2: What if you need to find the minimum distance to any target (if there are multiple targets)?

**Answer:** You would perform BFS from all target nodes simultaneously (multi-source BFS). Initialize the queue with all target nodes at distance 0, then proceed with normal BFS.

---

### Q3: How would you modify the solution to return nodes at distance <= k instead of exactly k?

**Answer:** Simply change the condition from `if dist == k` to `if dist <= k` and don't stop when dist exceeds k. Or collect all nodes as you traverse and filter at the end.

---

### Q4: What if the tree is very deep (like a linked list)?

**Answer:** The graph-based approach still works well. The parent pointer approach might cause stack overflow with deep recursion, so use iterative approaches or increase stack size.

---

### Q5: How would you handle it if target is not a node value but needs to be found first?

**Answer:** Add a preliminary step to find the target node by traversing the tree (either BFS or DFS) to locate the node with the target value.

---

### Q6: What edge cases should be tested?

**Answer:**
- k = 0 (should return just the target node)
- k > tree height (should return empty)
- Target is root node
- Target is leaf node
- Target is at extremes (leftmost or rightmost)

---

### Q7: How would you return the actual nodes instead of just values?

**Answer:** Modify the BFS/DFS to store node references instead of (or in addition to) node values in the result.

---

### Q8: Can you solve this in O(1) extra space (excluding recursion stack)?

**Answer:** The parent pointer approach uses O(N) space for the parent map. Without additional data structures, you would need to modify the tree temporarily to mark visited nodes, but this is generally not recommended.

---

## Common Pitfalls

### 1. Forgetting Parent Connections
**Issue**: Only connecting children to parent but not vice versa in the graph.

**Solution**: Ensure bidirectional connections in the adjacency list.

### 2. Not Marking Target as Visited
**Issue**: Target node could be revisited during traversal.

**Solution**: Add target to visited set initially.

### 3. Stopping Too Early
**Issue**: Stopping BFS when distance exceeds k instead of continuing to find other nodes at exactly k.

**Solution**: Continue BFS until queue is empty or all nodes at distance k are found.

### 4. Stack Overflow with Deep Trees
**Issue**: DFS recursion can overflow with very deep trees.

**Solution**: Use iterative approaches or increase stack size.

---

## Summary

The **All Nodes Distance K in Binary Tree** problem demonstrates the power of graph conversion:

- **Graph + BFS**: Convert tree to undirected graph, then BFS
- **Parent Pointers**: Track parents during DFS traversal
- **Both O(N)**: Similar time and space complexity

Key takeaways:
- **Tree as Graph**: Binary trees can be viewed as undirected graphs
- **BFS for Level Order**: BFS naturally finds nodes at specific distances
- **Parent Tracking**: Important technique for tree problems

This problem is excellent for understanding how to leverage graph algorithms on tree structures.

### Pattern Summary

This problem exemplifies the **Graph Construction + BFS** pattern, characterized by:
- Converting tree to adjacency list
- Bidirectional traversal (parent + children)
- BFS for distance-based exploration

For more details on tree algorithms, see the **[Tree Traversal](/algorithms/tree-traversal)** section.
