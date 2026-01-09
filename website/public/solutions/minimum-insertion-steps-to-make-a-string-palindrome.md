# Minimum Insertion Steps To Make A String Palindrome

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

## Solution

```python
class Solution:
    def minInsertions(self, s: str) -> int:
        """
        Find minimum insertions to make string palindrome using DP.
        
        dp[i][j] = minimum insertions needed for substring s[i..j]
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

---

## Explanation

This problem uses dynamic programming to find the minimum insertions to make the string a palindrome.

1. **Define DP state**: `dp[i][j]` represents the minimum insertions needed for substring `s[i..j]`.

2. **Base case**: For substrings of length 1, `dp[i][i] = 0` (single character is already palindrome).

3. **Fill DP table**: For longer substrings:
   - If `s[i] == s[j]`, characters match: `dp[i][j] = dp[i+1][j-1]`
   - Otherwise: `dp[i][j] = 1 + min(dp[i+1][j], dp[i][j-1])`

4. **Return result**: `dp[0][n-1]` gives the minimum insertions for the entire string.

---

## Complexity Analysis

- **Time Complexity:** O(n²), where n is the string length
- **Space Complexity:** O(n²), for the DP table
