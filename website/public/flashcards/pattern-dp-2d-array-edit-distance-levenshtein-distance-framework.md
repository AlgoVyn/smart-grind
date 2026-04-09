## DP - 2D Array Edit Distance: Framework

What is the complete code template for computing edit distance using 2D DP?

<!-- front -->

---

### Standard 2D DP Template

```
┌─────────────────────────────────────────────────────────────────┐
│  EDIT DISTANCE - 2D DP TEMPLATE                                      │
├─────────────────────────────────────────────────────────────────┤
│  State: dp[i][j] = min operations to convert s1[0..i-1] to          │
│                    s2[0..j-1]                                        │
│                                                                       │
│  Base Cases:                                                          │
│    - dp[i][0] = i  (delete i characters from s1)                     │
│    - dp[0][j] = j  (insert j characters from s2)                     │
│                                                                       │
│  Recurrence:                                                        │
│    if s1[i-1] == s2[j-1]:                                           │
│        dp[i][j] = dp[i-1][j-1]       (no operation)                  │
│    else:                                                            │
│        dp[i][j] = 1 + min(                                          │
│            dp[i-1][j],              (delete)                         │
│            dp[i][j-1],              (insert)                         │
│            dp[i-1][j-1]             (replace)                        │
│        )                                                             │
│                                                                       │
│  Return: dp[m][n]                                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

### Implementation: Standard 2D DP

```python
def min_distance(s1: str, s2: str) -> int:
    """
    Standard 2D DP for edit distance.
    Time: O(m*n), Space: O(m*n)
    """
    m, n = len(s1), len(s2)
    
    # dp[i][j] = min operations for s1[0..i-1] -> s2[0..j-1]
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Base cases
    for i in range(m + 1):
        dp[i][0] = i  # Delete all
    for j in range(n + 1):
        dp[0][j] = j  # Insert all
    
    # Fill table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i - 1] == s2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]  # Match
            else:
                dp[i][j] = 1 + min(
                    dp[i - 1][j],      # Delete
                    dp[i][j - 1],      # Insert
                    dp[i - 1][j - 1]   # Replace
                )
    
    return dp[m][n]
```

---

### Implementation: Space Optimized (Two Rows)

```python
def min_distance_optimized(s1: str, s2: str) -> int:
    """
    Space-optimized using two rows.
    Time: O(m*n), Space: O(min(m, n))
    """
    # Make s1 the shorter string
    if len(s1) > len(s2):
        s1, s2 = s2, s1
    
    m, n = len(s1), len(s2)
    
    prev = list(range(n + 1))  # dp[i-1][*]
    curr = [0] * (n + 1)       # dp[i][*]
    
    for i in range(1, m + 1):
        curr[0] = i  # Base case
        
        for j in range(1, n + 1):
            if s1[i - 1] == s2[j - 1]:
                curr[j] = prev[j - 1]
            else:
                curr[j] = 1 + min(
                    prev[j],      # Delete
                    curr[j - 1],  # Insert
                    prev[j - 1]   # Replace
                )
        
        prev, curr = curr, prev  # Swap rows
    
    return prev[n]
```

---

### Implementation: Single Array (Most Optimized)

```python
def min_distance_1d(s1: str, s2: str) -> int:
    """
    Single array with diagonal tracking.
    Time: O(m*n), Space: O(min(m, n))
    """
    if len(s1) > len(s2):
        return min_distance_1d(s2, s1)
    
    m, n = len(s1), len(s2)
    dp = list(range(n + 1))
    
    for i in range(1, m + 1):
        prev_diag = dp[0]  # dp[i-1][j-1] from previous row
        dp[0] = i          # Base case: dp[i][0]
        
        for j in range(1, n + 1):
            temp = dp[j]   # Save before overwrite
            
            if s1[i - 1] == s2[j - 1]:
                dp[j] = prev_diag
            else:
                dp[j] = 1 + min(
                    dp[j],        # dp[i-1][j] (delete)
                    dp[j - 1],    # dp[i][j-1] (insert)
                    prev_diag     # dp[i-1][j-1] (replace)
                )
            
            prev_diag = temp
    
    return dp[n]
```

---

### Key Framework Elements

| Element | Purpose | Complexity Impact |
|---------|---------|-------------------|
| `dp[i][j]` | State: cost for prefixes | Core definition |
| Base cases | Empty string handling | Always initialize |
| Match check | `s1[i-1] == s2[j-1]` | Avoids +1 when equal |
| Three-way min | Delete, Insert, Replace | Core recurrence |
| Row swap | `prev, curr = curr, prev` | Space optimization |
| `prev_diag` | Track diagonal in 1D | Enables single array |

<!-- back -->
