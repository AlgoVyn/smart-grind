# Delete Operation For Two Strings

## Problem Description

Given two strings word1 and word2, return the minimum number of steps required to make word1 and word2 the same.
In one step, you can delete exactly one character in either string.

**LeetCode Link:** [Delete Operation for Two Strings - LeetCode 583](https://leetcode.com/problems/delete-operation-for-two-strings/)

---

## Examples

### Example 1:

**Input:**
```python
word1 = "sea", word2 = "eat"
```

**Output:**
```python
2
```

**Explanation:**
You need one step to make "sea" to "ea" and another step to make "eat" to "ea".

### Example 2:

**Input:**
```python
word1 = "leetcode", word2 = "etco"
```

**Output:**
```python
4
```

---

## Constraints

- `1 <= word1.length, word2.length <= 500`
- `word1 and word2 consist of only lowercase English letters.`

---

## Pattern: Dynamic Programming - Longest Common Subsequence (LCS)

This problem follows the **Dynamic Programming - Longest Common Subsequence (LCS)** pattern, specifically using LCS to solve string deletion problems.

### Core Concept

- **LCS relationship**: Minimum deletions = m + n - 2*LCS
- **Keep what matches**: Characters in LCS can be kept in both strings
- **Delete the rest**: All non-LCS characters must be deleted

### When to Use This Pattern

This pattern is applicable when:
1. Making two strings equal with minimum deletions
2. Problems involving string alignment via deletions
3. Any variant of LCS applied to deletion problems

### Related Patterns

| Pattern | Description |
|---------|-------------|
| Edit Distance | Min operations with insert/delete/replace |
| Longest Common Subsequence | Find LCS of two strings |
| Minimum ASCII Delete Sum | Delete with ASCII weight |

### Pattern Summary

This problem exemplifies **LCS for Minimum Deletion**, characterized by:
- Standard LCS DP: dp[i][j] = LCS length
- Final answer: m + n - 2*LCS
- Only deletion operation (no insert/replace)

---

## Intuition

The key insight for this problem is understanding the relationship between the minimum deletions needed and the Longest Common Subsequence (LCS).

### Key Observations

1. **LCS is the Key**: To make the strings equal with minimum deletions, we want to keep as many matching characters as possible. These matching characters form the LCS.

2. **Deletion Formula**: If we have an LCS of length k:
   - We keep k characters in both strings (the LCS characters)
   - We delete (m - k) characters from word1 (the non-LCS characters)
   - We delete (n - k) characters from word2 (the non-LCS characters)
   - Total deletions = (m - k) + (n - k) = m + n - 2k

3. **DP for LCS**: We can compute LCS using dynamic programming where:
   - dp[i][j] = length of LCS of word1[0:i] and word2[0:j]
   - If characters match: dp[i][j] = dp[i-1][j-1] + 1
   - Otherwise: dp[i][j] = max(dp[i-1][j], dp[i][j-1])

4. **Base Cases**:
   - Empty string vs any string = 0 deletions needed (LCS = 0)
   - Single character strings = 0 if match, 2 if different

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Standard LCS DP** - O(m×n) time, O(m×n) space
2. **Space-Optimized DP** - O(m×n) time, O(min(m,n)) space
3. **Recursive with Memoization** - Alternative perspective

---

## Approach 1: Standard LCS DP (Optimal)

### Algorithm Steps

1. Create a 2D DP array of size (m+1) × (n+1)
2. Fill the DP table using the LCS recurrence:
   - If word1[i-1] == word2[j-1]: dp[i][j] = dp[i-1][j-1] + 1
   - Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])
3. The LCS length is dp[m][n]
4. Return m + n - 2 * lcs

### Why It Works

The LCS represents the longest sequence of characters that appears in both strings in the same order. By keeping these characters and deleting everything else, we achieve the minimum number of deletions.

### Code Implementation

