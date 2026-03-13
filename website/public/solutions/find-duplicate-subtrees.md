# Find Duplicate Subtrees

## Problem Description

Given the root of a binary tree, return all duplicate subtrees.
For each kind of duplicate subtrees, you only need to return the root node of any one of them.
Two trees are duplicate if they have the same structure with the same node values.

**LeetCode Link:** [Find Duplicate Subtrees - LeetCode](https://leetcode.com/problems/find-duplicate-subtrees/)

---

## Examples

### Example 1

**Input:**
```python
root = [1,2,3,4,null,2,4,null,null,4]
```

**Output:**
```python
[[2,4],[4]]
```

**Explanation:**
- The subtrees with root 2 and 4 are duplicates (both have structure [2,4])
- The subtree with root 4 is also duplicate

### Example 2

**Input:**
```python
root = [2,1,1]
```

**Output:**
```python
[[1]]
```

**Explanation:** The subtree rooted at node with value 1 (left child of root) and the subtree rooted at node with value 1 (right child of root) are duplicates.

### Example 3

**Input:**
```python
root = [2,2,2,3,null,3,null]
```

**Output:**
```python
[[2,3],[3]]
```

---

## Constraints

- The number of the nodes in the tree will be in the range [1, 5000]
- -200 <= Node.val <= 200

---

## Pattern: Tree Serialization with HashMap

This problem uses **Tree Serialization** to convert each subtree into a unique string representation. A HashMap counts occurrences of each serialized subtree, and duplicates are identified when the count reaches 2.

### Core Concept

- **Serialization**: Convert each subtree into a unique string
- **HashMap Counting**: Track how many times each serialized subtree appears
- **Duplicate Detection**: Identify subtrees that appear more than once

### When to Use This Pattern

This pattern is applicable when:
1. Finding duplicate substructures in trees or graphs
2. Comparing tree structures for equality
3. Identifying repeated patterns in hierarchical data

---

## Intuition

The key insight for this problem is that we need a way to **uniquely identify** each unique subtree structure. Once we can identify each subtree uniquely, we can simply count how many times each appears.

### Key Observations

1. **Subtree as String**: Every subtree can be represented as a string that uniquely identifies its structure and node values.

2. **Post-order Traversal**: Using post-order (left, right, root), we can build the serialization from the bottom up, ensuring child subtrees are processed first.

3. **Null Marker**: Using a special marker (like "#") for null nodes is crucial to distinguish between:
   - `1,null,null` (single node with value 1)
   - `1` (just value 1 with no children)

4. **Count = 2 for Duplicates**: We add a subtree to the result when we've seen it exactly twice - once for the first occurrence and once for the duplicate.

### Algorithm Overview

1. **Serialize each subtree**: Use DFS to traverse the tree and create a string representation
2. **Count occurrences**: Use a HashMap to count how many times each serialized subtree appears
3. **Collect duplicates**: When count reaches 2, add the current node to results

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Serialization with HashMap** - Most common solution
2. **Using Tree ID (Efficient)** - More optimized approach with unique IDs

---

## Approach 1: Serialization with HashMap (Most Common)

### Algorithm Steps

1. Perform post-order DFS traversal
2. For each node, create a serialization string: `val + "," + left_serial + "," + right_serial`
3. Use "#" for null nodes
4. Increment count in HashMap
5. If count == 2, add this node to result
6. Return the serialization string for parent to use

### Why It Works

This approach works because:
- Each unique subtree has a unique serialization string
- The string captures both structure and node values
- HashMap efficiently counts occurrences
- Post-order ensures children are processed before parents

### Code Implementation

````carousel
```python
from typing import List, Optional
from collections import defaultdict

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def findDuplicateSubtrees(self, root: Optional[TreeNode]) -> List[Optional[TreeNode]]:
        """
        Find all duplicate subtrees in a binary tree.
        
        Args:
            root: Root of the binary tree
            
        Returns:
            List of root nodes of duplicate subtrees
        """
        count = defaultdict(int)
        result = []
        
        def serialize(node):
            """Serialize subtree rooted at node."""
            if not node:
                return "#"  # Marker for null node
            
            # Post-order: left, right, root
            left = serialize(node.left)
            right = serialize(node.right)
            
            # Create unique string representation
            serial = f"{node.val},{left},{right}"
            
            # Count occurrences
            count[serial] += 1
            
            # Add to result when we see it second time
            if count[serial] == 2:
                result.append(node)
            
            return serial
        
        serialize(root)
        return result
```

<!-- slide -->
```cpp
#include <unordered_map>
#include <vector>
#include <string>
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
    vector<TreeNode*> findDuplicateSubtrees(TreeNode* root) {
        unordered_map<string, int> count;
        vector<TreeNode*> result;
        
        function<string(TreeNode*)> serialize = [&](TreeNode* node) -> string {
            if (!node) {
                return "#";  // Marker for null node
            }
            
            // Post-order: left, right, root
            string left = serialize(node->left);
            string right = serialize(node->right);
            
            // Create unique string representation
            string serial = to_string(node->val) + "," + left + "," + right;
            
            // Count occurrences
            count[serial]++;
            
            // Add to result when we see it second time
            if (count[serial] == 2) {
                result.push_back(node);
            }
            
            return serial;
        };
        
        serialize(root);
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

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
    private Map<String, Integer> count = new HashMap<>();
    private List<TreeNode> result = new ArrayList<>();
    
    public List<TreeNode> findDuplicateSubtrees(TreeNode root) {
        count.clear();
        result.clear();
        serialize(root);
        return result;
    }
    
    private String serialize(TreeNode node) {
        if (node == null) {
            return "#";  // Marker for null node
        }
        
        // Post-order: left, right, root
        String left = serialize(node.left);
        String right = serialize(node.right);
        
        // Create unique string representation
        String serial = node.val + "," + left + "," + right;
        
        // Count occurrences
        count.put(serial, count.getOrDefault(serial, 0) + 1);
        
        // Add to result when we see it second time
        if (count.get(serial) == 2) {
            result.add(node);
        }
        
        return serial;
    }
}
```

<!-- slide -->
```javascript
// Definition for a binary tree node.
function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
}

/**
 * @param {TreeNode} root
 * @return {TreeNode[]}
 */
var findDuplicateSubtrees = function(root) {
    const count = new Map();
    const result = [];
    
    function serialize(node) {
        if (!node) {
            return "#";  // Marker for null node
        }
        
        // Post-order: left, right, root
        const left = serialize(node.left);
        const right = serialize(node.right);
        
        // Create unique string representation
        const serial = `${node.val},${left},${right}`;
        
        // Count occurrences
        count.set(serial, (count.get(serial) || 0) + 1);
        
        // Add to result when we see it second time
        if (count.get(serial) === 2) {
            result.push(node);
        }
        
        return serial;
    }
    
    serialize(root);
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(N²) in worst case - each serialization can be O(N) and we do it for N nodes |
| **Space** | O(N²) for storing all serialization strings in worst case |

---

## Approach 2: Using Tree ID (Optimized)

### Algorithm Steps

1. Use a hashmap to assign unique IDs to each unique subtree structure
2. Use another hashmap to count how many times each ID appears
3. Post-order traversal to get IDs for left and right children
4. Combine node value with child IDs to create a unique identifier
5. When count reaches 2, add to result

### Why It Works

This approach optimizes the string storage by using integer IDs instead of full strings. The key insight is that we can assign a unique ID to each unique subtree pattern.

### Code Implementation

````carousel
```python
from typing import List, Optional
from collections import defaultdict

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def findDuplicateSubtrees(self, root: Optional[TreeNode]) -> List[Optional[TreeNode]]:
        """
        Find duplicates using tree ID approach.
        """
        # Maps: subtree pattern -> unique ID, ID -> count
        tree_id = defaultdict(lambda: len(tree_id))
        count = defaultdict(int)
        result = []
        
        def get_id(node):
            if not node:
                return 0  # Special ID for null
            
            # Create pattern: (value, left_id, right_id)
            pattern = (node.val, get_id(node.left), get_id(node.right))
            
            # Assign ID if new pattern
            current_id = tree_id[pattern]
            
            # Count this ID
            count[current_id] += 1
            
            # Add to result on second occurrence
            if count[current_id] == 2:
                result.append(node)
            
            return current_id
        
        get_id(root)
        return result
```

<!-- slide -->
```cpp
#include <unordered_map>
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
    vector<TreeNode*> findDuplicateSubtrees(TreeNode* root) {
        unordered_map<long long, int> treeId;
        unordered_map<int, int> count;
        vector<TreeNode*> result;
        int id = 1;
        
        function<int(TreeNode*)> getId = [&](TreeNode* node) -> int {
            if (!node) return 0;
            
            long long pattern = ((long long)node->val << 32) | 
                                ((long long)getId(node->left) << 16) | 
                                (long long)getId(node->right);
            
            if (!treeId.count(pattern)) {
                treeId[pattern] = id++;
            }
            
            int currentId = treeId[pattern];
            count[currentId]++;
            
            if (count[currentId] == 2) {
                result.push_back(node);
            }
            
            return currentId;
        };
        
        getId(root);
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
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

class Solution {
    private Map<String, Integer> treeId = new HashMap<>();
    private Map<Integer, Integer> count = new HashMap<>();
    private List<TreeNode> result = new ArrayList<>();
    private int id = 1;
    
    public List<TreeNode> findDuplicateSubtrees(TreeNode root) {
        treeId.clear();
        count.clear();
        result.clear();
        id = 1;
        
        getId(root);
        return result;
    }
    
    private int getId(TreeNode node) {
        if (node == null) return 0;
        
        String pattern = node.val + "," + getId(node.left) + "," + getId(node.right);
        
        if (!treeId.containsKey(pattern)) {
            treeId.put(pattern, id++);
        }
        
        int currentId = treeId.get(pattern);
        count.put(currentId, count.getOrDefault(currentId, 0) + 1);
        
        if (count.get(currentId) == 2) {
            result.add(node);
        }
        
        return currentId;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {TreeNode} root
 * @return {TreeNode[]}
 */
var findDuplicateSubtrees = function(root) {
    const treeId = new Map();
    const count = new Map();
    const result = [];
    let id = 1;
    
    function getId(node) {
        if (!node) return 0;
        
        const pattern = `${node.val},${getId(node.left)},${getId(node.right)}`;
        
        if (!treeId.has(pattern)) {
            treeId.set(pattern, id++);
        }
        
        const currentId = treeId.get(pattern);
        count.set(currentId, (count.get(currentId) || 0) + 1);
        
        if (count.get(currentId) === 2) {
            result.push(node);
        }
        
        return currentId;
    }
    
    getId(root);
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(N) - each node processed once |
| **Space** | O(N) - storing IDs and counts |

---

## Comparison of Approaches

| Aspect | Serialization | Tree ID |
|--------|--------------|---------|
| **Time Complexity** | O(N²) | O(N) |
| **Space Complexity** | O(N²) | O(N) |
| **Implementation** | Simple | Moderate |
| **Readability** | High | Medium |

**Best Approach:** Use Approach 2 (Tree ID) for better performance. The string approach is more intuitive but can be slow for large trees.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Occasionally asked in technical interviews
- **Companies**: Google, Amazon, Microsoft
- **Difficulty**: Medium
- **Concepts Tested**: Tree traversal, serialization, HashMap usage

### Learning Outcomes

1. **Tree Serialization**: Learn to convert tree structures to unique strings
2. **Post-order Traversal**: Master bottom-up tree processing
3. **HashMap Optimization**: Understand counting and duplicate detection

---

## Related Problems

Based on similar themes (tree serialization, duplicates):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Serialize and Deserialize Binary Tree | [Link](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/) | Tree to string conversion |
| Count Unique Subtrees | [Link](https://leetcode.com/problems/count-unique-subtrees/) | Similar counting approach |
| Same Tree | [Link](https://leetcode.com/problems/same-tree/) | Tree structure comparison |

### Pattern Reference

For more detailed explanations of the Tree Serialization pattern, see:
- **[Tree Traversal Pattern](/patterns/tree)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[Find Duplicate Subtrees - NeetCode](https://www.youtube.com/watch?v=Kn75SiPeRaE)** - Clear explanation
2. **[LeetCode 652 - Find Duplicate Subtrees](https://www.youtube.com/watch?v=6mZ3pzXvo8E)** - Detailed walkthrough

---

## Follow-up Questions

### Q1: How would you modify the solution to return ALL duplicate subtrees (not just one of each type)?

**Answer:** Instead of adding to result when count == 2, add every node when count > 1. This will return all instances of duplicate subtrees.

---

### Q2: What if node values can be more than -200 to 200 (larger range)?

**Answer:** The solution still works because we're using the node value as part of the serialization pattern. The range doesn't affect the algorithm's correctness - it only affects the number of unique subtrees.

---

### Q3: Can you solve this without using strings?

**Answer:** Yes! The Tree ID approach (Approach 2) uses integer IDs instead of strings, making it more memory-efficient. Each unique subtree structure gets a unique integer ID.

---

### Q4: How would you handle very deep trees that might cause stack overflow?

**Answer:** Convert the recursive solution to an iterative one using explicit stack simulation, or use a different approach like serialization with post-order iteration.

---

## Common Pitfalls

### 1. Serialization Not Unique
**Issue**: The serialization must uniquely represent tree structure - include both left and right children with a delimiter (e.g., comma-separated).

**Solution**: Always include delimiters and handle null nodes with a special marker.

### 2. Not Handling Null Nodes
**Issue**: Using a special marker (like "#") for null nodes to distinguish between different tree structures.

**Solution**: Use "#" or some other marker for null nodes in serialization.

### 3. Adding Duplicates Multiple Times
**Issue**: Only add to result when count reaches 2, not on every subsequent occurrence.

**Solution**: Use `if count[s] == 2` to add only once per duplicate type.

### 4. Stack Overflow with Deep Trees
**Issue**: Consider using iterative traversal if the tree depth could exceed recursion limits.

**Solution**: For very deep trees, implement an iterative solution.

---

## Summary

The **Find Duplicate Subtrees** problem demonstrates the power of tree serialization:

Key takeaways:
1. Convert each subtree to a unique string representation
2. Use post-order traversal to build serialization from bottom up
3. Use HashMap to count occurrences of each unique subtree
4. Add to result when count reaches 2 (first duplicate found)

This problem is essential for understanding tree serialization and its applications.

### Pattern Summary

This problem exemplifies the **Tree Serialization** pattern, characterized by:
- Converting tree structures to unique string/ID representations
- Using post-order traversal for bottom-up processing
- HashMap-based counting for duplicate detection
- Applications in tree comparison and pattern finding

For more details on this pattern, see the **[Tree Traversal Pattern](/patterns/tree)**.

---

## Additional Resources

- [LeetCode Problem 652](https://leetcode.com/problems/find-duplicate-subtrees/) - Official problem page
- [Tree Serialization - GeeksforGeeks](https://www.geeksforgeeks.org/serialize-deserialize-binary-tree/) - Detailed explanation
- [Pattern: Tree Traversal](/patterns/tree) - Comprehensive pattern guide
