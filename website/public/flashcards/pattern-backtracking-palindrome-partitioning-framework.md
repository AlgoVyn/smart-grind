## Backtracking - Palindrome Partitioning: Framework

What is the complete code template for palindrome partitioning?

<!-- front -->

---

### Framework 1: Standard Backtracking

```
┌─────────────────────────────────────────────────────┐
│  PALINDROME PARTITIONING - TEMPLATE                    │
├─────────────────────────────────────────────────────┤
│  1. Define backtrack(start, current):                  │
│     a. If start == len(s):                            │
│        - Add copy of current to results                │
│        - Return                                        │
│                                                        │
│     b. For end from start+1 to len(s):                │
│        - substring = s[start:end]                      │
│        - If substring is palindrome:                   │
│           current.append(substring)                    │
│           backtrack(end, current)                     │
│           current.pop()                               │
│                                                        │
│  2. Start with backtrack(0, [])                       │
│  3. Return results                                     │
└─────────────────────────────────────────────────────┘
```

---

### Implementation

```python
def partition(s):
    """
    Partition string into all palindrome substrings.
    LeetCode 131
    Time: O(2^n × n), Space: O(n)
    """
    def backtrack(start, current):
        if start == len(s):
            result.append(current[:])
            return
        
        for end in range(start + 1, len(s) + 1):
            substring = s[start:end]
            if substring == substring[::-1]:  # Palindrome check
                current.append(substring)
                backtrack(end, current)
                current.pop()
    
    result = []
    backtrack(0, [])
    return result
```

---

### Implementation: With Memoization

```python
def partition_optimized(s):
    """Precompute palindrome table for faster checking."""
    n = len(s)
    # dp[i][j] = True if s[i:j+1] is palindrome
    dp = [[False] * n for _ in range(n)]
    
    # Single chars are palindromes
    for i in range(n):
        dp[i][i] = True
    
    # Fill table
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if s[i] == s[j]:
                dp[i][j] = length == 2 or dp[i+1][j-1]
    
    def backtrack(start, current):
        if start == n:
            result.append(current[:])
            return
        
        for end in range(start, n):
            if dp[start][end]:
                current.append(s[start:end+1])
                backtrack(end + 1, current)
                current.pop()
    
    result = []
    backtrack(0, [])
    return result
```

---

### Key Pattern Elements

| Element | Purpose | Complexity |
|---------|---------|------------|
| `start` | Current position | Tracks progress |
| `end` | Partition point | Tries all cuts |
| Palindrome check | Validation | O(length) or O(1) with DP |
| `current` | Current partition | Building solution |

<!-- back -->
