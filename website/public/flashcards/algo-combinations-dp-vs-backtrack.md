## Combinations - Why Not Use DP?

**Question:** Can you solve combinations using DP?

<!-- front -->

---

## Combinations: Backtracking vs DP

### Backtracking Approach
```python
def combine(n, k):
    result = []
    
    def backtrack(start, path):
        if len(path) == k:
            result.append(path[:])
            return
        
        # Pruning: if not enough elements left
        remaining = n - start
        need = k - len(path)
        if remaining < need:
            return
        
        for i in range(start, n):
            path.append(i + 1)
            backtrack(i + 1, path)
            path.pop()
    
    backtrack(0, [])
    return result
```

### Why Backtracking Works
- Generate combinations **incrementally**
- Backtrack when combination is complete
- Prune when impossible

### Can We Use DP?
```
C(n,k) = C(n-1,k) + C(n-1,k-1)
```

Yes! But:
| Approach | Time | Space |
|----------|------|-------|
| Backtracking | O(C(n,k) × k) | O(k) |
| DP (Pascal) | O(n×k) | O(n×k) |

### When to Use Each
- **DP:** When you need many binomial coefficients
- **Backtracking:** When you need actual combinations

### Complexity
- Generate C(n,k) combinations
- Each of length k
- Time: O(C(n,k) × k)

<!-- back -->
