# House Robber III

## Problem Description

The thief has found a new place for his thievery. There is only one entrance to this area, called `root`. Besides the root, each house has one and only one parent house.

After investigation, the thief realized that all houses in this place form a **binary tree**. The security system will automatically contact the police if two directly-linked houses were broken into on the same night.

Given the root of the binary tree, return the maximum amount of money the thief can rob without alerting the police.

**LeetCode Link:** [House Robber III - LeetCode 337](https://leetcode.com/problems/house-robber-iii/)

---

## Examples

### Example 1:

| Input | Output |
|-------|--------|
| `root = [3,2,3,null,3,null,1]` | `7` |

**Explanation:** Maximum amount = `3 + 3 + 1 = 7`.

### Example 2:

| Input | Output |
|-------|--------|
| `root = [3,4,5,1,3,null,1]` | `9` |

**Explanation:** Maximum amount = `4 + 5 = 9`.

---

## Constraints

- The number of nodes in the tree is in the range `[1, 10⁴]`.
- `0 <= Node.val <= 10⁴`

---

## Pattern: Tree Dynamic Programming (Post-Order Traversal)

This problem uses **Tree DP** where we compute decisions at each node while traversing bottom-up (post-order). For each node, we return two values: maximum money if we rob this node, and maximum money if we don't rob it. This is similar to the classic "House Robber" but on a tree structure.

### Core Concept

- **Two States per Node**: For each node, we need to know the maximum if we rob it vs. don't rob it
- **Post-Order Traversal**: Process children first, then parent - children decisions are needed for parent decision
- **Rob vs Not Rob**: If we rob current node, add current value + max from grandchildren; if not rob, take max of children
- **Return Tuple**: Return `(rob, not_rob)` from each recursive call

### When to Use This Pattern

This pattern is applicable when:
1. Tree problems with decisions at each node
2. Problems where child decisions affect parent
3. Tree-based dynamic programming

### Related Patterns

| Pattern | Description |
|---------|-------------|
| Binary Tree Traversal | Tree traversal techniques |
| Tree DP | Dynamic programming on trees |
| DFS | Depth-first search |

### Pattern Summary

This problem exemplifies **Tree DP with Two States**, characterized by:
- Post-order traversal
- Two-state DP (rob vs not rob)
- O(n) time complexity

---

## Intuition

The key insight is using **post-order traversal** to compute decisions at each node based on its children. This is a classic Tree DP problem.

### Key Observations

1. **Two States per Node**: For each node, we need to know the maximum if we rob it vs. don't rob it
2. **Post-Order Traversal**: Process children first, then parent - children decisions are needed for parent decision
3. **Rob vs Not Rob**: 
   - If we rob current node: add current value + max from grandchildren (children not robbed)
   - If we don't rob current node: take max of rob/not-rob for each child
4. **Return Tuple**: Return `(rob, not_rob)` from each recursive call

### Why Post-Order Works

The decision at a node depends on the optimal decisions of its children. By processing children first (post-order), we have all the information needed to make the optimal decision at the parent node.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Post-Order DFS** - Standard tree DP
2. **Memoization** - Using hash map

---

## Approach 1: Post-Order DFS (Optimal)

### Algorithm Steps

1. Perform post-order traversal (left, right, root)
2. For each node, return a tuple (rob, not_rob):
   - rob = node.val + left_not_rob + right_not_rob
   - not_rob = max(left_rob, left_not_rob) + max(right_rob, right_not_rob)
3. Return max(rob, not_rob) at root

### Why It Works

The two states capture all possibilities. When we rob a node, we cannot rob its children (police alert). When we don't rob a node, we can choose to rob or not rob children optimally.

### Code Implementation

````carousel
```python
from typing import Optional, Tuple

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def rob(self, root: Optional[TreeNode]) -> int:
        """
        Find maximum money that can be robbed using tree DP.
        
        Args:
            root: Root of the binary tree
            
        Returns:
            Maximum amount that can be robbed
        """
        def dfs(node: Optional[TreeNode]) -> Tuple[int, int]:
            """
            Returns (rob, not_rob) for the subtree rooted at node.
            - rob: max money if we rob this node
            - not_rob: max money if we don't rob this node
            """
            if not node:
                return (0, 0)
            
            # Post-order: process children first
            left_rob, left_not = dfs(node.left)
            right_rob, right_not = dfs(node.right)
            
            # If we rob current node, we cannot rob children
            rob = node.val + left_not + right_not
            
            # If we don't rob current node, we can choose to rob or not rob children
            not_rob = max(left_rob, left_not) + max(right_rob, right_not)
            
            return (rob, not_rob)
        
        # Return the maximum of robbing or not robbing the root
        return max(dfs(root))
```

<!-- slide -->
```cpp
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
    pair<int, int> dfs(TreeNode* node) {
        // Returns {rob, not_rob}
        if (!node) return {0, 0};
        
        // Post-order: children first
        auto left = dfs(node->left);
        auto right = dfs(node->right);
        
        // If we rob this node, we cannot rob children
        int rob = node->val + left.second + right.second;
        
        // If we don't rob this node, we can choose from children
        int not_rob = max(left.first, left.second) + max(right.first, right.second);
        
        return {rob, not_rob};
    }
    
    int rob(TreeNode* root) {
        auto result = dfs(root);
        return max(result.first, result.second);
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
    private int[] dfs(TreeNode node) {
        // Returns {rob, not_rob}
        if (node == null) return new int[]{0, 0};
        
        // Post-order: children first
        int[] left = dfs(node.left);
        int[] right = dfs(node.right);
        
        // If we rob this node, we cannot rob children
        int rob = node.val + left[1] + right[1];
        
        // If we don't rob this node, we can choose from children
        int not_rob = Math.max(left[0], left[1]) + Math.max(right[0], right[1]);
        
        return new int[]{rob, not_rob};
    }
    
    public int rob(TreeNode root) {
        int[] result = dfs(root);
        return Math.max(result[0], result[1]);
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
 * @return {number}
 */
var rob = function(root) {
    function dfs(node) {
        // Returns [rob, not_rob]
        if (!node) return [0, 0];
        
        // Post-order: children first
        const [leftRob, leftNot] = dfs(node.left);
        const [rightRob, rightNot] = dfs(node.right);
        
        // If we rob this node, we cannot rob children
        const rob = node.val + leftNot + rightNot;
        
        // If we don't rob this node, we can choose from children
        const not_rob = Math.max(leftRob, leftNot) + Math.max(rightRob, rightNot);
        
        return [rob, not_rob];
    }
    
    const [rob, not_rob] = dfs(root);
    return Math.max(rob, not_rob);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - visit each node once |
| **Space** | O(h) - recursion stack where h is tree height |

---

## Approach 2: Memoization with Hash Map

### Algorithm Steps

1. Use a hash map to store computed results for each node
2. For each node, check if we've computed it before
3. Use the same two-state logic

### Why It Works

Memoization avoids recomputing results for the same subtree. However, since each node is visited only once in the post-order approach, memoization provides the same time complexity.

### Code Implementation

````carousel
```python
from typing import Optional, Tuple
from functools import lru_cache

class Solution:
    def rob(self, root: Optional[TreeNode]) -> int:
        """Memoization approach."""
        @lru_cache(maxsize=None)
        def dfs(node):
            if not node:
                return (0, 0)
            
            left_rob, left_not = dfs(node.left)
            right_rob, right_not = dfs(node.right)
            
            rob = node.val + left_not + right_not
            not_rob = max(left_rob, left_not) + max(right_rob, right_not)
            
            return (rob, not_rob)
        
        return max(dfs(root))
```

<!-- slide -->
```cpp
class Solution {
public:
    unordered_map<TreeNode*, pair<int, int>> memo;
    
    pair<int, int> dfs(TreeNode* node) {
        if (!node) return {0, 0};
        if (memo.count(node)) return memo[node];
        
        auto left = dfs(node->left);
        auto right = dfs(node->right);
        
        int rob = node->val + left.second + right.second;
        int not_rob = max(left.first, left.second) + max(right.first, right.second);
        
        memo[node] = {rob, not_rob};
        return memo[node];
    }
    
    int rob(TreeNode* root) {
        auto result = dfs(root);
        return max(result.first, result.second);
    }
};
```

<!-- slide -->
```java
class Solution {
    private Map<TreeNode, int[]> memo = new HashMap<>();
    
    private int[] dfs(TreeNode node) {
        if (node == null) return new int[]{0, 0};
        if (memo.containsKey(node)) return memo.get(node);
        
        int[] left = dfs(node.left);
        int[] right = dfs(node.right);
        
        int rob = node.val + left[1] + right[1];
        int not_rob = Math.max(left[0], left[1]) + Math.max(right[0], right[1]);
        
        memo.put(node, new int[]{rob, not_rob});
        return memo.get(node);
    }
    
    public int rob(TreeNode root) {
        int[] result = dfs(root);
        return Math.max(result[0], result[1]);
    }
}
```

<!-- slide -->
```javascript
var rob = function(root) {
    const memo = new Map();
    
    function dfs(node) {
        if (!node) return [0, 0];
        if (memo.has(node)) return memo.get(node);
        
        const [leftRob, leftNot] = dfs(node.left);
        const [rightRob, rightNot] = dfs(node.right);
        
        const rob = node.val + leftNot + rightNot;
        const not_rob = Math.max(leftRob, leftNot) + Math.max(rightRob, rightNot);
        
        memo.set(node, [rob, not_rob]);
        return [rob, not_rob];
    }
    
    const [rob, not_rob] = dfs(root);
    return Math.max(rob, not_rob);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) |
| **Space** | O(n) for memo + O(h) for recursion |

---

## Comparison of Approaches

| Aspect | Post-Order DFS | Memoization |
|--------|----------------|-------------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(h) | O(n) + O(h) |
| **Implementation** | Simple | More complex |
| **Recommended** | ✅ | Alternative |

**Best Approach:** Use Approach 1 (Post-Order DFS) - it's simpler and more efficient.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Amazon, Microsoft, Google
- **Difficulty**: Medium
- **Concepts Tested**: Tree DP, DFS, Dynamic Programming

### Learning Outcomes

1. **Tree DP Mastery**: Learn to apply DP on tree structures
2. **Post-Order Traversal**: Understand bottom-up processing
3. **State Management**: Handle multiple states per node

---

## Related Problems

Based on similar themes (Tree DP):

### Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| House Robber | [Link](https://leetcode.com/problems/house-robber/) | Linear DP version |
| House Robber II | [Link](https://leetcode.com/problems/house-robber-ii/) | Circular houses |
| Binary Tree Max Path Sum | [Link](https://leetcode.com/problems/binary-tree-maximum-path-sum/) | Tree DP |

### Pattern Reference

For more detailed explanations, see:
- **[Dynamic Programming](/patterns/dynamic-programming)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - House Robber III](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Clear explanation
2. **[Tree DP Tutorial](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Understanding tree DP
3. **[LeetCode 337](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Problem walkthrough

---

## Follow-up Questions

### Q1: How would you modify to also track which houses to rob?

**Answer:** Store parent pointers or modify return values to include the actual houses.

---

### Q2: Can you solve this iteratively?

**Answer:** Yes, you can use a stack for post-order traversal, but it's more complex.

---

### Q3: How does this compare to House Robber I and II?

**Answer:** House Robber I is on an array (linear), House Robber II is on a circle, and House Robber III is on a tree.

---

## Common Pitfalls

### 1. Confusing rob vs not_rob states
**Issue:** Remember that if you rob a node, you cannot rob its children. If you don't rob a node, you can choose to rob or not rob children.

**Solution:** Use two-state DP correctly.

### 2. Not using max() for children
**Issue:** When not robbing current node, take max of (rob child, not rob child) for both left and right.

**Solution:** Always use max() for children when not robbing current node.

### 3. Not handling empty nodes
**Issue:** Always return (0, 0) for null nodes.

**Solution:** Check for null nodes at the start of DFS.

### 4. Stack overflow with deep trees
**Issue:** Consider using iterative approaches for very deep trees.

**Solution:** Use memoization or iterative approaches.

---

## Summary

The **House Robber III** problem demonstrates **Tree Dynamic Programming**:

- **Approach**: Post-order DFS with two-state DP
- **Time**: O(n) - visit each node once
- **Space**: O(h) - recursion stack height

The key is maintaining two values at each node: maximum when robbing this node and maximum when not robbing it.

### Pattern Summary

This problem exemplifies **Tree DP with Two States**, characterized by:
- Post-order traversal for bottom-up DP
- Two-state representation (rob vs not rob)
- O(n) time complexity

For more details on this pattern, see the **[Dynamic Programming](/patterns/dynamic-programming)** pattern.

---

## Additional Resources

- [LeetCode Problem 337](https://leetcode.com/problems/house-robber-iii/) - Official problem page
- [Tree DP - GeeksforGeeks](https://www.geeksforgeeks.org/dynamic-programming-on-trees/) - Tree DP explanation
- [Pattern: Dynamic Programming](/patterns/dynamic-programming) - Comprehensive pattern guide
