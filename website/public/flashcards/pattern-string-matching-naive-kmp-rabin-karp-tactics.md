## String Matching (Naive / KMP / Rabin-Karp): Tactics

What are the advanced techniques and variations for string matching algorithms?

<!-- front -->

---

### Tactic 1: KMP with Multiple Pattern Search

Search for multiple patterns simultaneously using Aho-Corasick (KMP extension).

```python
class AhoCorasick:
    """
    Extension of KMP for multiple pattern matching.
    Build trie + failure links (like LPS for multiple patterns).
    """
    def __init__(self):
        self.trie = {}
        self.output = {}  # Patterns ending at each node
        self.fail = {}
    
    def add_pattern(self, pattern, idx):
        """Add pattern to trie."""
        node = self.trie
        for char in pattern:
            if char not in node:
                node[char] = {}
            node = node[char]
        self.output[id(node)] = self.output.get(id(node), []) + [(pattern, idx)]
    
    def build_failure_links(self):
        """Build failure links (like LPS array but for trie)."""
        from collections import deque
        queue = deque()
        
        # Level 1 nodes fail to root
        for char, node in self.trie.items():
            self.fail[id(node)] = self.trie
            queue.append(node)
        
        # BFS to build remaining failure links
        while queue:
            current = queue.popleft()
            for char, child in current.items():
                # Find failure link
                fail_state = self.fail.get(id(current), self.trie)
                while char not in fail_state and fail_state is not self.trie:
                    fail_state = self.fail.get(id(fail_state), self.trie)
                
                if char in fail_state:
                    self.fail[id(child)] = fail_state[char]
                else:
                    self.fail[id(child)] = self.trie
                
                queue.append(child)
    
    def search(self, text):
        """Find all occurrences of all patterns in text."""
        results = []
        node = self.trie
        
        for i, char in enumerate(text):
            # Follow failure links if char not found
            while char not in node and node is not self.trie:
                node = self.fail.get(id(node), self.trie)
            
            if char in node:
                node = node[char]
            
            # Check for matches at current node
            if id(node) in self.output:
                for pattern, idx in self.output[id(node)]:
                    results.append((i - len(pattern) + 1, pattern, idx))
        
        return results
```

**Use case**: DNA sequence analysis, intrusion detection, spam filtering

---

### Tactic 2: Rabin-Karp with Double Hash (Collision Prevention)

Use two different bases/primes to virtually eliminate false positives.

```python
def rabin_karp_double_hash(text: str, pattern: str) -> list[int]:
    """
    Rabin-Karp with double hashing to prevent collisions.
    """
    n, m = len(text), len(pattern)
    matches = []
    
    if m == 0 or m > n:
        return []
    
    # Two different hash parameters
    base1, prime1 = 256, 1000000007
    base2, prime2 = 257, 1000000009
    
    # Precompute powers
    h1 = h2 = 1
    for _ in range(m - 1):
        h1 = (h1 * base1) % prime1
        h2 = (h2 * base2) % prime2
    
    # Initial hashes
    p_hash1 = p_hash2 = 0
    t_hash1 = t_hash2 = 0
    
    for i in range(m):
        p_hash1 = (base1 * p_hash1 + ord(pattern[i])) % prime1
        p_hash2 = (base2 * p_hash2 + ord(pattern[i])) % prime2
        t_hash1 = (base1 * t_hash1 + ord(text[i])) % prime1
        t_hash2 = (base2 * t_hash2 + ord(text[i])) % prime2
    
    for i in range(n - m + 1):
        # Both hashes must match (collision unlikely)
        if p_hash1 == t_hash1 and p_hash2 == t_hash2:
            # Still verify for 100% certainty
            if text[i:i+m] == pattern:
                matches.append(i)
        
        if i < n - m:
            # Update both hashes
            t_hash1 = (base1 * (t_hash1 - ord(text[i]) * h1) + ord(text[i + m])) % prime1
            t_hash2 = (base2 * (t_hash2 - ord(text[i]) * h2) + ord(text[i + m])) % prime2
            
            if t_hash1 < 0: t_hash1 += prime1
            if t_hash2 < 0: t_hash2 += prime2
    
    return matches
```

**Benefit**: Collision probability drops from ~1/prime to ~1/(prime1 × prime2)

---

