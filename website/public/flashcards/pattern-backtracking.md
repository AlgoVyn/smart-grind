## Backtracking Pattern

**Question:** How to approach backtracking problems?

<!-- front -->

---

## Answer: DFS with State Restoration

### Template
```python
def backtrack(path, choices):
    if is_valid(path):
        result.append(path.copy())
        return
    
    for choice in choices:
        # Choose
        path.append(choice)
        
        # Explore
        backtrack(path, new_choices)
        
        # Un-choose (restore state)
        path.pop()
```

### Classic Problems

#### 1. Subsets
```python
def subsets(nums):
    result = []
    
    def backtrack(i, path):
        result.append(path.copy())
        
        for j in range(i, len(nums)):
            path.append(nums[j])
            backtrack(j + 1, path)
            path.pop()
    
    backtrack(0, [])
    return result
```

#### 2. Permutations
```python
def permute(nums):
    result = []
    used = [False] * len(nums)
    
    def backtrack(path):
        if len(path) == len(nums):
            result.append(path.copy())
            return
        
        for i, num in enumerate(nums):
            if not used[i]:
                used[i] = True
                path.append(num)
                backtrack(path)
                path.pop()
                used[i] = False
    
    backtrack([])
    return result
```

### ⚠️ Tricky Parts

#### 1. When to Add to Result
```python
# Subsets: add at EVERY node (including empty)
# Permutations: add only when path is complete

# Different for different problems
```

#### 2. Pruning
```python
# Skip invalid choices early
# Improves efficiency significantly

# Example: for combination sum
if sum(path) > target:
    continue  # or break if sorted
```

### Time Complexity

| Problem | Complexity |
|---------|------------|
| Subsets | O(n × 2ⁿ) |
| Permutations | O(n × n!) |

<!-- back -->
