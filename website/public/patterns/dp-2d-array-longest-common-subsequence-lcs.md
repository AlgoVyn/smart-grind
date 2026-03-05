# DP - 2D Array (Longest Common Subsequence - LCS)

## Problem Description

The Longest Common Subsequence (LCS) pattern solves sequence comparison problems by finding the longest subsequence common to two sequences. This pattern is fundamental for diff algorithms, DNA sequence alignment, and file comparison tools.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(m × n), where m, n are lengths of the two sequences |
| Space Complexity | O(m × n), optimizable to O(min(m, n)) |
| Input | Two sequences (strings, arrays) |
| Output | Length of LCS or the actual LCS string |
| Approach | Build DP table comparing all prefixes |

### When to Use

- **String/Sequence Comparison**: Find similarity between two sequences
- **Diff Algorithms**: File comparison, version control systems
- **DNA/Protein Alignment**: Bioinformatics sequence alignment
- **Shortest Common Supersequence**: Find shortest string containing both inputs
- **Edit Distance Variations**: Problems involving insertions and deletions

## Intuition

The key insight is that if characters match, we extend the LCS; otherwise, we take the best of skipping either character.

The "aha!" moments:

1. **Prefix comparison**: dp[i][j] represents LCS of first i chars of s1 and first j of s2
2. **Match case**: If s1[i-1] == s2[j-1], dp[i][j] = dp[i-1][j-1] + 1
3. **Mismatch case**: Else, dp[i][j] = max(dp[i-1][j], dp[i][j-1])
4. **Build-up**: Start from empty prefixes and build up to full strings
5. **Reconstruction**: Backtrack from dp[m][n] to find actual LCS

## Solution Approaches

### Approach 1: Standard LCS (Length Only) ✅ Recommended

Find the length of the longest common subsequence.

#### Algorithm

1. Create DP table of size (m+1) × (n+1), initialized to 0
2. For i from 1 to m:
   - For j from 1 to n:
     - If s1[i-1] == s2[j-1]: dp[i][j] = dp[i-1][j-1] + 1
     - Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])
3. Return dp[m][n]

#### Implementation

````carousel
```python
def longest_common_subsequence(text1, text2):
    """
    Find length of longest common subsequence.
    LeetCode 1143 - Longest Common Subsequence
    
    Time: O(m * n), Space: O(m * n)
    """
    m, n = len(text1), len(text2)
    
    # dp[i][j] = LCS length of text1[0:i] and text2[0:j]
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                # Characters match: extend LCS
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                # Characters don't match: take best of skipping either
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    
    return dp[m][n]

# Space-optimized version
def lcs_space_optimized(text1, text2):
    """O(min(m, n)) space version."""
    if len(text1) < len(text2):
        text1, text2 = text2, text1
    
    m, n = len(text1), len(text2)
    prev = [0] * (n + 1)
    curr = [0] * (n + 1)
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                curr[j] = prev[j - 1] + 1
            else:
                curr[j] = max(prev[j], curr[j - 1])
        prev, curr = curr, prev  # Swap rows
    
    return prev[n]
```
<!-- slide -->
```cpp
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int longestCommonSubsequence(string text1, string text2) {
        int m = text1.length(), n = text2.length();
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
function longestCommonSubsequence(text1, text2) {
    const m = text1.length, n = text2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
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
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(m × n) |
| Space | O(m × n) or O(min(m, n)) |

### Approach 2: Reconstruct LCS String

Return the actual longest common subsequence.

#### Implementation

````carousel
```python
def get_lcs_string(text1, text2):
    """
    Return the actual LCS string by backtracking.
    Time: O(m * n), Space: O(m * n)
    """
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Fill DP table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    
    # Backtrack to construct LCS
    lcs = []
    i, j = m, n
    while i > 0 and j > 0:
        if text1[i - 1] == text2[j - 1]:
            lcs.append(text1[i - 1])
            i -= 1
            j -= 1
        elif dp[i - 1][j] > dp[i][j - 1]:
            i -= 1
        else:
            j -= 1
    
    return ''.join(reversed(lcs))

