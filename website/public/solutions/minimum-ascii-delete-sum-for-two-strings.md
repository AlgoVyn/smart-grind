# Minimum ASCII Delete Sum for Two Strings

## Problem Description

Given two strings `s1` and `s2`, return the **lowest ASCII sum of deleted characters** required to make the two strings equal.

In other words, find the minimum sum of ASCII values of characters that need to be deleted from both strings so that they become identical.

**Link to problem:** [Minimum ASCII Delete Sum for Two Strings - LeetCode 712](https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/)

---

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `s1 = "sea", s2 = "eat"` | `231` |

**Explanation:**
- Delete `'s'` from `"sea"` → ASCII: 115
- Delete `'t'` from `"eat"` → ASCII: 116
- Total: 115 + 116 = 231

Both strings become `"ea"`.

**Example 2:**

| Input | Output |
|-------|--------|
| `s1 = "delete", s2 = "leet"` | `403` |

**Explanation:**
- Delete `"dee"` from `"delete"` → 100 + 101 + 101 = 302
- Delete `"e"` from `"leet"` → 101
- Both become `"let"` → Total: 403

Other options like `"lee"` or `"eet"` yield higher sums (433 and 417 respectively).

---

## Constraints

- `1 <= s1.length, s2.length <= 1000`
- `s1` and `s2` consist of lowercase English letters

---

## Intuition

This problem is a variation of the **Longest Common Subsequence (LCS)** problem, but instead of maximizing matches, we want to minimize the ASCII delete cost.

The key insight is:
- We want to keep characters that appear in both strings (forming a common subsequence)
- We delete characters that don't contribute to the common subsequence
- The cost is the ASCII value of deleted characters

This leads to a dynamic programming approach where we find the Maximum ASCII Common Subsequence (MACS), then subtract from total ASCII sum.

---

## Solution Approaches

## Approach 1: Dynamic Programming (Bottom-Up) - Optimal

This is the classic DP approach similar to LCS. We build a table where `dp[i][j]` represents the minimum delete sum for `s1[:i]` and `s2[:j]`.

#### Algorithm

1. Initialize a 2D DP table of size `(m+1) x (n+1)`
2. Base cases: delete all characters from one string to match empty string
3. For each character pair:
   - If characters match: no deletion needed
   - If characters don't match: delete from either string, take minimum
4. Return `dp[m][n]`

#### Code Implementation

````carousel
```python
class Solution:
    def minimumDeleteSum(self, s1: str, s2: str) -> int:
        m, n = len(s1), len(s2)
        
        # dp[i][j] = min ASCII sum to make s1[:i] and s2[:j] equal
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        
        # Initialize first row: delete all chars from s1
        for i in range(1, m + 1):
            dp[i][0] = dp[i - 1][0] + ord(s1[i - 1])
        
        # Initialize first column: delete all chars from s2
        for j in range(1, n + 1):
            dp[0][j] = dp[0][j - 1] + ord(s2[j - 1])
        
        # Fill DP table
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if s1[i - 1] == s2[j - 1]:
                    # Characters match, no deletion needed
                    dp[i][j] = dp[i - 1][j - 1]
                else:
                    # Delete either s1[i-1] or s2[j-1]
                    dp[i][j] = min(
                        dp[i - 1][j] + ord(s1[i - 1]),  # Delete from s1
                        dp[i][j - 1] + ord(s2[j - 1])   # Delete from s2
                    )
        
        return dp[m][n]
```

