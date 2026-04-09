## Two Pointers - String Comparison with Backspaces: Tactics

What are the advanced techniques for backspace string problems?

<!-- front -->

---

### Tactic 1: Multiple Backspaces

**Problem**: Handle consecutive backspaces (###)

**Solution**: Counter handles this naturally

```python
# Handles "abc###" → ""
s = "abc###"
i = 5, skip = 0

i=5: '#' → skip=1, i=4
i=4: '#' → skip=2, i=3
i=3: '#' → skip=3, i=2
i=2: 'c', skip>0 → skip=2, i=1
i=1: 'b', skip>0 → skip=1, i=0
i=0: 'a', skip>0 → skip=0, i=-1
```

**Key**: While loop continues processing all backspaces and skips

---

### Tactic 2: Empty String Edge Cases

| Input | Output | Notes |
|-------|--------|-------|
| "" | "" | Empty matches empty |
| "#" | "" | Single backspace = empty |
| "####" | "" | Multiple backspaces = empty |
| "a#" | "" | Normal case |
| "#a" | "a" | Leading backspace ignored |

---

### Tactic 3: Optimization - Early Exit

```python
def backspace_compare_optimized(s, t):
    i, j = len(s) - 1, len(t) - 1
    
    while i >= 0 or j >= 0:
        # Get next valid chars
        skip_s = 0
        while i >= 0 and (s[i] == '#' or skip_s > 0):
            skip_s += 1 if s[i] == '#' else -1
            i -= 1
        
        skip_t = 0
        while j >= 0 and (t[j] == '#' or skip_t > 0):
            skip_t += 1 if t[j] == '#' else -1
            j -= 1
        
        # Early comparison
        if i < 0 and j < 0:
            return True  # Both exhausted
        if i < 0 or j < 0:
            return False  # One exhausted, one has char
        if s[i] != t[j]:
            return False  # Mismatch
        
        i -= 1
        j -= 1
    
    return True
```

---

### Tactic 4: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|-----|
| **Not handling skip > 0** | Skip counter never decreases | Decrement skip when skipping char |
| **Checking equality first** | Compare chars before skip processing | Process skips first |
| **Index out of bounds** | Access string[-1] | Check i >= 0 before accessing |
| **Not moving pointer after match** | Infinite loop | Decrement i and j after comparison |
| **Processing from start** | Wrong direction | Must process from end |

---

### Tactic 5: Variable Backspace Character

**Problem**: Backspace represented by different character

```python
def backspace_compare_custom(s, t, backspace_char='#'):
    def get_next(string, index):
        skip = 0
        while index >= 0:
            if string[index] == backspace_char:
                skip += 1
                index -= 1
            elif skip > 0:
                skip -= 1
                index -= 1
            else:
                break
        return index
    
    # Rest of algorithm...
```

---

### Tactic 6: Long Pressed Name Variant

**Problem**: Check if typed string is a long-pressed version of name

```python
def is_long_pressed_name(name, typed):
    """Typed may have extra repeated chars but correct backspace behavior."""
    i, j = 0, 0
    
    while j < len(typed):
        if i < len(name) and name[i] == typed[j]:
            i += 1
            j += 1
        elif j > 0 and typed[j] == typed[j - 1]:
            j += 1  # Extra repeated char
        else:
            return False
    
    return i == len(name)
```

<!-- back -->