````carousel
```python
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        """
        Find minimum deletions to make two strings equal.
        
        Uses LCS DP approach.
        
        Args:
            word1: First input string
            word2: Second input string
            
        Returns:
            Minimum number of deletions needed
        """
        m, n = len(word1), len(word2)
        
        # Create DP table
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        
        # Fill DP table
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if word1[i - 1] == word2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1] + 1
                else:
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
        
        lcs = dp[m][n]
        return m + n - 2 * lcs
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

class Solution {
public:
    int minDistance(string word1, string word2) {
        int m = word1.size();
        int n = word2.size();
        
        // Create DP table
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
        
        // Fill DP table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1[i - 1] == word2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        
        int lcs = dp[m][n];
        return m + n - 2 * lcs;
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
        
        // Fill DP table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        
        int lcs = dp[m][n];
        return m + n - 2 * lcs;
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
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    
    // Fill DP table
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    const lcs = dp[m][n];
    return m + n - 2 * lcs;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m × n) - compute LCS for all subproblems |
| **Space** | O(m × n) - for the DP table |

---

## Approach 2: Space-Optimized DP

### Algorithm Steps

1. Use only two rows (previous and current) instead of full 2D table
2. Iterate through each row of word1
3. For each character in word1, compute LCS with all characters of word2
4. Return m + n - 2 * lcs

### Why It Works

Since dp[i][j] only depends on dp[i-1][j] and dp[i][j-1], we only need to keep track of the previous row and current row. This reduces space from O(m×n) to O(n).

### Code Implementation

````carousel
```python
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        """Space-optimized DP solution."""
        m, n = len(word1), len(word2)
        
        # Ensure n <= m for space optimization
        if n > m:
            word1, word2 = word2, word1
            n, m = m, n
        
        # Only keep two rows
        prev = [0] * (n + 1)
        
        for i in range(1, m + 1):
            curr = [0] * (n + 1)
            for j in range(1, n + 1):
                if word1[i - 1] == word2[j - 1]:
                    curr[j] = prev[j - 1] + 1
                else:
                    curr[j] = max(prev[j], curr[j - 1])
            prev = curr
        
        lcs = prev[n]
        return m + n - 2 * lcs
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

class Solution {
public:
    int minDistance(string word1, string word2) {
        int m = word1.size();
        int n = word2.size();
        
        // Ensure n <= m for space optimization
        if (n > m) {
            swap(word1, word2);
            swap(m, n);
        }
        
        vector<int> prev(n + 1, 0), curr(n + 1, 0);
        
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1[i - 1] == word2[j - 1]) {
                    curr[j] = prev[j - 1] + 1;
                } else {
                    curr[j] = max(prev[j], curr[j - 1]);
                }
            }
            swap(prev, curr);
        }
        
        int lcs = prev[n];
        return m + n - 2 * lcs;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minDistance(String word1, String word2) {
        int m = word1.length();
        int n = word2.length();
        
        // Ensure n <= m for space optimization
        if (n > m) {
            String temp = word1;
            word1 = word2;
            word2 = temp;
            int tempLen = m;
            m = n;
            n = tempLen;
        }
        
        int[] prev = new int[n + 1];
        int[] curr = new int[n + 1];
        
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    curr[j] = prev[j - 1] + 1;
                } else {
                    curr[j] = Math.max(prev[j], curr[j - 1]);
                }
            }
            System.arraycopy(curr, 0, prev, 0, n + 1);
        }
        
        int lcs = prev[n];
        return m + n - 2 * lcs;
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
    let m = word1.length;
    let n = word2.length;
    
    // Ensure n <= m for space optimization
    if (n > m) {
        [word1, word2] = [word2, word1];
        [m, n] = [n, m];
    }
    
    let prev = new Array(n + 1).fill(0);
    let curr = new Array(n + 1).fill(0);
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                curr[j] = prev[j - 1] + 1;
            } else {
                curr[j] = Math.max(prev[j], curr[j - 1]);
            }
        }
        [prev, curr] = [curr, prev];
    }
    
    const lcs = prev[n];
    return m + n - 2 * lcs;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m × n) |
| **Space** | O(min(m, n)) |

---

## Approach 3: Recursive with Memoization

### Algorithm Steps

1. Define a recursive function that computes LCS(i, j) - LCS for first i chars of word1 and first j chars of word2
2. Use memoization to store computed results
3. Base case: if i == 0 or j == 0, return 0
4. Return m + n - 2 * lcs

