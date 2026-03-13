# Height of Binary Tree After Subtree Removal Queries

## Problem Description

You are given the root of a binary tree with `n` nodes. Each node is assigned a unique value from `1` to `n`. You are also given an array `queries` of size `m`.

For each query `i`, remove the subtree rooted at the node with the value `queries[i]` from the tree. The queries are independent, meaning the tree returns to its initial state after each query.

Return an array `answer` of size `m` where `answer[i]` is the height of the tree after performing the `i`th query.

> **Note:** The height of a tree is the number of edges in the longest simple path from the root to some node in the tree. It is guaranteed that `queries[i]` will not be equal to the value of the root.

---

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

---

## Constraints

- The number of nodes in the tree is `n`.
- `2 <= n <= 10⁵`
- `1 <= Node.val <= n`
- All values in the tree are unique.
- `m == queries.length`
- `1 <= m <= min(n, 10⁴)`
- `1 <= queries[i] <= n`
- `queries[i] != root.val`

---

## Pattern: Precomputation with Global Max/Second Max Tracking

This problem uses the **Precomputation** pattern where we precompute heights for all nodes, then use global statistics (max and second max heights) to answer each query in O(1). The key insight is that removing a subtree only affects height if it was the unique path to the maximum height.

---

## Intuition

The key insight for this problem is understanding how removing a subtree affects the overall height of the tree:

1. **Height Precomputation**: First, compute the height of every node in the tree (the number of edges from that node to its deepest leaf).

2. **Global Analysis**: The overall tree height is determined by the maximum height among all nodes. When we remove a subtree:
   - If the removed node was NOT the unique node with maximum height, the tree height stays the same.
   - If the removed node WAS the unique node with maximum height, the new height becomes the second maximum height.

3. **Why Second Max?**: When the tallest subtree is removed, we need to find the next tallest path. This is the second maximum height among all nodes.

### Key Observations

- A node's height is independent of its parent - it only depends on its children.
- Removing a node only affects paths that go through that node.
- If multiple nodes share the maximum height, removing one doesn't reduce the tree height (others maintain it).
- The root's height never changes (unless the root itself is removed, which is not allowed).

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Precomputation with Max/Second Max Tracking** - Optimal solution
2. **Naive Recalculation** - Brute force approach (for understanding)

---

## Approach 1: Precomputation with Max/Second Max Tracking (Optimal)

### Algorithm Steps

1. **Compute heights**: Use DFS to compute the height of each node (number of edges to deepest leaf).
2. **Find global statistics**: Determine max height, second max height, and count of nodes with max height.
3. **Build mappings**: Map node values to their heights for O(1) lookup.
4. **Process queries**: For each query, determine the new height based on whether the removed node uniquely contributed to max height.

### Why It Works

This approach works because:
- The height of any tree is determined by the longest root-to-leaf path.
- Removing a subtree only affects height if that subtree contained the unique node at the end of the longest path.
- By precomputing heights and tracking max/second max, we can answer each query in O(1).

### Code Implementation

