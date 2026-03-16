## Catalan Numbers

**Question:** Count ways to construct valid structures?

<!-- front -->

---

## Answer: DP with Catalan Recurrence

### Solution
```python
def catalan(n):
    if n <= 1:
        return 1
    
    # DP: C(n) = sum(C(i) * C(n-1-i))
    catalan = [0] * (n + 1)
    catalan[0] = catalan[1] = 1
    
    for i in range(2, n + 1):
        for j in range(i):
            catalan[i] += catalan[j] * catalan[i - 1 - j]
    
    return catalan[n]
```

### Solution: Binomial Coefficient
```python
def catalan_binom(n):
    # Cn = (2n)! / ((n+1)! * n!)
    def factorial(k):
        res = 1
        for i in range(2, k + 1):
            res *= i
        return res
    
    return factorial(2*n) // (factorial(n+1) * factorial(n))
```

### Visual: Catalan Applications
```
n=0: 1 (empty)

n=1: 1 (1 node)
     o

n=2: 2 BSTs
    o    o
   /      \
  o        o

n=3: 5 BSTs / 5 ways to parenthesize
  ((a))  (a)(b)  (ab)  (ba)  (c)((a))
  etc.

n=4: 14 ways
```

### ⚠️ Tricky Parts

#### 1. Applications of Catalan Numbers
```python
# 1. BSTs with n nodes
# 2. Parenthesizations of n+1 factors
# 3. Non-crossing partitions
# 4. Dyck paths (n up, n down)
# 5. Valid parentheses sequences
# 6. Triangulations of polygon
```

#### 2. Recurrence Formula
```python
# C(n) = sum of C(i) * C(n-1-i) for i in 0 to n-1
# C(0) = C(1) = 1

# This comes from choosing root, then left/right subtrees
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| DP | O(n²) | O(n) |
| Binomial | O(n) | O(1) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Wrong n | C(0)=1, C(1)=1, C(2)=2 |
| Overflow | Use mod for large n |
| Wrong formula | Check binomial formula |

<!-- back -->
