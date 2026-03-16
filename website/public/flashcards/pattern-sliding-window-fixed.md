## Sliding Window: Fixed Size Pattern

**Question:** How do you efficiently find patterns in fixed-size windows?

<!-- front -->

---

## Answer: Maintain Window Sum/State

### Fixed Window Template
```python
def fixed_sliding_window(nums, k):
    result = []
    window_sum = 0
    
    for i in range(len(nums)):
        # Add current element
        window_sum += nums[i]
        
        # Remove element that goes out of window
        if i >= k:
            window_sum -= nums[i - k]
        
        # Window is ready
        if i >= k - 1:
            result.append(window_sum)
    
    return result
```

### Visual: Window Movement
```
nums = [1, 2, 3, 4, 5], k = 3

Window: [1,2,3], sum = 6  → record 6
Window: [2,3,4], sum = 9  → record 9
Window: [3,4,5], sum = 12 → record 12

Result: [6, 9, 12]
```

### ⚠️ Tricky Parts

#### 1. When to Process
```python
# WRONG - process at wrong time
for i in range(len(nums)):
    if i < k:
        window_sum += nums[i]
    result.append(window_sum)  # Wrong!

# CORRECT - process when window is full
if i >= k - 1:  # i = k-1 is first full window
    result.append(window_sum)
```

#### 2. Removal Index
```python
# i = 3 (fourth element), k = 3
# Need to remove nums[3-3] = nums[0]
# Which is nums[i - k]

if i >= k:
    window_sum -= nums[i - k]
```

### Common Variations

| Variation | What to Track | Example |
|-----------|---------------|---------|
| Maximum in window | Max value | Maximum average |
| Minimum in window | Min value | Minimum sum |
| Count patterns | Frequency | Count anagrams |
| Custom condition | State | Valid substrings |

### Maximum Average Subarray
```python
def findMaxAverage(nums, k):
    window_sum = sum(nums[:k])
    max_sum = window_sum
    
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)
    
    return max_sum / k
```

### Find All K-Long Subarrays
```python
def findSubarrays(nums, k):
    result = []
    window_sum = 0
    
    for i in range(len(nums)):
        window_sum += nums[i]
        
        if i >= k:
            window_sum -= nums[i - k]
        
        if i >= k - 1:
            result.append(window_sum)
    
    return result
```

### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) |
| Space | O(1) (excluding output) |

### When Fixed Window Doesn't Work
- Need variable size based on condition
- Need to find minimum/maximum window
- Use dynamic sliding window instead

<!-- back -->
