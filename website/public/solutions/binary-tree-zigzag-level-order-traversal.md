# Binary Tree Zigzag Level Order Traversal

## Problem Description

[LeetCode Link: Binary Tree Zigzag Level Order Traversal](https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/)

Given the root of a binary tree, return the zigzag level order traversal of its nodes' values. (i.e., from left to right, then right to left for the next level and alternate between).

---

## Examples

**Example 1:**

**Input:**

```

root = [3,9,20,null,null,15,7]

```

**Output:**

```

[[3],[20,9],[15,7]]

```

**Example 2:**

**Input:**

```

root = [1]

```

**Output:**

```

[[1]]

```

**Example 3:**

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

- The number of nodes in the tree is in the range [0, 2000].
- -100 <= Node.val <= 100

---

## Pattern:

This problem follows the **Breadth-First Search (BFS)** pattern with level-order traversal, enhanced with a directional flag for zigzag pattern.

### Core Concept

- **Level-order traversal**: Process all nodes at current depth before moving to next depth
- **Zigzag modification**: Alternate direction at each level using a boolean flag
- **Queue-based BFS**: Use deque for efficient pop/append operations

### When to Use This Pattern

This pattern is applicable when:
1. Tree/Graph problems requiring level-by-level processing
2. Problems needing to alternate direction at each level
3. Situations where tracking depth/level is important

### Related Patterns

| Pattern | Description |
|---------|-------------|
| Level Order Traversal | Process nodes level by level |
| BFS | Breadth-first exploration |
| Two Pointers | Directional movement (when combined with zigzag) |

### Pattern Summary

This problem exemplifies **BFS with Direction Toggle**, characterized by:
- Using a queue to process nodes by level
- Maintaining a direction flag that toggles at each level
- Reversing the order of elements at alternating levels

---

## Intuition

The key insight for this problem is using **BFS with a direction toggle**. Instead of simply collecting nodes level by level, we alternate the direction of traversal at each level:

1. **Level Processing**: Process all nodes at current depth before moving to next
2. **Direction Toggle**: Use a boolean flag to toggle between left-to-right and right-to-left
3. **Reversal or Direct Insertion**: Either reverse the level array or insert elements at the front for right-to-left levels

### Key Observations

1. **Even levels (0, 2, 4...)**: Left-to-right order
2. **Odd levels (1, 3, 5...)**: Right-to-left order
3. **Two ways to achieve zigzag**: 
   - Collect normally then reverse odd levels
   - Use deque with appendleft for odd levels

### Example Walkthrough

For tree `[3,9,20,null,null,15,7]`:
```
    3
   / \
  9  20
    /  \
   15   7
```
- Level 0: [3] → left-to-right → [3]
- Level 1: [9, 20] → right-to-left → [20, 9]
- Level 2: [15, 7] → left-to-right → [15, 7]
Result: [[3], [20, 9], [15, 7]]

---

## Solution Approaches

## Approach 1: BFS with Reversal (Optimal)

### Algorithm Steps

1. Use BFS to process nodes level by level
2. Track level size and collect all values at current level
3. If direction is right-to-left, reverse the level array
4. Toggle direction after each level

### Why It Works

