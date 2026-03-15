## Subsets Pattern

**Question:** How do you generate all subsets of a set?

<!-- front -->

---

## Answer: Backtracking or Bit Manipulation

### Approach 1: Backtracking
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

### Approach 2: Bit Manipulation
```python
def subsets_bit(nums):
    n = len(nums)
    result = []
    
    for i in range(1 << n):  # 2^n subsets
        subset = []
        for j in range(n):
            if i & (1 << j):
                subset.append(nums[j])
        result.append(subset)
    
    return result
```

### Visual
```
nums = [1,2,3]

Subsets:
[]         (0 elements)
[1]        (1 element)
[2]
[3]
[1,2]      (2 elements)
[1,3]
[2,3]
[1,2,3]    (3 elements)

Total: 2^3 = 8 subsets
```

### Complexity
| Approach | Time | Space |
|----------|------|-------|
| Backtrack | O(n × 2^n) | O(n) |
| Bit | O(n × 2^n) | O(n) |

### Variations
- Subsets II (with duplicates)
- Letter case permutation
- Permutations via subsets

<!-- back -->
