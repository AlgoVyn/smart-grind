## Edit Distance: Core Concepts

What is the edit distance problem and how does dynamic programming solve it optimally?

<!-- front -->

---

### Problem Definition

Given two strings `word1` and `word2`, find the minimum number of operations required to convert `word1` to `word2`.

**Allowed operations:**
- Insert a character
- Delete a character
- Replace a character

**Example:**
```
word1 = "horse", word2 = "ros"
horse → rorse (replace h with r)
rorse → rose (remove r)
rose → ros (remove e)
Answer: 3 operations
```

---

### Optimal Substructure

The edit distance between prefixes depends on smaller prefixes:

```
dp[i][j] = edit distance between word1[0..i-1] and word2[0..j-1]

If word1[i-1] == word2[j-1]:
    dp[i][j] = dp[i-1][j-1]  # No operation needed
Else:
    dp[i][j] = 1 + min(
        dp[i-1][j],     # Delete from word1
        dp[i][j-1],     # Insert to word1
        dp[i-1][j-1]    # Replace
    )
```

---

### Recurrence Summary

| Case | Formula |
|------|---------|
| Characters match | `dp[i][j] = dp[i-1][j-1]` |
| Delete | `dp[i][j] = dp[i-1][j] + 1` |
| Insert | `dp[i][j] = dp[i][j-1] + 1` |
| Replace | `dp[i][j] = dp[i-1][j-1] + 1` |

**Base cases:**
- `dp[0][j] = j` (insert j characters)
- `dp[i][0] = i` (delete i characters)

---

### Variations

| Problem | Operation Set |
|---------|---------------|
| **Levenshtein** | Insert, Delete, Replace |
| **LCS** (Longest Common Subsequence) | Only Insert/Delete (no replace) |
| **Hamming** | Only Replace (same length) |
| **Damerau-Levenshtein** | + Transpose (swap adjacent) |

---

### Complexity

| Aspect | Value |
|--------|-------|
| **Time (DP)** | O(m × n) |
| **Space (DP)** | O(m × n) or O(min(m,n)) |
| **Time (brute force)** | O(3^(m+n)) |
| **Space (brute force)** | O(m + n) recursion |

<!-- back -->
