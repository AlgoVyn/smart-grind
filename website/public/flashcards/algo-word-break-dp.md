## Word Break Problem

**Question:** How do you determine if a string can be segmented into dictionary words?

<!-- front -->

---

## Answer: Dynamic Programming

### Problem
Given string `s` and dictionary `wordDict`, can we split `s` into space-separated words?

### Solution
```python
def word_break(s, word_dict):
    word_set = set(word_dict)
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True  # Empty string is always valid
    
    for i in range(1, n + 1):
        for j in range(i):
            # Check if s[j:i] is in dictionary and dp[j] is True
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    
    return dp[n]
```

### Visual
```
s = "leetcode", wordDict = ["leet", "code"]

dp: [T, F, F, F, T, F, F, F, T]
      0  1  2  3  4  5  6  7  8

i=4: dp[4]=True because "leet" in dict and dp[0]=True
i=8: dp[8]=True because "code" in dict and dp[4]=True
```

### Complexity
- **Time:** O(n² × m) where m = max word length
- **Space:** O(n)

### Optimizations
```python
# Using set lookup is O(1), check substring length
for j in range(i - max_word_len, i):
    if dp[j] and s[j:i] in word_set:
```

### Variations
1. **Return the segmentation:**
```python
def word_break_paths(s, word_dict):
    dp = [[] for _ in range(len(s) + 1)]
    dp[0] = [""]
    
    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_dict:
                for path in dp[j]:
                    dp[i].append(path + " " + s[j:i] if path else s[j:i])
    
    return dp[len(s)]
```

### ⚠️ Common Mistakes
- Forgetting `dp[0] = True`
- Not using a set for O(1) lookup
- O(n³) when using substring creation

<!-- back -->
