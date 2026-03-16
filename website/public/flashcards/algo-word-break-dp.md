## Word Break

**Question:** Can string be segmented into dictionary words?

<!-- front -->

---

## Answer: DP - Word Ending Position

### Solution
```python
def wordBreak(s, wordDict):
    word_set = set(wordDict)
    n = len(s)
    
    # dp[i] = can segment s[0:i]
    dp = [False] * (n + 1)
    dp[0] = True
    
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    
    return dp[n]
```

### Visual: DP Table
```
s = "leetcode", wordDict = ["leet", "code"]

dp[0] = True

i=4: s[0:4]="leet" → dp[4]=True
i=8: s[4:8]="code", dp[4]=True → dp[8]=True

Result: True
```

### ⚠️ Tricky Parts

#### 1. DP Meaning
```python
# dp[i] = True means s[0:i] can be segmented
# dp[0] = True (empty string always valid)

# Check: if dp[j] and s[j:i] in dict → dp[i] = True
```

#### 2. Why Outer Loop i?
```python
# Build up from left to right
# Need dp[j] computed before dp[i]

# j ranges from 0 to i-1 (all possible break points)
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| DP | O(n² × w) | O(n) |

w = max word length (can optimize)

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| dp[0] not set | dp[0] = True |
| Wrong dp meaning | dp[i] = s[0:i] can segment |
| Nested loop wrong | j from 0 to i |

<!-- back -->
