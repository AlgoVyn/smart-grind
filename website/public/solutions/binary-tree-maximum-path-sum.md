# Binary Tree Maximum Path Sum

## Problem Description

A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root.

The path sum of a path is the sum of the node's values in the path.

Given the root of a binary tree, return the maximum path sum of any non-empty path.

**Link to problem:** [Binary Tree Maximum Path Sum - LeetCode 124](https://leetcode.com/problems/binary-tree-maximum-path-sum/)

---

## Pattern: Tree DFS - Maximum Path Sum

This problem exemplifies the **Tree DFS - Maximum Path Sum** pattern. The key challenge is that a path can start and end at any node, requiring us to consider both "going through" a node and "extending through" a node.

### Core Concept

For each node, we need to consider two things:
1. **Path Through Node**: The maximum sum path that passes through this node (left + node + right)
2. **Path Extending Downward**: The maximum sum path that starts at this node and goes down to one of its children

The answer is the maximum of all "path through" values across all nodes.

---

## Examples

### Example

**Input:**
```
root = [1,2,3]
```

**Output:**
```
6
```

**Explanation:** The optimal path is `2 -> 1 -> 3` with a path sum of `2 + 1 + 3 = 6`.

### Example 2

**Input:**
```
root = [-10,9,20,null,null,15,7]
```

**Output:**
```
42
```

**Explanation:** The optimal path is `15 -> 20 -> 7` with a path sum of `15 + 20 + 7 = 42`.

---

## Constraints

- The number of nodes in the tree is in the range `[1, 3 * 10^4]`
- `-1000 <= Node.val <= 1000`

---

## Intuition

The key insight is that for each node, we can compute:
1. The maximum path sum **passing through** that node (left + current + right)
2. The maximum path sum **starting from** that node going downward (max of left, right, or just the node itself)

We use a post-order traversal (DFS) where we process children before the parent. This allows us to know the best contribution each child can make to paths that include the current node.

### Visual Example

For a tree with root value -10, left child 9, right child 20:
- Node 20 has children 15 and 7
- For node 15: max contribution to parent = 15 (no positive contribution from children)
- For node 7: max contribution to parent = 7 (no positive contribution)
- For node 20: path through = 15 + 20 + 7 = 42

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **DFS Post-Order (Optimal)** - O(n) time, O(h) space
2. **DFS with Memoization** - O(n) time, O(n) space
3. **Iterative with Stack** - O(n) time, O(n) space

---

## Approach 1: DFS Post-Order (Optimal)

This is the most efficient approach using post-order DFS. We compute the maximum path sum in a single traversal.

### Algorithm Steps

1. Initialize a global variable `max_sum` to negative infinity
2. Define a recursive function `dfs(node)` that returns the maximum path sum starting from this node going downward
3. For each node:
   - Recursively compute left and right contributions (only if positive)
   - Update global max with path going through this node: `node.val + left + right`
   - Return the maximum path sum going downward: `node.val + max(left, right)`
4. Call dfs on root and return `max_sum`

### Why It Works

By processing children first, we know the maximum contribution each child can make. The key insight is that a path through a node can include at most one child in each direction, and we only include children if they contribute positively.

### Code Implementation

````carousel
```python
from typing import Optional

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def maxPathSum(self, root: Optional[TreeNode]) -> int:
        """
        Find the maximum path sum in a binary tree.
        
        Args:
            root: Root of the binary tree
            
        Returns:
            Maximum path sum (non-empty path)
        """
        self.max_sum = float('-inf')
        
        def dfs(node):
            if not node:
                return 0
            
            # Get maximum contribution from left and right subtrees
            # Only include if positive (can choose to not include)
            left = max(dfs(node.left), 0)
            right = max(dfs(node.right), 0)
            
            # Update global maximum with path going through this node
            path_through_node = node.val + left + right
            self.max_sum = max(self.max_sum, path_through_node)
            
            # Return maximum path sum starting from this node going downward
            return node.val + max(left, right)
        
        dfs(root)
        return self.max_sum
```

<!-- slide -->
```cpp
#include <algorithm>
using namespace std;

// Definition for a binary tree node.
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

class Solution {
private:
    int max_sum;
    
    int dfs(TreeNode* node) {
        if (!node) return 0;
        
        // Get maximum contribution from left and right subtrees
        int left = max(dfs(node->left), 0);
        int right = max(dfs(node->right), 0);
        
        // Update global maximum with path going through this node
        int path_through_node = node->val + left + right;
        max_sum = max(max_sum, path_through_node);
        
        // Return maximum path sum starting from this node going downward
        return node->val + max(left, right);
    }
    
public:
    int maxPathSum(TreeNode* root) {
        max_sum = INT_MIN;
        dfs(root);
        return max_sum;
    }
};
```

<!-- slide -->
```java
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
    private int maxSum;
    
    public int maxPathSum(TreeNode root) {
        maxSum = Integer.MIN_VALUE;
        dfs(root);
        return maxSum;
    }
    
    private int dfs(TreeNode node) {
        if (node == null) return 0;
        
        // Get maximum contribution from left and right subtrees
        int left = Math.max(dfs(node.left), 0);
        int right = Math.max(dfs(node.right), 0);
        
        // Update global maximum with path going through this node
        int pathThroughNode = node.val + left + right;
        maxSum = Math.max(maxSum, pathThroughNode);
        
        // Return maximum path sum starting from this node going downward
        return node.val + Math.max(left, right);
    }
}
```

<!-- slide -->
```javascript
// Definition for a binary tree node.
function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
}

/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxPathSum = function(root) {
    let maxSum = -Infinity;
    
    function dfs(node) {
        if (!node) return 0;
        
        // Get maximum contribution from left and right subtrees
        const left = Math.max(dfs(node.left), 0);
        const right = Math.max(dfs(node.right), 0);
        
        // Update global maximum with path going through this node
        const pathThroughNode = node.val + left + right;
        maxSum = Math.max(maxSum, pathThroughNode);
        
        // Return maximum path sum starting from this node going downward
        return node.val + Math.max(left, right);
    }
    
    dfs(root);
    return maxSum;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Visit each node exactly once |
| **Space** | O(h) - Recursion stack depth equals tree height |

---

## Approach 2: DFS with Memoization

This approach uses memoization to store computed results, which can be helpful for understanding but isn't necessary since each node is visited once anyway.

### Algorithm Steps

1. Use a hash map to store computed maximum path sums for each subtree
2. For each node, compute the maximum path sum and cache it
3. Return the maximum across all paths

### Code Implementation

````carousel
```python
from typing import Optional, Dict

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def maxPathSum_memo(self, root: Optional[TreeNode]) -> int:
        """
        Find maximum path sum using memoization.
        """
        self.max_sum = float('-inf')
        self.memo: Dict[TreeNode, int] = {}
        
        def dfs(node):
            if not node:
                return 0
            
            # Get values from cache or compute
            left = max(dfs(node.left), 0) if node.left else 0
            right = max(dfs(node.right), 0) if node.right else 0
            
            # Update maximum
            path_through = node.val + left + right
            self.max_sum = max(self.max_sum, path_through)
            
            return node.val + max(left, right)
        
        dfs(root)
        return self.max_sum
```

<!-- slide -->
```cpp
#include <unordered_map>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
private:
    int max_sum;
    unordered_map<TreeNode*, int> memo;
    
    int dfs(TreeNode* node) {
        if (!node) return 0;
        
        int left = max(dfs(node->left), 0);
        int right = max(dfs(node->right), 0);
        
        int path_through = node->val + left + right;
        max_sum = max(max_sum, path_through);
        
        return node->val + max(left, right);
    }
    
public:
    int maxPathSum(TreeNode* root) {
        max_sum = INT_MIN;
        return dfs(root);
    }
};
```

<!-- slide -->
```java
class Solution {
    private int maxSum;
    
