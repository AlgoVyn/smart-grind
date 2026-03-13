# Minimum Insertion Steps To Make A String Palindrome

## LeetCode Link

[Minimum Insertion Steps to Make a String Palindrome - LeetCode](https://leetcode.com/problems/minimum-insertion-steps-to-make-a-string-palindrome/)

---

## Problem Description

Given a string `s`. In one step you can insert any character at any index of the string. Return the minimum number of steps to make `s` palindrome.

A **Palindrome String** is one that reads the same backward as well as forward.

---

## Examples

### Example 1

**Input:**
```python
s = "zzazz"
```

**Output:**
```python
0
```

**Explanation:**
The string "zzazz" is already palindrome, we do not need any insertions.

### Example 2

**Input:**
```python
s = "mbadm"
```

**Output:**
```python
2
```

**Explanation:**
String can be "mbdadbm" or "mdbabdm".
- Insert 'd' after 'm': "mdbadm" 
- Insert 'b' before last 'm': "mdbabdm"

### Example 3

**Input:**
```python
s = "leetcode"
```

**Output:**
```python
5
```

**Explanation:**
Inserting 5 characters, the string becomes "leetcodocteel".

---

## Constraints

- `1 <= s.length <= 500`
- `s` consists of lowercase English letters

---

## Pattern: Dynamic Programming on Strings (Longest Palindromic Subsequence)

This problem is a variation of the **Longest Palindromic Subsequence** problem. The key insight is:
- Minimum insertions = n - LPS (where LPS is the length of longest palindromic subsequence)
- We use DP where `dp[i][j]` represents min insertions for substring s[i..j]

---

## Intuition

The key insight for this problem is understanding the relationship between making a string palindrome through insertions and finding the **Longest Palindromic Subsequence (LPS)**.

### Key Observations

1. **LPS Relationship**: If we find the longest palindromic subsequence in the string, we only need to insert characters to make the non-LPS characters match. 
   - Minimum insertions = n - LPS_length

2. **Recursive Structure**: For substring s[i..j]:
   - If s[i] == s[j], we can skip both: dp[i][j] = dp[i+1][j-1]
   - If they don't match, we must insert one character to match: dp[i][j] = 1 + min(dp[i+1][j], dp[i][j-1])

3. **Base Cases**:
   - Single character: dp[i][i] = 0 (already palindrome)
   - Two characters: If equal, dp[i][i+1] = 0; if not, dp[i][i+1] = 1

4. **Two Ways to Think**:
   - Direct DP on substrings (what we'll implement)
   - LPS approach: min insertions = n - LPS

### Algorithm Overview

1. **Initialize DP table**: Create n×n table
2. **Fill by increasing length**: Process substrings from length 1 to n
3. **Apply recurrence**: Use the recurrence relation based on character matching
4. **Return answer**: dp[0][n-1]

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Dynamic Programming (2D)** - Standard solution
2. **Dynamic Programming with Space Optimization** - O(n) space

---

## Approach 1: Dynamic Programming (2D) - Optimal

### Algorithm Steps

1. Create a 2D DP array of size n×n, initialized to 0
2. Fill the DP table for substrings of increasing length (2 to n)
3. For each substring s[i..j]:
   - If s[i] == s[j]: dp[i][j] = dp[i+1][j-1]
   - Else: dp[i][j] = 1 + min(dp[i+1][j], dp[i][j-1])
4. Return dp[0][n-1]

### Why It Works

The dynamic programming approach works because of optimal substructure. The minimum insertions for a substring depends only on smaller substrings. When characters match, we can include both in the palindrome. When they don't match, we must insert a character to match one of them.

### Code Implementation

````carousel
```python
class Solution:
    def minInsertions(self, s: str) -> int:
        """
        Find minimum insertions to make string palindrome using DP.
        
        dp[i][j] = minimum insertions needed for substring s[i..j]
        
        Args:
            s: Input string
            
        Returns:
            Minimum number of insertions to make palindrome
        """
        n = len(s)
        dp = [[0] * n for _ in range(n)]
        
        # Fill DP table for substrings of increasing length
        for length in range(2, n + 1):
            for i in range(n - length + 1):
                j = i + length - 1
                if s[i] == s[j]:
                    dp[i][j] = dp[i + 1][j - 1]
                else:
                    dp[i][j] = 1 + min(dp[i + 1][j], dp[i][j - 1])
        
        return dp[0][n - 1]
```

<!-- slide -->
```cpp
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int minInsertions(string s) {
        int n = s.length();
        vector<vector<int>> dp(n, vector<int>(n, 0));
        
        // Fill DP table for substrings of increasing length
        for (int length = 2; length <= n; length++) {
            for (int i = 0; i + length <= n; i++) {
                int j = i + length - 1;
                if (s[i] == s[j]) {
                    dp[i][j] = dp[i + 1][j - 1];
                } else {
                    dp[i][j] = 1 + min(dp[i + 1][j], dp[i][j - 1]);
                }
            }
        }
        
        return dp[0][n - 1];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minInsertions(String s) {
        int n = s.length();
        int[][] dp = new int[n][n];
        
        // Fill DP table for substrings of increasing length
        for (int length = 2; length <= n; length++) {
            for (int i = 0; i + length <= n; i++) {
                int j = i + length - 1;
                if (s.charAt(i) == s.charAt(j)) {
                    dp[i][j] = dp[i + 1][j - 1];
                } else {
                    dp[i][j] = 1 + Math.min(dp[i + 1][j], dp[i][j - 1]);
                }
            }
        }
        
        return dp[0][n - 1];
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} s
 * @return {number}
 */
var minInsertions = function(s) {
    const n = s.length;
    const dp = Array.from({ length: n }, () => Array(n).fill(0));
    
    // Fill DP table for substrings of increasing length
    for (let length = 2; length <= n; length++) {
        for (let i = 0; i + length <= n; i++) {
            const j = i + length - 1;
            if (s[i] === s[j]) {
                dp[i][j] = dp[i + 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(dp[i + 1][j], dp[i][j - 1]);
            }
        }
    }
    
    return dp[0][n - 1];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - We fill each cell in the n×n table |
| **Space** | O(n²) - We store the entire DP table |

---

## Approach 2: Space-Optimized Dynamic Programming

### Algorithm Steps

1. Use a 1D DP array instead of 2D
2. Iterate through the string, maintaining the previous row's values
3. Apply the same recurrence relation

### Why It Works

We only need the previous row's values to compute the current row. This reduces space complexity while maintaining the same time complexity.

### Code Implementation

````carousel
```python
class Solution:
    def minInsertions(self, s: str) -> int:
        """
        Find minimum insertions using space-optimized DP.
        """
        n = len(s)
        dp = [0] * n
        
        # Iterate from right to left
        for i in range(n - 1, -1, -1):
            prev = 0  # dp[i+1][i] = 0 (empty)
            for j in range(i + 1, n):
                temp = dp[j]
                if s[i] == s[j]:
                    dp[j] = prev
                else:
                    dp[j] = 1 + min(dp[j], dp[j - 1])
                prev = temp
        
        return dp[n - 1]
```

<!-- slide -->
```cpp
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int minInsertions(string s) {
        int n = s.length();
        vector<int> dp(n, 0);
        
        // Iterate from right to left
        for (int i = n - 1; i >= 0; i--) {
            int prev = 0;
            for (int j = i + 1; j < n; j++) {
                int temp = dp[j];
                if (s[i] == s[j]) {
                    dp[j] = prev;
                } else {
                    dp[j] = 1 + min(dp[j], dp[j - 1]);
                }
                prev = temp;
            }
        }
        
        return dp[n - 1];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minInsertions(String s) {
        int n = s.length();
        int[] dp = new int[n];
        
        // Iterate from right to left
        for (int i = n - 1; i >= 0; i--) {
            int prev = 0;
            for (int j = i + 1; j < n; j++) {
                int temp = dp[j];
                if (s.charAt(i) == s.charAt(j)) {
                    dp[j] = prev;
                } else {
                    dp[j] = 1 + Math.min(dp[j], dp[j - 1]);
                }
                prev = temp;
            }
        }
        
        return dp[n - 1];
    }
}
```

<!-- slide -->
```javascript
var minInsertions = function(s) {
    const n = s.length;
    const dp = new Array(n).fill(0);
    
    // Iterate from right to left
    for (let i = n - 1; i >= 0; i--) {
        let prev = 0;
        for (let j = i + 1; j < n; j++) {
            const temp = dp[j];
            if (s[i] === s[j]) {
                dp[j] = prev;
            } else {
                dp[j] = 1 + Math.min(dp[j], dp[j - 1]);
            }
            prev = temp;
        }
    }
    
    return dp[n - 1];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - Same as 2D DP |
| **Space** | O(n) - Only storing one row |

---

## Comparison of Approaches

| Aspect | Approach 1 (2D DP) | Approach 2 (Space Optimized) |
|--------|-------------------|----------------------------|
| **Time Complexity** | O(n²) | O(n²) |
| **Space Complexity** | O(n²) | O(n) |
| **Implementation** | Simple | Moderate |
| **LeetCode Optimal** | ✅ | ✅ |

**Best Approach:** Use either approach. Approach 2 saves space but is slightly harder to understand.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Google, Meta, Amazon, Microsoft
- **Difficulty**: Medium
- **Concepts Tested**: Dynamic Programming, String Manipulation, LPS

### Learning Outcomes

1. **String DP**: Master dynamic programming on strings
2. **LPS Relationship**: Understand connection to Longest Palindromic Subsequence
3. **Space Optimization**: Learn to reduce space from O(n²) to O(n)
4. **State Transitions**: Perfect the art of defining DP states

---

## Related Problems

### Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Longest Palindromic Subsequence | [Link](https://leetcode.com/problems/longest-palindromic-subsequence/) | Core related problem |
| Palindrome Partitioning II | [Link](https://leetcode.com/problems/palindrome-partitioning-ii/) | Similar DP |
| Shortest Palindrome | [Link](https://leetcode.com/problems/shortest-palindrome/) | Related problem |
| Valid Palindrome II | [Link](https://leetcode.com/problems/valid-palindrome-ii/) | Similar concept |
| Minimum Delete Sum | [Link](https://leetcode.com/problems/minimum-insertions-to-make-a-string-palindrome/) | Variation |

### Pattern Reference

For more detailed explanations of Dynamic Programming patterns, see:
- **[Dynamic Programming Pattern](/patterns/dynamic-programming)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Minimum Insertion Steps](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Clear explanation with visual examples
2. **[Dynamic Programming on Strings](https://www.youtube.com/watch?v=8grsX-cB0jU)** - String DP patterns
3. **[LPS Problem Explained](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Understanding LPS

### Related Concepts

- **[Longest Palindromic Subsequence](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Core concept
- **[String DP Patterns](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Common patterns

---

## Follow-up Questions

### Q1: How would you reconstruct the actual insertions needed?

**Answer:** Maintain a separate 2D array that stores which choice was made at each step (match, insert left, or insert right). Then backtrack from dp[0][n-1] to reconstruct the palindrome string with insertions.

---

### Q2: How does this problem relate to Longest Common Subsequence?

**Answer:** This problem is equivalent to: n - LCS(s, reverse(s)). The longest palindromic subsequence is the LCS between the string and its reverse. So min insertions = n - LPS = n - LCS(s, reverse(s)).

---

### Q3: Can you solve this using a greedy approach?

**Answer:** No, greedy doesn't work here. For "mbadm", greedy might incorrectly insert 'd' first. Dynamic programming is necessary because local optimal choices don't lead to global optimal solution.

---

### Q4: How would you modify to find minimum deletions instead of insertions?

**Answer:** Minimum deletions to make palindrome = n - LPS. This is actually simpler! You'd use the same DP but subtract from n.

---

### Q5: What if we could insert characters at any position, not just at the ends?

**Answer:** That's exactly what this problem allows! Insertions can be anywhere in the string, which is why the DP approach considers all possible positions.

---

### Q6: How does space optimization work in the 2D to 1D transition?

**Answer:** When filling row i, we need values from row i+1 (current dp[j]) and the current row (dp[j-1]). We use a `prev` variable to track dp[i+1][j-1] (the diagonal value).

---

## Common Pitfalls

### 1. Index Confusion
**Issue**: When comparing s[i] and s[j], ensure indices don't go out of bounds (i+1 <= j-1).

**Solution**: The DP recurrence handles this automatically - when length is 2 and s[i] != s[j], dp[i+1][j-1] refers to dp[i+1][i] which is 0 (empty string).

### 2. Wrong Base Case
**Issue**: Substrings of length 1 need 0 insertions, length 2 need 1 if chars differ.

**Solution**: Initialize the DP correctly. Single character (i == j) is always 0. The loop starting from length = 2 handles the length-2 case.

### 3. Space Optimization Errors
**Issue**: O(n²) space can be optimized to O(n) using 1D DP incorrectly.

**Solution**: Use a `prev` variable to track the diagonal value (dp[i+1][j-1]) from the previous iteration.

---

## Summary

The **Minimum Insertion Steps to Make a String Palindrome** problem demonstrates the power of **Dynamic Programming on Strings**.

Key takeaways:
1. The problem is equivalent to: n - LPS (Longest Palindromic Subsequence)
2. DP state: dp[i][j] = min insertions for substring s[i..j]
3. If s[i] == s[j]: dp[i][j] = dp[i+1][j-1]
4. Else: dp[i][j] = 1 + min(dp[i+1][j], dp[i][j-1])
5. Space can be optimized from O(n²) to O(n)

This problem is essential for understanding string DP and forms the foundation for more complex palindrome problems.

### Pattern Summary

This problem exemplifies the **String DP** pattern, characterized by:
- Using 2D DP tables for substrings
- Building solutions from smaller substrings to larger ones
- Handling character matching and mismatching differently
- Space optimization through 1D arrays

For more details on this pattern and its variations, see the **[Dynamic Programming Pattern](/patterns/dynamic-programming)**.

---

## Additional Resources

- [LeetCode Problem 1312](https://leetcode.com/problems/minimum-insertion-steps-to-make-a-string-palindrome/) - Official problem page
- [Longest Palindromic Subsequence - GeeksforGeeks](https://www.geeksforgeeks.org/longest-palindromic-subsequence/) - LPS explanation
- [Dynamic Programming on Strings](https://leetcode.com/explore/learn/card/dynamic-programming/) - LeetCode DP explore module
- [Pattern: Dynamic Programming](/patterns/dynamic-programming) - Comprehensive pattern guide
