# Kth Smallest Element in a BST

## Problem Description

## Pattern: BST Inorder Traversal - Kth Smallest

This problem demonstrates algorithmic problem-solving patterns.

Given the root of a **Binary Search Tree (BST)** and an integer `k`, return the kth smallest value (1-indexed) of all node values in the tree.

---

## Examples

### Example

| Input | Output |
|-------|--------|
| `root = [3,1,4,null,2], k = 1` | `1` |

### Example 2

| Input | Output |
|-------|--------|
| `root = [5,3,6,2,4,null,null,1], k = 3` | `3` |

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `1 ≤ k ≤ n ≤ 10^4` | Tree node count |
| `0 ≤ Node.val ≤ 10^4` | Node values |

---

## Intuition

The key insight is that **Binary Search Tree (BST) inorder traversal visits nodes in ascending (sorted) order**. This is because:

- All nodes in the left subtree are smaller than the current node
- All nodes in the right subtree are larger than the current node
- Inorder traversal: Left → Node → Right

Therefore, the kth smallest element is simply the kth node visited during inorder traversal.

There are several approaches:
1. **Iterative Inorder** - O(h + k) time, O(h) space
2. **Recursive Inorder** - O(h + k) time, O(h) space (recursion stack)
3. **Augmented Tree** - O(h) time, O(1) space for query (after O(n) preprocessing)

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Iterative Inorder Traversal** - Optimal O(h + k)
2. **Recursive Inorder Traversal** - Simple and elegant
3. **Augmented BST with Subtree Size** - O(1) query after preprocessing

---

## Approach 1: Iterative Inorder Traversal (Optimal)

Use a stack to simulate inorder traversal without recursion.

### Algorithm Steps

1. Initialize an empty stack
2. Start from root, go left as far as possible while pushing nodes
3. Pop from stack, process the node
4. Decrement k; if k becomes 0, we found the answer
5. Move to right subtree and repeat

### Why It Works

The iterative approach simulates the recursive inorder traversal using an explicit stack. We stop as soon as we've visited k nodes, making it efficient when k is small.

### Code Implementation

````carousel
```python
from typing import Optional

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val: int = 0, left: Optional['TreeNode'] = None, right: Optional['TreeNode'] = None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:
        """
        Find kth smallest element using iterative inorder traversal.
        
        Args:
            root: Root of BST
            k: The kth smallest to find (1-indexed)
            
        Returns:
            The kth smallest value
        """
        stack = []
        current = root
        
        while current or stack:
            # Go to the leftmost node
            while current:
                stack.append(current)
                current = current.left
            
            # Process the node
            current = stack.pop()
            k -= 1
            
            if k == 0:
                return current.val
            
            # Move to right subtree
            current = current.right
        
        return -1  # Should never reach here if k is valid
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
    int kthSmallest(TreeNode* root, int k) {
        stack<TreeNode*> st;
        TreeNode* curr = root;
        
        while (curr || !st.empty()) {
            // Go to leftmost node
            while (curr) {
                st.push(curr);
                curr = curr->left;
            }
            
            // Process node
            curr = st.top();
            st.pop();
            k--;
            
            if (k == 0) return curr->val;
            
            // Move to right subtree
            curr = curr->right;
        }
        
        return -1;
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
    public int kthSmallest(TreeNode root, int k) {
        Stack<TreeNode> stack = new Stack<>();
        TreeNode curr = root;
        
        while (curr != null || !stack.isEmpty()) {
            // Go to leftmost node
            while (curr != null) {
                stack.push(curr);
                curr = curr.left;
            }
            
            // Process node
            curr = stack.pop();
            k--;
            
            if (k == 0) return curr.val;
            
            // Move to right subtree
            curr = curr.right;
        }
        
        return -1;
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
 * @param {number} k
 * @return {number}
 */
var kthSmallest = function(root, k) {
    const stack = [];
    let curr = root;
    
    while (curr || stack {
        //.length) Go to leftmost node
        while (curr) {
            stack.push(curr);
            curr = curr.left;
        }
        
        // Process node
        curr = stack.pop();
        k--;
        
        if (k === 0) return curr.val;
        
        // Move to right subtree
        curr = curr.right;
    }
    
    return -1;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(h + k) - Height of tree plus k nodes visited |
| **Space** | O(h) - Stack depth equals tree height |

---

## Approach 2: Recursive Inorder Traversal

Use recursion to perform inorder traversal.

### Algorithm Steps

1. Recursively traverse left subtree
2. Process current node, decrement k
3. If k == 0, we found the answer
4. Recursively traverse right subtree

### Code Implementation

````carousel
```python
from typing import Optional

