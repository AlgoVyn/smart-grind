## Cyclic Sort with Duplicates

**Question:** How do you handle duplicates in cyclic sort?

<!-- front -->

---

## Cyclic Sort with Duplicates

### Challenge
When duplicates exist, the "correct position" is already occupied.

### Algorithm
```python
def find_disappeared_numbers(nums):
    n = len(nums)
    
    # Place each number at correct index
    i = 0
    while i < n:
        correct = nums[i] - 1  # values are 1-indexed
        
        if nums[i] != nums[correct]:
            # Swap if not duplicate
            nums[i], nums[correct] = nums[correct], nums[i]
        else:
            i += 1
    
    # Find all indices where value != index + 1
    result = []
    for i in range(n):
        if nums[i] != i + 1:
            result.append(i + 1)
    
    return result
```

### Key Strategy
- Skip duplicates (when `nums[i] == nums[correct]`) 
- The duplicate will be handled when we find another instance

### 💡 Pattern for Duplicate Handling
1. Skip if current element is already in correct position OR its a duplicate
2. Track duplicates by checking if the target position already has the same value

### Time: O(n), Space: O(1)

<!-- back -->
