## Backtracking - Parentheses Generation: Forms

What are the different variations of parentheses generation?

<!-- front -->

---

### Form 1: Standard Backtracking

```python
def generate_parenthesis(n):
    """Standard backtracking solution."""
    result = []
    
    def backtrack(o, c, curr):
        if len(curr) == 2*n:
            result.append(''.join(curr))
            return
        if o < n:
            curr.append('(')
            backtrack(o+1, c, curr)
            curr.pop()
        if c < o:
            curr.append(')')
            backtrack(o, c+1, curr)
            curr.pop()
    
    backtrack(0, 0, [])
    return result
```

---

### Form 2: String Concatenation

```python
def generate_parenthesis_str(n):
    """Using string concatenation (simpler but slower)."""
    result = []
    
    def backtrack(o, c, curr):
        if len(curr) == 2*n:
            result.append(curr)
            return
        if o < n:
            backtrack(o+1, c, curr + '(')
        if c < o:
            backtrack(o, c+1, curr + ')')
    
    backtrack(0, 0, "")
    return result
```

---

### Form 3: DP Approach

```python
def generate_parenthesis_dp(n):
    """Dynamic programming approach."""
    dp = [[] for _ in range(n+1)]
    dp[0] = [""]
    
    for i in range(1, n+1):
        for j in range(i):
            for left in dp[j]:
                for right in dp[i-1-j]:
                    dp[i].append(f"({left}){right}")
    
    return dp[n]
```

---

### Form Comparison

| Form | Build Method | Speed | Memory |
|------|--------------|-------|--------|
| Standard | List + join | Fast | Efficient |
| String concat | String | Slower | More GC |
| DP | Precompute | Similar | More storage |

<!-- back -->
