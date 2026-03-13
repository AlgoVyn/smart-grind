# Find Largest Value In Each Tree Row

## Problem Description

Given the root of a binary tree, return an array of the largest value in each row of the tree (0-indexed).

---

## Pattern: BFS / Level Order Traversal

This problem demonstrates algorithmic problem-solving patterns.

## Constraints

- The number of nodes in the tree will be in the range [0, 104].
- -231 <= Node.val <= 231 - 1

---

## Examples

### Example 1

**Output:**
```python
[1,3,9]
```

---

## Example 2

**Input:**
```python
root = [1,2,3]
```

**Output:**
```python
[1,3]
```

---

## Intuition

The problem requires finding the maximum value at each level of a binary tree. This is a classic breadth-first search (BFS) problem where we process the tree level by level.

### Why BFS Works

- BFS naturally processes nodes level by level
- We can determine the size of each level before processing
- This ensures we only collect values from the same row together

---

## Multiple Approaches with Code

We'll cover three approaches:
1. **BFS with Queue (Level Order Traversal)** - Most common approach
2. **DFS (Depth-First Search)** - Recursive approach
3. **Optimized DFS with List** - More memory efficient

---

## Approach 1: BFS with Queue (Level Order Traversal)

This is the most intuitive approach using a queue to process nodes level by level.

### Algorithm Steps

1. If root is None, return empty list
2. Initialize queue with root node
3. While queue is not empty:
   - Get the current level size
   - Process all nodes at current level
   - Find maximum value
   - Add children to queue for next level
4. Return result list

### Why It Works

The queue ensures we process nodes in order of their distance from root. By tracking level size, we know exactly when we've processed all nodes at one depth.

### Code Implementation

