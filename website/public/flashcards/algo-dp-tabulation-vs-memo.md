## Dynamic Programming: Top-Down vs Bottom-Up

**Question:** When should you use memoization vs tabulation?

<!-- front -->

---

## Answer: Know the Trade-offs

### Top-Down (Memoization)
```python
# Recursive with caching
def fib(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    
    memo[n] = fib(n-1, memo) + fib(n-2, memo)
    return memo[n]
```

### Bottom-Up (Tabulation)
```python
# Iterative with table
def fib(n):
    if n <= 1:
        return n
    
    dp = [0] * (n + 1)
    dp[1] = 1
    
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    
    return dp[n]
```

### Space-Optimized Bottom-Up
```python
def fib(n):
    if n <= 1:
        return n
    
    prev2, prev1 = 0, 1
    
    for i in range(2, n + 1):
        curr = prev1 + prev2
        prev2 = prev1
        prev1 = curr
    
    return prev1
```

### Comparison Table

| Aspect | Memoization | Tabulation |
|--------|-------------|------------|
| Approach | Top-down | Bottom-up |
| Code | Simpler | More code |
| Recursion | Yes | No |
| Stack overflow | Possible | No |
| Order | Natural | Must determine |
| Speed | Lazy evaluation | Eager evaluation |
| Space | O(n) + recursion | O(n) |

### When to Use Each

#### Use Memoization When:
- Problem has natural recursion
- Not all states needed
- Easy to implement recursively
- Don't know all dependencies

#### Use Tabulation When:
- Need to optimize space
- All states will be needed
- Want to avoid recursion
- Need more control

### Visual: How They Work

```
Memoization (Top-Down):          Tabulation (Bottom-Up):
                                 
fib(5)                           dp[0] = 0
  ├── fib(4)                     dp[1] = 1
  │     └── fib(3)              dp[2] = dp[1] + dp[0]
  │         └── fib(2)           dp[3] = dp[2] + dp[1]
  │             └── fib(1)       dp[4] = dp[3] + dp[2]
  │                 return 1     dp[5] = dp[4] + dp[3]
  │             return 1         
  │         return 2            
  │     return 3                
  └── fib(3) ← cached!          Build up from base case
      return 2                  

CACHE: {1:1, 2:1, 3:2, 4:3}     TABLE: [0,1,1,2,3,5]
```

### ⚠️ Tricky Parts

#### 1. Base Case Errors
```python
# WRONG - off-by-one
dp = [0] * n  # Wrong size!
dp[0] = 1    # Should be dp[0] = 1 for fib

# CORRECT
dp = [0] * (n + 1)  # Include 0!
dp[0], dp[1] = 0, 1
```

#### 2. Tabulation Order
```python
# Must fill in correct order!
# For fib: dp[i] depends on dp[i-1] and dp[i-2]
# So iterate forward: for i in range(2, n+1)

# For coin change: dp[i] depends on smaller values
# So iterate forward too!

# For some DP: may need backward or specific order
```

#### 3. Memoization Stack Overflow
```python
# This can overflow for large n!
def solve_large(n):
    if n <= 1:
        return n
    return solve_large(n-1) + solve_large(n-2)

# Use iterative or increase recursion limit
import sys
sys.setrecursionlimit(10000)
```

#### 4. Mutable Default Arguments
```python
# DANGER - common bug!
def fib(n, memo={}):  # Shared across calls!
    ...

# CORRECT
def fib(n, memo=None):
    if memo is None:
        memo = {}
    ...
```

### DP Patterns

#### 1. 1D DP
```python
dp[i] = depends on dp[i-1], dp[i-2]
# Fibonacci, House Robber, Climbing Stairs
```

#### 2. 2D DP
```python
dp[i][j] = depends on dp[i-1][j], dp[i][j-1]
# Unique Paths, Edit Distance
```

#### 3. Divide and Conquer DP
```python
# Like merge sort for DP
dp[i][j] = min of dp[i][k] + dp[k][j]
# Optimal Matrix Chain Multiplication
```

### How to Identify DP
1. Can be broken into subproblems
2. Optimal substructure
3. Overlapping subproblems

### ⚠️ Common Mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| Not initializing base case | Wrong answer | Double-check dp[0] |
| Wrong iteration order | Wrong answer | Understand dependencies |
| Using mutable default arg | Cache persists | Use None default |
| Stack overflow | Recursion too deep | Use iterative |
| Not optimizing space | Memory waste | Use O(1) when possible |

<!-- back -->
