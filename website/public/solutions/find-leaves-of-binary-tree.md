# Find Leaves Of Binary Tree

## Problem Description

Given the root of a binary tree, collect and remove all leaves, repeat until the tree is empty. Return the collection of leaf values in the order they were collected. You answer should be a list of lists, where each list contains the leaf values collected at each step.

---

## Pattern: DFS / Bottom-up Binary Tree

This problem demonstrates algorithmic problem-solving patterns.

## Constraints

- The number of nodes in the tree is in the range [1, 100].
- -100 <= Node.val <= 100

---

## Examples

### Example 1

**Output:**
```python
[[4,5,3],[2],[1]]
```

---

## Example 2

**Input:**
```python
root = [1]
```

**Output:**
```python
[[1]]
```

---

## Intuition

The key insight is that we need to repeatedly remove "leaves" (nodes with no children) from the tree until it's empty. Instead of actually removing nodes, we can use a clever approach:

1. **Height-based grouping**: Each node's "height" from the bottom (where leaves have height 1) determines when it becomes a leaf
2. **DFS with height tracking**: By computing the height of each subtree, we can group nodes by their "removal level"
3. **Leaves first**: Nodes at height 1 are true leaves; nodes at height 2 become leaves after height-1 nodes are removed, etc.

---

## Solution Approaches

## Approach 1: DFS with Height Calculation (Optimal)

This is the most elegant solution that uses DFS to compute the height of each node and groups them accordingly.

````carousel
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

from typing import List, Optional