<!-- slide -->
```cpp
class Solution {
public:
    int minimumDeleteSum(string s1, string s2) {
        int m = s1.length();
        int n = s2.length();
        
        // dp[i][j] = min ASCII sum to make s1[:i] and s2[:j] equal
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
        
        // Initialize first row: delete all chars from s1
        for (int i = 1; i <= m; i++) {
            dp[i][0] = dp[i - 1][0] + s1[i - 1];
        }
        
        // Initialize first column: delete all chars from s2
        for (int j = 1; j <= n; j++) {
            dp[0][j] = dp[0][j - 1] + s2[j - 1];
        }
        
        // Fill DP table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (s1[i - 1] == s2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = min(
                        dp[i - 1][j] + s1[i - 1],  // Delete from s1
                        dp[i][j - 1] + s2[j - 1]   // Delete from s2
                    );
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
    public int minimumDeleteSum(String s1, String s2) {
        int m = s1.length();
        int n = s2.length();
        
        // dp[i][j] = min ASCII sum to make s1[:i] and s2[:j] equal
        int[][] dp = new int[m + 1][n + 1];
        
        // Initialize first row: delete all chars from s1
        for (int i = 1; i <= m; i++) {
            dp[i][0] = dp[i - 1][0] + s1.charAt(i - 1);
        }
        
        // Initialize first column: delete all chars from s2
        for (int j = 1; j <= n; j++) {
            dp[0][j] = dp[0][j - 1] + s2.charAt(j - 1);
        }
        
        // Fill DP table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.min(
                        dp[i - 1][j] + s1.charAt(i - 1),  // Delete from s1
                        dp[i][j - 1] + s2.charAt(j - 1)   // Delete from s2
                    );
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
 * @param {string} s1
 * @param {string} s2
 * @return {number}
 */
var minimumDeleteSum = function(s1, s2) {
    const m = s1.length;
    const n = s2.length;
    
    // dp[i][j] = min ASCII sum to make s1[:i] and s2[:j] equal
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    
    // Initialize first row: delete all chars from s1
    for (let i = 1; i <= m; i++) {
        dp[i][0] = dp[i - 1][0] + s1.charCodeAt(i - 1);
    }
    
    // Initialize first column: delete all chars from s2
    for (let j = 1; j <= n; j++) {
        dp[0][j] = dp[0][j - 1] + s2.charCodeAt(j - 1);
    }
    
    // Fill DP table
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (s1[i - 1] === s2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.min(
                    dp[i - 1][j] + s1.charCodeAt(i - 1),  // Delete from s1
                    dp[i][j - 1] + s2.charCodeAt(j - 1)   // Delete from s2
                );
            }
        }
    }
    
    return dp[m][n];
};
```
````

---

## Approach 2: Space-Optimized DP

Since each row only depends on the previous row, we can reduce space to O(n).

#### Algorithm

1. Use a 1D array instead of 2D
2. Iterate through the string and update the DP array
3. Need to be careful with the order of updates

#### Code Implementation

````carousel
```python
class Solution:
    def minimumDeleteSum(self, s1: str, s2: str) -> int:
        m, n = len(s1), len(s2)
        
        # Space-optimized: only keep previous row
        dp = [0] * (n + 1)
        
        # Initialize first column
        for j in range(1, n + 1):
            dp[j] = dp[j - 1] + ord(s2[j - 1])
        
        # Process each character in s1
        for i in range(1, m + 1):
            prev = dp[0]  # Save previous value
            dp[0] = dp[0] + ord(s1[i - 1])  # Update for empty s2
            
            for j in range(1, n + 1):
                temp = dp[j]  # Save current before update
                if s1[i - 1] == s2[j - 1]:
                    dp[j] = prev
                else:
                    dp[j] = min(
                        dp[j] + ord(s1[i - 1]),    # Delete from s1 (previous row)
                        dp[j - 1] + ord(s2[j - 1]) # Delete from s2 (current row)
                    )
                prev = temp  # Move to next column
        
        return dp[n]
```

