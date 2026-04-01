## Permutations: Tactics & Techniques

What are the tactical patterns for permutation problems?

<!-- front -->

---

### Tactic 1: Next Permutation Template

Master this pattern - it's widely applicable:

```python
def next_permutation_template(arr):
    """Generic next lexicographic arrangement"""
    n = len(arr)
    
    # 1. Find pivot: rightmost position where arr[i] < arr[i+1]
    i = n - 2
    while i >= 0 and arr[i] >= arr[i+1]:
        i -= 1
    
    if i >= 0:
        # 2. Find successor: smallest element > arr[i] to the right
        j = n - 1
        while arr[j] <= arr[i]:
            j -= 1
        
        # 3. Swap pivot and successor
        arr[i], arr[j] = arr[j], arr[i]
    
    # 4. Reverse suffix (make it minimal)
    left, right = i + 1, n - 1
    while left < right:
        arr[left], arr[right] = arr[right], arr[left]
        left += 1
        right -= 1
```

---

### Tactic 2: Duplicate Handling Strategy

```python
def handle_duplicates(nums):
    """
    For unique permutations with duplicates:
    1. Sort first to group duplicates
    2. Skip duplicate branches in backtracking
    """
    nums.sort()
    
    def backtrack(...):
        for i in range(len(nums)):
            if used[i]:
                continue
            # Key: skip if previous duplicate is unused
            if i > 0 and nums[i] == nums[i-1] and not used[i-1]:
                continue
            # ... proceed with backtrack
```

---

### Tactic 3: Factorial Number System

Use factorial representation for direct permutation access:

```python
def kth_permutation_direct(n, k):
    """O(n^2) direct access to k-th permutation"""
    # k in factorial number system
    factorials = [1]
    for i in range(1, n):
        factorials.append(factorials[-1] * i)
    
    k -= 1  # 0-indexed
    available = list(range(1, n + 1))
    result = []
    
    for i in range(n - 1, -1, -1):
        idx = k // factorials[i]
        k %= factorials[i]
        result.append(available.pop(idx))
    
    return result
```

---

### Tactic 4: Inversion Vector

Alternative representation for permutations:

```python
def to_inversion_vector(perm):
    """
    Inversion vector: count of larger elements to the left.
    Unique representation of permutation.
    """
    n = len(perm)
    inv = [0] * n
    
    for i in range(n):
        count = 0
        for j in range(i):
            if perm[j] > perm[i]:
                count += 1
        inv[perm[i] - 1] = count  # 1-indexed values assumed
    
    return inv

def from_inversion_vector(inv):
    """Reconstruct permutation from inversion vector"""
    n = len(inv)
    # Use BIT or Fenwick tree for O(n log n)
    # Simplified O(n^2) version:
    result = [0] * n
    available = list(range(1, n + 1))
    
    for i in range(n - 1, -1, -1):
        result[i] = available.pop(len(available) - 1 - inv[i])
    
    return result
```

---

### Tactic 5: Group Theory Operations

Leverage cycle structure:

```python
def apply_cycle(perm, cycle):
    """Apply cycle to permutation"""
    if len(cycle) < 2:
        return perm
    
    new_perm = perm[:]
    for i in range(len(cycle)):
        new_perm[cycle[i]] = perm[cycle[(i - 1) % len(cycle)]]
    return new_perm

def permutation_power(perm, k):
    """Compute perm^k (apply k times)"""
    n = len(perm)
    result = list(range(n))  # Identity
    
    # Fast exponentiation of permutation
    base = perm[:]
    while k > 0:
        if k & 1:
            result = [result[base[i]] for i in range(n)]
        base = [base[base[i]] for i in range(n)]
        k >>= 1
    
    return result
```

<!-- back -->
