# Longest Common Subsequence

## Category
Dynamic Programming

## Description

The Longest Common Subsequence (LCS) is a classic dynamic programming problem that finds the longest subsequence common to two strings. A **subsequence** is a sequence that appears in the same relative order but not necessarily contiguous. For example, "ace" is a subsequence of "abcde" but "aec" is not.

The key insight behind LCS is that we can break down the problem into smaller subproblems. For two strings `text1` and `text2`, let `dp[i][j]` represent the length of the LCS of the first `i` characters of text1 and the first `j` characters of text2. This problem exhibits both optimal substructure and overlapping subproblems, making it an ideal candidate for dynamic programming.

LCS has widespread applications including version control systems (git diff), DNA sequence alignment in bioinformatics, plagiarism detection, and spell checking algorithms. Understanding LCS provides the foundation for solving more complex string dynamic programming problems.

---

## Concepts

### 1. Subsequence Definition

Understanding what constitutes a valid subsequence:

| String | Valid Subsequences | Invalid (not subsequence) |
|--------|-------------------|--------------------------|
| "abcde" | "ace", "bd", "a" | "eca" (wrong order) |
| "ABCDGH" | "ADH", "AC", "DGH" | "AHD" (not in order) |

### 2. DP State Definition

The meaning of each DP cell:

- `dp[i][j]` = length of LCS between `text1[0...i-1]` and `text2[0...j-1]`
- The answer is found at `dp[m][n]` where m, n are string lengths

### 3. Recurrence Relation

The core logic for filling the DP table:

```
If text1[i-1] == text2[j-1]:
    dp[i][j] = dp[i-1][j-1] + 1  (match found, extend LCS)
Else:
    dp[i][j] = max(dp[i-1][j], dp[i][j-1])  (take best of exclude either)
```

### 4. Base Cases

Foundation of the DP table:

| Case | Value | Meaning |
|------|-------|---------|
| `dp[0][j]` | 0 | Empty string has LCS = 0 with any string |
| `dp[i][0]` | 0 | Any string has LCS = 0 with empty string |
| `dp[0][0]` | 0 | Two empty strings have LCS = 0 |

### 5. Space Optimization Insight

Only the previous row is needed to compute the current row:

```
To compute dp[i][j], we only need:
- dp[i-1][j-1] (diagonal - for match case)
- dp[i-1][j] (above - for exclude text1[i-1])
- dp[i][j-1] (left - for exclude text2[j-1])
```

---

## Frameworks

### Framework 1: Standard 2D DP Table

```
┌─────────────────────────────────────────────────────┐
│  LCS STANDARD FRAMEWORK                             │
├─────────────────────────────────────────────────────┤
│  1. Create DP table of size (m+1) × (n+1)           │
│  2. Initialize first row and column to 0            │
│  3. For i from 1 to m:                             │
│     For j from 1 to n:                             │
│        If text1[i-1] == text2[j-1]:                │
│           dp[i][j] = dp[i-1][j-1] + 1              │
│        Else:                                        │
│           dp[i][j] = max(dp[i-1][j], dp[i][j-1])   │
│  4. Return dp[m][n]                                 │
└─────────────────────────────────────────────────────┘
```

**When to use**: When you need to reconstruct the actual LCS string

### Framework 2: Space-Optimized (Two Rows)

```
┌─────────────────────────────────────────────────────┐
│  LCS SPACE-OPTIMIZED FRAMEWORK                        │
├─────────────────────────────────────────────────────┤
│  1. Create two 1D arrays: prev[n+1] and curr[n+1]   │
│  2. Initialize both to 0                             │
│  3. For each character in text1:                     │
│     a. curr[0] = 0                                   │
│     b. For each character in text2:                │
│        If match: curr[j] = prev[j-1] + 1            │
│        Else: curr[j] = max(prev[j], curr[j-1])      │
│     c. Swap prev and curr                          │
│  4. Return prev[n]                                   │
└─────────────────────────────────────────────────────┘
```

**When to use**: When you only need the LCS length, not the string

### Framework 3: LCS with Backtracking

```
┌─────────────────────────────────────────────────────┐
│  LCS RECONSTRUCTION FRAMEWORK                         │
├─────────────────────────────────────────────────────┤
│  1. Build full DP table (Framework 1)               │
│  2. Start from dp[m][n], backtrack to dp[0][0]:      │
│     a. If text1[i-1] == text2[j-1]:                 │
│        - Add char to LCS (move diagonally)          │
│     b. Else if dp[i-1][j] > dp[i][j-1]:            │
│        - Move up (exclude text1[i-1])               │
│     c. Else:                                        │
│        - Move left (exclude text2[j-1])             │
│  3. Reverse collected characters                    │
│  4. Return LCS string                                 │
└─────────────────────────────────────────────────────┘
```

