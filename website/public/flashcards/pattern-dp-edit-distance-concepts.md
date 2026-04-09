## DP - Edit Distance: Core Concepts

What are the fundamental principles of edit distance?

<!-- front -->

---

### Core Concept

**dp[i][j] represents the minimum operations to convert the first i characters of s1 to the first j characters of s2. Build up from empty strings to full strings.**

**Recurrence:**
```
If s1[i-1] == s2[j-1]:
    dp[i][j] = dp[i-1][j-1]  # No operation needed
Else:
    dp[i][j] = 1 + min(
        dp[i-1][j],    # Delete from s1
        dp[i][j-1],    # Insert from s2  
        dp[i-1][j-1]   # Replace in s1
    )
```

**Example:**
```
horse → ros

h → "": delete h (1)
ho → r: not equal, min(delete h + replace o, insert r, replace h)

Building up the table gives answer = 3 (replace h→r, delete o, delete e)
```

---

### Common Applications

| Problem Type | Use Case | Example |
|--------------|----------|---------|
| Spell check | Find closest word | Auto-correct |
| DNA alignment | Sequence similarity | Bioinformatics |
| Diff | File comparison | Version control |
| String similarity | Fuzzy matching | Search |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(m×n) | Fill table |
| Space | O(m×n) | Full table |
| Optimized | O(min(m,n)) | Two rows |

<!-- back -->
