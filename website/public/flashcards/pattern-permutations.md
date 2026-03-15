## Permutations Pattern

**Question:** How do you generate all permutations of an array?

<!-- front -->

---

## Answer: Backtracking with Swap

### Solution
```python
def permute(nums):
    result = []
    
    def backtrack(start):
        if start == len(nums):
            result.append(nums[:])
            return
        
        for i in range(start, len(nums)):
            # Swap
            nums[start], nums[i] = nums[i], nums[start]
            # Recurse
            backtrack(start + 1)
            # Undo swap (backtrack)
            nums[start], nums[i] = nums[i], nums[start]
    
    backtrack(0)
    return result
```

### Visual
```
nums = [1,2,3]

Tree:
                    []
           /      |      \
         [1]     [2]     [3]
        / | \    / | \   / | \
      12 13  21 23  31 32
      |   |   |  |   |  |
     123 132 213 231 312 321

Total: 3! = 6 permutations
```

### Alternative: Used Array
```python
def permute_used(nums):
    result = []
    used = [False] * len(nums)
    path = []
    
    def backtrack():
        if len(path) == len(nums):
            result.append(path[:])
            return
        
        for i in range(len(nums)):
            if not used[i]:
                used[i] = True
                path.append(nums[i])
                backtrack()
                path.pop()
                used[i] = False
    
    backtrack()
    return result
```

### Complexity
- **Time:** O(n × n!)
- **Space:** O(n) for recursion stack

### Key Points
- Use swap for in-place
- Always backtrack (undo change)
- Order matters: swap before recurse, undo after

<!-- back -->