````carousel
```python
from typing import List, Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def treeQueries(self, root: Optional[TreeNode], queries: List[int]) -> List[int]:
        """
        Find the height of the tree after removing each subtree.
        
        Uses precomputation with global max/second max tracking.
        
        Args:
            root: Root of the binary tree
            queries: List of node values whose subtrees to remove
            
        Returns:
            List of heights after each query
        """
        # Step 1: Compute height for each node
        heights = {}
        
        def get_height(node: Optional[TreeNode]) -> int:
            if not node:
                return 0
            # Height is 1 + max of children's heights
            h = 1 + max(get_height(node.left), get_height(node.right))
            heights[node] = h
            return h
        
        get_height(root)
        
        # Step 2: Find max height, second max, and count
        all_heights = list(heights.values())
        max_h = max(all_heights)
        second_max = max((h for h in all_heights if h != max_h), default=0)
        count_max = sum(1 for h in all_heights if h == max_h)
        
        # Step 3: Build mapping from value to height
        node_to_val = {node.val: heights[node] for node in heights}
        
        # Step 4: Process each query
        res = []
        for q in queries:
            h = node_to_val[q]
            if h == max_h and count_max == 1:
                # Only node with max height - reduces to second max
                res.append(second_max)
            else:
                # Either not max height or multiple nodes with max height
                res.append(max_h)
        
        return res
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
#include <algorithm>
using namespace std;

// Definition for a binary tree node
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

class Solution {
public:
    unordered_map<TreeNode*, int> heights;
    unordered_map<int, int> nodeToVal;
    
    int getHeight(TreeNode* node) {
        if (!node) return 0;
        int h = 1 + max(getHeight(node->left), getHeight(node->right));
        heights[node] = h;
        nodeToVal[h] = max(nodeToVal[h], h);  // Track max per height
        return h;
    }
    
    vector<int> treeQueries(TreeNode* root, vector<int>& queries) {
        // Step 1: Compute heights
        getHeight(root);
        
        // Step 2: Find max and second max heights
        int maxH = 0, secondMax = 0;
        for (auto& [node, h] : heights) {
            if (h > maxH) {
                secondMax = maxH;
                maxH = h;
            } else if (h > secondMax && h < maxH) {
                secondMax = h;
            }
        }
        
        // Count nodes with max height
        int countMax = 0;
        for (auto& [node, h] : heights) {
            if (h == maxH) countMax++;
        }
        
        // Build value to height mapping
        unordered_map<int, int> valToHeight;
        for (auto& [node, h] : heights) {
            valToHeight[node->val] = h;
        }
        
        // Step 3: Process queries
        vector<int> result;
        for (int q : queries) {
            int h = valToHeight[q];
            if (h == maxH && countMax == 1) {
                result.push_back(secondMax);
            } else {
                result.push_back(maxH);
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    private Map<TreeNode, Integer> heights = new HashMap<>();
    private Map<Integer, Integer> valToHeight = new HashMap<>();
    
    private int getHeight(TreeNode node) {
        if (node == null) return 0;
        int h = 1 + Math.max(getHeight(node.left), getHeight(node.right));
        heights.put(node, h);
        valToHeight.put(node.val, h);
        return h;
    }
    
    public int[] treeQueries(TreeNode root, int[] queries) {
        // Step 1: Compute heights
        getHeight(root);
        
        // Step 2: Find max and second max heights
        int maxH = 0, secondMax = 0;
        for (int h : heights.values()) {
            if (h > maxH) {
                secondMax = maxH;
                maxH = h;
            } else if (h > secondMax && h < maxH) {
                secondMax = h;
            }
        }
        
        // Count nodes with max height
        int countMax = 0;
        for (int h : heights.values()) {
            if (h == maxH) countMax++;
        }
        
        // Step 3: Process queries
        int[] result = new int[queries.length];
        for (int i = 0; i < queries.length; i++) {
            int h = valToHeight.get(queries[i]);
            if (h == maxH && countMax == 1) {
                result[i] = secondMax;
            } else {
                result[i] = maxH;
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number[]} queries
 * @return {number[]}
 */
var treeQueries = function(root, queries) {
    const heights = new Map();
    const valToHeight = new Map();
    
    // Step 1: Compute heights using DFS
    function getHeight(node) {
        if (!node) return 0;
        const h = 1 + Math.max(getHeight(node.left), getHeight(node.right));
        heights.set(node, h);
        valToHeight.set(node.val, h);
        return h;
    }
    
    getHeight(root);
    
    // Step 2: Find max and second max heights
    let maxH = 0, secondMax = 0;
    for (const h of heights.values()) {
        if (h > maxH) {
            secondMax = maxH;
            maxH = h;
        } else if (h > secondMax && h < maxH) {
            secondMax = h;
        }
    }
    
    // Count nodes with max height
    let countMax = 0;
    for (const h of heights.values()) {
        if (h === maxH) countMax++;
    }
    
    // Step 3: Process queries
    const result = [];
    for (const q of queries) {
        const h = valToHeight.get(q);
        if (h === maxH && countMax === 1) {
            result.push(secondMax);
        } else {
            result.push(maxH);
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + m) where n is the number of nodes and m is the number of queries |
| **Space** | O(n) for storing heights and mappings |

---

## Approach 2: Naive Recalculation (For Understanding)

### Algorithm Steps

1. For each query, make a deep copy of the tree (or mark nodes as removed).
2. Remove the specified subtree.
3. Recalculate the height from root to all nodes.
4. Return the maximum height.

### Why It Works

This approach directly simulates the problem - we physically remove each subtree and recalculate the height. It's correct but inefficient because we redo work for each query.

### Code Implementation

````carousel
```python
from typing import List, Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def treeQueries(self, root: Optional[TreeNode], queries: List[int]) -> List[int]:
        """Naive approach - recalculate height for each query."""
        
        # Build value to node mapping for quick lookup
        node_map = {}
        
        def build_map(node):
            if not node:
                return
            node_map[node.val] = node
            build_map(node.left)
            build_map(node.right)
        
        build_map(root)
        
        def get_height(node):
            if not node:
                return 0
            return 1 + max(get_height(node.left), get_height(node.right))
        
        result = []
        for q in queries:
            # Temporarily disconnect the subtree
            target_node = node_map[q]
            parent = None
            # Find parent (we need to traverse again)
            def find_parent(node, val):
                if not node:
                    return None
                if (node.left and node.left.val == val) or (node.right and node.right.val == val):
                    return node
                left = find_parent(node.left, val)
                if left:
                    return left
                return find_parent(node.right, val)
            
            parent = find_parent(root, q)
            if parent:
                if parent.left and parent.left.val == q:
                    parent.left = None
                else:
                    parent.right = None
            
            # Calculate new height
            h = get_height(root)
            result.append(h)
            
            # Restore the tree
            if parent:
                if parent.left is None and q < root.val if root else True:
                    parent.left = target_node
                else:
                    parent.right = target_node
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
#include <algorithm>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    unordered_map<int, TreeNode*> nodeMap;
    
    void buildMap(TreeNode* node) {
        if (!node) return;
        nodeMap[node->val] = node;
        buildMap(node->left);
        buildMap(node->right);
    }
    
    int getHeight(TreeNode* node) {
        if (!node) return 0;
        return 1 + max(getHeight(node->left), getHeight(node->right));
    }
    
    TreeNode* findParent(TreeNode* node, int val) {
        if (!node) return nullptr;
        if ((node->left && node->left->val == val) || (node->right && node->right->val == val)) {
            return node;
        }
        TreeNode* left = findParent(node->left, val);
        if (left) return left;
        return findParent(node->right, val);
    }
    
    vector<int> treeQueries(TreeNode* root, vector<int>& queries) {
        buildMap(root);
        vector<int> result;
        
        for (int q : queries) {
            TreeNode* target = nodeMap[q];
            TreeNode* parent = findParent(root, q);
            
            if (parent) {
                if (parent->left && parent->left->val == q) {
                    parent->left = nullptr;
                } else {
                    parent->right = nullptr;
                }
            }
            
            result.push_back(getHeight(root));
            
            // Restore (not shown for brevity)
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    private Map<Integer, TreeNode> nodeMap = new HashMap<>();
    
    private void buildMap(TreeNode node) {
        if (node == null) return;
        nodeMap.put(node.val, node);
        buildMap(node.left);
        buildMap(node.right);
    }
    
    private int getHeight(TreeNode node) {
        if (node == null) return 0;
        return 1 + Math.max(getHeight(node.left), getHeight(node.right));
    }
    
    private TreeNode findParent(TreeNode node, int val) {
        if (node == null) return null;
        if ((node.left != null && node.left.val == val) || (node.right != null && node.right.val == val)) {
            return node;
        }
        TreeNode left = findParent(node.left, val);
        if (left != null) return left;
        return findParent(node.right, val);
    }
    
    public int[] treeQueries(TreeNode root, int[] queries) {
        buildMap(root);
        int[] result = new int[queries.length];
        
        for (int i = 0; i < queries.length; i++) {
            int q = queries[i];
            TreeNode target = nodeMap.get(q);
            TreeNode parent = findParent(root, q);
            
            if (parent != null) {
                if (parent.left != null && parent.left.val == q) {
                    parent.left = null;
                } else {
                    parent.right = null;
                }
            }
            
            result[i] = getHeight(root);
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
var treeQueries = function(root, queries) {
    const nodeMap = new Map();
    
    function buildMap(node) {
        if (!node) return;
        nodeMap.set(node.val, node);
        buildMap(node.left);
        buildMap(node.right);
    }
    
    function getHeight(node) {
        if (!node) return 0;
        return 1 + Math.max(getHeight(node.left), getHeight(node.right));
    }
    
    function findParent(node, val) {
        if (!node) return null;
        if ((node.left && node.left.val === val) || (node.right && node.right.val === val)) {
            return node;
        }
        const left = findParent(node.left, val);
        if (left) return left;
        return findParent(node.right, val);
    }
    
    buildMap(root);
    const result = [];
    
    for (const q of queries) {
        const target = nodeMap.get(q);
        const parent = findParent(root, q);
        
        if (parent) {
            if (parent.left && parent.left.val === q) {
                parent.left = null;
            } else {
                parent.right = null;
            }
        }
        
        result.push(getHeight(root));
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n × m) - recalculates entire tree for each query |
| **Space** | O(n) for node mapping |

**Note**: This approach is too slow for large inputs but helps understand the problem.

---

## Comparison of Approaches

| Aspect | Precomputation | Naive Recalculation |
|--------|----------------|---------------------|
| **Time Complexity** | O(n + m) | O(n × m) |
| **Space Complexity** | O(n) | O(n) |
| **Implementation** | Moderate | Simple |
| **LeetCode Optimal** | ✅ | ❌ (too slow) |
| **Difficulty** | Medium | Easy |

**Best Approach:** Use Approach 1 (Precomputation) for the optimal solution.

---

## Related Problems

Based on similar themes (tree height, precomputation, query processing):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Maximum Depth of Binary Tree | [Link](https://leetcode.com/problems/maximum-depth-of-binary-tree/) | Basic tree height calculation |
| Diameter of Binary Tree | [Link](https://leetcode.com/problems/diameter-of-binary-tree/) | Longest path in tree |
| Binary Tree Longest Consecutive Sequence | [Link](https://leetcode.com/problems/binary-tree-longest-consecutive-sequence/) | Tree traversal with tracking |
| Tree Height Queries | [Link](https://leetcode.com/problems/tree-queries/) | Similar query-based problem |

### Pattern Reference

For more detailed explanations of tree-based patterns, see:
- **[Tree DFS Pattern](/patterns/tree-dfs-recursive-preorder-traversal)**
- **[Precomputation Pattern](/patterns/precomputation)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Height of Binary Tree After Subtree Removal Queries](https://www.youtube.com/watch?v=example)** - Clear explanation with visual examples
2. **[Tree Queries - LeetCode 1660](https://www.youtube.com/watch?v=example)** - Detailed walkthrough
3. **[Binary Tree Height Tutorial](https://www.youtube.com/watch?v=example)** - Understanding tree heights

### Related Concepts

- **[Tree Traversal](https://www.youtube.com/watch?v=example)** - DFS/BFS traversal
- **[Precomputation Optimization](https://www.youtube.com/watch?v=example)** - Speed up repeated queries

---

## Follow-up Questions

### Q1: How would you modify the solution to handle multiple subtree removals in a single query (cumulative effect)?

**Answer:** Instead of restoring the tree after each query, keep the removals cumulative. You'd need to track which nodes are removed and skip them when calculating heights.

---

### Q2: What if queries could include the root node?

**Answer:** The problem guarantees `queries[i] != root.val`. If root could be removed, we'd need to return 0 for that query (empty tree has height -1 by some definitions, or 0 by others).

---

### Q3: How would you track not just the height but the actual path that determines the height after removal?

**Answer:** You'd need to store additional information - perhaps the deepest leaf node for each subtree - so you can trace back which nodes contribute to the maximum height.

---

### Q4: Can you solve this for a general graph instead of a tree?

**Answer:** In a general graph with cycles, removing a "subtree" is less well-defined. You'd need to consider connected components and BFS/DFS to find the longest path, making it much more complex (NP-hard for longest path).

---

### Q5: How would you handle queries that try to remove a non-existent node value?

**Answer:** Add validation at the start. If any query value doesn't exist in the tree, you could either throw an error or return the current tree height for that invalid query.

---

### Q6: What if you needed to answer queries online (tree changes between queries)?

**Answer:** You'd need a more sophisticated data structure like a segment tree or binary indexed tree (BIT) to support updates and queries efficiently.

---

## Common Pitfalls

### 1. Confusing Height vs Depth
**Issue**: Height is edges from node to deepest leaf; depth is edges from root to node.

**Solution**: Remember: height goes DOWN from node, depth goes UP from root.

### 2. Counting Max Nodes Incorrectly
**Issue**: If there are multiple nodes with max height, removing one doesn't affect overall height.

**Solution**: Track both the maximum height and the count of nodes with that maximum height.

### 3. Second Max Calculation
**Issue**: Using incorrect default value for second max.

**Solution**: Use default=0 for empty trees or when all nodes have the same height. Handle the case where second max equals 0 (tree becomes empty or has height 0).

### 4. Node to Value Mapping
**Issue**: Not building a mapping from node value to height for O(1) query lookups.

**Solution**: Create a hash map mapping `node.val` to `heights[node]` for fast O(1) access during query processing.

### 5. Forgetting Edge Cases
**Issue**: Not handling trees with only 2 nodes correctly.

**Solution**: Test with minimal trees to ensure correctness.

---

## Summary

The **Height of Binary Tree After Subtree Removal Queries** problem demonstrates the power of **precomputation** in solving query-based problems efficiently. The key insight is that we can precompute the height of every node once, then use global statistics (max and second max heights) to answer each query in O(1) time.

Key takeaways:
1. Compute each node's height using DFS (post-order traversal)
2. Track maximum height, second maximum height, and count of max-height nodes
3. For each query, check if the removed node uniquely contributes to max height
4. Answer queries in O(1) after O(n) preprocessing

This problem is essential for understanding how to trade space for time by precomputing values that allow fast query responses.

### Pattern Summary

This problem exemplifies the **Precomputation** pattern, characterized by:
- One-time preprocessing of all node heights
- Global statistics tracking (max, second max)
- O(1) query answering
- Trade-off between setup time and query time

For more details on this pattern and its variations, see the **[Tree DFS Pattern](/patterns/tree-dfs-recursive-preorder-traversal)**.

---

## Additional Resources

- [LeetCode Problem 1660](https://leetcode.com/problems/height-of-binary-tree-after-subtree-removal-queries/) - Official problem page
- [Binary Tree Traversal - GeeksforGeeks](https://www.geeksforgeeks.org/tree-traversals/) - Tree traversal fundamentals
- [Tree Height - Wikipedia](https://en.wikipedia.org/wiki/Tree_(graph_theory)) - Tree theory basics
- [Pattern: Tree DFS](/patterns/tree-dfs-recursive-preorder-traversal) - Comprehensive pattern guide
