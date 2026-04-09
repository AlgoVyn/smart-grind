## DP - 1D Array (Word Break): Core Concepts

What are the fundamental concepts behind Word Break DP?

<!-- front -->

---

### Problem Definition

**Word Break:** Given a string `s` and a dictionary of valid words, determine if `s` can be segmented into a sequence of one or more dictionary words.

**Example:**
- s = "leetcode", wordDict = ["leet", "code"]
- Output: True ("leet" + "code")

---

### The Core Insight

**Prefix-Suffix Decomposition:**

If string `s[0:i]` can be segmented, there must exist some `j < i` where:
1. `s[0:j]` can be segmented (prefix)
2. `s[j:i]` is a valid word (suffix)

```
s = "leetcode"
      ↑
      j=4 ("leet" is in dict)
      
If dp[4] is True AND "code" is in dict:
   Then dp[8] is True
```

---

### DP State Definition

| Variant | dp[i] Meaning | Base Case |
|---------|---------------|-----------|
| **Decision** | `s[0:i]` can be segmented | `dp[0] = True` |
| **Count Ways** | Number of ways to segment `s[0:i]` | `dp[0] = 1` |
| **Min Words** | Min words to segment `s[0:i]` | `dp[0] = 0` |
| **Max Words** | Max words to segment `s[0:i]` | `dp[0] = 0` |

---

### Recurrence Relations

```
Decision (Boolean):
    dp[i] = OR(dp[j] AND s[j:i] in wordSet) for all j < i
    
Count Ways:
    dp[i] = SUM(dp[j]) for all j where s[j:i] in wordSet
    
Min Words:
    dp[i] = MIN(dp[j] + 1) for all j where s[j:i] in wordSet
```

---

### Why Bottom-Up DP Works

| Property | Explanation |
|----------|-------------|
| **Optimal Substructure** | Solution to `s[0:i]` depends on solutions to `s[0:j]` where `j < i` |
| **Overlapping Subproblems** | Same prefixes checked multiple times, cached in dp array |
| **No Aftereffect** | Decision at position i doesn't affect validity of earlier positions |

---

### Time-Space Tradeoffs

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Basic DP | O(n² × m) | O(n) | Standard case |
| Optimized bounds | O(n × k × m) | O(n) | When word lengths vary widely |
| Trie-based | O(n × L) | O(n + D) | Large dictionary, many queries |
| BFS | O(n² × m) | O(n) | Alternative iterative approach |

*Where: n = string length, m = avg word length, k = # distinct word lengths, L = max word length, D = total chars in dict*

<!-- back -->
