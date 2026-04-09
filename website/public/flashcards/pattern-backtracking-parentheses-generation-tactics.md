## Backtracking - Parentheses Generation: Tactics

What are the advanced techniques for parentheses generation?

<!-- front -->

---

### Tactic 1: Count Valid Combinations (Catalan)

```python
def count_catalan(n):
    """Count valid parentheses combinations without generating."""
    # Catalan number formula: C(n) = (2n choose n) / (n+1)
    from math import comb
    return comb(2*n, n) // (n + 1)
```

---

### Tactic 2: Dynamic Programming Approach

```python
def generate_parenthesis_dp(n):
    """Generate using DP."""
    if n == 0:
        return [""]
    
    result = []
    for i in range(n):
        for left in generate_parenthesis_dp(i):
            for right in generate_parenthesis_dp(n - 1 - i):
                result.append(f"({left}){right}")
    
    return result
```

---

### Tactic 3: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|----- |
| Wrong base case | Incomplete strings | Check `len == 2*n` |
| Wrong condition | Invalid strings | `close < open`, not `<=` |
| Forgetting backtrack | Wrong state | Always `current.pop()` |
| String concatenation | Slow | Use list, join at end |

---

### Tactic 4: Generate with Restrictions

```python
def generate_with_prefix(n, prefix):
    """Generate valid parentheses with required prefix."""
    result = []
    open_p = prefix.count('(')
    close_p = prefix.count(')')
    
    def backtrack(open_c, close_c, current):
        if len(current) == 2 * n:
            result.append(''.join(current))
            return
        
        if open_c < n:
            current.append('(')
            backtrack(open_c + 1, close_c, current)
            current.pop()
        
        if close_c < open_c:
            current.append(')')
            backtrack(open_c, close_c + 1, current)
            current.pop()
    
    backtrack(open_p, close_p, list(prefix))
    return result
```

<!-- back -->
