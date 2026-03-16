## Maximum Subarray (Kadane's)

**Question:** Maximum sum of contiguous subarray?

<!-- front -->

---

## Answer: Kadane's Algorithm

### Solution
```python
def maxSubArray(nums):
    max_sum = nums[0]
    current_sum = nums[0]
    
    for i in range(1, len(nums)):
        # Either extend previous or start new
        current_sum = max(nums[i], current_sum + nums[i])
        max_sum = max(max_sum, current_sum)
    
    return max_sum
```

### Visual: Kadane's Logic
```
nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]

i=0: max= -2, current= -2
i=1: current = max(1, -2+1) = 1
     max = max(-2, 1) = 1
i=2: current = max(-3, 1-3) = -2
     max = max(1, -2) = 1
i=3: current = max(4, -2+4) = 4
     max = max(1, 4) = 4
i=4: current = max(-1, 4-1) = 3
     max = max(4, 3) = 4
i=5: current = max(2, 3+2) = 5
     max = max(4, 5) = 5
i=6: current = max(1, 5+1) = 6
     max = max(5, 6) = 6
i=7: current = max(-5, 6-5) = 1
     max = max(6, 1) = 6
i=8: current = max(4, 1+4) = 5
     max = max(6, 5) = 6

Answer: 6 (subarray [4,-1,2,1])
```

### ⚠️ Tricky Parts

#### 1. Why max(num, current + num)?
```python
# Either:
# - Start new subarray at current position
# - Extend previous subarray

# If current + num < num → previous sum hurts us
# Reset to just num
```

#### 2. Why Initialize with First Element?
```python
# Need at least one element
# Can't start from 0 (empty subarray not allowed)

# Alternative: initialize both to -inf
max_sum = float('-inf')
current_sum = 0
for num in nums:
    current_sum = max(num, current_sum + num)
    max_sum = max(max_sum, current_sum)
```

#### 3. With Index Tracking
```python
def maxSubArrayIndex(nums):
    max_sum = nums[0]
    current_sum = nums[0]
    start = end = 0
    temp_start = 0
    
    for i in range(1, len(nums)):
        if nums[i] > current_sum + nums[i]:
            current_sum = nums[i]
            temp_start = i
        else:
            current_sum = current_sum + nums[i]
        
        if current_sum > max_sum:
            max_sum = current_sum
            start = temp_start
            end = i
    
    return max_sum, nums[start:end+1]
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Kadane's | O(n) | O(1) |
| Divide & Conquer | O(n log n) | O(log n) |
| Brute Force | O(n²) | O(1) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Wrong comparison | max(num, cur + num) |
| Empty subarray | Must include at least one element |
| Not tracking max | Update max_sum each iteration |

<!-- back -->
