# Invert Binary Tree

## Problem Description

Given the root of a binary tree, **invert** the tree, and return its root.

Inverting a binary tree means swapping every left and right child node. This operation transforms the tree into the mirror image of itself.

**Link to problem:** [Invert Binary Tree - LeetCode 226](https://leetcode.com/problems/invert-binary-tree/)

---

## Examples

### Example 1

| Input | Output |
|-------|--------|
| `root = [4,2,7,1,3,6,9]` | `[4,7,2,9,6,3,1]` |

### Example 2

| Input | Output |
|-------|--------|
| `root = [2,1,3]` | `[2,3,1]` |

### Example 3

| Input | Output |
|-------|--------|
| `root = []` | `[]` |

---

## Constraints

- The number of nodes in the tree is in the range `[0, 100]`.
- `-100 <= Node.val <= 100`

---

## Pattern: Tree DFS

This problem follows the **Tree DFS** pattern for tree manipulation.

---

## Intuition

The key insight for this problem is understanding the recursive nature of tree inversion:

> At each node, swap its left and right children, then recursively invert both subtrees.

### Key Observations

1. **Recursive Structure**: The inversion operation is naturally recursive - inverting a tree means inverting its left and right subtrees.

2. **Base Case**: An empty tree (null root) needs no inversion - just return null.

3. **Post-Order Processing**: We need to process children before the parent to ensure we have valid subtrees to swap.

4. **In-Place Modification**: We don't need extra data structures - just swap pointers.

### Algorithm Overview

**Approach 1: Recursive DFS**
1. If root is null, return null
2. Swap left and right children
3. Recursively invert left subtree
4. Recursively invert right subtree
5. Return root

**Approach 2: Iterative BFS**
1. Use a queue for level-order traversal
2. For each node, swap its children
3. Add children to queue if not null
4. Return root when queue is empty

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Recursive DFS** - Optimal recursive solution (O(n) time, O(h) space)
2. **Iterative BFS** - Using queue (O(n) time, O(w) space)
3. **Iterative DFS** - Using stack (O(n) time, O(h) space)

---

## Approach 1: Recursive DFS (Optimal) ⭐

### Algorithm Steps

1. Base case: if root is null, return null
2. Swap root.left and root.right
3. Recursively call invertTree on left (now contains original right)
4. Recursively call invertTree on right (now contains original left)
5. Return root

### Why It Works

The recursive approach works because:
1. Each node only needs to worry about its own children
2. After swapping, we can treat the subtrees independently
3. The recursion naturally processes bottom-up (post-order)

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
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        """
        Invert a binary tree using recursive DFS.
        
        Args:
            root: Root of the binary tree
            
        Returns:
            Root of the inverted binary tree
        """
        # Base case: empty tree
        if not root:
            return None
        
        # Step 1: Swap left and right children
        root.left, root.right = root.right, root.left
        
        # Step 2: Recursively invert subtrees
        self.invertTree(root.left)
        self.invertTree(root.right)
        
        # Step 3: Return the inverted tree
        return root
```

<!-- slide -->
```cpp
class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        // Base case: empty tree
        if (!root) return nullptr;
        
        // Step 1: Swap left and right children
        swap(root->left, root->right);
        
        // Step 2: Recursively invert subtrees
        invertTree(root->left);
        invertTree(root->right);
        
        // Step 3: Return the inverted tree
        return root;
    }
};
```

<!-- slide -->
```java
class Solution {
    public TreeNode invertTree(TreeNode root) {
        // Base case: empty tree
        if (root == null) return null;
        
        // Step 1: Swap left and right children
        TreeNode temp = root.left;
        root.left = root.right;
        root.right = temp;
        
        // Step 2: Recursively invert subtrees
        invertTree(root.left);
        invertTree(root.right);
        
        // Step 3: Return the inverted tree
        return root;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
var invertTree = function(root) {
    // Base case: empty tree
    if (!root) return null;
    
    // Step 1: Swap left and right children
    [root.left, root.right] = [root.right, root.left];
    
    // Step 2: Recursively invert subtrees
    invertTree(root.left);
    invertTree(root.right);
    
    // Step 3: Return the inverted tree
    return root;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - visits each node exactly once |
| **Space** | O(h) - recursion stack where h is tree height |

For a balanced tree: O(log n); for a skewed tree: O(n).

---

## Approach 2: Iterative BFS (Queue)

### Algorithm Steps

1. If root is null, return null
2. Initialize queue with root
3. While queue is not empty:
   - Dequeue current node
   - Swap its left and right children
   - Enqueue left child if not null
   - Enqueue right child if not null
4. Return root

### Why It Works

BFS processes level by level, ensuring each node is visited and its children are swapped before moving to the next level.

### Code Implementation

````carousel
```python
from typing import Optional
from collections import deque

class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        """
        Invert a binary tree using iterative BFS.
        """
        if not root:
            return None
        
        queue = deque([root])
        
        while queue:
            node = queue.popleft()
            
            # Swap left and right children
            node.left, node.right = node.right, node.left
            
            # Add children to queue
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        return root
```

<!-- slide -->
```cpp
class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        if (!root) return nullptr;
        
        queue<TreeNode*> q;
        q.push(root);
        
        while (!q.empty()) {
            TreeNode* node = q.front();
            q.pop();
            
            // Swap left and right children
            swap(node->left, node->right);
            
            // Add children to queue
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        
        return root;
    }
};
```

<!-- slide -->
```java
class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        
        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            
            // Swap left and right children
            TreeNode temp = node.left;
            node.left = node.right;
            node.right = temp;
            
            // Add children to queue
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        
        return root;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
var invertTree = function(root) {
    if (!root) return null;
    
    const queue = [root];
    
    while (queue.length > 0) {
        const node = queue.shift();
        
        // Swap left and right children
        [node.left, node.right] = [node.right, node.left];
        
        // Add children to queue
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
    }
    
    return root;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - visits each node exactly once |
| **Space** | O(w) - queue size where w is max width |

---

## Approach 3: Iterative DFS (Stack)

### Algorithm Steps

1. If root is null, return null
2. Initialize stack with root
3. While stack is not empty:
   - Pop current node
   - Swap its left and right children
   - Push right child first, then left (for correct order)
4. Return root

### Why It Works

DFS using a stack processes nodes depth-first, similar to recursion but with explicit stack management.

### Code Implementation

````carousel
```python
from typing import Optional

class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        """
        Invert a binary tree using iterative DFS with stack.
        """
        if not root:
            return None
        
        stack = [root]
        
        while stack:
            node = stack.pop()
            
            # Swap left and right children
            node.left, node.right = node.right, node.left
            
            # Push children to stack
            if node.left:
                stack.append(node.left)
            if node.right:
                stack.append(node.right)
        
        return root
```

<!-- slide -->
```cpp
class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        if (!root) return nullptr;
        
        stack<TreeNode*> st;
        st.push(root);
        
        while (!st.empty()) {
            TreeNode* node = st.top();
            st.pop();
            
            // Swap left and right children
            swap(node->left, node->right);
            
            // Push children to stack
            if (node->left) st.push(node->left);
            if (node->right) st.push(node->right);
        }
        
        return root;
    }
};
```

<!-- slide -->
```java
class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        
        Stack<TreeNode> stack = new Stack<>();
        stack.push(root);
        
