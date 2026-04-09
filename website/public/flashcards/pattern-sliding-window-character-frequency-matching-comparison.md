## Sliding Window - Character Frequency Matching: Comparison

When should you use character frequency matching versus other string matching approaches?

<!-- front -->

---

### Comparison 1: Sliding Window Frequency vs Brute Force

| Aspect | Brute Force | Sliding Window Frequency |
|--------|-------------|-------------------------|
| **Time** | O(m × n × Σ) | O(m + n) |
| **Space** | O(Σ) | O(Σ) or O(k) |
| **Approach** | Check every substring | Expand/contract window |
| **Optimization** | None | Monotonic pointer movement |
| **Use Case** | Never in production | Standard approach |

**Brute Force (Don't Use):**
```python
def brute_force(s, t):  # O(m² × n) - SLOW!
    """Check every possible substring."""
    from collections import Counter
    t_count = Counter(t)
    
    for i in range(len(s)):
        for j in range(i + len(t), len(s) + 1):
            window = s[i:j]
            if all(window.count(c) >= t_count[c] for c in t_count):
                return window  # First valid found
    return ""
```

**Winner:** Sliding Window Frequency - always prefer O(m+n)

---

### Comparison 2: Fixed vs Variable Window

| Aspect | Fixed-Length | Variable-Length |
|--------|--------------|-----------------|
| **Problem Type** | Permutation/Anagram | Minimum Window |
| **Window Size** | Constant = len(t) | Dynamic |
| **Condition** | Exact match of counts | Counts ≥ required |
| **Tracking** | match_count or full compare | formed + required |
| **Contract** | Never (just slide) | While valid |
| **Examples** | Permutation in String | Minimum Window Substring |

**Decision Tree:**
```
Problem asks for:
├── "is X a permutation of substring" → FIXED
├── "find all anagrams" → FIXED
├── "minimum/smallest window containing" → VARIABLE
├── "find window with at least these chars" → VARIABLE
└── "contains all characters of" → VARIABLE
```

---

### Comparison 3: Array vs Hash Map Counters

| Aspect | Fixed Array | Hash Map/Counter |
|--------|-------------|------------------|
| **Access Time** | O(1) fastest | O(1) average |
| **Space** | O(Σ) fixed | O(k) where k=unique |
| **Alphabet** | Limited (26, 128, 256) | Unlimited/Unicode |
| **Cleanup** | Manual (set to 0) | Automatic (del zero) |
| **Comparison** | Direct array compare | map1 == map2 |
| **Best For** | a-z, ASCII | Unicode, sparse chars |

**Python Examples:**
```python
# Array - fast for limited alphabet
def with_array(s, t):
    t_count = [0] * 26
    for c in t:
        t_count[ord(c) - ord('a')] += 1
    # ... direct indexing

# Counter - flexible for any chars  
from collections import Counter
def with_counter(s, t):
    t_count = Counter(t)
    # ... flexible but slower
```

| Alphabet | Recommended |
|----------|-------------|
| lowercase a-z | int[26] |
| ASCII 0-127 | int[128] |
| Extended ASCII | int[256] |
| Unicode/unknown | Counter/dict |

---

### Comparison 4: Frequency Matching vs Other String Patterns

| Pattern | Time | Space | Best For | Key Differentiator |
|---------|------|-------|----------|-------------------|
| **Sliding Window Freq** | O(n) | O(Σ) | Substring with char constraints | Frequency comparison |
| **Sliding Window General** | O(n) | O(k) | Variable size with conditions | Generic condition check |
| **Two Pointers** | O(n) | O(1) | Pair matching, palindrome | From both ends |
| **KMP Algorithm** | O(m+n) | O(m) | Single pattern search | Prefix function |
| **Rabin-Karp** | O(m+n) avg | O(1) | Multiple pattern search | Rolling hash |
| **Suffix Array** | O(n log n) | O(n) | Many queries on same string | Preprocessing |
| **Trie** | O(m×L) | O(n×L) | Multiple string prefix search | Tree structure |

**When to use each:**
```
String matching problem?
├── Need exact pattern location → KMP / Rabin-Karp
├── Need substring with frequency requirements → SLIDING WINDOW FREQ
├── Need variable window for sum/constraints → SLIDING WINDOW
├── Need to match pairs from ends → TWO POINTERS
├── Multiple queries on same string → Suffix Array
└── Prefix matching many strings → Trie
```

---

### Comparison 5: Match Count vs Full Array Comparison

| Aspect | Full Array Compare | Match Count |
|--------|-------------------|-------------|
| **Operation** | `array1 == array2` | `match_count == unique_chars` |
| **Per-iteration cost** | O(Σ) | O(1) |
| **Total time** | O(m × Σ) | O(m + n) |
| **Space** | O(Σ) | O(Σ) + O(1) extra |
| **Code complexity** | Simple | Moderate |
| **Best For** | Small Σ, clean code | Large Σ, performance |

**Performance Impact:**
```
For Σ = 128 (ASCII), m = 10^6:
- Full compare: 10^6 × 128 = 128 × 10^6 operations
- Match count: ~10^6 operations
- Speedup: ~128x!
```

**When to use full compare:**
- Small alphabet (26 lowercase)
- Code clarity priority
- Interview settings (unless asked to optimize)

**When to use match count:**
- Large alphabet
- Performance-critical code
- Production implementations

<!-- back -->
