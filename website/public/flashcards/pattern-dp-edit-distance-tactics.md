## DP - Edit Distance: Tactics

What are the advanced techniques for edit distance?

<!-- front -->

---

### Tactic 1: Space Optimization

```python
def min_distance_optimized(s1, s2):
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

### Tactic 2: Print Operations

```python
def print_operations(s1, s2):
    """Print the edit operations."""
    # Build full DP table
    # Backtrack from dp[m][n] to dp[0][0]
    # Determine which operation at each step
```

---

### Tactic 3: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|----- |
| Wrong base case | Wrong result | dp[i][0]=i, dp[0][j]=j |
| Off-by-one | Index error | dp[i][j] = s1[:i], s2[:j] |
| Not taking min | Wrong distance | min of delete, insert, replace |
| Wrong order | Wrong table | Fill row by row |

---

### Tactic 4: One Edit Distance

```python
def is_one_edit(s1, s2):
    """Check if strings are one edit away."""
    m, n = len(s1), len(s2)
    if abs(m - n) > 1:
        return False
    
    i = j = edits = 0
    while i < m and j < n:
        if s1[i] != s2[j]:
            if edits == 1:
                return False
            edits += 1
            if m > n:
                i += 1
            elif m < n:
                j += 1
            else:
                i += 1
                j += 1
        else:
            i += 1
            j += 1
    
    return edits + (m - i) + (n - j) == 1
```

<!-- back -->
