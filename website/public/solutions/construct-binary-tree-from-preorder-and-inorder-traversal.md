# Construct Binary Tree From Preorder And Inorder Traversal

## Problem Description

Given two integer arrays preorder and inorder where preorder is the preorder traversal of a binary tree and inorder is the inorder traversal of the same tree, construct and return the binary tree.

**Link to problem:** [Construct Binary Tree from Preorder and Inorder Traversal - LeetCode 105](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)

---

## Examples

### Example 1:

**Input:**
```
preorder = [3,9,20,15,7]
inorder = [9,3,15,20,7]
```

**Output:**
```
[3,9,20,null,null,15,7]
```

**Explanation:** The tree structure:
```
    3
   / \
  9  20
    /  \
   15   7
```

### Example 2:

**Input:**
```
preorder = [-1]
inorder = [-1]
```

**Output:**
```
[-1]
```

**Explanation:** Single node tree.

### Example 3:

**Input:**
```
preorder = [1,2,3]
inorder = [2,3,1]
```

**Output:**
```
[1,2,null,3]
```

**Explanation:** The tree structure:
```
    1
   /
  2
   \
    3
```

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `1 <= preorder.length <= 3000` | Number of nodes |
| `inorder.length == preorder.length` | Equal arrays |
| `-3000 <= preorder[i], inorder[i] <= 3000` | Node values |
| `preorder` and `inorder` consist of unique values | No duplicates |
| Each value of `inorder` also appears in `preorder` | Valid tree |
| `preorder` is guaranteed to be the preorder traversal | Valid input |
| `inorder` is guaranteed to be the inorder traversal | Valid input |

---

## Pattern: Recursive Tree Construction

This problem is a classic example of using recursion to construct a binary tree from two traversal orders. The key insight is that we can identify the root and divide the tree into left and right subtrees using the traversals.

### Core Concept

- **Root Identification**: First element of preorder is always the root
- **Inorder Partition**: Root divides inorder into left subtree and right subtree
- **Recursive Construction**: Build left subtree from preorder[1:left_size+1] and inorder[0:root_index]
- **Right Subtree**: Build right subtree from remaining elements

---

## Intuition

The key insight is understanding how traversals work:

1. **Preorder**: Root → Left → Right (root first)
2. **Inorder**: Left → Root → Right (root in middle)

Given root from preorder[0], we can find its position in inorder. All elements before root in inorder form the left subtree, and all elements after root form the right subtree.

### Why It Works

- In preorder, we always know the root first
- In inorder, the root splits the array into left and right subtrees
- By recursively applying this logic, we can rebuild the entire tree

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Recursion with Map (Optimal)** - O(n) time, O(n) space
2. **Recursion without Map (Simple)** - O(n²) time, O(n) space

---

## Approach 1: Recursion with Index Map (Optimal) ✅

This approach uses a hash map to quickly find the root index in inorder, achieving O(n) time complexity.

### Algorithm Steps

1. **Build Index Map**: Create a map from value to index in inorder
2. **Recursive Function**: Define function build(pre_start, pre_end, in_start, in_end)
3. **Base Case**: If pre_start > pre_end, return null
4. **Get Root**: preorder[pre_start] is the root value
5. **Find Root Index**: Use map to find root index in inorder
6. **Calculate Left Size**: root_index - in_start
7. **Build Left**: Recursively build left subtree
8. **Build Right**: Recursively build right subtree
9. **Return Root**: Connect and return root node

### Why It Works

The hash map allows O(1) lookup of root position in inorder. This avoids scanning the inorder array for each recursive call, reducing overall complexity from O(n²) to O(n).

### Code Implementation

````carousel
```python
from typing import List, Optional


class TreeNode:
    """Definition for a binary tree node."""
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
        """
        Construct binary tree from preorder and inorder traversals.
        
        Args:
            preorder: Preorder traversal list
            inorder: Inorder traversal list
            
        Returns:
            Root of binary tree
        """
        # Build value to index map for inorder
        self.inorder_index_map = {val: idx for idx, val in enumerate(inorder)}
        
        # Recursive construction
        def build(pre_start: int, pre_end: int, in_start: int, in_end: int) -> Optional[TreeNode]:
            # Base case: no elements in range
            if pre_start > pre_end:
                return None
            
            # Root is first element in preorder range
            root_val = preorder[pre_start]
            root = TreeNode(root_val)
            
            # Find root index in inorder
            root_index = self.inorder_index_map[root_val]
            
            # Calculate left subtree size
            left_size = root_index - in_start
            
            # Build left subtree
            root.left = build(
                pre_start + 1,
                pre_start + left_size,
                in_start,
                root_index - 1
            )
            
            # Build right subtree
            root.right = build(
                pre_start + left_size + 1,
                pre_end,
                root_index + 1,
                in_end
            )
            
            return root
        
        return build(0, len(preorder) - 1, 0, len(inorder) - 1)
```

