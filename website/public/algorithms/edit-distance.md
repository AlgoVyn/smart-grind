# Edit Distance

## Category
Dynamic Programming

## Description

Edit Distance (also known as Levenshtein Distance) is a classic dynamic programming problem that measures the minimum number of operations required to transform one string into another. The three allowed operations are:
- **Insert**: Add a character at any position
- **Delete**: Remove a character
- **Replace**: Change one character to another

This algorithm is fundamental in applications like spell checkers, DNA sequence alignment, fuzzy string matching, and plagiarism detection. The problem exhibits optimal substructure and overlapping subproblems, making it ideal for dynamic programming solutions.

---

## Concepts

### 1. Edit Operations

The three fundamental operations and their costs:

| Operation | Description | Cost |
|-----------|-------------|------|
| **Insert** | Add a character to string1 | 1 |
| **Delete** | Remove a character from string1 | 1 |
| **Replace** | Change one character to another | 1 |

### 2. DP State Definition

The key to solving edit distance is proper state definition:

- `dp[i][j]` = minimum number of operations to transform `word1[0...i-1]` to `word2[0...j-1]`
- The answer is found at `dp[m][n]` where m, n are string lengths

### 3. Recurrence Relation

The core recurrence that drives the solution:

```
If word1[i-1] == word2[j-1]:
    dp[i][j] = dp[i-1][j-1]  (characters match, no operation)
Else:
    dp[i][j] = 1 + min(
        dp[i-1][j],      // Delete word1[i-1]
        dp[i][j-1],      // Insert word2[j-1] into word1
        dp[i-1][j-1]     // Replace word1[i-1] with word2[j-1]
    )
```

### 4. Base Cases

The foundation of the DP table:

| Base Case | Meaning | Value |
|-----------|---------|-------|
| `dp[0][j]` | Transform empty to word2[0:j] | j insertions |
| `dp[i][0]` | Transform word1[0:i] to empty | i deletions |
| `dp[0][0]` | Both empty | 0 |

---

## Frameworks

### Framework 1: Standard DP Table

```
┌─────────────────────────────────────────────────────┐
│  EDIT DISTANCE STANDARD FRAMEWORK                   │
├─────────────────────────────────────────────────────┤
│  1. Create DP table of size (m+1) × (n+1)           │
│  2. Initialize base cases:                           │
│     - First row: dp[0][j] = j (j insertions)       │
│     - First col: dp[i][0] = i (i deletions)          │
│  3. Fill table using recurrence:                    │
│     - If chars match: dp[i][j] = dp[i-1][j-1]        │
│     - Else: 1 + min(delete, insert, replace)        │
│  4. Return dp[m][n]                                 │
└─────────────────────────────────────────────────────┘
```

**When to use**: When you need the full table for backtracking/operations

### Framework 2: Space-Optimized DP

```
┌─────────────────────────────────────────────────────┐
│  EDIT DISTANCE SPACE-OPTIMIZED FRAMEWORK            │
├─────────────────────────────────────────────────────┤
│  1. Use only two 1D arrays (prev and curr)         │
│  2. Ensure shorter string maps to array dimension  │
│  3. Initialize prev[j] = j                         │
│  4. For each row:                                   │
│     a. curr[0] = i                                  │
│     b. Fill curr[j] using prev array               │
│     c. Swap prev and curr                          │
│  5. Return prev[n]                                  │
└─────────────────────────────────────────────────────┘
```

**When to use**: Memory-constrained environments, only need distance (not operations)

### Framework 3: With Operation Reconstruction

```
┌─────────────────────────────────────────────────────┐
│  EDIT DISTANCE WITH RECONSTRUCTION                  │
├─────────────────────────────────────────────────────┤
│  1. Build full DP table (Framework 1)             │
│  2. Start from dp[m][n], backtrack:               │
│     - If chars match: move diagonally (no op)       │
│     - If came from dp[i-1][j-1] + 1: replace        │
│     - If came from dp[i][j-1] + 1: insert           │
│     - If came from dp[i-1][j] + 1: delete           │
│  3. Reverse collected operations                    │
│  4. Return (distance, operations list)              │
└─────────────────────────────────────────────────────┘
```

**When to use**: When you need to show the actual transformation steps

---

## Forms

### Form 1: Standard Edit Distance

All three operations allowed with equal cost.

| word1 | word2 | Distance | Operations |
|-------|-------|----------|------------|
| horse | ros | 3 | replace h→r, delete o, delete e |
| intention | execution | 5 | multiple ops |
| kitten | sitting | 3 | replace k→s, replace e→i, insert g |

