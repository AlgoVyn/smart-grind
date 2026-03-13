# Symmetric Tree

## Problem Description

Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).

**LeetCode Link:** [Symmetric Tree - LeetCode 101](https://leetcode.com/problems/symmetric-tree/)

---

## Examples

### Example 1

**Input:**
```python
root = [1,2,2,3,4,4,3]
```

**Output:**
```python
True
```

**Explanation:** The tree is symmetric around its center.

### Example 2

**Input:**
```python
root = [1,2,2,null,3,null,3]
```

**Output:**
```python
False
```

---

## Constraints

- The number of nodes in the tree is in the range `[1, 1000]`.
- `-100 <= Node.val <= 100`

**Follow up:** Could you solve it both recursively and iteratively?

---

## Pattern: Tree DFS with Mirror Comparison

This problem uses **recursive DFS** to check if a tree is symmetric. The key insight is that we compare the left subtree of one node with the right subtree of its mirror position. Two trees are mirrors if: both are null, or both have equal values and left of one equals right of other.

---

## Intuition

The key insight for this problem is understanding the mirror relationship between two subtrees.

### Key Observations

1. **Mirror Definition**: A tree is symmetric if the left subtree is a mirror of the right subtree.

2. **Recursive Comparison**: At each node, compare:
   - Left subtree's left child with right subtree's right child
   - Left subtree's right child with right subtree's left child

3. **Base Cases**:
   - Both nodes are None → symmetric (True)
   - One is None, other isn't → not symmetric (False)
   - Both values differ → not symmetric (False)

4. **Iterative Alternative**: Use a queue or stack to compare nodes in pairs (level-order style).

### Why It Works

The recursive approach works because:
- We compare corresponding mirrored positions at each level
- If all mirrored pairs match, the tree is symmetric
- The recursion naturally traverses all needed pairs

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Recursive DFS** - O(n) time
2. **Iterative (Queue/Stack)** - O(n) time

---

## Approach 1: Recursive DFS

### Algorithm Steps

1. Handle base case: if root is None, return True
2. Define helper function `is_mirror` that takes two nodes
3. In `is_mirror`:
   - If both None, return True
   - If one is None, return False
   - If values differ, return False
   - Otherwise, compare left of one with right of other, and right of one with left of other
4. Call `is_mirror(root.left, root.right)`

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
    def isSymmetric(self, root: Optional[TreeNode]) -> bool:
        """
        Check if a binary tree is symmetric.
        
        Args:
            root: Root of the binary tree
            
        Returns:
            True if tree is symmetric
        """
        if not root:
            return True
        
        def is_mirror(left: Optional[TreeNode], right: Optional[TreeNode]) -> bool:
            # Base case: both nodes are None
            if not left and not right:
                return True
            
            # One of them is None
            if not left or not right:
                return False
            
            # Values don't match
            if left.val != right.val:
                return False
            
            # Recursively check mirror property
            return (is_mirror(left.left, right.right) and
                    is_mirror(left.right, right.left))
        
        return is_mirror(root.left, root.right)
```

<!-- slide -->
```cpp
#include <functional>

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
    bool isSymmetric(TreeNode* root) {
        if (!root) return true;
        
        function<bool(TreeNode*, TreeNode*)> isMirror = 
            [&](TreeNode* left, TreeNode* right) -> bool {
                if (!left && !right) return true;
                if (!left || !right) return false;
                if (left->val != right->val) return false;
                
                return isMirror(left->left, right->right) && 
                       isMirror(left->right, right->left);
            };
        
        return isMirror(root->left, root->right);
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
    public boolean isSymmetric(TreeNode root) {
        if (root == null) return true;
        
        return isMirror(root.left, root.right);
    }
    
    private boolean isMirror(TreeNode left, TreeNode right) {
        if (left == null && right == null) return true;
        if (left == null || right == null) return false;
        if (left.val != right.val) return false;
        
        return isMirror(left.left, right.right) && 
               isMirror(left.right, right.left);
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
 * @return {boolean}
 */
var isSymmetric = function(root) {
    if (!root) return true;
    
    function isMirror(left, right) {
        if (!left && !right) return true;
        if (!left || !right) return false;
        if (left.val !== right.val) return false;
        
        return isMirror(left.left, right.right) && 
               isMirror(left.right, right.left);
    }
    
    return isMirror(root.left, root.right);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - visit each node once |
| **Space** | O(h) - recursion stack, h is height |

---

## Approach 2: Iterative (Queue)

### Algorithm Steps

1. If root is None, return True
2. Use a queue to process node pairs
3. Add root.left and root.right to queue
4. While queue is not empty:
   - Pop two nodes
   - If both None, continue
   - If one is None, return False
   - If values differ, return False
   - Add left.left with right.right, and left.right with right.left
5. Return True if queue is exhausted

### Code Implementation

````carousel
```python
from typing import Optional
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


class Solution:
    def isSymmetric(self, root: Optional[TreeNode]) -> bool:
        if not root:
            return True
        
        queue = deque([root.left, root.right])
        
        while queue:
            left = queue.popleft()
            right = queue.popleft()
            
            if not left and not right:
                continue
            
            if not left or not right:
                return False
            
            if left.val != right.val:
                return False
            
            # Add mirror pairs
            queue.append(left.left)
            queue.append(right.right)
            queue.append(left.right)
            queue.append(right.left)
        
        return True
```

<!-- slide -->
```cpp
#include <queue>
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
    bool isSymmetric(TreeNode* root) {
        if (!root) return true;
        
        queue<TreeNode*> q;
        q.push(root->left);
        q.push(root->right);
        
        while (!q.empty()) {
            TreeNode* left = q.front(); q.pop();
            TreeNode* right = q.front(); q.pop();
            
            if (!left && !right) continue;
            if (!left || !right) return false;
            if (left->val != right->val) return false;
            
            q.push(left->left);
            q.push(right->right);
            q.push(left->right);
            q.push(right->left);
        }
        
        return true;
    }
};
```

<!-- slide -->
```java
import java.util.*;

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
    public boolean isSymmetric(TreeNode root) {
        if (root == null) return true;
        
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root.left);
        q.add(root.right);
        
        while (!q.isEmpty()) {
            TreeNode left = q.poll();
            TreeNode right = q.poll();
            
            if (left == null && right == null) continue;
            if (left == null || right == null) return false;
            if (left.val != right.val) return false;
            
            q.add(left.left);
            q.add(right.right);
            q.add(left.right);
            q.add(right.left);
        }
        
        return true;
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
 * @return {boolean}
 */
var isSymmetric = function(root) {
    if (!root) return true;
    
    const queue = [root.left, root.right];
    
    while (queue.length > 0) {
        const left = queue.shift();
        const right = queue.shift();
        
        if (!left && !right) continue;
        if (!left || !right) return false;
        if (left.val !== right.val) return false;
        
        queue.push(left.left);
        queue.push(right.right);
        queue.push(left.right);
        queue.push(right.left);
    }
    
    return true;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - visit each node once |
| **Space** | O(w) - queue size, w is max width |

---

## Comparison of Approaches

| Aspect | Recursive DFS | Iterative (Queue) |
|--------|---------------|-------------------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(h) | O(w) |
| **Implementation** | Simple | Moderate |
| **Recommended** | ✅ | ✅ |

**Best Approach:** Use either approach - both are efficient and clean.

---

## Common Pitfalls

### 1. Mirror Comparison Order
**Issue**: Comparing left.left with left.right instead of left.right with right.left.

**Solution**: Remember: left's left ↔ right's right, and left's right ↔ right's left.

### 2. Base Cases
**Issue**: Not handling both nodes being None.

**Solution**: Always check if both are None before checking individual nodes.

### 3. Empty Tree
**Issue**: Not handling empty tree as symmetric.

**Solution**: Return True if root is None.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Very commonly asked in technical interviews
- **Companies**: Amazon, Microsoft, Apple
- **Difficulty**: Easy
- **Concepts Tested**: Tree traversal, recursion, mirror trees

### Learning Outcomes

1. **Recursive Tree Thinking**: Master recursive tree comparison
2. **Mirror Property**: Understand mirror relationships in trees
3. **Both Solutions**: Learn both recursive and iterative approaches

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Same Tree | [Link](https://leetcode.com/problems/same-tree/) | Check if two trees are identical |
| Maximum Depth of Binary Tree | [Link](https://leetcode.com/problems/maximum-depth-of-binary-tree/) | Tree depth |
| Balanced Binary Tree | [Link](https://leetcode.com/problems/balanced-binary-tree/) | Check if tree is balanced |

---

## Video Tutorial Links

1. **[NeetCode - Symmetric Tree](https://www.youtube.com/watch?v=vjvY4HmXVMs)** - Clear explanation
2. **[Symmetric Tree - Recursive vs Iterative](https://www.youtube.com/watch?v=3pO3n3c7qKk)** - Both approaches

---

## Follow-up Questions

### Q1: How would you modify to check if two trees are mirrors of each other?

**Answer:** This is exactly what the symmetric check does - compare left subtree of one with right subtree of the other.

### Q2: Can you solve it using only one traversal?

**Answer:** The current solution already traverses each node once, which is optimal.

### Q3: What if you need to return the axis of symmetry?

**Answer:** For a symmetric tree, the axis passes through the root. For subtrees, track the center node during traversal.

---

## Summary

The **Symmetric Tree** problem demonstrates mirror tree comparisons.

Key takeaways:
1. Compare left subtree with right subtree using mirror logic
2. At each level: left's left ↔ right's right, left's right ↔ right's left
3. Handle base cases: both None → True, one None → False
4. Can be solved both recursively and iteratively
5. Time complexity is O(n)

This problem is essential for understanding tree symmetry and recursive tree traversal patterns.
