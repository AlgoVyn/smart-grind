## Backtracking - Subsets: Forms

What are the different variations of subset generation?

<!-- front -->

---

### Form 1: All Subsets (Power Set)

```python
def subsets(nums):
    """Generate all 2^n subsets."""
    result = []
    
    def backtrack(start, current):
        result.append(current[:])
        
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()
    
    backtrack(0, [])
    return result
```

---

### Form 2: Subsets with Duplicates

```python
def subsets_with_dup(nums):
    """Handle duplicate elements."""
    nums.sort()
    result = []
    
    def backtrack(start, current):
        result.append(current[:])
        
        for i in range(start, len(nums)):
            if i > start and nums[i] == nums[i - 1]:
                continue
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()
    
    backtrack(0, [])
    return result
```

---

### Form 3: Subsets of Size K

```python
def subsets_of_size_k(nums, k):
    """Generate subsets of exactly size k."""
    result = []
    
    def backtrack(start, current):
        if len(current) == k:
            result.append(current[:])
            return
        
        if len(current) + (len(nums) - start) < k:
            return  # Pruning
        
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()
    
    backtrack(0, [])
    return result
```

---

### Form 4: Subset Sum

```python
def subset_sum(nums, target):
    """Find subsets that sum to target."""
    nums.sort()
    result = []
    
    def backtrack(start, current, current_sum):
        if current_sum == target:
            result.append(current[:])
            return
        if current_sum > target:
            return
        
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current, current_sum + nums[i])
            current.pop()
    
    backtrack(0, [], 0)
    return result
```

---

### Form 5: Bitmask Approach

```python
def subsets_bitmask(nums):
    """Generate subsets using bit manipulation."""
    n = len(nums)
    result = []
    
    for mask in range(1 << n):
        subset = []
        for i in range(n):
            if mask & (1 << i):
                subset.append(nums[i])
        result.append(subset)
    
    return result
```

---

### Form Comparison

| Form | Input | Output | Special Handling |
|------|-------|--------|------------------|
| Standard | Any | All 2^n subsets | None |
| With dups | With duplicates | Unique subsets | Skip duplicates |
| Size k | Any | Subsets of size k | Pruning |
| Subset sum | Any + target | Subsets matching sum | Early termination |
| Bitmask | Any | All subsets | Bit manipulation |

<!-- back -->
