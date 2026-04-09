## Sliding Window - Fixed Size: Tactics

What are practical tactics for solving fixed-size sliding window problems?

<!-- front -->

---

### Tactic 1: Quick Pattern Identification

**Recognize fixed-size sliding window problems:**

```python
def identify_fixed_window_problem(description):
    """
    Keywords that indicate fixed-size sliding window.
    """
    keywords = {
        'subarray of size': 'fixed_window',
        'subarray of length': 'fixed_window',
        'window of size': 'fixed_window',
        'consecutive elements': 'fixed_window',
        'every k elements': 'fixed_window',
        'sliding window': 'fixed_or_variable',
        'maximum average': 'fixed_window',
        'contiguous subarray of size': 'fixed_window',
    }
    
    text = description.lower()
    for keyword, pattern in keywords.items():
        if keyword in text:
            return pattern
    return 'unknown'
```

| Keyword | Approach | Example Problem |
|---------|----------|-----------------|
| "size k" / "length k" | Fixed window | Max sum subarray size k |
| "every subarray" | Store all results | All averages of size k |
| "maximum in window" | Monotonic deque | Sliding window maximum |

---

### Tactic 2: Visual Window Tracing

**Trace the window through the array:**

```
Array: [1, 4, 2, 10, 23, 3, 1, 0, 20], k = 4

Step 0: [1, 4, 2, 10]        sum = 17  ← max so far
              ↓↓↓              ↓↓↓
Step 1:     [4, 2, 10, 23]   sum = 39  ← max so far
                  ↓↓↓              ↓↓↓
Step 2:         [2, 10, 23, 3]  sum = 38
                      ↓↓↓              ↓↓↓
Step 3:             [10, 23, 3, 1]  sum = 37
                          ↓↓↓              ↓↓↓
Step 4:                 [23, 3, 1, 0]  sum = 27
                              ↓↓↓              ↓↓↓
Step 5:                     [3, 1, 0, 20]  sum = 24

Code trace:
  i=4: sum += 23 - 1 = 17 + 22 = 39, max = 39
  i=5: sum += 3 - 4 = 39 - 1 = 38, max = 39
  i=6: sum += 1 - 2 = 38 - 1 = 37, max = 39
  ...
```

---

### Tactic 3: Handle Edge Cases First

**Always validate before computing:**

```python
def robust_sliding_window(arr, k):
    """
    Template with comprehensive edge case handling.
    """
    # Case 1: Empty or None array
    if not arr:
        return 0  # or [] for multi-result
    
    n = len(arr)
    
    # Case 2: Invalid k
    if k <= 0:
        raise ValueError("Window size must be positive")
    
    # Case 3: k larger than array
    if k > n:
        return 0  # or handle as special case
    
    # Case 4: k equals n (single window)
    if k == n:
        return sum(arr)
    
    # Normal sliding window logic
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    for i in range(k, n):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
    
    return max_sum
```

---

### Tactic 4: Pattern for Different Calculations

**Adapt the template for various metrics:**

```python
def sliding_window_variants(arr, k):
    """
    Template showing different calculation types.
    """
    if not arr or k <= 0 or k > len(arr):
        return None
    
    n = len(arr)
    
    # === Sum ===
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    # === Average ===
    avg_result = [window_sum / k]
    
    # === Count (for binary/condition) ===
    window_count = sum(1 for x in arr[:k] if meets_condition(x))
    max_count = window_count
    
    for i in range(k, n):
        # Update sum
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
        
        # Update average list
        avg_result.append(window_sum / k)
        
        # Update count (adjust for condition)
        if meets_condition(arr[i]):
            window_count += 1
        if meets_condition(arr[i - k]):
            window_count -= 1
        max_count = max(max_count, window_count)
    
    return max_sum, avg_result, max_count
```

---

### Tactic 5: First Window Optimization

**Alternative: Build first window in loop to avoid `sum(arr[:k])`:**

```python
def sliding_window_single_loop(arr, k):
    """
    Single loop approach - useful for streaming data.
    """
    if not arr or k <= 0 or k > len(arr):
        return 0
    
    window_sum = 0
    max_sum = float('-inf')
    
    for i in range(len(arr)):
        window_sum += arr[i]  # Add current element
        
        # Window is full when i >= k-1
        if i >= k - 1:
            max_sum = max(max_sum, window_sum)
            window_sum -= arr[i - k + 1]  # Remove leftmost
    
    return max_sum
```

**When to use:**
- Streaming data where you can't access `arr[:k]` upfront
- Want to avoid O(k) initialization
- Prefer single loop for code clarity

---

### Tactic 6: Deque for Sliding Window Maximum

**When you need the maximum *element* (not sum):**

```python
from collections import deque

def sliding_window_maximum(arr, k):
    """
    Find maximum in each window of size k.
    Uses monotonic decreasing deque.
    Time: O(n), Space: O(k)
    """
    if not arr or k <= 0:
        return []
    
    dq = deque()  # Stores indices, values in decreasing order
    result = []
    
    for i in range(len(arr)):
        # Remove indices out of current window
        if dq and dq[0] < i - k + 1:
            dq.popleft()
        
        # Remove smaller elements from back (they can't be max)
        while dq and arr[dq[-1]] < arr[i]:
            dq.pop()
        
        dq.append(i)
        
        # Start recording results after first k elements
        if i >= k - 1:
            result.append(arr[dq[0]])  # Front is max
    
    return result
```

**Key insight:** Deque maintains candidates in decreasing order. Front is always the max.

---

### Tactic 7: Prefix Sum for Multiple Queries

**When you need arbitrary range sums, not just size k:**

```python
def prefix_sum_with_fixed_window(arr, k):
    """
    Hybrid: Build prefix sum, use for O(1) range queries.
    Good when you need both fixed-k and arbitrary ranges.
    """
    if not arr or k <= 0 or k > len(arr):
        return 0, []
    
    n = len(arr)
    
    # Build prefix sum
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + arr[i]
    
    # Get sum of any range [l, r] in O(1): prefix[r+1] - prefix[l]
    
    # Fixed-size k windows using prefix sum
    max_sum = float('-inf')
    window_sums = []
    
    for i in range(k, n + 1):
        window_sum = prefix[i] - prefix[i - k]
        window_sums.append(window_sum)
        max_sum = max(max_sum, window_sum)
    
    return max_sum, window_sums

# Example: Get sum of range [2, 5] in O(1)
# range_sum = prefix[6] - prefix[2]
```

<!-- back -->