### Form 2: Weighted Edit Distance

Different operations have different costs.

```
Example costs:
- Insert: 1
- Delete: 2 (more expensive)
- Replace: 1
```

### Form 3: Only Insert and Delete (No Replace)

Replace operation not allowed. Equivalent to:
`m + n - 2 × LCS(word1, word2)`

### Form 4: Hamming Distance Variant

Only substitutions allowed, strings must be same length.

| Use Case | Complexity |
|----------|------------|
| Error detection codes | O(n) |
| Equal length strings only | - |

### Form 5: Damerau-Levenshtein

Adds transposition (swap adjacent chars) as single operation.

| Operation | Example |
|-----------|---------|
| Transposition | ca → ac in one step |

---

## Tactics

### Tactic 1: Early Termination for One Edit Distance

For checking if distance is exactly 1:

```python
def is_one_edit_distance(s: str, t: str) -> bool:
    """Check if strings are exactly one edit apart."""
    m, n = len(s), len(t)
    
    if abs(m - n) > 1:
        return False
    
    if m == n:
        # Check for exactly one different character
        diff = sum(c1 != c2 for c1, c2 in zip(s, t))
        return diff == 1
    
    # Length differs by 1, check if one insert/delete
    if m > n:
        s, t = t, s
    
    for i in range(len(s)):
        if s[i] != t[i]:
            return s[i:] == t[i+1:]
    
    return True  # Extra character at end
```

### Tactic 2: Shortest Common Supersequence

Build the shortest string containing both inputs:

```python
def shortest_common_supersequence(str1: str, str2: str) -> str:
    """Find shortest string containing both str1 and str2."""
    # First find LCS
    # Then interleave characters
    m, n = len(str1), len(str2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Fill DP table (LCS)
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

### Tactic 3: Delete Operations Using LCS

When only delete is allowed:

```python
def min_deletions_to_make_equal(word1: str, word2: str) -> int:
    """Minimum deletions to make two strings equal."""
    # deletions = len(word1) + len(word2) - 2 * LCS
    from functools import lru_cache
    
    @lru_cache(maxsize=None)
    def lcs(i, j):
        if i == 0 or j == 0:
            return 0
        if word1[i-1] == word2[j-1]:
            return 1 + lcs(i-1, j-1)
        return max(lcs(i-1, j), lcs(i, j-1))
    
    common = lcs(len(word1), len(word2))
    return len(word1) + len(word2) - 2 * common
```

### Tactic 4: ASCII Cost Variant

When each character has a deletion cost equal to its ASCII value:

```python
def minimum_ascii_delete_sum(s1: str, s2: str) -> int:
    """Min ASCII sum of deleted chars to make strings equal."""
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Base cases
    for i in range(1, m + 1):
        dp[i][0] = dp[i-1][0] + ord(s1[i-1])
    for j in range(1, n + 1):
        dp[0][j] = dp[0][j-1] + ord(s2[j-1])
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = min(
                    dp[i-1][j] + ord(s1[i-1]),
                    dp[i][j-1] + ord(s2[j-1])
                )
    
    return dp[m][n]
```

### Tactic 5: Memory Optimization Check

When to use space optimization vs full table:

```python
def should_use_space_optimized(m: int, n: int, need_operations: bool) -> bool:
    """Determine which approach to use."""
    if need_operations:
        return False  # Need full table for backtracking
    if m * n > 10_000_000:  # > 10MB for ints
        return True  # Memory constraint
    return True  # Default to space optimized
```

---

## Python Templates

### Template 1: Standard Edit Distance

```python
def min_distance(word1: str, word2: str) -> int:
    """
    Standard edit distance with O(m*n) space.
    Returns minimum operations to transform word1 to word2.
    """
    m, n = len(word1), len(word2)
    
    # Create DP table
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Base cases
    for j in range(n + 1):
        dp[0][j] = j  # j insertions
    for i in range(m + 1):
        dp[i][0] = i  # i deletions
    
    # Fill the DP table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]  # Match
            else:
                dp[i][j] = 1 + min(
                    dp[i - 1][j],      # Delete
                    dp[i][j - 1],      # Insert
                    dp[i - 1][j - 1]   # Replace
                )
    
    return dp[m][n]
