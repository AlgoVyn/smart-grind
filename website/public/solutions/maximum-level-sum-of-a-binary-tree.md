# Maximum Level Sum of a Binary Tree

## Problem Description

Given the root of a binary tree, the level of its root is `1`, the level of its children is `2`, and so on. Return the smallest level `x` such that the sum of all the values of nodes at level `x` is maximal.

**Link to problem:** [Maximum Level Sum of a Binary Tree - LeetCode 1161](https://leetcode.com/problems/maximum-level-sum-of-a-binary-tree/)

## Constraints
- The number of nodes in the tree is in the range `[1, 10^4]`
- `-10^5 <= Node.val <= 10^5`

---

## Pattern: BFS - Level Order Traversal

This problem is a classic example of the **BFS - Level Order Traversal** pattern. The pattern involves processing nodes level by level using a queue.

### Core Concept

- **Level Order Traversal**: Process all nodes at the current level before moving to the next
- **Queue-based BFS**: Use a queue to track nodes at each level
- **Track Maximum**: Keep track of the level with maximum sum

---

## Examples

### Example

**Input:** root = [1,7,0,7,-8,null,null]

**Output:** 2

**Explanation:**
- Level 1 sum = 1
- Level 2 sum = 7 + 0 = 7
- Level 3 sum = 7 + -8 = -1

So we return the level with the maximum sum which is level 2.

### Example 2

**Input:** root = [989,null,10250,98693,-89388,null,null,null,-32127]

**Output:** 2

---

## Intuition

The key insight is that we need to process the tree level by level:
1. Use BFS to traverse the tree level by level
2. For each level, calculate the sum of all node values
3. Track the level with the maximum sum
4. Return the smallest level if there are ties

### Why BFS Works

BFS naturally processes nodes in level order, making it perfect for this problem. We can use the queue size to determine when we've processed all nodes at a current level.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **BFS Level Order (Optimal)** - O(n) time, O(w) space
2. **DFS with Level Tracking** - O(n) time, O(h) space

---

## Approach 1: BFS Level Order (Optimal)

This is the most intuitive and commonly used approach with O(n) time complexity.

### Algorithm Steps

1. Initialize a queue with the root node and level = 1
2. While queue is not empty:
   - Get the current queue size (number of nodes at current level)
   - Calculate sum of all node values at current level
   - If sum > max_sum, update max_sum and max_level
   - Add all children of current level to queue
3. Return max_level

### Why It Works

BFS processes level by level naturally. By tracking the queue size at each iteration, we know exactly how many nodes belong to the current level.

### Code Implementation

````carousel
```python
from collections import deque
from typing import Optional

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def maxLevelSum(self, root: Optional[TreeNode]) -> int:
        """
        Find the level with maximum sum using BFS.
        
        Args:
            root: Root of the binary tree
            
        Returns:
            The level number (1-indexed) with maximum sum
        """
        if not root:
            return 0
        
        queue = deque([root])
        level = 1
        max_sum = float('-inf')
        max_level = 0
        
        while queue:
            level_sum = 0
            level_size = len(queue)
            
            # Process all nodes at current level
            for _ in range(level_size):
                node = queue.popleft()
                level_sum += node.val
                
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            
            # Update max if current level has higher sum
            if level_sum > max_sum:
                max_sum = level_sum
                max_level = level
            
            level += 1
        
        return max_level
```

<!-- slide -->
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
public:
    int maxLevelSum(TreeNode* root) {
        if (!root) return 0;
        
        queue<TreeNode*> q;
        q.push(root);
        int level = 1;
        int maxSum = INT_MIN;
        int maxLevel = 0;
        
        while (!q.empty()) {
            int levelSize = q.size();
            int levelSum = 0;
            
            // Process all nodes at current level
            for (int i = 0; i < levelSize; i++) {
                TreeNode* node = q.front();
                q.pop();
                levelSum += node->val;
                
                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
            }
            
            // Update max if current level has higher sum
            if (levelSum > maxSum) {
                maxSum = levelSum;
                maxLevel = level;
            }
            
            level++;
        }
        
        return maxLevel;
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
    public int maxLevelSum(TreeNode root) {
        if (root == null) return 0;
        
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        int level = 1;
        int maxSum = Integer.MIN_VALUE;
        int maxLevel = 0;
        
        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            int levelSum = 0;
            
            // Process all nodes at current level
            for (int i = 0; i < levelSize; i++) {
                TreeNode node = queue.poll();
                levelSum += node.val;
                
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
            
            // Update max if current level has higher sum
            if (levelSum > maxSum) {
                maxSum = levelSum;
                maxLevel = level;
            }
            
            level++;
        }
        
        return maxLevel;
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
var maxLevelSum = function(root) {
    if (!root) return 0;
    
    const queue = [root];
    let level = 1;
    let maxSum = -Infinity;
    let maxLevel = 0;
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        let levelSum = 0;
        
        // Process all nodes at current level
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            levelSum += node.val;
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        // Update max if current level has higher sum
        if (levelSum > maxSum) {
            maxSum = levelSum;
            maxLevel = level;
        }
        
        level++;
    }
    
    return maxLevel;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - each node is visited exactly once |
| **Space** | O(w) - queue holds at most one level, w = maximum width of tree |

---

## Approach 2: DFS with Level Tracking

This approach uses recursion to traverse the tree while tracking the current level.

### Algorithm Steps

1. Initialize result variables
2. Use DFS starting from root with level = 1
3. At each node:
   - Add node value to the sum for that level
   - Recurse on left and right children with level + 1
4. Track maximum sum and return corresponding It Works

DFS can also track levels level

### Why by passing the current level as a parameter. We need a map or array to store sums for each level.

### Code Implementation

````carousel
```python
from typing import Optional, List
from collections import defaultdict

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def maxLevelSum(self, root: Optional[TreeNode]) -> int:
        """
        Find the level with maximum sum using DFS.
        
        Args:
            root: Root of the binary tree
            
        Returns:
            The level number (1-indexed) with maximum sum
        """
        level_sums = defaultdict(int)
        
        def dfs(node: TreeNode, level: int):
            if not node:
                return
            level_sums[level] += node.val
            dfs(node.left, level + 1)
            dfs(node.right, level + 1)
        
        dfs(root, 1)
        
        # Find level with maximum sum
        max_sum = float('-inf')
        max_level = 0
        for level, total in level_sums.items():
            if total > max_sum:
                max_sum = total
                max_level = level
        
        return max_level
```

<!-- slide -->
```cpp
class Solution {
public:
    int maxLevelSum(TreeNode* root) {
        unordered_map<int, int> levelSums;
        
        function<void(TreeNode*, int)> dfs = [&](TreeNode* node, int level) {
            if (!node) return;
            levelSums[level] += node->val;
            dfs(node->left, level + 1);
            dfs(node->right, level + 1);
        };
        
        dfs(root, 1);
        
        int maxSum = INT_MIN;
        int maxLevel = 0;
        for (const auto& [level, sum] : levelSums) {
            if (sum > maxSum) {
                maxSum = sum;
                maxLevel = level;
            }
        }
        
        return maxLevel;
    }
};
```

<!-- slide -->
```java
class Solution {
    private Map<Integer, Integer> levelSums = new HashMap<>();
    
    public int maxLevelSum(TreeNode root) {
        dfs(root, 1);
        
        int maxSum = Integer.MIN_VALUE;
        int maxLevel = 0;
        for (Map.Entry<Integer, Integer> entry : levelSums.entrySet()) {
            if (entry.getValue() > maxSum) {
                maxSum = entry.getValue();
                maxLevel = entry.getKey();
            }
        }
        
        return maxLevel;
    }
    
    private void dfs(TreeNode node, int level) {
        if (node == null) return;
        levelSums.put(level, levelSums.getOrDefault(level, 0) + node.val);
        dfs(node.left, level + 1);
        dfs(node.right, level + 1);
    }
}
```

<!-- slide -->
```javascript
var maxLevelSum = function(root) {
    const levelSums = {};
    
    const dfs = (node, level) => {
        if (!node) return;
        levelSums[level] = (levelSums[level] || 0) + node.val;
        dfs(node.left, level + 1);
        dfs(node.right, level + 1);
    };
    
    dfs(root, 1);
    
    let maxSum = -Infinity;
    let maxLevel = 0;
    for (const [level, sum] of Object.entries(levelSums)) {
        if (sum > maxSum) {
            maxSum = sum;
            maxLevel = parseInt(level);
        }
    }
    
    return maxLevel;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - each node is visited exactly once |
| **Space** | O(h) - recursion stack depth, plus O(n) for level sums map |

---

## Comparison of Approaches

| Aspect | BFS | DFS |
|--------|-----|-----|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(w) | O(h) + O(n) |
| **Implementation** | Iterative | Recursive |
| **Natural Level Order** | Yes | No (requires tracking) |
| **Best For** | Wide trees | Deep trees |

**Best Approach:** BFS is generally preferred as it naturally processes level by level and is iterative (no stack overflow risk).

---

## Related Problems

### Similar Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Binary Tree Level Order Traversal | [Link](https://leetcode.com/problems/binary-tree-level-order-traversal/) | Basic level order traversal |
| Average of Levels in Binary Tree | [Link](https://leetcode.com/problems/average-of-levels-in-binary-tree/) | Calculate averages per level |
| Largest Value in Each Tree Row | [Link](https://leetcode.com/problems/largest-value-in-each-tree-row/) | Find max per level |
| Binary Tree Right Side View | [Link](https://leetcode.com/problems/binary-tree-right-side-view/) | Rightmost node per level |

### Pattern Reference

For more detailed explanations of the BFS pattern and its variations, see:
- **[BFS - Level Order Traversal Pattern](/patterns/bfs-level-order-traversal)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### BFS Approach

- [NeetCode - Maximum Level Sum of Binary Tree](https://www.youtube.com/watch?v=7C_f7fD2p14) - Clear explanation with visual examples
- [Binary Tree Level Order Traversal](https://www.youtube.com/watch?v=6ZRhqVDBkKg) - Understanding BFS on trees
- [BFS vs DFS for Binary Trees](https://www.youtube.com/watch?v=4uX7x8x8x8x) - When to use which approach

### Tree Traversal Techniques

- [Understanding Breadth-First Search](https://www.youtube.com/watch?v=oDqjDpD7-vE) - BFS fundamentals
- [Tree Traversals - Inorder, Preorder, Postorder](https://www.youtube.com/watch?v=6oOLMTKLywM) - DFS traversals

---

## Follow-up Questions

### Q1: How would you modify the solution to return all levels with the maximum sum?

**Answer:** Instead of tracking a single max_level, maintain a list of levels that achieve the maximum sum. Update the list whenever a higher sum is found, and add to the list when a equal sum is found.

---

### Q2: What if you needed to find the minimum level sum instead of maximum?

**Answer:** Simply change the comparison from `>` to `<` and initialize max_sum to infinity (or a very large number). The rest of the algorithm remains the same.

---

### Q3: How would you handle a very wide tree (tree with high branching factor)?

**Answer:** BFS might use a lot of memory for very wide trees. Consider using DFS with explicit stack, or if the tree is extremely wide, consider processing level by level using iteration with a generator pattern.

---

### Q4: Can you solve this without extra space for the queue?

**Answer:** Using DFS with a map to track level sums requires O(n) space for the map but doesn't need a queue. However, BFS is more natural for this problem and the queue space is bounded by the maximum width, not the total nodes.

---

### Q5: What if the tree has negative values?

**Answer:** The solution works correctly with negative values as well. The initialization of max_sum should be set to negative infinity to handle all-negative trees properly.

---

## Common Pitfalls

### 1. Level Indexing
**Issue**: Confusing 0-indexed vs 1-indexed levels.

**Solution**: Start level at 1 and increment after processing each level.

### 2. Queue Size
**Issue**: Not properly tracking the number of nodes at each level.

**Solution**: Store the queue size before the inner loop to process exactly one level per iteration.

### 3. Empty Tree
**Issue**: Not handling empty root.

**Solution**: Return 0 or appropriate default when root is null.

### 4. Integer Overflow
**Issue**: Sum can exceed integer range with large values.

**Solution:** Use long/long long in languages that support it, or use infinity initialization.

---

## Summary

The **Maximum Level Sum of a Binary Tree** problem demonstrates the power of **BFS Level Order Traversal**:

- **BFS approach**: Optimal with O(n) time and O(w) space
- **DFS approach**: Alternative with O(n) time and O(h + n) space
- The key is processing level by level and tracking the sum

This problem is an excellent demonstration of how BFS naturally solves level-based problems in trees.

### Pattern Summary

This problem exemplifies the **BFS - Level Order Traversal** pattern, which is characterized by:
- Using a queue to process nodes level by level
- Tracking level size using queue length
- Processing all nodes at current level before moving to next

For more details on this pattern and its variations, see the **[BFS - Level Order Traversal Pattern](/patterns/bfs-level-order-traversal)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/maximum-level-sum-of-a-binary-tree/discuss/) - Community solutions and explanations
- [BFS Algorithm - GeeksforGeeks](https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/) - Detailed BFS explanation
- [Tree Traversals - Interview Bit](https://www.interviewbit.com/tutorial/tree-traversals/) - Different tree traversal methods
- [Pattern: BFS - Level Order Traversal](/patterns/bfs-level-order-traversal) - Comprehensive pattern guide
