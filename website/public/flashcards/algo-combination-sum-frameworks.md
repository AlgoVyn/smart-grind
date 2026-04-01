## Combination Sum: Algorithm Framework

What are the complete implementations for combination sum variants?

<!-- front -->

---

### Combination Sum I (Unlimited, Distinct)

```python
def combination_sum(candidates, target):
    """
    Find all unique combinations where candidates can be used unlimited times
    """
    result = []
    candidates.sort()  # Sort for consistent results
    
    def backtrack(start, current_sum, path):
        if current_sum == target:
            result.append(path[:])
            return
        if current_sum > target:
            return
        
        for i in range(start, len(candidates)):
            num = candidates[i]
            # Early termination since sorted
            if current_sum + num > target:
                break
            
            path.append(num)
            backtrack(i, current_sum + num, path)  # i, not i+1 (reuse allowed)
            path.pop()
    
    backtrack(0, 0, [])
    return result

# Example: candidates=[2,3,6,7], target=7
# Output: [[2,2,3], [7]]
```

---

### Combination Sum II (Each Once, Input May Have Dups)

```python
def combination_sum2(candidates, target):
    """
    Each number used at most once, input may have duplicates
    """
    result = []
    candidates.sort()
    
    def backtrack(start, current_sum, path):
        if current_sum == target:
            result.append(path[:])
            return
        if current_sum > target:
            return
        
        for i in range(start, len(candidates)):
            # Skip duplicates at same level
            if i > start and candidates[i] == candidates[i-1]:
                continue
            
            num = candidates[i]
            if current_sum + num > target:
                break
            
            path.append(num)
            backtrack(i + 1, current_sum + num, path)  # i+1: can't reuse
            path.pop()
    
    backtrack(0, 0, [])
    return result
```

---

### Combination Sum III (k Numbers 1-9)

```python
def combination_sum3(k, n):
    """
    Find all valid combinations of k numbers that sum to n
    Numbers 1-9, each used at most once
    """
    result = []
    
    def backtrack(start, current_sum, count, path):
        if count == k:
            if current_sum == n:
                result.append(path[:])
            return
        if current_sum >= n or count > k:
            return
        
        for i in range(start, 10):
            if current_sum + i > n:
                break
            path.append(i)
            backtrack(i + 1, current_sum + i, count + 1, path)
            path.pop()
    
    backtrack(1, 0, 0, [])
    return result
```

---

### Combination Sum IV (Count, Order Matters)

```python
def combination_sum4(nums, target):
    """
    Count combinations (order matters = permutations)
    Unlimited use of each number
    """
    nums.sort()
    dp = [0] * (target + 1)
    dp[0] = 1  # One way to make 0 (empty)
    
    for i in range(1, target + 1):
        for num in nums:
            if num > i:
                break
            dp[i] += dp[i - num]
    
    return dp[target]

# Optimization: sort and early break makes it O(target × n) not O(target × n log n)
```

---

### DP Solution for Combination Sum I (Count Only)

```python
def combination_sum_count(candidates, target):
    """
    Count combinations (order doesn't matter)
    """
    dp = [0] * (target + 1)
    dp[0] = 1
    
    # Coin outer loop for combinations
    for num in candidates:
        for i in range(num, target + 1):
            dp[i] += dp[i - num]
    
    return dp[target]
```

<!-- back -->