class Solution:
    def findLeaves(self, root: Optional[TreeNode]) -> List[List[int]]:
        res = []
        
        def dfs(node):
            if not node:
                return 0
            left = dfs(node.left)
            right = dfs(node.right)
            height = max(left, right) + 1
            if len(res) < height:
                res.extend([[] for _ in range(height - len(res))])
            res[height - 1].append(node.val)
            return height
        
        dfs(root)
        return res
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
    vector<vector<int>> findLeaves(TreeNode* root) {
        vector<vector<int>> result;
        
        function<int(TreeNode*)> dfs = [&](TreeNode* node) -> int {
            if (!node) return 0;
            
            int left = dfs(node->left);
            int right = dfs(node->right);
            int height = max(left, right) + 1;
            
            if (result.size() < height) {
                result.resize(height);
            }
            
            result[height - 1].push_back(node->val);
            return height;
        };
        
        dfs(root);
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
    public List<List<Integer>> findLeaves(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        
        dfs(root, result);
        return result;
    }
    
    private int dfs(TreeNode node, List<List<Integer>> result) {
        if (node == null) return 0;
        
        int left = dfs(node.left, result);
        int right = dfs(node.right, result);
        int height = Math.max(left, right) + 1;
        
        if (result.size() < height) {
            for (int i = result.size(); i < height; i++) {
                result.add(new ArrayList<>());
            }
        }
        
        result.get(height - 1).add(node.val);
        return height;
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
 * @return {number[][]}
 */
var findLeaves = function(root) {
    const result = [];
    
    function dfs(node) {
        if (!node) return 0;
        
        const left = dfs(node.left);
        const right = dfs(node.right);
        const height = Math.max(left, right) + 1;
        
        if (result.length < height) {
            for (let i = result.length; i < height; i++) {
                result.push([]);
            }
        }
        
        result[height - 1].push(node.val);
        return height;
    }
    
    dfs(root);
    return result;
};
```
````

## Approach 2: BFS Level-by-Level Removal

This approach simulates the actual removal process by repeatedly finding and removing leaves at each level.

````carousel
```python
from typing import List, Optional
from collections import deque

class Solution:
    def findLeaves(self, root: Optional[TreeNode]) -> List[List[int]]:
        if not root:
            return []
        
        result = []
        
        while root:
            leaves = []
            
            def remove_leaves(node):
                if not node:
                    return None
                
                # If this is a leaf
                if not node.left and not node.right:
                    leaves.append(node.val)
                    return None
                
                node.left = remove_leaves(node.left)
                node.right = remove_leaves(node.right)
                return node
            
            root = remove_leaves(root)
            result.append(leaves)
        
        return result
```
<!-- slide -->
```cpp
class Solution {
public:
    vector<vector<int>> findLeaves(TreeNode* root) {
        vector<vector<int>> result;
        
        while (root) {
            vector<int> leaves;
            root = removeLeaves(root, leaves);
            result.push_back(leaves);
        }
        
        return result;
    }
    
private:
    TreeNode* removeLeaves(TreeNode* node, vector<int>& leaves) {
        if (!node) return nullptr;
        
        // If this is a leaf node
        if (!node->left && !node->right) {
            leaves.push_back(node->val);
            delete node;
            return nullptr;
        }
        
        node->left = removeLeaves(node->left, leaves);
        node->right = removeLeaves(node->right, leaves);
        
        return node;
    }
};
```
<!-- slide -->
```java
class Solution {
    public List<List<Integer>> findLeaves(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        
        while (root != null) {
            List<Integer> leaves = new ArrayList<>();
            root = removeLeaves(root, leaves);
            result.add(leaves);
        }
        
        return result;
    }
    
    private TreeNode removeLeaves(TreeNode node, List<Integer> leaves) {
        if (node == null) return null;
        
        // If this is a leaf node
        if (node.left == null && node.right == null) {
            leaves.add(node.val);
            return null;
        }
        
        node.left = removeLeaves(node.left, leaves);
        node.right = removeLeaves(node.right, leaves);
        
        return node;
    }
}
```
<!-- slide -->
```javascript
var findLeaves = function(root) {
    const result = [];
    
    function removeLeaves(node) {
        if (!node) return null;
        
        // If this is a leaf node
        if (!node.left && !node.right) {
            return null;
        }
        
        node.left = removeLeaves(node.left);
        node.right = removeLeaves(node.right);
        
        return node;
    }
    
    while (root) {
        const leaves = [];
        
        function collectLeaves(node) {
            if (!node) return;
            
            if (!node.left && !node.right) {
                leaves.push(node.val);
                return;
            }
            
            collectLeaves(node.left);
            collectLeaves(node.right);
        }
        
        collectLeaves(root);
        root = removeLeaves(root);
        result.push(leaves);
    }
    
    return result;
};
```
````

## Approach 3: Top-Down Recursion with Parent Tracking

A variation that explicitly tracks parent nodes to identify and remove leaves.

````carousel
```python
from typing import List, Optional, Set

class Solution:
    def findLeaves(self, root: Optional[TreeNode]) -> List[List[int]]:
        if not root:
            return []
        
        result = []
        children = set()
        
        while root:
            leaves = []
            
            def find_leaves(node: Optional[TreeNode], parent: Optional[TreeNode]):
                if not node:
                    return
                
                # Check if it's a leaf
                is_leaf = (node.left is None or node.left in children) and \
                          (node.right is None or node.right in children)
                
                if is_leaf:
                    leaves.append(node.val)
                    if parent:
                        if parent.left == node:
                            parent.left = None
                        else:
                            parent.right = None
                    else:
                        # This is the root being removed
                        root = None
                    children.add(node)
                else:
                    find_leaves(node.left, node)
                    find_leaves(node.right, node)
            
            find_leaves(root, None)
            result.append(leaves)
            if not root:
                break
        
        return result
```
<!-- slide -->
```cpp
class Solution {
public:
    vector<vector<int>> findLeaves(TreeNode* root) {
        vector<vector<int>> result;
        unordered_set<TreeNode*> children;
        
        while (root) {
            vector<int> leaves;
            findLeaves(root, nullptr, leaves, children, root);
            result.push_back(leaves);
            if (!root) break;
        }
        
        return result;
    }
    
private:
    void findLeaves(TreeNode* node, TreeNode* parent, 
                    vector<int>& leaves, unordered_set<TreeNode*>& children,
                    TreeNode*& root) {
        if (!node) return;
        
        bool isLeaf = (children.count(node->left) || !node->left) && 
                      (children.count(node->right) || !node->right);
        
        if (isLeaf) {
            leaves.push_back(node->val);
            children.insert(node);
            if (parent) {
                if (parent->left == node) parent->left = nullptr;
                else parent->right = nullptr;
            } else {
                root = nullptr;
            }
        } else {
            findLeaves(node->left, node, leaves, children, root);
            findLeaves(node->right, node, leaves, children, root);
        }
    }
};
```
<!-- slide -->
```java
class Solution {
    public List<List<Integer>> findLeaves(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        Set<TreeNode> children = new HashSet<>();
        
        while (root != null) {
            List<Integer> leaves = new ArrayList<>();
            findLeaves(root, null, leaves, children);
            result.add(leaves);
            if (root == null) break;
        }
        
        return result;
    }
    
    private void findLeaves(TreeNode node, TreeNode parent, 
                           List<Integer> leaves, Set<TreeNode> children) {
        if (node == null) return;
        
        boolean isLeaf = (children.contains(node.left) || node.left == null) && 
                         (children.contains(node.right) || node.right == null);
        
        if (isLeaf) {
            leaves.add(node.val);
            children.add(node);
            if (parent == null) {
                root = null;
            } else {
                if (parent.left == node) parent.left = null;
                else parent.right = null;
            }
        } else {
            findLeaves(node.left, node, leaves, children);
            findLeaves(node.right, node, leaves, children);
        }
    }
    
    private TreeNode root;
}
```
<!-- slide -->
```javascript
var findLeaves = function(root) {
    const result = [];
    const children = new Set();
    
    while (root) {
        const leaves = [];
        
        function findLeaves(node, parent) {
            if (!node) return;
            
            const isLeaf = (children.has(node.left) || !node.left) && 
                          (children.has(node.right) || !node.right);
            
            if (isLeaf) {
                leaves.push(node.val);
                children.add(node);
                if (parent) {
                    if (parent.left === node) parent.left = null;
                    else parent.right = null;
                } else {
                    root = null;
                }
            } else {
                findLeaves(node.left, node);
                findLeaves(node.right, node);
            }
        }
        
        findLeaves(root, null);
        result.push(leaves);
        if (!root) break;
    }
    
    return result;
};
```
````

---

## Complexity Analysis

| Approach | Time Complexity | Space Complexity | Description |
|----------|-----------------|------------------|-------------|
| **DFS Height** | O(n) | O(h) | Optimal - single pass |
| **BFS Removal** | O(n²) worst case | O(n) | Simulates actual removal |
| **Parent Tracking** | O(n²) worst case | O(n) | Complex parent management |

### Why DFS Height is Optimal:

1. **Single traversal**: Each node visited exactly once
2. **No node deletion**: Doesn't modify tree structure
3. **Efficient grouping**: Height naturally groups nodes by removal level
4. **No extra space for queue/stack**: Uses recursion stack only

---

## Edge Cases and Common Pitfalls

### Edge Cases to Consider

1. **Single node tree**: `root = [1]` → Output: `[[1]]`
2. **All left children**: Should still work correctly
3. **All right children**: Should still work correctly
4. **Empty tree**: Return empty list (not in constraints but good to handle)

### Common Mistakes

1. **Forgetting to return height**: Each DFS call must return the subtree height
2. **Off-by-one in index**: Height 1 → index 0, height 2 → index 1, etc.
3. **Not extending result list**: Must add new sublists as needed

---

## Why This Pattern is Important

### Interview Relevance

- **Frequency**: Frequently asked in technical interviews
- **Companies**: Google, Amazon, Meta, Apple, Microsoft
- **Difficulty**: Medium
- **Concepts tested**: Tree traversal, recursion, problem decomposition

### Learning Outcomes

1. **Tree manipulation**: Understanding tree structure and node relationships
2. **Recursion mastery**: Using recursion to compute and propagate information
3. **Height concepts**: Understanding tree height and depth
4. **Problem decomposition**: Breaking complex problems into simpler subproblems

---

## Related Problems

### Same Pattern (Tree Decomposition)

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Find Leaves of Binary Tree](https://leetcode.com/problems/find-leaves-of-binary-tree/) | 366 | Medium | This problem |
| [Minimum Height Trees](https://leetcode.com/problems/minimum-height-trees/) | 310 | Medium | Find centroids by peeling layers |
| [Delete Leaves With Given Value](https://leetcode.com/problems/delete-leaves-with-given-value/) | 1325 | Medium | Remove nodes with specific value |
| [Trim a Binary Search Tree](https://leetcode.com/problems/trim-a-binary-search-tree/) | 669 | Easy | Remove nodes outside range |

### Similar Tree Concepts

| Problem | LeetCode # | Difficulty | Related Technique |
|---------|------------|------------|-------------------|
| [Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree/) | 104 | Easy | Tree height calculation |
| [Diameter of Binary Tree](https://leetcode.com/problems/diameter-of-binary-tree/) | 543 | Easy | Tree height/width |
| [Lowest Common Ancestor](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/) | 236 | Medium | Tree traversal |
| [Invert Binary Tree](https://leetcode.com/problems/invert-binary-tree/) | 226 | Easy | Tree transformation |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[Find Leaves of Binary Tree - NeetCode](https://www.youtube.com/watch?v=QfR5bEplGjA)**
   - Clear explanation of the height-based approach
   - Step-by-step visualization

2. **[LeetCode 366 - Find Leaves of Binary Tree](https://www.youtube.com/watch?v=QfR5bEplGjA)**
   - Detailed walkthrough
   - Multiple approaches covered

3. **[Binary Tree Traversal Explained](https://www.youtube.com/watch?v=1zH6PWBkNCA)**
   - Foundation for tree problems
   - DFS and BFS concepts

4. **[Tree Problems - Back to Back SWE](https://www.youtube.com/watch?v=9X7Hrxq-rXw)**
   - Interview-focused approach
   - Common patterns

---

## Follow-up Questions

### Basic Level

1. **What is the time and space complexity of the DFS height approach?**
   - Time: O(n), Space: O(h) where h is tree height

2. **Why do we return 0 for a null node?**
   - Null node has no height (no nodes below), so height is 0

3. **What happens if the tree is empty?**
   - Return empty list (though constraints say at least 1 node)

### Intermediate Level

4. **How would you modify to return nodes instead of values?**
   - Store `node` instead of `node.val` in the result lists

5. **Can you solve this iteratively without recursion?**
   - Yes, use BFS to find leaves level by level, remove them, repeat

### Advanced Level

6. **How does this relate to finding tree centroids (Minimum Height Trees)?**
   - Both peel layers from outside-in; centroids are the last remaining nodes

7. **How would you handle a tree where nodes have a parent pointer?**
   - Could use parent pointers to traverse upward after finding leaves

---

## Common Pitfalls

### 1. Off-by-One Errors in Height Calculation
**Issue**: Height calculation can have off-by-one errors leading to incorrect grouping.

**Solution**: Remember that leaf nodes have height 1, and the height is computed as max(left, right) + 1.

### 2. Not Returning Height from Recursive Calls
**Issue**: Forgetting to return the height from the DFS function.

**Solution**: Always return the computed height from each recursive call.

### 3. Incorrect Result List Indexing
**Issue**: Using wrong index when appending to result list.

**Solution**: Use `height - 1` as the index since height is 1-indexed but list is 0-indexed.

### 4. Not Handling Empty Tree
**Issue**: Not handling the case where root is null.

**Solution**: Add a null check at the beginning of the function.

### 5. Modifying Original Tree
**Issue**: Accidentally modifying the tree structure during traversal.

**Solution**: The optimal approach doesn't modify the tree; ensure you're only reading values.

---

## Summary

The **Find Leaves of Binary Tree** problem demonstrates the power of using tree height as a natural grouping mechanism. Key insights:

1. **Height-based grouping**: Each node's height from bottom naturally indicates its removal order
2. **DFS efficiency**: Single traversal computes heights and groups nodes simultaneously
3. **No actual deletion**: We simulate removal through height calculation
4. **Elegant solution**: The optimal approach is surprisingly simple once understood

This pattern is valuable for:
- Tree decomposition problems
- Layer-by-layer processing
- Understanding recursive tree patterns

Understanding this approach provides a strong foundation for solving similar tree problems in interviews.

---

## LeetCode Problems for Practice

- [Find Leaves of Binary Tree](https://leetcode.com/problems/find-leaves-of-binary-tree/)
- [Minimum Height Trees](https://leetcode.com/problems/minimum-height-trees/)
- [Delete Leaves With Given Value](https://leetcode.com/problems/delete-leaves-with-given-value/)
- [Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree/)
- [Diameter of Binary Tree](https://leetcode.com/problems/diameter-of-binary-tree/)
