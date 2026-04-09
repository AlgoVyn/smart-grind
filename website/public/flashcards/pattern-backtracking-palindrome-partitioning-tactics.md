## Backtracking - Palindrome Partitioning: Tactics

What are the advanced techniques for palindrome partitioning?

<!-- front -->

---

### Tactic 1: Minimum Cuts (DP)

```python
def min_cut(s):
    """Minimum cuts needed for palindrome partitioning."""
    n = len(s)
    
    # dp[i] = min cuts for s[0:i]
    dp = [i for i in range(n)]  # Worst case: cut every char
    
    # is_palindrome[i][j]
    pal = [[False] * n for _ in range(n)]
    
    for i in range(n-1, -1, -1):
        for j in range(i, n):
            if s[i] == s[j] and (j - i < 2 or pal[i+1][j-1]):
                pal[i][j] = True
                # If palindrome from i to j
                if i == 0:
                    dp[j] = 0  # No cuts needed
                else:
                    dp[j] = min(dp[j], dp[i-1] + 1)
    
    return dp[n-1]
```

---

### Tactic 2: Expand Around Center Palindrome Check

```python
def is_palindrome_expand(s, left, right):
    """Check if s[left:right+1] is palindrome using expand."""
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True
```

---

### Tactic 3: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|----- |
| Wrong substring range | Off-by-one | `s[start:end]` gives [start, end-1] |
| Not copying list | Reference issues | `result.append(current[:])` |
| Slow palindrome check | TLE | Precompute table or use expand |
| Forgetting to backtrack | Wrong state | Always `current.pop()` |

---

### Tactic 4: Find Longest Palindrome Partition

```python
def longest_palindrome_partition(s):
    """Find partition with maximum total palindrome length."""
    # All single chars are palindromes, so max is len(s)
    # Actually: find partition with longest individual palindromes
    max_len = 0
    best_partition = []
    
    def backtrack(start, current, total_len):
        nonlocal max_len, best_partition
        
        if start == len(s):
            if total_len > max_len:
                max_len = total_len
                best_partition = current[:]
            return
        
        for end in range(start + 1, len(s) + 1):
            substr = s[start:end]
            if substr == substr[::-1]:
                current.append(substr)
                backtrack(end, current, total_len + len(substr))
                current.pop()
    
    backtrack(0, [], 0)
    return best_partition
```

<!-- back -->
