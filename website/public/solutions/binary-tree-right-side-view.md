# Binary Tree Right Side View

## Problem Description

[LeetCode Link: Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view/)

Given the root of a binary tree, imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.

---

## Examples

**Example 1:**

**Input:**

```

root = [1,2,3,null,5,null,4]

```

**Output:**

```

[1,3,4]

```

**Explanation:**

**Example 2:**

**Input:**

```

root = [1,2,3,4,null,null,null,5]

```

**Output:**

```

[1,3,4,5]

```

**Explanation:**

**Example 3:**

**Input:**

```

root = [1,null,3]

```

**Output:**

```

[1,3]

```

**Example 4:**

**Input:**

```

root = []

```

**Output:**

```

[]

```

---

## Constraints

- The number of nodes in the tree is in the range [0, 100].
- -100 <= Node.val <= 100

---

## Pattern: Tree Traversal - BFS Level Order

### Core Concept

The Binary Tree Right Side View demonstrates the **BFS Level Order Traversal** pattern where we process tree nodes level by level:

1. **Level-by-Level Processing**: Use BFS/queue to process nodes in order
2. **Rightmost Node Selection**: The last node in each level is visible from the right side
3. **Queue-based Traversal**: Standard BFS pattern for trees

### When to Use This Pattern

This pattern applies when:
- Problem involves viewing tree from a specific side (left/right)
- Need to process nodes level by level
- Problems requiring visibility or exposure tracking in trees
- Tree serialization by levels

### Alternative Patterns

| Alternative Pattern | Use Case |
|---------------------|----------|
| **DFS (Preorder)** | When you want rightmost node first without queue |
| **Recursive with Level Tracking** | When recursion depth is manageable |
| **Reverse BFS** | For left side view |

---

## Intuition

The key insight for this problem is understanding that from the right side view, we can only see the **rightmost node at each level**. This leads to two main approaches:

1. **BFS Level Order**: Process each level and take the last node
2. **DFS Preorder (Modified)**: Traverse right subtree first, then left

### Key Observations

1. **Level-based visibility**: At each depth/level, only one node is visible from the right side
2. **Rightmost node**: The last node processed in each level when traversing left-to-right is the rightmost
3. **Right-first DFS**: If we traverse right before left in DFS, we naturally get the right view

### Example Walkthrough

For tree `[1,2,3,null,5,null,4]`:
```
    1
   / \
  2   3
   \   \
    5   4
```
- Level 0: only node 1 → visible: [1]
- Level 1: nodes 2, 3 → rightmost is 3 → visible: [1,3]
- Level 2: nodes 5, 4 → rightmost is 4 → visible: [1,3,4]

---

## Solution Approaches

## Approach 1: BFS Level Order (Optimal)

### Algorithm Steps

1. Use BFS with queue to process nodes level by level
2. For each level, process all nodes
3. The last node in each level is the rightmost visible node
4. Add its value to result

### Why It Works

BFS naturally processes nodes level by level. Since we add children left-to-right, the last node at each level is the rightmost one visible from the right side.

### Code Implementation

````carousel
```python
from typing import Optional, List
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def rightSideView(self, root: Optional[TreeNode]) -> List[int]:
        if not root:
            return []
        result = []
        queue = deque([root])
        while queue:
            level_size = len(queue)
            for i in range(level_size):
                node = queue.popleft()
                if i == level_size - 1:
                    result.append(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    vector<int> rightSideView(TreeNode* root) {
        if (!root) return {};
        vector<int> result;
        queue<TreeNode*> q;
        q.push(root);
        while (!q.empty()) {
            int levelSize = q.size();
            for (int i = 0; i < levelSize; i++) {
                TreeNode* node = q.front();
                q.pop();
                if (i == levelSize - 1) {
                    result.push_back(node->val);
                }
                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
            }
        }
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int x) { val = x; }
}

class Solution {
    public List<Integer> rightSideView(TreeNode root) {
        if (root == null) return new ArrayList<>();
        List<Integer> result = new ArrayList<>();
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            for (int i = 0; i < levelSize; i++) {
                TreeNode node = queue.poll();
                if (i == levelSize - 1) {
                    result.add(node.val);
                }
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
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
var rightSideView = function(root) {
    if (!root) return [];
    const result = [];
    const queue = [root];
    while (queue.length > 0) {
        const levelSize = queue.length;
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            if (i === levelSize - 1) {
                result.push(node.val);
            }
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
    }
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - visit each node once |
| **Space** | O(w) - queue size equals max width of tree |

---

## Approach 2: DFS Preorder (Right-First)

### Algorithm Steps

1. Use DFS, traversing right subtree before left
2. Keep track of current depth
3. When we first visit a node at a given depth, it's the rightmost visible
4. Add to result at that depth

### Why It Works

By traversing right before left, we naturally encounter the rightmost node at each depth first. We only add a node if we haven't already added one at its depth level.

### Code Implementation

````carousel
```python
from typing import Optional, List

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def rightSideView(self, root: Optional[TreeNode]) -> List[int]:
        result = []
        def dfs(node, depth):
            if not node:
                return
            if depth == len(result):
                result.append(node.val)
            dfs(node.right, depth + 1)
            dfs(node.left, depth + 1)
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
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    vector<int> rightSideView(TreeNode* root) {
        vector<int> result;
        dfs(root, 0, result);
        return result;
    }
    
    void dfs(TreeNode* node, int depth, vector<int>& result) {
        if (!node) return;
        if (depth == result.size()) {
            result.push_back(node->val);
        }
        dfs(node->right, depth + 1, result);
        dfs(node->left, depth + 1, result);
    }
};
```

<!-- slide -->
```java
import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int x) { val = x; }
}

