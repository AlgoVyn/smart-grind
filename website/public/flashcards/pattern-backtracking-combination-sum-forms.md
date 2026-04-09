## Backtracking - Combination Sum: Forms

What are the different variations of combination sum?

<!-- front -->

---

### Form 1: Unbounded (Reuse Allowed)

```python
def combination_sum_unbounded(candidates, target):
    """Each candidate can be used unlimited times."""
    candidates.sort()
    result = []
    
    def backtrack(start, current, remaining):
        if remaining == 0:
            result.append(current[:])
            return
        
        for i in range(start, len(candidates)):
            if candidates[i] > remaining:
                break
            current.append(candidates[i])
            backtrack(i, current, remaining - candidates[i])  # i = reuse
            current.pop()
    
    backtrack(0, [], target)
    return result
```

---

### Form 2: Bounded (No Reuse)

```python
def combination_sum_bounded(candidates, target):
    """Each candidate used at most once."""
    candidates.sort()
    result = []
    
    def backtrack(start, current, remaining):
        if remaining == 0:
            result.append(current[:])
            return
        
        for i in range(start, len(candidates)):
            if i > start and candidates[i] == candidates[i-1]:
                continue
            if candidates[i] > remaining:
                break
            current.append(candidates[i])
            backtrack(i + 1, current, remaining - candidates[i])  # i+1 = no reuse
            current.pop()
    
    backtrack(0, [], target)
    return result
```

---

### Form 3: Count Only (DP)

```python
def combination_sum_count(candidates, target):
    """Count combinations (not enumerate)."""
    dp = [0] * (target + 1)
    dp[0] = 1
    
    for c in candidates:
        for i in range(c, target + 1):
            dp[i] += dp[i - c]
    
    return dp[target]
```

---

### Form 4: Exactly K Numbers

```python
def combination_sum_k(candidates, target, k):
    """Exactly k numbers that sum to target."""
    candidates.sort()
    result = []
    
    def backtrack(start, current, remaining, count):
        if remaining == 0 and count == k:
            result.append(current[:])
            return
        if count >= k or remaining < 0:
            return
        
        for i in range(start, len(candidates)):
            if candidates[i] > remaining:
                break
            current.append(candidates[i])
            backtrack(i + 1, current, remaining - candidates[i], count + 1)
            current.pop()
    
    backtrack(0, [], target, 0)
    return result
```

---

### Form Comparison

| Form | Reuse | Duplicates | Approach |
|------|-------|------------|----------|
| Unbounded | Yes | Doesn't matter | Backtracking with i |
| Bounded | No | Skip duplicates | Backtracking with i+1 |
| Count | N/A | Doesn't matter | DP |
| Exactly k | Optional | Handle if needed | Backtracking + counter |

<!-- back -->
