## Two Pointers - Expanding from Center: Tactics

What are the advanced techniques for expanding from center?

<!-- front -->

---

### Tactic 1: Manacher's Algorithm Optimization

**Problem**: O(n²) is too slow for long strings

**Solution**: Manacher's algorithm achieves O(n)

```python
def manacher(s):
    """Linear time longest palindromic substring."""
    # Transform: "abba" → "#a#b#b#a#"
    t = '#'.join('^{}$'.format(s))
    n = len(t)
    p = [0] * n  # p[i] = radius of palindrome centered at i
    center = right = 0
    
    for i in range(1, n - 1):
        if i < right:
            mirror = 2 * center - i
            p[i] = min(right - i, p[mirror])
        
        # Attempt to expand
        while t[i + p[i] + 1] == t[i - p[i] - 1]:
            p[i] += 1
        
        # Update center and right boundary
        if i + p[i] > right:
            center, right = i, i + p[i]
    
    # Find maximum
    max_len = max(p)
    center_idx = p.index(max_len)
    start = (center_idx - max_len) // 2
    return s[start:start + max_len]
```

**Key insight**: Reuse computed palindrome lengths using symmetry

---

### Tactic 2: Longest Palindromic Subsequence (Not Substring!)

**Difference**:
- Substring: contiguous
- Subsequence: not necessarily contiguous

**Solution**: Use Dynamic Programming, not expanding from center

```python
def longest_palindromic_subsequence(s):
    n = len(s)
    dp = [[0] * n for _ in range(n)]
    
    for i in range(n - 1, -1, -1):
        dp[i][i] = 1
        for j in range(i + 1, n):
            if s[i] == s[j]:
                dp[i][j] = dp[i + 1][j - 1] + 2
            else:
                dp[i][j] = max(dp[i + 1][j], dp[i][j - 1])
    
    return dp[0][n - 1]
```

---

### Tactic 3: Shortest Palindrome by Adding Characters

```python
def shortest_palindrome(s):
    """Add chars in front to make palindrome."""
    # Find longest palindrome prefix
    n = len(s)
    
    for i in range(n - 1, -1, -1):
        if is_palindrome(s, 0, i):
            # Add reverse of remaining suffix to front
            suffix = s[i + 1:]
            return suffix[::-1] + s
    
    return s

def is_palindrome(s, left, right):
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True
```

---

### Tactic 4: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|-----|
| **Only checking odd** | Missing even palindromes | Always check both |
| **Wrong length calc** | Off-by-one in substring | right - left - 1 for expand function |
| **Not handling empty** | Edge case | Return early if len < 2 |
| **Single char strings** | All chars same | Works correctly with expansion |
| **Time limit exceeded** | O(n²) too slow | Use Manacher's for large strings |

---

### Tactic 5: Optimized Single Pass Count

```python
def count_palindromes_optimized(s):
    """Count with early termination for efficiency."""
    count = 0
    n = len(s)
    
    for i in range(n):
        # Odd - single char always counts
        count += 1  # The single char itself
        
        left, right = i - 1, i + 1
        while left >= 0 and right < n and s[left] == s[right]:
            count += 1
            left -= 1
            right += 1
        
        # Even
        left, right = i, i + 1
        while left >= 0 and right < n and s[left] == s[right]:
            count += 1
            left -= 1
            right += 1
    
    return count
```

<!-- back -->
