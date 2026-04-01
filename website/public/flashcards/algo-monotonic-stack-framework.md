## Monotonic Stack: Framework

What are the complete implementations for monotonic stack patterns?

<!-- front -->

---

### Next Greater Element (Standard)

```python
def next_greater_element(nums):
    """
    Find next greater element for each position.
    Returns array where result[i] = next greater or -1.
    """
    n = len(nums)
    result = [-1] * n
    stack = []  # Stores indices, values decreasing
    
    for i in range(n):
        # Pop smaller elements, they found their NGE
        while stack and nums[stack[-1]] < nums[i]:
            result[stack.pop()] = nums[i]
        
        stack.append(i)
    
    # Remaining have no NGE (-1 already set)
    return result
```

---

### Previous Greater Element

```python
def previous_greater_element(nums):
    """
    Find previous greater element for each position.
    """
    n = len(nums)
    result = [-1] * n
    stack = []  # Decreasing stack
    
    for i in range(n):
        # Pop elements smaller than current
        while stack and nums[stack[-1]] <= nums[i]:
            stack.pop()
        
        # Top is now previous greater (if exists)
        if stack:
            result[i] = nums[stack[-1]]
        
        stack.append(i)
    
    return result
```

---

### Largest Rectangle in Histogram

```python
def largest_rectangle(heights):
    """
    Find largest rectangle area in histogram.
    Classic monotonic stack problem.
    """
    stack = []  # Increasing stack of (index, height)
    max_area = 0
    n = len(heights)
    
    for i in range(n + 1):
        # Sentinel: height 0 at end
        curr_height = heights[i] if i < n else 0
        
        while stack and curr_height < heights[stack[-1]]:
            height = heights[stack.pop()]
            # Width extends from previous stack element to i-1
            width = i if not stack else i - stack[-1] - 1
            max_area = max(max_area, height * width)
        
        stack.append(i)
    
    return max_area
```

---

### Stock Span Problem

```python
def stock_span(prices):
    """
    For each day, count consecutive days with price ≤ current.
    """
    n = len(prices)
    span = [1] * n  # At least 1 day (itself)
    stack = []  # Decreasing prices
    
    for i in range(n):
        # Pop days with price ≤ current
        while stack and prices[stack[-1]] <= prices[i]:
            stack.pop()
        
        # Previous greater determines span start
        if stack:
            span[i] = i - stack[-1]
        else:
            span[i] = i + 1  # All previous days
        
        stack.append(i)
    
    return span
```

---

### Daily Temperatures

```python
def daily_temperatures(temps):
    """
    Days until warmer temperature for each day.
    """
    n = len(temps)
    result = [0] * n
    stack = []  # Decreasing temperatures (indices)
    
    for i in range(n):
        while stack and temps[stack[-1]] < temps[i]:
            prev = stack.pop()
            result[prev] = i - prev  # Days waited
        
        stack.append(i)
    
    # Remaining stay 0 (no warmer day)
    return result
```

<!-- back -->