**When to use**: When you need the actual LCS string, not just length

---

## Forms

### Form 1: Standard LCS (Length Only)

Find the length of the longest common subsequence.

| text1 | text2 | LCS Length | LCS String |
|-------|-------|------------|------------|
| "abcde" | "ace" | 3 | "ace" |
| "abc" | "def" | 0 | "" |
| "AGCAT" | "GAC" | 2 | "GA" or "AC" |

### Form 2: LCS with String Reconstruction

Return both the length and the actual subsequence.

```
Requires full DP table for backtracking.
Multiple valid LCS may exist - return any one.
```

### Form 3: Space-Optimized LCS

Use O(min(m,n)) space when only length is needed.

| Approach | Space | Can Reconstruct? |
|----------|-------|------------------|
| 2D DP | O(m×n) | Yes |
| 2 Rows | O(n) | No |
| 1 Row | O(n) | No |

### Form 4: Longest Common Substring

Contiguous characters only (different problem).

| text1 | text2 | LCS | Substring |
|-------|-------|-----|-----------|
| "ABABC" | "BABCA" | "BABC" | "BAB" |

Note: LCS allows gaps, substring requires contiguity.

### Form 5: Shortest Common Supersequence

Build the shortest string containing both inputs.

```
SCS length = len(text1) + len(text2) - LCS(text1, text2)
Uses LCS to determine which characters appear twice.
```

---

## Tactics

### Tactic 1: Edit Distance via LCS

When only insertions and deletions are allowed:

```python
def min_deletions_to_equal(word1: str, word2: str) -> int:
    """Minimum deletions to make two strings equal."""
    lcs_length = lcs(word1, word2)
    return len(word1) + len(word2) - 2 * lcs_length
```

### Tactic 2: Longest Palindromic Subsequence

LCS between string and its reverse:

```python
def longest_palindromic_subsequence(s: str) -> int:
    """LPS is LCS(s, reversed(s))."""
    return lcs_length(s, s[::-1])
```

### Tactic 3: Minimum Insertions to Make Palindrome

```python
def min_insertions_to_palindrome(s: str) -> int:
    """Insertions = len(s) - LPS."""
    return len(s) - longest_palindromic_subsequence(s)
```

### Tactic 4: Print All LCS (Multiple Solutions)

When multiple LCS exist, find all of them:

```python
def all_lcs(text1: str, text2: str) -> set:
    """Find all longest common subsequences."""
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Fill DP table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    # Backtrack to find all LCS
    def backtrack(i, j):
        if i == 0 or j == 0:
            return {''}
        if text1[i-1] == text2[j-1]:
            return {s + text1[i-1] for s in backtrack(i-1, j-1)}
        results = set()
        if dp[i-1][j] >= dp[i][j-1]:
            results.update(backtrack(i-1, j))
        if dp[i][j-1] >= dp[i-1][j]:
            results.update(backtrack(i, j-1))
        return results
    
    return backtrack(m, n)
```

### Tactic 5: Memory Optimization Decision

When to use space optimization:

```python
def should_optimize_memory(m: int, n: int, need_string: bool) -> bool:
    """Determine if space optimization is appropriate."""
    if need_string:
        return False  # Need full table for reconstruction
    if m * n > 10_000_000:  # > 10MB
        return True
    return True  # Default to optimization
```

---

## Python Templates

### Template 1: Standard LCS (Length and String)

```python
def longest_common_subsequence(text1: str, text2: str) -> tuple:
    """
    Find the LCS length and string between two strings.
    Time: O(m * n), Space: O(m * n)
    """
    m, n = len(text1), len(text2)
    
    # Create DP table
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Fill the DP table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    
    # Backtrack to find the actual LCS string
    lcs = []
    i, j = m, n
    while i > 0 and j > 0:
        if text1[i - 1] == text2[j - 1]:
            lcs.append(text1[i - 1])
            i -= 1
            j -= 1
        elif dp[i - 1][j] > dp[i][j - 1]:
            i -= 1
        else:
            j -= 1
    
    return dp[m][n], ''.join(reversed(lcs))
```

### Template 2: Space-Optimized LCS (Length Only)

