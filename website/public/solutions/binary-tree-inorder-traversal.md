# Binary Tree Inorder Traversal

## Problem Description

Given the root of a binary tree, return the inorder traversal of its nodes' values.

---

## Constraints

- The number of nodes in the tree is in the range [1, 100].
- -100 <= Node.val <= 100

---

## Example 1

**Input:**
```python
root = [1,null,2,3]
```

**Output:**
```python
[1,3,2]
```

**Visual:**
```
    1
     \
      2
     /
    3
```

---

## Example 2

**Input:**
```python
root = []
```

**Output:**
```python
[]
```

---

## Example 3

**Input:**
```python
root = [1]
```

**Output:**
```python
[1]
```

---

## Solution

We use three approaches to solve this problem:

1. **Recursive Inorder Traversal** - Most intuitive and commonly used
2. **Iterative Inorder with Stack** - Uses explicit stack to avoid recursion
3. **Morris Inorder Traversal** - O(1) space using thread creation

---

## Approach 1: Recursive Inorder Traversal

### Algorithm

1. Create a result list to store visited node values
2. Define a recursive helper function that:
   - Returns immediately if node is null (base case)
   - Recursively processes left subtree
   - Adds current node's value to result
   - Recursively processes right subtree
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
 * @param {TreeNode} root
 * @return {number[]}
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

### Algorithm

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
 * @param {TreeNode} root
 * @return {number[]}
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

### Algorithm

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
 * @param {TreeNode} root
 * @return {number[]}
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
|--------|-----------|-------------------|------------------|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(h) | O(h) | O(1) |
| **Implementation** | Simple, elegant | Moderate | Complex |
| **Code Readability** | High | Medium | Low |
| **Stack Overflow Risk** | Yes | Yes | No |
| **Tree Modification** | No | No | Yes (temporary) |
| **Best For** | Balanced trees, interviews | Deep trees, avoiding recursion | Memory-constrained |

**Where:**
- n = number of nodes
- h = height of tree (can be O(n) for skewed tree)

---

## Explanation

### Recursive Approach

The recursive approach is the most straightforward and intuitive. It leverages the natural recursive structure of trees:
1. The function calls itself on the left child
2. After returning from the left subtree, it processes the current node
3. Then it calls itself on the right child

This naturally produces the Left → Root → Right order without any additional state management.

### Iterative Approach

The iterative approach uses an explicit stack to simulate the recursion:
1. We push all left children onto the stack until we reach a leaf
2. When there are no more left children, we pop from the stack
3. We visit the node, then move to its right child
4. Repeat until both stack and current are null

### Morris Traversal

Morris traversal is an advanced technique that achieves O(1) space:
1. When a node has a left subtree, we find its inorder predecessor
2. We create a temporary thread from the predecessor to the current node
3. After processing the left subtree, we follow the thread back to the current node
4. We then process the right subtree

---

## Related Problems

- [Binary Tree Preorder Traversal](https://leetcode.com/problems/binary-tree-preorder-traversal/)
- [Binary Tree Postorder Traversal](https://leetcode.com/problems/binary-tree-postorder-traversal/)
- [Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/)
- [Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/)
- [Binary Search Tree Iterator](https://leetcode.com/problems/binary-search-tree-iterator/)

---

## Video Tutorials

- [Binary Tree Inorder Traversal - LeetCode 94](https://www.youtube.com/watch?v=12CsU10u5jU)
- [Tree Traversals - Inorder, Preorder, Postorder](https://www.youtube.com/watch?v=gm8DUJJhmY4)
- [Morris Traversal - O(1) Space Tree Traversal](https://www.youtube.com/watch?v=wGXB8O1chGw)