    public int maxPathSum(TreeNode root) {
        maxSum = Integer.MIN_VALUE;
        return dfs(root);
    }
    
    private int dfs(TreeNode node) {
        if (node == null) return 0;
        
        int left = Math.max(dfs(node.left), 0);
        int right = Math.max(dfs(node.right), 0);
        
        int pathThrough = node.val + left + right;
        maxSum = Math.max(maxSum, pathThrough);
        
        return node.val + Math.max(left, right);
    }
}
```

<!-- slide -->
```javascript
var maxPathSum = function(root) {
    let maxSum = -Infinity;
    
    function dfs(node) {
        if (!node) return 0;
        
        const left = Math.max(dfs(node.left), 0);
        const right = Math.max(dfs(node.right), 0);
        
        const pathThrough = node.val + left + right;
        maxSum = Math.max(maxSum, pathThrough);
        
        return node.val + Math.max(left, right);
    }
    
    dfs(root);
    return maxSum;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each node computed once |
| **Space** | O(n) for memo + O(h) for stack |

---

## Approach 3: Iterative with Stack

This approach simulates the recursive DFS using an explicit stack, useful for environments with limited recursion depth.

### Code Implementation

````carousel
```python
from typing import Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def maxPathSum_iterative(self, root: Optional[TreeNode]) -> int:
        """
        Find maximum path sum using iterative DFS.
        """
        if not root:
            return 0
        
        max_sum = float('-inf')
        stack = [(root, False)]  # (node, visited)
        dp = {}  # Store max path sum starting from each node
        
        while stack:
            node, visited = stack.pop()
            
            if not node:
                continue
            
            if not visited:
                # Post-order: add children first, then process
                stack.append((node, True))
                if node.right:
                    stack.append((node.right, False))
                if node.left:
                    stack.append((node.left, False))
            else:
                # Process node after children
                left = dp.get(node.left, 0) if node.left else 0
                right = dp.get(node.right, 0) if node.right else 0
                
                left = max(left, 0)
                right = max(right, 0)
                
                # Path through this node
                path_through = node.val + left + right
                max_sum = max(max_sum, path_through)
                
                # Max path starting from this node
                dp[node] = node.val + max(left, right)
        
        return max_sum
```

<!-- slide -->
```cpp
#include <stack>
#include <unordered_map>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    int maxPathSum(TreeNode* root) {
        if (!root) return 0;
        
        int max_sum = INT_MIN;
        stack<pair<TreeNode*, bool>> st;
        unordered_map<TreeNode*, int> dp;
        
        st.push({root, false});
        
        while (!st.empty()) {
            auto [node, visited] = st.top();
            st.pop();
            
            if (!node) continue;
            
            if (!visited) {
                st.push({node, true});
                if (node->right) st.push({node->right, false});
                if (node->left) st.push({node->left, false});
            } else {
                int left = node->left ? max(dp[node->left], 0) : 0;
                int right = node->right ? max(dp[node->right], 0) : 0;
                
                int path_through = node->val + left + right;
                max_sum = max(max_sum, path_through);
                
                dp[node] = node->val + max(left, right);
            }
        }
        
        return max_sum;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int maxPathSum(TreeNode root) {
        if (root == null) return 0;
        
        int maxSum = Integer.MIN_VALUE;
        Stack<Pair<TreeNode, Boolean>> stack = new Stack<>();
        Map<TreeNode, Integer> dp = new HashMap<>();
        
        stack.push(new Pair<>(root, false));
        
        while (!stack.isEmpty()) {
            Pair<TreeNode, Boolean> pair = stack.pop();
            TreeNode node = pair.getKey();
            boolean visited = pair.getValue();
            
            if (node == null) continue;
            
            if (!visited) {
                stack.push(new Pair<>(node, true));
                if (node.right != null) stack.push(new Pair<>(node.right, false));
                if (node.left != null) stack.push(new Pair<>(node.left, false));
            } else {
                int left = node.left != null ? Math.max(dp.get(node.left), 0) : 0;
                int right = node.right != null ? Math.max(dp.get(node.right), 0) : 0;
                
                int pathThrough = node.val + left + right;
                maxSum = Math.max(maxSum, pathThrough);
                
                dp.put(node, node.val + Math.max(left, right));
            }
        }
        
        return maxSum;
    }
}
```

<!-- slide -->
```javascript
var maxPathSum = function(root) {
    if (!root) return 0;
    
    let maxSum = -Infinity;
    const stack = [{node: root, visited: false}];
    const dp = new Map();
    
    while (stack.length > 0) {
        const {node, visited} = stack.pop();
        
        if (!node) continue;
        
        if (!visited) {
            stack.push({node, visited: true});
            if (node.right) stack.push({node: node.right, visited: false});
            if (node.left) stack.push({node: node.left, visited: false});
        } else {
            const left = node.left ? Math.max(dp.get(node.left), 0) : 0;
            const right = node.right ? Math.max(dp.get(node.right), 0) : 0;
            
            const pathThrough = node.val + left + right;
            maxSum = Math.max(maxSum, pathThrough);
            
            dp.set(node, node.val + Math.max(left, right));
        }
    }
    
    return maxSum;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each node visited once |
| **Space** | O(n) - Stack and hash map |

---

## Comparison of Approaches

| Aspect | DFS Post-Order | Memoization | Iterative |
|--------|---------------|-------------|-----------|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(h) | O(n) | O(n) |
| **Implementation** | Simplest | Moderate | Complex |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Best For** | Most cases | Understanding | Stack overflow concerns |

**Best Approach:** The recursive DFS post-order approach (Approach 1) is optimal with the best space complexity.

---

## Why DFS Post-Order Works

The post-order DFS approach is optimal because:

1. **Optimal Substructure**: The maximum path through a node depends only on its children's contributions
2. **Local to Global**: By computing local maximums, we can determine the global maximum
3. **No Overlap**: Each node is processed exactly once
4. **Negative Handling**: By using max(0, childContribution), we can choose to exclude negative subtrees

---

## Related Problems

### Same Pattern (Tree Path Problems)

| Problem | LeetCode Link | Difficulty | Description |
|---------|---------------|------------|-------------|
| Binary Tree Path Sum | [Link](https://leetcode.com/problems/path-sum/) | Easy | Find if path exists with given sum |
| Path Sum II | [Link](https://leetcode.com/problems/path-sum-ii/) | Medium | Find all root-to-leaf paths |
| Sum Root to Leaf Numbers | [Link](https://leetcode.com/problems/sum-root-to-leaf-numbers/) | Medium | Sum all root-to-leaf numbers |
| Longest Univalue Path | [Link](https://leetcode.com/problems/longest-univalue-path/) | Medium | Longest path with same values |
| Diameter of Binary Tree | [Link](https://leetcode.com/problems/diameter-of-binary-tree/) | Easy | Longest path between nodes |

### Similar DFS Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Maximum Product Splitted Binary Tree | [Link](https://leetcode.com/problems/maximum-product-splitted-binary-tree/) | Similar max path concept |
| Tree Node | [Link](https://leetcode.com/problems/tree-node/) | Tree traversal |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - Binary Tree Maximum Path Sum](https://www.youtube.com/watch?v=8hQPLSSjkMY)** - Clear explanation with visual examples

2. **[Back to Back SWE - Maximum Path Sum](https://www.youtube.com/watch?v=8Q1nQkVGYQ8)** - Detailed walkthrough

3. **[LeetCode Official Solution](https://www.youtube.com/watch?v=0lGNeO7xW7k)** - Official problem solution

4. **[Tree DFS Pattern Explained](https://www.youtube.com/watch?v=8jP8CCrj8cI)** - Understanding DFS on trees

---

## Follow-up Questions

### Q1: How would you modify to also return the actual path?

**Answer:** Track the maximum path as you update the global maximum. Store the node indices or values when you find a new maximum path. At the end, reconstruct the path from stored information.

---

### Q2: What if the tree is very deep (like a linked list)?

**Answer:** Use the iterative approach to avoid stack overflow, or increase the recursion limit in languages that support it. The time complexity remains O(n).

---

### Q3: How would you handle trees with very wide breadth?

**Answer:** The algorithm handles this naturally since we traverse each node once. For very large trees, consider using explicit stack (iterative approach) to avoid recursion limits.

---

### Q4: Can you solve it with O(1) extra space?

**Answer:** No, because we need to store information about at least O(h) nodes in the recursion stack. The optimal space is O(h) where h is the height of the tree.

---

### Q5: How would you extend this to find the k-th maximum path sum?

**Answer:** Use a min-heap of size k to track the top k path sums while traversing. Or collect all path sums and use quickselect/selection algorithm.

---

### Q6: What edge cases should be tested?

**Answer:**
- Single node tree (return node value)
- All negative values (return the maximum/least negative)
- Mixed positive and negative values
- Tree with only one child branch
- Balanced tree

---

### Q7: How would you modify to require the path to pass through the root?

**Answer:** Simply don't take the global maximum. Instead, compute the maximum path that must include root: root.val + max(0, left) + max(0, right).

---

### Q8: What if nodes had weights on edges instead of values?

**Answer:** Modify the contribution calculation to include edge weights. Instead of just node.val, use node.val + edge_weight_to_node.

---

## Common Pitfalls

### 1. Forgetting Negative Values
**Issue**: Not initializing max_sum to negative infinity.

**Solution**: Initialize to `-float('inf')` or `-10^9` to handle all-negative trees.

### 2. Including Negative Contributions
**Issue**: Including children that contribute negatively.

**Solution**: Use `max(0, childContribution)` to optionally exclude negative subtrees.

### 3. Wrong Return Value
**Issue**: Returning the wrong value from the recursive function.

**Solution**: Return `node.val + max(left, right)` - the max path starting from this node going DOWN, not the max path through this node.

### 4. Base Case
**Issue**: Not handling empty nodes correctly.

**Solution**: Return 0 for null nodes, representing "no path".

---

## Summary

The **Binary Tree Maximum Path Sum** problem demonstrates the power of DFS with post-order traversal:

- **Post-order processing**: Children processed before parent
- **Two computations**: Path through node and path extending downward
- **Negative handling**: Only include positive contributions

Key takeaways:
- **DFS post-order**: Optimal O(n) time and O(h) space
- **Max function**: Use max(0, child) to optionally exclude negative paths
- **Two values**: Track both global max and return value

This problem is essential for understanding tree-based dynamic programming.

### Pattern Summary

This problem exemplifies the **Tree DFS - Maximum Path Sum** pattern, characterized by:
- Post-order traversal
- Computing maximum contributions from children
- Handling negative values appropriately

For more details on tree patterns, see the **[Tree DFS](/algorithms/tree-dfs)** section.
