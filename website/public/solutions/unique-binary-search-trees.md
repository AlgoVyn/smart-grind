# Unique Binary Search Trees

## Problem Description

Given an integer `n`, return the number of structurally unique BST's (binary search trees) which has exactly `n` nodes of unique values from `1` to `n`.

Return the number of different binary search trees that can be formed with `n` nodes.

**Link to problem:** [Unique Binary Search Trees - LeetCode 96](https://leetcode.com/problems/unique-binary-search-trees/)

---

## Pattern: Dynamic Programming - Catalan Numbers

This problem is a classic example of the **Catalan Number** pattern in dynamic programming. The number of unique BSTs for `n` nodes follows the Catalan number sequence.

### Core Concept

The fundamental idea is using the optimal substructure of BSTs:
- For each root value `i` (1 ≤ i ≤ n):
  - Left subtree has `i-1` nodes (values 1 to i-1)
  - Right subtree has `n-i` nodes (values i+1 to n)
- Number of unique BSTs = Σ (left_count × right_count) for all i

---

## Examples

### Example

**Input:**
```
n = 3
```

**Output:**
```
5
```

**Explanation:** There are 5 unique BSTs with 3 nodes:
- 1 as root, 2,3 on right
- 2 as root, 1 on left, 3 on right
- 3 as root, 1,2 on left
- 1 as root, null left, 2 as root of right (with 3)
- 1 as root, null left, null right (2 has 3)

### Example 2

**Input:**
```
n = 1
```

**Output:**
```
1
```

### Example 3

**Input:**
```
n = 2
```

**Output:**
```
2
```

---

## Constraints

- `1 <= n <= 19`
- The answer will fit in a 32-bit integer

---

## Intuition

The key insight is that the number of unique BSTs follows the Catalan number pattern:
- `dp[0] = 1` (empty tree)
- `dp[1] = 1` (single node)
- `dp[n] = Σ(dp[i-1] * dp[n-i])` for i from 1 to n

This is because for each root choice, the number of possible BSTs is the product of left and right subtree possibilities.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Dynamic Programming** - O(n²) time, O(n) space
2. **Mathematical Formula (Catalan)** - O(n) time, O(1) space

---

## Approach 1: Dynamic Programming

### Algorithm Steps

1. Initialize dp array where `dp[i]` represents number of BSTs with `i` nodes
2. Base cases: `dp[0] = 1` (empty tree), `dp[1] = 1` (single node)
3. For each `i` from 2 to n:
   - For each root position `j` from 1 to i:
     - `dp[i] += dp[j-1] * dp[i-j]`
4. Return `dp[n]`

### Why It Works

The recurrence relation `dp[n] = Σ(dp[left] * dp[right])` captures all possible BST configurations. For each root choice, we multiply the number of possible left subtrees by the number of possible right subtrees.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def numTrees(self, n: int) -> int:
        """
        Calculate number of unique BSTs with n nodes.
        
        Args:
            n: Number of nodes in the BST
            
        Returns:
            Number of unique BSTs possible
        """
        if n <= 1:
            return 1
        
        dp = [0] * (n + 1)
        dp[0] = 1  # Empty tree
        dp[1] = 1  # Single node
        
        for i in range(2, n + 1):
            for j in range(1, i + 1):
                dp[i] += dp[j - 1] * dp[i - j]
        
        return dp[n]
```

<!-- slide -->
```cpp
class Solution {
public:
    int numTrees(int n) {
        /**
         * Calculate number of unique BSTs with n nodes.
         * 
         * Args:
         *     n: Number of nodes in the BST
         * 
         * Returns:
         *     Number of unique BSTs possible
         */
        if (n <= 1) return 1;
        
        vector<int> dp(n + 1, 0);
        dp[0] = 1;  // Empty tree
        dp[1] = 1;  // Single node
        
        for (int i = 2; i <= n; i++) {
            for (int j = 1; j <= i; j++) {
                dp[i] += dp[j - 1] * dp[i - j];
            }
        }
        
        return dp[n];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int numTrees(int n) {
        /**
         * Calculate number of unique BSTs with n nodes.
         * 
         * Args:
         *     n: Number of nodes in the BST
         * 
         * Returns:
         *     Number of unique BSTs possible
         */
        if (n <= 1) return 1;
        
        int[] dp = new int[n + 1];
        dp[0] = 1;  // Empty tree
        dp[1] = 1;  // Single node
        
        for (int i = 2; i <= n; i++) {
            for (int j = 1; j <= i; j++) {
                dp[i] += dp[j - 1] * dp[i - j];
            }
        }
        
        return dp[n];
    }
}
```

<!-- slide -->
```javascript
/**
 * Calculate number of unique BSTs with n nodes.
 * 
 * @param {number} n - Number of nodes in the BST
 * @return {number} - Number of unique BSTs possible
 */
var numTrees = function(n) {
    if (n <= 1) return 1;
    
    const dp = new Array(n + 1).fill(0);
    dp[0] = 1;  // Empty tree
    dp[1] = 1;  // Single node
    
    for (let i = 2; i <= n; i++) {
        for (let j = 1; j <= i; j++) {
            dp[i] += dp[j - 1] * dp[i - j];
        }
    }
    
    return dp[n];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - Two nested loops |
| **Space** | O(n) - DP array of size n+1 |

---

## Approach 2: Mathematical Formula (Catalan Number)

### Algorithm Steps

1. Use the direct Catalan number formula: C(n) = (2n)! / ((n+1)! × n!)
2. Use iterative multiplication to avoid overflow and handle large n
3. Return the result

### Why It Works

The number of unique BSTs with n nodes is the nth Catalan number, which can be computed directly using the mathematical formula.

### Code Implementation

````carousel
```python
class Solution:
    def numTrees_catalan(self, n: int) -> int:
        """
        Calculate number of unique BSTs using Catalan formula.
        
        Args:
            n: Number of nodes in the BST
            
        Returns:
            Number of unique BSTs possible
        """
        # Catalan number: C(n) = (2n)! / ((n+1)! * n!)
        result = 1
        for i in range(1, n + 1):
            result = result * 2 * (2 * i - 1) // (i + 1)
        return result
```

<!-- slide -->
```cpp
class Solution {
public:
    int numTrees(int n) {
        /**
         * Calculate number of unique BSTs using Catalan formula.
         * 
         * Args:
         *     n: Number of nodes in the BST
         * 
         * Returns:
         *     Number of unique BSTs possible
         */
        long long result = 1;
        for (int i = 1; i <= n; i++) {
            result = result * 2 * (2 * i - 1) / (i + 1);
        }
        return (int)result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int numTrees(int n) {
        /**
         * Calculate number of unique BSTs using Catalan formula.
         * 
         * Args:
         *     n: Number of nodes in the BST
         * 
         * Returns:
         *     Number of unique BSTs possible
         */
        long result = 1;
        for (int i = 1; i <= n; i++) {
            result = result * 2 * (2 * i - 1) / (i + 1);
        }
        return (int)result;
    }
}
```

<!-- slide -->
```javascript
/**
 * Calculate number of unique BSTs using Catalan formula.
 * 
 * @param {number} n - Number of nodes in the BST
 * @return {number} - Number of unique BSTs possible
 */
var numTrees = function(n) {
    let result = 1;
    for (let i = 1; i <= n; i++) {
        result = result * 2 * (2 * i - 1) / (i + 1);
    }
    return Math.floor(result);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single loop |
| **Space** | O(1) - Only variable storage |

---

## Comparison of Approaches

| Aspect | Dynamic Programming | Mathematical Formula |
|--------|---------------------|---------------------|
| **Time** | O(n²) | O(n) |
| **Space** | O(n) | O(1) |
| **Implementation** | Intuitive DP | Direct formula |
| **Best For** | Learning DP | Production use |

**Best Approach:** The DP approach is easier to understand conceptually, while the mathematical formula is more efficient for large n.

---

## Related Problems

Based on similar themes (BST construction, dynamic programming, Catalan numbers):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Unique Binary Search Trees II | [Link](https://leetcode.com/problems/unique-binary-search-trees-ii/) | Generate all unique BSTs |
| Validate Binary Search Tree | [Link](https://leetcode.com/problems/validate-binary-search-tree/) | BST validation |
| Convert Sorted Array to BST | [Link](https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/) | BST construction |
| Balanced Binary Tree | [Link](https://leetcode.com/problems/balanced-binary-tree/) | Tree balance check |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Dynamic Programming Approach

- [NeetCode - Unique Binary Search Trees](https://www.youtube.com/watch?v=OXBZC2mykT4) - Clear explanation with visual examples
- [Back to Back SWE - Unique Binary Search Trees](https://www.youtube.com/watch?v=41Ib1R1JOv0) - Detailed walkthrough

### Catalan Numbers

- [Catalan Number Explained](https://www.youtube.com/watch?v=ZC-8iYqn4Tk) - Understanding Catalan numbers
- [Mathematical Solution](https://www.youtube.com/watch?v=o9iR92iOM3I) - Direct formula approach

---

## Follow-up Questions

### Q1: What is the relationship between this problem and Catalan numbers?

**Answer:** The number of unique BSTs with n nodes is exactly the nth Catalan number. The Catalan sequence: 1, 1, 2, 5, 14, 42, 132, ... corresponds to n = 0, 1, 2, 3, 4, 5, 6, ...

---

### Q2: How would you generate all unique BSTs (not just count them)?

**Answer:** Use recursion to generate all possible left and right subtrees, then combine them. For each root i, generate all combinations of left subtrees (from values 1 to i-1) and right subtrees (from values i+1 to n), and construct trees by pairing each left with each right.

---

### Q3: What is the time complexity of generating all unique BSTs?

**Answer:** The time complexity is O(C(n) × n) where C(n) is the nth Catalan number (the number of trees), since we need to construct each tree which takes O(n) time. The number of trees grows exponentially (approximately 4^n / (n^(3/2))).

---

### Q4: How would you modify the solution for a specific node value set?

**Answer:** The solution doesn't depend on actual node values, only on the count of nodes. Any set of n distinct values will produce the same number of unique BST structures. The values just need to be inserted in BST order.

---

### Q5: Can this be solved using recursion without DP?

**Answer:** Yes, but it would be very inefficient due to repeated calculations. A naive recursive solution would have O(2^n) time complexity because it recalculates the same subproblems multiple times. Memoization or bottom-up DP is essential.

---

### Q6: What is the maximum n that can be handled?

**Answer:** Since n ≤ 19 per constraints, the result fits in a 32-bit integer. For n = 19, the answer is 1767263190. For larger n, you would need big integer support.

---

### Q7: How does this problem relate to other combinatorial problems?

**Answer:** Catalan numbers appear in many other counting problems: number of ways to parenthesize n+1 factors, number of non-crossing partitions, number of monotonic paths, etc. This problem is one of the most common applications.

---

### Q8: What edge cases should be tested?

**Answer:**
- n = 0 (though not in constraints, dp[0] = 1)
- n = 1 (single tree)
- n = 2 (two trees)
- n = 19 (maximum within 32-bit)

---

## Common Pitfalls

### 1. Off-by-One Errors
**Issue:** Incorrect indexing in the DP recurrence.

**Solution:** Remember dp[0] = 1 (empty tree), dp[1] = 1 (single node). The recurrence uses dp[i-1] × dp[n-i].

### 2. Integer Overflow
**Issue:** For larger n, intermediate results can overflow.

**Solution:** Use long long in C++/Java or handle carefully in Python (automatically handles big integers).

### 3. Not Understanding the Recurrence
**Issue:** Confusing about why dp[i-1] × dp[n-i].

**Solution:** For root at position j, left subtree has j-1 nodes and right subtree has n-j nodes.

---

## Summary

The **Unique Binary Search Trees** problem demonstrates the power of dynamic programming and Catalan numbers:

- **DP approach**: dp[n] = Σ(dp[i-1] × dp[n-i]), O(n²) time
- **Mathematical formula**: Direct Catalan number computation, O(n) time
- **Key insight**: The problem is a classic application of Catalan numbers
- **Applications**: Tree enumeration, parenthesization, and many other combinatorial problems

This problem is fundamental for understanding how dynamic programming can solve counting problems with optimal substructure.

For more details on this pattern, see the **[Dynamic Programming - Catalan Numbers](/algorithms/dynamic-programming/catalan-numbers)**.
