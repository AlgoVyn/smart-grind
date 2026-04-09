## Sliding Window - Fixed Size: Forms

What are the different variations of fixed-size sliding window?

<!-- front -->

---

### Form 1: Maximum Sum Subarray

```python
def max_sum(nums, k):
    window_sum = sum(nums[:k])
    max_sum = window_sum
    
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)
    
    return max_sum
```

---

### Form 2: Minimum Sum Subarray

```python
def min_sum(nums, k):
    window_sum = sum(nums[:k])
    min_sum = window_sum
    
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        min_sum = min(min_sum, window_sum)
    
    return min_sum
```

---

### Form 3: Contains Permutation

```python
def check_inclusion(s1, s2):
    """Check if s2 contains a permutation of s1."""
    from collections import Counter
    
    len1, len2 = len(s1), len(s2))
    if len1 > len2:
        return False
    
    s1_count = Counter(s1)
    window = Counter(s2[:len1])
    
    if window == s1_count:
        return True
    
    for i in range(len1, len2):
        window[s2[i]] += 1
        window[s2[i - len1]] -= 1
        
        if window[s2[i - len1]] == 0:
            del window[s2[i - len1]]
        
        if window == s1_count:
            return True
    
    return False
```

---

### Form 4: First Negative in Window

```python
def first_negative(nums, k):
    """Find first negative number in each window of size k."""
    from collections import deque
    
    result = []
    negatives = deque()  # Store indices of negatives
    
    for i in range(len(nums)):
        # Add new element
        if nums[i] < 0:
            negatives.append(i)
        
        # Remove out of window
        while negatives and negatives[0] <= i - k:
            negatives.popleft()
        
        # Start recording after first window
        if i >= k - 1:
            result.append(nums[negatives[0]] if negatives else 0)
    
    return result
```

---

### Form Comparison

| Form | Window State | Update Action | Result Type |
|------|--------------|---------------|-------------|
| Max Sum | Running sum | += new - old | Single value |
| Min Sum | Running sum | += new - old | Single value |
| Permutation | Char count | Increment/decrement | Boolean/List |
| First Negative | Deque | Add/remove indices | List per window |

<!-- back -->
