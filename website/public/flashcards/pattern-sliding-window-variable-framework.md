## Sliding Window - Variable Size: Framework

What is the complete code template for variable-size sliding window?

<!-- front -->

---

### Framework 1: Variable Window Template

```
┌─────────────────────────────────────────────────────┐
│  VARIABLE-SIZE SLIDING WINDOW TEMPLATE               │
├─────────────────────────────────────────────────────┤
│  1. Initialize left = 0, window_state = empty        │
│  2. For right from 0 to n-1:                         │
│     a. Add element at right to window_state         │
│     b. While window violates condition:             │
│        - Remove element at left from window_state   │
│        - left += 1                                  │
│     c. Update optimal result if window valid       │
│  3. Return optimal result                            │
└─────────────────────────────────────────────────────┘
```

---

### Implementation

```python
def min_subarray_len(nums, target):
    """Find minimum length subarray with sum >= target."""
    left = 0
    current_sum = 0
    min_len = float('inf')
    
    for right in range(len(nums)):
        current_sum += nums[right]
        
        # Shrink while condition satisfied
        while current_sum >= target:
            min_len = min(min_len, right - left + 1)
            current_sum -= nums[left]
            left += 1
    
    return min_len if min_len != float('inf') else 0
```

---

### Framework 2: Longest Substring Template

```python
def length_of_longest_substring(s):
    """Longest substring without repeating characters."""
    char_set = set()
    left = 0
    max_len = 0
    
    for right in range(len(s)):
        # Shrink until no duplicate
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        
        char_set.add(s[right])
        max_len = max(max_len, right - left + 1)
    
    return max_len
```

---

### Framework 3: Minimum Window Substring

```python
def min_window(s, t):
    """Find minimum window in s containing all chars in t."""
    from collections import Counter
    
    required = Counter(t)
    missing = len(t)
    left = start = end = 0
    
    for right, char in enumerate(s, 1):
        if required[char] > 0:
            missing -= 1
        required[char] -= 1
        
        while missing == 0:
            if end == 0 or right - left < end - start:
                start, end = left, right
            
            required[s[left]] += 1
            if required[s[left]] > 0:
                missing += 1
            left += 1
    
    return s[start:end] if end else ""
```

---

### Key Pattern Elements

| Element | Purpose | Action |
|---------|---------|--------|
| left | Window start | Increments when shrinking |
| right | Window end | Iterates through array |
| window_state | Track window contents | Add/remove elements |
| condition | When to shrink | While loop check |

<!-- back -->