        while (!stack.isEmpty()) {
            TreeNode node = stack.pop();
            
            // Swap left and right children
            TreeNode temp = node.left;
            node.left = node.right;
            node.right = temp;
            
            // Push children to stack
            if (node.left != null) stack.push(node.left);
            if (node.right != null) stack.push(node.right);
        }
        
        return root;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
var invertTree = function(root) {
    if (!root) return null;
    
    const stack = [root];
    
    while (stack.length > 0) {
        const node = stack.pop();
        
        // Swap left and right children
        [node.left, node.right] = [node.right, node.left];
        
        // Push children to stack
        if (node.left) stack.push(node.left);
        if (node.right) stack.push(node.right);
    }
    
    return root;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - visits each node exactly once |
| **Space** | O(h) - stack size where h is tree height |

---

## Comparison of Approaches

| Aspect | Recursive DFS | Iterative BFS | Iterative DFS |
|--------|--------------|---------------|---------------|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(h) | O(w) | O(h) |
| **Implementation** | Simple | Moderate | Moderate |
| **LeetCode Optimal** | ✅ | ✅ | ✅ |
| **Difficulty** | Easy | Easy | Easy |

**Best Approach:** Use Approach 1 (Recursive DFS) for its simplicity and elegance. The recursive solution is the most intuitive.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Very commonly asked in technical interviews
- **Companies**: Google, Apple, Amazon, Microsoft
- **Difficulty**: Easy
- **Concepts Tested**: Tree traversal, recursion, pointer manipulation

### Fun Fact

This problem became famous because Google famously asks this in interviews, and there was a famous tweet where Max Howell (homebrew creator) said Google asked him this and he couldn't solve it!

### Learning Outcomes

1. **Tree Traversal**: Master recursive and iterative tree traversals
2. **Pointer Manipulation**: Learn to swap pointers in place
3. **Recursive Thinking**: Understand divide and conquer on trees

---

## Related Problems

Based on similar themes (tree manipulation, traversal):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Symmetric Tree | [Link](https://leetcode.com/problems/symmetric-tree/) | Similar tree mirroring |
| Maximum Depth of Binary Tree | [Link](https://leetcode.com/problems/maximum-depth-of-binary-tree/) | Tree depth calculation |
| Same Tree | [Link](https://leetcode.com/problems/same-tree/) | Tree comparison |
| Binary Tree Inorder Traversal | [Link](https://leetcode.com/problems/binary-tree-inorder-traversal/) | Tree traversal |

### Pattern Reference

For more detailed explanations of tree patterns, see:
- **[Tree DFS Pattern](/patterns/tree-dfs-recursive-inorder-traversal)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Invert Binary Tree](https://www.youtube.com/watch?v=vRbbzJd3bqQ)** - Clear explanation with visual examples
2. **[Invert Binary Tree - LeetCode 226](https://www.youtube.com/watch?v=downln-jQ6T8)** - Detailed walkthrough
3. **[Binary Tree Traversal Explained](https://www.youtube.com/watch?v=UeW7c-VDiXM)** - Understanding tree traversals

### Related Concepts

- **[Recursion on Trees](https://www.youtube.com/watch?v=2L17xL3-yGE)** - Recursive tree patterns
- **[BFS vs DFS](https://www.youtube.com/watch?v=9otD8r0dD4w)** - Tree traversal strategies

---

## Follow-up Questions

### Q1: How would you invert a generic n-ary tree?

**Answer:** Instead of swapping only left and right, you'd iterate through all children and reverse the order of the children array.

---

### Q2: Can you invert the tree in-place without modifying any node values?

**Answer:** Yes, the current solution already does this - we only swap pointers, not modify values.

---

### Q3: How would you check if two trees are mirrors of each other?

**Answer:** You can use recursion: check if root1.left equals root2.right and root1.right equals root2.left for all corresponding nodes.

---

### Q4: What if you needed to perform an operation on every third level only?

**Answer:** Modify BFS to track the current level number. Only process nodes where level % 3 == 0.

---

### Q5: How does the recursion work internally?

**Answer:** Each recursive call adds a frame to the call stack. The stack unwinds as each node completes its inversion. The maximum depth equals the tree height.

---

## Common Pitfalls

### 1. Not Processing All Nodes
**Issue:** Missing recursive calls on subtrees.

**Solution:** Ensure both left and right are inverted recursively.

### 2. Wrong Order
**Issue:** Processing before children leads to wrong result.

**Solution:** Use post-order: invert children first, then swap (or swap first, then process).

### 3. Null Pointer
**Issue:** Not handling null children.

**Solution:** Add null checks before accessing children.

### 4. Modifying Values Instead of Structure
**Issue:** Trying to solve by swapping values instead of pointers.

**Solution:** Swap the left and right child pointers, not node values.

### 5. Stack Overflow
**Issue:** For very deep trees, recursion may cause stack overflow.

**Solution:** Use iterative approaches (BFS or DFS with explicit stack).

---

## Summary

The **Invert Binary Tree** problem demonstrates **Tree DFS** traversal and pointer manipulation. The key insight is that at each node, we simply swap its left and right children, then recursively do the same for both subtrees.

### Key Takeaways

1. **Recursive Swap**: Swap children, then recursively invert subtrees
2. **In-Place**: No extra data structures needed for recursive approach
3. **Multiple Solutions**: Both recursive and iterative work well
4. **Base Case**: Handle null/empty tree properly

### Pattern Summary

This problem exemplifies the **Tree DFS** pattern, characterized by:
- Recursive processing of subtrees
- Post-order or pre-order traversal
- In-place modification of tree structure

For more details on this pattern, see the **[Tree DFS Pattern](/patterns/tree-dfs-recursive-inorder-traversal)**.

---

## Additional Resources

- [LeetCode Problem 226](https://leetcode.com/problems/invert-binary-tree/) - Official problem page
- [Tree Traversal - GeeksforGeeks](https://www.geeksforgeeks.org/tree-traversals/) - Detailed traversal explanation
- [Binary Tree - Wikipedia](https://en.wikipedia.org/wiki/Binary_tree) - Binary tree fundamentals
- [Pattern: Tree DFS](/patterns/tree-dfs-recursive-inorder-traversal) - Comprehensive pattern guide
