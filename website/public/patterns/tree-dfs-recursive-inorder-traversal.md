# Tree DFS - Recursive Inorder Traversal

## Overview

Inorder traversal is a fundamental depth-first search (DFS) approach that visits the **left subtree first**, then the **root node**, and finally the **right subtree**. For binary search trees (BST), this traversal naturally produces nodes in **sorted order**, making it exceptionally valuable for validation, search, and ordered operations.

The traversal order is: **Left → Root → Right**

**Key Benefits:**
- **BST Property**: Produces sorted output for binary search trees
- **Natural Order**: Left-to-right traversal matches many domain-specific hierarchies
- **Balanced Processing**: Processes left subtree before root, then right - a natural middle-first approach
- **Predictable Output**: Consistent ordering for verification and comparison tasks

---

## Intuition

### Core Concept

The intuition behind inorder traversal stems from exploring the complete left branch before acknowledging the root node. This "visit middle last" approach:
1. Explore all left descendants first (deeper exploration)
2. Process the current node (the bridge between left and right)
3. Explore all right descendants (completion)

### Why Inorder?

**Inorder traversal is optimal when:**
- **BST Operations**: Finding median, predecessor, successor, or validating BST property
- **Sorted Output**: Getting nodes in ascending order (BST)
- **Expression Trees**: Produces infix expression notation
- **Tree Balancing**: Understanding left/right subtree relationships

### Key Observations

1. **Left Priority**: Left subtree is always traversed first
2. **Root Middle**: Root is visited between left and right traversals
3. **Recursive Pattern**: Each subtree follows the same Left → Root → Right pattern
4. **Base Case**: Empty nodes (null) terminate recursion
5. **BST Magic**: For BSTs, inorder produces sorted sequence

### Visual Representation

```
       A                    Visit Order: D, B, E, A, C, F
      / \                  
     B   C                 
    / \ / \                
   D  E F G               
```

**Traversal Steps:**
1. Go left to B, then left to D
2. D has no children, visit D
3. Back to D, no right, back to B
4. Visit B
5. Go right to E, visit E
6. Back to A, visit A
7. Go right to C, then left to F, visit F
8. Back to C, visit C
9. Result: [D, B, E, A, C, F]

---

## Multiple Approaches with Code

We'll cover three main approaches:

1. **Recursive Inorder** - Most intuitive and commonly used
2. **Iterative Inorder with Stack** - Uses explicit stack to avoid recursion
3. **Morris Inorder Traversal** - O(1) space using thread creation

---

## Approach 1: Recursive Inorder Traversal

This is the most straightforward approach using recursion. The function calls itself on left child, then processes the node, then calls on right child.

### Algorithm Steps