# Example: get_lcs_string("abcde", "ace") returns "ace"
```
<!-- slide -->
```cpp
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    string getLCS(string text1, string text2) {
        int m = text1.length(), n = text2.length();
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
        
        // Backtrack
        string lcs;
        int i = m, j = n;
        while (i > 0 && j > 0) {
            if (text1[i - 1] == text2[j - 1]) {
                lcs.push_back(text1[i - 1]);
                i--; j--;
            } else if (dp[i - 1][j] > dp[i][j - 1]) {
                i--;
            } else {
                j--;
            }
        }
        
        reverse(lcs.begin(), lcs.end());
        return lcs;
    }
};
```
<!-- slide -->
```java
class Solution {
    public String getLCS(String text1, String text2) {
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
        
        // Backtrack
        StringBuilder lcs = new StringBuilder();
        int i = m, j = n;
        while (i > 0 && j > 0) {
            if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                lcs.append(text1.charAt(i - 1));
                i--; j--;
            } else if (dp[i - 1][j] > dp[i][j - 1]) {
                i--;
            } else {
                j--;
            }
        }
        
        return lcs.reverse().toString();
    }
}
```
<!-- slide -->
```javascript
function getLCS(text1, text2) {
    const m = text1.length, n = text2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    // Backtrack
    let lcs = '';
    let i = m, j = n;
    while (i > 0 && j > 0) {
        if (text1[i - 1] === text2[j - 1]) {
            lcs = text1[i - 1] + lcs;
            i--; j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }
    
    return lcs;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(m × n) |
| Space | O(m × n) |

### Approach 3: Shortest Common Supersequence

Find the shortest string that has both input strings as subsequences.

#### Implementation

````carousel
```python
def shortest_common_supersequence(str1, str2):
    """
    Find shortest string containing both str1 and str2 as subsequences.
    LeetCode 1092 - Shortest Common Supersequence
    
    Time: O(m * n), Space: O(m * n)
    """
    m, n = len(str1), len(str2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Build LCS table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if str1[i - 1] == str2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    
    # Build SCS by backtracking
    scs = []
    i, j = m, n
    while i > 0 and j > 0:
        if str1[i - 1] == str2[j - 1]:
            scs.append(str1[i - 1])
            i -= 1
            j -= 1
        elif dp[i - 1][j] > dp[i][j - 1]:
            scs.append(str1[i - 1])
            i -= 1
        else:
            scs.append(str2[j - 1])
            j -= 1
    
    # Add remaining characters
    while i > 0:
        scs.append(str1[i - 1])
        i -= 1
    while j > 0:
        scs.append(str2[j - 1])
        j -= 1
    
    return ''.join(reversed(scs))
```
<!-- slide -->
```cpp
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    string shortestCommonSupersequence(string str1, string str2) {
        int m = str1.length(), n = str2.length();
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
        
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (str1[i - 1] == str2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        
        string scs;
        int i = m, j = n;
        while (i > 0 && j > 0) {
            if (str1[i - 1] == str2[j - 1]) {
                scs.push_back(str1[i - 1]);
                i--; j--;
            } else if (dp[i - 1][j] > dp[i][j - 1]) {
                scs.push_back(str1[i - 1]);
                i--;
            } else {
                scs.push_back(str2[j - 1]);
                j--;
            }
        }
        
        while (i > 0) scs.push_back(str1[--i]);
        while (j > 0) scs.push_back(str2[--j]);
        
        reverse(scs.begin(), scs.end());
        return scs;
    }
};
```
<!-- slide -->
```java
class Solution {
    public String shortestCommonSupersequence(String str1, String str2) {
        int m = str1.length(), n = str2.length();
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
        
        StringBuilder scs = new StringBuilder();
        int i = m, j = n;
        while (i > 0 && j > 0) {
            if (str1.charAt(i - 1) == str2.charAt(j - 1)) {
                scs.append(str1.charAt(i - 1));
                i--; j--;
            } else if (dp[i - 1][j] > dp[i][j - 1]) {
                scs.append(str1.charAt(i - 1));
                i--;
            } else {
                scs.append(str2.charAt(j - 1));
                j--;
            }
        }
        
        while (i > 0) scs.append(str1.charAt(--i));
        while (j > 0) scs.append(str2.charAt(--j));
        
        return scs.reverse().toString();
    }
}
```
<!-- slide -->
```javascript
function shortestCommonSupersequence(str1, str2) {
    const m = str1.length, n = str2.length;
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
    
    let scs = '';
    let i = m, j = n;
    while (i > 0 && j > 0) {
        if (str1[i - 1] === str2[j - 1]) {
            scs = str1[i - 1] + scs;
            i--; j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            scs = str1[i - 1] + scs;
            i--;
        } else {
            scs = str2[j - 1] + scs;
            j--;
        }
    }
    
    while (i > 0) scs = str1[--i] + scs;
    while (j > 0) scs = str2[--j] + scs;
    
    return scs;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(m × n) |
| Space | O(m × n) |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Standard LCS | O(m × n) | O(m × n) | Length only, reconstruction needed |
| Space Optimized | O(m × n) | O(min(m, n)) | Memory-constrained environments |
| Reconstruction | O(m × n) | O(m × n) | Need actual LCS string |
| Shortest Supersequence | O(m × n) | O(m × n) | Merge two strings minimally |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/) | 1143 | Medium | Classic LCS problem |
| [Shortest Common Supersequence](https://leetcode.com/problems/shortest-common-supersequence/) | 1092 | Hard | Shortest string containing both |
| [Delete Operation for Two Strings](https://leetcode.com/problems/delete-operation-for-two-strings/) | 583 | Medium | Min deletions to make equal |
| [Uncrossed Lines](https://leetcode.com/problems/uncrossed-lines/) | 1035 | Medium | LCS with matching numbers |
| [Minimum ASCII Delete Sum](https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/) | 712 | Medium | Weighted deletion cost |
| [Longest Palindromic Subsequence](https://leetcode.com/problems/longest-palindromic-subsequence/) | 516 | Medium | LCS of string and its reverse |
| [Distinct Subsequences](https://leetcode.com/problems/distinct-subsequences/) | 115 | Hard | Count distinct subsequences |
| [Edit Distance](https://leetcode.com/problems/edit-distance/) | 72 | Hard | Min operations to convert string |

## Video Tutorial Links

1. **[NeetCode - Longest Common Subsequence](https://www.youtube.com/watch?v=Ua0GhsJSlWM)** - Comprehensive DP explanation
2. **[Back To Back SWE - LCS](https://www.youtube.com/watch?v=ASoaQqvlafA)** - Visual walkthrough
3. **[Kevin Naughton Jr. - LCS](https://www.youtube.com/watch?v=10WnvBk9sZc)** - Step-by-step solution
4. **[Abdul Bari - LCS](https://www.youtube.com/watch?v=sSno9rV8Rhg)** - Detailed algorithm theory
5. **[Techdose - LCS Variations](https://www.youtube.com/watch?v=4Urd0e0Odwo)** - All variations covered

## Summary

### Key Takeaways

- **Match vs mismatch**: If characters match, add 1 to diagonal; else take max of left and top
- **Prefix building**: dp[i][j] always uses prefixes text1[0:i] and text2[0:j]
- **Base cases**: First row and column are all 0 (empty prefix has LCS of 0)
- **Reconstruction**: Backtrack from bottom-right, following the path of matches
- **Space optimization**: Only need previous row, not entire table
- **Many applications**: SCS, edit distance, diff algorithms all use LCS

### Common Pitfalls

- **Off-by-one indexing**: dp[i][j] corresponds to text1[i-1] and text2[j-1]
- **Confusing subsequence with substring**: Subsequence skips characters; substring is contiguous
- **Wrong base case**: Forgetting to initialize first row/column to 0
- **Reconstruction direction**: Backtrack in reverse direction
- **Space optimization errors**: Not handling the swap correctly
- **Not considering empty strings**: Edge cases where one string is empty

### Follow-up Questions

1. **How would you find all LCS strings?**
   - Modify backtracking to explore both paths when dp[i-1][j] == dp[i][j-1]

2. **Can you optimize for sparse matches?**
   - Use hash map to store only matching positions

3. **What if you need k-LCS (k sequences)?**
   - Use k-dimensional DP table: O(n^k) time and space

4. **How does this relate to edit distance?**
   - Edit distance = m + n - 2 * LCS (for insertion/deletion only)

## Pattern Source

[Longest Common Subsequence Pattern](patterns/dp-2d-array-longest-common-subsequence-lcs.md)
