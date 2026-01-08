# Minimum Insertion Steps To Make A String Palindrome

## Problem Description
[Link to problem](https://leetcode.com/problems/minimum-insertion-steps-to-make-a-string-palindrome/)

Given a string s. In one step you can insert any character at any index of the string.
Return the minimum number of steps to make s palindrome.
A Palindrome String is one that reads the same backward as well as forward.
 
Example 1:

Input: s = "zzazz"
Output: 0
Explanation: The string "zzazz" is already palindrome we do not need any insertions.

Example 2:

Input: s = "mbadm"
Output: 2
Explanation: String can be "mbdadbm" or "mdbabdm".

Example 3:

Input: s = "leetcode"
Output: 5
Explanation: Inserting 5 characters the string becomes "leetcodocteel".

 
Constraints:

1 <= s.length <= 500
s consists of lowercase English letters.


## Solution

```python
class Solution:
    def minInsertions(self, s: str) -> int:
        n = len(s)
        dp = [[0] * n for _ in range(n)]
        for length in range(2, n + 1):
            for i in range(n - length + 1):
                j = i + length - 1
                if s[i] == s[j]:
                    dp[i][j] = dp[i + 1][j - 1]
                else:
                    dp[i][j] = 1 + min(dp[i + 1][j], dp[i][j - 1])
        return dp[0][n - 1]
```

## Explanation
This problem uses dynamic programming to find the minimum insertions to make the string a palindrome.

1. Define dp[i][j] as the minimum insertions needed for substring s[i..j].

2. For substrings of length 1, dp[i][i] = 0.

3. For longer substrings, if s[i] == s[j], dp[i][j] = dp[i+1][j-1].

4. Otherwise, dp[i][j] = 1 + min(dp[i+1][j], dp[i][j-1]).

5. Fill the DP table for increasing lengths.

6. The result is dp[0][n-1].

Time complexity: O(n^2), where n is the string length.
Space complexity: O(n^2), for the DP table.
