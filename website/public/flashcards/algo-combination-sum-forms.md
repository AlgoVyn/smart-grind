## Combination Sum: Problem Forms

What are the variations and extensions of combination sum problems?

<!-- front -->

---

### Minimum Number of Elements

```python
def combination_sum_min_elements(candidates, target):
    """
    Find combination with minimum number of elements
    Unlimited use of candidates
    """
    INF = float('inf')
    dp = [INF] * (target + 1)
    parent = [-1] * (target + 1)
    dp[0] = 0
    
    for i in range(1, target + 1):
        for num in candidates:
            if num <= i and dp[i - num] + 1 < dp[i]:
                dp[i] = dp[i - num] + 1
                parent[i] = num
    
    if dp[target] == INF:
        return None
    
    # Reconstruct
    result = []
    cur = target
    while cur > 0:
        result.append(parent[cur])
        cur -= parent[cur]
    
    return result
```

---

### All Sums Up to Target

```python
def all_combination_sums(candidates):
    """
    Find all achievable sums using candidates
    """
    max_sum = sum(candidates)
    achievable = [False] * (max_sum + 1)
    achievable[0] = True
    
    for num in candidates:
        for i in range(max_sum, num - 1, -1):
            achievable[i] |= achievable[i - num]
    
    return [i for i, val in enumerate(achievable) if val]
```

---

### Constrained Length Combinations

```python
def combination_sum_k_elements(nums, target, k):
    """
    Find combinations using exactly k elements
    """
    result = []
    nums.sort()
    
    def backtrack(start, target, count, path):
        if count == k:
            if target == 0:
                result.append(path[:])
            return
        if target < 0 or count > k:
            return
        
        for i in range(start, len(nums)):
            if nums[i] > target:
                break
            path.append(nums[i])
            backtrack(i, target - nums[i], count + 1, path)  # i for unlimited
            path.pop()
    
    backtrack(0, target, 0, [])
    return result
```

---

### Multi-Constraint Combination

```python
def combination_sum_multi(candidates, target, max_count, min_val, max_val):
    """
    Multiple constraints: max elements, value range
    """
    result = []
    candidates = [c for c in candidates if min_val <= c <= max_val]
    candidates.sort()
    
    def backtrack(start, remaining, count, path):
        if remaining == 0:
            result.append(path[:])
            return
        if remaining < 0 or count >= max_count:
            return
        
        for i in range(start, len(candidates)):
            if candidates[i] > remaining:
                break
            path.append(candidates[i])
            backtrack(i, remaining - candidates[i], count + 1, path)
            path.pop()
    
    backtrack(0, target, 0, [])
    return result
```

---

### Lexicographically Smallest/Largest

```python
def combination_sum_lexicographic(candidates, target, smallest=True):
    """
    Find lexicographically smallest/largest valid combination
    """
    candidates.sort(reverse=not smallest)
    
    def find_combination():
        result = []
        remaining = target
        
        for num in candidates:
            while remaining >= num:
                result.append(num)
                remaining -= num
        
        return result if remaining == 0 else None
    
    return find_combination()

# Note: This greedy doesn't always work!
# Use DP for guaranteed optimal solution
```

<!-- back -->
