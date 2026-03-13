# Find Mode in Binary Search Tree

## Problem Description of a binary search

Given the root tree (BST) with duplicates, return all the mode(s) (i.e., the most frequently occurred element) in it. If the tree has more than one mode, return them in any order.

Assume a BST is defined as follows:
- The left subtree of a node contains only nodes with keys less than or equal to the node's key.
- The right subtree of a node contains only nodes with keys greater than or equal to the node's key.
- Both the left and right subtrees must also be binary search trees.

**Link to problem:** [Find Mode in Binary Search Tree - LeetCode 501](https://leetcode.com/problems/find-mode-in-binary-search-tree/)

## Constraints
- The number of nodes in the tree is in the range `[1, 10^4]`
- `-10^5 <= Node.val <= 10^5`

**Follow-up:** Could you do that without using any extra space? (Assume that the implicit stack space incurred due to recursion does not count).

---

## Pattern: Inorder Traversal with Counter

This problem demonstrates the **Inorder Traversal with Counter** pattern. The key insight is that inorder traversal of BST visits nodes in sorted order.

### Core Concept

- **Inorder Traversal**: BST inorder gives sorted order
- **Consecutive Elements**: Equal values appear consecutively in sorted order
- **Counter Pattern**: Track current count and compare with maximum

---

## Examples

### Example

**Input:** root = [1,null,2,2]

**Output:** [2]

**Explanation:** The BST has values [1, 2, 2], so 2 appears most frequently.

### Example 2

**Input:** root = [0]

**Output:** [0]

---

## Intuition

The key insight is that in a BST, duplicate values appear consecutively during inorder traversal:

1. **Inorder Traversal**: Visit nodes in ascending order
2. **Track Count**: Count consecutive equal values
3. **Update Mode**: When current count > max count, update mode list

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Inorder Traversal (Optimal)** - O(n) time, O(h) space
2. **Hash Map + Traversal** - O(n) time, O(n) space
3. **Morris Traversal** - O(n) time, O(1) space (no recursion)

---

## Approach 1: Inorder Traversal (Optimal)

This is the most elegant and space-efficient solution.

### Algorithm Steps

1. Perform inorder traversal recursively
2. Track four variables:
   - prev: Previous node value
   - count: Current frequency count
   - max_count: Maximum frequency encountered
   - modes: List of values with maximum frequency
3. For each node:
   - If same as prev, increment count
   - If different from prev, reset count to 1
   - Update max_count and modes accordingly
4. Return modes list

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
    def findMode(self, root: Optional[TreeNode]) -> List[int]:
        """
        Find mode(s) using inorder traversal.
        
        Args:
            root: Root of BST
            
        Returns:
            List of mode(s)
        """
        if not root:
            return []
        
        self.max_count = 0
        self.count = 0
        self.prev = None
        self.modes = []
        
        def inorder(node):
            if not node:
                return
            
            # Left
            inorder(node.left)
            
            # Process current node
            if self.prev is None or node.val != self.prev:
                self.count = 1
            else:
                self.count += 1
            
            if self.count > self.max_count:
                self.max_count = self.count
                self.modes = [node.val]
            elif self.count == self.max_count:
                self.modes.append(node.val)
            
            self.prev = node.val
            
            # Right
            inorder(node.right)
        
        inorder(root)
        return self.modes
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
    vector<int> findMode(TreeNode* root) {
        int maxCount = 0;
        int count = 0;
        int prev = INT_MIN;
        vector<int> modes;
        
        function<void(TreeNode*)> inorder = [&](TreeNode* node) {
            if (!node) return;
            
            inorder(node->left);
            
            if (prev == INT_MIN || node->val != prev) {
                count = 1;
            } else {
                count++;
            }
            
            if (count > maxCount) {
                maxCount = count;
                modes = {node->val};
            } else if (count == maxCount) {
                modes.push_back(node->val);
            }
            
            prev = node->val;
            
            inorder(node->right);
        };
        
        inorder(root);
        return modes;
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
    private int maxCount = 0;
    private int count = 0;
    private Integer prev = null;
    private List<Integer> modes = new ArrayList<>();
    
    public int[] findMode(TreeNode root) {
        inorder(root);
        return modes.stream().mapToInt(Integer::intValue).toArray();
    }
    
    private void inorder(TreeNode node) {
        if (node == null) return;
        
        inorder(node.left);
        
        if (prev == null || node.val != prev) {
            count = 1;
        } else {
            count++;
        }
        
        if (count > maxCount) {
            maxCount = count;
            modes.clear();
            modes.add(node.val);
        } else if (count == maxCount) {
            modes.add(node.val);
        }
        
        prev = node.val;
        
        inorder(node.right);
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
 * @return {number[]}
 */
var findMode = function(root) {
    let maxCount = 0;
    let count = 0;
    let prev = null;
    const modes = [];
    
    const inorder = (node) => {
        if (!node) return;
        
        inorder(node.left);
        
        if (prev === null || node.val !== prev) {
            count = 1;
        } else {
            count++;
        }
        
        if (count > maxCount) {
            maxCount = count;
            modes.length = 0;
            modes.push(node.val);
        } else if (count === maxCount) {
            modes.push(node.val);
        }
        
        prev = node.val;
        
        inorder(node.right);
    };
    
    inorder(root);
    return modes;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - each node visited once |
| **Space** | O(h) - recursion stack, h = height |

---

## Approach 2: Hash Map + Traversal

This approach uses extra space for frequency counting.

### Algorithm Steps

1. Do any tree traversal (inorder, preorder, postorder)
2. Count frequencies using a hash map
3. Find maximum frequency
4. Collect all elements with maximum frequency

### Code Implementation

````carousel
```python
from typing import List, Optional, Dict
from collections import defaultdict

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def findMode_hashmap(self, root: Optional[TreeNode]) -> List[int]:
        """
        Find mode(s) using hash map.
        """
        if not root:
            return []
        
        freq = defaultdict(int)
        
        def traverse(node):
            if not node:
                return
            freq[node.val] += 1
            traverse(node.left)
            traverse(node.right)
        
        traverse(root)
        
        # Find max frequency
        max_freq = max(freq.values())
        
        # Collect all with max frequency
        return [val for val, count in freq.items() if count == max_freq]
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<int> findModeHashMap(TreeNode* root) {
        unordered_map<int, int> freq;
        
        function<void(TreeNode*)> traverse = [&](TreeNode* node) {
            if (!node) return;
            freq[node->val]++;
            traverse(node->left);
            traverse(node->right);
        };
        
        traverse(root);
        
        // Find max frequency
        int maxFreq = 0;
        for (auto& [val, count] : freq) {
            maxFreq = max(maxFreq, count);
        }
        
        // Collect all with max frequency
        vector<int> result;
        for (auto& [val, count] : freq) {
            if (count == maxFreq) {
                result.push_back(val);
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int[] findModeHashMap(TreeNode root) {
        Map<Integer, Integer> freq = new HashMap<>();
        
        traverse(root, freq);
        
        // Find max frequency
        int maxFreq = 0;
        for (int count : freq.values()) {
            maxFreq = Math.max(maxFreq, count);
        }
        
        // Collect all with max frequency
        List<Integer> result = new ArrayList<>();
        for (Map.Entry<Integer, Integer> entry : freq.entrySet()) {
            if (entry.getValue() == maxFreq) {
                result.add(entry.getKey());
            }
        }
        
        return result.stream().mapToInt(Integer::intValue).toArray();
    }
    
    private void traverse(TreeNode node, Map<Integer, Integer> freq) {
        if (node == null) return;
        freq.put(node.val, freq.getOrDefault(node.val, 0) + 1);
        traverse(node.left, freq);
        traverse(node.right, freq);
    }
}
```

<!-- slide -->
```javascript
var findMode = function(root) {
    const freq = {};
    
    const traverse = (node) => {
        if (!node) return;
        freq[node.val] = (freq[node.val] || 0) + 1;
        traverse(node.left);
        traverse(node.right);
    };
    
    traverse(root);
    
    // Find max frequency
    let maxFreq = 0;
    for (const val in freq) {
        maxFreq = Math.max(maxFreq, freq[val]);
    }
    
    // Collect all with max frequency
    const result = [];
    for (const val in freq) {
        if (freq[val] === maxFreq) {
            result.push(parseInt(val));
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - each node visited once |
| **Space** | O(n) - hash map storage |

---

## Approach 3: Morris Traversal (O(1) Space)

This approach uses Morris traversal to achieve O(1) space without recursion.

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
    def findMode_morris(self, root: Optional[TreeNode]) -> List[int]:
        """
        Find mode(s) using Morris traversal (O(1) space).
        """
        if not root:
            return []
        
        max_count = 0
        count = 0
        prev = None
        modes = []
        
        curr = root
        while curr:
            if curr.left:
                # Find inorder predecessor
                pred = curr.left
                while pred.right and pred.right != curr:
                    pred = pred.right
                
                if pred.right is None:
                    pred.right = curr
                    curr = curr.left
                else:
                    # Process current node
                    if prev is None or curr.val != prev:
                        count = 1
                    else:
                        count += 1
                    
                    if count > max_count:
                        max_count = count
                        modes = [curr.val]
                    elif count == max_count:
                        modes.append(curr.val)
                    
                    prev = curr.val
                    pred.right = None
                    curr = curr.right
            else:
                # Process current node
                if prev is None or curr.val != prev:
                    count = 1
                else:
                    count += 1
                
                if count > max_count:
                    max_count = count
                    modes = [curr.val]
                elif count == max_count:
                    modes.append(curr.val)
                
                prev = curr.val
                curr = curr.right
        
        return modes
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<int> findModeMorris(TreeNode* root) {
        if (!root) return {};
        
        int maxCount = 0, count = 0;
        int prev = INT_MIN;
        vector<int> modes;
        
        TreeNode* curr = root;
        while (curr) {
            if (curr->left) {
                TreeNode* pred = curr->left;
                while (pred->right && pred->right != curr) {
                    pred = pred->right;
                }
                
                if (!pred->right) {
                    pred->right = curr;
                    curr = curr->left;
                } else {
                    if (prev == INT_MIN || curr->val != prev) count = 1;
                    else count++;
                    
                    if (count > maxCount) {
                        maxCount = count;
                        modes = {curr->val};
                    } else if (count == maxCount) {
                        modes.push_back(curr->val);
                    }
                    
                    prev = curr->val;
                    pred->right = nullptr;
                    curr = curr->right;
                }
            } else {
                if (prev == INT_MIN || curr->val != prev) count = 1;
                else count++;
                
                if (count > maxCount) {
                    maxCount = count;
                    modes = {curr->val};
                } else if (count == maxCount) {
                    modes.push_back(curr->val);
                }
                
                prev = curr->val;
                curr = curr->right;
            }
        }
        
        return modes;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int[] findModeMorris(TreeNode root) {
        if (root == null) return new int[0];
        
        int maxCount = 0, count = 0;
        Integer prev = null;
        List<Integer> modes = new ArrayList<>();
        
        TreeNode curr = root;
        while (curr != null) {
            if (curr.left != null) {
                TreeNode pred = curr.left;
                while (pred.right != null && pred.right != curr) {
                    pred = pred.right;
                }
                
                if (pred.right == null) {
                    pred.right = curr;
                    curr = curr.left;
                } else {
                    processNode(curr);
                    pred.right = null;
                    curr = curr.right;
                }
            } else {
                processNode(curr);
                curr = curr.right;
            }
        }
        
        return modes.stream().mapToInt(Integer::intValue).toArray();
    }
    
    private void processNode(TreeNode node) {
        if (prev == null || node.val != prev) count = 1;
        else count++;
        
        if (count > maxCount) {
            maxCount = count;
            modes.clear();
            modes.add(node.val);
        } else if (count == maxCount) {
            modes.add(node.val);
        }
        
        prev = node.val;
    }
}
```

<!-- slide -->
```javascript
var findMode = function(root) {
    if (!root) return [];
    
    let maxCount = 0, count = 0;
    let prev = null;
    const modes = [];
    
    let curr = root;
    while (curr) {
        if (curr.left) {
            let pred = curr.left;
            while (pred.right && pred.right !== curr) {
                pred = pred.right;
            }
            
            if (!pred.right) {
                pred.right = curr;
                curr = curr.left;
            } else {
                processNode(curr);
                pred.right = null;
                curr = curr.right;
            }
        } else {
            processNode(curr);
            curr = curr.right;
        }
    }
    
    function processNode(node) {
        if (prev === null || node.val !== prev) count = 1;
        else count++;
        
        if (count > maxCount) {
            maxCount = count;
            modes.length = 0;
            modes.push(node.val);
        } else if (count === maxCount) {
            modes.push(node.val);
        }
        
        prev = node.val;
    }
    
    return modes;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - each node visited at most twice |
| **Space** | O(1) - no recursion, no extra storage |

---

## Comparison of Approaches

| Aspect | Inorder | Hash Map | Morris |
|--------|---------|----------|--------|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(h) | O(n) | O(1) |
| **Follow-up Solved** | ✅ Yes | ❌ No | ✅ Yes |
| **Implementation** | Simple | Simple | Complex |

**Best Approach:** Inorder traversal is simplest and meets the follow-up requirement.

---

## Why Inorder Works for This Problem

The inorder approach works because:

1. **Sorted Order**: Inorder traversal visits nodes in ascending order
2. **Consecutive Duplicates**: Equal values appear consecutively
3. **Efficient Tracking**: Easy to count consecutive occurrences

---

## Related Problems

### Similar Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Validate Binary Search Tree | [Link](https://leetcode.com/problems/validate-binary-search-tree/) | BST property |
| Kth Smallest Element in BST | [Link](https://leetcode.com/problems/kth-smallest-element-in-a-bst/) | Inorder traversal |
| Binary Tree Inorder Traversal | [Link](https://leetcode.com/problems/binary-tree-inorder-traversal/) | Basic inorder |

### Pattern Reference

For more detailed explanations of tree traversals, see:
- **[Tree Traversal Pattern](/patterns/tree-traversal)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Inorder Traversal

- [NeetCode - Find Mode in BST](https://www.youtube.com/watch?v=7C_f7fD2p14) - Clear explanation
- [Binary Search Tree Inorder](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Understanding BST
- [Morris Traversal](https://www.youtube.com/watch?v=0lGNeO7xW7k) - O(1) space

### Related Concepts

- [Tree Traversals](https://www.youtube.com/watch?v=8jP8CCrj8cI) - Inorder, preorder, postorder
- [Morris Traversal](https://www.youtube.com/watch?v=vOS1QSXKq2Y) - Threaded binary tree

---

## Follow-up Questions

### Q1: Why does inorder traversal give sorted order in BST?

**Answer:** In BST, left subtree values are smaller and right subtree values are larger. Inorder (left-root-right) visits left first, then root, then right, producing sorted order.

---

### Q2: How does the follow-up achieve O(1) space?

**Answer:** The follow-up asks to not count recursion stack as extra space. Morris traversal uses threaded binary tree concept to traverse without recursion or stack.

---

### Q3: What if all values are unique?

**Answer:** Each value appears once, so all values are modes (max frequency = 1). Return all values.

---

### Q4: Can you solve without recursion?

**Answer:** Yes, use iterative inorder with explicit stack, or Morris traversal for O(1) space.

---

### Q5: How do you handle large trees?

**Answer:** For very deep trees, use iterative approach or Morris traversal to avoid stack overflow.

---

## Common Pitfalls

### 1. Not Clearing Modes List When Finding New Max
When you find a new maximum count, you must clear the previous modes list. Simply appending without clearing will include stale values.

### 2. Handling Null prev Value
The initial `prev` value needs careful handling. Using `None` in Python, `null` in Java, or checking for first iteration is critical to avoid incorrect comparisons.

### 3. Forgetting to Reset Count
When the current value differs from `prev`, always reset count to 1, not 0.

### 4. Space Complexity Confusion
The follow-up asks for O(1) extra space, but recursion stack O(h) is allowed. For true O(1), use Morris traversal.

### 5. Not Handling All Unique Values
If all values are unique, each appears once, meaning all values are modes. The algorithm handles this correctly but make sure your output includes all nodes.

---

## Summary

The **Find Mode in Binary Search Tree** problem demonstrates **Inorder Traversal** of BST gives sorted order
- Consecutive elements can be counted efficiently
- O(n) time, O(h) space (meets follow-up)

This is an elegant problem that leverages BST properties.

### Pattern Summary

This problem exemplifies the **Inorder Traversal** pattern, which is characterized by:
- Left-root-right processing order
- Sorted output for BST
- Efficient consecutive element tracking

For more details on tree traversals, see the **[Tree Traversal Pattern](/patterns/tree-traversal)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/find-mode-in-binary-search-tree/discuss/) - Community solutions
- [Binary Search Tree - GeeksforGeeks](https://www.geeksforgeeks.org/binary-search-tree/) - BST explanation
- [Morris Traversal](https://www.geeksforgeeks.org/morris-traversal-for-inorder/) - O(1) space
- [Pattern: Tree Traversal](/patterns/tree-traversal) - Comprehensive pattern guide
