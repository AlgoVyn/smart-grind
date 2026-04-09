## DP - 2D Array (LCS): Concepts

What are the fundamental concepts behind LCS?

<!-- front -->

---

### Core Concepts

**Subsequence Definition**
- A sequence that appears in the same relative order, but not necessarily contiguous
- Example: "ace" is a subsequence of "abcde"

**Prefix Comparison**
- dp[i][j] represents LCS of first i characters of s1 and first j characters of s2
- Build solution from empty prefixes to full strings

**Optimal Substructure**
- LCS of full strings depends on LCS of shorter prefixes
- Match extends diagonal; mismatch takes max of options

---

### When to Use LCS

| Scenario | Application |
|----------|-------------|
| **Diff algorithms** | File comparison, version control |
| **DNA alignment** | Bioinformatics sequence matching |
| **Plagiarism detection** | Document similarity |
| **Spell checking** | Finding closest valid word |
| **Shortest Common Supersequence** | Merge two strings minimally |

---

### Key "Aha" Moments

1. **Prefix building**: Start from empty and build up
2. **Diagonal extension**: Matches extend LCS from previous diagonal
3. **Choice at mismatch**: Skip either character, take best result
4. **Base case**: Empty prefix has LCS = 0

<!-- back -->
