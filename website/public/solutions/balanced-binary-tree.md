# Balanced Binary Tree

## Problem Description

Given a binary tree, determine if it is height-balanced.

A binary tree is considered height-balanced if:
- The left and right subtrees of every node differ in height by no more than 1

---

## Examples

### Example 1:

**Input:**
```
root = [3,9,20,null,null,15,7]
```

**Output:**
```
true
```

### Example 2:

**Input:**
```
root = [1,2,2,3,3,null,null,4,4]
```

**Output:**
```
false
```

### Example 3:

**Input:**
```
root = []
```

**Output:**
```
true
```

---

## Constraints

- The number of nodes in the tree is in the range `[0, 5000]`.
- `-10^4 <= Node.val <= 10^4`

---

## Pattern:

This problem follows the **Bottom-Up Tree Traversal** pattern with early termination optimization.

### Core Concept

- **Compute heights bottom-up**: Process tree from leaves to root
- **Early termination**: Return sentinel value (-1) when imbalance is found
- **Single pass**: Each node visited exactly once in optimal approach

### When to Use This Pattern

This pattern is applicable when:
1. Checking tree properties that depend on subtrees
2. Tree problems requiring height/depth calculations
3. Problems where we can short-circuit on failure

### Related Patterns

| Pattern | Description |
|---------|-------------|
| Top-Down Recursion | Compute from root to leaves |
| DFS | Depth-first traversal |
| Divide and Conquer | Break into subproblems |

---

## Intuition

The key insight is that we need to check if every node's left and right subtrees have heights that differ by at most 1.

A naive approach would calculate the height of each subtree separately, leading to O(n²) time complexity. However, we can optimize this by:
1. Computing heights from bottom up
2. Returning -1 (or some indicator) as soon as we find an unbalanced subtree

This way, we can detect imbalance early and avoid redundant calculations.

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Top-Down Recursion** - O(n²) time, O(h) space
2. **Bottom-Up Recursion (Optimal)** - O(n) time, O(h) space
3. **Iterative with DFS** - O(n) time, O(n) space

---

## Approach 1: Top-Down Recursion

This is a straightforward but less efficient approach.

### Why It Works

For each node, we compute the height of its left and right subtrees, then check if they're balanced. We do this recursively for all nodes.

### Algorithm Steps

1. Create a helper function to compute height of a subtree
2. For each node, check if:
   - Left subtree is balanced
   - Right subtree is balanced
   - Height difference is at most 1
3. Return the height of current node's subtree

### Code Implementation

