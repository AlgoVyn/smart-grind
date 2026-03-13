# Validate Binary Search Tree

## Problem Description

[LeetCode Link](https://leetcode.com/problems/validate-binary-search-tree/)

Given the root of a binary tree, determine if it is a valid binary search tree (BST).

A valid BST is defined as follows:
- The left subtree of a node contains only nodes with keys strictly less than the node's key.
- The right subtree of a node contains only nodes with keys strictly greater than the node's key.
- Both the left and right subtrees must also be binary search trees.

This is **LeetCode Problem #98** and is classified as a Medium difficulty problem. It's one of the most fundamental tree problems.

---

## Examples

### Example 1

**Input:**
```python
root = [2,1,3]
```

**Output:**
```python
true
```

**Explanation:** Tree structure:
```
    2
   / \
  1   3
```
This is a valid BST.

### Example 2

**Input:**
```
root = [5,1,4,null,null,3,6]
```

**Output:**
```python
false
```

**Explanation:** Tree structure:
```
    5
   / \
  1   4
     / \
    3   6
```
The root node's value is 5 but its right child's value is 4. Invalid because right subtree should have values > 5.

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `1 <= number of nodes <= 10^4` | Tree size |
| `-2^31 <= Node.val <= 2^31 - 1` | Value range |

---

## Pattern: Tree Validation with Range Checking

This problem follows the **Tree Validation** pattern with range checking.

### Core Concept

- **Range Validation**: Each node must be within valid range
- **In-Order Traversal**: BST in-order gives sorted sequence
- **Recursion with Bounds**: Pass min/max bounds to children

### When to Use This Pattern

This pattern is applicable when:
1. Validating BST properties
2. Tree validation with constraints
3. Range-based tree problems

---

## Intuition

The key insight for this problem is understanding that validating a BST requires more than just checking parent-child relationships. We need to ensure that ALL nodes in the left subtree are less than the current node, and ALL nodes in the right subtree are greater.

### Key Observations

1. **Global Constraints**: Each node has constraints from all its ancestors, not just its parent.

2. **Range Tracking**: We can track valid range (low, high) as we traverse. For left children, update high to current node's value. For right children, update low to current node's value.

3. **In-Order Traversal**: In a valid BST, an in-order traversal produces strictly increasing values. We can check this property.

4. **Why Simple Comparisons Fail**: Just checking `node.left.val < node.val < node.right.val` is insufficient because:
   - Left subtree might contain values greater than node.val but less than ancestor's value
   - Example: [5,1,6,3,7] - 3 is > 1 but < 6, but 6 is > 5, so it's invalid

### Algorithm Overview

1. **Recursive Approach**: Pass valid range (low, high) to each recursive call
2. **Base Case**: Empty node is valid
3. **Validation**: Check if current value is within range
4. **Recursive Calls**: Update range for children

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Recursive with Range** - Most intuitive
2. **In-Order Traversal** - Elegant solution
3. **Iterative with Stack** - Avoid recursion

---

## Approach 1: Recursive with Range

### Why It Works

We pass valid lower and upper bounds to each node. When we go left, we update the upper bound. When we go right, we update the lower bound. This ensures all descendants respect the BST property.

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
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        """
        Validate BST using recursive range checking.
        
        Time Complexity: O(n)
        Space Complexity: O(h) where h is height
        """
        def validate(node: Optional[TreeNode], low: float, high: float) -> bool:
            # Empty trees are valid BSTs
            if not node:
                return True
            
            # Current node must be within valid range
            if not (low < node.val < high):
                return False
            
            # Recursively validate left and right subtrees
            # Left subtree: all values must be less than current
            # Right subtree: all values must be greater than current
            return (validate(node.left, low, node.val) and 
                    validate(node.right, node.val, high))
        
        return validate(root, float('-inf'), float('inf'))
```

<!-- slide -->
```cpp
#include <climits>
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
public:
    bool isValidBST(TreeNode* root) {
        return validate(root, LLONG_MIN, LLONG_MAX);
    }
    
private:
    bool validate(TreeNode* node, long long low, long long high) {
        if (!node) return true;
        
        if (node->val <= low || node->val >= high)
            return false;
        
        return validate(node->left, low, node->val) && 
               validate(node->right, node->val, high);
    }
};
```

<!-- slide -->
```java
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
    public boolean isValidBST(TreeNode root) {
        return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }
    
    private boolean validate(TreeNode node, long low, long high) {
        if (node == null) return true;
        
        if (node.val <= low || node.val >= high)
            return false;
        
        return validate(node.left, low, node.val) && 
               validate(node.right, node.val, high);
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
var isValidBST = function(root) {
    function validate(node, low, high) {
        if (!node) return true;
        
        if (node.val <= low || node.val >= high)
            return false;
        
        return validate(node.left, low, node.val) && 
               validate(node.right, node.val, high);
    }
    
    return validate(root, -Infinity, Infinity);
};
```
````

---

## Approach 2: In-Order Traversal

### Why It Works

A key property of BSTs is that an in-order traversal produces a strictly increasing sequence. We can verify this by tracking the previous value during traversal.

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
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        """
        Validate BST using in-order traversal.
        
        Time Complexity: O(n)
        Space Complexity: O(h)
        """
        self.prev = None
        
        def inorder(node: Optional[TreeNode]) -> bool:
            if not node:
                return True
            
            # Process left subtree
            if not inorder(node.left):
                return False
            
            # Check current node
            if self.prev is not None and node.val <= self.prev:
                return False
            self.prev = node.val
            
            # Process right subtree
            return inorder(node.right)
        
        return inorder(root)
```

<!-- slide -->
```cpp
#include <climits>
using namespace std;

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
    long prev = LONG_MIN;
    
public:
    bool inorder(TreeNode* node) {
        if (!node) return true;
        
        if (!inorder(node->left)) return false;
        
        if (node->val <= prev) return false;
        prev = node->val;
        
        return inorder(node->right);
    }
    
    bool isValidBST(TreeNode* root) {
        prev = LONG_MIN;
        return inorder(root);
    }
};
```

<!-- slide -->
```java
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
    private long prev = Long.MIN_VALUE;
    
    private boolean inorder(TreeNode node) {
        if (node == null) return true;
        
        if (!inorder(node.left)) return false;
        
        if (node.val <= prev) return false;
        prev = node.val;
        
        return inorder(node.right);
    }
    
    public boolean isValidBST(TreeNode root) {
        prev = Long.MIN_VALUE;
        return inorder(root);
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isValidBST = function(root) {
    let prev = -Infinity;
    
    function inorder(node) {
        if (!node) return true;
        
        if (!inorder(node.left)) return false;
        
        if (node.val <= prev) return false;
        prev = node.val;
        
        return inorder(node.right);
    }
    
    return inorder(root);
};
```
````

---

## Approach 3: Iterative with Stack

### Why It Works

We simulate the recursive in-order traversal using an explicit stack. This avoids recursion depth issues for very deep trees.

### Code Implementation

````carousel
```python
from typing import Optional
import math

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        """
        Validate BST using iterative in-order traversal.
        
        Time Complexity: O(n)
        Space Complexity: O(h)
        """
        stack = []
        prev = -math.inf
        current = root
        
        while stack or current:
            # Go to leftmost node
            while current:
                stack.append(current)
                current = current.left
            
            # Process current node
            current = stack.pop()
            if current.val <= prev:
                return False
            prev = current.val
            
            # Move to right subtree
            current = current.right
        
        return True
```

<!-- slide -->
```cpp
#include <stack>
#include <climits>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

class Solution {
public:
    bool isValidBST(TreeNode* root) {
        stack<TreeNode*> st;
        long prev = LONG_MIN;
        TreeNode* curr = root;
        
        while (curr || !st.empty()) {
            while (curr) {
                st.push(curr);
                curr = curr->left;
            }
            
            curr = st.top();
            st.pop();
            
            if (curr->val <= prev) return false;
            prev = curr->val;
            
            curr = curr->right;
        }
        
        return true;
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
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

class Solution {
    public boolean isValidBST(TreeNode root) {
        Stack<TreeNode> stack = new Stack<>();
        long prev = Long.MIN_VALUE;
        TreeNode curr = root;
        
        while (curr != null || !stack.isEmpty()) {
            while (curr != null) {
                stack.push(curr);
                curr = curr.left;
            }
            
            curr = stack.pop();
            if (curr.val <= prev) return false;
            prev = curr.val;
            
            curr = curr.right;
        }
        
        return true;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isValidBST = function(root) {
    const stack = [];
    let prev = -Infinity;
    let curr = root;
    
    while (curr || stack.length > 0) {
        while (curr) {
            stack.push(curr);
            curr = curr.left;
        }
        
        curr = stack.pop();
        if (curr.val <= prev) return false;
        prev = curr.val;
        
        curr = curr.right;
    }
    
    return true;
};
```
````

### Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Recursive Range | O(n) | O(h) | Most intuitive |
| In-Order Recursive | O(n) | O(h) | Elegant |
| Iterative In-Order | O(n) | O(h) | No recursion |

---

## Common Pitfalls

1. **Not Using Valid Range**: Only checking parent-child relationship. Solution: Pass valid min/max bounds to each subtree.

2. **Integer Overflow**: Using INT_MAX/MIN directly can cause issues. Solution: Use None/long for bounds.

3. **Empty Subtrees**: Not handling null children correctly. Solution: Use None for infinite bounds.

4. **Equality Condition**: Forgetting that BST requires strictly less/greater, not less than or equal.

5. **Recursive Depth**: Very deep trees can cause stack overflow. Solution: Use iterative approach.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Very commonly asked in technical interviews
- **Companies**: Google, Amazon, Microsoft, Facebook
- **Difficulty**: Medium
- **Concepts Tested**: Tree traversal, BST properties, recursion

### Learning Outcomes

1. **BST Properties**: Understand what makes a valid BST
2. **Range Propagation**: Learn to pass constraints down a tree
3. **Multiple Solutions**: Different approaches to the same problem

---

## Related Problems

### Same Pattern (Tree Validation)
| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Insert into BST](/solutions/insert-into-a-binary-search-tree.md) | 701 | Medium | Insert node |
| [Delete Node in BST](/solutions/delete-node-in-a-bst.md) | 450 | Medium | Delete node |
| [Kth Smallest Element](/solutions/kth-smallest-element-in-a-bst.md) | 230 | Medium | In-order |