<!-- slide -->
```cpp
class Solution {
public:
    int minimumDeleteSum(string s1, string s2) {
        int m = s1.length();
        int n = s2.length();
        
        // Space-optimized
        vector<int> dp(n + 1);
        
        // Initialize first column
        for (int j = 1; j <= n; j++) {
            dp[j] = dp[j - 1] + s2[j - 1];
        }
        
        // Process each character in s1
        for (int i = 1; i <= m; i++) {
            int prev = dp[0];
            dp[0] = dp[0] + s1[i - 1];
            
            for (int j = 1; j <= n; j++) {
                int temp = dp[j];
                if (s1[i - 1] == s2[j - 1]) {
                    dp[j] = prev;
                } else {
                    dp[j] = min(
                        dp[j] + s1[i - 1],
                        dp[j - 1] + s2[j - 1]
                    );
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
    public int minimumDeleteSum(String s1, String s2) {
        int m = s1.length();
        int n = s2.length();
        
        // Space-optimized
        int[] dp = new int[n + 1];
        
        // Initialize first column
        for (int j = 1; j <= n; j++) {
            dp[j] = dp[j - 1] + s2.charAt(j - 1);
        }
        
        // Process each character in s1
        for (int i = 1; i <= m; i++) {
            int prev = dp[0];
            dp[0] = dp[0] + s1.charAt(i - 1);
            
            for (int j = 1; j <= n; j++) {
                int temp = dp[j];
                if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
                    dp[j] = prev;
                } else {
                    dp[j] = Math.min(
                        dp[j] + s1.charAt(i - 1),
                        dp[j - 1] + s2.charAt(j - 1)
                    );
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
var minimumDeleteSum = function(s1, s2) {
    const m = s1.length;
    const n = s2.length;
    
    // Space-optimized
    let dp = new Array(n + 1).fill(0);
    
    // Initialize first column
    for (let j = 1; j <= n; j++) {
        dp[j] = dp[j - 1] + s2.charCodeAt(j - 1);
    }
    
    // Process each character in s1
    for (let i = 1; i <= m; i++) {
        let prev = dp[0];
        dp[0] = dp[0] + s1.charCodeAt(i - 1);
        
        for (let j = 1; j <= n; j++) {
            let temp = dp[j];
            if (s1[i - 1] === s2[j - 1]) {
                dp[j] = prev;
            } else {
                dp[j] = Math.min(
                    dp[j] + s1.charCodeAt(i - 1),
                    dp[j - 1] + s2.charCodeAt(j - 1)
                );
            }
            prev = temp;
        }
    }
    
    return dp[n];
};
```
````

---

## Approach 3: Find Maximum Common Subsequence ASCII Sum

Alternative perspective: find the Maximum ASCII Common Subsequence (MACS), then calculate delete cost.

#### Algorithm

1. Find maximum ASCII sum of common subsequence
2. Calculate total ASCII sum of both strings
3. Answer = total_sum - 2 * max_common_subsequence_sum

#### Code Implementation

````carousel
```python
class Solution:
    def minimumDeleteSum(self, s1: str, s2: str) -> int:
        m, n = len(s1), len(s2)
        
        # Find maximum ASCII sum of common subsequence
        # dp[i][j] = max ASCII sum of common subsequence in s1[:i], s2[:j]
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if s1[i - 1] == s2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1] + ord(s1[i - 1])
                else:
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
        
        # Total ASCII sum of both strings
        total_sum = sum(ord(c) for c in s1) + sum(ord(c) for c in s2)
        
        # Minimum delete sum = total - 2 * max common subsequence
        return total_sum - 2 * dp[m][n]
```

<!-- slide -->
```cpp
class Solution {
public:
    int minimumDeleteSum(string s1, string s2) {
        int m = s1.length();
        int n = s2.length();
        
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
        
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (s1[i - 1] == s2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + s1[i - 1];
                } else {
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        
        int total = 0;
        for (char c : s1) total += c;
        for (char c : s2) total += c;
        
        return total - 2 * dp[m][n];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minimumDeleteSum(String s1, String s2) {
        int m = s1.length();
        int n = s2.length();
        
        int[][] dp = new int[m + 1][n + 1];
        
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + s1.charAt(i - 1);
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        
        int total = 0;
        for (int i = 0; i < m; i++) total += s1.charAt(i);
        for (int i = 0; i < n; i++) total += s2.charAt(i);
        
        return total - 2 * dp[m][n];
    }
}
```

