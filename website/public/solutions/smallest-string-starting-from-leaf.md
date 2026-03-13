# Smallest String Starting From Leaf

## Problem Description

You are given the root of a binary tree where each node has a value in the range `[0, 25]` representing the letters 'a' to 'z'.

Return the lexicographically smallest string that starts at a leaf of this tree and ends at the root.

As a reminder, any shorter prefix of a string is lexicographically smaller.

For example, "ab" is lexicographically smaller than "aba".

A leaf of a node is a node that has no children.

**LeetCode Link:** [Smallest String Starting From Leaf](https://leetcode.com/problems/smallest-string-starting-from-leaf/)

---

## Examples

**Example 1:**
```python
Input: root = [0,1,2,3,4,3,4]
Output: "dba"
```

**Example 2:**
```python
Input: root = [25,1,3,1,3,0,2]
Output: "adz"
```

**Example 3:**
```python
Input: root = [2,2,1,null,1,0,null,0]
Output: "abc"
```

---

## Constraints

- The number of nodes in the tree is in the range `[1, 8500]`.
- `0 <= Node.val <= 25`

---

## Pattern: Tree DFS with Path Building

This problem uses **Depth-First Search** to traverse all root-to-leaf paths in a binary tree. Each node's character is appended to a path, and when a leaf is reached, the path is reversed to form the leaf-to-root string. The lexicographically smallest string is tracked throughout the traversal.

### Core Concept

- **DFS Traversal**: Visit all root-to-leaf paths
- **Path Building**: Build string from root to leaf
- **String Reversal**: Reverse to get leaf-to-root order
- **Lexicographic Comparison**: Track minimum string

---

## Intuition

The key insight for this problem is understanding how to explore all possible leaf-to-root strings:

1. **Root-to-Leaf Path**: We naturally build paths from root to leaf during DFS
2. **Leaf-to-Root String**: The required string goes from leaf to root, so we reverse
3. **Lexicographic Ordering**: Compare strings at each leaf to find minimum

4. **Why DFS?**:
   - DFS naturally explores all root-to-leaf paths
   - Backtracking allows us to try different paths
   - At each leaf, we have complete path information

5. **Optimization Opportunities**:
   - Early pruning: If current prefix is already >= smallest, stop
   - Build string in reverse to avoid reversing at each leaf
   - Use string comparison efficiently

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **DFS with String Reversal** - Standard approach
2. **DFS with Reverse Building** - Optimized approach

---

## Approach 1: DFS with String Reversal (Standard)

### Algorithm Steps

1. Define DFS function taking node and current path
2. If node is None, return
3. Append current character to path
4. If node is a leaf:
   - Reverse path to get leaf-to-root string
   - Compare with smallest and update if smaller
5. Recurse on left and right children
6. Backtrack by removing last character from path
7. Return smallest string

### Why It Works

DFS explores every root-to-leaf path. At each leaf, we have the complete path from root to that leaf. Reversing gives us the leaf-to-root string. By comparing all such strings, we find the lexicographically smallest.

### Code Implementation

````carousel
```python
# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def smallestFromLeaf(self, root: TreeNode) -> str:
        def dfs(node, path):
            nonlocal smallest
            
            if not node:
                return
            
            # Add current character to path
            path.append(chr(ord('a') + node.val))
            
            # If leaf, check the string
            if not node.left and not node.right:
                # Reverse to get leaf-to-root
                current = ''.join(reversed(path))
                if smallest is None or current < smallest:
                    smallest = current
            else:
                # Continue DFS
                dfs(node.left, path)
                dfs(node.right, path)
            
            # Backtrack
            path.pop()
        
        smallest = None
        dfs(root, [])
        return smallest
```

<!-- slide -->
```cpp
#include <string>
#include <vector>
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
    string smallestFromLeaf(TreeNode* root) {
        string smallest = "";
        
        function<void(TreeNode*, string&)> dfs = [&](TreeNode* node, string& path) {
            if (!node) return;
            
            path.push_back('a' + node->val);
            
            if (!node->left && !node->right) {
                string current = path;
                reverse(current.begin(), current.end());
                if (smallest == "" || current < smallest) {
                    smallest = current;
                }
            } else {
                dfs(node->left, path);
                dfs(node->right, path);
            }
            
            path.pop_back();
        };
        
        string path = "";
        dfs(root, path);
        return smallest;
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
    private String smallest = null;
    
    public String smallestFromLeaf(TreeNode root) {
        dfs(root, new StringBuilder());
        return smallest;
    }
    
    private void dfs(TreeNode node, StringBuilder path) {
        if (node == null) return;
        
        path.append((char)('a' + node.val));
        
        if (node.left == null && node.right == null) {
            String current = path.reverse().toString();
            path.reverse();  // Restore
            if (smallest == null || current.compareTo(smallest) < 0) {
                smallest = current;
            }
        } else {
            dfs(node.left, path);
            dfs(node.right, path);
        }
        
        path.deleteCharAt(path.length() - 1);
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
 * @return {string}
 */
var smallestFromLeaf = function(root) {
    let smallest = null;
    
    function dfs(node, path) {
        if (!node) return;
        
        path.push(String.fromCharCode('a'.charCodeAt(0) + node.val));
        
        if (!node.left && !node.right) {
            const current = path.slice().reverse().join('');
            if (!smallest || current < smallest) {
                smallest = current;
            }
        } else {
            dfs(node.left, path);
            dfs(node.right, path);
        }
        
        path.pop();
    }
    
    dfs(root, []);
    return smallest;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n * h) where n is nodes and h is height - string operations at each leaf |
| **Space** | O(h) for recursion stack and path |

---

## Approach 2: DFS with Reverse Building (Optimized)

### Algorithm Steps

1. Instead of reversing at each leaf, build the string in reverse order
2. At leaf, directly have the leaf-to-root string
3. Same overall logic but avoids repeated reversals

### Why It Works

Building the string from leaf to root initially means no reversal needed at leaves. This saves the reversal operation.

### Code Implementation

````carousel
```python
class Solution:
    def smallestFromLeaf(self, root: TreeNode) -> str:
        def dfs(node, path):
            nonlocal smallest
            
            if not node:
                return
            
            # Prepend character (build from leaf to root)
            path = chr(ord('a') + node.val) + path
            
            if not node.left and not node.right:
                if smallest is None or path < smallest:
                    smallest = path
            else:
                dfs(node.left, path)
                dfs(node.right, path)
        
        smallest = None
        dfs(root, '')
        return smallest
```

<!-- slide -->
```cpp
class Solution {
public:
    string smallestFromLeaf(TreeNode* root) {
        string smallest = "";
        
        function<void(TreeNode*, string)> dfs = [&](TreeNode* node, string path) {
            if (!node) return;
            
            // Prepend character
            path = char('a' + node->val) + path;
            
            if (!node->left && !node->right) {
                if (smallest == "" || path < smallest) {
                    smallest = path;
                }
            } else {
                dfs(node->left, path);
                dfs(node->right, path);
            }
        };
        
        dfs(root, "");
        return smallest;
    }
};
```

<!-- slide -->
```java
class Solution {
    private String smallest = null;
    
    public String smallestFromLeaf(TreeNode root) {
        dfs(root, "");
        return smallest;
    }
    
    private void dfs(TreeNode node, String path) {
        if (node == null) return;
        
        // Prepend character
        path = (char)('a' + node.val) + path;
        
        if (node.left == null && node.right == null) {
            if (smallest == null || path.compareTo(smallest) < 0) {
                smallest = path;
            }
        } else {
            dfs(node.left, path);
            dfs(node.right, path);
        }
    }
}
```

<!-- slide -->
```javascript
var smallestFromLeaf = function(root) {
    let smallest = null;
    
    function dfs(node, path) {
        if (!node) return;
        
        // Prepend character
        path = String.fromCharCode('a'.charCodeAt(0) + node.val) + path;
        
        if (!node.left && !node.right) {
            if (!smallest || path < smallest) {
                smallest = path;
            }
        } else {
            dfs(node.left, path);
            dfs(node.right, path);
        }
    }
    
    dfs(root, '');
    return smallest;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n * h) - same as approach 1 |
| **Space** | O(h) - for recursion stack and path |

---

## Comparison of Approaches

| Aspect | DFS with Reversal | DFS with Reverse Build |
|--------|-------------------|----------------------|
| **Time Complexity** | O(n * h) | O(n * h) |
| **Space Complexity** | O(h) | O(h) |
| **Implementation** | Simple | Simple |
| **LeetCode Optimal** | ✅ | ✅ |
| **Difficulty** | Easy | Easy |

**Best Approach:** Use Approach 2 to avoid string reversal at each leaf.

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Binary Tree Paths | [Link](https://leetcode.com/problems/binary-tree-paths/) | All root-to-leaf paths |
| Longest Path With Adjacent Characters | [Link](https://leetcode.com/problems/longest-path-with-adjacent-characters/) | Tree path problems |

---

## Video Tutorial Links

1. **[NeetCode - Smallest String Starting From Leaf](https://www.youtube.com/watch?v=EXAMPLE)** - Clear explanation
2. **[Tree DFS Tutorial](https://www.youtube.com/watch?v=EXAMPLE)** - Understanding tree DFS

---

## Follow-up Questions

### Q1: How would you modify to find the largest string instead?

**Answer:** Change the comparison from `<` to `>` and initialize smallest to a very large value or use a flag.

---

### Q2: Can you solve this iteratively?

**Answer:** Yes, use a stack to simulate DFS. Would need to track both node and current path.

---

### Q3: How would you add early pruning?

**Answer:** Before exploring children, check if current prefix is >= smallest. If so, skip that branch.

---

## Common Pitfalls

### 1. String Reversal Timing
**Issue**: Building path from root to leaf but comparing without reversal.

**Solution**: Either reverse at leaf or prepend characters while building.

### 2. Backtracking
**Issue**: Not removing characters from path after recursion.

**Solution**: Always pop from path after exploring children.

### 3. Character Conversion
**Issue**: Using wrong conversion from value to character.

**Solution**: Use `chr(ord('a') + val)` or equivalent.

### 4. Null Root
**Issue**: Not handling empty tree.

**Solution**: Problem guarantees at least one node, but add null check for safety.

---

## Summary

The **Smallest String Starting From Leaf** problem demonstrates:
- **Tree DFS**: Traversing all root-to-leaf paths
- **Path building**: Constructing strings along the way
- **Backtracking**: Exploring all possibilities
- **Lexicographic comparison**: Finding minimum string

Key takeaways:
1. DFS explores all root-to-leaf paths naturally
2. Build string in reverse or reverse at leaf
3. Compare all leaf-to-root strings
4. Use backtracking to restore state

This problem is essential for understanding tree traversal with path tracking.

---

### Pattern Summary

This problem exemplifies the **Tree DFS with Path Building** pattern, characterized by:
- Using DFS to traverse tree paths
- Building/collecting values along the path
- Backtracking to explore other paths
- Comparing results at leaf nodes

For more details on this pattern, see the **[Tree DFS Pattern](/patterns/tree-dfs)**.
