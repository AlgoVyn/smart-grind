## Subset Generation

**Question:** Generate all subsets of a set?

<!-- front -->

---

## Answer: Backtracking & Bitmask

### Solution: Backtracking
```python
def subsets(nums):
    result = []
    
    def backtrack(start, path):
        result.append(path[:])
        
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    
    backtrack(0, [])
    return result
```

### Solution: Bitmask
```python
def subsetsBitmask(nums):
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

### Visual: Backtracking Tree
```
nums = [1, 2, 3]

[]
├── [1]
│   ├── [1,2]
│   │   └── [1,2,3]
│   └── [1,3]
├── [2]
│   ├── [2,3]
└── [3]

Total: 2^3 = 8 subsets
```

### ⚠️ Tricky Parts

#### 1. Why Start from Index?
```python
# i + 1 ensures we don't reuse elements
# This prevents duplicates like [1,2] and [2,1]

# Start from 0 for empty subset
# Add path before exploring children
```

#### 2. Bitmask Logic
```python
# For n elements: 2^n possible subsets
# Each subset = unique bitmask from 0 to 2^n - 1
# bit i set → include nums[i]

# Example n=3:
# 0 (000) → []
# 1 (001) → [nums[0]]
# 2 (010) → [nums[1]]
# 3 (011) → [nums[0], nums[1]]
# 4 (100) → [nums[2]]
# ...
```

#### 3. With Duplicates
```python
def subsetsWithDupes(nums):
    nums.sort()  # Sort first!
    result = []
    
    def backtrack(start, path):
        result.append(path[:])
        
        for i in range(start, len(nums)):
            # Skip duplicates at same level
            if i > start and nums[i] == nums[i-1]:
                continue
            
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    
    backtrack(0, [])
    return result
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Backtracking | O(n × 2^n) | O(n) |
| Bitmask | O(n × 2^n) | O(n) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Wrong loop range | Use start to len(nums) |
| Forgetting to copy | path[:] not path |
| Duplicates | Sort and skip |

<!-- back -->
