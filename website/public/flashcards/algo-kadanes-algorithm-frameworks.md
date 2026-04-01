## Kadane's Algorithm: Frameworks

What are the standard implementations for Kadane's algorithm?

<!-- front -->

---

### Basic Kadane Framework

```python
def kadane_basic(arr):
    """
    Standard Kadane's algorithm
    Returns maximum subarray sum
    """
    if not arr:
        return 0
    
    max_so_far = arr[0]
    max_ending_here = arr[0]
    
    for x in arr[1:]:
        # Either start new subarray at x or extend
        max_ending_here = max(x, max_ending_here + x)
        max_so_far = max(max_so_far, max_ending_here)
    
    return max_so_far

# With empty subarray allowed (sum at least 0)
def kadane_with_empty(arr):
    max_so_far = 0
    max_ending_here = 0
    
    for x in arr:
        max_ending_here = max(0, max_ending_here + x)
        max_so_far = max(max_so_far, max_ending_here)
    
    return max_so_far
```

---

### Kadane with Subarray Tracking

```python
def kadane_with_indices(arr):
    """
    Returns max sum and the subarray indices
    """
    if not arr:
        return 0, None, None
    
    max_so_far = arr[0]
    max_ending_here = arr[0]
    
    # Track indices
    start = end = temp_start = 0
    
    for i, x in enumerate(arr[1:], 1):
        if x > max_ending_here + x:
            # Start new subarray
            max_ending_here = x
            temp_start = i
        else:
            # Extend existing
            max_ending_here += x
        
        if max_ending_here > max_so_far:
            max_so_far = max_ending_here
            start = temp_start
            end = i
    
    return max_so_far, start, end

# Get actual subarray
def get_max_subarray(arr):
    max_sum, start, end = kadane_with_indices(arr)
    return arr[start:end+1] if start is not None else []
```

---

### 2D Kadane (Maximum Submatrix)

```python
def kadane_2d(matrix):
    """
    Find maximum sum submatrix
    """
    if not matrix or not matrix[0]:
        return 0
    
    rows, cols = len(matrix), len(matrix[0])
    max_sum = float('-inf')
    
    # Fix left and right columns, apply 1D Kadane on row sums
    for left in range(cols):
        # Row sums between left and current right
        temp = [0] * rows
        
        for right in range(left, cols):
            # Add column 'right' to temp
            for i in range(rows):
                temp[i] += matrix[i][right]
            
            # Apply 1D Kadane on temp
            current_max = kadane_basic(temp)
            max_sum = max(max_sum, current_max)
    
    return max_sum

# Optimized version with tracking
def max_submatrix(matrix):
    rows, cols = len(matrix), len(matrix[0])
    max_sum = float('-inf')
    max_coords = None
    
    for left in range(cols):
        temp = [0] * rows
        for right in range(left, cols):
            for i in range(rows):
                temp[i] += matrix[i][right]
            
            # Get indices from 1D Kadane
            current_max, top, bottom = kadane_with_indices(temp)
            
            if current_max > max_sum:
                max_sum = current_max
                max_coords = (top, left, bottom, right)
    
    return max_sum, max_coords
```

---

### Circular Array Kadane

```python
def kadane_circular(arr):
    """
    Maximum subarray sum for circular array
    (can wrap around from end to beginning)
    """
    if not arr:
        return 0
    
    # Case 1: Non-circular (standard Kadane)
    max_linear = kadane_basic(arr)
    
    # Case 2: Wrap-around subarray
    # = Total sum - minimum subarray sum
    total_sum = sum(arr)
    
    # Invert signs and find max = find min of original
    min_subarray_sum = kadane_basic([-x for x in arr])
    min_subarray_sum = -min_subarray_sum
    
    # Wrap-around sum
    max_wrap = total_sum - min_subarray_sum
    
    # Edge case: all negative
    # min_subarray_sum = total_sum, so max_wrap = 0
    # But we can't take empty subarray in wrap case
    if max_wrap == 0:
        return max_linear
    
    return max(max_linear, max_wrap)
```

---

### K-Concatenation Array

```python
def kadane_k_concatenation(arr, k):
    """
    Array concatenated k times, find max subarray sum
    """
    n = len(arr)
    
    if k == 1:
        return kadane_basic(arr)
    
    # Key insight: optimal subarray either:
    # 1. Entirely within one copy (standard Kadane)
    # 2. Spans across copies (max suffix + (k-2)*sum + max prefix)
    
    max_prefix = 0
    curr = 0
    for x in arr:
        curr += x
        max_prefix = max(max_prefix, curr)
    
    max_suffix = 0
    curr = 0
    for x in reversed(arr):
        curr += x
        max_suffix = max(max_suffix, curr)
    
    total = sum(arr)
    
    # Option 1: Within one copy
    option1 = kadane_basic(arr)
    
    # Option 2: Across multiple copies
    option2 = max_suffix + max(0, total * (k - 2)) + max_prefix
    
    return max(option1, option2)
```

<!-- back -->
