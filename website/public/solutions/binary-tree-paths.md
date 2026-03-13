# Binary Tree Paths

## Problem Description

[LeetCode Link: Binary Tree Paths](https://leetcode.com/problems/binary-tree-paths/)

Given the root of a binary tree, return all root-to-leaf paths in any order.
A leaf is a node with no children.

---

## Examples

**Example 1:**

**Input:**
```python
root = [1,2,3,null,5]
```

**Output:**
```python
["1->2->5","1->3"]
```

**Example 2:**

**Input:**
```python
root = [1]
```

**Output:**
```python
["1"]
```

---

## Constraints

- The number of nodes in the tree is in the range `[1, 100]`.
- `-100 <= Node.val <= 100`

---

## Pattern: Tree DFS - Path Building

### Core Concept

The Binary Tree Paths problem demonstrates the **Tree DFS - Path Building** pattern where we use depth-first search to traverse from root to leaves while constructing paths:

1. **DFS Traversal**: Recursively visit all nodes from root to leaves
2. **Path Construction**: Build path string as we traverse
3. **Leaf Detection**: Identify leaf nodes to capture complete paths

### When to Use This Pattern

This pattern applies when:
- Problem asks for all root-to-leaf paths
- Need to find paths with certain properties (sum, containing specific values)
- Tree problems requiring path enumeration
- Problems involving tree serialization/paths

### Alternative Patterns

| Alternative Pattern | Use Case |
|---------------------|----------|
| **BFS** | When need level-by-level path tracking |
| **Backtracking** | When paths need to be built incrementally with undo |
| **Iterative Stack** | When recursion depth is a concern |

---

## Intuition

The key insight for this problem is using **Depth-First Search (DFS)** to traverse from root to each leaf:

1. **DFS Traversal**: Start from root and recursively visit all nodes

2. **Path Building**: As we traverse, we build the path string by appending each node's value

3. **Leaf Detection**: When we reach a leaf node (no left or right children), we've found a complete root-to-leaf path

4. **Backtracking**: After exploring a path, we return and try other branches

**Example walkthrough:**
For `root = [1,2,3,null,5]`:
```
    1
   / \
  2   3
   \
    5
```
- Start at root (1): path = "1"
- Go left to 2: path = "1->2"
- 2 has no left child, go right to 5: path = "1->2->5"
- 5 is a leaf! Add "1->2->5" to result
- Backtrack to 2, then to 1
- Go right to 3: path = "1->3"
- 3 is a leaf! Add "1->3" to result
- Result: ["1->2->5", "1->3"]

---

## Solution Approaches

## Approach 1: DFS Recursive (Optimal)

### Algorithm Steps

1. Start DFS from the root node
2. Add current node value to the path
3. When reaching a leaf node (no left or right children), add the complete path to result
4. Otherwise, continue DFS to left and right children
5. Backtrack to explore other branches

### Why It Works

DFS naturally explores all root-to-leaf paths. By building the path incrementally and adding a copy to the result when we reach a leaf, we capture all possible root-to-leaf paths in the tree.

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
    def binaryTreePaths(self, root: Optional[TreeNode]) -> List[str]:
        def dfs(node, path):
            if not node:
                return
            path += str(node.val)
            if not node.left and not node.right:
                result.append(path)
            else:
                path += '->'
                dfs(node.left, path)
                dfs(node.right, path)

        result = []
        dfs(root, '')
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    vector<string> binaryTreePaths(TreeNode* root) {
        vector<string> result;
        dfs(root, "", result);
        return result;
    }
    
    void dfs(TreeNode* node, string path, vector<string>& result) {
        if (!node) return;
        path += to_string(node->val);
        if (!node->left && !node->right) {
            result.push_back(path);
        } else {
            path += "->";
            dfs(node->left, path, result);
            dfs(node->right, path, result);
        }
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
    TreeNode(int x) { val = x; }
}

class Solution {
    public List<String> binaryTreePaths(TreeNode root) {
        List<String> result = new ArrayList<>();
        dfs(root, "", result);
        return result;
    }
    
    private void dfs(TreeNode node, String path, List<String> result) {
        if (node == null) return;
        path += node.val;
        if (node.left == null && node.right == null) {
            result.add(path);
        } else {
            path += "->";
            dfs(node.left, path, result);
            dfs(node.right, path, result);
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {TreeNode} root
 * @return {string[]}
 */
var binaryTreePaths = function(root) {
    const result = [];
    dfs(root, '', result);
    return result;
};

function dfs(node, path, result) {
    if (!node) return;
    path += node.val;
    if (!node.left && !node.right) {
        result.push(path);
    } else {
        path += '->';
        dfs(node.left, path, result);
        dfs(node.right, path, result);
    }
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - visit each node once |
| **Space** | O(h) - recursion stack depth, where h is tree height |

---

## Approach 2: Iterative DFS with Stack

### Algorithm Steps

1. Use an explicit stack to simulate recursion
2. Push (node, path) pairs onto the stack
3. Process nodes similarly to recursive approach
4. Continue until stack is empty

### Why It Works

The iterative approach simulates the call stack manually. By storing both the node and its corresponding path, we can explore all paths without recursion.

### Code Implementation

````carousel
```python
from typing import List, Optional
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def binaryTreePaths(self, root: Optional[TreeNode]) -> List[str]:
        if not root:
            return []
        result = []
        stack = [(root, str(root.val))]
        while stack:
            node, path = stack.pop()
            if not node.left and not node.right:
                result.append(path)
            if node.right:
                stack.append((node.right, path + '->' + str(node.right.val)))
            if node.left:
                stack.append((node.left, path + '->' + str(node.left.val)))
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <stack>
#include <utility>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    vector<string> binaryTreePaths(TreeNode* root) {
        if (!root) return {};
        vector<string> result;
        stack<pair<TreeNode*, string>> st;
        st.push({root, to_string(root->val)});
        while (!st.empty()) {
            auto [node, path] = st.top();
            st.pop();
            if (!node->left && !node->right) {
                result.push_back(path);
            }
            if (node->right) {
                st.push({node->right, path + "->" + to_string(node->right->val)});
            }
            if (node->left) {
                st.push({node->left, path + "->" + to_string(node->left->val)});
            }
        }
        return result;
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
    TreeNode(int x) { val = x; }
}

class Solution {
    public List<String> binaryTreePaths(TreeNode root) {
        if (root == null) return new ArrayList<>();
        List<String> result = new ArrayList<>();
        Stack<Pair<TreeNode, String>> stack = new Stack<>();
        stack.push(new Pair<>(root, String.valueOf(root.val)));
        while (!stack.isEmpty()) {
            Pair<TreeNode, String> pair = stack.pop();
            TreeNode node = pair.getKey();
            String path = pair.getValue();
            if (node.left == null && node.right == null) {
                result.add(path);
            }
            if (node.right != null) {
                stack.push(new Pair<>(node.right, path + "->" + node.right.val));
            }
            if (node.left != null) {
                stack.push(new Pair<>(node.left, path + "->" + node.left.val));
            }
        }
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {TreeNode} root
 * @return {string[]}
 */
var binaryTreePaths = function(root) {
    if (!root) return [];
    const result = [];
    const stack = [[root, String(root.val)]];
    while (stack.length > 0) {
        const [node, path] = stack.pop();
        if (!node.left && !node.right) {
            result.push(path);
        }
        if (node.right) {
            stack.push([node.right, path + '->' + node.right.val]);
        }
        if (node.left) {
            stack.push([node.left, path + '->' + node.left.val]);
        }
    }
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - visit each node once |
| **Space** | O(n) - worst case for skewed tree (stack size) |

---

## Approach 3: BFS with Queue

### Algorithm Steps

1. Use BFS with a queue to process nodes level by level
2. Track both node and path for each element in the queue
3. When reaching a leaf, add path to result
4. Continue until queue is empty

### Why It Works

BFS explores nodes level by level. By maintaining the path alongside each node, we can collect all root-to-leaf paths.

### Code Implementation

````carousel
```python
from typing import List, Optional
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def binaryTreePaths(self, root: Optional[TreeNode]) -> List[str]:
        if not root:
            return []
        result = []
        queue = deque([(root, str(root.val))])
        while queue:
            node, path = queue.popleft()
            if not node.left and not node.right:
                result.append(path)
            if node.left:
                queue.append((node.left, path + '->' + str(node.left.val)))
            if node.right:
                queue.append((node.right, path + '->' + str(node.right.val)))
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <queue>
#include <utility>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    vector<string> binaryTreePaths(TreeNode* root) {
        if (!root) return {};
        vector<string> result;
        queue<pair<TreeNode*, string>> q;
        q.push({root, to_string(root->val)});
        while (!q.empty()) {
            auto [node, path] = q.front();
            q.pop();
            if (!node->left && !node->right) {
                result.push_back(path);
            }
            if (node->left) {
                q.push({node->left, path + "->" + to_string(node->left->val)});
            }
            if (node->right) {
                q.push({node->right, path + "->" + to_string(node->right->val)});
            }
        }
        return result;
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
    TreeNode(int x) { val = x; }
}

class Solution {
    public List<String> binaryTreePaths(TreeNode root) {
        if (root == null) return new ArrayList<>();
        List<String> result = new ArrayList<>();
        Queue<Pair<TreeNode, String>> queue = new LinkedList<>();
        queue.offer(new Pair<>(root, String.valueOf(root.val)));
        while (!queue.isEmpty()) {
            Pair<TreeNode, String> pair = queue.poll();
            TreeNode node = pair.getKey();
            String path = pair.getValue();
            if (node.left == null && node.right == null) {
                result.add(path);
            }
            if (node.left != null) {
                queue.offer(new Pair<>(node.left, path + "->" + node.left.val));
            }
            if (node.right != null) {
                queue.offer(new Pair<>(node.right, path + "->" + node.right.val));
            }
        }
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {TreeNode} root
 * @return {string[]}
 */
var binaryTreePaths = function(root) {
    if (!root) return [];
    const result = [];
    const queue = [[root, String(root.val)]];
    while (queue.length > 0) {
        const [node, path] = queue.shift();
        if (!node.left && !node.right) {
            result.push(path);
        }
        if (node.left) {
            queue.push([node.left, path + '->' + node.left.val]);
        }
        if (node.right) {
            queue.push([node.right, path + '->' + node.right.val]);
        }
    }
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - visit each node once |
| **Space** | O(w) - queue size equals max width of tree |

---

## Comparison of Approaches

| Aspect | DFS Recursive | Iterative DFS | BFS |
|--------|---------------|---------------|-----|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(h) | O(n) | O(w) |
| **Implementation** | Simple | Moderate | Moderate |
| **LeetCode Optimal** | ✅ | ✅ | ✅ |
| **Difficulty** | Easy | Easy | Easy |

**Best Approach:** Use Approach 1 (DFS Recursive) for the simplest and most elegant solution.

---

## Common Pitfalls

### 1. Not Checking for Leaf Nodes Correctly
**Issue:** Not properly identifying leaf nodes (nodes with no children).

**Solution:** Check `if not node.left and not node.right` to identify leaf nodes.

### 2. String Concatenation Efficiency
**Issue:** Creating new strings for each path can be inefficient for large trees.

**Solution:** Use list/string building approach shown in solution, or use path builder that reuses memory.

### 3. Missing Base Case
**Issue:** Not handling empty tree (root is None).

**Solution:** Return empty list if root is None.

---

## Related Problems

1. **[Path Sum II](https://leetcode.com/problems/path-sum-ii/)** - Find paths with specific sum
2. **[Sum Root to Leaf Numbers](https://leetcode.com/problems/sum-root-to-leaf-numbers/)** - Calculate sum from root to leaves
3. **[Longest Univalue Path](https://leetcode.com/problems/longest-univalue-path/)** - Path with same values
4. **[Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/)** - Tree to path conversion
5. **[Find Leaves of Binary Tree](https://leetcode.com/problems/find-leaves-of-binary-tree/)** - Find all leaf nodes

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[Binary Tree Paths - LeetCode 257](https://www.youtube.com/watch?v=4q1tYFhX6vU)** - NeetCode explanation
2. **[DFS Tree Traversal Explained](https://www.youtube.com/watch?v=ytQ5rVjF_pE)** - Back to Back SWE
3. **[Binary Tree Paths Tutorial](https://www.youtube.com/watch?v=XqxZ4WuNqGw)** - Nick White

### Related Concepts

- **[Tree Traversal Basics](https://www.youtube.com/watch?v=1iuKjT5vqU0)** - Understanding DFS/BFS on trees
- **[Backtracking in Trees](https://www.youtube.com/watch?v=Dr8IN9tYv6k)** - Path building techniques

---

## Summary

The **Binary Tree Paths** problem demonstrates the **Tree DFS - Path Building** pattern:

- **DFS for traversal**: Recursively visit all root-to-leaf paths
- **Path construction**: Build path string as we traverse
- **Leaf detection**: Identify when a complete path is found
- **Efficiency**: O(n) time, O(h) space

Key insights:
1. Use DFS to explore all paths from root to leaves
2. Build path incrementally as you traverse
3. Add to result when reaching a leaf node
4. The order of paths doesn't matter

---

## Follow-up Questions

### Q1: How would you modify to find paths with a specific sum?

**Answer:** Add a target sum parameter. Subtract node value from target at each step. When reaching a leaf, check if remaining sum equals node value.

### Q2: Can you solve this iteratively using a stack?

**Answer:** Yes, use an explicit stack instead of recursion. Push (node, path) pairs. Process similarly to recursive approach.

### Q3: How would you handle very deep trees?

**Answer:** Use iterative approach with explicit stack to avoid recursion depth limits. Or increase recursion limit in languages that support it.

### Q4: How would you modify to return paths as lists of integers instead of strings?

**Answer:** Instead of building a string, maintain a list of node values. Add/remove values as you traverse.

### Q5: How would you find the longest root-to-leaf path?

**Answer:** Track path length during DFS. Keep track of maximum length and corresponding path.
