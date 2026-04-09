## DP - Word Break: Framework

What is the complete code template for word break problems?

<!-- front -->

---

### Framework 1: Word Break DP

```
┌─────────────────────────────────────────────────────┐
│  WORD BREAK - TEMPLATE                                   │
├─────────────────────────────────────────────────────┤
│  dp[i] = True if s[0:i] can be segmented into         │
│          dictionary words                              │
│                                                        │
│  1. word_set = set(word_dict)  # O(1) lookup           │
│     dp = [False] * (len(s) + 1)                       │
│     dp[0] = True  # empty string is valid             │
│                                                        │
│  2. For i from 1 to len(s):                          │
│        For j from 0 to i:                             │
│           If dp[j] and s[j:i] in word_set:           │
│              dp[i] = True                             │
│              Break  # early exit                      │
│                                                        │
│  3. Return dp[len(s)]                                  │
└─────────────────────────────────────────────────────┘
```

---

### Implementation

```python
def word_break(s, word_dict):
    """
    Check if string can be segmented into dictionary words.
    LeetCode 139
    Time: O(n² × m), Space: O(n)
    """
    word_set = set(word_dict)
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True  # Empty string
    
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break  # Early termination
    
    return dp[n]
```

---

### Implementation: All Possible Breaks

```python
def word_break_all(s, word_dict):
    """Return all possible word break combinations."""
    word_set = set(word_dict)
    n = len(s)
    dp = [[] for _ in range(n + 1)]
    dp[0] = [[]]  # Empty list of lists
    
    for i in range(1, n + 1):
        for j in range(i):
            word = s[j:i]
            if dp[j] and word in word_set:
                for prev in dp[j]:
                    dp[i].append(prev + [word])
    
    return [' '.join(words) for words in dp[n]]
```

---

### Key Pattern Elements

| Element | Meaning |
|---------|---------|
| `dp[i]` | Can segment s[0:i] |
| `dp[j]` | Can segment prefix s[0:j] |
| `s[j:i]` | Current word candidate |
| `word_set` | O(1) lookup |

<!-- back -->
