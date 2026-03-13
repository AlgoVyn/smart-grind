# Shortest Common Supersequence

## Problem Description

Given two strings `str1` and `str2`, return the shortest string that has both `str1` and `str2` as subsequences. If there are multiple valid strings, return any of them.

A string `s` is a subsequence of string `t` if deleting some number of characters from `t` (possibly 0) results in the string `s`.

**Link to problem:** [Shortest Common Supersequence - LeetCode 1092](https://leetcode.com/problems/shortest-common-supersequence/)

## Examples

**Example 1:**
- Input: `str1 = "abac", str2 = "cab"`
- Output: `"cabac"`

**Explanation:**
- `str1 = "abac"` is a subsequence of `"cabac"` because we can delete the first `"c"`.
- `str2 = "cab"` is a subsequence of `"cabac"` because we can delete the last `"ac"`.
The answer provided is the shortest such string that satisfies these properties.

**Example 2:**
- Input: `str1 = "aaaaaaaa", str2 = "aaaaaaaa"`
- Output: `"aaaaaaaa"`

## Constraints

- `1 <= str1.length, str2.length <= 1000`
- `str1` and `str2` consist of lowercase English letters only.

---

## Pattern: Dynamic Programming - String Construction

This problem is a classic example of the **Dynamic Programming - String Construction** pattern. The key insight is to first compute the Longest Common Subsequence (LCS) and then use it to construct the shortest common supersequence.

### Core Concept

The shortest common supersequence combines both strings while minimizing length:
- **LCS is the key**: Characters in the LCS appear only once in the result
- **Non-LCS characters**: Characters not in the LCS must be included from their respective strings
- **Construction**: Build the result by merging both strings based on the LCS

---

## Intuition

The key insight is that:

1. **Find the LCS**: The longest common subsequence forms the "skeleton" of the answer
2. **Add non-LCS characters**: Characters from str1 not in LCS go before the LCS, characters from str2 not in LCS go after
3. **Minimize length**: By maximizing the LCS length, we minimize the total length (m + n - LCS)

### Why Dynamic Programming?

We need to find the LCS first, which is a classic DP problem. Then we use the DP table to backtrack and construct the actual string.

---

## Multiple Approaches with Code

We'll cover two main approaches:

1. **DP with LCS Construction** - Standard O(m*n) approach using LCS
2. **Space-Optimized DP** - Optimized version using less space

---

## Approach 1: DP with LCS Construction (Standard)

This is the standard approach using dynamic programming to find the LCS and then constructing the shortest common supersequence.

### Algorithm Steps

1. **Build LCS DP Table**: Create a 2D DP table where `dp[i][j]` = length of LCS of `str1[:i]` and `str2[:j]`
2. **Backtrack to find LCS**: Starting from `dp[m][n]`, reconstruct the LCS string
3. **Merge to form result**: Interleave characters from str1 and str2 based on the LCS

### Why It Works

The LCS represents characters that appear in the same order in both strings. By keeping these characters once and adding all other characters from their respective strings, we get the shortest possible supersequence.

### Code Implementation

````carousel
```python
class Solution:
    def shortestCommonSupersequence(self, str1: str, str2: str) -> str:
        """
        Find the shortest common supersequence of two strings.
        
        Args:
            str1: First input string
            str2: Second input string
            
        Returns:
            Shortest string containing both as subsequences
        """
        m, n = len(str1), len(str2)
        
        # Step 1: Build LCS DP table
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if str1[i-1] == str2[j-1]:
                    dp[i][j] = dp[i-1][j-1] + 1
                else:
                    dp[i][j] = max(dp[i-1][j], dp[i][j-1])
        
        # Step 2: Backtrack to find LCS
        lcs = []
        i, j = m, n
        while i > 0 and j > 0:
            if str1[i-1] == str2[j-1]:
                lcs.append(str1[i-1])
                i -= 1
                j -= 1
            elif dp[i-1][j] > dp[i][j-1]:
                i -= 1
            else:
                j -= 1
        lcs.reverse()
        
        # Step 3: Build result by merging
        result = []
        idx1, idx2, idxLCS = 0, 0, 0
        
        while idx1 < m or idx2 < n:
            # Add characters from str1 until we hit LCS character
            while idx1 < m and (idxLCS >= len(lcs) or str1[idx1] != lcs[idxLCS]):
                result.append(str1[idx1])
                idx1 += 1
            
            # Add characters from str2 until we hit LCS character
            while idx2 < n and (idxLCS >= len(lcs) or str2[idx2] != lcs[idxLCS]):
                result.append(str2[idx2])
                idx2 += 1
            
            # Add LCS character if available
            if idxLCS < len(lcs):
                result.append(lcs[idxLCS])
                idxLCS += 1
        
        return ''.join(result)
```

<!-- slide -->
```cpp
class Solution {
public:
    string shortestCommonSupersequence(string str1, string str2) {
        /**
         * Find the shortest common supersequence of two strings.
         * 
         * Args:
         *     str1: First input string
         *     str2: Second input string
         * 
         * Returns:
         *     Shortest string containing both as subsequences
         */
        int m = str1.length();
        int n = str2.length();
        
        // Step 1: Build LCS DP table
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
        
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (str1[i-1] == str2[j-1]) {
                    dp[i][j] = dp[i-1][j-1] + 1;
                } else {
                    dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
                }
            }
        }
        
        // Step 2: Backtrack to find LCS
        string lcs;
        int i = m, j = n;
        while (i > 0 && j > 0) {
            if (str1[i-1] == str2[j-1]) {
                lcs.push_back(str1[i-1]);
                i--; j--;
            } else if (dp[i-1][j] > dp[i][j-1]) {
                i--;
            } else {
                j--;
            }
        }
        reverse(lcs.begin(), lcs.end());
        
        // Step 3: Build result by merging
        string result;
        int idx1 = 0, idx2 = 0, idxLCS = 0;
        
        while (idx1 < m || idx2 < n) {
            while (idx1 < m && (idxLCS >= (int)lcs.length() || str1[idx1] != lcs[idxLCS])) {
                result.push_back(str1[idx1]);
                idx1++;
            }
            
            while (idx2 < n && (idxLCS >= (int)lcs.length() || str2[idx2] != lcs[idxLCS])) {
                result.push_back(str2[idx2]);
                idx2++;
            }
            
            if (idxLCS < (int)lcs.length()) {
                result.push_back(lcs[idxLCS]);
                idxLCS++;
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public String shortestCommonSupersequence(String str1, String str2) {
        /**
         * Find the shortest common supersequence of two strings.
         * 
         * Args:
         *     str1: First input string
         *     str2: Second input string
         * 
         * Returns:
         *     Shortest string containing both as subsequences
         */
        int m = str1.length();
        int n = str2.length();
        
        // Step 1: Build LCS DP table
        int[][] dp = new int[m + 1][n + 1];
        
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (str1.charAt(i - 1) == str2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        
        // Step 2: Backtrack to find LCS
        StringBuilder lcs = new StringBuilder();
        int i = m, j = n;
        while (i > 0 && j > 0) {
            if (str1.charAt(i - 1) == str2.charAt(j - 1)) {
                lcs.append(str1.charAt(i - 1));
                i--; j--;
            } else if (dp[i - 1][j] > dp[i][j - 1]) {
                i--;
            } else {
                j--;
            }
        }
        lcs.reverse();
        
        // Step 3: Build result by merging
        StringBuilder result = new StringBuilder();
        int idx1 = 0, idx2 = 0, idxLCS = 0;
        
        while (idx1 < m || idx2 < n) {
            while (idx1 < m && (idxLCS >= lcs.length() || str1.charAt(idx1) != lcs.charAt(idxLCS))) {
                result.append(str1.charAt(idx1));
                idx1++;
            }
            
            while (idx2 < n && (idxLCS >= lcs.length() || str2.charAt(idx2) != lcs.charAt(idxLCS))) {
                result.append(str2.charAt(idx2));
                idx2++;
            }
            
            if (idxLCS < lcs.length()) {
                result.append(lcs.charAt(idxLCS));
                idxLCS++;
            }
        }
        
        return result.toString();
    }
}
```

<!-- slide -->
```javascript
/**
 * Find the shortest common supersequence of two strings.
 * 
 * @param {string} str1 - First input string
 * @param {string} str2 - Second input string
 * @return {string} - Shortest string containing both as subsequences
 */
var shortestCommonSupersequence = function(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    
    // Step 1: Build LCS DP table
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    // Step 2: Backtrack to find LCS
    let lcs = [];
    let i = m, j = n;
    while (i > 0 && j > 0) {
        if (str1[i - 1] === str2[j - 1]) {
            lcs.push(str1[i - 1]);
            i--; j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }
    lcs.reverse();
    
    // Step 3: Build result by merging
    const result = [];
    let idx1 = 0, idx2 = 0, idxLCS = 0;
    
    while (idx1 < m || idx2 < n) {
        while (idx1 < m && (idxLCS >= lcs.length || str1[idx1] !== lcs[idxLCS])) {
            result.push(str1[idx1]);
            idx1++;
        }
        
        while (idx2 < n && (idxLCS >= lcs.length || str2[idx2] !== lcs[idxLCS])) {
            result.push(str2[idx2]);
            idx2++;
        }
        
        if (idxLCS < lcs.length) {
            result.push(lcs[idxLCS]);
            idxLCS++;
        }
    }
    
    return result.join('');
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m * n) - Building the DP table |
| **Space** | O(m * n) - For the DP table |

---

## Approach 2: Direct DP Construction

This approach directly constructs the shortest common supersequence without explicitly finding the LCS first. It builds the result while computing the DP table.

### Algorithm Steps

1. Build the DP table for SCS length
2. During backtracking, directly build the result string
3. If characters match, add the character and move diagonally
4. Otherwise, add the character from the direction with smaller value

### Code Implementation

````carousel
```python
class Solution:
    def shortestCommonSupersequence(self, str1: str, str2: str) -> str:
        """
        Direct DP approach to build SCS.
        
        Args:
            str1: First input string
            str2: Second input string
            
        Returns:
            Shortest string containing both as subsequences
        """
        m, n = len(str1), len(str2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        
        # Build DP table for SCS length
        for i in range(m + 1):
            dp[i][0] = i
        for j in range(n + 1):
            dp[0][j] = j
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if str1[i-1] == str2[j-1]:
                    dp[i][j] = dp[i-1][j-1] + 1
                else:
                    dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + 1
        
        # Build the string directly during backtrack
        result = []
        i, j = m, n
        while i > 0 or j > 0:
            if i > 0 and j > 0 and str1[i-1] == str2[j-1]:
                result.append(str1[i-1])
                i -= 1
                j -= 1
            elif i > 0 and (j == 0 or dp[i-1][j] < dp[i][j-1]):
                result.append(str1[i-1])
                i -= 1
            else:
                result.append(str2[j-1])
                j -= 1
        return ''.join(reversed(result))
```

<!-- slide -->
```cpp
class Solution {
public:
    string shortestCommonSupersequence(string str1, string str2) {
        /**
         * Direct DP approach to build SCS.
         * 
         * Args:
         *     str1: First input string
         *     str2: Second input string
         * 
         * Returns:
         *     Shortest string containing both as subsequences
         */
        int m = str1.length();
        int n = str2.length();
        
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
        
        // Build DP table for SCS length
        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;
        
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (str1[i-1] == str2[j-1]) {
                    dp[i][j] = dp[i-1][j-1] + 1;
                } else {
                    dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + 1;
                }
            }
        }
        
        // Build the string directly during backtrack
        string result;
        int i = m, j = n;
        while (i > 0 || j > 0) {
            if (i > 0 && j > 0 && str1[i-1] == str2[j-1]) {
                result.push_back(str1[i-1]);
                i--; j--;
            } else if (i > 0 && (j == 0 || dp[i-1][j] < dp[i][j-1])) {
                result.push_back(str1[i-1]);
                i--;
            } else {
                result.push_back(str2[j-1]);
                j--;
            }
        }
        
        reverse(result.begin(), result.end());
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public String shortestCommonSupersequence(String str1, String str2) {
        /**
         * Direct DP approach to build SCS.
         * 
         * Args:
         *     str1: First input string
         *     str2: Second input string
         * 
         * Returns:
         *     Shortest string containing both as subsequences
         */
        int m = str1.length();
        int n = str2.length();
        
        int[][] dp = new int[m + 1][n + 1];
        
        // Build DP table for SCS length
        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;
        
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (str1.charAt(i - 1) == str2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + 1;
                }
            }
        }
        
        // Build the string directly during backtrack
        StringBuilder result = new StringBuilder();
        int i = m, j = n;
        while (i > 0 || j > 0) {
            if (i > 0 && j > 0 && str1.charAt(i - 1) == str2.charAt(j - 1)) {
                result.append(str1.charAt(i - 1));
                i--; j--;
            } else if (i > 0 && (j == 0 || dp[i - 1][j] < dp[i][j - 1])) {
                result.append(str1.charAt(i - 1));
                i--;
            } else {
                result.append(str2.charAt(j - 1));
                j--;
            }
        }
        
        return result.reverse().toString();
    }
}
```

<!-- slide -->
```javascript
/**
 * Direct DP approach to build SCS.
 * 
 * @param {string} str1 - First input string
 * @param {string} str2 - Second input string
 * @return {string} - Shortest string containing both as subsequences
 */
