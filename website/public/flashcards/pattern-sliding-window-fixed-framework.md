## Sliding Window - Fixed Size: Framework

What is the complete code template for fixed-size sliding window?

<!-- front -->

---

### Framework 1: Fixed Window Template

```
┌─────────────────────────────────────────────────────┐
│  FIXED-SIZE SLIDING WINDOW TEMPLATE                  │
├─────────────────────────────────────────────────────┤
│  1. Compute initial window (first k elements)      │
│  2. Process initial state (sum, max, etc.)          │
│  3. For i from k to n-1:                            │
│     a. Remove element at (i-k) from window state    │
│     b. Add element at i to window state             │
│     c. Update result based on new state             │
│  4. Return final result                             │
└─────────────────────────────────────────────────────┘
```

---

### Implementation

```python
def max_sum_subarray(nums, k):
    """Find maximum sum of any subarray of size k."""
    if len(nums) < k:
        return 0
    
    # Initial window sum
    window_sum = sum(nums[:k])
    max_sum = window_sum
    
    # Slide window
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)
    
    return max_sum
```

---

### Framework 2: Maximum Average

```python
def max_average(nums, k):
    """Find maximum average of any subarray of size k."""
    # Compute initial sum
    window_sum = sum(nums[:k])
    max_sum = window_sum
    
    # Slide
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)
    
    return max_sum / k
```

---

### Framework 3: Find All Anagrams

```python
def find_anagrams(s, p):
    """Find all starting indices of anagrams of p in s."""
    from collections import Counter
    
    p_count = Counter(p)
    window_count = Counter(s[:len(p) - 1])
    result = []
    
    for i in range(len(p) - 1, len(s)):
        window_count[s[i]] += 1  # Add new char
        
        if window_count == p_count:
            result.append(i - len(p) + 1)
        
        window_count[s[i - len(p) + 1]] -= 1  # Remove old char
        if window_count[s[i - len(p) + 1]] == 0:
            del window_count[s[i - len(p) + 1]]
    
    return result
```

---

### Key Pattern Elements

| Element | Formula | Purpose |
|---------|---------|---------|
| Window size | k | Fixed constant |
| Remove index | i - k | Element leaving window |
| Add index | i | Element entering window |
| Update | state += new - old | O(1) window update |

<!-- back -->
