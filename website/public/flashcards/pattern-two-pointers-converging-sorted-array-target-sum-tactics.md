## Two Pointers - Converging (Sorted Array Target Sum): Tactics

What are specific techniques for converging two-pointer problems?

<!-- front -->

---

### Tactic 1: Skipping Duplicates (All Unique Pairs)

When finding ALL pairs, skip duplicates to avoid redundant results:

```python
def find_all_unique_pairs(numbers: list[int], target: int) -> list[list[int]]:
    """Find all unique pairs summing to target."""
    left, right = 0, len(numbers) - 1
    result = []
    
    while left < right:
        current_sum = numbers[left] + numbers[right]
        
        if current_sum == target:
            result.append([numbers[left], numbers[right]])
            
            # Skip duplicates - crucial!
            left_val, right_val = numbers[left], numbers[right]
            while left < right and numbers[left] == left_val:
                left += 1
            while left < right and numbers[right] == right_val:
                right -= 1
                
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    return result
```

---

### Tactic 2: Find Closest Sum (No Exact Match)

When an exact sum may not exist, track the closest:

```python
def find_closest_pair(numbers: list[int], target: int) -> list[int]:
    """Find pair with sum closest to target."""
    left, right = 0, len(numbers) - 1
    closest_left, closest_right = 0, 1
    min_diff = abs(numbers[0] + numbers[1] - target)
    
    while left < right:
        current_sum = numbers[left] + numbers[right]
        current_diff = abs(current_sum - target)
        
        if current_diff < min_diff:
            min_diff = current_diff
            closest_left, closest_right = left, right
        
        if current_sum < target:
            left += 1
        elif current_sum > target:
            right -= 1
        else:
            return [left, right]  # Exact match found
    
    return [closest_left, closest_right]
```

---

### Tactic 3: 3Sum (Fix One + Two Pointers)

Extend to 3Sum by fixing one element, using converging pointers for remaining two:

```python
def three_sum(nums: list[int]) -> list[list[int]]:
    """Find all unique triplets summing to zero."""
    nums.sort()
    result = []
    n = len(nums)
    
    for i in range(n - 2):
        # Skip duplicates for first element
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        
        target = -nums[i]
        left, right = i + 1, n - 1
        
        while left < right:
            current_sum = nums[left] + nums[right]
            
            if current_sum == target:
                result.append([nums[i], nums[left], nums[right]])
                # Skip duplicates
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                left += 1
                right -= 1
            elif current_sum < target:
                left += 1
            else:
                right -= 1
    
    return result
```

---

### Tactic 4: Handle Unsorted Input

If array isn't sorted, sort it first (changes complexity):

```python
def two_sum_unsorted(nums: list[int], target: int) -> list[int]:
    """Handle unsorted input by sorting first."""
    # Create (value, original_index) pairs to track original positions
    indexed = [(num, i) for i, num in enumerate(nums)]
    indexed.sort()  # Sort by value
    
    left, right = 0, len(indexed) - 1
    
    while left < right:
        current_sum = indexed[left][0] + indexed[right][0]
        
        if current_sum == target:
            return [indexed[left][1], indexed[right][1]]  # Original indices
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    return []
# Note: Time becomes O(n log n) due to sorting
```

---

### Tactic 5: K-Sum Pattern (Recursive Reduction)

Generalize to K-Sum by recursively reducing the problem:

```python
def k_sum(nums: list[int], target: int, k: int) -> list[list[int]]:
    """General K-Sum using recursive reduction."""
    result = []
    
    def helper(start, k, target, current):
        # Base case: 2Sum with converging pointers
        if k == 2:
            left, right = start, len(nums) - 1
            while left < right:
                s = nums[left] + nums[right]
                if s == target:
                    result.append(current + [nums[left], nums[right]])
                    # Skip duplicates
                    while left < right and nums[left] == nums[left + 1]:
                        left += 1
                    while left < right and nums[right] == nums[right - 1]:
                        right -= 1
                    left += 1
                    right -= 1
                elif s < target:
                    left += 1
                else:
                    right -= 1
            return
        
        # Recursive case: fix one element
        for i in range(start, len(nums) - k + 1):
            if i > start and nums[i] == nums[i - 1]:
                continue
            if nums[i] * k > target:  # Early termination (optimization)
                break
            helper(i + 1, k - 1, target - nums[i], current + [nums[i]])
    
    nums.sort()
    helper(0, k, target, [])
    return result
```

---

### Tactic Comparison

| Tactic | Use Case | Key Addition |
|--------|----------|--------------|
| Skip Duplicates | All unique pairs/triplets | Duplicate skipping logic |
| Closest Sum | No exact match exists | Track `min_diff` variable |
| 3Sum | Triplets summing to zero | Outer loop + target = -nums[i] |
| Handle Unsorted | Input not sorted | Sort + track original indices |
| K-Sum | General N elements | Recursive reduction to 2Sum |

<!-- back -->
