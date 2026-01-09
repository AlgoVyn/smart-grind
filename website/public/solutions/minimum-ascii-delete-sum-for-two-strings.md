# Minimum Ascii Delete Sum For Two Strings

## Problem Description
Given two strings s1 and s2, return the lowest ASCII sum of deleted characters to make two strings equal.
 
Example 1:

Input: s1 = "sea", s2 = "eat"
Output: 231
Explanation: Deleting "s" from "sea" adds the ASCII value of "s" (115) to the sum.
Deleting "t" from "eat" adds 116 to the sum.
At the end, both strings are equal, and 115 + 116 = 231 is the minimum sum possible to achieve this.

Example 2:

Input: s1 = "delete", s2 = "leet"
Output: 403
Explanation: Deleting "dee" from "delete" to turn the string into "let",
adds 100[d] + 101[e] + 101[e] to the sum.
Deleting "e" from "leet" adds 101[e] to the sum.
At the end, both strings are equal to "let", and the answer is 100+101+101+101 = 403.
If instead we turned both strings into "lee" or "eet", we would get answers of 433 or 417, which are higher.

 
Constraints:

1 <= s1.length, s2.length <= 1000
s1 and s2 consist of lowercase English letters.
## Solution

```python
class Solution:
    def minimumDeleteSum(self, s1: str, s2: str) -> int:
        m, n = len(s1), len(s2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(1, m + 1):
            dp[i][0] = dp[i - 1][0] + ord(s1[i - 1])
        for j in range(1, n + 1):
            dp[0][j] = dp[0][j - 1] + ord(s2[j - 1])
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if s1[i - 1] == s2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1]
                else:
                    dp[i][j] = min(dp[i - 1][j] + ord(s1[i - 1]), dp[i][j - 1] + ord(s2[j - 1]))
        return dp[m][n]
```

## Explanation
This problem uses dynamic programming to find the minimum ASCII sum of deletions to make two strings equal.

1. Define dp[i][j] as the minimum cost to make s1[:i] and s2[:j] equal by deleting characters.

2. Initialize dp[i][0] as the sum of ASCII values of s1[:i], and dp[0][j] for s2[:j].

3. For each i, j:
   - If s1[i-1] == s2[j-1], dp[i][j] = dp[i-1][j-1] (no deletion needed for these characters).
   - Else, dp[i][j] = min(dp[i-1][j] + ord(s1[i-1]), dp[i][j-1] + ord(s2[j-1])).

4. The result is dp[m][n].

Time complexity: O(m * n), where m and n are the lengths of s1 and s2.
Space complexity: O(m * n), for the DP table.
