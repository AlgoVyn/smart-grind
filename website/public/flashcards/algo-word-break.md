## Word Break: DP String Problem

**Question:** How do you determine if a string can be segmented into dictionary words?

<!-- front -->

---

## Answer: Build DP from Left to Right

### Solution
```python
def wordBreak(s, wordDict):
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True  # Empty string always valid
    
    for i in range(1, n + 1):
        for j in range(i):
            # Check if s[j:i] is in dictionary and dp[j] is True
            if dp[j] and s[j:i] in wordDict:
                dp[i] = True
                break
    
    return dp[n]

# With early exit (faster)
def wordBreak(s, wordDict):
    n = len(s)
    word_set = set(wordDict)
    dp = [False] * (n + 1)
    dp[0] = True
    
    max_len = max(len(w) for w in wordDict)
    
    for i in range(1, n + 1):
        for l in range(1, min(i, max_len) + 1):
            if dp[i-l] and s[i-l:i] in word_set:
                dp[i] = True
                break
    
    return dp[n]
```

### Visual: DP Table
```
s = "leetcode", wordDict = ["leet", "code"]

dp: [T, F, F, F, F, F, F, F, F]
      0  1  2  3  4  5  6  7  8

i=1: check "l" in dict? No
i=2: check "le" in dict? No
i=3: check "lee" in dict? No
i=4: check "leet" in dict? Yes (dp[0]=T) → dp[4]=T
     [T, F, F, F, T, F, F, F, F]

i=5: check "o" in dict? No
i=6: check "co" in dict? No
i=7: check "cod" in dict? No  
i=8: check "code" in dict? Yes (dp[4]=T) → dp[8]=T
     [T, F, F, F, T, F, F, F, T]

Result: dp[8]=T → True
```

### ⚠️ Tricky Parts

#### 1. Initialization
```python
# dp[0] = True is essential!
# Represents empty string being valid

# dp[i] = can segment s[0:i]
```

#### 2. Using Set for O(1) Lookup
```python
# Without set - O(n × m) per check
if s[j:i] in wordDict:  # O(m) if list

# With set - O(1) per check
word_set = set(wordDict)
if s[j:i] in word_set:  # O(1)
```

#### 3. Optimization with Word Length
```python
# Don't check every j!
# Only check words that could fit

max_len = max(len(w) for w in wordDict)
for l in range(1, min(i, max_len) + 1):
    # Only check substrings of valid length
```

### Word Break II (Return All Sentences)
```python
def wordBreak(s, wordDict):
    word_set = set(wordDict)
    dp = {0: [""]}
    
    for i in range(1, len(s) + 1):
        dp[i] = []
        for j in range(i):
            word = s[j:i]
            if word in word_set and j in dp:
                for sentence in dp[j]:
                    dp[i].append((sentence + " " + word).strip())
    
    return dp[len(s)]
```

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| dp[0] = False | Set dp[0] = True |
| No set lookup | Use set for O(1) check |
| O(n²) without limit | Use max word length |

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Basic | O(n² × m) | O(n) |
| With set | O(n²) | O(n) |
| With length limit | O(n × max_len) | O(n) |

n = len(s), m = avg word length

### Variation: Word Break with Different Dictionaries
```python
# Each position has its own dictionary
def wordBreak(s, dict_per_position):
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in dict_per_position[j]:
                dp[i] = True
                break
    
    return dp[n]
```

<!-- back -->
