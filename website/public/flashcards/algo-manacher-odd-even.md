## Manacher's Algorithm (Palindromes)

**Question:** How does Manacher's algorithm find the longest palindromic substring in O(n) time?

<!-- front -->

---

## Answer: Expand Around Center with Tricks

### The Problem
Finding longest palindrome in O(n²) with naive approach.

### Manacher's Trick
Transforms the string to handle even/odd lengths uniformly:

```
# Original: "babad"
# Transformed: "#b#a#b#a#d#"
```

### Algorithm
```python
def manacher(s):
    s = '#' + '#'.join(s) + '#'
    n = len(s)
    p = [0] * n  # radius array
    c = r = 0    # center and right boundary
    
    for i in range(n):
        if i < r:
            p[i] = min(r - i, p[2*c - i])
        
        # Expand around i
        while i + p[i] + 1 < n and s[i + p[i] + 1] == s[i - p[i] - 1]:
            p[i] += 1
        
        # Update center if expanded past r
        if i + p[i] > r:
            c, r = i, i + p[i]
    
    return max(p)
```

### Complexity
- **Time:** O(n)
- **Space:** O(n)

### Key Insight
Uses previously computed palindrome info to skip comparisons.

<!-- back -->
