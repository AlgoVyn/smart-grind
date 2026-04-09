## Sliding Window - Character Frequency Matching: Framework

What is the complete code template for character frequency matching using sliding window?

<!-- front -->

---

### Framework 1: Fixed-Length Window (Permutation/Anagram Detection)

```
┌─────────────────────────────────────────────────────────────┐
│  FIXED-LENGTH WINDOW - TEMPLATE                              │
├─────────────────────────────────────────────────────────────┤
│  Key Insight: Window size is fixed to len(pattern)           │
│                                                                │
│  1. Edge case: if len(t) > len(s): return false              │
│                                                                │
│  2. Initialize counters:                                      │
│     - t_count = frequency map of pattern t                    │
│     - window_count = frequency map of current window          │
│                                                                │
│  3. Build initial window with first len(t) chars of s        │
│                                                                │
│  4. Slide window one char at a time:                        │
│     - Add new right character to window_count                 │
│     - Remove leftmost character from window_count             │
│     - Clean up zero counts (for hash map)                     │
│     - If window_count == t_count: return true                 │
│                                                                │
│  5. Return false if no match found                            │
└─────────────────────────────────────────────────────────────┘
```

**Python Template:**
```python
from collections import Counter

def check_inclusion(t: str, s: str) -> bool:
    if len(t) > len(s):
        return False
    
    t_count = Counter(t)
    window_count = Counter()
    
    # Build initial window
    for i in range(len(t)):
        window_count[s[i]] += 1
    
    if window_count == t_count:
        return True
    
    # Slide window
    for i in range(len(t), len(s)):
        window_count[s[i]] += 1
        window_count[s[i - len(t)]] -= 1
        
        if window_count[s[i - len(t)]] == 0:
            del window_count[s[i - len(t)]]
        
        if window_count == t_count:
            return True
    
    return False
```

---

### Framework 2: Variable-Length Window (Minimum Window Substring)

```
┌─────────────────────────────────────────────────────────────┐
│  VARIABLE-LENGTH WINDOW - TEMPLATE                           │
├─────────────────────────────────────────────────────────────┤
│  Key Insight: Window expands until valid, then contracts    │
│                                                                │
│  1. Count pattern characters: dict_t = Counter(t)           │
│     - required = len(dict_t)  # unique chars needed         │
│                                                                │
│  2. Filter s to only chars present in t (optimization)       │
│                                                                │
│  3. Initialize: l=0, r=0, formed=0, window_counts={}        │
│                                                                │
│  4. Expand window (move r):                                   │
│     - Add char to window_counts                               │
│     - If window_counts[char] == dict_t[char]: formed += 1    │
│                                                                │
│  5. Contract while valid (formed == required):              │
│     - Update minimum window if smaller found                  │
│     - Remove left char: window_counts[char] -= 1              │
│     - If count < required: formed -= 1                      │
│     - Move left pointer                                       │
│                                                                │
│  6. Return minimum window or empty string                     │
└─────────────────────────────────────────────────────────────┘
```

**Python Template:**
```python
from collections import Counter

def min_window(s: str, t: str) -> str:
    if not t or not s:
        return ""
    
    dict_t = Counter(t)
    required = len(dict_t)
    
    # Filter s to only include characters in t
    filtered_s = [(i, char) for i, char in enumerate(s) if char in dict_t]
    
    l, r = 0, 0
    formed = 0
    window_counts = {}
    ans = float("inf"), None, None
    
    while r < len(filtered_s):
        character = filtered_s[r][1]
        window_counts[character] = window_counts.get(character, 0) + 1
        
        if window_counts[character] == dict_t[character]:
            formed += 1
        
        while l <= r and formed == required:
            character = filtered_s[l][1]
            
            end = filtered_s[r][0]
            start = filtered_s[l][0]
            if end - start + 1 < ans[0]:
                ans = (end - start + 1, start, end)
            
            window_counts[character] -= 1
            if window_counts[character] < dict_t[character]:
                formed -= 1
            
            l += 1
        
        r += 1
    
    return "" if ans[0] == float("inf") else s[ans[1]: ans[2] + 1]
```

---

### Framework 3: Optimized Match Count

```
┌─────────────────────────────────────────────────────────────┐
│  OPTIMIZED MATCH COUNT - TEMPLATE                              │
├─────────────────────────────────────────────────────────────┤
│  Key Insight: Track match_count instead of comparing arrays  │
│                                                                │
│  1. Use fixed-size arrays (128 for ASCII, 26 for lowercase)   │
│                                                                │
│  2. Count unique_chars in pattern t                           │
│                                                                │
│  3. Build initial window, increment match_count when         │
│     window_count[char] == t_count[char]                        │
│                                                                │
│  4. Slide window:                                            │
│     - When adding: if window_count[new] == t_count[new]:     │
│       match_count += 1                                         │
│     - When removing: if window_count[left] < t_count[left]:   │
│       match_count -= 1                                         │
│                                                                │
│  5. Check: if match_count == unique_chars: found match       │
└─────────────────────────────────────────────────────────────┘
```

**Python Template:**
```python
def min_window_optimized(s: str, t: str) -> str:
    if len(t) > len(s):
        return ""
    
    t_count = [0] * 128
    window_count = [0] * 128
    match_count = 0
    
    unique_chars = 0
    for char in t:
        if t_count[ord(char)] == 0:
            unique_chars += 1
        t_count[ord(char)] += 1
    
    for i in range(len(t)):
        window_count[ord(s[i])] += 1
        if window_count[ord(s[i])] == t_count[ord(s[i])]:
            match_count += 1
    
    if match_count == unique_chars:
        return s[:len(t)]
    
    for i in range(len(t), len(s)):
        window_count[ord(s[i])] += 1
        if window_count[ord(s[i])] == t_count[ord(s[i])]:
            match_count += 1
        
        window_count[ord(s[i - len(t)])] -= 1
        if window_count[ord(s[i - len(t)])] < t_count[ord(s[i - len(t)])]:
            match_count -= 1
        
        if match_count == unique_chars:
            return s[i - len(t) + 1: i + 1]
    
    return ""
```

---

### Template Selection Guide

| Problem Type | Use Framework |
|--------------|---------------|
| Check if t is permutation of substring in s | **Fixed-Length** (Approach 1) |
| Find minimum window containing all t chars | **Variable-Length** (Approach 2) |
| Memory-constrained environment | **Optimized Match Count** (Approach 3) |
| Unicode/special characters | Variable-Length with Counter/Map |
| All valid windows needed | Modify to collect all matches |

<!-- back -->
