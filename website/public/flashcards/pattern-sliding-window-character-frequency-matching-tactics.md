## Sliding Window - Character Frequency Matching: Tactics

What are practical tactics for solving character frequency matching problems?

<!-- front -->

---

### Tactic 1: Identify Problem Variant

**Quick classification based on keywords:**

```python
def classify_frequency_problem(description):
    """
    Determine which variant to use.
    """
    keywords = {
        'minimum window': 'variable_length',
        'smallest substring containing': 'variable_length',
        'permutation in string': 'fixed_length',
        'anagram': 'fixed_length',
        'contains all characters': 'variable_length',
        'check if substring is': 'fixed_length',
    }
    
    desc_lower = description.lower()
    for keyword, pattern in keywords.items():
        if keyword in desc_lower:
            return pattern
    
    # Additional check: does it ask for exact match?
    if 'exactly' in desc_lower or 'is a permutation' in desc_lower:
        return 'fixed_length'
    
    return 'unknown'
```

| Keyword/Phrase | Window Type | Time | Space |
|----------------|-------------|------|-------|
| "minimum window" / "smallest" | Variable | O(m+n) | O(m+n) |
| "permutation" / "anagram" | Fixed | O(m+n) | O(Σ) |
| "contains all of" | Variable | O(m+n) | O(m+n) |
| "exactly the characters" | Fixed | O(m+n) | O(Σ) |

---

### Tactic 2: Choose the Right Data Structure

**Decision tree for counter implementation:**

```
Input character set?
├── Lowercase English letters (a-z) only
│   └── Use int[26] - fastest, smallest
│       index = ord(char) - ord('a')
│
├── ASCII characters (0-127)
│   └── Use int[128] - still O(1) access
│       index = ord(char)
│
├── Extended ASCII or larger fixed set
│   └── Use int[256] or appropriate size
│
└── Unicode, arbitrary characters, or unknown
    └── Use Counter / HashMap / dict
        More flexible, O(k) space where k = unique chars
```

**Code comparison:**
```python
# Array approach (fastest for a-z)
def count_array(s):
    count = [0] * 26
    for c in s:
        count[ord(c) - ord('a')] += 1
    return count

# Counter approach (most flexible)
from collections import Counter
def count_counter(s):
    return Counter(s)
```

---

### Tactic 3: Optimize with Match Count

**Avoid expensive full-array comparisons:**

```python
def optimized_match_count(s, t):
    """
    Instead of comparing entire arrays each slide,
    track how many characters have matching counts.
    """
    t_count = [0] * 128
    window_count = [0] * 128
    
    # Count unique chars needed
    unique_chars = 0
    for c in t:
        if t_count[ord(c)] == 0:
            unique_chars += 1
        t_count[ord(c)] += 1
    
    match_count = 0
    
    # Helper to check match without full comparison
    def update_match(char_code, delta):
        nonlocal match_count
        
        # Before update
        before = window_count[char_code] == t_count[char_code]
        
        # Apply change
        window_count[char_code] += delta
        
        # After update
        after = window_count[char_code] == t_count[char_code]
        
        # Update match_count
        if before and not after:
            match_count -= 1
        elif not before and after:
            match_count += 1
    
    # Build initial window
    for i in range(len(t)):
        update_match(ord(s[i]), 1)
    
    if match_count == unique_chars:
        return True
    
    # Slide window
    for i in range(len(t), len(s)):
        update_match(ord(s[i]), 1)          # Add new
        update_match(ord(s[i - len(t)]), -1)  # Remove old
        
        if match_count == unique_chars:
            return True
    
    return False
```

---

### Tactic 4: Filter String Optimization

**For variable-length problems, filter irrelevant characters:**

```python
from collections import Counter

def min_window_optimized(s: str, t: str) -> str:
    """
    Optimization: Filter s to only chars present in t.
    Reduces iterations from O(len(s)) to O(len(filtered_s)).
    """
    if not t or not s:
        return ""
    
    dict_t = Counter(t)
    required = len(dict_t)
    
    # KEY OPTIMIZATION: Filter s
    # Only keep characters that exist in t
    filtered_s = [(i, char) for i, char in enumerate(s) 
                  if char in dict_t]
    
    # Now we only iterate over relevant characters
    l, r = 0, 0
    formed = 0
    window_counts = {}
    ans = float("inf"), None, None
    
    while r < len(filtered_s):
        # ... rest of algorithm
        # Much fewer iterations if s has many irrelevant chars
        pass
```

**Example savings:**
```
s = "ADOBECODEBANC" (13 chars)
t = "ABC"
filtered_s = [(0,'A'), (3,'B'), (5,'C'), (9,'A'), (10,'B'), (12,'C')]
              # 6 items instead of 13 - 54% reduction!
```

---

### Tactic 5: Handle Edge Cases Systematically

**Checklist before implementing:**

```python
def frequency_matching_with_edge_cases(s, t):
    """
    Complete edge case handling.
    """
    # 1. Empty inputs
    if not s or not t:
        return appropriate_default  # "" or False or []
    
    # 2. Pattern longer than source
    if len(t) > len(s):
        return appropriate_default
    
    # 3. Single character inputs
    if len(t) == 1:
        return s == t or t in s  # Depends on problem
    
    # 4. All same characters
    if len(set(t)) == 1:
        # May have special optimization
        pass
    
    # 5. Pattern equals source
    if s == t:
        return appropriate_result  # True or s
    
    # Main algorithm here...
```

| Edge Case | Handling |
|-----------|----------|
| Empty s or t | Return empty/minimum result |
| len(t) > len(s) | Return False/empty immediately |
| Single char | Direct comparison |
| All identical chars | Special case if needed |
| Unicode/special chars | Use HashMap, not array |

---

### Tactic 6: Debug with Visual Tracing

**Add print statements to visualize window movement:**

```python
def debug_min_window(s, t):
    """
    Visual debugging for variable window.
    """
    dict_t = Counter(t)
    required = len(dict_t)
    
    l, r = 0, 0
    formed = 0
    window_counts = {}
    
    print(f"s = '{s}', t = '{t}'")
    print(f"Required: {dict_t}\n")
    
    while r < len(s):
        char = s[r]
        window_counts[char] = window_counts.get(char, 0) + 1
        
        print(f"Expand: l={l}, r={r}, window='{s[l:r+1]}'")
        print(f"  Add '{char}', count now {window_counts[char]}")
        
        if window_counts[char] == dict_t.get(char, 0):
            formed += 1
            print(f"  -> Character '{char}' satisfied! formed={formed}")
        
        while l <= r and formed == required:
            print(f"  Contract valid window: '{s[l:r+1]}' (len={r-l+1})")
            
            left_char = s[l]
            window_counts[left_char] -= 1
            
            if left_char in dict_t and window_counts[left_char] < dict_t[left_char]:
                formed -= 1
                print(f"    Remove '{left_char}', no longer valid")
            
            l += 1
        
        r += 1
        print()
```

<!-- back -->
