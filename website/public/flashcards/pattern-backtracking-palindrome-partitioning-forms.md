## Backtracking - Palindrome Partitioning: Forms

What are the different variations of palindrome partitioning problems?

<!-- front -->

---

### Form 1: List All Partitions (Classic)

**Problem**: Return all possible ways to partition the string into palindromes.

```
Input:  "aab"
Output: [["a","a","b"], ["aa","b"]]
```

**Approach**: Standard backtracking with palindrome validation.

**LeetCode**: 131 - Palindrome Partitioning

---

### Form 2: Minimum Cuts (Optimization)

**Problem**: Find minimum number of cuts needed so every substring is a palindrome.

```
Input:  "aab"
Output: 1  # Cut after "aa": ["aa"|"b"]

Input:  "aaa"
Output: 0  # Already all palindrome: ["aaa"]
```

**Approach**: DP - `dp[i]` = min cuts for `s[0:i+1]`

**LeetCode**: 132 - Palindrome Partitioning II

---

### Form 3: Count Ways (Counting)

**Problem**: Count total number of valid palindrome partitions.

```
Input:  "aab"
Output: 2  # Two ways to partition

Input:  "aaa"
Output: 3  # ["a","a","a"], ["a","aa"], ["aa","a"], ["aaa"] = 4
```

**Approach**: DP counting or memoized backtracking.

---

### Form 4: K Palindromes with Changes (Advanced)

**Problem**: Partition into exactly k palindromes with minimum character changes.

```
Input:  s = "abc", k = 2
Output: 1  # Change 'b' to 'a': ["aa","c"] or ["a","ac"→"aa"]?
             # Actually: ["aa","c"] requires 1 change
```

**Approach**: DP with state `(start, k)` tracking min changes.

**LeetCode**: 1278 - Palindrome Partitioning III

---

### Form 5: Longest Palindrome-First (Greedy Variant)

**Problem**: Find partition maximizing sum of palindrome lengths or longest first.

```
Input:  "aab"
Approach: Prefer longer palindromes
Result: ["aa","b"] over ["a","a","b"]
```

**Approach**: Backtracking with optimization criteria.

---

### Form Summary

| Form | Output | Approach | Complexity |
|------|--------|----------|------------|
| List all | All partitions | Backtracking | O(2^n × n) |
| Min cuts | Integer | DP | O(n²) |
| Count ways | Integer | DP / Memoization | O(n²) |
| K palindromes | Min changes | DP (start, k) | O(n² × k) |
| Greedy variant | One partition | Modified backtrack | O(2^n × n) |

<!-- back -->