### Why It Works

This approach provides an alternative perspective by directly implementing the recurrence relation recursively. Memoization ensures each subproblem is solved only once.

### Code Implementation

````carousel
```python
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        """Recursive solution with memoization."""
        m, n = len(word1), len(word2)
        
        # Memoization cache
        memo = {}
        
        def lcs(i: int, j: int) -> int:
            if i == 0 or j == 0:
                return 0
            
            if (i, j) in memo:
                return memo[(i, j)]
            
            if word1[i - 1] == word2[j - 1]:
                memo[(i, j)] = lcs(i - 1, j - 1) + 1
            else:
                memo[(i, j)] = max(lcs(i - 1, j), lcs(i, j - 1))
            
            return memo[(i, j)]
        
        lcs_length = lcs(m, n)
        return m + n - 2 * lcs_length
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <algorithm>
#include <unordered_map>
using namespace std;

class Solution {
public:
    int minDistance(string word1, string word2) {
        int m = word1.size();
        int n = word2.size();
        
        // Memoization cache
        vector<vector<int>> memo(m + 1, vector<int>(n + 1, -1));
        
        function<int(int, int)> lcs = [&](int i, int j) -> int {
            if (i == 0 || j == 0) return 0;
            if (memo[i][j] != -1) return memo[i][j];
            
            if (word1[i - 1] == word2[j - 1]) {
                memo[i][j] = lcs(i - 1, j - 1) + 1;
            } else {
                memo[i][j] = max(lcs(i - 1, j), lcs(i, j - 1));
            }
            return memo[i][j];
        };
        
        int lcs_length = lcs(m, n);
        return m + n - 2 * lcs_length;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minDistance(String word1, String word2) {
        int m = word1.length();
        int n = word2.length();
        
        int[][] memo = new int[m + 1][n + 1];
        for (int[] row : memo) {
            Arrays.fill(row, -1);
        }
        
        return minDistanceHelper(word1, word2, m, n, memo);
    }
    
    private int minDistanceHelper(String word1, String word2, int i, int j, int[][] memo) {
        if (i == 0 || j == 0) return 0;
        if (memo[i][j] != -1) return memo[i][j];
        
        if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
            memo[i][j] = minDistanceHelper(word1, word2, i - 1, j - 1, memo) + 1;
        } else {
            memo[i][j] = Math.max(
                minDistanceHelper(word1, word2, i - 1, j, memo),
                minDistanceHelper(word1, word2, i, j - 1, memo)
            );
        }
        return memo[i][j];
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
    
    // Memoization cache
    const memo = new Map();
    
    const lcs = (i, j) => {
        if (i === 0 || j === 0) return 0;
        
        const key = `${i},${j}`;
        if (memo.has(key)) return memo.get(key);
        
        let result;
        if (word1[i - 1] === word2[j - 1]) {
            result = lcs(i - 1, j - 1) + 1;
        } else {
            result = Math.max(lcs(i - 1, j), lcs(i, j - 1));
        }
        
        memo.set(key, result);
        return result;
    };
    
    const lcsLength = lcs(m, n);
    return m + n - 2 * lcsLength;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m × n) |
| **Space** | O(m × n) for memoization |

---

## Comparison of Approaches

| Aspect | Standard DP | Space-Optimized | Recursive |
|--------|-------------|-----------------|-----------|
| **Time Complexity** | O(m × n) | O(m × n) | O(m × n) |
| **Space Complexity** | O(m × n) | O(min(m,n)) | O(m × n) |
| **Implementation** | Simple | Moderate | Simple |
| **LeetCode Optimal** | ✅ | ✅ | ✅ |

**Best Approach:** Use Approach 1 (Standard DP) as default. Use Approach 2 if memory is constrained.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Amazon, Microsoft, Apple
- **Difficulty**: Medium
- **Concepts Tested**: Dynamic Programming, LCS, String Manipulation

### Learning Outcomes

1. **LCS Mastery**: Deep understanding of longest common subsequence
2. **Space Optimization**: Learn to reduce DP space complexity
3. **String Problems**: Master string alignment techniques
4. **Formula Derivation**: Learn to derive formulas from problem understanding

---

## Related Problems

Based on similar themes (LCS, string deletion):

### Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Edit Distance | [Link](https://leetcode.com/problems/edit-distance/) | Min operations with insert/delete/replace |
| Minimum ASCII Delete Sum | [Link](https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/) | Delete with ASCII weight |
| Longest Common Subsequence | [Link](https://leetcode.com/problems/longest-common-subsequence/) | Classic LCS problem |
| Delete Characters for Two Strings | [Link](https://leetcode.com/problems/delete-operation-for-two-strings/) | This problem |

### Pattern Reference

For more detailed explanations of the LCS pattern, see:
- **[Dynamic Programming Pattern](/patterns/dynamic-programming)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Delete Operation for Two Strings](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Clear explanation
2. **[LCS Tutorial](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Understanding LCS
3. **[Dynamic Programming on Strings](https://www.youtube.com/watch?v=8grsX-cB0jU)** - String DP techniques

---

## Follow-up Questions

### Q1: How would you modify the solution to also allow insertions?

**Answer:** This becomes the classic Edit Distance problem. You would need to use full edit distance DP where dp[i][j] represents minimum operations to convert word1[0:i] to word2[0:j]. Operations: insert, delete, replace.

---

### Q2: Can you solve this without computing the full LCS table?

**Answer:** Yes, you can use the space-optimized version (Approach 2) which only keeps two rows. This is useful when memory is constrained.

---

### Q3: How would you track which characters to delete?

**Answer:** After computing the LCS table, you can backtrack from dp[m][n] to dp[0][0] to find which characters are in the LCS. Characters not in LCS from word1 and word2 are the ones to delete.

---

### Q4: What's the relationship between this problem and the Minimum ASCII Delete Sum problem?

**Answer:** Minimum ASCII Delete Sum (LeetCode 712) weights each deletion by the ASCII value of the character. This problem treats all deletions equally (cost = 1). Both use similar DP approaches but with different cost functions.

---

## Common Pitfalls

### 1. Forgetting to multiply LCS by 2
**Issue:** Formula is m + n - 2*LCS, not m + n - LCS.

**Solution:** Each character in LCS is kept in both strings, so we subtract twice.

### 2. Confusing with edit distance
**Issue:** This problem only allows deletion, not insert/replace.

**Solution:** Use LCS-based approach, not full edit distance.

### 3. Off-by-one in DP indexing
**Issue:** Using wrong indices for accessing characters.

**Solution:** Remember dp[i][j] corresponds to first i chars: access word1[i-1].

### 4. Not initializing DP properly
**Issue:** First row/column should be 0 for empty string LCS.

**Solution:** Initialize dp with zeros; base case handled automatically.

### 5. Space complexity
**Issue:** O(m*n) space can be large for 500x500.

**Solution:** Can optimize to O(min(m, n)) using rolling arrays.

---

## Summary

The **Delete Operation for Two Strings** problem demonstrates the power of Longest Common Subsequence (LCS) in solving string deletion problems. Key takeaways:

1. The minimum deletions = m + n - 2*LCS
2. LCS can be computed using dynamic programming
3. Space can be optimized from O(m×n) to O(min(m,n))
4. Only deletion is needed; no insert or replace operations

This problem is essential for understanding how to apply LCS to real-world problems and forms the foundation for more complex string alignment problems.

### Pattern Summary

This problem exemplifies the **LCS-based DP** pattern, characterized by:
- Finding longest common subsequence between strings
- Using DP to compute LCS efficiently
- Deriving answer from LCS length
- Space optimization using rolling arrays

For more details on this pattern and its variations, see the **[Dynamic Programming Pattern](/patterns/dynamic-programming)**.

---

## Additional Resources

- [LeetCode Problem 583](https://leetcode.com/problems/delete-operation-for-two-strings/) - Official problem page
- [LCS - GeeksforGeeks](https://www.geeksforgeeks.org/longest-common-subsequence/) - Detailed LCS explanation
- [Edit Distance Problem](https://leetcode.com/problems/edit-distance/) - Related problem
- [Pattern: Dynamic Programming](/patterns/dynamic-programming) - Comprehensive pattern guide
