# Unique Binary Search Trees II

## Problem Description

Given an integer `n`, return all the structurally unique BST's (binary search trees) which has exactly `n` nodes of unique values from `1` to `n`. Return the answer in any order.

**LeetCode Link:** [Unique Binary Search Trees II](https://leetcode.com/problems/unique-binary-search-trees-ii/)

---

## Examples

**Example 1:**

Input:
```python
n = 3
```

Output:
```python
[[1,null,2,null,3],[1,null,3,2],[2,1,3],[3,1,null,null,2],[3,2,null,1]]
```

**Example 2:**

Input:
```python
n = 1
```

Output:
```python
[[1]]
```

---

## Constraints

- `1 <= n <= 8`

---

## Pattern: Recursive Tree Generation (Catalan Number)

This problem uses **recursion** to generate all unique BSTs. For each possible root value, we recursively generate all possible left and right subtrees, then combine each pair to form complete trees. This generates a number of trees equal to the nth Catalan number.

### Core Concept

- **BST Property**: Left subtree contains values less than root, right subtree contains values greater than root
- **Catalan Number**: Number of unique BSTs with n nodes = C(2n, n) / (n+1)
- **Recursive Combination**: For each root, combine all left subtrees with all right subtrees

---

## Intuition

The key insight for this problem is understanding how BSTs are structured and how we can systematically generate all unique configurations:

1. **Root Selection**: For any range [start, end], each value can be the root:
   - If root = i, then left subtree contains values [start, i-1]
   - And right subtree contains values [i+1, end]

2. **Subproblem Decomposition**: 
   - The problem of generating BSTs for n nodes breaks down into generating BSTs for smaller ranges
   - This is a classic divide-and-conquer approach

3. **Cartesian Product of Subtrees**:
   - For a fixed root, we need ALL combinations of left subtrees × right subtrees
   - This is like taking the Cartesian product of two sets

4. **Base Case**:
   - When start > end, there's one valid subtree: the empty tree (represented as None)
   - This is crucial for the recursion to work properly

5. **Why n <= 8?**: 
   - The number of trees grows as the Catalan number C(n)
   - C(8) = 1430, which is manageable
   - C(9) = 4862, which would be too large for most interviews

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Recursive Generation** - Standard DFS approach
2. **Dynamic Programming** - Memoization approach

---

## Approach 1: Recursive Generation (Standard)

### Algorithm Steps

1. Define a recursive function `generate(start, end)` that returns all BSTs for values in [start, end]
2. Base case: if start > end, return [None] (empty tree)
3. For each possible root value i from start to end:
   a. Recursively generate all left subtrees: generate(start, i-1)
   b. Recursively generate all right subtrees: generate(i+1, end)
   c. For each left subtree and each right subtree:
      - Create a new root with value i
      - Attach left and right subtrees
      - Add to result list
4. Return the result list
5. Handle edge case n == 0 by returning empty list

### Why It Works

The algorithm systematically explores all possible BST configurations by:
- Trying every possible root value
- For each root, combining all valid left and right subtree configurations
- This ensures we generate ALL unique BSTs exactly once

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
    def generateTrees(self, n: int) -> List[Optional[TreeNode]]:
        def generate(start: int, end: int) -> List[Optional[TreeNode]]:
            if start > end:
                return [None]  # Empty subtree
            
            result = []
            for i in range(start, end + 1):
                # Generate all left and right subtrees
                left_trees = generate(start, i - 1)
                right_trees = generate(i + 1, end)
                
                # Combine each left with each right
                for left in left_trees:
                    for right in right_trees:
                        root = TreeNode(i)
                        root.left = left
                        root.right = right
                        result.append(root)
            
            return result
        
        if n == 0:
            return []
        return generate(1, n)
```

<!-- slide -->
```cpp
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
    vector<TreeNode*> generateTrees(int n) {
        if (n == 0) return {};
        return generate(1, n);
    }
    
private:
    vector<TreeNode*> generate(int start, int end) {
        if (start > end) {
            vector<TreeNode*> v = {nullptr};
            return v;
        }
        
        vector<TreeNode*> result;
        for (int i = start; i <= end; i++) {
            vector<TreeNode*> leftTrees = generate(start, i - 1);
            vector<TreeNode*> rightTrees = generate(i + 1, end);
            
            for (auto left : leftTrees) {
                for (auto right : rightTrees) {
                    TreeNode* root = new TreeNode(i);
                    root->left = left;
                    root->right = right;
                    result.push_back(root);
                }
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
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

class Solution {
    public List<TreeNode> generateTrees(int n) {
        if (n == 0) return new ArrayList<>();
        return generate(1, n);
    }
    
    private List<TreeNode> generate(int start, int end) {
        List<TreeNode> result = new ArrayList<>();
        
        if (start > end) {
            result.add(null);
            return result;
        }
        
        for (int i = start; i <= end; i++) {
            List<TreeNode> leftTrees = generate(start, i - 1);
            List<TreeNode> rightTrees = generate(i + 1, end);
            
            for (TreeNode left : leftTrees) {
                for (TreeNode right : rightTrees) {
                    TreeNode root = new TreeNode(i, left, right);
                    result.add(root);
                }
            }
        }
        
        return result;
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
 * @param {number} n
 * @return {TreeNode[]}
 */
var generateTrees = function(n) {
    if (n === 0) return [];
    
    function generate(start, end) {
        if (start > end) {
            return [null];
        }
        
        const result = [];
        for (let i = start; i <= end; i++) {
            const leftTrees = generate(start, i - 1);
            const rightTrees = generate(i + 1, end);
            
            for (const left of leftTrees) {
                for (const right of rightTrees) {
                    const root = new TreeNode(i, left, right);
                    result.push(root);
                }
            }
        }
        
        return result;
    }
    
    return generate(1, n);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(4^n / √n) - generates Catalan(n) trees, each taking O(n) to construct |
| **Space** | O(4^n / √n) - storing all generated trees |

---

## Approach 2: Dynamic Programming with Memoization

### Algorithm Steps

1. Use a memoization dictionary to cache results for each (start, end) pair
2. Same recursive structure as Approach 1, but check cache first
3. This avoids recomputing subproblems

### Why It Works

Many subproblems are repeated when generating trees for nearby ranges. Memoization avoids redundant computation.

### Code Implementation

````carousel
```python
from typing import List, Optional
from functools import lru_cache

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def generateTrees(self, n: int) -> List[Optional[TreeNode]]:
        @lru_cache(maxsize=None)
        def generate(start: int, end: int):
            if start > end:
                return [None]
            
            result = []
            for i in range(start, end + 1):
                left_trees = generate(start, i - 1)
                right_trees = generate(i + 1, end)
                
                for left in left_trees:
                    for right in right_trees:
                        root = TreeNode(i)
                        root.left = left
                        root.right = right
                        result.append(root)
            
            return result
        
        if n == 0:
            return []
        return generate(1, n)
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
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
    vector<TreeNode*> generateTrees(int n) {
        if (n == 0) return {};
        return generate(1, n);
    }
    
private:
    unordered_map<int, vector<TreeNode*>> memo;
    
    vector<TreeNode*> generate(int start, int end) {
        int key = start * 20 + end;  // Simple key encoding
        if (memo.find(key) != memo.end()) {
            return memo[key];
        }
        
        if (start > end) {
            return memo[key] = {nullptr};
        }
        
        vector<TreeNode*> result;
        for (int i = start; i <= end; i++) {
            vector<TreeNode*> leftTrees = generate(start, i - 1);
            vector<TreeNode*> rightTrees = generate(i + 1, end);
            
            for (auto left : leftTrees) {
                for (auto right : rightTrees) {
                    TreeNode* root = new TreeNode(i);
                    root->left = left;
                    root->right = right;
                    result.push_back(root);
                }
            }
        }
        
        return memo[key] = result;
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
    Map<String, List<TreeNode>> memo = new HashMap<>();
    
    public List<TreeNode> generateTrees(int n) {
        if (n == 0) return new ArrayList<>();
        return generate(1, n);
    }
    
    private String getKey(int start, int end) {
        return start + "," + end;
    }
    
    private List<TreeNode> generate(int start, int end) {
        String key = getKey(start, end);
        if (memo.containsKey(key)) {
            return memo.get(key);
        }
        
        List<TreeNode> result = new ArrayList<>();
        
        if (start > end) {
            result.add(null);
            memo.put(key, result);
            return result;
        }
        
        for (int i = start; i <= end; i++) {
            List<TreeNode> leftTrees = generate(start, i - 1);
            List<TreeNode> rightTrees = generate(i + 1, end);
            
            for (TreeNode left : leftTrees) {
                for (TreeNode right : rightTrees) {
                    TreeNode root = new TreeNode(i, left, right);
                    result.add(root);
                }
            }
        }
        
        memo.put(key, result);
        return result;
    }
}
```

<!-- slide -->
```javascript
var generateTrees = function(n) {
    if (n === 0) return [];
    
    const memo = new Map();
    
    function getKey(start, end) {
        return `${start},${end}`;
    }
    
    function generate(start, end) {
        const key = getKey(start, end);
        if (memo.has(key)) {
            return memo.get(key);
        }
        
        const result = [];
        if (start > end) {
            result.push(null);
            memo.set(key, result);
            return result;
        }
        
        for (let i = start; i <= end; i++) {
            const leftTrees = generate(start, i - 1);
            const rightTrees = generate(i + 1, end);
            
            for (const left of leftTrees) {
                for (const right of rightTrees) {
                    const root = new TreeNode(i, left, right);
                    result.push(root);
                }
            }
        }
        
        memo.set(key, result);
        return result;
    }
    
    return generate(1, n);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(4^n / √n) - still generates same number of trees |
| **Space** | O(4^n / √n) + O(n) for memoization |

---

## Comparison of Approaches

| Aspect | Recursive | DP with Memoization |
|--------|-----------|---------------------|
| **Time Complexity** | O(4^n / √n) | O(4^n / √n) |
| **Space Complexity** | O(4^n / √n) | O(4^n / √n) + O(n) |
| **Implementation** | Simple | Moderate |
| **LeetCode Optimal** | ✅ | ✅ |
| **Difficulty** | Medium | Medium |

**Best Approach:** Either approach works; recursive is simpler, DP saves some redundant computation.

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Unique Binary Search Trees | [Link](https://leetcode.com/problems/unique-binary-search-trees/) | Count number of BSTs (Catalan number) |
| Validate Binary Search Tree | [Link](https://leetcode.com/problems/validate-binary-search-tree/) | Check if tree is valid BST |
| Convert Sorted Array to BST | [Link](https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/) | Build balanced BST |

---

## Video Tutorial Links

1. **[NeetCode - Unique Binary Search Trees II](https://www.youtube.com/watch?v=EXAMPLE)** - Clear explanation
2. **[Catalan Numbers Explained](https://www.youtube.com/watch?v=EXAMPLE)** - Mathematical background

---

## Follow-up Questions

### Q1: How many unique BSTs can be formed with n nodes?

**Answer:** The number is the nth Catalan number: C(2n, n) / (n+1). For n=3, it's 5; for n=8, it's 1430.

---

### Q2: How would you modify to count the number of trees instead of generating them?

**Answer:** Use dynamic programming: dp[n] = sum(dp[i] * dp[n-1-i]) for i in 0 to n-1. This is O(n²) time.

---

### Q3: Can you generate trees with specific height constraints?

**Answer:** Yes, modify the recursive function to track height and only add subtrees that satisfy the height constraint.

---

## Common Pitfalls

### 1. Base Case Returns Wrong Value
**Issue**: Returning empty list instead of [None] for start > end.

**Solution**: Return [None] to represent empty subtree, which is a valid BST.

### 2. Memory Leaks
**Issue**: Creating too many TreeNode objects in C++/Java.

**Solution**: Properly manage memory or use smart pointers.

### 3. Not Handling n=0
**Issue**: Function crashes for n=0.

**Solution**: Handle edge case and return empty list.

### 4. Deep Recursion
**Issue**: Stack overflow for large n.

**Solution:** n is limited to 8, so recursion depth is manageable.

---

## Summary

The **Unique Binary Search Trees II** problem demonstrates:
- **Recursive tree generation**: Systematically building all possible BSTs
- **Cartesian product**: Combining left and right subtree possibilities
- **Catalan numbers**: Mathematical foundation for counting BSTs
- **Divide and conquer**: Breaking problem into smaller subproblems

Key takeaways:
1. For each root value, combine all left subtrees × all right subtrees
2. Base case: return [None] for empty subtree
3. Number of trees grows as Catalan number: C(2n, n) / (n+1)
4. Use memoization to avoid redundant computation

This problem is essential for understanding recursive tree problems and combinatorial generation.

---

### Pattern Summary

This problem exemplifies the **Recursive Tree Generation** pattern, characterized by:
- Generating all possible tree configurations
- Recursive combination of subproblems
- Cartesian product of left and right choices
- Catalan number growth complexity

For more details on this pattern, see the **[Tree Recursion Pattern](/patterns/tree-recursion)**.
