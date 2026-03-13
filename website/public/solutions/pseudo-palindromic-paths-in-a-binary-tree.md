# Pseudo Palindromic Paths in a Binary Tree

## Problem Description

Given a binary tree where node values are digits from 1 to 9. A path in the binary tree is said to be pseudo-palindromic if at least one permutation of the node values in the path is a palindrome.

Return the number of pseudo-palindromic paths going from the root node to leaf nodes.

**Link to problem:** [Pseudo Palindromic Paths in a Binary Tree - LeetCode 1457](https://leetcode.com/problems/pseudo-palindromic-paths-in-a-binary-tree/)

## Constraints
- The number of nodes in the tree is in the range [1, 10^5]
- 1 <= Node.val <= 9

---

## Pattern: DFS with Bitmask

This problem uses **DFS with Bitmask** to track digit frequencies efficiently.

### Core Concept

- **Bitmask**: Use 10 bits to track counts of digits 1-9
- **XOR Toggle**: XOR with (1 << val) toggles digit presence
- **Palindrome Check**: At most one digit can have odd count

---

## Examples

### Example

**Input:** root = [2,3,1,3,1,null,1]

**Output:** 2

**Explanation:** Paths [2,3,3] → [3,2,3] (palindrome), [2,1,1] → [1,2,1] (palindrome)

### Example 2

**Input:** root = [2,1,1,1,3,null,null,null,null,null,1]

**Output:** 1

---

## Intuition

The key insight is:

1. **Bitmask Representation**: Each digit's count can be tracked with a bit
2. **XOR Toggle**: Adding/removing a digit toggles its bit
3. **Palindrome Check**: At most one odd count allowed

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **DFS with Bitmask (Optimal)** - O(n) time
2. **Iterative BFS with Stack** - O(n) time

---

## Approach 1: DFS with Bitmask

This is the standard and optimal solution.

### Algorithm Steps

1. Use DFS to traverse from root to leaves
2. Toggle bit for each digit using XOR
3. At leaf node, check if at most one bit is set
4. Count valid paths

### Code Implementation

````carousel
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def pseudoPalindromicPaths (self, root: TreeNode) -> int:
        def dfs(node, mask):
            if not node:
                return 0
            
            # Toggle the bit for current digit
            mask ^= (1 << node.val)
            
            # If leaf, check if palindrome possible
            if not node.left and not node.right:
                # At most one digit with odd count
                return 1 if mask & (mask - 1) == 0 else 0
            
            # Recurse on children
            return dfs(node.left, mask) + dfs(node.right, mask)
        
        return dfs(root, 0)
```

<!-- slide -->
```cpp
class Solution {
public:
    int pseudoPalindromicPaths(TreeNode* root) {
        return dfs(root, 0);
    }
    
private:
    int dfs(TreeNode* node, int mask) {
        if (!node) return 0;
        
        mask ^= (1 << node->val);
        
        if (!node->left && !node->right) {
            return (mask & (mask - 1)) == 0 ? 1 : 0;
        }
        
        return dfs(node->left, mask) + dfs(node->right, mask);
    }
};
```

<!-- slide -->
```java
class Solution {
    public int pseudoPalindromicPaths(TreeNode root) {
        return dfs(root, 0);
    }
    
    private int dfs(TreeNode node, int mask) {
        if (node == null) return 0;
        
        mask ^= (1 << node.val);
        
        if (node.left == null && node.right == null) {
            return (mask & (mask - 1)) == 0 ? 1 : 0;
        }
        
        return dfs(node.left, mask) + dfs(node.right, mask);
    }
}
```

<!-- slide -->
```javascript
var pseudoPalindromicPaths = function(root) {
    const dfs = (node, mask) => {
        if (!node) return 0;
        
        mask ^= (1 << node.val);
        
        if (!node.left && !node.right) {
            return (mask & (mask - 1)) === 0 ? 1 : 0;
        }
        
        return dfs(node.left, mask) + dfs(node.right, mask);
    };
    
    return dfs(root, 0);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) |
| **Space** | O(h) |

---

## Approach 2: Iterative BFS with Stack

This approach uses an explicit stack to simulate the depth-first traversal, avoiding recursion and providing better control over the traversal.

### Problem Description

Given a binary tree where node values are digits from 1 to 9, return the number of pseudo-palindromic paths from root to leaf using an iterative approach with explicit stack.

### Algorithm Steps

1. Initialize a stack with (node, mask) pairs starting from root
2. While stack is not empty:
   - Pop a node and its current mask
   - Toggle the bit for the current node's value
   - If it's a leaf node, check if the mask represents a pseudo-palindrome
   - Push non-null children onto the stack with updated mask
3. Return the count of valid paths

### Why It Works

The iterative approach achieves the same result as recursive DFS by explicitly managing the stack. Each entry in the stack represents a path from root to the current node. We maintain the bitmask state as we traverse, allowing us to check palindromic conditions at leaf nodes.

### Code Implementation

````carousel
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def pseudoPalindromicPaths(self, root: TreeNode) -> int:
        if not root:
            return 0
        
        count = 0
        stack = [(root, 0)]
        
        while stack:
            node, mask = stack.pop()
            
            # Toggle the bit for current digit
            mask ^= (1 << node.val)
            
            # If leaf, check if palindrome possible
            if not node.left and not node.right:
                # At most one digit with odd count
                if mask & (mask - 1) == 0:
                    count += 1
            
            # Push children onto stack
            if node.right:
                stack.append((node.right, mask))
            if node.left:
                stack.append((node.left, mask))
        
        return count
```

<!-- slide -->
```cpp
class Solution {
public:
    int pseudoPalindromicPaths(TreeNode* root) {
        if (!root) return 0;
        
        int count = 0;
        stack<pair<TreeNode*, int>> st;
        st.push({root, 0});
        
        while (!st.empty()) {
            auto [node, mask] = st.top();
            st.pop();
            
            // Toggle the bit for current digit
            mask ^= (1 << node->val);
            
            // If leaf, check if palindrome possible
            if (!node->left && !node->right) {
                if ((mask & (mask - 1)) == 0) {
                    count++;
                }
            }
            
            // Push children onto stack
            if (node->right) st.push({node->right, mask});
            if (node->left) st.push({node->left, mask});
        }
        
        return count;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int pseudoPalindromicPaths(TreeNode root) {
        if (root == null) return 0;
        
        int count = 0;
        Stack<Object[]> stack = new Stack<>();
        stack.push(new Object[]{root, 0});
        
        while (!stack.isEmpty()) {
            Object[] obj = stack.pop();
            TreeNode node = (TreeNode) obj[0];
            int mask = (int) obj[1];
            
            // Toggle the bit for current digit
            mask ^= (1 << node.val);
            
            // If leaf, check if palindrome possible
            if (node.left == null && node.right == null) {
                if ((mask & (mask - 1)) == 0) {
                    count++;
                }
            }
            
            // Push children onto stack
            if (node.right != null) {
                stack.push(new Object[]{node.right, mask});
            }
            if (node.left != null) {
                stack.push(new Object[]{node.left, mask});
            }
        }
        
        return count;
    }
}
```

<!-- slide -->
```javascript
var pseudoPalindromicPaths = function(root) {
    if (!root) return 0;
    
    let count = 0;
    const stack = [[root, 0]];
    
    while (stack.length > 0) {
        const [node, mask] = stack.pop();
        
        // Toggle the bit for current digit
        const newMask = mask ^ (1 << node.val);
        
        // If leaf, check if palindrome possible
        if (!node.left && !node.right) {
            if ((newMask & (newMask - 1)) === 0) {
                count++;
            }
        }
        
        // Push children onto stack
        if (node.right) {
            stack.push([node.right, newMask]);
        }
        if (node.left) {
            stack.push([node.left, newMask]);
        }
    }
    
    return count;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) |
| **Space** | O(w) - width of tree, worst case O(n) |

---

## Comparison of Approaches

| Aspect | DFS with Bitmask | Iterative BFS/Stack |
|--------|-----------------|-------------------|
| **Implementation** | Recursive | Iterative |
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(h) - height | O(w) - width |
| **Stack Overflow Risk** | Yes (deep trees) | No |
| **Control Flow** | Automatic | Manual |

**Best Approach:** Both approaches have the same time complexity. DFS with Bitmask is more elegant and commonly used, while iterative approach avoids recursion stack overflow for very deep trees.

## Why Bitmask Works

The bitmask efficiently tracks odd/even counts:
- XOR toggles a bit when a digit appears
- At most one odd count means at most one bit set
- `mask & (mask - 1) == 0` checks for at most one bit

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Palindrome Number | [Link](https://leetcode.com/problems/palindrome-number/) | Basic palindrome |
| Verify Preorder Serialization | [Link](https://leetcode.com/problems/verify-preorder-serialization-of-a-binary-tree/) | Tree validation |

---

## Video Tutorial Links

- [NeetCode - Pseudo Palindromic Paths](https://www.youtube.com/watch?v=7C_f7fD2p14) - Clear explanation

---

## Follow-up Questions

### Q1: Why use bitmask instead of array?

**Answer:** Bitmask is more space-efficient and faster for tracking odd/even counts.

### Q2: What does mask & (mask - 1) == 0 check?

**Answer:** It checks if at most one bit is set (power of 2).

---

## Common Pitfalls

### 1. Bit Position
**Issue**: Using wrong bit position for digits.

**Solution**: Use `1 << node.val` not `1 << (node.val - 1)`. Node values are 1-9, so shift by the value directly.

### 2. Leaf Node Check
**Issue**: Not checking for leaf nodes correctly.

**Solution**: A leaf has both left and right as null: `not node.left and not node.right`.

### 3. Bitmask Reset
**Issue**: Not resetting mask between different paths.

**Solution**: The recursive approach automatically handles this - each path gets its own mask value.

### 4. Zero Value
**Issue**: Not handling node value 0 (which doesn't exist per constraints).

**Solution**: Constraint says 1 <= Node.val <= 9, so we don't need to handle 0.

### 5. Tree Height
**Issue**: Stack overflow for very deep trees.

**Solution**: Use iterative approach with explicit stack, or increase recursion limit.

---

## Summary

The **Pseudo Palindromic Paths** problem demonstrates **DFS with Bitmask**:
- **Two approaches**: DFS with Bitmask (recursive) and Iterative BFS/Stack
- Use bitmask to track digit frequencies
- XOR toggles presence, palindrome needs ≤1 odd count
- O(n) time, O(h) space

DFS with Bitmask is more elegant, while iterative approach avoids recursion stack overflow.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/pseudo-palindromic-paths-in-a-binary-tree/discuss/)
