## Kadane's Algorithm: Forms & Variations

What are the different forms and variations of Kadane's algorithm?

<!-- front -->

---

### Standard 1D Form

```python
def kadane_standard(arr):
    """
    Maximum subarray sum - classic form
    """
    max_ending_here = max_so_far = arr[0]
    
    for x in arr[1:]:
        max_ending_here = max(x, max_ending_here + x)
        max_so_far = max(max_so_far, max_ending_here)
    
    return max_so_far

# Functional style
def kadane_functional(arr):
    from functools import reduce
    
    def step(acc, x):
        max_here, max_so_far = acc
        new_max_here = max(x, max_here + x)
        new_max_so_far = max(max_so_far, new_max_here)
        return (new_max_here, new_max_so_far)
    
    return reduce(step, arr[1:], (arr[0], arr[0]))[1]
```

---

### With Minimum Length Constraint

```python
def kadane_min_length(arr, min_len):
    """
    Maximum subarray sum with minimum length constraint
    """
    n = len(arr)
    if n < min_len:
        return float('-inf')
    
    # Prefix sums
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i+1] = prefix[i] + arr[i]
    
    max_sum = float('-inf')
    
    # For each ending position, find best starting position
    from collections import deque
    mono = deque()  # Monotonic queue of prefix indices
    
    for i in range(min_len, n + 1):
        # Maintain monotonicity: prefix values increasing
        while mono and prefix[mono[-1]] >= prefix[i - min_len]:
            mono.pop()
        mono.append(i - min_len)
        
        # Remove indices too far back
        while mono and mono[0] < i - n:
            mono.popleft()
        
        # Best start is at mono[0]
        if mono:
            max_sum = max(max_sum, prefix[i] - prefix[mono[0]])
    
    return max_sum
```

---

### With Maximum Length Constraint

```python
def kadane_max_length(arr, max_len):
    """
    Maximum subarray sum with maximum length constraint
    """
    n = len(arr)
    max_sum = float('-inf')
    
    # Sliding window with variable size
    current_sum = 0
    
    from collections import deque
    window = deque()
    
    for i, x in enumerate(arr):
        window.append(x)
        current_sum += x
        
        # Maintain window size
        while len(window) > max_len:
            current_sum -= window.popleft()
        
        # Update max (need at least 1 element)
        if window:
            max_sum = max(max_sum, current_sum)
        
        # Also try dropping negative prefix within window
        # (more complex - would need prefix min in window)
    
    return max_sum
```

---

### With Exactly K Elements

```python
def kadane_exactly_k(arr, k):
    """
    Maximum sum subarray with exactly k elements
    """
    n = len(arr)
    if n < k:
        return float('-inf')
    
    # Sum of first k elements
    current_sum = sum(arr[:k])
    max_sum = current_sum
    
    # Slide window of size k
    for i in range(k, n):
        current_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, current_sum)
    
    return max_sum

# With at most k elements
def kadane_at_most_k(arr, k):
    """Maximum sum with at most k elements"""
    # Can be solved with prefix minimums
    # For each i, find best j where i-k <= j < i
    pass
```

---

### Maximum Product Subarray

```python
def max_product_subarray(arr):
    """
    Maximum product subarray (similar idea, tracks min too)
    """
    if not arr:
        return 0
    
    # Need to track both max and min because negatives flip
    max_prod = min_prod = result = arr[0]
    
    for x in arr[1:]:
        if x < 0:
            max_prod, min_prod = min_prod, max_prod
        
        max_prod = max(x, max_prod * x)
        min_prod = min(x, min_prod * x)
        
        result = max(result, max_prod)
    
    return result
```

<!-- back -->
