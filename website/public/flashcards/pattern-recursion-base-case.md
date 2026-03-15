## Recursion: Base Case & Stack Overflow

**Question:** How do you avoid infinite recursion and stack overflow?

<!-- front -->

---

## Answer: Always Have a Base Case

### The Two Essential Rules
1. **Base Case** - When to stop recursing
2. **Recursive Case** - Make problem smaller

### Template
```python
def recursive_function(params):
    # 1. BASE CASE - stop condition
    if base_condition_is_met:
        return some_value
    
    # 2. RECURSIVE CASE - make smaller problem
    # Do something
    result = recursive_function(smaller_params)
    
    return result
```

### Visual: Recursion Stack
```
factorial(5)
│
├── 5 * factorial(4)
│       │
│       ├── 4 * factorial(3)
│       │       │
│       │       ├── 3 * factorial(2)
│       │       │       │
│       │       │       ├── 2 * factorial(1)
│       │       │       │       │
│       │       │       │       └── return 1 (BASE CASE!)
│       │       │       │       
│       │       │       └── return 2 * 1 = 2
│       │       │       
│       │       └── return 3 * 2 = 6
│       │       
│       └── return 4 * 6 = 24
│
└── return 5 * 24 = 120
```

### ⚠️ Tricky Parts

#### 1. Missing Base Case = Infinite Loop
```python
# WRONG - infinite recursion!
def count_down(n):
    return count_down(n - 1)  # Never stops!

# CORRECT
def count_down(n):
    if n <= 0:  # Base case!
        return
    print(n)
    count_down(n - 1)
```

#### 2. Wrong Base Case = Wrong Answer
```python
# Binary search - wrong base case
def binary_search(nums, target, left, right):
    mid = (left + right) // 2
    
    if nums[mid] == target:
        return mid
    
    # WRONG: missing return statements
    # This won't work!
    if nums[mid] < target:
        binary_search(nums, target, mid + 1, right)
    else:
        binary_search(nums, target, left, mid - 1)

# CORRECT - must return recursive calls!
def binary_search(nums, target, left, right):
    if left > right:
        return -1
    
    mid = (left + right) // 2
    
    if nums[mid] == target:
        return mid
    elif nums[mid] < target:
        return binary_search(nums, target, mid + 1, right)
    else:
        return binary_search(nums, target, left, mid - 1)
```

#### 3. Stack Overflow
```python
# This will cause stack overflow for large n!
def sum_to_n(n):
    return n + sum_to_n(n - 1)  # Too deep!

# Use iteration or tail recursion
def sum_to_n_iterative(n):
    total = 0
    for i in range(1, n + 1):
        total += i
    return total
```

### Recursion Depth Limits
| Language | Default Limit | How to Check |
|----------|---------------|--------------|
| Python | ~1000 | `sys.getrecursionlimit()` |
| Java | ~10^5 | JVM dependent |
| JavaScript | ~10^4 | Browser dependent |

### How to Increase (Python)
```python
import sys
sys.setrecursionlimit(10000)  # Increase limit
```

### Tail Recursion Optimization
```python
# Not optimized in Python (but is in some languages)
def factorial(n, acc=1):
    if n == 0:
        return acc
    return factorial(n-1, n*acc)  # Tail recursive
```

### When to Use Recursion
- Tree traversals
- Graph DFS
- Divide and conquer
- Backtracking
- Recurrence relations

### When NOT to Use Recursion
- Deep recursion (>1000 in Python)
- Performance-critical code
- When iteration is simpler

### ⚠️ Common Mistakes Checklist

| Mistake | Problem | Fix |
|---------|---------|-----|
| No base case | Infinite loop | Add base case |
| Base case unreachable | Stack overflow | Verify it can be reached |
| Not returning recursive call | Returns None | Add `return` |
| Changing too little | Slow/Wrong | Make problem smaller |
| Global state mutation | Bugs | Pass state explicitly |

### Memoization Example
```python
# Without memoization - exponential!
def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)  # Repeats calculations!

# With memoization - linear!
def fib_memo(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    
    memo[n] = fib_memo(n-1) + fib_memo(n-2)
    return memo[n]

# Or use @lru_cache decorator
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)
```

<!-- back -->
