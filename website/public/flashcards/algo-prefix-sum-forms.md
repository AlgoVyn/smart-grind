## Prefix Sum: Forms & Variations

What are the different forms and variations of prefix sum problems?

<!-- front -->

---

### Form 1: Subarray Sum Equals K

```python
def subarray_sum_equals_k(arr, k):
    """
    Count subarrays with sum exactly k.
    Uses prefix sum + hashmap.
    """
    count = 0
    prefix_sum = 0
    seen = {0: 1}  # Empty subarray has sum 0
    
    for num in arr:
        prefix_sum += num
        
        # If prefix_sum - k was seen, we found subarrays
        count += seen.get(prefix_sum - k, 0)
        
        seen[prefix_sum] = seen.get(prefix_sum, 0) + 1
    
    return count
```

---

### Form 2: Maximum Subarray Sum (Kadane's)

```python
def max_subarray_sum(arr):
    """
    Find maximum sum of any contiguous subarray.
    """
    max_sum = float('-inf')
    current_sum = 0
    min_prefix = 0  # Minimum prefix sum seen
    
    for num in arr:
        current_sum += num
        max_sum = max(max_sum, current_sum - min_prefix)
        min_prefix = min(min_prefix, current_sum)
    
    return max_sum

# Or classic Kadane's:
def kadane(arr):
    max_ending_here = max_so_far = arr[0]
    for x in arr[1:]:
        max_ending_here = max(x, max_ending_here + x)
        max_so_far = max(max_so_far, max_ending_here)
    return max_so_far
```

---

### Form 3: Equilibrium Index

```python
def find_equilibrium(arr):
    """
    Find index where sum of left equals sum of right.
    """
    total = sum(arr)
    left_sum = 0
    
    for i, num in enumerate(arr):
        # Right sum = total - left_sum - num
        if left_sum == total - left_sum - num:
            return i
        left_sum += num
    
    return -1
```

---

### Form 4: Product Array (Without Division)

```python
def product_except_self(nums):
    """
    Return array where each element is product of all others.
    Uses prefix and suffix products.
    """
    n = len(nums)
    result = [1] * n
    
    # Prefix products
    for i in range(1, n):
        result[i] = result[i - 1] * nums[i - 1]
    
    # Suffix products combined with prefix
    suffix = 1
    for i in range(n - 1, -1, -1):
        result[i] *= suffix
        suffix *= nums[i]
    
    return result
```

---

### Form 5: Range Frequency Queries

```python
def build_frequency_prefix(arr, max_val):
    """
    Build prefix sum per value for O(1) range frequency queries.
    """
    n = len(arr)
    # freq[i][v] = count of value v in arr[0:i]
    freq = [[0] * (max_val + 1) for _ in range(n + 1)]
    
    for i in range(n):
        for v in range(max_val + 1):
            freq[i + 1][v] = freq[i][v]
        freq[i + 1][arr[i]] += 1
    
    return freq

def query_frequency(freq, left, right, value):
    """Count of value in range [left, right]."""
    return freq[right + 1][value] - freq[left][value]
```

<!-- back -->
