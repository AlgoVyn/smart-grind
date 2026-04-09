## Backtracking - Subsets Include/Exclude: Forms

What are the different variations of the include/exclude subset pattern?

<!-- front -->

---

### Form 1: Standard Include/Exclude

```python
def subsets(nums):
    """Generate all subsets - binary decision at each element."""
    result = []
    
    def backtrack(start, current):
        if start == len(nums):
            result.append(current[:])
            return
        
        backtrack(start + 1, current)  # Exclude
        
        current.append(nums[start])    # Include
        backtrack(start + 1, current)
        current.pop()
    
    backtrack(0, [])
    return result
```

**Output**: All 2^n subsets including empty set.

---

### Form 2: Subsets with Duplicates (Include/Exclude Style)

```python
def subsets_with_dup(nums):
    """Handle duplicates while maintaining include/exclude structure."""
    nums.sort()
    result = []
    
    def backtrack(start, current):
        result.append(current[:])  # Add at each node (cascading style)
        
        for i in range(start, len(nums)):
            if i > start and nums[i] == nums[i - 1]:
                continue  # Skip duplicates
            
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()
    
    backtrack(0, [])
    return result
```

**Note**: When handling duplicates, the for-loop style is cleaner with include/exclude.

---

### Form 3: Pure Binary Include/Exclude with Duplicates

```python
def subsets_with_dup_binary(nums):
    """Pure binary include/exclude with duplicate handling."""
    from collections import Counter
    
    counts = Counter(nums)
    unique = list(counts.keys())
    result = []
    
    def backtrack(index, current):
        if index == len(unique):
            result.append(current[:])
            return
        
        num = unique[index]
        count = counts[num]
        
        # Exclude: skip all occurrences
        backtrack(index + 1, current)
        
        # Include: can take 1 to count occurrences
        for _ in range(count):
            current.append(num)
            backtrack(index + 1, current)
        
        # Backtrack all added
        for _ in range(count):
            current.pop()
    
    backtrack(0, [])
    return result
```

---

### Form 4: Subset Sum (Include/Exclude)

```python
def subset_sum(nums, target):
    """Find subsets summing to target."""
    result = []
    
    def backtrack(start, current, current_sum):
        if current_sum == target:
            result.append(current[:])
            return
        if current_sum > target or start == len(nums):
            return
        
        backtrack(start + 1, current, current_sum)  # Exclude
        
        current.append(nums[start])  # Include
        backtrack(start + 1, current, current_sum + nums[start])
        current.pop()
    
    backtrack(0, [], 0)
    return result
```

---

### Form 5: Partition Equal Subset Sum

```python
def can_partition(nums):
    """Check if array can be partitioned into two equal sum subsets."""
    total = sum(nums)
    if total % 2 != 0:
        return False
    
    target = total // 2
    found = False
    
    def backtrack(start, current_sum):
        nonlocal found
        if found:
            return
        if current_sum == target:
            found = True
            return
        if current_sum > target or start == len(nums):
            return
        
        backtrack(start + 1, current_sum)  # Exclude
        backtrack(start + 1, current_sum + nums[start])  # Include
    
    backtrack(0, 0)
    return found
```

---

### Form Comparison

| Form | Use Case | Key Modification |
|------|----------|------------------|
| Standard | Power set | Pure binary decisions |
| With duplicates | Duplicate input | Frequency counting or skip logic |
| Subset sum | Target sum | Track running sum, prune |
| Partition | Equal split | Early termination on find |
| Size k | Fixed size subsets | Check `len(current) == k` |

<!-- back -->