<!-- slide -->
```cpp
/**
 * Definition for a binary tree node.
 */
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

class Solution {
private:
    unordered_map<int, int> inorderIndexMap;
    vector<int> preorder;
    vector<int> inorder;
    
    TreeNode* build(int preStart, int preEnd, int inStart, int inEnd) {
        // Base case: no elements
        if (preStart > preEnd) {
            return nullptr;
        }
        
        // Root is first in preorder
        int rootVal = preorder[preStart];
        TreeNode* root = new TreeNode(rootVal);
        
        // Find root in inorder
        int rootIndex = inorderIndexMap[rootVal];
        
        // Left subtree size
        int leftSize = rootIndex - inStart;
        
        // Build left subtree
        root->left = build(preStart + 1, preStart + leftSize, inStart, rootIndex - 1);
        
        // Build right subtree
        root->right = build(preStart + leftSize + 1, preEnd, rootIndex + 1, inEnd);
        
        return root;
    }
    
public:
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        this->preorder = preorder;
        this->inorder = inorder;
        
        // Build index map
        for (int i = 0; i < inorder.size(); i++) {
            inorderIndexMap[inorder[i]] = i;
        }
        
        return build(0, preorder.size() - 1, 0, inorder.size() - 1);
    }
};
```

<!-- slide -->
```java
/**
 * Definition for a binary tree node.
 */
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    
    TreeNode() {}
    
    TreeNode(int val) {
        this.val = val;
    }
    
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

class Solution {
    private Map<Integer, Integer> inorderIndexMap;
    private int[] preorder;
    
    public TreeNode buildTree(int[] preorder, int[] inorder) {
        this.preorder = preorder;
        inorderIndexMap = new HashMap<>();
        
        // Build value to index map
        for (int i = 0; i < inorder.length; i++) {
            inorderIndexMap.put(inorder[i], i);
        }
        
        return build(0, preorder.length - 1, 0, inorder.length - 1);
    }
    
    private TreeNode build(int preStart, int preEnd, int inStart, int inEnd) {
        // Base case
        if (preStart > preEnd) {
            return null;
        }
        
        // Root is first in preorder
        int rootVal = preorder[preStart];
        TreeNode root = new TreeNode(rootVal);
        
        // Find root in inorder
        int rootIndex = inorderIndexMap.get(rootVal);
        
        // Left subtree size
        int leftSize = rootIndex - inStart;
        
        // Build left subtree
        root.left = build(preStart + 1, preStart + leftSize, inStart, rootIndex - 1);
        
        // Build right subtree
        root.right = build(preStart + leftSize + 1, preEnd, rootIndex + 1, inEnd);
        
        return root;
    }
}
```

<!-- slide -->
```javascript
/**
 * Definition for a binary tree node.
 */
function TreeNode(val, left, right) {
    this.val = (val === undefined ? 0 : val);
    this.left = (left === undefined ? null : left);
    this.right = (right === undefined ? null : right);
}

/**
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function(preorder, inorder) {
    // Build value to index map for inorder
    const inorderIndexMap = new Map();
    inorder.forEach((val, idx) => inorderIndexMap.set(val, idx));
    
    function build(preStart, preEnd, inStart, inEnd) {
        // Base case
        if (preStart > preEnd) {
            return null;
        }
        
        // Root is first in preorder
        const rootVal = preorder[preStart];
        const root = new TreeNode(rootVal);
        
        // Find root in inorder
        const rootIndex = inorderIndexMap.get(rootVal);
        
        // Left subtree size
        const leftSize = rootIndex - inStart;
        
        // Build left subtree
        root.left = build(preStart + 1, preStart + leftSize, inStart, rootIndex - 1);
        
        // Build right subtree
        root.right = build(preStart + leftSize + 1, preEnd, rootIndex + 1, inEnd);
        
        return root;
    }
    
    return build(0, preorder.length - 1, 0, inorder.length - 1);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each node visited once |
| **Space** | O(n) - Hash map and recursion stack |

---

## Approach 2: Recursion without Map (Simple)

This approach finds the root index in inorder by scanning, resulting in O(n²) time complexity.

### Algorithm Steps

1. **Base Case**: If preorder is empty, return null
2. **Get Root**: First element of preorder is root
3. **Find Root**: Scan inorder to find root index
4. **Divide**: Split inorder at root index
5. **Recurse**: Build left and right subtrees recursively

### Why It Works

Same logic as Approach 1, but without the optimization of using a hash map. Works correctly but slower for large inputs.

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
    def buildTree(self, preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
        """
        Simple recursion without index map - O(n²) time
        """
        if not preorder:
            return None
        
        # Root is first element
        root_val = preorder[0]
        root = TreeNode(root_val)
        
        # Find root index in inorder
        root_index = inorder.index(root_val)
        
        # Build left subtree
        root.left = self.buildTree(
            preorder[1:1 + root_index],
            inorder[:root_index]
        )
        
        # Build right subtree
        root.right = self.buildTree(
            preorder[1 + root_index:],
            inorder[root_index + 1:]
        )
        
        return root
```

