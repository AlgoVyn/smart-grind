# Edit Distance

## Problem Description

Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.
You have the following three operations permitted on a word:

- Insert a character
- Delete a character
- Replace a character

**LeetCode Link:** [Edit Distance - LeetCode 72](https://leetcode.com/problems/edit-distance/)

---

## Examples

### Example 1

**Input:**
```python
word1 = "horse", word2 = "ros"
```

**Output:**
```python
3
```

**Explanation:**
```
horse -> rorse (replace 'h' with 'r')
rorse -> rose (remove 'r')
rose -> ros (remove 'e')
```

### Example 2

**Input:**
```python
word1 = "intention", word2 = "execution"
```

**Output:**
```
5
```

**Explanation:**
```
intention -> inention (remove 't')
inention -> enention (replace 'i' with 'e')
enention -> exention (replace 'n' with 'x')
exention -> exection (replace 'n' with 'c')
exection -> execution (insert 'u')
```

---

## Constraints

- `0 <= word1.length, word2.length <= 500`
- `word1 and word2 consist of lowercase English letters.`

---

## Pattern: Dynamic Programming - 2D String

This problem follows the **Dynamic Programming - 2D String** pattern, specifically computing edit distance (Levenshtein distance).

### Core Concept

- **2D DP table**: dp[i][j] = minimum operations to convert word1[0:i] to word2[0:j]
- **Three operations**: Insert, Delete, Replace - choose minimum with +1
- **Base cases**: First row/column represent transformations to/from empty string

### When to Use This Pattern

This pattern is applicable when:
1. String transformation problems with allowed operations
2. Minimum edit distance calculations
3. Problems requiring character-level alignment

---

## Intuition

The key insight is that we can build the solution character by character. For each position in both strings, we decide the minimum operations needed to transform prefixes.

### Key Observations

1. **Recursive Relationship**: To transform word1[0:i] to word2[0:j], consider the last character:
   - If word1[i-1] == word2[j-1]: No new operation needed, dp[i][j] = dp[i-1][j-1]
   - Otherwise, we have three choices:
     - Replace: dp[i-1][j-1] + 1
     - Delete: dp[i-1][j] + 1  
     - Insert: dp[i][j-1] + 1

2. **Base Cases**:
   - Converting to empty string: dp[i][0] = i (delete all i characters)
   - Converting from empty string: dp[0][j] = j (insert all j characters)

3. **Optimal Substructure**: The minimum edit distance for longer strings depends on shorter strings.

### Algorithm Overview

1. Create a 2D DP table of size (m+1) × (n+1)
2. Initialize first row and column with base cases
3. Fill the table using the recurrence relation
4. Return dp[m][n]

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **2D DP Table** - Standard solution
2. **Space-Optimized 1D DP** - Alternative approach

---

## Approach 1: 2D DP Table (Optimal)

### Algorithm Steps

1. Initialize dp table with dimensions (len(word1)+1) × (len(word2)+1)
2. Fill base cases: first row (0 to n) and first column (0 to m)
3. For each cell (i, j):
   - If characters match: take diagonal value
   - Otherwise: take minimum of three neighbors + 1
4. Return bottom-right cell

### Why It Works

The 2D DP table captures all possible transformations by considering every prefix combination. The recurrence ensures we always choose the minimum operations needed.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        """
        Find minimum edit distance using 2D DP.
        
        Time Complexity: O(m * n)
        Space Complexity: O(m * n)
        
        Args:
            word1: Source string
            word2: Target string
            
        Returns:
            Minimum number of operations
        """
        m, n = len(word1), len(word2)
        
        # Create DP table
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        
        # Base cases: transformations to/from empty string
        for i in range(m + 1):
            dp[i][0] = i  # Delete all i characters
        for j in range(n + 1):
            dp[0][j] = j  # Insert all j characters
        
        # Fill the DP table
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if word1[i-1] == word2[j-1]:
                    # Characters match, no operation needed
                    dp[i][j] = dp[i-1][j-1]
                else:
                    # Take minimum of replace, delete, insert
                    dp[i][j] = min(
                        dp[i-1][j-1],  # Replace
                        dp[i-1][j],    # Delete
                        dp[i][j-1]     # Insert
                    ) + 1
        
        return dp[m][n]
```

<!-- slide -->
```cpp
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int minDistance(string word1, string word2) {
        int m = word1.length();
        int n = word2.length();
        
        // Create DP table
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
        
        // Base cases
        for (int i = 0; i <= m; i++) {
            dp[i][0] = i;
        }
        for (int j = 0; j <= n; j++) {
            dp[0][j] = j;
        }
        
        // Fill the DP table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1[i-1] == word2[j-1]) {
                    dp[i][j] = dp[i-1][j-1];
                } else {
                    dp[i][j] = min({
                        dp[i-1][j-1],  // Replace
                        dp[i-1][j],    // Delete
                        dp[i][j-1]     // Insert
                    }) + 1;
                }
            }
        }
        
        return dp[m][n];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minDistance(String word1, String word2) {
        int m = word1.length();
        int n = word2.length();
        
        // Create DP table
        int[][] dp = new int[m + 1][n + 1];
        
        // Base cases
        for (int i = 0; i <= m; i++) {
            dp[i][0] = i;
        }
        for (int j = 0; j <= n; j++) {
            dp[0][j] = j;
        }
        
        // Fill the DP table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i-1) == word2.charAt(j-1)) {
                    dp[i][j] = dp[i-1][j-1];
                } else {
                    dp[i][j] = Math.min(Math.min(
                        dp[i-1][j-1],  // Replace
                        dp[i-1][j]),    // Delete
                        dp[i][j-1])     // Insert
                    + 1;
                }
            }
        }
        
        return dp[m][n];
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
var minDistance = function(word1, word2) {
    const m = word1.length;
    const n = word2.length;
    
    // Create DP table
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    // Base cases
    for (let i = 0; i <= m; i++) {
        dp[i][0] = i;
    }
    for (let j = 0; j <= n; j++) {
        dp[0][j] = j;
    }
    
    // Fill the DP table
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i-1] === word2[j-1]) {
                dp[i][j] = dp[i-1][j-1];
            } else {
                dp[i][j] = Math.min(
                    dp[i-1][j-1],  // Replace
                    dp[i-1][j],    // Delete
                    dp[i][j-1]     // Insert
                ) + 1;
            }
        }
    }
    
    return dp[m][n];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m × n) where m, n are lengths of word1 and word2 |
