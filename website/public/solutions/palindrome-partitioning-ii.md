# Palindrome Partitioning II

## Problem Description

Given a string `s`, partition `s` such that every substring of the partition is a palindrome.
Return the minimum cuts needed for a palindrome partitioning of `s`.

### Example 1

**Input:** `s = "aab"`  
**Output:** `1`

**Explanation:** The palindrome partitioning `["aa","b"]` could be produced using 1 cut.

### Example 2

**Input:** `s = "a"`  
**Output:** `0`

### Example 3

**Input:** `s = "ab"`  
**Output:** `1`

### Constraints

- `1 <= s.length <= 2000`
- `s` consists of lowercase English letters only.

## Solution

```python
class Solution:
    def minCut(self, s: str) -> int:
        n = len(s)
        is_pal = [[False] * n for _ in range(n)]
        
        # Precompute palindromes
        for i in range(n):
            is_pal[i][i] = True
        for i in range(n - 1):
            if s[i] == s[i + 1]:
                is_pal[i][i + 1] = True
        for length in range(3, n + 1):
            for i in range(n - length + 1):
                j = i + length - 1
                if s[i] == s[j] and is_pal[i + 1][j - 1]:
                    is_pal[i][j] = True
        
        # DP for min cuts
        dp = [float('inf')] * (n + 1)
        dp[0] = 0
        for i in range(1, n + 1):
            for j in range(i):
                if is_pal[j][i - 1]:
                    dp[i] = min(dp[i], dp[j] + 1)
        return dp[n] - 1
```

## Explanation

To find the minimum cuts needed for palindrome partitioning, precompute all palindromic substrings, then use DP where `dp[i]` is the min cuts for `s[0..i-1]`.

### Step-by-step Approach

1. Use a 2D array to mark palindromic substrings: single chars, two same chars, and longer by checking ends and middle.
2. Initialize `dp[0] = 0`, `dp[i] = inf`.
3. For each `i`, check all `j < i` where `s[j..i-1]` is palindrome, update `dp[i] = min(dp[i], dp[j] + 1)`.
4. Return `dp[n] - 1`, since no cut needed for the whole string if palindrome.

### Complexity Analysis

- **Time Complexity:** O(n^2) for both palindrome check and DP.
- **Space Complexity:** O(n^2) for `is_pal` matrix.
