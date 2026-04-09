## Two Pointers - String Comparison with Backspaces: Forms

What are the different variations and forms of string comparison with backspaces?

<!-- front -->

---

### Form 1: Standard Two Pointers (Optimal)

```python
def backspace_compare_standard(s: str, t: str) -> bool:
    """
    Standard optimal solution with O(1) space.
    LeetCode 844 - Backspace String Compare
    """
    def get_next_valid(string: str, index: int) -> int:
        skip = 0
        while index >= 0:
            if string[index] == '#':
                skip += 1
            elif skip > 0:
                skip -= 1
            else:
                return index
            index -= 1
        return -1
    
    i, j = len(s) - 1, len(t) - 1
    
    while i >= 0 or j >= 0:
        i = get_next_valid(s, i)
        j = get_next_valid(t, j)
        
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

**Space**: O(1), **Time**: O(n + m)

---

### Form 2: Stack-Based (Clarity)

```python
def backspace_compare_stack(s: str, t: str) -> bool:
    """
    Stack-based for readability and simplicity.
    """
    def process(string: str) -> list:
        stack = []
        for char in string:
            if char == '#':
                if stack:
                    stack.pop()
            else:
                stack.append(char)
        return stack
    
    return process(s) == process(t)
```

**Space**: O(n + m), **Time**: O(n + m)

---

### Form 3: Inline Skip Logic (No Helper)

```python
def backspace_compare_inline(s: str, t: str) -> bool:
    """
    Inline skip logic without helper function.
    More compact but less modular.
    """
    i, j = len(s) - 1, len(t) - 1
    skip_s = skip_t = 0
    
    while i >= 0 or j >= 0:
        # Advance i
        while i >= 0:
            if s[i] == '#':
                skip_s += 1
                i -= 1
            elif skip_s > 0:
                skip_s -= 1
                i -= 1
            else:
                break
        
        # Advance j
        while j >= 0:
            if t[j] == '#':
                skip_t += 1
                j -= 1
            elif skip_t > 0:
                skip_t -= 1
                j -= 1
            else:
                break
        
        # Compare
        if i >= 0 and j >= 0 and s[i] != t[j]:
            return False
        if (i >= 0) != (j >= 0):
            return False
        
        i -= 1
        j -= 1
    
    return True
```

**Space**: O(1), **Time**: O(n + m)

---

### Form 4: Generator/Yield Pattern

```python
def backspace_compare_generator(s: str, t: str) -> bool:
    """
    Generator-based approach for functional style.
    """
    def valid_chars(string: str):
        """Yield valid characters from right to left."""
        skip = 0
        for char in reversed(string):
            if char == '#':
                skip += 1
            elif skip > 0:
                skip -= 1
            else:
                yield char
    
    # Compare using zip (stops at shorter)
    for c1, c2 in zip(valid_chars(s), valid_chars(t)):
        if c1 != c2:
            return False
    
    # Check both exhausted
    s_exhausted = not any(valid_chars(s))
    t_exhausted = not any(valid_chars(t))
    
    # Alternative: materialize and compare lengths
    s_chars = list(valid_chars(s))
    t_chars = list(valid_chars(t))
    return s_chars == t_chars
```

**Space**: O(n + m) for materialized lists, **Time**: O(n + m)

---

### Form 5: Custom Backspace Character

```python
def backspace_compare_custom(s: str, t: str, backspace: str = '#') -> bool:
    """
    Configurable backspace character for variations.
    """
    def get_next(string: str, index: int) -> int:
        skip = 0
        while index >= 0:
            if string[index] == backspace:
                skip += 1
            elif skip > 0:
                skip -= 1
            else:
                return index
            index -= 1
        return -1
    
    i, j = len(s) - 1, len(t) - 1
    
    while i >= 0 or j >= 0:
        i = get_next(s, i)
        j = get_next(t, j)
        
        if i < 0 and j < 0:
            return True
        if i < 0 or j < 0:
            return False
        if s[i] != t[j]:
            return False
        
        i -= 1
        j -= 1
    
    return True

# Variations:
# - backspace_compare_custom(s, t, backspace='<')
# - backspace_compare_custom(s, t, backspace='\b')
```

**Space**: O(1), **Time**: O(n + m)

---

### Form Comparison Summary

| Form | Space | Time | Best For |
|------|-------|------|----------|
| Standard | O(1) | O(n + m) | **Interviews, production** |
| Stack | O(n + m) | O(n + m) | Readability, teaching |
| Inline | O(1) | O(n + m) | Single function constraint |
| Generator | O(n + m) | O(n + m) | Functional programming style |
| Custom char | O(1) | O(n + m) | Variation problems |

<!-- back -->