```python
def lcs_length(text1: str, text2: str) -> int:
    """
    Space-optimized LCS returning only length.
    Time: O(m * n), Space: O(min(m, n))
    """
    # Ensure text1 is the shorter string
    if len(text1) > len(text2):
        text1, text2 = text2, text1
    
    m, n = len(text1), len(text2)
    
    # Only keep two rows
    prev = [0] * (m + 1)
    curr = [0] * (m + 1)
    
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if text2[i - 1] == text1[j - 1]:
                curr[j] = prev[j - 1] + 1
            else:
                curr[j] = max(prev[j], curr[j - 1])
        prev, curr = curr, prev
    
    return prev[m]
```

### Template 3: Longest Common Substring

```python
def longest_common_substring(text1: str, text2: str) -> tuple:
    """
    Find longest common substring (contiguous).
    Different from LCS - requires contiguity.
    Time: O(m * n), Space: O(m * n) or O(min(m, n))
    """
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    max_length = 0
    end_index = 0
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
                if dp[i][j] > max_length:
                    max_length = dp[i][j]
                    end_index = i
            else:
                dp[i][j] = 0
    
    return max_length, text1[end_index - max_length:end_index]
```

### Template 4: Shortest Common Supersequence

```python
def shortest_common_supersequence(str1: str, str2: str) -> str:
    """
    Find shortest string containing both str1 and str2.
    Time: O(m * n), Space: O(m * n)
    """
    m, n = len(str1), len(str2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Build LCS table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if str1[i-1] == str2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    # Backtrack to build SCS
    result = []
    i, j = m, n
    while i > 0 or j > 0:
        if i == 0:
            result.append(str2[j-1])
            j -= 1
        elif j == 0:
            result.append(str1[i-1])
            i -= 1
        elif str1[i-1] == str2[j-1]:
            result.append(str1[i-1])
            i -= 1
            j -= 1
        elif dp[i-1][j] > dp[i][j-1]:
            result.append(str1[i-1])
            i -= 1
        else:
            result.append(str2[j-1])
            j -= 1
    
    return ''.join(reversed(result))
```

### Template 5: Longest Palindromic Subsequence

```python
def longest_palindromic_subsequence(s: str) -> int:
    """
    LPS is LCS(s, reversed(s)).
    Time: O(n²), Space: O(n²) or O(n)
    """
    return lcs_length(s, s[::-1])


def lps_with_sequence(s: str) -> tuple:
    """
    Return LPS length and one LPS string.
    Time: O(n²), Space: O(n²)
    """
    length, lcs = longest_common_subsequence(s, s[::-1])
    return length, lcs
```

### Template 6: Edit Distance (Only Insert/Delete)

```python
def delete_operations_to_equal(word1: str, word2: str) -> int:
    """
    Minimum deletions to make two strings equal.
    Equivalent to: len(word1) + len(word2) - 2 * LCS
    Time: O(m * n), Space: O(min(m, n))
    """
    lcs_len = lcs_length(word1, word2)
    return len(word1) + len(word2) - 2 * lcs_len
```

---

## When to Use

Use the LCS algorithm when you need to solve problems involving:

- **String Comparison**: Finding similarities between two strings or documents
- **Diff Tools**: Version control systems (git diff)
- **Bioinformatics**: DNA sequence alignment
- **Plagiarism Detection**: Finding common sequences between documents
- **Edit Distance**: Related problems involving only insertions/deletions
- **Palindromes**: Finding longest palindromic subsequence

### Comparison with Alternatives

| Algorithm | Use Case | Time | Space | Notes |
|-----------|----------|------|-------|-------|
| **LCS (DP)** | Find longest common subsequence | O(m×n) | O(m×n) | Returns actual subsequence |
| **LCS (Space-Optimized)** | When memory is limited | O(m×n) | O(min(m,n)) | Only stores current row |
| **Rolling Hash** | Quick approximation | O(m+n) | O(1) | May have false positives |
| **Suffix Array** | Multiple string comparisons | O(n log n) | O(n) | More complex to implement |

### When to Choose LCS vs Other Approaches

- **Choose Standard LCS (DP)** when:
  - You need the actual subsequence string
  - Strings are relatively short (< 5000 chars)
  - Memory is not a concern

- **Choose Space-Optimized LCS** when:
  - Memory is limited
  - You only need the length (not the string)
  - Working with very long strings

- **Choose Alternative Approaches** when:
  - Approximate matching is acceptable
  - Strings are extremely long (millions of characters)
  - Multiple queries on the same string

---

## Algorithm Explanation

### Core Concept

