## DP - 2D Array Edit Distance: Core Concepts

What are the fundamental concepts behind the edit distance DP approach?

<!-- front -->

---

### State Definition

**`dp[i][j]` represents:**
- Minimum number of operations to convert `s1[0..i-1]` to `s2[0..j-1]`
- The cost for the first `i` characters of s1 and first `j` characters of s2

**Why this definition?**
- We build solutions incrementally from smaller prefixes
- Final answer is `dp[m][n]` (full strings)

```
Example: s1="horse", s2="ros"
      r  o  s
   0  1  2  3
h  1  1  2  3
o  2  2  1  2
r  3  2  2  2
s  4  3  3  2  ← dp[4][3] = 2

dp[4][3] = 2: "hors" → "ros" needs 2 ops
```

---

### The Three Operations

| Operation | Cost | Effect | DP Transition |
|-----------|------|--------|---------------|
| **Delete** | 1 | Remove char from s1 | `dp[i-1][j] + 1` |
| **Insert** | 1 | Add char from s2 to s1 | `dp[i][j-1] + 1` |
| **Replace** | 1 | Change s1 char to s2 char | `dp[i-1][j-1] + 1` |

**Why only these three?**
- Any string transformation can be decomposed into these primitives
- Replace can be viewed as delete + insert, but counts as one operation

---

### Base Cases Explained

```python
# First column: converting s1[0..i-1] to empty string
for i in range(m + 1):
    dp[i][0] = i  # Need i deletions

# First row: converting empty string to s2[0..j-1]
for j in range(n + 1):
    dp[0][j] = j  # Need j insertions
```

| Cell | Meaning | Value | Reason |
|------|---------|-------|--------|
| `dp[0][0]` | "" → "" | 0 | No operations needed |
| `dp[3][0]` | "abc" → "" | 3 | Delete a, b, c |
| `dp[0][4]` | "" → "xyzw" | 4 | Insert x, y, z, w |

---

### Recurrence Relation Deep Dive

```
if s1[i-1] == s2[j-1]:
    # Characters match - no new operation needed
    # Just use the solution for previous prefixes
    dp[i][j] = dp[i-1][j-1]
else:
    # Characters differ - must perform one operation
    # Pick the cheapest path:
    # - Delete: solve for s1[0..i-2] → s2[0..j-1], then delete s1[i-1]
    # - Insert: solve for s1[0..i-1] → s2[0..j-2], then insert s2[j-1]
    # - Replace: solve for s1[0..i-2] → s2[0..j-2], then replace
    dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
```

---

### Relationship to LCS

**Edit Distance vs Longest Common Subsequence:**

When only **insert** and **delete** are allowed (no replace):
```
Edit Distance = len(s1) + len(s2) - 2 * LCS(s1, s2)
```

**Why?**
- Keep the LCS (no operations needed for common subsequence)
- Delete everything else from s1: `len(s1) - LCS`
- Insert everything else from s2: `len(s2) - LCS`

With **replace** allowed:
- Replace = 1 operation vs delete+insert = 2 operations
- So edit distance ≤ LCS-based calculation

---

### Complexity Analysis

| Aspect | Standard 2D | Space Optimized |
|--------|-------------|-----------------|
| **Time** | O(m × n) | O(m × n) |
| **Space** | O(m × n) | O(min(m, n)) |
| **Fills** | Full table | Two rows only |
| **Dependencies** | Left, Top, Top-Left | Same, but row-based |

**Time breakdown:**
- m × n cells to fill
- O(1) work per cell (constant-time min of 3 values)

<!-- back -->
