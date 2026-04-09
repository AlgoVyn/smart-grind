## Backtracking - Permutations: Forms

What are the different variations of permutation generation?

<!-- front -->

---

### Form 1: All Permutations (Swap-based)

```python
def permute_swap(nums):
    """Generate all permutations by swapping."""
    result = []
    
    def backtrack(start):
        if start == len(nums):
            result.append(nums[:])
            return
        
        for i in range(start, len(nums)):
            nums[start], nums[i] = nums[i], nums[start]
            backtrack(start + 1)
            nums[start], nums[i] = nums[i], nums[start]
    
    backtrack(0)
    return result
```

---

### Form 2: Unique Permutations (Used-array)

```python
def permute_unique(nums):
    """Handle duplicates in input."""
    nums.sort()
    result = []
    used = [False] * len(nums)
    
    def backtrack(current):
        if len(current) == len(nums):
            result.append(current[:])
            return
        
        for i in range(len(nums)):
            if used[i]:
                continue
            if i > 0 and nums[i] == nums[i-1] and not used[i-1]:
                continue
            
            used[i] = True
            current.append(nums[i])
            backtrack(current)
            current.pop()
            used[i] = False
    
    backtrack([])
    return result
```

---

### Form 3: Next Permutation

```python
def next_permutation(nums):
    """In-place next lexicographic permutation."""
    n = len(nums)
    i = n - 2
    while i >= 0 and nums[i] >= nums[i+1]:
        i -= 1
    
    if i >= 0:
        j = n - 1
        while nums[j] <= nums[i]:
            j -= 1
        nums[i], nums[j] = nums[j], nums[i]
    
    nums[i+1:] = reversed(nums[i+1:])
```

---

### Form 4: K-th Permutation

```python
def get_kth_permutation(n, k):
    """Get k-th permutation of [1..n]."""
    from math import factorial
    
    nums = list(range(1, n+1))
    k -= 1
    result = []
    
    for i in range(n, 0, -1):
        fact = factorial(i-1)
        idx = k // fact
        k %= fact
        result.append(nums.pop(idx))
    
    return result
```

---

### Form Comparison

| Form | Input | Approach | Use When |
|------|-------|----------|----------|
| Swap | Distinct | In-place swap | Clean code |
| Used-array | With dups | Track used | Handle duplicates |
| Next | Current | In-place transform | Iterate sequentially |
| K-th | n, k | Factorial math | Random access |

<!-- back -->
