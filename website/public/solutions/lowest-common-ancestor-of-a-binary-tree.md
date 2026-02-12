# Lowest Common Ancestor of a Binary Tree

## Problem Description

Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree. According to the definition of LCA on Wikipedia: "The lowest common ancestor is defined between two nodes p and q as the lowest node in the tree that has both p and q as descendants (where we allow a node to be a descendant of itself)."

In a binary tree:
- Each node has at most two children (left and right)
- Unlike a BST, there is no ordering property of node values
- The tree can be unbalanced, skewed, or any shape

This problem differs from the BST version because we cannot use value comparisons to guide our search direction—we must explore both subtrees.

---

## Constraints

- The number of nodes in the tree is in the range [2, 10^4]
- -10^9 <= Node.val <= 10^9
- All Node.val are unique
- p and q are guaranteed to exist in the tree
- The tree is not necessarily a BST

---

## Example 1

**Input:**
```python
root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
```

**Output:**
```python
3
```

**Visual:**
```
        3
       / \
      5   1
     / \ / \
    6  2 0  8
      / \
     7   4
```

**Explanation:**
- Node 5 is in the left subtree of 3
- Node 1 is in the right subtree of 3
- Since 3 is the first node where the paths to 5 and 1 diverge, 3 is the LCA

---

## Example 2

**Input:**
```python
root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4
```

**Output:**
```python
5
```

**Visual:**
```
        3
       / \
      5   1
     / \ / \
    6  2 0  8
      / \
     7   4
```

**Explanation:**
- Node 4 is a descendant of Node 2
- Node 2 is a descendant of Node 5
- When one node is an ancestor of the other, that ancestor is the LCA
- Therefore, the LCA is 5

---

## Example 3

**Input:**
```python
root = [1,2], p = 1, q = 2
```

**Output:**
```python
1
```

**Visual:**
```
    1
   /
  2
```

**Explanation:**
- Node 2 is in the left subtree of Node 1
- Since 1 is the parent of 2, and both are descendants of 1, 1 is the LCA

---

## Solution

We use three approaches to solve this problem:

1. **Recursive Post-order Traversal** - Most intuitive, checks both subtrees
2. **Iterative with Parent Pointers** - Uses BFS/DFS to build parent map
3. **Path Comparison Approach** - Finds paths from root to both nodes

---

## Approach 1: Recursive Post-order Traversal

### Algorithm

The recursive approach uses post-order traversal (left → right → root) to find the LCA:

1. **Base Case**: If root is null, return null
2. **Check current node**: If root equals p or q, return root (found one of the targets)
3. **Search left subtree**: Recursively search for p or q in left subtree
4. **Search right subtree**: Recursively search for p or q in right subtree
5. **Check for LCA**: If both left and right recursive calls return non-null, current root is the LCA
6. **Propagate result**: Return whatever is found (p, q, or LCA) upward

### Code Implementation

````carousel
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        """
        Find the lowest common ancestor of two nodes in a binary tree.
        
        Args:
            root: Root node of the binary tree
            p: First node
            q: Second node
            
        Returns:
            Lowest Common Ancestor node
        """
        # Base case: if root is null or matches p or q, return root
        if not root or root == p or root == q:
            return root
        
        # Search left subtree for p or q
        left_lca = self.lowestCommonAncestor(root.left, p, q)
        
        # Search right subtree for p or q
        right_lca = self.lowestCommonAncestor(root.right, p, q)
        
        # If both sides return non-null, current root is the LCA
        if left_lca and right_lca:
            return root
        
        # Return whichever side found p or q (or null if neither)
        return left_lca if left_lca else right_lca
