## Sliding Window - Variable Size: Forms

What are the different variations of variable-size sliding window?

<!-- front -->

---

### Form 1: Minimum Size Subarray Sum

```python
def min_subarray_len(nums, target):
    left = 0
    current_sum = 0
    min_len = float('inf')
    
    for right in range(len(nums)):
        current_sum += nums[right]
        
        while current_sum >= target:
            min_len = min(min_len, right - left + 1)
            current_sum -= nums[left]
            left += 1
    
    return 0 if min_len == float('inf') else min_len
```

**Condition**: sum >= target
**Goal**: minimize length

---

### Form 2: Longest Substring Without Repeating

```python
def length_of_longest_substring(s):
    char_set = set()
    left = 0
    max_len = 0
    
    for right in range(len(s)):
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        char_set.add(s[right])
        max_len = max(max_len, right - left + 1)
    
    return max_len
```

**Condition**: all unique characters
**Goal**: maximize length

---

### Form 3: Longest with K Distinct Characters

```python
def length_of_longest_substring_k_distinct(s, k):
    from collections import defaultdict
    
    char_count = defaultdict(int)
    left = 0
    max_len = 0
    
    for right in range(len(s)):
        char_count[s[right]] += 1
        
        while len(char_count) > k:
            char_count[s[left]] -= 1
            if char_count[s[left]] == 0:
                del char_count[s[left]]
            left += 1
        
        max_len = max(max_len, right - left + 1)
    
    return max_len
```

**Condition**: at most k distinct chars
**Goal**: maximize length

---

### Form 4: Max Consecutive Ones (Flip K Zeros)

```python
def longest_ones(nums, k):
    left = 0
    zeros_count = 0
    max_len = 0
    
    for right in range(len(nums)):
        if nums[right] == 0:
            zeros_count += 1
        
        while zeros_count > k:
            if nums[left] == 0:
                zeros_count -= 1
            left += 1
        
        max_len = max(max_len, right - left + 1)
    
    return max_len
```

**Condition**: at most k zeros in window
**Goal**: maximize consecutive 1s

---

### Form Comparison

| Form | Window State | Shrink Condition | Goal |
|------|--------------|------------------|------|
| Min Subarray Sum | Running sum | sum >= target | Minimize |
| Longest Unique | Hash set | duplicate found | Maximize |
| K Distinct | Hash map | distinct > k | Maximize |
| Max Ones | Zero count | zeros > k | Maximize |

<!-- back -->