The key insight behind LCS is that we can break down the problem into smaller subproblems. For two strings `text1` and `text2`, let `dp[i][j]` represent the length of the LCS of the first `i` characters of text1 and the first `j` characters of text2.

The recurrence relation is:
- **If characters match** (`text1[i-1] == text2[j-1]`): `dp[i][j] = dp[i-1][j-1] + 1`
- **If they don't match**: `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`

This builds a 2D table where each cell represents the LCS length for those prefixes. To reconstruct the actual subsequence, we backtrack from `dp[m][n]`.

### How It Works

#### DP Table Building Phase:
1. Create a 2D array `dp` of size `(m+1) × (n+1)` where `dp[i][j]` = LCS length of `text1[0:i]` and `text2[0:j]`
2. Initialize first row and column to 0 (base case: empty string has LCS = 0 with anything)
3. Fill the table by iterating through all positions:
   - If characters match, take diagonal value + 1
   - Otherwise, take max of left and top values

#### Backtracking Phase (to find actual subsequence):
1. Start from `dp[m][n]` (bottom-right corner)
2. If characters match, move diagonally (add character to result)
3. Otherwise, move in the direction of the larger value
4. Continue until reaching `dp[0][0]`

### Visual Representation

For `text1 = "ABCDGH"` and `text2 = "AEDFHR"`:

```
        ""  A  E  D  F  H  R
    ""   0  0  0  0  0  0  0
    A    0  1  1  1  1  1  1
    B    0  1  1  1  1  1  1
    C    0  1  1  1  1  1  1
    D    0  1  1  2  2  2  2
    G    0  1  1  2  2  2  2
    H    0  1  1  2  2  3  3

LCS = "ADH" (length = 3)
```

### Why Dynamic Programming Works

The LCS problem exhibits **optimal substructure** and **overlapping subproblems**:
1. **Optimal Substructure**: The LCS of two strings can be constructed from the LCS of their prefixes
2. **Overlapping Subproblems**: The same subproblems (LCS of prefixes) are solved multiple times without DP

### Limitations

- **O(m×n) time**: Slow for very long strings
- **O(m×n) space**: Can be reduced to O(min(m, n))
- **Not suitable for millions of strings**: Use suffix trees/arrays instead
- **Sequential only**: Doesn't parallelize well

---

## Practice Problems

### Problem 1: Longest Common Subsequence

**Problem:** [LeetCode 1143 - Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/)

**Description:** Given two strings `text1` and `text2`, return the length of their longest common subsequence. If there is no common subsequence, return 0.

**How to Apply LCS:**
- This is the classic LCS problem
- Build a 2D DP table where `dp[i][j]` represents LCS length of first i chars of text1 and first j chars of text2
- Time: O(m×n), Space: O(m×n) or O(min(m,n))

---

### Problem 2: Delete Operation for Two Strings