| **Space** | O(m × n) for the DP table |

---

## Approach 2: Space-Optimized 1D DP

### Algorithm Steps

1. Use a 1D array instead of 2D
2. Keep track of previous row values
3. Update in place with careful ordering

### Why It Works

We only need the current row and previous row to compute the next row, so we can reduce space.

### Code Implementation

````carousel
```python
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        m, n = len(word1), len(word2)
        
        # Space-optimized: only keep one row
        dp = list(range(n + 1))
        
        for i in range(1, m + 1):
            prev = dp[0]
            dp[0] = i
            for j in range(1, n + 1):
                temp = dp[j]
                if word1[i-1] == word2[j-1]:
                    dp[j] = prev
                else:
                    dp[j] = min(prev, dp[j], dp[j-1]) + 1
                prev = temp
        
        return dp[n]
```

<!-- slide -->
```cpp
class Solution {
public:
    int minDistance(string word1, string word2) {
        int m = word1.length(), n = word2.length();
        vector<int> dp(n + 1);
        
        for (int j = 0; j <= n; j++) dp[j] = j;
        
        for (int i = 1; i <= m; i++) {
            int prev = dp[0];
            dp[0] = i;
            for (int j = 1; j <= n; j++) {
                int temp = dp[j];
                if (word1[i-1] == word2[j-1]) {
                    dp[j] = prev;
                } else {
                    dp[j] = min({prev, dp[j], dp[j-1]}) + 1;
                }
                prev = temp;
            }
        }
        return dp[n];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minDistance(String word1, String word2) {
        int m = word1.length(), n = word2.length();
        int[] dp = new int[n + 1];
        
        for (int j = 0; j <= n; j++) dp[j] = j;
        
        for (int i = 1; i <= m; i++) {
            int prev = dp[0];
            dp[0] = i;
            for (int j = 1; j <= n; j++) {
                int temp = dp[j];
                if (word1.charAt(i-1) == word2.charAt(j-1)) {
                    dp[j] = prev;
                } else {
                    dp[j] = Math.min(Math.min(prev, dp[j]), dp[j-1]) + 1;
                }
                prev = temp;
            }
        }
        return dp[n];
    }
}
```

