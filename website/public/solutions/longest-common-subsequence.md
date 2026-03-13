# Longest Common Subsequence

## Problem Description

Given two strings `text1` and `text2`, return the length of their longest common subsequence. If there is no common subsequence, return 0.

A **subsequence** of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.

- For example, "ace" is a subsequence of "abcde".

**Link to problem:** [Longest Common Subsequence - LeetCode 1143](https://leetcode.com/problems/longest-common-subsequence/)

---

## Pattern: Dynamic Programming - 2D

This problem demonstrates the **DP - 2D Array** pattern. We use a 2D DP table where `dp[i][j]` represents the LCS length of `text1[0:i]` and `text2[0:j]`.

### Core Concept

The fundamental idea is building a table from smaller subproblems:
- If characters match: `dp[i][j] = dp[i-1][j-1] + 1`
- If they don't match: `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`

---

## Examples

### Example

**Input:**
```
text1 = "abcde", text2 = "ace"
```

**Output:**
```
3
```

**Explanation:** The longest common subsequence is "ace" and its length is 3.

### Example 2

**Input:**
```
text1 = "abc", text2 = "def"
```

**Output:**
```
0
```

---

## Constraints

- `1 <= text1.length, text2.length <= 1000`
- `text1` and `text2` consist of only lowercase English characters.

---

## Intuition

The key insight is that we can build the solution from smaller subproblems. For each position in both strings, we decide whether to include the character in our subsequence or skip it.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **2D DP (Optimal)** - O(mn) time, O(mn) space
2. **1D DP** - O(mn) time, O(min(m,n)) space

---

## Approach 1: 2D DP (Optimal)

### Algorithm Steps

1. Create dp table of size (m+1) × (n+1)
2. Fill table from top-left to bottom-right
3. For each cell, if characters match, add 1 to diagonal; else take max from left or top

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        m, n = len(text1), len(text2)
        
        # Create dp table
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        
        # Fill dp table
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if text1[i - 1] == text2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1] + 1
                else:
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
        
        return dp[m][n]
```

<!-- slide -->
```cpp
class Solution {
public:
    int longestCommonSubsequence(string text1, string text2) {
        int m = text1.size(), n = text2.size();
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
        
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1[i - 1] == text2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
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
    public int longestCommonSubsequence(String text1, String text2) {
        int m = text1.length(), n = text2.length();
        int[][] dp = new int[m + 1][n + 1];
        
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        
        return dp[m][n];
    }
}
```

<!-- slide -->
```javascript
var longestCommonSubsequence = function(text1, text2) {
    const m = text1.length, n = text2.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
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
| **Time** | O(mn) |
| **Space** | O(mn) |

---

## Approach 2: 1D DP (Space-optimized)

### Code Implementation

````carousel
```python
class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        # Ensure text2 is the shorter string for space optimization
        if len(text1) < len(text2):
            text1, text2 = text2, text1
        
        m, n = len(text1), len(text2)
        
        # 1D dp array
        dp = [0] * (n + 1)
        
        for i in range(1, m + 1):
            prev = 0  # dp[i-1][j-1]
            for j in range(1, n + 1):
                temp = dp[j]
                if text1[i - 1] == text2[j - 1]:
                    dp[j] = prev + 1
                else:
                    dp[j] = max(dp[j], dp[j - 1])
                prev = temp
        
        return dp[n]
```

<!-- slide -->
```cpp
class Solution {
public:
    int longestCommonSubsequence(string text1, string text2) {
        if (text1.size() < text2.size()) swap(text1, text2);
        
        int m = text1.size(), n = text2.size();
        vector<int> dp(n + 1, 0);
        
        for (int i = 1; i <= m; i++) {
            int prev = 0;
            for (int j = 1; j <= n; j++) {
                int temp = dp[j];
                if (text1[i - 1] == text2[j - 1]) {
                    dp[j] = prev + 1;
                } else {
                    dp[j] = max(dp[j], dp[j - 1]);
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
    public int longestCommonSubsequence(String text1, String text2) {
        if (text1.length() < text2.length()) {
            String temp = text1;
            text1 = text2;
            text2 = temp;
        }
        
        int m = text1.length(), n = text2.length();
        int[] dp = new int[n + 1];
        
        for (int i = 1; i <= m; i++) {
            int prev = 0;
            for (int j = 1; j <= n; j++) {
                int temp = dp[j];
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    dp[j] = prev + 1;
                } else {
                    dp[j] = Math.max(dp[j], dp[j - 1]);
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
var longestCommonSubsequence = function(text1, text2) {
    if (text1.length < text2.length) [text1, text2] = [text2, text1];
    
    const m = text1.length, n = text2.length;
    let dp = new Array(n + 1).fill(0);
    
    for (let i = 1; i <= m; i++) {
        let prev = 0;
        for (let j = 1; j <= n; j++) {
            const temp = dp[j];
            if (text1[i - 1] === text2[j - 1]) {
                dp[j] = prev + 1;
            } else {
                dp[j] = Math.max(dp[j], dp[j - 1]);
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
| **Time** | O(mn) |
| **Space** | O(min(m,n)) |

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Shortest Common Supersequence | [Link](https://leetcode.com/problems/shortest-common-supersequence/) | Build on LCS |
| Edit Distance | [Link](https://leetcode.com/problems/edit-distance/) | Similar DP |

---

## Video Tutorial Links

- [NeetCode - Longest Common Subsequence](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Clear explanation with visual examples

---

## Follow-up Questions

### Q1: How would you reconstruct the actual subsequence?

**Answer:** Use backtracking from dp[m][n], moving diagonally if characters match, or up/left otherwise.

### Q2: What if strings have different lengths?

**Answer:** The algorithm works for any lengths. The longer string's extra characters won't be part of LCS.

### Q3: Can you solve it recursively without DP table?

**Answer:** Yes, but it would have O(2^min(m,n)) time complexity due to overlapping subproblems.

### Q4: How does this relate to edit distance?

**Answer:** LCS is a special case of edit distance where only deletions are allowed.

---

## Common Pitfalls

### 1. Index Off-by-One
**Issue**: Using wrong indices when accessing dp table.

**Solution**: dp[i][j] represents LCS of text1[0:i] and text2[0:j], so use i-1 and j-1 for actual characters.

### 2. Space Optimization
**Issue**: Not handling space optimization correctly.

**Solution**: When using 1D DP, keep track of the previous diagonal value separately.

### 3. Character Comparison
**Issue**: Comparing wrong characters in the strings.

**Solution**: Use text1[i-1] and text2[j-1] to get actual characters at positions.

### 4. Initialization
**Issue**: Not initializing dp[0][*] and dp[*][0] correctly.

**Solution**: First row and column should be 0 (empty string vs any string = 0).

---

## Summary

The **Longest Common Subsequence** problem demonstrates 2D dynamic programming:
- Build table from smaller subproblems
- Match = diagonal + 1, no match = max(left, top)
- Space can be optimized to O(min(m,n))

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/longest-common-subsequence/discuss/)
- [LCS - GeeksforGeeks](https://www.geeksforgeeks.org/longest-common-subsequence/)
