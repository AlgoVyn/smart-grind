# Tree DFS - Recursive Preorder Traversal

## Overview

Preorder traversal is a fundamental depth-first search (DFS) approach that visits the **root node first**, then recursively traverses the **left subtree**, and finally the **right subtree**. This pattern is ideal for scenarios where you need to process the root before its children, such as creating a copy of the tree, evaluating expressions in a tree representation, or performing operations that require a top-down approach.

The traversal order is: **Root → Left → Right**

**Key Benefits:**
- **Simplicity**: Elegant recursive implementation with minimal code
- **Top-Down Processing**: Root is processed before children, useful for many algorithms
- **Natural Recursion**: Directly maps to recursive function call stack
- **Predictable Order**: Produces consistent, reproducible traversal sequences

---

## Intuition

### Core Concept

The intuition behind preorder traversal stems from the natural way we explore hierarchical structures. When exploring a tree from top to bottom, we naturally:
1. Visit the current node first (hence "pre-order")
2. Then explore all branches from left to right
3. Continue recursively until all nodes are visited

### Why Preorder?

**Preorder traversal is optimal when:**
- **Root-dependent operations**: Operations that depend on parent node values before processing children
- **Tree construction**: Building new trees from traversal data (e.g., expression trees)
- **Path exploration**: Finding paths where root information is needed first
- **Serialization**: Creating string representations where root precedes children

### Key Observations

1. **Root Priority**: The root is always visited first, allowing early processing
2. **Recursive Structure**: Each subtree follows the same Root → Left → Right pattern
3. **Base Case**: Empty nodes (null) terminate recursion
4. **Result Accumulation**: Can collect results, perform actions, or compute values during visits

### Visual Representation

```
       A                    Visit Order: A, B, D, E, C, F
      / \                  
     B   C                 
    / \ / \                
   D  E F G               
```

**Traversal Steps:**
1. Visit A (root)
2. Go left to B, visit B
3. Go left to D, visit D
4. D has no children, back to B
5. Go right to E, visit E
6. E has no children, back to A
7. Go right to C, visit C
8. Continue to F, visit F
9. Result: [A, B, D, E, C, F]

---

## Multiple Approaches with Code

We'll cover three main approaches:

1. **Recursive Preorder** - Most intuitive and commonly used
2. **Iterative Preorder with Stack** - Uses explicit stack to avoid recursion
3. **Morris Preorder Traversal** - O(1) space using thread creation

---

## Approach 1: Recursive Preorder Traversal

This is the most straightforward approach using recursion. The function calls itself on left and right children in the correct order.

### Algorithm Steps

1. Create a result list to store visited node values
2. Define a recursive helper function `dfs(node)`:
   - If node is null, return (base case)
   - Add node.val to result (visit root)
   - Recursively call `dfs(node.left)` (traverse left)
   - Recursively call `dfs(node.right)` (traverse right)
3. Call the helper function starting from root
4. Return the result list

### Code Implementation

````carousel
```python
from typing import List, Optional

# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def preorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        """
        Perform preorder traversal of a binary tree.
        
        Args:
            root: Root node of the binary tree
            
        Returns:
            List of node values in preorder (root, left, right) order
        """
        result = []
        
        def dfs(node: Optional[TreeNode]) -> None:
            """Helper function for recursive DFS traversal."""
            if not node:
                return
            
            # Visit the root node
            result.append(node.val)
            
            # Traverse left subtree
            dfs(node.left)
            
            # Traverse right subtree
            dfs(node.right)
        
        dfs(root)
        return result
```

