## DP - Edit Distance: Forms

What are the different variations of edit distance?

<!-- front -->

---

### Form 1: Standard 2D DP

```python
def min_distance_2d(s1, s2):
    """Standard 2D DP solution."""
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
    
    return dp[m][n]
```

---

### Form 2: Space Optimized

```python
def min_distance_1d(s1, s2):
    """O(min(m,n)) space."""
    if len(s1) < len(s2):
        s1, s2 = s2, s1
    
    prev = list(range(len(s2) + 1))
    curr = [0] * (len(s2) + 1)
    
    for i in range(1, len(s1) + 1):
        curr[0] = i
        for j in range(1, len(s2) + 1):
            if s1[i-1] == s2[j-1]:
                curr[j] = prev[j-1]
            else:
                curr[j] = 1 + min(prev[j], curr[j-1], prev[j-1])
        prev, curr = curr, prev
    
    return prev[len(s2)]
```

---

### Form 3: One Edit Distance

```python
def is_one_edit(s1, s2):
    """Check if exactly one edit away."""
    if abs(len(s1) - len(s2)) > 1:
        return False
    
    edited = False
    i = j = 0
    while i < len(s1) and j < len(s2):
        if s1[i] != s2[j]:
            if edited:
                return False
            edited = True
            if len(s1) > len(s2):
                i += 1
            elif len(s1) < len(s2):
                j += 1
            else:
                i += 1
                j += 1
        else:
            i += 1
            j += 1
    
    return edited or len(s1) != len(s2)
```

---

### Form Comparison

| Form | Space | Can Reconstruct | Use Case |
|------|-------|-----------------|----------|
| 2D | O(m×n) | Yes | Learning, reconstruction |
| 1D | O(min) | Hard | Memory constrained |
| One edit | O(1) | N/A | Quick check |

<!-- back -->
