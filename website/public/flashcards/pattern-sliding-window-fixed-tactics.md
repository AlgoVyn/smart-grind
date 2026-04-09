## Sliding Window - Fixed Size: Tactics

What are the advanced techniques for fixed-size sliding window?

<!-- front -->

---

### Tactic 1: Monotonic Queue for Max/Min

**Problem**: Find max in every window of size k

**Solution**: Monotonic deque

```python
def max_in_windows(nums, k):
    from collections import deque
    
    dq = deque()  # Store indices, values decreasing
    result = []
    
    for i, num in enumerate(nums):
        # Remove smaller elements from back
        while dq and nums[dq[-1]] < num:
            dq.pop()
        
        dq.append(i)
        
        # Remove out of window from front
        if dq[0] <= i - k:
            dq.popleft()
        
        # Start recording after first window
        if i >= k - 1:
            result.append(nums[dq[0]])
    
    return result
```

**Key**: Deque front always has max of current window

---

### Tactic 2: Binary Search for Optimal Window

**Problem**: Find minimum window size with average >= threshold

**Solution**: Binary search on window size + fixed window check

```python
def min_size_subarray(nums, threshold):
    """Find minimum size where average >= threshold."""
    
    def check(size):
        """Check if any subarray of 'size' has avg >= threshold."""
        window_sum = sum(nums[:size])
        if window_sum >= threshold * size:
            return True
        
        for i in range(size, len(nums)):
            window_sum += nums[i] - nums[i - size]
            if window_sum >= threshold * size:
                return True
        return False
    
    # Binary search on window size
    left, right = 1, len(nums) + 1
    result = -1
    
    while left < right:
        mid = (left + right) // 2
        if check(mid):
            result = mid
            right = mid
        else:
            left = mid + 1
    
    return result
```

---

### Tactic 3: Rolling Hash for String Matching

```python
def str_str(haystack, needle):
    """Find first occurrence using rolling hash."""
    if not needle:
        return 0
    
    base = 26
    mod = 10**9 + 7
    
    # Compute hash for needle
    needle_hash = 0
    for char in needle:
        needle_hash = (needle_hash * base + ord(char)) % mod
    
    # Rolling hash for haystack
    window_hash = 0
    power = pow(base, len(needle), mod)
    
    for i, char in enumerate(haystack):
        window_hash = (window_hash * base + ord(char)) % mod
        
        if i >= len(needle):
            window_hash = (window_hash - ord(haystack[i - len(needle)]) * power) % mod
        
        if i >= len(needle) - 1 and window_hash == needle_hash:
            if haystack[i - len(needle) + 1:i + 1] == needle:
                return i - len(needle) + 1
    
    return -1
```

---

### Tactic 4: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|-----|
| **Wrong initial window** | Missing elements | Sum exactly first k |
| **Index out of bounds** | i - k negative | Start loop at k |
| **Not checking length** | Array shorter than k | Early return |
| **Floating point precision** | Average comparison | Compare sums, not averages |
| **Modulo in rolling hash** | Negative values | Add mod before % mod |

---

### Tactic 5: Circular Array Sliding Window

```python
def max_sum_circular(nums, k):
    """Maximum sum of k consecutive elements in circular array."""
    n = len(nums)
    
    # Duplicate array to handle circularity
    extended = nums + nums
    
    window_sum = sum(extended[:k])
    max_sum = window_sum
    
    for i in range(k, len(extended)):
        window_sum += extended[i] - extended[i - k]
        max_sum = max(max_sum, window_sum)
        
        # Only consider windows that don't exceed n elements
        if i - k + 1 >= n:
            break
    
    return max_sum
```

<!-- back -->