<!-- slide -->
```cpp
#include <vector>
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
    vector<int> preorderTraversal(TreeNode* root) {
        /**
         * Perform preorder traversal of a binary tree.
         * 
         * Args:
         *     root: Root node of the binary tree
         * 
         * Returns:
         *     Vector of node values in preorder (root, left, right) order
         */
        vector<int> result;
        
        function<void(TreeNode*)> dfs = [&](TreeNode* node) {
            if (!node) {
                return;
            }
            
            // Visit the root node
            result.push_back(node->val);
            
            // Traverse left subtree
            dfs(node->left);
            
            // Traverse right subtree
            dfs(node->right);
        };
        
        dfs(root);
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.ArrayList;
import java.util.List;

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
    private List<Integer> result = new ArrayList<>();
    
    public List<Integer> preorderTraversal(TreeNode root) {
        /**
         * Perform preorder traversal of a binary tree.
         * 
         * Args:
         *     root: Root node of the binary tree
         * 
         * Returns:
         *     List of node values in preorder (root, left, right) order
         */
        dfs(root);
        return result;
    }
    
    private void dfs(TreeNode node) {
        if (node == null) {
            return;
        }
        
        // Visit the root node
        result.add(node.val);
        
        // Traverse left subtree
        dfs(node.left);
        
        // Traverse right subtree
        dfs(node.right);
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
 * Perform preorder traversal of a binary tree.
 * 
 * @param {TreeNode} root - Root node of the binary tree
 * @return {number[]} - Array of node values in preorder (root, left, right) order
 */
var preorderTraversal = function(root) {
    const result = [];
    
    function dfs(node) {
        if (!node) {
            return;
        }
        
        // Visit the root node
        result.push(node.val);
        
        // Traverse left subtree
        dfs(node.left);
        
        // Traverse right subtree
        dfs(node.right);
    }
    
    dfs(root);
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each node is visited exactly once |
| **Space** | O(h) - Recursion stack depth equals tree height (h), where h can be O(n) for skewed trees |

---

## Approach 2: Iterative Preorder with Stack

This approach uses an explicit stack to simulate the recursion, avoiding potential stack overflow for very deep trees while maintaining the same traversal order.

### Algorithm Steps

1. Create an empty stack and push the root node
2. While the stack is not empty:
   - Pop the top node from the stack
   - Add the node's value to result (visit)
   - Push right child first (if exists) - LIFO ensures left is processed first
   - Push left child first (if exists)
3. Return the result list

### Code Implementation

````carousel
```python
from typing import List, Optional

# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def preorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        """
        Perform preorder traversal using iterative approach with stack.
        
        Args:
            root: Root node of the binary tree
            
        Returns:
            List of node values in preorder (root, left, right) order
        """
        if not root:
            return []
        
        result = []
        stack = [root]
        
        while stack:
            node = stack.pop()
            result.append(node.val)
            
            # Push right child first, then left child
            # This ensures left child is processed first (LIFO order)
            if node.right:
                stack.append(node.right)
            if node.left:
                stack.append(node.left)
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
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
    vector<int> preorderTraversal(TreeNode* root) {
        /**
         * Perform preorder traversal using iterative approach with stack.
         * 
         * Args:
         *     root: Root node of the binary tree
         * 
         * Returns:
         *     Vector of node values in preorder (root, left, right) order
         */
        if (!root) {
            return {};
        }
        
        vector<int> result;
        stack<TreeNode*> st;
        st.push(root);
        
        while (!st.empty()) {
            TreeNode* node = st.top();
            st.pop();
            result.push_back(node->val);
            
            // Push right child first, then left child
            // This ensures left child is processed first (LIFO order)
            if (node->right) {
                st.push(node->right);
            }
            if (node->left) {
                st.push(node->left);
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.ArrayList;
import java.util.List;
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
    public List<Integer> preorderTraversal(TreeNode root) {
        /**
         * Perform preorder traversal using iterative approach with stack.
         * 
         * Args:
         *     root: Root node of the binary tree
         * 
         * Returns:
         *     List of node values in preorder (root, left, right) order
         */
        if (root == null) {
            return new ArrayList<>();
        }
        
        List<Integer> result = new ArrayList<>();
        Stack<TreeNode> stack = new Stack<>();
        stack.push(root);
        
        while (!stack.isEmpty()) {
            TreeNode node = stack.pop();
            result.add(node.val);
            
            // Push right child first, then left child
            // This ensures left child is processed first (LIFO order)
            if (node.right != null) {
                stack.push(node.right);
            }
            if (node.left != null) {
                stack.push(node.left);
            }
        }
        
        return result;
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
 * Perform preorder traversal using iterative approach with stack.
 * 
 * @param {TreeNode} root - Root node of the binary tree
 * @return {number[]} - Array of node values in preorder (root, left, right) order
 */
var preorderTraversal = function(root) {
    if (!root) {
        return [];
    }
    
    const result = [];
    const stack = [root];
    
    while (stack.length > 0) {
        const node = stack.pop();
        result.push(node.val);
        
        // Push right child first, then left child
        // This ensures left child is processed first (LIFO order)
        if (node.right) {
            stack.push(node.right);
        }
        if (node.left) {
            stack.push(node.left);
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each node is visited exactly once |
| **Space** | O(h) - Stack stores at most tree height (h), where h can be O(n) for skewed trees |

---

## Approach 3: Morris Preorder Traversal

This approach achieves O(1) space complexity by temporarily creating threads (pointers) in the tree. It modifies the tree structure temporarily but restores it afterward.

### Algorithm Steps

1. Initialize current = root
2. While current is not null:
   - If current has no left child:
     - Visit current
     - Move to current.right
   - Else:
     - Find the rightmost node in current's left subtree (predecessor)
     - If predecessor's right is null:
       - Set predecessor.right = current (create thread)
       - Visit current
       - Move to current.left
     - Else (thread exists):
       - Restore predecessor.right to null (remove thread)
       - Move to current.right
3. Return result

### Code Implementation

````carousel
```python
from typing import List, Optional

# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def preorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        """
        Perform preorder traversal using Morris traversal for O(1) space.
        
        Args:
            root: Root node of the binary tree
            
        Returns:
            List of node values in preorder (root, left, right) order
        """
        result = []
        current = root
        
        while current:
            if not current.left:
                # No left subtree, visit and go right
                result.append(current.val)
                current = current.right
            else:
                # Find predecessor (rightmost node in left subtree)
                predecessor = current.left
                while predecessor.right and predecessor.right != current:
                    predecessor = predecessor.right
                
                if not predecessor.right:
                    # Create thread and visit current
                    predecessor.right = current
                    result.append(current.val)
                    current = current.left
                else:
                    # Thread exists, restore and go right
                    predecessor.right = None
                    current = current.right
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
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
    vector<int> preorderTraversal(TreeNode* root) {
        /**
         * Perform preorder traversal using Morris traversal for O(1) space.
         * 
         * Args:
         *     root: Root node of the binary tree
         * 
         * Returns:
         *     Vector of node values in preorder (root, left, right) order
         */
        vector<int> result;
        TreeNode* current = root;
        
        while (current) {
            if (!current->left) {
                // No left subtree, visit and go right
                result.push_back(current->val);
                current = current->right;
            } else {
                // Find predecessor (rightmost node in left subtree)
                TreeNode* predecessor = current->left;
                while (predecessor->right && predecessor->right != current) {
                    predecessor = predecessor->right;
                }
                
                if (!predecessor->right) {
                    // Create thread and visit current
                    predecessor->right = current;
                    result.push_back(current->val);
                    current = current->left;
                } else {
                    // Thread exists, restore and go right
                    predecessor->right = nullptr;
                    current = current->right;
                }
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.ArrayList;
import java.util.List;

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
    public List<Integer> preorderTraversal(TreeNode root) {
        /**
         * Perform preorder traversal using Morris traversal for O(1) space.
         * 
         * Args:
         *     root: Root node of the binary tree
         * 
         * Returns:
         *     List of node values in preorder (root, left, right) order
         */
        List<Integer> result = new ArrayList<>();
        TreeNode current = root;
        
        while (current != null) {
            if (current.left == null) {
                // No left subtree, visit and go right
                result.add(current.val);
                current = current.right;
            } else {
                // Find predecessor (rightmost node in left subtree)
                TreeNode predecessor = current.left;
                while (predecessor.right != null && predecessor.right != current) {
                    predecessor = predecessor.right;
                }
                
                if (predecessor.right == null) {
                    // Create thread and visit current
                    predecessor.right = current;
                    result.add(current.val);
                    current = current.left;
                } else {
                    // Thread exists, restore and go right
                    predecessor.right = null;
                    current = current.right;
                }
            }
        }
        
        return result;
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
 * Perform preorder traversal using Morris traversal for O(1) space.
 * 
 * @param {TreeNode} root - Root node of the binary tree
 * @return {number[]} - Array of node values in preorder (root, left, right) order
 */
var preorderTraversal = function(root) {
    const result = [];
    let current = root;
    
    while (current) {
        if (!current.left) {
            // No left subtree, visit and go right
            result.push(current.val);
            current = current.right;
        } else {
            // Find predecessor (rightmost node in left subtree)
            let predecessor = current.left;
            while (predecessor.right && predecessor.right !== current) {
                predecessor = predecessor.right;
            }
            
            if (!predecessor.right) {
                // Create thread and visit current
                predecessor.right = current;
                result.push(current.val);
                current = current.left;
            } else {
                // Thread exists, restore and go right
                predecessor.right = null;
                current = current.right;
            }
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each node is visited 1-2 times |
| **Space** | O(1) - No recursion or stack, uses temporary threads |

---

## Comparison of Approaches

| Aspect | Recursive | Iterative (Stack) | Morris Traversal |
|--------|-----------|-------------------|------------------|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(h) | O(h) | O(1) |
| **Implementation** | Simple, elegant | Moderate | Complex |
| **Code Readability** | High | Medium | Low |
| **Stack Overflow Risk** | Yes | Yes | No |
| **Tree Modification** | No | No | Yes (temporary) |
| **Best For** | Balanced trees, interviews | Deep trees, avoiding recursion | Memory-constrained, O(1) space |

**Where:**
- n = number of nodes
- h = height of tree (can be O(n) for skewed tree)

---

## Why These Approaches Work

### Recursive Approach
The recursive approach naturally mirrors the tree's recursive structure. Each function call represents visiting a node, and the call stack implicitly manages the traversal order. The order of recursive calls (left then right) ensures preorder traversal.

### Iterative Stack Approach
The explicit stack mimics the recursive call stack. By pushing children in reverse order (right first, then left), the LIFO property ensures left children are processed before right children, maintaining preorder order.

### Morris Traversal
Morris traversal cleverly uses temporary threads to remember where to return after processing subtrees. When a left subtree is completely processed, the thread guides us back to the current node, eliminating the need for explicit stack storage.

All three approaches fundamentally perform the same traversal but differ in how they manage the traversal state:
- **Recursive**: Uses call stack implicitly
- **Iterative**: Uses explicit stack
- **Morris**: Uses threaded pointers

---

## Common Pitfalls

1. **Recursion Depth Limit**: For very deep trees, recursion might exceed the stack limit. Use iterative approach for deep trees.

2. **Forgetting Base Case**: Always check for null nodes to prevent infinite recursion.

3. **Modifying Tree During Traversal**: Be cautious if traversal involves modifications, as it might affect subsequent traversals.

4. **Not Collecting Results Properly**: Ensure the result list is accessible within the recursive function scope.

5. **Incorrect Child Order**: Remember to traverse left before right for preorder (not right before left).

6. **Null Root Handling**: Always handle the case where root is null/empty.

---

## Template Summary

### Python Template

```python
from typing import List, Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def preorder_traversal(root: Optional[TreeNode]) -> List[int]:
    result = []
    
    def dfs(node: Optional[TreeNode]) -> None:
        if not node:
            return
        result.append(node.val)  # Visit root
        dfs(node.left)           # Traverse left
        dfs(node.right)          # Traverse right
    
    dfs(root)
    return result
```

### C++ Template

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
public:
    vector<int> preorderTraversal(TreeNode* root) {
        vector<int> result;
        
        function<void(TreeNode*)> dfs = [&](TreeNode* node) {
            if (!node) return;
            result.push_back(node->val);
            dfs(node->left);
            dfs(node->right);
        };
        
        dfs(root);
        return result;
    }
};
```

### Java Template

```java
import java.util.ArrayList;
import java.util.List;

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
    private List<Integer> result = new ArrayList<>();
    
    public List<Integer> preorderTraversal(TreeNode root) {
        dfs(root);
        return result;
    }
    
    private void dfs(TreeNode node) {
        if (node == null) return;
        result.add(node.val);
        dfs(node.left);
        dfs(node.right);
    }
}
```

### JavaScript Template

```javascript
function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val);
    this.left = (left===undefined ? null : left);
    this.right = (right===undefined ? null : right);
}

function preorderTraversal(root) {
    const result = [];
    
    function dfs(node) {
        if (!node) return;
        result.push(node.val);
        dfs(node.left);
        dfs(node.right);
    }
    
    dfs(root);
    return result;
}
```

---

## Related Problems

Based on tree traversal and similar algorithmic patterns:

- **[Binary Tree Preorder Traversal](https://leetcode.com/problems/binary-tree-preorder-traversal/)** - The classic preorder traversal problem
- **[Construct Binary Tree from Preorder and Inorder Traversal](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)** - Build tree using preorder + inorder
- **[Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/)** - Use preorder to validate BST properties
- **[Path Sum](https://leetcode.com/problems/path-sum/)** - Find root-to-leaf paths with given sum
- **[Path Sum II](https://leetcode.com/problems/path-sum-ii/)** - Find all root-to-leaf paths with given sum
- **[Binary Tree Paths](https://leetcode.com/problems/binary-tree-paths/)** - Print all root-to-leaf paths
- **[Sum Root to Leaf Numbers](https://leetcode.com/problems/sum-root-to-leaf-numbers/)** - Calculate sum of numbers formed by root-to-leaf paths
- **[Deepest Leaves Sum](https://leetcode.com/problems/deepest-leaves-sum/)** - Sum of deepest level leaves
- **[Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree/)** - Find tree height using preorder
- **[Symmetric Tree](https://leetcode.com/problems/symmetric-tree/)** - Check if tree is symmetric
- **[Same Tree](https://leetcode.com/problems/same-tree/)** - Compare two trees for equality

---

## Video Tutorial Links

Here are some helpful YouTube tutorials explaining preorder traversal and related concepts:

- **[Binary Tree Preorder Traversal - LeetCode 144](https://www.youtube.com/watch?v=B3WDmp2nOns)** - Complete explanation of preorder traversal
- **[Tree Traversal - Inorder, Preorder, Postorder](https://www.youtube.com/watch?v=gm8DUJJhmY4)** - Comprehensive tree traversal guide
- **[Morris Traversal - O(1) Space Tree Traversal](https://www.youtube.com/watch?v=wGXB8O1chGw)** - Advanced Morris traversal explanation
- **[Binary Tree Patterns - Preorder Traversal](https://www.youtube.com/watch?v=elQ9J2NJ_2o)** - Pattern-based approach to tree problems
- **[Recursion vs Iteration - Tree Traversal](https://www.youtube.com/watch?v=SwB0Ssbu330)** - Comparing traversal approaches

---

## Followup Questions

### Q1: How would you modify preorder traversal to collect values at a specific depth?

**Answer:** Add a depth parameter to the recursive function. When depth matches target, collect the value. For iterative, track depth alongside nodes in the stack.

```python
def collect_at_depth(root, target_depth, current_depth=0):
    if not root:
        return []
    if current_depth == target_depth:
        return [root.val]
    return (collect_at_depth(root.left, target_depth, current_depth + 1) +
            collect_at_depth(root.right, target_depth, current_depth + 1))
```

---

### Q2: What if you need to modify node values during traversal?

**Answer:** Simply modify the node value before or after appending to result, depending on whether you want the original or modified value in the result.

```python
def preorder_modify(root):
    if not root:
        return
    root.val *= 2  # Modify the node value
    result.append(root.val)
    preorder_modify(root.left)
    preorder_modify(root.right)
```

---

### Q3: How would you implement preorder traversal without recursion or extra space?

**Answer:** Use Morris Traversal (Approach 3 above) which achieves O(1) space by creating temporary threads in the tree structure.

---

### Q4: Can you use preorder traversal to find the lowest common ancestor (LCA)?

**Answer:** Yes. In preorder, if you find a node that is either the target or has both targets in different subtrees, it could be the LCA. However, postorder is more commonly used for LCA as it finds the answer from bottom up.

---

### Q5: How would you handle very large trees where recursion would cause stack overflow?

**Answer:** Use the iterative approach with an explicit stack (Approach 2) or Morris traversal (Approach 3). Both avoid recursion stack limits.

---

### Q6: What modifications are needed for N-ary tree preorder traversal?

**Answer:** Instead of left/right children, iterate through all children. The pattern becomes: visit node, then traverse each child in order.

```python
def nary_preorder(root):
    if not root:
        return []
    result = [root.val]
    for child in root.children:
        result.extend(nary_preorder(child))
    return result
```

---

### Q7: How would you implement iterative preorder traversal without a stack?

**Answer:** This requires modifying the tree structure temporarily using parent pointers or by restructuring links. Morris traversal provides O(1) space but modifies the tree temporarily.

---

### Q8: Can you reconstruct a tree from preorder traversal alone?

**Answer:** No, preorder alone is insufficient. You need either:
- Preorder + Inorder
- Preorder + Postorder (with size information)
- Preorder + Level-order

---

## Summary

Preorder traversal is a fundamental tree traversal technique with applications across many tree-based problems. Key takeaways:

- **Recursive approach** is most intuitive and commonly used
- **Iterative approach** avoids recursion stack limits
- **Morris traversal** achieves O(1) space for memory-constrained scenarios
- **Order matters**: Root → Left → Right
- **Understanding traversal** is essential for solving tree problems

This pattern is frequently asked in interviews and forms the foundation for many tree algorithms including tree construction, path finding, and tree validation.

---

## Additional Resources

- [LeetCode Binary Tree Preorder Traversal](https://leetcode.com/problems/binary-tree-preorder-traversal/) - Problem and solutions
- [Tree Traversals - GeeksforGeeks](https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/) - Comprehensive traversal guide
- [Morris Traversal](https://www.geeksforgeeks.org/morris-traversal-linear-time-tree-traversal/) - O(1) space traversal
- [Binary Tree Data Structure](https://www.geeksforgeeks.org/binary-tree-data-structure/) - Binary tree fundamentals
