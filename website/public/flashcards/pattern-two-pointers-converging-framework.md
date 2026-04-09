## Two Pointers - Converging: Framework

What is the complete code template for Converging Two Pointers solutions?

<!-- front -->

---

### Framework 1: Basic Converging Template

```
┌─────────────────────────────────────────────────────┐
│  CONVERGING TWO POINTERS - BASIC TEMPLATE            │
├─────────────────────────────────────────────────────┤
│  1. Initialize left = 0, right = n - 1              │
│  2. While left < right:                             │
│     a. Calculate current = arr[left] + arr[right]   │
│     b. If current == target: return [left, right]   │
│     c. If current < target: left++                  │
│     d. If current > target: right--                 │
│  3. Return not found / empty result                 │
└─────────────────────────────────────────────────────┘
```

**Implementation:**

```python
def two_sum_template(numbers, target):
    left, right = 0, len(numbers) - 1
    
    while left < right:
        current_sum = numbers[left] + numbers[right]
        
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    return None
```

---

### Framework 2: Three Sum Template

```
┌─────────────────────────────────────────────────────┐
│  CONVERGING - THREE SUM TEMPLATE                     │
├─────────────────────────────────────────────────────┤
│  1. Sort the array (if not sorted)                  │
│  2. For i from 0 to n-3:                            │
│     a. Skip if duplicate: nums[i] == nums[i-1]     │
│     b. Initialize left = i+1, right = n-1          │
│     c. While left < right:                          │
│        - Calculate sum = nums[i] + nums[l] + nums[r]│
│        - If sum == target: add to result, skip dups │
│        - If sum < target: left++                     │
│        - If sum > target: right--                    │
│  3. Return all found triplets                       │
└─────────────────────────────────────────────────────┘
```

**Implementation:**

```python
def three_sum_template(nums, target=0):
    nums.sort()
    result = []
    n = len(nums)
    
    for i in range(n - 2):
        # Skip duplicates for first element
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        
        left, right = i + 1, n - 1
        
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            
            if total == target:
                result.append([nums[i], nums[left], nums[right]])
                # Skip duplicates
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                left += 1
                right -= 1
            elif total < target:
                left += 1
            else:
                right -= 1
    
    return result
```

---

### Framework 3: Container With Most Water Template

```
┌─────────────────────────────────────────────────────┐
│  CONVERGING - CONTAINER TEMPLATE                     │
├─────────────────────────────────────────────────────┤
│  1. Initialize left = 0, right = n - 1              │
│  2. Initialize max_area = 0                         │
│  3. While left < right:                             │
│     a. Calculate area = (right-left) * min(h[l],h[r])│
│     b. Update max_area = max(max_area, area)        │
│     c. Move pointer with smaller height:             │
│        - If h[left] < h[right]: left++             │
│        - Else: right--                             │
│  4. Return max_area                                 │
└─────────────────────────────────────────────────────┘
```

**Implementation:**

```python
def container_template(height):
    left, right = 0, len(height) - 1
    max_area = 0
    
    while left < right:
        width = right - left
        h = min(height[left], height[right])
        max_area = max(max_area, width * h)
        
        # Move pointer at shorter line
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    
    return max_area
```

---

### Key Pattern Elements

| Element | Value | Purpose |
|---------|-------|---------|
| left | 0 | Start from beginning |
| right | n-1 | Start from end |
| while condition | left < right | Stop when pointers meet |
| movement | left++ or right-- | Converge toward center |

<!-- back -->
