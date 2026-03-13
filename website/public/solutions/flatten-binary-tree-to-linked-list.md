# Flatten Binary Tree to Linked List

## Problem Description

Given the root of a binary tree, flatten the tree into a "linked list":
- The "linked list" should use the same TreeNode class where the right child pointer points to the next node in the list and the left child pointer is always null.
- The "linked list" should be in the same order as a pre-order traversal of the binary tree.

**Note:** This is LeetCode Problem 114. You can find the original problem [here](https://leetcode.com/problems/flatten-binary-tree-to-linked-list/).

---

## Examples

### Example

**Input:** 
```python
root = [1,2,5,3,4,null,6]
```

**Output:** 
```python
[1,null,2,null,3,null,4,null,5,null,6]
```

**Explanation:**
```
    1
   / \
  2   5
 / \   \
3   4   6

Flattened:

1
 \
  2
   \
    3
     \
      4
       \
        5
         \
          6
```

### Example 2

**Input:** 
```python
root = []
```

**Output:** 
```python
[]
```

### Example 3

**Input:** 
```python
root = [0]
```

**Output:** 
```python
[0]
```

---

## Constraints

- The number of nodes in the tree is in the range `[0, 2000]`
- `-100 <= Node.val <= 100`

---

## Follow-up

Can you flatten the tree in-place (with O(1) extra space)?

---

## Pattern: Tree Traversal (Preorder)

This problem is a classic example of **Tree Manipulation** using **Preorder Traversal**. The key insight is to transform the tree in-place while maintaining the preorder order.

### Core Concept

- **Preorder Traversal**: Visit root, then left, then right
- **In-place Transformation**: Modify tree structure without extra allocation
- **Right-subtree Tracking**: Remember original right subtree before reassignment
- **Iterative Alternative**: Use stack to avoid recursion stack overflow

---

## Intuition

The key insight for this problem is understanding how to transform the tree structure while preserving the preorder traversal order.

### Key Observations

1. **Preorder Order**: The flattened list should follow preorder traversal (root → left → right)

2. **In-place Modification**: We can modify the tree structure without creating new nodes

3. **Right-Subtree Preservation**: When we set root.right = root.left, we need to save the original right subtree to attach later

4. **Finding Tail**: After flattening left subtree, we need to find its rightmost node to attach the saved right subtree

5. **Iterative Approach**: We can use a stack to simulate recursion and achieve O(1) space (excluding the call stack)

### Algorithm Overview

1. **Recursive Approach**: 
   - Recursively flatten left and right subtrees
   - Attach flattened left to right
   - Find tail of new right chain
   - Attach original right subtree

2. **Iterative Approach**:
   - Use stack to process nodes
   - Maintain prev pointer to build the list
   - Process right before left (for stack)

3. **Reverse Preorder**:
   - Process right subtree first
   - Build list from end to start

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Recursive (Postorder)** - Classic DFS approach
2. **Reverse Preorder** - Most space-efficient
3. **Iterative with Stack** - Avoid recursion

---

## Approach 1: Recursive (Postorder)

### Algorithm Steps

1. Recursively flatten the right subtree first
2. Recursively flatten the left subtree
3. Save original right subtree
4. Set root.right to flattened left subtree
5. Set root.left to None
6. Find the tail of the new right chain
7. Attach original right subtree to tail

### Why It Works

The recursive approach works because:
- Processing right before left allows us to maintain correct references
- By the time we process a node, both subtrees are already flattened
- We can safely reassign pointers since we're done with the children
- Finding the tail ensures proper ordering

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
    def flatten(self, root: Optional[TreeNode]) -> None:
        """
        Flatten binary tree to linked list in-place using recursion.
        
        Args:
            root: Root of binary tree
            
        Returns:
            None - modifies root in-place
        """
        if not root:
            return
        
        # Recursively flatten right first, then left
        self.flatten(root.right)
        self.flatten(root.left)
        
        # Save original right subtree
        right = root.right
        
        # Attach flattened left subtree to right
        root.right = root.left
        root.left = None
        
        # Find the tail of the new right chain
        curr = root
        while curr.right:
            curr = curr.right
        
        # Attach original right subtree
        curr.right = right
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
    void flatten(TreeNode* root) {
        if (!root) return;
        
        // Recursively flatten right first, then left
        flatten(root->right);
        flatten(root->left);
        
        // Save original right subtree
        TreeNode* right = root->right;
        
        // Attach flattened left subtree to right
        root->right = root->left;
        root->left = nullptr;
        
        // Find the tail of the new right chain
        TreeNode* curr = root;
        while (curr->right) {
            curr = curr->right;
        }
        
        // Attach original right subtree
        curr->right = right;
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
    public void flatten(TreeNode root) {
        if (root == null) return;
        
        // Recursively flatten right first, then left
        flatten(root.right);
        flatten(root.left);
        
        // Save original right subtree
        TreeNode right = root.right;
        
        // Attach flattened left subtree to right
        root.right = root.left;
        root.left = null;
        
        // Find the tail of the new right chain
        TreeNode curr = root;
        while (curr.right != null) {
            curr = curr.right;
        }
        
        // Attach original right subtree
        curr.right = right;
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
 * @return {void} Do not return anything, modify root in-place instead.
 */
var flatten = function(root) {
    if (!root) return;
    
    // Recursively flatten right first, then left
    flatten(root.right);
    flatten(root.left);
    
    // Save original right subtree
    const right = root.right;
    
    // Attach flattened left subtree to right
    root.right = root.left;
    root.left = null;
    
    // Find the tail of the new right chain
    let curr = root;
    while (curr.right) {
        curr = curr.right;
    }
    
    // Attach original right subtree
    curr.right = right;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - each node visited once |
| **Space** | O(h) - recursion stack where h is tree height |

---

## Approach 2: Reverse Preorder (Most Efficient)

### Algorithm Steps

1. Use a prev pointer (initialized to None)
2. Process nodes in reverse preorder (right → left → root)
3. For each node, set prev as its right child
4. Set node.left to None
5. Update prev to current node

### Why It Works

The reverse preorder approach works because:
- Processing right to left builds the list from the end
- By linking each node to the previously processed node, we build the list in correct order
- No need to find tail or save subtrees
- O(1) auxiliary space (excluding recursion)

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
    def flatten(self, root: Optional[TreeNode]) -> None:
        """
        Flatten using reverse preorder - O(1) space.
        
        Args:
            root: Root of binary tree
            
        Returns:
            None - modifies root in-place
        """
        self.prev = None
        
        def dfs(node):
            if not node:
                return
            
            # Process right first, then left, then current
            dfs(node.right)
            dfs(node.left)
            
            # Link current node to previous
            node.right = self.prev
            node.left = None
            self.prev = node
        
        dfs(root)
```

<!-- slide -->
```cpp
class Solution {
private:
    TreeNode* prev = nullptr;
    
public:
    void flatten(TreeNode* root) {
        function<void(TreeNode*)> dfs = [&](TreeNode* node) {
            if (!node) return;
            
            // Process right first, then left, then current
            dfs(node->right);
            dfs(node->left);
            
            // Link current node to previous
            node->right = prev;
            node->left = nullptr;
            prev = node;
        };
        
        dfs(root);
    }
};
```

<!-- slide -->
```java
class Solution {
    private TreeNode prev = null;
    
    public void flatten(TreeNode root) {
        dfs(root);
    }
    
    private void dfs(TreeNode node) {
        if (node == null) return;
        
        // Process right first, then left, then current
        dfs(node.right);
        dfs(node.left);
        
        // Link current node to previous
        node.right = prev;
        node.left = null;
        prev = node;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {TreeNode} root
 * @return {void} Do not return anything, modify root in-place instead.
 */
var flatten = function(root) {
    let prev = null;
    
    function dfs(node) {
        if (!node) return;
        
        // Process right first, then left, then current
        dfs(node.right);
        dfs(node.left);
        
        // Link current node to previous
        node.right = prev;
        node.left = null;
        prev = node;
    }
    
    dfs(root);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - each node visited once |
| **Space** | O(h) - recursion stack |

---

## Approach 3: Iterative with Stack

### Algorithm Steps

1. Use a stack to simulate recursion
2. Push root to stack
3. While stack is not empty:
   - Pop current node
   - Process right child first (push to stack)
   - Process left child second (push to stack)
   - Link previous node to current
4. Set current.left to None
5. Update previous node

### Why It Works

The iterative approach works because:
- Stack allows us to process nodes in desired order without recursion
- By pushing right before left, we ensure left is processed first
- Previous pointer builds the linked list as we go
- Avoids recursion stack overflow for deep trees

### Code Implementation

````carousel
```python
from typing import Optional
import collections

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


class Solution:
    def flatten(self, root: Optional[TreeNode]) -> None:
        """
        Flatten using iterative approach with stack.
        
        Args:
            root: Root of binary tree
            
        Returns:
            None - modifies root in-place
        """
        if not root:
            return
        
        stack = [root]
        prev = None
        
        while stack:
            curr = stack.pop()
            
            if prev:
                prev.right = curr
                prev.left = None
            
            # Push right first, then left (so left is processed first)
            if curr.right:
                stack.append(curr.right)
            if curr.left:
                stack.append(curr.left)
            
            prev = curr
```

<!-- slide -->
```cpp
class Solution {
public:
    void flatten(TreeNode* root) {
        if (!root) return;
        
        stack<TreeNode*> st;
        st.push(root);
        TreeNode* prev = nullptr;
        
        while (!st.empty()) {
            TreeNode* curr = st.top();
            st.pop();
            
            if (prev) {
                prev->right = curr;
                prev->left = nullptr;
            }
            
            // Push right first, then left
            if (curr->right) st.push(curr->right);
            if (curr->left) st.push(curr->left);
            
            prev = curr;
        }
    }
};
```

<!-- slide -->
```java
class Solution {
    public void flatten(TreeNode root) {
        if (root == null) return;
        
        Stack<TreeNode> stack = new Stack<>();
        stack.push(root);
        TreeNode prev = null;
        
        while (!stack.isEmpty()) {
            TreeNode curr = stack.pop();
            
            if (prev != null) {
                prev.right = curr;
                prev.left = null;
            }
            
            // Push right first, then left
            if (curr.right != null) stack.push(curr.right);
            if (curr.left != null) stack.push(curr.left);
            
            prev = curr;
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {TreeNode} root
 * @return {void} Do not return anything, modify root in-place instead.
 */
var flatten = function(root) {
    if (!root) return;
    
    const stack = [root];
    let prev = null;
    
    while (stack.length > 0) {
        const curr = stack.pop();
        
        if (prev) {
            prev.right = curr;
            prev.left = null;
        }
        
        // Push right first, then left
        if (curr.right) stack.push(curr.right);
        if (curr.left) stack.push(curr.left);
        
        prev = curr;
    }
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - each node visited once |
| **Space** | O(n) - worst case for skewed tree |

---

## Comparison of Approaches

| Aspect | Recursive (Postorder) | Reverse Preorder | Iterative (Stack) |
|--------|----------------------|------------------|-------------------|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(h) | O(h) | O(n) |
| **Implementation** | Simple | Elegant | Moderate |
| **LeetCode Optimal** | ✅ | ✅ (most popular) | ✅ |
| **Difficulty** | Easy | Medium | Medium |

**Best Approach:** Use Approach 2 (Reverse Preorder) for the most elegant solution with O(1) auxiliary space.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Google, Facebook, Microsoft, Amazon
- **Difficulty**: Medium
- **Concepts Tested**: Tree Manipulation, DFS, In-place Modification

### Learning Outcomes

1. **Tree Traversal**: Master preorder, inorder, postorder traversals
2. **In-place Modification**: Learn to modify data structures without allocation
3. **Pointer Manipulation**: Understand tree node pointer relationships
4. **Space Optimization**: Learn to reduce auxiliary space

---

## Related Problems

Based on similar themes (tree manipulation, traversal):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Binary Tree Preorder Traversal | [Link](https://leetcode.com/problems/binary-tree-preorder-traversal/) | Preorder traversal |
| Binary Tree Postorder Traversal | [Link](https://leetcode.com/problems/binary-tree-postorder-traversal/) | Postorder traversal |
| Construct String from Binary Tree | [Link](https://leetcode.com/problems/construct-string-from-binary-tree/) | Tree to string |
| Maximum Depth of Binary Tree | [Link](https://leetcode.com/problems/maximum-depth-of-binary-tree/) | Tree depth |

### Pattern Reference

For more detailed explanations of tree traversal patterns, see:
- **[Tree DFS](/patterns/tree-dfs)**
- **[Binary Tree Traversal](/patterns/binary-tree-traversal)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Flatten Binary Tree to Linked List](https://www.youtube.com/watch?v=AfW7G0m7A2E)** - Clear explanation with visual examples
2. **[Flatten Binary Tree - LeetCode 114](https://www.youtube.com/watch?v=7Ble3tNHQhI)** - Detailed walkthrough
3. **[Tree Traversal Explained](https://www.youtube.com/watch?v=1BtM-YdVnws)** - Tree traversal fundamentals

### Related Concepts

- **[Preorder Traversal](https://www.youtube.com/watch?v=ivL4T1W3-W8)** - Understanding preorder
- **[DFS on Trees](https://www.youtube.com/watch?v=1BtM-YdVnws)** - DFS fundamentals

---

## Follow-up Questions

### Q1: How would you flatten the tree using O(1) extra space?

**Answer:** Use the reverse preorder approach (Approach 2). Process right subtree first, then left, linking each node to the previous one. This uses only the recursion stack (O(h)) which is considered O(1) for balanced trees.

### Q2: Can you solve this without modifying the tree structure?

**Answer:** No, the problem specifically requires modifying the tree in-place. If you could create new nodes, you could simply do a preorder traversal and create new nodes for the linked list.

### Q3: How would you handle very deep trees?

**Answer:** Use the iterative approach with an explicit stack to avoid recursion stack overflow. Alternatively, use the reverse preorder approach which has better cache locality.

### Q4: Can you reconstruct the original tree from the flattened list?

**Answer:** Yes! Since we know it's in preorder format, we can recursively build the tree. For each node, the next elements in the list would form its left subtree until we hit a null, then the remaining elements form the right subtree.

---

## Common Pitfalls

### 1. Forgetting to Save Right Subtree
**Issue:** Losing the original right subtree when reassigning.

**Solution:** Save original right subtree before modifying root.right.

### 2. Not Setting Left to None
**Issue:** Leaving left pointers non-null.

**Solution:** Always set root.left = None after flattening.

### 3. Not Finding the Tail
**Issue:** Attaching right subtree to wrong position.

**Solution:** Find the rightmost node of the flattened left subtree before attaching.

### 4. Processing Order
**Issue:** Getting wrong order due to processing left before right.

**Solution:** Process right subtree first, then left, or use reverse preorder.

### 5. Stack Overflow
**Issue:** Recursion depth too large for deep trees.

**Solution:** Use iterative approach with explicit stack or Morris traversal.

---

## Summary

The **Flatten Binary Tree to Linked List** problem demonstrates the **Tree Manipulation** pattern:

- **Preorder Order**: Flattened list follows root → left → right
- **In-place**: Modify tree without allocating new nodes
- **Pointer Manipulation**: Carefully manage left/right pointers
- **Time complexity**: O(n) - optimal

Key takeaways:
1. Save right subtree before reassigning
2. Find tail of flattened left subtree
3. Use reverse preorder for O(1) auxiliary space
4. Set left pointers to None after flattening
5. Use iterative approach for deep trees

This pattern extends to:
- Tree serialization/deserialization
- Preorder traversal variations
- In-place tree transformations
- Morris traversal for O(1) space

---

## Additional Resources

- [LeetCode Problem 114](https://leetcode.com/problems/flatten-binary-tree-to-linked-list/) - Official problem page
- [Tree Traversal - GeeksforGeeks](https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-postorder/) - Detailed traversal explanation
- [DFS on Binary Trees](https://www.geeksforgeeks.org/depth-first-search-traversal-of-a-binary-tree/) - DFS fundamentals
- [Pattern: Tree DFS](/patterns/tree-dfs) - Comprehensive pattern guide
