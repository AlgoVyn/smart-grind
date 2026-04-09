## Stack - Monotonic Stack: Framework

What is the complete code template for monotonic stack problems?

<!-- front -->

---

### Framework 1: Next Greater Element Template

```
┌─────────────────────────────────────────────────────┐
│  MONOTONIC STACK - NEXT GREATER TEMPLATE             │
├─────────────────────────────────────────────────────┤
│  1. Initialize empty stack                           │
│  2. Initialize result array with -1 (or 0)          │
│  3. For i from 0 to n-1:                            │
│     a. While stack not empty AND                    │
│        arr[i] > arr[stack.top()]: (for NGE)         │
│        - idx = stack.pop()                           │
│        - result[idx] = arr[i] (or i - idx)         │
│     b. Push i to stack                              │
│  4. Return result (remaining are -1 or 0)          │
│                                                      │
│  Key: Decreasing stack for Next Greater!            │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: Next Greater Element

```python
def next_greater_element(nums):
    """Find next greater element for each position."""
    n = len(nums)
    result = [-1] * n
    stack = []  # Decreasing stack, stores indices
    
    for i in range(n):
        # Pop smaller elements
        while stack and nums[i] > nums[stack[-1]]:
            idx = stack.pop()
            result[idx] = nums[i]
        
        stack.append(i)
    
    return result
```

---

### Implementation: Daily Temperatures

```python
def daily_temperatures(temperatures):
    """Days until warmer temperature."""
    n = len(temperatures)
    result = [0] * n
    stack = []  # Decreasing stack
    
    for i in range(n):
        while stack and temperatures[i] > temperatures[stack[-1]]:
            idx = stack.pop()
            result[idx] = i - idx
        
        stack.append(i)
    
    return result
```

---

### Implementation: Largest Rectangle in Histogram

```python
def largest_rectangle(heights):
    """Find largest rectangle area in histogram."""
    stack = []  # Increasing stack
    max_area = 0
    n = len(heights)
    
    for i in range(n + 1):
        # Use 0 as sentinel at end
        curr_height = heights[i] if i < n else 0
        
        while stack and curr_height < heights[stack[-1]]:
            height = heights[stack.pop()]
            width = i if not stack else i - stack[-1] - 1
            max_area = max(max_area, height * width)
        
        stack.append(i)
    
    return max_area
```

---

### Key Pattern Elements

| Problem | Stack Order | Comparison | Result |
|---------|-------------|------------|--------|
| Next Greater | Decreasing | `>` | Value/Index |
| Next Smaller | Increasing | `<` | Value/Index |
| Daily Temps | Decreasing | `>` | Distance |
| Largest Rectangle | Increasing | `<` (with sentinel) | Area |

<!-- back -->