class Solution {
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        dfs(root, 0, result);
        return result;
    }
    
    private void dfs(TreeNode node, int depth, List<Integer> result) {
        if (node == null) return;
        if (depth == result.size()) {
            result.add(node.val);
        }
        dfs(node.right, depth + 1, result);
        dfs(node.left, depth + 1, result);
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var rightSideView = function(root) {
    const result = [];
    const dfs = (node, depth) => {
        if (!node) return;
        if (depth === result.length) {
            result.push(node.val);
        }
        dfs(node.right, depth + 1);
        dfs(node.left, depth + 1);
    };
    dfs(root, 0);
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - visit each node once |
| **Space** | O(h) - recursion stack depth |

---

## Comparison of Approaches

| Aspect | BFS Level Order | DFS Right-First |
|--------|----------------|-----------------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(w) | O(h) |
| **Implementation** | Moderate | Simple |
| **LeetCode Optimal** | ✅ | ✅ |
| **Difficulty** | Easy | Easy |

**Best Approach:** Both approaches are optimal. BFS is more intuitive, while DFS uses less space for balanced trees.

---

## Common Pitfalls

### 1. Wrong Node Selection
**Issue:** Selecting the first node instead of the last node in each level.

**Solution:** Use `if i == level_size - 1` to capture the rightmost node.

### 2. Not Processing Children Properly
**Issue:** Missing left or right children when adding to queue.

**Solution:** Always add both left and right children to queue if they exist.

### 3. Empty Tree Handling
**Issue:** Not handling the case when root is None.

**Solution:** Return empty list if root is None.

### 4. Queue Usage in Python
**Issue:** Using list instead of deque for queue operations.

**Solution:** Use `from collections import deque` for efficient O(1) pop/append operations.

---

## Related Problems

Based on similar tree traversal themes:

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Binary Tree Left Side View | [Link](https://leetcode.com/problems/binary-tree-left-side-view/) | Leftmost node per level |
| Average of Levels in Binary Tree | [Link](https://leetcode.com/problems/average-of-levels-in-binary-tree/) | Calculate average per level |
| Binary Tree Level Order Traversal | [Link](https://leetcode.com/problems/binary-tree-level-order-traversal/) | Level by level traversal |
| Maximum Depth of Binary Tree | [Link](https://leetcode.com/problems/maximum-depth-of-binary-tree/) | Find max depth |
| Level Order Traversal II | [Link](https://leetcode.com/problems/binary-tree-level-order-traversal-ii/) | Bottom-up level order |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[Binary Tree Right Side View - LeetCode 199](https://www.youtube.com/watch?v=nK50S4q7E7A)** - NeetCode explanation
2. **[Right Side View BFS/DFS](https://www.youtube.com/watch?v=Tm_7-fJ1b1g)** - Back to Back SWE
3. **[Binary Tree Right Side View Tutorial](https://www.youtube.com/watch?v=sd3uW4GLG9Y)** - Nick White

### Related Concepts

- **[BFS vs DFS on Trees](https://www.youtube.com/watch?v=9Xy4R7G5h4Y)** - When to use each traversal
- **[Level Order Traversal](https://www.youtube.com/watch?v=UeCKH7BbkQQ)** - Understanding BFS

---

## Summary

The **Binary Tree Right Side View** problem demonstrates tree traversal techniques:

- **BFS Level Order**: Process each level, take the last node
- **DFS Right-First**: Traverse right before left, first node at each depth
- **Time complexity**: O(n)
- **Space complexity**: O(w) for BFS, O(h) for DFS

Key insights:
1. The rightmost node at each level is visible from the right side
2. BFS processes level by level, last node = rightmost
3. DFS right-first naturally finds rightmost at each depth
4. Both approaches achieve O(n) time complexity

---

## Follow-up Questions

### Q1: How would you modify for the left side view?

**Answer:** Simply swap left and right children in BFS, or traverse left before right in DFS.

### Q2: Can you return the nodes instead of just values?

**Answer:** Yes, modify the result list to store TreeNode objects instead of values.

### Q3: How would you handle very wide trees?

**Answer:** Use DFS approach to avoid storing all nodes at a level in memory.

### Q4: What if you need the view from an arbitrary angle?

**Answer:** Generalize by tracking the order of children traversal based on the viewing angle.
