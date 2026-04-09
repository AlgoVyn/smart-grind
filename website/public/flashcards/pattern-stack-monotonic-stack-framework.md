## Stack - Monotonic Stack: Framework

What is the complete code template for solving Monotonic Stack problems?

<!-- front -->

---

### Framework: Monotonic Stack Template

```
┌─────────────────────────────────────────────────────────────────┐
│  MONOTONIC STACK - TEMPLATE                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Key Insight: Stack maintains candidates for next greater/      │
│  smaller elements in monotonic order                            │
│                                                                 │
│  1. Initialize:                                                 │
│     - result array with default values (-1 or 0)               │
│     - empty stack (stores indices, not values)                 │
│                                                                 │
│  2. Choose iteration direction:                                 │
│     - Right-to-left: next greater to the right                 │
│     - Left-to-right: previous greater or distances            │
│                                                                 │
│  3. Process each element:                                     │
│     - while stack and comparison holds: pop                    │
│     - if stack: stack[-1] is the answer                        │
│     - push current index onto stack                            │
│                                                                 │
│  4. Comparison operators:                                     │
│     - Next greater (decreasing): nums[stack[-1]] <= nums[i]     │
│     - Next smaller (increasing): nums[stack[-1]] >= nums[i]   │
│                                                                 │
│  5. Return result array                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

### Implementation: Next Greater Element (Right-to-Left)

```python
def next_greater_element(nums: list[int]) -> list[int]:
    """
    Find next greater element for each element (to the right).
    Time: O(n), Space: O(n)
    """
    n = len(nums)
    result = [-1] * n
    stack = []  # Stack of indices with decreasing values
    
    for i in range(n - 1, -1, -1):
        # Pop elements smaller than or equal to current
        while stack and nums[stack[-1]] <= nums[i]:
            stack.pop()
        
        # If stack not empty, top is next greater
        if stack:
            result[i] = nums[stack[-1]]
        
        stack.append(i)
    
    return result
```

---

### Implementation: Daily Temperatures (Left-to-Right)

```python
def daily_temperatures(temperatures: list[int]) -> list[int]:
    """
    Find days until warmer temperature for each day.
    Time: O(n), Space: O(n)
    """
    n = len(temperatures)
    result = [0] * n
    stack = []  # Stack of indices with decreasing temperatures
    
    for i in range(n):
        # Process days that found a warmer day
        while stack and temperatures[i] > temperatures[stack[-1]]:
            prev_day = stack.pop()
            result[prev_day] = i - prev_day
        
        stack.append(i)
    
    return result
```

---

### Key Framework Elements

| Element | Purpose | Example |
|---------|---------|---------|
| `stack` | Store indices of candidates | `[]` initially |
| Right-to-left | Find next greater to right | `range(n-1, -1, -1)` |
| Left-to-right | Find previous greater or distance | `range(n)` |
| `while stack and ...` | Maintain monotonic order | Pop violating elements |
| `<=` vs `>` | Comparison direction | `<=` for strictly decreasing |
| Default value | -1 if no greater element | `result = [-1] * n` |

---

### Direction Quick Reference

| Direction | Stack Order | Finds | Default |
|-----------|-------------|-------|---------|
| Right-to-left | Decreasing | Next greater to right | -1 |
| Left-to-right | Decreasing | Previous greater, or distances | 0 or -1 |
| Right-to-left | Increasing | Next smaller to right | -1 |
| Left-to-right | Increasing | Previous smaller, or distances | 0 or -1 |

<!-- back -->