**Problem:** [LeetCode 583 - Delete Operation for Two Strings](https://leetcode.com/problems/delete-operation-for-two-strings/)

**Description:** Given two strings word1 and word2, return the minimum number of steps required to make word1 and word2 the same. In one step, you can delete exactly one character in either string.

**How to Apply LCS:**
- The answer = len(word1) + len(word2) - 2 × LCS(word1, word2)
- Because deletions = total chars - common chars
- Use LCS to find common subsequence, then compute deletions

---

### Problem 3: Shortest Common Supersequence

**Problem:** [LeetCode 1092 - Shortest Common Supersequence](https://leetcode.com/problems/shortest-common-supersequence/)

**Description:** Given two strings str1 and str2, return the shortest string that has both str1 and str2 as subsequences.

**How to Apply LCS:**
- First compute LCS of str1 and str2
- Build result by interleaving: when characters match, add once; when they don't, add from the string with larger DP value
- The length = len(str1) + len(str2) - LCS

---

### Problem 4: Longest Palindromic Subsequence

**Problem:** [LeetCode 516 - Longest Palindromic Subsequence](https://leetcode.com/problems/longest-palindromic-subsequence/)

**Description:** Given a string s, find the length of the longest palindromic subsequence in s.

**How to Apply LCS:**
- This is LCS(s, reversed(s))
- Find LCS between the original string and its reverse
- Result gives the longest palindromic subsequence

---

### Problem 5: Minimum ASCII Delete Sum for Two Strings

**Problem:** [LeetCode 712 - Minimum ASCII Delete Sum for Two Strings](https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/)

**Description:** Given two strings s1 and s2, find the minimum ASCII delete sum for both strings.

**How to Apply LCS:**
- Modified LCS where we sum ASCII values instead of counting
- dp[i][j] = minimum delete sum for s1[0:i] and s2[0:j]
- If chars match: dp[i][j] = dp[i-1][j-1]
- Else: dp[i][j] = min(dp[i-1][j] + s1[i-1], dp[i][j-1] + s2[j-1])

---

## Video Tutorial Links

### Fundamentals

- [LCS Introduction (Take U Forward)](https://www.youtube.com/watch?v=NPw9K2zH5Q4) - Comprehensive introduction to LCS
- [Longest Common Subsequence (WilliamFiset)](https://www.youtube.com/watch?v=LAwnG4C2QEw) - Detailed explanation with visualizations
- [LCS Dynamic Programming (NeetCode)](https://www.youtube.com/watch?v=NnP57Rj4r7U) - Practical implementation guide

### Advanced Topics

- [Edit Distance Problem](https://www.youtube.com/watch?v=We3Yvs7SmjX) - Related problem with more operations
- [Shortest Common Supersequence](https://www.youtube.com/watch?v=VDuchYJnw5k) - Building on LCS
- [Palindromic Subsequence](https://www.youtube.com/watch?v=AWJ0PPDboP4) - LCS with reversed string

### Variations

- [Longest Common Substring](https://www.youtube.com/watch?v=BysNXJb8jC8) - Contiguous vs non-contiguous
- [Space Optimization for LCS](https://www.youtube.com/watch?v=hR3s9rGlNUs) - Reducing memory usage

---

## Follow-up Questions

### Q1: What is the difference between LCS and Longest Common Substring?

**Answer:**
- **LCS (Subsequence)**: Characters don't need to be contiguous; maintains relative order
- **Longest Common Substring**: Characters MUST be contiguous
- LCS is more flexible and generally has larger results
- Implementation differs: substring sets cell to 0 on mismatch, subsequence takes max of left/top

---

### Q2: Can LCS be solved recursively without DP?

**Answer:** Yes, but it's extremely inefficient:
- Recursive solution has O(2^m × 2^n) time complexity in worst case
- With memoization, it becomes O(m × n) - same as bottom-up DP
- However, recursion has O(m × n) call stack space
- Bottom-up DP is generally preferred for better performance and no stack overflow risk

---

### Q3: What is the maximum string length LCS can handle?

**Answer:** With standard O(m × n) space:
- **Memory**: ~100MB → ~10⁷ cells → strings up to ~3000 chars
- **Time**: For 3000×3000, that's 9 million operations - feasible

For very long strings:
- Use space-optimized version (O(min(m,n)) space)
- Consider approximation algorithms for DNA sequences (millions of chars)
- Use suffix trees for multiple queries

---

### Q4: How does LCS relate to the Edit Distance problem?

**Answer:** They are closely related:
- **LCS**: Maximize matching characters
- **Edit Distance**: Minimize operations (insert, delete, replace)
- Relationship: Edit Distance = len(s1) + len(s2) - 2 × LCS(s1, s2)
- Both use similar DP approaches

---

### Q5: Can LCS handle Unicode or multibyte characters?

**Answer:** Yes, but with considerations:
- The algorithm works at the character level regardless of encoding
- For UTF-8 strings in Python, each character is a Unicode code point
- In C++/Java, `std::string`/`String` handles Unicode natively
- Performance may vary based on character encoding

---

## Summary

The Longest Common Subsequence is a fundamental dynamic programming problem with applications in string comparison, version control, bioinformatics, and more.

- **Core Concept**: Build a 2D table where each cell represents LCS length of prefixes
- **Time Complexity**: O(m × n) - must examine all cell combinations
- **Space Complexity**: O(m × n) standard, O(min(m, n)) optimized
- **Key Insight**: Only need previous row for length; full table for reconstruction

When to use:
- ✅ String comparison and diff tools
- ✅ Finding common patterns in sequences
- ✅ Bioinformatics applications
- ✅ Related problems (edit distance, palindromic subsequence)
- ❌ Very long strings (millions of chars) - use suffix trees
- ❌ When only approximate matching needed - use hashing

This algorithm is essential for competitive programming and technical interviews, serving as a building block for many string DP problems.

---

## Related Algorithms

- [Shortest Common Supersequence](./shortest-common-supersequence.md) - Build shortest superstring containing both
- [Edit Distance](./edit-distance.md) - Minimum operations to transform strings
- [Longest Increasing Subsequence](./lis.md) - Similar DP approach for single array
- [Palindromic Subsequence](./palindromic-subsequence.md) - LCS with reversed string
