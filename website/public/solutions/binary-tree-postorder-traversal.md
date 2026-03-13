# Binary Tree Postorder Traversal

## Pattern:

This problem is solved using the **[Tree DFS - Recursive Postorder Traversal](/patterns/tree-dfs-recursive-postorder-traversal)** pattern.

---

## Problem Description

Given the root of a binary tree, return the postorder traversal of its nodes' values.

Postorder traversal visits nodes in the order: **Left → Right → Root**

**Link to problem:** [Binary Tree Postorder Traversal - LeetCode 145](https://leetcode.com/problems/binary-tree-postorder-traversal/)

---

## Examples

### Example

**Input:**
```
root = [1,null,2,3]
```

**Output:**
```
[3,2,1]
```

**Explanation:** 
- Visit left subtree (null, skip)
- Visit right subtree: 2 → 3 → root: 1
- Final: [3, 2, 1]

### Example 2

**Input:**
```
root = [1,2,3,4,5,null,8,null,null,6,7,9]
```

**Output:**
```
[4,6,7,5,2,9,8,3,1]
```

**Explanation:** The tree structure produces postorder: 4,6,7,5,2,9,8,3,1

### Example 3

**Input:**
```
root = []
```

**Output:**
```
[]
```

### Example 4

**Input:**
```
root = [1]
```

**Output:**
```
[1]
```

---

## Constraints

- The number of the nodes in the tree is in the range `[0, 100]`.
- `-100 <= Node.val <= 100`

---

## Follow up

Recursive solution is trivial, could you do it iteratively?

---

## Intuition

The key insight is understanding the traversal order:

1. **Recursive**: Visit left, then right, then root - this is the natural definition of postorder
2. **Iterative**: We need to simulate the recursion using a stack, or use a modified approach

For the iterative solution:
- We can use a "visited" flag or track the last processed node
- The idea is to simulate the recursive call stack

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Recursive (Simplest)** - O(n) time, O(h) space
2. **Iterative with Stack (Modified Preorder)** - O(n) time, O(n) space
3. **Iterative with Two Stacks** - O(n) time, O(n) space

---

## Approach 1: Recursive (Simplest)

The recursive approach directly implements the postorder definition.

### Algorithm Steps

1. If node is null, return empty list
2. Recursively traverse left subtree
3. Recursively traverse right subtree
4. Process current node (add to result)

### Why It Works

The call stack naturally handles the order: left and right are fully processed before the root.

### Code Implementation

````carousel
```python
from typing import List, Optional

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def postorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        """
        Perform postorder traversal recursively.
        
        Args:
            root: Root of binary tree
            
        Returns:
            List of node values in postorder
        """
        result = []
        
        def traverse(node):
            if not node:
                return
            
            # Left -> Right -> Root
            traverse(node.left)
            traverse(node.right)
            result.append(node.val)
        
        traverse(root)
        return result
```

<!-- slide -->
```cpp
#include <vector>
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
private:
    void traverse(TreeNode* node, vector<int>& result) {
        if (!node) return;
        
        // Left -> Right -> Root
        traverse(node->left, result);
        traverse(node->right, result);
        result.push_back(node->val);
    }
    
public:
    vector<int> postorderTraversal(TreeNode* root) {
        vector<int> result;
        traverse(root, result);
        return result;
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
    public List<Integer> postorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        traverse(root, result);
        return result;
    }
    
    private void traverse(TreeNode node, List<Integer> result) {
        if (node == null) return;
        
        // Left -> Right -> Root
        traverse(node.left, result);
        traverse(node.right, result);
        result.add(node.val);
    }
}
```

<!-- slide -->
```javascript
// Definition for a binary tree node.
function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
}

/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var postorderTraversal = function(root) {
    const result = [];
    
    function traverse(node) {
        if (!node) return;
        
        // Left -> Right -> Root
        traverse(node.left);
        traverse(node.right);
        result.push(node.val);
    }
    
    traverse(root);
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Visit each node exactly once |
| **Space** | O(h) - Recursion stack depth equals tree height |

---

## Approach 2: Iterative - Modified Preorder

This clever approach modifies preorder traversal to achieve postorder.

### Algorithm Steps

1. Use a stack for DFS
2. Do "reverse preorder": Root → Right → Left instead of Root → Left → Right
3. Reverse the result at the end

### Why It Works

- Preorder: Root → Left → Right
- If we do Root → Right → Left, then reverse, we get Left → Right → Root (postorder!)

### Code Implementation

````carousel
```python
from typing import List, Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def postorderTraversal_iterative(self, root: Optional[TreeNode]) -> List[int]:
        """
        Perform postorder traversal iteratively using modified preorder.
        
        Args:
            root: Root of binary tree
            
        Returns:
            List of node values in postorder
        """
        if not root:
            return []
        
        stack = [root]
        result = []
        
        # Modified preorder: Root -> Right -> Left
        while stack:
            node = stack.pop()
            result.append(node.val)
            
            # Push left first, then right (so right is processed first)
            if node.left:
                stack.append(node.left)
            if node.right:
                stack.append(node.right)
        
        # Reverse to get Left -> Right -> Root (postorder)
        return result[::-1]
```

<!-- slide -->
```cpp
#include <vector>
#include <stack>
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
    vector<int> postorderTraversal(TreeNode* root) {
        if (!root) return {};
        
        vector<int> result;
        stack<TreeNode*> st;
        st.push(root);
        
        // Modified preorder: Root -> Right -> Left
        while (!st.empty()) {
            TreeNode* node = st.top();
            st.pop();
            result.push_back(node->val);
            
            if (node->left) st.push(node->left);
            if (node->right) st.push(node->right);
        }
        
        // Reverse to get postorder
        reverse(result.begin(), result.end());
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public List<Integer> postorderTraversal(TreeNode root) {
        if (root == null) return new ArrayList<>();
        
        List<Integer> result = new ArrayList<>();
        Stack<TreeNode> stack = new Stack<>();
        stack.push(root);
        
        // Modified preorder: Root -> Right -> Left
        while (!stack.isEmpty()) {
            TreeNode node = stack.pop();
            result.add(node.val);
            
            if (node.left != null) stack.push(node.left);
            if (node.right != null) stack.push(node.right);
        }
        
        // Reverse to get postorder
        Collections.reverse(result);
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var postorderTraversal = function(root) {
    if (!root) return [];
    
    const result = [];
    const stack = [root];
    
    // Modified preorder: Root -> Right -> Left
    while (stack.length > 0) {
        const node = stack.pop();
        result.push(node.val);
        
        if (node.left) stack.push(node.left);
        if (node.right) stack.push(node.right);
    }
    
    // Reverse to get postorder
    return result.reverse();
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each node visited twice (push + reverse) |
| **Space** | O(n) - Stack stores up to n nodes |

---

## Approach 3: Iterative with Two Stacks

This approach uses two stacks for clarity in understanding.

### Algorithm Steps

1. Use first stack for traversal
2. Use second stack to store processed nodes
3. Pop from first stack, push children to first stack, push node to second stack
4. Pop all from second stack to get postorder

### Code Implementation

````carousel
```python
from typing import List, Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def postorderTraversal_two_stacks(self, root: Optional[TreeNode]) -> List[int]:
        """
        Perform postorder traversal using two stacks.
        """
        if not root:
            return []
        
        stack1 = [root]
        stack2 = []
        
        # First stack: traverse
        while stack1:
            node = stack1.pop()
            stack2.append(node)
            
            if node.left:
                stack1.append(node.left)
            if node.right:
                stack1.append(node.right)
        
        # Second stack: get postorder
        result = []
        while stack2:
            result.append(stack2.pop().val)
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <stack>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    vector<int> postorderTraversal(TreeNode* root) {
        if (!root) return {};
        
        vector<int> result;
        stack<TreeNode*> st1, st2;
        st1.push(root);
        
        while (!st1.empty()) {
            TreeNode* node = st1.top();
            st1.pop();
            st2.push(node);
            
            if (node->left) st1.push(node->left);
            if (node->right) st1.push(node->right);
        }
        
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
class Solution {
    public List<Integer> postorderTraversal(TreeNode root) {
        if (root == null) return new ArrayList<>();
        
        List<Integer> result = new ArrayList<>();
        Stack<TreeNode> st1 = new Stack<>();
        Stack<TreeNode> st2 = new Stack<>();
        st1.push(root);
        
        while (!st1.isEmpty()) {
            TreeNode node = st1.pop();
            st2.push(node);
            
            if (node.left != null) st1.push(node.left);
            if (node.right != null) st1.push(node.right);
        }
        
        while (!st2.isEmpty()) {
            result.add(st2.pop().val);
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
var postorderTraversal = function(root) {
    if (!root) return [];
    
    const result = [];
    const st1 = [root];
    const st2 = [];
    
    while (st1.length > 0) {
        const node = st1.pop();
        st2.push(node);
        
        if (node.left) st1.push(node.left);
        if (node.right) st1.push(node.right);
    }
    
    while (st2.length > 0) {
        result.push(st2.pop().val);
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each node visited once |
| **Space** | O(n) - Two stacks store up to n nodes |

---

## Comparison of Approaches

| Aspect | Recursive | Modified Preorder | Two Stacks |
|--------|-----------|-------------------|------------|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(h) | O(n) | O(n) |
| **Implementation** | Simplest | Clever | Clear |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Best For** | Most cases | Memory efficient | Understanding |

**Best Approach:** The recursive approach is simplest and most commonly used.

---

## Related Problems

### Same Pattern (Tree Traversals)

| Problem | LeetCode Link | Difficulty | Description |
|---------|---------------|------------|-------------|
| Binary Tree Inorder Traversal | [Link](https://leetcode.com/problems/binary-tree-inorder-traversal/) | Easy | Left → Root → Right |
| Binary Tree Preorder Traversal | [Link](https://leetcode.com/problems/binary-tree-preorder-traversal/) | Easy | Root → Left → Right |
| N-ary Tree Postorder Traversal | [Link](https://leetcode.com/problems/n-ary-tree-postorder-traversal/) | Easy | Children → Root |

### Similar Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Validate Binary Search Tree | [Link](https://leetcode.com/problems/validate-binary-search-tree/) | Uses inorder |
| Binary Tree Level Order | [Link](https://leetcode.com/problems/binary-tree-level-order-traversal/) | BFS |
| Path Sum | [Link](https://leetcode.com/problems/path-sum/) | DFS traversal |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - Binary Tree Postorder Traversal](https://www.youtube.com/watch?v=8hQPLSSjkMY)** - Clear explanation with visual examples

2. **[Back to Back SWE - Postorder Traversal](https://www.youtube.com/watch?v=8Q1nQkVGYQ8)** - Detailed iterative approach

3. **[LeetCode Official Solution](https://www.youtube.com/watch?v=0lGNeO7xW7k)** - Official problem solution

4. **[Tree Traversals Explained](https://www.youtube.com/watch?v=8jP8CCrj8cI)** - All three traversals explained

---

## Follow-up Questions

### Q1: How would you implement Morris Postorder Traversal (O(1) space)?

**Answer:** Use the threaded binary tree technique. Temporarily modify the tree to create connections to predecessor nodes, then restore the tree after traversal. This is complex but achieves O(1) auxiliary space.

---

### Q2: How would you handle a very deep tree (like a linked list)?

**Answer:** Use the iterative approach to avoid stack overflow. Both the modified preorder and two-stack approaches work fine with deep trees.

---

### Q3: Can you do it with only one stack?

**Answer:** Yes! Track the last visited node. If current node's right was just processed (or is null), process current node. Otherwise, push right child first, then current node.

---

### Q4: How would you extend this to N-ary trees?

**Answer:** The same logic applies - visit all children first, then the node. For iterative, push all children to the stack instead of just two.

---

### Q5: What are practical applications of postorder traversal?

**Answer:**
- Deleting/freeing tree nodes (children before parent)
- Computing directory sizes (bottom-up)
- Expression tree evaluation (operations after operands)
- Finding dependencies (process dependencies first)

---

### Q6: How would you modify for a threaded binary tree?

**Answer:** Use Morris traversal which creates temporary links to predecessors, allowing O(1) space traversal without stack or recursion.

---

### Q7: What edge cases should be tested?

**Answer:**
- Empty tree (null root)
- Single node tree
- Skewed tree (all left or all right children)
- Complete binary tree
- Tree with duplicate values

---

### Q8: How would you combine with other tree algorithms?

**Answer:** Postorder is often combined with other traversals. For example, compute children's results first, then combine at parent - common in DP on trees.

---

## Common Pitfalls

### 1. Wrong Order
**Issue**: Getting preorder instead of postorder.

**Solution**: Remember: Left → Right → Root. The root is processed LAST.

### 2. Stack Overflow
**Issue**: Recursive solution fails on deep trees.

**Solution**: Use iterative approach for deep trees.

### 3. Missing Null Checks
**Issue**: Not handling null nodes properly.

**Solution**: Always check for null before accessing children.

### 4. Forgetting Reverse
**Issue**: Modified preorder gives wrong order.

**Solution**: Don't forget to reverse the result at the end.

---

## Summary

The **Binary Tree Postorder Traversal** problem demonstrates fundamental tree traversal concepts:

- **Recursive**: Natural and simple
- **Iterative**: Multiple clever approaches
- **Order**: Left → Right → Root

Key takeaways:
- **Three approaches**: Recursive, modified preorder, two stacks
- **Postorder**: Root comes LAST
- **Applications**: Tree deletion, expression evaluation

Understanding all three traversals (preorder, inorder, postorder) is essential for tree problems.

### Pattern Summary

This problem exemplifies the **Tree DFS - Postorder Traversal** pattern, characterized by:
- Processing children before parent
- Multiple implementation approaches
- Important for tree manipulation problems

For more details on tree patterns, see the **[Tree DFS](/algorithms/tree-dfs)** section.
