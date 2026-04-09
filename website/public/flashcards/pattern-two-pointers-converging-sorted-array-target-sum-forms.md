## Two Pointers - Converging (Sorted Array Target Sum): Forms

What are the different variations of the converging two pointers pattern?

<!-- front -->

---

### Form 1: Find One Pair (Classic Two Sum II)

Find exactly one pair that sums to target (each input has one solution):

```python
def two_sum_ii(numbers: list[int], target: int) -> list[int]:
    """
    LeetCode 167: Two Sum II - Input array is sorted
    Returns 1-based indices
    """
    left, right = 0, len(numbers) - 1
    
    while left < right:
        current_sum = numbers[left] + numbers[right]
        
        if current_sum == target:
            return [left + 1, right + 1]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    return []

# Example: numbers = [2,7,11,15], target = 9
# Output: [1, 2] (indices of 2 and 7)
```

---

### Form 2: Find All Unique Pairs

Find ALL unique pairs that sum to target:

```python
def find_all_pairs(numbers: list[int], target: int) -> list[list[int]]:
    """
    Find all unique pairs in sorted array that sum to target.
    """
    left, right = 0, len(numbers) - 1
    result = []
    
    while left < right:
        current_sum = numbers[left] + numbers[right]
        
        if current_sum == target:
            result.append([numbers[left], numbers[right]])
            
            # Skip duplicates on both sides
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

# Example: numbers = [1,2,3,4,5,6,7,8], target = 9
# Output: [[1,8], [2,7], [3,6], [4,5]]
```

---

### Form 3: Find Pair with Closest Sum

Find pair whose sum is closest to target (exact match may not exist):

```python
def closest_pair(numbers: list[int], target: int) -> list[int]:
    """
    Find two numbers whose sum is closest to target.
    """
    if len(numbers) < 2:
        return []
    
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
            return [left, right]  # Exact match
    
    return [closest_left, closest_right]

# Example: numbers = [1,2,3,4,5], target = 10
# Output: [3, 4] (indices of 4 and 5, sum = 9 closest to 10)
```

---

### Form 4: Three Sum (Extended Pattern)

Fix one element, use converging pointers for remaining two:

```python
def three_sum(nums: list[int]) -> list[list[int]]:
    """
    LeetCode 15: 3Sum - Find all unique triplets summing to zero.
    """
    nums.sort()
    result = []
    n = len(nums)
    
    for i in range(n - 2):
        # Skip duplicates for first element
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        
        target = -nums[i]  # Need two elements that sum to -nums[i]
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

# Example: nums = [-1,0,1,2,-1,-4]
# Output: [[-1,-1,2], [-1,0,1]]
```

---

### Form 5: Two Sum with Sorted Array but Need Original Indices

When array is sorted but you need to return original (unsorted) indices:

```python
def two_sum_original_indices(nums: list[int], target: int) -> list[int]:
    """
    Find two sum in sorted array but return original indices.
    """
    # Store (value, original_index) pairs
    indexed = [(num, i) for i, num in enumerate(nums)]
    indexed.sort()  # Sort by value
    
    left, right = 0, len(indexed) - 1
    
    while left < right:
        current_sum = indexed[left][0] + indexed[right][0]
        
        if current_sum == target:
            # Return original indices
            return sorted([indexed[left][1], indexed[right][1]])
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    return []

# Example: nums = [15, 2, 11, 7], target = 9
# Sorted indexed: [(2,1), (7,3), (11,2), (15,0)]
# Found: 2 + 7 = 9
# Return original indices: [1, 3]
```

---

### Form Comparison

| Form | Problem Type | Complexity | Key Variation |
|------|--------------|------------|---------------|
| **Find One Pair** | Two Sum II | O(n) time, O(1) space | Return on first match |
| **Find All Pairs** | All unique pairs | O(n) time | Skip duplicates, continue after match |
| **Closest Sum** | Closest pair | O(n) time | Track `min_diff`, no early return |
| **3Sum** | Triplets | O(n²) time | Outer loop + converging inner |
| **Original Indices** | Maintain positions | O(n log n) time | Store (value, index) pairs |

---

### Quick Decision Guide

```
Input: Sorted array, find pair summing to target
│
├─ Need exactly one pair? ──► Form 1: Basic converging
│
├─ Need all unique pairs? ──► Form 2: Skip duplicates
│
├─ Exact sum may not exist? ──► Form 3: Track closest
│
├─ Need triplets? ──► Form 4: 3Sum pattern
│
└─ Need original indices? ──► Form 5: Indexed pairs
```

<!-- back -->
