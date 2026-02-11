# Same Tree

## Problem Statement

Given the roots of two binary trees `p` and `q`, write a function to check if they are the same or not. Two binary trees are considered the same if they are **structurally identical** and the corresponding nodes have the **same value**.

**Link to problem:** [Same Tree](https://leetcode.com/problems/same-tree/)

**Constraints:**
- The number of nodes in both trees is in the range `[0, 10^4]`
- `-10^4 <= Node.val <= 10^4`

**Note:**
- A tree is considered the same if:
  1. Both trees have the same structure (both null or both non-null)
  2. For every pair of corresponding nodes, the values are identical
- Both trees can be empty (null), in which case they are considered the same
- This problem can be solved using both depth-first search (DFS) and breadth-first search (BFS)
- This is a fundamental tree traversal problem frequently asked in interviews

---

## Examples

### Example 1

**Input:**
```
p = [1,2,3], q = [1,2,3]
```

**Output:**
```
true
```

**Explanation:** Both trees have the same structure (root with left and right children) and all corresponding node values are equal (1, 2, 3).

---

### Example 2

**Input:**
```
p = [1,2], q = [1,null,2]
```

**Output:**
```
false
```

**Explanation:** Tree `p` has root 1 with left child 2. Tree `q` has root 1 with right child 2. The structures are different.

---

### Example 3

**Input:**
```
p = [1,2,1], q = [1,1,2]
```

**Output:**
```
false
```

**Explanation:** Both trees have the same structure (root with left and right children), but the left and right subtrees have different values (2 vs 1 on the left side).

---

### Example 4

**Input:**
```
p = [], q = []
```

**Output:**
```
true
```

**Explanation:** Both trees are empty, so they are considered the same.

---

### Example 5

**Input:**
```
p = [1], q = [2]
```

**Output:**
```
false
```

**Explanation:** Both trees have the same structure (single root node), but the values are different (1 vs 2).

---

### Example 6

**Input:**
```
p = [1,2,3,4,5], q = [1,2,3,4,5]
```

**Output:**
```
true
```

**Explanation:** Both trees are complete binary trees with the same structure and identical values at every position.

---

## Intuition

The Same Tree problem requires comparing two binary trees node by node. The key insight is that we need to perform a **simultaneous traversal** of both trees, comparing corresponding nodes at each step.

### Core Insight

We can use a **parallel traversal** approach where we visit corresponding nodes in both trees at the same time. At each step, we check:
1. Are both nodes null? (continue to next pair)
2. Is exactly one node null? (trees are different)
3. Do the node values differ? (trees are different)

If all corresponding nodes pass these checks, the trees are identical.

### Key Observations

1. **Base Case**: If both nodes are `null`, they match.
2. **Mismatch Detection**: If one node is `null` and the other is not, trees differ.
3. **Value Comparison**: If both nodes exist but values differ, trees differ.
4. **Recursive Structure**: The left subtrees must match AND the right subtrees must match.
5. **Tree Traversal**: Can use DFS (preorder, inorder, postorder) or BFS for parallel traversal.

---

## Multiple Approaches with Code

We'll cover three main approaches:

1. **Depth-First Search (DFS) - Recursive** - Most intuitive and commonly used
2. **Breadth-First Search (BFS) - Iterative** - Level-by-level comparison
3. **Iterative DFS with Stack** - Uses explicit stack for DFS traversal

---

## Approach 1: Depth-First Search (Recursive)

This approach uses recursion to perform a preorder traversal of both trees simultaneously. It's the most straightforward and readable solution.

### Algorithm Steps

1. Create a recursive function `isSameTree(p, q)`:
   - If both `p` and `q` are `null`, return `true`
   - If exactly one of `p` or `q` is `null`, return `false`
   - If `p.val != q.val`, return `false`
   - Recursively check left subtrees
   - Recursively check right subtrees
   - Return the logical AND of all checks

### Code Implementation

````carousel
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
        """
        Check if two binary trees are the same using recursive DFS.
        
        Args:
            p: Root of the first binary tree
            q: Root of the second binary tree
            
        Returns:
            True if both trees are structurally identical with same node values
        """
        # Base case: both nodes are null
        if not p and not q:
            return True
        
        # One node is null, the other is not
        if not p or not q:
            return False
        
        # Current node values differ
        if p.val != q.val:
            return False
        
        # Recursively check left and right subtrees
        return (self.isSameTree(p.left, q.left) and 
                self.isSameTree(p.right, q.right))
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
    bool isSameTree(TreeNode* p, TreeNode* q) {
        /**
         * Check if two binary trees are the same using recursive DFS.
         * 
         * Args:
         *     p: Root of the first binary tree
         *     q: Root of the second binary tree
         * 
         * Returns:
         *     True if both trees are structurally identical with same node values
         */
        // Base case: both nodes are null
        if (!p && !q) {
            return true;
        }
        
        // One node is null, the other is not
        if (!p || !q) {
            return false;
        }
        
        // Current node values differ
        if (p->val != q->val) {
            return false;
        }
        
        // Recursively check left and right subtrees
        return (isSameTree(p->left, q->left) && 
                isSameTree(p->right, q->right));
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
    public boolean isSameTree(TreeNode p, TreeNode q) {
        /**
         * Check if two binary trees are the same using recursive DFS.
         * 
         * Args:
         *     p: Root of the first binary tree
         *     q: Root of the second binary tree
         * 
         * Returns:
         *     True if both trees are structurally identical with same node values
         */
        // Base case: both nodes are null
        if (p == null && q == null) {
            return true;
        }
        
        // One node is null, the other is not
        if (p == null || q == null) {
            return false;
        }
        
        // Current node values differ
        if (p.val != q.val) {
            return false;
        }
        
        // Recursively check left and right subtrees
        return (isSameTree(p.left, q.left) && 
                isSameTree(p.right, q.right));
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
 * Check if two binary trees are the same using recursive DFS.
 * 
 * @param {TreeNode} p - Root of the first binary tree
 * @param {TreeNode} q - Root of the second binary tree
 * @return {boolean} - True if both trees are structurally identical with same node values
 */
var isSameTree = function(p, q) {
    // Base case: both nodes are null
    if (!p && !q) {
        return true;
    }
    
    // One node is null, the other is not
    if (!p || !q) {
        return false;
    }
    
    // Current node values differ
    if (p.val !== q.val) {
        return false;
    }
    
    // Recursively check left and right subtrees
    return (isSameTree(p.left, q.left) && 
            isSameTree(p.right, q.right));
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each node is visited exactly once, where n is the number of nodes in the smaller tree |
| **Space** | O(h) - Recursion stack depth equals the height of the tree (h), where h can be O(n) in worst case (skewed tree) |

---

## Approach 2: Breadth-First Search (Iterative)

This approach uses a queue to perform level-by-level (BFS) comparison of the two trees. Nodes are compared in the same order they appear in each tree.

### Algorithm Steps

1. Create a queue and enqueue both root nodes
2. While the queue is not empty:
   - Dequeue a pair of nodes (p, q)
   - If both are null, continue
   - If exactly one is null or values differ, return false
   - Enqueue left children of both nodes
   - Enqueue right children of both nodes
3. If queue is empty, return true

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
    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
        """
        Check if two binary trees are the same using iterative BFS.
        
        Args:
            p: Root of the first binary tree
            q: Root of the second binary tree
            
        Returns:
            True if both trees are structurally identical with same node values
        """
        # Create a queue for BFS
        queue = deque([(p, q)])
        
        while queue:
            node1, node2 = queue.popleft()
            
            # Both nodes are null, continue
            if not node1 and not node2:
                continue
            
            # One node is null or values differ
            if not node1 or not node2 or node1.val != node2.val:
                return False
            
            # Enqueue left children
            queue.append((node1.left, node2.left))
            
            # Enqueue right children
            queue.append((node1.right, node2.right))
        
        return True
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
    bool isSameTree(TreeNode* p, TreeNode* q) {
        /**
         * Check if two binary trees are the same using iterative BFS.
         * 
         * Args:
         *     p: Root of the first binary tree
         *     q: Root of the second binary tree
         * 
         * Returns:
         *     True if both trees are structurally identical with same node values
         */
        queue<pair<TreeNode*, TreeNode*>> queue;
        queue.push({p, q});
        
        while (!queue.empty()) {
            auto [node1, node2] = queue.front();
            queue.pop();
            
            // Both nodes are null, continue
            if (!node1 && !node2) {
                continue;
            }
            
            // One node is null or values differ
            if (!node1 || !node2 || node1->val != node2->val) {
                return false;
            }
            
            // Enqueue left children
            queue.push({node1->left, node2->left});
            
            // Enqueue right children
            queue.push({node1->right, node2->right});
        }
        
        return true;
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
    public boolean isSameTree(TreeNode p, TreeNode q) {
        /**
         * Check if two binary trees are the same using iterative BFS.
         * 
         * Args:
         *     p: Root of the first binary tree
         *     q: Root of the second binary tree
         * 
         * Returns:
         *     True if both trees are structurally identical with same node values
         */
        Queue<TreeNode[]> queue = new LinkedList<>();
        queue.offer(new TreeNode[]{p, q});
        
        while (!queue.isEmpty()) {
            TreeNode[] nodes = queue.poll();
            TreeNode node1 = nodes[0];
            TreeNode node2 = nodes[1];
            
            // Both nodes are null, continue
            if (node1 == null && node2 == null) {
                continue;
            }
            
            // One node is null or values differ
            if (node1 == null || node2 == null || node1.val != node2.val) {
                return false;
            }
            
            // Enqueue left children
            queue.offer(new TreeNode[]{node1.left, node2.left});
            
            // Enqueue right children
            queue.offer(new TreeNode[]{node1.right, node2.right});
        }
        
        return true;
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
 * Check if two binary trees are the same using iterative BFS.
 * 
 * @param {TreeNode} p - Root of the first binary tree
 * @param {TreeNode} q - Root of the second binary tree
 * @return {boolean} - True if both trees are structurally identical with same node values
 */
var isSameTree = function(p, q) {
    const queue = [];
    queue.push([p, q]);
    
    while (queue.length > 0) {
        const [node1, node2] = queue.shift();
        
        // Both nodes are null, continue
        if (!node1 && !node2) {
            continue;
        }
        
        // One node is null or values differ
        if (!node1 || !node2 || node1.val !== node2.val) {
            return false;
        }
        
        // Enqueue left children
        queue.push([node1.left, node2.left]);
        
        // Enqueue right children
        queue.push([node1.right, node2.right]);
    }
    
    return true;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each node is visited exactly once |
| **Space** | O(w) - Queue stores at most one level of nodes, where w is the maximum width of the tree |

---

## Approach 3: Iterative DFS with Stack

This approach uses an explicit stack to perform DFS traversal iteratively. It avoids recursion overhead and is useful for very deep trees.

### Algorithm Steps

1. Create a stack and push the root pair (p, q)
2. While the stack is not empty:
   - Pop a pair of nodes (p, q)
   - If both are null, continue
   - If exactly one is null or values differ, return false
   - Push right children pairs
   - Push left children pairs
3. If stack is empty, return true

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
    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
        """
        Check if two binary trees are the same using iterative DFS with stack.
        
        Args:
            p: Root of the first binary tree
            q: Root of the second binary tree
            
        Returns:
            True if both trees are structurally identical with same node values
        """
        # Use a stack for DFS
        stack = [(p, q)]
        
        while stack:
            node1, node2 = stack.pop()
            
            # Both nodes are null, continue
            if not node1 and not node2:
                continue
            
            # One node is null or values differ
            if not node1 or not node2 or node1.val != node2.val:
                return False
            
            # Push right children first (LIFO order for correct left-first traversal)
            stack.append((node1.right, node2.right))
            
            # Push left children
            stack.append((node1.left, node2.left))
        
        return True
```

<!-- slide -->
```cpp
#include <stack>
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
    bool isSameTree(TreeNode* p, TreeNode* q) {
        /**
         * Check if two binary trees are the same using iterative DFS with stack.
         * 
         * Args:
         *     p: Root of the first binary tree
         *     q: Root of the second binary tree
         * 
         * Returns:
         *     True if both trees are structurally identical with same node values
         */
        stack<pair<TreeNode*, TreeNode*>> st;
        st.push({p, q});
        
        while (!st.empty()) {
            auto [node1, node2] = st.top();
            st.pop();
            
            // Both nodes are null, continue
            if (!node1 && !node2) {
                continue;
            }
            
            // One node is null or values differ
            if (!node1 || !node2 || node1->val != node2->val) {
                return false;
            }
            
            // Push right children first (LIFO order for correct left-first traversal)
            st.push({node1->right, node2->right});
            
            // Push left children
            st.push({node1->left, node2->left});
        }
        
        return true;
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
    public boolean isSameTree(TreeNode p, TreeNode q) {
        /**
         * Check if two binary trees are the same using iterative DFS with stack.
         * 
         * Args:
         *     p: Root of the first binary tree
         *     q: Root of the second binary tree
         * 
         * Returns:
         *     True if both trees are structurally identical with same node values
         */
        Stack<TreeNode[]> stack = new Stack<>();
        stack.push(new TreeNode[]{p, q});
        
        while (!stack.isEmpty()) {
            TreeNode[] nodes = stack.pop();
            TreeNode node1 = nodes[0];
            TreeNode node2 = nodes[1];
            
            // Both nodes are null, continue
            if (node1 == null && node2 == null) {
                continue;
            }
            
            // One node is null or values differ
            if (node1 == null || node2 == null || node1.val != node2.val) {
                return false;
            }
            
            // Push right children first (LIFO order for correct left-first traversal)
            stack.push(new TreeNode[]{node1.right, node2.right});
            
            // Push left children
            stack.push(new TreeNode[]{node1.left, node2.left});
        }
        
        return true;
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
 * Check if two binary trees are the same using iterative DFS with stack.
 * 
 * @param {TreeNode} p - Root of the first binary tree
 * @param {TreeNode} q - Root of the second binary tree
 * @return {boolean} - True if both trees are structurally identical with same node values
 */
var isSameTree = function(p, q) {
    const stack = [];
    stack.push([p, q]);
    
    while (stack.length > 0) {
        const [node1, node2] = stack.pop();
        
        // Both nodes are null, continue
        if (!node1 && !node2) {
            continue;
        }
        
        // One node is null or values differ
        if (!node1 || !node2 || node1.val !== node2.val) {
            return false;
        }
        
        // Push right children first (LIFO order for correct left-first traversal)
        stack.push([node1.right, node2.right]);
        
        // Push left children
        stack.push([node1.left, node2.left]);
    }
    
    return true;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each node is visited exactly once |
| **Space** | O(h) - Stack stores at most the height of the tree (h), where h can be O(n) in worst case |

---

## Comparison of Approaches

| Aspect | Recursive DFS | Iterative BFS | Iterative DFS (Stack) |
|--------|---------------|---------------|----------------------|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(h) | O(w) | O(h) |
| **Implementation** | Simple, elegant | Moderate | Moderate |
| **Code Readability** | High | Medium | Medium |
| **Stack Overflow Risk** | Yes (for deep trees) | No | Yes (for deep trees) |
| **Memory Usage** | Depends on recursion depth | Depends on tree width | Depends on tree height |
| **Best For** | Balanced trees, interviews | Wide trees, level-order comparison | Deep trees (non-recursive) |

**Where:**
- n = number of nodes
- h = height of tree (can be O(n) for skewed tree)
- w = maximum width of tree (can be O(n) for complete tree)

---

## Why These Approaches Work

### Recursive DFS
The recursive approach naturally mirrors the tree structure. Each recursive call handles a pair of corresponding nodes and their subtrees. The logical AND (`&&`) ensures that all node pairs match before returning true.

### Iterative BFS
BFS processes nodes level by level, comparing corresponding nodes at each level. The queue ensures nodes are processed in the same relative order in both trees.

### Iterative DFS with Stack
The explicit stack mimics the recursive call stack but allows iterative execution. This avoids potential stack overflow for very deep trees while maintaining DFS order.

All three approaches fundamentally perform a **simultaneous traversal** of both trees, comparing corresponding nodes at each step. They differ only in the order of traversal (preorder for DFS, level-order for BFS) and the data structure used (call stack vs explicit stack vs queue).

---

## Related Problems

Based on similar themes (tree traversal, tree comparison):

- **[Symmetric Tree](https://leetcode.com/problems/symmetric-tree/)** - Check if a tree is symmetric around its center
- **[Subtree of Another Tree](https://leetcode.com/problems/subtree-of-another-tree/)** - Check if one tree is a subtree of another
- **[Count Univalue Subtrees](https://leetcode.com/problems/count-univalue-subtrees/)** - Count nodes where all nodes in subtree have the same value
- **[Flip Equivalent Binary Trees](https://leetcode.com/problems/flip-equivalent-binary-trees/)** - Check if trees can be made identical by flipping children
- **[Merge Two Binary Trees](https://leetcode.com/problems/merge-two-binary-trees/)** - Merge two trees by summing overlapping nodes
- **[Same Binary Tree (LeetCode 100)](https://leetcode.com/problems/same-tree/)** - This problem!

---

## Pattern Documentation

For a comprehensive guide on the **Tree Traversal** pattern, including detailed explanations, multiple approaches, and templates in Python, C++, Java, and JavaScript, see:

- **[Tree DFS - Recursive Preorder Traversal](../patterns/tree-dfs-recursive-preorder-traversal.md)** - Complete DFS pattern documentation
- **[Tree Traversal Fundamentals](../patterns/tree-traversal-patterns.md)** - Overview of all tree traversal techniques

---

## Video Tutorial Links

Here are some helpful YouTube tutorials explaining the problem and solutions:

- [Same Tree - LeetCode 100 - Complete Explanation](https://www.youtube.com/watch?v=vRbb8K_E96Q) - Comprehensive explanation with multiple approaches
- [Binary Tree Traversal - LeetCode Solutions](https://www.youtube.com/watch?v=1M9r9M9v6XQ) - Tree traversal fundamentals
- [Recursion vs Iteration - Tree Problems](https://www.youtube.com/watch?v=0B-eDDg5FRM) - Comparing recursive and iterative solutions
- [BFS vs DFS - When to Use Which](https://www.youtube.com/watch?v=7CIXxL0_P3M) - Choosing the right traversal strategy

---

## Followup Questions

### Q1: How would you modify the solution to find the first differing node between two trees?

**Answer:** Modify the traversal to return the first mismatched node pair when found. In the recursive approach, you can return a tuple (isSame, mismatchedNode1, mismatchedNode2) where the mismatched nodes are populated when values differ. Alternatively, use a global variable or pass by reference to track the first mismatch.

---

### Q2: What if the trees are very deep and you want to avoid recursion stack overflow?

**Answer:** Use an iterative approach (BFS with queue or DFS with explicit stack) instead of recursion. Both iterative methods have O(h) space complexity but don't use the call stack, eliminating the risk of stack overflow. For extremely deep trees (e.g., linked-list shaped trees), BFS is preferred as it uses O(w) space where w is typically much smaller than h.

---

### Q3: How would you check if two trees are isomorphic (can be transformed into each other by swapping left and right children)?

**Answer:** This is the "Flip Equivalent Binary Trees" problem. Modify the solution to check three conditions at each node:
1. Current nodes have the same value
2. Left matches left AND right matches right, OR
3. Left matches right AND right matches left

The recursive condition becomes: `isSameTree(p.left, q.left) && isSameTree(p.right, q.right) || isSameTree(p.left, q.right) && isSameTree(p.right, q.left)`

---

### Q4: Can you solve this problem using postorder traversal instead of preorder?

**Answer:** Yes, the order of traversal doesn't affect correctness. Postorder (left-right-root) or inorder (left-root-right) also work because we check corresponding nodes at each step. Preorder is most common because it checks the root first, allowing early termination on mismatch. Postorder would require traversing to the leaves before comparing, potentially doing more work.

---

### Q5: How would you test this solution comprehensively?

**Answer:** Test with various cases:
1. Both null: `null, null` → `true`
2. One null, one not: `null, TreeNode(1)` → `false`
3. Single node same: `TreeNode(1), TreeNode(1)` → `true`
4. Single node different: `TreeNode(1), TreeNode(2)` → `false`
5. Identical trees: Multiple nodes with same values and structure
6. Different structure: Same values but different arrangement
7. Different values: Same structure but different node values
8. Large trees: Complete and skewed trees of various sizes
9. Asymmetric trees: Trees with only left or only right children

---

### Q6: How would you modify the solution to return the number of differing nodes instead of just true/false?

**Answer:** Change the return type to an integer and modify the recursive calls to count mismatches. The function would return the sum of mismatches: `(mismatch_left + mismatch_right + current_mismatch)` where `current_mismatch` is 1 if values differ or structure differs, 0 otherwise. For the iterative version, increment a counter instead of returning false.

---

### Q7: What happens if the trees have different numbers of nodes?

**Answer:** The algorithm naturally handles this case. When one tree has more nodes than the other, at some point during traversal, one of the corresponding node pairs will have one null and one non-null node, triggering a false return. The mismatch is detected when trying to compare a non-existent node with an existing node.

---

### Q8: How would you implement this with Morris Traversal to achieve O(1) space?

**Answer:** Morris Traversal modifies the tree temporarily by creating threads. While possible, it's complex and not recommended for this problem. The extra space needed for parent pointers complicates the parallel comparison. Standard recursive or iterative approaches are preferred for clarity and maintainability.

---

### Q9: Can you solve this problem with divide and conquer?

**Answer:** The recursive solution is already a form of divide and conquer. We divide the problem into left and right subtree comparisons, conquer by solving them recursively, and combine results using logical AND. The key insight is that the solution to the whole tree depends on solutions to both subtrees.

---

### Q10: How would you handle trees with very large values (outside int range)?

**Answer:** All four language implementations (Python, C++, Java, JavaScript) handle large integer values correctly. Python has arbitrary precision integers. For C++ and Java, use `long` instead of `int` if values exceed 32-bit range. JavaScript uses Number (double-precision floating point) which can precisely represent integers up to 2^53.

---

### Q11: What's the difference between checking structural equality and value equality?

**Answer:** Value equality means node values match. Structural equality means the tree topology (shape) matches. Our problem requires both: trees must have identical structure AND values at corresponding positions. Some problems might ask for only structural equality (ignoring values) or only value equality (allowing different structures), which would require modified logic.

---

### Q12: How would you parallelize this computation for very large trees?

**Answer:** For parallelization, split the tree comparison into independent subproblems. You could:
1. Compare left subtrees in one thread, right subtrees in another
2. Use a thread pool to process multiple node pairs concurrently
3. For BFS, process entire levels in parallel

However, for typical interview scenarios, the overhead of parallelization usually exceeds the benefits. The simple sequential O(n) solution is preferred.

---

### Q13: What edge cases should you consider beyond the examples?

**Answer:** Edge cases include:
1. Extremely skewed trees (linked-list shaped)
2. Trees with only left children or only right children
3. Trees with one child missing at various positions
4. Very large values (positive and negative)
5. Trees with duplicate values at different positions
6. Empty trees with different structures (though both null is the only valid empty case)
7. Trees that are mirror images of each other (should return false)

---

### Q14: How would you extend this to check if two n-ary trees are the same?

**Answer:** Modify the solution to handle a list of children instead of just left and right. The recursive check would iterate through all children lists simultaneously, verifying:
1. Both nodes have the same number of children
2. Each corresponding child pair is the same

The iterative version would use a queue of (node1, node2) pairs and process all children of each node pair together.

---

## Summary

The Same Tree problem is a classic tree comparison problem that demonstrates fundamental tree traversal concepts. Several approaches exist, each with different trade-offs:

**Key Takeaways:**
- All three approaches (recursive DFS, iterative BFS, iterative DFS) achieve O(n) time complexity
- Space complexity depends on tree height (DFS) or width (BFS)
- Recursive DFS is most readable and commonly used in interviews
- Iterative BFS is useful for wide trees and avoids recursion overhead
- Iterative DFS with stack prevents stack overflow for deep trees
- The core insight is simultaneous traversal comparing corresponding nodes
- This problem is frequently asked in technical interviews at major tech companies
- Understanding this pattern helps solve related tree problems (Symmetric Tree, Subtree, etc.)

This problem is essential knowledge for coding interviews and demonstrates mastery of tree data structures and traversal techniques.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/same-tree/discuss/) - Community solutions and explanations
- [Tree Traversal Patterns](https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/) - Comprehensive tree traversal guide
- [Binary Tree Fundamentals](https://www.geeksforgeeks.org/binary-tree-data-structure/) - Binary tree concepts
- [Recursion in Trees](https://www.cs.cmu.edu/~adamchik/15-121/lectures/Trees/trees.html) - Recursive tree algorithms
- [BFS vs DFS](https://www.geeksforgeeks.org/bfs-vs-dfs-binary-tree/) - Choosing the right traversal strategy
