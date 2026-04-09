## DP - 2D Array Edit Distance: Comparison

When should you use different approaches and how do they compare?

<!-- front -->

---

### 2D DP vs Space Optimized Approaches

| Aspect | Full 2D DP | Two Rows | Single Array |
|--------|-----------|----------|--------------|
| **Space** | O(m × n) | O(min(m, n)) | O(min(m, n)) |
| **Time** | O(m × n) | O(m × n) | O(m × n) |
| **Code complexity** | Simple | Moderate | Complex |
| **Path reconstruction** | Easy | Hard | Very hard |
| **Cache efficiency** | Poor (stride) | Good | Best |
| **Debugging** | Easy (print table) | Harder | Hardest |

**Winner:**
- **Learning**: Full 2D DP (visualize, debug, understand)
- **Interview**: Two rows (shows optimization knowledge)
- **Production**: Single array (memory constrained)

---

### When to Use Each Approach

**Full 2D DP Table:**
- Learning the algorithm for the first time
- Need to reconstruct the actual operations
- Multiple queries on same strings (cache the table)
- Debugging - can print and visualize the DP table

**Two Row Optimization:**
- Standard interview answer (balance of efficiency and clarity)
- Memory constrained but path not needed
- Shows understanding of DP dependency structure

**Single Array:**
- Extreme memory constraints
- Final optimization when confident
- Bit more complex to get right in interview

---

### Edit Distance vs Other String DP Patterns

| Pattern | Problem | DP Dimension | Key Difference |
|---------|---------|--------------|----------------|
| **Edit Distance** | Min operations to transform | 2D (i, j) | min of 3 operations |
| **LCS** | Longest common subsequence | 2D (i, j) | max of skip either |
| **Distinct Subseq** | Count s1 subsequences = s2 | 2D (i, j) | sum of match/mismatch |
| **Interleaving** | Is s3 interleaving of s1,s2 | 2D (i, j) | OR of two paths |
| **Regex Matching** | Match string to pattern | 2D (i, j) | pattern char rules |
| **Wildcard Matching** | Match with * and ? | 2D (i, j) | * matches any sequence |

---

### Edit Distance vs LCS

**Similarity:**
- Both use 2D DP table comparing two strings
- Both have O(m × n) time and space

**Difference:**
```python
# LCS: Find longest common subsequence
def lcs(s1, s2):
    dp = [[0] * (n+1) for _ in range(m+1)]
    for i in range(1, m+1):
        for j in range(1, n+1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1  # Match: add 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])  # Skip one
    return dp[m][n]

# Edit Distance: Min operations to transform
def edit_dist(s1, s2):
    dp = [[0] * (n+1) for _ in range(m+1)]
    # ... base cases ...
    for i in range(1, m+1):
        for j in range(1, n+1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1]  # No cost
            else:
                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
    return dp[m][n]
```

**Relationship:**
- With only insert/delete (no replace): `Edit = len(s1) + len(s2) - 2*LCS`

---

### Naive Recursion vs DP

| Approach | Time | Space | Use Case |
|----------|------|-------|----------|
| **Naive Recursion** | O(3^(m+n)) | O(m+n) stack | Never - exponential |
| **Memoization** | O(m × n) | O(m × n) + stack | Top-down preference |
| **Tabulation (DP)** | O(m × n) | O(m × n) | Standard bottom-up |
| **Space Optimized** | O(m × n) | O(min(m,n)) | Memory constrained |

**Memoization version:**
```python
def min_distance_memo(s1, s2):
    from functools import lru_cache
    
    @lru_cache(maxsize=None)
    def dp(i, j):
        if i == 0: return j
        if j == 0: return i
        if s1[i-1] == s2[j-1]:
            return dp(i-1, j-1)
        return 1 + min(dp(i-1, j), dp(i, j-1), dp(i-1, j-1))
    
    return dp(len(s1), len(s2))
```

---

### Time vs Space Trade-offs

| Scenario | Recommended | Why |
|----------|-------------|-----|
| Interview (first pass) | 2D DP | Clear, easy to explain |
| Interview (follow-up) | Space optimized | Shows optimization skill |
| m, n ≤ 1000 | Any approach | All fit in memory |
| m, n ≤ 10^5 | Impossible | Sub-quadratic approx needed |
| Production, small strings | Space optimized | Good practice |
| Production, spell check | BK-tree / Levenshtein automaton | Approximate algorithms |

<!-- back -->
