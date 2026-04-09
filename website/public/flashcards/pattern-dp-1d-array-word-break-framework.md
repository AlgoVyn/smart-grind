## DP - 1D Array (Word Break): Framework

What is the complete code template for Word Break style DP problems?

<!-- front -->

---

### Framework 1: Basic Word Break (Boolean DP)

```
┌──────────────────────────────────────────────────────────────┐
│  WORD BREAK DP - TEMPLATE                                    │
├──────────────────────────────────────────────────────────────┤
│  Key Insight: dp[i] = True means s[0:i] can be segmented     │
│                                                              │
│  1. Convert wordDict to set for O(1) lookups               │
│  2. Initialize dp[0] = True (empty string is valid)          │
│  3. For each position i from 1 to n:                        │
│     - For each previous position j from 0 to i:              │
│       - If dp[j] is True AND s[j:i] is in wordSet:           │
│         - Set dp[i] = True                                   │
│         - Break (early termination)                          │
│  4. Return dp[n]                                             │
└──────────────────────────────────────────────────────────────┘
```

---

### Implementation Template

```python
def word_break_template(s: str, word_dict: List[str]) -> bool:
    """
    Template for Word Break style DP.
    Time: O(n² × m), Space: O(n)
    """
    # Step 1: Convert to set for O(1) lookups
    word_set = set(word_dict)
    n = len(s)
    
    # Step 2: Initialize DP array
    dp = [False] * (n + 1)
    dp[0] = True  # Base case: empty string
    
    # Step 3: Fill DP table
    for i in range(1, n + 1):
        for j in range(i):
            # If prefix is valid and suffix is a word
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break  # Early termination
    
    # Step 4: Return result
    return dp[n]
```

---

### Framework 2: Optimized (Word Length Bounds)

```python
def word_break_optimized(s: str, word_dict: List[str]) -> bool:
    """
    Optimized: Only check valid word lengths.
    Reduces inner loop iterations.
    """
    word_set = set(word_dict)
    min_len = min(len(w) for w in word_dict)
    max_len = max(len(w) for w in word_dict)
    
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    
    for i in range(1, n + 1):
        # Only check valid word length range
        for length in range(min_len, min(max_len, i) + 1):
            j = i - length
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    
    return dp[n]
```

---

### Framework 3: Count Ways (Variation)

```python
def word_break_count(s: str, word_dict: List[str]) -> int:
    """
    Count number of ways to segment.
    Change: dp[i] += dp[j] instead of dp[i] = True
    """
    word_set = set(word_dict)
    n = len(s)
    dp = [0] * (n + 1)
    dp[0] = 1  # One way to form empty string
    
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] += dp[j]  # Add ways, don't break
    
    return dp[n]
```

---

### Key Pattern Elements

| Element | Purpose | Common Error |
|---------|---------|--------------|
| `word_set` | O(1) word lookup | Using list (O(m) per check) |
| `dp[0] = True` | Base case (empty string) | Forgetting this breaks everything |
| `s[j:i]` | Substring from j to i-1 | Off-by-one in indices |
| `break` on find | Early termination | Missing optimization |
| `dp[n]` | Final answer | Returning dp[n-1] by mistake |

<!-- back -->
