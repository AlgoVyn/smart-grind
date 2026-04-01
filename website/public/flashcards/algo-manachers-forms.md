## Title: Manacher's Forms

What are the different forms and applications of palindrome algorithms?

<!-- front -->

---

### Palindrome Algorithms
| Algorithm | Time | Use Case |
|-----------|------|----------|
| Expand around center | O(n²) | Simple, short strings |
| Manacher's | O(n) | All palindromes, longest |
| Rolling hash | O(n) | Compare substrings quickly |
| Suffix array | O(n log n) | General substring queries |

### Count Palindromes
```python
def count_palindromic_substrings(s):
    """Count all palindromic substrings"""
    t, d = manacher(s)
    
    count = 0
    for radius in d:
        # In transformed string, odd positions are original chars
        # radius gives number of valid positions
        # Each valid radius contributes to palindromes centered there
        count += radius // 2
    
    return count
```

---

### Longest Palindromic Subsequence vs Substring
| Problem | Solution | Time |
|---------|----------|------|
| Longest Palindromic Substring | Manacher's | O(n) |
| Longest Palindromic Subsequence | LCS with reverse | O(n²) |

```python
def longest_palindromic_subsequence(s):
    """Not necessarily contiguous"""
    n = len(s)
    dp = [[0] * n for _ in range(n)]
    
    for i in range(n-1, -1, -1):
        dp[i][i] = 1
        for j in range(i+1, n):
            if s[i] == s[j]:
                dp[i][j] = dp[i+1][j-1] + 2
            else:
                dp[i][j] = max(dp[i+1][j], dp[i][j-1])
    
    return dp[0][n-1]
```

---

### Palindrome Factorization
```python
def min_palindrome_cuts(s):
    """Minimum cuts to partition into palindromes"""
    t, d = manacher(s)
    n = len(s)
    
    # is_pal[i][j] or use Manacher results
    cuts = [float('inf')] * (n + 1)
    cuts[0] = -1  # base case
    
    for i in range(1, n + 1):
        for j in range(i):
            if is_palindrome(j, i-1):  # using Manacher
                cuts[i] = min(cuts[i], cuts[j] + 1)
    
    return cuts[n]
```

<!-- back -->
