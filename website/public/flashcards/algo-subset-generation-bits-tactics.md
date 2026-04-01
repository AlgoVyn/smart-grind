## Title: Subset Generation (Bits) - Tactics

What are specific techniques and optimizations for bit-based subset generation?

<!-- front -->

---

### Tactic 1: Bit Iteration Optimization

Instead of checking all n bits, iterate only through set bits:

```python
def subsets_bit_optimized(nums):
    """Optimized: iterate only through set bits."""
    n = len(nums)
    result = []
    
    for mask in range(1 << n):
        subset = []
        bit = mask
        idx = 0
        while bit:
            if bit & 1:
                subset.append(nums[idx])
            bit >>= 1
            idx += 1
        result.append(subset)
    
    return result
```

**Performance:** O(2^n × k) where k = average number of set bits (≈ n/2), vs O(2^n × n) for naive approach.

---

### Tactic 2: Using bit_count() for Size Filtering

```python
def subsets_of_size(nums, k):
    """Generate subsets of exactly size k."""
    n = len(nums)
    result = []
    
    for mask in range(1 << n):
        if mask.bit_count() == k:  # Python 3.8+
            subset = []
            for i in range(n):
                if mask & (1 << i):
                    subset.append(nums[i])
            result.append(subset)
    
    return result
```

---

### Tactic 3: Check if Subset Sum Exists

```python
def has_subset_sum(nums, target):
    """Check if any subset sums to target."""
    n = len(nums)
    
    for mask in range(1 << n):
        current_sum = 0
        for i in range(n):
            if mask & (1 << i):
                current_sum += nums[i]
        
        if current_sum == target:
            return True
    
    return False
```

---

### Tactic 4: Maximum XOR Subset

```python
def max_subset_xor(nums):
    """Find maximum XOR value of any subset."""
    n = len(nums)
    max_xor = 0
    
    for mask in range(1 << n):
        current_xor = 0
        for i in range(n):
            if mask & (1 << i):
                current_xor ^= nums[i]
        max_xor = max(max_xor, current_xor)
    
    return max_xor
```

---

### Tactic 5: Comparison with Backtracking

| Aspect | Bit Manipulation | Recursive Backtracking |
|--------|------------------|------------------------|
| **Code Complexity** | Simple, iterative | More complex, recursive |
| **Auxiliary Space** | O(1) | O(n) stack |
| **Early Pruning** | Cannot prune | Can prune early |
| **Flexibility** | Fixed pattern | More adaptable |
| **Best For** | Small n, all subsets | Large n, sparse valid subsets |

**Choice:** Use bit manipulation for small, dense cases; backtracking for large, sparse cases.

<!-- back -->
