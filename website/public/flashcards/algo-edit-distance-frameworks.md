## Edit Distance: Algorithm Framework

What are the complete implementations for edit distance?

<!-- front -->

---

### Standard DP (2D Table)

```python
def min_distance(word1: str, word2: str) -> int:
    """
    Full DP table approach
    Time: O(mn), Space: O(mn)
    """
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Base cases
    for i in range(m + 1):
        dp[i][0] = i  # Delete all from word1
    for j in range(n + 1):
        dp[0][j] = j  # Insert all to word1
    
    # Fill table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(
                    dp[i-1][j],     # Delete
                    dp[i][j-1],     # Insert
                    dp[i-1][j-1]    # Replace
                )
    
    return dp[m][n]
```

---

### Space-Optimized DP (1D Array)

```python
def min_distance_optimized(word1: str, word2: str) -> int:
    """
    Only need previous row
    Time: O(mn), Space: O(min(m,n))
    """
    # Ensure word2 is the shorter one for space optimization
    if len(word1) < len(word2):
        word1, word2 = word2, word1
    
    m, n = len(word1), len(word2)
    prev = list(range(n + 1))
    curr = [0] * (n + 1)
    
    for i in range(1, m + 1):
        curr[0] = i
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                curr[j] = prev[j-1]
            else:
                curr[j] = 1 + min(prev[j], curr[j-1], prev[j-1])
        prev, curr = curr, prev  # Swap rows
    
    return prev[n]
```

---

### Memoization (Top-Down)

```python
from functools import lru_cache

def min_distance_memo(word1: str, word2: str) -> int:
    """
    Recursive with memoization
    """
    @lru_cache(maxsize=None)
    def dp(i, j):
        # Base cases
        if i == 0:
            return j
        if j == 0:
            return i
        
        if word1[i-1] == word2[j-1]:
            return dp(i-1, j-1)
        
        return 1 + min(
            dp(i-1, j),     # Delete
            dp(i, j-1),     # Insert
            dp(i-1, j-1)    # Replace
        )
    
    return dp(len(word1), len(word2))
```

---

### LCS-based Edit Distance

```python
def min_distance_via_lcs(word1: str, word2: str) -> int:
    """
    Edit distance = (m - LCS) + (n - LCS) = m + n - 2*LCS
    Only works for insert/delete, not replace
    """
    def lcs(s1, s2):
        m, n = len(s1), len(s2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if s1[i-1] == s2[j-1]:
                    dp[i][j] = dp[i-1][j-1] + 1
                else:
                    dp[i][j] = max(dp[i-1][j], dp[i][j-1])
        
        return dp[m][n]
    
    common = lcs(word1, word2)
    # Delete non-LCS from word1 + insert non-LCS from word2
    return len(word1) + len(word2) - 2 * common
```

---

### Hirschberg's Algorithm (Space-Efficient)

```python
def hirschberg(word1: str, word2: str) -> int:
    """
    Divide and conquer: O(mn) time, O(min(m,n)) space
    Finds actual alignment, not just distance
    """
    # Implementation would include:
    # 1. Forward pass for first half
    # 2. Backward pass for second half
    # 3. Find optimal split point
    # 4. Recurse on each half
    pass
```

<!-- back -->