BFS naturally processes nodes level by level. By reversing the order at alternating levels, we achieve the zigzag pattern.

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
    def zigzagLevelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        if not root:
            return []
        result = []
        queue = deque([root])
        left_to_right = True
        while queue:
            level_size = len(queue)
            level = []
            for _ in range(level_size):
                node = queue.popleft()
                level.append(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            if not left_to_right:
                level.reverse()
            result.append(level)
            left_to_right = not left_to_right
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
    vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
        if (!root) return {};
        vector<vector<int>> result;
        queue<TreeNode*> q;
        q.push(root);
        bool leftToRight = true;
        while (!q.empty()) {
            int levelSize = q.size();
            vector<int> level(levelSize);
            for (int i = 0; i < levelSize; i++) {
                TreeNode* node = q.front();
                q.pop();
                int index = leftToRight ? i : levelSize - 1 - i;
                level[index] = node->val;
                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
            }
            result.push_back(level);
            leftToRight = !leftToRight;
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
    public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
        if (root == null) return new ArrayList<>();
        List<List<Integer>> result = new ArrayList<>();
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        boolean leftToRight = true;
        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < levelSize; i++) {
                TreeNode node = queue.poll();
                int index = leftToRight ? i : levelSize - 1 - i;
                if (index >= level.size()) {
                    level.add(index, node.val);
                } else {
                    level.set(index, node.val);
                }
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
            result.add(level);
            leftToRight = !leftToRight;
        }
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var zigzagLevelOrder = function(root) {
    if (!root) return [];
    const result = [];
    const queue = [root];
    let leftToRight = true;
    while (queue.length > 0) {
        const levelSize = queue.length;
        const level = [];
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            const index = leftToRight ? i : levelSize - 1 - i;
            level[index] = node.val;
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        result.push(level);
        leftToRight = !leftToRight;
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

## Approach 2: Deque-Based Solution

### Algorithm Steps

1. Use deque for efficient front/back insertions
2. For right-to-left levels, append at front; for left-to-right, append at back
3. Process children in opposite order for right-to-left levels

### Why It Works

Using deque allows O(1) insertion at both ends. By reversing the child processing order and insertion direction, we achieve zigzag without array reversal.

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
    def zigzagLevelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        if not root:
            return []
        result = []
        queue = deque([root])
        left_to_right = True
        while queue:
            level_size = len(queue)
            level = deque()
            for _ in range(level_size):
                node = queue.popleft()
                if left_to_right:
                    level.append(node.val)
                else:
                    level.appendleft(node.val)
                # Add children in standard order - we'll reverse insertion direction
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            result.append(list(level))
            left_to_right = not left_to_right
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
#include <deque>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
        if (!root) return {};
        vector<vector<int>> result;
        queue<TreeNode*> q;
        q.push(root);
        bool leftToRight = true;
        while (!q.empty()) {
            int levelSize = q.size();
            deque<int> level;
            for (int i = 0; i < levelSize; i++) {
                TreeNode* node = q.front();
                q.pop();
                if (leftToRight) {
                    level.push_back(node->val);
                } else {
                    level.push_front(node->val);
                }
                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
            }
            result.push_back(vector<int>(level.begin(), level.end()));
            leftToRight = !leftToRight;
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
    public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
        if (root == null) return new ArrayList<>();
        List<List<Integer>> result = new ArrayList<>();
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        boolean leftToRight = true;
        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            LinkedList<Integer> level = new LinkedList<>();
            for (int i = 0; i < levelSize; i++) {
                TreeNode node = queue.poll();
                if (leftToRight) {
                    level.addLast(node.val);
                } else {
                    level.addFirst(node.val);
                }
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
            result.add(new ArrayList<>(level));
            leftToRight = !leftToRight;
        }
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var zigzagLevelOrder = function(root) {
    if (!root) return [];
    const result = [];
    const queue = [root];
    let leftToRight = true;
    while (queue.length > 0) {
        const levelSize = queue.length;
        const level = [];
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            if (leftToRight) {
                level.push(node.val);
            } else {
                level.unshift(node.val);
            }
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        result.push(level);
        leftToRight = !leftToRight;
    }
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - visit each node once |
| **Space** | O(w) - for queue and deque |

---

## Comparison of Approaches

| Aspect | BFS with Reversal | Deque-Based |
|--------|------------------|-------------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(w) | O(w) |
| **Implementation** | Simple | Moderate |
| **LeetCode Optimal** | ✅ | ✅ |
| **Difficulty** | Easy | Easy |

**Best Approach:** Approach 1 is simpler and more commonly used.

---

## Common Pitfalls

### 1. Incorrect level size calculation
**Issue:** Using `len(queue)` directly inside the loop causes incorrect level sizes as queue changes.

**Solution:** Store `level_size = len(queue)` before the inner loop.

### 2. Forgetting to toggle the direction flag
**Issue:** All levels processed in same direction, resulting in incorrect output.

**Solution:** Always toggle `left_to_right = not left_to_right` after processing each level.

### 3. Not handling empty tree
**Issue:** Code may fail or return incorrect result for empty input.

**Solution:** Check for `not root` at the start and return empty list.

### 4. Inefficient reversal at each level
**Issue:** Creating new reversed list may be inefficient for large levels.

**Solution:** Consider using `deque` with `appendleft()` for right-to-left levels.

### 5. Not processing children before checking direction
**Issue:** Direction flag should only affect result ordering, not BFS order of children.

**Solution:** Always add children to queue in left-to-right order, reverse result afterward.

---

## Time Complexity
**O(n)**, where n is the number of nodes in the tree, since we visit each node exactly once.

---

## Space Complexity
**O(w)**, where w is the maximum width of the tree, which is the size of the queue in the worst case.

---

## Related Problems

Based on similar tree traversal themes:

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Binary Tree Level Order Traversal | [Link](https://leetcode.com/problems/binary-tree-level-order-traversal/) | Standard level order |
| Binary Tree Right Side View | [Link](https://leetcode.com/problems/binary-tree-right-side-view/) | Rightmost per level |
| Average of Levels in Binary Tree | [Link](https://leetcode.com/problems/average-of-levels-in-binary-tree/) | Calculate average per level |
| Binary Tree Level Order Traversal II | [Link](https://leetcode.com/problems/binary-tree-level-order-traversal-ii/) | Bottom-up level order |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[Zigzag Level Order - LeetCode 103](https://www.youtube.com/watch?v=3QqE2vqjs_s)** - NeetCode explanation
2. **[Binary Tree Zigzag Traversal](https://www.youtube.com/watch?v=3A12MJEeUiI)** - Back to Back SWE
3. **[Zigzag BFS Explained](https://www.youtube.com/watch?v=j38pKh2D6S8)** - Nick White

### Related Concepts

- **[BFS Level Order Traversal](https://www.youtube.com/watch?v=UeCKH7BbkQQ)** - Understanding BFS
- **[Deque Data Structure](https://www.youtube.com/watch?v=j368P8721Q4)** - Double-ended queue

---

## Summary

The **Binary Tree Zigzag Level Order Traversal** problem demonstrates **BFS with direction toggle**:

- **BFS level processing**: Process all nodes at current depth
- **Direction toggle**: Alternate between left-to-right and right-to-left
- **Two implementations**: Reverse after collection OR deque-based insertion
- **Time complexity**: O(n)
- **Space complexity**: O(w)

Key insights:
1. Use boolean flag to toggle direction at each level
2. For odd levels (1, 3, 5...), reverse the order
3. BFS ensures level-by-level processing
4. Both approaches achieve same time complexity

---

## Follow-up Questions

### Q1: How would you modify for a zigzag at deeper levels only?

**Answer:** Add a parameter for start level and only toggle after reaching that level.

### Q2: Can you use DFS instead of BFS?

**Answer:** Yes, use DFS with level parameter. Process right subtree first for odd levels.

### Q3: How would you handle very wide trees?

**Answer:** Consider using iterative approach with explicit stack to control memory.

### Q4: What if you need alternating zigzag (left-right-left) pattern?

**Answer:** The current solution already handles this - it's the standard zigzag pattern.