1. Create a result list to store visited node values
2. Define a recursive helper function `dfs(node)`:
   - If node is null, return (base case)
   - Recursively call `dfs(node.left)` (traverse left)
   - Add node.val to result (visit root)
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
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        """
        Perform inorder traversal of a binary tree.
        
        Args:
            root: Root node of the binary tree
            
        Returns:
            List of node values in inorder (left, root, right) order
        """
        result = []
        
        def dfs(node: Optional[TreeNode]) -> None:
            """Helper function for recursive DFS traversal."""
            if not node:
                return
            
            # Traverse left subtree
            dfs(node.left)
            
            # Visit the root node
            result.append(node.val)
            
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
    vector<int> inorderTraversal(TreeNode* root) {
        /**
         * Perform inorder traversal of a binary tree.
         * 
         * Args:
         *     root: Root node of the binary tree
         * 
         * Returns:
         *     Vector of node values in inorder (left, root, right) order
         */
        vector<int> result;
        
        function<void(TreeNode*)> dfs = [&](TreeNode* node) {
            if (!node) {
                return;
            }
            
            // Traverse left subtree
            dfs(node->left);
            
            // Visit the root node
            result.push_back(node->val);
            
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
    
    public List<Integer> inorderTraversal(TreeNode root) {
        /**
         * Perform inorder traversal of a binary tree.
         * 
         * Args:
         *     root: Root node of the binary tree
         * 
         * Returns:
         *     List of node values in inorder (left, root, right) order
         */
        dfs(root);
        return result;
    }
    
    private void dfs(TreeNode node) {
        if (node == null) {
            return;
        }
        
        // Traverse left subtree
        dfs(node.left);
        
        // Visit the root node
        result.add(node.val);
        
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
 * Perform inorder traversal of a binary tree.
 * 
 * @param {TreeNode} root - Root node of the binary tree
 * @return {number[]} - Array of node values in inorder (left, root, right) order
 */
var inorderTraversal = function(root) {
    const result = [];
    
    function dfs(node) {
        if (!node) {
            return;
        }
        
        // Traverse left subtree
        dfs(node.left);
        
        // Visit the root node
        result.push(node.val);
        
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

## Approach 2: Iterative Inorder with Stack

This approach uses an explicit stack to simulate the recursion, avoiding potential stack overflow for very deep trees while maintaining the same traversal order.

### Algorithm Steps

1. Initialize an empty stack and current = root
2. While current is not null OR stack is not empty:
   - Push all left children onto stack (go as left as possible)
   - Pop from stack (most recent left node)
   - Add node's value to result (visit)
   - Move to node's right child
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
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        """
        Perform inorder traversal using iterative approach with stack.
        
        Args:
            root: Root node of the binary tree
            
        Returns:
            List of node values in inorder (left, root, right) order
        """
        result = []
        stack = []
        current = root
        
        while current or stack:
            # Go to the leftmost node
            while current:
                stack.append(current)
                current = current.left
            
            # Current is null at this point
            current = stack.pop()
            result.append(current.val)  # Visit the node
            
            # Visit the right subtree
            current = current.right
        
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
    vector<int> inorderTraversal(TreeNode* root) {
        /**
         * Perform inorder traversal using iterative approach with stack.
         * 
         * Args:
         *     root: Root node of the binary tree
         * 
         * Returns:
         *     Vector of node values in inorder (left, root, right) order
         */
        vector<int> result;
        stack<TreeNode*> st;
        TreeNode* current = root;
        
        while (current || !st.empty()) {
            // Go to the leftmost node
            while (current) {
                st.push(current);
                current = current->left;
            }
            
            // Current is null at this point
            current = st.top();
            st.pop();
            result.push_back(current->val);  // Visit the node
            
            // Visit the right subtree
            current = current->right;
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
    public List<Integer> inorderTraversal(TreeNode root) {
        /**
         * Perform inorder traversal using iterative approach with stack.
         * 
         * Args:
         *     root: Root node of the binary tree
         * 
         * Returns:
         *     List of node values in inorder (left, root, right) order
         */
        List<Integer> result = new ArrayList<>();
        Stack<TreeNode> stack = new Stack<>();
        TreeNode current = root;
        
        while (current != null || !stack.isEmpty()) {
            // Go to the leftmost node
            while (current != null) {
                stack.push(current);
                current = current.left;
            }
            
            // Current is null at this point
            current = stack.pop();
            result.add(current.val);  // Visit the node
            
            // Visit the right subtree
            current = current.right;
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
 * Perform inorder traversal using iterative approach with stack.
 * 
 * @param {TreeNode} root - Root node of the binary tree
 * @return {number[]} - Array of node values in inorder (left, root, right) order
 */
var inorderTraversal = function(root) {
    const result = [];
    const stack = [];
    let current = root;
    
    while (current || stack.length > 0) {
        // Go to the leftmost node
        while (current) {
            stack.push(current);
            current = current.left;
        }
        
        // Current is null at this point
        current = stack.pop();
        result.push(current.val);  // Visit the node
        
        // Visit the right subtree
        current = current.right;
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

## Approach 3: Morris Inorder Traversal

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
       - Move to current.left
     - Else (thread exists):
       - Restore predecessor.right to null (remove thread)
       - Visit current
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
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        """
        Perform inorder traversal using Morris traversal for O(1) space.
        
        Args:
            root: Root node of the binary tree
            
        Returns:
            List of node values in inorder (left, root, right) order
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
                    # Create thread and go left
                    predecessor.right = current
                    current = current.left
                else:
                    # Thread exists, visit and go right
                    predecessor.right = None
                    result.append(current.val)
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
    vector<int> inorderTraversal(TreeNode* root) {
        /**
         * Perform inorder traversal using Morris traversal for O(1) space.
         * 
         * Args:
         *     root: Root node of the binary tree
         * 
         * Returns:
         *     Vector of node values in inorder (left, root, right) order
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
                    // Create thread and go left
                    predecessor->right = current;
                    current = current->left;
                } else {
                    // Thread exists, visit and go right
                    predecessor->right = nullptr;
                    result.push_back(current->val);
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
    public List<Integer> inorderTraversal(TreeNode root) {
        /**
         * Perform inorder traversal using Morris traversal for O(1) space.
         * 
         * Args:
         *     root: Root node of the binary tree
         * 
         * Returns:
         *     List of node values in inorder (left, root, right) order
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
                    // Create thread and go left
                    predecessor.right = current;
                    current = current.left;
                } else {
                    // Thread exists, visit and go right
                    predecessor.right = null;
                    result.add(current.val);
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
 * Perform inorder traversal using Morris traversal for O(1) space.
 * 
 * @param {TreeNode} root - Root node of the binary tree
 * @return {number[]} - Array of node values in inorder (left, root, right) order
 */
var inorderTraversal = function(root) {
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
                // Create thread and go left
                predecessor.right = current;
                current = current.left;
            } else {
                // Thread exists, visit and go right
                predecessor.right = null;
                result.push(current.val);
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
|--------|-----------|-------------------|-------------------|
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

The recursive approach naturally mirrors the tree's recursive structure. The order of recursive calls (left first, then visit, then right) ensures inorder traversal. The call stack implicitly manages the traversal state.

### Iterative Stack Approach

The explicit stack mimics the recursive call stack. By pushing left children until we reach a leaf, then popping to visit, then moving right, we maintain the correct inorder sequence without recursion.

### Morris Traversal

Morris traversal cleverly uses temporary threads to remember the return path. When we finish processing a left subtree, the thread guides us back to the current node, eliminating the need for explicit stack storage while preserving the left-root-right order.

All three approaches fundamentally perform the same traversal but differ in how they manage the traversal state:
- **Recursive**: Uses call stack implicitly
- **Iterative**: Uses explicit stack
- **Morris**: Uses threaded pointers

---

## Common Pitfalls

1. **Wrong Order**: Remember the exact order is Left → Root → Right (not Root → Left → Right)

2. **Recursion Depth Limit**: For very deep trees, recursion might exceed stack limit. Use iterative approach.

3. **Forgetting Base Case**: Always check for null nodes to prevent infinite recursion.

4. **Modifying Tree During Traversal**: Be cautious if traversal involves modifications, as it might affect subsequent traversals.

5. **Not Collecting Results Properly**: Ensure the result list is accessible within the recursive function scope.

6. **Null Root Handling**: Always handle the case where root is null/empty.

7. **BST Assumption**: Inorder only produces sorted output for BSTs, not regular binary trees.

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

def inorder_traversal(root: Optional[TreeNode]) -> List[int]:
    result = []
    
    def dfs(node: Optional[TreeNode]) -> None:
        if not node:
            return
        dfs(node.left)           # Traverse left
        result.append(node.val)   # Visit root
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
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> result;
        
        function<void(TreeNode*)> dfs = [&](TreeNode* node) {
            if (!node) return;
            dfs(node->left);
            result.push_back(node->val);
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
    
    public List<Integer> inorderTraversal(TreeNode root) {
        dfs(root);
        return result;
    }
    
    private void dfs(TreeNode node) {
        if (node == null) return;
        dfs(node.left);
        result.add(node.val);
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

function inorderTraversal(root) {
    const result = [];
    
    function dfs(node) {
        if (!node) return;
        dfs(node.left);
        result.push(node.val);
        dfs(node.right);
    }
    
    dfs(root);
    return result;
}
```

---

## Related Problems

Based on tree traversal and similar algorithmic patterns:

- **[Binary Tree Inorder Traversal](https://leetcode.com/problems/binary-tree-inorder-traversal/)** - The classic inorder traversal problem
- **[Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/)** - Use inorder to validate BST properties
- **[Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/)** - Use inorder to find kth smallest
- **[Binary Search Tree Iterator](https://leetcode.com/problems/binary-search-tree-iterator/)** - Implement iterator using inorder
- **[Inorder Successor in BST](https://leetcode.com/problems/inorder-successor-in-bst/)** - Find next node in inorder sequence
- **[Inorder Predecessor in BST](https://leetcode.com/problems/find-inorder-predecessor-of-given-node-in-bst/)** - Find previous node in inorder sequence
- **[Two Sum IV - Input is a BST](https://leetcode.com/problems/two-sum-iv-input-is-a-bst/)** - Find if two nodes sum to target using inorder
- **[Minimum Absolute Difference in BST](https://leetcode.com/problems/minimum-absolute-difference-in-bst/)** - Find min difference using inorder
- **[Closest Binary Search Tree Value](https://leetcode.com/problems/closest-binary-search-tree-value/)** - Use inorder for closest value search
- **[Recover Binary Search Tree](https://leetcode.com/problems/recover-binary-search-tree/)** - Fix BST using inorder to find errors
- **[Construct Binary Tree from Inorder and Postorder Traversal](https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/)** - Build tree using inorder

---

## Video Tutorial Links

Here are some helpful YouTube tutorials explaining inorder traversal and related concepts:

- **[Binary Tree Inorder Traversal - LeetCode 94](https://www.youtube.com/watch?v=12CsU10u5jU)** - Complete explanation of inorder traversal
- **[Tree Traversals - Inorder, Preorder, Postorder](https://www.youtube.com/watch?v=gm8DUJJhmY4)** - Comprehensive tree traversal guide
- **[Morris Traversal - O(1) Space Tree Traversal](https://www.youtube.com/watch?v=wGXB8O1chGw)** - Advanced Morris traversal explanation
- **[Validate Binary Search Tree](https://www.youtube.com/watch?v=ObNB4vuycXU)** - Using inorder for BST validation
- **[Kth Smallest Element in BST](https://www.youtube.com/watch?v=8ZH8C9C6uqw)** - Advanced inorder application
- **[BST Iterator Implementation](https://www.youtube.com/watch?v=nH9E8dAyF9I)** - Iterator design pattern with inorder

---

## Followup Questions

### Q1: How would you modify inorder traversal to collect values at a specific depth?

**Answer:** Inorder traversal doesn't naturally group by depth. For depth-specific collection, you'd typically use BFS or modify the recursive function to track depth alongside the inorder logic.

```python
def inorder_at_depth(root, target_depth):
    result = []
    
    def dfs(node, depth):
        if not node:
            return
        dfs(node.left, depth + 1)
        if depth == target_depth:
            result.append(node.val)
        dfs(node.right, depth + 1)
    
    dfs(root, 0)
    return result
```

---

### Q2: How can you find the kth smallest element in a BST using inorder traversal?

**Answer:** Perform inorder traversal and stop when you've visited k nodes. The kth visited node is the kth smallest.

```python
def kthSmallest(root, k):
    result = []
    
    def dfs(node):
        if not node or len(result) >= k:
            return
        dfs(node.left)
        if len(result) < k:
            result.append(node.val)
        dfs(node.right)
    
    dfs(root)
    return result[0]  # kth smallest element
```

---

### Q3: How would you implement inorder traversal without recursion or extra space?

**Answer:** Use Morris Traversal (Approach 3 above) which achieves O(1) space by creating temporary threads in the tree structure.

---

### Q4: Can inorder traversal detect if a binary tree is a BST?

**Answer:** Yes. For a valid BST, the inorder traversal must produce a strictly increasing sequence. Track the previously visited value and ensure each subsequent value is greater.

```python
def isValidBST(root):
    prev = None
    
    def inorder(node):
        if not node:
            return True
        if not inorder(node.left):
            return False
        if prev is not None and node.val <= prev:
            return False
        prev = node.val
        return inorder(node.right)
    
    return inorder(root)
```

---

### Q5: How would you handle very large trees where recursion would cause stack overflow?

**Answer:** Use the iterative approach with an explicit stack (Approach 2) or Morris traversal (Approach 3). Both avoid recursion stack limits.

---

### Q6: What modifications are needed for N-ary tree inorder traversal?

**Answer:** N-ary trees don't have a natural inorder definition. You might define it as: traverse all children except the last, visit the node, then traverse the last child. However, this is non-standard and problem-specific.

```python
def nary_inorder(root):
    if not root:
        return []
    result = []
    for child in root.children[:-1]:
        result.extend(nary_inorder(child))
    result.append(root.val)
    if root.children:
        result.extend(nary_inorder(root.children[-1]))
    return result
```

---

### Q7: How would you implement iterative inorder traversal without a stack?

**Answer:** This requires modifying the tree structure temporarily using parent pointers or by restructuring links. Morris traversal provides O(1) space but modifies the tree temporarily.

---

### Q8: How do you find the inorder predecessor and successor in a BST?

**Answer:** The inorder predecessor is the rightmost node in the left subtree (or the nearest ancestor where you came from the right). The successor is the leftmost node in the right subtree.

```python
def inorder_predecessor(root, target):
    pred = None
    current = root
    while current:
        if target.val > current.val:
            pred = current
            current = current.right
        else:
            current = current.left
    return pred

def inorder_successor(root, target):
    succ = None
    current = root
    while current:
        if target.val < current.val:
            succ = current
            current = current.left
        else:
            current = current.right
    return succ
```

---

## Summary

Inorder traversal is a fundamental tree traversal technique with unique properties, especially for binary search trees. Key takeaways:

- **Recursive approach** is most intuitive and commonly used
- **Iterative approach** avoids recursion stack limits
- **Morris traversal** achieves O(1) space for memory-constrained scenarios
- **Order matters**: Left → Root → Right
- **BST superpower**: Produces sorted output for BSTs
- **Understanding traversal** is essential for solving tree problems

This pattern is frequently asked in interviews and forms the foundation for many BST algorithms including validation, searching, finding predecessors/successors, and finding kth smallest elements.

---

## Additional Resources

- [LeetCode Binary Tree Inorder Traversal](https://leetcode.com/problems/binary-tree-inorder-traversal/) - Problem and solutions
- [Tree Traversals - GeeksforGeeks](https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/) - Comprehensive traversal guide
- [Morris Traversal](https://www.geeksforgeeks.org/morris-traversal-linear-time-tree-traversal/) - O(1) space traversal
- [Binary Search Tree Data Structure](https://www.geeksforgeeks.org/binary-search-tree-data-structure/) - BST fundamentals
- [Validate BST - LeetCode Solutions](https://leetcode.com/problems/validate-binary-search-tree/solutions/) - Various approaches for BST validation
