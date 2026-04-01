## Edit Distance: Problem Forms

What are the variations and applications of edit distance?

<!-- front -->

---

### Longest Common Subsequence (LCS)

```python
def longest_common_subsequence(text1: str, text2: str) -> int:
    """
    Length of longest subsequence present in both strings
    """
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    return dp[m][n]

# Space optimized
def lcs_optimized(text1: str, text2: str) -> int:
    if len(text1) < len(text2):
        text1, text2 = text2, text1
    
    prev = [0] * (len(text2) + 1)
    curr = [0] * (len(text2) + 1)
    
    for i in range(1, len(text1) + 1):
        for j in range(1, len(text2) + 1):
            if text1[i-1] == text2[j-1]:
                curr[j] = prev[j-1] + 1
            else:
                curr[j] = max(prev[j], curr[j-1])
        prev, curr = curr, prev
    
    return prev[len(text2)]
```

---

### Minimum ASCII Delete Sum

```python
def minimum_delete_sum(s1: str, s2: str) -> int:
    """
    Make strings equal by deleting chars, minimize sum of ASCII values
    """
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Base cases: delete all from one string
    for i in range(1, m + 1):
        dp[i][0] = dp[i-1][0] + ord(s1[i-1])
    for j in range(1, n + 1):
        dp[0][j] = dp[0][j-1] + ord(s2[j-1])
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = min(
                    dp[i-1][j] + ord(s1[i-1]),  # Delete from s1
                    dp[i][j-1] + ord(s2[j-1])   # Delete from s2
                )
    
    return dp[m][n]
```

---

### Delete Operation for Two Strings

```python
def min_distance_delete_only(word1: str, word2: str) -> int:
    """
    Minimum deletions to make strings equal
    = (len1 - LCS) + (len2 - LCS) = len1 + len2 - 2*LCS
    """
    lcs_len = longest_common_subsequence(word1, word2)
    return len(word1) + len(word2) - 2 * lcs_len
```

---

### One Edit Distance

```python
def is_one_edit_distance(s: str, t: str) -> bool:
    """
    Check if strings differ by exactly one operation
    """
    m, n = len(s), len(t)
    
    if abs(m - n) > 1:
        return False
    
    found_diff = False
    i = j = 0
    
    while i < m and j < n:
        if s[i] != t[j]:
            if found_diff:
                return False
            found_diff = True
            
            if m > n:
                i += 1  # Delete from s
            elif m < n:
                j += 1  # Insert to s
            else:
                i += 1  # Replace
                j += 1
        else:
            i += 1
            j += 1
    
    # Check for difference at end
    return found_diff or (i < m or j < n)
```

---

### Edit Distance with Path Reconstruction

```python
def edit_distance_with_path(word1: str, word2: str):
    """
    Returns (distance, list of operations)
    """
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Fill DP table
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
    
    # Backtrack to find operations
    operations = []
    i, j = m, n
    
    while i > 0 or j > 0:
        if i > 0 and j > 0 and word1[i-1] == word2[j-1]:
            operations.append(('match', word1[i-1]))
            i -= 1
            j -= 1
        elif i > 0 and j > 0 and dp[i][j] == dp[i-1][j-1] + 1:
            operations.append(('replace', word1[i-1], word2[j-1]))
            i -= 1
            j -= 1
        elif i > 0 and dp[i][j] == dp[i-1][j] + 1:
            operations.append(('delete', word1[i-1]))
            i -= 1
        else:
            operations.append(('insert', word2[j-1]))
            j -= 1
    
    return dp[m][n], list(reversed(operations))
```

<!-- back -->