class Solution:
    def kthSmallest_recursive(self, root: Optional[TreeNode], k: int) -> int:
        """
        Find kth smallest using recursive inorder traversal.
        """
        result = None
        
        def inorder(node: Optional[TreeNode]):
            nonlocal result, k
            if not node:
                return
            
            # Traverse left
            inorder(node.left)
            
            # Process current node
            k -= 1
            if k == 0:
                result = node.val
                return
            
            # Traverse right
            inorder(node.right)
        
        inorder(root)
        return result
```

<!-- slide -->
```cpp
class Solution {
public:
    int kthSmallest(TreeNode* root, int k) {
        return inorder(root, k);
    }
    
private:
    int inorder(TreeNode* node, int& k) {
        if (!node) return -1;
        
        // Left
        int left = inorder(node->left, k);
        if (k == 0) return left;
        
        // Node
        k--;
        if (k == 0) return node->val;
        
        // Right
        return inorder(node->right, k);
    }
};
```

<!-- slide -->
```java
class Solution {
    private int result;
    private int k;
    
    public int kthSmallest(TreeNode root, int k) {
        this.k = k;
        inorder(root);
        return result;
    }
    
    private void inorder(TreeNode node) {
        if (node == null || k == 0) return;
        
        inorder(node.left);
        k--;
        if (k == 0) {
            result = node.val;
            return;
        }
        inorder(node.right);
    }
}
```

<!-- slide -->
```javascript
var kthSmallest = function(root, k) {
    let result = null;
    
    const inorder = (node) => {
        if (!node || result !== null) return;
        
        inorder(node.left);
        k--;
        if (k === 0) {
            result = node.val;
            return;
        }
        inorder(node.right);
    };
    
    inorder(root);
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(h + k) - Visits k nodes |
| **Space** | O(h) - Recursion stack |

---

## Approach 3: Augmented BST with Subtree Size

Add a size attribute to each node for O(1) queries after O(n) preprocessing.

### Algorithm Steps

**Preprocessing (O(n)):**
1. Traverse tree and compute subtree sizes

**Query (O(h)):**
1. At each node, check left subtree size
2. If k <= left_size, go left
3. If k == left_size + 1, this is the answer
4. Otherwise, go right with adjusted k

### Code Implementation

````carousel
```python
from typing import Optional

class TreeNode:
    def __init__(self, val: int = 0, left: Optional['TreeNode'] = None, right: Optional['TreeNode'] = None):
        self.val = val
        self.left = left
        self.right = right
        self.size = 1  # Size of this subtree

class Solution:
    def kthSmallest_augmented(self, root: Optional[TreeNode], k: int) -> int:
        """
        Find kth smallest using augmented BST with subtree sizes.
        
        Preprocessing: O(n) to compute sizes
        Query: O(h) time
        """
        # Step 1: Compute subtree sizes
        def compute_size(node):
            if not node:
                return 0
            node.size = 1 + compute_size(node.left) + compute_size(node.right)
            return node.size
        
        compute_size(root)
        
        # Step 2: Query kth smallest
        def kth_smallest(node, k):
            left_size = node.left.size if node.left else 0
            
            if k <= left_size:
                return kth_smallest(node.left, k)
            elif k == left_size + 1:
                return node.val
            else:
                return kth_smallest(node.right, k - left_size - 1)
        
        return kth_smallest(root, k)
```

<!-- slide -->
```cpp
class Solution {
public:
    // Helper to compute subtree sizes
    int getSize(TreeNode* node) {
        if (!node) return 0;
        node->size = 1 + getSize(node->left) + getSize(node->right);
        return node->size;
    }
    
    int kthSmallest(TreeNode* root, int k) {
        getSize(root);  // Preprocess
        
        TreeNode* node = root;
        while (node) {
            int leftSize = node->left ? node->left->size : 0;
            
            if (k <= leftSize) {
                node = node->left;
            } else if (k == leftSize + 1) {
                return node->val;
            } else {
                k -= leftSize + 1;
                node = node->right;
            }
        }
        
        return -1;
    }
};
```

<!-- slide -->
```java
class Solution {
    // Solution using recursive approach
    public int kthSmallest(TreeNode root, int k) {
        // Compute subtree sizes first
        computeSize(root);
        return findKthSmallest(root, k);
    }
    
    private int computeSize(TreeNode node) {
        if (node == null) return 0;
        node.size = 1 + computeSize(node.left) + computeSize(node.right);
        return node.size;
    }
    
    private int findKthSmallest(TreeNode node, int k) {
        int leftSize = node.left != null ? node.left.size : 0;
        
        if (k <= leftSize) {
            return findKthSmallest(node.left, k);
        } else if (k == leftSize + 1) {
            return node.val;
        } else {
            return findKthSmallest(node.right, k - leftSize - 1);
        }
    }
}
```

<!-- slide -->
```javascript
// Augment nodes with size during tree construction or preprocessing
var kthSmallest = function(root, k) {
    // Helper to compute sizes
    const getSize = (node) => {
        if (!node) return 0;
        node.size = 1 + getSize(node.left) + getSize(node.right);
        return node.size;
    };
    
    getSize(root);
    
    // Find kth smallest
    let node = root;
    while (node) {
        const leftSize = node.left ? node.left.size : 0;
        
        if (k <= leftSize) {
            node = node.left;
        } else if (k === leftSize + 1) {
            return node.val;
        } else {
            k -= leftSize + 1;
            node = node.right;
        }
    }
    
    return -1;
};
```
````

### Complexity Analysis

| Phase | Complexity | Description |
|-------|------------|-------------|
| **Preprocessing** | O(n) | Compute all subtree sizes |
| **Query** | O(h) | Binary search in tree |
| **Space** | O(1) | Query uses no extra space |

---

## Comparison of Approaches

| Aspect | Iterative | Recursive | Augmented |
|--------|-----------|-----------|-----------|
| **Time Complexity** | O(h + k) | O(h + k) | O(n) prep + O(h) query |
| **Space Complexity** | O(h) | O(h) | O(n) for size + O(h) query |
| **Implementation** | Moderate | Simple | Complex |
| **Best For** | Single query | Simple use | Multiple queries |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes | ✅ Yes (for multiple queries) |

---

## Follow-up Challenge

**Optimized approach for frequent queries:**

If the BST is modified often (insert/delete) and you need to find kth smallest frequently:

> Add a `size` attribute to each node representing the subtree size. This allows O(h) queries and O(h) updates.

---

## Related Problems

Based on similar themes (BST, inorder traversal, tree operations):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Minimum BST Sum | [Link](https://leetcode.com/problems/minimum-absolute-difference-in-bst/) | BST inorder traversal |
| Find Mode in BST | [Link](https://leetcode.com/problems/find-mode-in-binary-search-tree/) | BST traversal |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Binary Tree Inorder Traversal | [Link](https://leetcode.com/problems/binary-tree-inorder-traversal/) | Inorder traversal |
| Validate BST | [Link](https://leetcode.com/problems/validate-binary-search-tree/) | BST validation |
| Kth Smallest in Sorted Matrix | [Link](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/) | Heap + binary search |

### Pattern Reference

For more detailed explanations, see:
- **[BST Inorder Traversal](/patterns/bst-inorder)**
- **[Binary Tree Traversal](/patterns/binary-tree-traversal)**
- **[Tree DFS](/patterns/tree-dfs)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### NeetCode Solutions

- [Kth Smallest in BST - NeetCode](https://www.youtube.com/watch?v=4sqlT0tTqqE) - Clear explanation with visual examples
- [Inorder Traversal Approach](https://www.youtube.com/watch?v=5WQy7b9Z5Xk) - Detailed walkthrough

### Other Tutorials

- [Back to Back SWE - Kth Smallest](https://www.youtube.com/watch?v=7H6gE45MrfI) - Comprehensive explanation
- [LeetCode Official Solution](https://www.youtube.com/watch?v=4nW7G95X4wI) - Official problem solution
- [Augmented BST Explanation](https://www.youtube.com/watch?v=K5bC1t5c4gI) - Advanced approach

---

## Follow-up Questions

### Q1: How would you handle a non-BST tree?

**Answer:** First, collect all nodes in an array, sort them, and pick the kth smallest. This takes O(n log n) time. Alternatively, build a BST from the tree nodes first.

---

### Q2: What if the tree has duplicate values?

**Answer:** BST typically doesn't have duplicates, but if allowed, decide on a convention (e.g., left <= or left <). Modify the inorder traversal to handle duplicates accordingly. Count each occurrence.

---

### Q3: How would you modify the solution for the kth largest instead of smallest?

**Answer:** Either:
1. Find (n-k+1)th smallest using the same approach
2. Do reverse inorder (Right → Node → Left) and decrement k

---

### Q4: How would you handle very large k (close to n)?

**Answer:** The iterative approach is still optimal. If k is close to n, consider doing reverse inorder from the rightmost node.

---

### Q5: How would you insert a new node while maintaining BST property?

**Answer:** Standard BST insertion: compare value with current node, go left if smaller, right if larger. After insertion, update size attributes if using augmented BST.

---

### Q6: Can you solve it without any extra space?

**Answer:** The Morris Traversal algorithm uses O(1) space by modifying the tree temporarily to create links back to ancestors. It still performs inorder traversal.

---

### Q7: What edge cases should you test?

**Answer:**
- k = 1 (smallest element)
- k = n (largest element)
- Single node tree
- Skewed tree (all left or all right)
- Balanced tree
- Tree with minimum/maximum values at various positions

---

### Q8: How would you find the median of the BST?

**Answer:** Find the size of the tree (n). If n is odd, find ((n+1)/2)th smallest. If n is even, find both (n/2)th and (n/2 + 1)th smallest and average them.

---

## Common Pitfalls

### 1. Not Stopping After Finding Answer
**Issue**: Continuing traversal after finding kth smallest.

**Solution**: Return immediately when k reaches 0 to avoid unnecessary work.

### 2. Using 0-based Index Instead of 1-based
**Issue**: Using k directly without adjusting for 1-indexed problem.

**Solution**: Remember the problem uses 1-indexing, so decrement k after visiting each node.

### 3. Not Handling Invalid k
**Issue**: Not checking if k is valid (1 <= k <= n).

**Solution**: Add validation or rely on constraints.

### 4. Stack Overflow with Deep Trees
**Issue**: Recursive solution can overflow for skewed trees.

**Solution**: Use iterative approach or increase recursion limit.

### 5. Forgetting to Process Right Subtree
**Issue**: Only traversing left subtree.

**Solution**: After processing current node, always move to right subtree.

---

## Summary

The **Kth Smallest Element in a BST** problem demonstrates the power of BST properties:

- **Inorder traversal**: Visits nodes in sorted order
- **Iterative approach**: O(h + k) time, O(h) space
- **Augmented BST**: O(1) queries after O(n) preprocessing

Key insights:
1. BST inorder gives sorted order
2. Stop early when k is reached
3. Augment with subtree size for frequent queries

This problem is excellent for understanding BST properties, tree traversal, and space optimization.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/kth-smallest-element-in-a-bst/discuss/) - Community solutions
- [BST - GeeksforGeeks](https://www.geeksforgeeks.org/binary-search-tree-set-1-search-and-insertion/) - Detailed explanation
- [Tree Traversals](/patterns/binary-tree-traversal) - Comprehensive guide