````carousel
```python
from typing import List, Optional

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def largestValues(self, root: Optional[TreeNode]) -> List[int]:
        """
        Find largest value in each row using BFS.
        
        Args:
            root: Root of binary tree
            
        Returns:
            List of largest values per row
        """
        if not root:
            return []
        
        result = []
        queue = [root]
        
        while queue:
            level_size = len(queue)
            max_val = float('-inf')
            
            for _ in range(level_size):
                node = queue.pop(0)
                max_val = max(max_val, node.val)
                
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            
            result.append(max_val)
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
#include <limits>
using namespace std;

// Definition for a binary tree node.
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
    vector<int> largestValues(TreeNode* root) {
        if (!root) return {};
        
        vector<int> result;
        queue<TreeNode*> q;
        q.push(root);
        
        while (!q.empty()) {
            int levelSize = q.size();
            int maxVal = numeric_limits<int>::min();
            
            for (int i = 0; i < levelSize; i++) {
                TreeNode* node = q.front();
                q.pop();
                
                maxVal = max(maxVal, node->val);
                
                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
            }
            
            result.push_back(maxVal);
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
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

class Solution {
    public List<Integer> largestValues(TreeNode root) {
        if (root == null) return new ArrayList<>();
        
        List<Integer> result = new ArrayList<>();
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        
        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            int maxVal = Integer.MIN_VALUE;
            
            for (int i = 0; i < levelSize; i++) {
                TreeNode node = queue.poll();
                maxVal = Math.max(maxVal, node.val);
                
                if (node.left != null) queue.add(node.left);
                if (node.right != null) queue.add(node.right);
            }
            
            result.add(maxVal);
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
// Definition for a binary tree node.
class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var largestValues = function(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        let maxVal = -Infinity;
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            maxVal = Math.max(maxVal, node.val);
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        result.push(maxVal);
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Visit each node exactly once |
| **Space** | O(w) - Queue holds at most one level, w = max width |

---

## Approach 2: Depth-First Search (Recursive)

Using DFS to traverse the tree and track the depth level.

### Algorithm Steps

1. If root is None, return empty list
2. Use recursive DFS with depth parameter
3. For each node:
   - If current depth equals result size, add new level
   - Otherwise, update existing level with max
4. Recurse on left and right children with depth + 1

### Why It Works

DFS visits all nodes, and by tracking depth, we know which level each node belongs to. We maintain a result list where index = depth.

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
    def largestValues_dfs(self, root: Optional[TreeNode]) -> List[int]:
        """
        Find largest value in each row using DFS.
        
        Args:
            root: Root of binary tree
            
        Returns:
            List of largest values per row
        """
        result = []
        
        def dfs(node: Optional[TreeNode], depth: int):
            if not node:
                return
            
            # Expand result list if needed
            if depth == len(result):
                result.append(node.val)
            else:
                # Update maximum for this level
                result[depth] = max(result[depth], node.val)
            
            # Recurse on children
            dfs(node.left, depth + 1)
            dfs(node.right, depth + 1)
        
        dfs(root, 0)
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
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

class Solution {
private:
    void dfs(TreeNode* node, int depth, vector<int>& result) {
        if (!node) return;
        
        // Expand result vector if needed
        if (depth == result.size()) {
            result.push_back(node->val);
        } else {
            result[depth] = max(result[depth], node->val);
        }
        
        dfs(node->left, depth + 1, result);
        dfs(node->right, depth + 1, result);
    }
    
public:
    vector<int> largestValues(TreeNode* root) {
        vector<int> result;
        dfs(root, 0, result);
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    private void dfs(TreeNode node, int depth, List<Integer> result) {
        if (node == null) return;
        
        // Expand result list if needed
        if (depth == result.size()) {
            result.add(node.val);
        } else {
            result.set(depth, Math.max(result.get(depth), node.val));
        }
        
        dfs(node.left, depth + 1, result);
        dfs(node.right, depth + 1, result);
    }
    
    public List<Integer> largestValues(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        dfs(root, 0, result);
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var largestValues = function(root) {
    const result = [];
    
    const dfs = (node, depth) => {
        if (!node) return;
        
        // Expand result array if needed
        if (depth === result.length) {
            result.push(node.val);
        } else {
            result[depth] = Math.max(result[depth], node.val);
        }
        
        dfs(node.left, depth + 1);
        dfs(node.right, depth + 1);
    };
    
    dfs(root, 0);
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Visit each node exactly once |
| **Space** | O(h) - Recursion stack, h = tree height |

---

## Approach 3: DFS with Level List (Space Optimized)

Similar to approach 2 but with explicit level tracking.

### Algorithm Steps

1. Maintain a result list initialized with empty lists per level
2. Use DFS to populate each level with its nodes' values
3. After traversal, compute max for each level

### Why It Works

By collecting all values at each level first, we can process them separately. This approach is useful when you need all values at a level, not just the maximum.

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
    def largestValues_levels(self, root: Optional[TreeNode]) -> List[int]:
        """
        Find largest value in each row using level tracking.
        
        Args:
            root: Root of binary tree
            
        Returns:
            List of largest values per row
        """
        if not root:
            return []
        
        levels = []
        
        def dfs(node: Optional[TreeNode], depth: int):
            if not node:
                return
            
            if depth == len(levels):
                levels.append([])
            
            levels[depth].append(node.val)
            dfs(node.left, depth + 1)
            dfs(node.right, depth + 1)
        
        dfs(root, 0)
        
        return [max(level) for level in levels]
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

class Solution {
private:
    void dfs(TreeNode* node, int depth, vector<vector<int>>& levels) {
        if (!node) return;
        
        if (depth == levels.size()) {
            levels.push_back({});
        }
        
        levels[depth].push_back(node->val);
        dfs(node->left, depth + 1, levels);
        dfs(node->right, depth + 1, levels);
    }
    
public:
    vector<int> largestValues(TreeNode* root) {
        vector<vector<int>> levels;
        dfs(root, 0, levels);
        
        vector<int> result;
        for (const auto& level : levels) {
            result.push_back(*max_element(level.begin(), level.end()));
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    private void dfs(TreeNode node, int depth, List<List<Integer>> levels) {
        if (node == null) return;
        
        if (depth == levels.size()) {
            levels.add(new ArrayList<>());
        }
        
        levels.get(depth).add(node.val);
        dfs(node.left, depth + 1, levels);
        dfs(node.right, depth + 1, levels);
    }
    
    public List<Integer> largestValues(TreeNode root) {
        List<List<Integer>> levels = new ArrayList<>();
        dfs(root, 0, levels);
        
        List<Integer> result = new ArrayList<>();
        for (List<Integer> level : levels) {
            result.add(Collections.max(level));
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var largestValues = function(root) {
    const levels = [];
    
    const dfs = (node, depth) => {
        if (!node) return;
        
        if (depth === levels.length) {
            levels.push([]);
        }
        
        levels[depth].push(node.val);
        dfs(node.left, depth + 1);
        dfs(node.right, depth + 1);
    };
    
    dfs(root, 0);
    
    return levels.map(level => Math.max(...level));
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Visit each node + compute max per level |
| **Space** | O(n) - Store all values in levels list |

---

## Comparison of Approaches

| Aspect | BFS | DFS Recursive | DFS Level List |
|--------|-----|---------------|----------------|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(w) | O(h) | O(n) |
| **Implementation** | Moderate | Simple | Simple |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes | ❌ No |
| **Best For** | Level-by-level | Memory constrained | When you need all values |

**Best Approach:** BFS is the most common and intuitive for this problem.

---

## Why BFS is Optimal for This Problem

The BFS approach is preferred because:

1. **Natural Level Processing**: Queue naturally processes nodes by their distance from root
2. **Predictable Memory**: Queue size equals tree width, which is more predictable
3. **Iterative**: No recursion depth issues for deep trees
4. **Industry Standard**: Widely accepted solution for level-order problems

---

## Related Problems

Based on similar themes (tree traversal, level-order processing):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Binary Tree Level Order Traversal | [Link](https://leetcode.com/problems/binary-tree-level-order-traversal/) | Basic level order traversal |
| Maximum Depth of Binary Tree | [Link](https://leetcode.com/problems/maximum-depth-of-binary-tree/) | Find tree depth |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Binary Tree Level Order Traversal II | [Link](https://leetcode.com/problems/binary-tree-level-order-traversal-ii/) | Bottom-up level order |
| Average of Levels in Binary Tree | [Link](https://leetcode.com/problems/average-of-levels-in-binary-tree/) | Average per level |
| Find Bottom Left Tree Value | [Link](https://leetcode.com/problems/find-bottom-left-tree-value/) | Leftmost value in bottom row |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Binary Tree Maximum Path Sum | [Link](https://leetcode.com/problems/binary-tree-maximum-path-sum/) | Max path in tree |
| Serialize and Deserialize Binary Tree | [Link](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/) | Tree encoding |

---

## Video Tutorial Links

### BFS Approach

- [NeetCode - Find Largest Value in Each Tree Row](https://www.youtube.com/watch?v=UtG2smlNhTI) - Clear explanation with visual examples
- [BFS Level Order Traversal](https://www.youtube.com/watch?v=6ZRhqVsN_X4) - Understanding BFS for trees

### DFS Approach

- [DFS Solution Explained](https://www.youtube.com/watch?v=YihI3Dho_Gg) - Recursive approach
- [Tree Traversal Patterns](https://www.youtube.com/watch?v=UeV0r8FzN4w) - Common tree patterns

---

## Follow-up Questions

### Q1: Can you solve it using DFS instead of BFS?

**Answer:** Yes! Use recursive DFS with a depth parameter. Maintain a result array where index = depth. For each node, update result[depth] with max(result[depth], node.val). This gives O(n) time and O(h) space where h is the height.

---

### Q2: How would you find the minimum value in each row instead?

**Answer:** Simply replace `max()` with `min()` in the algorithm. The logic remains exactly the same - just track the minimum instead of maximum at each level.

---

### Q3: What if you need to return the index of the maximum value in each row?

**Answer:** Instead of tracking just the max value, track both the max value and its index. Use `max_val = max(max_val, node.val)` and store the index when you find a new maximum.

---

### Q4: How would you modify the solution for a column-wise traversal instead of row-wise?

**Answer:** You'd need to use a different data structure. One approach is to use a hash map where key = column index, value = list of values at that column. Then find max in each column. This requires tracking both row and column indices during traversal.

---

### Q5: What edge cases should be tested?

**Answer:**
- Empty tree (root = null)
- Single node tree
- All nodes have same value
- Nodes with negative values
- Deep/skinny tree (worst case for BFS space)
- Wide/short tree (worst case for DFS space)

---

### Q6: How would you handle very large trees efficiently?

**Answer:** Both BFS and DFS are O(n), so they're equally efficient time-wise. For space, if the tree is very wide, DFS might be better (O(h) vs O(w)). If the tree is very deep, BFS might be better (O(w) vs O(h)). Choose based on tree shape.

---

### Q7: Can you return the sum of values in each row instead of maximum?

**Answer:** Yes, simply replace `max()` with addition. Track `sum += node.val` at each level instead of comparing values. This is useful for computing averages or other aggregations.

---

## Common Pitfalls

### 1. Empty Tree
**Issue**: Forgetting to handle the case when root is None.

**Solution**: Return empty list immediately if root is null/None.

### 2. Level Size Calculation
**Issue**: Calculating level size inside the loop incorrectly.

**Solution**: Calculate level size BEFORE the loop and use it to control iterations.

### 3. Queue vs List
**Issue**: Using list pop(0) which is O(n) in Python.

**Solution**: Use collections.deque for O(1) popleft(), or use index-based iteration.

### 4. Children Addition
**Issue**: Adding children before checking if they exist.

**Solution**: Always check if left/right is not None before adding to queue.

---

## Summary

The **Find Largest Value in Each Tree Row** problem demonstrates tree traversal patterns:

- **BFS**: Natural level-by-level processing with queue
- **DFS**: Recursive approach with depth tracking
- **Level List**: Collect all values then process

The key insight is that we need to process nodes at the same depth together, either by using a queue (BFS) or by tracking depth (DFS).

This problem is an excellent demonstration of tree traversal and level-order processing techniques.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/find-largest-value-in-each-tree-row/discuss/) - Community solutions
- [BFS - GeeksforGeeks](https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/) - BFS explanation
- [DFS - Geeksforgeeks](https://www.geeksforgeeks.org/depth-first-search-or-dfs-for-a-graph/) - DFS explanation
- [Pattern: Tree Level Order](/patterns/tree-level-order) - Related pattern guide