### Tactic 3: Finding All Anagrams (KMP Variation)

Use character frequency matching for anagram detection.

```python
def find_anagrams(s: str, p: str) -> list[int]:
    """
    Find all anagrams of p in s using sliding window + freq array.
    Similar to Rabin-Karp but with character counts as "hash".
    LeetCode 438
    """
    from collections import Counter
    
    result = []
    p_count = Counter(p)
    window_count = Counter()
    
    for i in range(len(s)):
        # Add current character
        window_count[s[i]] += 1
        
        # Remove leftmost character when window exceeds size
        if i >= len(p):
            window_count[s[i - len(p)]] -= 1
            if window_count[s[i - len(p)]] == 0:
                del window_count[s[i - len(p)]]
        
        # Compare frequency maps
        if i >= len(p) - 1 and window_count == p_count:
            result.append(i - len(p) + 1)
    
    return result
```

**Key insight**: Anagram matching is about character frequencies, not positions.

---

### Tactic 4: Repeated Substring Pattern (KMP Application)

Use LPS array to detect if a string is composed of repeated substrings.

```python
def repeated_substring_pattern(s: str) -> bool:
    """
    Check if string can be constructed by repeating a substring.
    LeetCode 459
    """
    n = len(s)
    if n <= 1:
        return False
    
    # Compute LPS
    lps = [0] * n
    length = 0
    i = 1
    
    while i < n:
        if s[i] == s[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0:
                length = lps[length - 1]
            else:
                lps[i] = 0
                i += 1
    
    # Key insight: if last LPS value > 0 and divides n evenly
    last_lps = lps[-1]
    return last_lps > 0 and n % (n - last_lps) == 0

# Explanation:
# If s = "ababab", lps[-1] = 4 ("abab")
# Pattern length = n - lps[-1] = 6 - 4 = 2
# Check: 6 % 2 == 0 → Yes, repeated pattern!
```

---

### Tactic 5: KMP for String Rotation Check

Check if one string is a rotation of another using KMP.

```python
def rotate_string(s: str, goal: str) -> bool:
    """
    Check if goal is a rotation of s.
    LeetCode 796
    """
    if len(s) != len(goal):
        return False
    
    # Key insight: rotation exists iff goal is substring of s+s
    # Use KMP for efficient search
    return len(kmp_string_match(s + s, goal)) > 0

# Example: s = "abcde", goal = "cdeab"
# s + s = "abcdeabcde"
# "cdeab" is substring → True!
```

---

### Tactic 6: Common Pitfalls & Fixes

| Pitfall | Issue | Fix |
|---------|-------|-----|
| **Off-by-one range** | `range(n - m)` misses last position | Use `range(n - m + 1)` |
| **LPS index error** | Using `lps[j]` instead of `lps[j-1]` | Use `j = lps[j-1]` after match |
| **Empty pattern** | Should match at every position | Return `range(n + 1)` |
| **Hash overflow** | Python handles big ints, but verify | Modulo operations prevent overflow |
| **Negative hash** | Rolling hash can go negative | Add prime: `if hash < 0: hash += prime` |
| **Forgot verification** | Rabin-Karp hash collision | Always verify when hash matches |

---

### Tactic 7: Boyer-Moore Alternative (Brief)

For completeness, Boyer-Moore is another efficient algorithm:

```python
def boyer_moore_search(text: str, pattern: str) -> list[int]:
    """
    Boyer-Moore with bad character heuristic.
    Often faster than KMP for large alphabets.
    """
    n, m = len(text), len(pattern)
    if m == 0 or m > n:
        return []
    
    # Build bad character table
    bad_char = {c: m for c in set(text)}
    for i in range(m - 1):
        bad_char[pattern[i]] = m - 1 - i
    
    matches = []
    i = 0  # text index
    
    while i <= n - m:
        j = m - 1  # pattern index (start from end)
        
        while j >= 0 and pattern[j] == text[i + j]:
            j -= 1
        
        if j < 0:
            matches.append(i)
            i += 1  # Or use good suffix heuristic
        else:
            # Skip based on bad character
            skip = bad_char.get(text[i + j], m)
            i += max(1, skip - (m - 1 - j))
    
    return matches
```

**When to use**: Very large alphabets (e.g., Unicode), long patterns

<!-- back -->