<!-- slide -->
```javascript
var minimumDeleteSum = function(s1, s2) {
    const m = s1.length;
    const n = s2.length;
    
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (s1[i - 1] === s2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + s1.charCodeAt(i - 1);
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    let total = 0;
    for (let i = 0; i < m; i++) total += s1.charCodeAt(i);
    for (let i = 0; i < n; i++) total += s2.charCodeAt(i);
    
    return total - 2 * dp[m][n];
};
```
````

---

## Complexity Analysis

| Approach | Time Complexity | Space Complexity |
|----------|-----------------|------------------|
| Standard DP | O(m × n) | O(m × n) |
| Space-Optimized | O(m × n) | O(n) |
| MACS Approach | O(m × n) | O(m × n) |

---

## Comparison of Approaches

| Aspect | Standard DP | Space-Optimized | MACS |
|--------|-------------|-----------------|------|
| **Time** | O(m × n) | O(m × n) | O(m × n) |
| **Space** | O(m × n) | O(n) | O(m × n) |
| **Intuition** | Direct DP | Optimize space | Inverse thinking |
| **Implementation** | Simple | Tricky | Simple |

---

## Why Dynamic Programming Works

### Understanding the Recurrence

```
dp[i][j] = minimum delete sum to make s1[:i] and s2[:j] equal

Case 1: s1[i-1] == s2[j-1]
  → Keep both characters, no deletion needed
  → dp[i][j] = dp[i-1][j-1]

Case 2: s1[i-1] != s2[j-1]
  → Delete s1[i-1]: dp[i-1][j] + ASCII(s1[i-1])
  → Delete s2[j-1]: dp[i][j-1] + ASCII(s2[j-1])
  → Choose minimum
  → dp[i][j] = min(dp[i-1][j] + ASCII(s1[i-1]), dp[i][j-1] + ASCII(s2[j-1]))
```

---

## Related Problems

