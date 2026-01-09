# Minimum ASCII Delete Sum for Two Strings

## Problem Description

Given two strings `s1` and `s2`, return the **lowest ASCII sum of deleted characters** required to make the two strings equal.

In other words, find the minimum sum of ASCII values of characters that need to be deleted from both strings so that they become identical.

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

## Constraints

- `1 <= s1.length, s2.length <= 1000`
- `s1` and `s2` consist of lowercase English letters

## Solution

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

## Explanation

This is a classic **dynamic programming** problem using Longest Common Subsequence (LCS) with ASCII costs:

1. **Define `dp[i][j]`**: Minimum ASCII delete sum to make `s1[:i]` and `s2[:j]` equal.

2. **Base cases**:
   - `dp[i][0]` = sum of ASCII values of `s1[:i]` (delete all from `s1`)
   - `dp[0][j]` = sum of ASCII values of `s2[:j]` (delete all from `s2`)

3. **Recurrence relation**:
   - If `s1[i-1] == s2[j-1]`: No deletion needed → `dp[i][j] = dp[i-1][j-1]`
   - Otherwise: Delete either `s1[i-1]` or `s2[j-1]`
     - `dp[i][j] = min(dp[i-1][j] + ASCII(s1[i-1]), dp[i][j-1] + ASCII(s2[j-1]))`

4. **Result**: `dp[m][n]` contains the minimum delete sum for full strings.

## Complexity Analysis

| Metric | Complexity |
|--------|------------|
| Time | `O(m * n)` — where `m` and `n` are the lengths of `s1` and `s2` |
| Space | `O(m * n)` — for the DP table |
