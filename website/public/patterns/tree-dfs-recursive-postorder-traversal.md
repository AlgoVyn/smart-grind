# Tree DFS - Recursive Postorder Traversal

## Overview

Postorder traversal is a fundamental depth-first search (DFS) approach that visits the **left subtree first**, then the **right subtree**, and finally the **root node**. This traversal is particularly valuable for operations that need to process child nodes before their parent, such as tree deletion, evaluating expressions, and computing subtree properties.

The traversal order is: **Left → Right → Root**

**Key Benefits:**
- **Bottom-Up Processing**: Children are processed before parents, ideal for operations like deletion or summary calculations
- **Expression Trees**: Produces postfix (Reverse Polish) notation for mathematical expressions
- **Subtree Operations**: Efficient for computing subtree sums, heights, or other aggregate properties
- **Cleanup Operations**: Natural fit for deallocating memory or releasing resources

---

## Intuition

### Core Concept

The intuition behind postorder traversal stems from the "children first, parent last" philosophy. This approach:
1. Explore all left descendants first (deeper left exploration)
2. Explore all right descendants (completion of children)
3. Process the current node (after all children are handled)

### Why Postorder?

**Postorder traversal is optimal when:**
- **Tree Deletion**: Must delete children before parent to avoid dangling pointers
- **Expression Evaluation**: Postfix notation is easier to evaluate with a stack
- **Subtree Calculations**: Computing sums, products, or properties of subtrees before combining
- **Bottom-Up DP**: When solution depends on children's solutions (post-order for DP on trees)
- **File System Operations**: Process directories (children) before the directory itself

### Key Observations

1. **Children First**: Both left and right subtrees are completely processed before the root
2. **Root Last**: The root node is visited only after both children are fully processed
3. **Recursive Pattern**: Each subtree follows the same Left → Right → Root pattern
4. **Base Case**: Empty nodes (null) terminate recursion
5. **Evaluation Order**: For expression trees, produces evaluable postfix notation

### Visual Representation

```
       A                    Visit Order: D, E, B, F, C, A
      / \                  
     B   C                 
    / \ / \               
   D  E F G               
```

**Traversal Steps:**
1. Go left to B, then left to D
2. D has no children, visit D
3. Back to D, no right, back to B
4. Go right to E, visit E
5. Back to E, no right, back to B
6. B has no more children, visit B
7. Back to A, go right to C
8. Go left to F, visit F
9. Back to F, no right, back to C
10. Visit C
11. Result: [D, E, B, F, C, A]

---

## Multiple Approaches with Code

We'll cover three main approaches:

1. **Recursive Postorder** - Most intuitive and commonly used
2. **Iterative Postorder with Stack** - Uses explicit stack to avoid recursion
3. **Morris Postorder Traversal** - O(1) space using thread creation

---

## Approach 1: Recursive Postorder Traversal

This is the most straightforward approach using recursion. The function calls itself on left child, then on right child, then processes the node.

### Algorithm Steps

