## Two Pointers - String Comparison with Backspaces: Framework

What is the complete code template for comparing strings with backspace characters?

<!-- front -->

---

### Framework: Two Pointers with Backward Iteration

```
┌─────────────────────────────────────────────────────────────────┐
│  TWO POINTERS - STRING COMPARISON WITH BACKSPACES - TEMPLATE      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Key Insight: Process from RIGHT to LEFT - backspaces affect    │
│  characters to their LEFT, making backward iteration natural    │
│                                                                 │
│  1. Helper function: get_next_valid_index(string, index)        │
│     a. Initialize backspace_count = 0                           │
│     b. While index >= 0:                                        │
│        - If char == '#': backspace_count++                      │
│        - Else if backspace_count > 0: decrement it (skip char)  │
│        - Else: return index (found valid char)                  │
│        - index--                                                │
│     c. Return -1 if no valid char found                         │
│                                                                 │
│  2. Main comparison:                                            │
│     a. Initialize i = len(s)-1, j = len(t)-1                    │
│     b. While i >= 0 or j >= 0:                                  │
│        - i = get_next_valid_index(s, i)                         │
│        - j = get_next_valid_index(t, j)                         │
│        - If i < 0 and j < 0: return True (both exhausted)       │
│        - If i < 0 or j < 0: return False (mismatch)             │
│        - If s[i] != t[j]: return False (chars differ)             │
│        - i--, j-- (move to next)                                │
│     c. Return True (both pointers exhausted)                    │
└─────────────────────────────────────────────────────────────────┘
```

---

### Implementation: Optimal O(1) Space

```python
def backspace_compare(s: str, t: str) -> bool:
    """
    Compare strings with '#' backspace using two pointers.
    Time: O(n + m), Space: O(1)
    """
    def get_next_valid_index(string: str, index: int) -> int:
        """Find next valid character moving backwards."""
        backspace_count = 0
        while index >= 0:
            if string[index] == '#':
                backspace_count += 1
            elif backspace_count > 0:
                backspace_count -= 1
            else:
                return index
            index -= 1
        return -1
    
    i, j = len(s) - 1, len(t) - 1
    
    while i >= 0 or j >= 0:
        i = get_next_valid_index(s, i)
        j = get_next_valid_index(t, j)
        
        if i < 0 and j < 0:
            return True
        if i < 0 or j < 0:
            return False
        if s[i] != t[j]:
            return False
        
        i -= 1
        j -= 1
    
    return True
```

---

### Implementation: Iterative with Skip Counter (Java)

```java
public boolean backspaceCompare(String s, String t) {
    int i = s.length() - 1, j = t.length() - 1;
    int skipS = 0, skipT = 0;
    
    while (i >= 0 || j >= 0) {
        // Find next valid char in s
        while (i >= 0) {
            if (s.charAt(i) == '#') { skipS++; i--; }
            else if (skipS > 0) { skipS--; i--; }
            else break;
        }
        
        // Find next valid char in t
        while (j >= 0) {
            if (t.charAt(j) == '#') { skipT++; j--; }
            else if (skipT > 0) { skipT--; j--; }
            else break;
        }
        
        // Compare
        if (i >= 0 && j >= 0 && s.charAt(i) != t.charAt(j)) return false;
        if ((i >= 0) != (j >= 0)) return false;
        
        i--; j--;
    }
    
    return true;
}
```

---

### Key Framework Elements

| Element | Purpose | Role in Algorithm |
|---------|---------|-------------------|
| `backspace_count` | Tracks characters to skip | Increments on '#', decrements on valid char when > 0 |
| `get_next_valid_index()` | Finds next comparable char | Handles skip logic, returns -1 if exhausted |
| Right-to-left processing | Natural backspace handling | Backspaces delete left chars, encountered before deleted chars |
| `i < 0 && j < 0` | Both exhausted check | Strings are equal if both pointers finish together |
| `s[i] != t[j]` | Character mismatch | Immediate inequality detection |

<!-- back -->
