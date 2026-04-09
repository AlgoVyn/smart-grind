## DP - 1D Array (Word Break): Problem Forms

What are the standard problem forms for Word Break style DP?

<!-- front -->

---

### Form 1: Decision (Boolean)

**Pattern:** Return True/False if string can be segmented

```python
def word_break(s: str, word_dict: List[str]) -> bool:
    """
    LeetCode 139 - Word Break
    Time: O(n² × m), Space: O(n)
    """
    word_set = set(word_dict)
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True  # Empty string is valid
    
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break  # Early termination
    
    return dp[n]
```

| Key Point | Value |
|-----------|-------|
| Return type | `bool` |
| DP state | Valid/Invalid |
| Transition | `dp[i] = dp[j] AND (s[j:i] in dict)` |
| Early exit | Break inner loop when found |

---

### Form 2: Count Ways

**Pattern:** Return number of valid segmentations

```python
def word_break_count(s: str, word_dict: List[str]) -> int:
    """
    Count number of ways to segment.
    Time: O(n² × m), Space: O(n)
    """
    word_set = set(word_dict)
    n = len(s)
    dp = [0] * (n + 1)
    dp[0] = 1  # One way to form empty string
    
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] += dp[j]  # Accumulate ways
    
    return dp[n]

# With modulo (for large numbers)
MOD = 10**9 + 7
dp[i] = (dp[i] + dp[j]) % MOD
```

| Key Point | Value |
|-----------|-------|
| Initial state | `dp[0] = 1` (one way for empty) |
| Transition | Add contributions: `dp[i] += dp[j]` |
| Result | Can be large, use modulo |
| No early break | Must check all possibilities |

---

### Form 3: Word Break II (All Sentences)

**Pattern:** Return all possible valid segmentations

```python
def word_break_ii(s: str, word_dict: List[str]) -> List[str]:
    """
    LeetCode 140 - Word Break II
    Return all possible sentences.
    """
    word_set = set(word_dict)
    n = len(s)
    
    # First: Check if possible using DP
    dp = [False] * (n + 1)
    dp[0] = True
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    
    if not dp[n]:
        return []  # Early exit
    
    # Second: Backtrack to find all solutions
    result = []
    def backtrack(start: int, path: List[str]):
        if start == n:
            result.append(" ".join(path))
            return
        
        for end in range(start + 1, n + 1):
            word = s[start:end]
            if word in word_set:
                path.append(word)
                backtrack(end, path)
                path.pop()
    
    backtrack(0, [])
    return result
```

| Key Point | Value |
|-----------|-------|
| Two-phase | DP feasibility + backtracking |
| Pruning | Skip backtracking if dp[n] is False |
| Complexity | O(2^n) worst case for output |
| Optimization | Use memoization in backtrack |

---

### Form 4: Minimum Words

**Pattern:** Find segmentation using minimum number of words

```python
def word_break_min_words(s: str, word_dict: List[str]) -> int:
    """
    Minimum number of words for segmentation.
    Return -1 if impossible.
    """
    word_set = set(word_dict)
    n = len(s)
    
    # dp[i] = minimum words to form s[0:i]
    dp = [float('inf')] * (n + 1)
    dp[0] = 0  # 0 words for empty string
    
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] != float('inf') and s[j:i] in word_set:
                dp[i] = min(dp[i], dp[j] + 1)
    
    return dp[n] if dp[n] != float('inf') else -1
```

| Key Point | Value |
|-----------|-------|
| Initialization | `dp[0] = 0`, rest = `inf` |
| Transition | `dp[i] = min(dp[i], dp[j] + 1)` |
| Result check | Return -1 if still `inf` |

---

### Form 5: Concatenated Words

**Pattern:** Find longest word that can be formed by concatenating other words

```python
def find_longest_concatenated_word(words: List[str]) -> str:
    """
    LeetCode 472 - Concatenated Words
    """
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
    """Standard word break on word using word_set."""
    if not word_set:
        return False
    
    n = len(word)
    dp = [False] * (n + 1)
    dp[0] = True
    
    for i in range(1, n + 1):
        for j in range(i):
            # Note: j > 0 ensures at least 2 words used
            if dp[j] and word[j:i] in word_set:
                dp[i] = True
                break
    
    return dp[n]
```

| Key Point | Value |
|-----------|-------|
| Order | Sort by length ascending |
| Check before add | Verify using words already in set |
| Self-exclusion | Word being checked not in set yet |

---

### Form 6: Extra Characters

**Pattern:** Minimize characters left after optimal segmentation

```python
def min_extra_char(s: str, word_dict: List[str]) -> int:
    """
    LeetCode 2707 - Extra Characters in a String
    """
    word_set = set(word_dict)
    n = len(s)
    
    # dp[i] = min extra chars for s[0:i]
    dp = [float('inf')] * (n + 1)
    dp[0] = 0
    
    for i in range(1, n + 1):
        # Option 1: s[i-1] is extra
        dp[i] = dp[i - 1] + 1
        
        # Option 2: Try all endings at i
        for j in range(i):
            if s[j:i] in word_set:
                dp[i] = min(dp[i], dp[j])
    
    return dp[n]
```

| Form | DP Type | Return |
|------|---------|--------|
| Decision | Boolean | True/False |
| Count Ways | Integer | Number of ways |
| All Sentences | List[str] | All valid segmentations |
| Min Words | Integer | Minimum word count or -1 |
| Concatenated | String | Longest valid word |
| Extra Chars | Integer | Min unmatched characters |

<!-- back -->
