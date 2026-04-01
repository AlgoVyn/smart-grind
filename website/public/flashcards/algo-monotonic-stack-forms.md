## Monotonic Stack: Forms & Variations

What are the different forms and variations of monotonic stack problems?

<!-- front -->

---

### Form 1: Next Greater Element II (Circular)

```python
def next_greater_circular(nums):
    """
    Array is circular: last element wraps to first.
    """
    n = len(nums)
    result = [-1] * n
    stack = []
    
    # Iterate twice to handle circularity
    for i in range(2 * n):
        idx = i % n
        
        while stack and nums[stack[-1]] < nums[idx]:
            result[stack.pop()] = nums[idx]
        
        # Only push in first pass
        if i < n:
            stack.append(idx)
    
    return result
```

---

### Form 2: Sum of Subarray Minimums

```python
def sum_subarray_mins(arr):
    """
    Sum of minimums of all subarrays.
    Uses monotonic stack to find contribution of each element.
    """
    MOD = 10**9 + 7
    n = len(arr)
    
    # left[i]: distance to previous less element
    # right[i]: distance to next less or equal element
    left = [0] * n
    right = [0] * n
    
    # Previous less
    stack = []
    for i in range(n):
        while stack and arr[stack[-1]] > arr[i]:
            stack.pop()
        left[i] = i - stack[-1] if stack else i + 1
        stack.append(i)
    
    # Next less or equal (use <= to avoid double counting)
    stack = []
    for i in range(n - 1, -1, -1):
        while stack and arr[stack[-1]] >= arr[i]:
            stack.pop()
        right[i] = stack[-1] - i if stack else n - i
        stack.append(i)
    
    # Each element is min of left[i] * right[i] subarrays
    result = 0
    for i in range(n):
        result = (result + arr[i] * left[i] * right[i]) % MOD
    
    return result
```

---

### Form 3: Maximum Width Ramp

```python
def max_width_ramp(nums):
    """
    Maximum j - i where i < j and nums[i] <= nums[j].
    """
    n = len(nums)
    
    # Build decreasing stack of indices
    stack = []
    for i in range(n):
        if not stack or nums[stack[-1]] > nums[i]:
            stack.append(i)
    
    # Check from right for maximum width
    max_width = 0
    for j in range(n - 1, -1, -1):
        while stack and nums[stack[-1]] <= nums[j]:
            max_width = max(max_width, j - stack.pop())
    
    return max_width
```

---

### Form 4: Online Stock Span (Class-based)

```python
class StockSpanner:
    """Online version: process prices one by one"""
    
    def __init__(self):
        self.stack = []  # (price, span) pairs
    
    def next(self, price):
        span = 1
        
        # Pop and accumulate spans of smaller/equal prices
        while self.stack and self.stack[-1][0] <= price:
            span += self.stack.pop()[1]
        
        self.stack.append((price, span))
        return span
```

---

### Form 5: Remove K Digits (Greedy with Stack)

```python
def remove_k_digits(num, k):
    """
    Remove k digits to form smallest number.
    Monotonic increasing stack with removal limit.
    """
    stack = []
    
    for digit in num:
        # Remove larger previous digits while we can
        while k > 0 and stack and stack[-1] > digit:
            stack.pop()
            k -= 1
        stack.append(digit)
    
    # Remove from end if k remains
    while k > 0:
        stack.pop()
        k -= 1
    
    # Remove leading zeros
    result = ''.join(stack).lstrip('0')
    return result or '0'
```

<!-- back -->
