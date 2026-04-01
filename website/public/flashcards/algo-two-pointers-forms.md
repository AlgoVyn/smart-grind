## Title: Two Pointers - Forms

What are the different manifestations of the two-pointer pattern?

<!-- front -->

---

### Form 1: Sorted Array Two-Sum

Find pairs in sorted array that sum to target.

| Condition | Action | Reason |
|-----------|--------|--------|
| `arr[left] + arr[right] == target` | Return pair | Found solution |
| `arr[left] + arr[right] < target` | left++ | Need larger sum |
| `arr[left] + arr[right] > target` | right-- | Need smaller sum |

```python
def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        current_sum = nums[left] + nums[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return [-1, -1]
```

---

### Form 2: Palindrome Validation

Check if string/array is palindrome.

```python
left = 0
right = len(arr) - 1
while left < right:
    if arr[left] != arr[right]:
        return False
    left += 1
    right -= 1
return True
```

---

### Form 3: Partitioning/Dutch National Flag

Partition array into categories using multiple pointers.

```
[0s ... low-1] | [1s ... mid-1] | [unprocessed ... high] | [2s ... end]
                ^                ^                        ^
               low              mid                     high
```

---

### Form 4: Container with Most Water

Maximize area between two lines.

```python
def max_area(height):
    left, right = 0, len(height) - 1
    max_water = 0
    
    while left < right:
        width = right - left
        current_height = min(height[left], height[right])
        max_water = max(max_water, width * current_height)
        
        # Move pointer with smaller height
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    
    return max_water
```

---

### Form 5: 3Sum

Find triplets that sum to zero.

```python
def three_sum(nums):
    nums.sort()
    result = []
    
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        
        left, right = i + 1, len(nums) - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total == 0:
                result.append([nums[i], nums[left], nums[right]])
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                left += 1
                right -= 1
            elif total < 0:
                left += 1
            else:
                right -= 1
    
    return result
```

<!-- back -->
