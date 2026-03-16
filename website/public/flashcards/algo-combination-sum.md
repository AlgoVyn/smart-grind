## Combination Sum: Backtracking

**Question:** How do you find all combinations that sum to target?

<!-- front -->

---

## Answer: Backtrack with Pruning

### Solution
```python
def combinationSum(candidates, target):
    result = []
    
    def backtrack(start, target, path):
        if target == 0:
            result.append(path[:])
            return
        if target < 0:
            return
        
        for i in range(start, len(candidates)):
            path.append(candidates[i])
            backtrack(i, target - candidates[i], path)  # i not i+1 (can reuse)
            path.pop()
    
    candidates.sort()  # Sort for pruning
    backtrack(0, target, [])
    return result
```

### Visual: Tree
```
candidates = [2,3,6,7], target = 7

                         7
           /             |             \         \
         2               3               6         7
      / | \            / |             /          (7)
    2   3  6         3   6          6
   /|  |   |         |   |          |
  2 3  5  6         3   6          6
  | |  |  |          |   |          |
 ... etc ...

Result: [[2,2,3], [7]]
```

### ⚠️ Tricky Parts

#### 1. Reuse Same Element
```python
# For unlimited use of same element:
backtrack(i, ...)  # i not i+1

# For each element once:
backtrack(i+1, ...)  # i+1
```

#### 2. Why Sort?
```python
# Sort enables early termination
candidates.sort()

for i in range(start, len(candidates)):
    if candidates[i] > target:
        break  # No point continuing!
```

#### 3. Avoid Duplicates
```python
# Don't use same index twice
# Sort + skip same values at same level

for i in range(start, len(candidates)):
    if i > start and candidates[i] == candidates[i-1]:
        continue
```

### Combination Sum II (Each Once)
```python
def combinationSum2(candidates, target):
    result = []
    candidates.sort()
    
    def backtrack(start, target, path):
        if target == 0:
            result.append(path[:])
            return
        if target < 0:
            return
        
        for i in range(start, len(candidates)):
            if candidates[i] > target:
                break
            if i > start and candidates[i] == candidates[i-1]:
                continue
            
            path.append(candidates[i])
            backtrack(i+1, target - candidates[i], path)
            path.pop()
    
    backtrack(0, target, [])
    return result
```

### Time Complexity
```
Let n = len(candidates), target be T
Worst case: explore all combinations
Time: O(n^T) in worst case
Space: O(T) for recursion
```

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Using i+1 for unlimited | Use i for unlimited |
| Not sorting | Sort enables pruning |
| Missing base cases | Check both target==0 and target<0 |

<!-- back -->
