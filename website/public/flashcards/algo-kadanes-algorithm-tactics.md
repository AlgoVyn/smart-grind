## Kadane's Algorithm: Tactics & Applications

What tactical patterns leverage Kadane's algorithm?

<!-- front -->

---

### Tactic 1: Maximum Subarray with Skip

```python
def kadane_with_skip(arr, k):
    """
    Maximum subarray sum allowing up to k skips
    """
    n = len(arr)
    
    # dp[i][j] = max sum ending at i with j skips
    # Optimize to O(k) space
    
    prev = [float('-inf')] * (k + 1)
    prev[0] = arr[0]
    
    max_sum = arr[0]
    
    for i in range(1, n):
        curr = [float('-inf')] * (k + 1)
        
        for j in range(k + 1):
            # Don't skip: extend previous
            if prev[j] != float('-inf'):
                curr[j] = max(curr[j], prev[j] + arr[i])
            
            # Skip current: use previous without adding
            if j > 0 and prev[j-1] != float('-inf'):
                curr[j] = max(curr[j], prev[j-1])
        
        max_sum = max(max_sum, max(curr))
        prev = curr
    
    return max_sum
```

---

### Tactic 2: Maximum Alternating Sum

```python
def max_alternating_sum(arr):
    """
    Maximum alternating sum: a[i] - a[i+1] + a[i+2] - ...
    """
    # Two states: at even position (add) or odd position (subtract)
    even_sum = 0   # Sum if next element is added
    odd_sum = 0    # Sum if next element is subtracted
    
    for x in arr:
        new_even = max(even_sum, odd_sum + x)
        new_odd = max(odd_sum, even_sum - x)
        even_sum, odd_sum = new_even, new_odd
    
    return even_sum
```

---

### Tactic 3: Maximum Sum with Constraints

```python
def max_sum_no_adjacent(arr):
    """
    Maximum sum with no two adjacent elements (House Robber)
    """
    if not arr:
        return 0
    if len(arr) == 1:
        return arr[0]
    
    prev2 = arr[0]
    prev1 = max(arr[0], arr[1])
    
    for i in range(2, len(arr)):
        curr = max(prev1, arr[i] + prev2)
        prev2, prev1 = prev1, curr
    
    return prev1

def max_sum_distance_k(arr, k):
    """
    Maximum sum where selected elements are at least k apart
    """
    n = len(arr)
    
    # dp[i] = max sum considering first i elements, may or may not take i
    # Use monotonic queue for efficient range maximum
    from collections import deque
    
    dp = [0] * (n + 1)
    mono = deque()
    
    for i in range(1, n + 1):
        # dp[i] = max(dp[i-1], arr[i-1] + dp[max(0, i-k)])
        
        # Add i-k to queue
        idx = i - k - 1
        if idx >= 0:
            while mono and dp[mono[-1]] <= dp[idx]:
                mono.pop()
            mono.append(idx)
        
        best_prev = dp[mono[0]] if mono else 0
        dp[i] = max(dp[i-1], arr[i-1] + best_prev)
        
        # Remove out of range
        while mono and mono[0] < i - k:
            mono.popleft()
    
    return dp[n]
```

---

### Tactic 4: Multiple Maximum Subarrays

```python
def k_maximum_subarrays(arr, k):
    """
    Find k non-overlapping subarrays with maximum total sum
    """
    n = len(arr)
    
    # dp[i][j] = max sum using j subarrays from first i elements
    # Can optimize with prefix maximums
    
    INF = float('-inf')
    
    # dp[j] for current i
    dp = [INF] * (k + 1)
    dp[0] = 0
    
    # Also need best subarray ending at each position
    for _ in range(k):
        new_dp = [INF] * (k + 1)
        max_ending_here = INF
        
        for i in range(n):
            # Extend or start new
            if max_ending_here == INF:
                max_ending_here = arr[i]
            else:
                max_ending_here = max(arr[i], max_ending_here + arr[i])
            
            # Update dp for this subarray
            if dp[0] != INF:  # Can form new subarray
                new_dp[1] = max(new_dp[1], max_ending_here)
            
            for j in range(1, k):
                if dp[j] != INF:
                    new_dp[j+1] = max(new_dp[j+1], dp[j] + max_ending_here)
        
        dp = new_dp
    
    return max(dp)
```

---

### Tactic 5: Transform to Subarray Problems

```python
def max_average_subarray(arr, k):
    """
    Find subarray of at least k elements with maximum average
    """
    # Binary search on average
    # Check: can we achieve average >= mid?
    
    def check(mid):
        # Transform: arr[i] - mid, check if any subarray of len >= k has sum >= 0
        transformed = [x - mid for x in arr]
        
        # Need max subarray of length >= k
        prefix = 0
        min_prefix = 0
        
        for i, x in enumerate(transformed):
            prefix += x
            
            if i >= k - 1:
                if prefix - min_prefix >= 0:
                    return True
            
            # Update min prefix (only for positions that could be start)
            if i >= k - 1:
                min_prefix = min(min_prefix, prefix - sum(transformed[i-k+2:i+1]))
        
        return False
    
    # Binary search
    lo, hi = min(arr), max(arr)
    
    for _ in range(50):  # Enough for precision
        mid = (lo + hi) / 2
        if check(mid):
            lo = mid
        else:
            hi = mid
    
    return lo
```

<!-- back -->
