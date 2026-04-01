## Title: Word Break - Framework

What is the standard DP framework for Word Break problems?

<!-- front -->

---

### Basic DP Framework

```python
def word_break(s: str, wordDict: List[str]) -> bool:
    word_set = set(wordDict)
    n = len(s)
    
    # dp[i] = True if s[0..i-1] can be segmented
    dp = [False] * (n + 1)
    dp[0] = True  # Empty string
    
    for i in range(1, n + 1):
        for j in range(i):
            # Check if s[0..j-1] valid AND s[j..i-1] in dict
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break  # No need to check more j
    
    return dp[n]
```

---

### Optimized DP (Check Dictionary First)

```python
def word_break_optimized(s: str, wordDict: List[str]) -> bool:
    word_set = set(wordDict)
    max_len = max(len(w) for w in wordDict)
    n = len(s)
    
    dp = [False] * (n + 1)
    dp[0] = True
    
    for i in range(1, n + 1):
        # Only check words that could fit
        for word in wordDict:
            word_len = len(word)
            if word_len > i:
                continue
            if dp[i - word_len] and s[i - word_len:i] == word:
                dp[i] = True
                break
    
    return dp[n]
```

| Optimization | Effect |
|--------------|--------|
| Max word length | Limit inner loop range |
| Early break | Stop when found valid segmentation |
| Set lookup | O(1) dictionary check |

---

### Count Ways Framework

```python
def word_break_count(s: str, wordDict: List[str]) -> int:
    word_set = set(wordDict)
    n = len(s)
    
    # dp[i] = number of ways to segment s[0..i-1]
    dp = [0] * (n + 1)
    dp[0] = 1  # One way to segment empty string
    
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] > 0 and s[j:i] in word_set:
                dp[i] += dp[j]
    
    return dp[n]
```

---

### Reconstruction Framework

```python
def word_break_ii(s: str, wordDict: List[str]) -> List[str]:
    word_set = set(wordDict)
    n = len(s)
    
    # dp[i] = list of valid previous split points
    dp = [[] for _ in range(n + 1)]
    dp[0] = [-1]  # Start marker
    
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i].append(j)
    
    # Backtrack to build all sentences
    result = []
    
    def backtrack(pos, path):
        if pos == 0:
            result.append(' '.join(reversed(path)))
            return
        for prev in dp[pos]:
            if prev >= 0:
                path.append(s[prev:pos])
                backtrack(prev, path)
                path.pop()
    
    backtrack(n, [])
    return result
```

---

### Space Optimization

| Approach | Space | Technique |
|----------|-------|-----------|
| Standard | O(n) | Full dp array |
| Rolling | O(max_len) | Only keep last max_len states |
| BFS | O(n) | Visit positions, not full array |

```python
# BFS approach (space efficient for sparse valid points)
def word_break_bfs(s: str, wordDict: List[str]) -> bool:
    from collections import deque
    
    word_set = set(wordDict)
    n = len(s)
    visited = [False] * n
    queue = deque([0])
    
    while queue:
        start = queue.popleft()
        if start == n:
            return True
        if visited[start]:
            continue
        visited[start] = True
        
        for end in range(start + 1, n + 1):
            if s[start:end] in word_set:
                queue.append(end)
    
    return False
```

<!-- back -->
