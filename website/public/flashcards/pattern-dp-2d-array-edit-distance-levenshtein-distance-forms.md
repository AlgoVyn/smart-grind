## DP - 2D Array Edit Distance: Problem Forms

What are the variations and extensions of edit distance problems?

<!-- front -->

---

### Form 1: One Edit Distance Check

**Problem:** Is the edit distance exactly/at most 1?

```python
def is_one_edit_distance(s1: str, s2: str) -> bool:
    """
    Check if strings differ by exactly one operation.
    Optimized O(min(m, n)) solution.
    """
    m, n = len(s1), len(s2)
    
    # Length difference more than 1 → more than 1 edit
    if abs(m - n) > 1:
        return False
    
    # Ensure s1 is the longer or equal string
    if m < n:
        return is_one_edit_distance(s2, s1)
    
    found_diff = False
    i = j = 0
    
    while i < m and j < n:
        if s1[i] != s2[j]:
            if found_diff:
                return False  # Second difference
            found_diff = True
            
            if m == n:
                # Same length → replacement
                i += 1
                j += 1
            else:
                # s1 longer → deletion from s1
                i += 1
        else:
            i += 1
            j += 1
    
    # If one string longer by 1, need that final deletion
    return found_diff or (m != n)

# Follow-up: is_at_most_k_distance?
def is_at_most_k_distance(s1, s2, k):
    """Can early terminate if distance exceeds k."""
    # Can use bounded DP with early termination
    pass
```

---

### Form 2: Delete Operation for Two Strings

**Problem:** Minimum deletions to make two strings equal.

```python
def min_delete_sum(s1: str, s2: str) -> int:
    """
    Minimum ASCII delete sum to make two strings equal.
    LeetCode 712 - Minimum ASCII Delete Sum for Two Strings.
    """
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Base cases: delete all characters
    for i in range(1, m + 1):
        dp[i][0] = dp[i-1][0] + ord(s1[i-1])
    for j in range(1, n + 1):
        dp[0][j] = dp[0][j-1] + ord(s2[j-1])
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1]  # Keep this character
            else:
                # Delete from s1 or s2, take min cost
                dp[i][j] = min(
                    dp[i-1][j] + ord(s1[i-1]),  # Delete from s1
                    dp[i][j-1] + ord(s2[j-1])   # Delete from s2
                )
    
    return dp[m][n]


def min_deletions_to_equal(s1, s2):
    """
    Minimum number of deletions (not weighted).
    Equivalent to: len(s1) + len(s2) - 2*LCS(s1, s2)
    """
    # Just count deletions, not ASCII sum
    m, n = len(s1), len(s2)
    # ... same structure but +1 instead of +ord(...)
    pass
```

---

### Form 3: Shortest Common Supersequence

**Problem:** Find shortest string that has both s1 and s2 as subsequences.

```python
def shortest_common_supersequence(s1: str, s2: str) -> str:
    """
    Construct shortest string containing both s1 and s2 as subsequences.
    LeetCode 1092 - Shortest Common Supersequence.
    """
    # First find LCS
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    # Backtrack to construct SCS
    i, j = m, n
    result = []
    
    while i > 0 and j > 0:
        if s1[i-1] == s2[j-1]:
            result.append(s1[i-1])
            i -= 1
            j -= 1
        elif dp[i-1][j] > dp[i][j-1]:
            result.append(s1[i-1])
            i -= 1
        else:
            result.append(s2[j-1])
            j -= 1
    
    # Add remaining characters
    while i > 0:
        result.append(s1[i-1])
        i -= 1
    while j > 0:
        result.append(s2[j-1])
        j -= 1
    
    return ''.join(reversed(result))

# Length of SCS: len(s1) + len(s2) - LCS(s1, s2)
```

---

### Form 4: Edit Distance with Transposition

**Problem:** Allow swapping adjacent characters (Damerau-Levenshtein).

```python
def damerau_levenshtein(s1: str, s2: str) -> int:
    """
    Edit distance with insert, delete, replace, and transpose (swap adjacent).
    """
    m, n = len(s1), len(s2)
    # Need 3 rows to detect transposition
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            cost = 0 if s1[i-1] == s2[j-1] else 1
            dp[i][j] = min(
                dp[i-1][j] + 1,      # Delete
                dp[i][j-1] + 1,      # Insert
                dp[i-1][j-1] + cost  # Replace
            )
            
            # Check for transposition
            if i > 1 and j > 1 and s1[i-1] == s2[j-2] and s1[i-2] == s2[j-1]:
                dp[i][j] = min(dp[i][j], dp[i-2][j-2] + cost)
    
    return dp[m][n]
```

---

### Form 5: Longest Palindromic Subsequence via Edit Distance

**Problem:** Find LPS by comparing string with its reverse.

```python
def longest_palindromic_subsequence(s: str) -> int:
    """
    LPS = LCS(s, reverse(s))
    """
    return lcs(s, s[::-1])


def min_insertions_to_palindrome(s: str) -> int:
    """
    Minimum insertions to make palindrome = len(s) - LPS(s)
    """
    return len(s) - longest_palindromic_subsequence(s)


def min_deletions_to_palindrome(s: str) -> int:
    """
    Minimum deletions to make palindrome = len(s) - LPS(s)
    Same as insertions (symmetric)
    """
    return len(s) - longest_palindromic_subsequence(s)
```

---

### Form 6: Wildcard/Regex Matching

**Problem:** Pattern matching with special characters.

```python
def is_match_regex(s: str, p: str) -> bool:
    """
    Regex matching with . and *.
    '.' matches any single character.
    '*' matches zero or more of the preceding element.
    """
    m, n = len(s), len(p)
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True  # Empty matches empty
    
    # Handle patterns like a*, a*b*, etc.
    for j in range(2, n + 1):
        if p[j-1] == '*':
            dp[0][j] = dp[0][j-2]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if p[j-1] == '.' or p[j-1] == s[i-1]:
                dp[i][j] = dp[i-1][j-1]
            elif p[j-1] == '*':
                # * can match zero or more of p[j-2]
                dp[i][j] = dp[i][j-2]  # Zero occurrences
                if p[j-2] == '.' or p[j-2] == s[i-1]:
                    dp[i][j] = dp[i][j] or dp[i-1][j]  # One+ occurrences
    
    return dp[m][n]
```

---

### Form 7: Approximate String Matching

**Problem:** Find all occurrences of pattern in text with at most k errors.

```python
def approximate_match(text: str, pattern: str, k: int) -> list[int]:
    """
    Find all positions where pattern matches text
    with at most k edit distance.
    """
    # This requires column-by-column DP with sliding window
    # Too complex for standard interview, but good to know exists
    results = []
    n, m = len(text), len(pattern)
    
    # DP[i] = edit distance for pattern[0..i-1] vs current text window
    # Update column by column as we slide through text
    
    for start in range(n - m + k + 1):
        dist = edit_distance(text[start:start+m+k], pattern)
        if dist <= k:
            results.append(start)
    
    return results
```

<!-- back -->