### Similar Concepts
| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Minimum Absolute Difference in BST](/solutions/minimum-absolute-difference-in-bst.md) | 783 | Easy | BST traversal |

---

## Video Tutorial Links

1. **[Validate BST - NeetCode](https://www.youtube.com/watch?v=)** - Clear explanation
2. **[BST Properties Explained](https://www.youtube.com/watch=)** - Visual guide

---

## Follow-up Questions

### Q1: How would you find the k-th smallest element in a BST?

**Answer:** Use in-order traversal and stop at k-th node.

### Q2: What if duplicates are allowed (left <= current < right)?

**Answer:** Change comparison from `<` to `<=` and adjust algorithm accordingly.

### Q3: How would you convert a sorted array to a balanced BST?

**Answer:** Use binary search to find middle element as root, recursively build left and right.

---

## Summary

The **Validate Binary Search Tree** problem tests understanding of BST properties:

- **Range Propagation**: Pass valid bounds to each subtree
- **In-Order Property**: BST in-order traversal is strictly increasing
- **Multiple Approaches**: Recursive, in-order, iterative

Key takeaways:
1. Each node has constraints from ALL ancestors, not just parent
2. Use range (low, high) to track valid values
3. In-order traversal produces sorted sequence for valid BST
4. Consider iterative approach for very deep trees

This problem is essential for understanding tree traversal and BST properties.
