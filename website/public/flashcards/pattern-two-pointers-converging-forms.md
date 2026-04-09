## Two Pointers - Converging: Forms

What are the different variations of the Converging Two Pointers pattern?

<!-- front -->

---

### Form 1: Basic Two Sum (Find One Pair)

**Purpose**: Find exactly one pair that sums to target

```python
def two_sum(numbers, target):
    left, right = 0, len(numbers) - 1
    
    while left < right:
        current_sum = numbers[left] + numbers[right]
        
        if current_sum == target:
            return [left + 1, right + 1]  # 1-based indices
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    return []  # No solution
```

**When to use**: Exactly one solution guaranteed, sorted input

---

### Form 2: Find All Unique Pairs

**Purpose**: Find all pairs that sum to target (with duplicates in array)

```python
def find_all_pairs(numbers, target):
    left, right = 0, len(numbers) - 1
    result = []
    
    while left < right:
        current_sum = numbers[left] + numbers[right]
        
        if current_sum == target:
            result.append([numbers[left], numbers[right]])
            # Skip duplicates
            while left < right and numbers[left] == numbers[left + 1]:
                left += 1
            while left < right and numbers[right] == numbers[right - 1]:
                right -= 1
            left += 1
            right -= 1
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    return result
```

**Key addition**: Skip duplicate values to avoid duplicate pairs

---

### Form 3: Closest Sum to Target

**Purpose**: Find pair with sum closest to target (when exact match not guaranteed)

```python
def closest_sum(numbers, target):
    left, right = 0, len(numbers) - 1
    closest_diff = float('inf')
    result = []
    
    while left < right:
        current_sum = numbers[left] + numbers[right]
        diff = abs(current_sum - target)
        
        if diff < closest_diff:
            closest_diff = diff
            result = [numbers[left], numbers[right]]
        
        if current_sum < target:
            left += 1
        else:
            right -= 1
    
    return result
```

**When to use**: Need approximation, not exact match

---

### Form 4: Three Sum (Fixed + Converging)

**Purpose**: Find triplets that sum to target

```python
def three_sum(nums, target=0):
    nums.sort()
    result = []
    n = len(nums)
    
    for i in range(n - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue  # Skip duplicates
        
        left, right = i + 1, n - 1
        
        while left < right:
            current_sum = nums[i] + nums[left] + nums[right]
            
            if current_sum == target:
                result.append([nums[i], nums[left], nums[right]])
                left += 1
                right -= 1
            elif current_sum < target:
                left += 1
            else:
                right -= 1
    
    return result
```

**Pattern**: Fix one element, use converging pointers for remaining two

---

### Form 5: Container With Most Water

**Purpose**: Maximize area between two lines

```python
def max_area(height):
    left, right = 0, len(height) - 1
    max_water = 0
    
    while left < right:
        # Area = width * min_height
        width = right - left
        h = min(height[left], height[right])
        max_water = max(max_water, width * h)
        
        # Move pointer with smaller height
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    
    return max_water
```

**Key difference**: Move pointer based on height, not sum comparison

---

### Form Comparison

| Form | Movement Logic | Output | Complexity |
|------|---------------|--------|------------|
| Basic Two Sum | Sum vs Target | One pair | O(n) |
| All Pairs | Sum vs Target + dedup | All pairs | O(n) |
| Closest Sum | Track min diff | Closest pair | O(n) |
| Three Sum | Fix + two pointers | All triplets | O(n²) |
| Container | Min height comparison | Max area | O(n) |

<!-- back -->
