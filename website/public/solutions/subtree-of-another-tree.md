# Subtree of Another Tree

## Problem Description

Given the roots of two binary trees `root` and `subRoot`, return `true` if there is a subtree of `root` with the same structure and node values of `subRoot` and `false` otherwise.

A subtree of a binary tree is a tree that consists of a node in tree and all of this node's descendants. The tree could also be considered as a subtree of itself.

**LeetCode Link:** [Subtree of Another Tree - LeetCode 572](https://leetcode.com/problems/subtree-of-another-tree/)

---

## Examples

### Example 1

**Input:**
```python
root = [3,4,5,1,2], subRoot = [4,1,2]
```

**Output:**
```python
True
```

**Explanation:** The tree with root 4 (and children 1, 2) is a subtree of root.

### Example 2

**Input:**
```python
root = [3,4,5,1,2,null,null,null,null,0], subRoot = [4,1,2]
```

**Output:**
```python
False
```

---

## Constraints

- The number of nodes in the root tree is in the range `[1, 2000]`.
- The number of nodes in the subRoot tree is in the range `[1, 1000]`.
- `-10^4 <= root.val <= 10^4`
- `-10^4 <= subRoot.val <= 10^4`

---

## Pattern: Tree DFS with Comparison

This problem uses **tree traversal (DFS)** to check if one tree is a subtree of another. We traverse the main tree and at each node, check if the subtree rooted at that node matches the target tree using a helper function that compares two trees for exact equality.

---

## Intuition

The key insight for this problem is understanding what constitutes a subtree and how to efficiently check for it.

### Key Observations

1. **Subtree Definition**: A subtree includes a node and all its descendants. So if we find a node in the main tree that matches the root of the target tree, we need to verify the entire subtree below it.

2. **Recursive Matching**: We can use recursion to check if two trees are identical - if they have the same structure and all node values match.

3. **DFS Traversal**: We traverse the main tree using DFS. At each node, we check if the subtree starting at that node matches the target tree.

4. **Early Return**: As soon as we find a matching subtree, we can return True without checking further.

### Why It Works

The recursive approach works because:
- For each node in the main tree, we compare it with the root of the target tree
- If they match (same value), we verify the entire subtree structure
- If they don't match, we recursively check the left and right subtrees
- This covers all possible subtree locations

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **DFS with Tree Comparison (Optimal)** - O(n * m) time
2. **String Serialization** - Using tree string representation

---

## Approach 1: DFS with Tree Comparison (Optimal)

### Algorithm Steps

1. Define a helper function `isSameTree` to compare two trees for exact equality
2. Define main function `isSubtree`:
   - If root is None, return False
   - If current root matches subRoot (isSameTree), return True
   - Otherwise, recursively check left and right subtrees
3. Return True if any recursive call returns True

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
    def isSubtree(self, root: Optional[TreeNode], subRoot: Optional[TreeNode]) -> bool:
        """
        Check if subRoot is a subtree of root.
        
        Args:
            root: Root of the main binary tree
            subRoot: Root of the subtree to find
            
        Returns:
            True if subRoot is a subtree of root
        """
        if not root:
            return False
        
        # Check if current subtree matches
        if self.isSameTree(root, subRoot):
            return True
        
        # Recursively check left and right subtrees
        return self.isSubtree(root.left, subRoot) or self.isSubtree(root.right, subRoot)
    
    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
        """
        Check if two trees are identical.
        
        Args:
            p: Root of first tree
            q: Root of second tree
            
        Returns:
            True if trees are identical
        """
        # Both nodes are None
        if not p and not q:
            return True
        
        # One of the nodes is None
        if not p or not q:
            return False
        
        # Both nodes exist, check values and recursively check children
        return (p.val == q.val and 
                self.isSameTree(p.left, q.left) and 
                self.isSameTree(p.right, q.right))
```

<!-- slide -->
```cpp
#include <functional>

// Definition for a binary tree node.
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
    bool isSubtree(TreeNode* root, TreeNode* subRoot) {
        if (!root) return false;
        
        if (isSameTree(root, subRoot)) return true;
        
        return isSubtree(root->left, subRoot) || isSubtree(root->right, subRoot);
    }
    
private:
    bool isSameTree(TreeNode* p, TreeNode* q) {
        if (!p && !q) return true;
        if (!p || !q) return false;
        
        return p->val == q->val && 
               isSameTree(p->left, q->left) && 
               isSameTree(p->right, q->right);
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
    public boolean isSubtree(TreeNode root, TreeNode subRoot) {
        if (root == null) return false;
        
        if (isSameTree(root, subRoot)) return true;
        
        return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
    }
    
    private boolean isSameTree(TreeNode p, TreeNode q) {
        if (p == null && q == null) return true;
        if (p == null || q == null) return false;
        
        return p.val == q.val && 
               isSameTree(p.left, q.left) && 
               isSameTree(p.right, q.right);
    }
}
```

<!-- slide -->
```javascript
// Definition for a binary tree node.
function TreeNode(val, left, right) {
    this.val = (val === undefined ? 0 : val);
    this.left = (left === undefined ? null : left);
    this.right = (right === undefined ? null : right);
}

/**
 * @param {TreeNode} root
 * @param {TreeNode} subRoot
 * @return {boolean}
 */
var isSubtree = function(root, subRoot) {
    if (!root) return false;
    
    if (isSameTree(root, subRoot)) return true;
    
    return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
};

function isSameTree(p, q) {
    if (!p && !q) return true;
    if (!p || !q) return false;
    
    return p.val === q.val && 
           isSameTree(p.left, q.left) && 
           isSameTree(p.right, q.right);
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n * m) where n is number of nodes in root, m in subRoot (worst case) |
| **Space** | O(h) where h is height of root (recursion stack) |

---

## Approach 2: String Serialization

### Algorithm Steps

1. Serialize both trees to string representations using preorder traversal
2. Use string find to check if subRoot's serialization is in root's serialization
3. Add special delimiters to avoid false positives (e.g., ",#," for null nodes)

### Why It Works

If we serialize trees to strings with proper delimiters, a subtree will produce a substring of the main tree's serialization.

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
    def isSubtree(self, root: Optional[TreeNode], subRoot: Optional[TreeNode]) -> bool:
        # Serialize both trees
        root_serial = self.serialize(root)
        subRoot_serial = self.serialize(subRoot)
        
        # Check if subRoot's serialization is in root's
        return subRoot_serial in root_serial
    
    def serialize(self, node: Optional[TreeNode]) -> str:
        if not node:
            return ",#"
        return f",{node.val}" + self.serialize(node.left) + self.serialize(node.right)
```

<!-- slide -->
```cpp
#include <string>
#include <functional>
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
    bool isSubtree(TreeNode* root, TreeNode* subRoot) {
        string rootSerial = serialize(root);
        string subRootSerial = serialize(subRoot);
        
        return rootSerial.find(subRootSerial) != string::npos;
    }
    
private:
    string serialize(TreeNode* node) {
        if (!node) return ",#";
        return "," + to_string(node->val) + serialize(node->left) + serialize(node->right);
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
    public boolean isSubtree(TreeNode root, TreeNode subRoot) {
        String rootSerial = serialize(root);
        String subRootSerial = serialize(subRoot);
        
        return rootSerial.contains(subRootSerial);
    }
    
    private String serialize(TreeNode node) {
        if (node == null) return ",#";
        return "," + node.val + serialize(node.left) + serialize(node.right);
    }
}
```

<!-- slide -->
```javascript
function TreeNode(val, left, right) {
    this.val = (val === undefined ? 0 : val);
    this.left = (left === undefined ? null : left);
    this.right = (right === undefined ? null : right);
}

/**
 * @param {TreeNode} root
 * @param {TreeNode} subRoot
 * @return {boolean}
 */
var isSubtree = function(root, subRoot) {
    const rootSerial = serialize(root);
    const subRootSerial = serialize(subRoot);
    
    return rootSerial.includes(subRootSerial);
};

function serialize(node) {
    if (!node) return ",#";
    return "," + node.val + serialize(node.left) + serialize(node.right);
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + m + n*m) worst case for string find |
| **Space** | O(n + m) for serializations |

---

## Comparison of Approaches

| Aspect | DFS Comparison | String Serialization |
|--------|----------------|---------------------|
| **Time Complexity** | O(n * m) | O(n + m + n*m) |
| **Space Complexity** | O(h) | O(n + m) |
| **Implementation** | Intuitive | Tricky with delimiters |
| **Recommended** | ✅ | For understanding |

**Best Approach:** Use Approach 1 (DFS Comparison) for clarity and practical performance.

---

## Common Pitfalls

### 1. Order of Checks
**Issue**: Checking left/right subtrees before checking current node.

**Solution**: Check `isSameTree` first before recursing.

### 2. Base Case for isSameTree
**Issue**: Not handling the case where both nodes are None.

**Solution**: Both None returns True; one None returns False.

### 3. Early Termination
**Issue**: Not returning immediately when subtree is found.

**Solution**: Return True as soon as matching subtree is found.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Amazon, Microsoft, Bloomberg
- **Difficulty**: Easy/Medium
- **Concepts Tested**: Tree traversal, recursion, tree comparison

### Learning Outcomes

1. **Tree Traversal**: Master DFS for tree problems
2. **Recursion**: Understand recursive tree comparison
3. **Subtree Concept**: Learn what constitutes a subtree

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Same Tree | [Link](https://leetcode.com/problems/same-tree/) | Check if two trees are identical |
| Count Subtrees | [Link](https://leetcode.com/problems/count-subtrees-with-max-distance-between-cities/) | Count specific subtrees |
| Flip Equivalent Binary Trees | [Link](https://leetcode.com/problems/flip-equivalent-binary-trees/) | Tree equivalence with flips |

---

## Video Tutorial Links

1. **[NeetCode - Subtree of Another Tree](https://www.youtube.com/watch?v=EmxxH62eaH8)** - Clear explanation
2. **[Tree DFS Explained](https://www.youtube.com/watch?v=1C0pT1F-5AU)** - DFS pattern for trees

---

## Follow-up Questions

### Q1: How would you optimize the time complexity?

**Answer:** Use hashing or tree serialization to reduce repeated comparisons. Precompute hash values for subtrees.

### Q2: What if you need to find all subtrees that match?

**Answer:** Instead of returning True when found, collect all root nodes where matches occur.

### Q3: How would you handle trees with millions of nodes?

**Answer:** The DFS approach could cause stack overflow. Consider using iterative traversal with an explicit stack.

---

## Summary

The **Subtree of Another Tree** problem demonstrates tree traversal and comparison techniques.

Key takeaways:
1. Use DFS to traverse the main tree
2. At each node, check if the subtree matches using `isSameTree`
3. Recursively check left and right subtrees if no match
4. Time complexity is O(n * m) in worst case
5. Handle base cases properly in tree comparison

This problem is essential for understanding tree traversal patterns and recursive tree operations.
