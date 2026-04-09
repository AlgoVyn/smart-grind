## Stack - Monotonic Stack: Tactics

What are practical tactics for using Monotonic Stack in problem solving?

<!-- front -->

---

### Tactic 1: Circular Array Handling

**Pattern:** Iterate twice or use modulo indexing for circular arrays.

```python
def next_greater_circular(nums: list[int]) -> list[int]:
    """
    Find next greater element in circular array.
    LeetCode 503 - Next Greater Element II
    """
    n = len(nums)
    result = [-1] * n
    stack = []  # Decreasing stack of indices
    
    # Iterate twice to handle circular nature
    for i in range(2 * n - 1, -1, -1):
        actual_i = i % n
        
        # Pop smaller or equal elements
        while stack and nums[stack[-1]] <= nums[actual_i]:
            stack.pop()
        
        # Only store result in first pass (i < n)
        if i < n and stack:
            result[actual_i] = nums[stack[-1]]
        
        stack.append(actual_i)
    
    return result
```

**Use when:** Array is circular (wraps around).

---

### Tactic 2: Distance/Days Calculation

**Pattern:** Store indices to compute distance between elements.

```python
def daily_temperatures(temperatures: list[int]) -> list[int]:
    """
    Days until warmer temperature (left-to-right).
    When we find warmer day, calculate days waited.
    """
    n = len(temperatures)
    result = [0] * n
    stack = []  # Decreasing temperatures
    
    for i in range(n):
        # Warmer day found - process waiting days
        while stack and temperatures[i] > temperatures[stack[-1]]:
            prev_day = stack.pop()
            result[prev_day] = i - prev_day  # Distance calculation
        
        stack.append(i)
    
    # Unprocessed elements stay at 0 (no warmer day)
    return result
```

---

### Tactic 3: Monotonic Stack with Counting (Stock Span)

**Pattern:** Track consecutive smaller elements count.

```python
class StockSpanner:
    """
    LeetCode 901 - Online Stock Span
    Count consecutive days with price <= today's price
    """
    def __init__(self):
        # Stack of (price, span) pairs
        self.stack = []  # Monotonically decreasing by price
    
    def next(self, price: int) -> int:
        span = 1
        
        # Pop all days with price <= current
        # Add their spans to current span
        while self.stack and self.stack[-1][0] <= price:
            span += self.stack.pop()[1]
        
        self.stack.append((price, span))
        return span
```

---

### Tactic 4: Remove Digits for Smallest/Largest Number

**Pattern:** Use monotonic stack to greedily build optimal number.

```python
def remove_kdigits(num: str, k: int) -> str:
    """
    Remove k digits to form smallest number.
    LeetCode 402 - Remove K Digits
    """
    stack = []  # Monotonically increasing
    
    for digit in num:
        # Remove larger digits from stack when possible
        while k > 0 and stack and stack[-1] > digit:
            stack.pop()
            k -= 1
        stack.append(digit)
    
    # Remove remaining k digits from end
    while k > 0:
        stack.pop()
        k -= 1
    
    # Remove leading zeros
    result = ''.join(stack).lstrip('0')
    return result or '0'
```

**Use when:** Need to build smallest/largest number by removing digits.

---

### Tactic 5: Largest Rectangle in Histogram

**Pattern:** Use increasing stack to find left and right boundaries.

```python
def largest_rectangle(heights: list[int]) -> int:
    """
    Largest rectangle area in histogram.
    LeetCode 84 - Largest Rectangle in Histogram
    """
    stack = []  # Increasing stack of indices
    max_area = 0
    n = len(heights)
    
    for i in range(n + 1):
        # Use 0 as sentinel to flush stack at end
        curr_height = heights[i] if i < n else 0
        
        while stack and curr_height < heights[stack[-1]]:
            height = heights[stack.pop()]
            # Width: from previous smaller to current position
            width = i if not stack else i - stack[-1] - 1
            max_area = max(max_area, height * width)
        
        stack.append(i)
    
    return max_area
```

---

### Tactic 6: Handle Duplicates with Care

**Pattern:** Use `<=` for strictly decreasing, `<` for non-decreasing.

```python
# Strictly decreasing (no duplicates in stack)
while stack and nums[stack[-1]] <= nums[i]:
    stack.pop()

# Non-decreasing (allow duplicates)
while stack and nums[stack[-1]] < nums[i]:
    stack.pop()
```

| Comparison | Behavior | Use Case |
|------------|----------|----------|
| `<=` | Strictly decreasing | Unique next greater |
| `<` | Non-decreasing | Allow equal elements |

<!-- back -->