### Same Pattern (LCS Variation)

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Longest Common Subsequence | [Link](https://leetcode.com/problems/longest-common-subsequence/) | Standard LCS |
| Delete Operation for Two Strings | [Link](https://leetcode.com/problems/delete-operation-for-two-strings/) | Without ASCII cost |
| Minimum ASCII Delete Sum for Two Strings | [Link](https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/) | Current problem |

### Similar DP Problems

| Problem | LeetCode Link | Related Technique |
|---------|---------------|-------------------|
| Edit Distance | [Link](https://leetcode.com/problems/edit-distance/) | Insert, delete, replace |
| Shortest Common Supersequence | [Link](https://leetcode.com/problems/shortest-common-supersequence/) | LCS-based |
| Longest Palindromic Subsequence | [Link](https://leetcode.com/problems/longest-palindromic-subsequence/) | LCS variation |

### Pattern Reference

For more detailed explanations of DP on strings, see:
- **[DP - 2D Array - Longest Common Subsequence Pattern](/patterns/dp-2d-array-longest-common-subsequence-lcs)**

---

## Video Tutorial Links

### Dynamic Programming Approach

- [NeetCode - Minimum ASCII Delete Sum](https://www.youtube.com/watch?v=0dHqX5h2l0Y) - Clear visual explanation
- [Back to Back SWE - Minimum ASCII Delete Sum](https://www.youtube.com/watch?v=2K5c7a6bG8g) - Detailed walkthrough

### LCS Variations

- [Longest Common Subsequence](https://www.youtube.com/watch?v=ASoaQqBFfoE) - Foundation for this problem
- [Edit Distance](https://www.youtube.com/watch?v=We3YTMF2FzI) - Similar DP approach

### General Resources

- [LeetCode Official Solution](https://www.youtube.com/watch?v=0iB2cK3v8cY) - Official explanation
- [Dynamic Programming on Strings](https://www.youtube.com/watch?v=n7o-5rB3kQ8) - DP patterns

---

## Follow-up Questions

### Q1: How would you modify the solution to handle uppercase letters as well?

**Answer:** The solution naturally handles any ASCII characters since we use `ord()` (or equivalent) to get the ASCII value. No modification needed.

---

### Q2: How would you return the actual deleted characters along with the sum?

**Answer:** Track the decisions made during DP. Use backtracking: when `s1[i-1] == s2[j-1]`, move diagonally. Otherwise, compare values and follow the path that gave the minimum.

---

### Q3: What if you want to minimize the number of deletions instead of ASCII sum?

**Answer:** This is the "Delete Operation for Two Strings" problem (LeetCode 583). Simply use 1 instead of ASCII value in the DP recurrence.

---

### Q4: How would you modify for 3 strings?

**Answer:** Use 3D DP: `dp[i][j][k]` for three strings. The time and space become O(m × n × o), which may be too expensive for large strings.

---

### Q5: Can you solve it using recursion with memoization?

**Answer:** Yes! Use a recursive function `dp(i, j)` that returns the minimum delete sum for `s1[i:]` and `s2[j:]`. Use memoization to avoid recomputation. This is essentially the same as the bottom-up approach but more intuitive.

---

### Q6: How would you handle Unicode characters?

**Answer:** Use Unicode code point values instead of ASCII. In Python, use `ord()` which handles Unicode. In other languages, ensure you're using the proper character encoding.

---

### Q7: What edge cases should be tested?

**Answer:**
- Empty strings (one or both)
- Single character strings
- Identical strings (should return 0)
- Completely different strings
- Strings with repeated characters
- Very long strings

---

## Pattern:

Dynamic Programming on Strings (LCS Variation)

This problem is a variation of **Longest Common Subsequence** with weighted costs. Instead of maximizing matches, we minimize ASCII delete sum.

---

## Common Pitfalls

### 1. Off-by-One Errors
**Issue:** Using wrong indices for accessing string characters.

**Solution:** Remember that `s1[i-1]` corresponds to `dp[i]` in the DP table.

### 2. Forgetting Base Cases
**Issue:** Not initializing the first row and column correctly.

**Solution:** Base case: to match empty string, delete all characters from the non-empty string.

### 3. Space Complexity
**Issue:** Using 2D array for large strings may cause memory issues.

**Solution:** Use space-optimized 1D DP array when m or n is large.

### 4. Character Comparison
**Issue:** Using wrong comparison operator.

**Solution:** Use `==` for character comparison, not `is` (in Python).

---

## Summary

The **Minimum ASCII Delete Sum for Two Strings** problem is a classic dynamic programming problem that extends the LCS concept with weighted costs:

- **Standard DP**: O(m×n) time and space
- **Space-optimized**: O(m×n) time, O(n) space
- **MACS Approach**: Alternative perspective using inverse logic

The key insight is that instead of maximizing matches (like LCS), we minimize the deletion cost. Each character has a "weight" equal to its ASCII value, and we choose the minimum cost path through the DP table.

### Pattern Summary

This problem exemplifies the **DP on Strings** pattern, characterized by:
- 2D DP table where dimensions match string lengths
- Character-by-character comparison
- Handling deletion as a decision
- Space optimization possible

For more details on string DP patterns, see the **[DP - 2D Array - Longest Common Subsequence Pattern](/patterns/dp-2d-array-longest-common-subsequence-lcs)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/discuss/) - Community solutions
- [LCS - GeeksforGeeks](https://www.geeksforgeeks.org/longest-common-subsequence/) - Foundation concept
- [Dynamic Programming - Steven Halim](https://www.youtube.com/watch?v=0dHqX5h2l0Y) - DP techniques
