## Sliding Window Maximum

**Question:** How do you find maximum in each window efficiently?

<!-- front -->

---

## Answer: Monotonic Deque

### Solution
```python
from collections import deque

def maxSlidingWindow(nums, k):
    if not nums or k == 0:
        return []
    
    result = []
    dq = deque()  # stores indices
    
    for i in range(len(nums)):
        # Remove indices outside current window
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        
        # Remove indices with smaller values (can't be max)
        while dq and nums[dq[-1]] < nums[i]:
            dq.pop()
        
        dq.append(i)
        
        # Add to result when window is complete
        if i >= k - 1:
            result.append(nums[dq[0]])
    
    return result
```

### Visual: Deque Operations
```
nums = [1,3,-1,-3,5,3,6,7], k = 3

i=0: dq=[0] → window incomplete
i=1: dq=[1] → 3 > 1, remove 0
i=2: dq=[1,2] → -1 < 3, keep
     window complete → result=[3]
i=3: dq=[1,2,3] → -3 < -1, keep
     window complete → result=[3,3]
i=4: dq=[4] → 5 > all, remove 1,2,3
     window complete → result=[3,3,5]
i=5: dq=[4,5] → 3 < 5, keep
     window complete → result=[3,3,5,5]
i=6: dq=[6] → 6 > all, remove 4,5
     window complete → result=[3,3,5,5,6]
i=7: dq=[7] → 7 > 6
     window complete → result=[3,3,5,5,6,7]
```

### ⚠️ Tricky Parts

#### 1. Storing Indices, Not Values
```python
# Store indices to:
# 1. Check if out of window
# 2. Access values from nums

dq.append(i)  # Store index, not value
nums[dq[0]]   # Get value from stored index
```

#### 2. Two Conditions for Removal
```python
# 1. Out of window
while dq and dq[0] < i - k + 1:
    dq.popleft()

# 2. Smaller than current
while dq and nums[dq[-1]] < nums[i]:
    dq.pop()
```

#### 3. When to Add Result
```python
# Only when window is complete
if i >= k - 1:
    result.append(nums[dq[0]])
```

### Alternative: Deque of Values
```python
from collections import deque

def maxSlidingWindow(nums, k):
    dq = deque()
    result = []
    
    for i, num in enumerate(nums):
        # Remove out of window
        while dq and dq[0][1] < i - k + 1:
            dq.popleft()
        
        # Remove smaller elements
        while dq and dq[-1][0] < num:
            dq.pop()
        
        dq.append((num, i))
        
        if i >= k - 1:
            result.append(dq[0][0])
    
    return result
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Monotonic Deque | O(n) | O(k) |
| Brute Force | O(n×k) | O(1) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Storing values | Store indices |
| Wrong window check | Use i - k + 1 |
| Forgetting to remove small | Both removal conditions |

<!-- back -->
