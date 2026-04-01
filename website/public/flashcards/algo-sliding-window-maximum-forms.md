## Title: Sliding Window Maximum - Forms

What are the different manifestations of the sliding window maximum pattern?

<!-- front -->

---

### Form 1: Fixed-Size Window (Maximum)

Window size is constant; find maximum for each window.

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Monotonic Deque | O(n) | O(k) | Optimal, single pass |
| Max Heap | O(n log k) | O(k) | Need k-largest, not just max |
| Brute Force | O(n × k) | O(1) | Very small k |

```python
from collections import deque

def max_sliding_window(nums, k):
    """Find maximum in each window using monotonic deque."""
    if not nums or k == 0:
        return []
    
    result = []
    dq = deque()  # Stores indices, decreasing order
    
    for i, num in enumerate(nums):
        # Remove indices outside window
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        
        # Remove smaller elements (can't be max)
        while dq and nums[dq[-1]] < num:
            dq.pop()
        
        dq.append(i)
        
        # Add to result once window is full
        if i >= k - 1:
            result.append(nums[dq[0]])
    
    return result
```

---

### Form 2: Fixed-Size Window (Minimum)

Same as maximum but with flipped comparisons.

```python
# Key difference: use > instead of <
while dq and nums[dq[-1]] > nums[i]:  # Note: > for minimum
    dq.pop()
```

---

### Form 3: Sliding Window with Constraints

Apply additional constraints to valid windows.

```
Example: Shortest Subarray with Sum at Least K
- Use prefix sums + monotonic deque
- Maintain increasing prefix sums in deque
- For each ending point, find valid starting points
```

---

### Form 4: Circular/Wrapping Window

Window wraps around array end to beginning.

```
Technique: Duplicate array or use modulo
Array: [1, 2, 3, 4, 5] with window size 3
Windows: [1,2,3], [2,3,4], [3,4,5], [4,5,1], [5,1,2]
```

---

### Form 5: Multi-Source Window (K-way)

Merge k sorted sources and track running statistics.

```
Example: Smallest Range Covering Elements from K Lists
- Use min-heap to track current window across k lists
- Track current maximum separately
- Slide window using heap operations
```

<!-- back -->
