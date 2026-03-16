## Cyclic Sort: In-Place Sorting for Special Cases

**Question:** How does cyclic sort work and when should you use it?

<!-- front -->

---

## Answer: Place Each Element in Its Correct Index

### Basic Cyclic Sort
```python
def cyclic_sort(nums):
    i = 0
    while i < len(nums):
        correct_idx = nums[i] - 1  # Element should be at this index
        
        # If element is in valid range and not at correct position
        if nums[i] > 0 and nums[i] <= len(nums) and nums[i] != nums[correct_idx]:
            # Swap to correct position
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
```

### For Missing Number
```python
def findMissingNumber(nums):
    i = 0
    while i < len(nums):
        correct_idx = nums[i]
        
        # Place number at its correct index (nums[i] should be i)
        if nums[i] < len(nums) and nums[i] != nums[nums[i]]:
            nums[nums[i]], nums[i] = nums[i], nums[nums[i]]
        else:
            i += 1
    
    # Find the missing number
    for i in range(len(nums)):
        if nums[i] != i:
            return i
    
    return len(nums)
```

### Visual: How Cyclic Sort Works
```
nums = [3, 1, 5, 4, 2]

Step 1: i=0, nums[0]=3
        correct = 3-1=2
        swap nums[0] and nums[2] → [5, 1, 3, 4, 2]
        
Step 2: i=0, nums[0]=5
        correct = 5-1=4
        swap → [2, 1, 3, 4, 5]
        
Step 3: i=0, nums[0]=2
        correct = 2-1=1
        swap → [1, 2, 3, 4, 5]
        
Step 4: i=0, nums[0]=1 ✓
        i=1, nums[1]=2 ✓
        ...

Final: [1, 2, 3, 4, 5]
```

### ⚠️ Tricky Parts

#### 1. Correct Index Calculation
```python
# For 1 to n range (no zero)
correct_idx = nums[i] - 1

# For 0 to n range (includes zero)
correct_idx = nums[i]  # value equals index

# For arbitrary range [min, max]
correct_idx = nums[i] - min_val
```

#### 2. Range Validation
```python
# Must check if element is within valid range
# Wrong: always swap
if nums[i] != nums[correct_idx]:  # May index out of bounds!

# Correct: validate range first
if nums[i] > 0 and nums[i] <= len(nums) and nums[i] != nums[correct_idx]:
```

#### 3. Infinite Loop Prevention
```python
# Need to ensure progress
# Don't increment i when swapping, check again
while nums[i] != i + 1:
    # swap logic
    
# When element is correct, THEN increment
else:
    i += 1
```

### Problems Solved by Cyclic Sort

| Problem | Range | Find |
|---------|-------|------|
| Missing Number | 0 to n | Missing |
| Find All Duplicates | 1 to n | Duplicates |
| First Missing Positive | 1 to n+1 | Missing |
| Find Duplicate | 1 to n | Duplicate |

### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) |
| Space | O(1) |

### Why O(n)?
- Each element is moved at most once
- Each element is visited at most twice
- Total operations ≤ 2n

<!-- back -->
