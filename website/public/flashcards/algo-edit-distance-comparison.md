## Edit Distance: Comparison Guide

How does edit distance relate to other string similarity measures?

<!-- front -->

---

### String Distance Measures

| Measure | Operations | Best For |
|---------|------------|----------|
| **Levenshtein** | Insert, Delete, Replace | General typo correction |
| **LCS** | Insert, Delete (no replace) | Finding common structure |
| **Hamming** | Replace only | Fixed-length strings |
| **Damerau-Levenshtein** | + Transpose | Keyboard typos |
| **Jaro-Winkler** | Character matching | Short strings, names |
| **Cosine (n-gram)** | None (vector space) | Document similarity |

---

### DP String Algorithms

| Problem | Recurrence | Output |
|---------|------------|--------|
| **Edit Distance** | min(insert, delete, replace) | Distance value |
| **LCS** | max(skip1, skip2, match+1) | Length of subsequence |
| **Longest Palindrome** | Expand around center or DP | Length/Palindrome |
| **Wildcard Match** | Boolean with * and ? | Match True/False |
| **Regex Match** | Complex automaton | Match True/False |
| **String Interleaving** | s1[i]==s3[k] or s2[j]==s3[k] | Is interleaving |

---

### Complexity Comparison

| Algorithm | Time | Space | Optimizations |
|-----------|------|-------|---------------|
| **Standard DP** | O(mn) | O(mn) | None |
| **Space-optimized** | O(mn) | O(min(m,n)) | Rolling array |
| **Banded DP** | O(mn) but smaller constant | O(min(m,n)) | Early termination |
| **Bit-parallel** | O(⌈m/w⌉n) | O(1) | Bit manipulation |
| **Four Russians** | O(mn/log n) | O(mn/log n) | Precomputation |

---

### When to Use Each Approach

```
Long strings (m,n > 1000)?
  → Space-optimized DP or Hirschberg

Many queries (same text, many patterns)?
  → Preprocess text, use suffix automaton

Real-time spell checking?
  → Banded DP with early termination

Short strings, many comparisons?
  → Bit-parallel (Myers')

Exact alignment needed?
  → Full DP with backtracking

Only distance value needed?
  → Space-optimized DP
```

---

### Related Problems

| Problem | Relation to Edit Distance |
|---------|---------------------------|
| **Longest Palindromic Subsequence** | LCS(s, reverse(s)) |
| **Minimum Insertions to Palindrome** | len(s) - LPS(s) |
| **Shortest Common Supersequence** | len(s1) + len(s2) - LCS(s1,s2) |
| **Distinct Subsequences** | Different DP but similar structure |
| **Word Break** | Boolean version of sequence matching |

<!-- back -->
