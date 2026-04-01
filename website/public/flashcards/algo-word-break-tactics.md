## Title: Word Break - Tactics

What are practical tactics for solving Word Break variations?

<!-- front -->

---

### Tactic 1: Trie Optimization

**Pattern:** Use Trie for O(L) word lookup instead of O(n) substring

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word):
        node = self.root
        for c in word:
            if c not in node.children:
                node.children[c] = TrieNode()
            node = node.children[c]
        node.is_end = True
    
    def search_prefixes(self, s, start):
        """Return all end positions of words starting at start"""
        node = self.root
        ends = []
        for i in range(start, len(s)):
            if s[i] not in node.children:
                break
            node = node.children[s[i]]
            if node.is_end:
                ends.append(i + 1)
        return ends

def word_break_trie(s: str, wordDict: List[str]) -> bool:
    trie = Trie()
    for word in wordDict:
        trie.insert(word)
    
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    
    for i in range(n + 1):
        if not dp[i]:
            continue
        # Find all valid next positions from i
        for end in trie.search_prefixes(s, i):
            dp[end] = True
    
    return dp[n]
```

**Benefit:** Reduces inner loop from O(n) substring checks to direct Trie traversal.

---

### Tactic 2: Memoization with Pruning

**Pattern:** Top-down with memo for early termination cases

```python
from functools import lru_cache

def word_break_memo(s: str, wordDict: List[str]) -> bool:
    word_set = set(wordDict)
    max_len = max(len(w) for w in wordDict)
    n = len(s)
    
    @lru_cache(maxsize=None)
    def can_break(start: int) -> bool:
        if start == n:
            return True
        
        for end in range(start + 1, min(start + max_len + 1, n + 1)):
            if s[start:end] in word_set and can_break(end):
                return True
        return False
    
    return can_break(0)
```

| Scenario | Best Approach |
|----------|---------------|
| String sparse (few valid splits) | Memoization |
| String dense (many valid splits) | Bottom-up DP |
| Need all solutions | Memo + store paths |

---

### Tactic 3: Word Length Optimization

**Pattern:** Group words by length to reduce checks

```python
from collections import defaultdict

def word_break_length_opt(s: str, wordDict: List[str]) -> bool:
    # Group by length
    words_by_len = defaultdict(set)
    for word in wordDict:
        words_by_len[len(word)].add(word)
    
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    
    for i in range(1, n + 1):
        for length, words in words_by_len.items():
            if length > i:
                continue
            start = i - length
            if dp[start] and s[start:i] in words:
                dp[i] = True
                break
    
    return dp[n]
```

**Benefit:** Only check word lengths that exist in dictionary.

---

### Tactic 4: Bidirectional DP

**Pattern:** Build from both ends for reconstruction problems

```python
def word_break_bidirectional(s: str, wordDict: List[str]) -> List[str]:
    word_set = set(wordDict)
    n = len(s)
    
    # Forward: can reach from start
    forward = [False] * (n + 1)
    forward[0] = True
    
    for i in range(n):
        if not forward[i]:
            continue
        for word in wordDict:
            end = i + len(word)
            if end <= n and s[i:end] == word:
                forward[end] = True
    
    # Backward: can reach end
    backward = [False] * (n + 1)
    backward[n] = True
    
    for i in range(n - 1, -1, -1):
        for word in wordDict:
            end = i + len(word)
            if end <= n and s[i:end] == word and backward[end]:
                backward[i] = True
                break
    
    # Only explore positions that can reach end
    result = []
    
    def backtrack(pos, path):
        if pos == n:
            result.append(' '.join(path))
            return
        for word in wordDict:
            end = pos + len(word)
            if end <= n and s[pos:end] == word and backward[end]:
                backtrack(end, path + [word])
    
    backtrack(0, [])
    return result
```

**Benefit:** `backward` array prunes impossible branches early.

---

### Tactic 5: Rolling Hash for Substring Matching

**Pattern:** Use hash for O(1) substring comparison

```python
def word_break_hash(s: str, wordDict: List[str]) -> bool:
    BASE = 131
    MOD = 2**64  # Use natural overflow in Python
    
    # Precompute word hashes
    word_hashes = set()
    for word in wordDict:
        h = 0
        for c in word:
            h = (h * BASE + ord(c)) % MOD
        word_hashes.add((h, len(word)))
    
    n = len(s)
    # Prefix hash of s
    prefix = [0] * (n + 1)
    power = [1] * (n + 1)
    
    for i in range(n):
        prefix[i + 1] = (prefix[i] * BASE + ord(s[i])) % MOD
        power[i + 1] = (power[i] * BASE) % MOD
    
    def get_hash(l, r):
        # Hash of s[l..r-1]
        return (prefix[r] - prefix[l] * power[r - l]) % MOD
    
    dp = [False] * (n + 1)
    dp[0] = True
    
    for i in range(1, n + 1):
        for h, length in word_hashes:
            if length > i:
                continue
            if dp[i - length] and get_hash(i - length, i) == h:
                dp[i] = True
                break
    
    return dp[n]
```

<!-- back -->