1. Create a result list to store visited node values
2. Define a recursive helper function `dfs(node)`:
   - If node is null, return (base case)
   - Recursively call `dfs(node.left)` (traverse left)
   - Recursively call `dfs(node.right)` (traverse right)
   - Add node.val to result (visit root)
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
    def postorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        """
        Perform postorder traversal of a binary tree.
        
        Args:
            root: Root node of the binary tree
            
        Returns:
            List of node values in postorder (left, right, root) order
        """
        result = []
        
        def dfs(node: Optional[TreeNode]) -> None:
            """Helper function for recursive DFS traversal."""
            if not node:
                return
            
            # Traverse left subtree
            dfs(node.left)
            
            # Traverse right subtree
            dfs(node.right)
            
            # Visit the root node
            result.append(node.val)
        
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
    vector<int> postorderTraversal(TreeNode* root) {
        /**
         * Perform postorder traversal of a binary tree.
         * 
         * Args:
         *     root: Root node of the binary tree
         * 
         * Returns:
         *     Vector of node values in postorder (left, right, root) order
         */
        vector<int> result;
        
        function<void(TreeNode*)> dfs = [&](TreeNode* node) {
            if (!node) {
                return;
            }
            
            // Traverse left subtree
            dfs(node->left);
            
            // Traverse right subtree
            dfs(node->right);
            
            // Visit the root node
            result.push_back(node->val);
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
    
    public List<Integer> postorderTraversal(TreeNode root) {
        /**
         * Perform postorder traversal of a binary tree.
         * 
         * Args:
         *     root: Root node of the binary tree
         * 
         * Returns:
         *     List of node values in postorder (left, right, root) order
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
        
        // Traverse right subtree
        dfs(node.right);
        
        // Visit the root node
        result.add(node.val);
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
 * Perform postorder traversal of a binary tree.
 * 
 * @param {TreeNode} root - Root node of the binary tree
 * @return {number[]} - Array of node values in postorder (left, right, root) order
 */
var postorderTraversal = function(root) {
    const result = [];
    
    function dfs(node) {
        if (!node) {
            return;
        }
        
        // Traverse left subtree
        dfs(node.left);
        
        // Traverse right subtree
        dfs(node.right);
        
        // Visit the root node
        result.push(node.val);
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

## Approach 2: Iterative Postorder with Stack

This approach uses an explicit stack to simulate the recursion, avoiding potential stack overflow for very deep trees while maintaining the same traversal order.

### Algorithm Steps

1. Initialize an empty stack and result list
2. Use a previous pointer to track the last visited node
3. Push root onto stack, then iterate while stack is not empty:
   - Peek at current node
   - If current has unvisited children (left/right), push them
   - Otherwise, add current's value to result and pop
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
    def postorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        """
        Perform postorder traversal using iterative approach with stack.
        
        Args:
            root: Root node of the binary tree
            
        Returns:
            List of node values in postorder (left, right, root) order
        """
        if not root:
            return []
        
        result = []
        stack = []
        current = root
        last_visited = None
        
        while stack or current:
            # Go to the leftmost node
            if current:
                stack.append(current)
                current = current.left
            else:
                # Peek at the stack
                peek = stack[-1]
                # If right child exists and hasn't been visited, go right
                if peek.right and last_visited != peek.right:
                    current = peek.right
                else:
                    # Visit the node
                    result.append(peek.val)
                    last_visited = stack.pop()
        
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
    vector<int> postorderTraversal(TreeNode* root) {
        /**
         * Perform postorder traversal using iterative approach with stack.
         * 
         * Args:
         *     root: Root node of the binary tree
         * 
         * Returns:
         *     Vector of node values in postorder (left, right, root) order
         */
        if (!root) {
            return {};
        }
        
        vector<int> result;
        stack<TreeNode*> st;
        TreeNode* current = root;
        TreeNode* last_visited = nullptr;
        
        while (!st.empty() || current) {
            // Go to the leftmost node
            if (current) {
                st.push(current);
                current = current->left;
            } else {
                // Peek at the stack
                TreeNode* peek = st.top();
                // If right child exists and hasn't been visited, go right
                if (peek->right && last_visited != peek->right) {
                    current = peek->right;
                } else {
                    // Visit the node
                    result.push_back(peek->val);
                    last_visited = st.top();
                    st.pop();
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
    public List<Integer> postorderTraversal(TreeNode root) {
        /**
         * Perform postorder traversal using iterative approach with stack.
         * 
         * Args:
         *     root: Root node of the binary tree
         * 
         * Returns:
         *     List of node values in postorder (left, right, root) order
         */
        if (root == null) {
            return new ArrayList<>();
        }
        
        List<Integer> result = new ArrayList<>();
        Stack<TreeNode> stack = new Stack<>();
        TreeNode current = root;
        TreeNode lastVisited = null;
        
        while (!stack.isEmpty() || current != null) {
            // Go to the leftmost node
            if (current != null) {
                stack.push(current);
                current = current.left;
            } else {
                // Peek at the stack
                TreeNode peek = stack.peek();
                // If right child exists and hasn't been visited, go right
                if (peek.right != null && lastVisited != peek.right) {
                    current = peek.right;
                } else {
                    // Visit the node
                    result.add(peek.val);
                    lastVisited = stack.pop();
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
 * Perform postorder traversal using iterative approach with stack.
 * 
 * @param {TreeNode} root - Root node of the binary tree
 * @return {number[]} - Array of node values in postorder (left, right, root) order
 */
var postorderTraversal = function(root) {
    if (!root) {
        return [];
    }
    
    const result = [];
    const stack = [];
    let current = root;
    let lastVisited = null;
    
    while (stack.length > 0 || current) {
        // Go to the leftmost node
        if (current) {
            stack.push(current);
            current = current.left;
        } else {
            // Peek at the stack
            const peek = stack[stack.length - 1];
            // If right child exists and hasn't been visited, go right
            if (peek.right && lastVisited !== peek.right) {
                current = peek.right;
            } else {
                // Visit the node
                result.push(peek.val);
                lastVisited = stack.pop();
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
| **Time** | O(n) - Each node is visited exactly once |
| **Space** | O(h) - Stack stores at most tree height (h), where h can be O(n) for skewed trees |

---

## Approach 3: Two-Stack Iterative Postorder

This elegant approach uses two stacks to achieve postorder traversal. The first stack reverses the order, and the second stack restores it to postorder.

### Algorithm Steps

1. Initialize two empty stacks
2. Push root onto first stack
3. While first stack is not empty:
   - Pop from first stack and push onto second stack
   - Push left child to first stack (if exists)
   - Push right child to first stack (if exists)
4. While second stack is not empty:
   - Pop from second stack and add value to result
5. Return the result list

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
    def postorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        """
        Perform postorder traversal using two stacks approach.
        
        Args:
            root: Root node of the binary tree
            
        Returns:
            List of node values in postorder (left, right, root) order
        """
        if not root:
            return []
        
        result = []
        stack1 = [root]
        stack2 = []
        
        while stack1:
            node = stack1.pop()
            stack2.append(node)
            
            # Push left child first so right is processed before root
            if node.left:
                stack1.append(node.left)
            if node.right:
                stack1.append(node.right)
        
        # Pop from stack2 to get postorder sequence
        while stack2:
            result.append(stack2.pop().val)
        
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
    vector<int> postorderTraversal(TreeNode* root) {
        /**
         * Perform postorder traversal using two stacks approach.
         * 
         * Args:
         *     root: Root node of the binary tree
         * 
         * Returns:
         *     Vector of node values in postorder (left, right, root) order
         */
        if (!root) {
            return {};
        }
        
        vector<int> result;
        stack<TreeNode*> st1;
        stack<TreeNode*> st2;
        st1.push(root);
        
        while (!st1.empty()) {
            TreeNode* node = st1.top();
            st1.pop();
            st2.push(node);
            
            // Push left child first so right is processed before root
            if (node->left) {
                st1.push(node->left);
            }
            if (node->right) {
                st1.push(node->right);
            }
        }
        
        // Pop from stack2 to get postorder sequence
        while (!st2.empty()) {
            result.push_back(st2.top()->val);
            st2.pop();
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
    public List<Integer> postorderTraversal(TreeNode root) {
        /**
         * Perform postorder traversal using two stacks approach.
         * 
         * Args:
         *     root: Root node of the binary tree
         * 
         * Returns:
         *     List of node values in postorder (left, right, root) order
         */
        if (root == null) {
            return new ArrayList<>();
        }
        
        List<Integer> result = new ArrayList<>();
        Stack<TreeNode> stack1 = new Stack<>();
        Stack<TreeNode> stack2 = new Stack<>();
        stack1.push(root);
        
        while (!stack1.isEmpty()) {
            TreeNode node = stack1.pop();
            stack2.push(node);
            
            // Push left child first so right is processed before root
            if (node.left != null) {
                stack1.push(node.left);
            }
            if (node.right != null) {
                stack1.push(node.right);
            }
        }
        
        // Pop from stack2 to get postorder sequence
        while (!stack2.isEmpty()) {
            result.add(stack2.pop().val);
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
 * Perform postorder traversal using two stacks approach.
 * 
 * @param {TreeNode} root - Root node of the binary tree
 * @return {number[]} - Array of node values in postorder (left, right, root) order
 */
var postorderTraversal = function(root) {
    if (!root) {
        return [];
    }
    
    const result = [];
    const stack1 = [root];
    const stack2 = [];
    
    while (stack1.length > 0) {
        const node = stack1.pop();
        stack2.push(node);
        
        // Push left child first so right is processed before root
        if (node.left) {
            stack1.push(node.left);
        }
        if (node.right) {
            stack1.push(node.right);
        }
    }
    
    // Pop from stack2 to get postorder sequence
    while (stack2.length > 0) {
        result.push(stack2.pop().val);
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each node is visited exactly once |
| **Space** | O(n) - Two stacks store up to n nodes |

---

## Comparison of Approaches

| Aspect | Recursive | Single Stack | Two Stacks |
|--------|-----------|--------------|------------|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(h) | O(h) | O(n) |
| **Implementation** | Simple, elegant | Moderate | Simple |
| **Code Readability** | High | Medium | High |
| **Stack Overflow Risk** | Yes | Yes | Yes |
| **Tree Modification** | No | No | No |
| **Best For** | Balanced trees, interviews | General use | Simplicity |

**Where:**
- n = number of nodes
- h = height of tree (can be O(n) for skewed tree)

---

## Why These Approaches Work

### Recursive Approach

The recursive approach naturally mirrors the tree's recursive structure. The order of recursive calls (left first, then right, then visit) ensures postorder traversal. The call stack implicitly manages the traversal state.

### Single Stack Iterative Approach

The single stack approach mimics the recursive call stack using explicit state tracking. By tracking the last visited node, we know when to process the current node (after both children are done).

### Two-Stack Approach

The two-stack approach cleverly reverses the traversal order. The first stack performs a modified pre-order (root → right → left), and the second stack reverses this to get postorder (left → right → root).

All three approaches fundamentally perform the same traversal but differ in how they manage the traversal state:
- **Recursive**: Uses call stack implicitly
- **Single Stack**: Uses explicit stack with state tracking
- **Two Stacks**: Uses reversal property for postorder

---

## Common Pitfalls

1. **Wrong Order**: Remember the exact order is Left → Right → Root (not Root → Left → Right or Left → Root → Right)

2. **Recursion Depth Limit**: For very deep trees, recursion might exceed stack limit. Use iterative approach.

3. **Forgetting Base Case**: Always check for null nodes to prevent infinite recursion.

4. **Incorrect Iteration Logic**: In iterative approach, ensure you only visit a node after both children are processed.

5. **Not Collecting Results Properly**: Ensure the result list is accessible within the recursive function scope.

6. **Null Root Handling**: Always handle the case where root is null/empty.

7. **Expression Tree Confusion**: Remember postorder for expression trees produces postfix notation, which is evaluated from left to right.

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

def postorder_traversal(root: Optional[TreeNode]) -> List[int]:
    result = []
    
    def dfs(node: Optional[TreeNode]) -> None:
        if not node:
            return
        dfs(node.left)           # Traverse left
        dfs(node.right)          # Traverse right
        result.append(node.val)   # Visit root
    
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
    vector<int> postorderTraversal(TreeNode* root) {
        vector<int> result;
        
        function<void(TreeNode*)> dfs = [&](TreeNode* node) {
            if (!node) return;
            dfs(node->left);
            dfs(node->right);
            result.push_back(node->val);
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
    
    public List<Integer> postorderTraversal(TreeNode root) {
        dfs(root);
        return result;
    }
    
    private void dfs(TreeNode node) {
        if (node == null) return;
        dfs(node.left);
        dfs(node.right);
        result.add(node.val);
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

function postorderTraversal(root) {
    const result = [];
    
    function dfs(node) {
        if (!node) return;
        dfs(node.left);
        dfs(node.right);
        result.push(node.val);
    }
    
    dfs(root);
    return result;
}
```

---

## Related Problems

Based on tree traversal and similar algorithmic patterns:

- **[Binary Tree Postorder Traversal](https://leetcode.com/problems/binary-tree-postorder-traversal/)** - The classic postorder traversal problem
- **[Delete Nodes And Return Forest](https://leetcode.com/problems/delete-nodes-and-return-forest/)** - Delete nodes and return forest using postorder
- **[Binary Tree Postorder Traversal (Hard)](https://leetcode.com/problems/binary-tree-postorder-traversal/)** - Hard version with constraints
- **[Construct Binary Tree from Inorder and Postorder Traversal](https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/)** - Build tree using postorder
- **[Evaluate Reverse Polish Notation](https://leetcode.com/problems/evaluate-reverse-polish-notation/)** - Evaluate postfix expressions
- **[Flatten Binary Tree to Linked List](https://leetcode.com/problems/flatten-binary-tree-to-linked-list/)** - Use postorder to flatten tree
- **[Most Stones Removed with Same Row or Column](https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/)** - Graph problem using DFS postorder
- **[Number of Good Leaf Nodes Pairs](https://leetcode.com/problems/number-of-good-leaf-nodes-pairs/)** - Postorder for counting leaf pairs
- **[Tree Diameter](https://leetcode.com/problems/diameter-of-binary-tree/)** - Postorder for computing diameter
- **[Maximum Product of Splitted Binary Tree](https://leetcode.com/problems/maximum-product-of-splitted-binary-tree/)** - Postorder for subtree sums

---

## Video Tutorial Links

Here are some helpful YouTube tutorials explaining postorder traversal and related concepts:

- **[Binary Tree Postorder Traversal - LeetCode 145](https://www.youtube.com/watch?v=4LdxnY_lF8I)** - Complete explanation of postorder traversal
- **[Tree Traversals - Inorder, Preorder, Postorder](https://www.youtube.com/watch?v=gm8DUJJhmY4)** - Comprehensive tree traversal guide
- **[Postorder Traversal - Iterative Approach](https://www.youtube.com/watch?v=0jnoJ1Y_N8c)** - Iterative postorder explanation
- **[Two Stack Method for Postorder](https://www.youtube.com/watch?v=qT55K4iX0wI)** - Two-stack approach explained
- **[Flatten Binary Tree to Linked List](https://www.youtube.com/watch?v=vytDy2C12G8)** - Postorder application
- **[Tree Problems - DFS Postorder](https://www.youtube.com/watch?v=nKLDqE6q0qY)** - Advanced postorder problems
- **[Expression Tree and Postfix Notation](https://www.youtube.com/watch?v=US3qC7b0NQQ)** - Postorder for expression evaluation

---

## Followup Questions

### Q1: How would you compute the height of a binary tree using postorder traversal?

**Answer:** Postorder is ideal for computing height since we need the height of children before computing the parent's height.

```python
def treeHeight(root):
    if not root:
        return 0
    
    left_height = treeHeight(root.left)
    right_height = treeHeight(root.right)
    
    return max(left_height, right_height) + 1
```

---

### Q2: How can you delete an entire binary tree efficiently?

**Answer:** Use postorder traversal to delete children before the parent to avoid dangling pointers.

```python
def deleteTree(root):
    if not root:
        return None
    
    deleteTree(root.left)
    deleteTree(root.right)
    del root
    
    return None
```

---

### Q3: How would you find the diameter (longest path) of a binary tree?

**Answer:** The diameter can pass through the root or be entirely within a subtree. Use postorder to compute heights.

```python
def diameterOfBinaryTree(root):
    self.max_diameter = 0
    
    def dfs(node):
        if not node:
            return 0
        
        left_height = dfs(node.left)
        right_height = dfs(node.right)
        
        # Update diameter (may pass through this node)
        self.max_diameter = max(self.max_diameter, left_height + right_height)
        
        return max(left_height, right_height) + 1
    
    dfs(root)
    return self.max_diameter
```

---

### Q4: How do you evaluate a postfix expression using a stack?

**Answer:** Postorder traversal produces postfix notation. Evaluate by pushing operands and applying operators.

```python
def evalPostfix(expr):
    stack = []
    operators = {'+', '-', '*', '/'}
    
    for token in expr:
        if token not in operators:
            stack.append(int(token))
        else:
            right = stack.pop()
            left = stack.pop()
            if token == '+':
                stack.append(left + right)
            elif token == '-':
                stack.append(left - right)
            elif token == '*':
                stack.append(left * right)
            elif token == '/':
                stack.append(int(left / right))
    
    return stack[0]
```

---

### Q5: How would you check if two binary trees are identical?

**Answer:** Use postorder to compare subtrees before comparing nodes.

```python
def isSameTree(p, q):
    if not p and not q:
        return True
    if not p or not q:
        return False
    
    left_same = isSameTree(p.left, q.left)
    right_same = isSameTree(p.right, q.right)
    
    return left_same and right_same and p.val == q.val
```

---

### Q6: How can you serialize a binary tree to a string using postorder?

**Answer:** Postorder serialization captures subtree information before the node.

```python
def serialize(root):
    if not root:
        return ""
    
    left = serialize(root.left)
    right = serialize(root.right)
    
    return f"{left},{right},{root.val}"
```

---

### Q7: How would you find all root-to-leaf paths in a binary tree?

**Answer:** Use postorder with path accumulation to build paths from leaves to root.

```python
def findLeaves(root):
    result = []
    
    def dfs(node):
        if not node:
            return -1  # Height of null node
        
        left_height = dfs(node.left)
        right_height = dfs(node.right)
        
        current_height = max(left_height, right_height) + 1
        
        if len(result) <= current_height:
            result.append([])
        
        result[current_height].append(node.val)
        
        return current_height
    
    dfs(root)
    return result
```

---

### Q8: How do you compute the sum of all left leaves in a binary tree?

**Answer:** Postorder traversal helps identify and sum left leaf nodes.

```python
def sumOfLeftLeaves(root):
    def dfs(node, is_left):
        if not node:
            return 0
        
        if not node.left and not node.right:
            return node.val if is_left else 0
        
        return dfs(node.left, True) + dfs(node.right, False)
    
    return dfs(root, False)
```

---

## Summary

Postorder traversal is a fundamental tree traversal technique with unique properties. Key takeaways:

- **Recursive approach** is most intuitive and commonly used
- **Iterative approach** avoids recursion stack limits
- **Two-stack approach** provides a simple alternative
- **Order matters**: Left → Right → Root
- **Children first**: Ideal for deletion, expression evaluation, and subtree calculations
- **Understanding traversal** is essential for solving complex tree problems

This pattern is frequently asked in interviews and forms the foundation for many tree algorithms including deletion, expression evaluation, and computing subtree properties.

---

## Additional Resources

- [LeetCode Binary Tree Postorder Traversal](https://leetcode.com/problems/binary-tree-postorder-traversal/) - Problem and solutions
- [Tree Traversals - GeeksforGeeks](https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/) - Comprehensive traversal guide
- [Postorder Traversal - InterviewBit](https://www.interviewbit.com/tutorial/postorder-traversal/) - Interview-focused explanation
- [Binary Tree Problems - LeetCode](https://leetcode.com/explore/learn/card/data-structure-tree/) - Tree data structure exploration
- [Expression Trees - GeeksforGeeks](https://www.geeksforgeeks.org/expression-tree/) - Expression tree applications