````carousel
```python
# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def isBalanced(self, root: TreeNode) -> bool:
        """
        Check if binary tree is balanced.
        
        Args:
            root: Root of the binary tree
            
        Returns:
            True if balanced, False otherwise
        """
        def height(node: TreeNode) -> int:
            if not node:
                return 0
            return 1 + max(height(node.left), height(node.right))
        
        if not root:
            return True
        
        # Check if current node is balanced
        left_height = height(root.left)
        right_height = height(root.right)
        
        if abs(left_height - right_height) > 1:
            return False
        
        # Recursively check subtrees
        return self.isBalanced(root.left) and self.isBalanced(root.right)
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
    int height(TreeNode* node) {
        if (!node) return 0;
        return 1 + max(height(node->left), height(node->right));
    }
    
    bool isBalanced(TreeNode* root) {
        if (!root) return true;
        
        int leftHeight = height(root->left);
        int rightHeight = height(root->right);
        
        if (abs(leftHeight - rightHeight) > 1) return false;
        
        return isBalanced(root->left) && isBalanced(root->right);
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
    private int height(TreeNode node) {
        if (node == null) return 0;
        return 1 + Math.max(height(node.left), height(node.right));
    }
    
    public boolean isBalanced(TreeNode root) {
        if (root == null) return true;
        
        int leftHeight = height(root.left);
        int rightHeight = height(root.right);
        
        if (Math.abs(leftHeight - rightHeight) > 1) return false;
        
        return isBalanced(root.left) && isBalanced(root.right);
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
 * @return {boolean}
 */
var isBalanced = function(root) {
    const height = (node) => {
        if (!node) return 0;
        return 1 + Math.max(height(node.left), height(node.right));
    };
    
    if (!root) return true;
    
    const leftHeight = height(root.left);
    const rightHeight = height(root.right);
    
    if (Math.abs(leftHeight - rightHeight) > 1) return false;
    
    return isBalanced(root.left) && isBalanced(root.right);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - For each node, we compute heights of all descendants |
| **Space** | O(h) - Recursion stack, h = tree height |

---

## Approach 2: Bottom-Up Recursion (Optimal)

This is the most efficient approach that avoids redundant calculations.

### Why It Works

Instead of computing heights from scratch for each node, we compute them bottom-up. If a subtree is unbalanced, we immediately return -1 to indicate imbalance.

### Algorithm Steps

1. Create a helper that returns height if balanced, -1 if unbalanced
2. For each node:
   - Get height of left subtree (-1 if unbalanced)
   - Get height of right subtree (-1 if unbalanced)
   - If either is -1 or height difference > 1, return -1
   - Otherwise return height (max of left/right + 1)
3. Check if root height is not -1

### Code Implementation

````carousel
```python
# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def isBalanced(self, root: TreeNode) -> bool:
        """
        Check if binary tree is balanced using optimized approach.
        
        Args:
            root: Root of the binary tree
            
        Returns:
            True if balanced, False otherwise
        """
        def check(node: TreeNode) -> int:
            # Base case: empty tree is balanced
            if not node:
                return 0
            
            # Check left subtree
            left_height = check(node.left)
            if left_height == -1:
                return -1
            
            # Check right subtree
            right_height = check(node.right)
            if right_height == -1:
                return -1
            
            # Check current node
            if abs(left_height - right_height) > 1:
                return -1
            
            # Return height of current node
            return max(left_height, right_height) + 1
        
        return check(root) != -1
```

<!-- slide -->
```cpp
class Solution {
public:
    int check(TreeNode* node) {
        if (!node) return 0;
        
        int left = check(node->left);
        if (left == -1) return -1;
        
        int right = check(node->right);
        if (right == -1) return -1;
        
        if (abs(left - right) > 1) return -1;
        
        return max(left, right) + 1;
    }
    
    bool isBalanced(TreeNode* root) {
        return check(root) != -1;
    }
};
```

<!-- slide -->
```java
class Solution {
    private int check(TreeNode node) {
        if (node == null) return 0;
        
        int left = check(node.left);
        if (left == -1) return -1;
        
        int right = check(node.right);
        if (right == -1) return -1;
        
        if (Math.abs(left - right) > 1) return -1;
        
        return Math.max(left, right) + 1;
    }
    
