## Title: Word Break - Problem Forms

What are the standard problem forms for Word Break DP?

<!-- front -->

---

### Form 1: Decision (Boolean)

**Pattern:** Return True/False if segmentation possible

```python
def word_break(s: str, wordDict: List[str]) -> bool:
    word_set = set(wordDict)
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    
    return dp[n]
```

| Key Point | Value |
|-----------|-------|
| Return type | `bool` |
| Early termination | Break inner loop when found |
| Optimization | Check max word length |

---

### Form 2: Count Ways

**Pattern:** Return number of valid segmentations

```python
def word_break_count(s: str, wordDict: List[str]) -> int:
    word_set = set(wordDict)
    n = len(s)
    dp = [0] * (n + 1)
    dp[0] = 1
    
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] += dp[j]
    
    return dp[n]
```

**Overflow handling:**
```python
MOD = 10**9 + 7
dp[i] = (dp[i] + dp[j]) % MOD
```

| Key Point | Value |
|-----------|-------|
| Initial state | `dp[0] = 1` (one way for empty) |
| Transition | Add (not OR) contributions |
| Result | Can be large, use modulo |

---

### Form 3: Reconstruction (All Sentences)

**Pattern:** Return all possible valid segmentations

```python
def word_break_ii(s: str, wordDict: List[str]) -> List[str]:
    word_set = set(wordDict)
    n = len(s)
    
    # dp[i] = list of end indices for valid words ending at i
    dp = [[] for _ in range(n + 1)]
    dp[0] = [0]
    
    for i in range(n + 1):
        if not dp[i]:
            continue
        for word in wordDict:
            end = i + len(word)
            if end <= n and s[i:end] == word:
                dp[end].append(i)
    
    # Build sentences via backtracking
    result = []
    
    def build(pos, words):
        if pos == 0:
            result.append(' '.join(reversed(words)))
            return
        for start in dp[pos]:
            if start < pos:
                words.append(s[start:pos])
                build(start, words)
                words.pop()
    
    build(n, [])
    return result
```

---

### Form 4: Longest Valid Word

**Pattern:** Find longest word composed of other words

```python
def longest_concatenated_word(words: List[str]) -> str:
    words.sort(key=len)  # Process shorter first
    word_set = set()
    longest = ""
    
    for word in words:
        if can_form(word, word_set):
            if len(word) > len(longest):
                longest = word
        word_set.add(word)
    
    return longest

def can_form(word: str, word_set: Set[str]) -> bool:
    if not word_set:
        return False
    
    n = len(word)
    dp = [False] * (n + 1)
    dp[0] = True
    
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and word[j:i] in word_set:
                dp[i] = True
                break
    
    return dp[n]
```

---

### Form 5: With Additional Constraints

**Pattern:** Segmentation with extra conditions

```python
# Min/Max number of words
def word_break_min_words(s: str, wordDict: List[str]) -> int:
    word_set = set(wordDict)
    n = len(s)
    
    # dp[i] = min words to form s[0..i-1]
    dp = [float('inf')] * (n + 1)
    dp[0] = 0
    
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] != float('inf') and s[j:i] in word_set:
                dp[i] = min(dp[i], dp[j] + 1)
    
    return dp[n] if dp[n] != float('inf') else -1
```

| Constraint | DP State Modification |
|------------|----------------------|
| Min words | `dp[i] = min(dp[j] + 1)` |
| Max words | `dp[i] = max(dp[j] + 1)` |
| Min length | Track min length instead of count |

<!-- back -->
