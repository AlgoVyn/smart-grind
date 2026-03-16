## Search in Rotated Array

**Question:** How do you search in a rotated sorted array?

<!-- front -->

---

## Answer: Modified Binary Search

### Solution
```python
def search(nums, target):
    if not nums:
        return -1
    
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if nums[mid] == target:
            return mid
        
        # Determine which side is sorted
        if nums[left] <= nums[mid]:
            # Left side is sorted
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            # Right side is sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    
    return -1
```

### Visual: Finding Sorted Side
```
nums = [4,5,6,7,0,1,2], target = 0

Step 1: left=0, right=6, mid=3, nums[3]=7
        nums[left]<=nums[mid] (4<=7) → left sorted
        target(0) not in [4,7) → go right

Step 2: left=4, right=6, mid=5, nums[5]=1
        nums[left]<=nums[mid] (0<=1) → left sorted  
        target(0) in [0,1) → go left

Step 3: left=4, right=4, mid=4, nums[4]=0 → Found!

Return: 4
```

### ⚠️ Tricky Parts

#### 1. Which Side is Sorted?
```python
# Compare nums[left] with nums[mid]
# If nums[left] <= nums[mid], left side is sorted
# Otherwise, right side is sorted
```

#### 2. Boundary Conditions
```python
# Using <= instead of < for left check
# Handles case where left == mid

# Be careful with comparisons:
# nums[left] <= target < nums[mid]  # left inclusive
# nums[mid] < target <= nums[right]  # right inclusive
```

#### 3. Handling Duplicates
```python
# For duplicates, worst case O(n)
def searchWithDupes(nums, target):
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if nums[mid] == target:
            return True
        
        # Can't determine - move both
        if nums[left] == nums[mid] == nums[right]:
            left += 1
            right -= 1
        elif nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    
    return -1
```

### Find Minimum in Rotated Array
```python
def findMin(nums):
    left, right = 0, len(nums) - 1
    
    while left < right:
        mid = (left + right) // 2
        
        if nums[mid] > nums[right]:
            left = mid + 1
        else:
            right = mid
    
    return nums[left]
```

### Time & Space Complexity

| Case | Time | Space |
|------|------|-------|
| Unique elements | O(log n) | O(1) |
| With duplicates | O(n) worst | O(1) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Wrong sorted side check | Compare left with mid |
| Off-by-one errors | Be careful with <= vs < |
| Not handling k > len | Works automatically |

<!-- back -->
