## DP - Word Break: Forms

What are the different variations of word break?

<!-- front -->

---

### Form 1: Basic Word Break (DP)

```python
def word_break(s, word_dict):
    """Check if segmentable."""
    word_set = set(word_dict)
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

---

### Form 2: DFS with Memo

```python
def word_break_dfs(s, word_dict):
    """DFS approach."""
    word_set = set(word_dict)
    memo = {}
    
    def can_break(start):
        if start in memo:
            return memo[start]
        if start == len(s):
            return True
        
        for end in range(start + 1, len(s) + 1):
            if s[start:end] in word_set and can_break(end):
                memo[start] = True
                return True
        
        memo[start] = False
        return False
    
    return can_break(0)
```

---

### Form 3: Word Break II (All Sentences)

```python
def word_break_ii(s, word_dict):
    """All possible sentences."""
    word_set = set(word_dict)
    memo = {}
    
    def helper(start):
        if start in memo:
            return memo[start]
        if start == len(s):
            return [[]]
        
        result = []
        for end in range(start + 1, len(s) + 1):
            word = s[start:end]
            if word in word_set:
                for rest in helper(end):
                    result.append([word] + rest)
        
        memo[start] = result
        return result
    
    return [' '.join(words) for words in helper(0)]
```

---

### Form Comparison

| Form | Returns | Approach | Use Case |
|------|---------|----------|----------|
| Basic | Boolean | DP | Check possible |
| DFS | Boolean | Recursive | Alternative |
| All | List | DFS | All sentences |

<!-- back -->