```

### Template 2: Space-Optimized Edit Distance

```python
def min_distance_optimized(word1: str, word2: str) -> int:
    """
    Space-optimized edit distance with O(min(m,n)) space.
    Only returns distance, not operations.
    """
    m, n = len(word1), len(word2)
    
    # Ensure word2 is shorter for less memory
    if n > m:
        word1, word2 = word2, word1
        m, n = n, m
    
    # Only need previous row
    prev = list(range(n + 1))
    curr = [0] * (n + 1)
    
    for i in range(1, m + 1):
        curr[0] = i
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                curr[j] = prev[j - 1]
            else:
                curr[j] = 1 + min(prev[j], curr[j - 1], prev[j - 1])
        prev, curr = curr, prev
    
    return prev[n]
```

### Template 3: Edit Distance with Operations

```python
def edit_distance_with_operations(word1: str, word2: str) -> tuple:
    """
    Returns both minimum distance and the sequence of operations.
    Uses full DP table for backtracking.
    """
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Initialize
    for j in range(n + 1):
        dp[0][j] = j
    for i in range(m + 1):
        dp[i][0] = i
    
    # Fill table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
    
    # Backtrack to find operations
    operations = []
    i, j = m, n
    while i > 0 or j > 0:
        if i > 0 and j > 0 and word1[i-1] == word2[j-1]:
            operations.append(f"Match '{word1[i-1]}'")
            i -= 1
            j -= 1
        elif i > 0 and j > 0 and dp[i][j] == dp[i-1][j-1] + 1:
            operations.append(f"Replace '{word1[i-1]}' with '{word2[j-1]}'")
            i -= 1
            j -= 1
        elif j > 0 and dp[i][j] == dp[i][j-1] + 1:
            operations.append(f"Insert '{word2[j-1]}'")
            j -= 1
        else:
            operations.append(f"Delete '{word1[i-1]}'")
            i -= 1
    
    return dp[m][n], operations[::-1]
```

### Template 4: Weighted Edit Distance

```python
def weighted_edit_distance(word1: str, word2: str,
                          insert_cost: int = 1,
                          delete_cost: int = 1,
                          replace_cost: int = 1) -> int:
    """
    Edit distance with custom operation costs.
    """
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for j in range(n + 1):
        dp[0][j] = j * insert_cost
    for i in range(m + 1):
        dp[i][0] = i * delete_cost
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = min(
                    dp[i - 1][j] + delete_cost,
                    dp[i][j - 1] + insert_cost,
                    dp[i - 1][j - 1] + replace_cost
                )
    
    return dp[m][n]
```

### Template 5: One Edit Distance Check

```python
def is_one_edit_distance(s: str, t: str) -> bool:
    """
    Check if two strings are exactly one edit distance apart.
    O(n) time, O(1) space.
    """
    m, n = len(s), len(t)
    
    if abs(m - n) > 1 or s == t:
        return False
    
    # Ensure s is the shorter string
    if m > n:
        s, t = t, s
        m, n = n, m
    
    found_difference = False
    i = j = 0
    
    while i < m and j < n:
        if s[i] != t[j]:
            if found_difference:
                return False
            found_difference = True
            if m == n:
                i += 1  # Replace case
            # else: i stays same (insert/delete case)
            j += 1
        else:
            i += 1
            j += 1
    
    # If we haven't found a difference, check for extra char at end
    return found_difference or m != n
