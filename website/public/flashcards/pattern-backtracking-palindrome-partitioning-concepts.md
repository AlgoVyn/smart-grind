## Backtracking - Palindrome Partitioning: Core Concepts

What are the fundamental principles of palindrome partitioning?

<!-- front -->

---

### Core Concept

**Try all possible partition points, validate each substring is a palindrome, and backtrack to explore alternatives.**

The key insight: At each position, try making a palindrome ending at every possible position from the current start, then recurse on the remaining suffix.

**Example "aab":**
```
Start at 0:
- "a" is palindrome → recurse on "ab"
  - "a" is palindrome → recurse on "b"
    - "b" is palindrome → done: ["a","a","b"]
  - "ab" is not palindrome → backtrack
- "aa" is palindrome → recurse on "b"
  - "b" is palindrome → done: ["aa","b"]
- "aab" is not palindrome → backtrack
```

---

### The Pattern

```
1. For each possible end position from current start:
   - Extract substring [start:end]
   - If palindrome:
     * Add to current partition
     * Recurse on remaining [end:]
     * Backtrack

2. Base case: start == len(s)
   - Current partition is complete
```

---

### Common Applications

| Problem Type | Use Case | Example |
|--------------|----------|---------|
| String partition | Decompose string | LeetCode 131 |
| Minimum cuts | Min palindrome partitions | LeetCode 132 (DP) |
| Count partitions | Number of ways | DP problem |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(2^n × n) | 2^n partitions, O(n) palindrome check |
| Space | O(n) | Recursion depth |
| Optimized | O(2^n) | With precomputed palindrome table |

---

### Optimization: Palindrome Table

```
Precompute palindrome[i][j] using DP:
- Single chars: palindrome[i][i] = True
- Two chars: palindrome[i][i+1] = (s[i] == s[i+1])
- Longer: palindrome[i][j] = (s[i] == s[j] && palindrome[i+1][j-1])

Then O(1) palindrome checks in backtracking!
```

<!-- back -->
