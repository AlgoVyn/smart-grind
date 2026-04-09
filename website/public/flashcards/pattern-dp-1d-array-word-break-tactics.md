## DP - 1D Array (Word Break): Tactics

What are specific techniques and optimizations for Word Break problems?

<!-- front -->

---

### Tactic 1: Word Length Bounds Optimization

Skip checking impossible word lengths:

```python
def word_break_bounds(s: str, word_dict: List[str]) -> bool:
    """Only iterate through valid word lengths."""
    word_set = set(word_dict)
    min_len = min(len(w) for w in word_dict)
    max_len = max(len(w) for w in word_dict)
    
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    
    for i in range(min_len, n + 1):  # Start from min_len
        # Only check lengths that could be valid words
        for length in range(min_len, min(max_len, i) + 1):
            if dp[i - length] and s[i - length:i] in word_set:
                dp[i] = True
                break
    
    return dp[n]
```

**Impact:** Reduces inner loop from O(n) to O(k) where k = number of distinct word lengths.

---

### Tactic 2: Early Pruning with Trie

Use Trie for efficient prefix matching and early termination:

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

def word_break_trie(s: str, word_dict: List[str]) -> bool:
    """Trie-based approach for large dictionaries."""
    # Build trie
    root = TrieNode()
    for word in word_dict:
        node = root
        for c in word:
            if c not in node.children:
                node.children[c] = TrieNode()
            node = node.children[c]
        node.is_end = True
    
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    
    for i in range(n):
        if not dp[i]:
            continue  # Skip unreachable positions
        
        # Traverse trie from position i
        node = root
        for j in range(i, n):
            if s[j] not in node.children:
                break  # No more valid words from this prefix
            node = node.children[s[j]]
            if node.is_end:
                dp[j + 1] = True
    
    return dp[n]
```

**Best for:** Large dictionaries with many shared prefixes.

---

### Tactic 3: BFS Alternative

Use queue for iterative approach (sometimes more intuitive):

```python
from collections import deque

def word_break_bfs(s: str, word_dict: List[str]) -> bool:
    """BFS approach - explore all reachable positions."""
    word_set = set(word_dict)
    n = len(s)
    
    queue = deque([0])
    visited = [False] * n
    
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

**Note:** Add `max_word_length` bound to limit `end` range for optimization.

---

### Tactic 4: Memoization (Top-Down)

Recursive approach with memoization:

```python
from functools import lru_cache

def word_break_memo(s: str, word_dict: List[str]) -> bool:
    """Top-down with memoization."""
    word_set = set(word_dict)
    
    @lru_cache(maxsize=None)
    def can_break(start: int) -> bool:
        if start == len(s):
            return True
        
        for end in range(start + 1, len(s) + 1):
            if s[start:end] in word_set and can_break(end):
                return True
        return False
    
    return can_break(0)
```

**Use when:** Prefer recursive thinking or need to short-circuit early.

---

### Tactic 5: Handling Word Break II (All Solutions)

DP + Backtracking hybrid for finding all sentences:

```python
def word_break_ii(s: str, word_dict: List[str]) -> List[str]:
    """Find all possible segmentations."""
    word_set = set(word_dict)
    n = len(s)
    
    # First: DP to find valid positions
    dp = [False] * (n + 1)
    dp[0] = True
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    
    if not dp[n]:
        return []  # Early exit if impossible
    
    # Second: Backtracking only on valid paths
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

---

### Tactic Comparison

| Tactic | Time | Space | Best For |
|--------|------|-------|----------|
| Bounds optimization | O(n × k) | O(n) | Variable word lengths |
| Trie-based | O(n × L) | O(n + D) | Large shared-prefix dicts |
| BFS | O(n² × m) | O(n) | Alternative iterative style |
| Memoization | O(n² × m) | O(n) | Recursive preference |
| DP + Backtracking | O(2^n) worst | O(n) | Finding all solutions |

<!-- back -->
