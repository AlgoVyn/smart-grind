## Stack - Monotonic Stack: Forms

What are the different variations of Monotonic Stack problems?

<!-- front -->

---

### Form 1: Next Greater Element (Right)

Find the next greater element for each element to the right.

```python
def next_greater_element(nums: list[int]) -> list[int]:
    """
    Classic NGE: Find first greater element to the right.
    LeetCode 496 - Next Greater Element I
    """
    n = len(nums)
    result = [-1] * n
    stack = []  # Decreasing: indices with values high to low
    
    for i in range(n - 1, -1, -1):
        while stack and nums[stack[-1]] <= nums[i]:
            stack.pop()
        if stack:
            result[i] = nums[stack[-1]]
        stack.append(i)
    
    return result
```

---

### Form 2: Daily Temperatures (Distance)

Find number of days until a warmer temperature.

```python
def daily_temperatures(temperatures: list[int]) -> list[int]:
    """
    Days until warmer temperature.
    LeetCode 739 - Daily Temperatures
    """
    n = len(temperatures)
    result = [0] * n
    stack = []  # Decreasing: waiting for warmer day
    
    for i in range(n):
        while stack and temperatures[i] > temperatures[stack[-1]]:
            prev_day = stack.pop()
            result[prev_day] = i - prev_day  # Distance calculation
        stack.append(i)
    
    # Unprocessed remain at 0 (no warmer day found)
    return result
```

---

### Form 3: Previous Greater Element

Find the previous greater element to the left.

```python
def previous_greater_element(nums: list[int]) -> list[int]:
    """
    Find first greater element to the left.
    Same as NGE but left-to-right iteration.
    """
    n = len(nums)
    result = [-1] * n
    stack = []  # Decreasing
    
    for i in range(n):
        while stack and nums[stack[-1]] <= nums[i]:
            stack.pop()
        if stack:
            result[i] = nums[stack[-1]]
        stack.append(i)
    
    return result
```

---

### Form 4: Next Smaller Element

Find the next smaller element to the right.

```python
def next_smaller_element(nums: list[int]) -> list[int]:
    """
    Find first smaller element to the right.
    Use INCREASING stack (opposite of NGE).
    """
    n = len(nums)
    result = [-1] * n
    stack = []  # Increasing: indices with values low to high
    
    for i in range(n - 1, -1, -1):
        while stack and nums[stack[-1]] >= nums[i]:  # Note: >=
            stack.pop()
        if stack:
            result[i] = nums[stack[-1]]
        stack.append(i)
    
    return result
```

---

### Form 5: Stock Span (Counting Variant)

Count consecutive days with price less than or equal to current.

```python
class StockSpanner:
    """
    LeetCode 901 - Online Stock Span
    Monotonic stack with count accumulation.
    """
    def __init__(self):
        self.stack = []  # (price, span) pairs, decreasing by price
    
    def next(self, price: int) -> int:
        span = 1
        
        # Accumulate spans of smaller/equal prices
        while self.stack and self.stack[-1][0] <= price:
            span += self.stack.pop()[1]
        
        self.stack.append((price, span))
        return span
```

---

### Form Comparison

| Form | Direction | Stack Order | Pop Condition | Output | Example |
|------|-----------|-------------|---------------|--------|---------|
| Next Greater (right) | R-to-L | Decreasing | `<=` | Value or -1 | LC 496 |
| Daily Temperatures | L-to-R | Decreasing | `>` | Days or 0 | LC 739 |
| Previous Greater | L-to-R | Decreasing | `<=` | Value or -1 | Stock Span |
| Next Smaller | R-to-L | Increasing | `>=` | Value or -1 | LC 901 |
| Stock Span | L-to-R | Decreasing | `<=` | Count | LC 901 |
| Remove K Digits | L-to-R | Increasing | `>` | String | LC 402 |
| Largest Rectangle | L-to-R | Increasing | `>` | Area | LC 84 |

---

### Form Selection Guide

```
Problem asks for:
├── Next greater to the RIGHT?
│   └── Form 1: Right-to-left, decreasing stack
│
├── Next greater to the LEFT (previous)?
│   └── Form 3: Left-to-right, decreasing stack
│
├── DAYS until greater/smaller?
│   └── Form 2: Left-to-right, store distance
│
├── Next SMALLER (instead of greater)?
│   └── Form 4: Reverse comparison, increasing stack
│
├── COUNT of consecutive smaller?
│   └── Form 5: Accumulate spans in stack
│
└── Build optimal number by removing?
    └── Form 6: Greedy with monotonic stack
```

<!-- back -->
