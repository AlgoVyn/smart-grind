## Permutations: Backtracking

**Question:** How do you generate all permutations of an array?

<!-- front -->

---

## Answer: Swap Elements In Place

### Solution
```python
def permute(nums):
    result = []
    
    def backtrack(start):
        if start == len(nums):
            result.append(nums[:])
            return
        
        for i in range(start, len(nums)):
            nums[start], nums[i] = nums[i], nums[start]
            backtrack(start + 1)
            nums[start], nums[i] = nums[i], nums[start]  # backtrack
    
    backtrack(0)
    return result
```

### Visual: Swapping
```
nums = [1,2,3]

Step 1: start=0
        swap(0,0) → [1,2,3]
        recurse start=1
        
Step 2: start=1
        swap(1,1) → [1,2,3]
        recurse start=2
        
Step 3: start=2
        add [1,2,3]
        backtrack...
        
        swap(1,2) → [1,3,2]
        recurse start=2
        add [1,3,2]
```

### ⚠️ Tricky Parts

#### 1. Backtracking Swap
```python
# Must swap back after recursion!
nums[start], nums[i] = nums[i], nums[start]  # forward
backtrack(start + 1)
nums[start], nums[i] = nums[i], nums[start]  # backtrack
```

#### 2. Copying List
```python
# WRONG - reference to same list!
result.append(nums)

# CORRECT - create copy
result.append(nums[:])
```

#### 3. Avoid Duplicates
```python
# For array with duplicates
def permuteUnique(nums):
    nums.sort()
    result = []
    used = [False] * len(nums)
    
    def backtrack(path):
        if len(path) == len(nums):
            result.append(path[:])
            return
        
        for i in range(len(nums)):
            if used[i]:
                continue
            if i > 0 and nums[i] == nums[i-1] and not used[i-1]:
                continue
            
            used[i] = True
            backtrack(path + [nums[i]])
            used[i] = False
    
    backtrack([])
    return result
```

### Next Permutation Algorithm
```python
def nextPermutation(nums):
    # 1. Find first decreasing from right
    i = len(nums) - 2
    while i >= 0 and nums[i] >= nums[i+1]:
        i -= 1
    
    if i >= 0:
        # 2. Find next larger element
        j = len(nums) - 1
        while nums[j] <= nums[i]:
            j -= 1
        nums[i], nums[j] = nums[j], nums[i]
    
    # 3. Reverse from i+1 to end
    nums[i+1:] = reversed(nums[i+1:])
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Backtrack | O(n × n!) | O(n) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Not swapping back | Always backtrack |
| Wrong copy | Use nums[:] |
| Missing base case | Check start == len(nums) |

<!-- back -->
