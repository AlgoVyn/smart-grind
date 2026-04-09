## Two Pointers - String Comparison with Backspaces: Framework

What is the complete code template for comparing strings with backspaces?

<!-- front -->

---

### Framework: Backspace String Compare Template

```
┌─────────────────────────────────────────────────────┐
│  BACKSPACE STRING COMPARE - TEMPLATE                 │
├─────────────────────────────────────────────────────┤
│  1. Initialize i = len(s) - 1, j = len(t) - 1       │
│  2. While i >= 0 or j >= 0:                         │
│     a. Process backspaces in s to get next char    │
│        - Skip = 0                                   │
│        - While i >= 0:                               │
│            If s[i] == '#': skip++, i--             │
│            Elif skip > 0: skip--, i--                │
│            Else: break                               │
│     b. Do same for t to get next char              │
│     c. Compare chars from both strings             │
│        - If different: return False                  │
│        - If both exhausted: return True             │
│     d. i--, j-- (move to next chars)               │
│  3. Return True if both processed completely        │
└─────────────────────────────────────────────────────┘
```

---

### Implementation

```python
def backspace_compare(s, t):
    i, j = len(s) - 1, len(t) - 1
    
    while i >= 0 or j >= 0:
        # Get next valid char from s
        skip_s = 0
        while i >= 0:
            if s[i] == '#':
                skip_s += 1
                i -= 1
            elif skip_s > 0:
                skip_s -= 1
                i -= 1
            else:
                break
        
        # Get next valid char from t
        skip_t = 0
        while j >= 0:
            if t[j] == '#':
                skip_t += 1
                j -= 1
            elif skip_t > 0:
                skip_t -= 1
                j -= 1
            else:
                break
        
        # Compare current chars
        if i >= 0 and j >= 0:
            if s[i] != t[j]:
                return False
        elif i >= 0 or j >= 0:
            # One string has char, other is exhausted
            return False
        
        i -= 1
        j -= 1
    
    return True
```

---

### Key Pattern Elements

| Element | Value | Purpose |
|---------|-------|---------|
| Start position | len(str) - 1 | Process from end |
| Skip counter | Track backspaces | Count # characters |
| Inner while | Process all backspaces | Handle consecutive ### |
| Outer while | i >= 0 or j >= 0 | Process until both exhausted |

---

### Step-by-Step Example

```
s = "ab#c", t = "ad#c"

i=3, j=3: s[3]='c', t[3]='c' → match ✓
          i=2, j=2

i=2, j=2: s[2]='#' → skip_s=1, i=1
          s[1]='b', skip_s>0 → skip_s=0, i=0
          s[0]='a' → char_a
          
          t[2]='#' → skip_t=1, j=1
          t[1]='d', skip_t>0 → skip_t=0, j=0
          t[0]='a' → char_a
          
          'a' == 'a' → match ✓
          i=-1, j=-1

Both exhausted → return True
```

<!-- back -->