```

<!-- slide -->
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */

class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        // Base case: if root is null or matches p or q, return root
        if (!root || root == p || root == q) {
            return root;
        }
        
        // Search left subtree for p or q
        TreeNode* left_lca = lowestCommonAncestor(root->left, p, q);
        
        // Search right subtree for p or q
        TreeNode* right_lca = lowestCommonAncestor(root->right, p, q);
        
        // If both sides return non-null, current root is the LCA
        if (left_lca && right_lca) {
            return root;
        }
        
        // Return whichever side found p or q
        return left_lca ? left_lca : right_lca;
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
 *     TreeNode(int x) { val = x; }
 * }
 */

class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        // Base case: if root is null or matches p or q, return root
        if (root == null || root == p || root == q) {
            return root;
        }
        
        // Search left subtree for p or q
        TreeNode left_lca = lowestCommonAncestor(root.left, p, q);
        
        // Search right subtree for p or q
        TreeNode right_lca = lowestCommonAncestor(root.right, p, q);
        
        // If both sides return non-null, current root is the LCA
        if (left_lca != null && right_lca != null) {
            return root;
        }
        
        // Return whichever side found p or q
        return left_lca != null ? left_lca : right_lca;
    }
}
```

<!-- slide -->
```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function(root, p, q) {
    // Base case: if root is null or matches p or q, return root
    if (!root || root === p || root === q) {
        return root;
    }
    
    // Search left subtree for p or q
    const left_lca = lowestCommonAncestor(root.left, p, q);
    
    // Search right subtree for p or q
    const right_lca = lowestCommonAncestor(root.right, p, q);
    
    // If both sides return non-null, current root is the LCA
    if (left_lca && right_lca) {
        return root;
    }
    
    // Return whichever side found p or q
    return left_lca ? left_lca : right_lca;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each node is visited exactly once |
| **Space** | O(h) - Recursion stack depth equals tree height |
| **Worst Case** | O(n) for skewed tree (space and time) |
| **Best Case** | O(log n) for balanced tree (space) |

---

## Approach 2: Iterative with Parent Pointers

### Algorithm

This approach first builds a parent pointer map using BFS, then finds the LCA by traversing from one node upward:

1. **Build parent map**: Use BFS/DFS to create a hash map mapping each node to its parent
2. **Find ancestors of p**: Traverse from p upward, storing all ancestors in a set
3. **Find first common ancestor**: Traverse from q upward, checking against p's ancestors
4. **Return LCA**: The first ancestor of q found in p's ancestor set is the LCA

### Code Implementation

````carousel
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        """
        Find the lowest common ancestor using parent pointers.
        
        Args:
            root: Root node of the binary tree
            p: First node
            q: Second node
            
        Returns:
            Lowest Common Ancestor node
        """
        if not root:
            return None
        
        # Step 1: Build parent pointers using BFS
        parent = {root: None}
        queue = [root]
        
        # Continue until we find both p and q
        while p not in parent or q not in parent:
            node = queue.pop(0)
            if node.left:
                parent[node.left] = node
                queue.append(node.left)
            if node.right:
                parent[node.right] = node
                queue.append(node.right)
        
        # Step 2: Collect all ancestors of p
        ancestors = set()
        while p:
            ancestors.add(p)
            p = parent[p]
        
        # Step 3: Find first common ancestor
        while q not in ancestors:
            q = parent[q]
        
        return q
```

<!-- slide -->
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */

class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        if (!root) return nullptr;
        
        // Step 1: Build parent pointers using BFS
        unordered_map<TreeNode*, TreeNode*> parent;
        queue<TreeNode*> queue;
        parent[root] = nullptr;
        queue.push(root);
        
        // Continue until we find both p and q
        while (parent.find(p) == parent.end() || parent.find(q) == parent.end()) {
            TreeNode* node = queue.front();
            queue.pop();
            if (node->left) {
                parent[node->left] = node;
                queue.push(node->left);
            }
            if (node->right) {
                parent[node->right] = node;
                queue.push(node->right);
            }
        }
        
        // Step 2: Collect all ancestors of p
        unordered_set<TreeNode*> ancestors;
        while (p) {
            ancestors.insert(p);
            p = parent[p];
        }
        
        // Step 3: Find first common ancestor
        while (ancestors.find(q) == ancestors.end()) {
            q = parent[q];
        }
        
        return q;
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
 *     TreeNode(int x) { val = x; }
 * }
 */