    public boolean isBalanced(TreeNode root) {
        return check(root) != -1;
    }
}
```

<!-- slide -->
```javascript
var isBalanced = function(root) {
    const check = (node) => {
        if (!node) return 0;
        
        const left = check(node.left);
        if (left === -1) return -1;
        
        const right = check(node.right);
        if (right === -1) return -1;
        
        if (Math.abs(left - right) > 1) return -1;
        
        return Math.max(left, right) + 1;
    };
    
    return check(root) !== -1;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each node visited once |
| **Space** | O(h) - Recursion stack |

---

## Approach 3: Iterative with DFS

This approach uses iteration instead of recursion.

### Why It Works

We use a stack to perform DFS and compute heights in a bottom-up manner.

### Code Implementation

````carousel
```python
# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def isBalanced_iterative(self, root: TreeNode) -> bool:
        """
        Check if binary tree is balanced using iterative DFS.
        
        Args:
            root: Root of the binary tree
            
        Returns:
            True if balanced, False otherwise
        """
        if not root:
            return True
        
        stack = [(root, 0)]
        
        while stack:
            node, processed = stack.pop()
            
            if not node:
                continue
            
            if not processed:
                # Post-order: push node again with flag, then children
                stack.append((node, 1))
                stack.append((node.left, 0))
                stack.append((node.right, 0))
            else:
                # Process node - compute heights
                left = getattr(node.left, 'height', 0) if node.left else 0
                right = getattr(node.right, 'height', 0) if node.right else 0
                
                if abs(left - right) > 1:
                    return False
                
                node.height = max(left, right) + 1
        
        return True
```

<!-- slide -->
```cpp
class Solution {
public:
    bool isBalanced(TreeNode* root) {
        if (!root) return true;
        
        stack<pair<TreeNode*, bool>> st;
        st.push({root, false});
        
        unordered_map<TreeNode*, int> height;
        
        while (!st.empty()) {
            auto [node, processed] = st.top();
            st.pop();
            
            if (!node) continue;
            
            if (!processed) {
                st.push({node, true});
                st.push({node->right, false});
                st.push({node->left, false});
            } else {
                int left = height.count(node->left) ? height[node->left] : 0;
                int right = height.count(node->right) ? height[node->right] : 0;
                
                if (abs(left - right) > 1) return false;
                
                height[node] = max(left, right) + 1;
            }
        }
        
        return true;
    }
};
```

<!-- slide -->
```java
class Solution {
    public boolean isBalanced(TreeNode root) {
        if (root == null) return true;
        
        Stack<Object[]> stack = new Stack<>();
        Map<TreeNode, Integer> height = new HashMap<>();
        
        stack.push(new Object[]{root, false});
        
        while (!stack.isEmpty()) {
            Object[] item = stack.pop();
            TreeNode node = (TreeNode) item[0];
            boolean processed = (boolean) item[1];
            
            if (node == null) continue;
            
            if (!processed) {
                stack.push(new Object[]{node, true});
                stack.push(new Object[]{node.right, false});
                stack.push(new Object[]{node.left, false});
            } else {
                int left = height.getOrDefault(node.left, 0);
                int right = height.getOrDefault(node.right, 0);
                
                if (Math.abs(left - right) > 1) return false;
                
                height.put(node, Math.max(left, right) + 1);
            }
        }
        
        return true;
    }
}
```

<!-- slide -->
```javascript
var isBalanced = function(root) {
    if (!root) return true;
    
    const stack = [[root, false]];
    const height = new Map();
    
    while (stack.length) {
        const [node, processed] = stack.pop();
        
        if (!node) continue;
        
        if (!processed) {
            stack.push([node, true]);
            stack.push([node.right, false]);
            stack.push([node.left, false]);
        } else {
            const left = height.get(node.left) || 0;
            const right = height.get(node.right) || 0;
            
            if (Math.abs(left - right) > 1) return false;
            
            height.set(node, Math.max(left, right) + 1);
        }
    }
    
    return true;
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

| Aspect | Top-Down | Bottom-Up | Iterative |
|--------|----------|-----------|-----------|
| **Time Complexity** | O(n²) | O(n) | O(n) |
| **Space Complexity** | O(h) | O(h) | O(n) |
| **Implementation** | Simple | Moderate | Complex |
| **LeetCode Optimal** | ❌ No | ✅ Yes | ✅ Yes |
| **Best For** | Understanding | Interview favorite | Avoiding recursion |

**Best Approach:** The bottom-up approach (Approach 2) is optimal and most commonly used.

---

## Why Bottom-Up is Optimal

1. **Efficiency**: Each node visited exactly once - O(n) time
2. **Early Termination**: Returns -1 immediately when imbalance found
3. **Space**: Only O(h) recursion stack
4. **Interview Favorite**: Demonstrates optimization skills

---

## Related Problems

Based on similar themes (binary tree, recursion):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Maximum Depth of Binary Tree | [Link](https://leetcode.com/problems/maximum-depth-of-binary-tree/) | Tree height computation |
| Minimum Depth of Binary Tree | [Link](https://leetcode.com/problems/minimum-depth-of-binary-tree/) | Tree depth computation |
| Same Tree | [Link](https://leetcode.com/problems/same-tree/) | Tree comparison |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Binary Tree Maximum Path Sum | [Link](https://leetcode.com/problems/binary-tree-maximum-path-sum/) | Tree path problems |
| Longest Univalue Path | [Link](https://leetcode.com/problems/longest-univalue-path/) | Tree path with values |

---

## Video Tutorial Links

### Bottom-Up Approach

- [NeetCode - Balanced Binary Tree](https://www.youtube.com/watch?v=QfJs20MfP5U) - Clear explanation
- [Optimal Solution](https://www.youtube.com/watch?v=7H7M6W1Xc5E) - Step-by-step

### Understanding Trees

- [Binary Tree Introduction](https://www.youtube.com/watch?v=H5Jbj-75MLQ) - Tree basics
- [Tree Recursion](https://www.youtube.com/watch?v=2r8y YlZ3k) - Recursion patterns

---

## Follow-up Questions

### Q1: What is the time and space complexity of the optimal solution?

**Answer:** The optimal bottom-up solution has O(n) time complexity and O(h) space complexity, where h is the height of the tree.

---

### Q2: Why is the top-down approach O(n²)?

**Answer:** For each node, we compute the height of its entire subtree. Since height is computed from scratch for each node, we get O(n²) in worst case (skewed tree).

---

### Q3: What is the difference between height and depth?

**Answer:** Height is the number of edges from the node to the deepest leaf (measured bottom-up). Depth is the number of edges from the root to the node (measured top-down).

---

### Q4: How would you modify to find the minimum depth instead of checking balance?

**Answer:** Replace the balance check with returning min(left_depth, right_depth) + 1, handling cases where one child is null by returning the other child's depth.

---

### Q5: What edge cases should be tested?

**Answer:**
- Empty tree (should return true)
- Single node (should return true)
- Completely skewed tree (should return true if just one branch)
- Trees with height difference > 1

---

### Q6: How would you handle very deep trees (worst case)?

**Answer:** For very deep trees, recursion might cause stack overflow. Use the iterative approach (Approach 3) or increase recursion limit.

---

## Common Pitfalls

### 1. Using Top-Down Without Optimization
**Issue:** Computing height from scratch for each node leads to O(n²) time.

**Solution:** Use bottom-up approach with -1 sentinel to detect imbalance early.

### 2. Not Returning -1 for Unbalanced Subtrees
**Issue:** Continuing to compute heights after finding imbalance.

**Solution:** Return -1 immediately when subtree is unbalanced.

### 3. Confusing Height and Depth
**Issue:** Height is measured bottom-up, depth is measured top-down.

**Solution:** Height = edges to deepest leaf; Depth = edges from root.

### 4. Not Handling Empty Trees
**Issue:** Empty tree should be balanced (height = 0).

**Solution:** Add base case: if not node, return 0.

### 5. Stack Overflow for Deep Trees
**Issue:** Recursion depth can exceed limit for very deep trees.

**Solution:** Use iterative approach or increase recursion limit.

---

## Summary

The **Balanced Binary Tree** problem demonstrates:

- **Top-Down**: O(n²) - Simple but inefficient
- **Bottom-Up**: O(n) - Optimal with early termination
- **Iterative**: O(n) - Avoids recursion

The key insight is computing heights bottom-up and returning -1 immediately when imbalance is detected. This makes the algorithm O(n) instead of O(n²).

This is a classic tree problem that tests understanding of recursion optimization.

---

## Additional Resources

- [LeetCode Problem](https://leetcode.com/problems/balanced-binary-tree/)
- [Tree Data Structure](https://en.wikipedia.org/wiki/Tree_(data_structure))
- [Recursion Basics](https://en.wikipedia.org/wiki/Recursion)