```

### Template 6: Shortest Common Supersequence

```python
def shortest_common_supersequence(str1: str, str2: str) -> str:
    """
    Find shortest string containing both str1 and str2 as subsequences.
    Uses edit distance concepts combined with LCS.
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

---

## When to Use

Use the Edit Distance algorithm when you need to solve problems involving:

- **String Transformation**: Converting one string to another with minimum operations
- **Spell Checking**: Finding the closest matching word in a dictionary
- **Fuzzy Matching**: Determining similarity between two strings
- **DNA Sequence Alignment**: Computing genetic sequence differences
- **Auto-correct Systems**: Suggesting corrections for typos
- **Plagiarism Detection**: Measuring text similarity

### Comparison with Alternatives

| Algorithm | Time | Space | Use Case |
|-----------|------|-------|----------|
| **Edit Distance (DP)** | O(m×n) | O(m×n) or O(min(m,n)) | Exact minimum operations needed |
| **Longest Common Subsequence** | O(m×n) | O(m×n) | Only insertions/deletions allowed |
| **Hamming Distance** | O(n) | O(1) | Equal length strings only |
| **Jaccard Similarity** | O(n) | O(n) | Set-based similarity |

### When to Choose Edit Distance vs Other Methods

- **Choose Edit Distance** when:
  - You need the exact minimum number of operations
  - All three operations (insert, delete, replace) are allowed
  - You need to reconstruct the actual transformation steps
  - Strings have different lengths

- **Choose LCS** when:
  - Only insertions and deletions are allowed (no replacements)
  - You need the actual common subsequence

- **Choose Hamming Distance** when:
  - Both strings have equal length
  - Only substitutions are considered
  - Performance is critical (O(n) vs O(m×n))

---

## Algorithm Explanation

### Core Concept

The key insight behind Edit Distance is that transforming a string can be broken down into smaller subproblems. To transform `word1[0...i]` to `word2[0...j]`, we only need to consider:

1. **Last character comparison**: If `word1[i-1] == word2[j-1]`, no operation is needed for these characters
2. **Three possible operations**: We can either insert, delete, or replace the last character

By building a table where each cell represents the minimum operations to transform prefixes of both strings, we can compute the final answer systematically.

### How It Works

#### DP Table Definition:
`dp[i][j]` = minimum number of operations to transform `word1[0...i-1]` to `word2[0...j-1]`

#### Recurrence Relation:
```
If word1[i-1] == word2[j-1]:
    dp[i][j] = dp[i-1][j-1]  (characters match)
Else:
    dp[i][j] = 1 + min(
        dp[i-1][j],      # Delete word1[i-1]
        dp[i][j-1],      # Insert word2[j-1] into word1
        dp[i-1][j-1]     # Replace word1[i-1] with word2[j-1]
    )
```

#### Base Cases:
- `dp[0][j] = j`: Transform empty string to `word2[0...j-1]` needs j insertions
- `dp[i][0] = i`: Transform `word1[0...i-1]` to empty string needs i deletions

### Visual Example

Transforming "horse" to "ros":

```
        ""  r   o   s
    ""    0   1   2   3
    h    1   1   2   3
    o    2   2   1   2
    r    3   2   2   2
    s    4   3   3   2
    e    5   4   4   3

Answer: dp[5][3] = 3

Path: replace h→r, delete o, delete e
```

### Why It Works

- **Optimal Substructure**: Solution can be built from subproblems
- **Overlapping Subproblems**: Same subproblems computed multiple times in naive recursion
- **Bottom-up DP**: We build the solution from smaller subproblems to larger ones
- **Each cell depends only on 3 previous cells**: making it ideal for DP

### Limitations

- **O(m×n) time**: Can be slow for very long strings
- **O(m×n) space**: Can be reduced to O(min(m,n)) but loses backtracking ability
- **Not suitable for online processing**: Requires both strings upfront
- **Limited operations**: Standard version doesn't handle transpositions

---

## Practice Problems

### Problem 1: Edit Distance (Classic)

**Problem:** [LeetCode 72 - Edit Distance](https://leetcode.com/problems/edit-distance/)

**Description:** Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2` where operations are insert, delete, or replace.

**How to Apply:**
- Classic edit distance problem
- Build DP table using standard recurrence
- Can use space-optimized version if only distance needed

---

### Problem 2: One Edit Distance

**Problem:** [LeetCode 161 - One Edit Distance](https://leetcode.com/problems/one-edit-distance/)

**Description:** Given two strings s and t, return true if they are both exactly one edit distance apart.

**How to Apply:**
- O(n) solution without full DP table
- Check length difference first
- Scan for first difference and verify remaining

---

### Problem 3: Minimum ASCII Delete Sum

**Problem:** [LeetCode 712 - Minimum ASCII Delete Sum for Two Strings](https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/)

**Description:** Given two strings, find the minimum sum of ASCII values of deleted characters to make them equal.

**How to Apply:**
- Similar to edit distance but only insert and delete (no replace)
- Cost of deleting a character is its ASCII value
- Use DP with cumulative costs

---

### Problem 4: Delete Operation for Two Strings

**Problem:** [LeetCode 583 - Delete Operation for Two Strings](https://leetcode.com/problems/delete-operation-for-two-strings/)

**Description:** Given two strings, return the minimum number of steps required to make the two strings equal. You can delete characters from either string.

**How to Apply:**
- Answer = len(word1) + len(word2) - 2 × LCS(word1, word2)
- Or use standard DP with only delete operations

---

### Problem 5: Shortest Common Supersequence

**Problem:** [LeetCode 1092 - Shortest Common Supersequence](https://leetcode.com/problems/shortest-common-supersequence/)

**Description:** Given two strings str1 and str2, return the shortest string that has both str1 and str2 as subsequences.

**How to Apply:**
- Use edit distance concepts combined with LCS
- Shortest common supersequence length = len(str1) + len(str2) - LCS
- Use DP to reconstruct the actual supersequence

---

## Video Tutorial Links

### Fundamentals

- [Edit Distance - Dynamic Programming (Take U Forward)](https://www.youtube.com/watch?v=XYi2LPrP824) - Comprehensive introduction
- [Levenshtein Distance Algorithm (WilliamFiset)](https://www.youtube.com/watch?v=MiX0QMxhF-0) - Detailed explanation with visualizations
- [Edit Distance LeetCode Solution (NeetCode)](https://www.youtube.com/watch?v=fRbaV1NF3X8) - Practical implementation

### Advanced Topics

- [Space Optimized Edit Distance](https://www.youtube.com/watch?v=We3Y1xK0rWw) - Reducing space complexity
- [Edit Distance Variations](https://www.youtube.com/watch?v=0iW91_2KH9o) - Different variants and use cases
- [DP on Strings (Striver)](https://www.youtube.com/watch?v=1hG9DO4psJU) - Edit distance as part of string DP

### Problem-Specific

- [Shortest Common Supersequence](https://www.youtube.com/watch?v=VDuchYJnw5k) - Building on edit distance
- [Delete Operations](https://www.youtube.com/watch?v=ejSojB5vB4w) - LCS-based approach

---

## Follow-up Questions

### Q1: How would you optimize space complexity from O(m×n) to O(min(m,n))?

**Answer:** The key insight is that to compute `dp[i][j]`, we only need:
- `dp[i-1][j-1]` (the diagonal value)
- `dp[i-1][j]` (the value from the previous row)
- `dp[i][j-1]` (the value from the current row)

Therefore, we only need to keep two rows in memory at any time. We can swap between them using array rotation. Additionally, we should always use the shorter string for the DP array to minimize space.

---

### Q2: How would you reconstruct the actual operations performed?

**Answer:** To reconstruct operations, we need the full DP table (not the space-optimized version). Starting from `dp[m][n]`, we backtrack:
- If characters match, move diagonally (no operation)
- If `dp[i][j] = dp[i-1][j-1] + 1`, it was a replace operation
- If `dp[i][j] = dp[i][j-1] + 1`, it was an insert operation
- If `dp[i][j] = dp[i-1][j] + 1`, it was a delete operation

Continue until reaching `dp[0][0]`.

---

### Q3: What modifications are needed to handle only insert and delete (no replace)?

**Answer:** Simply remove the replace option from the recurrence:
```python
dp[i][j] = min(
    dp[i-1][j] + 1,  # Delete
    dp[i][j-1] + 1   # Insert
)
```

This is equivalent to finding the LCS and computing: `m + n - 2 × LCS`.

---

### Q4: How would you add custom costs for each operation?

**Answer:** Modify the recurrence to include costs:
```python
dp[i][j] = min(
    dp[i-1][j] + delete_cost,
    dp[i][j-1] + insert_cost,
    dp[i-1][j-1] + (0 if chars match else replace_cost)
)
```

This allows different costs for each operation type.

---

### Q5: What is the difference between Levenshtein and Damerau-Levenshtein distance?

**Answer:** The Damerau-Levenshtein distance adds **transposition** as a fourth operation (swapping two adjacent characters counts as one operation). It provides a more accurate measure for keyboard typos but is more complex to compute efficiently.

| Distance Type | Operations | Use Case |
|--------------|------------|----------|
| Levenshtein | Insert, Delete, Replace | General string similarity |
| Damerau-Levenshtein | + Transposition | Typo correction |

---

## Summary

Edit Distance (Levenshtein Distance) is a fundamental dynamic programming problem with wide applications in text processing, bioinformatics, and spell checking. Key takeaways:

- **Time Complexity**: O(m × n) for both standard and space-optimized versions
- **Space Complexity**: O(m × n) standard, O(min(m,n)) optimized
- **Core Idea**: Build DP table where each cell represents the minimum operations for prefix transformation
- **Three Operations**: Insert, Delete, Replace (each costs 1 in standard version)
- **Space Optimization**: Only need two rows at a time, swap and reuse

When to use:
- ✅ When you need exact minimum operations
- ✅ When all three operations are allowed
- ✅ When you need to reconstruct the transformation steps
- ❌ For very long strings where O(m×n) is too slow (consider approximate algorithms)

This algorithm is essential for competitive programming and technical interviews, forming the foundation for many string manipulation and dynamic programming problems.

---

## Related Algorithms

- [Longest Common Subsequence](./lcs.md) - Related DP problem
- [Longest Common Substring](./longest-common-substring.md) - Contiguous matching
- [Knuth-Morris-Pratt](./kmp.md) - String pattern matching
- [Rabin-Karp](./rabin-karp.md) - String hashing
