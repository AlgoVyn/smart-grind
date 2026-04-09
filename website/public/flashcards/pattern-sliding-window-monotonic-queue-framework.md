## Sliding Window - Monotonic Queue: Framework

What is the complete code template for monotonic queue sliding window?

<!-- front -->

---

### Framework 1: Sliding Window Maximum Template

```
┌─────────────────────────────────────────────────────┐
│  MONOTONIC QUEUE - SLIDING WINDOW MAXIMUM            │
├─────────────────────────────────────────────────────┤
│  1. Initialize empty deque (stores indices)       │
│  2. For each element at index i:                     │
│     a. Remove indices <= i-k (out of window)        │
│     b. While deque not empty AND nums[deque.back] < nums[i]: │
│        - Pop from back (smaller elements won't be max)     │
│     c. Add i to back of deque                        │
│     d. If i >= k-1: result.append(nums[deque.front])│
│  3. Return result array                               │
└─────────────────────────────────────────────────────┘
```

---

### Implementation

```python
def max_sliding_window(nums, k):
    from collections import deque
    
    dq = deque()  # Stores indices, values decreasing
    result = []
    
    for i, num in enumerate(nums):
        # Remove out of window from front
        while dq and dq[0] <= i - k:
            dq.popleft()
        
        # Remove smaller elements from back
        while dq and nums[dq[-1]] < num:
            dq.pop()
        
        dq.append(i)
        
        # Start recording after first window
        if i >= k - 1:
            result.append(nums[dq[0]])
    
    return result
```

---

### Framework 2: Sliding Window Minimum

```python
def min_sliding_window(nums, k):
    from collections import deque
    
    dq = deque()  # Stores indices, values increasing
    result = []
    
    for i, num in enumerate(nums):
        # Remove out of window
        while dq and dq[0] <= i - k:
            dq.popleft()
        
        # Remove larger elements (for min queue)
        while dq and nums[dq[-1]] > num:
            dq.pop()
        
        dq.append(i)
        
        if i >= k - 1:
            result.append(nums[dq[0]])
    
    return result
```

---

### Framework 3: Shortest Subarray with Sum at Least K

```python
def shortest_subarray(nums, k):
    from collections import deque
    
    n = len(nums)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]
    
    dq = deque()
    min_len = float('inf')
    
    for i in range(n + 1):
        # Check if we can form valid subarray
        while dq and prefix[i] - prefix[dq[0]] >= k:
            min_len = min(min_len, i - dq.popleft())
        
        # Maintain monotonicity (increasing prefix sums)
        while dq and prefix[i] <= prefix[dq[-1]]:
            dq.pop()
        
        dq.append(i)
    
    return min_len if min_len != float('inf') else -1
```

---

### Key Pattern Elements

| Element | Purpose | Operation |
|---------|---------|-----------|
| Deque | Store indices | popleft(), pop(), append() |
| Front | Max/Min element | Check window validity |
| Back | Insertion point | Remove worse elements |
| Indices | Track positions | Check i - k boundary |

<!-- back -->
