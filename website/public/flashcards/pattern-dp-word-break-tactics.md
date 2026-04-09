## DP - Word Break: Tactics

What are the advanced techniques for word break?

<!-- front -->

---

### Tactic 1: Trie Optimization

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

def word_break_trie(s, word_dict):
    """Use Trie for faster prefix matching."""
    # Build Trie
    root = TrieNode()
    for word in word_dict:
        node = root
        for c in word:
            node = node.children.setdefault(c, TrieNode())
        node.is_end = True
    
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    
    for i in range(n):
        if not dp[i]:
            continue
        node = root
        for j in range(i, n):
            if s[j] not in node.children:
                break
            node = node.children[s[j]]
            if node.is_end:
                dp[j + 1] = True
    
    return dp[n]
```

---

### Tactic 2: Memoized DFS

```python
def word_break_dfs(s, word_dict):
    """DFS with memoization."""
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

### Tactic 3: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|----- |
| List lookup | O(m) per lookup | Convert to set |
| Wrong loop order | Missing valid breaks | Check all j < i |
| Not breaking early | Slow | Break when found |
| Memory with all breaks | Too many results | Use DFS for all |

---

### Tactic 4: Word Break II (All Sentences)

```python
def word_break_ii(s, word_dict):
    """Return all possible sentences."""
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

<!-- back -->
