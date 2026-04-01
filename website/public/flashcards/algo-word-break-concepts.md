## Title: Word Break - Core Concepts

What is the Word Break problem and when should DP be applied to string segmentation?

<!-- front -->

---

### Problem Definition

**Word Break:** Given string `s` and dictionary `wordDict`, determine if `s` can be segmented into space-separated words from `wordDict`.

| Variant | Question |
|---------|----------|
| **Decision** | Can s be segmented? (boolean) |
| **Count** | How many ways? (integer) |
| **Reconstruction** | Return all possible segmentations (list) |

---

### Key Characteristics

| Property | Description |
|----------|-------------|
| **Optimal substructure** | Prefix segmentation → suffix segmentation |
| **Overlapping subproblems** | Same substrings checked multiple times |
| **State** | `dp[i]` = can segment `s[0..i-1]` |
| **Transition** | `dp[i] = OR(dp[j] && s[j..i-1] in dict)` for all j < i |

---

### DP State Definition

```
s = "leetcode", wordDict = ["leet", "code"]

Index: 0    4        8
       |    |        |
s:     l e e t c o d e
       [leet] [code]
       
dp[i] = True if s[0..i-1] can be segmented

dp[0] = True (empty string can always be segmented)
dp[4] = dp[0] && "leet" in dict = True
dp[8] = dp[4] && "code" in dict = True
```

---

### Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| **Naive recursive** | O(2^n) | O(n) | Exponential, no memo |
| **Memoization** | O(n³) | O(n) | n states, O(n) substring each |
| **DP (hash set)** | O(n²) | O(n + W) | Check suffix in O(1) |
| **DP + Trie** | O(n²) | O(n + TW) | T=total chars in dict |

---

### Common Variations

| Problem | Modification |
|---------|--------------|
| Word Break I | Boolean: can segment? |
| Word Break II | Return all valid sentences |
| Concatenated Words | Find all words that are concatenations |
| Longest Word | Find longest word that can be built |

---

### Template Decision Tree

```
Need all segmentations?
├── Yes → DP + backtracking
│         dp[i] = list of valid breaks at i
│         Then backtrack to build sentences
│
└── No → Simple DP
         dp[i] = can reach i from any j < i
         where s[j..i-1] in dict
```

<!-- back -->
