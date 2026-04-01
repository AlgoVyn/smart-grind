## Prefix Sum: Framework

What are the complete implementations for prefix sum arrays?

<!-- front -->

---

### 1D Prefix Sum

```python
def build_prefix_sum(arr):
    """
    Build 1D prefix sum array.
    prefix[i] = sum of arr[0:i] (first i elements)
    """
    n = len(arr)
    prefix = [0] * (n + 1)
    
    for i in range(n):
        prefix[i + 1] = prefix[i] + arr[i]
    
    return prefix

def range_sum(prefix, left, right):
    """
    Get sum of arr[left:right+1] using prefix sum.
    Inclusive of both ends.
    """
    return prefix[right + 1] - prefix[left]

# Usage:
arr = [3, 1, 4, 1, 5]
prefix = build_prefix_sum(arr)  # [0, 3, 4, 8, 9, 14]
sum_1_to_3 = range_sum(prefix, 1, 3)  # 4 + 1 + 1 = 6
```

---

### 2D Prefix Sum

```python
def build_prefix_sum_2d(matrix):
    """
    Build 2D prefix sum.
    prefix[i][j] = sum of rectangle (0,0) to (i-1,j-1)
    """
    if not matrix or not matrix[0]:
        return [[]]
    
    rows, cols = len(matrix), len(matrix[0])
    prefix = [[0] * (cols + 1) for _ in range(rows + 1)]
    
    for i in range(rows):
        for j in range(cols):
            prefix[i + 1][j + 1] = (prefix[i][j + 1] + 
                                     prefix[i + 1][j] - 
                                     prefix[i][j] + 
                                     matrix[i][j])
    
    return prefix

def rectangle_sum(prefix, r1, c1, r2, c2):
    """
    Sum of rectangle from (r1,c1) to (r2,c2) inclusive.
    """
    return (prefix[r2 + 1][c2 + 1] - 
            prefix[r1][c2 + 1] - 
            prefix[r2 + 1][c1] + 
            prefix[r1][c1])
```

---

### Prefix Sum with Modulo

```python
def prefix_sum_mod(arr, mod):
    """
    Prefix sum for counting subarrays with sum % mod == 0.
    """
    prefix = [0] * (len(arr) + 1)
    count = {0: 1}  # prefix sum 0 seen once
    result = 0
    
    for i, num in enumerate(arr):
        prefix[i + 1] = (prefix[i] + num) % mod
        
        # Count subarrays ending at i with sum ≡ 0 (mod mod)
        result += count.get(prefix[i + 1], 0)
        count[prefix[i + 1]] = count.get(prefix[i + 1], 0) + 1
    
    return result
```

---

### Differential Array (Reverse Prefix)

```python
def range_add(n, updates):
    """
    Apply range additions efficiently.
    updates: list of (left, right, val) to add val to [l,r].
    """
    diff = [0] * (n + 2)  # Differential array
    
    for left, right, val in updates:
        diff[left] += val
        diff[right + 1] -= val
    
    # Build result from differential
    result = []
    current = 0
    for i in range(n):
        current += diff[i]
        result.append(current)
    
    return result

# Example: range_add(5, [(1,3,2), (2,4,3)])
# Result: [0, 2, 5, 5, 3, 0]
```

---

### Prefix XOR

```python
def prefix_xor(arr):
    """
    Prefix XOR array for subarray XOR queries.
    XOR from l to r = prefix[r+1] ^ prefix[l]
    """
    n = len(arr)
    prefix = [0] * (n + 1)
    
    for i in range(n):
        prefix[i + 1] = prefix[i] ^ arr[i]
    
    return prefix

def range_xor(prefix, left, right):
    """XOR of elements from left to right inclusive."""
    return prefix[right + 1] ^ prefix[left]
```

<!-- back -->
