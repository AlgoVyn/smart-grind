# Binary Search Tree Iterator

## Problem Description

Implement the BSTIterator class that represents an iterator over the in-order traversal of a binary search tree (BST):

- `BSTIterator(TreeNode root)` Initializes an object of the BSTIterator class. The root of the BST is given as part of the constructor. The pointer should be initialized to a non-existent number smaller than any element in the BST.
- `boolean hasNext()` Returns true if there exists a number in the traversal to the right of the pointer, otherwise returns false.
- `int next()` Moves the pointer to the right, then returns the number at the pointer.

**Notice** that by initializing the pointer to a non-existent smallest number, the first call to `next()` will return the smallest element in the BST.
You may assume that `next()` calls will always be valid. That is, there will be at least a next number in the in-order traversal when `next()` is called.

**Link to problem:** [Binary Search Tree Iterator - LeetCode 173](https://leetcode.com/problems/binary-search-tree-iterator/)

---

## Pattern: Stack - Iterator Pattern

This problem exemplifies the **Stack - Iterator Pattern** for tree traversal. The key insight is to use a stack to simulate the in-order traversal, providing O(1) amortized time for both hasNext() and next() operations.

### Core Concept

The fundamental concept is:
1. **In-order Traversal**: Left -> Root -> Right order for BST
2. **Lazy Evaluation**: Don't traverse the entire tree upfront
3. **Stack for Path**: Maintain the path from root to current node

---

## Examples

### Example

**Input:**
```
["BSTIterator", "next", "next", "hasNext", "next", "hasNext", "next", "hasNext", "next", "hasNext"]
[[7, 3, 15, null, null, 9, 20]], [], [], [], [], [], [], [], [], []
```

**Output:**
```
[null, 3, 7, true, 9, true, 15, true, 20, false]
```

**Explanation:**
```
BSTIterator bSTIterator = new BSTIterator([7, 3, 15, null, null, 9, 20]);
bSTIterator.next();    // return 3
bSTIterator.next();    // return 7
bSTIterator.hasNext(); // return True
bSTIterator.next();    // return 9
bSTIterator.hasNext(); // return True
bSTIterator.next();    // return 15
bSTIterator.hasNext(); // return True
bSTIterator.next();    // return 20
bSTIterator.hasNext(); // return False
```

---

## Constraints

- The number of nodes in the tree is in the range `[1, 10^5]`.
- `0 <= Node.val <= 10^6`
- At most `10^5` calls will be made to `hasNext`, and `next`.

---

## Follow up

Could you implement `next()` and `hasNext()` to run in average O(1) time and use O(h) memory, where h is the height of the tree?

---

## Intuition

The key insight is:

1. **Stack-Based Approach**: Use a stack to maintain nodes to visit
2. **Lazy Initialization**: Only go as deep as needed when calling hasNext()
3. **In-Order Order**: For BST, in-order gives sorted order

### Why Stack Works

- The stack maintains the path from root to the current node
- When we need the next element, we:
  1. Pop the current node
  2. If it has a right child, push all left children of that right child
- This ensures we always get the next smallest element

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Stack-Based (Optimal)** - O(1) amortized, O(h) space
2. **Precompute Array** - O(n) initialization, O(1) per call

---

## Approach 1: Stack-Based Iterator (Optimal)

This is the standard approach using a stack to simulate in-order traversal.

### Algorithm Steps

1. In the constructor, push all left children from root to stack
2. For hasNext(): return True if stack is not empty
3. For next():
   - Pop the top node from stack
   - If it has a right child, push all its left children
   - Return the popped node's value

### Why It Works

The stack always contains the next node to visit. By pushing all left children initially and after each pop, we maintain the correct in-order sequence.

### Code Implementation

````carousel
```python
from typing import Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class BSTIterator:
    def __init__(self, root: Optional[TreeNode]):
        """
        Initialize the BST iterator.
        
        Args:
            root: Root of the BST
        """
        self.stack = []
        self._push_left(root)
    
    def _push_left(self, node):
        """Push all left children of node to stack."""
        while node:
            self.stack.append(node)
            node = node.left
    
    def next(self) -> int:
        """
        @return the next smallest number
        
        Returns:
            The next smallest number in the BST
        """
        # Get the next smallest node
        node = self.stack.pop()
        
        # If it has right child, push all left children of right
        if node.right:
            self._push_left(node.right)
        
        return node.val

    def hasNext(self) -> bool:
        """
        @return whether we have a next smallest number
        
        Returns:
            True if there are more elements, False otherwise
        """
        return len(self.stack) > 0
```

<!-- slide -->
```cpp
#include <stack>
using namespace std;

// Definition for a binary tree node.
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

class BSTIterator {
private:
    stack<TreeNode*> st;
    
    void pushLeft(TreeNode* node) {
        while (node) {
            st.push(node);
            node = node->left;
        }
    }
    
public:
    BSTIterator(TreeNode* root) {
        pushLeft(root);
    }
    
    /** @return the next smallest number */
    int next() {
        TreeNode* node = st.top();
        st.pop();
        
        if (node->right) {
            pushLeft(node->right);
        }
        
        return node->val;
    }
    
    /** @return whether we have a next smallest number */
    bool hasNext() {
        return !st.empty();
    }
};
```

<!-- slide -->
```java
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
class BSTIterator {
    private Stack<TreeNode> stack;
    
    private void pushLeft(TreeNode node) {
        while (node != null) {
            stack.push(node);
            node = node.left;
        }
    }
    
    public BSTIterator(TreeNode root) {
        stack = new Stack<>();
        pushLeft(root);
    }
    
    /** @return the next smallest number */
    public int next() {
        TreeNode node = stack.pop();
        
        if (node.right != null) {
            pushLeft(node.right);
        }
        
        return node.val;
    }
    
    /** @return whether we have a next smallest number */
    public boolean hasNext() {
        return !stack.isEmpty();
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
 */
var BSTIterator = function(root) {
    this.stack = [];
    this._pushLeft(root);
};

BSTIterator.prototype._pushLeft = function(node) {
    while (node) {
        this.stack.push(node);
        node = node.left;
    }
};

/**
 * @return {number}
 */
BSTIterator.prototype.next = function() {
    const node = this.stack.pop();
    
    if (node.right) {
        this._pushLeft(node.right);
    }
    
    return node.val;
};

/**
 * @return {boolean}
 */
BSTIterator.prototype.hasNext = function() {
    return this.stack.length > 0;
};
```
````

### Complexity Analysis

| Operation | Complexity |
|-----------|------------|
| **Constructor** | O(h) - Push h nodes to stack |
| **hasNext()** | O(1) - Just check if stack is empty |
| **next()** | O(1) amortized - Each node pushed and popped once |
| **Space** | O(h) - Stack stores at most h nodes |

---

## Approach 2: Precompute Array

This approach precomputes the entire in-order traversal.

### Algorithm Steps

1. In constructor, perform full in-order traversal and store in array
2. Maintain an index pointer
3. hasNext() and next() just use array access

### Why It Works

Simple but less space-efficient. Good for understanding but not optimal.

### Code Implementation

````carousel
```python
from typing import Optional, List

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class BSTIterator:
    def __init__(self, root: Optional[TreeNode]):
        """Precompute entire in-order traversal."""
        self.result = []
        self.index = 0
        self._inorder(root)
    
    def _inorder(self, node):
        """In-order traversal to collect all values."""
        if not node:
            return
        self._inorder(node.left)
        self.result.append(node.val)
        self._inorder(node.right)
    
    def next(self) -> int:
        """Return next smallest number."""
        val = self.result[self.index]
        self.index += 1
        return val

    def hasNext(self) -> bool:
        """Return whether we have next element."""
        return self.index < len(self.result)
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class BSTIterator {
private:
    vector<int> result;
    int index;
    
    void inorder(TreeNode* node) {
        if (!node) return;
        inorder(node->left);
        result.push_back(node->val);
        inorder(node->right);
    }
    
public:
    BSTIterator(TreeNode* root) {
        index = 0;
        inorder(root);
    }
    
    int next() {
        return result[index++];
    }
    
    bool hasNext() {
        return index < result.size();
    }
};
```

<!-- slide -->
```java
class BSTIterator {
    private List<Integer> result;
    private int index;
    
    private void inorder(TreeNode node) {
        if (node == null) return;
        inorder(node.left);
        result.add(node.val);
        inorder(node.right);
    }
    
    public BSTIterator(TreeNode root) {
        result = new ArrayList<>();
        index = 0;
        inorder(root);
    }
    
    public int next() {
        return result.get(index++);
    }
    
    public boolean hasNext() {
        return index < result.size();
    }
}
```

<!-- slide -->
```javascript
var BSTIterator = function(root) {
    this.result = [];
    this.index = 0;
    
    const inorder = (node) => {
        if (!node) return;
        inorder(node.left);
        this.result.push(node.val);
        inorder(node.right);
    };
    
    inorder(root);
};

BSTIterator.prototype.next = function() {
    return this.result[this.index++];
};

BSTIterator.prototype.hasNext = function() {
    return this.index < this.result.length;
};
```
````

### Complexity Analysis

| Operation | Complexity |
|-----------|------------|
| **Constructor** | O(n) - Full traversal |
| **hasNext()** | O(1) |
| **next()** | O(1) |
| **Space** | O(n) - Store all values |

---

## Comparison of Approaches

| Aspect | Stack-Based | Precompute Array |
|--------|-------------|-------------------|
| **Constructor** | O(h) | O(n) |
| **hasNext()** | O(1) | O(1) |
| **next()** | O(1) amortized | O(1) |
| **Space** | O(h) | O(n) |

**Best Approach:** The stack-based approach is optimal for memory usage.

---

## Why This Problem is Important

This problem demonstrates:
1. **Iterator Pattern**: Implementing standard iterator interface
2. **Lazy Evaluation**: Computing only what's needed
3. **Stack Usage**: Using stack for tree traversal
4. **Amortized Analysis**: Understanding amortized O(1) complexity

---

## Related Problems

### Same Pattern (Tree Iterator)

| Problem | LeetCode Link | Difficulty | Description |
|---------|---------------|------------|-------------|
| [Flatten Binary Tree to Linked List](https://leetcode.com/problems/flatten-binary-tree-to-linked-list/) | 114 | Medium | Tree to linked list |
| [Inorder Successor in BST](https://leetcode.com/problems/inorder-successor-in-bst/) | 285 | Medium | Find successor |
| [Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/) | 98 | Medium | BST validation |

### Similar Concepts

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| [Kth Smallest in BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/) | 230 | Kth smallest |
| [Iterator for Combination](https://leetcode.com/problems/iterator-for-combination/) | 1286 | Iterator pattern |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - Binary Search Tree Iterator](https://www.youtube.com/watch?v=R80C5Hy5d5g)** - Clear explanation

2. **[BST Iterator Explanation](https://www.youtube.com/watch?v=kmshJhAPajE)** - Detailed walkthrough

3. **[Tree Traversal Iterators](https://www.youtube.com/watch?v=7mwT7M4fGvQ)** - Iterator patterns

---

## Follow-up Questions

### Q1: How would you implement a reverse iterator (largest to smallest)?

**Answer:** Instead of pushing left children, push right children. The stack would contain nodes in reverse order.

---

### Q2: Can you implement hasNext() in O(1) without using extra space?

**Answer:** The current approach already uses O(h) space which is optimal. You can't do better than O(h) for arbitrary BSTs.

---

### Q3: How would you handle a very deep tree (skewed)?

**Answer:** The stack-based approach handles this well. The worst case is O(n) space for a skewed tree.

---

### Q4: What if you need to support peek() (see next without consuming)?

**Answer:** Simply return the value at stack.top() without popping, but you'd need to handle the right subtree case.

---

### Q5: How would you modify for a range query (elements in [low, high])?

**Answer:** Modify the push logic to only go left if node.val >= low, and stop early when node.val > high.

---

### Q6: What edge cases should be tested?

**Answer:**
- Empty tree
- Single node
- Left-skewed tree
- Right-skewed tree
- Complete BST

---

## Common Pitfalls

### 1. Forgetting Right Child
**Issue:** Not handling the right child after popping a node.

**Solution:** Always check and push left children of the right child.

### 2. Stack Not Initialized
**Issue:** Stack not initialized in constructor.

**Solution:** Initialize stack and push all left children in constructor.

### 3. Memory Leak
**Issue:** Not clearing stack references.

**Solution:** The stack will be garbage collected with the iterator.

---

## Summary

The **Binary Search Tree Iterator** problem demonstrates the iterator pattern with stack:

- **Stack-based**: Optimal O(h) space with O(1) amortized time
- **Lazy evaluation**: Only traverse what's needed
- **In-order**: Gives sorted order for BST

Key takeaways:
- **Stack for path**: Maintain the traversal path
- **Amortized O(1)**: Each node pushed/popped once
- **Iterator pattern**: Standard interface for iteration

This problem is essential for understanding lazy evaluation and iterators.

### Pattern Summary

This problem exemplifies the **Stack - Iterator Pattern**, characterized by:
- Using stack to maintain traversal state
- Lazy evaluation (only compute what's needed)
- O(1) amortized operations

For more details on tree traversal, see the **[Tree Traversal](/algorithms/tree-traversal)** section.
