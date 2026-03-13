# Diameter Of Binary Tree

## LeetCode Link

[Diameter of Binary Tree - LeetCode](https://leetcode.com/problems/diameter-of-binary-tree/)

---

## Problem Description

Given the root of a binary tree, return the length of the diameter of the tree.
The diameter of a binary tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the root.
The length of a path between two nodes is represented by the number of edges between them.

---

## Examples

**Example 1:**

**Input:**
```python
root = [1,2,3,4,5]
```

**Output:**
```python
3
```

**Explanation:**
3 is the length of the path [4,2,1,3] or [5,2,1,3].

**Example 2:**

**Input:**
```python
root = [1,2]
```

**Output:**
```python
1
```

---

## Constraints

- The number of nodes in the tree is in the range `[1, 10^4]`.
- `-100 <= Node.val <= 100`.

---

## Intuition

The key insight for this problem is understanding that the **diameter at any node** is the sum of the heights of its left and right subtrees:

1. **Diameter at a node**: The longest path that passes through this node = left_height + right_height

2. **Global maximum**: We need to track the maximum diameter across ALL nodes

3. **Height calculation**: Height of a node = max(height of left child, height of right child) + 1

4. **Post-order traversal**: We need to calculate children's heights first before calculating the current node's diameter

**Example walkthrough:**
For `root = [1,2,3,4,5]`:
```
      1
     / \
    2   3
   / \
  4   5
```
- At node 4: height=1, no children → diameter=0
- At node 5: height=1, no children → diameter=0
- At node 2: left_height=1, right_height=1 → diameter=1+1=2
- At node 3: height=1 → diameter=0
- At node 1: left_height (from node 2) = 2, right_height=1 → diameter=2+1=3
- Maximum diameter = 3

---

## Pattern:

This problem follows the **Tree DFS** pattern with height calculation.

### Core Concept

- **Height Calculation**: Height of node = max(child heights) + 1
- **Diameter**: max(left_height + right_height) at any node
- **Post-Order**: Calculate height after processing children

### When to Use This Pattern

This pattern is applicable when:
1. Finding longest path in tree
2. Tree diameter problems
3. Path length calculations

### Related Patterns

| Pattern | Description |
|---------|-------------|
| Tree Height | Calculate height |
| Tree DFS | Depth-first traversal |

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **DFS with Height Tracking** - Optimal solution
2. **Bottom-Up DP** - Alternative recursive approach

---

## Approach 1: DFS with Height Tracking (Optimal)

### Algorithm Steps

1. **Initialize global diameter**: Set to 0
2. **DFS function**: For each node, compute height of left and right subtrees
3. **Update diameter**: At each node, diameter = left_height + right_height
4. **Return height**: Return max(left_height, right_height) + 1
5. **Final result**: Return the global maximum diameter

### Why It Works

We use post-order traversal (left, right, root) to first compute the heights of children before using them to calculate the diameter at the current node. The diameter passing through any node is the sum of heights of its left and right subtrees.

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
    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        """
        Find the diameter of a binary tree.
        
        Args:
            root: Root of binary tree
            
        Returns:
            Diameter of the binary tree
        """
        self.diameter = 0
        
        def get_height(node):
            if not node:
                return 0
            
            # Recursively get heights of left and right subtrees
            left_height = get_height(node.left)
            right_height = get_height(node.right)
            
            # Update diameter at this node
            self.diameter = max(self.diameter, left_height + right_height)
            
            # Return height of this node
            return max(left_height, right_height) + 1
        
        get_height(root)
        return self.diameter
```

<!-- slide -->
```cpp
#include <algorithm>
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

class Solution {
public:
    int diameter = 0;
    
    int getHeight(TreeNode* node) {
        if (!node) return 0;
        
        int leftHeight = getHeight(node->left);
        int rightHeight = getHeight(node->right);
        
        diameter = max(diameter, leftHeight + rightHeight);
        
        return max(leftHeight, rightHeight) + 1;
    }
    
    int diameterOfBinaryTree(TreeNode* root) {
        diameter = 0;
        getHeight(root);
        return diameter;
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
    private int diameter = 0;
    
    private int getHeight(TreeNode node) {
        if (node == null) return 0;
        
        int leftHeight = getHeight(node.left);
        int rightHeight = getHeight(node.right);
        
        diameter = Math.max(diameter, leftHeight + rightHeight);
        
        return Math.max(leftHeight, rightHeight) + 1;
    }
    
    public int diameterOfBinaryTree(TreeNode root) {
        diameter = 0;
        getHeight(root);
        return diameter;
    }
}
```

<!-- slide -->
```javascript
// Definition for a binary tree node.
class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

/**
 * @param {TreeNode} root
 * @return {number}
 */
var diameterOfBinaryTree = function(root) {
    let diameter = 0;
    
    function getHeight(node) {
        if (!node) return 0;
        
        const leftHeight = getHeight(node.left);
        const rightHeight = getHeight(node.right);
        
        diameter = Math.max(diameter, leftHeight + rightHeight);
        
        return Math.max(leftHeight, rightHeight) + 1;
    }
    
    getHeight(root);
    return diameter;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - visiting each node once |
| **Space** | O(h) - recursion stack, h = height of tree |

---

## Approach 2: Bottom-Up DP

### Algorithm Steps

1. **Return pair**: For each node, return both diameter and height
2. **Compute bottom-up**: Use DP to compute values from leaves upward
3. **Track maximum**: Maintain global maximum diameter

### Why It Works

This approach is conceptually similar but uses a bottom-up DP style where each node computes its result based on children's results.

### Code Implementation

````carousel
```python
from typing import Optional, Tuple

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        """
        Using bottom-up approach.
        """
        def dfs(node):
            if not node:
                return (0, 0)  # (diameter, height)
            
            left_dia, left_height = dfs(node.left)
            right_dia, right_height = dfs(node.right)
            
            # Diameter through this node
            through_node = left_height + right_height
            
            # Max diameter is max of: left diameter, right diameter, through this node
            diameter = max(left_dia, right_dia, through_node)
            height = max(left_height, right_height) + 1
            
            return (diameter, height)
        
        if not root:
            return 0
        return dfs(root)[0]
```

<!-- slide -->
```cpp
#include <algorithm>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    pair<int, int> dfs(TreeNode* node) {
        if (!node) return {0, 0};
        
        auto [leftDia, leftHeight] = dfs(node->left);
        auto [rightDia, rightHeight] = dfs(node->right);
        
        int throughNode = leftHeight + rightHeight;
        int diameter = max({leftDia, rightDia, throughNode});
        int height = max(leftHeight, rightHeight) + 1;
        
        return {diameter, height};
    }
    
    int diameterOfBinaryTree(TreeNode* root) {
        if (!root) return 0;
        return dfs(root).first;
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
}

class Solution {
    private int[] dfs(TreeNode node) {
        if (node == null) return new int[]{0, 0};
        
        int[] left = dfs(node.left);
        int[] right = dfs(node.right);
        
        int throughNode = left[1] + right[1];
        int diameter = Math.max(Math.max(left[0], right[0]), throughNode);
        int height = Math.max(left[1], right[1]) + 1;
        
        return new int[]{diameter, height};
    }
    
    public int diameterOfBinaryTree(TreeNode root) {
        if (root == null) return 0;
        return dfs(root)[0];
    }
}
```

<!-- slide -->
```javascript
var diameterOfBinaryTree = function(root) {
    function dfs(node) {
        if (!node) return [0, 0];
        
        const [leftDia, leftHeight] = dfs(node.left);
        const [rightDia, rightHeight] = dfs(node.right);
        
        const throughNode = leftHeight + rightHeight;
        const diameter = Math.max(leftDia, rightDia, throughNode);
        const height = Math.max(leftHeight, rightHeight) + 1;
        
        return [diameter, height];
    }
    
    if (!root) return 0;
    return dfs(root)[0];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - visiting each node once |
| **Space** | O(h) - recursion stack |

---

## Comparison of Approaches

| Aspect | DFS + Global | Bottom-Up DP |
|--------|--------------|--------------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(h) | O(h) |
| **Implementation** | Simpler | More complex |
| **LeetCode Optimal** | ✅ | ✅ |

**Best Approach:** Use Approach 1 (DFS with global variable) for simplicity.

---

## Related Problems

Based on similar themes (tree, DFS, path problems):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Maximum Depth of Binary Tree | [Link](https://leetcode.com/problems/maximum-depth-of-binary-tree/) | Tree depth |
| Longest Univalue Path | [Link](https://leetcode.com/problems/longest-univalue-path/) | Similar diameter |
| Binary Tree Longest Consecutive Sequence | [Link](https://leetcode.com/problems/binary-tree-longest-consecutive-sequence/) | Path in tree |
| Sum Root to Leaf Numbers | [Link](https://leetcode.com/problems/sum-root-to-leaf-numbers/) | Path sum |

---

## Video Tutorial Links

Here are helpful YouTube tutorials:

1. **[NeetCode - Diameter of Binary Tree](https://www.youtube.com/watch?v=3YXDbhZ1dYg)** - Clear explanation
2. **[Diameter of Binary Tree - LeetCode 543](https://www.youtube.com/watch?v=3YXDbhZ1dYg)** - Detailed walkthrough
3. **[Tree Traversal](https://www.youtube.com/watch?v=1XdT4XQw1y0)** - Tree DFS

---

## Follow-up Questions

### Q1: How would you return the actual path (nodes) instead of just length?

**Answer:** Track parent pointers or store the path along with the diameter calculation.

### Q2: What if the diameter must pass through the root?

**Answer:** Simply calculate height of left subtree + height of right subtree at root.

### Q3: How would you handle an empty tree?

**Answer:** Return 0 for null/empty root.

---

## Common Pitfalls

### 1. Not Tracking Global Maximum
**Issue:** Only calculating at root.

**Solution:** Use global variable to track max diameter.

### 2. Off-by-One in Height
**Issue:** Height vs edge count confusion.

**Solution:** Height = max(child heights) + 1.

### 3. Not Returning Height
**Issue:** Not returning computed height to parent.

**Solution:** Each call returns height to parent.

---

## Summary

The **Diameter of Binary Tree** problem demonstrates the **Tree DFS** pattern:

- **Post-order traversal**: Calculate children's heights first
- **Diameter formula**: left_height + right_height at each node
- **Global tracking**: Maintain maximum across all nodes
- **Time complexity**: O(n) - optimal

Key insights:
1. Diameter at a node = left_height + right_height
2. Use post-order traversal to compute heights
3. Track global maximum diameter
4. Height = max(child heights) + 1

This pattern extends to:
- Longest path problems
- Tree height calculations
- Various tree traversals
