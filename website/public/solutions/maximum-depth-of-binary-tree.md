# Maximum Depth of Binary Tree

## Problem Description

Given the root of a binary tree, return its maximum depth (or height). The maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.

A leaf node is a node with no children. The depth of a node is the number of edges from the node to the tree's root node. Alternatively, some define depth as the number of nodes from root to the node (inclusive). For this problem, we'll use the standard definition where an empty tree has depth 0.

---

## Constraints

- The number of nodes in the tree is in the range [0, 10^4].
- -100 <= Node.val <= 100

---

## Example 1

**Input:**
```python
root = [3,9,20,null,null,15,7]
```

**Output:**
```python
3
```

**Visual:**
```
    3
   / \
  9  20
    /  \
   15   7
```

**Explanation:**
- Root (3) is at depth 0 (or level 1)
- Left child (9) is at depth 1
- Right child (20) is at depth 1
- Left child of 20 (15) is at depth 2
- Right child of 20 (7) is at depth 2
- Maximum depth = 3

---

## Example 2

**Input:**
```python
root = [1,null,2]
```

**Output:**
```python
2
```

**Visual:**
```
  1
   \
    2
```

**Explanation:**
- Only one path from root to leaf: 1 → 2
- Maximum depth = 2

---

## Example 3

**Input:**
```python
root = []
```

**Output:**
```python
0
```

**Explanation:**
- An empty tree has no nodes, so maximum depth is 0

---

## Example 4

**Input:**
```python
root = [1]
```

**Output:**
```python
1
```

**Explanation:**
- A single node tree has depth 1

---

## Solution

We use three approaches to solve this problem:

1. **Recursive Depth-First Search (DFS)** - Most intuitive and commonly used
2. **Iterative BFS (Level Order Traversal)** - Uses queue to traverse level by level
3. **Iterative DFS using Stack** - Explicit stack for depth tracking

---

## Approach 1: Recursive Depth-First Search

### Algorithm

The recursive approach leverages the mathematical definition of tree depth:

1. **Base Case**: If the root is null (empty tree), return 0
2. **Recursive Case**: For any non-null node, the maximum depth is:
   - 1 (for the current node) + max(max depth of left subtree, max depth of right subtree)
3. **Recursion**: This naturally computes depths from leaves upward (post-order traversal)

The key insight is that the maximum depth of a tree equals:
- 1 (for the root) + max(left subtree depth, right subtree depth)

### Code Implementation

````carousel
```python
from typing import Optional

# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        """
        Calculate the maximum depth of a binary tree using recursion.
        
        Args:
            root: Root node of the binary tree
            
        Returns:
            Maximum depth (number of nodes on longest path from root to leaf)
        """
        # Base case: empty tree has depth 0
        if not root:
            return 0
        
        # Recursive case: depth = 1 + max depth of left and right subtrees
        left_depth = self.maxDepth(root.left)
        right_depth = self.maxDepth(root.right)
        
        return 1 + max(left_depth, right_depth)
```

<!-- slide -->
```cpp
#include <algorithm>
using namespace std;

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
    int maxDepth(TreeNode* root) {
        // Base case: empty tree has depth 0
        if (!root) {
            return 0;
        }
        
        // Recursive case: depth = 1 + max depth of left and right subtrees
        int left_depth = maxDepth(root->left);
        int right_depth = maxDepth(root->right);
        
        return 1 + max(left_depth, right_depth);
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
    public int maxDepth(TreeNode root) {
        // Base case: empty tree has depth 0
        if (root == null) {
            return 0;
        }
        
        // Recursive case: depth = 1 + max depth of left and right subtrees
        int left_depth = maxDepth(root.left);
        int right_depth = maxDepth(root.right);
        
        return 1 + Math.max(left_depth, right_depth);
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
var maxDepth = function(root) {
    // Base case: empty tree has depth 0
    if (!root) {
        return 0;
    }
    
    // Recursive case: depth = 1 + max depth of left and right subtrees
    const left_depth = maxDepth(root.left);
    const right_depth = maxDepth(root.right);
    
    return 1 + Math.max(left_depth, right_depth);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each node is visited exactly once |
| **Space** | O(h) - Recursion stack depth equals tree height (h), where h can be O(n) for skewed trees |

---

## Approach 2: Iterative BFS (Level Order Traversal)

### Algorithm

Breadth-First Search (BFS) processes the tree level by level:

1. If root is null, return 0
2. Initialize a queue with the root node and depth counter = 0
3. While the queue is not empty:
   - Increment depth (we're moving to the next level)
   - Process all nodes at current level (size of queue)
   - For each node, add its non-null children to the queue
4. Return the depth counter

### Code Implementation

````carousel
```python
from collections import deque
from typing import Optional

# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        """
        Calculate the maximum depth using BFS level-order traversal.
        
        Args:
            root: Root node of the binary tree
            
        Returns:
            Maximum depth (number of levels)
        """
        if not root:
            return 0
        
        depth = 0
        queue = deque([root])
        
        while queue:
            depth += 1  # We're processing a new level
            level_size = len(queue)
            
            for _ in range(level_size):
                node = queue.popleft()
                
                # Add children to queue for next level
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
        
        return depth
```

<!-- slide -->
```cpp
#include <queue>
using namespace std;

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
    int maxDepth(TreeNode* root) {
        if (!root) {
            return 0;
        }
        
        int depth = 0;
        queue<TreeNode*> q;
        q.push(root);
        
        while (!q.empty()) {
            depth++;
            int level_size = q.size();
            
            for (int i = 0; i < level_size; i++) {
                TreeNode* node = q.front();
                q.pop();
                
                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
            }
        }
        
        return depth;
    }
};
```

<!-- slide -->
```java
import java.util.LinkedList;
import java.util.Queue;

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
    public int maxDepth(TreeNode root) {
        if (root == null) {
            return 0;
        }
        
        int depth = 0;
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        
        while (!queue.isEmpty()) {
            depth++;
            int level_size = queue.size();
            
            for (int i = 0; i < level_size; i++) {
                TreeNode node = queue.poll();
                
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
        }
        
        return depth;
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
var maxDepth = function(root) {
    if (!root) {
        return 0;
    }
    
    let depth = 0;
    const queue = [root];
    
    while (queue.length > 0) {
        depth++;
        const level_size = queue.length;
        
        for (let i = 0; i < level_size; i++) {
            const node = queue.shift();
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
    }
    
    return depth;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each node is visited exactly once |
| **Space** | O(w) - Queue stores nodes at widest level (w), where w can be O(n) for complete binary trees |

---

## Approach 3: Iterative DFS with Stack

### Algorithm

This approach uses an explicit stack to simulate recursion:

1. If root is null, return 0
2. Initialize stack with pairs of (node, current depth)
3. Initialize max_depth = 0
4. While stack is not empty:
   - Pop (node, depth) from stack
   - Update max_depth = max(max_depth, depth)
   - Push (node.left, depth + 1) if left child exists
   - Push (node.right, depth + 1) if right child exists
5. Return max_depth

### Code Implementation

````carousel
```python
from typing import Optional

# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        """
        Calculate the maximum depth using iterative DFS with stack.
        
        Args:
            root: Root node of the binary tree
            
        Returns:
            Maximum depth (number of nodes on longest path)
        """
        if not root:
            return 0
        
        max_depth = 0
        stack = [(root, 1)]  # Stack stores tuples of (node, depth)
        
        while stack:
            node, depth = stack.pop()
            max_depth = max(max_depth, depth)
            
            if node.left:
                stack.append((node.left, depth + 1))
            if node.right:
                stack.append((node.right, depth + 1))
        
        return max_depth
```

<!-- slide -->
```cpp
#include <stack>
#include <algorithm>
using namespace std;

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
    int maxDepth(TreeNode* root) {
        if (!root) {
            return 0;
        }
        
        int max_depth = 0;
        stack<pair<TreeNode*, int>> st;
        st.push({root, 1});
        
        while (!st.empty()) {
            auto [node, depth] = st.top();
            st.pop();
            
            max_depth = max(max_depth, depth);
            
            if (node->left) {
                st.push({node->left, depth + 1});
            }
            if (node->right) {
                st.push({node->right, depth + 1});
            }
        }
        
        return max_depth;
    }
};
```

<!-- slide -->
```java
import java.util.Stack;

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
    public int maxDepth(TreeNode root) {
        if (root == null) {
            return 0;
        }
        
        int max_depth = 0;
        Stack<Object[]> stack = new Stack<>();
        stack.push(new Object[]{root, 1});
        
        while (!stack.isEmpty()) {
            Object[] pair = stack.pop();
            TreeNode node = (TreeNode) pair[0];
            int depth = (Integer) pair[1];
            
            max_depth = Math.max(max_depth, depth);
            
            if (node.left != null) {
                stack.push(new Object[]{node.left, depth + 1});
            }
            if (node.right != null) {
                stack.push(new Object[]{node.right, depth + 1});
            }
        }
        
        return max_depth;
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
var maxDepth = function(root) {
    if (!root) {
        return 0;
    }
    
    let max_depth = 0;
    const stack = [[root, 1]];
    
    while (stack.length > 0) {
        const [node, depth] = stack.pop();
        max_depth = Math.max(max_depth, depth);
        
        if (node.left) {
            stack.push([node.left, depth + 1]);
        }
        if (node.right) {
            stack.push([node.right, depth + 1]);
        }
    }
    
    return max_depth;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each node is visited exactly once |
| **Space** | O(h) - Stack stores nodes along current path (h), where h can be O(n) for skewed trees |

---

## Comparison of Approaches

| Aspect | Recursive DFS | Iterative BFS | Iterative DFS |
|--------|---------------|---------------|---------------|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(h) | O(w) | O(h) |
| **Implementation** | Simple, elegant | Moderate | Moderate |
| **Code Readability** | High | High | Medium |
| **Stack Overflow Risk** | Yes | No | Yes |
| **Order** | Post-order | Level-order | Pre-order |
| **Best For** | Balanced trees | Wide trees | Deep paths |

**Where:**
- n = number of nodes
- h = height of tree (can be O(n) for skewed tree)
- w = maximum width of tree (can be O(n) for complete tree)

---

## Explanation

### Recursive DFS Approach

The recursive approach is the most elegant solution for this problem. The key insight is mathematical:

- The depth of an empty tree is 0
- The depth of any other tree is 1 + max(depth of left subtree, depth of right subtree)

This is a classic example of **divide and conquer** where we:
1. Divide the problem into smaller subproblems (left and right subtrees)
2. Conquer by solving each subproblem recursively
3. Combine by taking the maximum depth and adding 1 for the current level

The recursion naturally processes nodes from the bottom up (post-order), which is perfect for this problem.

### BFS Level Order Approach

BFS naturally processes the tree level by level, making it intuitive for this problem:

- We increment our depth counter each time we finish processing a level
- We use queue size to determine how many nodes are at the current level
- This approach is also useful if you need to perform operations at each level

### Iterative DFS Approach

This approach simulates recursion using an explicit stack:

- We track both the node and its depth as we traverse
- This can be more memory-efficient than BFS for deep, narrow trees
- It also allows for easy modification if you need to track additional state

---

## Followup Questions

### Q1: How would you modify the recursive solution to return the minimum depth instead of maximum depth?

**Answer:** Change the return statement to use `min()` instead of `max()`, but add a special case for nodes with only one child. For nodes with only one child, you must take the child's depth, not 1 + max(child depths which would be 0 for null). The formula becomes: 1 + max(left_depth, right_depth) for nodes with two children, but 1 + max(left_depth, right_depth) where one is 0 needs special handling to avoid taking the 0 path.

### Q2: How would you check if a tree is balanced (difference between left and right subtree depths ≤ 1 for all nodes)?

**Answer:** You can modify the recursive DFS to return both the depth and a boolean indicating balance. For each node, check if left and right subtrees are balanced. If either is not balanced, return false. Otherwise, return true only if the absolute difference between left and right depths is ≤ 1.

### Q3: How would you find the deepest node in a binary tree?

**Answer:** You can modify any of the approaches to track the deepest node. In BFS, return the last node processed at the deepest level. In DFS, track the node with maximum depth encountered during traversal. The BFS approach naturally gives you the deepest nodes as they are the last ones processed.

### Q4: How would you count the number of nodes at the maximum depth?

**Answer:** First find the maximum depth using any approach, then do a BFS or DFS counting nodes that have depth equal to the maximum depth. Alternatively, during a single traversal, track both the maximum depth and count how many nodes achieve it.

### Q5: What is the difference between tree depth and tree height?

**Answer:** Depth of a node is the number of edges from the root to that node. Height of a node is the number of edges from that node to the deepest leaf. The height of the tree equals the depth of the deepest node. Some definitions use nodes instead of edges, which adds 1 to all values.

---

## Related Problems

- [Minimum Depth of Binary Tree](https://leetcode.com/problems/minimum-depth-of-binary-tree/)
- [Balanced Binary Tree](https://leetcode.com/problems/balanced-binary-tree/)
- [Diameter of Binary Tree](https://leetcode.com/problems/diameter-of-binary-tree/)
- [Same Tree](https://leetcode.com/problems/same-tree/)
- [Symmetric Tree](https://leetcode.com/problems/symmetric-tree/)
- [Count Complete Tree Nodes](https://leetcode.com/problems/count-complete-tree-nodes/)
- [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/)
- [Maximum Depth of N-ary Tree](https://leetcode.com/problems/maximum-depth-of-n-ary-tree/)

---

## Video Tutorials

- [Maximum Depth of Binary Tree - LeetCode 104](https://www.youtube.com/watch?v=OnSn2XEQ4yY)
- [Tree Traversals - Inorder, Preorder, Postorder](https://www.youtube.com/watch?v=gm8DUJJhmY4)
- [BFS vs DFS for Binary Trees](https://www.youtube.com/watch?v=uWLrFijklUw)
- [Binary Tree Algorithms - Common Patterns](https://www.youtube.com/watch?v=7jcn63Mh9E0)
