## Two Pointers - String Comparison with Backspaces: Forms

What are the variations of the backspace string comparison pattern?

<!-- front -->

---

### Form 1: Basic Backspace Compare

**Purpose**: Compare two strings with '#' as backspace

```python
def backspace_compare(s, t):
    def get_next_valid_index(string, index):
        skip = 0
        while index >= 0:
            if string[index] == '#':
                skip += 1
                index -= 1
            elif skip > 0:
                skip -= 1
                index -= 1
            else:
                break
        return index
    
    i, j = len(s) - 1, len(t) - 1
    
    while i >= 0 or j >= 0:
        i = get_next_valid_index(s, i)
        j = get_next_valid_index(t, j)
        
        if i >= 0 and j >= 0:
            if s[i] != t[j]:
                return False
        elif i >= 0 or j >= 0:
            return False
        
        i -= 1
        j -= 1
    
    return True
```

---

### Form 2: Build Final String (O(n) Space)

**Purpose**: Alternative approach using stack-like building

```python
def build_string(string):
    result = []
    for char in string:
        if char != '#':
            result.append(char)
        elif result:
            result.pop()
    return ''.join(result)

def backspace_compare_build(s, t):
    return build_string(s) == build_string(t)
```

**Trade-off**: O(n) space but simpler logic

---

### Form 3: Single String Processing

**Purpose**: Return the final string after processing backspaces

```python
def process_backspaces(string):
    i = len(string) - 1
    skip = 0
    result = []
    
    while i >= 0:
        if string[i] == '#':
            skip += 1
        elif skip > 0:
            skip -= 1
        else:
            result.append(string[i])
        i -= 1
    
    return ''.join(reversed(result))
```

---

### Form 4: Can Type Comparison

**Purpose**: Check if typed string matches target with backspaces

```python
def can_type(name, typed):
    """Check if typed string could produce name with backspaces."""
    i, j = len(name) - 1, len(typed) - 1
    
    while i >= 0 or j >= 0:
        # Process backspaces for name
        skip_name = 0
        while i >= 0:
            if name[i] == '#':
                skip_name += 1
                i -= 1
            elif skip_name > 0:
                skip_name -= 1
                i -= 1
            else:
                break
        
        # Process backspaces for typed
        skip_typed = 0
        while j >= 0:
            if typed[j] == '#':
                skip_typed += 1
                j -= 1
            elif skip_typed > 0:
                skip_typed -= 1
                j -= 1
            else:
                break
        
        # Compare
        char_name = name[i] if i >= 0 else ''
        char_typed = typed[j] if j >= 0 else ''
        
        if char_name != char_typed:
            return False
        
        i -= 1
        j -= 1
    
    return True
```

---

### Form Comparison

| Form | Space | Time | Use Case |
|------|-------|------|----------|
| Two Pointers | O(1) | O(n) | Space-constrained |
| Stack Build | O(n) | O(n) | Simple implementation |
| Single Process | O(n) | O(n) | Need final string |
| Can Type | O(1) | O(n) | Validation problems |

<!-- back -->
