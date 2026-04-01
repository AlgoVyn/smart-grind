## Title: Subsets (Backtracking) - Forms

What are the different manifestations of the subset pattern?

<!-- front -->

---

### Form 1: Standard Subsets (Distinct Elements)

Generate all 2^n subsets of unique elements.

| Approach | Time | Space | Code Complexity |
|----------|------|-------|-----------------|
| Backtracking | O(n × 2^n) | O(n) aux | Medium |
| Bit Mask | O(n × 2^n) | O(n × 2^n) | Low |
| Iterative | O(n × 2^n) | O(n × 2^n) | Low |

```python
def subsets(nums):
    """Generate all subsets using backtracking."""
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

---

### Form 2: Subsets with Duplicates (Subsets II)

Input contains duplicates, output must not.

```
Key technique:
1. Sort input to group duplicates
2. At each level, skip duplicate elements
3. Only use first occurrence of each value at each level

Example: [1, 2, 2]
Without handling: [], [1], [2], [2], [1,2], [1,2], [2,2], [1,2,2]
With handling:    [], [1], [2], [1,2], [2,2], [1,2,2]
```

```python
def subsets_with_duplicates(nums):
    nums.sort()
    result = []
    
    def backtrack(start, path):
        result.append(path[:])
        
        for i in range(start, len(nums)):
            if i > start and nums[i] == nums[i - 1]:
                continue
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    
    backtrack(0, [])
    return result
```

---

### Form 3: Subsets of Specific Size

Generate only subsets with exactly k elements.

```python
def subsets_of_size_k(nums, k):
    result = []
    
    def backtrack(start, path):
        if len(path) == k:
            result.append(path[:])
            return
        
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    
    backtrack(0, [])
    return result
```

---

### Form 4: Subset Sum

Find subsets that sum to a target value.

| Variation | Constraint | Pruning Strategy |
|-----------|------------|------------------|
| **Exact sum** | Sum equals target | Return when sum == target |
| **At most** | Sum ≤ target | Break when sum > target |
| **All valid** | Multiple targets | Collect all matching |

---

### Form 5: Constrained Subsets

Subsets meeting complex constraints (size, sum, content).

```
Example constraints:
- Sum divisible by k
- Contains at least one even number
- Size is prime
- Maximum element < threshold
```

<!-- back -->