<!-- slide -->
```cpp
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
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        if (preorder.empty()) return nullptr;
        
        int rootVal = preorder[0];
        TreeNode* root = new TreeNode(rootVal);
        
        // Find root index in inorder
        auto it = find(inorder.begin(), inorder.end(), rootVal);
        int rootIndex = it - inorder.begin();
        
        // Build left subtree
        vector<int> leftPre(preorder.begin() + 1, preorder.begin() + 1 + rootIndex);
        vector<int> leftIn(inorder.begin(), inorder.begin() + rootIndex);
        root->left = buildTree(leftPre, leftIn);
        
        // Build right subtree
        vector<int> rightPre(preorder.begin() + 1 + rootIndex, preorder.end());
        vector<int> rightIn(inorder.begin() + rootIndex + 1, inorder.end());
        root->right = buildTree(rightPre, rightIn);
        
        return root;
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
    public TreeNode buildTree(int[] preorder, int[] inorder) {
        if (preorder.length == 0) return null;
        
        int rootVal = preorder[0];
        TreeNode root = new TreeNode(rootVal);
        
        // Find root index in inorder
        int rootIndex = 0;
        for (int i = 0; i < inorder.length; i++) {
            if (inorder[i] == rootVal) {
                rootIndex = i;
                break;
            }
        }
        
        // Build left subtree
        int[] leftPre = Arrays.copyOfRange(preorder, 1, 1 + rootIndex);
        int[] leftIn = Arrays.copyOfRange(inorder, 0, rootIndex);
        root.left = buildTree(leftPre, leftIn);
        
        // Build right subtree
        int[] rightPre = Arrays.copyOfRange(preorder, 1 + rootIndex, preorder.length);
        int[] rightIn = Arrays.copyOfRange(inorder, rootIndex + 1, inorder.length);
        root.right = buildTree(rightPre, rightIn);
        
        return root;
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
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function(preorder, inorder) {
    if (preorder.length === 0) return null;
    
    const rootVal = preorder[0];
    const root = new TreeNode(rootVal);
    
    // Find root index in inorder
    const rootIndex = inorder.indexOf(rootVal);
    
    // Build left subtree
    root.left = buildTree(
        preorder.slice(1, 1 + rootIndex),
        inorder.slice(0, rootIndex)
    );
    
    // Build right subtree
    root.right = buildTree(
        preorder.slice(1 + rootIndex),
        inorder.slice(rootIndex + 1)
    );
    
    return root;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - Finding root index in inorder for each node |
| **Space** | O(n) - Recursion stack and sliced arrays |

---

## Comparison of Approaches

| Aspect | With Map | Without Map |
|--------|----------|-------------|
| **Time Complexity** | O(n) | O(n²) |
| **Space Complexity** | O(n) | O(n²) |
| **Implementation** | Moderate | Simple |
| **LeetCode Optimal** | ✅ Yes | ❌ No |
| **Best For** | Production/Interviews | Learning |

**Recommendation:** Use the hash map approach for efficiency and interviews.

---

## Why This Problem is Important

### Interview Relevance
- **Frequency**: Very frequently asked in technical interviews
- **Companies**: Google, Amazon, Microsoft, Meta
- **Difficulty**: Medium
- **Concepts**: Binary trees, recursion, traversal understanding

### Key Learnings
1. **Tree Traversal Understanding**: Deep understanding of preorder and inorder
2. **Recursive Problem Solving**: Breaking down complex problems
3. **Index Management**: Careful handling of array ranges
4. **Optimization**: Using hash maps to avoid redundant work

---

## Related Problems

### Same Pattern (Tree Construction)

| Problem | LeetCode Link | Difficulty | Description |
|---------|---------------|------------|-------------|
| Construct from Inorder and Postorder | [Link](https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/) | Medium | Using postorder |
| Construct from Preorder and Postorder | [Link](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-postorder-traversal/) | Medium | Without inorder |

### Similar Concepts

| Problem | LeetCode Link | Difficulty | Related Technique |
|---------|---------------|------------|-------------------|
| Binary Tree Inorder Traversal | [Link](https://leetcode.com/problems/binary-tree-inorder-traversal/) | Easy | Tree traversal |
| Binary Tree Preorder Traversal | [Link](https://leetcode.com/problems/binary-tree-preorder-traversal/) | Easy | Tree traversal |
| Validate Binary Search Tree | [Link](https://leetcode.com/problems/validate-binary-search-tree/) | Medium | BST validation |

---

## Video Tutorial Links

### Tree Construction

1. **[Construct Binary Tree - NeetCode](https://www.youtube.com/watch?v=ih9lZJlX1X0)**
   - Clear explanation with visual examples
   - Step-by-step construction

2. **[LeetCode 105 - Full Explanation](https://www.youtube.com/watch?v=Gszy7oI68CA)**
   - Detailed walkthrough
   - Multiple approaches

3. **[Binary Tree Traversals](https://www.youtube.com/watch?v=1Z8RRz6Hz8s)**
   - Understanding traversal orders
   - Visual explanations

---

## Follow-up Questions

### Q1: Can you construct the tree using only preorder and postorder?

**Answer:** Not uniquely. Without inorder, you cannot determine which elements belong to left vs right subtree. However, if the tree is full (each node has 0 or 2 children), it's possible.

---

### Q2: What if there are duplicate values in the tree?

**Answer:** The problem guarantees unique values. With duplicates, you'd need additional information or constraints to uniquely identify the tree.

---

### Q3: How would you modify for O(1) space (excluding recursion stack)?

**Answer:** You cannot achieve O(1) space for this problem because you need to store the tree structure. The optimal is O(n) with hash map.

---

### Q4: What is the maximum recursion depth?

**Answer:** It equals the tree height, which could be O(n) for a skewed tree. Python's default recursion limit is around 1000, which could be problematic for large skewed trees.

---

### Q5: How does this extend to N-ary trees?

**Answer:** For N-ary trees, you'd need a traversal that identifies root and children order. It's more complex and typically requires additional information.

---

### Q6: Can you do it iteratively?

**Answer:** Yes, but it's complex. You would need to manually manage a stack to simulate the recursive process. The recursive solution is more elegant.

---

### Q7: How would you handle memory constraints?

**Answer:** The hash map uses O(n) space. For memory-constrained environments, you could use the O(n²) approach with in-place slicing, but it would be slower.

---

### Q8: What if inorder is very large and doesn't fit in memory?

**Answer:** For external memory, you'd need a different approach using disk-based data structures or streaming algorithms. This is rarely asked in interviews.

---

## Common Pitfalls

### 1. Index Calculation Errors
**Issue**: Off-by-one errors in preorder/inorder index ranges.

**Solution**: Carefully track the boundaries. Remember:
- Left subtree: pre[1:left_size], in[0:root_index-1]
- Right subtree: pre[left_size+1:], in[root_index+1:]

### 2. Forgetting Base Case
**Issue**: Not handling empty subtree case.

**Solution**: Always check if start > end and return null.

### 3. List Slicing Overhead
**Issue**: Creating new lists in each recursion (Python).

**Solution:** Use indices instead of slicing to avoid O(n²) memory allocation. Approach 1 does this.

### 4. Not Building Index Map
**Issue**: Using O(n²) approach in interview when O(n) is expected.

**Solution:** Pre-build the hash map for O(1) lookups.

### 5. Modifying Global State Incorrectly
**Issue**: Not properly resetting or passing index map.

**Solution:** Build the map once before recursion or pass it as a parameter.

---

## Summary

The **Construct Binary Tree from Preorder and Inorder Traversal** problem demonstrates:

1. **Tree Traversal Understanding**: Deep knowledge of preorder and inorder
2. **Recursive Problem Solving**: Breaking complex problems into subproblems
3. **Optimization**: Using hash maps to reduce time complexity
4. **Index Management**: Careful handling of array boundaries

The optimal approach uses a hash map to achieve O(n) time and O(n) space complexity. This is a fundamental tree construction problem that tests your understanding of tree traversals and recursion.

### Pattern Summary

This problem exemplifies the **Recursive Tree Construction** pattern:
- First element of preorder is always the root
- Root divides inorder into left and right subtrees
- Recursively apply to build entire tree
- Use hash map for O(1) lookups

For more details on tree problems and traversal patterns, see related resources.

---

## Additional Resources

- [LeetCode Problem 105](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/) - Official problem
- [Tree Traversal - GeeksforGeeks](https://www.geeksforgeeks.org/tree-traversals/) - Comprehensive guide
- [Binary Tree Problems](https://en.wikipedia.org/wiki/Binary_tree) - Theory and concepts
