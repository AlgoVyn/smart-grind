## Sliding Window Maximum

**Question:** How do you find the maximum value in each sliding window of size k?

<!-- front -->

---

## Answer: Monotonic Deque

### Key Concept
Use a monotonic decreasing deque to track potential maximum elements.

### Solution
```python
from collections import deque

def maxSlidingWindow(nums, k):
    result = []
    dq = deque()  # Store indices
    
    for i in range(len(nums)):
        # Remove indices outside current window
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        
        # Remove indices of smaller elements (they can't be max)
        while dq and nums[dq[-1]] < nums[i]:
            dq.pop()
        
        dq.append(i)
        
        # Start recording when window is complete
        if i >= k - 1:
            result.append(nums[dq[0]])
    
    return result
```

### Visual
```
nums = [1,3,-1,-3,5,3,6,7], k = 3

Window: [1,3,-1] → max = 3
Window: [3,-1,-3] → max = 3
Window: [-1,-3,5] → max = 5
Window: [-3,5,3]  → max = 5
Window: [5,3,6]   → max = 6
Window: [3,6,7]   → max = 7

Result: [3,3,5,5,6,7]
```

### Complexity
- **Time:** O(n) - each element added/removed once
- **Space:** O(k)

### Key Points
- Deque stores **indices**, not values
- Monotonic decreasing = largest at front
- Always remove elements smaller than current

### Variations
- Minimum sliding window: Use monotonic **increasing** deque

<!-- back -->
