## Backtracking - Combination Sum: Tactics

What are the advanced techniques for combination sum?

<!-- front -->

---

### Tactic 1: Count Combinations (DP)

When you only need the count, use DP:

```python
def combination_sum_count(candidates, target):
    """Count number of combinations (not enumerate)."""
    dp = [0] * (target + 1)
    dp[0] = 1
    
    for i in range(1, target + 1):
        for c in candidates:
            if c <= i:
                dp[i] += dp[i - c]
    
    return dp[target]
```

---

### Tactic 2: Find One Valid Combination

```python
def combination_sum_one(candidates, target):
    """Return first valid combination found."""
    candidates.sort()
    
    def backtrack(start, remaining, current):
        if remaining == 0:
            return current[:]
        
        for i in range(start, len(candidates)):
            if candidates[i] > remaining:
                break
            
            current.append(candidates[i])
            result = backtrack(i, remaining - candidates[i], current)
            if result:
                return result
            current.pop()
        
        return None
    
    return backtrack(0, target, [])
```

---

### Tactic 3: Minimum Elements Combination

```python
def combination_sum_min_elements(candidates, target):
    """Find combination with minimum number of elements."""
    candidates.sort(reverse=True)  # Try larger first
    result = None
    min_len = float('inf')
    
    def backtrack(start, remaining, current):
        nonlocal result, min_len
        
        # Pruning: can't beat current best
        if len(current) >= min_len:
            return
        
        if remaining == 0:
            if len(current) < min_len:
                min_len = len(current)
                result = current[:]
            return
        
        for i in range(start, len(candidates)):
            if candidates[i] > remaining:
                continue
            
            current.append(candidates[i])
            backtrack(i, remaining - candidates[i], current)
            current.pop()
    
    backtrack(0, target, [])
    return result
```

---

### Tactic 4: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|----- |
| Not sorting | Can't prune | Sort candidates first |
| Wrong index | Wrong reuse | `i` for reuse, `i+1` for no reuse |
| No break | Slow | `break` when candidate > remaining |
| Not backtracking | Wrong state | Always `current.pop()` |
| Duplicate combinations | Repeated elements | Skip `if i > start` |

---

### Tactic 5: Iterative DFS with Stack

```python
def combination_sum_iterative(candidates, target):
    """Iterative version using stack."""
    candidates.sort()
    result = []
    # Stack: (start_index, remaining, current_combination)
    stack = [(0, target, [])]
    
    while stack:
        start, remaining, current = stack.pop()
        
        if remaining == 0:
            result.append(current)
            continue
        
        for i in range(start, len(candidates)):
            if candidates[i] > remaining:
                break
            stack.append((i, remaining - candidates[i], 
                         current + [candidates[i]]))
    
    return result
```

---

### Tactic 6: Combination Sum III (k numbers sum to n)

```python
def combination_sum3(k, n):
    """Find k numbers 1-9 that sum to n."""
    result = []
    
    def backtrack(start, remaining, count, current):
        # Pruning: not enough numbers left
        if count > k or remaining < 0:
            return
        
        if count == k and remaining == 0:
            result.append(current[:])
            return
        
        for i in range(start, 10):
            current.append(i)
            backtrack(i + 1, remaining - i, count + 1, current)
            current.pop()
    
    backtrack(1, n, 0, [])
    return result
```

<!-- back -->
