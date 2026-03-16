## Longest Common Prefix

**Question:** Find longest common prefix among strings?

<!-- front -->

---

## Answer: Horizontal Scanning

### Solution
```python
def longestCommonPrefix(strs):
    if not strs:
        return ""
    
    # Start with first string
    prefix = strs[0]
    
    # Compare with each string
    for s in strs[1:]:
        # Shrink prefix until it matches
        while not s.startswith(prefix):
            prefix = prefix[:-1]
            if not prefix:
                return ""
    
    return prefix
```

### Visual: Prefix Shrinking
```
strs = ["flower", "flow", "flight"]

prefix = "flower"

Compare "flow":
  "flower".startswith("flow") ✓
  prefix = "flow"

Compare "flight":
  "flow".startswith("flight") ✗
  prefix = "flo"
  "flo".startswith("flight") ✗
  prefix = "fl"
  "fl".startswith("flight") ✓
  prefix = "fl"

Result: "fl"
```

### ⚠️ Tricky Parts

#### 1. Why Start with First String?
```python
# Any string could be shortest
# But starting with first is simple
# Works because we shrink to find match
```

#### 2. Alternative: Vertical Scanning
```python
def longestCommonPrefixVertical(strs):
    if not strs:
        return ""
    
    # Compare character at each position
    for i in range(len(strs[0])):
        char = strs[0][i]
        
        for s in strs[1:]:
            if i == len(s) or s[i] != char:
                return strs[0][:i]
    
    return strs[0]
```

#### 3. Sort + Compare Ends
```python
def longestCommonPrefixSort(strs):
    if not strs:
        return ""
    
    # Sort strings
    strs.sort()
    
    # Compare first and last (most different)
    first, last = strs[0], strs[-1]
    
    i = 0
    while i < len(first) and i < len(last):
        if first[i] == last[i]:
            i += 1
        else:
            break
    
    return first[:i]
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Horizontal | O(S) | O(1) |
| Vertical | O(S) | O(1) |
| Sort | O(S log n) | O(1) |

(S = total characters)

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Empty prefix | Check if prefix becomes empty |
| Wrong return | Return prefix, not full string |
| Off-by-one | Slice correctly |

<!-- back -->