class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null) return null;
        
        // Step 1: Build parent pointers using BFS
        Map<TreeNode, TreeNode> parent = new HashMap<>();
        Queue<TreeNode> queue = new LinkedList<>();
        parent.put(root, null);
        queue.offer(root);
        
        // Continue until we find both p and q
        while (!parent.containsKey(p) || !parent.containsKey(q)) {
            TreeNode node = queue.poll();
            if (node.left != null) {
                parent.put(node.left, node);
                queue.offer(node.left);
            }
            if (node.right != null) {
                parent.put(node.right, node);
                queue.offer(node.right);
            }
        }
        
        // Step 2: Collect all ancestors of p
        Set<TreeNode> ancestors = new HashSet<>();
        while (p != null) {
            ancestors.add(p);
            p = parent.get(p);
        }
        
        // Step 3: Find first common ancestor
        while (!ancestors.contains(q)) {
            q = parent.get(q);
        }
        
        return q;
    }
}
```

<!-- slide -->
```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function(root, p, q) {
    if (!root) return null;
    
    // Step 1: Build parent pointers using BFS
    const parent = new Map();
    const queue = [root];
    parent.set(root, null);
    
    // Continue until we find both p and q
    while (!parent.has(p) || !parent.has(q)) {
        const node = queue.shift();
        if (node.left) {
            parent.set(node.left, node);
            queue.push(node.left);
        }
        if (node.right) {
            parent.set(node.right, node);
            queue.push(node.right);
        }
    }
    
    // Step 2: Collect all ancestors of p
    const ancestors = new Set();
    while (p) {
        ancestors.add(p);
        p = parent.get(p);
    }
    
    // Step 3: Find first common ancestor
    while (!ancestors.has(q)) {
        q = parent.get(q);
    }
    
    return q;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - BFS visits each node once, plus O(h) for ancestor traversal |
| **Space** | O(n) - Hash map stores parent pointers for all nodes |
| **Trade-off** | Preprocessing enables O(1) LCA queries after |

---

## Approach 3: Path Comparison Approach

### Algorithm

This approach finds the paths from root to p and root to q, then finds the last common node:

1. **Find path to p**: DFS to find and store the path from root to p
2. **Find path to q**: DFS to find and store the path from root to q
3. **Compare paths**: Find the last common node in both paths
4. **Return LCA**: The last common node is the LCA

### Code Implementation

````carousel
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        """
        Find the lowest common ancestor by comparing paths from root.
        
        Args:
            root: Root node of the binary tree
            p: First node
            q: Second node
            
        Returns:
            Lowest Common Ancestor node
        """
        def find_path(root: 'TreeNode', target: 'TreeNode', path: list) -> bool:
            """DFS to find path from root to target."""
            if not root:
                return False
            
            path.append(root)
            
            if root == target:
                return True
            
            if (root.left and find_path(root.left, target, path)) or \
               (root.right and find_path(root.right, target, path)):
                return True
            
            path.pop()
            return False
        
        # Step 1: Find paths from root to p and root to q
        path_p, path_q = [], []
        find_path(root, p, path_p)
        find_path(root, q, path_q)
        
        # Step 2: Find the last common node in both paths
        lca = None
        for i in range(min(len(path_p), len(path_q))):
            if path_p[i] == path_q[i]:
                lca = path_p[i]
            else:
                break
        
        return lca
```

<!-- slide -->
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */

class Solution {
private:
    bool findPath(TreeNode* root, TreeNode* target, vector<TreeNode*>& path) {
        if (!root) return false;
        
        path.push_back(root);
        
        if (root == target) return true;
        
        if ((root->left && findPath(root->left, target, path)) || 
            (root->right && findPath(root->right, target, path))) {
            return true;
        }
        
        path.pop_back();
        return false;
    }
    
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        vector<TreeNode*> path_p, path_q;
        
        // Step 1: Find paths from root to p and root to q
        findPath(root, p, path_p);
        findPath(root, q, path_q);
        
        // Step 2: Find the last common node in both paths
        TreeNode* lca = nullptr;
        for (size_t i = 0; i < min(path_p.size(), path_q.size()); i++) {
            if (path_p[i] == path_q[i]) {
                lca = path_p[i];
            } else {
                break;
            }
        }
        
        return lca;
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
 *     TreeNode(int x) { val = x; }
 * }
 */

class Solution {
    private boolean findPath(TreeNode root, TreeNode target, List<TreeNode> path) {
        if (root == null) return false;
        
        path.add(root);
        
        if (root == target) return true;
        
        if ((root.left != null && findPath(root.left, target, path)) || 
            (root.right != null && findPath(root.right, target, path))) {
            return true;
        }
        
        path.remove(path.size() - 1);
        return false;
    }
    
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        List<TreeNode> path_p = new ArrayList<>();
        List<TreeNode> path_q = new ArrayList<>();
        
        // Step 1: Find paths from root to p and root to q
        findPath(root, p, path_p);
        findPath(root, q, path_q);
        
        // Step 2: Find the last common node in both paths
        TreeNode lca = null;
        for (int i = 0; i < Math.min(path_p.size(), path_q.size()); i++) {
            if (path_p.get(i) == path_q.get(i)) {
                lca = path_p.get(i);
            } else {
                break;
            }
        }
        
        return lca;
    }
}
```

<!-- slide -->
```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function(root, p, q) {
    function findPath(root, target, path) {
        if (!root) return false;
        
        path.push(root);
        
        if (root === target) return true;
        
        if ((root.left && findPath(root.left, target, path)) || 
            (root.right && findPath(root.right, target, path))) {
            return true;
        }
        
        path.pop();
        return false;
    }
    
    // Step 1: Find paths from root to p and root to q
    const path_p = [];
    const path_q = [];
    findPath(root, p, path_p);
    findPath(root, q, path_q);
    
    // Step 2: Find the last common node in both paths
    let lca = null;
    for (let i = 0; i < Math.min(path_p.length, path_q.length); i++) {
        if (path_p[i] === path_q[i]) {
            lca = path_p[i];
        } else {
            break;
        }
    }
    
    return lca;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each DFS may traverse the entire tree in worst case |
| **Space** | O(h) - Path storage equals tree height (plus recursion stack) |
| **Note** | Simpler to understand but less efficient than recursive approach |

---

## Comparison of Approaches

| Aspect | Recursive | Parent Pointer | Path Comparison |
|--------|------------|----------------|-----------------|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(h) | O(n) | O(h) |
| **Implementation** | Simple, elegant | More complex | Simple |
| **Code Readability** | High | Medium | High |
| **Stack Overflow Risk** | Yes | No | Yes |
| **Additional Data Structures** | None | Hash map | Lists |
| **Multiple Queries** | Poor | Excellent | Poor |
| **Best For** | Single query, balanced trees | Multiple queries | Understanding concepts |

**Where:**
- n = number of nodes
- h = height of tree (can be O(n) for skewed tree, O(log n) for balanced tree)

---

## Explanation

### Why This Problem is Different from BST Version

Unlike BSTs, regular binary trees have no ordering property, which means:

1. **No search direction**: We cannot eliminate half the tree at each step
2. **Must explore both sides**: We need to search both left and right subtrees
3. **More work required**: The solution must explicitly check both subtrees

### The Key Insight

The recursive solution works because of how information flows upward:

1. **When a subtree returns null**: That subtree doesn't contain p or q
2. **When a subtree returns non-null**: That subtree contains at least one of p or q
3. **When both return non-null**: Each side found one of the nodes, so current node is LCA
4. **When one returns non-null**: Propagate that result upward

### Post-order Traversal

Post-order (left → right → root) is ideal because:
- We need results from both children before we can determine the LCA
- The information flows naturally from leaves to root
- Each node makes a decision based on its children's findings

### Why Recursive Approach is Preferred

1. **Elegant**: Clean, mathematical definition
2. **Efficient**: O(n) time, O(h) space (optimal)
3. **No preprocessing**: Doesn't require building parent maps
4. **Single pass**: Visits each node exactly once

---

## Followup Questions

### Q1: How would you find the LCA if the tree had parent pointers?

**Answer:** With parent pointers, you can:
1. Find the depth of both nodes
2. Move the deeper node up to the same depth
3. Move both nodes up simultaneously until they meet
4. This approach is O(h) time and O(1) space

### Q2: How would you find the LCA in O(1) space without parent pointers?

**Answer:** This is challenging:
1. First pass: Find depths of p and q using the iterative method
2. Second pass: Move the deeper node up to match depths
3. Third pass: Move both up until they meet
4. Total O(n) time, O(1) space

### Q3: How would you modify the solution for multiple LCA queries?

**Answer:** Preprocessing helps with multiple queries:
1. Build parent pointers using BFS/DFS (O(n) time, O(n) space)
2. Each LCA query then takes O(h) time with O(1) space
3. This trade-off is worthwhile if you have many queries

### Q4: How would you find the distance between two nodes?

**Answer:** Distance = depth(p) + depth(q) - 2 × depth(LCA):
1. Find LCA using any approach
2. Find depths of p, q, and LCA
3. Calculate: depth(p) + depth(q) - 2 × depth(LCA)

### Q5: How would you check if a node is an ancestor of another?

**Answer:** You can:
1. Perform DFS/BFS from the potential ancestor
2. Check if the target node is found
3. Return true if found, false otherwise
4. Time: O(n), Space: O(h) or O(n) depending on approach

### Q6: What if p and q are not guaranteed to exist?

**Answer:** Modify the base cases:
1. Track whether both nodes were actually found
2. Only return LCA if both were found
3. Return null or throw exception if nodes don't exist

### Q7: How would you find all common ancestors (not just the lowest)?

**Answer:** Traverse from root to the LCA:
1. Find the LCA first
2. Store all nodes on the path from root to LCA
3. All these nodes are common ancestors, ordered from highest to lowest

### Q8: How would you solve this for a directed acyclic graph (DAG)?

**Answer:** Similar but more complex:
1. Build parent maps (or use existing references)
2. Find all ancestors of each node
3. Find intersection of both ancestor sets
4. Return the node closest to the nodes (lowest in intersection)

---

## Related Problems

- [Lowest Common Ancestor of a Binary Search Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/) - BST version with O(log n) solution
- [Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/) - BST traversal
- [Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/) - BST validation
- [Binary Tree Maximum Path Sum](https://leetcode.com/problems/binary-tree-maximum-path-sum/) - Tree DP
- [Invert Binary Tree](https://leetcode.com/problems/invert-binary-tree/) - Tree transformation
- [Same Tree](https://leetcode.com/problems/same-tree/) - Tree comparison
- [Subtree of Another Tree](https://leetcode.com/problems/subtree-of-another-tree/) - Tree matching

---

## Video Tutorials

- [Lowest Common Ancestor of a Binary Tree - LeetCode 236](https://www.youtube.com/watch?v=13m9Zxedq5E)
- [Binary Tree LCA Explained](https://www.youtube.com/watch?v=p1Kbkz1h6L4)
- [Tree Algorithms - Common Patterns](https://www.youtube.com/watch?v=7jcn63Mh9E0)
- [Recursion in Trees](https://www.youtube.com/watch?v=8B2B3M6R5U8)
