## Monotonic Stack: Tactics & Techniques

What are the tactical patterns for solving monotonic stack problems?

<!-- front -->

---

### Tactic 1: Identify What to Store

| Store | When to Use | Example |
|-------|-------------|---------|
| Indices | Need position info | NGE, daily temps |
| Values | Only value matters | Some simplifications |
| Tuples | Multiple data | Online stock span |

```python
# Prefer indices - more flexible
stack = [i]  # Store index i
value = nums[stack[-1]]  # Access value when needed
```

---

### Tactic 2: Choose Stack Order

| Order | Finds | Typical Use |
|-------|-------|-------------|
| Decreasing (strict) | Next greater to right | NGE, daily temps |
| Decreasing (non-strict) | Next greater or equal | Avoids issues with duplicates |
| Increasing (strict) | Next smaller to right | Rectangle histogram |
| Increasing (non-strict) | Next smaller or equal | Sum of mins |

```python
# Strict vs non-strict
while stack and nums[stack[-1]] < nums[i]:   # Strict: skip equals
while stack and nums[stack[-1]] <= nums[i]:  # Non-strict: pop equals
```

---

### Tactic 3: Sentinel Values

Use sentinel to force stack emptying.

```python
def process_with_sentinel(arr):
    """Add sentinel 0 at end to empty stack"""
    stack = []
    
    for x in arr + [0]:  # Sentinel forces all pops
        while stack and stack[-1] > x:
            # Process popped element
            process(stack.pop())
        stack.append(x)
```

---

### Tactic 4: Two-Pass for Circular

For circular arrays, iterate twice.

```python
def circular_nge(nums):
    n = len(nums)
    result = [-1] * n
    stack = []
    
    for i in range(2 * n):  # Two passes
        idx = i % n
        
        while stack and nums[stack[-1]] < nums[idx]:
            result[stack.pop()] = nums[idx]
        
        if i < n:  # Only push in first pass
            stack.append(idx)
    
    return result
```

---

### Tactic 5: Monotonic Queue Extension

When you need to maintain window, use deque.

```python
from collections import deque

def sliding_window_max(nums, k):
    """Maximum in each window of size k"""
    result = []
    dq = deque()  # Decreasing (stores indices)
    
    for i, num in enumerate(nums):
        # Remove out of window
        while dq and dq[0] <= i - k:
            dq.popleft()
        
        # Maintain decreasing order
        while dq and nums[dq[-1]] < num:
            dq.pop()
        
        dq.append(i)
        
        # Start recording after first window
        if i >= k - 1:
            result.append(nums[dq[0]])
    
    return result
```

**Key difference**: Can remove from both ends.

<!-- back -->