var shortestCommonSupersequence = function(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    // Build DP table for SCS length
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + 1;
            }
        }
    }
    
    // Build the string directly during backtrack
    const result = [];
    let i = m, j = n;
    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && str1[i - 1] === str2[j - 1]) {
            result.push(str1[i - 1]);
            i--; j--;
        } else if (i > 0 && (j === 0 || dp[i - 1][j] < dp[i][j - 1])) {
            result.push(str1[i - 1]);
            i--;
        } else {
            result.push(str2[j - 1]);
            j--;
        }
    }
    
    return result.reverse().join('');
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m * n) - Building the DP table |
| **Space** | O(m * n) - For the DP table |

---

## Comparison of Approaches

| Aspect | LCS Construction | Direct DP |
|--------|------------------|-----------|
| **Time Complexity** | O(m * n) | O(m * n) |
| **Space Complexity** | O(m * n) | O(m * n) |
| **Implementation** | More steps, clearer logic | More compact |
| **Understanding** | Easier to understand | Requires more thought |
| **LCS Usage** | Explicitly finds LCS | Uses DP implicitly |

**Best Approach:** Both approaches have similar complexity. The LCS construction approach is more intuitive, while the direct DP approach is more compact.

---

## Why This Problem is Important

The shortest common supersequence problem demonstrates:

1. **LCS Application**: Shows how LCS can be used for string construction problems
2. **DP String Building**: Practice building strings while doing DP backtracking
3. **Multiple Solutions**: Different ways to approach the same problem
4. **Real-world Applications**: DNA sequencing, file merging, diff tools

---

## Related Problems

Based on similar themes (string DP, LCS, subsequence problems):

### Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Longest Common Subsequence | [Link](https://leetcode.com/problems/longest-common-subsequence/) | Foundation for this problem |
| Delete Operation for Two Strings | [Link](https://leetcode.com/problems/delete-operation-for-two-strings/) | Similar DP approach |
| Minimum ASCII Delete Sum for Two Strings | [Link](https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/) | Weighted version |
| Shortest Common Supersequence | [Link](https://leetcode.com/problems/shortest-common-supersequence/) | This problem |

### Pattern Reference

For more detailed explanations of the Dynamic Programming pattern and its variations, see:
- **[DP - 2D Array - Edit Distance](/patterns/dp-2d-array-edit-distance-levenshtein-distance)**
- **[String - Longest Common Subsequence](/patterns/dp-2d-array-lcs)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Dynamic Programming Explanation

- [NeetCode - Shortest Common Supersequence](https://www.youtube.com/watch?v=3PmdF6c_4bM) - Clear explanation with visual examples
- [Longest Common Subsequence Explained](https://www.youtube.com/watch?v=NnD96abZwwQ) - Understanding LCS as foundation
- [Dynamic Programming on Strings](https://www.youtube.com/watch?v=WEihgtJKJqU) - String DP techniques

### Related Problem Solutions

- [LeetCode 1092 Official Solution](https://www.youtube.com/watch?v=6HDvwrPHJxg) - Official problem solution
- [Edit Distance Problem](https://www.youtube.com/watch?v=We3YTM7jNwE) - Similar DP approach

---

## Follow-up Questions

### Q1: How does the SCS relate to the LCS?

**Answer:** The length of the shortest common supersequence equals `len(str1) + len(str2) - len(LCS)`. The LCS forms the "spine" of the SCS, with non-LCS characters from each string added around it.

---

### Q2: Can you solve it with O(min(m, n)) space?

**Answer:** Yes! Since we only need the previous row to compute the current row in the DP table, we can reduce space to O(min(m, n)). However, this makes backtracking more complex as we need to rebuild the table.

---

### Q3: How would you find all possible shortest common supersequences?

**Answer:** During backtracking, when dp[i-1][j] == dp[i][j-1], both directions are valid. You would need to explore both paths recursively and collect all unique results.

---

### Q4: What if the strings contain duplicate characters?

**Answer:** The DP approach naturally handles duplicates. The key is tracking positions in both strings, not just characters. Multiple occurrences of the same character can be part of the LCS in different ways.

---

### Q5: How would you modify the solution for 3 strings?

**Answer:** Extend to 3D DP where dp[i][j][k] = SCS length for str1[:i], str2[:j], str3[:k]. The time complexity becomes O(m * n * p), which can be expensive for large strings.

---

### Q6: What is the time complexity of finding SCS vs LCS?

**Answer:** They have the same time complexity O(m * n) since SCS length = m + n - LCS length. The DP tables are computed similarly.

---

### Q7: How would you handle Unicode characters?

**Answer:** The character-based approach naturally handles Unicode correctly since it operates on individual code points. No modifications needed for multi-byte characters.

---

### Q8: What edge cases should be tested?

**Answer:**
- Empty strings (one or both)
- Identical strings
- Strings with no common characters
- Strings where one is a subsequence of the other
- Single character strings
- All same characters ("aaa", "aa")

---

### Q9: How does this relate to the "merge" step in merge sort?

**Answer:** The merge process is similar - we interleave elements from two sequences. However, in SCS we prioritize matching (LCS) characters while in merge sort we combine sorted arrays deterministically.

---

### Q10: What real-world applications use SCS?

**Answer:**
- DNA sequence alignment in bioinformatics
- Version control diff tools (finding minimal changes)
- Text file merging
- Creating shortest palindrome by adding characters

---

## Common Pitfalls

### 1. LCS vs SCS Confusion
**Issue**: Mixing up the DP formulas for LCS and SCS.

**Solution**: Remember SCS = m + n - LCS. For SCS DP, when characters match, take diagonal + 1; otherwise take min(top, left) + 1.

### 2. String Building Direction
**Issue**: Building result in wrong order during backtracking.

**Solution**: Remember to reverse the result at the end since we build from the end to the beginning.

### 3. Off-by-One Errors
**Issue**: Index errors when accessing str1[i-1] vs str1[i].

**Solution**: DP table has dimensions (m+1) x (n+1), with dp[i][j] representing str1[:i] and str2[:j]. Use i-1 and j-1 for string indices.

### 4. Multiple Valid Answers
**Issue**: Expecting a single unique answer.

**Solution:** The problem states "return any of them" when multiple valid answers exist. Different implementations may produce different but equally valid results.

---

## Summary

The **Shortest Common Supersequence** problem demonstrates the power of dynamic programming for string construction:

- **LCS-based approach**: Find LCS first, then merge strings around it
- **Direct DP approach**: Build result while backtracking through DP table
- **Time Complexity**: O(m * n) for both approaches
- **Space Complexity**: O(m * n), can be optimized to O(min(m, n))

The key insight is understanding the relationship between SCS and LCS: characters in the LCS appear only once in the result, while all other characters must be included from their respective strings.

This problem is essential for understanding how dynamic programming can be applied to string manipulation and has applications in bioinformatics, version control, and text processing.

### Pattern Summary

This problem exemplifies the **Dynamic Programming - String Construction** pattern, characterized by:
- Using 2D DP tables for string problems
- Building solutions through backtracking
- Understanding relationships between related problems (LCS, SCS, Edit Distance)
- Trading space for time in complex string operations

For more details on this pattern and its variations, see the **[DP - 2D Array - Edit Distance Pattern](/patterns/dp-2d-array-edit-distance-levenshtein-distance)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/shortest-common-supersequence/discuss/) - Community solutions and explanations
- [Longest Common Subsequence - GeeksforGeeks](https://www.geeksforgeeks.org/longest-common-subsequence/) - Detailed LCS explanation
- [Dynamic Programming on Strings](https://www.geeksforgeeks.org/dynamic-programming-strings/) - String DP techniques
- [Shortest Common Supersequence - Wikipedia](https://en.wikipedia.org/wiki/Shortest_common_supersequence) - Theoretical background
