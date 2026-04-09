## Two Pointers - String Comparison with Backspaces: Tactics

What are specific techniques for solving string comparison with backspace problems?

<!-- front -->

---

### Tactic 1: Skip Counter with State Machine

Use a state machine approach for cleaner skip logic:

```python
def backspace_compare_state_machine(s: str, t: str) -> bool:
    """State machine approach for skip logic."""
    def next_char(string: str, index: int):
        """Generator-like approach yielding valid chars from right."""
        skip = 0
        while index >= 0:
            char = string[index]
            if char == '#':
                skip += 1
                index -= 1
            elif skip > 0:
                skip -= 1
                index -= 1
            else:
                yield char
                index -= 1
        yield None  # Exhausted
    
    gen_s = next_char(s, len(s) - 1)
    gen_t = next_char(t, len(t) - 1)
    
    for c1, c2 in zip(gen_s, gen_t):
        if c1 != c2:
            return False
        if c1 is None:  # Both exhausted
            break
    
    return True
```

---

### Tactic 2: Early Termination Optimization

Check for obvious mismatches before full processing:

```python
def backspace_compare_optimized(s: str, t: str) -> bool:
    """Optimized with early termination checks."""
    # Quick check: count of non-backspace chars
    s_valid = s.count('#')
    t_valid = t.count('#')
    
    # If total length after backspaces differs by more than 
    # the backspace count difference, they can't be equal
    # (Optional heuristic, not always applied)
    
    def get_next(string: str, index: int) -> int:
        skip = 0
        while index >= 0:
            if string[index] == '#':
                skip += 1
            elif skip > 0:
                skip -= 1
            else:
                break
            index -= 1
        return index
    
    i, j = len(s) - 1, len(t) - 1
    
    while i >= 0 or j >= 0:
        i = get_next(s, i)
        j = get_next(t, j)
        
        # Early termination checks
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

### Tactic 3: Handling Different Backspace Characters

Adapt for problems with custom backspace symbols:

```python
def backspace_compare_custom(s: str, t: str, backspace_char: str = '#') -> bool:
    """Configurable backspace character."""
    def get_next_valid(string: str, index: int) -> int:
        skip = 0
        while index >= 0:
            if string[index] == backspace_char:
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

# Usage: backspace_compare_custom(s, t, backspace_char='<')
```

---

### Tactic 4: Single String Processing (For Building Result)

When you need the actual processed string:

```python
def process_with_backspace(s: str) -> str:
    """Build the processed string (O(n) space)."""
    result = []
    for char in s:
        if char == '#':
            if result:
                result.pop()
        else:
            result.append(char)
    return ''.join(result)

# Use case: When you need the actual string, not just comparison
# Time: O(n), Space: O(n) for result
```

---

### Tactic 5: Stack Simulation Alternative

When O(n) space is acceptable and clarity is preferred:

```python
def backspace_compare_stack(s: str, t: str) -> bool:
    """Stack-based approach for comparison."""
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

# Comparison of approaches
# | Approach | Time | Space | Best For |
# |----------|------|-------|----------|
# | Two Pointers | O(n) | O(1) | Interviews, space constraints |
# | Stack | O(n) | O(n) | Readability, multiple comparisons |
```

---

### Tactic 6: Multiple Sequential Backspaces

Handle edge cases with many consecutive backspaces:

```python
def backspace_compare_edge_cases(s: str, t: str) -> bool:
    """Explicitly handle edge cases."""
    # Edge case: both empty
    if not s and not t:
        return True
    
    def get_next(string: str, index: int) -> int:
        skip = 0
        while index >= 0:
            char = string[index]
            if char == '#':
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
        
        # One exhausted but not other
        if i < 0 and j < 0:
            return True
        if i < 0 or j < 0:
            return False
        
        # Character mismatch
        if s[i] != t[j]:
            return False
        
        i -= 1
        j -= 1
    
    return True

# Test cases to verify
# ("ab#c", "ad#c") → True
# ("ab##", "c#d#") → True (both become "")
# ("a##c", "#a#c") → True (both become "c")
# ("a#c", "b") → False
```

<!-- back -->
