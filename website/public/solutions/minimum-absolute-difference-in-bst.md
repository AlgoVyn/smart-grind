# Minimum Absolute Difference in BST

## LeetCode Link

[LeetCode 783 - Minimum Distance Between BST Nodes](https://leetcode.com/problems/minimum-distance-between-bst-nodes/)

> **Note:** This question is the same as LeetCode 783: Minimum Distance Between BST Nodes.

---

## Problem Description

Given the root of a Binary Search Tree (BST), return the **minimum absolute difference** between the values of any two different nodes in the tree.

---

## Examples

### Example 1

**Input:**
```
root = [4,2,6,1,3]
```

**Output:**
```
1
```

**Explanation:**
- The BST structure:
```
      4
     / \
    2   6
   / \ /
  1  3
```
- In-order traversal: [1, 2, 3, 4, 6]
- Differences between consecutive nodes:
  - |2 - 1| = 1
  - |3 - 2| = 1
  - |4 - 3| = 1
  - |6 - 4| = 2
- Minimum difference is 1

### Example 2

**Input:**
```
root = [1,0,48,null,null,12,49]
```

**Output:**
```
1
```

**Explanation:**
- The BST structure:
```
      1
     / \
    0   48
       /  \
      12   49
```
- In-order traversal: [0, 1, 12, 48, 49]
- Differences between consecutive nodes:
  - |1 - 0| = 1
  - |12 - 1| = 11
  - |48 - 12| = 36
  - |49 - 48| = 1
- Minimum difference is 1

---

## Constraints

- The number of nodes in the tree is in the range `[2, 10^4]`
- `0 <= Node.val <= 10^5`

---

## Pattern: In-Order Traversal

This problem uses **In-Order Traversal** of a BST, which visits nodes in sorted order. The key insight is that the minimum absolute difference must occur between **consecutive nodes** in this sorted order, so we only need to track the previous node value during traversal.

---

## Intuition

The key insight for solving this problem efficiently comes from understanding the properties of a Binary Search Tree:

### Key Observations

1. **BST Property**: A BST's in-order traversal produces nodes in **sorted (ascending) order**.

2. **Consecutive Nodes**: The minimum absolute difference between any two nodes in a BST must occur between **two consecutive nodes** in the sorted order. This is because:
   - If we have three nodes a ≤ b ≤ c in sorted order
   - |c - a| = |c - b| + |b - a| ≥ |c - b| and ≥ |b - a|
   - So the minimum difference is always between consecutive nodes

3. **Track Previous Value**: During in-order traversal, we only need to track the previous node's value to compute the minimum difference efficiently.

### Algorithm Overview

1. **Perform in-order traversal** of the BST (left → root → right)
2. **Track the previous node value** as we visit each node
3. **Compute the difference** between current node value and previous node value
4. **Update the minimum** if the current difference is smaller
5. **Return the minimum difference** after traversing all nodes

This approach avoids comparing all pairs of nodes (which would be O(n²)) and achieves O(n) time complexity.

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Recursive In-Order Traversal** - Most intuitive solution
2. **Iterative In-Order Traversal** - Uses explicit stack
3. **Morris Traversal** - O(1) space without recursion or stack

---

## Approach 1: Recursive In-Order Traversal (Optimal)

### Algorithm Steps

1. Initialize `min_diff` to infinity and `prev` to None
2. Perform recursive in-order traversal
3. For each node, compute difference with previous value
4. Update minimum difference
5. Return the result

### Why It Works

The recursive in-order traversal visits nodes in sorted order. By tracking the previous node's value, we can compute the difference between consecutive nodes in O(1) time per node, resulting in O(n) total time complexity.

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
    def getMinimumDifference(self, root: Optional[TreeNode]) -> int:
        self.min_diff = float('inf')
        self.prev = None
        
        def inorder(node: Optional[TreeNode]) -> None:
            """Inorder traversal visits nodes in sorted order."""
            if not node:
                return
            
            # Traverse left subtree
            inorder(node.left)
            
            # Process current node
            if self.prev is not None:
                self.min_diff = min(self.min_diff, node.val - self.prev)
            self.prev = node.val
            
            # Traverse right subtree
            inorder(node.right)
        
        inorder(root)
        return self.min_diff
```

<!-- slide -->
```cpp
#include <iostream>
#include <algorithm>
#include <climits>

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
    int minDiff = INT_MAX;
    int prev = -1;
    
    void inorder(TreeNode* node) {
        if (!node) return;
        
        inorder(node->left);
        
        if (prev != -1) {
            minDiff = std::min(minDiff, node->val - prev);
        }
        prev = node->val;
        
        inorder(node->right);
    }
    
public:
    int getMinimumDifference(TreeNode* root) {
        minDiff = INT_MAX;
        prev = -1;
        inorder(root);
        return minDiff;
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
    private int minDiff = Integer.MAX_VALUE;
    private Integer prev = null;
    
    private void inorder(TreeNode node) {
        if (node == null) return;
        
        inorder(node.left);
        
        if (prev != null) {
            minDiff = Math.min(minDiff, node.val - prev);
        }
        prev = node.val;
        
        inorder(node.right);
    }
    
    public int getMinimumDifference(TreeNode root) {
        minDiff = Integer.MAX_VALUE;
        prev = null;
        inorder(root);
        return minDiff;
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
var getMinimumDifference = function(root) {
    let minDiff = Infinity;
    let prev = null;
    
    function inorder(node) {
        if (!node) return;
        
        inorder(node.left);
        
        if (prev !== null) {
            minDiff = Math.min(minDiff, node.val - prev);
        }
        prev = node.val;
        
        inorder(node.right);
    }
    
    inorder(root);
    return minDiff;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) — in-order traversal visits each node once |
| **Space** | O(h) — recursion stack, where h is the tree height (O(log n) for balanced, O(n) for worst case) |

---

## Approach 2: Iterative In-Order Traversal

### Algorithm Steps

1. Use an explicit stack to simulate recursion
2. Traverse to the leftmost node first
3. Process current node, compute difference with previous
4. Move to right subtree
5. Repeat until stack is empty

### Why It Works

The iterative approach achieves the same result as recursive but uses an explicit stack. This avoids recursion overhead and is useful when the tree depth is very large.

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
    def getMinimumDifference(self, root: Optional[TreeNode]) -> int:
        min_diff = float('inf')
        prev = None
        stack = []
        curr = root
        
        while curr or stack:
            # Go to leftmost node
            while curr:
                stack.append(curr)
                curr = curr.left
            
            # Process current node
            curr = stack.pop()
            if prev is not None:
                min_diff = min(min_diff, curr.val - prev)
            prev = curr.val
            
            # Move to right subtree
            curr = curr.right
        
        return min_diff
```

<!-- slide -->
```cpp
#include <iostream>
#include <algorithm>
#include <climits>
#include <stack>

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    int getMinimumDifference(TreeNode* root) {
        int minDiff = INT_MAX;
        int prev = -1;
        std::stack<TreeNode*> stack;
        TreeNode* curr = root;
        
        while (curr || !stack.empty()) {
            // Go to leftmost node
            while (curr) {
                stack.push(curr);
                curr = curr->left;
            }
            
            // Process current node
            curr = stack.top();
            stack.pop();
            
            if (prev != -1) {
                minDiff = std::min(minDiff, curr->val - prev);
            }
            prev = curr->val;
            
            // Move to right subtree
            curr = curr->right;
        }
        
        return minDiff;
    }
};
```

<!-- slide -->
```java
/**
 * Definition for a binary tree node.
 */
class Solution {
    public int getMinimumDifference(TreeNode root) {
        int minDiff = Integer.MAX_VALUE;
        Integer prev = null;
        Stack<TreeNode> stack = new Stack<>();
        TreeNode curr = root;
        
        while (curr != null || !stack.isEmpty()) {
            // Go to leftmost node
            while (curr != null) {
                stack.push(curr);
                curr = curr.left;
            }
            
            // Process current node
            curr = stack.pop();
            if (prev != null) {
                minDiff = Math.min(minDiff, curr.val - prev);
            }
            prev = curr.val;
            
            // Move to right subtree
            curr = curr.right;
        }
        
        return minDiff;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {TreeNode} root
 * @return {number}
 */
var getMinimumDifference = function(root) {
    let minDiff = Infinity;
    let prev = null;
    const stack = [];
    let curr = root;
    
    while (curr || stack.length > 0) {
        // Go to leftmost node
        while (curr) {
            stack.push(curr);
            curr = curr.left;
        }
        
        // Process current node
        curr = stack.pop();
        if (prev !== null) {
            minDiff = Math.min(minDiff, curr.val - prev);
        }
        prev = curr.val;
        
        // Move to right subtree
        curr = curr.right;
    }
    
    return minDiff;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) — visits each node once |
| **Space** | O(h) — stack size equals tree height |

---

## Approach 3: Morris Traversal (O(1) Space)

### Algorithm Steps

1. Use Morris Traversal to traverse the tree without extra space
2. Find the inorder predecessor for each node
3. Create temporary links to traverse back
4. Restore the tree after processing

### Why It Works

Morris Traversal uses temporary links created between nodes and their inorder predecessors to traverse without a stack or recursion. This achieves O(1) extra space complexity.

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
    def getMinimumDifference(self, root: Optional[TreeNode]) -> int:
        min_diff = float('inf')
        prev = None
        curr = root
        
        while curr:
            # If there's no left subtree, process current and go right
            if not curr.left:
                if prev is not None:
                    min_diff = min(min_diff, curr.val - prev)
                prev = curr.val
                curr = curr.right
            else:
                # Find inorder predecessor (rightmost node in left subtree)
                pred = curr.left
                while pred.right and pred.right != curr:
                    pred = pred.right
                
                # Create temporary link to current node
                if not pred.right:
                    pred.right = curr
                    curr = curr.left
                else:
                    # Restore the tree and process current node
                    if prev is not None:
                        min_diff = min(min_diff, curr.val - prev)
                    prev = curr.val
                    pred.right = None
                    curr = curr.right
        
        return min_diff
```

<!-- slide -->
```cpp
#include <iostream>
#include <algorithm>
#include <climits>

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    int getMinimumDifference(TreeNode* root) {
        int minDiff = INT_MAX;
        int prev = -1;
        TreeNode* curr = root;
        
        while (curr) {
            // If there's no left subtree
            if (!curr->left) {
                if (prev != -1) {
                    minDiff = std::min(minDiff, curr->val - prev);
                }
                prev = curr->val;
                curr = curr->right;
            } else {
                // Find inorder predecessor
                TreeNode* pred = curr->left;
                while (pred->right && pred->right != curr) {
                    pred = pred->right;
                }
                
                // Create temporary link
                if (!pred->right) {
                    pred->right = curr;
                    curr = curr->left;
                } else {
                    // Restore and process
                    if (prev != -1) {
                        minDiff = std::min(minDiff, curr->val - prev);
                    }
                    prev = curr->val;
                    pred->right = nullptr;
                    curr = curr->right;
                }
            }
        }
        
        return minDiff;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int getMinimumDifference(TreeNode root) {
        int minDiff = Integer.MAX_VALUE;
        Integer prev = null;
        TreeNode curr = root;
        
        while (curr != null) {
            // If there's no left subtree
            if (curr.left == null) {
                if (prev != null) {
                    minDiff = Math.min(minDiff, curr.val - prev);
                }
                prev = curr.val;
                curr = curr.right;
            } else {
                // Find inorder predecessor
                TreeNode pred = curr.left;
                while (pred.right != null && pred.right != curr) {
                    pred = pred.right;
                }
                
                // Create temporary link
                if (pred.right == null) {
                    pred.right = curr;
                    curr = curr.left;
                } else {
                    // Restore and process
                    if (prev != null) {
                        minDiff = Math.min(minDiff, curr.val - prev);
                    }
                    prev = curr.val;
                    pred.right = null;
                    curr = curr.right;
                }
            }
        }
        
        return minDiff;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {TreeNode} root
 * @return {number}
 */
var getMinimumDifference = function(root) {
    let minDiff = Infinity;
    let prev = null;
    let curr = root;
    
    while (curr) {
        // If there's no left subtree
        if (!curr.left) {
            if (prev !== null) {
                minDiff = Math.min(minDiff, curr.val - prev);
            }
            prev = curr.val;
            curr = curr.right;
        } else {
            // Find inorder predecessor
            let pred = curr.left;
            while (pred.right && pred.right !== curr) {
                pred = pred.right;
            }
            
            // Create temporary link
            if (!pred.right) {
                pred.right = curr;
                curr = curr.left;
            } else {
                // Restore and process
                if (prev !== null) {
                    minDiff = Math.min(minDiff, curr.val - prev);
                }
                prev = curr.val;
                pred.right = null;
                curr = curr.right;
            }
        }
    }
    
    return minDiff;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) — visits each node at most twice |
| **Space** | O(1) — no extra space used (modifies tree temporarily) |

---

## Comparison of Approaches

| Aspect | Recursive | Iterative | Morris Traversal |
|--------|-----------|-----------|------------------|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(h) | O(h) | O(1) |
| **Implementation** | Simple | Moderate | Complex |
| **Tree Modification** | No | No | Temporary |

**Best Approach:** Use Approach 1 (Recursive) for the best balance of simplicity and efficiency. Use Morris Traversal when O(1) space is required.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Google, Facebook, Amazon, Microsoft
- **Difficulty**: Easy
- **Concepts Tested**: BST properties, In-order traversal, Tree traversal patterns

### Learning Outcomes

1. **BST Mastery**: Understand the fundamental property that in-order traversal produces sorted elements
2. **Traversal Patterns**: Learn recursive and iterative tree traversal techniques
3. **Space Optimization**: Understand Morris Traversal for O(1) space solutions

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Binary Tree Inorder Traversal | [Link](https://leetcode.com/problems/binary-tree-inorder-traversal/) | Classic in-order traversal |
| Validate Binary Search Tree | [Link](https://leetcode.com/problems/validate-binary-search-tree/) | Check if tree is a valid BST |
| Kth Smallest Element in a BST | [Link](https://leetcode.com/problems/kth-smallest-element-in-a-bst/) | Find kth smallest in BST |
| Convert BST to Greater Tree | [Link](https://leetcode.com/problems/convert-bst-to-greater-tree/) | BST transformation |

### Pattern Reference

For more detailed explanations of the In-Order Traversal pattern, see:
- **[Tree DFS Recursive - Inorder](/patterns/tree-dfs-recursive-inorder-traversal)**

---

## Video Tutorial Links

1. **[NeetCode - Minimum Absolute Difference in BST](https://www.youtube.com/watch?v=DSa3xvXNNPs)** - Clear explanation with visual examples
2. **[Inorder Traversal Explained](https://www.youtube.com/watch?v=7T7oLfGBKq4)** - Understanding tree traversals
3. **[Morris Traversal Tutorial](https://www.youtube.com/watch?v=wGXB6OHksco)** - O(1) space traversal technique

---

## Follow-up Questions

### Q1: How would you modify the solution to return the pair of nodes with the minimum difference?

**Answer:** Instead of just tracking the minimum difference, also store the two node values (or references) that achieve this minimum. When updating `min_diff`, also update a pair variable with the current and previous node values.

---

### Q2: What if the tree is not a BST? How would you find the minimum absolute difference?

**Answer:** If the tree is not a BST, you cannot rely on the consecutive node property. Options include:
- Collect all node values into an array, sort it, and find minimum difference between consecutive sorted values: O(n log n)
- Use a BST/balanced tree to maintain sorted values during traversal: O(n log n)

---

### Q3: Can you solve this problem without recursion?

**Answer:** Yes, use the iterative approach (Approach 2) with an explicit stack, or use Morris Traversal (Approach 3) for O(1) space complexity.

---

### Q4: How would you handle a very skewed BST (linked list-like tree) efficiently?

**Answer:** The recursive approach would use O(n) space in the worst case (skewed tree). For very deep trees:
- Use iterative approach to avoid stack overflow
- Consider converting to an array first using iterative traversal
- Morris Traversal provides O(1) space regardless of tree shape

---

### Q5: What if we wanted to find all pairs with the minimum difference?

**Answer:** After finding the minimum difference, do another traversal and collect all pairs where the difference equals this minimum value. Store pairs in a list and return them.

---

## Common Pitfalls

### 1. Not Using BST Property
**Issue**: A naive approach would compare all pairs (O(n²)), but BST property allows O(n) solution.

**Solution**: Leverage the fact that in-order traversal produces sorted values, so only consecutive nodes need comparison.

### 2. Forgetting to Track Previous Value
**Issue**: Need to maintain the previous node's value to compute differences.

**Solution**: Use a class variable or closure to track the previous value across recursive calls.

### 3. Initial Value for Min Diff
**Issue**: Using a fixed initial value might cause issues if the actual difference is larger.

**Solution**: Use `float('inf')` (Python), `Integer.MAX_VALUE` (Java), `INT_MAX` (C++), or `Infinity` (JavaScript) to ensure any actual difference is smaller.

### 4. Empty Tree Handling
**Issue**: The problem guarantees at least 2 nodes, but defensive coding is good.

**Solution**: Add a check at the beginning to return 0 or a sentinel value if the tree is empty or has only one node.

---

## Summary

The **Minimum Absolute Difference in BST** problem demonstrates the power of leveraging BST properties:

- **In-Order Traversal**: Produces sorted sequence of node values
- **Consecutive Comparison**: Minimum difference must be between consecutive nodes in sorted order
- **Efficient Solution**: O(n) time using simple recursive traversal

Key takeaways:
1. BST in-order traversal produces sorted values
2. Track previous node value during traversal
3. Minimum difference is always between consecutive nodes
4. Multiple approaches available: recursive, iterative, and Morris traversal

This problem is a foundational exercise for understanding tree traversal patterns and BST properties.

### Pattern Summary

This problem exemplifies the **Tree In-Order Traversal** pattern, characterized by:
- Leveraging BST sorted property
- Simple state tracking (previous value)
- Linear time complexity
- Multiple implementation approaches (recursive, iterative, Morris)

For more details on this pattern and its variations, see the **[Tree DFS In-Order Pattern](/patterns/tree-dfs-recursive-inorder-traversal)**.

---

## Additional Resources

- [LeetCode 783 - Minimum Distance Between BST Nodes](https://leetcode.com/problems/minimum-distance-between-bst-nodes/) - Official problem page
- [Binary Tree Inorder Traversal - GeeksforGeeks](https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-postorder/) - Traversal fundamentals
- [Morris Traversal - Wikipedia](https://en.wikipedia.org/wiki/Morris_traversal) - O(1) space technique
- [Pattern: Tree DFS In-Order](/patterns/tree-dfs-recursive-inorder-traversal) - Comprehensive pattern guide
