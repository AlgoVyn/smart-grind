# Delete Nodes And Return Forest

## Problem Description

Given the root of a binary tree, each node in the tree has a distinct value.

After deleting all nodes with a value in `to_delete`, we are left with a forest (a disjoint union of trees). Return the roots of the trees in the remaining forest. You may return the result in any order.

**Link to problem:** [Delete Nodes And Return Forest - LeetCode 1110](https://leetcode.com/problems/delete-nodes-and-return-forest/)

---

## Pattern: Post-Order DFS for Tree Modification

This problem demonstrates the **Post-Order DFS** pattern for tree modification. The key is processing children before deciding whether to keep or delete the current node.

### Core Concept

The fundamental idea is using DFS to traverse the tree bottom-up:
- Process children first (post-order)
- If a node is deleted, its children become roots of new trees
- If a node is kept and has a deleted parent, it becomes a new root

---

## Examples

### Example

**Input:**
```
root = [1,2,3,4,5,6,7], to_delete = [3,5]
```

**Output:**
```
[[1,2,null,4],[6],[7]]
```

### Example 2

**Input:**
```
root = [1,2,4,null,3], to_delete = [3]
```

**Output:**
```
[[1,2,4]]
```

---

## Constraints

- The number of nodes in the given tree is at most 1000.
- Each node has a distinct value between 1 and 1000.
- `to_delete.length <= 1000`
- `to_delete` contains distinct values between 1 and 1000.

---

## Intuition

The key insight is that we need to process the tree from bottom to top because:
1. We need to know if children get deleted before handling the parent
2. When a node is deleted, its non-deleted children become new tree roots

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Post-Order DFS** - Recursive approach
2. **Iterative with Stack** - Iterative approach

---

## Approach 1: Post-Order DFS (Optimal)

This is the most intuitive and efficient approach.

### Algorithm Steps

1. Convert `to_delete` to a set for O(1) lookup
2. Define a DFS function that returns the node to keep (or null if deleted)
3. In DFS:
   - Recursively process left and right children
   - Check if current node should be deleted
   - If current node is deleted: return null, but add non-null children to result
   - If current node is kept: set its children and return it
4. Call DFS on root
5. Add root to result if not deleted

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
    def delNodes(self, root: Optional[TreeNode], to_delete: List[int]) -> List[TreeNode]:
        to_delete_set = set(to_delete)
        result = []
        
        def dfs(node: Optional[TreeNode], is_root: bool) -> Optional[TreeNode]:
            if not node:
                return None
            
            # Check if this node should be deleted
            deleted = node.val in to_delete_set
            
            # Recursively process children
            node.left = dfs(node.left, deleted)
            node.right = dfs(node.right, deleted)
            
            # If current node is deleted, return None but keep children as roots
            if deleted:
                return None
            
            # If this is a root (parent was deleted), add to result
            if is_root:
                result.append(node)
            
            return node
        
        dfs(root, True)
        return result
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
    vector<TreeNode*> delNodes(TreeNode* root, vector<int>& to_delete) {
        unordered_set<int> toDelete(to_delete.begin(), to_delete.end());
        vector<TreeNode*> result;
        
        function<TreeNode*(TreeNode*, bool)> dfs = [&](TreeNode* node, bool isRoot) -> TreeNode* {
            if (!node) return nullptr;
            
            bool deleted = toDelete.count(node->val);
            
            // Process children first
            node->left = dfs(node->left, deleted);
            node->right = dfs(node->right, deleted);
            
            if (deleted) {
                return nullptr;
            }
            
            if (isRoot) {
                result.push_back(node);
            }
            
            return node;
        };
        
        dfs(root, true);
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
    public List<TreeNode> delNodes(TreeNode root, int[] to_delete) {
        Set<Integer> toDeleteSet = new HashSet<>();
        for (int val : to_delete) {
            toDeleteSet.add(val);
        }
        
        List<TreeNode> result = new ArrayList<>();
        
        dfs(root, true, toDeleteSet, result);
        
        return result;
    }
    
    private TreeNode dfs(TreeNode node, boolean isRoot, Set<Integer> toDeleteSet, List<TreeNode> result) {
        if (node == null) return null;
        
        boolean deleted = toDeleteSet.contains(node.val);
        
        // Process children first (post-order)
        node.left = dfs(node.left, deleted, toDeleteSet, result);
        node.right = dfs(node.right, deleted, toDeleteSet, result);
        
        if (deleted) {
            return null;
        }
        
        if (isRoot) {
            result.add(node);
        }
        
        return node;
    }
}
```

<!-- slide -->
```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val);
 *     this.left = (left===undefined ? null : left);
 *     this.right = (right===undefined ? null : right);
 * }
 */