<!-- slide -->
```javascript
var minDistance = function(word1, word2) {
    const m = word1.length, n = word2.length;
    let dp = Array.from({length: n + 1}, (_, j) => j);
    
    for (let i = 1; i <= m; i++) {
        let prev = dp[0];
        dp[0] = i;
        for (let j = 1; j <= n; j++) {
            let temp = dp[j];
            if (word1[i-1] === word2[j-1]) {
                dp[j] = prev;
            } else {
                dp[j] = Math.min(prev, dp[j], dp[j-1]) + 1;
            }
            prev = temp;
        }
    }
    return dp[n];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m × n) |
| **Space** | O(n) |

---

## Comparison of Approaches

| Aspect | 2D DP | 1D DP |
|--------|-------|--------|
| **Time Complexity** | O(m × n) | O(m × n) |
| **Space Complexity** | O(m × n) | O(n) |
| **Implementation** | Simple | Moderate |
| **LeetCode Optimal** | ✅ | ✅ |

---

## Common Pitfalls

### 1. Off-by-one errors in DP indexing
**Issue:** Using wrong indices for accessing characters leads to incorrect results.

**Solution:** Remember dp[i][j] corresponds to first i chars of word1 and first j chars of word2, so access word1[i-1] and word2[j-1].

### 2. Confusing operations
**Issue:** Mixing up insert, delete, and replace operations.

**Solution:** dp[i-1][j] = delete (remove from word1), dp[i][j-1] = insert (add to word1), dp[i-1][j-1] = replace (if different).

### 3. Not initializing base cases
**Issue:** Forgetting first row/column leads to incorrect calculations.

**Solution:** Initialize dp[i][0] = i and dp[0][j] = j for base cases.

### 4. Using wrong space optimization
**Issue:** Trying 1D DP incorrectly loses necessary information.

**Solution:** For edit distance, use 2D DP; 1D version requires careful handling with extra array.

### 5. Not handling empty strings
**Issue:** Code may fail for empty strings.

**Solution:** Base cases handle this: dp[m][0] = m (delete all), dp[0][n] = n (insert all).

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Very commonly asked in technical interviews
- **Companies**: Google, Amazon, Meta, Microsoft, Apple
- **Difficulty**: Hard
- **Concepts Tested**: Dynamic Programming, String Manipulation

### Learning Outcomes

1. **2D DP Mastery**: Understanding how to build DP tables for string problems
2. **State Transitions**: Learning complex state transition logic
3. **Space Optimization**: Reducing space from O(mn) to O(n)

---

## Related Problems

### Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Delete Operation for Two Strings | [Link](https://leetcode.com/problems/delete-operation-for-two-strings/) | Similar to edit distance |
| Minimum ASCII Delete Sum | [Link](https://leetcode.com/problems/minimum-ascii-delete-sum/) | Weighted edit distance |
| One Edit Distance | [Link](https://leetcode.com/problems/one-edit-distance/) | Check if one edit away |
| Wildcard Matching | [Link](https://leetcode.com/problems/wildcard-matching/) | Pattern matching |

### Pattern Reference

For more detailed explanations of DP patterns, see:
- **[Dynamic Programming](/patterns/dp)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials:

1. **[NeetCode - Edit Distance](https://www.youtube.com/watch?v=)** - Clear explanation
2. **[Dynamic Programming Tutorial](https://www.youtube.com/watch?v=)** - DP fundamentals
3. **[Edit Distance Explained](https://www.youtube.com/watch?v=)** - Detailed walkthrough

---

## Follow-up Questions

### Q1: How would you reconstruct the actual sequence of operations?

**Answer:** Keep track of which operation was chosen at each cell, then backtrack from dp[m][n] to dp[0][0].

### Q2: How would you modify for weighted operations (different costs for insert/delete/replace)?

**Answer:** Instead of adding 1, add the specific cost of each operation in the min calculation.

### Q3: What if you could also swap adjacent characters?

**Answer:** Add a new operation for transposition, requiring checking dp[i-2][j-2] when word1[i-2]==word2[j-1] and word1[i-1]==word2[j-2].

---

## Summary

The **Edit Distance** problem demonstrates **2D Dynamic Programming** for string transformation:

- **DP Table**: dp[i][j] represents minimum operations to transform prefixes
- **Three Operations**: Insert, Delete, Replace
- **Optimal Substructure**: Solution builds from smaller subproblems

Key takeaways:
1. Build DP table bottom-up
2. Handle base cases for empty strings
3. Choose minimum of three operations + 1 when characters don't match
4. Consider space optimization for large strings

This problem is essential for understanding DP with strings and forms the foundation for many string transformation problems.

### Pattern Summary

This problem exemplifies the **2D DP for String** pattern, characterized by:
- Building a 2D table for string prefix transformations
- Handling multiple operations (insert, delete, replace)
- Base cases for empty string transformations

For more details on this pattern, see the **[Dynamic Programming Pattern](/patterns/dp)**.

---

## Additional Resources

- [LeetCode Problem 72](https://leetcode.com/problems/edit-distance/) - Official problem page
- [Levenshtein Distance - Wikipedia](https://en.wikipedia.org/wiki/Levenshtein_distance) - Distance concept
- [DP Patterns](/patterns/dp) - Comprehensive guide
