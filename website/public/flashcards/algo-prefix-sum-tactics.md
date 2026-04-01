## Prefix Sum: Tactics & Techniques

What are the tactical patterns for prefix sum problems?

<!-- front -->

---

### Tactic 1: Prefix Sum Hashing

For "subarray sum equals k" type problems:

```python
def count_target_subarrays(arr, target):
    """
    Key insight: if prefix[j] - prefix[i] = target,
    then sum(arr[i:j]) = target.
    """
    prefix_counts = {0: 1}  # Sum 0 seen once (empty)
    prefix = 0
    count = 0
    
    for num in arr:
        prefix += num
        # How many previous prefixes equal prefix - target?
        count += prefix_counts.get(prefix - target, 0)
        prefix_counts[prefix] = prefix_counts.get(prefix, 0) + 1
    
    return count
```

---

### Tactic 2: Differential Array for Range Updates

When you have many range add operations:

```python
def apply_range_updates(n, operations):
    """
    operations: [(start, end, delta), ...]
    """
    diff = [0] * (n + 1)
    
    for start, end, delta in operations:
        diff[start] += delta
        diff[end + 1] -= delta  # Cancel after end
    
    # Prefix sum of diff gives final array
    result = []
    current = 0
    for i in range(n):
        current += diff[i]
        result.append(current)
    
    return result
```

**Use case**: Range additions without O(n) per operation.

---

### Tactic 3: 2D Range Queries

```python
def build_2d_prefix(matrix):
    """Standard 2D prefix sum construction."""
    rows, cols = len(matrix), len(matrix[0])
    prefix = [[0] * (cols + 1) for _ in range(rows + 1)]
    
    for i in range(rows):
        row_sum = 0
        for j in range(cols):
            row_sum += matrix[i][j]
            prefix[i + 1][j + 1] = prefix[i][j + 1] + row_sum
    
    return prefix

def query_2d(prefix, r1, c1, r2, c2):
    """Inclusive query using inclusion-exclusion."""
    return (prefix[r2 + 1][c2 + 1] 
            - prefix[r1][c2 + 1] 
            - prefix[r2 + 1][c1] 
            + prefix[r1][c1])
```

---

### Tactic 4: Modular Arithmetic with Prefix

```python
def subarrays_divisible_by_k(arr, k):
    """
    Count subarrays with sum divisible by k.
    """
    count = {0: 1}
    prefix = 0
    result = 0
    
    for num in arr:
        prefix = (prefix + num) % k
        # Same remainder means difference is divisible by k
        result += count.get(prefix, 0)
        count[prefix] = count.get(prefix, 0) + 1
    
    return result
```

---

### Tactic 5: Sqrt Decomposition for Dynamic Arrays

When array changes frequently:

```python
class SqrtDecomposition:
    """Prefix sum with point updates."""
    
    def __init__(self, arr):
        self.n = len(arr)
        self.block_size = int(self.n ** 0.5) + 1
        self.arr = arr[:]
        self.blocks = [0] * (self.n // self.block_size + 1)
        self._rebuild()
    
    def _rebuild(self):
        for i in range(self.n):
            self.blocks[i // self.block_size] += self.arr[i]
    
    def update(self, idx, delta):
        """Point update in O(1) amortized."""
        self.arr[idx] += delta
        self.blocks[idx // self.block_size] += delta
    
    def query(self, left, right):
        """Range sum in O(√n)."""
        result = 0
        l_block = left // self.block_size
        r_block = right // self.block_size
        
        if l_block == r_block:
            for i in range(left, right + 1):
                result += self.arr[i]
        else:
            # Left partial block
            for i in range(left, (l_block + 1) * self.block_size):
                result += self.arr[i]
            # Middle full blocks
            for b in range(l_block + 1, r_block):
                result += self.blocks[b]
            # Right partial block
            for i in range(r_block * self.block_size, right + 1):
                result += self.arr[i]
        
        return result
```

<!-- back -->