var delNodes = function(root, to_delete) {
    const toDeleteSet = new Set(to_delete);
    const result = [];
    
    function dfs(node, isRoot) {
        if (!node) return null;
        
        const deleted = toDeleteSet.has(node.val);
        
        // Process children first (post-order)
        node.left = dfs(node.left, deleted);
        node.right = dfs(node.right, deleted);
        
        if (deleted) {
            return null;
        }
        
        if (isRoot) {
            result.push(node);
        }
        
        return node;
    }
    
    dfs(root, true);
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Visit each node once |
| **Space** | O(n) - Recursion stack + result + set |

---

## Approach 2: Iterative with Stack

This approach uses an iterative DFS with explicit stack.

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
    def delNodes(self, root: Optional[TreeNode], to_delete: List[int]) -> List[TreeNode]:
        if not root:
            return []
        
        to_delete_set = set(to_delete)
        result = []
        
        # Stack for DFS: (node, parent, is_left_child)
        stack = [(root, None, True)]
        
        while stack:
            node, parent, is_left = stack.pop()
            
            if node.val in to_delete_set:
                # Add children to stack as potential roots
                if node.left:
                    stack.append((node.left, None, True))
                if node.right:
                    stack.append((node.right, None, False))
                
                # Remove connection from parent
                if parent:
                    if is_left:
                        parent.left = None
                    else:
                        parent.right = None
            else:
                # Node stays, connect to parent
                if parent:
                    if is_left:
                        parent.left = node
                    else:
                        parent.right = node
                else:
                    # It's a root
                    result.append(node)
                
                # Process children
                if node.right:
                    stack.append((node.right, node, False))
                if node.left:
                    stack.append((node.left, node, True))
        
        return result
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<TreeNode*> delNodes(TreeNode* root, vector<int>& to_delete) {
        if (!root) return {};
        
        unordered_set<int> toDelete(to_delete.begin(), to_delete.end());
        vector<TreeNode*> result;
        
        // Stack for DFS: (node, parent, is_left_child)
        vector<tuple<TreeNode*, TreeNode*, bool>> stack;
        stack.emplace_back(root, nullptr, true);
        
        while (!stack.empty()) {
            auto [node, parent, isLeft] = stack.back();
            stack.pop_back();
            
            if (toDelete.count(node->val)) {
                // Add children as potential roots
                if (node->left) stack.emplace_back(node->left, nullptr, true);
                if (node->right) stack.emplace_back(node->right, nullptr, false);
                
                // Remove connection from parent
                if (parent) {
                    if (isLeft) parent->left = nullptr;
                    else parent->right = nullptr;
                }
            } else {
                // Connect to parent
                if (parent) {
                    if (isLeft) parent->left = node;
                    else parent->right = node;
                } else {
                    result.push_back(node);
                }
                
                // Process children
                if (node->right) stack.emplace_back(node->right, node, false);
                if (node->left) stack.emplace_back(node->left, node, true);
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public List<TreeNode> delNodes(TreeNode root, int[] to_delete) {
        if (root == null) return new ArrayList<>();
        
        Set<Integer> toDeleteSet = new HashSet<>();
        for (int val : to_delete) {
            toDeleteSet.add(val);
        }
        
        List<TreeNode> result = new ArrayList<>();
        
        // Stack for DFS
        Stack<Object[]> stack = new Stack<>();
        stack.push(new Object[]{root, null, true});
        
        while (!stack.isEmpty()) {
            Object[] item = stack.pop();
            TreeNode node = (TreeNode) item[0];
            TreeNode parent = (TreeNode) item[1];
            boolean isLeft = (boolean) item[2];
            
            if (toDeleteSet.contains(node.val)) {
                // Add children as potential roots
                if (node.left != null) stack.push(new Object[]{node.left, null, true});
                if (node.right != null) stack.push(new Object[]{node.right, null, false});
                
                // Remove connection from parent
                if (parent != null) {
                    if (isLeft) parent.left = null;
                    else parent.right = null;
                }
            } else {
                // Connect to parent
                if (parent != null) {
                    if (isLeft) parent.left = node;
                    else parent.right = node;
                } else {
                    result.add(node);
                }
                
                // Process children
                if (node.right != null) stack.push(new Object[]{node.right, node, false});
                if (node.left != null) stack.push(new Object[]{node.left, node, true});
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
var delNodes = function(root, to_delete) {
    if (!root) return [];
    
    const toDeleteSet = new Set(to_delete);
    const result = [];
    
    // Stack for DFS
    const stack = [[root, null, true]];
    
    while (stack.length > 0) {
        const [node, parent, isLeft] = stack.pop();
        
        if (toDeleteSet.has(node.val)) {
            // Add children as potential roots
            if (node.left) stack.push([node.left, null, true]);
            if (node.right) stack.push([node.right, null, false]);
            
            // Remove connection from parent
            if (parent) {
                if (isLeft) parent.left = null;
                else parent.right = null;
            }
        } else {
            // Connect to parent
            if (parent) {
                if (isLeft) parent.left = node;
                else parent.right = node;
            } else {
                result.push(node);
            }
            
            // Process children
            if (node.right) stack.push([node.right, node, false]);
            if (node.left) stack.push([node.left, node, true]);
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) |
| **Space** | O(n) |

---

## Comparison of Approaches

| Aspect | Post-Order DFS | Iterative |
|--------|---------------|-----------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(n) | O(n) |
| **Implementation** | Simple | More complex |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes |

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Trim a Binary Search Tree | [Link](https://leetcode.com/problems/trim-a-binary-search-tree/) | Remove nodes outside range |
| Remove BST nodes outside range | [Link](https://leetcode.com/problems/remove-bst-nodes-outside-range/) | Similar tree pruning |

---

## Video Tutorial Links

- [NeetCode - Delete Nodes and Return Forest](https://www.youtube.com/watch?v=K4aG8G7D7d4) - Official solution
- [Post-Order DFS Explained](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Tree traversal patterns

---

## Follow-up Questions

### Q1: What is the key insight behind post-order traversal?

**Answer:** We need to know the fate of children before handling the parent. If a child becomes a root, we need to add it to the result, which we can only know after processing children.

---

### Q2: How would you handle a tree with millions of nodes?

**Answer:** The same algorithm works. The recursion depth could be a problem, so you'd use the iterative approach. Consider using an explicit stack or converting to a more tail-recursive approach.

---

### Q3: Can the order of returned roots matter?

**Answer:** The problem states "You may return the result in any order", so no.

---

## Common Pitfalls

### 1. Forgetting to Add Children as Roots
**Issue:** When deleting a node, not adding its non-deleted children as new roots.

**Solution:** Pass a flag indicating if the parent was deleted.

### 2. Not Processing Children First
**Issue:** Processing parent before children leads to incorrect results.

**Solution:** Use post-order (children first) traversal.

### 3. Null Pointer Issues
**Issue:** Not handling null nodes properly.

**Solution:** Always check for null before accessing node properties.

---

## Summary

The **Delete Nodes and Return Forest** problem demonstrates the post-order DFS pattern:
- Process children before parents
- Track whether each node should become a root
- Use a set for O(1) deletion lookup
